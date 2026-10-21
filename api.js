/**
 * IMPACT Global Academy - API Functions
 * =====================================
 * 
 * Handles all Firebase operations:
 * - Authentication
 * - Database queries
 * - Storage uploads
 * - Real-time listeners
 */

/* ============================================================================
   AUTHENTICATION
   ============================================================================ */

/**
 * Register new user
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {string} fullName - User full name
 * @returns {Promise<Object>} User data
 */
async function registerUser(email, password, fullName) {
  try {
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;

    // Create user profile in Firestore
    await db.collection(COLLECTIONS.USERS).doc(user.uid).set({
      uid: user.uid,
      email: email,
      fullName: fullName,
      role: USER_ROLES.USER,
      createdAt: new Date(),
      updatedAt: new Date(),
      avatar: null,
      bio: '',
      phone: ''
    });

    // Send verification email
    await user.sendEmailVerification();

    return { success: true, user: user, message: 'Registration successful. Please verify your email.' };
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Login user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} User data
 */
async function loginUser(email, password) {
  try {
    const userCredential = await auth.signInWithEmailAndPassword(email, password);
    const user = userCredential.user;

    if (!user.emailVerified) {
      return { success: false, error: 'Please verify your email before logging in.' };
    }

    return { success: true, user: user };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Logout user
 * @returns {Promise<Object>}
 */
async function logoutUser() {
  try {
    await auth.signOut();
    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Send password reset email
 * @param {string} email - User email
 * @returns {Promise<Object>}
 */
async function resetPassword(email) {
  try {
    await auth.sendPasswordResetEmail(email);
    return { success: true, message: 'Password reset email sent. Check your inbox.' };
  } catch (error) {
    console.error('Password reset error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get current user
 * @returns {Promise<Object|null>} Current user or null
 */
async function getCurrentUser() {
  return new Promise((resolve) => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      unsubscribe();
      if (user) {
        const userDoc = await db.collection(COLLECTIONS.USERS).doc(user.uid).get();
        resolve({ ...user, ...userDoc.data() });
      } else {
        resolve(null);
      }
    });
  });
}

/**
 * Google Sign-in
 * @returns {Promise<Object>}
 */
async function googleSignIn() {
  try {
    const provider = new firebase.auth.GoogleAuthProvider();
    const result = await auth.signInWithPopup(provider);
    const user = result.user;

    // Create or update user profile
    const userDoc = await db.collection(COLLECTIONS.USERS).doc(user.uid).get();
    if (!userDoc.exists) {
      await db.collection(COLLECTIONS.USERS).doc(user.uid).set({
        uid: user.uid,
        email: user.email,
        fullName: user.displayName,
        role: USER_ROLES.USER,
        createdAt: new Date(),
        updatedAt: new Date(),
        avatar: user.photoURL,
        bio: '',
        phone: ''
      });
    }

    return { success: true, user: user };
  } catch (error) {
    console.error('Google sign-in error:', error);
    return { success: false, error: error.message };
  }
}

/* ============================================================================
   PROGRAMMES
   ============================================================================ */

/**
 * Get all published programmes
 * @returns {Promise<Array>} Array of programmes
 */
async function getProgrammes() {
  try {
    const snapshot = await db.collection(COLLECTIONS.PROGRAMMES)
      .where('status', '==', 'published')
      .orderBy('featured', 'desc')
      .orderBy('createdAt', 'desc')
      .get();

    const programmes = [];
    snapshot.forEach(doc => {
      programmes.push({ id: doc.id, ...doc.data() });
    });

    return { success: true, data: programmes };
  } catch (error) {
    console.error('Error fetching programmes:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get single programme by ID
 * @param {string} id - Programme ID
 * @returns {Promise<Object>} Programme data
 */
async function getProgrammeById(id) {
  try {
    const doc = await db.collection(COLLECTIONS.PROGRAMMES).doc(id).get();
    if (!doc.exists) {
      return { success: false, error: 'Programme not found' };
    }
    return { success: true, data: { id: doc.id, ...doc.data() } };
  } catch (error) {
    console.error('Error fetching programme:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Create programme (admin only)
 * @param {Object} programmeData - Programme data
 * @returns {Promise<Object>}
 */
async function createProgramme(programmeData) {
  try {
    const user = await getCurrentUser();
    if (!user || ![USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.EDITOR].includes(user.role)) {
      return { success: false, error: 'Unauthorized' };
    }

    const docRef = await db.collection(COLLECTIONS.PROGRAMMES).add({
      ...programmeData,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: user.uid
    });

    return { success: true, id: docRef.id, message: 'Programme created successfully' };
  } catch (error) {
    console.error('Error creating programme:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Update programme (admin only)
 * @param {string} id - Programme ID
 * @param {Object} updates - Updated fields
 * @returns {Promise<Object>}
 */
async function updateProgramme(id, updates) {
  try {
    const user = await getCurrentUser();
    if (!user || ![USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.EDITOR].includes(user.role)) {
      return { success: false, error: 'Unauthorized' };
    }

    await db.collection(COLLECTIONS.PROGRAMMES).doc(id).update({
      ...updates,
      updatedAt: new Date(),
      updatedBy: user.uid
    });

    return { success: true, message: 'Programme updated successfully' };
  } catch (error) {
    console.error('Error updating programme:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Delete programme (admin only)
 * @param {string} id - Programme ID
 * @returns {Promise<Object>}
 */
async function deleteProgramme(id) {
  try {
    const user = await getCurrentUser();
    if (user.role !== USER_ROLES.SUPER_ADMIN) {
      return { success: false, error: 'Unauthorized' };
    }

    await db.collection(COLLECTIONS.PROGRAMMES).doc(id).delete();
    return { success: true, message: 'Programme deleted successfully' };
  } catch (error) {
    console.error('Error deleting programme:', error);
    return { success: false, error: error.message };
  }
}

/* ============================================================================
   ENROLMENTS
   ============================================================================ */

/**
 * Enrol user in programme
 * @param {string} programmeId - Programme ID
 * @returns {Promise<Object>}
 */
async function enrolInProgramme(programmeId) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'Please log in to enrol' };
    }

    // Check if already enrolled
    const existing = await db.collection(COLLECTIONS.ENROLMENTS)
      .where('userId', '==', user.uid)
      .where('programmeId', '==', programmeId)
      .get();

    if (!existing.empty) {
      return { success: false, error: 'You are already enrolled in this programme' };
    }

    // Create enrolment
    await db.collection(COLLECTIONS.ENROLMENTS).add({
      userId: user.uid,
      programmeId: programmeId,
      status: 'active',
      enrolledAt: new Date(),
      completedAt: null
    });

    return { success: true, message: 'Successfully enrolled in programme' };
  } catch (error) {
    console.error('Error enrolling in programme:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get user enrolments
 * @returns {Promise<Array>}
 */
async function getUserEnrolments() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'Not logged in' };
    }

    const snapshot = await db.collection(COLLECTIONS.ENROLMENTS)
      .where('userId', '==', user.uid)
      .where('status', '==', 'active')
      .get();

    const enrolments = [];
    for (const doc of snapshot.docs) {
      const programme = await db.collection(COLLECTIONS.PROGRAMMES).doc(doc.data().programmeId).get();
      enrolments.push({
        id: doc.id,
        ...doc.data(),
        programme: { id: programme.id, ...programme.data() }
      });
    }

    return { success: true, data: enrolments };
  } catch (error) {
    console.error('Error fetching enrolments:', error);
    return { success: false, error: error.message };
  }
}

/* ============================================================================
   FACULTY
   ============================================================================ */

/**
 * Get all faculty
 * @returns {Promise<Array>}
 */
async function getFaculty() {
  try {
    const snapshot = await db.collection(COLLECTIONS.FACULTY)
      .orderBy('createdAt', 'desc')
      .get();

    const faculty = [];
    snapshot.forEach(doc => {
      faculty.push({ id: doc.id, ...doc.data() });
    });

    return { success: true, data: faculty };
  } catch (error) {
    console.error('Error fetching faculty:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Create faculty member (admin only)
 * @param {Object} facultyData - Faculty data
 * @returns {Promise<Object>}
 */
async function createFaculty(facultyData) {
  try {
    const user = await getCurrentUser();
    if (!user || ![USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.EDITOR].includes(user.role)) {
      return { success: false, error: 'Unauthorized' };
    }

    const docRef = await db.collection(COLLECTIONS.FACULTY).add({
      ...facultyData,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return { success: true, id: docRef.id, message: 'Faculty member created' };
  } catch (error) {
    console.error('Error creating faculty:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Update faculty member (admin only)
 * @param {string} id - Faculty ID
 * @param {Object} updates - Updated fields
 * @returns {Promise<Object>}
 */
async function updateFaculty(id, updates) {
  try {
    const user = await getCurrentUser();
    if (!user || ![USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.EDITOR].includes(user.role)) {
      return { success: false, error: 'Unauthorized' };
    }

    await db.collection(COLLECTIONS.FACULTY).doc(id).update({
      ...updates,
      updatedAt: new Date()
    });

    return { success: true, message: 'Faculty member updated' };
  } catch (error) {
    console.error('Error updating faculty:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Delete faculty member (admin only)
 * @param {string} id - Faculty ID
 * @returns {Promise<Object>}
 */
async function deleteFaculty(id) {
  try {
    const user = await getCurrentUser();
    if (user.role !== USER_ROLES.SUPER_ADMIN) {
      return { success: false, error: 'Unauthorized' };
    }

    await db.collection(COLLECTIONS.FACULTY).doc(id).delete();
    return { success: true, message: 'Faculty member deleted' };
  } catch (error) {
    console.error('Error deleting faculty:', error);
    return { success: false, error: error.message };
  }
}

/* ============================================================================
   EVENTS
   ============================================================================ */

/**
 * Get all events
 * @returns {Promise<Array>}
 */
async function getEvents() {
  try {
    const snapshot = await db.collection(COLLECTIONS.EVENTS)
      .orderBy('eventDate', 'desc')
      .get();

    const events = [];
    snapshot.forEach(doc => {
      events.push({ id: doc.id, ...doc.data() });
    });

    return { success: true, data: events };
  } catch (error) {
    console.error('Error fetching events:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Create event (admin only)
 * @param {Object} eventData - Event data
 * @returns {Promise<Object>}
 */
async function createEvent(eventData) {
  try {
    const user = await getCurrentUser();
    if (!user || ![USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.EDITOR].includes(user.role)) {
      return { success: false, error: 'Unauthorized' };
    }

    const docRef = await db.collection(COLLECTIONS.EVENTS).add({
      ...eventData,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return { success: true, id: docRef.id, message: 'Event created' };
  } catch (error) {
    console.error('Error creating event:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Update event (admin only)
 * @param {string} id - Event ID
 * @param {Object} updates - Updated fields
 * @returns {Promise<Object>}
 */
async function updateEvent(id, updates) {
  try {
    const user = await getCurrentUser();
    if (!user || ![USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.EDITOR].includes(user.role)) {
      return { success: false, error: 'Unauthorized' };
    }

    await db.collection(COLLECTIONS.EVENTS).doc(id).update({
      ...updates,
      updatedAt: new Date()
    });

    return { success: true, message: 'Event updated' };
  } catch (error) {
    console.error('Error updating event:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Delete event (admin only)
 * @param {string} id - Event ID
 * @returns {Promise<Object>}
 */
async function deleteEvent(id) {
  try {
    const user = await getCurrentUser();
    if (user.role !== USER_ROLES.SUPER_ADMIN) {
      return { success: false, error: 'Unauthorized' };
    }

    await db.collection(COLLECTIONS.EVENTS).doc(id).delete();
    return { success: true, message: 'Event deleted' };
  } catch (error) {
    console.error('Error deleting event:', error);
    return { success: false, error: error.message };
  }
}

/* ============================================================================
   RESOURCES
   ============================================================================ */

/**
 * Get all resources
 * @param {string} category - Optional category filter
 * @returns {Promise<Array>}
 */
async function getResources(category = null) {
  try {
    let query = db.collection(COLLECTIONS.RESOURCES);
    
    if (category) {
      query = query.where('category', '==', category);
    }

    const snapshot = await query.orderBy('createdAt', 'desc').get();

    const resources = [];
    snapshot.forEach(doc => {
      resources.push({ id: doc.id, ...doc.data() });
    });

    return { success: true, data: resources };
  } catch (error) {
    console.error('Error fetching resources:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Create resource (admin only)
 * @param {Object} resourceData - Resource data
 * @returns {Promise<Object>}
 */
async function createResource(resourceData) {
  try {
    const user = await getCurrentUser();
    if (!user || ![USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.EDITOR].includes(user.role)) {
      return { success: false, error: 'Unauthorized' };
    }

    const docRef = await db.collection(COLLECTIONS.RESOURCES).add({
      ...resourceData,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return { success: true, id: docRef.id, message: 'Resource created' };
  } catch (error) {
    console.error('Error creating resource:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Update resource (admin only)
 * @param {string} id - Resource ID
 * @param {Object} updates - Updated fields
 * @returns {Promise<Object>}
 */
async function updateResource(id, updates) {
  try {
    const user = await getCurrentUser();
    if (!user || ![USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.EDITOR].includes(user.role)) {
      return { success: false, error: 'Unauthorized' };
    }

    await db.collection(COLLECTIONS.RESOURCES).doc(id).update({
      ...updates,
      updatedAt: new Date()
    });

    return { success: true, message: 'Resource updated' };
  } catch (error) {
    console.error('Error updating resource:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Delete resource (admin only)
 * @param {string} id - Resource ID
 * @returns {Promise<Object>}
 */
async function deleteResource(id) {
  try {
    const user = await getCurrentUser();
    if (user.role !== USER_ROLES.SUPER_ADMIN) {
      return { success: false, error: 'Unauthorized' };
    }

    await db.collection(COLLECTIONS.RESOURCES).doc(id).delete();
    return { success: true, message: 'Resource deleted' };
  } catch (error) {
    console.error('Error deleting resource:', error);
    return { success: false, error: error.message };
  }
}

/* ============================================================================
   IMPACT STORIES
   ============================================================================ */

/**
 * Get published impact stories
 * @returns {Promise<Array>}
 */
async function getImpactStories() {
  try {
    const snapshot = await db.collection(COLLECTIONS.IMPACT_STORIES)
      .where('published', '==', true)
      .orderBy('createdAt', 'desc')
      .get();

    const stories = [];
    snapshot.forEach(doc => {
      stories.push({ id: doc.id, ...doc.data() });
    });

    return { success: true, data: stories };
  } catch (error) {
    console.error('Error fetching impact stories:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Create impact story (admin only)
 * @param {Object} storyData - Story data
 * @returns {Promise<Object>}
 */
async function createImpactStory(storyData) {
  try {
    const user = await getCurrentUser();
    if (!user || ![USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.EDITOR].includes(user.role)) {
      return { success: false, error: 'Unauthorized' };
    }

    const docRef = await db.collection(COLLECTIONS.IMPACT_STORIES).add({
      ...storyData,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return { success: true, id: docRef.id, message: 'Impact story created' };
  } catch (error) {
    console.error('Error creating impact story:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Update impact story (admin only)
 * @param {string} id - Story ID
 * @param {Object} updates - Updated fields
 * @returns {Promise<Object>}
 */
async function updateImpactStory(id, updates) {
  try {
    const user = await getCurrentUser();
    if (!user || ![USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.EDITOR].includes(user.role)) {
      return { success: false, error: 'Unauthorized' };
    }

    await db.collection(COLLECTIONS.IMPACT_STORIES).doc(id).update({
      ...updates,
      updatedAt: new Date()
    });

    return { success: true, message: 'Impact story updated' };
  } catch (error) {
    console.error('Error updating impact story:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Delete impact story (admin only)
 * @param {string} id - Story ID
 * @returns {Promise<Object>}
 */
async function deleteImpactStory(id) {
  try {
    const user = await getCurrentUser();
    if (user.role !== USER_ROLES.SUPER_ADMIN) {
      return { success: false, error: 'Unauthorized' };
    }

    await db.collection(COLLECTIONS.IMPACT_STORIES).doc(id).delete();
    return { success: true, message: 'Impact story deleted' };
  } catch (error) {
    console.error('Error deleting impact story:', error);
    return { success: false, error: error.message };
  }
}

/* ============================================================================
   NEWSLETTER
   ============================================================================ */

/**
 * Subscribe to newsletter
 * @param {string} email - Email address
 * @param {string} fullName - Full name (optional)
 * @returns {Promise<Object>}
 */
async function subscribeNewsletter(email, fullName = '') {
  try {
    // Check if already subscribed
    const existing = await db.collection(COLLECTIONS.NEWSLETTER)
      .where('email', '==', email)
      .get();

    if (!existing.empty) {
      return { success: false, error: 'This email is already subscribed' };
    }

    await db.collection(COLLECTIONS.NEWSLETTER).add({
      email: email,
      fullName: fullName,
      subscribedAt: new Date(),
      unsubscribedAt: null
    });

    return { success: true, message: 'Successfully subscribed to newsletter' };
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Unsubscribe from newsletter
 * @param {string} email - Email address
 * @returns {Promise<Object>}
 */
async function unsubscribeNewsletter(email) {
  try {
    const snapshot = await db.collection(COLLECTIONS.NEWSLETTER)
      .where('email', '==', email)
      .get();

    if (snapshot.empty) {
      return { success: false, error: 'Email not found' };
    }

    snapshot.forEach(doc => {
      doc.ref.update({ unsubscribedAt: new Date() });
    });

    return { success: true, message: 'Successfully unsubscribed from newsletter' };
  } catch (error) {
    console.error('Error unsubscribing from newsletter:', error);
    return { success: false, error: error.message };
  }
}

/* ============================================================================
   CONTACT SUBMISSIONS
   ============================================================================ */

/**
 * Submit contact form
 * @param {Object} formData - Form data (name, email, subject, message)
 * @returns {Promise<Object>}
 */
async function submitContactForm(formData) {
  try {
    // Validate input
    if (!formData.name || !formData.email || !formData.message) {
      return { success: false, error: 'Please fill in all required fields' };
    }

    const docRef = await db.collection(COLLECTIONS.CONTACT_SUBMISSIONS).add({
      name: formData.name,
      email: formData.email,
      phone: formData.phone || '',
      subject: formData.subject || 'General Inquiry',
      message: formData.message,
      submittedAt: new Date(),
      status: 'new',
      read: false
    });

    return { success: true, id: docRef.id, message: 'Thank you for your message. We will get back to you soon.' };
  } catch (error) {
    console.error('Error submitting contact form:', error);
    return { success: false, error: error.message };
  }
}

/* ============================================================================
   FILE UPLOADS
   ============================================================================ */

/**
 * Upload file to Firebase Storage
 * @param {File} file - File to upload
 * @param {string} path - Storage path (e.g., 'programmes/images/')
 * @returns {Promise<Object>}
 */
async function uploadFile(file, path = 'uploads/') {
  try {
    if (!file) {
      return { success: false, error: 'No file selected' };
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return { success: false, error: 'File size must be less than 5MB' };
    }

    const fileName = `${Date.now()}_${file.name}`;
    const storageRef = storage.ref(`${path}${fileName}`);
    const snapshot = await storageRef.put(file);
    const downloadUrl = await snapshot.ref.getDownloadURL();

    return { success: true, url: downloadUrl, fileName: fileName };
  } catch (error) {
    console.error('Error uploading file:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Delete file from Firebase Storage
 * @param {string} fileName - File name
 * @param {string} path - Storage path
 * @returns {Promise<Object>}
 */
async function deleteFile(fileName, path = 'uploads/') {
  try {
    const storageRef = storage.ref(`${path}${fileName}`);
    await storageRef.delete();
    return { success: true, message: 'File deleted successfully' };
  } catch (error) {
    console.error('Error deleting file:', error);
    return { success: false, error: error.message };
  }
}

/* ============================================================================
   USER PROFILE
   ============================================================================ */

/**
 * Update user profile
 * @param {Object} updates - Profile updates
 * @returns {Promise<Object>}
 */
async function updateUserProfile(updates) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'Not logged in' };
    }

    await db.collection(COLLECTIONS.USERS).doc(user.uid).update({
      ...updates,
      updatedAt: new Date()
    });

    return { success: true, message: 'Profile updated successfully' };
  } catch (error) {
    console.error('Error updating profile:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get user profile
 * @param {string} userId - User ID
 * @returns {Promise<Object>}
 */
async function getUserProfile(userId) {
  try {
    const doc = await db.collection(COLLECTIONS.USERS).doc(userId).get();
    if (!doc.exists) {
      return { success: false, error: 'User not found' };
    }
    return { success: true, data: { id: doc.id, ...doc.data() } };
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return { success: false, error: error.message };
  }
}

/* ============================================================================
   SEARCH & FILTERING
   ============================================================================ */

/**
 * Search programmes
 * @param {string} query - Search query
 * @returns {Promise<Array>}
 */
async function searchProgrammes(query) {
  try {
    // Firestore doesn't support full-text search natively
    // This is a client-side search - for production, consider Algolia
    const snapshot = await db.collection(COLLECTIONS.PROGRAMMES)
      .where('status', '==', 'published')
      .get();

    const results = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      const searchText = `${data.title} ${data.description}`.toLowerCase();
      if (searchText.includes(query.toLowerCase())) {
        results.push({ id: doc.id, ...data });
      }
    });

    return { success: true, data: results };
  } catch (error) {
    console.error('Error searching programmes:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get programmes by category
 * @param {string} category - Category name
 * @returns {Promise<Array>}
 */
async function getProgrammesByCategory(category) {
  try {
    const snapshot = await db.collection(COLLECTIONS.PROGRAMMES)
      .where('status', '==', 'published')
      .where('category', '==', category)
      .orderBy('featured', 'desc')
      .get();

    const programmes = [];
    snapshot.forEach(doc => {
      programmes.push({ id: doc.id, ...doc.data() });
    });

    return { success: true, data: programmes };
  } catch (error) {
    console.error('Error fetching programmes by category:', error);
    return { success: false, error: error.message };
  }
}

/* ============================================================================
   ANALYTICS
   ============================================================================ */

/**
 * Get analytics data (admin only)
 * @returns {Promise<Object>}
 */
async function getAnalytics() {
  try {
    const user = await getCurrentUser();
    if (!user || ![USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN].includes(user.role)) {
      return { success: false, error: 'Unauthorized' };
    }

    const usersSnapshot = await db.collection(COLLECTIONS.USERS).get();
    const enrollmentsSnapshot = await db.collection(COLLECTIONS.ENROLMENTS).get();
    const programmeSnapshot = await db.collection(COLLECTIONS.PROGRAMMES).get();
    const contactSnapshot = await db.collection(COLLECTIONS.CONTACT_SUBMISSIONS).get();

    return {
      success: true,
      data: {
        totalUsers: usersSnapshot.size,
        totalEnrolments: enrollmentsSnapshot.size,
        totalProgrammes: programmeSnapshot.size,
        contactSubmissions: contactSnapshot.size
      }
    };
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return { success: false, error: error.message };
  }
}

/* ============================================================================
   EXPORT FOR ADMIN
   ============================================================================ */

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    registerUser, loginUser, logoutUser, resetPassword, getCurrentUser, googleSignIn,
    getProgrammes, getProgrammeById, createProgramme, updateProgramme, deleteProgramme,
    enrolInProgramme, getUserEnrolments,
    getFaculty, createFaculty, updateFaculty, deleteFaculty,
    getEvents, createEvent, updateEvent, deleteEvent,
    getResources, createResource, updateResource, deleteResource,
    getImpactStories, createImpactStory, updateImpactStory, deleteImpactStory,
    subscribeNewsletter, unsubscribeNewsletter,
    submitContactForm,
    uploadFile, deleteFile,
    updateUserProfile, getUserProfile,
    searchProgrammes, getProgrammesByCategory,
    getAnalytics
  };
}
