'use strict';

const COUNTRIES = [
  { code: 'PK', name: 'Pakistan',             flag: '🇵🇰', currency: 'PKR' },
  { code: 'US', name: 'United States',        flag: '🇺🇸', currency: 'USD' },
  { code: 'GB', name: 'United Kingdom',       flag: '🇬🇧', currency: 'GBP' },
  { code: 'CA', name: 'Canada',               flag: '🇨🇦', currency: 'CAD' },
  { code: 'AU', name: 'Australia',            flag: '🇦🇺', currency: 'AUD' },
  { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪', currency: 'AED' },
  { code: 'SA', name: 'Saudi Arabia',         flag: '🇸🇦', currency: 'SAR' },
  { code: 'IN', name: 'India',                flag: '🇮🇳', currency: 'INR' },
  { code: 'DE', name: 'Germany',              flag: '🇩🇪', currency: 'EUR' },
  { code: 'FR', name: 'France',               flag: '🇫🇷', currency: 'EUR' },
  { code: 'CN', name: 'China',                flag: '🇨🇳', currency: 'CNY' },
  { code: 'JP', name: 'Japan',                flag: '🇯🇵', currency: 'JPY' },
  { code: 'TR', name: 'Turkey',               flag: '🇹🇷', currency: 'TRY' },
  { code: 'BD', name: 'Bangladesh',           flag: '🇧🇩', currency: 'BDT' },
  { code: 'MY', name: 'Malaysia',             flag: '🇲🇾', currency: 'MYR' }
];

const LANGUAGES = [
  { code: 'EN', name: 'English',    flag: '🇬🇧' },
  { code: 'UR', name: 'Urdu',       flag: '🇵🇰' },
  { code: 'AR', name: 'Arabic',     flag: '🇸🇦' },
  { code: 'FR', name: 'French',     flag: '🇫🇷' },
  { code: 'ES', name: 'Spanish',    flag: '🇪🇸' },
  { code: 'DE', name: 'German',     flag: '🇩🇪' },
  { code: 'ZH', name: 'Chinese',    flag: '🇨🇳' },
  { code: 'HI', name: 'Hindi',      flag: '🇮🇳' },
  { code: 'TR', name: 'Turkish',    flag: '🇹🇷' },
  { code: 'BN', name: 'Bengali',    flag: '🇧🇩' },
  { code: 'MS', name: 'Malay',      flag: '🇲🇾' },
  { code: 'JA', name: 'Japanese',   flag: '🇯🇵' },
  { code: 'RU', name: 'Russian',    flag: '🇷🇺' },
  { code: 'PT', name: 'Portuguese', flag: '🇵🇹' },
  { code: 'IT', name: 'Italian',    flag: '🇮🇹' }
];

const RATES = {
  USD: 1, PKR: 280, GBP: 0.79, CAD: 1.36, AUD: 1.52, AED: 3.67, SAR: 3.75,
  INR: 83.5, EUR: 0.92, CNY: 7.2, JPY: 149, TRY: 34, BDT: 110, MYR: 4.7
};
const SYMBOLS = {
  USD: '$', PKR: 'Rs ', GBP: '£', CAD: 'C$', AUD: 'A$', AED: 'AED ', SAR: 'SR ',
  INR: '₹', EUR: '€', CNY: '¥', JPY: '¥', TRY: '₺', BDT: '৳', MYR: 'RM '
};

function getCountry() {
  const code = localStorage.getItem('site_country') || 'PK';
  return COUNTRIES.find((c) => c.code === code) || COUNTRIES[0];
}
function setCountry(code) {
  localStorage.setItem('site_country', code);
}
function getLanguage() {
  const code = localStorage.getItem('site_language') || 'EN';
  return LANGUAGES.find((l) => l.code === code) || LANGUAGES[0];
}
function setLanguage(code) {
  localStorage.setItem('site_language', code);
}
function getCurrency() {
  return getCountry().currency;
}

function parsePrice(text) {
  const num = parseFloat(String(text).replace(/[^0-9.]/g, ''));
  return isNaN(num) ? 0 : num;
}
function formatPrice(usd) {
  const cur = getCurrency();
  const val = usd * (RATES[cur] || 1);
  const symbol = SYMBOLS[cur] || '$';
  if (['PKR', 'INR', 'JPY', 'BDT'].includes(cur)) {
    return symbol + Math.round(val).toLocaleString();
  }
  return symbol + val.toFixed(2);
}

function tagBasePrices() {
  const selector = '.new__price, .old__price, .table__price, .cart__total-price, .order__grand-total, .table__subtotal';
  document.querySelectorAll(selector).forEach((el) => {
    if (el.dataset.usd) return;
    const text = el.textContent.trim();
    if (text.toLowerCase() === 'free shipping') {
      el.dataset.usd = '0';
      el.dataset.freeShipping = 'true';
    } else {
      el.dataset.usd = parsePrice(text);
    }
  });
}
function applyCurrency() {
  document.querySelectorAll('[data-usd]').forEach((el) => {
    if (el.dataset.freeShipping === 'true') {
      el.textContent = 'Free Shipping';
      return;
    }
    el.textContent = formatPrice(parseFloat(el.dataset.usd));
  });
}

function injectHeaderTopBar() {
  const contact = document.querySelector('.header__contact');
  if (!contact || contact.dataset.upgraded) return;
  contact.dataset.upgraded = 'true';
  contact.innerHTML = '';
  contact.style.cssText = 'display:flex;align-items:center;column-gap:1.25rem;position:relative;';

  const lang = getLanguage();
  const langBox = document.createElement('div');
  langBox.className = 'topbar__selector lang__selector';
  langBox.innerHTML = `
    <span class="topbar__flag">${lang.flag}</span>
    <span class="topbar__label">${lang.code}</span>
    <span class="topbar__caret">▾</span>
    <div class="topbar__dropdown lang__dropdown">
      <p class="topbar__dropdown-title">Choose Language</p>
      ${LANGUAGES.map((l) => `
        <div class="topbar__option" data-lang="${l.code}">
          <span class="topbar__flag">${l.flag}</span> ${l.name}
        </div>`).join('')}
    </div>
  `;

  const country = getCountry();
  const deliverBox = document.createElement('div');
  deliverBox.className = 'topbar__selector deliver__selector';
  deliverBox.innerHTML = `
    <i class="fi fi-rs-marker"></i>
    <span class="topbar__deliver-text">Deliver to<br><strong>${country.name}</strong></span>
    <div class="topbar__dropdown deliver__dropdown">
      <p class="topbar__dropdown-title">Choose your location</p>
      ${COUNTRIES.map((c) => `
        <div class="topbar__option" data-country="${c.code}">
          <span class="topbar__flag">${c.flag}</span> ${c.name}
          <span class="topbar__currency">${c.currency}</span>
        </div>`).join('')}
    </div>
  `;

  contact.appendChild(langBox);
  contact.appendChild(deliverBox);

  // Dropdown open/close
  [langBox, deliverBox].forEach((box) => {
    box.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = box.classList.contains('open');
      document.querySelectorAll('.topbar__selector.open').forEach((b) => b.classList.remove('open'));
      if (!isOpen) box.classList.add('open');
    });
  });
  document.addEventListener('click', () => {
    document.querySelectorAll('.topbar__selector.open').forEach((b) => b.classList.remove('open'));
  });

  langBox.querySelectorAll('[data-lang]').forEach((opt) => {
    opt.addEventListener('click', (e) => {
      e.stopPropagation();
      setLanguage(opt.dataset.lang);
      const l = getLanguage();
      langBox.querySelector('.topbar__label').textContent = l.code;
      langBox.querySelector('.topbar__flag').textContent = l.flag;
      langBox.classList.remove('open');
      showToast('Language set to ' + l.name);
    });
  });

  deliverBox.querySelectorAll('[data-country]').forEach((opt) => {
    opt.addEventListener('click', (e) => {
      e.stopPropagation();
      setCountry(opt.dataset.country);
      const c = getCountry();
      deliverBox.querySelector('strong').textContent = c.name;
      deliverBox.classList.remove('open');
      applyCurrency();
      renderCartPage();
      renderWishlistPage();
      showToast(`Delivering to ${c.name} (prices in ${c.currency})`);
    });
  });
}

