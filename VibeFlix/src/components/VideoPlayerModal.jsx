import React, { useRef, useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  RotateCw, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize, 
  ArrowLeft, 
  Settings, 
  Subtitles, 
  Sparkles,
  Layers
} from 'lucide-react';

export function VideoPlayerModal({ movie, onClose }) {
  const videoRef = useRef(null);
  const playerContainerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [subtitlesEnabled, setSubtitlesEnabled] = useState(false);

  // Auto-hide controls timer
  useEffect(() => {
    let timeout;
    const resetTimer = () => {
      setShowControls(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (isPlaying) {
          setShowControls(false);
        }
      }, 3500);
    };

    window.addEventListener('mousemove', resetTimer);
    return () => {
      window.removeEventListener('mousemove', resetTimer);
      clearTimeout(timeout);
    };
  }, [isPlaying]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === ' ') {
        e.preventDefault();
        togglePlay();
      } else if (e.key === 'ArrowRight') {
        skipTime(10);
      } else if (e.key === 'ArrowLeft') {
        skipTime(-10);
      } else if (e.key === 'm' || e.key === 'M') {
        toggleMute();
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, isMuted]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e) => {
    const seekTo = parseFloat(e.target.value);
    setCurrentTime(seekTo);
    if (videoRef.current) {
      videoRef.current.currentTime = seekTo;
    }
  };

  const skipTime = (seconds) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.min(Math.max(videoRef.current.currentTime + seconds, 0), duration);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
      setIsMuted(val === 0);
    }
  };

  const toggleFullscreen = () => {
    if (!playerContainerRef.current) return;
    if (!document.fullscreenElement) {
      playerContainerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const formatTime = (secs) => {
    if (isNaN(secs)) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div 
      ref={playerContainerRef}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: '#000000',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        userSelect: 'none',
      }}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={movie.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4'}
        poster={movie.backdrop || movie.image}
        autoPlay
        playsInline
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onClick={togglePlay}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          backgroundColor: '#000000',
        }}
      />

      {/* Ambient Violet Glow Scrim */}
      <div style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        background: `radial-gradient(circle at 50% 50%, transparent 60%, rgba(7, 3, 18, 0.4) 100%)`,
        zIndex: 5,
      }} />

      {/* Subtitles Overlay Simulation */}
      {subtitlesEnabled && (
        <div style={{
          position: 'absolute',
          bottom: showControls ? '110px' : '45px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'rgba(7, 3, 18, 0.85)',
          border: '1px solid rgba(168, 85, 247, 0.3)',
          padding: '0.4rem 1.2rem',
          borderRadius: '8px',
          color: '#ffffff',
          fontSize: '1.05rem',
          fontWeight: 600,
          zIndex: 15,
          textAlign: 'center',
          maxWidth: '80%',
          boxShadow: '0 4px 20px rgba(0,0,0,0.8)',
          transition: 'bottom 0.3s ease',
        }}>
          [Dolby 5.1 Atmos - Dialogues Encoded in 4K]
        </div>
      )}

      {/* Top Bar HUD */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        padding: '1.5rem max(1.5rem, 3vw)',
        background: 'linear-gradient(to bottom, rgba(7, 3, 18, 0.95) 0%, rgba(7, 3, 18, 0.5) 60%, transparent 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 20,
        opacity: showControls ? 1 : 0,
        pointerEvents: showControls ? 'auto' : 'none',
        transition: 'opacity 0.3s ease',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={onClose}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.55rem 1.1rem',
              borderRadius: '999px',
              backgroundColor: 'rgba(26, 12, 54, 0.75)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(168, 85, 247, 0.3)',
              color: '#ffffff',
              fontSize: '0.88rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(168, 85, 247, 0.3)';
              e.currentTarget.style.borderColor = '#c084fc';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(26, 12, 54, 0.75)';
              e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.3)';
            }}
          >
            <ArrowLeft size={18} />
            <span>Back to Browse</span>
          </button>

          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff' }}>
              {movie.title}
            </h3>
            <span style={{ fontSize: '0.78rem', color: '#c4b5fd' }}>
              {movie.subtitle || movie.genres?.join(' • ') || 'VibeFlix 4K Cinema'}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{
            padding: '0.2rem 0.55rem',
            borderRadius: '6px',
            backgroundColor: 'rgba(168, 85, 247, 0.25)',
            border: '1px solid rgba(192, 132, 252, 0.4)',
            color: '#c084fc',
            fontSize: '0.74rem',
            fontWeight: 800,
            letterSpacing: '0.05em',
          }}>
            4K ULTRA HD
          </span>
          <span style={{
            padding: '0.2rem 0.55rem',
            borderRadius: '6px',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            color: '#e2e8f0',
            fontSize: '0.74rem',
            fontWeight: 700,
          }}>
            DOLBY ATMOS
          </span>
        </div>
      </div>

      {/* Bottom Controls HUD */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '2rem max(1.5rem, 3vw) 1.5rem',
        background: 'linear-gradient(to top, rgba(7, 3, 18, 0.98) 0%, rgba(7, 3, 18, 0.7) 60%, transparent 100%)',
        zIndex: 20,
        opacity: showControls ? 1 : 0,
        pointerEvents: showControls ? 'auto' : 'none',
        transition: 'opacity 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}>
        {/* Scrubber Progress Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '100%' }}>
          <span style={{ fontSize: '0.8rem', color: '#cbd5e1', fontWeight: 600, minWidth: '45px' }}>
            {formatTime(currentTime)}
          </span>

          <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center' }}>
            <input 
              type="range"
              min="0"
              max={duration || 100}
              step="0.1"
              value={currentTime}
              onChange={handleSeek}
              style={{
                width: '100%',
                cursor: 'pointer',
                accentColor: '#c084fc',
                height: '6px',
                borderRadius: '999px',
                background: `linear-gradient(to right, #9333ea 0%, #c084fc ${progressPercent}%, rgba(255, 255, 255, 0.2) ${progressPercent}%)`,
              }}
            />
          </div>

          <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600, minWidth: '45px', textAlign: 'right' }}>
            {formatTime(duration)}
          </span>
        </div>

        {/* Action Controls Row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Left Buttons: Play, Skips, Volume */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Play/Pause */}
            <button
              onClick={togglePlay}
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 0 20px rgba(168, 85, 247, 0.7)',
                cursor: 'pointer',
                transition: 'transform 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause size={20} fill="#ffffff" /> : <Play size={20} fill="#ffffff" style={{ marginLeft: '2px' }} />}
            </button>

            {/* Skip 10s Backward */}
            <button
              onClick={() => skipTime(-10)}
              style={{ color: '#c4b5fd', padding: '0.4rem', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              title="Rewind 10 seconds"
            >
              <RotateCcw size={20} />
            </button>

            {/* Skip 10s Forward */}
            <button
              onClick={() => skipTime(10)}
              style={{ color: '#c4b5fd', padding: '0.4rem', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              title="Fast forward 10 seconds"
            >
              <RotateCw size={20} />
            </button>

            {/* Volume */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginLeft: '0.5rem' }}>
              <button onClick={toggleMute} style={{ color: '#c4b5fd', display: 'flex', alignItems: 'center' }}>
                {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
              <input 
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                style={{
                  width: '75px',
                  accentColor: '#c084fc',
                  cursor: 'pointer',
                  height: '4px',
                }}
              />
            </div>
          </div>

          {/* Right Buttons: Subtitles, Speed, Fullscreen */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', position: 'relative' }}>
            
            {/* Speed Selector */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                style={{
                  padding: '0.35rem 0.65rem',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(168, 85, 247, 0.3)',
                  color: '#ffffff',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                }}
                title="Playback Speed"
              >
                {playbackSpeed}x
              </button>

              {showSpeedMenu && (
                <div 
                  className="glass-panel-glow animate-fadeIn"
                  style={{
                    position: 'absolute',
                    bottom: '40px',
                    right: 0,
                    borderRadius: '10px',
                    padding: '0.4rem',
                    backgroundColor: 'rgba(14, 7, 28, 0.95)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.2rem',
                    minWidth: '80px',
                  }}
                >
                  {[0.75, 1, 1.25, 1.5].map((spd) => (
                    <button
                      key={spd}
                      onClick={() => {
                        setPlaybackSpeed(spd);
                        if (videoRef.current) videoRef.current.playbackRate = spd;
                        setShowSpeedMenu(false);
                      }}
                      style={{
                        padding: '0.3rem 0.6rem',
                        borderRadius: '6px',
                        fontSize: '0.76rem',
                        fontWeight: 600,
                        color: playbackSpeed === spd ? '#c084fc' : '#e2e8f0',
                        backgroundColor: playbackSpeed === spd ? 'rgba(168, 85, 247, 0.2)' : 'transparent',
                        textAlign: 'center',
                      }}
                    >
                      {spd}x
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Subtitles Button */}
            <button
              onClick={() => setSubtitlesEnabled(!subtitlesEnabled)}
              style={{
                color: subtitlesEnabled ? '#c084fc' : '#c4b5fd',
                display: 'flex',
                alignItems: 'center',
                backgroundColor: subtitlesEnabled ? 'rgba(168, 85, 247, 0.2)' : 'transparent',
                padding: '0.4rem',
                borderRadius: '8px',
              }}
              title="Subtitles / Audio"
            >
              <Subtitles size={20} />
            </button>

            {/* Fullscreen Button */}
            <button
              onClick={toggleFullscreen}
              style={{ color: '#c4b5fd', display: 'flex', alignItems: 'center' }}
              title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            >
              {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}
