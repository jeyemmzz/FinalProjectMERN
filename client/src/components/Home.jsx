import React, { useState, useEffect } from 'react';
import '../styles/Auth.css';

export default function Home({ onNavigateLogin, onNavigateSignup, onNavigateAbout, onNavigateEvents }) {
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
          <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }} onClick={onNavigateEvents}>
            <span style={{ fontSize: '1rem', fontWeight: '800', color: '#ffffff' }}>
              Syntax <span style={{ color: '#38bdf8' }}>4</span>
            </span>
          </div>

          <div style={{ width: '1px', height: '16px', background: 'rgba(255, 255, 255, 0.12)' }}></div>

          <span className="nav-item" style={{ color: '#38bdf8' }}>Home</span>
          <span onClick={onNavigateEvents} className="nav-item">Events</span>
          <span onClick={onNavigateAbout} className="nav-item">About</span>
          <button className="nav-pill-btn active" onClick={onNavigateLogin}>Login</button>
          <button className="nav-pill-btn register" onClick={onNavigateSignup}>Register</button>
        </div>
      </nav>

      <div className="auth-container" style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
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
              <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>Welcome to Event Management System</h1>
              <p style={{ fontSize: '1.15rem', marginBottom: '35px', maxWidth: '600px' }}>
                Your ultimate portal for organizing university activities, seamless participant sign-ups, and streamlined institutional calendars.
              </p>
              <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                <button 
                  onClick={onNavigateLogin} 
                  className="submit-btn"
                  style={{ width: 'auto', padding: '12px 28px', fontSize: '1rem' }}
                >
                  Get Started
                </button>
                <button 
                  onClick={onNavigateEvents} 
                  className="submit-btn"
                  style={{ width: 'auto', padding: '12px 28px', fontSize: '1rem', background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.3)' }}
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