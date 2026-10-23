// VibeFlix social server: friends, DMs, watch dates and synced watch rooms.
// Run with:  npm run server   (listens on ws://0.0.0.0:8787)
import { WebSocketServer } from 'ws';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT) || 8787;
const DATA_FILE = path.join(__dirname, 'data.json');
const SOON_MS = 10 * 60 * 1000; // rooms open 10 minutes before a watch date

/* ---------------------------- persistence ---------------------------- */
let db = { users: {}, dms: {}, events: {} };
try { db = { ...db, ...JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')) }; } catch { /* first run */ }
let saveTimer = null;
const persist = () => {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    try { fs.writeFileSync(DATA_FILE, JSON.stringify(db)); } catch (e) { console.error('save failed:', e.message); }
  }, 400);
};

/* ------------------------------ helpers ------------------------------ */
const online = new Map(); // userId -> Set<ws>
const rooms = new Map();  // roomId -> room
const rid = (p) => `${p}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const genCode = () => {
  let c;
  do { c = Array.from({ length: 6 }, () => CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)]).join(''); }
  while (Object.values(db.users).some((u) => u.code === c));
  return c;
};
const byCode = (code) => Object.values(db.users).find((u) => u.code === code);
const isOnline = (id) => (online.get(id)?.size || 0) > 0;
const send = (ws, msg) => { if (ws.readyState === 1) ws.send(JSON.stringify(msg)); };
const sendTo = (id, msg) => online.get(id)?.forEach((ws) => send(ws, msg));
const notice = (id, text, extra = {}) => sendTo(id, { t: 'notice', text, ...extra });
const fail = (ws, text) => send(ws, { t: 'notice', kind: 'error', text });

const pub = (id) => {
  const u = db.users[id];
  return u ? { id: u.id, name: u.name, avatar: u.avatar, color: u.color, tag: u.tag, online: isOnline(id) } : null;
};
const slimMovie = (m = {}) => ({
  id: String(m.id ?? '').slice(0, 80),
  title: String(m.title ?? 'Untitled').slice(0, 120),
  subtitle: String(m.subtitle ?? '').slice(0, 160),
  videoUrl: /^https?:\/\//.test(m.videoUrl || '') ? String(m.videoUrl).slice(0, 500) : '',
  backdrop: String(m.backdrop ?? '').slice(0, 500),
  image: String(m.image ?? '').slice(0, 500),
});

const eventView = (e) => ({
  id: e.id, movie: e.movie, hostId: e.hostId, host: pub(e.hostId), startAt: e.startAt, note: e.note,
  controlMode: e.controlMode, roomId: e.roomId,
  invitees: Object.entries(e.invitees).map(([id, status]) => ({ user: pub(id), status })),
});
const snapshot = (id) => {
  const u = db.users[id];
  return {
    me: { id: u.id, name: u.name, code: u.code },
    friends: u.friends.map(pub).filter(Boolean),
    incoming: u.incoming.map(pub).filter(Boolean),
    outgoing: u.outgoing.map(pub).filter(Boolean),
    events: Object.values(db.events)
      .filter((e) => e.hostId === id || id in e.invitees)
      .sort((a, b) => a.startAt - b.startAt)
      .map(eventView),
  };
};
const pushSnapshot = (ids) =>
  [...new Set(ids)].forEach((id) => { if (isOnline(id) && db.users[id]) sendTo(id, { t: 'snapshot', ...snapshot(id) }); });

const dmKey = (a, b) => [a, b].sort().join('|');
const dmsFor = (id) => {
  const out = {};
  db.users[id].friends.forEach((f) => { out[f] = (db.dms[dmKey(id, f)] || []).slice(-150); });
  return out;
};
function addDm(from, to, text, card) {
  const m = { id: rid('m'), from, text, ts: Date.now(), ...(card ? { card } : {}) };
  const k = dmKey(from, to);
  (db.dms[k] ||= []).push(m);
  if (db.dms[k].length > 300) db.dms[k].splice(0, db.dms[k].length - 300);
  sendTo(from, { t: 'dm:new', with: to, message: m });
  sendTo(to, { t: 'dm:new', with: from, message: m });
  persist();
}
const areFriends = (a, b) => db.users[a]?.friends.includes(b);
const drop = (arr, v) => { const i = arr.indexOf(v); if (i >= 0) arr.splice(i, 1); };

/* ------------------------------- rooms ------------------------------- */
const posOf = (s, now) => (s.playing ? s.time + Math.max(0, (now - s.updatedAt) / 1000) : s.time);
const roomView = (r) => ({ id: r.id, movie: r.movie, hostId: r.hostId, controlMode: r.controlMode });
const membersOf = (r) => {
  const seen = new Set(); const out = [];
  r.sockets.forEach((ws) => { if (!seen.has(ws.userId)) { seen.add(ws.userId); out.push(pub(ws.userId)); } });
  return out;
};
const toRoom = (r, msg) => r.sockets.forEach((ws) => send(ws, msg));
const makeRoom = ({ id, movie, hostId, controlMode, allowed }) => {
  const r = {
    id, movie, hostId, controlMode, allowed: new Set(allowed), sockets: new Set(), chat: [],
    state: { playing: false, time: 0, updatedAt: Date.now() }, emptySince: Date.now(),
  };
  rooms.set(id, r);
  return r;
};
function sysChat(r, text) {
  const m = { id: rid('c'), system: true, text, ts: Date.now() };
  r.chat.push(m); if (r.chat.length > 150) r.chat.shift();
  toRoom(r, { t: 'room:chat', message: m });
}
function leaveRoom(ws) {
  const r = rooms.get(ws.roomId);
  ws.roomId = null;
  if (!r || !r.sockets.delete(ws)) return;
  const stillThere = [...r.sockets].some((s) => s.userId === ws.userId);
  if (!stillThere) {
    if (r.hostId === ws.userId && r.sockets.size) r.hostId = [...r.sockets][0].userId;
    sysChat(r, `${db.users[ws.userId]?.name || 'Someone'} left`);
  }
  toRoom(r, { t: 'room:members', members: membersOf(r), hostId: r.hostId });
  if (!r.sockets.size) r.emptySince = Date.now();
}
function joinRoom(ws, r) {
  leaveRoom(ws);
  r.sockets.add(ws); ws.roomId = r.id; r.emptySince = null;
  send(ws, { t: 'room:joined', room: roomView(r), state: r.state, members: membersOf(r), chat: r.chat });
  toRoom(r, { t: 'room:members', members: membersOf(r), hostId: r.hostId });
  sysChat(r, `${db.users[ws.userId].name} joined`);
}
const canControl = (r, ws) => r.controlMode === 'everyone' || r.hostId === ws.userId;

/* ----------------------------- message hub ---------------------------- */
function handle(ws, msg) {
  if (msg.t === 'ping') return send(ws, { t: 'pong', t0: msg.t0, ts: Date.now() });

  if (msg.t === 'hello') {
    const id = String(msg.id || '').slice(0, 80);
    if (!id) return;
    const u = (db.users[id] ||= { id, code: genCode(), friends: [], incoming: [], outgoing: [] });
    Object.assign(u, {
      name: String(msg.name || 'Guest').slice(0, 24),
      avatar: String(msg.avatar || '').slice(0, 300),
      color: String(msg.color || '#a855f7').slice(0, 20),
      tag: String(msg.tag || '').slice(0, 30),
    });
    ws.userId = id;
    if (!online.has(id)) online.set(id, new Set());
    online.get(id).add(ws);
    persist();
    send(ws, { t: 'welcome', ...snapshot(id), dms: dmsFor(id) });
    pushSnapshot(u.friends); // presence
    return;
  }
  if (!ws.userId) return;
  const me = db.users[ws.userId];

  switch (msg.t) {
    /* ---- friends ---- */
    case 'friend:request': {
      const target = byCode(String(msg.code || '').trim().toUpperCase());
      if (!target) return fail(ws, 'No one has that friend code.');
      if (target.id === me.id) return fail(ws, "That's your own code.");
      if (me.friends.includes(target.id)) return fail(ws, `You're already friends with ${target.name}.`);
      if (me.incoming.includes(target.id)) { // they already asked us: accept
        drop(me.incoming, target.id); drop(target.outgoing, me.id);
        me.friends.push(target.id); target.friends.push(me.id);
        notice(target.id, `${me.name} accepted your friend request`);
        notice(me.id, `You and ${target.name} are now friends`);
      } else if (!me.outgoing.includes(target.id)) {
        me.outgoing.push(target.id); target.incoming.push(me.id);
        notice(target.id, `${me.name} sent you a friend request`);
        notice(me.id, `Request sent to ${target.name}`);
      } else return fail(ws, 'Request already sent.');
      persist(); pushSnapshot([me.id, target.id]);
      return;
    }
    case 'friend:respond': {
      const other = db.users[msg.userId];
      if (!other || !me.incoming.includes(other.id)) return;
      drop(me.incoming, other.id); drop(other.outgoing, me.id);
      if (msg.accept) {
        me.friends.push(other.id); other.friends.push(me.id);
        notice(other.id, `${me.name} accepted your friend request`);
      }
      persist(); pushSnapshot([me.id, other.id]);
      return;
    }
    case 'friend:remove': { // unfriend, decline or cancel a pending request
      const other = db.users[msg.userId];
      if (!other) return;
      [me, other].forEach((u, i) => { const o = i ? me : other; drop(u.friends, o.id); drop(u.incoming, o.id); drop(u.outgoing, o.id); });
      persist(); pushSnapshot([me.id, other.id]);
      return;
    }

    /* ---- direct messages ---- */
    case 'dm:send': {
      const text = String(msg.text || '').trim().slice(0, 1000);
      if (!text || !areFriends(me.id, msg.to)) return;
      return addDm(me.id, msg.to, text);
    }

    /* ---- watch dates ---- */
    case 'event:create': {
      const invitees = [...new Set(msg.invitees || [])].filter((id) => areFriends(me.id, id));
      const startAt = Number(msg.startAt);
      if (!invitees.length) return fail(ws, 'Pick at least one friend to invite.');
      if (!Number.isFinite(startAt) || startAt < Date.now() - 60000) return fail(ws, 'Pick a time in the future.');
      const movie = slimMovie(msg.movie);
      const id = rid('e');
      db.events[id] = {
        id, movie, hostId: me.id, startAt, note: String(msg.note || '').slice(0, 200),
        controlMode: msg.controlMode === 'host' ? 'host' : 'everyone', roomId: `r-${id}`,
        invitees: Object.fromEntries(invitees.map((i) => [i, 'pending'])),
      };
      invitees.forEach((i) => {
        addDm(me.id, i, `${me.name} planned a watch date`, { type: 'event', eventId: id, title: movie.title, startAt });
        notice(i, `${me.name} invited you to watch "${movie.title}"`);
      });
      persist(); pushSnapshot([me.id, ...invitees]);
      return notice(me.id, 'Watch date created and invites sent');
    }
    case 'event:respond': {
      const e = db.events[msg.eventId];
      if (!e || !(me.id in e.invitees)) return;
      e.invitees[me.id] = msg.status === 'going' ? 'going' : 'declined';
      persist(); pushSnapshot([e.hostId, ...Object.keys(e.invitees)]);
      return notice(e.hostId, `${me.name} ${e.invitees[me.id] === 'going' ? 'is going to' : "can't make"} "${e.movie.title}"`);
    }
    case 'event:cancel': {
      const e = db.events[msg.eventId];
      if (!e || e.hostId !== me.id) return;
      delete db.events[e.id];
      Object.keys(e.invitees).forEach((i) => notice(i, `${me.name} cancelled "${e.movie.title}"`));
      persist(); pushSnapshot([me.id, ...Object.keys(e.invitees)]);
      return;
    }

    /* ---- rooms ---- */
    case 'room:create': {
      const invitees = [...new Set(msg.invitees || [])].filter((id) => areFriends(me.id, id));
      if (!invitees.length) return fail(ws, 'Pick at least one friend to invite.');
      const movie = slimMovie(msg.movie);
      const r = makeRoom({
        id: rid('r'), movie, hostId: me.id, controlMode: msg.controlMode === 'host' ? 'host' : 'everyone',
        allowed: [me.id, ...invitees],
      });
      invitees.forEach((i) => {
        sendTo(i, { t: 'room:invite', roomId: r.id, movie, from: pub(me.id), controlMode: r.controlMode });
        addDm(me.id, i, `${me.name} started a watch room`, { type: 'room', roomId: r.id, title: movie.title });
      });
      return joinRoom(ws, r);
    }
    case 'room:join': {
      let r = rooms.get(msg.roomId);
      const ev = Object.values(db.events).find((x) => x.roomId === msg.roomId);
      if (!r && ev && (ev.hostId === me.id || me.id in ev.invitees)) {
        r = makeRoom({ id: ev.roomId, movie: ev.movie, hostId: ev.hostId, controlMode: ev.controlMode, allowed: [ev.hostId, ...Object.keys(ev.invitees)] });
      }
      if (!r) return fail(ws, 'That watch room has ended.');
      if (!r.allowed.has(me.id)) return fail(ws, "You weren't invited to that room.");
      if (ev && ev.invitees[me.id] === 'pending') {
        ev.invitees[me.id] = 'going'; persist(); pushSnapshot([ev.hostId, ...Object.keys(ev.invitees)]);
      }
      return joinRoom(ws, r);
    }
    case 'room:leave': return leaveRoom(ws);
    case 'room:invite': {
      const r = rooms.get(ws.roomId);
      if (!r || !areFriends(me.id, msg.userId)) return;
      r.allowed.add(msg.userId);
      sendTo(msg.userId, { t: 'room:invite', roomId: r.id, movie: r.movie, from: pub(me.id), controlMode: r.controlMode });
      addDm(me.id, msg.userId, `${me.name} invited you to a watch room`, { type: 'room', roomId: r.id, title: r.movie.title });
      return;
    }
    case 'room:control': {
      const r = rooms.get(ws.roomId);
      if (!r || !canControl(r, ws)) return;
      const now = Date.now();
      const time = Number.isFinite(msg.time) ? Math.max(0, msg.time) : posOf(r.state, now);
      if (msg.action === 'play') r.state = { playing: true, time, updatedAt: now };
      else if (msg.action === 'pause') r.state = { playing: false, time, updatedAt: now };
      else if (msg.action === 'seek') r.state = { playing: r.state.playing, time, updatedAt: now };
      else return;
      return toRoom(r, { t: 'room:state', state: r.state, by: ws.userId, action: msg.action });
    }
    case 'room:countdown': { // synchronized 3-2-1 start
      const r = rooms.get(ws.roomId);
      if (!r || !canControl(r, ws)) return;
      const now = Date.now();
      const time = r.state.playing ? posOf(r.state, now) : r.state.time;
      r.state = { playing: true, time, updatedAt: now + 4000 };
      return toRoom(r, { t: 'room:state', state: r.state, by: ws.userId, action: 'countdown' });
    }
    case 'room:chat': {
      const r = rooms.get(ws.roomId);
      const text = String(msg.text || '').trim().slice(0, 400);
      if (!r || !text) return;
      const m = { id: rid('c'), from: pub(me.id), text, ts: Date.now() };
      r.chat.push(m); if (r.chat.length > 150) r.chat.shift();
      return toRoom(r, { t: 'room:chat', message: m });
    }
    case 'room:react': {
      const r = rooms.get(ws.roomId);
      const emoji = String(msg.emoji || '').slice(0, 8);
      if (!r || !emoji) return;
      return toRoom(r, { t: 'room:react', emoji, by: pub(me.id) });
    }
    default:
  }
}

