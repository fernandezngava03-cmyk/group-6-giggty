/* ============================================================
   WANDER MALAYSIA TRAVEL AGENCY — script.js
   Author: Wander Malaysia Dev Team
   Description: Full interactivity, animations, data management
   ============================================================ */

/* ===== TRAVEL PACKAGES DATA ===== */
const packagesData = [
  {
    id: 1,
    name: "Kuala Lumpur City Explorer",
    destination: "Kuala Lumpur",
    duration: "3D2N",
    price: 599,
    badge: "Best Seller",
    image: "images/kl.jpg",
    highlights: [
      "Petronas Twin Towers visit",
      "Batu Caves day trip",
      "KL City Gallery tour",
      "Street food night walk"
    ]
  },
  {
    id: 2,
    name: "Langkawi Island Paradise",
    destination: "Langkawi",
    duration: "4D3N",
    price: 1299,
    badge: "Top Pick",
    image: "images/langkawi.jpg",
    highlights: [
      "Cable car & Sky Bridge",
      "Island hopping tour",
      "Mangrove boat cruise",
      "Duty-free shopping"
    ]
  },
  {
    id: 3,
    name: "Penang Heritage & Food",
    destination: "Penang",
    duration: "3D2N",
    price: 799,
    badge: "Hot Deal",
    image: "images/penang.jpg",
    highlights: [
      "Georgetown UNESCO tour",
      "Street art walking tour",
      "Penang Hill cable car",
      "Hawker food trail"
    ]
  },
  {
    id: 4,
    name: "Sabah Wildlife Adventure",
    destination: "Sabah",
    duration: "5D4N",
    price: 2199,
    badge: "Adventure",
    image: "images/sabah.jpg",
    highlights: [
      "Kinabalu National Park",
      "Sepilok Orangutan Centre",
      "Kinabatangan River cruise",
      "Sipadan diving (optional)"
    ]
  },
  {
    id: 5,
    name: "Langkawi Luxury Escape",
    destination: "Langkawi",
    duration: "5D4N",
    price: 2499,
    badge: "Luxury",
    image: "images/langkawi.jpg",
    highlights: [
      "5-star beachfront resort",
      "Private yacht charter",
      "Spa & wellness package",
      "Sunset dinner cruise"
    ]
  },
  {
    id: 6,
    name: "Malaysia Grand Tour",
    destination: "KL + Penang + Langkawi",
    duration: "7D6N",
    price: 3299,
    badge: "Grand Tour",
    image: "images/hero.jpg",
    highlights: [
      "3 iconic destinations",
      "All transfers included",
      "4-star hotels throughout",
      "Professional tour guide"
    ]
  }
];

/* ===== UTILITY FUNCTIONS ===== */

/**
 * Show a toast notification with a custom message
 * @param {string} message - The message to display
 * @param {boolean} isError - Whether to show as error (red icon)
 */
function showToast(message, isError = false) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMsg');
  const icon = toast.querySelector('i');

  toastMsg.textContent = message;
  icon.className = isError ? 'fas fa-exclamation-circle' : 'fas fa-check-circle';
  icon.style.color = isError ? '#dc3545' : '#28a745';

  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
}

/**
 * Open a modal by its ID
 * @param {string} modalId - The ID of the modal to open
 */
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

/**
 * Close a modal by its ID
 * @param {string} modalId - The ID of the modal to close
 */
function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

/**
 * Close modal when clicking the overlay background
 * @param {Event} event - Click event
 * @param {string} modalId - The modal ID
 */
function closeModalOutside(event, modalId) {
  if (event.target === event.currentTarget) {
    closeModal(modalId);
  }
}

/**
 * Switch between two modals (e.g., login ↔ register)
 * @param {string} fromId - Modal to close
 * @param {string} toId - Modal to open
 */
function switchModal(fromId, toId) {
  closeModal(fromId);
  setTimeout(() => openModal(toId), 200);
}

/**
 * Toggle password visibility in a password field
 * @param {string} fieldId - The input field ID
 */
function togglePassword(fieldId) {
  const field = document.getElementById(fieldId);
  const btn = field.nextElementSibling;
  const icon = btn.querySelector('i');

  if (field.type === 'password') {
    field.type = 'text';
    icon.className = 'fas fa-eye-slash';
  } else {
    field.type = 'password';
    icon.className = 'fas fa-eye';
  }
}