function getCart() {
  try { return JSON.parse(localStorage.getItem('site_cart')) || []; }
  catch (e) { return []; }
}
function saveCart(cart) {
  localStorage.setItem('site_cart', JSON.stringify(cart));
}
function addToCart(product, qty = 1) {
  const cart = getCart();
  const existing = cart.find((i) => i.id === product.id);
  if (existing) existing.qty += qty;
  else cart.push({ ...product, qty });
  saveCart(cart);
  updateHeaderCounts();
  renderCartPage();
  showToast(`${product.name} added to cart`);
}
function removeFromCart(id) {
  saveCart(getCart().filter((i) => i.id !== id));
  updateHeaderCounts();
  renderCartPage();
}
function updateCartQty(id, qty) {
  const cart = getCart();
  const item = cart.find((i) => i.id === id);
  if (item) item.qty = Math.max(1, qty);
  saveCart(cart);
  updateHeaderCounts();
  renderCartPage();
}

function getWishlist() {
  try { return JSON.parse(localStorage.getItem('site_wishlist')) || []; }
  catch (e) { return []; }
}
function saveWishlist(list) {
  localStorage.setItem('site_wishlist', JSON.stringify(list));
}
function toggleWishlist(product) {
  const list = getWishlist();
  const idx = list.findIndex((i) => i.id === product.id);
  let added;
  if (idx > -1) {
    list.splice(idx, 1);
    added = false;
    showToast(`${product.name} removed from wishlist`);
  } else {
    list.push(product);
    added = true;
    showToast(`${product.name} added to wishlist`);
  }
  saveWishlist(list);
  updateHeaderCounts();
  renderWishlistPage();
  return added;
}
function removeFromWishlist(id) {
  saveWishlist(getWishlist().filter((i) => i.id !== id));
  updateHeaderCounts();
  renderWishlistPage();
}
function updateHeaderCounts() {
  const cartCount = getCart().reduce((sum, i) => sum + i.qty, 0);
  const wishlistCount = getWishlist().length;
  const cartBadge = document.querySelector('a[href="cart.html"] .count');
  const wishlistBadge = document.querySelector('a[href="wishlist.html"] .count');
  if (cartBadge) cartBadge.textContent = cartCount;
  if (wishlistBadge) wishlistBadge.textContent = wishlistCount;
}

