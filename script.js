/**
 * IMPACT Global Academy - Main Script
 * ===================================
 * 
 * Handles DOM interactions, navigation, forms, and UI logic
 */

/* ============================================================================
   GLOBAL STATE
   ============================================================================ */

let currentUser = null;
let programmes = [];
let isNavigationOpen = false;

/* ============================================================================
   INITIALIZATION
   ============================================================================ */

document.addEventListener('DOMContentLoaded', async () => {
  console.log('🚀 IMPACT Global Academy loaded');
  
  // Initialize header
  initializeHeader();
  
  // Check auth status
  await checkAuthStatus();
  
  // Setup mobile navigation
  setupMobileNavigation();
  
  // Setup form submissions
  setupFormHandlers();
  
  // Setup modals
  setupModals();
  
  // Load programmes if on programmes page
  if (document.body.dataset.page === 'programmes') {
    await loadProgrammes();
  }
  
  // Load faculty if on about page
  if (document.body.dataset.page === 'about') {
    await loadFacultySection();
  }
});

/* ============================================================================
   AUTHENTICATION MANAGEMENT
   ============================================================================ */

/**
 * Check authentication status and update UI
 */
async function checkAuthStatus() {
  auth.onAuthStateChanged(async (user) => {
    if (user) {
      currentUser = await getCurrentUser();
      updateHeaderForAuthenticatedUser(currentUser);
    } else {
      currentUser = null;
      updateHeaderForGuestUser();
    }
  });
}

/**
 * Update header when user is logged in
 */
function updateHeaderForAuthenticatedUser(user) {
  const authButtonsContainer = document.querySelector('.nav-buttons');
  if (!authButtonsContainer) return;

  authButtonsContainer.innerHTML = `
    <div class="auth-user">
      <div class="dropdown">
        <button class="user-avatar" onclick="toggleUserMenu(event)">
          ${user.fullName.charAt(0).toUpperCase()}
        </button>
        <div class="dropdown-menu" id="userMenu">
          <a href="/dashboard.html" class="dropdown-item">My Dashboard</a>
          <a href="/profile.html" class="dropdown-item">My Profile</a>
          ${user.role === 'super_admin' || user.role === 'admin' ? 
            '<a href="/admin/dashboard.html" class="dropdown-item">Admin Panel</a>' : ''}
          <div class="dropdown-divider"></div>
          <button class="dropdown-item" onclick="handleLogout()">Sign Out</button>
        </div>
      </div>
    </div>
  `;
}

/**
 * Update header when user is logged out
 */
function updateHeaderForGuestUser() {
  const authButtonsContainer = document.querySelector('.nav-buttons');
  if (!authButtonsContainer) return;

  authButtonsContainer.innerHTML = `
    <a href="/login.html" class="btn btn-outline btn-sm">Sign In</a>
    <a href="/register.html" class="btn btn-primary btn-sm">Create Account</a>
  `;
}

/**
 * Toggle user dropdown menu
 */
function toggleUserMenu(event) {
  event.stopPropagation();
  const menu = document.getElementById('userMenu');
  if (menu) {
    menu.classList.toggle('active');
  }
}

/**
 * Handle user logout
 */
async function handleLogout() {
  try {
    showLoadingState('Signing out...');
    const result = await logoutUser();
    if (result.success) {
      currentUser = null;
      updateHeaderForGuestUser();
      showNotification('You have been signed out', 'success');
      setTimeout(() => {
        window.location.href = '/';
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

/**
 * Require authentication
 */
function requireAuth() {
  if (!currentUser) {
    showNotification('Please sign in to continue', 'info');
    window.location.href = '/login.html';
    return false;
  }
  return true;
}

/* ============================================================================
   NAVIGATION
   ============================================================================ */

/**
 * Initialize header
 */
function initializeHeader() {
  const header = document.querySelector('header');
  if (!header) return;

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    const menu = document.getElementById('userMenu');
    if (menu && !menu.parentElement.contains(e.target)) {
      menu.classList.remove('active');
    }
  });
}

/**
 * Setup mobile navigation
 */
function setupMobileNavigation() {
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const nav = document.querySelector('nav');

  if (!menuBtn || !nav) return;

  menuBtn.addEventListener('click', () => {
    isNavigationOpen = !isNavigationOpen;
    nav.classList.toggle('active');
    menuBtn.textContent = isNavigationOpen ? '✕' : '☰';
  });

  // Close menu when clicking on a link
  document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', () => {
      isNavigationOpen = false;
      nav.classList.remove('active');
      menuBtn.textContent = '☰';
    });
  });
}