/* ===== SEARCH TAB SWITCHER ===== */

/**
 * Switch between Flights / Hotels / Packages search tabs
 * @param {string} tab - The tab name to activate
 */
function switchTab(tab) {
  // Update tab buttons
  document.querySelectorAll('.search-tab').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tab);
  });

  // Update search forms
  document.querySelectorAll('.search-form').forEach(form => {
    form.classList.remove('active');
  });

  const activeForm = document.getElementById(`tab-${tab}`);
  if (activeForm) activeForm.classList.add('active');
}

/* ===== SWAP FLIGHT CITIES ===== */

/**
 * Swap the departure and destination city values
 */
function swapCities() {
  const from = document.getElementById('flightFrom');
  const to = document.getElementById('flightTo');
  if (from && to) {
    [from.value, to.value] = [to.value, from.value];

    // Visual feedback
    const swapBtn = document.querySelector('.search-swap');
    swapBtn.style.transform = 'rotate(180deg)';
    setTimeout(() => swapBtn.style.transform = '', 400);
  }
}

/* ===== SEARCH HANDLER ===== */

/**
 * Handle search form submission for each tab type
 * @param {string} type - 'flights', 'hotels', or 'packages'
 */
function handleSearch(type) {
  let isValid = true;
  let message = '';

  if (type === 'flights') {
    const from = document.getElementById('flightFrom').value.trim();
    const to = document.getElementById('flightTo').value.trim();
    const date = document.getElementById('flightDate').value;

    if (!from || !to) {
      showToast('Please enter both departure and destination cities.', true);
      isValid = false;
    } else if (!date) {
      showToast('Please select a departure date.', true);
      isValid = false;
    } else {
      message = `Searching flights from ${from} to ${to}...`;
    }
  } else if (type === 'hotels') {
    const dest = document.getElementById('hotelDest').value.trim();
    const checkin = document.getElementById('hotelCheckin').value;
    const checkout = document.getElementById('hotelCheckout').value;

    if (!dest) {
      showToast('Please enter a hotel destination.', true);
      isValid = false;
    } else if (!checkin || !checkout) {
      showToast('Please select check-in and check-out dates.', true);
      isValid = false;
    } else if (checkin >= checkout) {
      showToast('Check-out date must be after check-in date.', true);
      isValid = false;
    } else {
      message = `Searching hotels in ${dest}...`;
    }
  } else if (type === 'packages') {
    const dest = document.getElementById('pkgDest').value.trim();
    if (!dest) {
      showToast('Please enter a destination to search packages.', true);
      isValid = false;
    } else {
      message = `Searching packages for ${dest}...`;
      // Scroll to packages section and filter
      document.getElementById('packages').scrollIntoView({ behavior: 'smooth' });
      document.getElementById('packageSearch').value = dest;
      filterPackages();
    }
  }

  if (isValid && message) {
    showToast(message);
  }
}

/* ===== DESTINATION FILTER ===== */

/**
 * Filter destination cards by category
 * @param {string} category - 'all', 'city', 'beach', or 'nature'
 */
function filterDestinations(category) {
  // Update active filter button
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === category);
  });

  // Show/hide destination cards with animation
  const cards = document.querySelectorAll('.dest-card');
  cards.forEach((card, index) => {
    const cardCategory = card.dataset.category;
    const shouldShow = category === 'all' || cardCategory === category;

    if (shouldShow) {
      card.classList.remove('hidden');
      card.style.animationDelay = `${index * 0.1}s`;
    } else {
      card.classList.add('hidden');
    }
  });
}

/* ===== PACKAGES RENDERING ===== */

/**
 * Render all package cards from the packagesData array
 * @param {Array} data - Array of package objects to render
 */
