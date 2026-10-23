import React from 'react';
import { CheckCircle2, Bookmark, Sparkles, Tv } from 'lucide-react';

export function ToastNotification({ toast }) {
  if (!toast) return null;

  return (
    <div 
      className="glass-panel-glow animate-fadeIn"
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 110,
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.85rem 1.4rem',
        borderRadius: '16px',
        backgroundColor: 'rgba(18, 8, 38, 0.95)',
        border: '1px solid #c084fc',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.8), 0 0 25px rgba(168, 85, 247, 0.6)',
        color: '#ffffff',
        fontSize: '0.88rem',
        fontWeight: 600,
        pointerEvents: 'none',
      }}
    >
      <div style={{
        width: '28px',
        height: '28px',
        borderRadius: '50%',
        backgroundColor: 'rgba(168, 85, 247, 0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {toast.type === 'watchlist' && <Bookmark size={16} color="#c084fc" />}
        {toast.type === 'profile' && <Sparkles size={16} color="#e879f9" />}
        {toast.type === 'live' && <Tv size={16} color="#38bdf8" />}
        {!toast.type && <CheckCircle2 size={16} color="#34d399" />}
      </div>
      <span>{toast.message}</span>
    </div>
  );
}
