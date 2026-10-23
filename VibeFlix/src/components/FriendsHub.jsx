import React, { useEffect, useRef, useState } from 'react';
import { UserPlus, Copy, Check, X, Send, Calendar, Play, Clock, Trash2, WifiOff, Tv } from 'lucide-react';
import { Avatar, glass, primaryBtn, ghostBtn, inputStyle, sectionLabel, formatWhen, untilLabel, JOIN_WINDOW_MS } from './socialShared';

function EventCard({ event, social, now }) {
  const myId = social.me?.id;
  const isHost = event.hostId === myId;
  const mine = event.invitees.find((i) => i.user?.id === myId);
  const myStatus = isHost ? 'going' : mine?.status;
  const canJoin = now >= event.startAt - JOIN_WINDOW_MS && myStatus !== 'declined' && now < event.startAt + 6 * 3600e3;
  const thumb = event.movie.backdrop || event.movie.image;

  return (
    <div style={{ ...glass, padding: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.6rem', borderColor: canJoin ? '#c084fc' : undefined }}>
      <div style={{ display: 'flex', gap: '0.7rem' }}>
        {thumb && <img src={thumb} alt="" style={{ width: 72, height: 46, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />}
        <div style={{ minWidth: 0 }}>
          <h5 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {event.movie.title}
          </h5>
          <span style={{ fontSize: '0.72rem', color: '#c4b5fd', display: 'block' }}>{formatWhen(event.startAt)}</span>
          <span style={{ fontSize: '0.7rem', fontWeight: 700, color: canJoin ? '#34d399' : '#a78bfa' }}>{untilLabel(event.startAt, now)}</span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.68rem', color: '#8b7ca6' }}>Host {isHost ? '(you)' : event.host?.name}</span>
        <span style={{ flex: 1 }} />
        {[{ user: event.host, status: 'going' }, ...event.invitees].map((i) => (
          <div key={i.user?.id} title={`${i.user?.name}: ${i.status}`} style={{ opacity: i.status === 'declined' ? 0.35 : 1, position: 'relative' }}>
            <Avatar user={i.user} size={24} />
            {i.status === 'pending' && <span style={{ position: 'absolute', bottom: -2, right: -2, fontSize: 9 }}>?</span>}
          </div>
        ))}
      </div>

      {event.note && <p style={{ fontSize: '0.74rem', color: '#d8b4fe', fontStyle: 'italic' }}>"{event.note}"</p>}

      <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
        {!isHost && myStatus === 'pending' && (
          <>
            <button onClick={() => social.respondEvent(event.id, 'going')} style={{ ...primaryBtn, padding: '0.4rem 0.8rem' }}><Check size={13} /> Going</button>
            <button onClick={() => social.respondEvent(event.id, 'declined')} style={{ ...ghostBtn, padding: '0.4rem 0.8rem' }}>Can't go</button>
          </>
        )}
        {!isHost && myStatus === 'declined' && (
          <button onClick={() => social.respondEvent(event.id, 'going')} style={{ ...ghostBtn, padding: '0.4rem 0.8rem' }}>Changed my mind</button>
        )}
        {canJoin && (
          <button onClick={() => social.joinRoom(event.roomId)} style={{ ...primaryBtn, padding: '0.4rem 0.9rem' }}>
            <Play size={13} fill="#fff" /> Join room
          </button>
        )}
        {isHost && (
          <button onClick={() => social.cancelEvent(event.id)} style={{ ...ghostBtn, padding: '0.4rem 0.7rem', color: '#f87171', borderColor: 'rgba(239,68,68,0.35)' }} title="Cancel this watch date">
            <Trash2 size={13} /> Cancel
          </button>
        )}
      </div>
    </div>
  );
}

export function FriendsHub({ social, onOpenSchedule }) {
  const [activeId, setActiveId] = useState(null);
  const [code, setCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [text, setText] = useState('');
  const [now, setNow] = useState(Date.now());
  const endRef = useRef(null);
  const myId = social.me?.id;

  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 15000); return () => clearInterval(t); }, []);

  const active = social.friends.find((f) => f.id === activeId) || null;
  const thread = active ? social.threads[active.id] || [] : [];

  useEffect(() => {
    if (active) social.markRead(active.id);
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [thread.length, activeId]); // eslint-disable-line react-hooks/exhaustive-deps

  const copyCode = () => {
    if (!social.me?.code) return;
    navigator.clipboard?.writeText(social.me.code).catch(() => {});
    setCopied(true); setTimeout(() => setCopied(false), 1600);
  };
  const submitCode = (e) => { e.preventDefault(); if (code.trim()) { social.sendFriendRequest(code.trim()); setCode(''); } };
  const submitDm = (e) => { e.preventDefault(); if (active && text.trim()) { social.sendDm(active.id, text.trim()); setText(''); } };

  const upcoming = social.events.filter((e) => now < e.startAt + 6 * 3600e3);

  return (
    <div style={{
      display: 'grid', gridTemplateColumns: 'clamp(250px, 24vw, 310px) 1fr clamp(260px, 26vw, 330px)', flex: 1, minHeight: '75vh',
      backgroundColor: 'rgba(12, 6, 26, 0.7)', borderRadius: '24px', border: '1px solid rgba(168, 85, 247, 0.25)',
      overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
    }}>
      {/* LEFT: code, requests, friends */}
      <div style={{ backgroundColor: 'rgba(16, 8, 34, 0.85)', borderRight: '1px solid rgba(168, 85, 247, 0.2)', padding: '1.1rem 0.9rem', display: 'flex', flexDirection: 'column', gap: '1.1rem', overflowY: 'auto' }}>
        {social.status !== 'online' && (
          <div style={{ ...glass, padding: '0.8rem', borderColor: 'rgba(239,68,68,0.5)', display: 'flex', gap: '0.6rem' }}>
            <WifiOff size={18} color="#f87171" style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <h5 style={{ fontSize: '0.82rem', color: '#fff', fontWeight: 700 }}>{social.status === 'connecting' ? 'Connecting…' : 'Social server is offline'}</h5>
              <p style={{ fontSize: '0.72rem', color: '#fca5a5', lineHeight: 1.4 }}>
                Start it in a terminal with <code style={{ color: '#fff' }}>npm run server</code>. It reconnects automatically.
              </p>
            </div>
          </div>
        )}

        <div style={{ ...glass, padding: '0.85rem', borderColor: '#c084fc' }}>
          <span style={sectionLabel}>Your friend code</span>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.4rem' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 800, letterSpacing: '0.18em', color: '#fff' }}>
              {social.me?.code || '······'}
            </span>
            <button onClick={copyCode} style={{ ...ghostBtn, padding: '0.4rem 0.6rem' }} title="Copy code">
              {copied ? <Check size={14} color="#34d399" /> : <Copy size={14} />}
            </button>
          </div>
          <p style={{ fontSize: '0.7rem', color: '#8b7ca6', marginTop: '0.3rem' }}>Share this with a friend so they can add you.</p>
        </div>

        <form onSubmit={submitCode} style={{ display: 'flex', gap: '0.45rem' }}>
          <input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} maxLength={8} placeholder="Friend's code" aria-label="Friend code"
            style={{ ...inputStyle, letterSpacing: '0.12em', fontWeight: 700 }} />
          <button type="submit" disabled={!code.trim()} style={{ ...primaryBtn, padding: '0 0.8rem', opacity: code.trim() ? 1 : 0.5 }} title="Send friend request">
            <UserPlus size={16} />
          </button>
        </form>

        {(social.incoming.length > 0 || social.outgoing.length > 0) && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <span style={sectionLabel}>Requests</span>
            {social.incoming.map((u) => (
              <div key={u.id} style={{ ...glass, padding: '0.55rem 0.65rem', display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                <Avatar user={u} size={32} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.name}</span>
                  <span style={{ fontSize: '0.68rem', color: '#c4b5fd' }}>wants to be friends</span>
                </div>
                <button onClick={() => social.respondFriend(u.id, true)} style={{ ...primaryBtn, padding: '0.35rem 0.5rem' }} title="Accept"><Check size={14} /></button>
                <button onClick={() => social.respondFriend(u.id, false)} style={{ ...ghostBtn, padding: '0.35rem 0.5rem' }} title="Decline"><X size={14} /></button>
              </div>
            ))}
            {social.outgoing.map((u) => (
              <div key={u.id} style={{ padding: '0.4rem 0.65rem', display: 'flex', alignItems: 'center', gap: '0.55rem', opacity: 0.8 }}>
                <Avatar user={u} size={26} />
                <span style={{ flex: 1, fontSize: '0.78rem', color: '#c4b5fd' }}>Waiting for {u.name}</span>
                <button onClick={() => social.removeFriend(u.id)} style={{ color: '#a78bfa', fontSize: '0.7rem' }}>Cancel</button>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', flex: 1 }}>
          <span style={sectionLabel}>Friends ({social.friends.length})</span>
          {social.friends.length === 0 && (
            <p style={{ fontSize: '0.78rem', color: '#8b7ca6', lineHeight: 1.5 }}>
              No friends yet. Enter a friend's code above, or give them yours.
            </p>
          )}
          {social.friends.map((f) => {
            const isActive = f.id === activeId;
            const n = social.unread[f.id] || 0;
            return (
              <button key={f.id} onClick={() => setActiveId(f.id)} style={{
                display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.55rem 0.65rem', borderRadius: '12px', textAlign: 'left',
                backgroundColor: isActive ? 'rgba(168, 85, 247, 0.25)' : 'transparent',
                border: isActive ? '1px solid #c084fc' : '1px solid transparent', cursor: 'pointer',
              }}>
                <Avatar user={f} size={34} showDot />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ fontSize: '0.86rem', fontWeight: 700, color: '#fff', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{f.name}</span>
                  <span style={{ fontSize: '0.68rem', color: f.online ? '#34d399' : '#8b7ca6' }}>{f.online ? 'Online' : 'Offline'}</span>
                </div>
                {n > 0 && <span style={{ backgroundColor: '#f43f5e', color: '#fff', fontSize: '0.65rem', fontWeight: 800, borderRadius: 999, padding: '0.1rem 0.45rem' }}>{n}</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* MIDDLE: direct chat */}
      <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: 'rgba(10, 5, 22, 0.95)', minWidth: 0 }}>
        {!active ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem', gap: '0.6rem' }}>
            <Tv size={44} color="#a78bfa" style={{ opacity: 0.6 }} />
            <h3 style={{ fontSize: '1.15rem', color: '#fff' }}>Watch the same movie, wherever you are</h3>
            <p style={{ fontSize: '0.84rem', color: '#8b7ca6', maxWidth: 380, lineHeight: 1.5 }}>
              Pick a friend to chat, start a room now, or plan a watch date. Everyone's playback stays in sync on every device.
            </p>
            {social.friends.length > 0 && (
              <button onClick={() => onOpenSchedule({ mode: 'later' })} style={{ ...primaryBtn, marginTop: '0.5rem' }}><Calendar size={15} /> Plan a watch date</button>
            )}
          </div>
        ) : (
          <>
            <div style={{ padding: '0.8rem 1.25rem', borderBottom: '1px solid rgba(168, 85, 247, 0.2)', backgroundColor: 'rgba(20, 10, 42, 0.6)', display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <Avatar user={active} size={38} showDot />
              <div style={{ flex: 1, minWidth: 120 }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#fff' }}>{active.name}</h3>
                <span style={{ fontSize: '0.72rem', color: active.online ? '#34d399' : '#8b7ca6' }}>{active.online ? 'Online now' : 'Offline'}</span>
              </div>
              <button onClick={() => onOpenSchedule({ mode: 'now', friendId: active.id })} style={primaryBtn}><Play size={14} fill="#fff" /> Watch now</button>
              <button onClick={() => onOpenSchedule({ mode: 'later', friendId: active.id })} style={ghostBtn}><Calendar size={14} /> Plan a date</button>
              <button onClick={() => { social.removeFriend(active.id); setActiveId(null); }} style={{ ...ghostBtn, color: '#f87171', borderColor: 'rgba(239,68,68,0.3)' }} title="Remove friend"><X size={14} /></button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '1.1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
              {thread.length === 0 && <p style={{ margin: 'auto', fontSize: '0.82rem', color: '#8b7ca6' }}>Say hi to {active.name}.</p>}
              {thread.map((m) => {
                const mineMsg = m.from === myId;
                const ev = m.card?.type === 'event' ? social.events.find((e) => e.id === m.card.eventId) : null;
                return (
                  <div key={m.id} style={{ alignSelf: mineMsg ? 'flex-end' : 'flex-start', maxWidth: '78%' }}>
                    {m.text && !m.card && (
                      <div style={{
                        padding: '0.55rem 0.85rem', borderRadius: mineMsg ? '14px 14px 4px 14px' : '14px 14px 14px 4px', fontSize: '0.86rem', lineHeight: 1.45, color: '#fff', wordBreak: 'break-word',
                        background: mineMsg ? 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)' : 'rgba(38, 18, 76, 0.9)',
                      }}>{m.text}</div>
                    )}
                    {m.card && (
                      <div style={{ ...glass, padding: '0.75rem 0.9rem', borderColor: '#c084fc', minWidth: 230 }}>
                        <span style={{ fontSize: '0.7rem', color: '#c4b5fd' }}>{m.text}</span>
                        <h5 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#fff', margin: '0.15rem 0' }}>{m.card.title}</h5>
                        {m.card.type === 'event' && (
                          <>
                            <span style={{ fontSize: '0.74rem', color: '#d8b4fe', display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Clock size={12} /> {formatWhen(m.card.startAt)}</span>
                            {!ev && <span style={{ fontSize: '0.72rem', color: '#8b7ca6' }}>No longer scheduled</span>}
                            {ev && !mineMsg && ev.invitees.find((i) => i.user?.id === myId)?.status === 'pending' && (
                              <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.5rem' }}>
                                <button onClick={() => social.respondEvent(ev.id, 'going')} style={{ ...primaryBtn, padding: '0.35rem 0.8rem' }}>Going</button>
                                <button onClick={() => social.respondEvent(ev.id, 'declined')} style={{ ...ghostBtn, padding: '0.35rem 0.8rem' }}>Can't go</button>
                              </div>
                            )}
                          </>
                        )}
                        {m.card.type === 'room' && !mineMsg && (
                          <button onClick={() => social.joinRoom(m.card.roomId)} style={{ ...primaryBtn, padding: '0.35rem 0.9rem', marginTop: '0.5rem' }}><Play size={12} fill="#fff" /> Join room</button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
              <div ref={endRef} />
            </div>

            <form onSubmit={submitDm} style={{ padding: '0.9rem 1.25rem', borderTop: '1px solid rgba(168, 85, 247, 0.25)', backgroundColor: 'rgba(16, 8, 34, 0.9)', display: 'flex', gap: '0.65rem' }}>
              <input value={text} onChange={(e) => setText(e.target.value)} placeholder={`Message ${active.name}`} aria-label="Message" style={inputStyle} />
              <button type="submit" disabled={!text.trim()} style={{ ...primaryBtn, padding: '0 1rem', opacity: text.trim() ? 1 : 0.5 }} title="Send"><Send size={16} /></button>
            </form>
          </>
        )}
      </div>

      {/* RIGHT: watch dates */}
      <div style={{ backgroundColor: 'rgba(16, 8, 34, 0.85)', borderLeft: '1px solid rgba(168, 85, 247, 0.2)', padding: '1.1rem 0.9rem', display: 'flex', flexDirection: 'column', gap: '0.8rem', overflowY: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={sectionLabel}>Watch dates</span>
          <button onClick={() => onOpenSchedule({ mode: 'later' })} style={{ ...ghostBtn, padding: '0.3rem 0.65rem' }}><Calendar size={13} /> New</button>
        </div>
        {upcoming.length === 0 ? (
          <p style={{ fontSize: '0.78rem', color: '#8b7ca6', lineHeight: 1.5 }}>
            Nothing planned yet. Choose a movie, a time and your friends, and everyone gets an invite. The room opens 10 minutes before.
          </p>
        ) : upcoming.map((e) => <EventCard key={e.id} event={e} social={social} now={now} />)}
      </div>
    </div>
  );
}
