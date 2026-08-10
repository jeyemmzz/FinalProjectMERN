import React, { useState, useEffect } from 'react';
import '../styles/Auth.css';

export default function AdminDashboard({ onLogout }) {
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [events, setEvents] = useState([
    { 
      id: 1, 
      title: 'Tech Summit 2026', 
      date: '2026-10-12', 
      time: '09:00 AM', 
      venue: 'NU MOA Auditorium',
      notes: 'Bring your student ID, laptop, and wear smart casual attire.' 
    }
  ]);
  
  // Idinagdag ang 'notes' sa initial state ng bagong event
  const [newEvent, setNewEvent] = useState({ title: '', date: '', time: '', venue: '', notes: '' });

  useEffect(() => {
    const timer = setTimeout(() => setIsPageLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  const handleAddEvent = (e) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.date || !newEvent.time || !newEvent.venue) {
      alert("Please fill in all required event details!");
      return;
    }
    setEvents([...events, { id: Date.now(), ...newEvent }]);
    setNewEvent({ title: '', date: '', time: '', venue: '', notes: '' });
    alert("Event Added Successfully with Notes!");
  };

  return (
    <div className="auth-page-wrapper">
      <nav className="auth-navbar-centered">
        <div className="nav-pill-container" style={{ gap: '24px', padding: '10px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.1rem', fontWeight: '800', color: '#ffffff' }}>
              Syntax <span style={{ color: '#f43f5e' }}>4</span> 
              <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '400', marginLeft: '8px' }}>| Admin Portal</span>
            </span>
          </div>
          <div style={{ width: '1px', height: '18px', background: 'rgba(255, 255, 255, 0.12)' }}></div>
          <button 
            className="nav-pill-btn register" 
            onClick={onLogout} 
            style={{ background: 'rgba(244, 63, 94, 0.15)', color: '#f43f5e', border: '1px solid rgba(244, 63, 94, 0.3)', padding: '6px 16px', fontSize: '0.85rem' }}
          >
            Logout
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: '1100px', width: '92%', margin: '40px auto', display: 'flex', flexDirection: 'column', gap: '30px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#ffffff', marginBottom: '6px' }}>Dashboard Overview</h1>
            <p style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Manage institutional events, schedules, and participant guidelines.</p>
          </div>
          <div style={{ background: 'rgba(244, 63, 94, 0.1)', padding: '8px 16px', borderRadius: '8px', border: '1px solid rgba(244, 63, 94, 0.2)' }}>
            <span style={{ fontSize: '0.85rem', color: '#f43f5e', fontWeight: '600' }}>● Administrator Mode</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '25px', alignItems: 'start' }}>
          
          {/* Create Event Card na may Notes Field */}
          <div className="auth-card-pro" style={{ padding: '30px', margin: 0, width: '100%', boxSizing: 'border-box' }}>
            <h3 style={{ color: '#fff', fontSize: '1.25rem', marginBottom: '8px', fontWeight: '600' }}>Create New Event</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '20px' }}>Publish events along with instructions or things to bring.</p>
            
            <form onSubmit={handleAddEvent} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '6px' }}>Event Title</label>
                <input 
                  type="text"
                  placeholder="e.g. Annual IT Symposium" 
                  value={newEvent.title} 
                  onChange={e => setNewEvent({...newEvent, title: e.target.value})} 
                  style={{ width: '100%', padding: '11px 14px', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(56, 189, 248, 0.2)', borderRadius: '8px', color: '#fff', fontSize: '0.9rem', outline: 'none' }} 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '6px' }}>Date</label>
                  <input 
                    type="date" 
                    value={newEvent.date} 
                    onChange={e => setNewEvent({...newEvent, date: e.target.value})} 
                    style={{ width: '100%', padding: '11px 14px', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(56, 189, 248, 0.2)', borderRadius: '8px', color: '#fff', fontSize: '0.9rem', outline: 'none' }} 
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '6px' }}>Time</label>
                  <input 
                    type="time" 
                    value={newEvent.time} 
                    onChange={e => setNewEvent({...newEvent, time: e.target.value})} 
                    style={{ width: '100%', padding: '11px 14px', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(56, 189, 248, 0.2)', borderRadius: '8px', color: '#fff', fontSize: '0.9rem', outline: 'none' }} 
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '6px' }}>Venue / Location</label>
                <input 
                  type="text"
                  placeholder="e.g. NU MOA Room 402" 
                  value={newEvent.venue} 
                  onChange={e => setNewEvent({...newEvent, venue: e.target.value})} 
                  style={{ width: '100%', padding: '11px 14px', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(56, 189, 248, 0.2)', borderRadius: '8px', color: '#fff', fontSize: '0.9rem', outline: 'none' }} 
                />
              </div>

              {/* Notes / Instructions Input Field */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '6px' }}>Notes / Things to Bring / Reminders</label>
                <textarea 
                  placeholder="e.g. Bring valid ID, laptop, and wear formal attire." 
                  value={newEvent.notes} 
                  onChange={e => setNewEvent({...newEvent, notes: e.target.value})} 
                  rows="3"
                  style={{ width: '100%', padding: '11px 14px', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(56, 189, 248, 0.2)', borderRadius: '8px', color: '#fff', fontSize: '0.9rem', outline: 'none', resize: 'vertical' }} 
                />
              </div>

              <button 
                type="submit" 
                className="submit-btn"
                style={{ padding: '12px', marginTop: '5px', width: '100%', fontWeight: '600' }}
              >
                Publish Event
              </button>
            </form>
          </div>

          {/* Existing Events Card na nagpapakita ng Notes */}
          <div className="auth-card-pro" style={{ padding: '30px', margin: 0, width: '100%', boxSizing: 'border-box' }}>
            <h3 style={{ color: '#fff', fontSize: '1.25rem', marginBottom: '8px', fontWeight: '600' }}>Active System Events</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '20px' }}>Currently scheduled events and guidelines.</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '520px', overflowY: 'auto', paddingRight: '4px' }}>
              {events.length === 0 ? (
                <p style={{ color: '#64748b', fontSize: '0.85rem', textAlign: 'center', padding: '20px' }}>No active events found.</p>
              ) : (
                events.map(evt => (
                  <div key={evt.id} style={{ padding: '16px', background: 'rgba(3, 7, 18, 0.5)', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h4 style={{ fontSize: '1rem', color: '#ffffff', fontWeight: '600' }}>{evt.title}</h4>
                      <span style={{ fontSize: '0.75rem', background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', padding: '2px 8px', borderRadius: '4px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>Active</span>
                    </div>
                    <p style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                      📅 {evt.date} at {evt.time}
                    </p>
                    <p style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                      📍 {evt.venue}
                    </p>
                    {evt.notes && (
                      <div style={{ marginTop: '4px', padding: '8px 10px', background: 'rgba(56, 189, 248, 0.05)', borderRadius: '6px', borderLeft: '3px solid #38bdf8' }}>
                        <span style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: '600', display: 'block', marginBottom: '2px' }}>Reminders / Notes:</span>
                        <p style={{ fontSize: '0.8rem', color: '#cbd5e1', margin: 0 }}>{evt.notes}</p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}