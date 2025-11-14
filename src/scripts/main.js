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

inject('#navbar', '/components/navbar.html');
inject('#footer', '/components/footer.html');