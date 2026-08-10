import React, { useState, useEffect } from 'react';
import '../styles/Auth.css';

export default function About({ onNavigateHome, onNavigateLogin, onNavigateSignup, onNavigateEvents }) {
  const [isPageLoading, setIsPageLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="auth-page-wrapper">
      <nav className="auth-navbar-centered">
        <div className="nav-pill-container" style={{ gap: '16px' }}>
          <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }} onClick={onNavigateHome}>
            <span style={{ fontSize: '1rem', fontWeight: '800', color: '#ffffff' }}>
              Syntax <span style={{ color: '#38bdf8' }}>4</span>
            </span>
          </div>

          <div style={{ width: '1px', height: '16px', background: 'rgba(255, 255, 255, 0.12)' }}></div>

          <span onClick={onNavigateHome} className="nav-item">Home</span>
          <span onClick={onNavigateEvents} className="nav-item">Events</span>
          <span className="nav-item" style={{ color: '#38bdf8' }}>About</span>
          <button className="nav-pill-btn" onClick={onNavigateLogin}>Login</button>
          <button className="nav-pill-btn register" onClick={onNavigateSignup}>Register</button>
        </div>
      </nav>

      <div className="auth-container" style={{ justifyContent: 'center', alignItems: 'center', padding: '50px 20px', flexDirection: 'column' }}>
        <div className="auth-card-pro" style={{ maxWidth: '800px', width: '100%', textAlign: 'left', padding: '50px' }}>
          {isPageLoading ? (
            <div>
              <div className="skeleton-loader" style={{ height: '35px', width: '40%', marginBottom: '20px' }}></div>
              <div className="skeleton-loader" style={{ height: '18px', width: '100%', marginBottom: '10px' }}></div>
              <div className="skeleton-loader" style={{ height: '18px', width: '90%', marginBottom: '30px' }}></div>
              <div className="skeleton-loader" style={{ height: '150px', width: '100%', borderRadius: '12px', marginBottom: '30px' }}></div>
            </div>
          ) : (
            <>
              <h2 style={{ fontSize: '2.2rem', marginBottom: '16px', color: '#ffffff', letterSpacing: '-0.025em' }}>About the System</h2>
              <p className="auth-subtitle" style={{ fontSize: '1.05rem', lineHeight: '1.7', marginBottom: '30px', color: '#94a3b8' }}>
                The <strong style={{ color: '#e2e8f0'}}>Syntax4 Event System</strong> is an enterprise-grade institutional portal engineered to optimize campus activity management, enhance participant tracking, and streamline administrative workflows with absolute reliability.</p>

              <div style={{ background: 'rgba(3, 7, 18, 0.5)', padding: '25px', borderRadius: '14px', border: '1px solid rgba(56, 189, 248, 0.15)', marginBottom: '30px' }}>
                <h3 style={{ fontSize: '1.2rem', color: '#38bdf8', marginBottom: '10px' }}>Our Mission & Purpose</h3>
                <p style={{ fontSize: '0.92rem', color: '#cbd5e1', lineHeight: '1.6' }}>
                  To bridge the gap between administrators, organizers, and participants by providing a centralized, secure, and lightning-fast digital platform that eliminates traditional paperwork and scheduling conflicts.
                </p>
              </div>

              <h3 style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: '16px' }}>Core Capabilities</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '35px' }}>
                <div style={{ background: 'rgba(3, 7, 18, 0.4)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <h4 style={{ fontSize: '1rem', color: '#38bdf8', marginBottom: '8px' }}>⚡ Real-Time Attendance</h4>
                  <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: '1.5' }}>Instantly log and verify participant check-ins with automated audit trails.</p>
                </div>
                <div style={{ background: 'rgba(3, 7, 18, 0.4)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <h4 style={{ fontSize: '1rem', color: '#38bdf8', marginBottom: '8px' }}>📅 Institutional Calendars</h4>
                  <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: '1.5' }}>View upcoming university milestones and seminars in an organized timeline.</p>
                </div>
                <div style={{ background: 'rgba(3, 7, 18, 0.4)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <h4 style={{ fontSize: '1rem', color: '#38bdf8', marginBottom: '8px' }}>🔒 Role-Based Security</h4>
                  <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: '1.5' }}>Restricted access levels ensuring complete safety for admin and student accounts.</p>
                </div>
                <div style={{ background: 'rgba(3, 7, 18, 0.4)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <h4 style={{ fontSize: '1rem', color: '#38bdf8', marginBottom: '8px' }}>🎨 Modern Glass UI</h4>
                  <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: '1.5' }}>Sleek, dark-themed frosted glass design optimized for any device screen.</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                <button onClick={onNavigateHome} className="submit-btn" style={{ width: 'auto', padding: '12px 28px' }}>
                  Back to Home
                </button>
                <button onClick={onNavigateEvents} className="submit-btn" style={{ width: 'auto', padding: '12px 28px', background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
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