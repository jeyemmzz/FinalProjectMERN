import React, { useState, useEffect } from 'react';

const userIconDark = new URL('../assets/user-3-line.png', import.meta.url).href;
const userIconLight = new URL('../assets/user-3-line (1).png', import.meta.url).href;
const lockIconDark = new URL('../assets/lock-line.png', import.meta.url).href;
const lockIconLight = new URL('../assets/lock-line (1).png', import.meta.url).href;
const moonIcon = new URL('../assets/moon-fill (2).png', import.meta.url).href;
const sunIcon = new URL('../assets/sun-fill (1).png', import.meta.url).href;

export default function Login({ onSwitchToSignup, onLoginSuccess, onNavigateHome, onNavigateEvents, onNavigateAbout }) {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // State para sa Navbar: true = nasa gitna (expanded), false = naka-collapse na bilog sa kaliwa
  const [isNavExpanded, setIsNavExpanded] = useState(true);

  const [customAlert, setCustomAlert] = useState({
    show: false,
    title: '',
    message: '',
    type: 'error',
    onConfirm: null
  });

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

  const showAlert = (title, message, type = 'error', onConfirmCallback = null) => {
    setCustomAlert({
      show: true,
      title,
      message,
      type,
      onConfirm: onConfirmCallback
    });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const inputEmail = formData.email.toLowerCase().trim();
    
    if (inputEmail === 'admin@syntax4.com') {
      if (formData.password === 'admin123') {
        showAlert("Success!", "Admin login successful!", "success", () => {
          if (onLoginSuccess) onLoginSuccess('admin');
        });
        return;
      } else {
        showAlert("Access Denied", "Invalid admin credentials! Incorrect password.", "error");
        return;
      }
    }

    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to log in.');

      const rawUser = data.user || data.existingUser || data.account || data;
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
        role: 'user'
      };

      localStorage.setItem('currentUser', JSON.stringify(loggedInUser));
      if (data.token) localStorage.setItem('token', data.token);

      showAlert("Welcome Back!", "Login successful. Redirecting...", "success", () => {
        if (onLoginSuccess) onLoginSuccess(loggedInUser);
      });

    } catch (error) {
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
        showAlert("Welcome Back!", "Login successful via local storage.", "success", () => {
          if (onLoginSuccess) onLoginSuccess(fallbackMatchedUser);
        });
      } else {
        showAlert("Login Failed", "Invalid email or password! Please check your credentials.", "error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '14px 45px 14px 45px',
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

  const currentUserIcon = isDarkMode ? userIconDark : userIconLight;
  const currentLockIcon = isDarkMode ? lockIconDark : lockIconLight;
  const currentThemeIcon = isDarkMode ? moonIcon : sunIcon; 

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
      paddingBottom: '60px',
      position: 'relative'
    }}>
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes modalPop {
          0% { opacity: 0; transform: scale(0.9) translateY(20px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
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
        .theme-toggle-btn {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .theme-toggle-btn:hover {
          transform: scale(1.05);
          border-color: rgba(56, 189, 248, 0.5) !important;
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

      {/* CUSTOM ALERT MODAL */}
      {customAlert.show && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
          padding: '20px',
          boxSizing: 'border-box'
        }}>
          <div style={{
            background: isDarkMode ? 'rgba(17, 24, 39, 0.95)' : 'rgba(255, 255, 255, 0.95)',
            border: isDarkMode ? '1px solid rgba(56, 189, 248, 0.3)' : '1px solid rgba(2, 132, 199, 0.2)',
            padding: '32px',
            borderRadius: '20px',
            maxWidth: '400px',
            width: '100%',
            textAlign: 'center',
            boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
            animation: 'modalPop 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            boxSizing: 'border-box'
          }}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              background: customAlert.type === 'success' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              color: customAlert.type === 'success' ? '#22c55e' : '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              fontWeight: '800',
              margin: '0 auto 16px auto'
            }}>
              {customAlert.type === 'success' ? '✓' : '!'}
            </div>

            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '700',
              color: isDarkMode ? '#ffffff' : '#0f172a',
              margin: '0 0 8px 0'
            }}>
              {customAlert.title}
            </h3>

            <p style={{
              fontSize: '0.95rem',
              color: '#94a3b8',
              margin: '0 0 24px 0',
              lineHeight: '1.5'
            }}>
              {customAlert.message}
            </p>

            <button
              type="button"
              className="interactive-btn"
              onClick={() => {
                const callback = customAlert.onConfirm;
                setCustomAlert({ show: false, title: '', message: '', type: 'error', onConfirm: null });
                if (callback) callback();
              }}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)',
                color: '#0f172a',
                border: 'none',
                padding: '12px',
                borderRadius: '10px',
                fontWeight: '700',
                fontSize: '0.95rem',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(56, 189, 248, 0.3)'
              }}
            >
              OK, Got it
            </button>
          </div>
        </div>
      )}

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
          className={`animated-wrapper ${animateIn ? 'active' : ''}`} 
          style={{
            position: 'absolute',
            // Kapag expanded, nakapuwesto sa gitna (left: 50% tapos i-translate ng -50%). 
            // Kapag naka-collapse, mag-i-slide papuntang kaliwa (left: 40px, translateX: 0).
            left: isNavExpanded ? '50%' : '40px',
            transform: isNavExpanded ? 'translateX(-50%)' : 'translateX(0)',
            width: isNavExpanded ? 'auto' : '48px',
            height: '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: isNavExpanded ? 'flex-start' : 'center',
            gap: isNavExpanded ? '20px' : '0px',
            padding: isNavExpanded ? '10px 24px' : '0px',
            background: isDarkMode ? 'rgba(17, 24, 39, 0.85)' : 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(16px)',
            borderRadius: isNavExpanded ? '9999px' : '50%',
            boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
            border: isDarkMode ? '1px solid rgba(56, 189, 248, 0.3)' : '1px solid rgba(0,0,0,0.1)',
            overflow: 'hidden',
            // Pinakamahalaga: Smooth physics-based transition para sa posisyon, laki, at kurbada
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

              {/* Theme Toggle Button */}
              <button
                type="button"
                onClick={toggleTheme}
                className="theme-toggle-btn"
                style={{
                  background: isDarkMode ? 'rgba(30, 41, 59, 0.9)' : 'rgba(241, 245, 249, 0.9)',
                  border: isDarkMode ? '1px solid rgba(56, 189, 248, 0.2)' : '1px solid rgba(2, 132, 199, 0.2)',
                  color: isDarkMode ? '#38bdf8' : '#0284c7',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  padding: '6px 14px',
                  borderRadius: '9999px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  whiteSpace: 'nowrap',
                  boxShadow: isDarkMode ? '0 2px 10px rgba(56, 189, 248, 0.15)' : '0 2px 10px rgba(2, 132, 199, 0.15)'
                }}
              >
                <img src={currentThemeIcon} alt="Theme Icon" style={{ width: '16px', height: '16px', objectFit: 'contain' }} />
                <span>{isDarkMode ? 'Dark' : 'Light'}</span>
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

              {/* Collapse Button (Magse-slide pabalik sa kaliwa habang nagiging bilog) */}
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
                  transition: 'color 0.2s'
                }}
                className="nav-link"
              >
                ✕
              </button>
            </>
          ) : (
            /* Laman kapag Naging Bilog na sa Kaliwa (Hamburger Icon ☰) */
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

      {/* Form Container */}
      <div className={`animated-wrapper ${animateIn ? 'active' : ''}`} style={{
        maxWidth: '520px',
        width: '92%',
        margin: '20px auto auto auto',
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
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={inputStyle}
                />
                <img 
                  src={currentUserIcon} 
                  alt="User Icon" 
                  style={{
                    position: 'absolute',
                    left: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '18px',
                    height: '18px',
                    objectFit: 'contain',
                    pointerEvents: 'none',
                    opacity: 0.85
                  }}
                />
              </div>
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
                <img 
                  src={currentLockIcon} 
                  alt="Lock Icon" 
                  style={{
                    position: 'absolute',
                    left: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '18px',
                    height: '18px',
                    objectFit: 'contain',
                    pointerEvents: 'none',
                    opacity: 0.85
                  }}
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