function renderPackages(data) {
  const grid = document.getElementById('packagesGrid');
  const noResults = document.getElementById('noPackages');

  if (!grid) return;

  if (data.length === 0) {
    grid.innerHTML = '';
    noResults.style.display = 'block';
    return;
  }

  noResults.style.display = 'none';

  grid.innerHTML = data.map((pkg, index) => `
    <div class="pkg-card fade-in-up" style="transition-delay: ${index * 0.1}s">
      <div class="pkg-card-img">
        <img src="${pkg.image}" alt="${pkg.name}" loading="lazy" />
        <div class="pkg-badge">${pkg.badge}</div>
        <div class="pkg-duration"><i class="fas fa-clock"></i> ${pkg.duration}</div>
      </div>
      <div class="pkg-card-body">
        <h3>${pkg.name}</h3>
        <p class="pkg-location"><i class="fas fa-map-marker-alt"></i> ${pkg.destination}</p>
        <div class="pkg-highlights">
          ${pkg.highlights.map(h => `
            <div class="pkg-highlight">
              <i class="fas fa-check-circle"></i>
              <span>${h}</span>
            </div>
          `).join('')}
        </div>
        <div class="pkg-card-footer">
          <div class="pkg-price">
            <span class="from">From</span>
            <span class="amount">RM ${pkg.price.toLocaleString()}</span>
            <span class="per">/person</span>
          </div>
          <button class="btn-pkg-book" onclick="openModal('bookingModal')">
            <i class="fas fa-suitcase"></i> Book Now
          </button>
        </div>
      </div>
    </div>
  `).join('');

  // Trigger scroll animation for newly rendered cards
  observeElements();
}

/* ===== PACKAGE SEARCH FILTER ===== */

/**
 * Filter packages based on the search input value
 */
function filterPackages() {
  const query = document.getElementById('packageSearch').value.toLowerCase().trim();
  const sortValue = document.getElementById('packageSort').value;

  let filtered = packagesData.filter(pkg =>
    pkg.name.toLowerCase().includes(query) ||
    pkg.destination.toLowerCase().includes(query) ||
    pkg.highlights.some(h => h.toLowerCase().includes(query))
  );

  filtered = sortPackageData(filtered, sortValue);
  renderPackages(filtered);
}

/* ===== PACKAGE SORT ===== */

/**
 * Sort packages based on selected sort option
 */
function sortPackages() {
  filterPackages(); // Re-filter with new sort applied
}

/**
 * Sort a package array by the given criteria
 * @param {Array} data - Package data array
 * @param {string} sortBy - Sort criteria
 * @returns {Array} Sorted array
 */
function sortPackageData(data, sortBy) {
  const sorted = [...data];
  switch (sortBy) {
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price);
    case 'duration':
      return sorted.sort((a, b) => {
        const getDays = d => parseInt(d.replace(/\D/g, ''));
        return getDays(a.duration) - getDays(b.duration);
      });
    default:
      return sorted;
  }
}

/* ===== FORM HANDLERS ===== */

/**
 * Handle login form submission with validation
 * @param {Event} event - Form submit event
 */
function handleLogin(event) {
  event.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  let valid = true;

  // Clear previous errors
  document.getElementById('loginEmailError').textContent = '';
  document.getElementById('loginPasswordError').textContent = '';

  // Email validation
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    document.getElementById('loginEmailError').textContent = 'Please enter a valid email address.';
    valid = false;
  }

  // Password validation
  if (!password || password.length < 6) {
    document.getElementById('loginPasswordError').textContent = 'Password must be at least 6 characters.';
    valid = false;
  }

  if (valid) {
    closeModal('loginModal');
    showToast(`Welcome back! You are now logged in as ${email}`);
    // Update nav button to show user is logged in
    const loginBtn = document.getElementById('btnLogin');
    if (loginBtn) {
      loginBtn.innerHTML = '<i class="fas fa-user-check"></i> My Account';
    }
  }
}

/**
 * Handle registration form submission with validation
 * @param {Event} event - Form submit event
 */
function handleRegister(event) {
  event.preventDefault();
  const email = document.getElementById('regEmail').value.trim();
  const password = document.getElementById('regPassword').value;
  const confirm = document.getElementById('regConfirmPassword').value;
  const terms = document.getElementById('regTerms').checked;
  let valid = true;

  // Clear previous errors
  document.getElementById('regEmailError').textContent = '';
  document.getElementById('regPasswordError').textContent = '';
  document.getElementById('regConfirmError').textContent = '';

  // Email validation
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    document.getElementById('regEmailError').textContent = 'Please enter a valid email address.';
    valid = false;
  }

  // Password strength validation
  if (!password || password.length < 8) {
    document.getElementById('regPasswordError').textContent = 'Password must be at least 8 characters.';
    valid = false;
  }

  // Confirm password validation
  if (password !== confirm) {
    document.getElementById('regConfirmError').textContent = 'Passwords do not match.';
    valid = false;
  }

  if (!terms) {
    showToast('Please accept the Terms of Service to continue.', true);
    valid = false;
  }

  if (valid) {
    closeModal('registerModal');
    showToast('Account created successfully! Welcome to Wander Malaysia!');
  }
}

