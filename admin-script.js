/**
 * IMPACT Global Academy - Admin Dashboard Script
 * =============================================
 * 
 * Handles admin dashboard interactions and UI logic
 */

/* ============================================================================
   GLOBAL STATE
   ============================================================================ */

let currentAdminUser = null;
let currentPage = 'dashboard';
let allProgrammes = [];
let allFaculty = [];
let allEvents = [];
let allResources = [];
let allStories = [];
let allContacts = [];
let allUsers = [];
let allSubscribers = [];

/* ============================================================================
   INITIALIZATION
   ============================================================================ */

document.addEventListener('DOMContentLoaded', async () => {
  console.log('🔐 Admin Dashboard loaded');
  
  // Check admin auth status
  await checkAdminAuth();
  
  // Setup navigation
  setupNavigation();
  
  // Setup modals
  setupModals();
  
  // Load dashboard data
  if (currentAdminUser) {
    await loadDashboardData();
  }
});

/* ============================================================================
   AUTHENTICATION
   ============================================================================ */

/**
 * Check admin authentication
 */
async function checkAdminAuth() {
  auth.onAuthStateChanged(async (user) => {
    if (user) {
      const userProfile = await getUserProfile(user.uid);
      if (userProfile.success) {
        const userData = userProfile.data;
        
        // Check if user is admin
        if (userData.role === 'super_admin' || userData.role === 'admin' || userData.role === 'editor') {
          currentAdminUser = { ...user, ...userData };
          document.getElementById('userName').textContent = userData.fullName || userData.email;
          console.log('✅ Admin authenticated:', userData.fullName);
        } else {
          console.error('❌ User is not an admin');
          window.location.href = '/';
        }
      }
    } else {
      // Not authenticated - redirect to admin login
      window.location.href = '/admin/login.html';
    }
  });
}

/**
 * Handle admin logout
 */
async function handleAdminLogout() {
  try {
    showLoadingState('Signing out...');
    const result = await logoutUser();
    if (result.success) {
      currentAdminUser = null;
      showNotification('Signed out successfully', 'success');
      setTimeout(() => {
        window.location.href = '/admin/login.html';
      }, 1500);
    } else {
      showNotification(result.error, 'error');
    }
  } catch (error) {
    console.error('Logout error:', error);
    showNotification('Error logging out', 'error');
  } finally {
    hideLoadingState();
  }
}

/* ============================================================================
   NAVIGATION
   ============================================================================ */

/**
 * Setup navigation handlers
 */
function setupNavigation() {
  const navItems = document.querySelectorAll('.nav-item');
  
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const page = item.dataset.page;
      goToPage(page);
    });
  });
}

/**
 * Navigate to a page
 */
async function goToPage(page) {
  // Hide all pages
  document.querySelectorAll('.admin-page').forEach(p => {
    p.classList.remove('active');
  });
  
  // Show selected page
  const selectedPage = document.getElementById(page);
  if (selectedPage) {
    selectedPage.classList.add('active');
  }
  
  // Update nav items
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
    if (item.dataset.page === page) {
      item.classList.add('active');
    }
  });
  
  // Update page title
  const titles = {
    dashboard: 'Dashboard',
    programmes: 'Manage Programmes',
    faculty: 'Manage Faculty',
    events: 'Manage Events',
    resources: 'Manage Resources',
    'impact-stories': 'Manage Impact Stories',
    contact: 'Contact Submissions',
    users: 'Manage Users',
    newsletter: 'Newsletter Management',
    analytics: 'Analytics Dashboard'
  };
  
  document.getElementById('pageTitle').textContent = titles[page] || 'Dashboard';
  currentPage = page;
  
  // Load page data
  await loadPageData(page);
}

/**
 * Load data for specific page
 */
