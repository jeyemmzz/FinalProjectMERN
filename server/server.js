const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes.js');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);

// --- IN-MEMORY EVENTS ARRAY (Dito na ise-save ang mga pagbabago pansamantala) ---
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

// 1. GET (Read All Events) - Binabalik ang kasalukuyang listahan
app.get('/api/events', async (req, res) => {
  try {
    res.json(eventsList);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// 2. POST (Create New Event) - Nagdaragdag sa listahan
app.post('/api/events', async (req, res) => {
  try {
    const newEvent = { 
      id: Date.now(), // Gumagawa ng unique ID base sa oras
      ...req.body 
    };
    eventsList.push(newEvent);
    
    res.status(201).json({ 
      message: 'Event created successfully!', 
      data: newEvent 
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create event' });
  }
});

// 3. PUT (Update Event) - Binabago ang eksaktong event gamit ang ID
app.put('/api/events/:id', async (req, res) => {
  try {
    const eventId = Number(req.params.id);
    const updateData = req.body;
    
    const index = eventsList.findIndex(e => e.id === eventId);
    if (index !== -1) {
      // I-update ang item sa array
      eventsList[index] = { ...eventsList[index], ...updateData };
      res.json({ 
        message: `Event ${eventId} updated successfully!`, 
        data: eventsList[index] 
      });
    } else {
      res.status(404).json({ error: 'Event not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to update event' });
  }
});

// 4. DELETE (Delete Event) - Tinatanggal ang event sa listahan gamit ang ID
app.delete('/api/events/:id', async (req, res) => {
  try {
    const eventId = Number(req.params.id);
    const exists = eventsList.some(e => e.id === eventId);
    
    if (exists) {
      eventsList = eventsList.filter(e => e.id !== eventId);
      res.json({ message: `Event ${eventId} deleted successfully!` });
    } else {
      res.status(404).json({ error: 'Event not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete event' });
  }
});


// --- DATABASE CONNECTION & SERVER START ---
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/syntax4_db';

async function startServer() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB successfully!');
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Database connection error:', err);
  }
}

startServer();