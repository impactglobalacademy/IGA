/**
 * IMPACT Global Academy - Admin API Functions
 * ============================================
 * 
 * Additional admin-specific API calls
 */

/**
 * Get all users (admin only)
 */
async function getAllUsers() {
  try {
    const user = await getCurrentUser();
    if (!user || ![USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN].includes(user.role)) {
      return { success: false, error: 'Unauthorized' };
    }

    const snapshot = await db.collection(COLLECTIONS.USERS)
      .orderBy('createdAt', 'desc')
      .get();

    const users = [];
    snapshot.forEach(doc => {
      users.push({ id: doc.id, ...doc.data() });
    });

    return { success: true, data: users };
  } catch (error) {
    console.error('Error fetching users:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Update user role (super admin only)
 */
async function updateUserRole(userId, newRole) {
  try {
    const user = await getCurrentUser();
    if (user.role !== USER_ROLES.SUPER_ADMIN) {
      return { success: false, error: 'Unauthorized - Super Admin only' };
    }

    await db.collection(COLLECTIONS.USERS).doc(userId).update({
      role: newRole,
      updatedAt: new Date()
    });

    return { success: true, message: 'User role updated' };
  } catch (error) {
    console.error('Error updating user role:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Delete user (super admin only)
 */
async function deleteUser(userId) {
  try {
    const user = await getCurrentUser();
    if (user.role !== USER_ROLES.SUPER_ADMIN) {
      return { success: false, error: 'Unauthorized - Super Admin only' };
    }

    await db.collection(COLLECTIONS.USERS).doc(userId).delete();
    return { success: true, message: 'User deleted' };
  } catch (error) {
    console.error('Error deleting user:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get all contact submissions (admin only)
 */
async function getAllContactSubmissions() {
  try {
    const user = await getCurrentUser();
    if (!user || ![USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN].includes(user.role)) {
      return { success: false, error: 'Unauthorized' };
    }

    const snapshot = await db.collection(COLLECTIONS.CONTACT_SUBMISSIONS)
      .orderBy('submittedAt', 'desc')
      .get();

    const submissions = [];
    snapshot.forEach(doc => {
      submissions.push({ id: doc.id, ...doc.data() });
    });

    return { success: true, data: submissions };
  } catch (error) {
    console.error('Error fetching contact submissions:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Mark contact submission as read
 */
async function markContactAsRead(submissionId) {
  try {
    const user = await getCurrentUser();
    if (!user || ![USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN].includes(user.role)) {
      return { success: false, error: 'Unauthorized' };
    }

    await db.collection(COLLECTIONS.CONTACT_SUBMISSIONS).doc(submissionId).update({
      read: true,
      readAt: new Date()
    });

    return { success: true, message: 'Marked as read' };
  } catch (error) {
    console.error('Error marking as read:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Delete contact submission
 */
async function deleteContactSubmission(submissionId) {
  try {
    const user = await getCurrentUser();
    if (!user || ![USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN].includes(user.role)) {
      return { success: false, error: 'Unauthorized' };
    }

    await db.collection(COLLECTIONS.CONTACT_SUBMISSIONS).doc(submissionId).delete();
    return { success: true, message: 'Submission deleted' };
  } catch (error) {
    console.error('Error deleting submission:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get all newsletter subscribers (admin only)
 */
async function getAllNewsletterSubscribers() {
  try {
    const user = await getCurrentUser();
    if (!user || ![USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN].includes(user.role)) {
      return { success: false, error: 'Unauthorized' };
    }

    const snapshot = await db.collection(COLLECTIONS.NEWSLETTER)
      .orderBy('subscribedAt', 'desc')
      .get();

    const subscribers = [];
    snapshot.forEach(doc => {
      subscribers.push({ id: doc.id, ...doc.data() });
    });

    return { success: true, data: subscribers };
  } catch (error) {
    console.error('Error fetching newsletter subscribers:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Export data to CSV
 */
function exportToCSV(data, filename) {
  if (!data || data.length === 0) {
    alert('No data to export');
    return;
  }

  // Get headers from first object
  const headers = Object.keys(data[0]);
  
  // Create CSV content
  let csvContent = headers.join(',') + '\n';
  data.forEach(row => {
    const values = headers.map(header => {
      const value = row[header];
      // Handle strings with commas
      if (typeof value === 'string' && value.includes(',')) {
        return `"${value}"`;
      }
      return value || '';
    });
    csvContent += values.join(',') + '\n';
  });

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

/**
 * Get admin statistics
 */
async function getAdminStatistics() {
  try {
    const user = await getCurrentUser();
    if (!user || ![USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN].includes(user.role)) {
      return { success: false, error: 'Unauthorized' };
    }

    const usersSnapshot = await db.collection(COLLECTIONS.USERS).get();
    const programmesSnapshot = await db.collection(COLLECTIONS.PROGRAMMES).get();
    const enrollmentsSnapshot = await db.collection(COLLECTIONS.ENROLMENTS).get();
    const contactSnapshot = await db.collection(COLLECTIONS.CONTACT_SUBMISSIONS).get();
    const newsletterSnapshot = await db.collection(COLLECTIONS.NEWSLETTER).get();

    // Calculate derived metrics
    const activeSubscribers = newsletterSnapshot.docs.filter(doc => !doc.data().unsubscribedAt).length;
    const unreadMessages = contactSnapshot.docs.filter(doc => !doc.data().read).length;
    const publishedProgrammes = programmesSnapshot.docs.filter(doc => doc.data().status === 'published').length;

    return {
      success: true,
      data: {
        totalUsers: usersSnapshot.size,
        totalProgrammes: programmesSnapshot.size,
        publishedProgrammes: publishedProgrammes,
        totalEnrolments: enrollmentsSnapshot.size,
        contactSubmissions: contactSnapshot.size,
        unreadMessages: unreadMessages,
        newsletterSubscribers: newsletterSnapshot.size,
        activeSubscribers: activeSubscribers
      }
    };
  } catch (error) {
    console.error('Error getting admin statistics:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Generate report
 */
async function generateReport(reportType) {
  try {
    const user = await getCurrentUser();
    if (!user || ![USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN].includes(user.role)) {
      return { success: false, error: 'Unauthorized' };
    }

    let data = [];

    switch(reportType) {
      case 'programmes':
        const progResult = await getProgrammes();
        data = progResult.success ? progResult.data : [];
        exportToCSV(data, 'programmes-report');
        break;

      case 'enrollments':
        const enrollResult = await db.collection(COLLECTIONS.ENROLMENTS).get();
        data = enrollResult.docs.map(doc => doc.data());
        exportToCSV(data, 'enrollments-report');
        break;

      case 'newsletter':
        const subsResult = await getAllNewsletterSubscribers();
        data = subsResult.success ? subsResult.data : [];
        exportToCSV(data, 'newsletter-subscribers');
        break;

      case 'contacts':
        const contactResult = await getAllContactSubmissions();
        data = contactResult.success ? contactResult.data : [];
        exportToCSV(data, 'contact-submissions');
        break;
    }

    return { success: true, message: 'Report generated and downloaded' };
  } catch (error) {
    console.error('Error generating report:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Backup database (export all data)
 */
async function backupDatabase() {
  try {
    const user = await getCurrentUser();
    if (user.role !== USER_ROLES.SUPER_ADMIN) {
      return { success: false, error: 'Unauthorized - Super Admin only' };
    }

    const backup = {};

    // Get all collections
    for (const [collection, name] of Object.entries(COLLECTIONS)) {
      const snapshot = await db.collection(name).get();
      backup[name] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    }

    // Create JSON file
    const json = JSON.stringify(backup, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `iga-backup-${new Date().toISOString()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    return { success: true, message: 'Database backup created' };
  } catch (error) {
    console.error('Error creating backup:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Audit log - track admin actions
 */
async function logAdminAction(action, details) {
  try {
    const user = await getCurrentUser();
    if (!user) return;

    await db.collection('admin_logs').add({
      adminId: user.uid,
      adminName: user.fullName || user.email,
      action: action,
      details: details,
      timestamp: new Date(),
      ipAddress: null // Would need backend to capture
    });
  } catch (error) {
    console.error('Error logging admin action:', error);
  }
}

/**
 * Get audit logs (super admin only)
 */
async function getAuditLogs(limit = 100) {
  try {
    const user = await getCurrentUser();
    if (user.role !== USER_ROLES.SUPER_ADMIN) {
      return { success: false, error: 'Unauthorized' };
    }

    const snapshot = await db.collection('admin_logs')
      .orderBy('timestamp', 'desc')
      .limit(limit)
      .get();

    const logs = [];
    snapshot.forEach(doc => {
      logs.push({ id: doc.id, ...doc.data() });
    });

    return { success: true, data: logs };
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    return { success: false, error: error.message };
  }
}
