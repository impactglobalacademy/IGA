# 🚀 IMPACT Global Academy - Launch Checklist
## Get Your Website Live in 48 Hours

**Status**: Phase 1 Complete | Ready for Immediate Deployment  
**Timeline**: Friday → Live by Sunday Evening  
**Effort**: 3-4 hours active work

---

## 📋 Pre-Launch Setup (6 Steps | ~2 hours)

### ✅ Step 1: Create Firebase Project (15 min)
- [ ] Go to [Firebase Console](https://console.firebase.google.com)
- [ ] Click "Create a project"
- [ ] Project name: `impact-global-academy`
- [ ] Enable Google Analytics (optional)
- [ ] Click "Create project"
- [ ] **Wait 2-3 minutes for project creation**

### ✅ Step 2: Enable Authentication (15 min)
- [ ] Left menu → "Build" → "Authentication"
- [ ] Click "Get started"
- [ ] Enable **Email/Password**:
  - Click "Email/Password" → Toggle Enable → Save
- [ ] Enable **Google**:
  - Click "Google" → Toggle Enable
  - Support email: your-email@example.com
  - Project public name: `IMPACT Global Academy`
  - Click "Save"

### ✅ Step 3: Create Firestore Database (10 min)
- [ ] Left menu → "Build" → "Firestore Database"
- [ ] Click "Create database"
- [ ] Region: `europe-west1` (or closest to Lagos)
- [ ] Mode: "Start in production mode"
- [ ] Click "Create"
- [ ] **Wait 1-2 minutes for database creation**

### ✅ Step 4: Set Security Rules (10 min)
- [ ] Go to "Rules" tab in Firestore
- [ ] **Copy full rules from SETUP_GUIDE.md (section "Set Up Firestore Security Rules")**
- [ ] Paste all 60 lines of rules
- [ ] Click "Publish"

### ✅ Step 5: Enable Cloud Storage (10 min)
- [ ] Left menu → "Build" → "Storage"
- [ ] Click "Get started"
- [ ] Mode: "Production mode"
- [ ] Region: Same as Firestore
- [ ] Click "Done"

### ✅ Step 6: Get Firebase Credentials (5 min)
- [ ] Left menu → "Project settings" (gear icon) → "General"
- [ ] Scroll to "Your apps" section
- [ ] If no web app exists: Click "Web" icon to add
- [ ] Copy the **entire `firebaseConfig` object**
  ```javascript
  const firebaseConfig = {
    apiKey: "...",
    authDomain: "...",
    projectId: "...",
    storageBucket: "...",
    messagingSenderId: "...",
    appId: "..."
  };
  ```
- [ ] **Keep this safe** (you'll need it next)

---

## 🔑 Configuration (2 Steps | ~10 min)

### ✅ Step 7: Update config.js
- [ ] Open file: `/config.js`
- [ ] Find the `firebaseConfig` placeholder (around line 5)
- [ ] **Replace the entire firebaseConfig object with yours from Step 6**
- [ ] Save file
- [ ] Done! ✅

### ✅ Step 8: Create First Admin User (10 min)
1. Go back to Firebase Console
2. Left menu → "Build" → "Authentication"
3. Click "Users" tab
4. Click "Add user" button
5. Email: `your-email@example.com` (your real email)
6. Password: Create a strong password (save it!)
7. Click "Add user"
8. **Note the UID** (shown in user list)

Now set as admin in Firestore:
9. Left menu → "Firestore Database"
10. Click "Create collection"
11. Collection ID: `users`
12. Click "Next"
13. Document ID: `[paste the UID from step 8]`
14. Add fields:
    - `email` (string): your-email@example.com
    - `fullName` (string): Your Name
    - `role` (string): `super_admin`
    - `createdAt` (timestamp): current date
    - `updatedAt` (timestamp): current date
15. Click "Save"
16. Done! ✅ You're an admin

---

## 🌐 GitHub Setup (3 Steps | ~30 min)

### ✅ Step 9: Initialize Local Git

```bash
# Navigate to your project folder
cd /path/to/impact-global-academy-build

# Initialize git
git init

# Configure git (do this once)
git config user.name "Your Name"
git config user.email "your@email.com"

# Add all files
git add .

# Create first commit
git commit -m "Initial commit: IMPACT Global Academy website - Phase 1"
```

### ✅ Step 10: Create GitHub Repository

1. Go to [GitHub.com](https://github.com)
2. Click "+" icon → "New repository"
3. **Repository name**: `impact-global-academy`
4. **Description**: `Premium leadership development academy website`
5. Choose: Public or Private (your choice)
6. **IMPORTANT**: Do NOT check "Initialize this repository"
7. Click "Create repository"
8. You'll see instructions - follow these:

```bash
# From your local folder:
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/impact-global-academy.git
git push -u origin main
```

Done! Your code is on GitHub ✅

### ✅ Step 11: Enable GitHub Pages

1. On GitHub, go to your repository
2. Click "Settings" (top right)
3. Left menu → "Pages"
4. Under "Source":
   - Branch: Select `main`
   - Folder: Select `/ (root)`
5. Click "Save"
6. **Wait 2-3 minutes**
7. You'll see a message: "Your site is live at: https://YOUR-USERNAME.github.io/impact-global-academy/"

Done! Your site is LIVE ✅✅✅

---

## ✅ Verification (Test Everything | ~30 min)

### Test Public Pages
- [ ] Homepage loads (/)
- [ ] About page loads (/about.html)
- [ ] Contact form loads (/contact.html)
- [ ] All images display correctly
- [ ] Navigation works on mobile (click hamburger menu)

### Test Authentication
- [ ] Can register new account (/register.html)
  - Create test account: testuser@example.com / Test123!
  - Verify email notification (check inbox)
- [ ] Can sign in (/login.html)
  - Sign in with your test account
  - Should redirect to dashboard
- [ ] Can sign in with Google
  - Click "Sign in with Google"
  - Should work if you enabled it properly

### Test Admin Panel
- [ ] Access admin: /admin/index.html
- [ ] Sign in with your admin email
- [ ] Dashboard shows correct stats
- [ ] Can view Programmes section
- [ ] Can view Faculty section

### Test Forms
- [ ] Contact form submission works
  - Fill form and submit
  - Check Firestore `contact_submissions` collection
  - Should see your submission
- [ ] Newsletter subscription works
  - Subscribe to newsletter
  - Check Firestore `newsletter_subscribers`
  - Should see subscriber

### Test Data in Firestore
- [ ] Go to Firebase Console → Firestore
- [ ] Check these collections exist:
  - [ ] `users` (has your admin account)
  - [ ] `contact_submissions` (has test form)
  - [ ] `newsletter_subscribers` (has test subscriber)

---

## 🎯 Post-Launch Setup (Optional | ~1 hour)

### Custom Domain (Optional)
- [ ] Have your domain ready
- [ ] In GitHub Settings → Pages → Custom domain
- [ ] Enter your domain (e.g., impactglobalacademy.com)
- [ ] GitHub shows DNS configuration
- [ ] Update DNS with your domain provider:
  - Add CNAME record pointing to: `YOUR-USERNAME.github.io`
  - Wait 24-48 hours for DNS to propagate

### Add Content (Recommended)
- [ ] Admin → Programmes: Add 2-3 real programmes
- [ ] Admin → Faculty: Add team members
- [ ] Update contact.html with real phone/email
- [ ] Update footer with social media links

---

## 🔄 Daily Launch Day Timeline

### Friday (Preparation Day)
- **9:00 AM**: Complete Steps 1-6 (Firebase setup)
- **10:00 AM**: Update config.js (Step 7)
- **10:15 AM**: Create admin user (Step 8)
- **10:30 AM**: Quick coffee break ☕

### Friday Afternoon (Deployment)
- **2:00 PM**: Setup GitHub (Steps 9-11)
- **2:45 PM**: Wait for GitHub Pages deployment (3-5 min)
- **3:00 PM**: Verify everything works (Step 12)
- **3:30 PM**: 🎉 You're live!

### Saturday Morning (Optional)
- Add real content to admin panel
- Add custom domain if desired
- Share launch with team/community

---

## ⚡ Quick Troubleshooting

### Issue: "Firebase is not defined"
- [ ] Check SCRIPT tags are in correct order
- [ ] Firebase libraries must load BEFORE config.js
- [ ] Refresh browser (Ctrl+Shift+R)

### Issue: Can't sign up (auth error)
- [ ] Check Email/Password is enabled in Firebase Authentication
- [ ] Check you're using correct email format
- [ ] Check Firestore security rules are published

### Issue: Data not saving in Firestore
- [ ] Check security rules (must be published)
- [ ] Check you're signed in with correct user
- [ ] Open browser console (F12) for error messages
- [ ] Compare security rules with SETUP_GUIDE.md

### Issue: Admin login not working
- [ ] Check user document exists in `users` collection
- [ ] Check user has `role: "super_admin"`
- [ ] Check you're using the email you created in Firebase
- [ ] Check Firestore security rules allow admin reads

### Issue: GitHub Pages showing 404
- [ ] Check Settings → Pages has Branch: main, Folder: /
- [ ] Wait 2-3 minutes (deployment takes time)
- [ ] Check all files were pushed to GitHub
- [ ] Check file is named correctly (index.html not Index.html)

---

## 📞 Support Reference

**If you get stuck:**

1. **Check browser console** (F12) for error messages
2. **Check Firebase Console** → Firestore for data
3. **Check GitHub Settings → Pages** for deployment status
4. **Review SETUP_GUIDE.md** "Troubleshooting" section
5. **Verify config.js** has correct Firebase credentials

---

## ✨ Success Indicators

You're successfully launched when:

✅ Homepage loads at your GitHub URL  
✅ Can sign up and log in  
✅ Can sign in with Google  
✅ Contact form saves to Firestore  
✅ Admin can log in  
✅ Admin can see dashboard stats  
✅ Firestore has your test data  

**If all ✅, you're LIVE!** 🎉

---

## 📊 What Comes Next (Phase 2)

After you're live, you can add:
- More public pages (programmes detail, user dashboard)
- Email notifications
- Payment processing
- Blog
- Advanced features

But these are NOT needed for launch. You're ready NOW.

---

## 🎓 Final Note

**You have everything you need.** All 15+ files are production-ready. This checklist will get you live in 48 hours, probably faster.

The hardest part is over. Now it's just connecting the pieces.

**You've got this! 💪**

---

**Estimated Total Time**: 3-4 hours  
**Difficulty Level**: Medium (follow steps exactly)  
**Support Available**: In SETUP_GUIDE.md troubleshooting section

**Let's make IMPACT Global Academy live!** 🚀✨

---

*Checklist version 1.0 | September 17, 2024*
