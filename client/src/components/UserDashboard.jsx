import React, { useState, useEffect, useCallback } from 'react';
import calendarIcon from '../assets/calendar-2-line.png';
import mapPinIcon from '../assets/map-pin-line.png';
import couponIcon from '../assets/coupon-2-fill.png';
import checkboxIcon from '../assets/checkbox-circle-fill.png';
import moonIcon from '../assets/moon-fill (2).png';
import sunIcon from '../assets/sun-fill (1).png';

export default function UserDashboard({ onLogout, onNavigateHome, onNavigateEvents }) {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [user, setUser] = useState(null);
  const [animateIn, setAnimateIn] = useState(false);

  // Dynamic Events State from Server
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Registrations State (Pending / Confirmed Receipts)
  const [myRegistrations, setMyRegistrations] = useState([]);
  const [isRegLoading, setIsRegLoading] = useState(true);

  // Fetch user registrations using email
  const fetchRegistrations = useCallback((email) => {
    if (!email) return;
    fetch(`http://localhost:5000/api/registrations?email=${encodeURIComponent(email)}`)
      .then(res => res.json())
      .then(regData => {
        if (Array.isArray(regData) && regData.length > 0) {
          // Only update if server actually has data (in-memory server may restart with empty list)
          setMyRegistrations(regData);
        }
        setIsRegLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch user registrations:', err);
        setIsRegLoading(false);
      });
  }, []);

  useEffect(() => {
    // 1. Initial animation trigger
    const timer = setTimeout(() => setAnimateIn(true), 10);

    // 2. Load and apply saved theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setIsDarkMode(savedTheme === 'dark');
    document.body.setAttribute('data-theme', savedTheme);

    // 3. Fetch Events from Backend Server
    fetch('http://localhost:5000/api/events')
      .then(res => res.json())
      .then(data => {
        setEvents(Array.isArray(data) ? data : []);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch events:', err);
        setIsLoading(false);
      });

    // 4. Retrieve current user from localStorage & fetch registrations
    const storedUserData = localStorage.getItem('currentUser');
    let currentUser = storedUserData ? JSON.parse(storedUserData) : null;

    if (currentUser) {
      // Only auto-generate an ID for non-student accounts that have no ID yet
      const isStudentUser = currentUser.userType === 'student';
      if (!isStudentUser && (!currentUser.studentId || currentUser.studentId === 'N/A')) {
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
      fetchRegistrations(currentUser.email);

    } else {
      const defaultUser = {
        name: 'User Account',
        email: 'user@example.com',
        studentId: '2026-102948',
      };
      setUser(defaultUser);
      setIsRegLoading(false);
    }

    // 5. Refetch registrations when window/tab regains focus
    const handleWindowFocus = () => {
      const currentStored = localStorage.getItem('currentUser');
      if (currentStored) {
        const parsed = JSON.parse(currentStored);
        if (parsed && parsed.email) {
          fetchRegistrations(parsed.email);
        }
      }
    };

    window.addEventListener('focus', handleWindowFocus);

    // 6. Poll every 5 seconds to pick up admin approve/decline changes
    let pollingEmail = null;
    const storedForPoll = localStorage.getItem('currentUser');
    if (storedForPoll) {
      const parsedForPoll = JSON.parse(storedForPoll);
      pollingEmail = parsedForPoll?.email || null;
    }
    const pollInterval = pollingEmail
      ? setInterval(() => fetchRegistrations(pollingEmail), 5000)
      : null;

    return () => {
      clearTimeout(timer);
      window.removeEventListener('focus', handleWindowFocus);
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [fetchRegistrations]);

  const toggleTheme = () => {
    const nextMode = !isDarkMode;
    setIsDarkMode(nextMode);
    const themeName = nextMode ? 'dark' : 'light';
    document.body.setAttribute('data-theme', themeName);
    localStorage.setItem('theme', themeName);
  };

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

          {/* Nav Links */}
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
              gap: '6px',
              whiteSpace: 'nowrap'
            }}
          >
            <img 
              src={isDarkMode ? moonIcon : sunIcon} 
              alt="Theme Icon" 
              style={{ width: '16px', height: '16px', objectFit: 'contain' }} 
            />
            {isDarkMode ? 'Dark' : 'Light'}
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
              {user?.userType === 'student' && (
                <span style={{
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: '#10b981',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  padding: '4px 12px',
                  borderRadius: '9999px',
                  fontSize: '0.8rem',
                  fontWeight: '700',
                  textTransform: 'uppercase'
                }}>
                  Student
                </span>
              )}
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
          
          {/* Account ID / Student Number Card */}
          <div className="info-card" style={{
            background: isDarkMode ? 'rgba(17, 24, 39, 0.6)' : 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(16px)',
            padding: '24px 28px',
            borderRadius: '20px',
            border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.05)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
          }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {user?.userType === 'student' ? 'Student Number' : 'Account ID'}
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
            <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#38bdf8', marginTop: '8px', wordBreak: 'break-all' }}>
              {user?.email || 'Loading...'}
            </div>
          </div>

        </div>

        {/* My Registered Events & Receipts */}
        <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: isDarkMode ? '#ffffff' : '#0f172a', marginBottom: '16px' }}>
          My Registered Events & Receipts
        </h2>

        {isRegLoading ? (
          <p style={{ color: '#94a3b8', marginBottom: '30px' }}>Loading your registrations...</p>
        ) : myRegistrations.length === 0 ? (
          <p style={{ color: '#94a3b8', marginBottom: '30px' }}>You haven't registered for any events yet. Check out the upcoming events below!</p>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px',
            marginBottom: '40px'
          }}>
            {myRegistrations.map((reg) => {
              const regId = reg._id || reg.id;
              const isConfirmed = reg.status === 'Confirmed' || reg.status === 'Approved';
              const isDeclined = reg.status === 'Declined';
              const rawIdStr = String(regId || '');
              const shortRegId = rawIdStr.length > 6 ? rawIdStr.slice(-6).toUpperCase() : rawIdStr || 'SYN-404';

              return (
                <div
                  key={regId}
                  style={{
                    background: isDarkMode ? 'rgba(17, 24, 39, 0.6)' : 'rgba(255, 255, 255, 0.7)',
                    backdropFilter: 'blur(16px)',
                    padding: '24px 28px',
                    borderRadius: '20px',
                    border: isDeclined
                      ? '1px solid rgba(244, 63, 94, 0.3)'
                      : isDarkMode ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.05)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                    position: 'relative',
                    opacity: isDeclined ? 0.8 : 1
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px', gap: '10px' }}>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: isDarkMode ? '#ffffff' : '#0f172a', margin: 0 }}>
                      {reg.eventTitle || reg.title || reg.eventName}
                    </h3>
                    
                    {/* Status Badge with Check Icon */}
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '8px',
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      whiteSpace: 'nowrap',
                      background: isConfirmed
                        ? 'rgba(16, 185, 129, 0.15)'
                        : isDeclined
                        ? 'rgba(244, 63, 94, 0.15)'
                        : 'rgba(245, 158, 11, 0.15)',
                      color: isConfirmed ? '#10b981' : isDeclined ? '#f43f5e' : '#f59e0b',
                      border: `1px solid ${isConfirmed ? 'rgba(16, 185, 129, 0.3)' : isDeclined ? 'rgba(244, 63, 94, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      {isConfirmed ? (
                        <>
                          <img src={checkboxIcon} alt="Check" style={{ width: '14px', height: '14px', objectFit: 'contain' }} />
                          Confirmed
                        </>
                      ) : isDeclined ? (
                        '❌ Declined'
                      ) : (
                        '⏳ Pending Approval'
                      )}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.9rem', color: '#94a3b8', margin: '4px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <img src={calendarIcon} alt="Calendar" style={{ width: '15px', height: '15px', filter: isDarkMode ? 'invert(1)' : 'none', opacity: 0.7 }} /> 
                    Date: {reg.eventDate || reg.date}
                  </p>
                  
                  {/* Venue Field with Custom Map Pin Icon */}
                  <p style={{ fontSize: '0.9rem', color: '#94a3b8', margin: '4px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <img src={mapPinIcon} alt="Map Pin" style={{ width: '15px', height: '15px', filter: isDarkMode ? 'invert(1)' : 'none', opacity: 0.7 }} /> 
                    Venue: {reg.venue || reg.location || reg.eventVenue || 'Not Specified'}
                  </p>

                  {/* Official Digital Event Pass / Receipt with Coupon/Ticket Icon */}
                  {isConfirmed ? (
                    <div style={{ marginTop: '16px', padding: '12px', background: 'rgba(16, 185, 129, 0.08)', borderRadius: '12px', border: '1px dashed rgba(16, 185, 129, 0.3)' }}>
                      <p style={{ fontSize: '0.75rem', color: '#10b981', margin: '0 0 4px 0', fontWeight: '700', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <img src={couponIcon} alt="Ticket" style={{ width: '14px', height: '14px', objectFit: 'contain' }} />
                        Official Digital Event Pass / Receipt
                      </p>
                      <p style={{ fontSize: '0.8rem', color: isDarkMode ? '#e2e8f0' : '#334155', margin: 0, fontWeight: '600' }}>
                        Registration ID: #{shortRegId}
                      </p>
                    </div>
                  ) : isDeclined ? (
                    <div style={{ marginTop: '16px', padding: '10px', background: 'rgba(244, 63, 94, 0.08)', borderRadius: '12px', border: '1px dashed rgba(244, 63, 94, 0.3)' }}>
                      <p style={{ fontSize: '0.78rem', color: '#f43f5e', margin: 0, fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        ❌ Your registration for this event was declined by the admin. You may contact the organizer for more information.
                      </p>
                    </div>
                  ) : (
                    <div style={{ marginTop: '16px', padding: '10px', background: 'rgba(245, 158, 11, 0.08)', borderRadius: '12px', border: '1px dashed rgba(245, 158, 11, 0.3)' }}>
                      <p style={{ fontSize: '0.78rem', color: '#f59e0b', margin: 0, fontWeight: '500' }}>
                        Awaiting admin confirmation before this converts to your official receipt.
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

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
            {events.map((evt) => {
              const eventId = evt._id || evt.id;
              return (
                <div
                  key={eventId}
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
                  <p style={{ fontSize: '0.9rem', color: '#94a3b8', margin: '4px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <img src={calendarIcon} alt="Calendar" style={{ width: '15px', height: '15px', filter: isDarkMode ? 'invert(1)' : 'none', opacity: 0.7 }} />
                    {evt.date}
                  </p>
                  <p style={{ fontSize: '0.9rem', color: '#94a3b8', margin: '4px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <img src={mapPinIcon} alt="Map Pin" style={{ width: '15px', height: '15px', filter: isDarkMode ? 'invert(1)' : 'none', opacity: 0.7 }} />
                    {evt.venue || evt.location || 'Not Specified'}
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
              );
            })}
          </div>
        )}

      </div>

    </div>
  );
}