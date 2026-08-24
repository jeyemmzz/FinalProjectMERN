import React, { useState } from 'react';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import About from './components/About';
import Event from './components/Event';
import UserDashboard from './components/UserDashboard';
import AdminDashboard from './components/AdminDashboard';
import EventsPage from './pages/Eventpage';
import './styles/Auth.css';

export default function App() {
  const [currentView, setCurrentView] = useState('home');

  // This function alerts the user and redirects them to the login page
  const handleRegisterSuccess = () => {
    alert("Account registered");
    setCurrentView('login');
  };

  // Function to handle login success based on user role (admin or student/user)
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
          onBackToHome={() => setCurrentView('home')} 
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
          onBackToHome={() => setCurrentView('home')} 
          onSwitchToLogin={() => setCurrentView('login')}
          onNavigateAbout={() => setCurrentView('about')}
          onNavigateEvents={() => setCurrentView('event')}
          onSignupSuccess={handleRegisterSuccess}
        />
      )}
      
      {currentView === 'about' && (
        <About 
          onNavigateHome={() => setCurrentView('home')} 
          onNavigateLogin={() => setCurrentView('login')} 
          onNavigateSignup={() => setCurrentView('signup')} 
          onNavigateEvents={() => setCurrentView('event')}
        />
      )}

      {currentView === 'event' && (
        <EventsPage 
          onNavigateHome={() => setCurrentView('home')} 
          onNavigateLogin={() => setCurrentView('login')} 
          onNavigateSignup={() => setCurrentView('signup')}
          onNavigateAbout={() => setCurrentView('about')}
        />
      )}

      {currentView === 'user-dashboard' && (
        <UserDashboard 
          onLogout={() => setCurrentView('home')} 
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