function slugify(str) {
  return String(str).toLowerCase().trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}
function getProductDataFromCard(card) {
  const titleEl = card.querySelector('.product__title');
  const priceEl = card.querySelector('.new__price');
  const imgEl = card.querySelector('.product__img.default') || card.querySelector('.product__img');
  const name = titleEl ? titleEl.textContent.trim() : 'Product';
  const price = priceEl ? parseFloat(priceEl.dataset.usd || parsePrice(priceEl.textContent)) : 0;
  const image = imgEl ? imgEl.getAttribute('src') : '';
  return { id: slugify(name), name, price, image };
}

function initCartWishlistButtons() {
  document.addEventListener('click', (e) => {

    const cartBtn = e.target.closest('.cart__btn');
    if (cartBtn) {
      e.preventDefault();
      const card = cartBtn.closest('.product__item');
      if (card) addToCart(getProductDataFromCard(card));
      return;
    }

    const wishBtn = e.target.closest('.action__btn[aria-label="Add To Wishlist"]');
    if (wishBtn) {
      e.preventDefault();
      const card = wishBtn.closest('.product__item');
      if (card) {
        const added = toggleWishlist(getProductDataFromCard(card));
        wishBtn.classList.toggle('active-wish', added);
      }
      return;
    }

    const detailsAddBtn = e.target.closest('.details__action .btn--sm');
    if (detailsAddBtn) {
      e.preventDefault();
      const nameEl = document.querySelector('.details__title');
      const priceEl = document.querySelector('.details__price .new__price');
      const imgEl = document.querySelector('.details__img');
      const qtyInput = document.querySelector('.details__action .quantity');
      if (nameEl) {
        const name = nameEl.textContent.trim();
        const price = priceEl ? parseFloat(priceEl.dataset.usd || parsePrice(priceEl.textContent)) : 0;
        const image = imgEl ? imgEl.getAttribute('src') : '';
        const qty = qtyInput ? (parseInt(qtyInput.value, 10) || 1) : 1;
        addToCart({ id: slugify(name), name, price, image }, qty);
      }
      return;
    }

    const detailsWishBtn = e.target.closest('.details__action-btn');
    if (detailsWishBtn) {
      e.preventDefault();
      const nameEl = document.querySelector('.details__title');
      const priceEl = document.querySelector('.details__price .new__price');
      const imgEl = document.querySelector('.details__img');
      if (nameEl) {
        const name = nameEl.textContent.trim();
        const price = priceEl ? parseFloat(priceEl.dataset.usd || parsePrice(priceEl.textContent)) : 0;
        const image = imgEl ? imgEl.getAttribute('src') : '';
        toggleWishlist({ id: slugify(name), name, price, image });
      }
      return;
    }

    const wishlistAddBtn = e.target.closest('.wishlist .btn--sm');
    if (wishlistAddBtn) {
      e.preventDefault();
      const row = wishlistAddBtn.closest('tr');
      const id = row && row.dataset.id;
      if (id) {
        const item = getWishlist().find((i) => i.id === id);
        if (item) addToCart(item);
      }
      return;
    }

    const trash = e.target.closest('.table__trash');
    if (trash) {
      const row = trash.closest('tr');
      if (row && row.dataset.id) {
        if (row.closest('.cart')) removeFromCart(row.dataset.id);
        else if (row.closest('.wishlist')) removeFromWishlist(row.dataset.id);
      }
      return;
    }
  });

  document.addEventListener('change', (e) => {
    if (e.target.matches('.cart .quantity')) {
      const row = e.target.closest('tr');
      if (row && row.dataset.id) {
        updateCartQty(row.dataset.id, parseInt(e.target.value, 10) || 1);
      }
    }
  });
}

