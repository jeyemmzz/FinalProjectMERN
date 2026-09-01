const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes.js');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// --- MONGODB CONNECTION ---
// Palitan ang URI kung gumagamit ka ng MongoDB Atlas o iba pang local connection string
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/campusevents';

mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB successfully!'))
  .catch((err) => console.error('MongoDB connection error:', err));

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

// --- IN-MEMORY REGISTRATIONS ARRAY ---
let registrationsList = [];

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


// --- REGISTRATION ROUTES ---

// A. POST: Tinugma sa tinatawag ng Event.jsx (/api/register-event)
app.post('/api/register-event', (req, res) => {
  const newRegistration = {
    _id: 'reg_' + Date.now(),
    ...req.body,
    createdAt: new Date()
  };
  
  registrationsList.push(newRegistration);
  res.status(201).json({ 
    message: 'Registration saved successfully!', 
    registration: newRegistration 
  });
});

// Alternative endpoint
app.post('/api/registrations', (req, res) => {
  const newRegistration = {
    _id: 'reg_' + Date.now(),
    ...req.body,
    createdAt: new Date()
  };
  
  registrationsList.push(newRegistration);
  res.status(201).json({ 
    message: 'Registration saved successfully!', 
    registration: newRegistration 
  });
});

// B. GET: Kunin ang mga registrations
app.get('/api/registrations', (req, res) => {
  const { email } = req.query;
  
  if (email) {
    const userRegs = registrationsList.filter(r => r.email && r.email.toLowerCase() === email.toLowerCase());
    return res.json(userRegs);
  }
  
  res.json(registrationsList);
});

// C. PUT: I-approve ng Admin ang pending registration
app.put('/api/registrations/:id/approve', (req, res) => {
  const regId = req.params.id;
  const index = registrationsList.findIndex(r => r._id === regId || r.id == regId);
  
  if (index !== -1) {
    registrationsList[index].status = 'Confirmed';
    res.json({ 
      message: 'Registration approved successfully!', 
      registration: registrationsList[index] 
    });
  } else {
    res.status(404).json({ error: 'Registration not found' });
  }
});


// --- SERVER START ---
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});