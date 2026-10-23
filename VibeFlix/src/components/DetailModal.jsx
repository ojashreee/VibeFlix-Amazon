import React, { useState } from 'react';
import { 
  Play, 
  Plus, 
  Check, 
  X, 
  Sparkles, 
  ThumbsUp, 
  Heart,
  Share2, 
  Volume2, 
  Clock, 
  Award,
  Film,
  MessageSquare,
  Star,
  Send,
  Eye,
  EyeOff,
  AlertTriangle
} from 'lucide-react';
import { MOCK_EPISODES, TOP_10_TODAY, INITIAL_MOVIE_COMMENTS } from '../data/mockData';

export function DetailModal({ 
  movie, 
  onClose, 
  onPlayMovie, 
  myList = [], 
  onToggleMyList,
  currentProfile,
  allComments = {},
  onAddComment,
  onLikeComment
}) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'episodes' | 'comments' | 'similar'
  const [selectedSeason, setSelectedSeason] = useState(1);
  const isInList = myList.some((item) => item.id === movie.id);

  // New Comment Form State
  const [commentText, setCommentText] = useState('');
  const [userRating, setUserRating] = useState(5);
  const [isSpoiler, setIsSpoiler] = useState(false);
  const [revealedSpoilers, setRevealedSpoilers] = useState({});

  if (!movie) return null;

  // Retrieve comments for this movie
  const movieComments = allComments[movie.id] || INITIAL_MOVIE_COMMENTS[movie.id] || [
    {
      id: `c-default-${movie.id}`,
      author: 'CyberCritic',
      badge: 'Verified Fan',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      rating: 5,
      timestamp: 'Just now',
      text: `Incredible visual mastery on VibeFlix! The 4K HDR depth and purple ambient lighting in "${movie.title}" makes this an absolute must-watch.`,
      likes: 12,
      isLiked: false,
      hasSpoiler: false,
    }
  ];

  const handlePostComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment = {
      id: `comment-${Date.now()}`,
      author: currentProfile?.name || 'Alex',
      badge: currentProfile?.tag || 'VIP Member',
      avatar: currentProfile?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      rating: userRating,
      timestamp: 'Just now',
      text: commentText.trim(),
      likes: 0,
      isLiked: false,
      hasSpoiler: isSpoiler,
    };

    onAddComment(movie.id, newComment);
    setCommentText('');
    setIsSpoiler(false);
  };

  const toggleRevealSpoiler = (commentId) => {
    setRevealedSpoilers(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    }));
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(5, 2, 14, 0.84)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      zIndex: 90,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'max(1rem, 3vw)',
      overflowY: 'auto',
    }}
    onClick={onClose}
    >
      {/* Modal Container */}
      <div 
        className="glass-panel-glow animate-fadeIn"
        style={{
          width: '100%',
          maxWidth: '880px',
          maxHeight: '92vh',
          borderRadius: '24px',
          backgroundColor: 'rgba(14, 7, 28, 0.97)',
          border: '1px solid rgba(168, 85, 247, 0.35)',
          boxShadow: '0 25px 80px rgba(0, 0, 0, 0.95), 0 0 45px rgba(147, 51, 234, 0.4)',
          overflowY: 'auto',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            backgroundColor: 'rgba(10, 4, 22, 0.8)',
            border: '1px solid rgba(168, 85, 247, 0.35)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 30,
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(168, 85, 247, 0.4)';
            e.currentTarget.style.transform = 'scale(1.08)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(10, 4, 22, 0.8)';
            e.currentTarget.style.transform = 'none';
          }}
          title="Close details"
        >
          <X size={18} />
        </button>

        {/* Modal Hero Banner */}
        <div style={{
          position: 'relative',
          height: 'clamp(260px, 35vh, 380px)',
          width: '100%',
          overflow: 'hidden',
          borderTopLeftRadius: '24px',
          borderTopRightRadius: '24px',
        }}>
          <img 
            src={movie.backdrop || movie.image} 
            alt={movie.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%' }}
          />

          {/* Scrim Gradients */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: `
              linear-gradient(to top, rgba(14, 7, 28, 1) 0%, rgba(14, 7, 28, 0.6) 40%, transparent 80%),
              linear-gradient(to right, rgba(14, 7, 28, 0.9) 0%, transparent 60%)
            `,
          }} />

          {/* Hero Content Over Image */}
          <div style={{
            position: 'absolute',
            bottom: '24px',
            left: 'clamp(20px, 4vw, 36px)',
            right: 'clamp(20px, 4vw, 36px)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.8rem',
          }}>
            {movie.isOriginal && (
              <span style={{
                alignSelf: 'flex-start',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                backgroundColor: 'rgba(168, 85, 247, 0.3)',
                border: '1px solid #c084fc',
                color: '#f3e8ff',
                fontSize: '0.72rem',
                fontWeight: 800,
                padding: '0.2rem 0.6rem',
                borderRadius: '999px',
                letterSpacing: '0.05em',
              }}>
                <Sparkles size={12} color="#c084fc" />
                <span>VIBEFLIX ORIGINAL</span>
              </span>
            )}

            <h2 style={{
              fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
              fontWeight: 900,
              color: '#ffffff',
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
            }}>
              {movie.title}
            </h2>

            {/* Quick Action Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => {
                  onClose();
                  onPlayMovie(movie);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  padding: '0.75rem 1.6rem',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  boxShadow: '0 0 25px rgba(168, 85, 247, 0.7)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}
              >
                <Play size={18} fill="#ffffff" color="#ffffff" />
                <span>Play Now</span>
              </button>

              <button
                onClick={() => onToggleMyList(movie)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.25rem',
                  borderRadius: '12px',
                  backgroundColor: isInList ? 'rgba(168, 85, 247, 0.25)' : 'rgba(255, 255, 255, 0.1)',
                  border: isInList ? '1px solid #c084fc' : '1px solid rgba(255, 255, 255, 0.2)',
                  color: isInList ? '#ffffff' : '#c4b5fd',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {isInList ? <Check size={17} color="#c084fc" /> : <Plus size={17} />}
                <span>{isInList ? 'In Watchlist' : 'Add to List'}</span>
              </button>

              <button
                onClick={() => setActiveTab('comments')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.75rem 1.15rem',
                  borderRadius: '12px',
                  backgroundColor: activeTab === 'comments' ? 'rgba(232, 121, 249, 0.25)' : 'rgba(255, 255, 255, 0.1)',
                  border: activeTab === 'comments' ? '1px solid #e879f9' : '1px solid rgba(255, 255, 255, 0.2)',
                  color: activeTab === 'comments' ? '#ffffff' : '#c4b5fd',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                }}
              >
                <MessageSquare size={17} color="#c084fc" />
                <span>Discussion ({movieComments.length})</span>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div style={{
          padding: '0 clamp(20px, 4vw, 36px)',
          borderBottom: '1px solid rgba(168, 85, 247, 0.2)',
          display: 'flex',
          gap: '1.5rem',
          marginTop: '1rem',
          overflowX: 'auto',
        }}>
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'comments', label: `Comments & Reviews (${movieComments.length})`, icon: MessageSquare },
            { id: 'episodes', label: 'Episodes & Seasons' },
            { id: 'similar', label: 'More Like This' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.85rem 0',
                fontSize: '0.92rem',
                fontWeight: activeTab === tab.id ? 700 : 500,
                color: activeTab === tab.id ? '#ffffff' : '#a78bfa',
                borderBottom: activeTab === tab.id ? '2px solid #c084fc' : '2px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div style={{ padding: '1.5rem clamp(20px, 4vw, 36px) 2.5rem' }}>
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: '2rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                  <span style={{ color: '#34d399', fontWeight: 800, fontSize: '0.9rem' }}>
                    {movie.rating || '98% Match'}
                  </span>
                  <span style={{
                    padding: '0.1rem 0.45rem',
                    borderRadius: '4px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: '#ffffff',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                  }}>
                    {movie.maturity || '18+'}
                  </span>
                  <span style={{ color: '#cbd5e1', fontSize: '0.85rem' }}>
                    {movie.duration || '2h 15m'}
                  </span>
                  <span style={{
                    color: '#c084fc',
                    border: '1px solid rgba(192, 132, 252, 0.4)',
                    padding: '0.1rem 0.45rem',
                    borderRadius: '4px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                  }}>
                    {movie.quality || '4K ULTRA HD'}
                  </span>
                </div>

                <p style={{ fontSize: '0.95rem', color: '#e2e8f0', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                  {movie.synopsis || 'An epic cinematic production streaming exclusively on VibeFlix in Ultra HD 4K.'}
                </p>

                {/* Quick Comments Callout */}
                <div 
                  onClick={() => setActiveTab('comments')}
                  style={{
                    padding: '1rem',
                    borderRadius: '14px',
                    backgroundColor: 'rgba(26, 12, 54, 0.6)',
                    border: '1px solid rgba(168, 85, 247, 0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(38, 18, 76, 0.8)';
                    e.currentTarget.style.borderColor = '#c084fc';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(26, 12, 54, 0.6)';
                    e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.25)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(168, 85, 247, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <MessageSquare size={18} color="#c084fc" />
                    </div>
                    <div>
                      <h5 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#ffffff' }}>
                        Community Discussion ({movieComments.length} reviews)
                      </h5>
                      <p style={{ fontSize: '0.76rem', color: '#c4b5fd' }}>
                        "{movieComments[0]?.text?.substring(0, 55)}..."
                      </p>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.78rem', color: '#c084fc', fontWeight: 700 }}>
                    Join Chat →
                  </span>
                </div>
              </div>

              {/* Cast & Crew sidebar */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.85rem' }}>
                <div>
                  <span style={{ color: '#8b7ca6', display: 'block', fontSize: '0.76rem', textTransform: 'uppercase', fontWeight: 600 }}>
                    Cast
                  </span>
                  <span style={{ color: '#ffffff', lineHeight: 1.4 }}>
                    {movie.cast?.join(', ') || 'Elena Rostova, Kenji Sato, Marcus Vance, Julian Croft'}
                  </span>
                </div>

                <div>
                  <span style={{ color: '#8b7ca6', display: 'block', fontSize: '0.76rem', textTransform: 'uppercase', fontWeight: 600 }}>
                    Director & Writer
                  </span>
                  <span style={{ color: '#ffffff' }}>
                    {movie.creator || 'Lucian DeVere & Amara Vance'}
                  </span>
                </div>

                <div>
                  <span style={{ color: '#8b7ca6', display: 'block', fontSize: '0.76rem', textTransform: 'uppercase', fontWeight: 600 }}>
                    Genres
                  </span>
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.3rem' }}>
                    {(movie.genres || ['Sci-Fi', 'Cyberpunk', 'Action']).map((g, idx) => (
                      <span key={idx} style={{
                        padding: '0.2rem 0.6rem',
                        borderRadius: '6px',
                        backgroundColor: 'rgba(168, 85, 247, 0.15)',
                        border: '1px solid rgba(168, 85, 247, 0.3)',
                        color: '#c084fc',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                      }}>
                        {g}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span style={{ color: '#8b7ca6', display: 'block', fontSize: '0.76rem', textTransform: 'uppercase', fontWeight: 600 }}>
                    Audio & Subtitles
                  </span>
                  <span style={{ color: '#cbd5e1' }}>
                    English [Original], Japanese, Spanish, French • Dolby 5.1 Atmos
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: COMMENTS & REVIEWS SECTION (NEW REQUIREMENT) */}
          {activeTab === 'comments' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
              
              {/* Write a Comment Box */}
              <div style={{
                padding: '1.25rem',
                borderRadius: '18px',
                backgroundColor: 'rgba(26, 12, 54, 0.75)',
                border: '1px solid rgba(168, 85, 247, 0.35)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <img 
                      src={currentProfile?.avatar} 
                      alt={currentProfile?.name} 
                      style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: `2px solid ${currentProfile?.color || '#a855f7'}` }}
                    />
                    <div>
                      <h5 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#ffffff' }}>
                        Post a Review as {currentProfile?.name}
                      </h5>
                      <span style={{ fontSize: '0.72rem', color: '#c4b5fd' }}>
                        Share your thoughts with the VibeFlix community
                      </span>
                    </div>
                  </div>

                  {/* 5-Star Rating Selector */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setUserRating(star)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '0.15rem',
                          color: star <= userRating ? '#fbbf24' : '#4a3b66',
                          transition: 'transform 0.15s',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}
                        title={`${star} Stars`}
                      >
                        <Star size={18} fill={star <= userRating ? '#fbbf24' : 'none'} />
                      </button>
                    ))}
                  </div>
                </div>

                <form onSubmit={handlePostComment}>
                  <textarea 
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder={`What did you think of ${movie.title}? Mention theories, favorite scenes, audio quality...`}
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '0.85rem 1rem',
                      borderRadius: '12px',
                      backgroundColor: 'rgba(14, 7, 28, 0.85)',
                      border: '1px solid rgba(168, 85, 247, 0.3)',
                      color: '#ffffff',
                      fontSize: '0.88rem',
                      resize: 'none',
                      lineHeight: 1.5,
                      marginBottom: '0.85rem',
                    }}
                    required
                  />

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', cursor: 'pointer', fontSize: '0.8rem', color: '#c4b5fd' }}>
                      <input 
                        type="checkbox"
                        checked={isSpoiler}
                        onChange={(e) => setIsSpoiler(e.target.checked)}
                        style={{ accentColor: '#a855f7', width: '15px', height: '15px' }}
                      />
                      <span>Mark as Spoiler ⚠️</span>
                    </label>

                    <button
                      type="submit"
                      disabled={!commentText.trim()}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.6rem 1.4rem',
                        borderRadius: '10px',
                        background: commentText.trim() ? 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)' : 'rgba(255, 255, 255, 0.1)',
                        color: commentText.trim() ? '#ffffff' : '#8b7ca6',
                        fontSize: '0.86rem',
                        fontWeight: 700,
                        cursor: commentText.trim() ? 'pointer' : 'not-allowed',
                        boxShadow: commentText.trim() ? '0 0 15px rgba(168, 85, 247, 0.6)' : 'none',
                        transition: 'all 0.2s',
                      }}
                    >
                      <Send size={15} />
                      <span>Post Review</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Comments Feed */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>User Reviews & Discussion</span>
                  <span style={{ fontSize: '0.75rem', color: '#c084fc', padding: '0.1rem 0.5rem', borderRadius: '999px', backgroundColor: 'rgba(168, 85, 247, 0.2)' }}>
                    {movieComments.length} verified
                  </span>
                </h4>

                {movieComments.map((comment) => {
                  const isSpoilerRevealed = revealedSpoilers[comment.id];

                  return (
                    <div
                      key={comment.id}
                      style={{
                        padding: '1.1rem',
                        borderRadius: '16px',
                        backgroundColor: 'rgba(26, 12, 54, 0.55)',
                        border: '1px solid rgba(168, 85, 247, 0.2)',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(38, 18, 76, 0.7)';
                        e.currentTarget.style.borderColor = 'rgba(192, 132, 252, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(26, 12, 54, 0.55)';
                        e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.2)';
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                          <img 
                            src={comment.avatar} 
                            alt={comment.author}
                            style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid #a855f7' }}
                          />
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ffffff' }}>
                                {comment.author}
                              </span>
                              {comment.badge && (
                                <span style={{
                                  fontSize: '0.65rem',
                                  padding: '0.1rem 0.4rem',
                                  borderRadius: '4px',
                                  backgroundColor: 'rgba(168, 85, 247, 0.2)',
                                  border: '1px solid rgba(192, 132, 252, 0.3)',
                                  color: '#e9d5ff',
                                  fontWeight: 600,
                                }}>
                                  {comment.badge}
                                </span>
                              )}
                            </div>
                            <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                              {comment.timestamp}
                            </span>
                          </div>
                        </div>

                        {/* Star Rating Badge */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.15rem' }}>
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star 
                              key={s} 
                              size={14} 
                              color={s <= (comment.rating || 5) ? '#fbbf24' : '#4a3b66'} 
                              fill={s <= (comment.rating || 5) ? '#fbbf24' : 'none'} 
                            />
                          ))}
                        </div>
                      </div>

                      {/* Comment Body / Spoiler Handling */}
                      {comment.hasSpoiler && !isSpoilerRevealed ? (
                        <div style={{
                          padding: '0.85rem',
                          borderRadius: '10px',
                          backgroundColor: 'rgba(239, 68, 68, 0.1)',
                          border: '1px dashed rgba(239, 68, 68, 0.35)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: '0.6rem',
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fca5a5', fontSize: '0.82rem' }}>
                            <AlertTriangle size={16} />
                            <span>This review contains major plot spoilers.</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => toggleRevealSpoiler(comment.id)}
                            style={{
                              fontSize: '0.76rem',
                              color: '#ffffff',
                              backgroundColor: 'rgba(239, 68, 68, 0.25)',
                              border: '1px solid rgba(239, 68, 68, 0.4)',
                              padding: '0.3rem 0.65rem',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontWeight: 600,
                            }}
                          >
                            Show Spoiler
                          </button>
                        </div>
                      ) : (
                        <p style={{ fontSize: '0.88rem', color: '#e2e8f0', lineHeight: 1.5, marginBottom: '0.65rem' }}>
                          {comment.text}
                        </p>
                      )}

                      {/* Actions: Likes & Reply */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingTop: '0.4rem', borderTop: '1px solid rgba(168, 85, 247, 0.12)' }}>
                        <button
                          onClick={() => onLikeComment(movie.id, comment.id)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            fontSize: '0.76rem',
                            color: comment.isLiked ? '#e879f9' : '#c4b5fd',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'color 0.2s',
                          }}
                        >
                          <Heart size={14} fill={comment.isLiked ? '#e879f9' : 'none'} color={comment.isLiked ? '#e879f9' : '#c4b5fd'} />
                          <span>{comment.likes} Likes</span>
                        </button>

                        <button
                          style={{
                            fontSize: '0.76rem',
                            color: '#8b7ca6',
                            cursor: 'pointer',
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.color = '#c084fc'}
                          onMouseLeave={(e) => e.currentTarget.style.color = '#8b7ca6'}
                        >
                          Reply
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* TAB 3: EPISODES */}
          {activeTab === 'episodes' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff' }}>
                  Season {selectedSeason} Episodes
                </h4>
                <select 
                  value={selectedSeason}
                  onChange={(e) => setSelectedSeason(Number(e.target.value))}
                  style={{
                    padding: '0.45rem 1rem',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(26, 12, 54, 0.8)',
                    border: '1px solid rgba(168, 85, 247, 0.4)',
                    color: '#ffffff',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  <option value={1}>Season 1 (4 Episodes)</option>
                  <option value={2}>Season 2 (Available in 4K)</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {MOCK_EPISODES.map((ep) => (
                  <div
                    key={ep.episodeNumber}
                    onClick={() => {
                      onClose();
                      onPlayMovie({ ...movie, title: `${movie.title} - Ep. ${ep.episodeNumber}: ${ep.title}` });
                    }}
                    style={{
                      display: 'flex',
                      gap: '1.2rem',
                      padding: '0.9rem',
                      borderRadius: '16px',
                      backgroundColor: 'rgba(26, 12, 54, 0.5)',
                      border: '1px solid rgba(168, 85, 247, 0.2)',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(168, 85, 247, 0.2)';
                      e.currentTarget.style.borderColor = '#c084fc';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(26, 12, 54, 0.5)';
                      e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.2)';
                    }}
                  >
                    <div style={{
                      position: 'relative',
                      width: '140px',
                      height: '85px',
                      borderRadius: '10px',
                      overflow: 'hidden',
                      flexShrink: 0,
                    }}>
                      <img src={ep.thumbnail} alt={ep.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundColor: 'rgba(7, 3, 18, 0.35)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <Play size={22} fill="#ffffff" color="#ffffff" />
                      </div>
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                        <h5 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff' }}>
                          {ep.episodeNumber}. {ep.title}
                        </h5>
                        <span style={{ fontSize: '0.78rem', color: '#c084fc', fontWeight: 600 }}>
                          {ep.duration}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.4 }}>
                        {ep.synopsis}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: MORE LIKE THIS */}
          {activeTab === 'similar' && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
              gap: '1rem',
            }}>
              {TOP_10_TODAY.slice(0, 6).map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    onClose();
                    onPlayMovie(item);
                  }}
                  style={{
                    borderRadius: '14px',
                    backgroundColor: 'rgba(26, 12, 54, 0.7)',
                    border: '1px solid rgba(168, 85, 247, 0.2)',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'all 0.25s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.04)';
                    e.currentTarget.style.borderColor = '#c084fc';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.2)';
                  }}
                >
                  <img src={item.image} alt={item.title} style={{ width: '100%', height: '110px', objectFit: 'cover' }} />
                  <div style={{ padding: '0.75rem' }}>
                    <h5 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.title}
                    </h5>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.3rem', fontSize: '0.72rem' }}>
                      <span style={{ color: '#34d399', fontWeight: 700 }}>{item.rating}</span>
                      <span style={{ color: '#c084fc' }}>{item.quality}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