function renderCartPage() {
  const table = document.querySelector('.cart .table');
  if (!table) return;

  const cart = getCart();
  const headerRow = table.querySelector('tr');
  table.innerHTML = '';
  table.appendChild(headerRow);

  if (cart.length === 0) {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td colspan="6" style="text-align:center;padding:2.5rem 1rem;">
        Your cart is empty. <a href="shop.html" style="color:var(--first-color);font-weight:600;">Continue Shopping</a>
      </td>`;
    table.appendChild(tr);
  } else {
    cart.forEach((item) => {
      const tr = document.createElement('tr');
      tr.dataset.id = item.id;
      tr.innerHTML = `
        <td><img src="${item.image}" alt="" class="table__img"></td>
        <td><h3 class="table__title">${item.name}</h3></td>
        <td><span class="table__price">${formatPrice(item.price)}</span></td>
        <td><input type="number" min="1" value="${item.qty}" class="quantity"></td>
        <td><span class="table__subtotal">${formatPrice(item.price * item.qty)}</span></td>
        <td><i class="fi fi-rs-trash table__trash" style="cursor:pointer;"></i></td>
      `;
      table.appendChild(tr);
    });
  }

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = cart.length ? 15 : 0;
  const total = subtotal + shipping;
  const totalCells = document.querySelectorAll('.cart__total-table .cart__total-price');
  if (totalCells.length >= 3) {
    totalCells[0].textContent = formatPrice(subtotal);
    totalCells[1].textContent = cart.length ? formatPrice(shipping) : 'Free';
    totalCells[2].textContent = formatPrice(total);
  }
}

function renderWishlistPage() {
  const table = document.querySelector('.wishlist .table');
  if (!table) return;

  const list = getWishlist();
  const headerRow = table.querySelector('tr');
  table.innerHTML = '';
  table.appendChild(headerRow);

  if (list.length === 0) {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td colspan="6" style="text-align:center;padding:2.5rem 1rem;">
        Your wishlist is empty. <a href="shop.html" style="color:var(--first-color);font-weight:600;">Browse Products</a>
      </td>`;
    table.appendChild(tr);
  } else {
    list.forEach((item) => {
      const tr = document.createElement('tr');
      tr.dataset.id = item.id;
      tr.innerHTML = `
        <td><img src="${item.image}" alt="" class="table__img"></td>
        <td><h3 class="table__title">${item.name}</h3></td>
        <td><span class="table__price">${formatPrice(item.price)}</span></td>
        <td><span class="table__stock">In Stock</span></td>
        <td><a href="#" class="btn btn--sm">Add to Cart</a></td>
        <td><i class="fi fi-rs-trash table__trash" style="cursor:pointer;"></i></td>
      `;
      table.appendChild(tr);
    });
  }
}

