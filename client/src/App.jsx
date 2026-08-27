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

  // Check if a session exists in localStorage
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');

  // Redirects to login page after successful registration
  const handleRegisterSuccess = () => {
    alert("Account registered");
    setCurrentView('login');
  };

  // Handles login routing based on role
  const handleLoginSuccess = (role) => {
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
          onNavigateLogin={() => setCurrentView('login')} 
          onNavigateSignup={() => setCurrentView('signup')}
          onNavigateAbout={() => setCurrentView('about')} 
          onNavigateEvents={() => setCurrentView('event')}
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
        />
      )}
      
      {currentView === 'about' && (
        <About 
          onNavigateHome={() => setCurrentView(currentUser ? 'user-dashboard' : 'home')} 
          onNavigateLogin={() => setCurrentView('login')} 
          onNavigateSignup={() => setCurrentView('signup')} 
          onNavigateEvents={() => setCurrentView('event')}
          onNavigateDashboard={() => setCurrentView('user-dashboard')}
          onLogout={() => setCurrentView('home')}
        />
      )}

      {currentView === 'event' && (
        <Event 
          onNavigateHome={() => setCurrentView(currentUser ? 'user-dashboard' : 'home')} 
          onNavigateLogin={() => setCurrentView('login')} 
          onNavigateSignup={() => setCurrentView('signup')}
          onNavigateAbout={() => setCurrentView('about')}
          onNavigateDashboard={() => setCurrentView('user-dashboard')}
          onLogout={() => setCurrentView('home')}
        />
      )}

      {currentView === 'user-dashboard' && (
        <UserDashboard 
          onLogout={() => setCurrentView('home')}
          onNavigateHome={() => setCurrentView('user-dashboard')}
          onNavigateEvents={() => setCurrentView('event')}  
        />
      )}

      {currentView === 'admin-dashboard' && (
        <AdminDashboard 
          onLogout={() => setCurrentView('home')} 
        />
      )}
    </div>
  );
}