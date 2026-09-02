const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// --- IN-MEMORY DATA STORAGE (Wala nang MongoDB na kailangan) ---
let studentsList = [];
let registrationsList = [];

let eventsList = [
  {
    id: 101,
    title: 'React Workshop & UI Design',
    type: 'Workshop',
    date: '2026-08-25',
    venue: 'Lab 301',
    description: 'Hands-on session using local memory.'
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

// --- EVENT ROUTES ---
app.get('/api/events', (req, res) => {
  res.json(eventsList);
});

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

const processRegistration = (req, res) => {
  try {
    const { studentId, userType, name, email, eventId } = req.body;

    console.log('[REGISTER] Received:', { name, email, eventId, userType, studentId });

    if (!name || !email || !eventId) {
      return res.status(400).json({ error: 'Name, email, and event are required.' });
    }

    const normalizedEmail = (email || '').toLowerCase().trim();
    const normalizedUserType = (userType || '').toLowerCase();
    const normalizedEventId = String(eventId).trim();

    // --- DUPLICATE CHECK: one registration per event per account ---
    const alreadyRegisteredByEmail = registrationsList.find(r => {
      const rEmail = (r.email || '').toLowerCase().trim();
      const rEventId = String(r.eventId).trim();
      return rEmail === normalizedEmail && rEventId === normalizedEventId;
    });

    if (alreadyRegisteredByEmail) {
      // If the previous registration was Declined, remove it and allow re-registration
      if (alreadyRegisteredByEmail.status === 'Declined') {
        registrationsList = registrationsList.filter(r => r !== alreadyRegisteredByEmail);
        console.log('[REGISTER] Removed old declined registration, allowing re-register.');
      } else {
        console.log('[REGISTER] BLOCKED - duplicate email+event:', normalizedEmail, normalizedEventId);
        return res.status(409).json({ error: 'You are already registered for this event.' });
      }
    }

    // Additional check by studentId
    if (normalizedUserType === 'student' && studentId && studentId.trim()) {
      const alreadyRegisteredById = registrationsList.find(r => {
        const rStudentId = (r.studentId || '').trim();
        const rEventId = String(r.eventId).trim();
        return rStudentId === studentId.trim() && rEventId === normalizedEventId;
      });
      if (alreadyRegisteredById && alreadyRegisteredById.status !== 'Declined') {
        console.log('[REGISTER] BLOCKED - duplicate studentId+event:', studentId, normalizedEventId);
        return res.status(409).json({ error: 'This Student ID is already registered for this event.' });
      }
    }

    // Track student
    if (normalizedUserType === 'student' && studentId) {
      const existing = studentsList.find(s => s.studentId === studentId);
      if (!existing) studentsList.push({ studentId, name, email: normalizedEmail });
    }

    // Build registration — explicit fields come AFTER spread so they override req.body
    const newRegistration = {
      ...req.body,
      _id: Date.now().toString(),
      id: Date.now(),
      email: normalizedEmail,
      eventId: normalizedEventId,
      status: 'Pending',
      createdAt: new Date()
    };

    registrationsList.push(newRegistration);
    console.log('[REGISTER] Saved. Total registrations:', registrationsList.length);

    res.status(201).json({
      message: 'Registration saved successfully!',
      registration: newRegistration
    });
  } catch (error) {
    console.error('Error saving registration:', error);
    res.status(500).json({ error: 'Server error while saving registration' });
  }
};


app.post('/api/register-event', processRegistration);
app.post('/api/registrations', processRegistration);

app.get('/api/registrations', (req, res) => {
  try {
    const { email } = req.query;

    if (email) {
      const filtered = registrationsList.filter(r => r.email && r.email.toLowerCase() === email.toLowerCase());
      return res.json(filtered);
    }

    res.json(registrationsList);
  } catch (error) {
    console.error('Error fetching registrations:', error);
    res.status(500).json({ error: 'Server error while fetching registrations' });
  }
});

app.put('/api/registrations/:id/approve', (req, res) => {
  try {
    const regId = req.params.id;
    const reg = registrationsList.find(r => r._id == regId || r.id == regId);

    if (reg) {
      reg.status = 'Confirmed';
      res.json({
        message: 'Registration approved successfully!',
        registration: reg
      });
    } else {
      res.status(404).json({ error: 'Registration not found' });
    }
  } catch (error) {
    console.error('Error approving registration:', error);
    res.status(500).json({ error: 'Server error while approving registration' });
  }
});


app.put('/api/registrations/:id/reject', (req, res) => {
  try {
    const regId = req.params.id;
    const reg = registrationsList.find(r => r._id == regId || r.id == regId);

    if (reg) {
      reg.status = 'Declined';
      res.json({ message: 'Registration declined.', registration: reg });
    } else {
      res.status(404).json({ error: 'Registration not found' });
    }
  } catch (error) {
    console.error('Error declining registration:', error);
    res.status(500).json({ error: 'Server error while declining registration' });
  }
});

app.delete('/api/registrations/:id', (req, res) => {
  try {
    const regId = req.params.id;
    const index = registrationsList.findIndex(r => r._id == regId || r.id == regId);

    if (index !== -1) {
      const removed = registrationsList.splice(index, 1)[0];
      console.log('[DELETE] Removed registration:', removed._id || removed.id);
      res.json({ message: 'Registration removed successfully.' });
    } else {
      res.status(404).json({ error: 'Registration not found' });
    }
  } catch (error) {
    console.error('Error removing registration:', error);
    res.status(500).json({ error: 'Server error while removing registration' });
  }
});

// --- SERVER START ---
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT} (In-Memory Mode)`);
});