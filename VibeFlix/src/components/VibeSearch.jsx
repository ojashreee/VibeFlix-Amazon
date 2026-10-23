import React, { useEffect, useRef, useState } from 'react';
import { Compass, Send, Play, Plus, Check, Info, Users, Sparkles, RotateCcw, WifiOff } from 'lucide-react';
import { buildCatalog, localSearch, isMature } from '../lib/vibeSearchEngine';

const API_URL =
  import.meta.env.VITE_VIBESEARCH_URL || '/api/vibesearch';

const STARTERS = [
  'Something tense for tonight, under 2 hours',
  'Mind-bending sci-fi with a twist',
  'A feel-good watch to share with friends',
  'Fast action, no slow parts',
];
const LOCAL_FOLLOWUPS = ['Something shorter', 'More action', 'Lighter and funnier', 'Surprise me'];

const storageKey = (p) => `vibeflix.vibesearch.${p?.id || 'guest'}`;
const loadThread = (p) => { try { return JSON.parse(sessionStorage.getItem(storageKey(p))) || []; } catch { return []; } };

export function VibeSearch({
  contentPool, currentProfile, myList = [], seedQuery = '', onSeedUsed,
  onPlay, onOpenDetails, onToggleMyList, onWatchTogether,
}) {
  // thread entries: { role:'user', text } | { role:'assistant', text, ids, followUps, source }
  const [thread, setThread] = useState(() => loadThread(currentProfile));
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiDown, setAiDown] = useState(false);
  const endRef = useRef(null);
  const inputRef = useRef(null);
  const isKids = !!currentProfile?.isKids;

  const byId = (id) => contentPool.find((m) => String(m.id) === String(id));

  useEffect(() => {
    try { sessionStorage.setItem(storageKey(currentProfile), JSON.stringify(thread.slice(-30))); } catch { /* ignore */ }
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [thread, loading, currentProfile]);

  const ask = async (raw) => {
    const text = raw.trim();
    if (!text || loading) return;
    const next = [...thread, { role: 'user', text }];
    setThread(next);
    setInput('');
    setLoading(true);

    const messages = next.map((t) => ({ role: t.role, content: t.text }));
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 28000);
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          messages,
          catalog: buildCatalog(isKids ? contentPool.filter((m) => !isMature(m)) : contentPool),
          profile: { name: currentProfile?.name, isKids },
        }),
        signal: ctrl.signal,
      });
      clearTimeout(timer);
      if (!res.ok) throw new Error(`status ${res.status}`);
      const data = await res.json();
      let ids = data.ids || [];
      if (isKids) ids = ids.filter((id) => { const m = byId(id); return m && !isMature(m); });
      ids = ids.filter((id) => byId(id));
      setAiDown(false);
      setThread((t) => [...t, {
        role: 'assistant',
        text: data.reply || (ids.length ? 'Here is what I found.' : 'I could not find a match for that.'),
        ids,
        followUps: data.followUps?.length ? data.followUps : LOCAL_FOLLOWUPS,
        source: 'ai',
      }]);
    } catch {
      // AI backend missing or failing: fall back to local keyword search.
      // For a follow-up, combine it with the earlier request so "shorter" still has context.
      const lastUser = [...thread].reverse().find((t) => t.role === 'user')?.text || '';
      const query = thread.length && text.split(/\s+/).length <= 4 ? `${lastUser} ${text}` : text;
      const found = localSearch(query, contentPool, { isKids });
      setAiDown(true);
      setThread((t) => [...t, {
        role: 'assistant',
        text: found.length
          ? 'Here are the best keyword matches. Connect the AI backend for smarter, conversational picks.'
          : 'No keyword matches. Try a genre, an actor or a mood.',
        ids: found.map((m) => m.id),
        followUps: LOCAL_FOLLOWUPS,
        source: 'local',
      }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  // A query handed over from the navbar search box.
  useEffect(() => {
    if (seedQuery) { ask(seedQuery); onSeedUsed?.(); }
  }, [seedQuery]); // eslint-disable-line react-hooks/exhaustive-deps

  const clear = () => { setThread([]); try { sessionStorage.removeItem(storageKey(currentProfile)); } catch { /* ignore */ } };
  const lastAssistantIdx = thread.map((t) => t.role).lastIndexOf('assistant');

  const smallBtn = (bg, border, color) => ({
    width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
    backgroundColor: bg, border, color, cursor: 'pointer', flexShrink: 0,
  });

  return (
    <div style={{ paddingTop: '6rem', paddingLeft: 'max(1.5rem, 4vw)', paddingRight: 'max(1.5rem, 4vw)', paddingBottom: '3rem', maxWidth: 1200, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.5rem' }}>
        <div style={{ width: 46, height: 46, borderRadius: 14, background: 'linear-gradient(135deg, #9333ea 0%, #c084fc 50%, #f43f5e 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 25px rgba(168,85,247,0.6)' }}>
          <Compass size={24} color="#fff" />
        </div>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#fff' }}>VibeSearch</h1>
          <p style={{ fontSize: '0.85rem', color: '#c4b5fd' }}>Describe a mood, a genre or a vibe, then keep refining it in plain words.</p>
        </div>
        {thread.length > 0 && (
          <button onClick={clear} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 0.9rem', borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(168,85,247,0.3)', color: '#e9d5ff', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' }}>
            <RotateCcw size={13} /> New search
          </button>
        )}
      </div>

      {aiDown && (
        <div role="status" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.7rem 1rem', borderRadius: 12, marginBottom: '1rem', backgroundColor: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.35)', color: '#fde68a', fontSize: '0.8rem' }}>
          <WifiOff size={16} /> AI backend not reachable, so VibeSearch is using basic keyword search. Start it with <code style={{ color: '#fff' }}>npm run vibesearch</code>.
        </div>
      )}

      {/* Empty state */}
      {thread.length === 0 && !loading && (
        <div style={{ textAlign: 'center', padding: '3rem 1rem 2rem' }}>
          <Sparkles size={40} color="#c084fc" style={{ opacity: 0.8, marginBottom: '0.8rem' }} />
          <h2 style={{ fontSize: '1.3rem', color: '#fff', marginBottom: '0.4rem' }}>What are you in the mood for?</h2>
          <p style={{ fontSize: '0.88rem', color: '#8b7ca6', marginBottom: '1.5rem' }}>Try one of these, or type your own below.</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', justifyContent: 'center', maxWidth: 760, margin: '0 auto' }}>
            {STARTERS.map((s) => (
              <button key={s} onClick={() => ask(s)} style={{ padding: '0.6rem 1.1rem', borderRadius: 999, fontSize: '0.84rem', color: '#e9d5ff', cursor: 'pointer', backgroundColor: 'rgba(26,12,54,0.65)', border: '1px solid rgba(168,85,247,0.3)' }}>{s}</button>
            ))}
          </div>
        </div>
      )}

      {/* Conversation */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', minHeight: thread.length ? '40vh' : 0 }}>
        {thread.map((t, i) => t.role === 'user' ? (
          <div key={i} style={{ alignSelf: 'flex-end', maxWidth: '75%', padding: '0.65rem 1rem', borderRadius: '16px 16px 4px 16px', background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)', color: '#fff', fontSize: '0.92rem', wordBreak: 'break-word' }}>
            {t.text}
          </div>
        ) : (
          <div key={i} style={{ alignSelf: 'stretch' }}>
            <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start', marginBottom: '0.9rem' }}>
              <div style={{ width: 30, height: 30, borderRadius: 10, background: 'linear-gradient(135deg, #9333ea, #f43f5e)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Compass size={16} color="#fff" /></div>
              <p aria-live="polite" style={{ fontSize: '0.92rem', color: '#e2e8f0', lineHeight: 1.5, paddingTop: 4 }}>{t.text}</p>
            </div>

            {t.ids.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '1.1rem', marginLeft: 0 }}>
                {t.ids.map((id) => {
                  const m = byId(id);
                  if (!m) return null;
                  const saved = myList.some((x) => x.id === m.id);
                  return (
                    <div key={id} style={{ borderRadius: 16, overflow: 'hidden', backgroundColor: 'rgba(26,12,54,0.85)', border: '1px solid rgba(168,85,247,0.25)' }}>
                      <div onClick={() => onOpenDetails(m)} style={{ position: 'relative', height: 125, cursor: 'pointer' }}>
                        <img src={m.image || m.backdrop} alt={m.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(9,4,21,0.9) 0%, transparent 60%)' }} />
                      </div>
                      <div style={{ padding: '0.8rem' }}>
                        <h4 onClick={() => onOpenDetails(m)} style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff', marginBottom: '0.2rem', cursor: 'pointer' }}>{m.title}</h4>
                        <p style={{ fontSize: '0.72rem', color: '#a78bfa', marginBottom: '0.55rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {[m.duration, ...(m.genres || []).slice(0, 2)].filter(Boolean).join(' • ')}
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '0.74rem', color: '#34d399', fontWeight: 700 }}>{m.rating || ''}</span>
                          <div style={{ display: 'flex', gap: '0.35rem' }}>
                            <button onClick={() => onPlay(m)} title="Play" aria-label={`Play ${m.title}`} style={smallBtn('#a855f7', 'none', '#fff')}><Play size={13} fill="#fff" /></button>
                            <button onClick={() => onToggleMyList(m)} title={saved ? 'In watchlist' : 'Add to My List'} aria-label="Toggle My List" style={smallBtn(saved ? 'rgba(168,85,247,0.3)' : 'rgba(255,255,255,0.1)', saved ? '1px solid #c084fc' : 'none', saved ? '#c084fc' : '#c4b5fd')}>{saved ? <Check size={13} /> : <Plus size={13} />}</button>
                            <button onClick={() => onOpenDetails(m)} title="More info" aria-label="More info" style={smallBtn('rgba(255,255,255,0.1)', 'none', '#c4b5fd')}><Info size={13} /></button>
                            {onWatchTogether && <button onClick={() => onWatchTogether(m)} title="Watch together" aria-label="Watch together" style={smallBtn('rgba(232,121,249,0.15)', '1px solid rgba(232,121,249,0.5)', '#e879f9')}><Users size={13} /></button>}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {i === lastAssistantIdx && !loading && t.followUps?.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1rem' }}>
                <span style={{ fontSize: '0.75rem', color: '#8b7ca6', alignSelf: 'center', marginRight: 4 }}>Refine:</span>
                {t.followUps.map((f) => (
                  <button key={f} onClick={() => ask(f)} style={{ padding: '0.45rem 0.95rem', borderRadius: 999, fontSize: '0.8rem', color: '#e9d5ff', cursor: 'pointer', backgroundColor: 'rgba(168,85,247,0.15)', border: '1px solid rgba(192,132,252,0.4)' }}>{f}</button>
                ))}
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div role="status" aria-label="VibeSearch is thinking" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#c4b5fd', fontSize: '0.85rem' }}>
            {[0, 1, 2].map((d) => <span key={d} style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#c084fc', animation: `livePulse 1.1s ${d * 0.15}s infinite` }} />)}
            Finding your vibe…
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input bar */}
      <form
        onSubmit={(e) => { e.preventDefault(); ask(input); }}
        style={{ position: 'sticky', bottom: '1rem', marginTop: '1.5rem', display: 'flex', gap: '0.65rem', padding: '0.6rem', borderRadius: 18, backgroundColor: 'rgba(14,7,28,0.92)', backdropFilter: 'blur(16px)', border: '1px solid rgba(192,132,252,0.45)', boxShadow: '0 0 25px rgba(147,51,234,0.3)' }}
      >
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          maxLength={300}
          aria-label="Describe what you want to watch"
          placeholder={thread.length ? 'Ask a follow-up: "shorter", "less violent", "more like the first one"…' : 'Describe what you want to watch…'}
          style={{ flex: 1, padding: '0.75rem 1rem', borderRadius: 12, backgroundColor: 'transparent', color: '#fff', fontSize: '0.95rem' }}
        />
        <button type="submit" disabled={!input.trim() || loading} aria-label="Search" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0 1.3rem', borderRadius: 12, background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)', color: '#fff', fontWeight: 700, fontSize: '0.88rem', opacity: input.trim() && !loading ? 1 : 0.5, cursor: input.trim() && !loading ? 'pointer' : 'not-allowed', boxShadow: '0 0 15px rgba(168,85,247,0.45)' }}>
          <Send size={16} /> Search
        </button>
      </form>
    </div>
  );
}