function filterProducts(query) {
  const items = document.querySelectorAll('.products__container.grid > .product__item, .products .tab__item.active-tab .product__item');
  let count = 0;
  items.forEach((item) => {
    const title = item.querySelector('.product__title');
    const text = title ? title.textContent.toLowerCase() : '';
    const match = !query || text.includes(query);
    item.style.display = match ? '' : 'none';
    if (match) count++;
  });
  const totalEl = document.querySelector('.total__products span');
  if (totalEl) totalEl.textContent = count;
}

function initSearch() {
  const searchInputs = document.querySelectorAll('.header__search .form__input');
  const searchBtns = document.querySelectorAll('.search__btn');
  const onShopPage = !!document.querySelector('.total__products');

  function doSearch(rawQuery) {
    const query = (rawQuery || '').trim().toLowerCase();
    if (onShopPage) {
      filterProducts(query);
    } else if (query) {
      window.location.href = 'shop.html?search=' + encodeURIComponent(query);
    }
  }

  searchBtns.forEach((btn, i) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      doSearch(searchInputs[i] ? searchInputs[i].value : '');
    });
  });

  searchInputs.forEach((input) => {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        doSearch(input.value);
      }
    });
  });

  if (onShopPage) {
    const params = new URLSearchParams(window.location.search);
    const q = params.get('search');
    if (q) {
      searchInputs.forEach((inp) => { inp.value = q; });
      filterProducts(q.toLowerCase());
    }
  }
}

function initSwipers() {
  if (typeof Swiper === 'undefined') return;

  const catContainer = document.querySelector('.categories__container.swiper');
  if (catContainer) {
    new Swiper(catContainer, {
      slidesPerView: 'auto',
      spaceBetween: 16,
      navigation: {
        nextEl: catContainer.querySelector('.categories-next'),
        prevEl: catContainer.querySelector('.categories-prev')
      }
    });
  }

  const newContainer = document.querySelector('.new__container.swiper');
  if (newContainer) {
    new Swiper(newContainer, {
      slidesPerView: 2,
      slidesPerGroup: 1,
      spaceBetween: 16,
      breakpoints: {
        576: { slidesPerView: 2, spaceBetween: 16 },
        768: { slidesPerView: 3, spaceBetween: 18 },
        992: { slidesPerView: 4, spaceBetween: 20 },
        1200: { slidesPerView: 5, spaceBetween: 24 }
      },
      navigation: {
        nextEl: newContainer.querySelector('.categories-next'),
        prevEl: newContainer.querySelector('.categories-prev')
      }
    });
  }
}