async function loadPageData(page) {
  try {
    showLoadingState(`Loading ${page}...`);
    
    switch(page) {
      case 'programmes':
        await loadProgrammesData();
        break;
      case 'faculty':
        await loadFacultyData();
        break;
      case 'events':
        await loadEventsData();
        break;
      case 'resources':
        await loadResourcesData();
        break;
      case 'impact-stories':
        await loadStoriesData();
        break;
      case 'contact':
        await loadContactsData();
        break;
      case 'users':
        await loadUsersData();
        break;
      case 'newsletter':
        await loadNewsletterData();
        break;
      case 'analytics':
        await loadAnalyticsData();
        break;
    }
  } catch (error) {
    console.error(`Error loading ${page}:`, error);
    showNotification(`Error loading ${page}`, 'error');
  } finally {
    hideLoadingState();
  }
}

/* ============================================================================
   DASHBOARD
   ============================================================================ */

/**
 * Load dashboard data
 */
async function loadDashboardData() {
  try {
    const result = await getAnalytics();
    
    if (result.success) {
      const { totalUsers, totalEnrolments, totalProgrammes, contactSubmissions } = result.data;
      
      document.getElementById('totalUsers').textContent = totalUsers;
      document.getElementById('totalProgrammes').textContent = totalProgrammes;
      document.getElementById('totalEnrolments').textContent = totalEnrolments;
      document.getElementById('contactSubmissions').textContent = contactSubmissions;
      document.getElementById('lastUpdated').textContent = new Date().toLocaleString();
    }
  } catch (error) {
    console.error('Error loading analytics:', error);
  }
}

/* ============================================================================
   PROGRAMMES MANAGEMENT
   ============================================================================ */

/**
 * Load programmes data
 */
async function loadProgrammesData() {
  try {
    const result = await getProgrammes();
    
    if (result.success) {
      allProgrammes = result.data;
      renderProgrammesTable(allProgrammes);
    }
  } catch (error) {
    console.error('Error loading programmes:', error);
    showNotification('Error loading programmes', 'error');
  }
}

/**
 * Render programmes table
 */
function renderProgrammesTable(programmes) {
  const tbody = document.getElementById('programmesTable');
  
  if (programmes.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: var(--spacing-2xl);">No programmes found</td></tr>';
    return;
  }
  
  tbody.innerHTML = programmes.map(prog => `
    <tr>
      <td><strong>${prog.title}</strong></td>
      <td>${prog.category}</td>
      <td>${prog.durationWeeks} weeks</td>
      <td>$${prog.investmentUsd}</td>
      <td><span class="badge badge-${prog.status === 'published' ? 'success' : 'warning'}">${prog.status}</span></td>
      <td>
        <button class="btn-icon" onclick="editProgramme('${prog.id}')">✎</button>
        <button class="btn-icon delete" onclick="deleteProgramme('${prog.id}')">🗑</button>
      </td>
    </tr>
  `).join('');
}

/**
 * Open programme form
 */
function openProgrammeForm(id = null) {
  const modal = document.getElementById('programmeModal');
  const form = document.getElementById('programmeForm');
  
  if (id) {
    // Edit mode
    const programme = allProgrammes.find(p => p.id === id);
    if (programme) {
      form.programme_id.value = id;
      form.title.value = programme.title;
      form.category.value = programme.category;
      form.shortDescription.value = programme.shortDescription;
      form.description.value = programme.description;
      form.durationWeeks.value = programme.durationWeeks;
      form.investmentUsd.value = programme.investmentUsd;
      form.investmentNgn.value = programme.investmentNgn;
      form.imageUrl.value = programme.imageUrl || '';
      form.status.value = programme.status;
      form.featured.checked = programme.featured || false;
    }
  } else {
    // Create mode
    form.reset();
    form.programme_id.value = '';
  }
  
  openModal('programmeModal');
}

/**
 * Save programme
 */
