const express = require('express');
const cors = require('cors');
require('dotenv').config();
const bcrypt = require('bcryptjs');

// Firebase Firestore (replaces in-memory arrays)
const { db } = require('./firebase');


const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// ─── Firestore Helpers ────────────────────────────────────────────────────────

/**
 * Convert a Firestore QuerySnapshot into a plain JS array.
 * Each item gets its Firestore document ID merged in as `_id`.
 */
function snapshotToArray(snapshot) {
  return snapshot.docs.map((doc) => ({ _id: doc.id, ...doc.data() }));
}

// ─── EVENT ROUTES ─────────────────────────────────────────────────────────────

// GET all events
app.get('/api/events', async (req, res) => {
  try {
    const snapshot = await db.collection('events').get();
    const events = snapshotToArray(snapshot);
    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Server error while fetching events' });
  }
});

// POST create event
app.post('/api/events', async (req, res) => {
  try {
    const eventData = {
      ...req.body,
      createdAt: new Date().toISOString()
    };
    const docRef = await db.collection('events').add(eventData);
    const newEvent = { _id: docRef.id, id: docRef.id, ...eventData };
    res.status(201).json({ message: 'Event created successfully!', data: newEvent });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ error: 'Server error while creating event' });
  }
});

// PUT update event
app.put('/api/events/:id', async (req, res) => {
  try {
    const eventId = req.params.id;
    const updateData = req.body;

    const docRef = db.collection('events').doc(eventId);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return res.status(404).json({ error: 'Event not found' });
    }

    await docRef.update(updateData);
    const updated = { _id: eventId, ...docSnap.data(), ...updateData };
    res.json({ message: `Event ${eventId} updated successfully!`, data: updated });
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ error: 'Server error while updating event' });
  }
});

// DELETE event
app.delete('/api/events/:id', async (req, res) => {
  try {
    const eventId = req.params.id;
    const docRef = db.collection('events').doc(eventId);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return res.status(404).json({ error: 'Event not found' });
    }

    await docRef.delete();
    res.json({ message: `Event ${eventId} deleted successfully!` });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ error: 'Server error while deleting event' });
  }
});


// ─── REGISTRATION ROUTES ──────────────────────────────────────────────────────

const processRegistration = async (req, res) => {
  try {
    const { studentId, userType, name, email, eventId } = req.body;

    console.log('[REGISTER] Received:', { name, email, eventId, userType, studentId });

    if (!name || !email || !eventId) {
      return res.status(400).json({ error: 'Name, email, and event are required.' });
    }

    const normalizedEmail = (email || '').toLowerCase().trim();
    const normalizedUserType = (userType || '').toLowerCase();
    const normalizedEventId = String(eventId).trim();

    // ── Duplicate check by email + eventId ──────────────────────────────────
    const emailDupSnap = await db.collection('registrations')
      .where('email', '==', normalizedEmail)
      .where('eventId', '==', normalizedEventId)
      .limit(1)
      .get();

    if (!emailDupSnap.empty) {
      const existing = emailDupSnap.docs[0];
      if (existing.data().status === 'Declined') {
        // Allow re-registration after a decline — remove the old one first
        await existing.ref.delete();
        console.log('[REGISTER] Removed old declined registration, allowing re-register.');
      } else {
        console.log('[REGISTER] BLOCKED - duplicate email+event:', normalizedEmail, normalizedEventId);
        return res.status(409).json({ error: 'You are already registered for this event.' });
      }
    }

    // ── Duplicate check by studentId + eventId ──────────────────────────────
    if (normalizedUserType === 'student' && studentId && studentId.trim()) {
      const idDupSnap = await db.collection('registrations')
        .where('studentId', '==', studentId.trim())
        .where('eventId', '==', normalizedEventId)
        .limit(1)
        .get();

      if (!idDupSnap.empty && idDupSnap.docs[0].data().status !== 'Declined') {
        console.log('[REGISTER] BLOCKED - duplicate studentId+event:', studentId, normalizedEventId);
        return res.status(409).json({ error: 'This Student ID is already registered for this event.' });
      }
    }

    // ── Track student in students collection ────────────────────────────────
    if (normalizedUserType === 'student' && studentId) {
      const studentSnap = await db.collection('students')
        .where('studentId', '==', studentId)
        .limit(1)
        .get();
      if (studentSnap.empty) {
        await db.collection('students').add({ studentId, name, email: normalizedEmail });
      }
    }

    // ── Save registration ────────────────────────────────────────────────────
    const newRegistration = {
      ...req.body,
      email: normalizedEmail,
      eventId: normalizedEventId,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };

    const docRef = await db.collection('registrations').add(newRegistration);
    const saved = { _id: docRef.id, id: docRef.id, ...newRegistration };

    console.log('[REGISTER] Saved. Firestore ID:', docRef.id);

    res.status(201).json({ message: 'Registration saved successfully!', registration: saved });
  } catch (error) {
    console.error('Error saving registration:', error);
    res.status(500).json({ error: 'Server error while saving registration' });
  }
};

