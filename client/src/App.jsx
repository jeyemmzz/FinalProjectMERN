import React, { useState } from 'react';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import About from './components/About';
import Event from './components/Event';
import UserDashboard from './components/UserDashboard';
import AdminDashboard from './components/AdminDashboard';
import './styles/Auth.css';

export default function App() {
  const [currentView, setCurrentView] = useState('home');
  const [signupType, setSignupType] = useState('guest'); // 'student' | 'guest'

  // Check and store active session in React state
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('currentUser') || 'null');
    } catch {
      return null;
    }
  });

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    setCurrentUser(null);
    setCurrentView('home');
  };

  // After successful registration/account creation, set user and go to profile/dashboard
  const handleRegisterSuccess = (registeredUser) => {
    alert("Account registered successfully!");
    if (registeredUser) {
      setCurrentUser(registeredUser);
    } else {
      try {
        const stored = JSON.parse(localStorage.getItem('currentUser') || 'null');
        if (stored) setCurrentUser(stored);
      } catch {}
    }
    setCurrentView('user-dashboard');
  };

  // Handles login routing based on role
  const handleLoginSuccess = (userDataOrRole) => {
    let role = 'user';
    if (typeof userDataOrRole === 'string') {
      role = userDataOrRole;
      try {
        const stored = JSON.parse(localStorage.getItem('currentUser') || 'null');
        if (stored) setCurrentUser(stored);
      } catch {}
    } else if (userDataOrRole?.role) {
      role = userDataOrRole.role;
      setCurrentUser(userDataOrRole);
    } else {
      try {
        const stored = JSON.parse(localStorage.getItem('currentUser') || 'null');
        if (stored) setCurrentUser(stored);
      } catch {}
    }

    if (role === 'admin') {
      setCurrentView('admin-dashboard');
    } else {
      setCurrentView('user-dashboard');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {currentView === 'home' && (
        <Home 
          currentUser={currentUser}
          onNavigateHome={() => setCurrentView('home')}
          onNavigateLogin={() => setCurrentView('login')} 
          onNavigateSignup={(type) => { setSignupType(type || 'guest'); setCurrentView('signup'); }}
          onNavigateAbout={() => setCurrentView('about')} 
          onNavigateEvents={() => setCurrentView('event')}
          onNavigateDashboard={() => setCurrentView('user-dashboard')}
          onLogout={handleLogout}
        />
      )}
      
      {currentView === 'login' && (
        <Login 
          onNavigateHome={() => setCurrentView('home')} 
          onSwitchToSignup={() => setCurrentView('signup')}
          onNavigateAbout={() => setCurrentView('about')}
          onNavigateEvents={() => setCurrentView('event')}
          onLoginSuccess={handleLoginSuccess}
          onNavigateUserDashboard={() => setCurrentView('user-dashboard')}
          onNavigateAdminDashboard={() => setCurrentView('admin-dashboard')}
        />
      )}
      
      {currentView === 'signup' && (
        <Signup 
          onNavigateHome={() => setCurrentView('home')} 
          onSwitchToLogin={() => setCurrentView('login')}
          onNavigateAbout={() => setCurrentView('about')}
          onNavigateEvents={() => setCurrentView('event')}
          onSignupSuccess={handleRegisterSuccess}
          signupType={signupType}
        />
      )}
      
      {currentView === 'about' && (
        <About 
          onNavigateHome={() => setCurrentView('home')} 
          onNavigateLogin={() => setCurrentView('login')} 
          onNavigateSignup={() => setCurrentView('signup')} 
          onNavigateEvents={() => setCurrentView('event')}
          onNavigateDashboard={() => setCurrentView('user-dashboard')}
          onLogout={handleLogout}
        />
      )}

      {currentView === 'event' && (
        <Event 
          onNavigateHome={() => setCurrentView('home')} 
          onNavigateLogin={() => setCurrentView('login')} 
          onNavigateSignup={(type) => { setSignupType(type || 'guest'); setCurrentView('signup'); }}
          onNavigateAbout={() => setCurrentView('about')}
          onNavigateDashboard={() => setCurrentView('user-dashboard')}
          onLogout={handleLogout}
        />
      )}

      {currentView === 'user-dashboard' && (
        <UserDashboard 
          user={currentUser}
          onLogout={handleLogout}
          onNavigateHome={() => setCurrentView('home')}
          onNavigateEvents={() => setCurrentView('event')}
          onNavigateAbout={() => setCurrentView('about')}  
        />
      )}

      {currentView === 'admin-dashboard' && (
        <AdminDashboard 
          onLogout={handleLogout} 
          onNavigateHome={() => setCurrentView('home')}
        />
      )}
    </div>
  );
}