/**
 * Handle booking form submission
 * @param {Event} event - Form submit event
 */
function handleBooking(event) {
  event.preventDefault();
  closeModal('bookingModal');
  showToast('Booking confirmed! Our team will contact you within 24 hours.');
}

/**
 * Handle contact form submission
 * @param {Event} event - Form submit event
 */
function handleContact(event) {
  event.preventDefault();
  event.target.reset();
  showToast('Message sent! We will get back to you within 1 business day.');
}

/**
 * Handle newsletter subscription
 * @param {Event} event - Form submit event
 */
function handleNewsletter(event) {
  event.preventDefault();
  const input = event.target.querySelector('input[type="email"]');
  const email = input.value.trim();
  if (email) {
    input.value = '';
    showToast(`You're subscribed! Check ${email} for exclusive deals.`);
  }
}

/* ===== PASSWORD STRENGTH INDICATOR ===== */

/**
 * Evaluate password strength and update the strength bar
 * @param {string} password - The password to evaluate
 */
function checkPasswordStrength(password) {
  const bar = document.getElementById('pwStrength');
  if (!bar) return;

  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;

  const colors = ['#dc3545', '#fd7e14', '#ffc107', '#28a745'];
  const widths = ['25%', '50%', '75%', '100%'];
  const labels = ['Weak', 'Fair', 'Good', 'Strong'];

  if (password.length === 0) {
    bar.style.width = '0';
    bar.title = '';
  } else {
    bar.style.width = widths[strength - 1] || '25%';
    bar.style.background = colors[strength - 1] || '#dc3545';
    bar.title = labels[strength - 1] || 'Weak';
  }
}

/* ===== SCROLL TO TOP ===== */

/**
 * Smoothly scroll to the top of the page
 */
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ===== COUNTER ANIMATION ===== */

/**
 * Animate a number counter from 0 to target value
 * @param {HTMLElement} el - The element to animate
 * @param {number} target - The target number
 * @param {number} duration - Animation duration in ms
 */
function animateCounter(el, target, duration = 2000) {
  let start = 0;
  const step = target / (duration / 16);

  const update = () => {
    start += step;
    if (start >= target) {
      el.textContent = target.toLocaleString();
      return;
    }
    el.textContent = Math.floor(start).toLocaleString();
    requestAnimationFrame(update);
  };

  requestAnimationFrame(update);
}

/* ===== INTERSECTION OBSERVER ===== */

/**
 * Set up Intersection Observer for scroll-triggered animations
 */
function observeElements() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.fade-in-up').forEach(el => {
    observer.observe(el);
  });
}

/**
 * Set up counter animation observer for stats section
 */
function observeCounters() {
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counters = entry.target.querySelectorAll('.stat-number');
        counters.forEach(counter => {
          const target = parseInt(counter.dataset.target);
          animateCounter(counter, target);
        });
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.querySelector('.stats-banner');
  if (statsSection) counterObserver.observe(statsSection);
}

/* ===== NAVBAR SCROLL BEHAVIOUR ===== */

/**
 * Update navbar appearance and active link based on scroll position
 */
function handleNavbarScroll() {
  const navbar = document.getElementById('navbar');
  const scrollTop = window.scrollY;

  // Toggle scrolled class for styling
  navbar.classList.toggle('scrolled', scrollTop > 80);

  // Update scroll-to-top button visibility
  const scrollBtn = document.getElementById('scrollTop');
  if (scrollBtn) {
    scrollBtn.classList.toggle('visible', scrollTop > 400);
  }

  // Update active nav link based on scroll position
  const sections = ['home', 'destinations', 'packages', 'flights', 'hotels', 'about', 'contact'];
  let current = 'home';

  sections.forEach(id => {
    const section = document.getElementById(id);
    if (section) {
      const sectionTop = section.offsetTop - 100;
      if (scrollTop >= sectionTop) current = id;
    }
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    link.classList.toggle('active', href === `#${current}`);
  });
}

/* ===== MOBILE NAVIGATION ===== */

/**
 * Toggle mobile navigation menu open/closed
 */
