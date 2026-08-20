import React, { useState, useEffect } from 'react';

export default function Signup({ onSwitchToLogin, onSignupSuccess, onNavigateHome, onNavigateEvents, onNavigateAbout }) {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState('student');
  
  // State para sa mount animation trigger
  const [animateIn, setAnimateIn] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    studentId: '',
    program: '',
    institution: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    // I-trigger ang animation pagka-load/mount ng component
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

  const handleSignupSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      console.warn('Passwords do not match!');
      return;
    }

    try {
      setIsLoading(true);

      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: userType === 'student' ? 'student' : 'user',
        studentId: userType === 'student' ? formData.studentId : 'N/A',
        program: userType === 'student' ? formData.program : 'N/A',
        institution: userType === 'student' ? formData.institution : 'General Public'
      };

      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to register account.');
      }

      console.log('Account successfully created:', data);
      
      if (onSignupSuccess) {
        onSignupSuccess(data.user);
      } else if (onSwitchToLogin) {
        onSwitchToLogin();
      }

    } catch (error) {
      console.error('Signup error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '14px 18px',
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
      
      {/* Inline Styles para sa Entry Animations & Loading Spinner */}
      <style>{`
        @keyframes fadeInSlide {
          0% {
            opacity: 0;
            transform: translateY(30px) scale(0.97);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
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

      {/* Pill Navbar with Glassmorphism */}
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
          {/* Logo */}
          <span 
            onClick={onNavigateHome}
            className="nav-link"
            style={{ fontSize: '1rem', fontWeight: '800', color: isDarkMode ? '#ffffff' : '#0f172a', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', whiteSpace: 'nowrap' }}
          >
            Syntax <span style={{ color: '#38bdf8' }}>4</span>
          </span>

          <span style={{ color: isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)' }}>|</span>

          {/* Links */}
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

          {/* Theme Toggle Button */}
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

          {/* Login Button Pill */}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="interactive-btn"
            style={{
              background: isDarkMode ? 'rgba(31, 41, 55, 0.8)' : '#e2e8f0',
              color: isDarkMode ? '#ffffff' : '#0f172a',
              border: 'none',
              padding: '8px 18px',
              borderRadius: '9999px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.9rem',
              whiteSpace: 'nowrap'
            }}
          >
            Login
          </button>

          {/* Register Button Pill */}
          <button
            type="button"
            onClick={(e) => e.preventDefault()}
            className="interactive-btn"
            style={{
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              color: '#ffffff',
              border: 'none',
              padding: '8px 20px',
              borderRadius: '9999px',
              cursor: 'pointer',
              fontWeight: '700',
              fontSize: '0.9rem',
              boxShadow: '0 4px 15px rgba(29, 78, 216, 0.4)',
              whiteSpace: 'nowrap'
            }}
          >
            Register
          </button>
        </div>
      </nav>

      {/* Animated Glassmorphism Form Container */}
      <div className={`animated-wrapper ${animateIn ? 'active' : ''}`} style={{
        maxWidth: '920px',
        width: '92%',
        margin: '30px auto 50px auto',
        flex: 1,
        boxSizing: 'border-box',
        transitionDelay: '0.1s'
      }}>
        <div style={{
          background: isDarkMode ? 'rgba(17, 24, 39, 0.75)' : 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(24px)',
          padding: '50px 60px',
          borderRadius: '24px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)',
          border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.05)',
          boxSizing: 'border-box',
          width: '100%'
        }}>
          
          <div style={{ textAlign: 'center', marginBottom: '35px' }}>
            <h1 style={{ fontSize: '2.2rem', fontWeight: '800', color: isDarkMode ? '#ffffff' : '#0f172a', margin: '0 0 8px 0' }}>Create Account</h1>
            <p style={{ fontSize: '0.95rem', color: '#94a3b8', margin: 0 }}>Register your profile credentials directly to the database</p>
          </div>

          <form onSubmit={handleSignupSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
            
            {/* User Type Selection */}
            <div>
              <label style={labelStyle}>Are you registering as a Student? *</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <button
                  type="button"
                  onClick={() => setUserType('student')}
                  style={{
                    padding: '14px',
                    borderRadius: '12px',
                    fontWeight: '600',
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    border: userType === 'student' ? '1px solid #38bdf8' : '1px solid rgba(56, 189, 248, 0.2)',
                    background: userType === 'student' ? 'rgba(56, 189, 248, 0.15)' : (isDarkMode ? 'rgba(11, 19, 41, 0.4)' : '#f8fafc'),
                    color: userType === 'student' ? '#38bdf8' : '#94a3b8',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Yes, I am a Student
                </button>
                <button
                  type="button"
                  onClick={() => setUserType('other')}
                  style={{
                    padding: '14px',
                    borderRadius: '12px',
                    fontWeight: '600',
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    border: userType === 'other' ? '1px solid #38bdf8' : '1px solid rgba(56, 189, 248, 0.2)',
                    background: userType === 'other' ? 'rgba(56, 189, 248, 0.15)' : (isDarkMode ? 'rgba(11, 19, 41, 0.4)' : '#f8fafc'),
                    color: userType === 'other' ? '#38bdf8' : '#94a3b8',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Not a student
                </button>
              </div>
            </div>

            {/* Row 1: Full Name & Email */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={labelStyle}>Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Enter your Full Name" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={inputStyle}
                />
              </div>
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
            </div>

            {/* CONDITIONAL STUDENT FIELDS */}
            {userType === 'student' && (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                background: 'rgba(56, 189, 248, 0.04)',
                padding: '24px',
                borderRadius: '16px',
                border: '1px solid rgba(56, 189, 248, 0.15)'
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={labelStyle}>Student ID *</label>
                    <input
                      type="text"
                      required={userType === 'student'}
                      placeholder="Enter your Student ID"
                      value={formData.studentId}
                      onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Program / Course *</label>
                    <input
                      type="text"
                      required={userType === 'student'}
                      placeholder="Enter your Program / Course"
                      value={formData.program}
                      onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                      style={inputStyle}
                    />
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Institution / School *</label>
                  <input
                    type="text"
                    required={userType === 'student'}
                    placeholder="Enter your University / School"
                    value={formData.institution}
                    onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                    style={inputStyle}
                  />
                </div>
              </div>
            )}

            {/* Row 2: Passwords */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={labelStyle}>Password *</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Confirm Password *</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  style={inputStyle}
                />
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
                  Registering to Database...
                </>
              ) : (
                'Register Account'
              )}
            </button>

            <div style={{ textAlign: 'center', marginTop: '12px' }}>
              <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
                Already have an account?{' '}
                <span 
                  onClick={onSwitchToLogin} 
                  className="nav-link"
                  style={{ color: '#38bdf8', cursor: 'pointer', fontWeight: '600' }}
                >
                  Log in here
                </span>
              </span>
            </div>

          </form>

        </div>
      </div>
    </div>
  );
}