
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Play, Pause, RotateCcw, RotateCw, Volume2, VolumeX, Maximize, Minimize, LogOut, MessageSquare,
  Send, UserPlus, Lock, Users, RefreshCw, X,
} from 'lucide-react';

import { Avatar, ghostBtn, inputStyle, formatClock } from './socialShared';

const DEFAULT_VIDEO = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4';
const REACTIONS = ['🔥', '😂', '😱', '👏', '💜', '🍿'];

export function WatchTogetherPlayer({ social }) {
  const { room, roomState, members, chat, me, serverNow } = social;
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const startTimer = useRef(null);
  const metaReady = useRef(false);
  const stateRef = useRef(roomState);
  const hideTimer = useRef(null);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [dragVal, setDragVal] = useState(null);
  const [volume, setVolume] = useState(0.85);
  const [muted, setMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [chatOpen, setChatOpen] = useState(true);
  const [unreadChat, setUnreadChat] = useState(0);
  const [needsTap, setNeedsTap] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [floaters, setFloaters] = useState([]);
  const [draft, setDraft] = useState('');
  const [showInvite, setShowInvite] = useState(false);
  const [invited, setInvited] = useState({});
  const [isFs, setIsFs] = useState(false);
  const [pill, setPill] = useState(null);
  const chatEnd = useRef(null);

  const isHost = room.hostId === me?.id;
  const canControl = room.controlMode === 'everyone' || isHost;
  const hostName = members.find((m) => m.id === room.hostId)?.name || 'the host';
  const playingNow = !!roomState?.playing && roomState.updatedAt <= serverNow();
  const notStarted = !!roomState && !roomState.playing && roomState.time < 1;

  /* --------------------------- sync engine --------------------------- */
  const tryPlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    const p = v.play();
    if (p?.then) p.then(() => setNeedsTap(false)).catch(() => setNeedsTap(true));
  }, []);

  const apply = useCallback((st, force = false) => {
    const v = videoRef.current;
    if (!v || !st || !metaReady.current) return;
    clearTimeout(startTimer.current);
    if (st.playing) {
      const delay = st.updatedAt - serverNow();
      if (delay > 0) { // synchronized countdown: hold at st.time, start together
        v.pause(); v.currentTime = st.time;
        startTimer.current = setTimeout(tryPlay, delay);
        return;
      }
      const target = st.time + (serverNow() - st.updatedAt) / 1000;
      if (force || Math.abs(v.currentTime - target) > 0.6) v.currentTime = Math.min(target, v.duration || target);
      tryPlay();
    } else {
      v.pause(); v.playbackRate = 1;
      if (Math.abs(v.currentTime - st.time) > 0.3) v.currentTime = st.time;
    }
  }, [serverNow, tryPlay]);

  // new room state from the server
  useEffect(() => { stateRef.current = roomState; apply(roomState); }, [roomState, apply]);

  // gentle drift correction while playing (speed nudge for small drift, seek for big drift)
  useEffect(() => {
    const t = setInterval(() => {
      const v = videoRef.current; const st = stateRef.current;
      if (!v || !st || !metaReady.current) return;
      if (!st.playing || st.updatedAt > serverNow()) { v.playbackRate = 1; return; }
      const diff = st.time + (serverNow() - st.updatedAt) / 1000 - v.currentTime;
      if (Math.abs(diff) > 1.5) { v.currentTime += diff; v.playbackRate = 1; }
      else v.playbackRate = diff > 0.25 ? 1.06 : diff < -0.25 ? 0.94 : 1;
      if (v.paused && !v.ended) v.play().catch(() => {});
    }, 2000);
    return () => clearInterval(t);
  }, [serverNow]);

  // 3-2-1 countdown display
  useEffect(() => {
    const t = setInterval(() => {
      const st = stateRef.current;
      const delay = st ? st.updatedAt - serverNow() : 0;
      setCountdown(st?.playing && delay > 0 ? Math.ceil(delay / 1000) : 0);
    }, 150);
    return () => clearInterval(t);
  }, [serverNow]);

  /* ----------------------- reactions, chat, pills ---------------------- */
  useEffect(() => social.subscribe((m) => {
    const id = `${Date.now()}-${Math.random()}`;
    setFloaters((p) => [...p.slice(-25), { id, emoji: m.emoji, by: m.by?.name, left: 6 + Math.random() * 24 }]);
    setTimeout(() => setFloaters((p) => p.filter((f) => f.id !== id)), 3400);
  }), [social.subscribe]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const a = social.lastAction;
    if (!a || !a.by || a.by === me?.id) return undefined;
    const who = members.find((m) => m.id === a.by)?.name || 'Someone';
    const verb = { play: 'pressed play', pause: 'paused', seek: `jumped to ${formatClock(a.state.time)}`, countdown: 'started the countdown' }[a.action];
    if (!verb) return undefined;
    setPill(`${who} ${verb}`);
    const t = setTimeout(() => setPill(null), 2600);
    return () => clearTimeout(t);
  }, [social.lastAction]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    chatEnd.current?.scrollIntoView({ behavior: 'smooth' });
    const last = chat[chat.length - 1];
    if (!chatOpen && last && !last.system && last.from?.id !== me?.id) setUnreadChat((n) => n + 1);
  }, [chat.length]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ------------------------------ controls ----------------------------- */
  const wake = () => {
    setShowControls(true);
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setShowControls(false), 3500);
  };
  useEffect(() => { wake(); return () => clearTimeout(hideTimer.current); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const pos = () => videoRef.current?.currentTime || 0;
  const togglePlay = () => { if (canControl) social.control(playingNow ? 'pause' : 'play', pos()); };
  const skip = (s) => { if (canControl) social.control('seek', Math.min(Math.max(pos() + s, 0), duration || Infinity)); };
  const commitSeek = () => { if (dragVal != null && canControl) social.control('seek', dragVal); setDragVal(null); };

  useEffect(() => {
    const onKey = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
      if (e.key === ' ') { e.preventDefault(); togglePlay(); }
      else if (e.key === 'ArrowRight') skip(10);
      else if (e.key === 'ArrowLeft') skip(-10);
      else if (e.key === 'f' || e.key === 'F') toggleFs();
      else if (e.key === 'm' || e.key === 'M') toggleMute();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const toggleMute = () => { const v = videoRef.current; if (v) { v.muted = !muted; setMuted(!muted); } };
  const changeVolume = (e) => {
    const val = parseFloat(e.target.value); setVolume(val);
    if (videoRef.current) { videoRef.current.volume = val; videoRef.current.muted = val === 0; setMuted(val === 0); }
  };
  const toggleFs = () => {
    if (!document.fullscreenElement) containerRef.current?.requestFullscreen?.().catch(() => {});
    else document.exitFullscreen?.().catch(() => {});
  };
  useEffect(() => {
    const onFs = () => setIsFs(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFs);
    return () => { document.removeEventListener('fullscreenchange', onFs); if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {}); };
  }, []);
  useEffect(() => () => clearTimeout(startTimer.current), []);

  const submitChat = (e) => { e.preventDefault(); if (draft.trim()) { social.sendChat(draft.trim()); setDraft(''); } };
  const shownTime = dragVal ?? currentTime;
  const pct = duration ? (shownTime / duration) * 100 : 0;
  const invitable = social.friends.filter((f) => !members.some((m) => m.id === f.id));
  const hud = { opacity: showControls ? 1 : 0, pointerEvents: showControls ? 'auto' : 'none', transition: 'opacity 0.3s ease' };

  return (
    <div ref={containerRef} style={{ position: 'fixed', inset: 0, zIndex: 110, backgroundColor: '#000', display: 'flex', userSelect: 'none' }}>
      <style>{`
        @keyframes vfFloatUp { 0% { transform: translateY(0) scale(.6); opacity: 0 } 12% { opacity: 1; transform: translateY(-30px) scale(1) } 100% { transform: translateY(-340px) scale(1.15); opacity: 0 } }
        @keyframes vfCount { 0% { transform: scale(.6); opacity: 0 } 30% { transform: scale(1); opacity: 1 } 100% { transform: scale(1.15); opacity: .0 } }
        @media (prefers-reduced-motion: reduce) { .vf-float, .vf-count { animation-duration: .01s !important; } }
      `}</style>

      {/* VIDEO AREA */}
      <div onMouseMove={wake} onTouchStart={wake} style={{ position: 'relative', flex: 1, minWidth: 0, overflow: 'hidden' }}>
        <video
          ref={videoRef}
          src={room.movie.videoUrl || DEFAULT_VIDEO}
          poster={room.movie.backdrop || room.movie.image}
          playsInline
          preload="auto"
          onClick={togglePlay}
          onLoadedMetadata={(e) => { metaReady.current = true; setDuration(e.currentTarget.duration); apply(stateRef.current, true); }}
          onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
          style={{ width: '100%', height: '100%', objectFit: 'contain', backgroundColor: '#000' }}
        />

        {/* floating reactions */}
        <div aria-hidden="true" style={{ position: 'absolute', left: 0, bottom: 110, width: '100%', height: 0, pointerEvents: 'none', zIndex: 25 }}>
          {floaters.map((f) => (
            <div key={f.id} className="vf-float" style={{ position: 'absolute', left: `${f.left}%`, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', animation: 'vfFloatUp 3.2s ease-out forwards' }}>
              <span style={{ fontSize: '2.2rem', lineHeight: 1 }}>{f.emoji}</span>
              <span style={{ fontSize: '0.62rem', color: '#e9d5ff', backgroundColor: 'rgba(7,3,18,0.7)', padding: '0.05rem 0.4rem', borderRadius: 999, marginTop: 2 }}>{f.by}</span>
            </div>
          ))}
        </div>

        {/* synchronized countdown */}
        {countdown > 0 && (
          <div style={{ position: 'absolute', inset: 0, zIndex: 30, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(7,3,18,0.55)', pointerEvents: 'none' }}>
            <span key={countdown} className="vf-count" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(6rem, 18vw, 12rem)', fontWeight: 900, color: '#fff', textShadow: '0 0 60px #a855f7', animation: 'vfCount 1s ease-out forwards' }}>{countdown}</span>
            <span style={{ color: '#d8b4fe', fontSize: '1rem' }}>Starting together</span>
          </div>
        )}

        {/* start-together call to action */}
        {notStarted && countdown === 0 && (
          <div style={{ position: 'absolute', inset: 0, zIndex: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.9rem', backgroundColor: 'rgba(7,3,18,0.6)', textAlign: 'center', padding: '1rem' }}>
            <h2 style={{ fontSize: 'clamp(1.4rem, 3vw, 2.2rem)', fontWeight: 800, color: '#fff' }}>{room.movie.title}</h2>
            <p style={{ color: '#c4b5fd', fontSize: '0.95rem' }}>
              {members.length} {members.length === 1 ? 'person is' : 'people are'} here. {members.length < 2 ? 'Waiting for your friends…' : 'Ready when you are.'}
            </p>
            {canControl ? (
              <button onClick={social.countdown} style={{ padding: '0.9rem 2rem', borderRadius: 14, background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #d946ef 100%)', color: '#fff', fontWeight: 800, fontSize: '1rem', boxShadow: '0 0 30px rgba(168,85,247,0.7)', display: 'inline-flex', gap: '0.6rem', alignItems: 'center', cursor: 'pointer' }}>
                <Play size={18} fill="#fff" /> Start together (3·2·1)
              </button>
            ) : (
              <span style={{ color: '#d8b4fe', fontSize: '0.9rem' }}>{hostName} will start the movie.</span>
            )}
          </div>
        )}

        {/* browser blocked autoplay on this device */}
        {needsTap && (
          <div style={{ position: 'absolute', inset: 0, zIndex: 35, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(7,3,18,0.75)' }}>
            <button onClick={() => { apply(stateRef.current, true); tryPlay(); }} style={{ padding: '0.9rem 1.8rem', borderRadius: 14, backgroundColor: '#a855f7', color: '#fff', fontWeight: 800, cursor: 'pointer', boxShadow: '0 0 30px rgba(168,85,247,0.7)' }}>
              Tap to join playback
            </button>
          </div>
        )}

        {pill && (
          <div role="status" style={{ position: 'absolute', top: 86, left: '50%', transform: 'translateX(-50%)', zIndex: 28, padding: '0.4rem 0.95rem', borderRadius: 999, backgroundColor: 'rgba(26,12,54,0.9)', border: '1px solid rgba(192,132,252,0.5)', color: '#fff', fontSize: '0.82rem', fontWeight: 600 }}>{pill}</div>
        )}

        {/* TOP BAR */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '1.1rem max(1.1rem, 2vw)', background: 'linear-gradient(to bottom, rgba(7,3,18,0.95) 0%, rgba(7,3,18,0.5) 60%, transparent 100%)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', zIndex: 40, ...hud }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', minWidth: 0 }}>
            <button onClick={social.leaveRoom} style={{ ...ghostBtn, padding: '0.5rem 1rem', borderRadius: 999, backgroundColor: 'rgba(26,12,54,0.75)', color: '#fff', flexShrink: 0 }}><LogOut size={16} /> Leave room</button>
            <div style={{ minWidth: 0 }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{room.movie.title}</h3>
              <span style={{ fontSize: '0.74rem', color: '#c4b5fd', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                {room.controlMode === 'host' ? <><Lock size={11} /> {hostName} controls playback</> : <><Users size={11} /> Everyone controls playback</>}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', flexShrink: 0 }}>
            <div style={{ display: 'flex' }} aria-label={`${members.length} watching`}>
              {members.slice(0, 5).map((m, i) => (
                <div key={m.id} title={m.name + (m.id === room.hostId ? ' (host)' : '')} style={{ marginLeft: i ? -8 : 0 }}><Avatar user={m} size={30} /></div>
              ))}
              {members.length > 5 && <span style={{ marginLeft: 6, alignSelf: 'center', color: '#c4b5fd', fontSize: '0.76rem' }}>+{members.length - 5}</span>}
            </div>
            <div style={{ position: 'relative' }}>
              <button onClick={() => setShowInvite((s) => !s)} style={{ ...ghostBtn, padding: '0.45rem 0.8rem' }} title="Invite a friend"><UserPlus size={15} /> Invite</button>
              {showInvite && (
                <div className="glass-panel-glow animate-fadeIn" style={{ position: 'absolute', top: 44, right: 0, width: 250, borderRadius: 14, padding: '0.7rem', backgroundColor: 'rgba(14,7,28,0.97)', zIndex: 50 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <h5 style={{ fontSize: '0.82rem', color: '#fff' }}>Invite a friend</h5>
                    <button onClick={() => setShowInvite(false)} aria-label="Close"><X size={14} color="#a78bfa" /></button>
                  </div>
                  {invitable.length === 0 && <p style={{ fontSize: '0.76rem', color: '#8b7ca6' }}>Everyone you know is already here.</p>}
                  {invitable.map((f) => (
                    <div key={f.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.3rem 0' }}>
                      <Avatar user={f} size={26} showDot />
                      <span style={{ flex: 1, fontSize: '0.8rem', color: '#fff' }}>{f.name}</span>
                      <button disabled={invited[f.id]} onClick={() => { social.inviteToRoom(f.id); setInvited((p) => ({ ...p, [f.id]: true })); }} style={{ ...ghostBtn, padding: '0.25rem 0.6rem', opacity: invited[f.id] ? 0.5 : 1 }}>{invited[f.id] ? 'Sent' : 'Invite'}</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button onClick={() => { setChatOpen((o) => !o); setUnreadChat(0); }} style={{ ...ghostBtn, padding: '0.45rem 0.8rem', position: 'relative' }} aria-pressed={chatOpen} title="Toggle chat">
              <MessageSquare size={15} /> Chat
              {unreadChat > 0 && !chatOpen && <span style={{ position: 'absolute', top: -6, right: -6, backgroundColor: '#f43f5e', color: '#fff', fontSize: '0.62rem', fontWeight: 800, borderRadius: 999, padding: '0.05rem 0.4rem' }}>{unreadChat}</span>}
            </button>
          </div>
        </div>

        {/* BOTTOM CONTROLS */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '2rem max(1.1rem, 2vw) 1.1rem', background: 'linear-gradient(to top, rgba(7,3,18,0.98) 0%, rgba(7,3,18,0.7) 60%, transparent 100%)', zIndex: 40, display: 'flex', flexDirection: 'column', gap: '0.8rem', ...hud }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
            <span style={{ fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 600, minWidth: 44 }}>{formatClock(shownTime)}</span>
            <input
              type="range" min="0" max={duration || 100} step="0.1" value={shownTime}
              disabled={!canControl} aria-label="Seek"
              onChange={(e) => setDragVal(parseFloat(e.target.value))}
              onPointerUp={commitSeek} onKeyUp={commitSeek}
              style={{ flex: 1, height: 6, accentColor: '#c084fc', cursor: canControl ? 'pointer' : 'not-allowed', opacity: canControl ? 1 : 0.6, background: `linear-gradient(to right, #9333ea 0%, #c084fc ${pct}%, rgba(255,255,255,0.2) ${pct}%)`, borderRadius: 999 }}
            />
            <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600, minWidth: 44, textAlign: 'right' }}>{formatClock(duration)}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
              <button onClick={togglePlay} disabled={!canControl} title={canControl ? (playingNow ? 'Pause for everyone' : 'Play for everyone') : `Only ${hostName} can control playback`}
                style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(168,85,247,0.7)', opacity: canControl ? 1 : 0.45, cursor: canControl ? 'pointer' : 'not-allowed' }}>
                {playingNow ? <Pause size={20} fill="#fff" /> : <Play size={20} fill="#fff" style={{ marginLeft: 2 }} />}
              </button>
              <button onClick={() => skip(-10)} disabled={!canControl} title="Back 10 seconds" aria-label="Back 10 seconds" style={{ color: '#c4b5fd', opacity: canControl ? 1 : 0.4, display: 'flex' }}><RotateCcw size={20} /></button>
              <button onClick={() => skip(10)} disabled={!canControl} title="Forward 10 seconds" aria-label="Forward 10 seconds" style={{ color: '#c4b5fd', opacity: canControl ? 1 : 0.4, display: 'flex' }}><RotateCw size={20} /></button>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <button onClick={toggleMute} aria-label="Mute" style={{ color: '#c4b5fd', display: 'flex' }}>{muted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}</button>
                <input type="range" min="0" max="1" step="0.05" value={muted ? 0 : volume} onChange={changeVolume} aria-label="Volume" style={{ width: 72, accentColor: '#c084fc' }} />
              </div>
              <button onClick={() => apply(stateRef.current, true)} title="Re-sync with the room" style={{ ...ghostBtn, padding: '0.35rem 0.7rem' }}><RefreshCw size={13} /> Sync</button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }} role="group" aria-label="Send a reaction">
              {REACTIONS.map((emoji) => (
                <button key={emoji} onClick={() => social.react(emoji)} aria-label={`React ${emoji}`}
                  style={{ fontSize: '1.15rem', width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.07)', border: '1px solid rgba(168,85,247,0.2)', cursor: 'pointer' }}>{emoji}</button>
              ))}
              <button onClick={toggleFs} aria-label="Fullscreen" style={{ color: '#c4b5fd', display: 'flex', marginLeft: '0.7rem' }}>{isFs ? <Minimize size={20} /> : <Maximize size={20} />}</button>
            </div>
          </div>
        </div>
      </div>

      {/* CHAT PANEL */}
      {chatOpen && (
        <aside aria-label="Room chat" style={{ width: 'min(330px, 38vw)', flexShrink: 0, display: 'flex', flexDirection: 'column', backgroundColor: 'rgba(10,5,22,0.98)', borderLeft: '1px solid rgba(168,85,247,0.3)', zIndex: 45 }}>
          <div style={{ padding: '1rem 1.1rem', borderBottom: '1px solid rgba(168,85,247,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h4 style={{ fontSize: '0.95rem', color: '#fff' }}>Room chat</h4>
            <span style={{ fontSize: '0.72rem', color: '#34d399', fontWeight: 700 }}>{members.length} watching</span>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '0.9rem 1.1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {chat.map((m) => m.system ? (
              <span key={m.id} style={{ textAlign: 'center', fontSize: '0.7rem', color: '#8b7ca6' }}>{m.text}</span>
            ) : (
              <div key={m.id} style={{ display: 'flex', gap: '0.5rem' }}>
                <Avatar user={m.from} size={26} />
                <div style={{ minWidth: 0 }}>
                  <span style={{ fontSize: '0.76rem', fontWeight: 700, color: m.from?.color || '#c084fc' }}>{m.from?.id === me?.id ? 'You' : m.from?.name}</span>
                  <p style={{ fontSize: '0.84rem', color: '#f1f5f9', lineHeight: 1.4, wordBreak: 'break-word' }}>{m.text}</p>
                </div>
              </div>
            ))}
            <div ref={chatEnd} />
          </div>
          <form onSubmit={submitChat} style={{ padding: '0.8rem 1.1rem', borderTop: '1px solid rgba(168,85,247,0.25)', display: 'flex', gap: '0.5rem' }}>
            <input value={draft} onChange={(e) => setDraft(e.target.value)} maxLength={400} placeholder="Say something" aria-label="Chat message" style={inputStyle} />
            <button type="submit" disabled={!draft.trim()} aria-label="Send" style={{ width: 40, borderRadius: 10, background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: draft.trim() ? 1 : 0.5, flexShrink: 0 }}><Send size={16} /></button>
          </form>
        </aside>
      )}
    </div>
  );
}

export function PartyInvitePopup({ social }) {
  const friends = social?.friends || [];
  if (!friends.length) return null;

  return (
    <div style={{
      position: 'fixed',
      right: '1.5rem',
      bottom: '1.5rem',
      zIndex: 50,
      background: 'rgba(18, 10, 30, 0.95)',
      border: '1px solid rgba(168, 85, 247, 0.4)',
      borderRadius: '16px',
      boxShadow: '0 20px 45px rgba(76, 29, 149, 0.5)',
      padding: '0.9rem 1rem',
      color: '#fff',
      maxWidth: '260px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', marginBottom: '0.7rem' }}>
        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#e9d5ff' }}>Party Invite</span>
        <UserPlus size={15} color="#c084fc" />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
        {friends.slice(0, 3).map((friend) => (
          <button
            key={friend.id}
            onClick={() => social?.inviteToRoom?.(friend.id)}
            style={{
              textAlign: 'left',
              borderRadius: '10px',
              border: '1px solid rgba(192, 132, 252, 0.35)',
              background: 'rgba(168, 85, 247, 0.12)',
              color: '#fdf2f8',
              padding: '0.5rem 0.65rem',
              cursor: 'pointer',
              fontSize: '0.75rem',
            }}
          >
            Invite {friend.name}
          </button>
        ))}
      </div>
    </div>
  );
}
