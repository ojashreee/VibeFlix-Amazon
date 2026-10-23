import React from 'react';
import { Sparkles, Flame, Tv, Film, Compass, Bookmark, ShieldAlert, Zap } from 'lucide-react';

export function CategoryFilterBar({ selectedCategory, onSelectCategory }) {
  const categories = [
    { id: 'all', label: 'All Titles', icon: Compass },
    { id: 'top10', label: 'Top 10 Today', icon: Flame },
    { id: 'originals', label: 'Violet Originals', icon: Sparkles },
    { id: 'live', label: 'Fire TV Live Channels', icon: Tv },
    { id: 'scifi', label: 'Sci-Fi & Cyber', icon: Zap },
    { id: 'action', label: 'Action & Thrillers', icon: Film },
    { id: 'mylist', label: 'My Watchlist', icon: Bookmark },
  ];

  return (
    <div style={{
      padding: '0.75rem max(1.5rem, 4vw)',
      overflowX: 'auto',
      display: 'flex',
      alignItems: 'center',
      gap: '0.65rem',
      scrollbarWidth: 'none',
      msOverflowStyle: 'none',
      position: 'relative',
      zIndex: 25,
      marginTop: '-1rem',
      marginBottom: '1rem',
    }}
    className="no-scrollbar"
    >
      {categories.map((cat) => {
        const Icon = cat.icon;
        const isSelected = selectedCategory === cat.id;

        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.55rem 1.15rem',
              borderRadius: '999px',
              fontSize: '0.86rem',
              fontWeight: isSelected ? 700 : 500,
              whiteSpace: 'nowrap',
              backgroundColor: isSelected 
                ? 'rgba(168, 85, 247, 0.28)' 
                : 'rgba(26, 12, 54, 0.65)',
              border: isSelected 
                ? '1px solid #c084fc' 
                : '1px solid rgba(168, 85, 247, 0.2)',
              color: isSelected ? '#ffffff' : '#c4b5fd',
              boxShadow: isSelected 
                ? '0 0 20px rgba(168, 85, 247, 0.45)' 
                : 'none',
              backdropFilter: 'blur(12px)',
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              if (!isSelected) {
                e.currentTarget.style.backgroundColor = 'rgba(168, 85, 247, 0.18)';
                e.currentTarget.style.color = '#ffffff';
                e.currentTarget.style.borderColor = 'rgba(192, 132, 252, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isSelected) {
                e.currentTarget.style.backgroundColor = 'rgba(26, 12, 54, 0.65)';
                e.currentTarget.style.color = '#c4b5fd';
                e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.2)';
              }
            }}
          >
            <Icon size={15} color={isSelected ? '#c084fc' : '#a78bfa'} />
            <span>{cat.label}</span>
          </button>
        );
      })}
    </div>
  );
}
