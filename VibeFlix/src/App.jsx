import React, { useState, useMemo, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LoginView } from './components/LoginView';
import { ProfileSelector } from './components/ProfileSelector';
import { HeroBanner } from './components/HeroBanner';
import { CategoryFilterBar } from './components/CategoryFilterBar';
import { ContentRow } from './components/ContentRow';
import { DetailModal } from './components/DetailModal';
import { LiveTVGuideModal } from './components/LiveTVGuideModal';
import { ToastNotification } from './components/ToastNotification';
import { CommunityChat } from './components/CommunityChat';
import { PartyInvitePopup } from './components/PartyInvitePopup';
import { VibeSearch } from './components/VibeSearch';
import { ScheduleModal } from './components/ScheduleModal';
import { WatchTogetherPlayer } from './components/WatchTogetherPlayer';
import { useSocial } from './hooks/useSocial';
import TrailerModal from "./components/TrailerModal";
 
import { 
  PROFILES, 
  CONTINUE_WATCHING, 
  TOP_10_TODAY, 
  LIVE_FIRE_CHANNELS, 
  VIOLET_ORIGINALS, 
  ACTION_THRILLERS, 
  SCI_FI_GEMS,
  NOTIFICATIONS_DATA,
  HERO_FEATURED,
  INITIAL_MOVIE_COMMENTS
} from './data/mockData';
import { 
  Tv, 
  Film, 
  Layers, 
  Sparkles, 
  Search, 
  Bookmark, 
  Flame, 
  Info, 
  Play, 
  Check, 
  Plus, 
  Globe, 
  Monitor, 
  Smartphone, 
  Laptop,
  MessageSquare
} from 'lucide-react';

