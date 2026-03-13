// Common initialization script for all pages
// Theme management
function initTheme() {
  const themeToggle = document.getElementById('theme-toggle');
  if (!themeToggle) return;
  
  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
    themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
  });
  
  // Set initial theme icon
  const theme = localStorage.getItem('theme') || 'dark';
  themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
}

// Mobile menu toggle
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  
  if (!hamburger || !navLinks) return;
  
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });
  
  // Close menu when clicking on a link
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });
  
  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    }
  });
}

// Footer update
async function updateFooter() {
  const club = await getClub().catch(() => ({}));
  const footer = document.querySelector('.footer');
  if (footer) {
    footer.innerHTML = `
      <div class="footer-content">
        <p>&copy; 2025 ${club.clubName || 'FC Barcelona'}. Mes Que Un Club.</p>
        <p style="font-size:0.85rem;color:var(--text-muted);margin-top:0.5rem;">
          ${club.description || 'Trang quản lý câu lạc bộ bóng đá'}
        </p>
      </div>
    `;
  }
}

// Modal initialization
function initModal() {
  const modalOverlay = document.getElementById('modal-overlay');
  const modalClose = document.getElementById('modal-close');
  
  if (!modalOverlay || !modalClose) return;
  
  // Close modal when clicking the X button
  modalClose.addEventListener('click', closeModal);
  
  // Close modal when clicking the overlay (outside the modal box)
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      closeModal();
    }
  });
}

// Initialize common features
function initCommon() {
  applyTheme();
  initTheme();
  initMobileMenu();
  initModal();
  updateFooter(); // async, fire-and-forget
}
