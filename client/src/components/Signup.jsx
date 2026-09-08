import React, { useState, useEffect } from 'react';
const building1 = new URL('../assets/building1.jpg', import.meta.url).href;

// Asset mapping batay sa mga eksaktong filenames mo
const fileUserDark = new URL('../assets/file-user-fill.png', import.meta.url).href;
const fileUserLight = new URL('../assets/file-user-fill (1).png', import.meta.url).href;
const userIconDark = new URL('../assets/user-3-line.png', import.meta.url).href;
const userIconLight = new URL('../assets/user-3-line (1).png', import.meta.url).href;
const lockIconDark = new URL('../assets/lock-line.png', import.meta.url).href;
const lockIconLight = new URL('../assets/lock-line (1).png', import.meta.url).href;
const moonIcon = new URL('../assets/moon-fill (2).png', import.meta.url).href;
const sunIcon = new URL('../assets/sun-fill (1).png', import.meta.url).href;
const gradCapDark = new URL('../assets/graduation-cap-line (1).png', import.meta.url).href;
const gradCapLight = new URL('../assets/graduation-cap-line (2).png', import.meta.url).href;
const userFillDark = new URL('../assets/user-fill.png', import.meta.url).href;
const userFillLight = new URL('../assets/user-fill (1).png', import.meta.url).href;

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