/* ============================================================================
   FORM HANDLING
   ============================================================================ */

/**
 * Setup all form handlers
 */
function setupFormHandlers() {
  // Contact form
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', handleContactForm);
  }

  // Login form
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', handleLoginForm);
  }

  // Register form
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', handleRegisterForm);
  }

  // Newsletter form
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', handleNewsletterForm);
  }

  // Search form
  const searchForm = document.getElementById('searchForm');
  if (searchForm) {
    searchForm.addEventListener('submit', handleSearchForm);
  }
}

/**
 * Handle contact form submission
 */
async function handleContactForm(e) {
  e.preventDefault();

  const form = e.target;
  const formData = {
    name: form.name.value.trim(),
    email: form.email.value.trim(),
    phone: form.phone?.value.trim() || '',
    subject: form.subject?.value.trim() || '',
    message: form.message.value.trim()
  };

  try {
    showLoadingState('Sending message...', form);
    const result = await submitContactForm(formData);

    if (result.success) {
      showNotification(result.message, 'success');
      form.reset();
    } else {
      showNotification(result.error, 'error');
    }
  } catch (error) {
    console.error('Contact form error:', error);
    showNotification('Error sending message', 'error');
  } finally {
    hideLoadingState(form);
  }
}

/**
 * Handle login form submission
 */
async function handleLoginForm(e) {
  e.preventDefault();

  const form = e.target;
  const email = form.email.value.trim();
  const password = form.password.value;

  // Validate
  if (!email || !password) {
    showNotification('Please fill in all fields', 'error');
    return;
  }

  try {
    showLoadingState('Signing in...', form);
    const result = await loginUser(email, password);

    if (result.success) {
      currentUser = result.user;
      showNotification('Signed in successfully!', 'success');
      setTimeout(() => {
        window.location.href = '/dashboard.html';
      }, 1500);
    } else {
      showNotification(result.error, 'error');
    }
  } catch (error) {
    console.error('Login error:', error);
    showNotification('Error signing in', 'error');
  } finally {
    hideLoadingState(form);
  }
}

/**
 * Handle registration form submission
 */
async function handleRegisterForm(e) {
  e.preventDefault();

  const form = e.target;
  const fullName = form.fullName.value.trim();
  const email = form.email.value.trim();
  const password = form.password.value;
  const confirmPassword = form.confirmPassword.value;

  // Validate
  if (!fullName || !email || !password || !confirmPassword) {
    showNotification('Please fill in all fields', 'error');
    return;
  }

  if (password.length < 6) {
    showNotification('Password must be at least 6 characters', 'error');
    return;
  }

  if (password !== confirmPassword) {
    showNotification('Passwords do not match', 'error');
    return;
  }

  try {
    showLoadingState('Creating account...', form);
    const result = await registerUser(email, password, fullName);

    if (result.success) {
      showNotification(result.message, 'success');
      setTimeout(() => {
        window.location.href = '/login.html';
      }, 2000);
    } else {
      showNotification(result.error, 'error');
    }
  } catch (error) {
    console.error('Registration error:', error);
    showNotification('Error creating account', 'error');
  } finally {
    hideLoadingState(form);
  }
}

/**
 * Handle newsletter subscription
 */
