import React, { useState, useEffect } from 'react';
import '../styles/Auth.css';

// 1. MOCK DATA (Pekeng datos para sa mga campus events)
const initialEvents = [
  { id: 1, title: 'React Workshop', type: 'Workshop', date: 'Aug 25, 2026', status: 'Upcoming', description: 'Hands-on session on React hooks and UI components.' },
  { id: 2, title: 'Annual Hackathon', type: 'Competition', date: 'Sept 10, 2026', status: 'Upcoming', description: '24-hour coding challenge for aspiring developers.' },
  { id: 3, title: 'Career Seminar', type: 'Seminar', date: 'Aug 28, 2026', status: 'Upcoming', description: 'Talk with industry experts about tech careers.' },
  { id: 4, title: 'Alumni Meeting', type: 'Meeting', date: 'Sept 05, 2026', status: 'Archived', description: 'Quarterly networking meeting for alumni.' },
  { id: 5, title: 'Graphic Design Workshop', type: 'Workshop', date: 'Oct 01, 2026', status: 'Upcoming', description: 'Learn advanced layout and UI/UX design techniques.' },
];

const eventTypes = ['All', 'Seminar', 'Competition', 'Workshop', 'Meeting'];

export default function Eventpage({ onNavigateHome, onNavigateLogin, onNavigateSignup, onNavigateAbout }) {
  const [events, setEvents] = useState(initialEvents);
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isPageLoading, setIsPageLoading] = useState(true);

  // Page loading simulation para sa buong page skeleton entrance
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 450);
    return () => clearTimeout(timer);
  }, []);

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

  const filteredEvents = events.filter(event => {
    const matchesType = activeFilter === 'All' || event.type === activeFilter;
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="auth-page-wrapper">
      {/* Eksaktong Navbar galing sa Home.jsx structure at CSS */}
      <nav className="auth-navbar-centered">
        <div className="nav-pill-container" style={{ gap: '16px' }}>
          <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }} onClick={onNavigateHome}>
            <span style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--auth-text-main, #ffffff)' }}>
              Syntax <span style={{ color: '#38bdf8' }}>4</span>
            </span>
          </div>

          <div style={{ width: '1px', height: '16px', background: 'rgba(255, 255, 255, 0.12)' }}></div>

          <span onClick={onNavigateHome} className="nav-item">Home</span>
          <span className="nav-item" style={{ color: '#38bdf8' }}>Events</span>
          <span onClick={onNavigateAbout} className="nav-item">About</span>

          <button 
            className="nav-pill-btn" 
            onClick={toggleTheme}
            style={{ border: '1px solid rgba(56, 189, 248, 0.3)', cursor: 'pointer', transition: 'all 0.3s ease' }}
          >
            {isDarkMode ? '🌙 Dark' : '☀️ Light'}
          </button>

          <button className="nav-pill-btn active" onClick={onNavigateLogin}>Login</button>
          <button className="nav-pill-btn register" onClick={onNavigateSignup}>Register</button>
        </div>
      </nav>

      {/* Main Content Container */}
      <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '80px auto 0 auto' }}>
        
        {/* Kung naglo-load pa, buong skeleton loader ang ipapakita para sabay-sabay silang lilitaw */}
        {isPageLoading ? (
          <div style={{ width: '100%', padding: '10px 0' }}>
            <div className="skeleton-loader" style={{ height: '45px', width: '320px', marginBottom: '15px' }}></div>
            <div className="skeleton-loader" style={{ height: '22px', width: '480px', marginBottom: '35px' }}></div>
            
            <div style={{ display: 'flex', gap: '12px', marginBottom: '35px' }}>
              <div className="skeleton-loader" style={{ height: '38px', width: '80px', borderRadius: '20px' }}></div>
              <div className="skeleton-loader" style={{ height: '38px', width: '90px', borderRadius: '20px' }}></div>
              <div className="skeleton-loader" style={{ height: '38px', width: '100px', borderRadius: '20px' }}></div>
              <div className="skeleton-loader" style={{ height: '38px', width: '250px', borderRadius: '20px', marginLeft: 'auto' }}></div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
              <div className="skeleton-loader" style={{ height: '200px', borderRadius: '14px' }}></div>
              <div className="skeleton-loader" style={{ height: '200px', borderRadius: '14px' }}></div>
              <div className="skeleton-loader" style={{ height: '200px', borderRadius: '14px' }}></div>
            </div>
          </div>
        ) : (
          <div style={{ animation: 'fadeInUp 0.6s ease' }}>
            {/* Header Section */}
            <div style={{ marginBottom: '25px' }}>
              <h1 style={{ fontSize: '2.5rem', marginBottom: '10px', color: 'var(--auth-text-main, #ffffff)' }}>Campus Events</h1>
              <p style={{ fontSize: '1.05rem', color: 'var(--auth-text-sub, #80aad3)', margin: 0 }}>
                Explore upcoming university activities, workshops, and seminars with live updates.
              </p>
            </div>

            {/* Controls Section (Filter & Search) */}
            <div style={{ display: 'flex', gap: '15px', marginBottom: '30px', flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {eventTypes.map(type => (
                  <button 
                    key={type} 
                    onClick={() => setActiveFilter(type)}
                    style={{
                      backgroundColor: activeFilter === type ? (isDarkMode ? '#1e293b' : '#cbd5e1') : 'transparent',
                      color: activeFilter === type ? (isDarkMode ? '#ffffff' : '#0f172a') : (isDarkMode ? '#94a3b8' : '#64748b'),
                      border: `1px solid ${isDarkMode ? '#334155' : '#cbd5e1'}`,
                      padding: '7px 16px',
                      borderRadius: '20px',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      fontWeight: activeFilter === type ? '600' : '400',
                      transition: 'all 0.2s ease',
                      transform: activeFilter === type ? 'scale(1.05)' : 'scale(1)',
                    }}
                  >
                    {type}
                  </button>
                ))}
              </div>
              
              <input 
                type="text" 
                placeholder="Search events..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  flex: '1',
                  minWidth: '220px',
                  padding: '10px 16px',
                  borderRadius: '20px',
                  border: `1px solid ${isDarkMode ? '#334155' : '#cbd5e1'}`,
                  backgroundColor: isDarkMode ? '#0f172a' : '#ffffff',
                  color: isDarkMode ? '#ffffff' : '#0f172a',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                }}
              />
            </div>

            {/* Events Grid Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
              {filteredEvents.length > 0 ? (
                filteredEvents.map((event, index) => (
                  <div 
                    key={event.id} 
                    style={{
                      backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
                      padding: '22px',
                      borderRadius: '14px',
                      border: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                      animation: `fadeInUp ${0.4 + index * 0.1}s ease`,
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-6px)';
                      e.currentTarget.style.boxShadow = '0 10px 25px rgba(56, 189, 248, 0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{
                          backgroundColor: 'rgba(56, 189, 248, 0.15)',
                          color: '#38bdf8',
                          padding: '4px 10px',
                          borderRadius: '10px',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                        }}>
                          {event.type}
                        </span>
                        <span style={{ color: isDarkMode ? '#94a3b8' : '#64748b', fontSize: '0.85rem' }}>{event.date}</span>
                      </div>
                      <h3 style={{ margin: '12px 0 8px 0', color: isDarkMode ? '#ffffff' : '#0f172a' }}>{event.title}</h3>
                      <p style={{ color: isDarkMode ? '#94a3b8' : '#64748b', fontSize: '0.92rem', lineHeight: '1.4' }}>{event.description}</p>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', borderTop: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`, paddingTop: '15px' }}>
                      <span style={{ color: event.status === 'Upcoming' ? '#34d399' : '#94a3b8', fontSize: '0.9rem', fontWeight: '500' }}>
                        {event.status}
                      </span>
                      <button 
                        style={{
                          backgroundColor: '#38bdf8',
                          color: '#0f172a',
                          border: 'none',
                          padding: '7px 16px',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontWeight: '600',
                          fontSize: '0.9rem',
                          transition: 'transform 0.2s ease, background-color 0.2s ease',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ textAlign: 'center', color: '#94a3b8', gridColumn: '1 / -1', padding: '40px 0' }}>
                  No events match your filters.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}