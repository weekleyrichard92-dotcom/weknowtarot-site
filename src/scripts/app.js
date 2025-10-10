export function initAppPlaceholder() {
  const host = document.getElementById('app-placeholder');
  if (!host) return;
  host.innerHTML = `
    <div class="card p-8 text-center">
      <h3 class="text-2xl font-serif gold-text">Tarot Reading App</h3>
      <p class="text-white/70 mt-2">Coming soon — divine insights are brewing.</p>
      <div class="mt-6 flex items-center justify-center gap-2 text-white/60">
        <div class="h-2 w-2 rounded-full bg-white/30 animate-pulse"></div>
        <div class="h-2 w-2 rounded-full bg-white/30 animate-pulse [animation-delay:150ms]"></div>
        <div class="h-2 w-2 rounded-full bg-white/30 animate-pulse [animation-delay:300ms]"></div>
      </div>
    </div>
  `;
}