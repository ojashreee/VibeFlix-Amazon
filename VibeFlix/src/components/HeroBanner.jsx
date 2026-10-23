import React, { useState, useEffect } from 'react';
import { 
  Users,
  Play, 
  Info, 
  Plus, 
  Check, 
  Volume2, 
  VolumeX, 
  Flame, 
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { HERO_FEATURED } from '../data/mockData';

export function HeroBanner({ 
  onPlayMovie, 
  onOpenDetails, 
  myList = [], 
  onToggleMyList,
  onWatchTogether 
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const movie = HERO_FEATURED[currentIndex];
  const isInList = myList.some((item) => item.id === movie.id);

  // Auto-cycle hero every 12 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HERO_FEATURED.length);
    }, 12000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      minHeight: '82vh',
      display: 'flex',
      alignItems: 'center',
      overflow: 'hidden',
      paddingLeft: 'max(1.5rem, 4vw)',
      paddingRight: 'max(1.5rem, 4vw)',
      paddingTop: '6rem',
      paddingBottom: '4rem',
    }}>
      {/* Background Image with Dynamic Fade */}
      <div 
        key={movie.id}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url(${movie.backdrop})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 25%',
          animation: 'fadeIn 0.8s ease-out forwards',
          zIndex: 0,
        }}
      />

      {/* Cinematic Purple Vignettes & Ambient Overlays */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          linear-gradient(to top, #070312 0%, rgba(7, 3, 18, 0.95) 12%, rgba(7, 3, 18, 0.6) 45%, transparent 90%),
          linear-gradient(to right, #070312 0%, rgba(7, 3, 18, 0.9) 35%, rgba(7, 3, 18, 0.4) 65%, transparent 100%),
          radial-gradient(ellipse 60% 45% at 20% 40%, rgba(147, 51, 234, 0.30), transparent 70%),
          radial-gradient(ellipse 45% 40% at 75% 35%, rgba(236, 72, 153, 0.16), transparent 75%)
        `,
        zIndex: 1,
      }} />

      {/* Hero Content */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        maxWidth: '720px',
        animation: 'fadeIn 0.6s ease-out forwards',
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginBottom: '1.25rem',
          padding: '0.55rem 0.9rem',
          borderRadius: '999px',
          background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(236, 72, 153, 0.18))',
          border: '1px solid rgba(216, 180, 254, 0.4)',
          boxShadow: '0 0 24px rgba(168, 85, 247, 0.18)',
        }}>
          <Sparkles size={15} color="#f0abfc" />
          <span style={{
            fontSize: '0.76rem',
            fontWeight: 800,
            letterSpacing: '0.12em',
            background: 'linear-gradient(90deg, #e9d5ff, #f0abfc, #ffffff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            WATCH TOGETHER. VIBE FOREVER.
          </span>
        </div>

        {/* Top Badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          {movie.isOriginal && (
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              backgroundColor: 'rgba(168, 85, 247, 0.25)',
              border: '1px solid rgba(192, 132, 252, 0.5)',
              color: '#f3e8ff',
              fontSize: '0.75rem',
              fontWeight: 800,
              letterSpacing: '0.1em',
              padding: '0.25rem 0.65rem',
              borderRadius: '999px',
              boxShadow: '0 0 15px rgba(168, 85, 247, 0.35)',
            }}>
              <Sparkles size={13} color="#c084fc" />
              <span>VIBEFLIX ORIGINAL</span>
            </span>
          )}

          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            backgroundColor: 'rgba(239, 68, 68, 0.2)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            color: '#fca5a5',
            fontSize: '0.75rem',
            fontWeight: 800,
            padding: '0.25rem 0.65rem',
            borderRadius: '999px',
          }}>
            <Flame size={13} color="#ef4444" />
            <span>{movie.rank}</span>
          </span>

          <span style={{
            color: '#34d399',
            fontSize: '0.85rem',
            fontWeight: 800,
            letterSpacing: '0.02em',
          }}>
            {movie.rating}
          </span>
        </div>

        {/* Title */}
        <h1 style={{
          fontSize: 'clamp(2.4rem, 5.5vw, 4.4rem)',
          fontWeight: 900,
          lineHeight: 1.05,
          letterSpacing: '-0.03em',
          marginBottom: '1rem',
          background: 'linear-gradient(to bottom right, #ffffff 40%, #e9d5ff 70%, #c084fc 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '0 4px 30px rgba(0, 0, 0, 0.8)',
        }}>
          {movie.title}
        </h1>

        {/* Metadata Specs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap', color: '#cbd5e1', fontSize: '0.84rem' }}>
          <span style={{
            padding: '0.15rem 0.5rem',
            borderRadius: '4px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            fontWeight: 700,
            fontSize: '0.75rem',
            color: '#ffffff',
          }}>
            {movie.maturity}
          </span>
          <span>{movie.duration}</span>
          <span style={{ color: '#8b7ca6' }}>•</span>
          <span style={{
            padding: '0.15rem 0.45rem',
            borderRadius: '4px',
            border: '1px solid rgba(192, 132, 252, 0.4)',
            color: '#c084fc',
            fontSize: '0.72rem',
            fontWeight: 700,
            letterSpacing: '0.04em',
          }}>
            {movie.quality}
          </span>
          <span style={{ color: '#8b7ca6' }}>•</span>
          <span style={{ color: '#e879f9', fontWeight: 600 }}>{movie.audio}</span>
        </div>

        {/* Synopsis */}
        <p style={{
          fontSize: 'clamp(0.92rem, 1.3vw, 1.08rem)',
          color: '#e2e8f0',
          lineHeight: 1.6,
          marginBottom: '1.75rem',
          maxWidth: '640px',
          textShadow: '0 2px 10px rgba(0,0,0,0.7)',
        }}>
          {movie.synopsis}
        </p>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          {/* Play Now Button */}
          <button
            onClick={() => onPlayMovie(movie)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.85rem 1.85rem',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #d946ef 100%)',
              color: '#ffffff',
              fontSize: '1rem',
              fontWeight: 800,
              letterSpacing: '0.02em',
              boxShadow: '0 0 30px rgba(168, 85, 247, 0.7), 0 4px 15px rgba(0,0,0,0.5)',
              transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05) translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 0 40px rgba(192, 132, 252, 0.9)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = '0 0 30px rgba(168, 85, 247, 0.7), 0 4px 15px rgba(0,0,0,0.5)';
            }}
          >
            <Play size={20} fill="#ffffff" color="#ffffff" />
            <span>Play Now</span>
          </button>

          {/* More Info Button */}
          <button
            onClick={() => onOpenDetails(movie)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.65rem',
              padding: '0.85rem 1.6rem',
              borderRadius: '14px',
              backgroundColor: 'rgba(26, 12, 54, 0.75)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(168, 85, 247, 0.35)',
              color: '#f8fafc',
              fontSize: '0.96rem',
              fontWeight: 700,
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(38, 18, 76, 0.9)';
              e.currentTarget.style.borderColor = '#c084fc';
              e.currentTarget.style.boxShadow = '0 0 20px rgba(168, 85, 247, 0.35)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(26, 12, 54, 0.75)';
              e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.35)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <Info size={19} color="#c084fc" />
            <span>More Info</span>
          </button>

          {/* Add to List Button */}
          <button
            onClick={() => onToggleMyList(movie)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.85rem 1.25rem',
              borderRadius: '14px',
              backgroundColor: isInList ? 'rgba(168, 85, 247, 0.3)' : 'rgba(255, 255, 255, 0.08)',
              border: isInList ? '1px solid #c084fc' : '1px solid rgba(255, 255, 255, 0.15)',
              color: isInList ? '#ffffff' : '#c4b5fd',
              fontSize: '0.92rem',
              fontWeight: 600,
              transition: 'all 0.2s',
            }}
            title={isInList ? 'Remove from My List' : 'Add to My List'}
          >
            {isInList ? <Check size={18} color="#c084fc" /> : <Plus size={18} />}
            <span>{isInList ? 'In Watchlist' : 'My List'}</span>
          </button>

          {/* Watch Together Button */}
          {onWatchTogether && (
            <button
              onClick={() => onWatchTogether(movie)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.85rem 1.25rem',
                borderRadius: '14px',
                backgroundColor: 'rgba(232, 121, 249, 0.14)',
                border: '1px solid rgba(232, 121, 249, 0.5)',
                color: '#f5d0fe',
                fontSize: '0.92rem',
                fontWeight: 600,
                transition: 'all 0.2s',
              }}
              title="Watch this with friends on their own devices"
            >
              <Users size={18} color="#e879f9" />
              <span>Watch Together</span>
            </button>
          )}
        </div>
      </div>

      {/* Right Controls: Audio Toggle & Feature Selector Dots */}
      <div style={{
        position: 'absolute',
        right: 'max(1.5rem, 4vw)',
        bottom: '3rem',
        zIndex: 20,
        display: 'flex',
        alignItems: 'center',
        gap: '1.25rem',
      }}>
        {/* Sound toggle button */}
        <button
          onClick={() => setIsMuted(!isMuted)}
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            backgroundColor: 'rgba(26, 12, 54, 0.75)',
            border: '1px solid rgba(168, 85, 247, 0.35)',
            color: '#c4b5fd',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(12px)',
            transition: 'all 0.2s',
          }}
          title={isMuted ? 'Unmute Audio Teaser' : 'Mute Audio Teaser'}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#ffffff';
            e.currentTarget.style.borderColor = '#c084fc';
            e.currentTarget.style.boxShadow = '0 0 15px rgba(168, 85, 247, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#c4b5fd';
            e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.35)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} color="#c084fc" />}
        </button>

        {/* Blockbuster Switcher Dots */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          backgroundColor: 'rgba(26, 12, 54, 0.6)',
          backdropFilter: 'blur(12px)',
          padding: '0.4rem 0.6rem',
          borderRadius: '999px',
          border: '1px solid rgba(168, 85, 247, 0.25)',
        }}>
          {HERO_FEATURED.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => setCurrentIndex(idx)}
              style={{
                width: idx === currentIndex ? '24px' : '8px',
                height: '8px',
                borderRadius: '999px',
                backgroundColor: idx === currentIndex ? '#c084fc' : 'rgba(255, 255, 255, 0.25)',
                transition: 'all 0.3s ease',
                boxShadow: idx === currentIndex ? '0 0 10px #c084fc' : 'none',
              }}
              title={item.title}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