function initTabGroup(btnSelector, contentSelector) {
  const btns = document.querySelectorAll(btnSelector);
  if (!btns.length) return;
  btns.forEach((btn) => {
    btn.addEventListener('click', () => {
      btns.forEach((b) => b.classList.remove('active-tab'));
      btn.classList.add('active-tab');
      const targetSel = btn.dataset.target;
      document.querySelectorAll(contentSelector).forEach((c) => c.classList.remove('active-tab'));
      const target = targetSel ? document.querySelector(targetSel) : null;
      if (target) target.classList.add('active-tab');
    });
  });
}
function initHomeTabs() { initTabGroup('.tab__btns .tab__btn', '.tab__items .tab__item'); }
function initAccountTabs() { initTabGroup('.account__tabs .account__tab', '.tabs__content .tab__content'); }
function initDetailTabs() { initTabGroup('.detail__tabs .detail__tab', '.details__tabs-content .details__tab-content'); }

function initMobileMenu() {
  const nav = document.querySelector('.nav');
  const menu = document.querySelector('.nav__menu');
  if (!nav || !menu || document.querySelector('.nav__toggle')) return;

  const toggleBtn = document.createElement('div');
  toggleBtn.className = 'nav__toggle';
  toggleBtn.innerHTML = '&#9776;'; 
  toggleBtn.setAttribute('aria-label', 'Open menu');
  nav.appendChild(toggleBtn);

  toggleBtn.addEventListener('click', () => {
    menu.classList.toggle('show-menu');
  });

  document.addEventListener('click', (e) => {
    if (menu.classList.contains('show-menu') &&
        !menu.contains(e.target) &&
        !toggleBtn.contains(e.target)) {
      menu.classList.remove('show-menu');
    }
  });
}

function showToast(msg) {
  let toast = document.getElementById('site-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'site-toast';
    toast.style.cssText =
      'position:fixed;bottom:20px;right:20px;background:hsl(176,88%,27%);color:#fff;padding:12px 20px;' +
      'border-radius:6px;font-size:14px;z-index:9999;opacity:0;transition:opacity .3s;' +
      'box-shadow:0 4px 12px rgba(0,0,0,.15);max-width:260px;';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.opacity = '1';
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => { toast.style.opacity = '0'; }, 2200);
}

function initCountdowns() {
  const countdowns = document.querySelectorAll('.countdown');

  countdowns.forEach((countdown) => {
    const amounts = countdown.querySelectorAll('.countdown__amount');
    if (amounts.length < 4) return;

    const daysEl = amounts[0].querySelector('.countdown__period');
    const hoursEl = amounts[1].querySelector('.countdown__period');
    const minsEl = amounts[2].querySelector('.countdown__period');
    const secEl = amounts[3].querySelector('.countdown__period');
    if (!daysEl || !hoursEl || !minsEl || !secEl) return;

    const originalDuration =
      (parseInt(daysEl.textContent, 10) || 0) * 86400 +
      (parseInt(hoursEl.textContent, 10) || 0) * 3600 +
      (parseInt(minsEl.textContent, 10) || 0) * 60 +
      (parseInt(secEl.textContent, 10) || 0);

    if (originalDuration <= 0) return;

    let remaining = originalDuration;

    function render() {
      const days = Math.floor(remaining / 86400);
      const hours = Math.floor((remaining % 86400) / 3600);
      const mins = Math.floor((remaining % 3600) / 60);
      const secs = remaining % 60;
      daysEl.textContent = String(days).padStart(2, '0');
      hoursEl.textContent = String(hours).padStart(2, '0');
      minsEl.textContent = String(mins).padStart(2, '0');
      secEl.textContent = String(secs).padStart(2, '0');
    }

    render();

    setInterval(() => {
      remaining -= 1;
      if (remaining < 0) {
        remaining = originalDuration; 
      }
      render();
    }, 1000);
  });
}

