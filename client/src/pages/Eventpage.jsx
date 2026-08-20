import React, { useState } from 'react';

// 1. MOCK DATA (Pekeng datos muna para sa mga campus events)
const initialEvents = [
  { id: 1, title: 'React Workshop', type: 'Workshop', date: 'Aug 25, 2026', status: 'Upcoming', description: 'Hands-on session on React hooks and UI components.' },
  { id: 2, title: 'Annual Hackathon', type: 'Competition', date: 'Sept 10, 2026', status: 'Upcoming', description: '24-hour coding challenge for aspiring developers.' },
  { id: 3, title: 'Career Seminar', type: 'Seminar', date: 'Aug 28, 2026', status: 'Upcoming', description: 'Talk with industry experts about tech careers.' },
  { id: 4, title: 'Alumni Meeting', type: 'Meeting', date: 'Sept 05, 2026', status: 'Archived', description: 'Quarterly networking meeting for alumni.' },
  { id: 5, title: 'Graphic Design Workshop', type: 'Workshop', date: 'Oct 01, 2026', status: 'Upcoming', description: 'Learn advanced layout and UI/UX design techniques.' },
];

const eventTypes = ['All', 'Seminar', 'Competition', 'Workshop', 'Meeting'];

const Eventpage = ({ onNavigateHome, onNavigateLogin, onNavigateSignup, onNavigateAbout }) => {
  // 2. STATES (Para sa interactivity at filters)
  const [events, setEvents] = useState(initialEvents);
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Role Switcher para makita ang Student vs Admin view batay sa usapan ninyo sa chat
  const [userRole, setUserRole] = useState('Student'); 

  // 3. LOGIC (Pag-filter at pag-search ng events)
  const filteredEvents = events.filter(event => {
    const matchesType = activeFilter === 'All' || event.type === activeFilter;
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleAddEvent = () => {
    alert('Dito lalabas ang Modal/Form para magdagdag ng bagong event (Admin feature).');
  };

  const handleDeleteEvent = (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      setEvents(events.filter(event => event.id !== id));
    }
  };

  // 4. RENDER UI
  return (
    <div style={pageStyle}>
      {/* Top Navbar / Navigation Buttons */}
      <div style={navBarStyle}>
        <div style={logoStyle}>Syntax 4</div>
        <div style={navLinksStyle}>
          <button onClick={onNavigateHome} style={navLinkBtnStyle}>Home</button>
          <button onClick={onNavigateAbout} style={navLinkBtnStyle}>About</button>
          <button style={activeNavLinkStyle}>Events</button>
          <button onClick={onNavigateLogin} style={navLinkBtnStyle}>Login</button>
          <button onClick={onNavigateSignup} style={navLinkBtnStyle}>Sign up</button>
        </div>
      </div>

      {/* Main Header & Role Switcher */}
      <div style={headerSectionStyle}>
        <div>
          <h1 style={titleStyle}>Campus Events</h1>
          <p style={subtitleStyle}>Explore upcoming university activities, workshops, and seminars.</p>
        </div>
        
        {/* Role Switcher (Student vs Admin view) */}
        <div style={roleSwitcherStyle}>
          <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>View as: </span>
          <button onClick={() => setUserRole('Student')} style={roleButtonStyle(userRole === 'Student')}>Student</button>
          <button onClick={() => setUserRole('Admin')} style={roleButtonStyle(userRole === 'Admin')}>Admin</button>
        </div>
      </div>

      {/* Controls Section (Filter Buttons & Search Bar) */}
      <div style={controlsStyle}>
        <div style={filterGroupStyle}>
          {eventTypes.map(type => (
            <button 
              key={type} 
              onClick={() => setActiveFilter(type)}
              style={filterButtonStyle(activeFilter === type)}
            >
              {type}
            </button>
          ))}
        </div>
        
        <input 
          type="text" 
          placeholder="Search events or venue..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={searchInputStyle}
        />
        
        {/* Admin Control: Add Event Button */}
        {userRole === 'Admin' && (
          <button onClick={handleAddEvent} style={addButtonStyle}>
            + Add New Event
          </button>
        )}
      </div>

      {/* Events Grid / Cards Section */}
      <div style={gridStyle}>
        {filteredEvents.length > 0 ? (
          filteredEvents.map(event => (
            <div key={event.id} style={cardStyle}>
              <div>
                <div style={cardHeaderStyle}>
                  <span style={badgeStyle(event.type)}>{event.type}</span>
                  <span style={dateStyle}>{event.date}</span>
                </div>
                <h3 style={{ margin: '10px 0', color: '#ffffff' }}>{event.title}</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.4' }}>{event.description}</p>
              </div>
              
              {/* Card Footer: Role-Specific Actions */}
              <div style={cardFooterStyle}>
                <span style={statusStyle(event.status)}>{event.status}</span>
                
                {userRole === 'Student' && (
                  <button style={actionButtonStyle}>Register Now</button>
                )}
                
                {userRole === 'Admin' && (
                  <div style={adminActionStyle}>
                    <button style={editButtonStyle}>Edit</button>
                    <button onClick={() => handleDeleteEvent(event.id)} style={deleteButtonStyle}>Delete</button>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <p style={noEventsStyle}>No events match your filters.</p>
        )}
      </div>
    </div>
  );
};

// ==============================
// STYLES (Moody Dark Theme matching your preferences)
// ==============================
const pageStyle = {
  padding: '30px 40px',
  backgroundColor: '#0b1120',
  color: '#ffffff',
  minHeight: '100vh',
  fontFamily: 'sans-serif',
};

const navBarStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '40px',
  borderBottom: '1px solid #1e293b',
  paddingBottom: '20px',
};

const logoStyle = {
  fontWeight: 'bold',
  fontSize: '1.2rem',
  color: '#38bdf8',
};

const navLinksStyle = {
  display: 'flex',
  gap: '15px',
  alignItems: 'center',
};

const navLinkBtnStyle = {
  background: 'transparent',
  color: '#94a3b8',
  border: 'none',
  cursor: 'pointer',
  fontSize: '0.95rem',
  padding: '6px 12px',
};

const activeNavLinkStyle = {
  background: '#1e293b',
  color: '#ffffff',
  border: 'none',
  cursor: 'pointer',
  fontSize: '0.95rem',
  padding: '6px 14px',
  borderRadius: '20px',
};

const headerSectionStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  marginBottom: '25px',
  flexWrap: 'wrap',
  gap: '15px',
};

const titleStyle = {
  fontSize: '2rem',
  margin: '0 0 5px 0',
  fontWeight: '700',
};

const subtitleStyle = {
  color: '#94a3b8',
  margin: 0,
  fontSize: '0.95rem',
};

const roleSwitcherStyle = {
  backgroundColor: '#1e293b',
  padding: '6px 15px',
  borderRadius: '20px',
  display: 'flex',
  alignItems: 'center',
  gap: '5px',
  border: '1px solid #334155',
};

const roleButtonStyle = (isActive) => ({
  background: isActive ? '#38bdf8' : 'transparent',
  color: isActive ? '#0f172a' : '#94a3b8',
  border: 'none',
  padding: '4px 12px',
  borderRadius: '15px',
  cursor: 'pointer',
  fontWeight: isActive ? '600' : '400',
  fontSize: '0.85rem',
});

const controlsStyle = {
  display: 'flex',
  gap: '15px',
  marginBottom: '30px',
  flexWrap: 'wrap',
  alignItems: 'center',
};

const filterGroupStyle = {
  display: 'flex',
  gap: '8px',
  flexWrap: 'wrap',
};

const filterButtonStyle = (isActive) => ({
  backgroundColor: isActive ? '#1e293b' : 'transparent',
  color: isActive ? '#ffffff' : '#94a3b8',
  border: '1px solid #334155',
  padding: '8px 16px',
  borderRadius: '20px',
  cursor: 'pointer',
  fontSize: '0.9rem',
});

const searchInputStyle = {
  flex: '1',
  minWidth: '220px',
  padding: '10px 16px',
  borderRadius: '20px',
  border: '1px solid #334155',
  backgroundColor: '#0f172a',
  color: '#ffffff',
  outline: 'none',
};

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
  gap: '20px',
};

const cardStyle = {
  backgroundColor: '#1e293b',
  padding: '22px',
  borderRadius: '14px',
  border: '1px solid #334155',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
};

const cardHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const badgeStyle = (type) => {
  const colors = {
    Seminar: { bg: 'rgba(239, 68, 68, 0.15)', text: '#f87171' },
    Competition: { bg: 'rgba(59, 130, 246, 0.15)', text: '#60a5fa' },
    Workshop: { bg: 'rgba(16, 185, 129, 0.15)', text: '#34d399' },
    Meeting: { bg: 'rgba(245, 158, 11, 0.15)', text: '#fbbf24' },
  };
  const color = colors[type] || { bg: '#334155', text: '#cbd5e1' };
  return {
    backgroundColor: color.bg,
    color: color.text,
    padding: '4px 10px',
    borderRadius: '10px',
    fontSize: '0.8rem',
    fontWeight: '600',
  };
};

const dateStyle = {
  color: '#94a3b8',
  fontSize: '0.85rem',
};

const cardFooterStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: '20px',
  borderTop: '1px solid #334155',
  paddingTop: '15px',
};

const statusStyle = (status) => ({
  color: status === 'Upcoming' ? '#34d399' : '#94a3b8',
  fontSize: '0.9rem',
  fontWeight: '500',
});

const actionButtonStyle = {
  backgroundColor: '#38bdf8',
  color: '#0f172a',
  border: 'none',
  padding: '7px 16px',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: '600',
  fontSize: '0.9rem',
};

const adminActionStyle = {
  display: 'flex',
  gap: '8px',
};

const editButtonStyle = {
  backgroundColor: '#f59e0b',
  color: '#ffffff',
  border: 'none',
  padding: '6px 12px',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '0.85rem',
};

const deleteButtonStyle = {
  backgroundColor: '#ef4444',
  color: '#ffffff',
  border: 'none',
  padding: '6px 12px',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '0.85rem',
};

const addButtonStyle = {
  backgroundColor: '#10b981',
  color: '#ffffff',
  border: 'none',
  padding: '10px 20px',
  borderRadius: '20px',
  cursor: 'pointer',
  fontWeight: '600',
  fontSize: '0.9rem',
};

const noEventsStyle = {
  textAlign: 'center',
  color: '#94a3b8',
  gridColumn: '1 / -1',
  padding: '40px 0',
};

export default Eventpage;