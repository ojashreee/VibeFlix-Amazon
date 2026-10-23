import React, { useMemo, useState } from 'react';
import { X, Play, Calendar, Search, Check, Users, Lock } from 'lucide-react';
import { Avatar, glass, primaryBtn, ghostBtn, inputStyle, sectionLabel, slimMovie } from './socialShared';

const pad = (n) => String(n).padStart(2, '0');
const toLocalInput = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
const tomorrowEvening = () => { const d = new Date(Date.now() + 24 * 3600e3); d.setHours(20, 0, 0, 0); return toLocalInput(d); };

export function ScheduleModal({ social, contentPool, preset = {}, onClose, onGoToLounge }) {
  const [mode, setMode] = useState(preset.mode || 'later'); // 'now' | 'later'
  const [movie, setMovie] = useState(preset.movie || null);
  const [selected, setSelected] = useState(() => new Set(preset.friendId ? [preset.friendId] : []));
  const [when, setWhen] = useState(tomorrowEvening);
  const [note, setNote] = useState('');
  const [controlMode, setControlMode] = useState('everyone');
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');

  const movies = useMemo(() => {
    const q = query.trim().toLowerCase();
    return contentPool.filter((m) => m.title && (!q || m.title.toLowerCase().includes(q)));
  }, [contentPool, query]);

  const toggle = (id) => setSelected((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const ready = movie && selected.size > 0;

  const submit = () => {
    setError('');
    if (!ready) return;
    const payload = { movie: slimMovie(movie), invitees: [...selected], controlMode };
    if (mode === 'now') {
      if (social.startRoom(payload)) onClose();
      return;
    }
    const startAt = new Date(when).getTime();
    if (!Number.isFinite(startAt) || startAt < Date.now()) { setError('Pick a time in the future.'); return; }
    if (social.createEvent({ ...payload, startAt, note: note.trim() })) onClose();
  };

  const seg = (id, label, Icon) => (
    <button onClick={() => setMode(id)} style={{
      flex: 1, ...ghostBtn, padding: '0.55rem', backgroundColor: mode === id ? 'rgba(168,85,247,0.3)' : 'rgba(255,255,255,0.04)',
      borderColor: mode === id ? '#c084fc' : 'rgba(168,85,247,0.2)', color: mode === id ? '#fff' : '#c4b5fd',
    }}><Icon size={14} /> {label}</button>
  );

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 95, backgroundColor: 'rgba(5, 2, 14, 0.88)', backdropFilter: 'blur(20px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'max(1rem, 2.5vw)' }}>
      <div onClick={(e) => e.stopPropagation()} className="animate-fadeIn" role="dialog" aria-label="Watch together" style={{
        width: '100%', maxWidth: 940, maxHeight: '90vh', borderRadius: 24, backgroundColor: 'rgba(13, 6, 26, 0.98)', border: '1px solid rgba(168, 85, 247, 0.4)',
        boxShadow: '0 25px 80px rgba(0,0,0,0.9), 0 0 45px rgba(147,51,234,0.4)', display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>
        <div style={{ padding: '1.1rem 1.5rem', borderBottom: '1px solid rgba(168,85,247,0.25)', backgroundColor: 'rgba(26,12,54,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>Watch together</h3>
            <p style={{ fontSize: '0.76rem', color: '#c4b5fd' }}>Everyone streams on their own device. Playback stays in sync.</p>
          </div>
          <button onClick={onClose} aria-label="Close" style={{ ...ghostBtn, width: 36, height: 36, borderRadius: '50%', padding: 0 }}><X size={18} /></button>
        </div>

        {social.friends.length === 0 ? (
          <div style={{ padding: '3rem 1.5rem', textAlign: 'center' }}>
            <Users size={42} color="#a78bfa" style={{ opacity: 0.6, marginBottom: '0.8rem' }} />
            <h4 style={{ color: '#fff', fontSize: '1.05rem', marginBottom: '0.4rem' }}>Add a friend first</h4>
            <p style={{ fontSize: '0.84rem', color: '#8b7ca6', maxWidth: 380, margin: '0 auto 1.2rem', lineHeight: 1.5 }}>
              Swap friend codes in the Vibe Lounge, then come back to pick a movie together.
            </p>
            <button onClick={() => { onClose(); onGoToLounge?.(); }} style={primaryBtn}>Open Vibe Lounge</button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.25fr) minmax(280px, 1fr)', minHeight: 0, flex: 1 }}>
            {/* Movie picker */}
            <div style={{ padding: '1.1rem 1.25rem', borderRight: '1px solid rgba(168,85,247,0.2)', display: 'flex', flexDirection: 'column', gap: '0.8rem', minHeight: 0 }}>
              <span style={sectionLabel}>1. Choose a movie</span>
              <div style={{ position: 'relative' }}>
                <Search size={15} color="#a78bfa" style={{ position: 'absolute', left: 12, top: 13 }} />
                <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search titles" aria-label="Search titles" style={{ ...inputStyle, paddingLeft: '2.2rem' }} />
              </div>
              <div style={{ overflowY: 'auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(135px, 1fr))', gap: '0.65rem', alignContent: 'start', paddingRight: 4 }}>
                {movies.map((m) => {
                  const on = movie?.id === m.id;
                  return (
                    <button key={m.id} onClick={() => setMovie(m)} aria-pressed={on} style={{
                      borderRadius: 12, overflow: 'hidden', textAlign: 'left', backgroundColor: 'rgba(26,12,54,0.8)', cursor: 'pointer',
                      border: on ? '2px solid #c084fc' : '1px solid rgba(168,85,247,0.25)', boxShadow: on ? '0 0 18px rgba(168,85,247,0.55)' : 'none',
                    }}>
                      <div style={{ position: 'relative', height: 78 }}>
                        <img src={m.image || m.backdrop} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        {on && <span style={{ position: 'absolute', top: 6, right: 6, width: 22, height: 22, borderRadius: '50%', backgroundColor: '#a855f7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Check size={13} color="#fff" /></span>}
                      </div>
                      <span style={{ display: 'block', padding: '0.4rem 0.55rem', fontSize: '0.74rem', fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Options */}
            <div style={{ padding: '1.1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.9rem', overflowY: 'auto' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {seg('now', 'Start now', Play)}
                {seg('later', 'Pick a date', Calendar)}
              </div>

              <div>
                <span style={sectionLabel}>2. Who's coming</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', marginTop: '0.5rem' }}>
                  {social.friends.map((f) => {
                    const on = selected.has(f.id);
                    return (
                      <button key={f.id} onClick={() => toggle(f.id)} aria-pressed={on} style={{
                        display: 'flex', alignItems: 'center', gap: '0.45rem', padding: '0.3rem 0.7rem 0.3rem 0.3rem', borderRadius: 999, cursor: 'pointer',
                        backgroundColor: on ? 'rgba(168,85,247,0.3)' : 'rgba(255,255,255,0.05)', border: on ? '1px solid #c084fc' : '1px solid rgba(168,85,247,0.2)',
                        color: on ? '#fff' : '#c4b5fd', fontSize: '0.8rem', fontWeight: 600,
                      }}>
                        <Avatar user={f} size={24} showDot /> {f.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {mode === 'later' && (
                <div>
                  <span style={sectionLabel}>3. When</span>
                  <input type="datetime-local" value={when} min={toLocalInput(new Date())} onChange={(e) => setWhen(e.target.value)} style={{ ...inputStyle, marginTop: '0.5rem' }} />
                  <input value={note} onChange={(e) => setNote(e.target.value)} maxLength={120} placeholder="Add a note (optional)" style={{ ...inputStyle, marginTop: '0.5rem' }} />
                  <p style={{ fontSize: '0.7rem', color: '#8b7ca6', marginTop: '0.4rem' }}>Shown in each person's own time zone. The room opens 10 minutes early.</p>
                </div>
              )}

              <div>
                <span style={sectionLabel}>{mode === 'later' ? '4.' : '3.'} Playback controls</span>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  {[{ id: 'everyone', label: 'Everyone', Icon: Users }, { id: 'host', label: 'Only me', Icon: Lock }].map(({ id, label, Icon }) => (
                    <button key={id} onClick={() => setControlMode(id)} aria-pressed={controlMode === id} style={{
                      flex: 1, ...ghostBtn, backgroundColor: controlMode === id ? 'rgba(168,85,247,0.3)' : 'rgba(255,255,255,0.04)',
                      borderColor: controlMode === id ? '#c084fc' : 'rgba(168,85,247,0.2)', color: controlMode === id ? '#fff' : '#c4b5fd',
                    }}><Icon size={13} /> {label}</button>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: 'auto' }}>
                {error && <p role="alert" style={{ color: '#fca5a5', fontSize: '0.76rem', marginBottom: '0.5rem' }}>{error}</p>}
                <button onClick={submit} disabled={!ready} style={{ ...primaryBtn, width: '100%', padding: '0.8rem', fontSize: '0.9rem', opacity: ready ? 1 : 0.45, cursor: ready ? 'pointer' : 'not-allowed' }}>
                  {mode === 'now' ? <><Play size={15} fill="#fff" /> Start room and invite</> : <><Calendar size={15} /> Send invites</>}
                </button>
                {!ready && <p style={{ fontSize: '0.72rem', color: '#8b7ca6', textAlign: 'center', marginTop: '0.4rem' }}>Choose a movie and at least one friend.</p>}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
