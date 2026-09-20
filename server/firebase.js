const { initializeApp, getApps, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const path = require('path');
require('dotenv').config();

/**
 * Firebase Admin SDK Initializer (v12+ compatible)
 *
 * Set ONE of these in your .env file:
 *
 * Option A – Path to a downloaded service account JSON key file:
 *   FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json
 *
 * Option B – Inline JSON string (useful for cloud deployments):
 *   FIREBASE_SERVICE_ACCOUNT_JSON={"type":"service_account","project_id":"..."}
 */

if (getApps().length === 0) {
  let credential;

  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    // Option B: inline JSON string
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
    credential = cert(serviceAccount);
  } else if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
    // Option A: path to JSON file
    const serviceAccountPath = path.resolve(process.env.FIREBASE_SERVICE_ACCOUNT_PATH);
    const serviceAccount = require(serviceAccountPath);
    credential = cert(serviceAccount);
  } else {
    console.error(
      '\n[Firebase] ERROR: No service account credentials found.\n' +
      'Please set FIREBASE_SERVICE_ACCOUNT_PATH or FIREBASE_SERVICE_ACCOUNT_JSON in your .env file.\n' +
      'See server/.env.example for instructions.\n'
    );
    process.exit(1);
  }

  initializeApp({ credential });
  console.log('[Firebase] Admin SDK initialized successfully.');
}

const db = getFirestore();
db.settings({ ignoreUndefinedProperties: true });

module.exports = { db };
