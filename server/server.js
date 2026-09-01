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
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/campusevents';

mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB successfully!'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);

// --- STUDENT SCHEMA & MODEL (Para sa Validation) ---
const studentSchema = new mongoose.Schema({
  studentId: { type: String, required: true, unique: true },
  name: String,
  email: String
});

const Student = mongoose.model('Student', studentSchema);

// --- REGISTRATION SCHEMA & MODEL ---
const registrationSchema = new mongoose.Schema({
  eventId: String,
  eventTitle: String,
  eventDate: String,
  eventVenue: String,
  userType: String,
  name: String,
  email: String,
  studentId: String,
  userId: String,
  status: { type: String, default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});

const Registration = mongoose.model('Registration', registrationSchema);

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


// --- REGISTRATION ROUTES (MDB PERSISTENT WITH STUDENT ID VALIDATION) ---

// Helper function para sa Student ID validation logic
const processRegistration = async (req, res) => {
  try {
    const { studentId, userType } = req.body;

    // Kung ang nagre-register ay Student, i-validate natin kung existing ba ang studentId sa database
    if (userType === 'Student' || studentId) {
      if (!studentId) {
        return res.status(400).json({ error: 'Student ID is required for student registration.' });
      }

      const validStudent = await Student.findOne({ studentId: studentId });
      if (!validStudent) {
        return res.status(400).json({ error: 'Invalid Student ID. Only authorized student IDs are allowed to register.' });
      }
    }

    const newRegistration = new Registration({
      ...req.body,
      status: 'Pending'
    });
    
    await newRegistration.save();
    
    res.status(201).json({ 
      message: 'Registration saved successfully!', 
      registration: newRegistration 
    });
  } catch (error) {
    console.error('Error saving registration:', error);
    res.status(500).json({ error: 'Server error while saving registration' });
  }
};

// A. POST: Tinugma sa tinatawag ng Event.jsx (/api/register-event)
app.post('/api/register-event', processRegistration);

// Alternative endpoint
app.post('/api/registrations', processRegistration);

// B. GET: Kunin ang mga registrations mula sa Database
app.get('/api/registrations', async (req, res) => {
  try {
    const { email } = req.query;
    let query = {};
    
    if (email) {
      query.email = { $regex: new RegExp('^' + email + '$', 'i') };
    }
    
    const registrationsList = await Registration.find(query);
    res.json(registrationsList);
  } catch (error) {
    console.error('Error fetching registrations:', error);
    res.status(500).json({ error: 'Server error while fetching registrations' });
  }
});

// C. PUT: I-approve ng Admin ang pending registration
app.put('/api/registrations/:id/approve', async (req, res) => {
  try {
    const regId = req.params.id;
    const updatedReg = await Registration.findByIdAndUpdate(
      regId, 
      { status: 'Confirmed' }, 
      { new: true }
    );
    
    if (updatedReg) {
      res.json({ 
        message: 'Registration approved successfully!', 
        registration: updatedReg 
      });
    } else {
      res.status(404).json({ error: 'Registration not found' });
    }
  } catch (error) {
    console.error('Error approving registration:', error);
    res.status(500).json({ error: 'Server error while approving registration' });
  }
});


// --- SERVER START ---
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});