export default function App() {
  useEffect(() => {
    fetch('/api/movies/now-playing')
      .then((res) => {
        if (!res.ok) throw new Error('Could not fetch movies');
        return res.json();
      })
      .then((data) => {
        console.log('Now playing movies:', data.results);
      })
      .catch(console.error);
  }, []);

  // Navigation & View States
  const [viewMode, setViewMode] = useState('dashboard'); // 'login' | 'profiles' | 'dashboard'
  const [currentProfile, setCurrentProfile] = useState(PROFILES[0]);
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'movies' | 'series' | 'trending' | 'community' | 'vibesearch' | 'mylist'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [vibeSeed, setVibeSeed] = useState('');

  // Modals & Player State
  const [playingMovie, setPlayingMovie] = useState(null);
  const [selectedMovieForDetails, setSelectedMovieForDetails] = useState(null);
  const [isLiveGuideOpen, setIsLiveGuideOpen] = useState(false);
  const [scheduleRequest, setScheduleRequest] = useState(null); // Watch Together dialog

  // Watchlist State (Initialized with a couple of items)
  const [myList, setMyList] = useState([TOP_10_TODAY[0], VIOLET_ORIGINALS[1]]);
  const [notifications, setNotifications] = useState(NOTIFICATIONS_DATA);
  const [toast, setToast] = useState(null);

  // Comments & Reviews State for all titles
  const [movieComments, setMovieComments] = useState(INITIAL_MOVIE_COMMENTS);

  // Toast Helper
  const showToast = (message, type = 'default') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3200);
  };

  // Toggle My List
  const handleToggleMyList = (movie) => {
    const exists = myList.some((m) => m.id === movie.id);
    if (exists) {
      setMyList((prev) => prev.filter((m) => m.id !== movie.id));
      showToast(`Removed "${movie.title}" from My List`, 'watchlist');
    } else {
      setMyList((prev) => [...prev, movie]);
      showToast(`Added "${movie.title}" to My List!`, 'watchlist');
    }
  };

  // Add Comment Handler
  const handleAddComment = (movieId, newComment) => {
    setMovieComments(prev => {
      const existing = prev[movieId] || [];
      return {
        ...prev,
        [movieId]: [newComment, ...existing]
      };
    });
    showToast(`Review posted for "${selectedMovieForDetails?.title || 'movie'}"!`, 'community');
  };

  // Like Comment Handler
  const handleLikeComment = (movieId, commentId) => {
    setMovieComments(prev => {
      const existing = prev[movieId] || [];
      const updated = existing.map(c => {
        if (c.id === commentId) {
          const isLiked = !c.isLiked;
          return {
            ...c,
            isLiked,
            likes: isLiked ? c.likes + 1 : Math.max(c.likes - 1, 0)
          };
        }
        return c;
      });
      return {
        ...prev,
        [movieId]: updated
      };
    });
  };

  // Watch Together: friends, chat, watch dates and synced rooms (connects only on the dashboard)
  const social = useSocial(
    viewMode === 'dashboard' ? currentProfile : null,
    (text, kind) => showToast(text, kind === 'error' ? 'default' : 'community')
  );

  // Profile Switching
  const handleSelectProfile = (profile) => {
    setCurrentProfile(profile);
    setViewMode('dashboard');
    showToast(`Switched profile to ${profile.name}`, 'profile');
  };

  // All Items Combined for Search
  const allContentPool = useMemo(() => {
    const map = new Map();
    [
      ...HERO_FEATURED,
      ...TOP_10_TODAY,
      ...VIOLET_ORIGINALS,
      ...ACTION_THRILLERS,
      ...SCI_FI_GEMS,
      ...CONTINUE_WATCHING,
    ].forEach((item) => {
      if (!map.has(item.id)) {
        map.set(item.id, item);
      }
    });
    return Array.from(map.values());
  }, []);

  // Filtered Results Based on Search
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return allContentPool.filter((item) => {
      const matchTitle = item.title?.toLowerCase().includes(q);
      const matchGenres = item.genres?.some((g) => g.toLowerCase().includes(q));
      const matchCast = item.cast?.some((c) => c.toLowerCase().includes(q));
      const matchSynopsis = item.synopsis?.toLowerCase().includes(q);
      return matchTitle || matchGenres || matchCast || matchSynopsis;
    });
  }, [searchQuery, allContentPool]);

  // Handle Tab Navigation Filter
  const handleCategorySelect = (catId) => {
    setSelectedCategory(catId);
    if (catId === 'live') {
      setIsLiveGuideOpen(true);
    } else if (catId === 'mylist') {
      setActiveTab('mylist');
    } else if (catId === 'top10') {
      setActiveTab('trending');
    } else {
      setActiveTab('home');
    }
  };

  /* =====================================================================
     VIEW MODE 1: LOGIN PAGE
     ===================================================================== */
  if (viewMode === 'login') {
    return (
      <LoginView 
        onLoginSuccess={(profile) => {
          setCurrentProfile(profile);
          setViewMode('profiles');
          showToast(`Welcome back, ${profile.name}!`, 'profile');
        }}
      />
    );
  }

  /* =====================================================================
     VIEW MODE 2: PROFILE SELECTOR ("WHO'S WATCHING?")
     ===================================================================== */
  if (viewMode === 'profiles') {
    return (
      <ProfileSelector 
        onSelectProfile={handleSelectProfile} 
      />
    );
  }

  /* =====================================================================
     VIEW MODE 3: MAIN STREAMING DASHBOARD (VIBEFLIX)
     ===================================================================== */
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#070312',
      color: '#f8fafc',
      position: 'relative',
      overflowX: 'hidden',
    }}>
      {/* Top Navbar */}
      <Navbar 
        currentProfile={currentProfile}
        onSwitchProfile={() => setViewMode('profiles')}
        onSignOut={() => setViewMode('login')}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenLiveGuide={() => setIsLiveGuideOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        myListCount={myList.length}
        notifications={notifications}
        socialBadge={social.badgeCount}
      />

      {/* Main Content Area */}
      <main style={{ minHeight: 'calc(100vh - 200px)' }}>
        
        {/* IF SEARCH IS ACTIVE: Show Live Search Results Grid */}
        {searchQuery.trim().length > 0 ? (
          <div style={{
            paddingTop: '6rem',
            paddingLeft: 'max(1.5rem, 4vw)',
            paddingRight: 'max(1.5rem, 4vw)',
            paddingBottom: '4rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.75rem' }}>
              <Search size={24} color="#c084fc" />
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff' }}>
                Search Results for "{searchQuery}"
              </h2>
              <span style={{ fontSize: '0.85rem', color: '#c4b5fd', marginLeft: '0.5rem' }}>
                ({searchResults.length} titles found)
              </span>
              <button
                onClick={() => { setVibeSeed(searchQuery); setSearchQuery(''); setActiveTab('vibesearch'); }}
                style={{ marginLeft: 'auto', padding: '0.5rem 1rem', borderRadius: 10, backgroundColor: 'rgba(168,85,247,0.2)', border: '1px solid #c084fc', color: '#fff', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
              >
                Ask VibeSearch about this
              </button>
            </div>

            {searchResults.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '4rem 1rem',
                backgroundColor: 'rgba(26, 12, 54, 0.4)',
                borderRadius: '20px',
                border: '1px dashed rgba(168, 85, 247, 0.3)',
              }}>
                <Film size={48} color="#a78bfa" style={{ marginBottom: '1rem', opacity: 0.6 }} />
                <h3 style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: '0.5rem' }}>
                  No titles found matching "{searchQuery}"
                </h3>
                <p style={{ fontSize: '0.88rem', color: '#8b7ca6' }}>
                  Try searching for a different keyword, actor name, or genre like "Cyberpunk", "Space", or "Action".
                </p>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                gap: '1.5rem',
              }}>
                {searchResults.map((item) => {
                  const isSaved = myList.some((m) => m.id === item.id);
                  return (
                    <div
                      key={item.id}
                      style={{
                        borderRadius: '16px',
                        backgroundColor: 'rgba(26, 12, 54, 0.8)',
                        border: '1px solid rgba(168, 85, 247, 0.25)',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-6px) scale(1.03)';
                        e.currentTarget.style.borderColor = '#c084fc';
                        e.currentTarget.style.boxShadow = '0 12px 35px rgba(147, 51, 234, 0.5)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'none';
                        e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.25)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <div 
                        style={{ position: 'relative', height: '145px' }}
                        onClick={() => setSelectedMovieForDetails(item)}
                      >
                        <img 
                          src={item.image || item.backdrop} 
                          alt={item.title} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <div style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'linear-gradient(to top, rgba(9, 4, 21, 0.9) 0%, transparent 60%)',
                        }} />
                      </div>

                      <div style={{ padding: '0.85rem' }}>
                        <h4 
                          onClick={() => setSelectedMovieForDetails(item)}
                          style={{ fontSize: '0.92rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.4rem' }}
                        >
                          {item.title}
                        </h4>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.74rem', color: '#34d399', fontWeight: 700 }}>
                            {item.rating || '97% Match'}
                          </span>
                          <div style={{ display: 'flex', gap: '0.4rem' }}>
                            <button
                              onClick={() => setPlayingMovie(item)}
                              style={{
                                width: '28px',
                                height: '28px',
                                borderRadius: '50%',
                                backgroundColor: '#a855f7',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#ffffff',
                              }}
                              title="Play"
                            >
                              <Play size={13} fill="#ffffff" />
                            </button>
                            <button
                              onClick={() => handleToggleMyList(item)}
                              style={{
                                width: '28px',
                                height: '28px',
                                borderRadius: '50%',
                                backgroundColor: isSaved ? 'rgba(168, 85, 247, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                                border: isSaved ? '1px solid #c084fc' : 'none',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: isSaved ? '#c084fc' : '#c4b5fd',
                              }}
                              title={isSaved ? 'In Watchlist' : 'Add to List'}
                            >
                              {isSaved ? <Check size={13} /> : <Plus size={13} />}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : activeTab === 'vibesearch' ? (
          <VibeSearch
            contentPool={allContentPool}
            currentProfile={currentProfile}
            myList={myList}
            seedQuery={vibeSeed}
            onSeedUsed={() => setVibeSeed('')}
            onPlay={(movie) => setPlayingMovie(movie)}
            onOpenDetails={(movie) => setSelectedMovieForDetails(movie)}
            onToggleMyList={handleToggleMyList}
            onWatchTogether={(movie) => setScheduleRequest({ movie, mode: 'later' })}
          />
        ) : activeTab === 'community' ? (
          /* VIBE LOUNGE: SOCIAL MULTI-USER CHAT PAGE (NEW REQUIREMENT) */
          <>
            <CommunityChat 
              currentProfile={currentProfile}
              onPlayMovie={(movie) => setPlayingMovie(movie)}
              social={social}
              contentPool={allContentPool}
              onOpenSchedule={setScheduleRequest}
            />
            <PartyInvitePopup social={social} />
          </>
        ) : activeTab === 'mylist' ? (
          /* MY LIST TAB */
          <div style={{
            paddingTop: '6rem',
            paddingLeft: 'max(1.5rem, 4vw)',
            paddingRight: 'max(1.5rem, 4vw)',
            paddingBottom: '4rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                backgroundColor: 'rgba(168, 85, 247, 0.2)',
                border: '1px solid #c084fc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Bookmark size={22} color="#c084fc" />
              </div>
              <div>
                <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#ffffff' }}>
                  My Watchlist
                </h1>
                <p style={{ fontSize: '0.85rem', color: '#c4b5fd' }}>
                  {myList.length} saved titles for {currentProfile.name}
                </p>
              </div>
            </div>

            {myList.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '4rem 1rem',
                backgroundColor: 'rgba(26, 12, 54, 0.4)',
                borderRadius: '20px',
                border: '1px dashed rgba(168, 85, 247, 0.3)',
              }}>
                <Bookmark size={48} color="#a78bfa" style={{ marginBottom: '1rem', opacity: 0.5 }} />
                <h3 style={{ fontSize: '1.25rem', color: '#ffffff', marginBottom: '0.5rem' }}>
                  Your Watchlist is empty
                </h3>
                <p style={{ fontSize: '0.88rem', color: '#8b7ca6', maxWidth: '420px', margin: '0 auto 1.5rem' }}>
                  Explore trending titles, blockbusters, and originals, then click the "+ My List" button to save them here.
                </p>
                <button
                  onClick={() => setActiveTab('home')}
                  style={{
                    padding: '0.75rem 1.6rem',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    boxShadow: '0 0 20px rgba(168, 85, 247, 0.5)',
                    cursor: 'pointer',
                  }}
                >
                  Browse Featured Titles
                </button>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                gap: '1.5rem',
              }}>
                {myList.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      borderRadius: '16px',
                      backgroundColor: 'rgba(26, 12, 54, 0.85)',
                      border: '1px solid rgba(168, 85, 247, 0.25)',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-6px) scale(1.03)';
                      e.currentTarget.style.borderColor = '#c084fc';
                      e.currentTarget.style.boxShadow = '0 12px 35px rgba(147, 51, 234, 0.5)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'none';
                      e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.25)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div 
                      style={{ position: 'relative', height: '145px' }}
                      onClick={() => setSelectedMovieForDetails(item)}
                    >
                      <img 
                        src={item.image || item.backdrop} 
                        alt={item.title} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to top, rgba(9, 4, 21, 0.9) 0%, transparent 60%)',
                      }} />
                    </div>

                    <div style={{ padding: '0.9rem' }}>
                      <h4 
                        onClick={() => setSelectedMovieForDetails(item)}
                        style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.4rem' }}
                      >
                        {item.title}
                      </h4>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.74rem', color: '#34d399', fontWeight: 700 }}>
                          {item.rating || '98% Match'}
                        </span>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button
                            onClick={() => setPlayingMovie(item)}
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              backgroundColor: '#a855f7',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#ffffff',
                            }}
                            title="Play"
                          >
                            <Play size={15} fill="#ffffff" />
                          </button>
                          <button
                            onClick={() => handleToggleMyList(item)}
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              backgroundColor: 'rgba(239, 68, 68, 0.2)',
                              border: '1px solid rgba(239, 68, 68, 0.4)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#f87171',
                            }}
                            title="Remove from Watchlist"
                          >
                            <Check size={15} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* STANDARD DASHBOARD BROWSING EXPERIENCE */
          <>
            {/* Hero Banner Flagship Feature */}
            <HeroBanner 
              onPlayMovie={(movie) => setPlayingMovie(movie)}
              onOpenDetails={(movie) => setSelectedMovieForDetails(movie)}
              myList={myList}
              onToggleMyList={handleToggleMyList}
              onWatchTogether={(movie) => setScheduleRequest({ movie, mode: 'later' })}
            />

            {/* Quick Category Filter Bar */}
            <CategoryFilterBar 
              selectedCategory={selectedCategory}
              onSelectCategory={handleCategorySelect}
            />

            {/* Horizontal Carousel Rows */}
            <div style={{ position: 'relative', zIndex: 10, marginTop: '-0.5rem' }}>
              
              {/* Row 1: Continue Watching for Current Profile */}
              {(selectedCategory === 'all' || selectedCategory === 'continue') && (
                <ContentRow 
                  title={`Continue Watching for ${currentProfile.name}`}
                  subtitle="Pick up where you left off"
                  items={CONTINUE_WATCHING}
                  rowType="continue"
                  onPlayItem={(item) => setPlayingMovie(item)}
                  onOpenDetails={(item) => setSelectedMovieForDetails(item)}
                  myList={myList}
                  onToggleMyList={handleToggleMyList}
                />
              )}

              {/* Row 2: Top 10 in Movies & Series Today (Netflix Giant Numbers) */}
              {(selectedCategory === 'all' || selectedCategory === 'top10') && (
                <ContentRow 
                  title="Top 10 Today Worldwide"
                  subtitle="Most watched in the last 24 hours"
                  items={TOP_10_TODAY}
                  rowType="top10"
                  onPlayItem={(item) => setPlayingMovie(item)}
                  onOpenDetails={(item) => setSelectedMovieForDetails(item)}
                  myList={myList}
                  onToggleMyList={handleToggleMyList}
                />
              )}

              {/* Row 3: Fire TV Signature Live TV Channels */}
              {(selectedCategory === 'all' || selectedCategory === 'live') && (
                <ContentRow 
                  title="Fire TV Live Channels"
                  subtitle="Streaming broadcast TV with zero lag"
                  items={LIVE_FIRE_CHANNELS}
                  rowType="channel"
                  onPlayItem={(channel) => setPlayingMovie({
                    id: channel.id,
                    title: `${channel.name} [LIVE 4K]`,
                    subtitle: channel.currentShow,
                    videoUrl: channel.videoUrl,
                    backdrop: channel.thumbnail,
                  })}
                  onOpenDetails={() => setIsLiveGuideOpen(true)}
                  myList={myList}
                  onToggleMyList={handleToggleMyList}
                />
              )}

              {/* Row 4: VibeFlix Violet Originals */}
              {(selectedCategory === 'all' || selectedCategory === 'originals') && (
                <ContentRow 
                  title="VibeFlix Violet Originals"
                  subtitle="Only on VibeFlix in Ultra HD 4K"
                  items={VIOLET_ORIGINALS}
                  rowType="standard"
                  onPlayItem={(item) => setPlayingMovie(item)}
                  onOpenDetails={(item) => setSelectedMovieForDetails(item)}
                  myList={myList}
                  onToggleMyList={handleToggleMyList}
                />
              )}

              {/* Row 5: Mind-Bending Sci-Fi & Cyberpunk */}
              {(selectedCategory === 'all' || selectedCategory === 'scifi') && (
                <ContentRow 
                  title="Mind-Bending Sci-Fi & Cyberpunk"
                  subtitle="Alternate realities & synthetic futures"
                  items={SCI_FI_GEMS}
                  rowType="standard"
                  onPlayItem={(item) => setPlayingMovie(item)}
                  onOpenDetails={(item) => setSelectedMovieForDetails(item)}
                  myList={myList}
                  onToggleMyList={handleToggleMyList}
                />
              )}

              {/* Row 6: Adrenaline Action & Thrillers */}
              {(selectedCategory === 'all' || selectedCategory === 'action') && (
                <ContentRow 
                  title="Adrenaline Action & Thrillers"
                  subtitle="High stakes, espionage, and car chases"
                  items={ACTION_THRILLERS}
                  rowType="standard"
                  onPlayItem={(item) => setPlayingMovie(item)}
                  onOpenDetails={(item) => setSelectedMovieForDetails(item)}
                  myList={myList}
                  onToggleMyList={handleToggleMyList}
                />
              )}

            </div>
          </>
        )}

      </main>

      {/* Cinematic Purple Footer */}
      <footer style={{
        marginTop: '4rem',
        borderTop: '1px solid rgba(168, 85, 247, 0.2)',
        backgroundColor: 'rgba(8, 4, 18, 0.95)',
        padding: '3rem max(1.5rem, 4vw) 2rem',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '2.5rem',
          marginBottom: '2.5rem',
        }}>
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.85rem' }}>
              <div style={{
                width: '34px',
                height: '34px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #9333ea 0%, #c084fc 50%, #f43f5e 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Play size={16} fill="#ffffff" color="#ffffff" style={{ marginLeft: '1px' }} />
              </div>
              <span style={{ fontSize: '1.3rem', fontWeight: 900, color: '#ffffff' }}>
                VIBE<span style={{ color: '#f43f5e' }}>FLIX</span>
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#a78bfa', lineHeight: 1.5 }}>
              The premiere violet streaming platform engineered for ultra-responsive cinema playback, Fire TV integration, community social lounge, and 4K HDR entertainment.
            </p>
          </div>

          {/* Links Col 1 */}
          <div>
            <h5 style={{ fontSize: '0.85rem', color: '#ffffff', fontWeight: 700, marginBottom: '0.85rem' }}>Navigation</h5>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8rem', color: '#c4b5fd' }}>
              <li><a href="#home" onClick={() => setActiveTab('home')} style={{ color: 'inherit', textDecoration: 'none' }}>Home Dashboard</a></li>
              <li><a href="#community" onClick={() => setActiveTab('community')} style={{ color: 'inherit', textDecoration: 'none' }}>Vibe Lounge (Social Chat)</a></li>
              <li><a href="#movies" onClick={() => setActiveTab('movies')} style={{ color: 'inherit', textDecoration: 'none' }}>4K Feature Films</a></li>
              <li><a href="#live" onClick={() => setIsLiveGuideOpen(true)} style={{ color: 'inherit', textDecoration: 'none' }}>Fire TV Live Channels</a></li>
              <li><a href="#mylist" onClick={() => setActiveTab('mylist')} style={{ color: 'inherit', textDecoration: 'none' }}>My Saved Watchlist</a></li>
            </ul>
          </div>

          {/* Links Col 2 */}
          <div>
            <h5 style={{ fontSize: '0.85rem', color: '#ffffff', fontWeight: 700, marginBottom: '0.85rem' }}>Supported Devices</h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', fontSize: '0.8rem', color: '#c4b5fd' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Tv size={15} color="#c084fc" /> Amazon Fire TV & Fire Stick 4K</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Monitor size={15} color="#c084fc" /> Apple TV & Smart TVs</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Laptop size={15} color="#c084fc" /> Web Browsers (Chrome, Edge, Safari)</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Smartphone size={15} color="#c084fc" /> iOS & Android Mobile Apps</span>
            </div>
          </div>

          {/* Profile & Settings info */}
          <div>
            <h5 style={{ fontSize: '0.85rem', color: '#ffffff', fontWeight: 700, marginBottom: '0.85rem' }}>Account & Profile</h5>
            <p style={{ fontSize: '0.8rem', color: '#c4b5fd', marginBottom: '0.8rem' }}>
              Current profile: <strong style={{ color: '#ffffff' }}>{currentProfile.name}</strong> ({currentProfile.tag})
            </p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                onClick={() => setViewMode('profiles')}
                style={{
                  padding: '0.4rem 0.85rem',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(168, 85, 247, 0.2)',
                  border: '1px solid rgba(192, 132, 252, 0.35)',
                  color: '#ffffff',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Switch Profile
              </button>
              <button 
                onClick={() => setViewMode('login')}
                style={{
                  padding: '0.4rem 0.85rem',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#e2e8f0',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div style={{
          paddingTop: '1.5rem',
          borderTop: '1px solid rgba(168, 85, 247, 0.12)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          fontSize: '0.75rem',
          color: '#8b7ca6',
        }}>
          <div>
            © 2026 VibeFlix Networks. Built with React & Purple Cinema Design. Inspired by Netflix & Amazon Fire TV.
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <span>Privacy</span>
            <span>Terms of Service</span>
            <span>Community Guidelines</span>
            <span>Speed Test</span>
          </div>
        </div>
      </footer>

      {/* ===============================================================
          MODALS & OVERLAYS
          =============================================================== */}

      {/* 1. Trailer Modal */}
      {playingMovie && !social.room && (
        <TrailerModal
          movie={playingMovie}
          onClose={() => setPlayingMovie(null)}
        />
      )}

      {/* 2. Detailed "More Info" Modal with Comments & Reviews */}
      {selectedMovieForDetails && (
        <DetailModal 
          movie={selectedMovieForDetails} 
          onClose={() => setSelectedMovieForDetails(null)} 
          onPlayMovie={(movie) => setPlayingMovie(movie)}
          myList={myList}
          onToggleMyList={handleToggleMyList}
          currentProfile={currentProfile}
          allComments={movieComments}
          onAddComment={handleAddComment}
          onLikeComment={handleLikeComment}
        />
      )}

      {/* 3. Fire TV Live Channel Guide Modal */}
      {isLiveGuideOpen && (
        <LiveTVGuideModal 
          onClose={() => setIsLiveGuideOpen(false)}
          onTuneChannel={(liveStream) => setPlayingMovie(liveStream)}
        />
      )}

      {/* 4. Watch Together: schedule dialog, synced player, invite popups */}
      {scheduleRequest && (
        <ScheduleModal
          social={social}
          contentPool={allContentPool}
          preset={scheduleRequest}
          onClose={() => setScheduleRequest(null)}
          onGoToLounge={() => setActiveTab('community')}
        />
      )}
      {social.room && <WatchTogetherPlayer social={social} />}
      {/* 5. Toast Notifications */}
      <ToastNotification toast={toast} />

    </div>
  );
}
