import '../styles/main.css';

// Inject navbar and footer
async function inject(selector, url) {
  const el = document.querySelector(selector);
  if (!el) return;
  const res = await fetch(url);
  const html = await res.text();
  el.innerHTML = html;
}

inject('#navbar', '/components/navbar.html');
inject('#footer', '/components/footer.html');

// Footer year
document.addEventListener('DOMContentLoaded', () => {
  const yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();
});