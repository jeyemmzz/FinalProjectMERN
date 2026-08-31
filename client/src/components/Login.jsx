import React, { useState, useEffect } from 'react';

export default function Login({ onSwitchToSignup, onLoginSuccess, onNavigateHome, onNavigateEvents, onNavigateAbout }) {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  useEffect(() => {
    const timer = setTimeout(() => setAnimateIn(true), 10);
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setIsDarkMode(savedTheme === 'dark');
    document.body.setAttribute('data-theme', savedTheme);

    return () => clearTimeout(timer);
  }, []);

  const toggleTheme = () => {
    const nextMode = !isDarkMode;
    setIsDarkMode(nextMode);
    const themeName = nextMode ? 'dark' : 'light';
    document.body.setAttribute('data-theme', themeName);
    localStorage.setItem('theme', themeName);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    // ==========================================
    // 1. HARDCODED ADMIN CHECK
    // ==========================================
    const inputEmail = formData.email.toLowerCase().trim();
    
    if (inputEmail === 'admin@syntax4.com') {
      if (formData.password === 'admin123') {
        alert("Admin login successful!");
        // Pinapasa natin ang 'admin' para saluhin ng App.jsx at pumunta sa admin-dashboard
        if (onLoginSuccess) {
          onLoginSuccess('admin');
        }
        return; // Ititigil na ang function dito para hindi na mag-check sa database
      } else {
        alert("Invalid admin credentials! Incorrect password.");
        return; // Itigil ang login dahil mali ang admin password
      }
    }
    // ==========================================
    // END OF ADMIN CHECK
    // ==========================================

    // 2. REGULAR USER CHECK (API & LocalStorage Fallback)
    try {
      setIsLoading(true);

      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to log in. Please check your credentials.');
      }

      console.log('Successfully logged in response:', data);

      const rawUser = data.user || data.existingUser || data.account || data;

      // Hanapin ang tamang local user mula sa allUsers base sa email para makuha ang kumpletong profile details
      const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
      const matchedLocalUser = allUsers.find(u => u.email && u.email.toLowerCase().trim() === inputEmail) || {};

      const loggedInUser = {
        ...rawUser,
        ...matchedLocalUser,
        name: rawUser.fullName || rawUser.name || matchedLocalUser.fullName || matchedLocalUser.name,
        studentId: rawUser.studentId || rawUser.studentID || matchedLocalUser.studentId || matchedLocalUser.studentID,
        program: rawUser.program || rawUser.course || matchedLocalUser.program || matchedLocalUser.course,
        institution: rawUser.institution || rawUser.school || matchedLocalUser.institution || matchedLocalUser.school,
        email: formData.email,
        role: 'user' // I-set ang role as user
      };

      localStorage.setItem('currentUser', JSON.stringify(loggedInUser));
      if (data.token) {
        localStorage.setItem('token', data.token);
      }

      if (onLoginSuccess) {
        onLoginSuccess(loggedInUser);
      }

    } catch (error) {
      console.error('Login error (using local storage fallback):', error);

      const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
      const foundUser = allUsers.find(u => u.email && u.email.toLowerCase().trim() === inputEmail && u.password === formData.password);

      if (foundUser) {
        const fallbackMatchedUser = {
          ...foundUser,
          studentId: foundUser.studentId || foundUser.studentID || '2026-102938',
          program: foundUser.program || foundUser.course || 'BS Information Technology',
          institution: foundUser.institution || foundUser.school || 'National University MOA',
          role: 'user'
        };
        localStorage.setItem('currentUser', JSON.stringify(fallbackMatchedUser));
        if (onLoginSuccess) {
          onLoginSuccess(fallbackMatchedUser);
        }
      } else {
        // Kung pati sa localstorage ay hindi nag-match ang email at password
        alert("Invalid email or password!");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '14px 45px 14px 18px',
    borderRadius: '12px',
    border: '1px solid rgba(56, 189, 248, 0.3)',
    background: isDarkMode ? 'rgba(11, 19, 41, 0.6)' : 'rgba(248, 250, 252, 0.8)',
    color: isDarkMode ? '#ffffff' : '#0f172a',
    boxSizing: 'border-box',
    outline: 'none',
    fontSize: '0.95rem',
    transition: 'all 0.3s ease'
  };

  const labelStyle = {
    display: 'block',
    fontSize: '0.85rem',
    fontWeight: '600',
    color: isDarkMode ? '#94a3b8' : '#64748b',
    marginBottom: '6px'
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
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animated-wrapper {
          opacity: 0;
          transform: translateY(30px) scale(0.97);
          transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
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
        .loading-spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(15, 23, 42, 0.3);
          border-top: 2px solid #0f172a;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          display: inline-block;
        }
      `}</style>

      {/* Pill Navbar */}
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
          <span 
            onClick={onNavigateHome}
            className="nav-link"
            style={{ fontSize: '1rem', fontWeight: '800', color: isDarkMode ? '#ffffff' : '#0f172a', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', whiteSpace: 'nowrap' }}
          >
            Syntax <span style={{ color: '#38bdf8' }}>4</span>
          </span>

          <span style={{ color: isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)' }}>|</span>

          <div style={{ display: 'flex', gap: '18px', alignItems: 'center' }}>
            {[
              { name: 'Home', action: onNavigateHome },
              { name: 'Events', action: onNavigateEvents },
              { name: 'About', action: onNavigateAbout }
            ].map((link) => (
              <span 
                key={link.name}
                onClick={link.action}
                className="nav-link"
                style={{ color: '#94a3b8', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem', whiteSpace: 'nowrap' }}
              >
                {link.name}
              </span>
            ))}
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
              gap: '4px',
              whiteSpace: 'nowrap'
            }}
          >
            {isDarkMode ? '🌙 Dark' : '☀️ Light'}
          </button>

          <button
            type="button"
            onClick={(e) => e.preventDefault()}
            className="interactive-btn"
            style={{
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              color: '#ffffff',
              border: 'none',
              padding: '8px 18px',
              borderRadius: '9999px',
              cursor: 'pointer',
              fontWeight: '700',
              fontSize: '0.9rem',
              boxShadow: '0 4px 15px rgba(29, 78, 216, 0.4)',
              whiteSpace: 'nowrap'
            }}
          >
            Login
          </button>

          <button
            type="button"
            onClick={onSwitchToSignup}
            className="interactive-btn"
            style={{
              background: isDarkMode ? 'rgba(31, 41, 55, 0.8)' : '#e2e8f0',
              color: isDarkMode ? '#ffffff' : '#0f172a',
              border: 'none',
              padding: '8px 20px',
              borderRadius: '9999px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.9rem',
              whiteSpace: 'nowrap'
            }}
          >
            Register
          </button>
        </div>
      </nav>

      {/* Form Container */}
      <div className={`animated-wrapper ${animateIn ? 'active' : ''}`} style={{
        maxWidth: '520px',
        width: '92%',
        margin: '60px auto auto auto',
        flex: 1,
        boxSizing: 'border-box',
        transitionDelay: '0.1s'
      }}>
        <div style={{
          background: isDarkMode ? 'rgba(17, 24, 39, 0.75)' : 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(24px)',
          padding: '50px 40px',
          borderRadius: '24px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)',
          border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.05)',
          boxSizing: 'border-box',
          width: '100%'
        }}>
          
          <div style={{ textAlign: 'center', marginBottom: '35px' }}>
            <h1 style={{ fontSize: '2.2rem', fontWeight: '800', color: isDarkMode ? '#ffffff' : '#0f172a', margin: '0 0 8px 0' }}>Welcome User</h1>
            <p style={{ fontSize: '0.95rem', color: '#94a3b8', margin: 0 }}>Log in to access your account credentials</p>
          </div>

          <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
            
            <div>
              <label style={labelStyle}>Email Address *</label>
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Password *</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  style={inputStyle}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    padding: '4px 8px'
                  }}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="interactive-btn"
              style={{
                background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)',
                color: '#0f172a',
                border: 'none',
                padding: '16px',
                borderRadius: '12px',
                cursor: 'pointer',
                fontWeight: '700',
                fontSize: '1rem',
                marginTop: '10px',
                boxShadow: '0 6px 20px rgba(56, 189, 248, 0.4)',
                opacity: isLoading ? 0.8 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px'
              }}
            >
              {isLoading ? (
                <>
                  <span className="loading-spinner"></span>
                  Verifying Account...
                </>
              ) : (
                'Log In'
              )}
            </button>

            <div style={{ textAlign: 'center', marginTop: '12px' }}>
              <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
                Don't have an account yet?{' '}
                <span 
                  onClick={onSwitchToSignup} 
                  className="nav-link"
                  style={{ color: '#38bdf8', cursor: 'pointer', fontWeight: '600' }}
                >
                  Register here
                </span>
              </span>
            </div>

          </form>

        </div>
      </div>
    </div>
  );
}