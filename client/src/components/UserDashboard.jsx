import React, { useState, useEffect } from 'react';
import '../styles/Auth.css';

const eventTypes = ['All', 'Seminar', 'Competition', 'Workshop', 'Meeting'];

export default function UserDashboard({ onLogout, onNavigateHome, currentUser }) {
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Confirmed');
  
  // Active navigation view: 'registered', 'browse', o kaya 'profile'
  const [activeNavView, setActiveNavView] = useState('registered'); 
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  // Search and filter states para sa event browsing
  const [eventSearch, setEventSearch] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  
  // Available events na kukunin direkta mula sa database via API
  const [availableEvents, setAvailableEvents] = useState([]);

  const [registeredEvents, setRegisteredEvents] = useState([
    { id: 1, title: 'Tech Summit 2026', date: 'Oct 12, 2026', venue: 'NU MOA Main Auditorium', status: 'Confirmed' },
    { id: 2, title: 'Syntax 4 Hackathon', date: 'Oct 25, 2026', venue: 'Computer Lab 402', status: 'Pending Approval' },
    { id: 3, title: 'AI & Robotics Expo', date: 'Nov 05, 2026', venue: 'Multipurpose Hall', status: 'Declined' }
  ]);

  // Profile data configuration
  const userProfile = {
    name: currentUser?.name || 'Student',
    email: currentUser?.email || 'Student@syntax4.com',
    studentId: currentUser?.studentId || '202610482',
    program: currentUser?.program || 'BS Information Technology',
    institution: currentUser?.institution || 'National University MOA'
  };

  // Theme initialization, persistence, at pag-fetch ng events mula sa database
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setIsDarkMode(savedTheme === 'dark');
    document.body.setAttribute('data-theme', savedTheme);

    // Fetch available events mula sa Database API
    fetchAvailableEvents();
  }, []);

  const fetchAvailableEvents = async () => {
    try {
      setIsPageLoading(true);
      // Palitan ang URL na 'http://localhost:5000/api/events' kung iba ang port o endpoint ng backend ninyo
      const response = await fetch('http://localhost:5000/api/events');
      if (!response.ok) throw new Error('Failed to fetch database events.');
      const data = await response.json();
      setAvailableEvents(data);
    } catch (error) {
      console.error('Error fetching database events:', error);
      // Fallback data sakaling offline ang backend
      setAvailableEvents([
        { id: 101, title: 'React Workshop & UI Design', type: 'Workshop', date: '2026-08-25', venue: 'Lab 301', description: 'Hands-on session connected to database.' }
      ]);
    } finally {
      setIsPageLoading(false);
    }
  };

  const toggleTheme = () => {
    const nextMode = !isDarkMode;
    setIsDarkMode(nextMode);
    const themeName = nextMode ? 'dark' : 'light';
    document.body.setAttribute('data-theme', themeName);
    localStorage.setItem('theme', themeName);
  };

  const tabs = ['All', 'Confirmed', 'Pending Approval', 'Declined'];

  const filteredRegisteredEvents = activeTab === 'All'
    ? registeredEvents
    : registeredEvents.filter(event => event.status === activeTab);

  // Filter logic para sa pag-browse ng bagong database events
  const filteredAvailableEvents = availableEvents.filter(event => {
    const matchesType = selectedType === 'All' || event.type === selectedType;
    const matchesSearch = event.title.toLowerCase().includes(eventSearch.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleJoinEvent = (eventToJoin) => {
    const alreadyExists = registeredEvents.some(e => e.title === eventToJoin.title);
    if (alreadyExists) {
      alert('You are already registered or applied for this event.');
      return;
    }

    const newEntry = {
      id: Date.now(),
      title: eventToJoin.title,
      date: eventToJoin.date,
      venue: eventToJoin.venue,
      status: 'Pending Approval'
    };

    setRegisteredEvents([newEntry, ...registeredEvents]);
    alert('Successfully registered for the event! Status is now Pending Approval.');
  };

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
        <div className="nav-pill-container" style={{ gap: '14px', padding: '10px 24px', flexWrap: 'wrap' }}>
          <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }} onClick={onNavigateHome}>
            <span style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--auth-text-main, #ffffff)' }}>
              Syntax <span style={{ color: '#38bdf8' }}>4</span> 
            </span>
          </div>

          <div style={{ width: '1px', height: '16px', background: 'rgba(255, 255, 255, 0.12)' }}></div>

          <span 
            onClick={() => setActiveNavView('registered')} 
            className="nav-item" 
            style={{ color: activeNavView === 'registered' ? '#38bdf8' : 'var(--auth-text-muted)', fontWeight: activeNavView === 'registered' ? '600' : '400', cursor: 'pointer' }}
          >
            My Registrations
          </span>
          <span 
            onClick={() => setActiveNavView('browse')} 
            className="nav-item" 
            style={{ color: activeNavView === 'browse' ? '#38bdf8' : 'var(--auth-text-muted)', fontWeight: activeNavView === 'browse' ? '600' : '400', cursor: 'pointer' }}
          >
            Events
          </span>
          <span 
            onClick={() => setActiveNavView('profile')} 
            className="nav-item" 
            style={{ color: activeNavView === 'profile' ? '#38bdf8' : 'var(--auth-text-muted)', fontWeight: activeNavView === 'profile' ? '600' : '400', cursor: 'pointer' }}
          >
            Profile
          </span>

          <div style={{ width: '1px', height: '18px', background: 'var(--auth-border-color)' }}></div>

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
            
            {/* VIEW 1: MY REGISTERED EVENTS */}
            {activeNavView === 'registered' && (
              <div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '30px', gap: '12px' }}>
                  <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--auth-text-main)', margin: 0 }}>My Registered Events</h1>
                  <p style={{ fontSize: '0.95rem', color: 'var(--auth-text-muted)', margin: 0 }}>Track the approval status of your campus event applications.</p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '30px', flexWrap: 'wrap' }}>
                  {tabs.map((tab) => {
                    const isActive = activeTab === tab;
                    return (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{
                          padding: '8px 18px',
                          borderRadius: '8px',
                          fontSize: '0.85rem',
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

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
                  {filteredRegisteredEvents.length > 0 ? (
                    filteredRegisteredEvents.map((item) => (
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
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                            <p style={{ fontSize: '0.9rem', color: 'var(--auth-text-muted)', margin: 0 }}>📅 {item.date}</p>
                            <p style={{ fontSize: '0.9rem', color: 'var(--auth-text-muted)', margin: 0 }}>📍 {item.venue}</p>
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
                      <p style={{ color: 'var(--auth-text-muted)', fontSize: '1rem', margin: 0 }}>No events found under "{activeTab}".</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* VIEW 2: BROWSE & JOIN DATABASE EVENTS */}
            {activeNavView === 'browse' && (
              <div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '30px', gap: '12px' }}>
                  <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--auth-text-main)', margin: 0 }}>Campus Events Directory</h1>
                  <p style={{ fontSize: '0.95rem', color: 'var(--auth-text-muted)', margin: 0 }}>Explore live university activities fetched from the database.</p>
                </div>

                {/* Filters & Search Input */}
                <div style={{ display: 'flex', gap: '12px', marginBottom: '30px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {eventTypes.map((type) => (
                      <button
                        key={type}
                        onClick={() => setSelectedType(type)}
                        style={{
                          padding: '7px 14px',
                          borderRadius: '20px',
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                          fontWeight: selectedType === type ? '600' : '400',
                          border: selectedType === type ? '1px solid #38bdf8' : '1px solid var(--auth-border-color)',
                          background: selectedType === type ? 'rgba(56, 189, 248, 0.15)' : 'var(--auth-input-bg)',
                          color: selectedType === type ? '#38bdf8' : 'var(--auth-text-muted)',
                        }}
                      >
                        {type}
                      </button>
                    ))}
                  </div>

                  <input
                    type="text"
                    placeholder="Search database events..."
                    value={eventSearch}
                    onChange={(e) => setEventSearch(e.target.value)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '20px',
                      border: '1px solid var(--auth-border-color)',
                      background: 'var(--auth-input-bg)',
                      color: 'var(--auth-text-main)',
                      outline: 'none',
                      fontSize: '0.9rem',
                      minWidth: '220px',
                      flex: '1',
                      maxWidth: '300px'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
                  {filteredAvailableEvents.length > 0 ? (
                    filteredAvailableEvents.map((evt) => (
                      <div key={evt.id} style={{ 
                        background: 'var(--auth-input-bg)', 
                        padding: '24px', 
                        borderRadius: '12px', 
                        border: '1px solid var(--auth-border-color)', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        justifyContent: 'space-between',
                        boxSizing: 'border-box',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                      }}>
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                            <span style={{ backgroundColor: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '3px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '600' }}>
                              {evt.type}
                            </span>
                            <span style={{ fontSize: '0.85rem', color: 'var(--auth-text-muted)' }}>{evt.date}</span>
                          </div>
                          <h4 style={{ fontSize: '1.1rem', color: 'var(--auth-text-main)', marginBottom: '8px', fontWeight: '600' }}>{evt.title}</h4>
                          <p style={{ fontSize: '0.85rem', color: 'var(--auth-text-muted)', marginBottom: '6px' }}>📍 {evt.venue}</p>
                          <p style={{ fontSize: '0.9rem', color: 'var(--auth-text-muted)', lineHeight: '1.4', marginBottom: '20px' }}>{evt.description}</p>
                        </div>

                        <div style={{ borderTop: '1px solid var(--auth-border-color)', paddingTop: '15px', display: 'flex', justifyContent: 'flex-end' }}>
                          <button
                            onClick={() => handleJoinEvent(evt)}
                            style={{
                              background: '#38bdf8',
                              color: '#0f172a',
                              border: 'none',
                              padding: '7px 16px',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              fontWeight: '600',
                              fontSize: '0.85rem',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            Join Event
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ 
                      gridColumn: '1 / -1', 
                      padding: '40px', 
                      textAlign: 'center', 
                      background: 'var(--auth-input-bg)', 
                      borderRadius: '12px', 
                      border: '1px dashed var(--auth-border-color)' 
                    }}>
                      <p style={{ color: 'var(--auth-text-muted)', fontSize: '0.95rem', margin: 0 }}>No database events match your search.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* VIEW 3: USER PROFILE */}
            {activeNavView === 'profile' && (
              <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '30px', gap: '12px' }}>
                  <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--auth-text-main)', margin: 0 }}>Student Profile</h1>
                  <p style={{ fontSize: '0.95rem', color: 'var(--auth-text-muted)', margin: 0 }}>View your registered student credentials and account info.</p>
                </div>

                <div style={{ 
                  background: 'var(--auth-input-bg)', 
                  padding: '30px', 
                  borderRadius: '12px', 
                  border: '1px solid var(--auth-border-color)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--auth-border-color)', paddingBottom: '12px' }}>
                    <span style={{ color: 'var(--auth-text-muted)', fontSize: '0.9rem' }}>Full Name</span>
                    <span style={{ color: 'var(--auth-text-main)', fontWeight: '600', fontSize: '0.95rem' }}>{userProfile.name}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--auth-border-color)', paddingBottom: '12px' }}>
                    <span style={{ color: 'var(--auth-text-muted)', fontSize: '0.9rem' }}>Student ID</span>
                    <span style={{ color: 'var(--auth-text-main)', fontWeight: '600', fontSize: '0.95rem' }}>{userProfile.studentId}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--auth-border-color)', paddingBottom: '12px' }}>
                    <span style={{ color: 'var(--auth-text-muted)', fontSize: '0.9rem' }}>Email Address</span>
                    <span style={{ color: 'var(--auth-text-main)', fontWeight: '600', fontSize: '0.95rem' }}>{userProfile.email}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--auth-border-color)', paddingBottom: '12px' }}>
                    <span style={{ color: 'var(--auth-text-muted)', fontSize: '0.9rem' }}>Program</span>
                    <span style={{ color: 'var(--auth-text-main)', fontWeight: '600', fontSize: '0.95rem' }}>{userProfile.program}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '4px' }}>
                    <span style={{ color: 'var(--auth-text-muted)', fontSize: '0.9rem' }}>Institution</span>
                    <span style={{ color: '#38bdf8', fontWeight: '600', fontSize: '0.95rem' }}>{userProfile.institution}</span>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
}