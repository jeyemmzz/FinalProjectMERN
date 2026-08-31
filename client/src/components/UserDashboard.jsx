import React, { useState, useEffect } from 'react';

export default function UserDashboard({ onLogout, onNavigateHome, onNavigateEvents }) {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [user, setUser] = useState(null);
  const [animateIn, setAnimateIn] = useState(false);

  // Dynamic Events State galing sa Server
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 1. Initial animation trigger
    const timer = setTimeout(() => setAnimateIn(true), 10);

    // 2. Load and apply saved theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setIsDarkMode(savedTheme === 'dark');
    document.body.setAttribute('data-theme', savedTheme);

    // 3. Fetch Events mula sa Backend Server
    fetch('http://localhost:5000/api/events')
      .then(res => res.json())
      .then(data => {
        setEvents(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch events:', err);
        setIsLoading(false);
      });

    // 4. Get current user from localStorage
    const storedUserData = localStorage.getItem('currentUser');
    let currentUser = storedUserData ? JSON.parse(storedUserData) : null;

    if (currentUser) {
      if (!currentUser.studentId || currentUser.studentId === 'N/A') {
        const generatedId = '2026-' + Math.floor(100000 + Math.random() * 900000);
        currentUser = { ...currentUser, studentId: generatedId };

        localStorage.setItem('currentUser', JSON.stringify(currentUser));

        const existingUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
        const updatedUsers = existingUsers.map(u => 
          (u.email && currentUser.email && u.email.toLowerCase() === currentUser.email.toLowerCase()) 
            ? currentUser 
            : u
        );
        localStorage.setItem('allUsers', JSON.stringify(updatedUsers));
      }

      setUser(currentUser);
    } else {
      setUser({
        name: 'User Account',
        email: 'user@example.com',
        studentId: '2026-102948',
      });
    }

    return () => clearTimeout(timer);
  }, []);

  const toggleTheme = () => {
    const nextMode = !isDarkMode;
    setIsDarkMode(nextMode);
    const themeName = nextMode ? 'dark' : 'light';
    document.body.setAttribute('data-theme', themeName);
    localStorage.setItem('theme', themeName);
  };

  // Navigates to event while preserving logged-in user state
  const handleEventClick = (eventData = null) => {
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    }
    
    if (onNavigateEvents) {
      onNavigateEvents(eventData);
    }
  };

  const handleLogoutClick = () => {
    localStorage.removeItem('currentUser');
    if (onLogout) {
      onLogout();
    } else if (onNavigateHome) {
      onNavigateHome();
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      background: isDarkMode 
        ? 'linear-gradient(135deg, #090d16 0%, #0f172a 50%, #1e1b4b 100%)' 
        : 'linear-gradient(135deg, #f1f5f9 0%, #e0e7ff 50%, #f8fafc 100%)',
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box',
      overflowX: 'hidden',
      transition: 'background 0.5s ease',
      paddingBottom: '60px'
    }}>
      
      <style>{`
        .animated-wrapper {
          opacity: 0;
          transform: translateY(20px) scale(0.98);
          transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .animated-wrapper.active {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
        .nav-link {
          transition: all 0.25s ease;
        }
        .nav-link:hover {
          color: #38bdf8 !important;
          transform: translateY(-2px);
        }
        .interactive-btn {
          transition: all 0.25s ease;
        }
        .interactive-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(56, 189, 248, 0.35);
        }
        .info-card {
          transition: all 0.3s ease;
        }
        .info-card:hover {
          transform: translateY(-4px);
          border-color: rgba(56, 189, 248, 0.4) !important;
        }
        .event-card {
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .event-card:hover {
          transform: translateY(-4px);
          border-color: #38bdf8 !important;
          box-shadow: 0 12px 30px rgba(56, 189, 248, 0.2);
        }
      `}</style>

      {/* Navbar */}
      <nav style={{
        width: '100%',
        padding: '20px 40px',
        display: 'flex',
        justifyContent: 'center',
        boxSizing: 'border-box'
      }}>
        <div className={`animated-wrapper ${animateIn ? 'active' : ''}`} style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          padding: '10px 24px',
          background: isDarkMode ? 'rgba(17, 24, 39, 0.75)' : 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(16px)',
          borderRadius: '9999px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
          border: isDarkMode ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.05)',
          flexWrap: 'nowrap'
        }}>
          {/* Logo / Title */}
          <span 
            onClick={onNavigateHome}
            className="nav-link"
            style={{ fontSize: '1rem', fontWeight: '800', color: isDarkMode ? '#ffffff' : '#0f172a', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', whiteSpace: 'nowrap' }}
          >
            Syntax <span style={{ color: '#38bdf8' }}>4</span>
          </span>

          <span style={{ color: isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)' }}>|</span>

          {/* Nav Link - Events Only */}
          <div style={{ display: 'flex', gap: '18px', alignItems: 'center' }}>
            <span 
              onClick={() => handleEventClick()}
              className="nav-link"
              style={{ 
                color: '#94a3b8', 
                cursor: 'pointer', 
                fontWeight: '600', 
                fontSize: '0.9rem', 
                whiteSpace: 'nowrap' 
              }}
            >
              Events
            </span>
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            className="nav-link"
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              whiteSpace: 'nowrap'
            }}
          >
            {isDarkMode ? '🌙 Dark' : '☀️ Light'}
          </button>

          <button
            type="button"
            onClick={handleLogoutClick}
            className="interactive-btn"
            style={{
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              color: '#ffffff',
              border: 'none',
              padding: '8px 20px',
              borderRadius: '9999px',
              cursor: 'pointer',
              fontWeight: '700',
              fontSize: '0.9rem',
              boxShadow: '0 4px 15px rgba(220, 38, 38, 0.3)',
              whiteSpace: 'nowrap'
            }}
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Dashboard Layout */}
      <div className={`animated-wrapper ${animateIn ? 'active' : ''}`} style={{
        maxWidth: '960px',
        width: '92%',
        margin: '30px auto 50px auto',
        flex: 1,
        boxSizing: 'border-box'
      }}>
        
        {/* Profile Banner */}
        <div style={{
          background: isDarkMode ? 'rgba(17, 24, 39, 0.75)' : 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(24px)',
          padding: '40px 50px',
          borderRadius: '24px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.25)',
          border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.05)',
          marginBottom: '30px',
          display: 'flex',
          alignItems: 'center',
          gap: '30px',
          flexWrap: 'wrap'
        }}>
          {/* Avatar Circle */}
          <div style={{
            width: '90px',
            height: '90px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #38bdf8 0%, #2563eb 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2.5rem',
            fontWeight: '800',
            color: '#ffffff',
            boxShadow: '0 8px 25px rgba(56, 189, 248, 0.4)'
          }}>
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: '2.2rem', fontWeight: '800', color: isDarkMode ? '#ffffff' : '#0f172a', margin: 0 }}>
                {user?.name || user?.fullName || 'User Profile'}
              </h1>
              <span style={{
                background: 'rgba(56, 189, 248, 0.15)',
                color: '#38bdf8',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                padding: '4px 12px',
                borderRadius: '9999px',
                fontSize: '0.8rem',
                fontWeight: '700',
                textTransform: 'uppercase'
              }}>
                {user?.role || 'Member'}
              </span>
            </div>
            <p style={{ fontSize: '1rem', color: '#94a3b8', margin: '6px 0 0 0' }}>
              {user?.email || 'No email provided'}
            </p>
          </div>
        </div>

        {/* Dashboard Details Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '20px',
          marginBottom: '30px'
        }}>
          
          {/* Account ID Card */}
          <div className="info-card" style={{
            background: isDarkMode ? 'rgba(17, 24, 39, 0.6)' : 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(16px)',
            padding: '24px 28px',
            borderRadius: '20px',
            border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.05)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
          }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Account ID
            </span>
            <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#38bdf8', marginTop: '8px' }}>
              {user?.studentId || 'Loading...'}
            </div>
          </div>

          {/* Email Card */}
          <div className="info-card" style={{
            background: isDarkMode ? 'rgba(17, 24, 39, 0.6)' : 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(16px)',
            padding: '24px 28px',
            borderRadius: '20px',
            border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.05)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
          }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Email
            </span>
            <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#38bdf8', marginTop: '8px' }}>
              {user?.email || 'Loading...'}
            </div>
          </div>

        </div>

        {/* Dynamic Events Section */}
        <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: isDarkMode ? '#ffffff' : '#0f172a', marginBottom: '16px' }}>
          Upcoming Events
        </h2>

        {isLoading ? (
          <p style={{ color: '#94a3b8' }}>Loading events...</p>
        ) : events.length === 0 ? (
          <p style={{ color: '#94a3b8' }}>No events available at the moment.</p>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px'
          }}>
            {events.map((evt) => (
              <div
                key={evt.id}
                className="event-card"
                onClick={() => handleEventClick(evt)}
                style={{
                  background: isDarkMode ? 'rgba(17, 24, 39, 0.6)' : 'rgba(255, 255, 255, 0.7)',
                  backdropFilter: 'blur(16px)',
                  padding: '24px 28px',
                  borderRadius: '20px',
                  border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.05)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                }}
              >
                <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: isDarkMode ? '#ffffff' : '#0f172a', margin: '0 0 8px 0' }}>
                  {evt.title}
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#94a3b8', margin: '4px 0' }}>
                  📅 {evt.date}
                </p>
                <p style={{ fontSize: '0.9rem', color: '#94a3b8', margin: '4px 0' }}>
                  📍 {evt.venue || evt.location}
                </p>
                {evt.description && (
                  <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '8px 0 0 0' }}>
                    {evt.description}
                  </p>
                )}
                <span style={{
                  display: 'inline-block',
                  marginTop: '12px',
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  color: '#38bdf8'
                }}>
                  View Event →
                </span>
              </div>
            ))}
          </div>
        )}

      </div>

    </div>
  );
}