async function handleNewsletterForm(e) {
  e.preventDefault();

  const form = e.target;
  const email = form.email.value.trim();
  const fullName = form.fullName?.value.trim() || '';

  try {
    showLoadingState('Subscribing...', form);
    const result = await subscribeNewsletter(email, fullName);

    if (result.success) {
      showNotification(result.message, 'success');
      form.reset();
    } else {
      showNotification(result.error, 'error');
    }
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    showNotification('Error subscribing to newsletter', 'error');
  } finally {
    hideLoadingState(form);
  }
}

/**
 * Handle programme search
 */
async function handleSearchForm(e) {
  e.preventDefault();

  const form = e.target;
  const query = form.search.value.trim();

  if (!query) {
    showNotification('Please enter a search term', 'error');
    return;
  }

  try {
    showLoadingState('Searching...');
    const result = await searchProgrammes(query);

    if (result.success) {
      programmes = result.data;
      renderProgrammesGrid(programmes);
      showNotification(`Found ${programmes.length} programme(s)`, 'info');
    } else {
      showNotification(result.error, 'error');
    }
  } catch (error) {
    console.error('Search error:', error);
    showNotification('Error searching programmes', 'error');
  } finally {
    hideLoadingState();
  }
}

/* ============================================================================
   PROGRAMMES
   ============================================================================ */

/**
 * Load and display programmes
 */
async function loadProgrammes() {
  try {
    showLoadingState('Loading programmes...');
    const result = await getProgrammes();

    if (result.success) {
      programmes = result.data;
      renderProgrammesGrid(programmes);
    } else {
      showNotification(result.error, 'error');
    }
  } catch (error) {
    console.error('Error loading programmes:', error);
    showNotification('Error loading programmes', 'error');
  } finally {
    hideLoadingState();
  }
}

/**
 * Render programmes grid
 */
function renderProgrammesGrid(data) {
  const grid = document.getElementById('programmesGrid');
  if (!grid) return;

  if (data.length === 0) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <div class="empty-state-icon">📚</div>
        <h3 class="empty-state-title">No Programmes Found</h3>
        <p class="empty-state-description">Check back soon for new learning opportunities.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = data.map(programme => `
    <div class="card programme-card">
      <div class="programme-image" style="background: linear-gradient(135deg, var(--primary-50), var(--primary-100));">
        ${programme.imageUrl ? `<img src="${programme.imageUrl}" alt="${programme.title}">` : ''}
      </div>
      <div class="programme-content">
        <div class="programme-badge">
          <span class="badge badge-primary">${programme.category}</span>
        </div>
        <h3 class="programme-title">${programme.title}</h3>
        <p class="programme-description">${programme.shortDescription}</p>
        
        <div class="programme-meta">
          <div class="programme-meta-item">
            <span>⏱️</span>
            <span>${programme.durationWeeks} weeks</span>
          </div>
          <div class="programme-meta-item">
            <span>💵</span>
            <span>$${programme.investmentUsd}</span>
          </div>
        </div>

        <div style="display: flex; gap: var(--spacing-md);">
          <a href="/programme-detail.html?id=${programme.id}" class="btn btn-outline btn-sm" style="flex: 1; text-align: center;">Learn More</a>
          <button class="btn btn-primary btn-sm" style="flex: 1;" onclick="enrolProgramme('${programme.id}', '${programme.title}')">Enrol Now</button>
        </div>
      </div>
    </div>
  `).join('');
}

/**
 * Enrol in a programme
 */
async function enrolProgramme(programmeId, programmeName) {
  if (!requireAuth()) return;

  try {
    showLoadingState('Enrolling...');
    const result = await enrolInProgramme(programmeId);

    if (result.success) {
      showNotification(`Successfully enrolled in ${programmeName}!`, 'success');
      setTimeout(() => {
        window.location.href = '/dashboard.html';
      }, 1500);
    } else {
      showNotification(result.error, 'error');
    }
  } catch (error) {
    console.error('Enrolment error:', error);
    showNotification('Error enrolling in programme', 'error');
  } finally {
    hideLoadingState();
  }
}

