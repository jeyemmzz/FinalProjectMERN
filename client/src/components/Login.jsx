import React, { useState, useEffect } from 'react';
import '../styles/Auth.css';

export default function Login({ 
  onBackToHome, 
  onSwitchToSignup, 
  onNavigateAbout, 
  onNavigateEvents, 
  onNavigateUserDashboard, 
  onNavigateAdminDashboard 
}) {
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Page loading simulation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  // Theme initialization and persistence (Katulad sa Home.jsx)
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setIsDarkMode(savedTheme === 'dark');
    document.body.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const nextMode = !isDarkMode;
    setIsDarkMode(nextMode);
    const themeName = nextMode ? 'dark' : 'light';
    document.body.setAttribute('data-theme', themeName);
    localStorage.setItem('theme', themeName);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email || !password) {
      setErrorMessage('Please fill in all fields.');
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (email === 'admin@syntax4.com' && password === 'admin123') {
      onNavigateAdminDashboard();
      return;
    }

    if (email === 'student@syntax4.com' && password === 'student123') {
      onNavigateUserDashboard();
      return;
    }

    setErrorMessage('Invalid email or password. Please try again.');
  };

  return (
    <div className="auth-page-wrapper">
      <nav className="auth-navbar-centered">
        <div className="nav-pill-container" style={{ gap: '16px' }}>
          <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }} onClick={onBackToHome}>
            <span style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--auth-text-main, #ffffff)' }}>
              Syntax <span style={{ color: '#38bdf8' }}>4</span>
            </span>
          </div>

          <div style={{ width: '1px', height: '16px', background: 'rgba(255, 255, 255, 0.12)' }}></div>

          <span onClick={onBackToHome} className="nav-item">Home</span>
          <span onClick={onNavigateEvents} className="nav-item">Events</span>
          <span onClick={onNavigateAbout} className="nav-item">About</span>

          {/* Theme Toggle Button (Gamit ang tamang pill style katulad sa Home) */}
          <button 
            className="nav-pill-btn" 
            onClick={toggleTheme}
            style={{ border: '1px solid rgba(56, 189, 248, 0.3)', cursor: 'pointer' }}
          >
            {isDarkMode ? '🌙 Dark' : '☀️ Light'}
          </button>

          <button className="nav-pill-btn active" onClick={() => {}}>Login</button>
          <button className="nav-pill-btn register" onClick={onSwitchToSignup}>Register</button>
        </div>
      </nav>

      <div className="auth-container" style={{ justifyContent: 'center', alignItems: 'center', padding: '40px 20px' }}>
        <div className="auth-card-pro" style={{ maxWidth: '420px', width: '100%', padding: '40px' }}>
          {isPageLoading ? (
            <div>
              <div className="skeleton-loader" style={{ height: '30px', width: '60%', marginBottom: '15px' }}></div>
              <div className="skeleton-loader" style={{ height: '16px', width: '80%', marginBottom: '30px' }}></div>
              <div className="skeleton-loader" style={{ height: '45px', width: '100%', marginBottom: '20px' }}></div>
              <div className="skeleton-loader" style={{ height: '45px', width: '100%', marginBottom: '25px' }}></div>
            </div>
          ) : (
            <>
              <h2 style={{ fontSize: '1.8rem', color: 'var(--auth-text-main, #ffffff)', marginBottom: '8px', fontWeight: '700' }}>Welcome Back</h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--auth-text-sub, #80aad3)', marginBottom: '25px' }}>Enter your credentials to access your account.</p>

              {errorMessage && (
                <div style={{ background: 'rgba(244, 63, 94, 0.15)', border: '1px solid rgba(244, 63, 94, 0.4)', color: '#f43f5e', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '20px' }}>
                  {errorMessage}
                </div>
              )}

              <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--auth-text-sub, #80aad3)', marginBottom: '6px' }}>Email Address</label>
                  <input 
                    type="email" 
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      background: 'var(--auth-input-bg, #0b192c)',
                      border: '1px solid var(--auth-border-color, rgba(56, 189, 248, 0.2))',
                      borderRadius: '8px',
                      color: 'var(--auth-text-main, #ffffff)',
                      fontSize: '0.9rem',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--auth-text-sub, #80aad3)', marginBottom: '6px' }}>Password</label>
                  <input 
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      background: 'var(--auth-input-bg, #0b192c)',
                      border: '1px solid var(--auth-border-color, rgba(56, 189, 248, 0.2))',
                      borderRadius: '8px',
                      color: 'var(--auth-text-main, #ffffff)',
                      fontSize: '0.9rem',
                      outline: 'none',
                    }}
                  />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                    <input 
                      type="checkbox" 
                      id="showPassLogin" 
                      checked={showPassword} 
                      onChange={(e) => setShowPassword(e.target.checked)}
                      style={{ cursor: 'pointer', accentColor: '#38bdf8' }}
                    />
                    <label htmlFor="showPassLogin" style={{ fontSize: '0.8rem', color: 'var(--auth-text-sub, #80aad3)', cursor: 'pointer', userSelect: 'none' }}>
                      Show password
                    </label>
                  </div>
                </div>

                <button type="submit" className="submit-btn" style={{ padding: '12px', marginTop: '5px' }}>
                  Sign In
                </button>
              </form>

              <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--auth-text-sub, #80aad3)', marginTop: '25px' }}>
                Don't have an account?{' '}
                <span onClick={onSwitchToSignup} style={{ color: '#38bdf8', cursor: 'pointer', fontWeight: '600' }}>
                  Register here
                </span>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}