/* ------------------------------ lifecycle ------------------------------ */
const wss = new WebSocketServer({ port: PORT, host: '0.0.0.0', maxPayload: 64 * 1024 });
wss.on('connection', (ws) => {
  ws.on('message', (raw) => {
    let msg;
    try { msg = JSON.parse(raw.toString()); } catch { return; }
    try { handle(ws, msg); } catch (e) { console.error('handler error:', e); }
  });
  ws.on('close', () => {
    leaveRoom(ws);
    const set = online.get(ws.userId);
    if (!set) return;
    set.delete(ws);
    if (!set.size) { online.delete(ws.userId); pushSnapshot(db.users[ws.userId]?.friends || []); }
  });
  ws.on('error', () => {});
});

setInterval(() => { // reminders + cleanup
  const now = Date.now();
  for (const e of Object.values(db.events)) {
    const ids = [e.hostId, ...Object.keys(e.invitees).filter((i) => e.invitees[i] !== 'declined')];
    if (!e.soon && e.startAt - now <= SOON_MS) {
      e.soon = true; persist();
      ids.forEach((i) => notice(i, `"${e.movie.title}" starts soon. The watch room is open.`, { eventId: e.id }));
    }
    if (!e.started && now >= e.startAt) {
      e.started = true; persist();
      ids.forEach((i) => notice(i, `Time to watch "${e.movie.title}". Join the room!`, { eventId: e.id }));
    }
    if (now > e.startAt + 6 * 3600e3) { delete db.events[e.id]; persist(); }
  }
  for (const [id, r] of rooms) if (!r.sockets.size && r.emptySince && now - r.emptySince > 2 * 3600e3) rooms.delete(id);
}, 10000);

const ips = Object.values(os.networkInterfaces()).flat().filter((n) => n && n.family === 'IPv4' && !n.internal).map((n) => n.address);
console.log(`VibeFlix social server running on port ${PORT}`);
console.log(`  this computer : ws://localhost:${PORT}`);
ips.forEach((ip) => console.log(`  other devices : open the site at http://${ip}:5173  (server is ws://${ip}:${PORT})`));
