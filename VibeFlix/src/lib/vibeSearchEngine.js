// Local "smart" search for VibeSearch. Works with no AI and no network.
// It also acts as the fallback whenever the AI backend is unavailable.

const SYNONYMS = {
  scary: ['horror', 'thriller', 'dark', 'suspense'],
  creepy: ['horror', 'thriller', 'dark'],
  funny: ['comedy', 'humor', 'laugh'],
  laugh: ['comedy', 'funny'],
  space: ['sci-fi', 'scifi', 'galaxy', 'astronaut'],
  future: ['sci-fi', 'scifi', 'cyberpunk', 'dystopia'],
  robots: ['sci-fi', 'ai', 'android', 'cyberpunk'],
  fast: ['action', 'chase', 'adrenaline'],
  fight: ['action', 'martial'],
  spy: ['espionage', 'action', 'thriller'],
  heist: ['crime', 'thriller', 'action'],
  love: ['romance', 'romantic'],
  tense: ['thriller', 'suspense', 'mystery'],
  twist: ['mystery', 'mind-bending', 'psychological'],
  mindbending: ['mind-bending', 'psychological', 'sci-fi'],
  chill: ['feel-good', 'light', 'comedy', 'drama'],
  cozy: ['feel-good', 'light', 'comedy'],
  family: ['family', 'animation', 'adventure', 'feel-good'],
  documentary: ['documentary', 'true', 'real'],
};
const STOP = new Set(['a', 'an', 'the', 'and', 'or', 'for', 'with', 'me', 'to', 'of', 'in', 'on', 'i', 'want', 'something', 'show', 'give', 'find', 'some', 'movie', 'movies', 'film', 'films', 'series', 'watch', 'tonight', 'that', 'is', 'are', 'not', 'too', 'under', 'less', 'than', 'hours', 'hour', 'minutes', 'min', 'like']);

const MATURE = /^(R|NC-17|TV-MA|18\+?|16\+?|A)$/i;
export const isMature = (item) => MATURE.test(String(item.maturity || '').trim());

// "2h 15m", "1h", "95m", 95  ->  minutes (or null)
export function parseMinutes(d) {
  if (typeof d === 'number') return d;
  if (!d) return null;
  const h = /(\d+)\s*h/i.exec(d); const m = /(\d+)\s*m/i.exec(d);
  if (!h && !m) return null;
  return (h ? +h[1] * 60 : 0) + (m ? +m[1] : 0);
}

// Pull a runtime limit out of phrases like "under 2 hours" or "less than 90 minutes".
export function extractMaxMinutes(query) {
  const q = query.toLowerCase();
  const hr = /(?:under|less than|below|within|max(?:imum)?)\s*(\d+(?:\.\d+)?)\s*(?:h|hr|hrs|hours?)/.exec(q);
  if (hr) return Math.round(parseFloat(hr[1]) * 60);
  const mn = /(?:under|less than|below|within|max(?:imum)?)\s*(\d+)\s*(?:m|min|mins|minutes?)/.exec(q);
  if (mn) return +mn[1];
  if (/\b(short|quick)\b/.test(q)) return 100;
  return null;
}

const tokens = (s) =>
  s.toLowerCase().replace(/[^a-z0-9\s-]/g, ' ').split(/\s+/).filter((t) => t && !STOP.has(t) && t.length > 1);

export function localSearch(query, pool, { isKids = false, limit = 12 } = {}) {
  const maxMin = extractMaxMinutes(query);
  const words = tokens(query);
  const expanded = [];
  words.forEach((w) => (SYNONYMS[w] || []).forEach((s) => expanded.push(s)));

  const scored = pool
    .filter((it) => it.title && !(isKids && isMature(it)))
    .map((it) => {
      const title = it.title.toLowerCase();
      const genres = (it.genres || []).join(' ').toLowerCase();
      const cast = (it.cast || []).join(' ').toLowerCase();
      const text = `${it.synopsis || ''} ${it.subtitle || ''}`.toLowerCase();
      let score = 0;
      const hit = (w, weight) => {
        if (title.includes(w)) score += 6 * weight;
        if (genres.includes(w)) score += 4 * weight;
        if (cast.includes(w)) score += 3 * weight;
        if (text.includes(w)) score += 1.5 * weight;
      };
      words.forEach((w) => hit(w, 1));
      expanded.forEach((w) => hit(w, 0.6));
      // Runtime only adjusts titles that already match the words (or all titles if there are no words).
      if (words.length > 0 && score === 0) return { it, score: 0 };
      const mins = parseMinutes(it.duration);
      if (maxMin && mins) { if (mins <= maxMin) score += 3; else score -= 8; }
      if (words.length === 0 && maxMin && mins && mins <= maxMin) score = Math.max(score, 1);
      return { it, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map((x) => x.it);
}

// Compact version of the catalog that is sent to the AI backend.
export const buildCatalog = (pool) =>
  pool.filter((m) => m.title).map((m) => ({
    id: m.id,
    title: m.title,
    genres: m.genres || [],
    year: m.year,
    duration: m.duration,
    rating: m.rating,
    maturity: m.maturity,
    cast: (m.cast || []).slice(0, 4),
    synopsis: (m.synopsis || m.subtitle || '').slice(0, 160),
  }));