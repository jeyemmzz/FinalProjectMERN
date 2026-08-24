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

// Events Route (Idinagdag para masagot ang fetch request mula sa UserDashboard)
app.get('/api/events', async (req, res) => {
  try {
    // Pwede mong palitan ito ng database query mamaya (hal. Event.find())
    res.json([
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
    ]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// Database Connection & Server Start
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