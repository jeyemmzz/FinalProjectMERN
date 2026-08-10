import React, { useState, useEffect } from 'react';
import '../styles/Auth.css';

export default function UserDashboard({ onLogout }) {
  const [isPageLoading, setIsPageLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const registeredEvents = [
    { id: 1, title: 'Tech Summit 2026', date: 'Oct 12, 2026', venue: 'NU MOA Main Auditorium', status: 'Confirmed' },
    { id: 2, title: 'Syntax 4 Hackathon', date: 'Oct 25, 2026', venue: 'Computer Lab 402', status: 'Pending Approval' }
  ];

  return (
    <div className="auth-page-wrapper">
      <nav className="auth-navbar-centered">
        <div className="nav-pill-container" style={{ gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1rem', fontWeight: '800', color: '#ffffff' }}>
              Syntax <span style={{ color: '#38bdf8' }}>4</span> <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '400' }}>(Student Portal)</span>
            </span>
          </div>
          <div style={{ width: '1px', height: '16px', background: 'rgba(255, 255, 255, 0.12)' }}></div>
          <span className="nav-item" style={{ color: '#38bdf8' }}>My Dashboard</span>
          <button className="nav-pill-btn register" onClick={onLogout} style={{ background: 'rgba(244, 63, 94, 0.15)', color: '#f43f5e', border: '1px solid rgba(244, 63, 94, 0.3)' }}>
            Logout
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: '900px', width: '90%', margin: '40px auto', flex: 1 }}>
        {isPageLoading ? (
          <div className="auth-card-pro" style={{ padding: '30px' }}>
            <div className="skeleton-loader" style={{ height: '30px', width: '50%', marginBottom: '15px' }}></div>
            <div className="skeleton-loader" style={{ height: '18px', width: '80%', marginBottom: '30px' }}></div>
            <div className="skeleton-loader" style={{ height: '150px', width: '100%', borderRadius: '12px' }}></div>
          </div>
        ) : (
          <div className="auth-card-pro" style={{ padding: '40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '15px' }}>
              <div>
                <h1 style={{ fontSize: '1.8rem', fontWeight: '700', color: '#ffffff', marginBottom: '6px' }}>Student Dashboard</h1>
                <p style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Welcome back! Track your registered campus activities here.</p>
              </div>
              <div style={{ background: 'rgba(56, 189, 248, 0.1)', padding: '10px 18px', borderRadius: '10px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
                <span style={{ fontSize: '0.85rem', color: '#38bdf8', fontWeight: '600' }}>Role: Regular Student</span>
              </div>
            </div>

            <h3 style={{ fontSize: '1.1rem', color: '#ffffff', marginBottom: '15px' }}>My Registered Events</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {registeredEvents.map((item) => (
                <div key={item.id} style={{ background: 'rgba(3, 7, 18, 0.5)', padding: '18px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <h4 style={{ fontSize: '1rem', color: '#ffffff', marginBottom: '4px' }}>{item.title}</h4>
                    <p style={{ fontSize: '0.82rem', color: '#94a3b8' }}>📅 {item.date} | 📍 {item.venue}</p>
                  </div>
                  <span style={{ fontSize: '0.78rem', padding: '5px 12px', borderRadius: '6px', background: item.status === 'Confirmed' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)', color: item.status === 'Confirmed' ? '#10b981' : '#f59e0b', fontWeight: '500' }}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}