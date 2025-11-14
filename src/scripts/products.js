export async function loadProducts() {
  const grid = document.getElementById('product-grid');
  if (!grid) return;

  try {
    const res = await fetch('/data/products.json');
    if (!res.ok) throw new Error('Failed to load products');
    const products = await res.json();

    grid.innerHTML = products.map(p => `
      <div class="card overflow-hidden">
        <img src="${p.image}" alt="${p.title}" class="w-full h-48 object-cover">
        <div class="p-4">
          <h3 class="text-white/90 font-semibold">${p.title}</h3>
          <p class="text-white/60 text-sm mt-1">${p.description}</p>
          <div class="flex items-center justify-between mt-4">
            <span class="moon-text font-medium">$${p.price.toFixed(2)}</span>
            <button class="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20">View</button>
          </div>
        </div>
      </div>
    `).join('');
  } catch (error) {
    console.error('Error loading products:', error);
    grid.innerHTML = `
      <div class="col-span-full card p-8 text-center">
        <p class="text-white/70">Unable to load products at this time.</p>
        <p class="text-white/50 text-sm mt-2">Please try again later.</p>
      </div>
    `;
  }
}