const ENV = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env : {};
const PAYPAL_COMPONENTS = 'buttons,marks,funding-eligibility';
const DEFAULT_PAYPAL_CONFIG = {
  clientId: 'sb',
  currency: 'USD',
  intent: 'capture',
  enableFunding: ['venmo', 'paylater', 'card'],
  disableFunding: []
};

function getMetaContent(name) {
  const tag = document.querySelector(`meta[name="${name}"]`);
  const value = tag?.getAttribute('content') ?? '';
  return value.trim();
}

function getCheckoutRoot() {
  return document.getElementById('checkout-root');
}

function parseList(value) {
  if (!value) return [];
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function resolveFundingConstant(paypal, source) {
  if (!source) return null;
  if (typeof source === 'string') {
    return paypal.FUNDING[source.toUpperCase()] ?? null;
  }
  return source;
}

function getPayPalConfig() {
  const root = getCheckoutRoot();
  const dataset = root?.dataset ?? {};

  const clientId = (dataset.paypalClientId || getMetaContent('paypal-client-id') || ENV.VITE_PAYPAL_CLIENT_ID || '').trim();
  const merchantId = (dataset.paypalMerchantId || getMetaContent('paypal-merchant-id') || '').trim();
  const currency = (dataset.paypalCurrency || getMetaContent('paypal-currency') || ENV.VITE_PAYPAL_CURRENCY || '').trim();
  const intent = (dataset.paypalIntent || getMetaContent('paypal-intent') || ENV.VITE_PAYPAL_INTENT || '').trim();
  const enableFundingValue = dataset.paypalEnableFunding || getMetaContent('paypal-enable-funding') || ENV.VITE_PAYPAL_ENABLE_FUNDING || '';
  const disableFundingValue = dataset.paypalDisableFunding || getMetaContent('paypal-disable-funding') || ENV.VITE_PAYPAL_DISABLE_FUNDING || '';

  const enableFunding = parseList(enableFundingValue);
  const disableFunding = parseList(disableFundingValue);

  return {
    clientId: clientId || DEFAULT_PAYPAL_CONFIG.clientId,
    merchantId: merchantId || null,
    currency: currency || DEFAULT_PAYPAL_CONFIG.currency,
    intent: intent || DEFAULT_PAYPAL_CONFIG.intent,
    enableFunding: enableFunding.length ? enableFunding : DEFAULT_PAYPAL_CONFIG.enableFunding,
    disableFunding
  };
}

const DEFAULT_PRODUCT = {
  id: 'p1',
  title: 'Arcana Guidebook (Digital)',
  description: 'A concise PDF to interpret spreads and symbols.',
  price: 9.99,
  image: '/src/assets/images/product-sample.jpg'
};

const state = {
  product: DEFAULT_PRODUCT,
  quantity: 1
};

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value);
}

async function fetchProducts() {
  try {
    const response = await fetch('/data/products.json');
    if (!response.ok) throw new Error('Could not load products');
    return await response.json();
  } catch (error) {
    console.warn('[checkout] Failed to fetch products, falling back to default.', error);
    return [];
  }
}

async function resolveProduct() {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get('product');
  const quantityParam = parseInt(params.get('qty') ?? '1', 10);

  if (!Number.isNaN(quantityParam) && quantityParam > 0) {
    state.quantity = Math.min(quantityParam, 99);
  }

  if (!productId) {
    return DEFAULT_PRODUCT;
  }

  const products = await fetchProducts();
  const match = products.find((item) => item.id === productId);
  return match ?? DEFAULT_PRODUCT;
}

