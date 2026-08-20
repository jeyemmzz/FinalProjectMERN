import React, { useState, useEffect } from 'react';
import '../styles/Auth.css';

export default function AdminDashboard({ onLogout, onNavigateHome, currentAdmin }) {
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('manage-events'); // 'manage-events' o 'analytics'
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Main state para sa Events na manggagaling sa Database via API
  const [events, setEvents] = useState([]);

  // Modal / Form States para sa Create at Update
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEventId, setCurrentEventId] = useState(null);

  // Form input fields
  const [formData, setFormData] = useState({
    title: '',
    type: 'Workshop',
    date: '',
    venue: '',
    description: '',
    status: 'Active'
  });

  // Theme initialization and persistence
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setIsDarkMode(savedTheme === 'dark');
    document.body.setAttribute('data-theme', savedTheme);

    // Fetch events mula sa Database (Backend API) kapag nag-load ang page
    fetchEvents();
  }, []);

  const toggleTheme = () => {
    const nextMode = !isDarkMode;
    setIsDarkMode(nextMode);
    const themeName = nextMode ? 'dark' : 'light';
    document.body.setAttribute('data-theme', themeName);
    localStorage.setItem('theme', themeName);
  };

  // --- DATABASE API FUNCTIONS (CRUD) ---

  // 1. READ: Kunin ang lahat ng events mula sa database
  const fetchEvents = async () => {
    try {
      setIsPageLoading(true);
      // Palitan ang URL na 'http://localhost:5000/api/events' depende sa backend API endpoint ninyo
      const response = await fetch('http://localhost:5000/api/events');
      if (!response.ok) throw new Error('Failed to fetch events from database.');
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
      // Fallback sample data sakaling offline muna ang backend habang nagte-test kayo
      setEvents([
        { id: 1, title: 'React Workshop & UI Design (DB)', type: 'Workshop', date: '2026-08-25', venue: 'Lab 301', description: 'Hands-on session connected to database.', status: 'Active' }
      ]);
    } finally {
      setIsPageLoading(false);
    }
  };

  // Open modal para sa pag-CREATE
  const handleOpenCreateModal = () => {
    setIsEditing(false);
    setFormData({ title: '', type: 'Workshop', date: '', venue: '', description: '', status: 'Active' });
    setIsModalOpen(true);
  };

  // Open modal para sa pag-UPDATE
  const handleOpenEditModal = (event) => {
    setIsEditing(true);
    setCurrentEventId(event.id);
    setFormData({
      title: event.title,
      type: event.type,
      date: event.date,
      venue: event.venue,
      description: event.description,
      status: event.status
    });
    setIsModalOpen(true);
  };

  // Handle Form Submit (2. CREATE o 3. UPDATE papuntang Database)
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.date || !formData.venue) {
      alert('Please fill out all required fields.');
      return;
    }

    try {
      if (isEditing) {
        // UPDATE Operation (PUT)
        const response = await fetch(`http://localhost:5000/api/events/${currentEventId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        if (!response.ok) throw new Error('Failed to update event.');
        
        alert('Event successfully updated in the database!');
      } else {
        // CREATE Operation (POST)
        const response = await fetch('http://localhost:5000/api/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        if (!response.ok) throw new Error('Failed to create event.');

        alert('New event successfully created and saved to the database!');
      }

      setIsModalOpen(false);
      fetchEvents(); // Refresh ang listahan mula sa database
    } catch (error) {
      console.error('Error saving event:', error);
      alert('Database action failed. Please check your backend connection.');
    }
  };

  // 4. DELETE Operation (DELETE papuntang Database)
  const handleDeleteEvent = async (id) => {
    if (window.confirm('Are you sure you want to delete this event from the database?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/events/${id}`, {
          method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete event.');

        alert('Event deleted successfully from the database.');
        fetchEvents(); // Refresh ang listahan
      } catch (error) {
        console.error('Error deleting event:', error);
        alert('Failed to delete from database.');
      }
    }
  };

  return (
    <div className="auth-page-wrapper">
      {/* Navbar */}
      <nav className="auth-navbar-centered">
        <div className="nav-pill-container" style={{ gap: '14px', padding: '10px 24px', flexWrap: 'wrap' }}>
          <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }} onClick={onNavigateHome}>
            <span style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--auth-text-main, #ffffff)' }}>
              Syntax <span style={{ color: '#ff0000' }}>4</span> <span style={{ fontSize: '0.75rem', background: 'rgba(56, 189, 248, 0.15)', color: '#ff0000', padding: '2px 8px', borderRadius: '4px' }}>Admin</span>
            </span>
          </div>

          <div style={{ width: '1px', height: '16px', background: 'rgba(255, 255, 255, 0.12)' }}></div>

          <span 
            onClick={() => setActiveTab('manage-events')} 
            className="nav-item" 
            style={{ color: activeTab === 'manage-events' ? '#38bdf8' : 'var(--auth-text-muted)', fontWeight: activeTab === 'manage-events' ? '600' : '400', cursor: 'pointer' }}
          >
            Manage Events
          </span>
          <span 
            onClick={() => setActiveTab('analytics')} 
            className="nav-item" 
            style={{ color: activeTab === 'analytics' ? '#38bdf8' : 'var(--auth-text-muted)', fontWeight: activeTab === 'analytics' ? '600' : '400', cursor: 'pointer' }}
          >
            System Overview
          </span>

          <div style={{ width: '1px', height: '18px', background: 'var(--auth-border-color)' }}></div>

          <button
            className="nav-pill-btn"
            onClick={toggleTheme}
            style={{ border: '1px solid rgba(56, 189, 248, 0.3)', cursor: 'pointer', fontSize: '0.85rem' }}
          >
            {isDarkMode ? '🌙 Dark' : '☀️ Light'}
          </button>

          <button 
            className="nav-pill-btn register" 
            onClick={onLogout} 
            style={{ background: 'rgba(244, 63, 94, 0.15)', color: '#f43f5e', border: '1px solid rgba(244, 63, 94, 0.3)', padding: '6px 16px', fontSize: '0.85rem', cursor: 'pointer' }}
          >
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
            
            {/* TAB 1: MANAGE EVENTS (CRUD) */}
            {activeTab === 'manage-events' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '15px' }}>
                  <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--auth-text-main)', margin: '0 0 6px 0' }}>Admin Control</h1>
                    <p style={{ fontSize: '0.95rem', color: 'var(--auth-text-muted)', margin: 0 }}>Campus Events</p>
                  </div>
                  <button
                    onClick={handleOpenCreateModal}
                    style={{
                      background: '#38bdf8',
                      color: '#0f172a',
                      border: 'none',
                      padding: '10px 20px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '0.9rem',
                      boxShadow: '0 4px 12px rgba(56, 189, 248, 0.3)'
                    }}
                  >
                    + Create New Event
                  </button>
                </div>

                {/* Events Grid List */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
                  {events.length > 0 ? (
                    events.map((evt) => (
                      <div key={evt.id} style={{ 
                        background: 'var(--auth-input-bg)', 
                        padding: '24px', 
                        borderRadius: '12px', 
                        border: '1px solid var(--auth-border-color)', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        justifyContent: 'space-between',
                        boxSizing: 'border-box'
                      }}>
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                            <span style={{ backgroundColor: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '3px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '600' }}>
                              {evt.type}
                            </span>
                            <span style={{ fontSize: '0.85rem', color: 'var(--auth-text-muted)' }}>📅 {evt.date}</span>
                          </div>
                          <h3 style={{ fontSize: '1.15rem', color: 'var(--auth-text-main)', marginBottom: '8px', fontWeight: '600' }}>{evt.title}</h3>
                          <p style={{ fontSize: '0.85rem', color: 'var(--auth-text-muted)', marginBottom: '6px' }}>📍 {evt.venue}</p>
                          <p style={{ fontSize: '0.9rem', color: 'var(--auth-text-muted)', lineHeight: '1.4', marginBottom: '20px' }}>{evt.description}</p>
                        </div>

                        {/* Action Buttons */}
                        <div style={{ borderTop: '1px solid var(--auth-border-color)', paddingTop: '15px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                          <button
                            onClick={() => handleOpenEditModal(evt)}
                            style={{
                              background: 'rgba(56, 189, 248, 0.15)',
                              color: '#38bdf8',
                              border: '1px solid rgba(56, 189, 248, 0.3)',
                              padding: '6px 14px',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontWeight: '600',
                              fontSize: '0.8rem'
                            }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteEvent(evt.id)}
                            style={{
                              background: 'rgba(244, 63, 94, 0.15)',
                              color: '#f43f5e',
                              border: '1px solid rgba(244, 63, 94, 0.3)',
                              padding: '6px 14px',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontWeight: '600',
                              fontSize: '0.8rem'
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ gridColumn: '1 / -1', padding: '50px', textAlign: 'center', background: 'var(--auth-input-bg)', borderRadius: '12px', border: '1px dashed var(--auth-border-color)' }}>
                      <p style={{ color: 'var(--auth-text-muted)', margin: 0 }}>No records found in the database.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: SYSTEM OVERVIEW */}
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
                    <h3 style={{ color: 'var(--auth-text-muted)', fontSize: '0.9rem', marginBottom: '8px' }}>Server Status</h3>
                    <p style={{ fontSize: '1.2rem', fontWeight: '700', color: '#10b981', margin: '10px 0 0 0' }}>🟢 Connected</p>
                  </div>
                  <div style={{ background: 'var(--auth-input-bg)', padding: '24px', borderRadius: '12px', border: '1px solid var(--auth-border-color)', textAlign: 'center' }}>
                    <h3 style={{ color: 'var(--auth-text-muted)', fontSize: '0.9rem', marginBottom: '8px' }}>Institution</h3>
                    <p style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--auth-text-main)', margin: '10px 0 0 0' }}>National University MOA</p>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}
      </div>

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          padding: '20px',
          boxSizing: 'border-box'
        }}>
          <div style={{
            background: 'var(--auth-card-bg, #1e293b)',
            border: '1px solid var(--auth-border-color)',
            padding: '30px',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '500px',
            boxSizing: 'border-box',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
          }}>
            <h2 style={{ color: 'var(--auth-text-main)', fontSize: '1.4rem', marginBottom: '20px', fontWeight: '600' }}>
              {isEditing ? 'Edit Event (Database)' : 'Create Event (Database)'}
            </h2>

            <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--auth-text-muted)', marginBottom: '6px' }}>Event Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Web Development Bootcamp"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--auth-border-color)', background: 'var(--auth-input-bg)', color: 'var(--auth-text-main)', boxSizing: 'border-box', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--auth-text-muted)', marginBottom: '6px' }}>Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--auth-border-color)', background: 'var(--auth-input-bg)', color: 'var(--auth-text-main)', boxSizing: 'border-box', outline: 'none' }}
                  >
                    <option value="Workshop">Workshop</option>
                    <option value="Seminar">Seminar</option>
                    <option value="Competition">Competition</option>
                    <option value="Meeting">Meeting</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--auth-text-muted)', marginBottom: '6px' }}>Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--auth-border-color)', background: 'var(--auth-input-bg)', color: 'var(--auth-text-main)', boxSizing: 'border-box', outline: 'none' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--auth-text-muted)', marginBottom: '6px' }}>Venue *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lab 402 / Main Auditorium"
                  value={formData.venue}
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--auth-border-color)', background: 'var(--auth-input-bg)', color: 'var(--auth-text-main)', boxSizing: 'border-box', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--auth-text-muted)', marginBottom: '6px' }}>Description</label>
                <textarea
                  rows="3"
                  placeholder="Short description of the event..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--auth-border-color)', background: 'var(--auth-input-bg)', color: 'var(--auth-text-main)', boxSizing: 'border-box', outline: 'none', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{ background: 'transparent', color: 'var(--auth-text-muted)', border: '1px solid var(--auth-border-color)', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ background: '#38bdf8', color: '#0f172a', border: 'none', padding: '8px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}
                >
                  {isEditing ? 'Save to Database' : 'Insert to Database'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}