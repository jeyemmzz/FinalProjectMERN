import React, { useState, useEffect } from 'react';
import '../styles/Auth.css';

export default function EventPage({ 
  onNavigateHome, 
  onNavigateLogin, 
  onNavigateSignup, 
  onNavigateAbout 
}) {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Theme initialization and persistence
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setIsDarkMode(savedTheme === 'dark');
    document.body.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const nextMode = !isDarkMode;
    setIsDarkMode(nextMode);
    const themeName = nextMode ? 'dark' : 'light';
    document.body.setAttribute('data-theme', themeName);
    localStorage.setItem('theme', themeName);
  };

  const eventsList = [
    {
      id: 1,
      title: 'Tech Summit 2026',
      category: 'Seminar',
      status: 'Upcoming',
      date: 'Oct 12, 2026',
      venue: 'NU MOA Main Auditorium',
      slotsFilled: '120/150'
    },
    {
      id: 2,
      title: 'Syntax 4 Hackathon',
      category: 'Competition',
      status: 'Upcoming',
      date: 'Oct 25, 2026',
      venue: 'Computer Lab 402',
      slotsFilled: '45/50'
    },
    {
      id: 3,
      title: 'IT Student Assembly',
      category: 'Meeting',
      status: 'Full',
      date: 'Nov 05, 2026',
      venue: 'Gymnasium',
      slotsFilled: '300/300'
    }
  ];

  const filteredEvents = eventsList.filter(ev => {
    const matchesCategory = selectedCategory === 'All' || ev.category === selectedCategory;
    const matchesSearch = ev.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          ev.venue.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="auth-page-wrapper">
      <nav className="auth-navbar-centered">
        <div className="nav-pill-container" style={{ gap: '16px', padding: '10px 24px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={onNavigateHome}>
            <span style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--auth-text-main, #ffffff)' }}>
              Syntax <span style={{ color: '#38bdf8' }}>4</span>
            </span>
          </div>

          <div style={{ width: '1px', height: '16px', background: 'rgba(255, 255, 255, 0.12)' }}></div>

          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <span onClick={onNavigateHome} className="nav-item" style={{ cursor: 'pointer' }}>Home</span>
            <span className="nav-item" style={{ color: '#38bdf8', cursor: 'pointer', fontWeight: '600' }}>Events</span>
            <span onClick={onNavigateAbout} className="nav-item" style={{ cursor: 'pointer' }}>About</span>
          </div>

          <div style={{ width: '1px', height: '18px', background: 'var(--auth-border-color)' }}></div>

          {/* Light/Dark Toggle Button */}
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
          {filteredEvents.length > 0 ? (
            filteredEvents.map(ev => (
              <div key={ev.id} className="auth-card-pro" style={{ padding: '25px', margin: 0, display: 'flex', flexDirection: 'column', gap: '14px', boxSizing: 'border-box' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', padding: '3px 10px', borderRadius: '6px', background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', fontWeight: '600' }}>{ev.category}</span>
                  <span style={{ fontSize: '0.75rem', color: ev.status === 'Full' ? '#f43f5e' : '#10b981', fontWeight: '600' }}>{ev.status}</span>
                </div>

                <div>
                  <h3 style={{ fontSize: '1.2rem', color: 'var(--auth-text-main)', fontWeight: '700', marginBottom: '6px' }}>{ev.title}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--auth-text-muted)', margin: '4px 0' }}>📅 {ev.date}</p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--auth-text-muted)', margin: '4px 0' }}>📍 {ev.venue}</p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', color: 'var(--auth-text-muted)', borderTop: '1px solid var(--auth-border-color)', paddingTop: '12px' }}>
                  <span>Slots Filled:</span>
                  <span style={{ fontWeight: '600', color: 'var(--auth-text-main)' }}>{ev.slotsFilled}</span>
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