function renderOrderSummary() {
  const itemsRoot = document.getElementById('order-items');
  const subtotalEl = document.getElementById('order-subtotal');
  const totalEl = document.getElementById('order-total');

  if (!itemsRoot || !subtotalEl || !totalEl) return;

  itemsRoot.innerHTML = '';

  const itemRow = document.createElement('div');
  itemRow.className = 'flex items-start gap-4';

  const thumbnail = document.createElement('img');
  thumbnail.src = state.product.image;
  thumbnail.alt = state.product.title;
  thumbnail.className = 'h-16 w-16 rounded-xl border border-white/10 object-cover';

  const details = document.createElement('div');
  details.className = 'flex-1 space-y-1';

  const title = document.createElement('h3');
  title.className = 'text-lg font-semibold text-white';
  title.textContent = state.product.title;

  const description = document.createElement('p');
  description.className = 'text-sm text-white/60';
  description.textContent = state.product.description;

  const quantityWrapper = document.createElement('label');
  quantityWrapper.className = 'flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/50 mt-3';
  quantityWrapper.innerHTML = '<span>Quantity</span>';

  const quantityInput = document.createElement('input');
  quantityInput.type = 'number';
  quantityInput.min = '1';
  quantityInput.max = '99';
  quantityInput.value = state.quantity.toString();
  quantityInput.className = 'w-16 rounded-lg border border-white/20 bg-black/40 px-2 py-1 text-white focus:border-moon focus:outline-none focus:ring-1 focus:ring-moon';

  quantityInput.addEventListener('change', () => {
    const value = parseInt(quantityInput.value, 10);
    if (Number.isNaN(value) || value <= 0) {
      quantityInput.value = state.quantity.toString();
      return;
    }
    state.quantity = Math.min(value, 99);
    quantityInput.value = state.quantity.toString();
    updateTotals();
  });

  quantityWrapper.appendChild(quantityInput);

  const price = document.createElement('p');
  price.className = 'text-sm text-white/70';
  price.textContent = `Unit price · ${formatCurrency(state.product.price)}`;

  details.append(title, description, quantityWrapper, price);

  const lineTotal = document.createElement('span');
  lineTotal.className = 'text-white text-lg font-medium';
  lineTotal.id = 'order-line-total';

  itemRow.append(thumbnail, details, lineTotal);
  itemsRoot.appendChild(itemRow);

  updateTotals();
}

function updateTotals() {
  const subtotalEl = document.getElementById('order-subtotal');
  const totalEl = document.getElementById('order-total');
  const lineTotalEl = document.getElementById('order-line-total');

  const subtotal = state.product.price * state.quantity;

  if (subtotalEl) subtotalEl.textContent = formatCurrency(subtotal);
  if (totalEl) totalEl.textContent = formatCurrency(subtotal);
  if (lineTotalEl) lineTotalEl.textContent = formatCurrency(subtotal);
}

