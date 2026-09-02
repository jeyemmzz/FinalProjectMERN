import React, { useState, useEffect } from 'react';
import sunIcon from '../assets/sun-fill (1).png';
import moonIcon from '../assets/moon-fill (2).png';
import heroBg from '../assets/hero_bg.jpg';
import '../styles/Auth.css';

export default function Home({ 
  onNavigateLogin, 
  onNavigateSignup, 
  onNavigateAbout, 
  onNavigateEvents,
  onNavigateDashboard,
  onLogout 
}) {
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  
  // State para sa Navbar: true = nasa gitna (expanded), false = naka-collapse na bilog sa kaliwa
  const [isNavExpanded, setIsNavExpanded] = useState(true);

  // Page loading simulation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  // Theme initialization, persistence, and user session check
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
    }
  };

  const handleDashboardOrHome = () => {
    if (currentUser && onNavigateDashboard) {
      onNavigateDashboard();
    }
  };

  return (
    <div
      className="auth-page-wrapper home-bg"
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
        zIndex: 10
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
              <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' }} onClick={handleDashboardOrHome}>
                <span style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--auth-text-main, #ffffff)' }}>
                  Syntax <span style={{ color: '#38bdf8' }}>4</span>
                </span>
              </div>

              <div style={{ width: '1px', height: '16px', background: 'rgba(255, 255, 255, 0.12)', flexShrink: 0 }}></div>

              {/* Nav Links */}
              <div style={{ display: 'flex', gap: '15px', alignItems: 'center', whiteSpace: 'nowrap' }}>
                {currentUser && (
                  <span onClick={onNavigateDashboard} className="nav-item" style={{ cursor: 'pointer' }}>
                    Dashboard
                  </span>
                )}
                
                <span className="nav-item" style={{ color: '#38bdf8', fontWeight: '600' }}>Home</span>
                <span onClick={onNavigateEvents} className="nav-item" style={{ cursor: 'pointer' }}>Events</span>
                <span onClick={onNavigateAbout} className="nav-item" style={{ cursor: 'pointer' }}>About</span>
              </div>

              <div style={{ width: '1px', height: '18px', background: 'var(--auth-border-color)', flexShrink: 0 }}></div>

              {/* Theme Toggle Button with Custom Assets Icons */}
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

              {/* Conditional Actions based on Authentication */}
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
                  <button className="nav-pill-btn register" onClick={onNavigateSignup} style={{ cursor: 'pointer' }}>Register</button>
                </div>
              )}

              {/* Collapse Button (Gagawing bilog at mag-i-slide sa kaliwa) */}
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
            /* Hamburger Icon ☰ kapag naging bilog na sa kaliwa */
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

      <div className="auth-container" style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <div className="auth-brand-side" style={{ alignItems: 'center', maxWidth: '700px', margin: '0 auto' }}>
          {isPageLoading ? (
            <div style={{ width: '100%', padding: '20px' }}>
              <div className="skeleton-loader" style={{ height: '50px', width: '90%', margin: '0 auto 20px auto' }}></div>
              <div className="skeleton-loader" style={{ height: '20px', width: '70%', margin: '0 auto 10px auto' }}></div>
              <div className="skeleton-loader" style={{ height: '20px', width: '50%', margin: '0 auto 35px auto' }}></div>
              <div className="skeleton-loader" style={{ height: '45px', width: '160px', margin: '0 auto' }}></div>
            </div>
          ) : (
            <>
              <h1 style={{ fontSize: '3rem', marginBottom: '20px', color: '#ffffff', textShadow: '0 2px 12px rgba(0,0,0,0.5)' }}>Welcome to Event Management System</h1>
              <p style={{ fontSize: '1.15rem', marginBottom: '35px', maxWidth: '600px', color: '#bde0fe', textShadow: '0 1px 8px rgba(0,0,0,0.6)' }}>
                Your ultimate portal for organizing university activities, seamless participant sign-ups, and streamlined institutional calendars.
              </p>
              <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button 
                  onClick={currentUser ? onNavigateDashboard : onNavigateLogin} 
                  className="submit-btn"
                  style={{ width: 'auto', padding: '12px 28px', fontSize: '1rem', cursor: 'pointer' }}
                >
                  {currentUser ? 'Go to Dashboard' : 'Get Started'}
                </button>
                <button 
                  onClick={onNavigateEvents} 
                  className="submit-btn"
                  style={{ 
                    width: 'auto', 
                    padding: '12px 28px', 
                    fontSize: '1rem', 
                    background: 'rgba(56, 189, 248, 0.15)',
                    color: '#bde0fe', 
                    border: '1px solid rgba(56, 189, 248, 0.6)',
                    cursor: 'pointer',
                    backdropFilter: 'blur(4px)',
                    fontWeight: '600',
                  }}
                >
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