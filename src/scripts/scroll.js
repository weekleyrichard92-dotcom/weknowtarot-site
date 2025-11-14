document.addEventListener('DOMContentLoaded', () => {
  if (window.location.hash === '#importer') {
    const target = document.querySelector('[data-section="importer"]');
    target?.scrollIntoView({ behavior: 'smooth' });
  }
});