app.post('/api/register-event', processRegistration);
app.post('/api/registrations', processRegistration);

// GET registrations (all, or filtered by email)
app.get('/api/registrations', async (req, res) => {
  try {
    const { email } = req.query;
    let snapshot;

    if (email) {
      snapshot = await db.collection('registrations')
        .where('email', '==', email.toLowerCase().trim())
        .get();
    } else {
      snapshot = await db.collection('registrations').get();
    }

    res.json(snapshotToArray(snapshot));
  } catch (error) {
    console.error('Error fetching registrations:', error);
    res.status(500).json({ error: 'Server error while fetching registrations' });
  }
});

// PUT approve registration
app.put('/api/registrations/:id/approve', async (req, res) => {
  try {
    const regId = req.params.id;
    const docRef = db.collection('registrations').doc(regId);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return res.status(404).json({ error: 'Registration not found' });
    }

    // Generate a unique 6-digit registration ID
    let uniqueRandomId;
    let isDuplicate = true;
    let attempts = 0;
    while (isDuplicate && attempts < 1000) {
      attempts++;
      uniqueRandomId = Math.floor(100000 + Math.random() * 900000).toString();
      // Check uniqueness across the collection
      const dupCheck = await db.collection('registrations')
        .where('registrationId', '==', uniqueRandomId)
        .limit(1)
        .get();
      isDuplicate = !dupCheck.empty;
    }

    const registrationId = req.body?.registrationId || uniqueRandomId;
    const approvedAt = new Date().toISOString();

    await docRef.update({ status: 'Confirmed', registrationId, approvedAt });

    console.log(`[APPROVE] Registration ${regId} approved with ID: #${registrationId}`);

    const updated = { _id: regId, ...docSnap.data(), status: 'Confirmed', registrationId, approvedAt };
    res.json({ message: 'Registration approved successfully!', registration: updated });
  } catch (error) {
    console.error('Error approving registration:', error);
    res.status(500).json({ error: 'Server error while approving registration' });
  }
});

// PUT reject registration
app.put('/api/registrations/:id/reject', async (req, res) => {
  try {
    const regId = req.params.id;
    const docRef = db.collection('registrations').doc(regId);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return res.status(404).json({ error: 'Registration not found' });
    }

    await docRef.update({ status: 'Declined' });
    const updated = { _id: regId, ...docSnap.data(), status: 'Declined' };
    res.json({ message: 'Registration declined.', registration: updated });
  } catch (error) {
    console.error('Error declining registration:', error);
    res.status(500).json({ error: 'Server error while declining registration' });
  }
});