async function saveProgramme(e) {
  e.preventDefault();
  
  const form = e.target;
  const programmeId = form.programme_id?.value;
  
  const data = {
    title: form.title.value,
    category: form.category.value,
    shortDescription: form.shortDescription.value,
    description: form.description.value,
    durationWeeks: parseInt(form.durationWeeks.value),
    investmentUsd: parseFloat(form.investmentUsd.value),
    investmentNgn: parseFloat(form.investmentNgn.value),
    imageUrl: form.imageUrl.value,
    status: form.status.value,
    featured: form.featured.checked
  };
  
  try {
    showLoadingState('Saving programme...');
    
    let result;
    if (programmeId) {
      result = await updateProgramme(programmeId, data);
    } else {
      result = await createProgramme(data);
    }
    
    if (result.success) {
      showNotification(result.message, 'success');
      closeModal('programmeModal');
      await loadProgrammesData();
    } else {
      showNotification(result.error, 'error');
    }
  } catch (error) {
    console.error('Error saving programme:', error);
    showNotification('Error saving programme', 'error');
  } finally {
    hideLoadingState();
  }
}

/**
 * Edit programme
 */
function editProgramme(id) {
  openProgrammeForm(id);
}

/**
 * Delete programme
 */
async function deleteProgramme(id) {
  if (!confirm('Are you sure you want to delete this programme?')) return;
  
  try {
    showLoadingState('Deleting programme...');
    const result = await deleteProgramme(id);
    
    if (result.success) {
      showNotification(result.message, 'success');
      await loadProgrammesData();
    } else {
      showNotification(result.error, 'error');
    }
  } catch (error) {
    console.error('Error deleting programme:', error);
    showNotification('Error deleting programme', 'error');
  } finally {
    hideLoadingState();
  }
}

/* ============================================================================
   FACULTY MANAGEMENT
   ============================================================================ */

/**
 * Load faculty data
 */
async function loadFacultyData() {
  try {
    const result = await getFaculty();
    
    if (result.success) {
      allFaculty = result.data;
      renderFacultyTable(allFaculty);
    }
  } catch (error) {
    console.error('Error loading faculty:', error);
    showNotification('Error loading faculty', 'error');
  }
}

/**
 * Render faculty table
 */
function renderFacultyTable(faculty) {
  const tbody = document.getElementById('facultyTable');
  
  if (faculty.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: var(--spacing-2xl);">No faculty found</td></tr>';
    return;
  }
  
  tbody.innerHTML = faculty.map(member => `
    <tr>
      <td><strong>${member.name}</strong></td>
      <td>${member.title}</td>
      <td>${member.expertise ? member.expertise.join(', ') : '-'}</td>
      <td>
        <button class="btn-icon" onclick="editFaculty('${member.id}')">✎</button>
        <button class="btn-icon delete" onclick="deleteFaculty('${member.id}')">🗑</button>
      </td>
    </tr>
  `).join('');
}

/**
 * Open faculty form
 */
function openFacultyForm(id = null) {
  openModal('facultyModal');
  if (id) {
    const member = allFaculty.find(f => f.id === id);
    if (member) {
      // Pre-fill form
      console.log('Edit faculty:', member);
    }
  }
}

/**
 * Delete faculty
 */
async function deleteFaculty(id) {
  if (!confirm('Are you sure you want to delete this faculty member?')) return;
  
  try {
    showLoadingState('Deleting faculty...');
    const result = await deleteFaculty(id);
    
    if (result.success) {
      showNotification(result.message, 'success');
      await loadFacultyData();
    } else {
      showNotification(result.error, 'error');
    }
  } catch (error) {
    console.error('Error deleting faculty:', error);
    showNotification('Error deleting faculty', 'error');
  } finally {
    hideLoadingState();
  }
}

/**
 * Edit faculty
 */
function editFaculty(id) {
  openFacultyForm(id);
}

/* ============================================================================
   EVENTS MANAGEMENT
   ============================================================================ */

/**
 * Load events data
 */
async function loadEventsData() {
  try {
    const result = await getEvents();
    
    if (result.success) {
      allEvents = result.data;
      renderEventsTable(allEvents);
    }
  } catch (error) {
    console.error('Error loading events:', error);
    showNotification('Error loading events', 'error');
  }
}

/**
 * Render events table
 */
