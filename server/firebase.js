const { initializeApp, getApps, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const path = require('path');
require('dotenv').config();



if (getApps().length === 0) {
  let credential;

  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {

    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
    credential = cert(serviceAccount);
  } else if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {

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
