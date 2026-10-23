import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Search, 
  Bell, 
  User, 
  LogOut, 
  ChevronDown, 
  Tv, 
  Bookmark, 
  Sparkles,
  MessageSquare,
  Compass,
  Users,
  X
} from 'lucide-react';

export const Navbar = ({
  currentProfile, 
  onSwitchProfile, 
  onSignOut, 
  activeTab, 
  setActiveTab, 
  onOpenLiveGuide,
  searchQuery,
  setSearchQuery,
  myListCount = 0,
  notifications = [],
  socialBadge = 0,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'home', label: 'Home', icon: Sparkles },
    { id: 'live', label: 'Fire TV Live', icon: Tv, badge: 'LIVE' },
    {
      id: 'community',
      label: 'Vibe Lounge',
      icon: MessageSquare,
      badge: 'COMMUNITY',
      count: socialBadge,
    },
    { id: 'vibesearch', label: 'VibeSearch', icon: Compass, badge: 'AI' },
    { id: 'mylist', label: 'My List', icon: Bookmark, count: myListCount },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled 
          ? 'bg-[#090415]/90 backdrop-blur-xl border-b border-purple-500/20 py-3 shadow-[0_4px_30px_rgba(147,51,234,0.25)]' 
          : 'bg-gradient-to-b from-[#070312]/95 via-[#070312]/60 to-transparent py-4'
      }`}
      style={{
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        paddingLeft: 'max(1.5rem, 4vw)',
        paddingRight: 'max(1.5rem, 4vw)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem' }}>
        
        {/* Left: Brand Logo & Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
          
          {/* VibeFlix Logo */}
          <button 
            onClick={() => setActiveTab('home')}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.65rem', 
              textDecoration: 'none',
              cursor: 'pointer'
            }}
            title="VibeFlix Home"
          >
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #9333ea 0%, #c084fc 50%, #f43f5e 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 25px rgba(168, 85, 247, 0.75)',
              transform: 'rotate(-5deg)',
              transition: 'transform 0.2s ease',
            }}>
              <Play size={22} fill="#ffffff" color="#ffffff" style={{ marginLeft: '2px', transform: 'rotate(5deg)' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <span style={{ 
                fontFamily: 'var(--font-display)', 
                fontSize: '1.55rem', 
                fontWeight: 900, 
                letterSpacing: '0.03em',
                background: 'linear-gradient(to right, #ffffff 30%, #e9d5ff 60%, #c084fc 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                lineHeight: 1.1
              }}>
                VIBE<span style={{ color: '#f43f5e', WebkitTextFillColor: '#f43f5e' }}>FLIX</span>
              </span>
              <span style={{ 
                fontSize: '0.6rem', 
                letterSpacing: '0.22em', 
                textTransform: 'uppercase', 
                color: '#c4b5fd',
                fontWeight: 700,
                marginTop: '-1px'
              }}>
                Feel it. Find it. Vibe with it.
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => {
                    if (link.id === 'live') {
                      onOpenLiveGuide();
                    } else {
                      setActiveTab(link.id);
                    }
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    padding: '0.5rem 0.85rem',
                    borderRadius: '999px',
                    fontSize: '0.86rem',
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? '#ffffff' : '#c4b5fd',
                    backgroundColor: isActive 
                      ? (link.id === 'community' ? 'rgba(232, 121, 249, 0.25)' : 'rgba(168, 85, 247, 0.25)')
                      : 'transparent',
                    border: isActive 
                      ? (link.id === 'community' ? '1px solid #e879f9' : '1px solid rgba(192, 132, 252, 0.5)')
                      : '1px solid transparent',
                    boxShadow: isActive ? '0 0 18px rgba(168, 85, 247, 0.35)' : 'none',
                    transition: 'all 0.2s ease',
                    position: 'relative',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = '#ffffff';
                      e.currentTarget.style.backgroundColor = 'rgba(168, 85, 247, 0.12)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = '#c4b5fd';
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <Icon size={16} color={isActive ? (link.id === 'community' ? '#e879f9' : '#c084fc') : '#a78bfa'} />
                  <span>{link.label}</span>
                  {link.badge && (
                    <span style={{
                      backgroundColor: link.id === 'community' ? '#9333ea' : '#ef4444',
                      color: '#ffffff',
                      fontSize: '0.58rem',
                      fontWeight: 800,
                      padding: '0.12rem 0.4rem',
                      borderRadius: '4px',
                      letterSpacing: '0.04em',
                      animation: link.id === 'live' ? 'livePulse 2s infinite' : 'none',
                      border: link.id === 'community' ? '1px solid #c084fc' : 'none',
                    }}>
                      {link.badge}
                    </span>
                  )}
                  {link.count !== undefined && link.count > 0 && (
                    <span style={{
                      backgroundColor: 'rgba(192, 132, 252, 0.25)',
                      color: '#e9d5ff',
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      padding: '0.1rem 0.4rem',
                      borderRadius: '999px',
                      border: '1px solid rgba(192, 132, 252, 0.3)',
                    }}>
                      {link.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right: Search, Notifications, Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          
          {/* Live Search Bar */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: isSearchOpen || searchQuery ? 'rgba(26, 12, 48, 0.85)' : 'transparent',
              border: isSearchOpen || searchQuery ? '1px solid rgba(192, 132, 252, 0.45)' : '1px solid rgba(168, 85, 247, 0.15)',
              borderRadius: '999px',
              padding: '0.35rem 0.75rem',
              transition: 'all 0.3s ease',
              width: isSearchOpen || searchQuery ? '250px' : '38px',
              overflow: 'hidden',
              boxShadow: isSearchOpen ? '0 0 15px rgba(168, 85, 247, 0.3)' : 'none',
            }}>
              <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isSearchOpen ? '#c084fc' : '#c4b5fd',
                  minWidth: '22px',
                }}
                title="Search movies & series"
              >
                <Search size={18} />
              </button>
              <input 
                type="text"
                placeholder="Search titles, actors, genres..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  background: 'transparent',
                  color: '#ffffff',
                  fontSize: '0.85rem',
                  marginLeft: '0.5rem',
                  width: '100%',
                  opacity: isSearchOpen || searchQuery ? 1 : 0,
                  transition: 'opacity 0.2s ease',
                }}
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  style={{ color: '#a78bfa', padding: '0 0.2rem' }}
                >
                  <X size={15} />
                </button>
              )}
            </div>
          </div>

          {/* Notifications Bell */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfileMenu(false);
              }}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: showNotifications ? '#c084fc' : '#c4b5fd',
                backgroundColor: showNotifications ? 'rgba(168, 85, 247, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(168, 85, 247, 0.2)',
                position: 'relative',
                transition: 'all 0.2s ease',
              }}
              title="Notifications"
            >
              <Bell size={18} />
              {notifications.some(n => n.unread) && (
                <span style={{
                  position: 'absolute',
                  top: '5px',
                  right: '5px',
                  width: '9px',
                  height: '9px',
                  backgroundColor: '#f43f5e',
                  borderRadius: '50%',
                  boxShadow: '0 0 8px #f43f5e',
                }} />
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div 
                className="glass-panel-glow animate-fadeIn"
                style={{
                  position: 'absolute',
                  top: '48px',
                  right: 0,
                  width: '320px',
                  borderRadius: '16px',
                  padding: '1rem',
                  zIndex: 50,
                  backgroundColor: 'rgba(14, 7, 28, 0.95)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem', paddingBottom: '0.5rem', borderBottom: '1px solid rgba(168, 85, 247, 0.2)' }}>
                  <h4 style={{ fontSize: '0.92rem', color: '#f8fafc', fontWeight: 600 }}>Notifications</h4>
                  <span style={{ fontSize: '0.7rem', color: '#c084fc', fontWeight: 600 }}>Mark all as read</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {notifications.map((n) => (
                    <div 
                      key={n.id}
                      style={{
                        padding: '0.65rem',
                        borderRadius: '10px',
                        backgroundColor: n.unread ? 'rgba(168, 85, 247, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                        borderLeft: n.unread ? '3px solid #c084fc' : '3px solid transparent',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.2rem',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#f8fafc' }}>{n.title}</span>
                        <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>{n.time}</span>
                      </div>
                      <p style={{ fontSize: '0.76rem', color: '#c4b5fd', lineHeight: 1.3 }}>{n.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Profile Selector & Menu */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowNotifications(false);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.25rem 0.5rem 0.25rem 0.25rem',
                borderRadius: '999px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: `1.5px solid ${currentProfile?.color || '#a855f7'}`,
                transition: 'all 0.2s ease',
              }}
              title="Profile menu"
            >
              <img 
                src={currentProfile?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'} 
                alt={currentProfile?.name || 'User'} 
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                }}
              />
              <span style={{ 
                fontSize: '0.85rem', 
                fontWeight: 600, 
                color: '#ffffff',
                maxWidth: '80px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {currentProfile?.name || 'Alex'}
              </span>
              <ChevronDown size={14} color="#c4b5fd" style={{ transform: showProfileMenu ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </button>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div 
                className="glass-panel-glow animate-fadeIn"
                style={{
                  position: 'absolute',
                  top: '48px',
                  right: 0,
                  width: '250px',
                  borderRadius: '16px',
                  padding: '1rem',
                  zIndex: 50,
                  backgroundColor: 'rgba(14, 7, 28, 0.95)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.85rem', paddingBottom: '0.85rem', borderBottom: '1px solid rgba(168, 85, 247, 0.2)' }}>
                  <img 
                    src={currentProfile?.avatar} 
                    alt={currentProfile?.name} 
                    style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover', border: `2px solid ${currentProfile?.color}` }}
                  />
                  <div>
                    <h5 style={{ fontSize: '0.92rem', color: '#ffffff', fontWeight: 700 }}>{currentProfile?.name}</h5>
                    <span style={{ fontSize: '0.72rem', color: '#c084fc', fontWeight: 500 }}>{currentProfile?.tag}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onSwitchProfile();
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      padding: '0.6rem 0.75rem',
                      borderRadius: '8px',
                      color: '#e9d5ff',
                      fontSize: '0.82rem',
                      fontWeight: 500,
                      backgroundColor: 'rgba(168, 85, 247, 0.1)',
                      width: '100%',
                      textAlign: 'left',
                      transition: 'background 0.2s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(168, 85, 247, 0.25)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(168, 85, 247, 0.1)'}
                  >
                    <User size={16} color="#c084fc" />
                    <span>Switch Profiles</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      setActiveTab('community');
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      padding: '0.6rem 0.75rem',
                      borderRadius: '8px',
                      color: '#e9d5ff',
                      fontSize: '0.82rem',
                      fontWeight: 500,
                      backgroundColor: 'transparent',
                      width: '100%',
                      textAlign: 'left',
                      transition: 'background 0.2s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(232, 121, 249, 0.2)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <MessageSquare size={16} color="#e879f9" />
                    <span>Vibe Lounge (Social Chat)</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      setActiveTab('mylist');
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      padding: '0.6rem 0.75rem',
                      borderRadius: '8px',
                      color: '#e9d5ff',
                      fontSize: '0.82rem',
                      fontWeight: 500,
                      backgroundColor: 'transparent',
                      width: '100%',
                      textAlign: 'left',
                      transition: 'background 0.2s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(168, 85, 247, 0.15)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <Bookmark size={16} color="#a78bfa" />
                    <span>My Watchlist ({myListCount})</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onOpenLiveGuide();
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      padding: '0.6rem 0.75rem',
                      borderRadius: '8px',
                      color: '#e9d5ff',
                      fontSize: '0.82rem',
                      fontWeight: 500,
                      backgroundColor: 'transparent',
                      width: '100%',
                      textAlign: 'left',
                      transition: 'background 0.2s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(168, 85, 247, 0.15)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <Tv size={16} color="#e879f9" />
                    <span>Fire TV Channel Guide</span>
                  </button>

                  <div style={{ height: '1px', backgroundColor: 'rgba(168, 85, 247, 0.18)', margin: '0.3rem 0' }} />

                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onSignOut();
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      padding: '0.6rem 0.75rem',
                      borderRadius: '8px',
                      color: '#f87171',
                      fontSize: '0.82rem',
                      fontWeight: 500,
                      backgroundColor: 'transparent',
                      width: '100%',
                      textAlign: 'left',
                      transition: 'background 0.2s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.15)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <LogOut size={16} color="#f87171" />
                    <span>Sign Out of VibeFlix</span>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};