function renderEventsTable(events) {
  const tbody = document.getElementById('eventsTable');
  
  if (events.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: var(--spacing-2xl);">No events found</td></tr>';
    return;
  }
  
  tbody.innerHTML = events.map(event => `
    <tr>
      <td><strong>${event.title}</strong></td>
      <td>${formatDate(event.eventDate)}</td>
      <td>${event.format}</td>
      <td>${event.location || '-'}</td>
      <td>
        <button class="btn-icon" onclick="editEvent('${event.id}')">✎</button>
        <button class="btn-icon delete" onclick="deleteEvent('${event.id}')">🗑</button>
      </td>
    </tr>
  `).join('');
}

/**
 * Open event form
 */
function openEventForm(id = null) {
  openModal('eventModal');
}

/**
 * Delete event
 */
async function deleteEvent(id) {
  if (!confirm('Are you sure?')) return;
  
  try {
    showLoadingState('Deleting event...');
    const result = await deleteEvent(id);
    
    if (result.success) {
      showNotification(result.message, 'success');
      await loadEventsData();
    } else {
      showNotification(result.error, 'error');
    }
  } catch (error) {
    console.error('Error deleting event:', error);
    showNotification('Error deleting event', 'error');
  } finally {
    hideLoadingState();
  }
}

/**
 * Edit event
 */
function editEvent(id) {
  openEventForm(id);
}

/* ============================================================================
   RESOURCES MANAGEMENT
   ============================================================================ */

/**
 * Load resources data
 */
async function loadResourcesData() {
  try {
    const result = await getResources();
    
    if (result.success) {
      allResources = result.data;
      renderResourcesTable(allResources);
    }
  } catch (error) {
    console.error('Error loading resources:', error);
    showNotification('Error loading resources', 'error');
  }
}

/**
 * Render resources table
 */
function renderResourcesTable(resources) {
  const tbody = document.getElementById('resourcesTable');
  
  if (resources.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: var(--spacing-2xl);">No resources found</td></tr>';
    return;
  }
  
  tbody.innerHTML = resources.map(resource => `
    <tr>
      <td><strong>${resource.title}</strong></td>
      <td>${resource.category}</td>
      <td>${resource.resourceType}</td>
      <td>
        <button class="btn-icon" onclick="editResource('${resource.id}')">✎</button>
        <button class="btn-icon delete" onclick="deleteResource('${resource.id}')">🗑</button>
      </td>
    </tr>
  `).join('');
}

/**
 * Open resource form
 */
function openResourceForm(id = null) {
  openModal('resourceModal');
}

/**
 * Delete resource
 */
async function deleteResource(id) {
  if (!confirm('Are you sure?')) return;
  
  try {
    showLoadingState('Deleting resource...');
    const result = await deleteResource(id);
    
    if (result.success) {
      showNotification(result.message, 'success');
      await loadResourcesData();
    } else {
      showNotification(result.error, 'error');
    }
  } catch (error) {
    console.error('Error deleting resource:', error);
    showNotification('Error deleting resource', 'error');
  } finally {
    hideLoadingState();
  }
}

/**
 * Edit resource
 */
function editResource(id) {
  openResourceForm(id);
}

/* ============================================================================
   IMPACT STORIES MANAGEMENT
   ============================================================================ */

/**
 * Load stories data
 */
async function loadStoriesData() {
  try {
    const result = await getImpactStories();
    
    if (result.success) {
      allStories = result.data;
      renderStoriesTable(allStories);
    }
  } catch (error) {
    console.error('Error loading stories:', error);
    showNotification('Error loading stories', 'error');
  }
}

/**
 * Render stories table
 */
function renderStoriesTable(stories) {
  const tbody = document.getElementById('storiesTable');
  
  if (stories.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: var(--spacing-2xl);">No stories found</td></tr>';
    return;
  }
  
  tbody.innerHTML = stories.map(story => `
    <tr>
      <td><strong>${story.title}</strong></td>
      <td>${story.authorName}</td>
      <td><span class="badge badge-${story.published ? 'success' : 'warning'}">${story.published ? 'Published' : 'Draft'}</span></td>
      <td>
        <button class="btn-icon" onclick="editStory('${story.id}')">✎</button>
        <button class="btn-icon delete" onclick="deleteStory('${story.id}')">🗑</button>
      </td>
    </tr>
  `).join('');
}

