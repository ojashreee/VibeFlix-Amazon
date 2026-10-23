
import React, { useMemo, useState } from 'react';
import {
  Tv, Play, X, Clock, Radio, Sparkles, Filter,
  Flame, Heart, Laugh, ThumbsUp, MessageCircle,
  Users, Send, Plus, Check, Search, ChevronRight,
  Music, Film, Zap, Popcorn, CalendarDays
} from 'lucide-react';
import { LIVE_FIRE_CHANNELS } from '../data/mockData';

const GENRES = [
  'all', 'Cinema', 'Sci-Fi', 'Action',
  'Music & Ambience', 'Documentary'
];

const REACTIONS = [
  { emoji: '🔥', label: 'Fire' },
  { emoji: '❤️', label: 'Love' },
  { emoji: '😱', label: 'Wow' },
  { emoji: '😂', label: 'Funny' },
];

const DEMO_ACTIVITIES = [
  { user: 'CinemaFan', action: 'is exploring tonight’s lineup', emoji: '🎬' },
  { user: 'DramaLover', action: 'is looking for a new favorite', emoji: '🍿' },
  { user: 'MovieBuff', action: 'is checking out FireLive', emoji: '🔥' },
];

export function LiveTVGuideModal({ onClose, onTuneChannel }) {
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [activeTab, setActiveTab] = useState('live');
  const [search, setSearch] = useState('');
  const [mood, setMood] = useState('Thriller');
  const [reactions, setReactions] = useState({});
  const [votes, setVotes] = useState({});
  const [votedPoll, setVotedPoll] = useState(null);
  const [partyName, setPartyName] = useState('');
  const [roomCreated, setRoomCreated] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { user: 'Viby', text: 'Welcome to FireLive! What are we watching today? 🍿' },
  ]);

  const channels = useMemo(() => {
    return LIVE_FIRE_CHANNELS.filter(channel => {
      const matchesGenre =
        selectedGenre === 'all' || channel.genre === selectedGenre;
      const matchesSearch =
        `${channel.name} ${channel.genre} ${channel.currentShow}`
          .toLowerCase()
          .includes(search.toLowerCase());

      return matchesGenre && matchesSearch;
    });
  }, [selectedGenre, search]);

  const featuredChannel = channels[0] || LIVE_FIRE_CHANNELS[0];

  const moodGenres = {
    Thriller: ['Cinema', 'Action'],
    Relax: ['Music & Ambience', 'Documentary'],
    Adventure: ['Action', 'Sci-Fi'],
    Discover: ['Cinema', 'Sci-Fi', 'Documentary'],
  };

  const vibePicks = LIVE_FIRE_CHANNELS.filter(channel =>
    (moodGenres[mood] || []).includes(channel.genre)
  );

  const handleReaction = (channelId, emoji) => {
    setReactions(previous => ({
      ...previous,
      [channelId]: {
        ...previous[channelId],
        [emoji]: previous[channelId]?.[emoji] ? 0 : 1,
      },
    }));
  };

  const handleVote = option => {
    if (votedPoll) return;
    setVotedPoll(option);
    setVotes(previous => ({
      ...previous,
      [option]: (previous[option] || 0) + 1,
    }));
  };

  const sendMessage = event => {
    event.preventDefault();
    const text = chatMessage.trim();
    if (!text) return;

    setChatMessages(previous => [
      ...previous,
      { user: 'You', text },
    ]);
    setChatMessage('');
  };

  const createParty = event => {
    event.preventDefault();
    if (!partyName.trim()) return;
    setRoomCreated(true);
  };

  const tuneChannel = channel => {
    onClose();
    onTuneChannel?.({
      id: channel.id,
      title: `${channel.name} [LIVE]`,
      subtitle: channel.currentShow,
      videoUrl: channel.videoUrl,
      backdrop: channel.thumbnail,
    });
  };

  const panel = {
    background: 'rgba(25, 14, 45, 0.88)',
    border: '1px solid rgba(168, 85, 247, 0.24)',
    borderRadius: 16,
    padding: 18,
  };

  const button = (active = false) => ({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    padding: '9px 13px',
    borderRadius: 999,
    border: `1px solid ${active ? '#c084fc' : 'rgba(192,132,252,.22)'}`,
    background: active
      ? 'rgba(168,85,247,.3)'
      : 'rgba(255,255,255,.045)',
    color: '#f5f3ff',
    fontSize: 12,
    fontWeight: 650,
    cursor: 'pointer',
  });

  const heading = {
    color: '#fff',
    fontSize: 17,
    fontWeight: 800,
    margin: '0 0 6px',
  };

  const muted = {
    color: '#b9aecf',
    fontSize: 12,
    lineHeight: 1.6,
  };

  return (
    <div
      className="firelive-overlay"
      onClick={onClose}
      role="presentation"
    >
      <style>{`
        .firelive-overlay {
          position: fixed;
          inset: 0;
          z-index: 95;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          background: rgba(5,2,14,.9);
          backdrop-filter: blur(18px);
        }
        .firelive-modal {
          width: 100%;
          max-width: 1120px;
          height: min(90vh, 900px);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          color: #f8fafc;
          background: #0d061a;
          border: 1px solid rgba(168,85,247,.4);
          border-radius: 22px;
          box-shadow: 0 25px 80px #000b, 0 0 40px #9333ea22;
        }
        .firelive-scroll {
          overflow-y: auto;
          flex: 1;
          padding: 20px;
        }
        .firelive-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0,1fr));
          gap: 14px;
        }
        .firelive-channels {
          display: grid;
          grid-template-columns: minmax(0,1.3fr) minmax(0,1fr);
          gap: 14px;
          align-items: center;
        }
        .firelive-input {
          width: 100%;
          min-width: 0;
          box-sizing: border-box;
          padding: 11px 12px;
          border-radius: 10px;
          border: 1px solid #553777;
          color: white;
          background: #130b22;
          outline: none;
        }
        .firelive-input:focus {
          border-color: #c084fc;
          box-shadow: 0 0 0 2px #a855f733;
        }
        .firelive-btn-primary {
          border: 0;
          border-radius: 10px;
          padding: 10px 14px;
          color: white;
          background: linear-gradient(110deg,#7c3aed,#a855f7,#db2777);
          font-weight: 750;
          cursor: pointer;
        }
        .firelive-btn-primary:focus-visible,
        .firelive-overlay button:focus-visible {
          outline: 2px solid #f0abfc;
          outline-offset: 3px;
        }
        .firelive-poster {
          width: 64px;
          height: 64px;
          flex-shrink: 0;
          object-fit: cover;
          border-radius: 12px;
          background: #211333;
        }
        @media(max-width:700px) {
          .firelive-overlay { padding: 6px; }
          .firelive-modal { height: 96vh; border-radius: 14px; }
          .firelive-scroll { padding: 12px; }
          .firelive-grid { grid-template-columns: 1fr; }
          .firelive-channels { grid-template-columns: 1fr; }
          .firelive-header { padding: 12px !important; }
          .firelive-header h2 { font-size: 15px !important; }
          .firelive-subtitle { display: none; }
        }
      `}</style>

      <div
        className="firelive-modal animate-fadeIn"
        onClick={event => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="firelive-title"
      >
        {/* Header */}
        <header
          className="firelive-header"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            padding: '17px 22px',
            borderBottom: '1px solid #a855f733',
            background: 'linear-gradient(100deg,#24113c,#12091f)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              display: 'grid',
              placeItems: 'center',
              width: 42,
              height: 42,
              borderRadius: 12,
              background: '#a855f726',
              border: '1px solid #c084fc',
            }}>
              <Flame color="#e879f9" size={23} />
            </div>
            <div>
              <div style={{
                display: 'flex',
                gap: 9,
                alignItems: 'center',
                flexWrap: 'wrap',
              }}>
                <h2
                  id="firelive-title"
                  style={{ margin: 0, fontSize: 20, fontWeight: 900 }}
                >
                  FireLive
                </h2>
                <span style={{
                  fontSize: 10,
                  fontWeight: 900,
                  color: '#fff',
                  background: '#e11d48',
                  padding: '4px 7px',
                  borderRadius: 5,
                }}>
                  ON AIR
                </span>
              </div>
              <p className="firelive-subtitle" style={{
                ...muted, margin: '3px 0 0',
              }}>
                Watch live. Discover your vibe. Join the conversation.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close FireLive"
            style={button()}
          >
            <X size={17} />
          </button>
        </header>

        {/* Navigation */}
        <nav style={{
          display: 'flex',
          gap: 8,
          padding: '12px 18px',
          borderBottom: '1px solid #a855f722',
          overflowX: 'auto',
        }}>
          {[
            { id: 'live', label: 'Live Guide', icon: Radio },
            { id: 'trending', label: 'Trending', icon: Flame },
            { id: 'viby', label: "Viby's Picks", icon: Sparkles },
            { id: 'party', label: 'Watch Party', icon: Users },
            { id: 'community', label: 'Community', icon: MessageCircle },
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={button(activeTab === tab.id)}
              >
                <Icon size={14} />
                {tab.label}
              </button>
            );
          })}
        </nav>

        <main className="firelive-scroll">
          {/* LIVE GUIDE */}
          {activeTab === 'live' && (
            <div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 12,
                flexWrap: 'wrap',
                marginBottom: 16,
              }}>
                <div>
                  <h3 style={heading}>Your live entertainment guide</h3>
                  <p style={muted}>
                    Explore channels and tune into the current programme.
                  </p>
                </div>
                <div style={{
                  display: 'flex',
                  gap: 7,
                  alignItems: 'center',
                }}>
                  <Search size={15} color="#c084fc" />
                  <input
                    className="firelive-input"
                    aria-label="Search channels"
                    placeholder="Search channels..."
                    value={search}
                    onChange={event => setSearch(event.target.value)}
                    style={{ width: 190 }}
                  />
                </div>
              </div>

              <div style={{
                display: 'flex',
                gap: 7,
                overflowX: 'auto',
                paddingBottom: 14,
              }}>
                {GENRES.map(genre => (
                  <button
                    key={genre}
                    onClick={() => setSelectedGenre(genre)}
                    style={button(selectedGenre === genre)}
                  >
                    {genre === 'all' ? 'All Channels' : genre}
                  </button>
                ))}
              </div>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
              }}>
                {channels.map(channel => (
                  <section key={channel.id} style={panel}>
                    <div className="firelive-channels">
                      <div style={{
                        display: 'flex',
                        gap: 12,
                        alignItems: 'center',
                      }}>
                        <img
                          className="firelive-poster"
                          src={channel.thumbnail}
                          alt={channel.name}
                        />
                        <div style={{ minWidth: 0 }}>
                          <p style={{
                            color: '#c084fc',
                            fontSize: 10,
                            fontWeight: 800,
                            margin: '0 0 5px',
                          }}>
                            CH {channel.channelNumber} · {channel.genre}
                          </p>
                          <h4 style={{
                            margin: '0 0 5px',
                            fontSize: 15,
                          }}>
                            {channel.name}
                          </h4>
                          <p style={{ ...muted, margin: 0 }}>
                            <Users size={12} style={{
                              display: 'inline', verticalAlign: 'middle',
                            }} />{' '}
                            {channel.viewers} tuning in
                          </p>
                        </div>
                      </div>

                      <div>
                        <p style={{
                          color: '#c084fc',
                          fontSize: 10,
                          fontWeight: 800,
                          margin: '0 0 5px',
                        }}>
                          <Radio size={12} style={{
                            display: 'inline', verticalAlign: 'middle',
                          }} /> ON NOW
                        </p>
                        <h4 style={{
                          margin: '0 0 10px',
                          fontSize: 14,
                        }}>
                          {channel.currentShow}
                        </h4>
                        <div style={{
                          height: 4,
                          borderRadius: 9,
                          overflow: 'hidden',
                          background: '#ffffff1c',
                        }}>
                          <div style={{
                            width: `${Math.min(
                              100, Math.max(0, channel.progress || 0)
                            )}%`,
                            height: '100%',
                            background: 'linear-gradient(90deg,#9333ea,#e879f9)',
                          }} />
                        </div>
                        <p style={{ ...muted, margin: '6px 0 10px' }}>
                          <Clock size={12} style={{
                            display: 'inline', verticalAlign: 'middle',
                          }} />{' '}
                          Next in {channel.timeRemaining}
                        </p>
                        <button
                          className="firelive-btn-primary"
                          onClick={() => tuneChannel(channel)}
                        >
                          <Play size={13} fill="white"
                            style={{ display: 'inline', verticalAlign: 'middle' }}
                          /> Watch Live
                        </button>
                      </div>
                    </div>

                    {/* Reactions */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: 7,
                      marginTop: 15,
                      paddingTop: 12,
                      borderTop: '1px solid #a855f722',
                    }}>
                      <span style={{ ...muted, marginRight: 3 }}>
                        React:
                      </span>
                      {REACTIONS.map(reaction => (
                        <button
                          key={reaction.emoji}
                          aria-label={`${reaction.label} reaction`}
                          onClick={() => handleReaction(
                            channel.id, reaction.emoji
                          )}
                          style={button(
                            Boolean(reactions[channel.id]?.[reaction.emoji])
                          )}
                        >
                          {reaction.emoji}{' '}
                          {reactions[channel.id]?.[reaction.emoji] || 0}
                        </button>
                      ))}
                    </div>
                  </section>
                ))}

                {channels.length === 0 && (
                  <div style={{ ...panel, textAlign: 'center', padding: 36 }}>
                    <Search size={26} color="#c084fc" />
                    <h3>No channels found</h3>
                    <p style={muted}>Try another title or genre.</p>
                    <button
                      style={button()}
                      onClick={() => {
                        setSearch('');
                        setSelectedGenre('all');
                      }}
                    >
                      Clear filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TRENDING */}
          {activeTab === 'trending' && (
            <div>
              <h3 style={heading}>
                <Flame size={18} color="#fb7185"
                  style={{ display: 'inline', verticalAlign: 'middle' }}
                /> Trending on FireLive
              </h3>
              <p style={muted}>
                Discover what is catching viewers’ attention.
              </p>

              <div className="firelive-grid" style={{ marginTop: 18 }}>
                {LIVE_FIRE_CHANNELS.map((channel, index) => (
                  <section key={channel.id} style={panel}>
                    <img
                      src={channel.thumbnail}
                      alt={channel.name}
                      style={{
                        width: '100%',
                        height: 135,
                        objectFit: 'cover',
                        borderRadius: 12,
                        marginBottom: 12,
                      }}
                    />
                    <p style={{
                      color: '#f0abfc',
                      fontSize: 11,
                      fontWeight: 800,
                    }}>
                      #{index + 1} · {channel.genre}
                    </p>
                    <h3 style={heading}>{channel.name}</h3>
                    <p style={muted}>{channel.currentShow}</p>
                    <button
                      className="firelive-btn-primary"
                      onClick={() => tuneChannel(channel)}
                    >
                      <Play size={13} style={{
                        display: 'inline', verticalAlign: 'middle',
                      }} /> Tune in
                    </button>
                  </section>
                ))}
              </div>
              <p style={{ ...muted, marginTop: 12 }}>
                Rankings use your local channel list in this demo, not
                verified real-time viewing statistics.
              </p>
            </div>
          )}

          {/* VIBY AI PICKS */}
          {activeTab === 'viby' && (
            <div>
              <section style={{
                ...panel,
                background: 'linear-gradient(130deg,#291347,#171026 65%,#31102f)',
                marginBottom: 16,
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  marginBottom: 15,
                }}>
                  <div style={{
                    width: 46,
                    height: 46,
                    display: 'grid',
                    placeItems: 'center',
                    borderRadius: 14,
                    background: '#a855f733',
                  }}>
                    <Sparkles size={24} color="#e9d5ff" />
                  </div>
                  <div>
                    <h3 style={heading}>Viby’s Picks</h3>
                    <p style={{ ...muted, margin: 0 }}>
                      Your mood. Your next watch.
                    </p>
                  </div>
                </div>
                <p style={{ color: '#e9d5ff', fontSize: 14 }}>
                  What kind of vibe are you looking for today?
                </p>
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 8,
                }}>
                  {['Thriller', 'Relax', 'Adventure', 'Discover'].map(item => (
                    <button
                      key={item}
                      onClick={() => setMood(item)}
                      style={button(mood === item)}
                    >
                      {item === 'Relax' ? '🌙' :
                        item === 'Adventure' ? '🚀' :
                          item === 'Discover' ? '✨' : '🔪'} {item}
                    </button>
                  ))}
                </div>
              </section>

              <h3 style={heading}>Picked for your {mood.toLowerCase()} mood</h3>
              <p style={muted}>
                Suggestions are matched to the genres in your local channel data.
              </p>

              <div className="firelive-grid" style={{ marginTop: 14 }}>
                {(vibePicks.length ? vibePicks : LIVE_FIRE_CHANNELS).map(channel => (
                  <section key={channel.id} style={panel}>
                    <div style={{
                      display: 'flex',
                      gap: 12,
                      alignItems: 'center',
                      marginBottom: 12,
                    }}>
                      <img
                        className="firelive-poster"
                        src={channel.thumbnail}
                        alt={channel.name}
                      />
                      <div>
                        <h3 style={heading}>{channel.name}</h3>
                        <p style={{ ...muted, margin: 0 }}>
                          {channel.genre}
                        </p>
                      </div>
                    </div>
                    <p style={{ color: '#e9d5ff', fontSize: 13 }}>
                      {channel.currentShow}
                    </p>
                    <button
                      className="firelive-btn-primary"
                      onClick={() => tuneChannel(channel)}
                    >
                      <Play size={13} style={{
                        display: 'inline', verticalAlign: 'middle',
                      }} /> Watch this channel
                    </button>
                  </section>
                ))}
              </div>
              <p style={{ ...muted, marginTop: 12 }}>
                Note: these are genre-based suggestions, not generated by an
                AI model. Connect your Viby assistant for personalized AI picks.
              </p>
            </div>
          )}

          {/* WATCH PARTY */}
          {activeTab === 'party' && (
            <div>
              <h3 style={heading}>
                <Users size={18} color="#c084fc"
                  style={{ display: 'inline', verticalAlign: 'middle' }}
                /> Watch Party
              </h3>
              <p style={muted}>
                Set up a room for friends to chat about what you’re watching.
              </p>

              <section style={{ ...panel, marginTop: 16 }}>
                {roomCreated ? (
                  <>
                    <div style={{
                      display: 'flex',
                      gap: 10,
                      alignItems: 'center',
                    }}>
                      <Check color="#86efac" size={24} />
                      <div>
                        <h3 style={heading}>{partyName}</h3>
                        <p style={{ ...muted, margin: 0 }}>
                          Demo room created in this session.
                        </p>
                      </div>
                    </div>
                    <div style={{
                      marginTop: 16,
                      padding: 12,
                      borderRadius: 12,
                      background: '#090511',
                    }}>
                      <p style={{
                        color: '#e9d5ff',
                        fontSize: 12,
                        fontWeight: 750,
                      }}>
                        PARTY CHAT
                      </p>
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 9,
                        maxHeight: 210,
                        overflowY: 'auto',
                        marginBottom: 12,
                      }}>
                        {chatMessages.map((message, index) => (
                          <div key={`${index}-${message.user}`}>
                            <span style={{
                              color: '#c084fc',
                              fontWeight: 800,
                              fontSize: 12,
                            }}>
                              {message.user}
                            </span>
                            <p style={{
                              color: '#e2e8f0',
                              margin: '3px 0 0',
                              fontSize: 13,
                              overflowWrap: 'anywhere',
                            }}>
                              {message.text}
                            </p>
                          </div>
                        ))}
                      </div>
                      <form onSubmit={sendMessage} style={{
                        display: 'flex',
                        gap: 8,
                      }}>
                        <input
                          className="firelive-input"
                          aria-label="Party chat message"
                          value={chatMessage}
                          onChange={event => setChatMessage(event.target.value)}
                          placeholder="Say something..."
                        />
                        <button className="firelive-btn-primary" type="submit"
                          aria-label="Send message">
                          <Send size={15} />
                        </button>
                      </form>
                    </div>
                    <button
                      style={{ ...button(), marginTop: 12 }}
                      onClick={() => {
                        setRoomCreated(false);
                        setPartyName('');
                      }}
                    >
                      Leave demo room
                    </button>
                  </>
                ) : (
                  <form onSubmit={createParty}>
                    <div style={{
                      width: 54,
                      height: 54,
                      borderRadius: 16,
                      display: 'grid',
                      placeItems: 'center',
                      background: '#a855f72b',
                      marginBottom: 14,
                    }}>
                      <Tv size={27} color="#d8b4fe" />
                    </div>
                    <h3 style={heading}>Create your watch room</h3>
                    <p style={muted}>
                      Give your party a name and start a discussion with friends.
                    </p>
                    <label htmlFor="party-name" style={{
                      display: 'block',
                      color: '#e9d5ff',
                      fontSize: 12,
                      margin: '14px 0 7px',
                    }}>
                      Room name
                    </label>
                    <input
                      id="party-name"
                      className="firelive-input"
                      value={partyName}
                      onChange={event => setPartyName(event.target.value)}
                      placeholder="e.g. Friday Thriller Night"
                      maxLength={60}
                      required
                    />
                    <button
                      className="firelive-btn-primary"
                      style={{ marginTop: 12 }}
                      type="submit"
                    >
                      <Plus size={15}
                        style={{ display: 'inline', verticalAlign: 'middle' }}
                      /> Create watch room
                    </button>
                  </form>
                )}
              </section>
              <p style={{ ...muted, marginTop: 12 }}>
                This room and its messages are local to this browser session.
                Shared rooms and invitations require your WebSocket backend.
              </p>
            </div>
          )}

          {/* COMMUNITY */}
          {activeTab === 'community' && (
            <div>
              <h3 style={heading}>
                <MessageCircle size={18} color="#c084fc"
                  style={{ display: 'inline', verticalAlign: 'middle' }}
                /> FireLive Community
              </h3>
              <p style={muted}>
                Discover what other movie lovers are up to.
              </p>

              <section style={{ ...panel, marginTop: 15 }}>
                <h3 style={heading}>Movie night poll</h3>
                <p style={{ color: '#e9d5ff', fontSize: 14 }}>
                  What should everyone watch tonight?
                </p>

                {[
                  { id: 'thriller', label: '🔪 Thriller night' },
                  { id: 'romance', label: '❤️ Romance night' },
                  { id: 'scifi', label: '🚀 Sci-Fi marathon' },
                ].map(option => {
                  const total = Object.values(votes).reduce(
                    (sum, count) => sum + count, 0
                  );
                  const percent = total
                    ? Math.round(((votes[option.id] || 0) / total) * 100)
                    : 0;

                  return (
                    <button
                      key={option.id}
                      onClick={() => handleVote(option.id)}
                      disabled={Boolean(votedPoll)}
                      style={{
                        display: 'block',
                        width: '100%',
                        position: 'relative',
                        overflow: 'hidden',
                        textAlign: 'left',
                        padding: 12,
                        marginTop: 8,
                        borderRadius: 10,
                        border: `1px solid ${
                          votedPoll === option.id ? '#c084fc' : '#553777'
                        }`,
                        background: '#130b22',
                        color: '#fff',
                        cursor: votedPoll ? 'default' : 'pointer',
                      }}
                    >
                      <span style={{
                        position: 'absolute',
                        inset: '0 auto 0 0',
                        width: `${percent}%`,
                        background: '#a855f726',
                        transition: 'width .25s',
                      }} />
                      <span style={{
                        position: 'relative',
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: 10,
                      }}>
                        <span>{option.label}</span>
                        <span>{votedPoll ? `${percent}%` : 'Vote'}</span>
                      </span>
                    </button>
                  );
                })}
                <p style={{ ...muted, marginTop: 10 }}>
                  {votedPoll
                    ? 'Thanks for voting! Results reflect this session only.'
                    : 'Choose your favorite to reveal the demo poll results.'}
                </p>
              </section>

              <h3 style={{ ...heading, marginTop: 22 }}>Community activity</h3>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
                marginTop: 12,
              }}>
                {DEMO_ACTIVITIES.map((activity, index) => (
                  <section
                    key={activity.user}
                    style={{
                      ...panel,
                      display: 'flex',
                      gap: 12,
                      alignItems: 'center',
                    }}
                  >
                    <div style={{
                      width: 42,
                      height: 42,
                      display: 'grid',
                      placeItems: 'center',
                      borderRadius: 50,
                      background: '#a855f729',
                      fontSize: 20,
                    }}>
                      {activity.emoji}
                    </div>
                    <div>
                      <p style={{ margin: 0, fontSize: 13 }}>
                        <strong>{activity.user}</strong> {activity.action}
                      </p>
                      <p style={{ ...muted, margin: '5px 0 0' }}>
                        Sample activity · {index + 1}
                      </p>
                    </div>
                  </section>
                ))}
              </div>
              <p style={{ ...muted, marginTop: 12 }}>
                Sample activity is illustrative. Connect this feed to your
                existing community server for real posts and users.
              </p>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 10,
          padding: '12px 20px',
          borderTop: '1px solid #a855f733',
          background: '#10081c',
        }}>
          <span style={muted}>
            <Sparkles size={13} style={{
              display: 'inline', verticalAlign: 'middle',
            }} /> Powered by VibeFlix
          </span>
          <button
            style={button()}
            onClick={onClose}
          >
            Back to VibeFlix <ChevronRight size={14} />
          </button>
        </footer>
      </div>
    </div>
  );
}
