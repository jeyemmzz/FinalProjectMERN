const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes.js');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);

// --- IN-MEMORY EVENTS ARRAY ---
let eventsList = [
  { 
    id: 101, 
    title: 'React Workshop & UI Design', 
    type: 'Workshop', 
    date: '2026-08-25', 
    venue: 'Lab 301', 
    description: 'Hands-on session connected to database.' 
  },
  { 
    id: 102, 
    title: 'Tech Summit 2026', 
    type: 'Seminar', 
    date: 'Oct 12, 2026', 
    venue: 'NU MOA Main Auditorium', 
    description: 'Annual technology summit and networking.' 
  }
];

// 1. GET (Read All Events)
app.get('/api/events', (req, res) => {
  res.json(eventsList);
});

// 2. POST (Create New Event)
app.post('/api/events', (req, res) => {
  const newEvent = { 
    id: Date.now(), 
    ...req.body 
  };
  eventsList.push(newEvent);
  
  res.status(201).json({ 
    message: 'Event created successfully!', 
    data: newEvent 
  });
});

// 3. PUT (Update Event)
app.put('/api/events/:id', (req, res) => {
  const eventId = Number(req.params.id);
  const updateData = req.body;
  
  const index = eventsList.findIndex(e => e.id === eventId);
  if (index !== -1) {
    eventsList[index] = { ...eventsList[index], ...updateData };
    res.json({ 
      message: `Event ${eventId} updated successfully!`, 
      data: eventsList[index] 
    });
  } else {
    res.status(404).json({ error: 'Event not found' });
  }
});

// 4. DELETE (Delete Event)
app.delete('/api/events/:id', (req, res) => {
  const eventId = Number(req.params.id);
  const exists = eventsList.some(e => e.id === eventId);
  
  if (exists) {
    eventsList = eventsList.filter(e => e.id !== eventId);
    res.json({ message: `Event ${eventId} deleted successfully!` });
  } else {
    res.status(404).json({ error: 'Event not found' });
  }
});

// --- SERVER START (NO MONGODB REQUIRED) ---
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});