/**
 * Load programme detail (single page)
 */
async function loadProgrammeDetail() {
  const params = new URLSearchParams(window.location.search);
  const programmeId = params.get('id');

  if (!programmeId) {
    showNotification('Programme not found', 'error');
    return;
  }

  try {
    showLoadingState('Loading programme...');
    const result = await getProgrammeById(programmeId);

    if (result.success) {
      renderProgrammeDetail(result.data);
    } else {
      showNotification(result.error, 'error');
    }
  } catch (error) {
    console.error('Error loading programme:', error);
    showNotification('Error loading programme', 'error');
  } finally {
    hideLoadingState();
  }
}

/**
 * Render programme detail page
 */
function renderProgrammeDetail(programme) {
  const container = document.getElementById('programmeDetailContainer');
  if (!container) return;

  container.innerHTML = `
    <div class="container" style="max-width: 900px;">
      <a href="/programmes.html" class="btn btn-ghost" style="margin-bottom: var(--spacing-xl);">← Back to Programmes</a>
      
      <div class="card" style="margin-bottom: var(--spacing-2xl);">
        ${programme.imageUrl ? `<img src="${programme.imageUrl}" alt="${programme.title}" style="width: 100%; height: 400px; object-fit: cover; border-radius: var(--radius-xl) var(--radius-xl) 0 0; margin: -var(--spacing-xl) -var(--spacing-xl) var(--spacing-xl) -var(--spacing-xl);">` : ''}
        
        <div class="programme-content">
          <span class="badge badge-primary" style="margin-bottom: var(--spacing-lg);">${programme.category}</span>
          <h1>${programme.title}</h1>
          
          <div class="programme-meta" style="margin-bottom: var(--spacing-2xl);">
            <div class="programme-meta-item">
              <span>⏱️</span>
              <span><strong>${programme.durationWeeks}</strong> weeks</span>
            </div>
            <div class="programme-meta-item">
              <span>💵</span>
              <span><strong>$${programme.investmentUsd}</strong> USD / ₦${programme.investmentNgn.toLocaleString()} NGN</span>
            </div>
            <div class="programme-meta-item">
              <span>✓</span>
              <span><strong>Featured</strong> Programme</span>
            </div>
          </div>

          <p style="font-size: var(--font-size-lg); line-height: 1.8; margin-bottom: var(--spacing-2xl);">${programme.description}</p>

          <button class="btn btn-primary btn-lg" onclick="enrolProgramme('${programme.id}', '${programme.title}')" style="width: 100%; margin-bottom: var(--spacing-xl);">
            Enrol Now
          </button>

          <div style="background-color: var(--primary-50); padding: var(--spacing-xl); border-radius: var(--radius-lg);">
            <h3 style="margin-bottom: var(--spacing-lg);">Ready to Transform?</h3>
            <p>Join hundreds of leaders who have already transformed their lives through our programmes.</p>
          </div>
        </div>
      </div>
    </div>
  `;
}

/* ============================================================================
   FACULTY
   ============================================================================ */

/**
 * Load faculty section
 */
async function loadFacultySection() {
  try {
    const result = await getFaculty();

    if (result.success) {
      renderFacultyGrid(result.data);
    }
  } catch (error) {
    console.error('Error loading faculty:', error);
  }
}

/**
 * Render faculty grid
 */
