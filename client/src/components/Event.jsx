import React, { useState, useEffect } from 'react';
import sunIcon from '../assets/sun-fill (1).png';
import moonIcon from '../assets/moon-fill (2).png';
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

  // State para sa Navbar: true = nasa gitna (expanded), false = naka-collapse na bilog sa kaliwa
  const [isNavExpanded, setIsNavExpanded] = useState(true);

  // Dynamic Events State galing sa Server
  const [eventsList, setEventsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal & Registration States
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [userType, setUserType] = useState('student'); // 'student' or 'non-student'
  const [registrationData, setRegistrationData] = useState({ name: '', email: '', studentId: '' });
  const [isRegistered, setIsRegistered] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Theme initialization, session check, at pag-fetch ng events
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setIsDarkMode(savedTheme === 'dark');
    document.body.setAttribute('data-theme', savedTheme);

    // Retrieve active logged-in user from localStorage
    const storedUserData = localStorage.getItem('currentUser');
    if (storedUserData) {
      try {
        const parsedUser = JSON.parse(storedUserData);
        setCurrentUser(parsedUser);
        // Pre-fill user data if logged in
        setRegistrationData(prev => ({
          ...prev,
          name: parsedUser.name || parsedUser.username || '',
          email: parsedUser.email || ''
        }));
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

  // Modal Handlers
  const handleOpenModal = (event) => {
    setSelectedEvent(event);
    setIsRegistered(false);
    setUserType('student');
    if (currentUser) {
      setRegistrationData(prev => ({
        ...prev,
        name: currentUser.name || currentUser.username || '',
        email: currentUser.email || '',
        studentId: ''
      }));
    }
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEvent) return;

    setIsSubmitting(true);

    const payload = {
      eventId: selectedEvent.id || selectedEvent._id,
      eventTitle: selectedEvent.title,
      eventDate: selectedEvent.date,
      eventVenue: selectedEvent.venue || selectedEvent.location,
      userType: userType,
      name: registrationData.name,
      email: registrationData.email,
      studentId: userType === 'student' ? registrationData.studentId : null,
      userId: currentUser ? (currentUser.id || currentUser._id) : null
    };

    try {
      const response = await fetch('http://localhost:5000/api/register-event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setIsRegistered(true);
      } else {
        const errorData = await response.json();
        alert(`Registration failed: ${errorData.message || 'Please try again.'}`);
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('A network error occurred. Please make sure the server is running.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredEvents = eventsList.filter(ev => {
    const categoryMatch = ev.category || ev.type || 'Seminar';
    const matchesCategory = selectedCategory === 'All' || categoryMatch === selectedCategory;
    
    const titleMatch = ev.title || '';
    const venueMatch = ev.venue || ev.location || '';
    const matchesSearch = titleMatch.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          venueMatch.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="auth-page-wrapper">
      
      {/* BUTTER-SMOOTH SLIDING & MORPHING NAVIGATION BAR */}
      <nav style={{
        width: '100%',
        padding: '20px 40px',
        boxSizing: 'border-box',
        position: 'relative',
        height: '70px',
        display: 'flex',
        alignItems: 'center'
      }}>
        <div 
          style={{
            position: 'absolute',
            left: isNavExpanded ? '50%' : '40px',
            transform: isNavExpanded ? 'translateX(-50%)' : 'translateX(0)',
            width: isNavExpanded ? 'auto' : '48px',
            height: '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: isNavExpanded ? 'flex-start' : 'center',
            gap: isNavExpanded ? '16px' : '0px',
            padding: isNavExpanded ? '10px 24px' : '0px',
            background: isDarkMode ? 'rgba(17, 24, 39, 0.85)' : 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(16px)',
            borderRadius: isNavExpanded ? '9999px' : '50%',
            boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
            border: isDarkMode ? '1px solid rgba(56, 189, 248, 0.3)' : '1px solid rgba(0,0,0,0.1)',
            overflow: 'hidden',
            transition: 'left 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), width 0.6s cubic-bezier(0.16, 1, 0.3, 1), border-radius 0.6s cubic-bezier(0.16, 1, 0.3, 1), padding 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
            cursor: !isNavExpanded ? 'pointer' : 'default',
            zIndex: 10
          }}
          onClick={() => {
            if (!isNavExpanded) setIsNavExpanded(true);
          }}
          title={!isNavExpanded ? "Click to open Navigation Menu" : ""}
        >
          {isNavExpanded ? (
            <>
              {/* Logo / Title */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', whiteSpace: 'nowrap' }} onClick={handleDashboardOrHome}>
                <span style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--auth-text-main, #ffffff)' }}>
                  Syntax <span style={{ color: '#38bdf8' }}>4</span>
                </span>
              </div>

              <div style={{ width: '1px', height: '16px', background: 'rgba(255, 255, 255, 0.12)', flexShrink: 0 }}></div>

              {/* Nav Links */}
              <div style={{ display: 'flex', gap: '15px', alignItems: 'center', whiteSpace: 'nowrap' }}>
                {currentUser ? (
                  <span onClick={onNavigateDashboard} className="nav-item" style={{ cursor: 'pointer' }}>
                    Profile
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

              <div style={{ width: '1px', height: '18px', background: 'var(--auth-border-color)', flexShrink: 0 }}></div>

              {/* Theme Toggle Button with Asset Icons */}
              <button
                className="nav-pill-btn"
                onClick={toggleTheme}
                style={{ 
                  border: '1px solid rgba(56, 189, 248, 0.3)', 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.85rem',
                  whiteSpace: 'nowrap'
                }}
              >
                <img 
                  src={isDarkMode ? moonIcon : sunIcon} 
                  alt={isDarkMode ? 'Dark Mode' : 'Light Mode'} 
                  style={{ width: '16px', height: '16px', objectFit: 'contain' }} 
                />
                {isDarkMode ? 'Dark' : 'Light'}
              </button>

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
                    boxShadow: '0 4px 15px rgba(220, 38, 38, 0.3)',
                    whiteSpace: 'nowrap'
                  }}
                >
                  Logout
                </button>
              ) : (
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', whiteSpace: 'nowrap' }}>
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
              )}

              {/* Collapse Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsNavExpanded(false);
                }}
                title="Collapse menu to avoid distraction"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '700',
                  padding: '4px 8px',
                  marginLeft: '4px',
                  borderRadius: '50%',
                  transition: 'color 0.2s',
                  whiteSpace: 'nowrap'
                }}
                className="nav-link"
              >
                ✕
              </button>
            </>
          ) : (
            /* Hamburger Icon ☰ kapag naka-collapse */
            <div style={{
              fontSize: '1.25rem',
              fontWeight: '700',
              color: '#38bdf8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%',
              lineHeight: 1
            }}>
              ☰
            </div>
          )}
        </div>
      </nav>

      <div style={{ maxWidth: '1100px', width: '92%', margin: '40px auto', display: 'flex', flexDirection: 'column', gap: '25px' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '800', color: 'var(--auth-text-main, #ffffff)', marginBottom: '8px' }}>Campus Events</h1>
          <p style={{ fontSize: '0.95rem', color: 'var(--auth-text-muted, #80aad3)' }}>Explore upcoming university activities, workshops, and seminars.</p>
        </div>

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

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '25px' }}>
          {isLoading ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: 'var(--auth-text-muted)' }}>
              Loading events...
            </div>
          ) : filteredEvents.length > 0 ? (
            filteredEvents.map(ev => (
              <div key={ev.id || ev._id} className="auth-card-pro" style={{ padding: '25px', margin: 0, display: 'flex', flexDirection: 'column', gap: '14px', boxSizing: 'border-box' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', padding: '3px 10px', borderRadius: '6px', background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', fontWeight: '600' }}>
                    {ev.category || ev.type || 'Seminar'}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: ev.status === 'Full' ? '#f43f5e' : '#10b981', fontWeight: '600' }}>
                    {ev.status || 'Upcoming'}
                  </span>
                </div>

                <div>
                  <h3 style={{ fontSize: '1.2rem', color: 'var(--auth-text-main)', fontWeight: '700', marginBottom: '6px' }}>{ev.title}</h3>
                  
                  {/* Calendar Icon + Date */}
                  <p style={{ fontSize: '0.85rem', color: 'var(--auth-text-muted)', margin: '4px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    {ev.date}
                  </p>

                  {/* Map Pin Icon + Venue */}
                  <p style={{ fontSize: '0.85rem', color: 'var(--auth-text-muted)', margin: '4px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    {ev.venue || ev.location}
                  </p>

                  {ev.description && (
                    <p style={{ fontSize: '0.8rem', color: 'var(--auth-text-muted)', margin: '6px 0 0 0' }}>{ev.description}</p>
                  )}
                </div>

                <button 
                  className="submit-btn" 
                  onClick={() => handleOpenModal(ev)}
                  style={{ padding: '10px', width: '100%', fontSize: '0.85rem', marginTop: '4px', cursor: 'pointer' }}
                >
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

      {selectedEvent && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
          }}
        >
          <div 
            className="auth-card-pro"
            style={{
              width: '90%',
              maxWidth: '500px',
              padding: '30px',
              position: 'relative',
              borderRadius: '16px',
              boxSizing: 'border-box'
            }}
          >
            <button
              onClick={handleCloseModal}
              style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                background: 'none',
                border: 'none',
                color: 'var(--auth-text-muted)',
                fontSize: '1.2rem',
                cursor: 'pointer'
              }}
            >
              ✕
            </button>

            <span style={{ fontSize: '0.75rem', padding: '3px 10px', borderRadius: '6px', background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', fontWeight: '600' }}>
              {selectedEvent.category || selectedEvent.type || 'Seminar'}
            </span>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--auth-text-main)', margin: '10px 0 6px 0', fontWeight: '800' }}>
              {selectedEvent.title}
            </h2>

            {/* Modal Calendar Icon + Date */}
            <p style={{ fontSize: '0.85rem', color: 'var(--auth-text-muted)', margin: '2px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              {selectedEvent.date}
            </p>

            {/* Modal Map Pin Icon + Venue */}
            <p style={{ fontSize: '0.85rem', color: 'var(--auth-text-muted)', margin: '2px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              {selectedEvent.venue || selectedEvent.location}
            </p>
            
            <p style={{ fontSize: '0.9rem', color: 'var(--auth-text-main)', margin: '15px 0', lineHeight: '1.5' }}>
              {selectedEvent.description || 'No additional details provided for this event.'}
            </p>

            <div style={{ width: '100%', height: '1px', background: 'var(--auth-border-color)', margin: '20px 0' }}></div>

            {isRegistered ? (
              <div style={{ textAlign: 'center', padding: '10px 0' }}>
                <h3 style={{ color: '#10b981', marginBottom: '8px', fontSize: '1.2rem' }}>🎉 Registration Successful!</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--auth-text-muted)' }}>
                  You are registered for <strong>{selectedEvent.title}</strong> as a {userType === 'student' ? 'Student' : 'Non-Student / Guest'}.
                </p>
                <button
                  onClick={handleCloseModal}
                  className="submit-btn"
                  style={{ marginTop: '20px', padding: '8px 20px', fontSize: '0.85rem', cursor: 'pointer' }}
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h4 style={{ fontSize: '1rem', color: 'var(--auth-text-main)', margin: '0 0 5px 0' }}>Register for this Event</h4>
                
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setUserType('student')}
                    style={{
                      flex: 1,
                      padding: '8px',
                      borderRadius: '8px',
                      border: userType === 'student' ? '1px solid #38bdf8' : '1px solid var(--auth-border-color)',
                      background: userType === 'student' ? 'rgba(56, 189, 248, 0.15)' : 'var(--auth-input-bg)',
                      color: userType === 'student' ? '#38bdf8' : 'var(--auth-text-muted)',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Student
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setUserType('non-student');
                      setRegistrationData(prev => ({ ...prev, studentId: '' }));
                    }}
                    style={{
                      flex: 1,
                      padding: '8px',
                      borderRadius: '8px',
                      border: userType === 'non-student' ? '1px solid #38bdf8' : '1px solid var(--auth-border-color)',
                      background: userType === 'non-student' ? 'rgba(56, 189, 248, 0.15)' : 'var(--auth-input-bg)',
                      color: userType === 'non-student' ? '#38bdf8' : 'var(--auth-text-muted)',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Non-Student / Guest
                  </button>
                </div>

                <input
                  type="text"
                  placeholder="Full Name"
                  required
                  value={registrationData.name}
                  onChange={(e) => setRegistrationData({ ...registrationData, name: e.target.value })}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid var(--auth-border-color)',
                    background: 'var(--auth-input-bg)',
                    color: 'var(--auth-text-main)',
                    fontSize: '0.85rem',
                    outline: 'none'
                  }}
                />

                <input
                  type="email"
                  placeholder="Email Address"
                  required
                  value={registrationData.email}
                  onChange={(e) => setRegistrationData({ ...registrationData, email: e.target.value })}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid var(--auth-border-color)',
                    background: 'var(--auth-input-bg)',
                    color: 'var(--auth-text-main)',
                    fontSize: '0.85rem',
                    outline: 'none'
                  }}
                />

                {userType === 'student' && (
                  <input
                    type="text"
                    placeholder="Student ID Number"
                    required
                    value={registrationData.studentId}
                    onChange={(e) => setRegistrationData({ ...registrationData, studentId: e.target.value })}
                    style={{
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid var(--auth-border-color)',
                      background: 'var(--auth-input-bg)',
                      color: 'var(--auth-text-main)',
                      fontSize: '0.85rem',
                      outline: 'none'
                    }}
                  />
                )}

                <button
                  type="submit"
                  className="submit-btn"
                  disabled={isSubmitting}
                  style={{
                    padding: '10px',
                    fontSize: '0.85rem',
                    marginTop: '8px',
                    fontWeight: '700',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    opacity: isSubmitting ? 0.7 : 1
                  }}
                >
                  {isSubmitting ? 'Confirming...' : 'Confirm Registration'}
                </button>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}