// Common initialization script for all pages
// Theme management
function initTheme() {
  const themeToggle = document.getElementById('theme-toggle');
  if (!themeToggle) return;
  
  themeToggle.addEventListener('click', () => {
    const currentTheme = localStorage.getItem('theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', newTheme);
    applyTheme();
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
function updateFooter() {
  const club = getClub();
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

// Initialize common features
function initCommon() {
  applyTheme();
  initTheme();
  initMobileMenu();
  updateFooter();
}
