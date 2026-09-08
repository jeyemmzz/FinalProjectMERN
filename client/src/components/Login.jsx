import React, { useState, useEffect } from 'react';

const userIconDark = new URL('../assets/user-3-line.png', import.meta.url).href;
const userIconLight = new URL('../assets/user-3-line (1).png', import.meta.url).href;
const lockIconDark = new URL('../assets/lock-line.png', import.meta.url).href;
const lockIconLight = new URL('../assets/lock-line (1).png', import.meta.url).href;
const moonIcon = new URL('../assets/moon-fill (2).png', import.meta.url).href;
const sunIcon = new URL('../assets/sun-fill (1).png', import.meta.url).href;

// Clean modern SVG icons for toggling password visibility
const EyeIcon = ({ size = 18, color = '#94a3b8' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

const EyeOffIcon = ({ size = 18, color = '#94a3b8' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
    <line x1="1" y1="1" x2="23" y2="23"></line>
  </svg>
);

export default function Login({ onSwitchToSignup, onLoginSuccess, onNavigateHome, onNavigateEvents, onNavigateAbout }) {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // States para sa Password Update / Reset View
  const [isForgotPasswordMode, setIsForgotPasswordMode] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [isEmailTouched, setIsEmailTouched] = useState(false);

  const [newPasswordData, setNewPasswordData] = useState({
    email: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Password validation & strength helpers
  const getPasswordCriteria = (pass = '') => ({
    hasLength: pass.length >= 8,
    hasUpper: /[A-Z]/.test(pass),
    hasLower: /[a-z]/.test(pass),
    hasNumber: /[0-9]/.test(pass),
    hasSpecial: /[^A-Za-z0-9]/.test(pass)
  });

  const getPasswordStrength = (pass = '') => {
    if (!pass) return { score: 0, label: '', color: '#94a3b8', percent: 0 };
    const criteria = getPasswordCriteria(pass);
    const metCount = Object.values(criteria).filter(Boolean).length;
    if (metCount <= 2) return { score: 1, label: 'Weak', color: '#ef4444', percent: 25 };
    if (metCount === 3) return { score: 2, label: 'Fair', color: '#f59e0b', percent: 50 };
    if (metCount === 4) return { score: 3, label: 'Good', color: '#38bdf8', percent: 75 };
    return { score: 4, label: 'Strong', color: '#22c55e', percent: 100 };
  };

  const newPasswordCriteria = getPasswordCriteria(newPasswordData.newPassword);
  const newPasswordStrength = getPasswordStrength(newPasswordData.newPassword);
  const isPasswordMatchDirty = Boolean(newPasswordData.confirmPassword);
  const isPasswordMatching = Boolean(newPasswordData.newPassword && newPasswordData.newPassword === newPasswordData.confirmPassword);

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
        showAlert("Welcome Back!", "Login successful", "success", () => {
          if (onLoginSuccess) onLoginSuccess(fallbackMatchedUser);
        });
      } else {
        showAlert("Login Failed", "Invalid email or password! Please check your credentials.", "error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Function para i-handle ang pag-update ng password ng user
  const handleUpdatePasswordSubmit = async (e) => {
    e.preventDefault();
    const targetEmail = newPasswordData.email.toLowerCase().trim();

    // 1. Email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(targetEmail)) {
      showAlert("Invalid Email", "Please provide a valid email address.", "error");
      return;
    }

    // 2. Password requirements check
    const criteria = getPasswordCriteria(newPasswordData.newPassword);
    if (!criteria.hasLength) {
      showAlert("Weak Password", "Password must be at least 8 characters long.", "error");
      return;
    }
    if (!criteria.hasUpper || !criteria.hasLower || !criteria.hasNumber) {
      showAlert("Weak Password", "Password must include uppercase, lowercase, and at least one number.", "error");
      return;
    }

    // 3. Confirm password match check
    if (newPasswordData.newPassword !== newPasswordData.confirmPassword) {
      showAlert("Password Mismatch", "New password and confirmation password do not match.", "error");
      return;
    }

    try {
      setIsLoading(true);

      // Attempt backend update if server is running
      let backendUpdated = false;
      try {
        const response = await fetch('http://localhost:5000/api/auth/update-password', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: targetEmail, newPassword: newPasswordData.newPassword })
        });
        if (response.ok) {
          backendUpdated = true;
        }
      } catch (err) {
        // Backend offline or unreachable, fallback to localStorage
      }

      // LocalStorage update
      let allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
      const userIndex = allUsers.findIndex(u => u.email && u.email.toLowerCase().trim() === targetEmail);

      if (userIndex !== -1 || backendUpdated) {
        if (userIndex !== -1) {
          allUsers[userIndex].password = newPasswordData.newPassword;
          localStorage.setItem('allUsers', JSON.stringify(allUsers));
        }

        // Also update currentUser if it's currently stored with same email
        const currentSavedUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
        if (currentSavedUser && currentSavedUser.email && currentSavedUser.email.toLowerCase().trim() === targetEmail) {
          currentSavedUser.password = newPasswordData.newPassword;
          localStorage.setItem('currentUser', JSON.stringify(currentSavedUser));
        }

        showAlert("Success!", "Password updated successfully! You can now log in with your new password.", "success", () => {
          setIsForgotPasswordMode(false);
          setShowNewPassword(false);
          setShowConfirmNewPassword(false);
          setEmailError('');
          setFormData({ email: targetEmail, password: '' });
          setNewPasswordData({ email: '', newPassword: '', confirmPassword: '' });
        });
      } else {
        showAlert("Account Not Found", "No registered account matches this email address. Please make sure the email is registered.", "error");
      }

    } catch (error) {
      showAlert("Update Failed", error.message || "An error occurred while updating your password.", "error");
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

      {/* NAVIGATION BAR */}
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
            transition: 'left 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), width 0.6s cubic-bezier(0.16, 1, 0.3, 1), border-radius 0.6s cubic-bezier(0.16, 1, 0.3, 1), padding 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
            cursor: !isNavExpanded ? 'pointer' : 'default',
            zIndex: 10
          }}
          onClick={() => {
            if (!isNavExpanded) setIsNavExpanded(true);
          }}
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

              {/* Theme Toggle Switch */}
              <div
                onClick={toggleTheme}
                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '7px',
                  cursor: 'pointer',
                  userSelect: 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                <div
                  style={{
                    position: 'relative',
                    width: '48px',
                    height: '26px',
                    borderRadius: '999px',
                    background: isDarkMode ? 'rgba(56, 189, 248, 0.18)' : 'rgba(251, 191, 36, 0.22)',
                    border: isDarkMode ? '1px solid rgba(56, 189, 248, 0.35)' : '1px solid rgba(251, 191, 36, 0.45)',
                    transition: 'background 0.3s, border-color 0.3s',
                    boxSizing: 'border-box',
                    flexShrink: 0,
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: isDarkMode ? 'calc(100% - 22px)' : '3px',
                      transform: 'translateY(-50%)',
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      background: isDarkMode ? 'rgba(56, 189, 248, 0.85)' : 'rgba(251, 191, 36, 0.9)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: isDarkMode ? '0 0 6px rgba(56,189,248,0.5)' : '0 0 6px rgba(251,191,36,0.5)',
                      transition: 'left 0.3s cubic-bezier(.4,0,.2,1), background 0.3s, box-shadow 0.3s',
                    }}
                  >
                    <img src={currentThemeIcon} alt="Theme Icon" style={{ width: '11px', height: '11px', objectFit: 'contain' }} />
                  </div>
                </div>
                <span style={{ fontSize: '0.82rem', color: isDarkMode ? '#94a3b8' : '#64748b', letterSpacing: '0.02em' }}>
                  {isDarkMode ? 'Dark' : 'Light'}
                </span>
              </div>

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

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsNavExpanded(false);
                }}
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

          {!isForgotPasswordMode ? (
            /* ================= LOGIN FORM ================= */
            <>
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
                      title={showPassword ? 'Hide password' : 'Show password'}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'transparent',
                        border: 'none',
                        color: showPassword ? '#38bdf8' : '#94a3b8',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '6px',
                        borderRadius: '6px',
                        transition: 'color 0.2s'
                      }}
                    >
                      {showPassword ? <EyeOffIcon size={18} color="#38bdf8" /> : <EyeIcon size={18} color="#94a3b8" />}
                    </button>
                  </div>
                  <div style={{ textAlign: 'right', marginTop: '6px' }}>
                    <span
                      onClick={() => setIsForgotPasswordMode(true)}
                      style={{ fontSize: '0.8rem', color: '#38bdf8', cursor: 'pointer', fontWeight: '600' }}
                    >
                      Forgot / Update Password?
                    </span>
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
            </>
          ) : (
            /* ================= UPDATE / RESET PASSWORD FORM ================= */
            <>
              <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: '800', color: isDarkMode ? '#ffffff' : '#0f172a', margin: '0 0 8px 0' }}>Update Password</h1>
                <p style={{ fontSize: '0.95rem', color: '#94a3b8', margin: 0 }}>Enter your email and set a new password</p>
              </div>

              <form onSubmit={handleUpdatePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Email Address Field */}
                <div>
                  <label style={labelStyle}>Email Address *</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={newPasswordData.email}
                      onBlur={() => {
                        setIsEmailTouched(true);
                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        if (newPasswordData.email && !emailRegex.test(newPasswordData.email.trim())) {
                          setEmailError('Please enter a valid email address (e.g. name@example.com)');
                        } else {
                          setEmailError('');
                        }
                      }}
                      onChange={(e) => {
                        const val = e.target.value;
                        setNewPasswordData({ ...newPasswordData, email: val });
                        if (isEmailTouched) {
                          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                          if (val && !emailRegex.test(val.trim())) {
                            setEmailError('Please enter a valid email address.');
                          } else {
                            setEmailError('');
                          }
                        }
                      }}
                      style={{
                        ...inputStyle,
                        borderColor: emailError
                          ? '#ef4444'
                          : (newPasswordData.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newPasswordData.email.trim())
                            ? 'rgba(34, 197, 94, 0.6)'
                            : inputStyle.border)
                      }}
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
                  {emailError && (
                    <div style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '5px', fontWeight: '600' }}>
                      {emailError}
                    </div>
                  )}
                </div>

                {/* New Password Field */}
                <div>
                  <label style={labelStyle}>New Password *</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showNewPassword ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      value={newPasswordData.newPassword}
                      onChange={(e) => setNewPasswordData({ ...newPasswordData, newPassword: e.target.value })}
                      style={{
                        ...inputStyle,
                        paddingRight: '48px',
                        borderColor: newPasswordData.newPassword
                          ? (newPasswordStrength.score >= 3 ? 'rgba(34, 197, 94, 0.6)' : 'rgba(56, 189, 248, 0.5)')
                          : inputStyle.border
                      }}
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
                    {/* Show / Hide Toggle Button */}
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      title={showNewPassword ? "Hide password" : "Show password"}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'transparent',
                        border: 'none',
                        color: showNewPassword ? '#38bdf8' : '#94a3b8',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '6px',
                        borderRadius: '6px',
                        transition: 'color 0.2s'
                      }}
                    >
                      {showNewPassword ? <EyeOffIcon size={18} color="#38bdf8" /> : <EyeIcon size={18} color="#94a3b8" />}
                    </button>
                  </div>

                  {/* Dynamic Password Strength Meter & Requirements */}
                  {newPasswordData.newPassword && (
                    <div style={{ marginTop: '10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px', fontSize: '0.78rem' }}>
                        <span style={{ color: '#94a3b8' }}>Password Strength</span>
                        <span style={{ color: newPasswordStrength.color, fontWeight: '700' }}>
                          {newPasswordStrength.label}
                        </span>
                      </div>

                      <div style={{
                        height: '5px',
                        width: '100%',
                        background: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)',
                        borderRadius: '999px',
                        overflow: 'hidden',
                        marginBottom: '8px'
                      }}>
                        <div style={{
                          height: '100%',
                          width: `${newPasswordStrength.percent}%`,
                          background: newPasswordStrength.color,
                          borderRadius: '999px',
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                        }} />
                      </div>

                      {/* Criteria Checklist Badges */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {[
                          { label: '8+ chars', met: newPasswordCriteria.hasLength },
                          { label: 'Uppercase', met: newPasswordCriteria.hasUpper },
                          { label: 'Lowercase', met: newPasswordCriteria.hasLower },
                          { label: 'Number', met: newPasswordCriteria.hasNumber },
                          { label: 'Special char', met: newPasswordCriteria.hasSpecial }
                        ].map((item, idx) => (
                          <span
                            key={idx}
                            style={{
                              fontSize: '0.72rem',
                              fontWeight: '600',
                              padding: '2px 8px',
                              borderRadius: '999px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              background: item.met
                                ? (isDarkMode ? 'rgba(34, 197, 94, 0.15)' : 'rgba(34, 197, 94, 0.12)')
                                : (isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)'),
                              color: item.met ? '#22c55e' : (isDarkMode ? '#64748b' : '#94a3b8'),
                              border: item.met
                                ? '1px solid rgba(34, 197, 94, 0.35)'
                                : (isDarkMode ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.06)'),
                              transition: 'all 0.25s ease'
                            }}
                          >
                            <span>{item.met ? '✓' : '○'}</span>
                            {item.label}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm New Password Field */}
                <div>
                  <label style={labelStyle}>Confirm New Password *</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showConfirmNewPassword ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      value={newPasswordData.confirmPassword}
                      onChange={(e) => setNewPasswordData({ ...newPasswordData, confirmPassword: e.target.value })}
                      style={{
                        ...inputStyle,
                        paddingRight: '48px',
                        borderColor: isPasswordMatchDirty
                          ? (isPasswordMatching ? 'rgba(34, 197, 94, 0.6)' : 'rgba(239, 68, 68, 0.6)')
                          : inputStyle.border,
                        boxShadow: isPasswordMatchDirty
                          ? (isPasswordMatching ? '0 0 10px rgba(34, 197, 94, 0.15)' : '0 0 10px rgba(239, 68, 68, 0.15)')
                          : 'none'
                      }}
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
                    {/* Show / Hide Toggle Button */}
                    <button
                      type="button"
                      onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                      title={showConfirmNewPassword ? "Hide password" : "Show password"}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'transparent',
                        border: 'none',
                        color: showConfirmNewPassword ? '#38bdf8' : '#94a3b8',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '6px',
                        borderRadius: '6px',
                        transition: 'color 0.2s'
                      }}
                    >
                      {showConfirmNewPassword ? <EyeOffIcon size={18} color="#38bdf8" /> : <EyeIcon size={18} color="#94a3b8" />}
                    </button>
                  </div>

                  {/* Live Password Match Feedback */}
                  {isPasswordMatchDirty && (
                    <div style={{
                      color: isPasswordMatching ? '#22c55e' : '#ef4444',
                      fontSize: '0.8rem',
                      marginTop: '6px',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}>
                      {isPasswordMatching ? (
                        <>
                          <span style={{ fontSize: '0.9rem' }}>✓</span>
                          Passwords match
                        </>
                      ) : (
                        <>
                          <span style={{ fontSize: '0.9rem' }}>✕</span>
                          Passwords do not match
                        </>
                      )}
                    </div>
                  )}
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
                      Updating Password...
                    </>
                  ) : (
                    'Save New Password'
                  )}
                </button>

                <div style={{ textAlign: 'center', marginTop: '12px' }}>
                  <span
                    onClick={() => {
                      setIsForgotPasswordMode(false);
                      setShowNewPassword(false);
                      setShowConfirmNewPassword(false);
                      setEmailError('');
                    }}
                    className="nav-link"
                    style={{ fontSize: '0.9rem', color: '#38bdf8', cursor: 'pointer', fontWeight: '600' }}
                  >
                    Back to Log In
                  </span>
                </div>
              </form>
            </>
          )}

        </div>
      </div>
    </div>
  );
}