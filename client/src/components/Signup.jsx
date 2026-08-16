import React, { useState, useEffect } from 'react';
import '../styles/Auth.css';

export default function Signup({ 
  onBackToHome, 
  onSwitchToLogin, 
  onNavigateAbout, 
  onNavigateEvents, 
  onRegisterSuccess 
}) {
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Theme initialization and persistence (Katulad sa Home.jsx)
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setIsDarkMode(savedTheme === 'dark');
    document.body.setAttribute('data-theme', savedTheme);

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    if (!formData.email.includes('@') || !formData.email.includes('.')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (formData.password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    if (onRegisterSuccess) {
      onRegisterSuccess();
    }
  };

  return (
    <div className="auth-page-wrapper">
      <nav className="auth-navbar-centered">
        <div className="nav-pill-container" style={{ gap: '16px', padding: '10px 24px', flexWrap: 'wrap' }}>
          <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }} onClick={onBackToHome}>
            <span style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--auth-text-main, #ffffff)' }}>
              Syntax <span style={{ color: '#38bdf8' }}>4</span>
            </span>
          </div>

          <div style={{ width: '1px', height: '16px', background: 'rgba(255, 255, 255, 0.12)' }}></div>

          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <span onClick={onBackToHome} className="nav-item" style={{ cursor: 'pointer' }}>Home</span>
            <span onClick={onNavigateEvents} className="nav-item" style={{ cursor: 'pointer' }}>Events</span>
            <span onClick={onNavigateAbout} className="nav-item" style={{ cursor: 'pointer' }}>About</span>
          </div>

          <div style={{ width: '1px', height: '18px', background: 'var(--auth-border-color)' }}></div>

          {/* Theme Toggle Button gamit ang shared button style */}
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
            onClick={onSwitchToLogin}
            style={{ background: 'none', border: 'none', color: 'var(--auth-text-main)', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '600' }}
          >
            Login
          </button>

          <button 
            className="nav-pill-btn register" 
            onClick={() => {}}
            style={{ padding: '6px 16px', fontSize: '0.85rem', cursor: 'default' }}
          >
            Register
          </button>
        </div>
      </nav>

      <div className="auth-container" style={{ justifyContent: 'center', alignItems: 'center', padding: '40px 20px' }}>
        <div className="auth-card-pro" style={{ maxWidth: '420px', width: '100%', padding: '40px', boxSizing: 'border-box' }}>
          {isPageLoading ? (
            <div>
              <div className="skeleton-loader" style={{ height: '30px', width: '60%', marginBottom: '15px' }}></div>
              <div className="skeleton-loader" style={{ height: '16px', width: '80%', marginBottom: '30px' }}></div>
              <div className="skeleton-loader" style={{ height: '45px', width: '100%', marginBottom: '20px' }}></div>
              <div className="skeleton-loader" style={{ height: '45px', width: '100%', marginBottom: '20px' }}></div>
              <div className="skeleton-loader" style={{ height: '45px', width: '100%' }}></div>
            </div>
          ) : (
            <>
              <h2 style={{ fontSize: '1.8rem', color: 'var(--auth-text-main)', marginBottom: '8px', fontWeight: '700' }}>Create Account</h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--auth-text-muted)', marginBottom: '25px' }}>Join Syntax 4 to manage and register for campus events.</p>

              {errorMessage && (
                <div style={{ background: 'rgba(244, 63, 94, 0.15)', border: '1px solid rgba(244, 63, 94, 0.4)', color: '#f43f5e', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '20px' }}>
                  {errorMessage}
                </div>
              )}

              {successMessage && (
                <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.4)', color: '#10b981', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '20px' }}>
                  {successMessage}
                </div>
              )}

              <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--auth-text-sub)', marginBottom: '6px' }}>Full Name</label>
                  <input 
                    type="text" 
                    name="fullName"
                    placeholder="Juan Dela Cruz"
                    value={formData.fullName}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '11px 14px', background: 'var(--auth-input-bg)', border: '1px solid var(--auth-border-color)', borderRadius: '8px', color: 'var(--auth-text-main)', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--auth-text-sub)', marginBottom: '6px' }}>Email Address</label>
                  <input 
                    type="email" 
                    name="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '11px 14px', background: 'var(--auth-input-bg)', border: '1px solid var(--auth-border-color)', borderRadius: '8px', color: 'var(--auth-text-main)', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--auth-text-sub)', marginBottom: '6px' }}>Password</label>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '11px 14px', background: 'var(--auth-input-bg)', border: '1px solid var(--auth-border-color)', borderRadius: '8px', color: 'var(--auth-text-main)', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--auth-text-sub)', marginBottom: '6px' }}>Confirm Password</label>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    name="confirmPassword"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '11px 14px', background: 'var(--auth-input-bg)', border: '1px solid var(--auth-border-color)', borderRadius: '8px', color: 'var(--auth-text-main)', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                  />
                  
                  {/* Show Password Checkbox */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                    <input 
                      type="checkbox" 
                      id="showPassSignup" 
                      checked={showPassword} 
                      onChange={(e) => setShowPassword(e.target.checked)}
                      style={{ cursor: 'pointer', accentColor: '#38bdf8' }}
                    />
                    <label htmlFor="showPassSignup" style={{ fontSize: '0.8rem', color: 'var(--auth-text-muted)', cursor: 'pointer', userSelect: 'none' }}>
                      Show passwords
                    </label>
                  </div>
                </div>

                <button type="submit" className="submit-btn" style={{ padding: '12px', marginTop: '5px', cursor: 'pointer' }}>
                  Create Account
                </button>
              </form>

              <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--auth-text-muted)', marginTop: '20px' }}>
                Already have an account?{' '}
                <span onClick={onSwitchToLogin} style={{ color: '#38bdf8', cursor: 'pointer', fontWeight: '600' }}>
                  Sign in here
                </span>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}