let paypalScriptPromise;
function loadPayPalSdk() {
  if (window.paypal) return Promise.resolve(window.paypal);
  if (!paypalScriptPromise) {
    const config = getPayPalConfig();
    const params = new URLSearchParams({
      'client-id': config.clientId,
      components: PAYPAL_COMPONENTS,
      currency: config.currency,
      intent: config.intent
    });

    if (config.enableFunding.length) {
      params.set('enable-funding', config.enableFunding.join(','));
    }

    if (config.disableFunding.length) {
      params.set('disable-funding', config.disableFunding.join(','));
    }

    if (config.merchantId) {
      params.set('merchant-id', config.merchantId);
    }

    paypalScriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?${params.toString()}`;
      script.async = true;
      script.onload = () => resolve(window.paypal);
      script.onerror = () => reject(new Error('Failed to load PayPal SDK'));
      document.head.appendChild(script);
    });
  }
  return paypalScriptPromise;
}

function showMessage(content, tone = 'success') {
  const messageEl = document.getElementById('transaction-message');
  if (!messageEl) return;
  messageEl.classList.remove('hidden');
  messageEl.textContent = content;

  if (tone === 'error') {
    messageEl.classList.remove('border-emerald-400/40', 'text-emerald-200', 'bg-emerald-500/10');
    messageEl.classList.add('border-rose-400/40', 'text-rose-200', 'bg-rose-500/10');
  } else {
    messageEl.classList.remove('border-rose-400/40', 'text-rose-200', 'bg-rose-500/10');
    messageEl.classList.add('border-emerald-400/40', 'text-emerald-200', 'bg-emerald-500/10');
  }
}

function renderMarks(paypal) {
  const marksRoot = document.getElementById('funding-marks');
  const cardMarksRoot = document.getElementById('card-marks');
  if (!marksRoot || !cardMarksRoot) return;

  const config = getPayPalConfig();
  const enabledFunding = new Set(config.enableFunding.map((source) => resolveFundingConstant(paypal, source)).filter(Boolean));
  const disabledFunding = new Set(config.disableFunding.map((source) => resolveFundingConstant(paypal, source)).filter(Boolean));

  const expressSources = [paypal.FUNDING.PAYPAL, paypal.FUNDING.VENMO, paypal.FUNDING.PAYLATER].filter((source) => {
    if (source === paypal.FUNDING.PAYPAL) return true;
    if (disabledFunding.has(source)) return false;
    if (!enabledFunding.size) return true;
    return enabledFunding.has(source);
  });

  expressSources.forEach((fundingSource) => {
    if (!paypal.Marks) return;
    const mark = paypal.Marks({ fundingSource });
    if (!mark.isEligible()) return;
    const container = document.createElement('div');
    container.className = 'bg-white rounded-lg px-3 py-1 shadow-sm';
    marksRoot.appendChild(container);
    mark.render(container);
  });

  if (paypal.Marks && !disabledFunding.has(paypal.FUNDING.CARD)) {
    const cardMark = paypal.Marks({ fundingSource: paypal.FUNDING.CARD });
    if (cardMark.isEligible()) {
      const container = document.createElement('div');
      container.className = 'bg-white rounded-lg px-3 py-1 shadow-sm';
      cardMarksRoot.appendChild(container);
      cardMark.render(container);
    }
  }
}

function renderButtons(paypal) {
  const config = getPayPalConfig();
  const createOrder = (data, actions) => {
    const amount = (state.product.price * state.quantity).toFixed(2);
    return actions.order.create({
      purchase_units: [
        {
          amount: { value: amount },
          description: state.product.title
        }
      ]
    });
  };

  const onApprove = async (data, actions) => {
    const order = await actions.order.capture();
    const payerName = order?.payer?.name?.given_name ?? 'friend';
    showMessage(`Thanks, ${payerName}! Your payment (${order.id}) was approved.`);
  };

  const onError = (error) => {
    console.error('[checkout] PayPal button error:', error);
    showMessage('Something went wrong while processing the payment. Please try another option or refresh the page.', 'error');
  };

  const enabledFundingSources = new Set([
    paypal.FUNDING.PAYPAL,
    ...config.enableFunding
      .map((source) => resolveFundingConstant(paypal, source))
      .filter(Boolean)
  ]);

  const disabledFundingSources = new Set(
    config.disableFunding
      .map((source) => resolveFundingConstant(paypal, source))
      .filter(Boolean)
  );

  const buttonConfigs = [
    { fundingSource: paypal.FUNDING.PAYPAL, selector: '#paypal-button-container', style: { layout: 'vertical', shape: 'rect', color: 'gold', height: 48 } },
    { fundingSource: paypal.FUNDING.VENMO, selector: '#venmo-button-container', style: { layout: 'vertical', shape: 'rect', color: 'blue', height: 48 } },
    { fundingSource: paypal.FUNDING.PAYLATER, selector: '#paylater-button-container', style: { layout: 'vertical', shape: 'rect', color: 'gold', label: 'paylater', height: 48 } },
    { fundingSource: paypal.FUNDING.CARD, selector: '#card-button-container', style: { layout: 'vertical', shape: 'rect', label: 'card', height: 48 } }
  ].filter(({ fundingSource }) => enabledFundingSources.has(fundingSource) && !disabledFundingSources.has(fundingSource));

  const fundingHint = document.getElementById('funding-hint');
  const eligibleFunding = new Set();

  buttonConfigs.forEach(({ fundingSource, selector, style }) => {
    const container = document.querySelector(selector);
    if (!container) return;
    const button = paypal.Buttons({ fundingSource, style, createOrder, onApprove, onError });
    if (button.isEligible()) {
      button.render(container);
      eligibleFunding.add(fundingSource);
    } else {
      container.classList.add('hidden');
    }
  });

  if (fundingHint) {
    const hasAlternateFunding = [...eligibleFunding].some((source) => source !== paypal.FUNDING.PAYPAL);
    fundingHint.classList.toggle('hidden', hasAlternateFunding);
  }
}

export async function initCheckout() {
  state.product = await resolveProduct();
  renderOrderSummary();

  try {
    const paypal = await loadPayPalSdk();
    renderMarks(paypal);
    renderButtons(paypal);
  } catch (error) {
    console.error('[checkout] Unable to initialise PayPal SDK', error);
    showMessage('Unable to load PayPal checkout at the moment. Please refresh or try again later.', 'error');
  }
}
