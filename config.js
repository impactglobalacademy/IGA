/**
 * IMPACT Global Academy - Firebase Configuration
 * ================================================
 * 
 * Setup Instructions:
 * 1. Go to Firebase Console (https://console.firebase.google.com)
 * 2. Create a new project or use existing
 * 3. Enable Authentication (Email/Password, Google)
 * 4. Create Firestore Database
 * 5. Enable Cloud Storage
 * 6. Copy your config below
 */

const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get Firebase services
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// Firebase References
const COLLECTIONS = {
  USERS: 'users',
  PROGRAMMES: 'programmes',
  ENROLMENTS: 'enrolments',
  FACULTY: 'faculty',
  EVENTS: 'events',
  RESOURCES: 'resources',
  IMPACT_STORIES: 'impact_stories',
  NEWSLETTER: 'newsletter_subscribers',
  CONTACT_SUBMISSIONS: 'contact_submissions'
};

// Programme Categories
const PROGRAMME_CATEGORIES = {
  LAP: { label: 'Leadership Acceleration Program', color: '#1A2A40' },
  CAP: { label: 'Campus Activation Program', color: '#D4A574' },
  BAP: { label: 'Business Acceleration Program', color: '#2d5a96' },
  SPECIALIZED: { label: 'Specialized Programme', color: '#15803d' },
  MAP: { label: 'Mission & Ministry Programs', color: '#ea580c' }
};

// User Roles
const USER_ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  EDITOR: 'editor',
  USER: 'user'
};

// API endpoints for Cloud Functions (if using)
const API_BASE_URL = 'https://us-central1-your-project-id.cloudfunctions.net';

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { firebaseConfig, COLLECTIONS, PROGRAMME_CATEGORIES, USER_ROLES, API_BASE_URL };
}