/**
 * Open story form
 */
function openStoryForm(id = null) {
  openModal('storyModal');
}

/**
 * Delete story
 */
async function deleteStory(id) {
  if (!confirm('Are you sure?')) return;
  
  try {
    showLoadingState('Deleting story...');
    const result = await deleteImpactStory(id);
    
    if (result.success) {
      showNotification(result.message, 'success');
      await loadStoriesData();
    } else {
      showNotification(result.error, 'error');
    }
  } catch (error) {
    console.error('Error deleting story:', error);
    showNotification('Error deleting story', 'error');
  } finally {
    hideLoadingState();
  }
}

/**
 * Edit story
 */
function editStory(id) {
  openStoryForm(id);
}

/* ============================================================================
   CONTACTS MANAGEMENT
   ============================================================================ */

/**
 * Load contacts data
 */
async function loadContactsData() {
  // This would fetch from Firestore
  // For now, we'll show placeholder
  showNotification('Contact submissions feature coming soon', 'info');
}

/**
 * Export contacts
 */
function exportContacts() {
  showNotification('Export feature coming soon', 'info');
}

/* ============================================================================
   USERS MANAGEMENT
   ============================================================================ */

/**
 * Load users data
 */
async function loadUsersData() {
  showNotification('Users management feature coming soon', 'info');
}

/* ============================================================================
   NEWSLETTER MANAGEMENT
   ============================================================================ */

/**
 * Load newsletter data
 */
async function loadNewsletterData() {
  showNotification('Newsletter management feature coming soon', 'info');
}

/**
 * Export newsletter
 */
function exportNewsletter() {
  showNotification('Export feature coming soon', 'info');
}

/* ============================================================================
   ANALYTICS
   ============================================================================ */

/**
 * Load analytics data
 */
async function loadAnalyticsData() {
  try {
    const result = await getAnalytics();
    
    if (result.success) {
      const { totalUsers, totalEnrolments, totalProgrammes, contactSubmissions } = result.data;
      
      document.getElementById('analyticsUsers').textContent = totalUsers;
      document.getElementById('analyticsProgrammes').textContent = totalProgrammes;
      document.getElementById('analyticsEnrolments').textContent = totalEnrolments;
      document.getElementById('analyticsContacts').textContent = contactSubmissions;
    }
  } catch (error) {
    console.error('Error loading analytics:', error);
    showNotification('Error loading analytics', 'error');
  }
}

/* ============================================================================
   UI HELPERS
   ============================================================================ */

/**
 * Setup modals
 */
function setupModals() {
  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  });
}

/**
 * Open modal
 */
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
  }
}

/**
 * Close modal
 */
function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
  }
}

/**
 * Show loading state
 */
function showLoadingState(message = 'Loading...') {
  const loadingEl = document.getElementById('loadingOverlay');
  if (loadingEl) {
    loadingEl.innerHTML = `
      <div class="loading-spinner"></div>
      <p>${message}</p>
    `;
    loadingEl.classList.remove('hidden');
  }
}

/**
 * Hide loading state
 */
function hideLoadingState() {
  const loadingEl = document.getElementById('loadingOverlay');
  if (loadingEl) {
    loadingEl.classList.add('hidden');
  }
}

/**
 * Show notification
 */
function showNotification(message, type = 'info') {
  const container = document.getElementById('notificationContainer');
  if (!container) return;

  const notification = document.createElement('div');
  notification.className = `alert alert-${type}`;
  notification.innerHTML = `
    <div style="font-size: 20px; font-weight: bold;">
      ${type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}
    </div>
    <div>
      <p>${message}</p>
    </div>
  `;

  container.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 5000);
}

/**
 * Format date
 */
function formatDate(date) {
  if (!date) return '-';
  if (typeof date === 'object' && date.toDate) {
    date = date.toDate();
  }
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(new Date(date));
}
