import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  Send, 
  Smile, 
  Film, 
  Users, 
  Sparkles, 
  Tv, 
  Flame, 
  Play, 
  Check, 
  Hash, 
  Radio,
  Search,
  ChevronRight,
  Share2
} from 'lucide-react';
import { 
  COMMUNITY_CHANNELS, 
  INITIAL_CHAT_MESSAGES, 
  ONLINE_COMMUNITY_USERS,
  HERO_FEATURED,
  TOP_10_TODAY
} from '../data/mockData';
import { FriendsHub } from './FriendsHub';

export function CommunityChat({ currentProfile, onPlayMovie, social, contentPool = [], onOpenSchedule = () => {} }) {
  const [section, setSection] = useState('channels'); // 'channels' | 'friends'
  const [activeChannelId, setActiveChannelId] = useState('general-cinema');
  const [messagesByChannel, setMessagesByChannel] = useState(INITIAL_CHAT_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [showMoviePicker, setShowMoviePicker] = useState(false);
  const [attachedMovie, setAttachedMovie] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const activeChannel = COMMUNITY_CHANNELS.find(c => c.id === activeChannelId) || COMMUNITY_CHANNELS[0];
  const currentMessages = messagesByChannel[activeChannelId] || [];

  // Scroll to bottom on message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentMessages, activeChannelId]);

  // Handle sending a message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim() && !attachedMovie) return;

    const newMessage = {
      id: `msg-${Date.now()}`,
      author: currentProfile?.name || 'Alex',
      badge: currentProfile?.tag || 'VIP Member',
      avatar: currentProfile?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      color: currentProfile?.color || '#a855f7',
      time: 'Just now',
      text: inputText.trim(),
      attachedMovie: attachedMovie ? {
        title: attachedMovie.title,
        rating: attachedMovie.rating,
        quality: attachedMovie.quality,
        image: attachedMovie.image || attachedMovie.backdrop,
      } : null,
      reactions: { '💜': 1 },
    };

    setMessagesByChannel(prev => ({
      ...prev,
      [activeChannelId]: [...(prev[activeChannelId] || []), newMessage]
    }));

    setInputText('');
    setAttachedMovie(null);
    setShowMoviePicker(false);

    // Simulate community reply after 2.5 seconds
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const simulatedReplies = [
        { author: 'LunaCinema', text: '100% facts! Have you seen the climax sequence yet in 4K?', badge: 'Film Buff', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80', color: '#e879f9' },
        { author: 'CyberSam', text: 'Great point @' + currentProfile?.name + '! Adding that to my VibeFlix watchlist right now.', badge: 'VIP Critic', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80', color: '#c084fc' },
        { author: 'Marcus_V', text: 'The cinematography in that title is unbelievable on an OLED screen with Dolby Vision.', badge: 'Director', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80', color: '#38bdf8' },
      ];
      const randomReply = simulatedReplies[Math.floor(Math.random() * simulatedReplies.length)];

      const botMessage = {
        id: `bot-msg-${Date.now()}`,
        author: randomReply.author,
        badge: randomReply.badge,
        avatar: randomReply.avatar,
        color: randomReply.color,
        time: 'Just now',
        text: randomReply.text,
        reactions: { '🍿': 3, '🔥': 2 },
      };

      setMessagesByChannel(prev => ({
        ...prev,
        [activeChannelId]: [...(prev[activeChannelId] || []), botMessage]
      }));
    }, 2400);
  };

  // Handle adding an emoji reaction to a message
  const handleReaction = (msgId, emoji) => {
    setMessagesByChannel(prev => {
      const channelMsgs = prev[activeChannelId] || [];
      const updated = channelMsgs.map(m => {
        if (m.id === msgId) {
          const currentReactions = { ...(m.reactions || {}) };
          currentReactions[emoji] = (currentReactions[emoji] || 0) + 1;
          return { ...m, reactions: currentReactions };
        }
        return m;
      });
      return { ...prev, [activeChannelId]: updated };
    });
  };

  return (
    <div style={{
      paddingTop: '5.5rem',
      paddingBottom: '2rem',
      paddingLeft: 'max(1rem, 3vw)',
      paddingRight: 'max(1rem, 3vw)',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Page Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.25rem',
        flexWrap: 'wrap',
        gap: '1rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #9333ea 0%, #c084fc 50%, #f43f5e 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 25px rgba(168, 85, 247, 0.6)',
          }}>
            <MessageSquare size={22} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.02em' }}>
                Vibe Lounge
              </h1>
              <span style={{
                backgroundColor: 'rgba(168, 85, 247, 0.25)',
                color: '#e9d5ff',
                fontSize: '0.65rem',
                fontWeight: 800,
                padding: '0.2rem 0.55rem',
                borderRadius: '6px',
                border: '1px solid #c084fc',
                letterSpacing: '0.06em',
              }}>
                LIVE SOCIAL CINEMA
              </span>
            </div>
            <p style={{ fontSize: '0.82rem', color: '#c4b5fd' }}>
              Real-time movie discussion rooms, live watch parties, and community reviews.
            </p>
          </div>
        </div>

        {/* Global Stats */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.45rem 0.95rem',
            borderRadius: '999px',
            backgroundColor: 'rgba(26, 12, 54, 0.75)',
            border: '1px solid rgba(168, 85, 247, 0.3)',
          }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#34d399',
              boxShadow: '0 0 8px #34d399',
            }} />
            <span style={{ fontSize: '0.8rem', color: '#f8fafc', fontWeight: 600 }}>
              607 Movie Fans Online
            </span>
          </div>
        </div>
      </div>

      {/* Section switch: public channels vs friends & watch dates */}
      {social && (
        <div role="tablist" aria-label="Vibe Lounge sections" style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          {[
            { id: 'channels', label: 'Channels', Icon: Hash, count: 0 },
            { id: 'friends', label: 'Friends & Watch Dates', Icon: Users, count: social.badgeCount },
          ].map(({ id, label, Icon, count }) => {
            const on = section === id;
            return (
              <button
                key={id}
                role="tab"
                aria-selected={on}
                onClick={() => setSection(id)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.55rem 1.1rem', borderRadius: '999px',
                  fontSize: '0.86rem', fontWeight: on ? 700 : 500, cursor: 'pointer',
                  color: on ? '#ffffff' : '#c4b5fd',
                  backgroundColor: on ? 'rgba(168, 85, 247, 0.28)' : 'rgba(26, 12, 54, 0.65)',
                  border: on ? '1px solid #c084fc' : '1px solid rgba(168, 85, 247, 0.2)',
                  boxShadow: on ? '0 0 20px rgba(168, 85, 247, 0.4)' : 'none',
                }}
              >
                <Icon size={15} color={on ? '#c084fc' : '#a78bfa'} />
                <span>{label}</span>
                {count > 0 && (
                  <span style={{ backgroundColor: '#f43f5e', color: '#fff', fontSize: '0.65rem', fontWeight: 800, borderRadius: '999px', padding: '0.1rem 0.45rem' }}>{count}</span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {social && section === 'friends' ? (
        <FriendsHub social={social} onOpenSchedule={onOpenSchedule} />
      ) : (
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'clamp(220px, 22vw, 280px) 1fr clamp(220px, 22vw, 280px)',
        gap: '1rem',
        flex: 1,
        minHeight: '75vh',
        backgroundColor: 'rgba(12, 6, 26, 0.7)',
        borderRadius: '24px',
        border: '1px solid rgba(168, 85, 247, 0.25)',
        overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
      }}>
        
        {/* LEFT COLUMN: Channels & Rooms List */}
        <div style={{
          backgroundColor: 'rgba(16, 8, 34, 0.85)',
          borderRight: '1px solid rgba(168, 85, 247, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          padding: '1.25rem 0.85rem',
        }}>
          <span style={{
            fontSize: '0.72rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: '#a78bfa',
            marginBottom: '0.85rem',
            paddingLeft: '0.5rem',
          }}>
            Discussion Channels
          </span>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', flex: 1, overflowY: 'auto' }}>
            {COMMUNITY_CHANNELS.map((ch) => {
              const isActive = activeChannelId === ch.id;

              return (
                <button
                  key={ch.id}
                  onClick={() => setActiveChannelId(ch.id)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: '0.2rem',
                    padding: '0.75rem 0.85rem',
                    borderRadius: '14px',
                    backgroundColor: isActive ? 'rgba(168, 85, 247, 0.25)' : 'transparent',
                    border: isActive ? '1px solid #c084fc' : '1px solid transparent',
                    color: isActive ? '#ffffff' : '#c4b5fd',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: isActive ? '0 0 15px rgba(168, 85, 247, 0.3)' : 'none',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'rgba(168, 85, 247, 0.12)';
                      e.currentTarget.style.color = '#ffffff';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#c4b5fd';
                    }
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                      <Hash size={16} color={isActive ? '#c084fc' : '#a78bfa'} />
                      <span style={{ fontSize: '0.88rem', fontWeight: 700 }}>
                        {ch.name}
                      </span>
                    </div>
                    {ch.badge && (
                      <span style={{
                        fontSize: '0.62rem',
                        fontWeight: 700,
                        color: isActive ? '#f43f5e' : '#cbd5e1',
                      }}>
                        {ch.badge}
                      </span>
                    )}
                  </div>
                  <span style={{ fontSize: '0.7rem', color: '#8b7ca6', paddingLeft: '1.4rem' }}>
                    {ch.activeCount} online talking
                  </span>
                </button>
              );
            })}
          </div>

          {/* User Quick Status at Bottom of Channel Column */}
          <div style={{
            marginTop: 'auto',
            padding: '0.85rem',
            borderRadius: '14px',
            backgroundColor: 'rgba(26, 12, 54, 0.7)',
            border: '1px solid rgba(168, 85, 247, 0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
          }}>
            <img 
              src={currentProfile?.avatar} 
              alt={currentProfile?.name} 
              style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: `2px solid ${currentProfile?.color || '#a855f7'}` }}
            />
            <div style={{ overflow: 'hidden' }}>
              <h5 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {currentProfile?.name}
              </h5>
              <span style={{ fontSize: '0.68rem', color: '#34d399', fontWeight: 600 }}>
                ● Connected to Lounge
              </span>
            </div>
          </div>
        </div>

        {/* MIDDLE COLUMN: Active Channel Chat Stream */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'rgba(10, 5, 22, 0.95)',
          position: 'relative',
        }}>
          {/* Channel Header Bar */}
          <div style={{
            padding: '0.9rem 1.5rem',
            borderBottom: '1px solid rgba(168, 85, 247, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'rgba(20, 10, 42, 0.6)',
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Hash size={18} color="#c084fc" />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff' }}>
                  {activeChannel.title}
                </h3>
              </div>
              <p style={{ fontSize: '0.76rem', color: '#c4b5fd' }}>
                {activeChannel.topic}
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', color: '#c084fc', fontWeight: 700 }}>
                {activeChannel.activeCount} in room
              </span>
            </div>
          </div>

          {/* Messages Stream */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
          }}>
            {currentMessages.map((msg) => (
              <div 
                key={msg.id}
                className="animate-fadeIn"
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.85rem',
                }}
              >
                <img 
                  src={msg.avatar} 
                  alt={msg.author} 
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: `2px solid ${msg.color || '#a855f7'}`,
                    flexShrink: 0,
                    marginTop: '2px',
                  }}
                />

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: msg.color || '#ffffff' }}>
                      {msg.author}
                    </span>
                    {msg.badge && (
                      <span style={{
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        padding: '0.1rem 0.4rem',
                        borderRadius: '4px',
                        backgroundColor: 'rgba(168, 85, 247, 0.2)',
                        border: '1px solid rgba(192, 132, 252, 0.3)',
                        color: '#e9d5ff',
                      }}>
                        {msg.badge}
                      </span>
                    )}
                    <span style={{ fontSize: '0.7rem', color: '#8b7ca6' }}>
                      {msg.time}
                    </span>
                  </div>

                  <p style={{
                    fontSize: '0.88rem',
                    color: '#f1f5f9',
                    lineHeight: 1.5,
                    marginBottom: msg.attachedMovie ? '0.75rem' : '0.5rem',
                  }}>
                    {msg.text}
                  </p>

                  {/* Attached Movie Preview Card (If any) */}
                  {msg.attachedMovie && (
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.85rem',
                      padding: '0.65rem 1rem',
                      borderRadius: '14px',
                      backgroundColor: 'rgba(26, 12, 54, 0.85)',
                      border: '1px solid #c084fc',
                      boxShadow: '0 4px 20px rgba(147, 51, 234, 0.35)',
                      maxWidth: '360px',
                      marginBottom: '0.5rem',
                    }}>
                      <img 
                        src={msg.attachedMovie.image} 
                        alt={msg.attachedMovie.title} 
                        style={{ width: '55px', height: '36px', borderRadius: '6px', objectFit: 'cover' }}
                      />
                      <div style={{ flex: 1 }}>
                        <h5 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff' }}>
                          {msg.attachedMovie.title}
                        </h5>
                        <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.7rem' }}>
                          <span style={{ color: '#34d399', fontWeight: 700 }}>{msg.attachedMovie.rating}</span>
                          <span style={{ color: '#c084fc' }}>{msg.attachedMovie.quality}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => onPlayMovie(HERO_FEATURED[0])}
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          backgroundColor: '#a855f7',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                        }}
                        title="Stream Now"
                      >
                        <Play size={14} fill="#ffffff" />
                      </button>
                    </div>
                  )}

                  {/* Emoji Reactions Row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                    {Object.entries(msg.reactions || {}).map(([emoji, count]) => (
                      <button
                        key={emoji}
                        onClick={() => handleReaction(msg.id, emoji)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '999px',
                          backgroundColor: 'rgba(168, 85, 247, 0.15)',
                          border: '1px solid rgba(192, 132, 252, 0.3)',
                          fontSize: '0.74rem',
                          color: '#e9d5ff',
                          cursor: 'pointer',
                          transition: 'all 0.15s',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}
                      >
                        <span>{emoji}</span>
                        <span style={{ fontWeight: 700 }}>{count}</span>
                      </button>
                    ))}
                    <button
                      onClick={() => handleReaction(msg.id, '💜')}
                      style={{
                        padding: '0.2rem 0.45rem',
                        borderRadius: '999px',
                        backgroundColor: 'transparent',
                        color: '#8b7ca6',
                        fontSize: '0.74rem',
                        cursor: 'pointer',
                      }}
                      title="Add reaction"
                    >
                      + 💜
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#c084fc', fontSize: '0.78rem', fontStyle: 'italic' }}>
                <span style={{ animation: 'livePulse 1s infinite' }}>●</span>
                <span>Someone in the lounge is typing...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Attached Movie Indicator Preview */}
          {attachedMovie && (
            <div style={{
              padding: '0.5rem 1.5rem',
              backgroundColor: 'rgba(26, 12, 54, 0.85)',
              borderTop: '1px solid rgba(168, 85, 247, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Film size={16} color="#c084fc" />
                <span style={{ fontSize: '0.8rem', color: '#ffffff' }}>
                  Attached Movie: <strong>{attachedMovie.title}</strong>
                </span>
              </div>
              <button onClick={() => setAttachedMovie(null)} style={{ color: '#f87171', fontSize: '0.75rem', fontWeight: 600 }}>
                Remove
              </button>
            </div>
          )}

          {/* Movie Picker Popover */}
          {showMoviePicker && (
            <div 
              className="glass-panel-glow animate-fadeIn"
              style={{
                position: 'absolute',
                bottom: '80px',
                left: '1.5rem',
                right: '1.5rem',
                borderRadius: '16px',
                padding: '1rem',
                backgroundColor: 'rgba(18, 9, 38, 0.98)',
                zIndex: 30,
                maxHeight: '220px',
                overflowY: 'auto',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <h5 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#ffffff' }}>
                  Select a Movie or Series to Discuss
                </h5>
                <button onClick={() => setShowMoviePicker(false)} style={{ color: '#a78bfa', fontSize: '0.75rem' }}>
                  Close
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.65rem' }}>
                {HERO_FEATURED.concat(TOP_10_TODAY.slice(0, 4)).map((mov) => (
                  <div
                    key={mov.id}
                    onClick={() => {
                      setAttachedMovie(mov);
                      setShowMoviePicker(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.45rem',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(26, 12, 54, 0.7)',
                      cursor: 'pointer',
                      border: '1px solid rgba(168, 85, 247, 0.2)',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = '#c084fc'}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.2)'}
                  >
                    <img src={mov.image || mov.backdrop} alt={mov.title} style={{ width: '36px', height: '24px', borderRadius: '4px', objectFit: 'cover' }} />
                    <span style={{ fontSize: '0.76rem', color: '#ffffff', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {mov.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Chat Input Bar */}
          <form 
            onSubmit={handleSendMessage}
            style={{
              padding: '1rem 1.5rem',
              borderTop: '1px solid rgba(168, 85, 247, 0.25)',
              backgroundColor: 'rgba(16, 8, 34, 0.9)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
            }}
          >
            {/* Attach Movie Button */}
            <button
              type="button"
              onClick={() => setShowMoviePicker(!showMoviePicker)}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                backgroundColor: attachedMovie ? 'rgba(168, 85, 247, 0.3)' : 'rgba(255, 255, 255, 0.08)',
                border: attachedMovie ? '1px solid #c084fc' : '1px solid rgba(168, 85, 247, 0.2)',
                color: attachedMovie ? '#c084fc' : '#c4b5fd',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0,
              }}
              title="Attach Movie / Series Card"
            >
              <Film size={18} />
            </button>

            {/* Input Field */}
            <input 
              type="text"
              placeholder={`Message #${activeChannel.name}... (Press Enter to send)`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              style={{
                flex: 1,
                padding: '0.8rem 1.1rem',
                borderRadius: '12px',
                backgroundColor: 'rgba(26, 12, 54, 0.85)',
                border: '1px solid rgba(168, 85, 247, 0.35)',
                color: '#ffffff',
                fontSize: '0.9rem',
              }}
            />

            {/* Quick Emoji Buttons */}
            <div style={{ display: 'flex', gap: '0.3rem' }}>
              {['🔥', '🍿', '💜'].map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setInputText(prev => prev + ' ' + emoji)}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0.4rem 0.5rem',
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                  }}
                >
                  {emoji}
                </button>
              ))}
            </div>

            {/* Send Button */}
            <button
              type="submit"
              disabled={!inputText.trim() && !attachedMovie}
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: (inputText.trim() || attachedMovie)
                  ? 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)'
                  : 'rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: (inputText.trim() || attachedMovie) ? 'pointer' : 'not-allowed',
                boxShadow: (inputText.trim() || attachedMovie) ? '0 0 15px rgba(168, 85, 247, 0.6)' : 'none',
                flexShrink: 0,
                transition: 'all 0.2s',
              }}
              title="Send Message"
            >
              <Send size={18} />
            </button>
          </form>
        </div>

        {/* RIGHT COLUMN: Online Community Members & Watch Party Sync */}
        <div style={{
          backgroundColor: 'rgba(16, 8, 34, 0.85)',
          borderLeft: '1px solid rgba(168, 85, 247, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          padding: '1.25rem 0.85rem',
          overflowY: 'auto',
        }}>
          {/* Live Watch Party Sync Widget */}
          <div style={{
            padding: '1rem',
            borderRadius: '16px',
            backgroundColor: 'rgba(26, 12, 54, 0.8)',
            border: '1px solid #c084fc',
            boxShadow: '0 0 20px rgba(168, 85, 247, 0.35)',
            marginBottom: '1.25rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
              <span style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#ef4444',
                animation: 'livePulse 1.5s infinite',
              }} />
              <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#fca5a5', letterSpacing: '0.05em' }}>
                COMMUNITY WATCH PARTY
              </span>
            </div>

            <h5 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.2rem' }}>
              Interstellar Odyssey
            </h5>
            <span style={{ fontSize: '0.72rem', color: '#c4b5fd', display: 'block', marginBottom: '0.75rem' }}>
              Ch. 101 • 248K synched viewers
            </span>

            <button
              onClick={() => onPlayMovie(HERO_FEATURED[1])}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.45rem',
                padding: '0.55rem',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
                color: '#ffffff',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 0 15px rgba(168, 85, 247, 0.5)',
              }}
            >
              <Play size={14} fill="#ffffff" />
              <span>Join Watch Party</span>
            </button>
          </div>

          {/* Members List */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem', paddingLeft: '0.5rem' }}>
            <span style={{
              fontSize: '0.72rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: '#a78bfa',
            }}>
              Members in Lounge
            </span>
            <span style={{ fontSize: '0.72rem', color: '#34d399', fontWeight: 700 }}>
              {ONLINE_COMMUNITY_USERS.length}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {ONLINE_COMMUNITY_USERS.map((user) => (
              <div
                key={user.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  padding: '0.45rem 0.55rem',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  transition: 'background 0.2s',
                }}
              >
                <div style={{ position: 'relative' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: `${user.color}30`,
                    border: `1.5px solid ${user.color}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: '#ffffff',
                  }}>
                    {user.name[0]}
                  </div>
                  <span style={{
                    position: 'absolute',
                    bottom: '-1px',
                    right: '-1px',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: '#34d399',
                    border: '1.5px solid #070312',
                  }} />
                </div>

                <div style={{ overflow: 'hidden' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f8fafc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {user.name}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.68rem', color: '#8b7ca6', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {user.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
      )}
    </div>
  );
}
