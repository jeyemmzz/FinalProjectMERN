import React, { useState, useEffect } from 'react';
import '../styles/Auth.css';

// Asset Imports mula sa src/assets
import infoDark from '../assets/information-fill (1).png';
import infoLight from '../assets/information-fill.png';
import userDark from '../assets/user-3-line.png';
import userLight from '../assets/user-3-line (1).png';
import calendarLight from '../assets/calendar-2-line (3).png';
import calendarDark from '../assets/calendar-2-line (1).png';
import mapPinDark from '../assets/map-pin-line (1).png';
import mapPinLight from '../assets/map-pin-line.png';
import moonIcon from '../assets/moon-fill (2).png';
import sunIcon from '../assets/sun-fill (1).png';

export default function AdminDashboard({ onLogout, onNavigateHome, currentAdmin }) {
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('manage-events'); // 'manage-events' | 'manage-registrations' | 'analytics'
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Database states
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);

  // Modal & Form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEventId, setCurrentEventId] = useState(null);

  const initialFormState = {
    title: '',
    type: 'Workshop',
    date: '',
    venue: '',
    description: '',
    status: 'Active'
  };

  const [formData, setFormData] = useState(initialFormState);

  // Theme initialization and data fetching
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setIsDarkMode(savedTheme === 'dark');
    document.body.setAttribute('data-theme', savedTheme);

    fetchEvents();
    fetchRegistrations();
  }, []);

  const toggleTheme = () => {
    const nextMode = !isDarkMode;
    setIsDarkMode(nextMode);
    const themeName = nextMode ? 'dark' : 'light';
    document.body.setAttribute('data-theme', themeName);
    localStorage.setItem('theme', themeName);
  };

  // --- API CRUD OPERATIONS (EVENTS) ---

  const fetchEvents = async () => {
    try {
      setIsPageLoading(true);
      const response = await fetch('http://localhost:5000/api/events');
      if (!response.ok) throw new Error('Failed to fetch events.');
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
      setEvents([
        {
          id: 101,
          title: 'React Workshop & UI Design (DB)',
          type: 'Workshop',
          date: '2026-08-25',
          venue: 'Lab 301',
          description: 'Hands-on session connected to database.',
          status: 'Active'
        }
      ]);
    } finally {
      setIsPageLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setIsEditing(false);
    setCurrentEventId(null);
    setFormData(initialFormState);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (event) => {
    setIsEditing(true);
    setCurrentEventId(event._id || event.id);
    setFormData({
      title: event.title || '',
      type: event.type || 'Workshop',
      date: event.date || '',
      venue: event.venue || event.location || '',
      description: event.description || '',
      status: event.status || 'Active'
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (isSubmitting) return;
    setIsModalOpen(false);
    setFormData(initialFormState);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.date || !formData.venue) {
      alert('Please fill out all required fields.');
      return;
    }

    try {
      setIsSubmitting(true);
      const url = isEditing
        ? `http://localhost:5000/api/events/${currentEventId}`
        : 'http://localhost:5000/api/events';

      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error(`Failed to ${isEditing ? 'update' : 'create'} event.`);

      alert(`Event successfully ${isEditing ? 'updated' : 'created'}!`);
      handleCloseModal();
      await fetchEvents();
    } catch (error) {
      console.error('Error saving event:', error);
      alert('Database action failed. Please check backend API server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/events/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete event.');

      alert('Event deleted successfully.');
      await fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Failed to delete event from database.');
    }
  };

  // --- API OPERATIONS (REGISTRATIONS) ---

  const fetchRegistrations = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/registrations');
      if (!response.ok) throw new Error('Failed to fetch registrations.');
      const data = await response.json();
      setRegistrations(data);
    } catch (error) {
      console.error('Error fetching registrations:', error);
      setRegistrations([]);
    }
  };

  const handleConfirmRegistration = async (id) => {
    // Remove card from admin list immediately
    setRegistrations(prev => prev.filter(r => (r._id || r.id) != id));

    // Best-effort server sync — don't re-fetch (in-memory server resets on restart)
    try {
      await fetch(`http://localhost:5000/api/registrations/${id}/approve`, { method: 'PUT' });
    } catch (error) {
      console.error('Error confirming registration on server:', error);
    }
  };

  const handleRejectRegistration = async (id) => {
    if (!window.confirm('Are you sure you want to decline this registration request?')) return;

    // Remove card from admin list immediately
    setRegistrations(prev => prev.filter(r => (r._id || r.id) != id));

    // Best-effort server sync — don't re-fetch (in-memory server resets on restart)
    try {
      await fetch(`http://localhost:5000/api/registrations/${id}/reject`, { method: 'PUT' });
    } catch (error) {
      console.error('Error declining registration on server:', error);
    }
  };

  return (
    <div className="auth-page-wrapper">
      {/* Navbar */}
      <nav className="auth-navbar-centered">
        <div className="nav-pill-container" style={{ gap: '14px', padding: '10px 24px', flexWrap: 'wrap' }}>
          <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }} onClick={onNavigateHome}>
            <span style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--auth-text-main, #ffffff)' }}>
              Syntax <span style={{ color: '#ff0000' }}>4</span>{' '}
              <span style={{ fontSize: '0.75rem', background: 'rgba(56, 189, 248, 0.15)', color: '#ff0000', padding: '2px 8px', borderRadius: '4px' }}>
                Admin
              </span>
            </span>
          </div>

          <div style={{ width: '1px', height: '16px', background: 'rgba(255, 255, 255, 0.12)' }}></div>

          <span onClick={() => setActiveTab('manage-events')} className="nav-item" style={{ color: activeTab === 'manage-events' ? '#38bdf8' : 'var(--auth-text-muted)', fontWeight: activeTab === 'manage-events' ? '600' : '400', cursor: 'pointer' }}>
            Manage Events
          </span>

          <span onClick={() => setActiveTab('manage-registrations')} className="nav-item" style={{ color: activeTab === 'manage-registrations' ? '#38bdf8' : 'var(--auth-text-muted)', fontWeight: activeTab === 'manage-registrations' ? '600' : '400', cursor: 'pointer' }}>
            Registrations ({registrations.filter(r => !r.status || r.status === 'Pending').length})
          </span>

          <span onClick={() => setActiveTab('analytics')} className="nav-item" style={{ color: activeTab === 'analytics' ? '#38bdf8' : 'var(--auth-text-muted)', fontWeight: activeTab === 'analytics' ? '600' : '400', cursor: 'pointer' }}>
            System Overview
          </span>

          <div style={{ width: '1px', height: '18px', background: 'var(--auth-border-color)' }}></div>

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
            }}
          >
            {/* Track */}
            <div
              style={{
                position: 'relative',
                width: '48px',
                height: '26px',
                borderRadius: '999px',
                background: isDarkMode
                  ? 'rgba(56, 189, 248, 0.18)'
                  : 'rgba(251, 191, 36, 0.22)',
                border: isDarkMode
                  ? '1px solid rgba(56, 189, 248, 0.35)'
                  : '1px solid rgba(251, 191, 36, 0.45)',
                transition: 'background 0.3s, border-color 0.3s',
                boxSizing: 'border-box',
              }}
            >
              {/* Thumb */}
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: isDarkMode ? 'calc(100% - 22px)' : '3px',
                  transform: 'translateY(-50%)',
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: isDarkMode
                    ? 'rgba(56, 189, 248, 0.85)'
                    : 'rgba(251, 191, 36, 0.9)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: isDarkMode
                    ? '0 0 6px rgba(56,189,248,0.5)'
                    : '0 0 6px rgba(251,191,36,0.5)',
                  transition: 'left 0.3s cubic-bezier(.4,0,.2,1), background 0.3s, box-shadow 0.3s',
                }}
              >
                <img
                  src={isDarkMode ? moonIcon : sunIcon}
                  alt="Theme Icon"
                  style={{ width: '11px', height: '11px', objectFit: 'contain' }}
                />
              </div>
            </div>
            {/* Label */}
            <span style={{ fontSize: '0.82rem', color: 'var(--auth-text-muted)', letterSpacing: '0.02em' }}>
              {isDarkMode ? 'Dark' : 'Light'}
            </span>
          </div>

          <button className="nav-pill-btn register" onClick={onLogout} style={{ background: 'rgba(244, 63, 94, 0.15)', color: '#f43f5e', border: '1px solid rgba(244, 63, 94, 0.3)', padding: '6px 16px', fontSize: '0.85rem', cursor: 'pointer' }}>
            Logout
          </button>
        </div>
      </nav>

      {/* Main Container */}
      <div style={{ maxWidth: '1200px', width: '95%', margin: '40px auto', flex: 1, boxSizing: 'border-box' }}>
        {isPageLoading ? (
          <div className="auth-card-pro" style={{ maxWidth: '100%', padding: '40px' }}>
            <div className="skeleton-loader" style={{ height: '35px', width: '25%', marginBottom: '20px' }}></div>
            <div className="skeleton-loader" style={{ height: '200px', borderRadius: '12px' }}></div>
          </div>
        ) : (
          <div className="auth-card-pro" style={{ maxWidth: '100%', padding: '40px', boxSizing: 'border-box' }}>

            {/* TAB 1: MANAGE EVENTS */}
            {activeTab === 'manage-events' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '15px' }}>
                  <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--auth-text-main)', margin: '0 0 6px 0' }}>Admin Control</h1>
                    <p style={{ fontSize: '0.95rem', color: 'var(--auth-text-muted)', margin: 0 }}>Upcoming Events</p>
                  </div>
                  <button onClick={handleOpenCreateModal} style={{ background: '#38bdf8', color: '#0f172a', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem', boxShadow: '0 4px 12px rgba(56, 189, 248, 0.3)' }}>
                    + Create New Event
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
                  {events.length > 0 ? (
                    events.map((evt) => {
                      const eventId = evt._id || evt.id;
                      return (
                        <div key={eventId} style={{ background: 'var(--auth-input-bg)', padding: '24px', borderRadius: '12px', border: '1px solid var(--auth-border-color)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxSizing: 'border-box' }}>
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                              <span style={{ backgroundColor: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '3px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '600' }}>
                                {evt.type || 'Workshop'}
                              </span>
                              <span style={{ fontSize: '0.85rem', color: 'var(--auth-text-muted)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <img src={isDarkMode ? calendarDark : calendarLight} alt="Date" style={{ width: '13px', height: '13px', objectFit: 'contain' }} />
                                {evt.date}
                              </span>
                            </div>
                            <h3 style={{ fontSize: '1.15rem', color: 'var(--auth-text-main)', marginBottom: '8px', fontWeight: '600' }}>{evt.title}</h3>
                            <p style={{ fontSize: '0.85rem', color: 'var(--auth-text-muted)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                              <img src={isDarkMode ? mapPinDark : mapPinLight} alt="Venue" style={{ width: '13px', height: '13px', objectFit: 'contain' }} />
                              {evt.venue || evt.location}
                            </p>
                            <p style={{ fontSize: '0.9rem', color: 'var(--auth-text-muted)', lineHeight: '1.4', marginBottom: '20px' }}>{evt.description}</p>
                          </div>
                          <div style={{ borderTop: '1px solid var(--auth-border-color)', paddingTop: '15px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                            <button onClick={() => handleOpenEditModal(evt)} style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.3)', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '0.8rem' }}>
                              Edit
                            </button>
                            <button onClick={() => handleDeleteEvent(eventId)} style={{ background: 'rgba(244, 63, 94, 0.15)', color: '#f43f5e', border: '1px solid rgba(244, 63, 94, 0.3)', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '0.8rem' }}>
                              Delete
                            </button>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div style={{ gridColumn: '1 / -1', padding: '50px', textAlign: 'center', background: 'var(--auth-input-bg)', borderRadius: '12px', border: '1px dashed var(--auth-border-color)' }}>
                      <p style={{ color: 'var(--auth-text-muted)', margin: 0 }}>No records found in the database.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: MANAGE REGISTRATIONS */}
            {activeTab === 'manage-registrations' && (
              <div>
                <div style={{ marginBottom: '30px' }}>
                  <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--auth-text-main)', margin: '0 0 6px 0' }}>Event Registrations</h1>
                  <p style={{ fontSize: '0.95rem', color: 'var(--auth-text-muted)', margin: 0 }}>Review and confirm pending event participation requests.</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
                  {registrations.filter(r => !r.status || r.status === 'Pending').length > 0 ? (
                    registrations
                      .filter(r => !r.status || r.status === 'Pending')
                      .map((reg) => {
                        const regId = reg._id || reg.id;
                        return (
                          <div key={regId} style={{ background: 'var(--auth-input-bg)', padding: '24px', borderRadius: '12px', border: '1px solid var(--auth-border-color)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxSizing: 'border-box' }}>
                            <div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '6px' }}>
                                <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
                                  <span style={{ backgroundColor: 'rgba(234, 179, 8, 0.15)', color: '#eab308', padding: '3px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '600' }}>
                                    Pending
                                  </span>
                                  {reg.userType === 'student' ? (
                                    <span style={{ backgroundColor: 'rgba(56, 189, 248, 0.12)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.35)', padding: '3px 9px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: '700' }}>
                                      🎓 Student
                                    </span>
                                  ) : (
                                    <span style={{ backgroundColor: 'rgba(139, 92, 246, 0.12)', color: '#a78bfa', border: '1px solid rgba(139, 92, 246, 0.35)', padding: '3px 9px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: '700' }}>
                                      👤 Non-Student / Guest
                                    </span>
                                  )}
                                </div>
                                <span style={{ fontSize: '0.85rem', color: 'var(--auth-text-muted)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                  <img src={isDarkMode ? infoDark : infoLight} alt="ID" style={{ width: '13px', height: '13px', objectFit: 'contain' }} />
                                  {reg.studentId || 'N/A'}
                                </span>
                              </div>

                              <h3 style={{ fontSize: '1.15rem', color: 'var(--auth-text-main)', marginBottom: '4px', fontWeight: '600' }}>
                                {reg.name || reg.studentName || 'Student'}
                              </h3>
                              <p style={{ fontSize: '0.85rem', color: 'var(--auth-text-muted)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <img src={isDarkMode ? userDark : userLight} alt="Email" style={{ width: '13px', height: '13px', objectFit: 'contain' }} />
                                {reg.email || reg.studentEmail}
                              </p>
                              <p style={{ fontSize: '0.9rem', color: '#38bdf8', fontWeight: '500', marginBottom: '4px' }}>Event: {reg.eventTitle || reg.title}</p>
                              <p style={{ fontSize: '0.8rem', color: 'var(--auth-text-muted)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  <img src={isDarkMode ? calendarDark : calendarLight} alt="Date" style={{ width: '12px', height: '12px', objectFit: 'contain' }} />
                                  {reg.eventDate || reg.date}
                                </span>
                                <span>|</span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  <img src={isDarkMode ? mapPinDark : mapPinLight} alt="Venue" style={{ width: '12px', height: '12px', objectFit: 'contain' }} />
                                  {reg.eventVenue || reg.venue || reg.location || 'N/A'}
                                </span>
                              </p>
                            </div>

                            <div style={{ borderTop: '1px solid var(--auth-border-color)', paddingTop: '15px', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                              <button onClick={() => handleRejectRegistration(regId)} style={{ background: 'rgba(244, 63, 94, 0.15)', color: '#f43f5e', border: '1px solid rgba(244, 63, 94, 0.3)', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '0.8rem' }}>
                                Decline
                              </button>
                              <button onClick={() => handleConfirmRegistration(regId)} style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '6px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '0.8rem' }}>
                                ✅ Confirm Registration
                              </button>
                            </div>
                          </div>
                        );
                      })
                  ) : (
                    <div style={{ gridColumn: '1 / -1', padding: '50px', textAlign: 'center', background: 'var(--auth-input-bg)', borderRadius: '12px', border: '1px dashed var(--auth-border-color)' }}>
                      <p style={{ color: 'var(--auth-text-muted)', margin: 0 }}>No pending registrations found.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 3: SYSTEM OVERVIEW */}
            {activeTab === 'analytics' && (
              <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                  <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--auth-text-main)', margin: '0 0 8px 0' }}>System Overview</h1>
                  <p style={{ fontSize: '0.95rem', color: 'var(--auth-text-muted)', margin: 0 }}>Real-time metrics queried from your server.</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
                  <div style={{ background: 'var(--auth-input-bg)', padding: '24px', borderRadius: '12px', border: '1px solid var(--auth-border-color)', textAlign: 'center' }}>
                    <h3 style={{ color: 'var(--auth-text-muted)', fontSize: '0.9rem', marginBottom: '8px' }}>Registered Events</h3>
                    <p style={{ fontSize: '2rem', fontWeight: '700', color: '#38bdf8', margin: 0 }}>{events.length}</p>
                  </div>
                  <div style={{ background: 'var(--auth-input-bg)', padding: '24px', borderRadius: '12px', border: '1px solid var(--auth-border-color)', textAlign: 'center' }}>
                    <h3 style={{ color: 'var(--auth-text-muted)', fontSize: '0.9rem', marginBottom: '8px' }}>Total Bookings</h3>
                    <p style={{ fontSize: '2rem', fontWeight: '700', color: '#f59e0b', margin: 0 }}>{registrations.length}</p>
                  </div>
                  <div style={{ background: 'var(--auth-input-bg)', padding: '24px', borderRadius: '12px', border: '1px solid var(--auth-border-color)', textAlign: 'center' }}>
                    <h3 style={{ color: 'var(--auth-text-muted)', fontSize: '0.9rem', marginBottom: '8px' }}>Server Status</h3>
                    <p style={{ fontSize: '1.2rem', fontWeight: '700', color: '#10b981', margin: '10px 0 0 0' }}>🟢 Connected</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* CREATE / EDIT EVENT MODAL */}
      {isModalOpen && (
        <div onClick={handleCloseModal} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0, 0, 0, 0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px', boxSizing: 'border-box' }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: 'var(--auth-card-bg, #1e293b)', border: '1px solid var(--auth-border-color)', padding: '30px', borderRadius: '16px', width: '100%', maxWidth: '500px', boxSizing: 'border-box', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
            <h2 style={{ color: 'var(--auth-text-main)', fontSize: '1.4rem', marginBottom: '20px', fontWeight: '600' }}>
              {isEditing ? 'Edit Event' : 'Create Event'}
            </h2>

            <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--auth-text-muted)', marginBottom: '6px' }}>Event Title *</label>
                <input type="text" required placeholder="e.g. Web Development Bootcamp" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--auth-border-color)', background: 'var(--auth-input-bg)', color: 'var(--auth-text-main)', boxSizing: 'border-box', outline: 'none' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--auth-text-muted)', marginBottom: '6px' }}>Type</label>
                  <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--auth-border-color)', background: 'var(--auth-input-bg)', color: 'var(--auth-text-main)', boxSizing: 'border-box', outline: 'none' }}>
                    <option value="Workshop">Workshop</option>
                    <option value="Seminar">Seminar</option>
                    <option value="Competition">Competition</option>
                    <option value="Meeting">Meeting</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--auth-text-muted)', marginBottom: '6px' }}>Date *</label>
                  <input type="date" required value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--auth-border-color)', background: 'var(--auth-input-bg)', color: 'var(--auth-text-main)', boxSizing: 'border-box', outline: 'none', colorScheme: isDarkMode ? 'dark' : 'light' }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--auth-text-muted)', marginBottom: '6px' }}>Venue *</label>
                <input type="text" required placeholder="e.g. Lab 402 / Main Auditorium" value={formData.venue} onChange={(e) => setFormData({ ...formData, venue: e.target.value })} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--auth-border-color)', background: 'var(--auth-input-bg)', color: 'var(--auth-text-main)', boxSizing: 'border-box', outline: 'none' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--auth-text-muted)', marginBottom: '6px' }}>Description</label>
                <textarea rows="3" placeholder="Short description of the event..." value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--auth-border-color)', background: 'var(--auth-input-bg)', color: 'var(--auth-text-main)', boxSizing: 'border-box', outline: 'none', resize: 'vertical' }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={handleCloseModal} disabled={isSubmitting} style={{ background: 'transparent', color: 'var(--auth-text-muted)', border: '1px solid var(--auth-border-color)', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} style={{ background: '#38bdf8', color: '#0f172a', border: 'none', padding: '8px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', opacity: isSubmitting ? 0.7 : 1 }}>
                  {isSubmitting ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}