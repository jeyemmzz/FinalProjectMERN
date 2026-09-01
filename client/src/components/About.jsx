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

  // Dynamic Icon Selection based on theme mode
  const currentFlashlight = isDarkMode ? flashlightIconDark : flashlightIconLight;
  const currentCalendar = isDarkMode ? calendarIconDark : calendarIconLight;
  const currentLock = isDarkMode ? lockIconDark : lockIconLight;
  const currentBrush = isDarkMode ? brushIconDark : brushIconLight;

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

      <div className="auth-container" style={{ justifyContent: 'center', alignItems: 'center', padding: '50px 20px', flexDirection: 'column' }}>
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
                The <strong style={{ color: 'var(--auth-text-main)' }}>Syntax4 Event System</strong> is an enterprise-grade institutional portal engineered to optimize campus activity management, enhance participant tracking, and streamline administrative workflows with absolute reliability.
              </p>

              <div style={{ background: 'var(--auth-input-bg)', padding: '25px', borderRadius: '14px', border: '1px solid rgba(56, 189, 248, 0.15)', marginBottom: '30px' }}>
                <h3 style={{ fontSize: '1.2rem', color: '#38bdf8', marginBottom: '10px', fontWeight: '600' }}>Our Mission & Purpose</h3>
                <p style={{ fontSize: '0.92rem', color: 'var(--auth-text-sub)', lineHeight: '1.6' }}>
                  To bridge the gap between administrators, organizers, and participants by providing a centralized, secure, and lightning-fast digital platform that eliminates traditional paperwork and scheduling conflicts.
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