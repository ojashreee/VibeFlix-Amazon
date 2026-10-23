// VibeSearch AI backend. Keeps your OpenAI API key on the server, never in the browser.
// Run:  npm run vibesearch      (needs OPENAI_API_KEY in a .env file)
import http from 'node:http';
import OpenAI from 'openai';

const PORT = Number(process.env.VIBESEARCH_PORT) || 8788;
const MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';
const KEY = process.env.OPENAI_API_KEY;
const client = KEY ? new OpenAI({ apiKey: process.env['OPENAI_API_KEY'] }) : null;

// Only the local dev site (localhost or a home-network address) may call this.
const ORIGIN_OK = /^https?:\/\/(localhost|127\.0\.0\.1|192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+|172\.(1[6-9]|2\d|3[01])\.\d+\.\d+)(:\d+)?$/;

const hits = new Map(); // ip -> [timestamps] : 30 requests per minute
const limited = (ip) => {
  const now = Date.now();
  const list = (hits.get(ip) || []).filter((t) => now - t < 60000);
  list.push(now); hits.set(ip, list);
  return list.length > 30;
};

const buildSystem = (catalog, profile) => `You are VibeSearch, the movie-finding assistant inside VibeFlix.
Recommend ONLY titles from the catalog below, using their exact "id" values. Never invent titles.
The viewer is ${profile?.name || 'a viewer'}.${profile?.isKids ? ' This is a KIDS profile: only suggest age-appropriate titles (never R, TV-MA, or similar).' : ''}
Understand mood, genre, runtime ("under 2 hours"), actors and "more like X" requests. Treat follow-ups ("shorter", "less violent", "something funnier") as refinements of the earlier request.
Respond with JSON ONLY, no markdown, in exactly this shape:
{"reply":"one or two friendly sentences explaining the picks","ids":["id1","id2"],"followUps":["short suggestion","short suggestion","short suggestion"]}
Rules: ids has 1 to 8 entries ordered best first; if nothing fits, ids is [] and reply says so honestly. followUps are 3 short refinements (max 6 words each) that make sense for these results.

CATALOG:
${JSON.stringify(catalog)}`;

function parseModelJson(text) {
  const a = text.indexOf('{'); const b = text.lastIndexOf('}');
  if (a < 0 || b <= a) throw new Error('no json');
  return JSON.parse(text.slice(a, b + 1));
}

async function handleSearch(body) {
  const { messages, catalog, profile } = body;
  if (!Array.isArray(messages) || !messages.length || !Array.isArray(catalog) || !catalog.length) return [400, { error: 'bad_request' }];
  if (!KEY || !client) return [503, { error: 'no_key' }];

  const history = messages.slice(-10).map((m) => ({
    role: m.role === 'assistant' ? 'assistant' : 'user',
    content: String(m.content || '').slice(0, 600),
  }));
  while (history.length && history[0].role !== 'user') history.shift(); // must start with user

  const completion = await client.chat.completions.create({
    model: MODEL,
    max_tokens: 700,
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: buildSystem(catalog.slice(0, 200), profile) },
      ...history,
    ],
  });

  const text = completion.choices?.[0]?.message?.content || '';
  const out = parseModelJson(text);
  const valid = new Set(catalog.map((c) => String(c.id)));
  return [200, {
    reply: String(out.reply || '').slice(0, 400),
    ids: (Array.isArray(out.ids) ? out.ids : []).map(String).filter((id) => valid.has(id)).slice(0, 8),
    followUps: (Array.isArray(out.followUps) ? out.followUps : []).map((s) => String(s).slice(0, 60)).slice(0, 4),
  }];
}

const server = http.createServer(async (req, res) => {
  const origin = req.headers.origin;
  if (origin && ORIGIN_OK.test(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Headers', 'content-type');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  }
  const send = (code, obj) => { res.writeHead(code, { 'content-type': 'application/json' }); res.end(JSON.stringify(obj)); };
  if (req.method === 'OPTIONS') { res.writeHead(204); return res.end(); }
  if (req.method === 'GET' && req.url === '/api/vibesearch/health') return send(200, { ok: true, ai: !!KEY });
  if (req.method !== 'POST' || req.url !== '/api/vibesearch') return send(404, { error: 'not_found' });
  if (origin && !ORIGIN_OK.test(origin)) return send(403, { error: 'forbidden' });
  if (limited(req.socket.remoteAddress)) return send(429, { error: 'slow_down' });

  let raw = '';
  for await (const chunk of req) { raw += chunk; if (raw.length > 300000) return send(413, { error: 'too_large' }); }
  try {
    const [code, payload] = await handleSearch(JSON.parse(raw));
    send(code, payload);
  } catch (e) {
    console.error('vibesearch error:', e.message);
    send(500, { error: 'failed' });
  }
});
server.listen(PORT, () => {
  console.log(`VibeSearch AI backend on http://localhost:${PORT}  (model: ${MODEL})`);
  if (!KEY) console.log('  ! OPENAI_API_KEY is missing. Add it to .env. VibeSearch will use basic keyword search until then.');
});