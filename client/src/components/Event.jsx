import React, { useState, useEffect } from 'react';
import '../styles/Auth.css';

export default function Event({ onNavigateHome, onNavigateAbout, onNavigateLogin, onNavigateSignup }) {
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const eventsList = [
    { id: 1, title: 'Tech Summit 2026', date: 'Oct 12, 2026', venue: 'NU MOA Main Auditorium', category: 'Seminar', slots: '120/150', status: 'Upcoming' },
    { id: 2, title: 'Syntax 4 Hackathon', date: 'Oct 25, 2026', venue: 'Computer Lab 402', category: 'Competition', slots: '45/50', status: 'Upcoming' },
    { id: 3, title: 'IT Student Assembly', date: 'Nov 05, 2026', venue: 'Gymnasium', category: 'Meeting', slots: '300/300', status: 'Full' },
    { id: 4, title: 'Web Development Workshop', date: 'Nov 18, 2026', venue: 'Online / Zoom', category: 'Workshop', slots: '85/100', status: 'Upcoming' },
  ];

  const filteredEvents = eventsList.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          event.venue.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="auth-page-wrapper">
      {/* Navbar */}
      <nav className="auth-navbar-centered">
        <div className="nav-pill-container" style={{ gap: '16px' }}>
          <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }} onClick={onNavigateHome}>
            <span style={{ fontSize: '1rem', fontWeight: '800', color: '#ffffff' }}>
              Syntax <span style={{ color: '#38bdf8' }}>4</span>
            </span>
          </div>

          <div style={{ width: '1px', height: '16px', background: 'rgba(255, 255, 255, 0.12)' }}></div>

          <span onClick={onNavigateHome} className="nav-item">Home</span>
          <span className="nav-item" style={{ color: '#38bdf8' }}>Events</span>
          <span onClick={onNavigateAbout} className="nav-item">About</span>
          <button className="nav-pill-btn" onClick={onNavigateLogin}>Login</button>
          <button className="nav-pill-btn register" onClick={onNavigateSignup}>Register</button>
        </div>
      </nav>

      {/* Main Events Container */}
      <div style={{ maxWidth: '1000px', width: '90%', margin: '40px auto', flex: 1 }}>
        <div style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#ffffff', marginBottom: '8px' }}>Campus Events</h1>
            <p style={{ fontSize: '0.95rem', color: '#94a3b8' }}>Explore upcoming university activities, workshops, and seminars.</p>
          </div>

          <div style={{ minWidth: '260px' }}>
            <input 
              type="text" 
              placeholder="Search events or venue..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                background: 'rgba(15, 23, 42, 0.65)',
                border: '1px solid rgba(56, 189, 248, 0.2)',
                borderRadius: '8px',
                color: '#ffffff',
                fontSize: '0.9rem',
                outline: 'none',
              }}
            />
          </div>
        </div>

        {/* Category Filters */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', flexWrap: 'wrap' }}>
          {['All', 'Seminar', 'Competition', 'Workshop', 'Meeting'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '6px 16px',
                borderRadius: '9999px',
                fontSize: '0.85rem',
                fontWeight: '500',
                cursor: 'pointer',
                background: selectedCategory === cat ? 'rgba(56, 189, 248, 0.2)' : 'rgba(15, 23, 42, 0.5)',
                border: selectedCategory === cat ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.08)',
                color: selectedCategory === cat ? '#38bdf8' : '#94a3b8',
                transition: 'all 0.2s ease',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Events Grid */}
        {isPageLoading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="auth-card-pro" style={{ padding: '25px' }}>
                <div className="skeleton-loader" style={{ height: '22px', width: '70%', marginBottom: '12px' }}></div>
                <div className="skeleton-loader" style={{ height: '14px', width: '50%', marginBottom: '8px' }}></div>
                <div className="skeleton-loader" style={{ height: '14px', width: '80%', marginBottom: '25px' }}></div>
                <div className="skeleton-loader" style={{ height: '36px', width: '100%', borderRadius: '8px' }}></div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
                <div key={event.id} className="auth-card-pro" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: '600', padding: '4px 10px', borderRadius: '4px', background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8' }}>
                        {event.category}
                      </span>
                      <span style={{ fontSize: '0.78rem', color: event.status === 'Full' ? '#f43f5e' : '#10b981', fontWeight: '500' }}>
                        {event.status}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.2rem', fontWeight: '600', color: '#ffffff', marginBottom: '8px' }}>{event.title}</h3>
                    <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '4px' }}>📅 {event.date}</p>
                    <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '20px' }}>📍 {event.venue}</p>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '10px' }}>
                      <span>Slots Filled:</span>
                      <span style={{ fontWeight: '600', color: '#38bdf8' }}>{event.slots}</span>
                    </div>
                    <button 
                      onClick={() => alert(`Viewing details for: ${event.title}`)}
                      className="submit-btn" 
                      style={{ padding: '9px', fontSize: '0.88rem' }}
                    >
                      View Details & Register
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px', color: '#94a3b8' }}>
                <p style={{ fontSize: '1.1rem' }}>No events found matching your search or filter.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}