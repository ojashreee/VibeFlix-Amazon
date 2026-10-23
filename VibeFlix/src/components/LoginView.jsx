import React, { useState } from 'react';
import { Play, Lock, Mail, Eye, EyeOff, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';
import { PROFILES } from '../data/mockData';

export function LoginView({ onLoginSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('alex.vip@vibeflix.com');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const found = PROFILES.find(p => email.toLowerCase().includes(p.name.toLowerCase())) || PROFILES[0];
      onLoginSuccess(found);
    }, 600);
  };

  const handleQuickDemo = (profile) => {
    setEmail(`${profile.name.toLowerCase()}@vibeflix.com`);
    setPassword('demopass123');
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess(profile);
    }, 400);
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      backgroundColor: '#070312',
      overflow: 'hidden',
    }}>
      {/* Background Cinematic Collage & Purple Vignette Scrim */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `url('https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1920&q=80')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'brightness(0.35) saturate(1.4)',
        zIndex: 0,
      }} />

      {/* Atmospheric Purple Radial Gradients */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          radial-gradient(circle at 50% 20%, rgba(147, 51, 234, 0.4) 0%, transparent 60%),
          radial-gradient(circle at 80% 80%, rgba(232, 121, 249, 0.25) 0%, transparent 50%),
          linear-gradient(to bottom, rgba(7, 3, 18, 0.8) 0%, rgba(7, 3, 18, 0.95) 100%)
        `,
        zIndex: 1,
      }} />

      {/* Top Header */}
      <header style={{
        position: 'relative',
        zIndex: 10,
        padding: '1.75rem max(2rem, 5vw)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #9333ea 0%, #c084fc 50%, #f43f5e 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 25px rgba(168, 85, 247, 0.8)',
            transform: 'rotate(-6deg)',
          }}>
            <Play size={22} fill="#ffffff" color="#ffffff" style={{ marginLeft: '2px', transform: 'rotate(6deg)' }} />
          </div>
          <div>
            <span style={{ 
              fontFamily: 'var(--font-display)', 
              fontSize: '1.75rem', 
              fontWeight: 900, 
              letterSpacing: '0.03em',
              background: 'linear-gradient(to right, #ffffff 40%, #e9d5ff 70%, #c084fc 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              VIBE<span style={{ color: '#f43f5e', WebkitTextFillColor: '#f43f5e' }}>FLIX</span>
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '0.85rem', color: '#c4b5fd' }}>
            {isSignUp ? 'Already a member?' : 'New to VibeFlix?'}
          </span>
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            style={{
              padding: '0.45rem 1.1rem',
              borderRadius: '999px',
              border: '1px solid rgba(192, 132, 252, 0.5)',
              backgroundColor: 'rgba(168, 85, 247, 0.15)',
              color: '#ffffff',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(168, 85, 247, 0.3)';
              e.currentTarget.style.boxShadow = '0 0 15px rgba(168, 85, 247, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(168, 85, 247, 0.15)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {isSignUp ? 'Sign In' : 'Sign Up Free'}
          </button>
        </div>
      </header>

      {/* Main Login Card */}
      <main style={{
        position: 'relative',
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
      }}>
        <div 
          className="glass-panel-glow animate-fadeIn"
          style={{
            width: '100%',
            maxWidth: '460px',
            borderRadius: '24px',
            padding: '2.5rem 2.25rem',
            backgroundColor: 'rgba(15, 8, 32, 0.88)',
            border: '1px solid rgba(168, 85, 247, 0.35)',
            boxShadow: '0 20px 60px rgba(7, 3, 18, 0.9), 0 0 35px rgba(147, 51, 234, 0.35)',
          }}
        >
          {/* Card Title */}
          <div style={{ marginBottom: '1.75rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.2rem 0.6rem', borderRadius: '999px', backgroundColor: 'rgba(168, 85, 247, 0.15)', border: '1px solid rgba(192, 132, 252, 0.3)', marginBottom: '0.75rem' }}>
              <Sparkles size={13} color="#c084fc" />
              <span style={{ fontSize: '0.72rem', color: '#e9d5ff', fontWeight: 600, letterSpacing: '0.04em' }}>
                4K STREAMING & SOCIAL LOUNGE
              </span>
            </div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
              {isSignUp ? 'Start Your Free Trial' : 'Sign In to VibeFlix'}
            </h1>
            <p style={{ fontSize: '0.86rem', color: '#c4b5fd', marginTop: '0.4rem' }}>
              Unlimited 4K movies, TV series, live channels, and community chat.
            </p>
          </div>

          {error && (
            <div style={{
              padding: '0.75rem 1rem',
              borderRadius: '10px',
              backgroundColor: 'rgba(239, 68, 68, 0.2)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              color: '#fca5a5',
              fontSize: '0.84rem',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}>
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            
            {/* Email Field */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#d8b4fe', marginBottom: '0.4rem' }}>
                Email or Mobile Number
              </label>
              <div style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'rgba(26, 12, 54, 0.75)',
                border: '1px solid rgba(168, 85, 247, 0.3)',
                borderRadius: '12px',
                padding: '0 0.9rem',
                transition: 'all 0.2s',
              }}>
                <Mail size={17} color="#a78bfa" />
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  style={{
                    width: '100%',
                    padding: '0.85rem 0.65rem',
                    background: 'transparent',
                    color: '#ffffff',
                    fontSize: '0.9rem',
                  }}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#d8b4fe' }}>
                  Password
                </label>
                {!isSignUp && (
                  <a href="#forgot" onClick={(e) => e.preventDefault()} style={{ fontSize: '0.78rem', color: '#c084fc', textDecoration: 'none' }}>
                    Forgot password?
                  </a>
                )}
              </div>
              <div style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'rgba(26, 12, 54, 0.75)',
                border: '1px solid rgba(168, 85, 247, 0.3)',
                borderRadius: '12px',
                padding: '0 0.9rem',
                transition: 'all 0.2s',
              }}>
                <Lock size={17} color="#a78bfa" />
                <input 
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  style={{
                    width: '100%',
                    padding: '0.85rem 0.65rem',
                    background: 'transparent',
                    color: '#ffffff',
                    fontSize: '0.9rem',
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ color: '#a78bfa', display: 'flex', alignItems: 'center' }}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', cursor: 'pointer', fontSize: '0.84rem', color: '#c4b5fd' }}>
                <input 
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ accentColor: '#a855f7', width: '16px', height: '16px', borderRadius: '4px' }}
                />
                <span>Remember this device</span>
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#34d399', fontSize: '0.76rem', fontWeight: 600 }}>
                <ShieldCheck size={14} />
                <span>256-bit Encrypted</span>
              </div>
            </div>

            {/* Primary Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                marginTop: '0.5rem',
                padding: '0.95rem 1.5rem',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #d946ef 100%)',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.95rem',
                letterSpacing: '0.02em',
                boxShadow: '0 0 25px rgba(168, 85, 247, 0.6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.6rem',
                cursor: isLoading ? 'wait' : 'pointer',
                opacity: isLoading ? 0.75 : 1,
                transition: 'all 0.25s',
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 0 35px rgba(192, 132, 252, 0.8)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = '0 0 25px rgba(168, 85, 247, 0.6)';
                }
              }}
            >
              {isLoading ? (
                <span>Connecting to VibeFlix...</span>
              ) : (
                <>
                  <span>{isSignUp ? 'Create VibeFlix Account' : 'Sign In Now'}</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* 1-Click Quick Demo Sign-ins */}
          <div style={{ marginTop: '1.75rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(168, 85, 247, 0.2)' }}>
            <span style={{ 
              display: 'block', 
              fontSize: '0.74rem', 
              color: '#a78bfa', 
              textTransform: 'uppercase', 
              letterSpacing: '0.08em', 
              fontWeight: 700,
              marginBottom: '0.75rem',
              textAlign: 'center' 
            }}>
              ⚡ Quick 1-Click Demo Profiles
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.6rem' }}>
              {PROFILES.slice(0, 3).map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleQuickDemo(p)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.6rem 0.4rem',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(26, 12, 54, 0.7)',
                    border: `1px solid ${p.color}40`,
                    transition: 'all 0.2s',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = `${p.color}25`;
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.borderColor = p.color;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(26, 12, 54, 0.7)';
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.borderColor = `${p.color}40`;
                  }}
                >
                  <img 
                    src={p.avatar} 
                    alt={p.name} 
                    style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', border: `2px solid ${p.color}` }}
                  />
                  <span style={{ fontSize: '0.74rem', color: '#ffffff', fontWeight: 600 }}>{p.name}</span>
                </button>
              ))}
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer style={{
        position: 'relative',
        zIndex: 10,
        padding: '1.5rem max(2rem, 5vw)',
        borderTop: '1px solid rgba(168, 85, 247, 0.15)',
        backgroundColor: 'rgba(7, 3, 18, 0.7)',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        fontSize: '0.78rem',
        color: '#8b7ca6',
      }}>
        <div>
          <span>© 2026 VibeFlix Networks Inc. Netflix & Fire TV Ultra Experience.</span>
        </div>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <a href="#terms" onClick={(e) => e.preventDefault()} style={{ color: '#a78bfa', textDecoration: 'none' }}>Terms of Use</a>
          <a href="#privacy" onClick={(e) => e.preventDefault()} style={{ color: '#a78bfa', textDecoration: 'none' }}>Privacy Policy</a>
          <a href="#support" onClick={(e) => e.preventDefault()} style={{ color: '#a78bfa', textDecoration: 'none' }}>Fire TV Help Center</a>
        </div>
      </footer>
    </div>
  );
}