function renderFacultyGrid(faculty) {
  const grid = document.getElementById('facultyGrid');
  if (!grid) return;

  if (faculty.length === 0) {
    grid.innerHTML = '<p>Faculty information coming soon.</p>';
    return;
  }

  grid.innerHTML = faculty.map(member => `
    <div class="card text-center">
      ${member.imageUrl ? `<img src="${member.imageUrl}" alt="${member.name}" style="width: 100%; height: 250px; object-fit: cover; border-radius: var(--radius-xl) var(--radius-xl) 0 0; margin: -var(--spacing-xl) -var(--spacing-xl) var(--spacing-lg) -var(--spacing-xl);">` : ''}
      <h3>${member.name}</h3>
      <p class="text-muted">${member.title}</p>
      <p style="font-size: var(--font-size-sm); margin-bottom: var(--spacing-lg);">${member.bio}</p>
      ${member.expertise ? `<p class="text-muted"><strong>Expertise:</strong> ${member.expertise.join(', ')}</p>` : ''}
      <div style="display: flex; gap: var(--spacing-md); justify-content: center; margin-top: var(--spacing-lg);">
        ${member.linkedinUrl ? `<a href="${member.linkedinUrl}" target="_blank" class="btn btn-sm btn-outline">LinkedIn</a>` : ''}
        ${member.twitterUrl ? `<a href="${member.twitterUrl}" target="_blank" class="btn btn-sm btn-outline">Twitter</a>` : ''}
      </div>
    </div>
  `).join('');
}

/* ============================================================================
   UI HELPERS
   ============================================================================ */

/**
 * Setup modals
 */
function setupModals() {
  // Close modal when clicking outside
  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });

    // Close button
    modal.querySelector('.modal-close')?.addEventListener('click', () => {
      modal.classList.remove('active');
    });
  });

  // Escape key to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal.active').forEach(modal => {
        modal.classList.remove('active');
      });
    }
  });
}

/**
 * Show loading state
 */
function showLoadingState(message = 'Loading...', form = null) {
  const loadingEl = document.getElementById('loadingOverlay');
  if (loadingEl) {
    loadingEl.innerHTML = `
      <div class="loading-spinner"></div>
      <p>${message}</p>
    `;
    loadingEl.classList.add('visible');
  }

  if (form) {
    const btn = form.querySelector('button[type="submit"]');
    if (btn) {
      btn.disabled = true;
      btn.classList.add('btn-loading');
    }
  }
}

/**
 * Hide loading state
 */
function hideLoadingState(form = null) {
  const loadingEl = document.getElementById('loadingOverlay');
  if (loadingEl) {
    loadingEl.classList.remove('visible');
  }

  if (form) {
    const btn = form.querySelector('button[type="submit"]');
    if (btn) {
      btn.disabled = false;
      btn.classList.remove('btn-loading');
    }
  }
}

/**
 * Show notification
 */
function showNotification(message, type = 'info') {
  const container = document.getElementById('notificationContainer');
  if (!container) return;

  const notification = document.createElement('div');
  notification.className = `alert alert-${type} fade-in`;
  notification.innerHTML = `
    <div class="alert-icon">${getAlertIcon(type)}</div>
    <div class="alert-content">
      <p>${message}</p>
    </div>
  `;

  container.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 5000);
}

/**
 * Get alert icon based on type
 */
function getAlertIcon(type) {
  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  };
  return icons[type] || icons.info;
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

/* ============================================================================
   UTILITY FUNCTIONS
   ============================================================================ */

/**
 * Format currency
 */
function formatCurrency(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount);
}

/**
 * Format date
 */
function formatDate(date) {
  if (typeof date === 'object' && date.toDate) {
    date = date.toDate();
  }
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(date));
}

/**
 * Truncate text
 */
function truncateText(text, length = 100) {
  if (text.length > length) {
    return text.substring(0, length) + '...';
  }
  return text;
}

/* ============================================================================
   PAGE-SPECIFIC INITIALIZATION
   ============================================================================ */

// Load programme detail if on detail page
if (document.body.dataset.page === 'programme-detail') {
  document.addEventListener('DOMContentLoaded', loadProgrammeDetail);
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    checkAuthStatus, handleLogout, requireAuth,
    handleContactForm, handleLoginForm, handleRegisterForm, handleNewsletterForm,
    loadProgrammes, enrolProgramme, loadProgrammeDetail,
    showNotification, showLoadingState, hideLoadingState,
    openModal, closeModal,
    formatCurrency, formatDate
  };
}
