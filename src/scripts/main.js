import '../styles/main.css';

// Inject navbar and footer
async function inject(selector, url) {
  const el = document.querySelector(selector);
  if (!el) return;
  const res = await fetch(url);
  const html = await res.text();
  el.innerHTML = html;
  return true;
}

inject('#navbar', '/components/navbar.html').then(() => {
  // Initialize navbar menu after it's loaded
  initNavbarMenu();
});
inject('#footer', '/components/footer.html');

// Navbar menu toggle functionality
function initNavbarMenu() {
  const button = document.getElementById('nav-menu-button');
  const panel = document.getElementById('nav-menu-panel');
  const icon = document.querySelector('[data-menu-icon]');

  if (!button || !panel) return;

  let isOpen = false;

  function toggleMenu() {
    isOpen = !isOpen;

    if (isOpen) {
      panel.classList.remove('hidden');
      panel.style.position = 'absolute';
      panel.style.right = '0';
      panel.style.top = 'calc(100% + 0.5rem)';
      button.setAttribute('aria-expanded', 'true');
      if (icon) icon.style.transform = 'rotate(180deg)';
    } else {
      panel.classList.add('hidden');
      button.setAttribute('aria-expanded', 'false');
      if (icon) icon.style.transform = 'rotate(0deg)';
    }
  }

  function closeMenu() {
    if (isOpen) {
      isOpen = false;
      panel.classList.add('hidden');
      button.setAttribute('aria-expanded', 'false');
      if (icon) icon.style.transform = 'rotate(0deg)';
    }
  }

  // Toggle on button click
  button.addEventListener('click', function(e) {
    e.stopPropagation();
    toggleMenu();
  });

  // Close when clicking outside
  document.addEventListener('click', function(e) {
    if (!panel.contains(e.target) && e.target !== button) {
      closeMenu();
    }
  });

  // Close when pressing Escape
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeMenu();
    }
  });
}

// Footer year
document.addEventListener('DOMContentLoaded', () => {
  const yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();
});