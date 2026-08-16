import React, { useState, useEffect } from 'react';
import '../styles/Auth.css';

export default function UserDashboard({ onLogout, onNavigateHome }) {
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Theme initialization and persistence (Katulad sa Home.jsx at iba pang pages)
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setIsDarkMode(savedTheme === 'dark');
    document.body.setAttribute('data-theme', savedTheme);

    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const toggleTheme = () => {
    const nextMode = !isDarkMode;
    setIsDarkMode(nextMode);
    const themeName = nextMode ? 'dark' : 'light';
    document.body.setAttribute('data-theme', themeName);
    localStorage.setItem('theme', themeName);
  };

  const registeredEvents = [
    { id: 1, title: 'Tech Summit 2026', date: 'Oct 12, 2026', venue: 'NU MOA Main Auditorium', status: 'Confirmed' },
    { id: 2, title: 'Syntax 4 Hackathon', date: 'Oct 25, 2026', venue: 'Computer Lab 402', status: 'Pending Approval' },
    { id: 3, title: 'AI & Robotics Expo', date: 'Nov 05, 2026', venue: 'Multipurpose Hall', status: 'Declined' }
  ];

  const tabs = ['All', 'Confirmed', 'Pending Approval', 'Declined'];

  const filteredEvents = activeTab === 'All'
    ? registeredEvents
    : registeredEvents.filter(event => event.status === activeTab);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Confirmed':
        return { background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)' };
      case 'Pending Approval':
        return { background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.3)' };
      case 'Declined':
        return { background: 'rgba(244, 63, 94, 0.15)', color: '#f43f5e', border: '1px solid rgba(244, 63, 94, 0.3)' };
      default:
        return { background: 'rgba(148, 163, 184, 0.15)', color: 'var(--auth-text-muted)', border: '1px solid var(--auth-border-color)' };
    }
  };

  return (
    <div className="auth-page-wrapper">
      <nav className="auth-navbar-centered">
        <div className="nav-pill-container" style={{ gap: '16px', padding: '10px 24px', flexWrap: 'wrap' }}>
          <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }} onClick={onNavigateHome}>
            <span style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--auth-text-main, #ffffff)' }}>
              Syntax <span style={{ color: '#38bdf8' }}>4</span>
            </span>
          </div>

          <div style={{ width: '1px', height: '16px', background: 'rgba(255, 255, 255, 0.12)' }}></div>

          <span className="nav-item" style={{ color: '#38bdf8', fontWeight: '600' }}>My Dashboard</span>

          <div style={{ width: '1px', height: '18px', background: 'var(--auth-border-color)' }}></div>

          {/* Theme Toggle Button gamit ang shared button style */}
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
            className="nav-pill-btn register" 
            onClick={onLogout} 
            style={{ 
              background: 'rgba(244, 63, 94, 0.15)', 
              color: '#f43f5e', 
              border: '1px solid rgba(244, 63, 94, 0.3)',
              padding: '6px 16px',
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: '1200px', width: '95%', margin: '40px auto', flex: 1, boxSizing: 'border-box' }}>
        {isPageLoading ? (
          <div className="auth-card-pro" style={{ maxWidth: '100%', padding: '40px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '40px' }}>
              <div className="skeleton-loader" style={{ height: '35px', width: '25%', marginBottom: '15px' }}></div>
              <div className="skeleton-loader" style={{ height: '18px', width: '40%' }}></div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
              <div className="skeleton-loader" style={{ height: '160px', borderRadius: '12px' }}></div>
              <div className="skeleton-loader" style={{ height: '160px', borderRadius: '12px' }}></div>
              <div className="skeleton-loader" style={{ height: '160px', borderRadius: '12px' }}></div>
            </div>
          </div>
        ) : (
          <div className="auth-card-pro" style={{ maxWidth: '100%', padding: '40px', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '40px', gap: '16px' }}>
              <div>
                <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--auth-text-main)', marginBottom: '8px' }}>Dashboard</h1>
                <p style={{ fontSize: '1rem', color: 'var(--auth-text-muted)' }}>Welcome back! Track your registered campus activities here.</p>
              </div>
              <div style={{ background: 'rgba(56, 189, 248, 0.1)', padding: '10px 20px', borderRadius: '10px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
                <span style={{ fontSize: '0.9rem', color: '#38bdf8', fontWeight: '600' }}>Role: Student</span>
              </div>
            </div>

            <h3 style={{ fontSize: '1.2rem', color: 'var(--auth-text-main)', marginBottom: '20px', textAlign: 'center', fontWeight: '600' }}>My Registered Events</h3>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '30px', flexWrap: 'wrap' }}>
              {tabs.map((tab) => {
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    style={{
                      padding: '10px 20px',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      border: isActive ? '1px solid #38bdf8' : '1px solid var(--auth-border-color)',
                      background: isActive ? 'rgba(56, 189, 248, 0.15)' : 'var(--auth-input-bg)',
                      color: isActive ? '#38bdf8' : 'var(--auth-text-muted)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', 
              gap: '24px' 
            }}>
              {filteredEvents.length > 0 ? (
                filteredEvents.map((item) => (
                  <div key={item.id} style={{ 
                    background: 'var(--auth-input-bg)', 
                    padding: '24px', 
                    borderRadius: '12px', 
                    border: '1px solid var(--auth-border-color)', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    textAlign: 'center',
                    justifyContent: 'space-between',
                    minHeight: '160px',
                    boxSizing: 'border-box',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                  }}>
                    <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <h4 style={{ fontSize: '1.15rem', color: 'var(--auth-text-main)', marginBottom: '12px', letterSpacing: '-0.01em', fontWeight: '600' }}>{item.title}</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                        <p style={{ fontSize: '0.9rem', color: 'var(--auth-text-muted)' }}>📅 {item.date}</p>
                        <p style={{ fontSize: '0.9rem', color: 'var(--auth-text-muted)' }}>📍 {item.venue}</p>
                      </div>
                    </div>
                    <div>
                      <span style={{ 
                        fontSize: '0.8rem', 
                        padding: '6px 14px', 
                        borderRadius: '6px', 
                        fontWeight: '600',
                        display: 'inline-block',
                        ...getStatusStyle(item.status) 
                      }}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ 
                  gridColumn: '1 / -1', 
                  padding: '50px 30px', 
                  textAlign: 'center', 
                  background: 'var(--auth-input-bg)', 
                  borderRadius: '12px', 
                  border: '1px dashed var(--auth-border-color)' 
                }}>
                  <p style={{ color: 'var(--auth-text-muted)', fontSize: '1rem' }}>No events found under "{activeTab}".</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}