function injectHelperStyles() {
  if (document.getElementById('site-helper-styles')) return;
  const style = document.createElement('style');
  style.id = 'site-helper-styles';
  style.textContent = `
    /* ---- Amazon-style dark top bar ---- */
    .header__top{
      background-color: #131921 !important;
      border-bottom: 1px solid #232f3e !important;
    }
    .header__alert-news{ color:#fff !important; }
    .header__top-action{ color:#fff !important; font-weight:600; }
    .header__top-action:hover{ text-decoration:underline; }

    .topbar__selector{
      display:flex;
      align-items:center;
      column-gap:0.4rem;
      color:#fff;
      font-size:var(--small-font-size);
      cursor:pointer;
      padding:0.4rem 0.6rem;
      border:1px solid transparent;
      border-radius:0.25rem;
      position:relative;
    }
    .topbar__selector:hover{ border-color:#fff; }
    .topbar__flag{ font-size:1.05rem; line-height:1; }
    .topbar__caret{ font-size:0.7rem; margin-left:0.1rem; }
    .deliver__selector i{ font-size:1rem; }
    .topbar__deliver-text{ line-height:1.15; font-size:var(--tiny-font-size); }
    .topbar__deliver-text strong{ font-size:var(--small-font-size); display:block; }

    .topbar__dropdown{
      display:none;
      position:absolute;
      top: calc(100% + 10px);
      left:0;
      background:#fff;
      color:var(--text-color);
      min-width:230px;
      max-height:320px;
      overflow-y:auto;
      border-radius:0.5rem;
      box-shadow:0 8px 24px rgba(0,0,0,.25);
      padding:0.5rem 0;
      z-index:2000;
    }
    .topbar__selector.open .topbar__dropdown{ display:block; }
    .topbar__dropdown-title{
      font-size:var(--small-font-size);
      font-weight:700;
      padding:0.5rem 1rem;
      color:var(--text-color-light);
      border-bottom:1px solid var(--border-color-alt);
      margin-bottom:0.25rem;
    }
    .topbar__option{
      padding:0.55rem 1rem;
      display:flex;
      align-items:center;
      column-gap:0.5rem;
      font-size:var(--small-font-size);
      white-space:nowrap;
    }
    .topbar__option:hover{ background:var(--first-color-alt); }
    .topbar__currency{ color:var(--text-color-light); font-size:var(--tiny-font-size); margin-left:auto; }

    @media screen and (max-width:768px){
      .topbar__deliver-text{ display:none; }
      .header__alert-news{ display:none; }
    }

    /* ---- Wishlist active state ---- */
    .action__btn.active-wish{
      background-color: var(--first-color);
      border-color: var(--first-color);
      color:#fff;
    }

    /* ---- Mobile hamburger menu ---- */
    .nav__toggle{
      display:none;
      align-items:center;
      justify-content:center;
      font-size:1.8rem;
      line-height:1;
      cursor:pointer;
      color: var(--title-color);
      margin-left:1rem;
      padding:0.25rem 0.5rem;
      z-index: 1100;
      position: relative;
      user-select: none;
    }
    @media screen and (max-width: 992px){
      .nav__toggle{ display:flex; }
      .nav__menu{
        position: fixed !important;
        top: 0 !important;
        right: -100%;
        background: var(--body-color) !important;
        width: 80%;
        max-width: 320px;
        height: 100vh !important;
        min-height: 100vh;
        flex-direction: column;
        align-items: flex-start;
        padding: 2rem 1.5rem;
        box-shadow: -2px 0 10px rgba(0,0,0,.15);
        transition: right 0.3s ease;
        z-index: 5000 !important;
        overflow-y: auto;
        margin-left: 0;
      }
      .nav__menu.show-menu{ right: 0; }
      .nav__list{
        flex-direction: column;
        align-items: flex-start;
        row-gap: 1rem;
        margin-right: 0;
        margin-bottom: 1.5rem;
      }
      .header__search{ width: 100%; margin-bottom: 1.5rem; }
      .header__user-actions{ column-gap: 2rem; }
    }
  `;
  document.head.appendChild(style);
}

document.addEventListener('DOMContentLoaded', () => {
  injectHelperStyles();
  injectHeaderTopBar();
  initMobileMenu();
  initSwipers();
  initHomeTabs();
  initAccountTabs();
  initDetailTabs();
  tagBasePrices();
  applyCurrency();
  initCartWishlistButtons();
  renderCartPage();
  renderWishlistPage();
  updateHeaderCounts();
  initSearch();
  initCountdowns();
});