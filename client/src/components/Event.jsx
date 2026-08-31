import React, { useState, useEffect } from 'react';
import '../styles/Auth.css';

export default function Event({ 
  onNavigateHome, 
  onNavigateLogin, 
  onNavigateSignup, 
  onNavigateAbout,
  onNavigateDashboard,
  onLogout 
}) {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  // Dynamic Events State galing sa Server
  const [eventsList, setEventsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Theme initialization, session check, at pag-fetch ng events
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setIsDarkMode(savedTheme === 'dark');
    document.body.setAttribute('data-theme', savedTheme);

    // Retrieve active logged-in user from localStorage
    const storedUserData = localStorage.getItem('currentUser');
    if (storedUserData) {
      try {
        setCurrentUser(JSON.parse(storedUserData));
      } catch (e) {
        console.error("Error parsing currentUser from localStorage:", e);
      }
    }

    // Fetch Events mula sa Backend Server
    fetch('http://localhost:5000/api/events')
      .then(res => res.json())
      .then(data => {
        setEventsList(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch events:', err);
        setIsLoading(false);
      });
  }, []);

  const toggleTheme = () => {
    const nextMode = !isDarkMode;
    setIsDarkMode(nextMode);
    const themeName = nextMode ? 'dark' : 'light';
    document.body.setAttribute('data-theme', themeName);
    localStorage.setItem('theme', themeName);
  };

  const handleLogoutClick = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    if (onLogout) {
      onLogout();
    } else if (onNavigateHome) {
      onNavigateHome();
    }
  };

  const handleDashboardOrHome = () => {
    if (currentUser && onNavigateDashboard) {
      onNavigateDashboard();
    } else if (onNavigateHome) {
      onNavigateHome();
    }
  };

  const filteredEvents = eventsList.filter(ev => {
    const categoryMatch = ev.category || 'Seminar';
    const matchesCategory = selectedCategory === 'All' || categoryMatch === selectedCategory;
    
    const titleMatch = ev.title || '';
    const venueMatch = ev.venue || ev.location || '';
    const matchesSearch = titleMatch.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          venueMatch.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="auth-page-wrapper">
      <nav className="auth-navbar-centered">
        <div className="nav-pill-container" style={{ gap: '16px', padding: '10px 24px', flexWrap: 'wrap' }}>
          
          {/* Logo / Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={handleDashboardOrHome}>
            <span style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--auth-text-main, #ffffff)' }}>
              Syntax <span style={{ color: '#38bdf8' }}>4</span>
            </span>
          </div>

          <div style={{ width: '1px', height: '16px', background: 'rgba(255, 255, 255, 0.12)' }}></div>

          {/* Dynamic Nav Links */}
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            {currentUser ? (
              <span onClick={onNavigateDashboard} className="nav-item" style={{ cursor: 'pointer' }}>
                Dashboard
              </span>
            ) : (
              <span onClick={onNavigateHome} className="nav-item" style={{ cursor: 'pointer' }}>
                Home
              </span>
            )}

            <span className="nav-item" style={{ color: '#38bdf8', cursor: 'pointer', fontWeight: '600' }}>
              Events
            </span>
            
            <span onClick={onNavigateAbout} className="nav-item" style={{ cursor: 'pointer' }}>
              About
            </span>
          </div>

          <div style={{ width: '1px', height: '18px', background: 'var(--auth-border-color)' }}></div>

          {/* Theme Toggle Button */}
          <button
            className="nav-pill-btn"
            onClick={toggleTheme}
            style={{ 
              border: '1px solid rgba(56, 189, 248, 0.3)', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.85rem'
            }}
          >
            {isDarkMode ? '🌙 Dark' : '☀️ Light'}
          </button>

          {/* Conditional Actions */}
          {currentUser ? (
            <button 
              className="interactive-btn"
              onClick={handleLogoutClick}
              style={{ 
                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', 
                color: '#ffffff', 
                border: 'none', 
                padding: '6px 18px', 
                borderRadius: '9999px',
                cursor: 'pointer', 
                fontSize: '0.85rem', 
                fontWeight: '700',
                boxShadow: '0 4px 15px rgba(220, 38, 38, 0.3)'
              }}
            >
              Logout
            </button>
          ) : (
            <>
              <button 
                onClick={onNavigateLogin}
                style={{ background: 'none', border: 'none', color: 'var(--auth-text-main)', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '600' }}
              >
                Login
              </button>

              <button 
                className="nav-pill-btn register" 
                onClick={onNavigateSignup}
                style={{ padding: '6px 16px', fontSize: '0.85rem', cursor: 'pointer' }}
              >
                Register
              </button>
            </>
          )}

        </div>
      </nav>

      {/* Main Content */}
      <div style={{ maxWidth: '1100px', width: '92%', margin: '40px auto', display: 'flex', flexDirection: 'column', gap: '25px' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '800', color: 'var(--auth-text-main, #ffffff)', marginBottom: '8px' }}>Campus Events</h1>
          <p style={{ fontSize: '0.95rem', color: 'var(--auth-text-muted, #80aad3)' }}>Explore upcoming university activities, workshops, and seminars.</p>
        </div>

        {/* Filter categories & Search */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {['All', 'Seminar', 'Competition', 'Workshop', 'Meeting'].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  border: selectedCategory === cat ? '1px solid #38bdf8' : '1px solid var(--auth-border-color)',
                  background: selectedCategory === cat ? 'rgba(56, 189, 248, 0.15)' : 'var(--auth-input-bg)',
                  color: selectedCategory === cat ? '#38bdf8' : 'var(--auth-text-muted)',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          <input 
            type="text" 
            placeholder="Search events or venue..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              padding: '10px 16px',
              borderRadius: '10px',
              border: '1px solid var(--auth-border-color)',
              background: 'var(--auth-input-bg)',
              color: 'var(--auth-text-main)',
              fontSize: '0.85rem',
              outline: 'none',
              width: '260px'
            }}
          />
        </div>

        {/* Events Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '25px' }}>
          {isLoading ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: 'var(--auth-text-muted)' }}>
              Loading events...
            </div>
          ) : filteredEvents.length > 0 ? (
            filteredEvents.map(ev => (
              <div key={ev.id} className="auth-card-pro" style={{ padding: '25px', margin: 0, display: 'flex', flexDirection: 'column', gap: '14px', boxSizing: 'border-box' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', padding: '3px 10px', borderRadius: '6px', background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', fontWeight: '600' }}>
                    {ev.category || 'Seminar'}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: ev.status === 'Full' ? '#f43f5e' : '#10b981', fontWeight: '600' }}>
                    {ev.status || 'Upcoming'}
                  </span>
                </div>

                <div>
                  <h3 style={{ fontSize: '1.2rem', color: 'var(--auth-text-main)', fontWeight: '700', marginBottom: '6px' }}>{ev.title}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--auth-text-muted)', margin: '4px 0' }}>📅 {ev.date}</p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--auth-text-muted)', margin: '4px 0' }}>📍 {ev.venue || ev.location}</p>
                  {ev.description && (
                    <p style={{ fontSize: '0.8rem', color: 'var(--auth-text-muted)', margin: '6px 0 0 0' }}>{ev.description}</p>
                  )}
                </div>

                <button className="submit-btn" style={{ padding: '10px', width: '100%', fontSize: '0.85rem', marginTop: '4px', cursor: 'pointer' }}>
                  View Details & Register
                </button>
              </div>
            ))
          ) : (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: 'var(--auth-text-muted)' }}>
              No matching events found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}