const express = require('express');
const cors = require('cors');
require('dotenv').config();
const bcrypt = require('bcryptjs');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// --- IN-MEMORY DATA STORAGE (Wala nang MongoDB na kailangan) ---
let studentsList = [];
let registrationsList = [];
let usersList = [
  { id: 1, name: 'Keith Jeremy Azul', email: 'kitazul32@gmail.com', password: '12345', userType: 'student', studentId: '2026-284933' },
  { id: 2, name: 'Admin', email: 'admin@syntax4.com', password: '123', userType: 'admin' }
];

let eventsList = [
  {
    id: 101,
    title: 'React Workshop & UI Design',
    type: 'Workshop',
    date: 'Aug 25, 2026',
    venue: 'Lab 301',
    description: 'Hands-on session covering React fundamentals, component design, and UI best practices with live coding exercises.',
    status: 'Upcoming'
  },
  {
    id: 102,
    title: 'Tech Summit 2026',
    type: 'Seminar',
    date: 'Oct 12, 2026',
    venue: 'NU MOA Main Auditorium',
    description: 'Annual technology summit featuring industry leaders sharing insights on emerging trends in AI, cloud, and software development.',
    status: 'Upcoming'
  },
  {
    id: 103,
    title: 'Advanced Node.js & REST API Development',
    type: 'Workshop',
    date: 'Sep 18, 2026',
    venue: 'Computer Lab 205, 2nd Floor',
    description: 'Deep-dive workshop on building scalable REST APIs with Node.js, Express, and MongoDB. Includes authentication and deployment strategies.',
    status: 'Upcoming'
  },
  {
    id: 104,
    title: 'Cybersecurity Awareness Seminar',
    type: 'Seminar',
    date: 'Nov 5, 2026',
    venue: 'Innovation Hub, Room 401',
    description: 'An informative seminar on modern cybersecurity threats, ethical hacking basics, and best practices for data protection in 2026.',
    status: 'Upcoming'
  },
  {
    id: 105,
    title: 'Hackathon: Build for the Future',
    type: 'Competition',
    date: 'Oct 3, 2026',
    venue: 'NU MOA Tech Arena',
    description: 'A 24-hour hackathon where teams compete to build innovative solutions addressing real-world social and environmental challenges.',
    status: 'Upcoming'
  },
  {
    id: 106,
    title: 'Web Design Showdown 2026',
    type: 'Competition',
    date: 'Nov 20, 2026',
    venue: 'Digital Arts Studio, Room 102',
    description: 'Teams compete to design and deploy a fully functional website in 6 hours. Judged on creativity, usability, and responsiveness.',
    status: 'Upcoming'
  },
  {
    id: 107,
    title: 'Student Council General Assembly',
    type: 'Meeting',
    date: 'Sep 10, 2026',
    venue: 'Conference Hall A, 3rd Floor',
    description: 'Quarterly general assembly for all student council members to discuss academic calendar updates, upcoming events, and student concerns.',
    status: 'Upcoming'
  },
  {
    id: 108,
    title: 'Department Heads Coordination Meeting',
    type: 'Meeting',
    date: 'Oct 28, 2026',
    venue: 'Faculty Lounge, Room 210',
    description: 'Monthly coordination meeting for department heads to align on curriculum updates, faculty concerns, and inter-department projects.',
    status: 'Upcoming'
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

      // Generate a unique random registration ID to avoid duplicate/same IDs
      let uniqueRandomId;
      let isDuplicate = true;
      let attempts = 0;
      while (isDuplicate && attempts < 1000) {
        attempts++;
        // Generate random 6-digit number (100000 - 999999)
        uniqueRandomId = Math.floor(100000 + Math.random() * 900000).toString();
        isDuplicate = registrationsList.some(r => 
          (r._id != regId && r.id != regId) &&
          (r.registrationId === uniqueRandomId || r.registrationCode === uniqueRandomId)
        );
      }

      reg.registrationId = req.body?.registrationId || uniqueRandomId;
      reg.approvedAt = new Date();

      console.log(`[APPROVE] Registration ${regId} approved with unique Registration ID: #${reg.registrationId}`);

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

// --- USER PROFILE & PASSWORD UPDATE ROUTE (Idinagdag dito) ---
app.put('/api/users/update/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, currentPassword, newPassword } = req.body;

    const user = usersList.find(u => u.id == userId || u.email === req.body.email);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ message: "Current password is required" });
      }
      
      let isMatch = false;
      if (user.password.startsWith('$2b$')) {
        isMatch = await bcrypt.compare(currentPassword, user.password);
      } else {
        isMatch = (user.password === currentPassword);
      }

      if (!isMatch) {
        return res.status(400).json({ message: "Incorrect current password" });
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    if (name) {
      user.name = name;
    }

    console.log('[UPDATE PROFILE] User updated:', user.email);
    res.json({ 
      success: true, 
      message: "Profile updated successfully!", 
      user: { id: user.id, name: user.name, email: user.email } 
    });

  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Server error while updating profile' });
  }
});

// --- SERVER START ---
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT} (In-Memory Mode)`);
});