export default function Signup({ onSwitchToLogin, onSignupSuccess, onNavigateHome, onNavigateEvents, onNavigateAbout, signupType }) {
  const [isStudent, setIsStudent] = useState(signupType === 'student');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [animateIn, setAnimateIn] = useState(false);

  // State para sa Navbar: true = nasa gitna (expanded), false = naka-collapse na bilog sa kaliwa na may ☰
  const [isNavExpanded, setIsNavExpanded] = useState(true);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    studentNumber: '',
    password: '',
    confirmPassword: ''
  });

  const [studentIdError, setStudentIdError] = useState('');
  const [formError, setFormError] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [termsError, setTermsError] = useState('');

  // Custom in-app notification alert state
  const [customAlert, setCustomAlert] = useState({
    show: false,
    title: '',
    message: '',
    type: 'error', // 'error' | 'success' | 'warning'
    onConfirm: null
  });

  const showAlert = (title, message, type = 'error', onConfirmCallback = null) => {
    setCustomAlert({
      show: true,
      title,
      message,
      type,
      onConfirm: onConfirmCallback
    });
  };

  // Password criteria & strength helpers
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

  const passwordCriteria = getPasswordCriteria(formData.password);
  const passwordStrength = getPasswordStrength(formData.password);
  const isPasswordMatchDirty = Boolean(formData.confirmPassword);
  const isPasswordMatching = Boolean(formData.password && formData.password === formData.confirmPassword);

  useEffect(() => {
    if (signupType) {
      setIsStudent(signupType === 'student');
    }
  }, [signupType]);

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

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setTermsError('');

    // Terms and Conditions agreement check
    if (!agreeToTerms) {
      setTermsError('You must agree to the Terms and Conditions and Privacy Policy to register.');
      showAlert("Terms & Conditions Required", "Please accept the Terms and Conditions and Privacy Policy before proceeding.", "warning");
      return;
    }

    // Student ID Validation
    if (isStudent) {
      const studentIdPattern = /^\d{4}-\d{4,6}$/;
      const enteredStudentId = (formData.studentNumber || '').trim();
      if (!enteredStudentId || !studentIdPattern.test(enteredStudentId)) {
        const errMsg = 'Incorrect student ID. Must follow exact format: YYYY-XXXXX (e.g. 2024-10234)';
        setStudentIdError(errMsg);
        showAlert("Invalid Student ID", errMsg, "error");
        return;
      }
      setStudentIdError('');
    }

    if (formData.password.length < 8) {
      setFormError('Password must be at least 8 characters long.');
      showAlert("Weak Password", "Password must be at least 8 characters long.", "error");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setFormError('Passwords do not match!');
      showAlert("Password Mismatch", "Passwords do not match. Please verify your confirmation password.", "error");
      return;
    }

    try {
      setIsLoading(true);

      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: 'user',
        studentId: isStudent ? formData.studentNumber : 'N/A',
        userType: isStudent ? 'student' : 'non-student',
        program: 'N/A',
        institution: isStudent ? 'University' : 'General Public'
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
      
      const registeredUser = {
        ...data,
        fullName: formData.name,
        name: formData.name,
        studentId: isStudent ? formData.studentNumber : (data.studentId || 'N/A'),
        userType: isStudent ? 'student' : 'non-student',
        program: 'N/A',
        institution: isStudent ? 'University' : 'General Public',
        email: formData.email,
        role: 'user'
      };

      localStorage.setItem('currentUser', JSON.stringify(registeredUser));

      const existingUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
      const filteredUsers = existingUsers.filter(u => u.email && u.email.toLowerCase() !== registeredUser.email.toLowerCase());
      localStorage.setItem('allUsers', JSON.stringify([...filteredUsers, registeredUser]));

      if (data.token) {
        localStorage.setItem('token', data.token);
      }

      showAlert("Welcome!", "Account registered successfully! Redirecting to your dashboard...", "success", () => {
        if (onSignupSuccess) {
          onSignupSuccess(registeredUser);
        } else if (onSwitchToLogin) {
          onSwitchToLogin();
        }
      });

    } catch (error) {
      console.error('Signup error (local fallback):', error);

      const registeredUser = {
        ...formData,
        fullName: formData.name,
        name: formData.name,
        studentId: isStudent ? formData.studentNumber : 'N/A',
        userType: isStudent ? 'student' : 'non-student',
        program: 'N/A',
        institution: isStudent ? 'University' : 'General Public',
        email: formData.email,
        role: 'user'
      };

      localStorage.setItem('currentUser', JSON.stringify(registeredUser));
      const existingUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
      const filteredUsers = existingUsers.filter(u => u.email && u.email.toLowerCase() !== registeredUser.email.toLowerCase());
      localStorage.setItem('allUsers', JSON.stringify([...filteredUsers, registeredUser]));

      showAlert("Welcome!", "Account registered successfully! Redirecting to your dashboard...", "success", () => {
        if (onSignupSuccess) {
          onSignupSuccess(registeredUser);
        } else if (onSwitchToLogin) {
          onSwitchToLogin();
        }
      });
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

  // Dinamikong icon mapping batay sa kasalukuyang theme
  const currentFileUserIcon = isDarkMode ? fileUserDark : fileUserLight;
  const currentUserIcon = isDarkMode ? userIconDark : userIconLight;
  const currentLockIcon = isDarkMode ? lockIconDark : lockIconLight;
  const currentThemeIcon = isDarkMode ? moonIcon : sunIcon;

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      backgroundImage: `url(${building1})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed',
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box',
      overflowX: 'hidden',
      paddingBottom: '60px',
      position: 'relative'
    }}>
      
      {/* Dark overlay for readability */}
      <div style={{
        position: 'fixed',
        inset: 0,
        background: isDarkMode
          ? 'linear-gradient(135deg, rgba(0,15,34,0.82) 0%, rgba(27,53,84,0.75) 50%, rgba(15,35,66,0.85) 100%)'
          : 'linear-gradient(135deg, rgba(15,35,66,0.70) 0%, rgba(37,70,112,0.65) 50%, rgba(0,15,34,0.75) 100%)',
        zIndex: 0,
        pointerEvents: 'none',
        transition: 'background 0.5s ease',
      }} />

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

      {/* CUSTOM NOTIFICATION ALERT MODAL */}
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
          zIndex: 10000,
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
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              background: customAlert.type === 'success'
                ? 'rgba(34, 197, 94, 0.15)'
                : customAlert.type === 'warning'
                ? 'rgba(245, 158, 11, 0.15)'
                : 'rgba(239, 68, 68, 0.15)',
              color: customAlert.type === 'success'
                ? '#22c55e'
                : customAlert.type === 'warning'
                ? '#f59e0b'
                : '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.6rem',
              fontWeight: '800',
              margin: '0 auto 16px auto'
            }}>
              {customAlert.type === 'success' ? '✓' : customAlert.type === 'warning' ? '!' : '✕'}
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

      {/* TERMS & CONDITIONS MODAL */}
      {showTermsModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
          padding: '20px',
          boxSizing: 'border-box'
        }}>
          <div style={{
            background: isDarkMode ? 'rgba(15, 23, 42, 0.98)' : 'rgba(255, 255, 255, 0.98)',
            border: isDarkMode ? '1px solid rgba(56, 189, 248, 0.3)' : '1px solid rgba(2, 132, 199, 0.2)',
            padding: '30px',
            borderRadius: '20px',
            maxWidth: '560px',
            width: '100%',
            maxHeight: '85vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            animation: 'modalPop 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            boxSizing: 'border-box',
            position: 'relative'
          }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: isDarkMode ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)', paddingBottom: '14px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '800', color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                  Terms & Conditions
                </h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: '#94a3b8' }}>
                  Syntax 4 Event Management Platform
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowTermsModal(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#94a3b8',
                  fontSize: '1.2rem',
                  cursor: 'pointer',
                  padding: '6px 10px',
                  borderRadius: '8px'
                }}
              >
                ✕
              </button>
            </div>

            {/* Scrollable Body */}
            <div style={{
              overflowY: 'auto',
              flex: 1,
              paddingRight: '8px',
              fontSize: '0.86rem',
              lineHeight: '1.6',
              color: isDarkMode ? '#cbd5e1' : '#475569'
            }}>
              <p style={{ marginTop: 0 }}>
                Welcome to <strong>Syntax 4</strong>. Please read these Terms and Conditions carefully before creating an account. By registering, you agree to abide by the policies detailed below.
              </p>

              <h4 style={{ color: isDarkMode ? '#38bdf8' : '#0284c7', margin: '14px 0 6px 0', fontSize: '0.92rem' }}>
                1. Account Registration & User Types
              </h4>
              <p style={{ margin: 0 }}>
                You must provide accurate and verifiable information during registration. If registering as a <strong>Student</strong>, your Student ID must match an active enrollment at a recognized educational institution. Non-students register as guests with general event access privileges.
              </p>

              <h4 style={{ color: isDarkMode ? '#38bdf8' : '#0284c7', margin: '14px 0 6px 0', fontSize: '0.92rem' }}>
                2. Privacy & Data Protection
              </h4>
              <p style={{ margin: 0 }}>
                We respect your personal privacy. Your data (name, email address, institutional affiliation) will be strictly used for authentication, certificate generation, and event notifications. We do not sell or transfer your credentials to third-party advertisers.
              </p>

              <h4 style={{ color: isDarkMode ? '#38bdf8' : '#0284c7', margin: '14px 0 6px 0', fontSize: '0.92rem' }}>
                3. Event Participation & Code of Conduct
              </h4>
              <p style={{ margin: 0 }}>
                Syntax 4 fosters an inclusive and collaborative tech community. Harassment, disruption of workshops or hackathons, offensive behavior, or unauthorized automated activity will lead to immediate account termination.
              </p>

              <h4 style={{ color: isDarkMode ? '#38bdf8' : '#0284c7', margin: '14px 0 6px 0', fontSize: '0.92rem' }}>
                4. Account Security
              </h4>
              <p style={{ margin: 0 }}>
                You are solely responsible for maintaining the confidentiality of your account credentials. Promptly report any unauthorized access to the Syntax 4 administration team.
              </p>
            </div>

            {/* Footer Buttons */}
            <div style={{
              display: 'flex',
              gap: '12px',
              marginTop: '20px',
              borderTop: isDarkMode ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
              paddingTop: '16px'
            }}>
              <button
                type="button"
                onClick={() => setShowTermsModal(false)}
                className="interactive-btn"
                style={{
                  flex: 1,
                  background: isDarkMode ? 'rgba(30, 41, 59, 0.8)' : '#e2e8f0',
                  color: isDarkMode ? '#ffffff' : '#0f172a',
                  border: 'none',
                  padding: '12px',
                  borderRadius: '10px',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  cursor: 'pointer'
                }}
              >
                Close
              </button>

              <button
                type="button"
                onClick={() => {
                  setAgreeToTerms(true);
                  setTermsError('');
                  setShowTermsModal(false);
                }}
                className="interactive-btn"
                style={{
                  flex: 1,
                  background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)',
                  color: '#0f172a',
                  border: 'none',
                  padding: '12px',
                  borderRadius: '10px',
                  fontWeight: '700',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(56, 189, 248, 0.35)'
                }}
              >
                I Agree & Accept
              </button>
            </div>
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
              <span 
                onClick={onNavigateHome}
                className="nav-link"
                style={{ fontSize: '1rem', fontWeight: '800', color: isDarkMode ? '#ffffff' : '#0f172a', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', whiteSpace: 'nowrap' }}
              >
                Syntax <span style={{ color: '#38bdf8' }}>4</span>
              </span>

              <div style={{ width: '1px', height: '16px', background: isDarkMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)', flexShrink: 0 }}></div>

              {/* Nav Links */}
              <div style={{ display: 'flex', gap: '15px', alignItems: 'center', whiteSpace: 'nowrap' }}>
                <span onClick={onNavigateHome} className="nav-link" style={{ cursor: 'pointer', color: '#94a3b8', fontWeight: '600', fontSize: '0.9rem' }}>
                  Home
                </span>
                <span onClick={onNavigateEvents} className="nav-link" style={{ cursor: 'pointer', color: '#94a3b8', fontWeight: '600', fontSize: '0.9rem' }}>
                  Events
                </span>
                <span onClick={onNavigateAbout} className="nav-link" style={{ cursor: 'pointer', color: '#94a3b8', fontWeight: '600', fontSize: '0.9rem' }}>
                  About
                </span>
              </div>

              <div style={{ width: '1px', height: '18px', background: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', flexShrink: 0 }}></div>

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
              </div>

              <button
                type="button"
                onClick={onSwitchToLogin}
                className="interactive-btn"
                style={{
                  background: isDarkMode ? 'rgba(31, 41, 55, 0.8)' : '#e2e8f0',
                  color: isDarkMode ? '#ffffff' : '#0f172a',
                  border: 'none',
                  padding: '6px 16px',
                  borderRadius: '9999px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '0.85rem',
                  whiteSpace: 'nowrap'
                }}
              >
                Login
              </button>

              <button
                type="button"
                onClick={(e) => e.preventDefault()}
                className="interactive-btn"
                style={{
                  background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                  color: '#ffffff',
                  border: 'none',
                  padding: '6px 16px',
                  borderRadius: '9999px',
                  cursor: 'pointer',
                  fontWeight: '700',
                  fontSize: '0.85rem',
                  boxShadow: '0 4px 15px rgba(29, 78, 216, 0.4)',
                  whiteSpace: 'nowrap'
                }}
              >
                Register
              </button>

              {/* Collapse Button (✕) */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsNavExpanded(false);
                }}
                title="Collapse menu"
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
                  whiteSpace: 'nowrap'
                }}
                className="nav-link"
              >
                ✕
              </button>
            </>
          ) : (
            /* Tatlong linya (☰ Hamburger Menu) kapag naka-collapse */
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

      {/* Main Form Box */}
      <div className={`animated-wrapper ${animateIn ? 'active' : ''}`} style={{
        maxWidth: '800px',
        width: '92%',
        margin: '30px auto 50px auto',
        flex: 1,
        boxSizing: 'border-box',
        transitionDelay: '0.1s'
      }}>
        <div style={{
          background: isDarkMode ? 'rgba(17, 24, 39, 0.75)' : 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(24px)',
          padding: '40px 50px',
          borderRadius: '24px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)',
          border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.05)',
          boxSizing: 'border-box',
          width: '100%'
        }}>
          
          {/* Title — dynamically adapts to student or general signup */}
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <h1 style={{ fontSize: '2.2rem', fontWeight: '800', color: isDarkMode ? '#ffffff' : '#0f172a', margin: '0 0 8px 0' }}>
              {isStudent ? 'Student Sign Up' : 'Create Account'}
            </h1>
            <p style={{ fontSize: '0.95rem', color: '#94a3b8', margin: 0 }}>
              {isStudent
                ? 'Register with your student credentials'
                : 'Register your personal or guest account credentials'}
            </p>
          </div>

          <form onSubmit={handleSignupSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Student or Non-Student Question / Toggle Selector */}
            <div style={{
              background: isDarkMode ? 'rgba(15, 23, 42, 0.65)' : 'rgba(241, 245, 249, 0.8)',
              padding: '16px 20px',
              borderRadius: '16px',
              border: isDarkMode ? '1px solid rgba(56, 189, 248, 0.25)' : '1px solid rgba(0, 0, 0, 0.08)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: '700', color: isDarkMode ? '#f8fafc' : '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>🎓</span> Are you currently a student? *
                </span>
                <span style={{ fontSize: '0.78rem', color: isDarkMode ? '#38bdf8' : '#0284c7', fontWeight: '600' }}>
                  {isStudent ? 'Student Registration' : 'Non-Student / Guest Registration'}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => {
                    setIsStudent(true);
                    setStudentIdError('');
                  }}
                  className="interactive-btn"
                  style={{
                    padding: '12px 18px',
                    borderRadius: '12px',
                    border: isStudent
                      ? '2px solid #38bdf8'
                      : (isDarkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)'),
                    background: isStudent
                      ? (isDarkMode ? 'rgba(56, 189, 248, 0.18)' : 'rgba(56, 189, 248, 0.15)')
                      : (isDarkMode ? 'rgba(30, 41, 59, 0.5)' : '#ffffff'),
                    color: isStudent ? (isDarkMode ? '#38bdf8' : '#0284c7') : (isDarkMode ? '#94a3b8' : '#64748b'),
                    fontWeight: isStudent ? '700' : '600',
                    fontSize: '0.92rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.25s ease',
                    boxShadow: isStudent ? '0 4px 15px rgba(56, 189, 248, 0.25)' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <img
                      src={isDarkMode ? gradCapDark : gradCapLight}
                      alt="Student"
                      style={{
                        width: '18px',
                        height: '18px',
                        objectFit: 'contain',
                        opacity: isStudent ? 1 : 0.75
                      }}
                    />
                    <span>Yes, I am a Student</span>
                  </div>
                  <span style={{
                    fontSize: '0.9rem',
                    fontWeight: '700',
                    width: '18px',
                    textAlign: 'right',
                    visibility: isStudent ? 'visible' : 'hidden',
                    opacity: isStudent ? 1 : 0,
                    transition: 'opacity 0.2s ease, visibility 0.2s ease'
                  }}>✓</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsStudent(false);
                    setStudentIdError('');
                    setFormData(prev => ({ ...prev, studentNumber: '' }));
                  }}
                  className="interactive-btn"
                  style={{
                    padding: '12px 18px',
                    borderRadius: '12px',
                    border: !isStudent
                      ? '2px solid #38bdf8'
                      : (isDarkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)'),
                    background: !isStudent
                      ? (isDarkMode ? 'rgba(56, 189, 248, 0.18)' : 'rgba(56, 189, 248, 0.15)')
                      : (isDarkMode ? 'rgba(30, 41, 59, 0.5)' : '#ffffff'),
                    color: !isStudent ? (isDarkMode ? '#38bdf8' : '#0284c7') : (isDarkMode ? '#94a3b8' : '#64748b'),
                    fontWeight: !isStudent ? '700' : '600',
                    fontSize: '0.92rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.25s ease',
                    boxShadow: !isStudent ? '0 4px 15px rgba(56, 189, 248, 0.25)' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <img
                      src={isDarkMode ? userFillDark : userFillLight}
                      alt="Non-Student"
                      style={{
                        width: '18px',
                        height: '18px',
                        objectFit: 'contain',
                        opacity: !isStudent ? 1 : 0.75
                      }}
                    />
                    <span>No, Not a Student</span>
                  </div>
                  <span style={{
                    fontSize: '0.9rem',
                    fontWeight: '700',
                    width: '18px',
                    textAlign: 'right',
                    visibility: !isStudent ? 'visible' : 'hidden',
                    opacity: !isStudent ? 1 : 0,
                    transition: 'opacity 0.2s ease, visibility 0.2s ease'
                  }}>✓</span>
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              
              {/* Full Name Field with File-User Icon */}
              <div>
                <label style={labelStyle}>Full Name *</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    required
                    placeholder="Enter your Full Name" 
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={inputStyle}
                  />
                  <img 
                    src={currentFileUserIcon} 
                    alt="Full Name Icon" 
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

              {/* Email Field with User Icon */}
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
                    alt="Email Icon" 
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

            </div>

            {/* Student Number Field — only shown for student signup */}
            {isStudent && (
              <div>
                <label style={labelStyle}>Student Number *</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2024-10234"
                    value={formData.studentNumber}
                    onChange={(e) => {
                      setFormData({ ...formData, studentNumber: e.target.value });
                      if (studentIdError) setStudentIdError('');
                    }}
                    style={{
                      ...inputStyle,
                      borderColor: studentIdError ? '#ef4444' : inputStyle.border
                    }}
                  />
                  <img
                    src={isDarkMode
                      ? new URL('../assets/graduation-cap-line (1).png', import.meta.url).href
                      : new URL('../assets/graduation-cap-line (2).png', import.meta.url).href}
                    alt="Student Number"
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
                {studentIdError && (
                  <div style={{ color: '#ef4444', fontSize: '0.82rem', marginTop: '6px', fontWeight: '600' }}>
                    {studentIdError}
                  </div>
                )}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              
              {/* Password Field with Lock Icon & Toggle */}
              <div>
                <label style={labelStyle}>Password *</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    style={{
                      ...inputStyle,
                      paddingRight: '48px',
                      borderColor: formData.password
                        ? (passwordStrength.score >= 3 ? 'rgba(34, 197, 94, 0.6)' : 'rgba(56, 189, 248, 0.4)')
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
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    title={showPassword ? "Hide password" : "Show password"}
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

                {/* Password Strength Meter & Badges */}
                {formData.password && (
                  <div style={{ marginTop: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px', fontSize: '0.76rem' }}>
                      <span style={{ color: '#94a3b8' }}>Strength</span>
                      <span style={{ color: passwordStrength.color, fontWeight: '700' }}>
                        {passwordStrength.label}
                      </span>
                    </div>

                    <div style={{
                      height: '4px',
                      width: '100%',
                      background: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)',
                      borderRadius: '999px',
                      overflow: 'hidden',
                      marginBottom: '6px'
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${passwordStrength.percent}%`,
                        background: passwordStrength.color,
                        borderRadius: '999px',
                        transition: 'all 0.3s ease'
                      }} />
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {[
                        { label: '8+ chars', met: passwordCriteria.hasLength },
                        { label: 'Upper', met: passwordCriteria.hasUpper },
                        { label: 'Lower', met: passwordCriteria.hasLower },
                        { label: 'Number', met: passwordCriteria.hasNumber },
                        { label: 'Symbol', met: passwordCriteria.hasSpecial }
                      ].map((item, idx) => (
                        <span
                          key={idx}
                          style={{
                            fontSize: '0.68rem',
                            fontWeight: '600',
                            padding: '1px 6px',
                            borderRadius: '999px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '3px',
                            background: item.met
                              ? (isDarkMode ? 'rgba(34, 197, 94, 0.15)' : 'rgba(34, 197, 94, 0.12)')
                              : (isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)'),
                            color: item.met ? '#22c55e' : (isDarkMode ? '#64748b' : '#94a3b8'),
                            border: item.met
                              ? '1px solid rgba(34, 197, 94, 0.35)'
                              : (isDarkMode ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.06)')
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

              {/* Confirm Password Field with Lock Icon & Toggle */}
              <div>
                <label style={labelStyle}>Confirm Password *</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    style={{
                      ...inputStyle,
                      paddingRight: '48px',
                      borderColor: isPasswordMatchDirty
                        ? (isPasswordMatching ? 'rgba(34, 197, 94, 0.6)' : 'rgba(239, 68, 68, 0.6)')
                        : inputStyle.border,
                      boxShadow: isPasswordMatchDirty
                        ? (isPasswordMatching ? '0 0 8px rgba(34, 197, 94, 0.15)' : '0 0 8px rgba(239, 68, 68, 0.15)')
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
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    title={showConfirmPassword ? "Hide password" : "Show password"}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'transparent',
                      border: 'none',
                      color: showConfirmPassword ? '#38bdf8' : '#94a3b8',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '6px',
                      borderRadius: '6px',
                      transition: 'color 0.2s'
                    }}
                  >
                    {showConfirmPassword ? <EyeOffIcon size={18} color="#38bdf8" /> : <EyeIcon size={18} color="#94a3b8" />}
                  </button>
                </div>

                {/* Match indicator */}
                {isPasswordMatchDirty && (
                  <div style={{
                    color: isPasswordMatching ? '#22c55e' : '#ef4444',
                    fontSize: '0.78rem',
                    marginTop: '6px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    {isPasswordMatching ? (
                      <>
                        <span>✓</span> Passwords match
                      </>
                    ) : (
                      <>
                        <span>✕</span> Passwords do not match
                      </>
                    )}
                  </div>
                )}
              </div>

            </div>

            {/* Terms and Conditions Agreement Checkbox */}
            <div style={{ marginTop: '6px' }}>
              <label style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                cursor: 'pointer',
                userSelect: 'none',
                fontSize: '0.88rem',
                color: isDarkMode ? '#cbd5e1' : '#475569',
                lineHeight: '1.45'
              }}>
                <input
                  type="checkbox"
                  checked={agreeToTerms}
                  onChange={(e) => {
                    setAgreeToTerms(e.target.checked);
                    if (termsError) setTermsError('');
                  }}
                  style={{
                    width: '18px',
                    height: '18px',
                    marginTop: '2px',
                    accentColor: '#38bdf8',
                    cursor: 'pointer',
                    borderRadius: '4px',
                    flexShrink: 0
                  }}
                />
                <span>
                  I have read and agree to the{' '}
                  <span
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowTermsModal(true);
                    }}
                    style={{
                      color: '#38bdf8',
                      fontWeight: '700',
                      textDecoration: 'underline',
                      cursor: 'pointer'
                    }}
                  >
                    Terms and Conditions
                  </span>{' '}
                  and{' '}
                  <span
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowTermsModal(true);
                    }}
                    style={{
                      color: '#38bdf8',
                      fontWeight: '700',
                      textDecoration: 'underline',
                      cursor: 'pointer'
                    }}
                  >
                    Privacy Policy
                  </span>
                  . *
                </span>
              </label>
              {termsError && (
                <div style={{ color: '#ef4444', fontSize: '0.82rem', marginTop: '6px', fontWeight: '600' }}>
                  {termsError}
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