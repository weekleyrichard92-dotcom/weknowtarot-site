import '../styles/main.css';

// Inject navbar and footer
async function inject(selector, url) {
  const el = document.querySelector(selector);
  if (!el) return;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to load ${url}`);
    const html = await res.text();
    el.innerHTML = html;

    // Initialize navbar menu after navbar is loaded
    if (selector === '#navbar') {
      initNavbarMenu();
    }

    // Update footer year after footer is loaded
    if (selector === '#footer') {
      const yr = document.getElementById('year');
      if (yr) yr.textContent = new Date().getFullYear();
    }
  } catch (error) {
    console.error(`Error loading ${selector}:`, error);
    el.innerHTML = `<div class="text-white/50 p-4">Failed to load content</div>`;
  }
}

// Initialize the navbar menu functionality
function initNavbarMenu() {
  const menuBtn = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (!menuBtn || !mobileMenu) {
    console.warn('Menu button or mobile menu not found');
    return;
  }

  // Toggle menu
  menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    mobileMenu.classList.toggle('hidden');
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!mobileMenu.contains(e.target) && !menuBtn.contains(e.target)) {
      mobileMenu.classList.add('hidden');
    }
  });

  // Close menu on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !mobileMenu.classList.contains('hidden')) {
      mobileMenu.classList.add('hidden');
    }
  });
}

inject('#navbar', '/components/navbar.html');
inject('#footer', '/components/footer.html');