import React, { useState, useEffect } from 'react';
import '../styles/Auth.css';

export default function Signup({ onBackToHome, onSwitchToLogin, onNavigateAbout, onNavigateEvents }) {
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false); // State para sa password visibility
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

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

    setSuccessMessage('Account created successfully! Redirecting to login...');
    setTimeout(() => {
      onSwitchToLogin();
    }, 1500);
  };

  return (
    <div className="auth-page-wrapper">
      <nav className="auth-navbar-centered">
        <div className="nav-pill-container" style={{ gap: '16px' }}>
          <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }} onClick={onBackToHome}>
            <span style={{ fontSize: '1rem', fontWeight: '800', color: '#ffffff' }}>
              Syntax <span style={{ color: '#38bdf8' }}>4</span>
            </span>
          </div>
          <div style={{ width: '1px', height: '16px', background: 'rgba(255, 255, 255, 0.12)' }}></div>
          <span onClick={onBackToHome} className="nav-item">Home</span>
          <span onClick={onNavigateEvents} className="nav-item">Events</span>
          <span onClick={onNavigateAbout} className="nav-item">About</span>
          <button className="nav-pill-btn register" onClick={onSwitchToLogin}>Login</button>
          <button className="nav-pill-btn active" onClick={() => {}}>Register</button>
        </div>
      </nav>

      <div className="auth-container" style={{ justifyContent: 'center', alignItems: 'center', padding: '40px 20px' }}>
        <div className="auth-card-pro" style={{ maxWidth: '420px', width: '100%', padding: '40px' }}>
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
              <h2 style={{ fontSize: '1.8rem', color: '#ffffff', marginBottom: '8px', fontWeight: '700' }}>Create Account</h2>
              <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '25px' }}>Join Syntax 4 to manage and register for campus events.</p>

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
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '6px' }}>Full Name</label>
                  <input 
                    type="text" 
                    name="fullName"
                    placeholder="Jose Mari Gomon Jr."
                    value={formData.fullName}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '11px 14px', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(56, 189, 248, 0.2)', borderRadius: '8px', color: '#fff', fontSize: '0.9rem', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '6px' }}>Email Address</label>
                  <input 
                    type="email" 
                    name="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '11px 14px', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(56, 189, 248, 0.2)', borderRadius: '8px', color: '#fff', fontSize: '0.9rem', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '6px' }}>Password</label>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '11px 14px', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(56, 189, 248, 0.2)', borderRadius: '8px', color: '#fff', fontSize: '0.9rem', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '6px' }}>Confirm Password</label>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    name="confirmPassword"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '11px 14px', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(56, 189, 248, 0.2)', borderRadius: '8px', color: '#fff', fontSize: '0.9rem', outline: 'none' }}
                  />
                  {/* Show Password Checkbox para sa Signup (sumasakop sa parehong password fields) */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                    <input 
                      type="checkbox" 
                      id="showPassSignup" 
                      checked={showPassword} 
                      onChange={(e) => setShowPassword(e.target.checked)}
                      style={{ cursor: 'pointer', accentColor: '#38bdf8' }}
                    />
                    <label htmlFor="showPassSignup" style={{ fontSize: '0.8rem', color: '#94a3b8', cursor: 'pointer', userSelect: 'none' }}>
                      Show passwords
                    </label>
                  </div>
                </div>

                <button type="submit" className="submit-btn" style={{ padding: '12px', marginTop: '5px' }}>
                  Create Account
                </button>
              </form>

              <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#94a3b8', marginTop: '20px' }}>
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