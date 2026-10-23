import React from 'react';

export const JOIN_WINDOW_MS = 10 * 60 * 1000; // matches the server: rooms open 10 min before a watch date

export const glass = {
  backgroundColor: 'rgba(26, 12, 54, 0.75)',
  border: '1px solid rgba(168, 85, 247, 0.25)',
  borderRadius: '16px',
};
export const primaryBtn = {
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.45rem',
  padding: '0.6rem 1.1rem', borderRadius: '10px',
  background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)', color: '#ffffff',
  fontSize: '0.82rem', fontWeight: 700, boxShadow: '0 0 15px rgba(168, 85, 247, 0.45)', cursor: 'pointer',
};
export const ghostBtn = {
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
  padding: '0.5rem 0.9rem', borderRadius: '10px', backgroundColor: 'rgba(255, 255, 255, 0.06)',
  border: '1px solid rgba(168, 85, 247, 0.3)', color: '#e9d5ff', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer',
};
export const inputStyle = {
  width: '100%', padding: '0.7rem 0.9rem', borderRadius: '10px', backgroundColor: 'rgba(26, 12, 54, 0.85)',
  border: '1px solid rgba(168, 85, 247, 0.35)', color: '#ffffff', fontSize: '0.88rem', colorScheme: 'dark',
};
export const sectionLabel = {
  fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#a78bfa',
};

export function Avatar({ user, size = 36, showDot = false }) {
  const color = user?.color || '#a855f7';
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      {user?.avatar ? (
        <img src={user.avatar} alt={user.name || ''} style={{
          width: size, height: size, borderRadius: '50%', objectFit: 'cover', border: `2px solid ${color}`, backgroundColor: '#1a0c36',
        }} />
      ) : (
        <div style={{
          width: size, height: size, borderRadius: '50%', border: `2px solid ${color}`, backgroundColor: `${color}30`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: size * 0.4,
        }}>
          {(user?.name || '?')[0]}
        </div>
      )}
      {showDot && (
        <span style={{
          position: 'absolute', bottom: -1, right: -1, width: Math.max(9, size * 0.28), height: Math.max(9, size * 0.28),
          borderRadius: '50%', backgroundColor: user?.online ? '#34d399' : '#4a3b66', border: '2px solid #0c061a',
        }} />
      )}
    </div>
  );
}

export const formatWhen = (ms) =>
  new Date(ms).toLocaleString([], { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });

export function untilLabel(startAt, now) {
  const diff = startAt - now;
  if (diff <= -3 * 3600e3) return 'Ended';
  if (diff <= 0) return 'Started';
  if (diff < 60e3) return 'Starting now';
  const mins = Math.round(diff / 60e3);
  if (mins < 60) return `in ${mins} min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `in ${hrs}h ${mins % 60}m`;
  const days = Math.floor(hrs / 24);
  return `in ${days} day${days > 1 ? 's' : ''}`;
}

export const formatClock = (secs) => {
  if (!Number.isFinite(secs) || secs < 0) return '0:00';
  const h = Math.floor(secs / 3600); const m = Math.floor((secs % 3600) / 60); const s = Math.floor(secs % 60);
  return h ? `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}` : `${m}:${String(s).padStart(2, '0')}`;
};

export const slimMovie = (m) => ({
  id: m.id,
  title: m.title,
  subtitle: m.subtitle || (m.genres || []).join(' • ') || '',
  videoUrl: m.videoUrl || '',
  backdrop: m.backdrop || m.image || '',
  image: m.image || m.backdrop || '',
});