function toggleMobileNav() {
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');

  hamburger.classList.toggle('active');
  navMenu.classList.toggle('open');
  document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
}

/**
 * Close mobile navigation menu
 */
function closeMobileNav() {
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');

  hamburger.classList.remove('active');
  navMenu.classList.remove('open');
  document.body.style.overflow = '';
}

/* ===== SMOOTH SCROLL FOR NAV LINKS ===== */

/**
 * Handle smooth scrolling when nav links are clicked
 * @param {Event} event - Click event
 */
function handleNavLinkClick(event) {
  const href = event.currentTarget.getAttribute('href');
  if (href && href.startsWith('#')) {
    event.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      const offset = 80; // Navbar height offset
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
    closeMobileNav();
  }
}

/* ===== LOADING SCREEN ===== */

/**
 * Hide the loading screen after page load
 */
function hideLoader() {
  const loader = document.getElementById('loader');
  if (loader) {
    setTimeout(() => {
      loader.classList.add('hidden');
      // Remove from DOM after transition
      setTimeout(() => loader.remove(), 500);
    }, 1200);
  }
}

/* ===== HERO PARALLAX EFFECT ===== */

/**
 * Apply subtle parallax to the hero section on scroll
 */
function handleParallax() {
  const hero = document.querySelector('.hero');
  if (hero) {
    const scrolled = window.scrollY;
    hero.style.backgroundPositionY = `${scrolled * 0.4}px`;
  }
}

/* ===== DATE INPUT DEFAULTS ===== */

/**
 * Set default dates for search inputs (today and tomorrow)
 */
function setDefaultDates() {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const formatDate = (d) => d.toISOString().split('T')[0];

  const flightDate = document.getElementById('flightDate');
  const hotelCheckin = document.getElementById('hotelCheckin');
  const hotelCheckout = document.getElementById('hotelCheckout');
  const pkgDate = document.getElementById('pkgDate');

  if (flightDate) flightDate.value = formatDate(today);
  if (hotelCheckin) hotelCheckin.value = formatDate(today);
  if (hotelCheckout) hotelCheckout.value = formatDate(tomorrow);
  if (pkgDate) pkgDate.value = formatDate(today);

  // Set min date to today for all date inputs
  document.querySelectorAll('input[type="date"]').forEach(input => {
    input.min = formatDate(today);
  });
}

/* ===== KEYBOARD NAVIGATION ===== */

/**
 * Close modals on Escape key press
 * @param {KeyboardEvent} event - Keyboard event
 */
function handleKeyboard(event) {
  if (event.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.active').forEach(modal => {
      closeModal(modal.id);
    });
    closeMobileNav();
  }
}

/* ===== INITIALISATION ===== */

/**
 * Main initialisation function — runs on DOMContentLoaded
 */
function init() {
  // Hide loading screen
  hideLoader();

  // Render packages
  renderPackages(packagesData);

  // Set default dates
  setDefaultDates();

  // Set up scroll event listeners
  window.addEventListener('scroll', () => {
    handleNavbarScroll();
    handleParallax();
  }, { passive: true });

  // Set up keyboard listener
  document.addEventListener('keydown', handleKeyboard);

  // Set up hamburger menu
  const hamburger = document.getElementById('hamburger');
  if (hamburger) {
    hamburger.addEventListener('click', toggleMobileNav);
  }

  // Set up smooth scroll for all nav links
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', handleNavLinkClick);
  });

  // Set up footer links smooth scroll
  document.querySelectorAll('.footer-links a[href^="#"]').forEach(link => {
    link.addEventListener('click', handleNavLinkClick);
  });

  // Set up Intersection Observer for animations
  observeElements();

  // Set up counter animation
  observeCounters();

  // Password strength checker
  const regPassword = document.getElementById('regPassword');
  if (regPassword) {
    regPassword.addEventListener('input', (e) => checkPasswordStrength(e.target.value));
  }

  // Initial navbar state
  handleNavbarScroll();

  // Close mobile nav when clicking outside
  document.addEventListener('click', (e) => {
    const navMenu = document.getElementById('navMenu');
    const hamburger = document.getElementById('hamburger');
    if (navMenu && navMenu.classList.contains('open')) {
      if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
        closeMobileNav();
      }
    }
  });
}

// Run init when DOM is ready
document.addEventListener('DOMContentLoaded', init);
