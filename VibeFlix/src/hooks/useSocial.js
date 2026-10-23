import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

// Where the social server lives. Override with VITE_SOCIAL_URL in a .env file if you deploy it.
const WS_URL =
  import.meta.env.VITE_SOCIAL_URL ||
  `${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${window.location.host}/ws`;

const readJSON = (k, fb) => { try { return JSON.parse(localStorage.getItem(k)) ?? fb; } catch { return fb; } };
const writeJSON = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* ignore */ } };

// Every profile on every device gets its own stable social identity.
function getUserId(profileId) {
  const key = `vibeflix.uid.${profileId}`;
  try {
    let v = localStorage.getItem(key);
    if (!v) {
      v = `u-${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
      localStorage.setItem(key, v);
    }
    return v;
  } catch {
    return `u-${Math.random().toString(36).slice(2)}`;
  }
}

/**
 * useSocial(profile, onNotice)
 * Pass null while the user is not on the dashboard to stay disconnected.
 * onNotice(text, kind) is called for server messages ("Sam accepted your request").
 */
export function useSocial(profile, onNotice) {
  const [status, setStatus] = useState('offline'); // 'connecting' | 'online' | 'offline'
  const [me, setMe] = useState(null);
  const [friends, setFriends] = useState([]);
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);
  const [events, setEvents] = useState([]);
  const [threads, setThreads] = useState({});
  const [lastRead, setLastRead] = useState({});
  const [invites, setInvites] = useState([]);
  const [room, setRoom] = useState(null);
  const [roomState, setRoomState] = useState(null);
  const [members, setMembers] = useState([]);
  const [chat, setChat] = useState([]);
  const [lastAction, setLastAction] = useState(null);

  const wsRef = useRef(null);
  const offsetRef = useRef(0);
  const samplesRef = useRef([]);
  const roomRef = useRef(null);
  const uidRef = useRef(null);
  const listeners = useRef(new Set());
  const noticeRef = useRef(onNotice);
  noticeRef.current = onNotice;
  useEffect(() => { roomRef.current = room; }, [room]);

  const serverNow = useCallback(() => Date.now() + offsetRef.current, []);
  const subscribe = useCallback((fn) => { listeners.current.add(fn); return () => listeners.current.delete(fn); }, []);

  const send = useCallback((obj) => {
    const ws = wsRef.current;
    if (ws && ws.readyState === 1) { ws.send(JSON.stringify(obj)); return true; }
    noticeRef.current?.('Not connected to the social server yet.', 'error');
    return false;
  }, []);

  /* ---------------------------- connection ---------------------------- */
  useEffect(() => {
    if (!profile) { setStatus('offline'); return undefined; }
    const uid = getUserId(profile.id);
    uidRef.current = uid;
    setLastRead(readJSON(`vibeflix.read.${uid}`, {}));
    setFriends([]); setIncoming([]); setOutgoing([]); setEvents([]); setThreads({});
    setRoom(null); setRoomState(null); setMembers([]); setChat([]); setInvites([]);

    let ws; let closed = false; let retry = 0; let pingTimer; let reconnectTimer;

    const ping = () => { if (ws?.readyState === 1) ws.send(JSON.stringify({ t: 'ping', t0: Date.now() })); };

    const applySnapshot = (m) => {
      if (m.me) setMe(m.me);
      setFriends(m.friends || []); setIncoming(m.incoming || []);
      setOutgoing(m.outgoing || []); setEvents(m.events || []);
    };

    const handle = (m) => {
      switch (m.t) {
        case 'welcome':
          applySnapshot(m); setThreads(m.dms || {}); setStatus('online');
          if (roomRef.current) ws.send(JSON.stringify({ t: 'room:join', roomId: roomRef.current.id }));
          break;
        case 'snapshot': applySnapshot(m); break;
        case 'pong': {
          const t1 = Date.now();
          const s = samplesRef.current;
          s.push({ rtt: t1 - m.t0, off: m.ts - (m.t0 + t1) / 2 });
          if (s.length > 6) s.shift();
          offsetRef.current = s.reduce((a, b) => (b.rtt < a.rtt ? b : a)).off; // trust the fastest round trip
          break;
        }
        case 'dm:new':
          setThreads((p) => ({ ...p, [m.with]: [...(p[m.with] || []), m.message] }));
          break;
        case 'notice': noticeRef.current?.(m.text, m.kind || 'default', m); break;
        case 'room:invite':
          setInvites((p) => [...p.filter((i) => i.roomId !== m.roomId), m]);
          noticeRef.current?.(`${m.from?.name} invited you to watch "${m.movie?.title}"`, 'default', m);
          break;
        case 'room:joined':
          setRoom(m.room); setRoomState(m.state); setMembers(m.members); setChat(m.chat || []);
          setInvites((p) => p.filter((i) => i.roomId !== m.room.id));
          break;
        case 'room:state': setRoomState(m.state); setLastAction({ by: m.by, action: m.action, state: m.state, ts: Date.now() }); break;
        case 'room:members':
          setMembers(m.members); setRoom((r) => (r ? { ...r, hostId: m.hostId } : r));
          break;
        case 'room:chat': setChat((p) => [...p.slice(-150), m.message]); break;
        case 'room:react': listeners.current.forEach((fn) => fn(m)); break;
        default:
      }
    };

    const connect = () => {
      setStatus('connecting');
      try { ws = new WebSocket(WS_URL); } catch { setStatus('offline'); return; }
      wsRef.current = ws;
      ws.onopen = () => {
        retry = 0;
        ws.send(JSON.stringify({ t: 'hello', id: uid, name: profile.name, avatar: profile.avatar, color: profile.color, tag: profile.tag }));
        ping(); pingTimer = setInterval(ping, 15000);
      };
      ws.onmessage = (ev) => { try { handle(JSON.parse(ev.data)); } catch { /* ignore bad frame */ } };
      ws.onclose = () => {
        clearInterval(pingTimer);
        if (wsRef.current === ws) wsRef.current = null;
        if (closed) return;
        setStatus('offline');
        reconnectTimer = setTimeout(connect, Math.min(1000 * 2 ** retry++, 10000));
      };
      ws.onerror = () => { try { ws.close(); } catch { /* ignore */ } };
    };
    connect();

    return () => { closed = true; clearInterval(pingTimer); clearTimeout(reconnectTimer); try { ws?.close(); } catch { /* ignore */ } };
  }, [profile?.id, profile?.name]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ------------------------------ actions ------------------------------ */
  const markRead = useCallback((friendId) => {
    setLastRead((p) => {
      const next = { ...p, [friendId]: serverNow() };
      if (uidRef.current) writeJSON(`vibeflix.read.${uidRef.current}`, next);
      return next;
    });
  }, [serverNow]);

  const actions = useMemo(() => ({
    sendFriendRequest: (code) => send({ t: 'friend:request', code }),
    respondFriend: (userId, accept) => send({ t: 'friend:respond', userId, accept }),
    removeFriend: (userId) => send({ t: 'friend:remove', userId }), // unfriend / cancel pending request
    sendDm: (to, text) => send({ t: 'dm:send', to, text }),
    createEvent: (p) => send({ t: 'event:create', ...p }),
    respondEvent: (eventId, status) => send({ t: 'event:respond', eventId, status }),
    cancelEvent: (eventId) => send({ t: 'event:cancel', eventId }),
    startRoom: (p) => send({ t: 'room:create', ...p }),
    joinRoom: (roomId) => send({ t: 'room:join', roomId }),
    leaveRoom: () => { send({ t: 'room:leave' }); setRoom(null); setRoomState(null); setChat([]); setMembers([]); },
    inviteToRoom: (userId) => send({ t: 'room:invite', userId }),
    control: (action, time) => send({ t: 'room:control', action, time }),
    countdown: () => send({ t: 'room:countdown' }),
    sendChat: (text) => send({ t: 'room:chat', text }),
    react: (emoji) => send({ t: 'room:react', emoji }),
    dismissInvite: (roomId) => setInvites((p) => p.filter((i) => i.roomId !== roomId)),
  }), [send]);

  /* ----------------------------- derived data ---------------------------- */
  const unread = useMemo(() => {
    const out = {};
    Object.entries(threads).forEach(([fid, msgs]) => {
      out[fid] = msgs.filter((m) => m.from === fid && m.ts > (lastRead[fid] || 0)).length;
    });
    return out;
  }, [threads, lastRead]);

  const pendingEventInvites = events.filter(
    (e) => e.hostId !== me?.id && e.invitees.find((i) => i.user?.id === me?.id)?.status === 'pending'
  ).length;
  const badgeCount = incoming.length + pendingEventInvites + invites.length + Object.values(unread).reduce((a, b) => a + b, 0);

  return {
    status, me, friends, incoming, outgoing, events, threads, unread, invites, badgeCount,
    room, roomState, members, chat, lastAction, serverNow, subscribe, markRead, ...actions,
  };
}
