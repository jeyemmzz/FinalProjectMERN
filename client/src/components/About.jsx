import React, { useState, useEffect } from 'react';
import sunIcon from '../assets/sun-fill (1).png';
import moonIcon from '../assets/moon-fill (2).png';
import flashlightIconLight from '../assets/flashlight-fill.png';
import flashlightIconDark from '../assets/flashlight-fill (1).png';
import calendarIconLight from '../assets/calendar-2-line.png';
import calendarIconDark from '../assets/calendar-2-line (1).png';
import lockIconLight from '../assets/lock-2-line.png';
import lockIconDark from '../assets/lock-2-line (1).png';
import brushIconLight from '../assets/brush-2-fill.png';
import brushIconDark from '../assets/brush-2-fill (1).png';
import heroBg from '../assets/hero_bg2.jpg';
import '../styles/Auth.css';

export default function About({
  onNavigateHome,
  onNavigateLogin,
  onNavigateSignup,
  onNavigateEvents,
  onNavigateDashboard,
  onLogout
}) {
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  // State para sa Navbar: true = nasa gitna (expanded), false = naka-collapse na bilog sa kaliwa
  const [isNavExpanded, setIsNavExpanded] = useState(true);

  // Theme initialization, persistence, and session check
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setIsDarkMode(savedTheme === 'dark');
    document.body.setAttribute('data-theme', savedTheme);

    // Retrieve active logged-in user session
    const storedUserData = localStorage.getItem('currentUser');
    if (storedUserData) {
      try {
        setCurrentUser(JSON.parse(storedUserData));
      } catch (e) {
        console.error("Error parsing currentUser from localStorage:", e);
      }
    }

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

  // Always use dark-mode (white/light) icons since cards always have dark bg on image pages
  const currentFlashlight = flashlightIconDark;
  const currentCalendar = calendarIconDark;
  const currentLock = lockIconDark;
  const currentBrush = brushIconDark;

  return (
    <div
      className="auth-page-wrapper image-bg"
      style={{
        background: `url(${heroBg}) center / cover no-repeat fixed`,
        position: 'relative',
      }}
    >
      {/* Dark overlay for readability */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: isDarkMode
          ? 'linear-gradient(135deg, rgba(0,15,34,0.82) 0%, rgba(27,53,84,0.75) 50%, rgba(15,35,66,0.85) 100%)'
          : 'linear-gradient(135deg, rgba(15,35,66,0.70) 0%, rgba(37,70,112,0.65) 50%, rgba(0,15,34,0.75) 100%)',
        zIndex: 0,
        pointerEvents: 'none',
        transition: 'background 0.5s ease',
      }} />

      {/* BUTTER-SMOOTH SLIDING & MORPHING NAVIGATION BAR */}
      <nav style={{
        width: '100%',
        padding: '20px 40px',
        boxSizing: 'border-box',
        position: 'relative',
        height: '70px',
        display: 'flex',
        alignItems: 'center',
        zIndex: 1
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

                <span onClick={onNavigateEvents} className="nav-item" style={{ cursor: 'pointer' }}>
                  Events
                </span>

                <span className="nav-item" style={{ color: '#38bdf8', cursor: 'pointer', fontWeight: '600' }}>
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
                <div style={{ display: 'flex', gap: '8px', whiteSpace: 'nowrap' }}>
                  <button className="nav-pill-btn active" onClick={onNavigateLogin} style={{ cursor: 'pointer' }}>Login</button>

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

      <div className="auth-container image-content" style={{ justifyContent: 'center', alignItems: 'center', padding: '50px 20px', flexDirection: 'column', position: 'relative', zIndex: 1 }}>
        <div className="auth-card-pro" style={{ maxWidth: '800px', width: '100%', textAlign: 'left', padding: '50px', boxSizing: 'border-box' }}>
          {isPageLoading ? (
            <div>
              <div className="skeleton-loader" style={{ height: '35px', width: '40%', marginBottom: '20px' }}></div>
              <div className="skeleton-loader" style={{ height: '18px', width: '100%', marginBottom: '10px' }}></div>
              <div className="skeleton-loader" style={{ height: '18px', width: '90%', marginBottom: '30px' }}></div>
              <div className="skeleton-loader" style={{ height: '150px', width: '100%', borderRadius: '12px', marginBottom: '30px' }}></div>
            </div>
          ) : (
            <>
              <h2 style={{ fontSize: '2.2rem', marginBottom: '16px', color: 'var(--auth-text-main)', letterSpacing: '-0.025em', fontWeight: '700' }}>About the System</h2>
              <p className="auth-subtitle" style={{ fontSize: '1.05rem', lineHeight: '1.7', marginBottom: '30px', color: 'var(--auth-text-muted)' }}>
                The <strong style={{ color: 'var(--auth-text-main)' }}>Syntax4 Event System</strong> is an enterprise-grade portal engineered to bring that vision to life. Designed for public conferences, community programs, and effortless registrations, the platform bridges the gap between event organizers and attendees from all walks of life—streamlining scheduling, tracking participation, and delivering seamless, engaging experiences with absolute reliability.
              </p>

              <div style={{ background: 'var(--auth-input-bg)', padding: '25px', borderRadius: '14px', border: '1px solid rgba(56, 189, 248, 0.15)', marginBottom: '30px' }}>
                <h3 style={{ fontSize: '1.2rem', color: '#38bdf8', marginBottom: '10px', fontWeight: '600' }}>Our Vision & Mission</h3>
                <p style={{ fontSize: '0.92rem', color: 'var(--auth-text-sub)', lineHeight: '1.6' }}>
                  Empowering administrators, organizers, and participants with a seamless, high-performance platform that resolves scheduling conflicts and removes traditional paperwork entirely.
                </p>
              </div>

              <h3 style={{ fontSize: '1.2rem', color: 'var(--auth-text-main)', marginBottom: '16px', fontWeight: '600' }}>Core Capabilities</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '35px' }}>

                {/* Real-Time Attendance */}
                <div style={{ background: 'var(--auth-input-bg)', padding: '20px', borderRadius: '12px', border: '1px solid var(--auth-border-color)' }}>
                  <h4 style={{ fontSize: '1rem', color: '#38bdf8', marginBottom: '8px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <img src={currentFlashlight} alt="Real-Time Attendance" style={{ width: '16px', height: '16px', objectFit: 'contain' }} />
                    Real-Time Attendance
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--auth-text-muted)', lineHeight: '1.5' }}>Instantly log and verify participant check-ins with automated audit trails.</p>
                </div>

                {/* Institutional Calendars */}
                <div style={{ background: 'var(--auth-input-bg)', padding: '20px', borderRadius: '12px', border: '1px solid var(--auth-border-color)' }}>
                  <h4 style={{ fontSize: '1rem', color: '#38bdf8', marginBottom: '8px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <img src={currentCalendar} alt="Institutional Calendars" style={{ width: '16px', height: '16px', objectFit: 'contain' }} />
                    Institutional Calendars
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--auth-text-muted)', lineHeight: '1.5' }}>View upcoming university milestones and seminars in an organized timeline.</p>
                </div>

                {/* Role-Based Security */}
                <div style={{ background: 'var(--auth-input-bg)', padding: '20px', borderRadius: '12px', border: '1px solid var(--auth-border-color)' }}>
                  <h4 style={{ fontSize: '1rem', color: '#38bdf8', marginBottom: '8px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <img src={currentLock} alt="Role-Based Security" style={{ width: '16px', height: '16px', objectFit: 'contain' }} />
                    Role-Based Security
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--auth-text-muted)', lineHeight: '1.5' }}>Restricted access levels ensuring complete safety for admin and student accounts.</p>
                </div>

                {/* Modern Glass UI */}
                <div style={{ background: 'var(--auth-input-bg)', padding: '20px', borderRadius: '12px', border: '1px solid var(--auth-border-color)' }}>
                  <h4 style={{ fontSize: '1rem', color: '#38bdf8', marginBottom: '8px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <img src={currentBrush} alt="Modern Glass UI" style={{ width: '16px', height: '16px', objectFit: 'contain' }} />
                    Modern Glass UI
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--auth-text-muted)', lineHeight: '1.5' }}>Sleek, dark-themed frosted glass design optimized for any device screen.</p>
                </div>

                {/* Seamless Registration */}
                <div style={{ background: 'var(--auth-input-bg)', padding: '20px', borderRadius: '12px', border: '1px solid var(--auth-border-color)' }}>
                  <h4 style={{ fontSize: '1rem', color: '#38bdf8', marginBottom: '8px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
                    </svg>
                    Seamless Registration
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--auth-text-muted)', lineHeight: '1.5' }}>Quick and effortless event sign-up for attendees — no paperwork, no hassle, just a few clicks.</p>
                </div>

                {/* Public Event Discovery */}
                <div style={{ background: 'var(--auth-input-bg)', padding: '20px', borderRadius: '12px', border: '1px solid var(--auth-border-color)' }}>
                  <h4 style={{ fontSize: '1rem', color: '#38bdf8', marginBottom: '8px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    </svg>
                    Public Event Discovery
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--auth-text-muted)', lineHeight: '1.5' }}>Browse and search upcoming public conferences, community programs, workshops, and seminars with ease.</p>
                </div>

                {/* Attendee Management */}
                <div style={{ background: 'var(--auth-input-bg)', padding: '20px', borderRadius: '12px', border: '1px solid var(--auth-border-color)' }}>
                  <h4 style={{ fontSize: '1rem', color: '#38bdf8', marginBottom: '8px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
                    </svg>
                    Attendee Management
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--auth-text-muted)', lineHeight: '1.5' }}>Organizers can monitor registrations, view participant lists, and manage attendees efficiently in real time.</p>
                </div>

                {/* Multi-Category Events */}
                <div style={{ background: 'var(--auth-input-bg)', padding: '20px', borderRadius: '12px', border: '1px solid var(--auth-border-color)' }}>
                  <h4 style={{ fontSize: '1rem', color: '#38bdf8', marginBottom: '8px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
                    </svg>
                    Multi-Category Events
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--auth-text-muted)', lineHeight: '1.5' }}>Supports Seminars, Workshops, Competitions, and Meetings — all organized and filterable in one unified platform.</p>
                </div>

                {/* Organizer Dashboard */}
                <div style={{ background: 'var(--auth-input-bg)', padding: '20px', borderRadius: '12px', border: '1px solid var(--auth-border-color)' }}>
                  <h4 style={{ fontSize: '1rem', color: '#38bdf8', marginBottom: '8px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
                    </svg>
                    Organizer Dashboard
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--auth-text-muted)', lineHeight: '1.5' }}>A powerful admin panel to create, edit, and manage events with full control over schedules, venues, and capacities.</p>
                </div>

              </div>

              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                <button onClick={handleDashboardOrHome} className="submit-btn" style={{ width: 'auto', padding: '12px 28px', cursor: 'pointer' }}>
                  {currentUser ? 'Back to Dashboard' : 'Back to Home'}
                </button>
                <button onClick={onNavigateEvents} className="submit-btn" style={{ width: 'auto', padding: '12px 28px', background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.3)', cursor: 'pointer' }}>
                  Explore Events
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}