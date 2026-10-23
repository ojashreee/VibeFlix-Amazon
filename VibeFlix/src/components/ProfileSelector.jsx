import React, { useState } from 'react';
import { Plus, Edit2, Check, Shield } from 'lucide-react';
import { PROFILES } from '../data/mockData';

export function ProfileSelector({ onSelectProfile }) {
  const [profiles, setProfiles] = useState(PROFILES);
  const [isManaging, setIsManaging] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');

  const handleAddProfile = (e) => {
    e.preventDefault();
    if (!newProfileName.trim()) return;
    const newProfile = {
      id: `p-${Date.now()}`,
      name: newProfileName.trim(),
      tag: 'Custom Member',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
      color: '#c084fc',
      isKids: false,
      favoritesCount: 0,
    };
    setProfiles([...profiles, newProfile]);
    setNewProfileName('');
    setShowAddModal(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      backgroundColor: '#070312',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background glow effects */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '600px',
        height: '600px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(147, 51, 234, 0.25) 0%, transparent 70%)',
        filter: 'blur(50px)',
        zIndex: 0,
      }} />

      <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', maxWidth: '900px', width: '100%' }}>
        
        {/* Title */}
        <h1 style={{
          fontSize: 'clamp(2rem, 5vw, 3.2rem)',
          fontWeight: 800,
          letterSpacing: '-0.02em',
          background: 'linear-gradient(135deg, #ffffff 40%, #c084fc 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '0.5rem',
        }}>
          Who's Watching?
        </h1>
        <p style={{ fontSize: '1rem', color: '#c4b5fd', marginBottom: '3rem' }}>
          Select your Fire TV & VibeFlix profile to personalize recommendations.
        </p>

        {/* Profile Avatars Grid */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 'clamp(1.5rem, 3vw, 2.5rem)',
          marginBottom: '3.5rem',
        }}>
          {profiles.map((profile) => (
            <div
              key={profile.id}
              onClick={() => {
                if (!isManaging) {
                  onSelectProfile(profile);
                }
              }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                position: 'relative',
              }}
              onMouseEnter={(e) => {
                const img = e.currentTarget.querySelector('img');
                if (img) {
                  img.style.transform = 'scale(1.08)';
                  img.style.borderColor = '#c084fc';
                  img.style.boxShadow = `0 0 30px ${profile.color}`;
                }
              }}
              onMouseLeave={(e) => {
                const img = e.currentTarget.querySelector('img');
                if (img) {
                  img.style.transform = 'scale(1)';
                  img.style.borderColor = profile.color;
                  img.style.boxShadow = 'none';
                }
              }}
            >
              <div style={{ position: 'relative', marginBottom: '0.85rem' }}>
                <img 
                  src={profile.avatar} 
                  alt={profile.name}
                  style={{
                    width: 'clamp(110px, 14vw, 150px)',
                    height: 'clamp(110px, 14vw, 150px)',
                    borderRadius: '24px',
                    objectFit: 'cover',
                    border: `3px solid ${profile.color}`,
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    backgroundColor: '#1a0c36',
                  }}
                />

                {isManaging && (
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(10, 4, 22, 0.65)',
                    borderRadius: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(168, 85, 247, 0.8)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <Edit2 size={18} color="#ffffff" />
                    </div>
                  </div>
                )}

                {profile.isKids && (
                  <span style={{
                    position: 'absolute',
                    bottom: '8px',
                    right: '8px',
                    backgroundColor: '#38bdf8',
                    color: '#070312',
                    fontSize: '0.62rem',
                    fontWeight: 800,
                    padding: '0.15rem 0.45rem',
                    borderRadius: '6px',
                    letterSpacing: '0.04em',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                  }}>
                    KIDS
                  </span>
                )}
              </div>

              <span style={{
                fontSize: '1.1rem',
                fontWeight: 700,
                color: '#f8fafc',
                letterSpacing: '-0.01em',
              }}>
                {profile.name}
              </span>

              <span style={{
                fontSize: '0.78rem',
                color: '#c4b5fd',
                fontWeight: 500,
                marginTop: '0.2rem',
              }}>
                {profile.tag}
              </span>
            </div>
          ))}

          {/* Add Profile Tile */}
          <div
            onClick={() => setShowAddModal(true)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            onMouseEnter={(e) => {
              const box = e.currentTarget.querySelector('.add-box');
              if (box) {
                box.style.transform = 'scale(1.08)';
                box.style.borderColor = '#c084fc';
                box.style.backgroundColor = 'rgba(168, 85, 247, 0.25)';
                box.style.boxShadow = '0 0 25px rgba(168, 85, 247, 0.5)';
              }
            }}
            onMouseLeave={(e) => {
              const box = e.currentTarget.querySelector('.add-box');
              if (box) {
                box.style.transform = 'scale(1)';
                box.style.borderColor = 'rgba(168, 85, 247, 0.35)';
                box.style.backgroundColor = 'rgba(26, 12, 54, 0.6)';
                box.style.boxShadow = 'none';
              }
            }}
          >
            <div 
              className="add-box"
              style={{
                width: 'clamp(110px, 14vw, 150px)',
                height: 'clamp(110px, 14vw, 150px)',
                borderRadius: '24px',
                border: '2px dashed rgba(168, 85, 247, 0.35)',
                backgroundColor: 'rgba(26, 12, 54, 0.6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '0.85rem',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              <Plus size={44} color="#c084fc" />
            </div>
            <span style={{ fontSize: '1.1rem', fontWeight: 600, color: '#c4b5fd' }}>
              Add Profile
            </span>
            <span style={{ fontSize: '0.78rem', color: '#8b7ca6', marginTop: '0.2rem' }}>
              New family member
            </span>
          </div>

        </div>

        {/* Manage Profiles Button */}
        <button
          onClick={() => setIsManaging(!isManaging)}
          style={{
            padding: '0.75rem 2rem',
            borderRadius: '12px',
            border: isManaging ? '1.5px solid #c084fc' : '1px solid rgba(168, 85, 247, 0.4)',
            backgroundColor: isManaging ? 'rgba(168, 85, 247, 0.25)' : 'transparent',
            color: isManaging ? '#ffffff' : '#c4b5fd',
            fontSize: '0.92rem',
            fontWeight: 600,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            transition: 'all 0.2s',
            boxShadow: isManaging ? '0 0 20px rgba(168, 85, 247, 0.4)' : 'none',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#c084fc';
            e.currentTarget.style.color = '#ffffff';
          }}
          onMouseLeave={(e) => {
            if (!isManaging) {
              e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.4)';
              e.currentTarget.style.color = '#c4b5fd';
            }
          }}
        >
          {isManaging ? 'Done Managing' : 'Manage Profiles'}
        </button>

      </div>

      {/* Add Profile Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(7, 3, 18, 0.85)',
          backdropFilter: 'blur(16px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '1.5rem',
        }}>
          <div 
            className="glass-panel-glow animate-fadeIn"
            style={{
              width: '100%',
              maxWidth: '420px',
              borderRadius: '20px',
              padding: '2rem',
              backgroundColor: 'rgba(18, 9, 38, 0.95)',
              border: '1px solid rgba(168, 85, 247, 0.4)',
            }}
          >
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.5rem' }}>
              Add a Profile
            </h3>
            <p style={{ fontSize: '0.86rem', color: '#c4b5fd', marginBottom: '1.5rem' }}>
              Add a profile for another person watching on VibeFlix.
            </p>

            <form onSubmit={handleAddProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#d8b4fe', marginBottom: '0.4rem', fontWeight: 600 }}>
                  Profile Name
                </label>
                <input 
                  type="text"
                  placeholder="e.g. Leo, Anime Club, Guest"
                  value={newProfileName}
                  onChange={(e) => setNewProfileName(e.target.value)}
                  autoFocus
                  style={{
                    width: '100%',
                    padding: '0.8rem 1rem',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(26, 12, 54, 0.8)',
                    border: '1px solid rgba(168, 85, 247, 0.4)',
                    color: '#ffffff',
                    fontSize: '0.95rem',
                  }}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{
                    padding: '0.65rem 1.25rem',
                    borderRadius: '10px',
                    color: '#c4b5fd',
                    fontSize: '0.86rem',
                    fontWeight: 600,
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '0.65rem 1.4rem',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
                    color: '#ffffff',
                    fontSize: '0.86rem',
                    fontWeight: 700,
                    boxShadow: '0 0 15px rgba(168, 85, 247, 0.5)',
                  }}
                >
                  Continue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
