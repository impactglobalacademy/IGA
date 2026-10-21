# IMPACT Global Academy - Setup & Deployment Guide

## Complete Step-by-Step Instructions

This guide will help you get IMPACT Global Academy website running with Firebase backend and GitHub Pages hosting.

---

## 📋 Table of Contents

1. [Firebase Setup](#firebase-setup)
2. [Environment Configuration](#environment-configuration)
3. [GitHub Pages Deployment](#github-pages-deployment)
4. [Admin Backend Setup](#admin-backend-setup)
5. [Testing & Verification](#testing--verification)
6. [Troubleshooting](#troubleshooting)

---

## 🔥 Firebase Setup

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Create a project"
3. Project name: `impact-global-academy`
4. Enable Google Analytics (optional but recommended)
5. Click "Create project"
6. Wait for project to be created (about 2 minutes)

### Step 2: Enable Authentication

1. In Firebase Console, click your project
2. Left menu → "Build" → "Authentication"
3. Click "Get started"
4. Enable these providers:
   - **Email/Password**: Click "Email/Password" → Enable → Save
   - **Google**: Click "Google" → Enable
   - Email: Use your admin email
   - Project public name: `IMPACT Global Academy`
   - Support email: `support@impactglobalacademy.com`
   - Click "Save"

### Step 3: Create Firestore Database

1. Left menu → "Build" → "Firestore Database"
2. Click "Create database"
3. Select region: **Europe (europe-west1)** or closest to Nigeria
4. Choose "Start in production mode"
5. Click "Create"
6. Wait for database to be created (about 1 minute)

### Step 4: Set Up Firestore Security Rules

In Firestore, go to "Rules" tab and replace with:

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public read access to published data
    match /programmes/{document=**} {
      allow read: if resource.data.status == 'published';
      allow create, update, delete: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['super_admin', 'admin', 'editor'];
    }
    
    // User profiles
    match /users/{userId} {
      allow read: if request.auth.uid == userId || request.auth != null;
      allow create: if request.auth.uid == userId;
      allow update, delete: if request.auth.uid == userId && request.auth.token.email_verified;
    }
    
    // Enrolments
    match /enrolments/{document=**} {
      allow read, create, update: if request.auth != null && request.auth.uid == resource.data.userId;
      allow list, delete: if request.auth != null && request.auth.uid == resource.data.userId;
      allow read, write: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['super_admin', 'admin'];
    }
    
    // Public collections
    match /faculty/{document=**} {
      allow read: if true;
      allow write: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['super_admin', 'admin', 'editor'];
    }
    
    match /events/{document=**} {
      allow read: if true;
      allow write: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['super_admin', 'admin', 'editor'];
    }
    
    match /resources/{document=**} {
      allow read: if true;
      allow write: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['super_admin', 'admin', 'editor'];
    }
    
    match /impact_stories/{document=**} {
      allow read: if resource.data.published == true;
      allow write: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['super_admin', 'admin', 'editor'];
    }
    
    // Newsletter
    match /newsletter_subscribers/{document=**} {
      allow create: if true;
      allow read, update, delete: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['super_admin', 'admin'];
    }
    
    // Contact submissions
    match /contact_submissions/{document=**} {
      allow create: if true;
      allow read, update, delete: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['super_admin', 'admin'];
    }
  }
}
```

Click "Publish"

### Step 5: Enable Cloud Storage

1. Left menu → "Build" → "Storage"
2. Click "Get started"
3. Start in production mode
4. Select region: Same as Firestore
5. Click "Done"

### Step 6: Get Firebase Config

1. Left menu → "Project settings" (gear icon)
2. General tab → Scroll to "Your apps"
3. Click "Web" icon (if not exists, click "Add app")
4. Copy the `firebaseConfig` object
5. Paste it into `config.js` file (replacing placeholder values)

### Step 7: Get Service Account Key (Optional - for backend functions)

1. "Project settings" → "Service accounts"
2. Click "Generate new private key"
3. Save the JSON file securely (don't commit to GitHub)

---

## ⚙️ Environment Configuration

### Step 1: Update config.js

Open `config.js` and replace with your Firebase credentials:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_FROM_FIREBASE",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### Step 2: Create First Admin User (Manually via Firebase Console)

1. Go to Firebase → Authentication → Users
2. Click "Add user"
3. Email: `your-email@example.com`
4. Password: `Strong123!Password`
5. Click "Add user"

### Step 3: Set User as Admin (via Firestore)

1. Go to Firestore Database
2. Create collection: `users`
3. Create document with ID = (user's UID from Authentication)
4. Add fields:
   ```
   uid: (same as document ID)
   email: your-email@example.com
   fullName: Your Name
   role: super_admin
   createdAt: (current timestamp)
   updatedAt: (current timestamp)
   ```

---

## 🚀 GitHub Pages Deployment

### Step 1: Prepare Files

1. Remove `node_modules/` and `.git/` folders if any
2. Create `.gitignore`:
   ```
   node_modules/
   .env.local
   .DS_Store
   *.log
   /assets/
   ```

### Step 2: Initialize Git Repository

```bash
cd impact-global-academy
git init
git config user.name "Your Name"
git config user.email "your@email.com"
```

### Step 3: Create GitHub Repository

1. Go to [GitHub.com](https://github.com)
2. Click "New repository"
3. Name: `impact-global-academy`
4. Description: `Premium leadership development academy website`
5. Choose Public or Private
6. Do NOT initialize with README, .gitignore, or license
7. Click "Create repository"

### Step 4: Push to GitHub

```bash
git add .
git commit -m "Initial commit: IMPACT Global Academy website"
git branch -M main
git remote add origin https://github.com/yourusername/impact-global-academy.git
git push -u origin main
```

### Step 5: Configure GitHub Pages

1. Go to your GitHub repository
2. Click "Settings" → "Pages"
3. Source: Select "Deploy from a branch"
4. Branch: Select `main`
5. Folder: Select `/ (root)`
6. Click "Save"
7. Wait for deployment (about 1-2 minutes)
8. Your site will be at: `https://yourusername.github.io/impact-global-academy/`

### Step 6: Configure Custom Domain (Optional)

If you have a custom domain:

1. Go to "Settings" → "Pages"
2. Under "Custom domain", enter your domain (e.g., `impactglobalacademy.com`)
3. Configure DNS with your domain provider:
   - Add CNAME record pointing to `yourusername.github.io`
   - Or add A records pointing to GitHub's IPs:
     - `185.199.108.153`
     - `185.199.109.153`
     - `185.199.110.153`
     - `185.199.111.153`

---

## 🔐 Admin Backend Setup

### Step 1: Admin Login Page

Admins access the dashboard at:
```
https://yourusername.github.io/impact-global-academy/admin/index.html
```

### Step 2: Create Additional Admin Users

1. Via Firebase Console → Authentication → Add user
2. Set their role to `admin` or `editor` in Firestore `users` collection
3. User roles:
   - `super_admin`: Full access + can delete users
   - `admin`: Full content management access
   - `editor`: Can create/edit content but not delete
   - `user`: Regular user

### Step 3: Admin Features

The admin dashboard allows you to:

- **Programmes**: Create, edit, delete programmes
- **Faculty**: Manage instructor profiles
- **Events**: Create and manage events
- **Resources**: Upload learning materials
- **Impact Stories**: Publish success stories
- **Contact Submissions**: View and manage inquiries
- **Newsletter**: Manage email subscribers
- **Users**: View and manage user accounts
- **Analytics**: View dashboard statistics

---

## ✅ Testing & Verification

### Test Checklist

- [ ] Firebase Authentication working (sign up/login)
- [ ] Firestore database storing data
- [ ] Homepage loads and displays programmes
- [ ] Contact form submissions saved to Firestore
- [ ] Admin can log in
- [ ] Admin can create a programme
- [ ] Admin dashboard displays correct statistics
- [ ] User can enrol in a programme
- [ ] Newsletter subscription working
- [ ] All pages responsive on mobile

### Test Users

Create these test users in Firebase:

1. **Regular User**
   - Email: `user@test.com`
   - Password: `Test123!`
   - Role: `user`

2. **Editor**
   - Email: `editor@test.com`
   - Password: `Test123!`
   - Role: `editor`

3. **Admin**
   - Email: `admin@test.com`
   - Password: `Test123!`
   - Role: `admin`

---

## 🐛 Troubleshooting

### Issue: "Firebase is not defined"

**Solution**: Ensure Firebase libraries are loaded before config.js:
```html
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js"></script>
<script src="/config.js"></script>
```

### Issue: "User not authorized" on admin page

**Solution**: User's role in Firestore must be `super_admin`, `admin`, or `editor`.

### Issue: Pages showing blank/404

**Solution**: 
1. Ensure all files are committed to GitHub
2. Check GitHub Pages is enabled in Settings
3. Check branch is `main` and folder is `/ (root)`
4. Deployment can take 1-2 minutes

### Issue: Forms not submitting

**Solution**:
1. Check browser console for errors (F12)
2. Verify Firebase credentials in config.js
3. Ensure Firestore security rules allow writes
4. Check network tab to see API responses

### Issue: Images not loading

**Solution**:
1. Ensure image URLs in Firestore are valid
2. Add image URLs starting with `https://`
3. Use Firebase Storage for images: `uploadFile()` function

---

## 📦 Maintenance

### Regular Tasks

1. **Weekly**: Review new contact submissions
2. **Bi-weekly**: Update programmes and faculty
3. **Monthly**: Export analytics reports
4. **Quarterly**: Review user feedback and analytics

### Backup Data

To backup your Firestore data:

1. Go to Firestore → Settings
2. Scroll to "Backup and export"
3. Click "Export collections"
4. Select all collections
5. Choose destination (Google Cloud Storage)

Or use the admin panel:
- Admin Dashboard → Click "Backup Database" button

---

## 🎯 Next Steps

1. ✅ Complete Firebase setup
2. ✅ Update config.js with your credentials
3. ✅ Create first admin user
4. ✅ Deploy to GitHub Pages
5. ✅ Test all functionality
6. ✅ Create additional pages (programmes detail, profile, etc.)
7. ✅ Set up custom domain (optional)
8. ✅ Configure email notifications (optional)
9. ✅ Add payment processing (Phase 10)
10. ✅ Launch publicly

---

## 📞 Support

For issues or questions:
- Email: support@impactglobalacademy.com
- Check browser console (F12) for error messages
- Review Firestore security rules if data not saving
- Verify Firebase credentials in config.js

---

## 📄 File Structure

```
impact-global-academy/
├── index.html                  # Homepage
├── about.html                  # About page
├── contact.html                # Contact form
├── login.html                  # Sign in
├── register.html               # Sign up
├── style.css                   # Main styles
├── script.js                   # Main interactions
├── api.js                      # Firebase functions
├── config.js                   # Firebase config (UPDATE THIS)
├── admin/
│   ├── index.html              # Admin dashboard
│   ├── admin-style.css         # Admin styles
│   ├── admin-script.js         # Admin interactions
│   └── admin-api.js            # Admin functions
├── SETUP_GUIDE.md              # This file
└── DEPLOYMENT.md               # Deployment guide
```

---

## 🔄 Version History

- **v1.0.0** (2024-09-17): Initial release
  - Complete website with Firebase backend
  - Admin dashboard with full CRUD operations
  - User authentication
  - Responsive design

---

**Last Updated**: September 17, 2024
**Maintained By**: IMPACT Global Academy
**Firebase SDK Version**: 9.22.0