// DELETE registration
app.delete('/api/registrations/:id', async (req, res) => {
  try {
    const regId = req.params.id;
    const docRef = db.collection('registrations').doc(regId);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return res.status(404).json({ error: 'Registration not found' });
    }

    await docRef.delete();
    console.log('[DELETE] Removed registration:', regId);
    res.json({ message: 'Registration removed successfully.' });
  } catch (error) {
    console.error('Error removing registration:', error);
    res.status(500).json({ error: 'Server error while removing registration' });
  }
});


// ─── AUTH ROUTES ──────────────────────────────────────────────────────────────

// POST login — looks up user from Firestore 'users' collection
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = (email || '').toLowerCase().trim();

    const snapshot = await db.collection('users')
      .where('email', '==', normalizedEmail)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const doc = snapshot.docs[0];
    const user = { _id: doc.id, ...doc.data() };

    let isMatch = false;
    if (user.password && user.password.startsWith('$2b$')) {
      isMatch = await bcrypt.compare(password, user.password);
    } else {
      // Plain-text fallback (only for legacy/un-seeded users)
      isMatch = user.password === password;
    }

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    res.json({
      message: 'Logged in successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        userType: user.userType,
        studentId: user.studentId || null
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login.' });
  }
});

// POST signup — adds a new user to Firestore
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password, userType, studentId } = req.body;
    const normalizedEmail = (email || '').toLowerCase().trim();

    // Check for existing user
    const existing = await db.collection('users')
      .where('email', '==', normalizedEmail)
      .limit(1)
      .get();

    if (!existing.empty) {
      return res.status(409).json({ message: 'Email is already registered.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
      name: name || '',
      email: normalizedEmail,
      password: hashedPassword,
      userType: userType || 'student',
      studentId: studentId || null,
      createdAt: new Date().toISOString()
    };

    const docRef = await db.collection('users').add(newUser);
    res.status(201).json({
      message: 'Account created successfully!',
      user: { id: docRef.id, name: newUser.name, email: newUser.email, userType: newUser.userType }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error during signup.' });
  }
});

// PUT update-password
app.put('/api/auth/update-password', async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
      return res.status(400).json({ message: 'Email and new password are required.' });
    }

    const snapshot = await db.collection('users')
      .where('email', '==', email.toLowerCase().trim())
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res.status(404).json({ message: 'No account found with this email address.' });
    }

    const doc = snapshot.docs[0];
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(newPassword, salt);
    await doc.ref.update({ password: hashed });

    res.json({ message: 'Password updated successfully!' });
  } catch (error) {
    console.error('Update password error:', error);
    res.status(500).json({ message: 'Server error while updating password.' });
  }
});

// ─── USER PROFILE UPDATE ──────────────────────────────────────────────────────

app.put('/api/users/update/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, email, currentPassword, newPassword } = req.body;

    // Try to find by Firestore doc ID first, then by email
    let docRef = db.collection('users').doc(userId);
    let docSnap = await docRef.get();

    if (!docSnap.exists && email) {
      const snap = await db.collection('users')
        .where('email', '==', email.toLowerCase().trim())
        .limit(1)
        .get();
      if (snap.empty) {
        return res.status(404).json({ message: 'User not found' });
      }
      docRef = snap.docs[0].ref;
      docSnap = snap.docs[0];
    } else if (!docSnap.exists) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = docSnap.data();
    const updates = {};

    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ message: 'Current password is required' });
      }

      let isMatch = false;
      if (user.password && user.password.startsWith('$2b$')) {
        isMatch = await bcrypt.compare(currentPassword, user.password);
      } else {
        isMatch = user.password === currentPassword;
      }

      if (!isMatch) {
        return res.status(400).json({ message: 'Incorrect current password' });
      }

      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(newPassword, salt);
    }

    if (name) updates.name = name;

    await docRef.update(updates);

    console.log('[UPDATE PROFILE] User updated:', user.email);
    res.json({
      success: true,
      message: 'Profile updated successfully!',
      user: { id: docRef.id, name: updates.name || user.name, email: user.email }
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Server error while updating profile' });
  }
});


// ─── SERVER START ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT} (Firebase Firestore Mode)`);
});