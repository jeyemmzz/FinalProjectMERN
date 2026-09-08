import React, z, { useState } from 'react';

export default function EditProfile({ user }) {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: ''
  });
  const [message, setMessage] = useState('');

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      // Sinisigurong gagana kahit id o _id ang gamit ng user object
      const userId = user?.id || user?._id || 1;

      const response = await fetch(`http://localhost:5000/api/users/update/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (response.ok) {
        setMessage("Updated successfully!");
      } else {
        setMessage(data.message || "Update failed");
      }
    } catch (err) {
      setMessage("Server error");
    }
  };

  return (
    <div style={{ padding: '20px', background: '#1e1e1e', color: '#fff', borderRadius: '8px' }}>
      <h3>Account Settings</h3>
      {message && <p>{message}</p>}
      <form onSubmit={handleUpdate}>
        <div style={{ marginBottom: '10px' }}>
          <label>Name:</label><br />
          <input 
            type="text" 
            value={formData.name} 
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            style={{ padding: '8px', width: '100%' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Current Password:</label><br />
          <input 
            type="password" 
            onChange={(e) => setFormData({...formData, currentPassword: e.target.value})}
            style={{ padding: '8px', width: '100%' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>New Password:</label><br />
          <input 
            type="password" 
            onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
            style={{ padding: '8px', width: '100%' }}
          />
        </div>
        <button type="submit" style={{ padding: '10px 15px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '4px' }}>
          Save Changes
        </button>
      </form>
    </div>
  );
}