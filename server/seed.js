/**
 * seed.js — Run this ONCE to populate Firestore with initial data.
 *
 * Usage:
 *   node seed.js
 *
 * It is safe to run multiple times — it only inserts data if the
 * collection is currently EMPTY (won't duplicate records).
 */

const bcrypt = require('bcryptjs');
const { db } = require('./firebase');

// ─── Initial Events ───────────────────────────────────────────────────────────
const INITIAL_EVENTS = [
  {
    id: '101',
    title: 'React Workshop & UI Design',
    type: 'Workshop',
    date: 'Aug 25, 2026',
    venue: 'Lab 301',
    description: 'Hands-on session covering React fundamentals, component design, and UI best practices with live coding exercises.',
    status: 'Upcoming'
  },
  {
    id: '102',
    title: 'Tech Summit 2026',
    type: 'Seminar',
    date: 'Oct 12, 2026',
    venue: 'NU MOA Main Auditorium',
    description: 'Annual technology summit featuring industry leaders sharing insights on emerging trends in AI, cloud, and software development.',
    status: 'Upcoming'
  },
  {
    id: '103',
    title: 'Advanced Node.js & REST API Development',
    type: 'Workshop',
    date: 'Sep 18, 2026',
    venue: 'Computer Lab 205, 2nd Floor',
    description: 'Deep-dive workshop on building scalable REST APIs with Node.js, Express, and MongoDB. Includes authentication and deployment strategies.',
    status: 'Upcoming'
  },
  {
    id: '104',
    title: 'Cybersecurity Awareness Seminar',
    type: 'Seminar',
    date: 'Nov 5, 2026',
    venue: 'Innovation Hub, Room 401',
    description: 'An informative seminar on modern cybersecurity threats, ethical hacking basics, and best practices for data protection in 2026.',
    status: 'Upcoming'
  },
  {
    id: '105',
    title: 'Hackathon: Build for the Future',
    type: 'Competition',
    date: 'Oct 3, 2026',
    venue: 'NU MOA Tech Arena',
    description: 'A 24-hour hackathon where teams compete to build innovative solutions addressing real-world social and environmental challenges.',
    status: 'Upcoming'
  },
  {
    id: '106',
    title: 'Web Design Showdown 2026',
    type: 'Competition',
    date: 'Nov 20, 2026',
    venue: 'Digital Arts Studio, Room 102',
    description: 'Teams compete to design and deploy a fully functional website in 6 hours. Judged on creativity, usability, and responsiveness.',
    status: 'Upcoming'
  },
  {
    id: '107',
    title: 'Student Council General Assembly',
    type: 'Meeting',
    date: 'Sep 10, 2026',
    venue: 'Conference Hall A, 3rd Floor',
    description: 'Quarterly general assembly for all student council members to discuss academic calendar updates, upcoming events, and student concerns.',
    status: 'Upcoming'
  },
  {
    id: '108',
    title: 'Department Heads Coordination Meeting',
    type: 'Meeting',
    date: 'Oct 28, 2026',
    venue: 'Faculty Lounge, Room 210',
    description: 'Monthly coordination meeting for department heads to align on curriculum updates, faculty concerns, and inter-department projects.',
    status: 'Upcoming'
  }
];

// ─── Initial Users ─────────────────────────────────────────────────────────────
const INITIAL_USERS = [
  {
    id: 'user-1',
    name: 'Keith Jeremy Azul',
    email: 'kitazul32@gmail.com',
    password: '12345',          // will be hashed
    userType: 'student',
    studentId: '2026-284933'
  },
  {
    id: 'user-2',
    name: 'Admin',
    email: 'admin@syntax4.com',
    password: '123',            // will be hashed
    userType: 'admin'
  }
];

// ─── Helpers ───────────────────────────────────────────────────────────────────
async function seedCollection(collectionName, records, idField = 'id') {
  const colRef = db.collection(collectionName);
  const snapshot = await colRef.limit(1).get();

  if (!snapshot.empty) {
    console.log(`[Seed] "${collectionName}" already has data — skipping.`);
    return;
  }

  const batch = db.batch();
  for (const record of records) {
    const docId = record[idField] ? String(record[idField]) : colRef.doc().id;
    const docRef = colRef.doc(docId);
    batch.set(docRef, record);
  }
  await batch.commit();
  console.log(`[Seed] "${collectionName}" seeded with ${records.length} records.`);
}

// ─── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log('\n[Seed] Starting database seed...\n');

  // Seed events
  await seedCollection('events', INITIAL_EVENTS);

  // Hash passwords before seeding users
  const usersWithHashedPasswords = await Promise.all(
    INITIAL_USERS.map(async (u) => {
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(u.password, salt);
      return { ...u, password: hashed };
    })
  );
  await seedCollection('users', usersWithHashedPasswords);

  console.log('\n[Seed] Done! Your Firestore database is ready.\n');
  process.exit(0);
}

main().catch((err) => {
  console.error('[Seed] Error:', err);
  process.exit(1);
});
