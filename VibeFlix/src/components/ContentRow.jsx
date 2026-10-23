import React, { useRef, useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Plus, 
  Check, 
  ThumbsUp, 
  Info, 
  Radio, 
  Sparkles,
  Flame,
  Volume2
} from 'lucide-react';

export function ContentRow({ 
  title, 
  subtitle,
  items = [], 
  rowType = 'standard', // 'standard' | 'continue' | 'top10' | 'channel'
  onPlayItem, 
  onOpenDetails, 
  myList = [], 
  onToggleMyList 
}) {
  const scrollRef = useRef(null);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 20);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 20);
    }
  };

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const scrollAmount = direction === 'left' ? -clientWidth * 0.75 : clientWidth * 0.75;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      setTimeout(checkScroll, 350);
    }
  };

  if (!items || items.length === 0) return null;

  return (
    <section style={{
      position: 'relative',
      padding: '1.25rem 0',
      marginBottom: '1rem',
      overflow: 'visible',
    }}>
      {/* Row Header */}
      <div style={{
        paddingLeft: 'max(1.5rem, 4vw)',
        paddingRight: 'max(1.5rem, 4vw)',
        marginBottom: '0.85rem',
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <h2 style={{
            fontSize: 'clamp(1.15rem, 2vw, 1.45rem)',
            fontWeight: 800,
            color: '#ffffff',
            letterSpacing: '-0.02em',
          }}>
            {title}
          </h2>
          {subtitle && (
            <span style={{ fontSize: '0.78rem', color: '#c084fc', fontWeight: 600 }}>
              {subtitle}
            </span>
          )}
        </div>

        <button 
          onClick={() => handleScroll('right')}
          style={{
            fontSize: '0.78rem',
            color: '#a78bfa',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '0.2rem',
            transition: 'color 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#c084fc'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#a78bfa'}
        >
          <span>Explore All</span>
          <ChevronRight size={14} />
        </button>
      </div>

      {/* Horizontal Carousel Container */}
      <div style={{ position: 'relative', overflow: 'visible' }}>
        
        {/* Left Arrow Button */}
        {canScrollLeft && (
          <button
            onClick={() => handleScroll('left')}
            style={{
              position: 'absolute',
              top: '50%',
              left: '0.5rem',
              transform: 'translateY(-50%)',
              zIndex: 30,
              width: '44px',
              height: '80%',
              maxHeight: '180px',
              backgroundColor: 'rgba(12, 6, 26, 0.85)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(168, 85, 247, 0.35)',
              borderRadius: '12px',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 0 20px rgba(0,0,0,0.8)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(147, 51, 234, 0.7)';
              e.currentTarget.style.boxShadow = '0 0 25px rgba(168, 85, 247, 0.7)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(12, 6, 26, 0.85)';
              e.currentTarget.style.boxShadow = '0 0 20px rgba(0,0,0,0.8)';
            }}
            title="Scroll left"
          >
            <ChevronLeft size={26} />
          </button>
        )}

        {/* Right Arrow Button */}
        {canScrollRight && (
          <button
            onClick={() => handleScroll('right')}
            style={{
              position: 'absolute',
              top: '50%',
              right: '0.5rem',
              transform: 'translateY(-50%)',
              zIndex: 30,
              width: '44px',
              height: '80%',
              maxHeight: '180px',
              backgroundColor: 'rgba(12, 6, 26, 0.85)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(168, 85, 247, 0.35)',
              borderRadius: '12px',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 0 20px rgba(0,0,0,0.8)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(147, 51, 234, 0.7)';
              e.currentTarget.style.boxShadow = '0 0 25px rgba(168, 85, 247, 0.7)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(12, 6, 26, 0.85)';
              e.currentTarget.style.boxShadow = '0 0 20px rgba(0,0,0,0.8)';
            }}
            title="Scroll right"
          >
            <ChevronRight size={26} />
          </button>
        )}

        {/* Scrollable Track */}
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="no-scrollbar"
          style={{
            display: 'flex',
            alignItems: 'stretch',
            gap: '1.1rem',
            overflowX: 'auto',
            paddingLeft: 'max(1.5rem, 4vw)',
            paddingRight: 'max(1.5rem, 4vw)',
            paddingTop: '0.75rem',
            paddingBottom: '1.25rem',
            scrollBehavior: 'smooth',
          }}
        >
          {items.map((item, idx) => {
            const isSaved = myList.some((m) => m.id === item.id);
            const isHovered = hoveredItem === item.id;

            /* ========================================================
               VARIANT 1: TOP 10 TODAY (Netflix Giant Number + Card)
               ======================================================== */
            if (rowType === 'top10') {
              return (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    flex: '0 0 auto',
                    position: 'relative',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  {/* Giant Stylized Rank Number */}
                  <div style={{
                    fontSize: 'clamp(5rem, 9vw, 8rem)',
                    fontWeight: 900,
                    lineHeight: 0.8,
                    fontFamily: 'var(--font-display)',
                    background: 'linear-gradient(180deg, #c084fc 0%, #7e22ce 55%, #180c34 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    WebkitTextStroke: '2px rgba(192, 132, 252, 0.7)',
                    userSelect: 'none',
                    marginRight: '-1.5rem',
                    zIndex: 2,
                    filter: 'drop-shadow(0 0 15px rgba(147, 51, 234, 0.4))',
                  }}>
                    {item.rank}
                  </div>

                  {/* Card Thumbnail */}
                  <div
                    style={{
                      width: 'clamp(150px, 16vw, 190px)',
                      height: 'clamp(220px, 24vw, 280px)',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      position: 'relative',
                      border: isHovered ? '2px solid #c084fc' : '1px solid rgba(168, 85, 247, 0.25)',
                      transform: isHovered ? 'scale(1.06) translateY(-4px)' : 'none',
                      transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                      boxShadow: isHovered 
                        ? '0 12px 35px rgba(147, 51, 234, 0.6), 0 0 20px rgba(192, 132, 252, 0.5)' 
                        : '0 4px 15px rgba(0,0,0,0.5)',
                      backgroundColor: '#160b30',
                      zIndex: 3,
                    }}
                    onClick={() => onOpenDetails(item)}
                  >
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    
                    {/* Gradient Overlay */}
                    <div style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      top: '40%',
                      background: 'linear-gradient(to top, #090415 0%, rgba(9, 4, 21, 0.6) 60%, transparent 100%)',
                    }} />

                    {/* Top Badges */}
                    {item.isOriginal && (
                      <span style={{
                        position: 'absolute',
                        top: '8px',
                        left: '8px',
                        backgroundColor: 'rgba(147, 51, 234, 0.9)',
                        color: '#ffffff',
                        fontSize: '0.62rem',
                        fontWeight: 800,
                        padding: '0.15rem 0.45rem',
                        borderRadius: '6px',
                        letterSpacing: '0.04em',
                      }}>
                        VIBEFLIX
                      </span>
                    )}

                    {/* Card Footer Info */}
                    <div style={{
                      position: 'absolute',
                      bottom: '10px',
                      left: '10px',
                      right: '10px',
                    }}>
                      <h4 style={{
                        fontSize: '0.9rem',
                        fontWeight: 700,
                        color: '#ffffff',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}>
                        {item.title}
                      </h4>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.2rem' }}>
                        <span style={{ color: '#34d399', fontSize: '0.72rem', fontWeight: 700 }}>{item.rating}</span>
                        <span style={{ color: '#c084fc', fontSize: '0.68rem', fontWeight: 600 }}>{item.quality}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }

            /* ========================================================
               VARIANT 2: FIRE TV LIVE CHANNELS
               ======================================================== */
            if (rowType === 'channel') {
              return (
                <div
                  key={item.id}
                  style={{
                    flex: '0 0 auto',
                    width: 'clamp(240px, 22vw, 300px)',
                    borderRadius: '18px',
                    backgroundColor: 'rgba(24, 12, 48, 0.8)',
                    backdropFilter: 'blur(16px)',
                    border: isHovered ? '2px solid #c084fc' : '1px solid rgba(168, 85, 247, 0.25)',
                    transform: isHovered ? 'scale(1.05) translateY(-4px)' : 'none',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    boxShadow: isHovered ? '0 12px 35px rgba(147, 51, 234, 0.5)' : '0 4px 15px rgba(0,0,0,0.4)',
                    overflow: 'hidden',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                  onClick={() => onPlayItem(item)}
                >
                  {/* Thumbnail with Live Badge */}
                  <div style={{ position: 'relative', height: '140px', overflow: 'hidden' }}>
                    <img 
                      src={item.thumbnail} 
                      alt={item.name} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    
                    {/* Live Dot Badge */}
                    <div style={{
                      position: 'absolute',
                      top: '10px',
                      left: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      backgroundColor: 'rgba(239, 68, 68, 0.9)',
                      color: '#ffffff',
                      fontSize: '0.66rem',
                      fontWeight: 800,
                      padding: '0.2rem 0.5rem',
                      borderRadius: '6px',
                      boxShadow: '0 0 10px rgba(239, 68, 68, 0.6)',
                    }}>
                      <span style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: '#ffffff',
                        animation: 'livePulse 1.5s infinite',
                      }} />
                      <span>{item.badge}</span>
                    </div>

                    <span style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      backgroundColor: 'rgba(12, 6, 26, 0.75)',
                      backdropFilter: 'blur(8px)',
                      color: '#c4b5fd',
                      fontSize: '0.68rem',
                      fontWeight: 600,
                      padding: '0.2rem 0.5rem',
                      borderRadius: '6px',
                    }}>
                      Ch. {item.channelNumber}
                    </span>

                    {/* Play Overlay */}
                    {isHovered && (
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundColor: 'rgba(147, 51, 234, 0.35)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <div style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '50%',
                          backgroundColor: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 0 20px rgba(168, 85, 247, 0.8)',
                        }}>
                          <Play size={20} fill="#9333ea" color="#9333ea" style={{ marginLeft: '2px' }} />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Channel Details */}
                  <div style={{ padding: '0.9rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                      <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#ffffff' }}>
                        {item.name}
                      </h4>
                      <span style={{ fontSize: '0.7rem', color: '#c084fc', fontWeight: 600 }}>
                        {item.viewers} watching
                      </span>
                    </div>

                    <p style={{
                      fontSize: '0.78rem',
                      color: '#cbd5e1',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      marginBottom: '0.65rem',
                    }}>
                      {item.currentShow}
                    </p>

                    {/* Live Progress Bar */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{
                        flex: 1,
                        height: '4px',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '999px',
                        overflow: 'hidden',
                      }}>
                        <div style={{
                          width: `${item.progress}%`,
                          height: '100%',
                          background: 'linear-gradient(90deg, #9333ea, #e879f9)',
                        }} />
                      </div>
                      <span style={{ fontSize: '0.66rem', color: '#94a3b8' }}>
                        {item.timeRemaining}
                      </span>
                    </div>
                  </div>
                </div>
              );
            }

            /* ========================================================
               VARIANT 3: CONTINUE WATCHING (With Progress Scrubber)
               ======================================================== */
            if (rowType === 'continue') {
              return (
                <div
                  key={item.id}
                  style={{
                    flex: '0 0 auto',
                    width: 'clamp(240px, 22vw, 300px)',
                    borderRadius: '16px',
                    backgroundColor: 'rgba(24, 12, 48, 0.85)',
                    border: isHovered ? '2px solid #c084fc' : '1px solid rgba(168, 85, 247, 0.22)',
                    overflow: 'hidden',
                    transform: isHovered ? 'scale(1.05) translateY(-4px)' : 'none',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    boxShadow: isHovered ? '0 12px 35px rgba(147, 51, 234, 0.5)' : '0 4px 15px rgba(0,0,0,0.4)',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <div style={{ position: 'relative', height: '145px' }} onClick={() => onPlayItem(item)}>
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    
                    {/* Resume Play Icon */}
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundColor: 'rgba(10, 4, 22, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: isHovered ? 1 : 0.7,
                      transition: 'opacity 0.2s',
                    }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(168, 85, 247, 0.9)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 0 20px rgba(192, 132, 252, 0.8)',
                      }}>
                        <Play size={18} fill="#ffffff" color="#ffffff" style={{ marginLeft: '2px' }} />
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '5px',
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    }}>
                      <div style={{
                        width: `${item.progress}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, #9333ea, #c084fc, #f43f5e)',
                        boxShadow: '0 0 8px #c084fc',
                      }} />
                    </div>
                  </div>

                  <div style={{ padding: '0.85rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#ffffff' }}>
                        {item.title}
                      </h4>
                      <span style={{ fontSize: '0.7rem', color: '#c084fc', fontWeight: 600 }}>
                        {item.timeLeft}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.76rem', color: '#c4b5fd' }}>
                      {item.subtitle}
                    </span>
                  </div>
                </div>
              );
            }

            /* ========================================================
               VARIANT 4: STANDARD CARD (16:9 Landscape with Popout Info)
               ======================================================== */
            return (
              <div
                key={item.id}
                style={{
                  flex: '0 0 auto',
                  width: 'clamp(210px, 20vw, 270px)',
                  borderRadius: '16px',
                  backgroundColor: 'rgba(24, 12, 48, 0.8)',
                  backdropFilter: 'blur(16px)',
                  border: isHovered ? '2px solid #c084fc' : '1px solid rgba(168, 85, 247, 0.22)',
                  overflow: 'hidden',
                  transform: isHovered ? 'scale(1.06) translateY(-4px)' : 'none',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  boxShadow: isHovered 
                    ? '0 15px 40px rgba(147, 51, 234, 0.55), 0 0 20px rgba(192, 132, 252, 0.4)' 
                    : '0 4px 15px rgba(0,0,0,0.4)',
                  cursor: 'pointer',
                  position: 'relative',
                  zIndex: isHovered ? 20 : 1,
                }}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                {/* Poster / Backdrop Image */}
                <div 
                  style={{ position: 'relative', height: '145px', overflow: 'hidden' }}
                  onClick={() => onOpenDetails(item)}
                >
                  <img 
                    src={item.image || item.backdrop} 
                    alt={item.title} 
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover',
                      transform: isHovered ? 'scale(1.08)' : 'none',
                      transition: 'transform 0.4s ease',
                    }}
                  />

                  {/* Gradient Scrim */}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(9, 4, 21, 0.95) 0%, rgba(9, 4, 21, 0.2) 60%, transparent 100%)',
                  }} />

                  {/* Top Badges */}
                  <div style={{ position: 'absolute', top: '8px', left: '8px', display: 'flex', gap: '0.35rem' }}>
                    {item.isOriginal && (
                      <span style={{
                        backgroundColor: '#7c3aed',
                        color: '#ffffff',
                        fontSize: '0.62rem',
                        fontWeight: 800,
                        padding: '0.15rem 0.45rem',
                        borderRadius: '4px',
                        letterSpacing: '0.04em',
                      }}>
                        VIBEFLIX
                      </span>
                    )}
                    {item.quality && (
                      <span style={{
                        backgroundColor: 'rgba(12, 6, 26, 0.75)',
                        backdropFilter: 'blur(8px)',
                        color: '#c084fc',
                        fontSize: '0.62rem',
                        fontWeight: 700,
                        padding: '0.15rem 0.45rem',
                        borderRadius: '4px',
                        border: '1px solid rgba(192, 132, 252, 0.3)',
                      }}>
                        {item.quality}
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Metadata & Action Buttons */}
                <div style={{ padding: '0.85rem' }}>
                  
                  {/* Title */}
                  <h4 
                    onClick={() => onOpenDetails(item)}
                    style={{
                      fontSize: '0.92rem',
                      fontWeight: 700,
                      color: '#ffffff',
                      marginBottom: '0.4rem',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {item.title}
                  </h4>

                  {/* Action Buttons Row */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: '0.5rem',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {/* Play Button */}
                      <button
                        onClick={() => onPlayItem(item)}
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          backgroundColor: '#a855f7',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#ffffff',
                          boxShadow: '0 0 12px rgba(168, 85, 247, 0.6)',
                          transition: 'transform 0.2s',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}
                        title="Play"
                      >
                        <Play size={15} fill="#ffffff" color="#ffffff" style={{ marginLeft: '1px' }} />
                      </button>

                      {/* Add to List */}
                      <button
                        onClick={() => onToggleMyList(item)}
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          backgroundColor: isSaved ? 'rgba(168, 85, 247, 0.25)' : 'rgba(255, 255, 255, 0.08)',
                          border: isSaved ? '1px solid #c084fc' : '1px solid rgba(255, 255, 255, 0.2)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: isSaved ? '#c084fc' : '#c4b5fd',
                          transition: 'all 0.2s',
                        }}
                        title={isSaved ? 'Remove from My List' : 'Add to My List'}
                      >
                        {isSaved ? <Check size={15} /> : <Plus size={15} />}
                      </button>

                      {/* More Info */}
                      <button
                        onClick={() => onOpenDetails(item)}
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          backgroundColor: 'rgba(255, 255, 255, 0.08)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#c4b5fd',
                          transition: 'all 0.2s',
                        }}
                        title="More Info"
                      >
                        <Info size={15} />
                      </button>
                    </div>

                    {/* Match Score */}
                    <span style={{ fontSize: '0.74rem', color: '#34d399', fontWeight: 800 }}>
                      {item.rating || '96% Match'}
                    </span>
                  </div>

                  {/* Genre Pills */}
                  {item.genres && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.6rem', flexWrap: 'nowrap', overflow: 'hidden' }}>
                      {item.genres.slice(0, 2).map((g, i) => (
                        <span 
                          key={i} 
                          style={{
                            fontSize: '0.65rem',
                            color: '#c4b5fd',
                            backgroundColor: 'rgba(168, 85, 247, 0.12)',
                            padding: '0.1rem 0.4rem',
                            borderRadius: '4px',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {g}
                        </span>
                      ))}
                      {item.duration && (
                        <span style={{ fontSize: '0.65rem', color: '#94a3b8', marginLeft: 'auto' }}>
                          {item.duration}
                        </span>
                      )}
                    </div>
                  )}

                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
