const qs = (s, r = document) => r.querySelector(s);
const qsa = (s, r = document) => Array.from(r.querySelectorAll(s));
const getParam = (k) => new URLSearchParams(location.search).get(k);
const BASE = location.pathname.includes('/html/') ? '../' : './';

const resolveImage = (img) => {
   if (!img) return `${BASE}img/webp/selectedproducts/selected-1.webp`;
   if (/^\.\//.test(img)) return img.replace(/^\.\//, BASE);
   if (/^\.\.\//.test(img)) return img.replace(/^\.\.\//, BASE);
   return `${BASE}${img.replace(/^\/+/, '')}`;
};

const mainImg = qs('#prodMainImg');
const thumbsEl = qs('#prodThumbs');
const titleEl = qs('#prodTitle');
const priceEl = qs('#prodPrice');
const shortEl = qs('#prodShort');
const starsEl = qs('#prodStars');
const reviewsEl = qs('#prodReviews');

const selSize = qs('#optSize');
const selColor = qs('#optColor');
const selCategory = qs('#optCategory');

const qtyMinus = qs('#qtyMinus');
const qtyPlus = qs('#qtyPlus');
const qtyInput = qs('#qtyInput');
const addBtn = qs('#addToCartBtn');

const tabBtns = qsa('.tabs__btn');
const tabPanes = qsa('.tabs__pane');
const tabDetails = qs('#tab-details');

const relatedEl = qs('#relatedList');

let allProducts = [];
let product = null;

const loadProducts = () => fetch(`${BASE}assets/data.json`).then(r => r.json()).then(d => d?.data ?? d);

const stars = (n = 4) => {
   const rating = Math.max(0, Math.min(5, Math.round(n)));
   const filledHTML = '★'.repeat(rating).split('').map(() => '<span class="stars-filled">★</span>').join('');
   const emptyHTML = '☆'.repeat(5 - rating).split('').map(() => '<span class="stars-empty">☆</span>').join('');
   return filledHTML + emptyHTML;
};

function fillSelect(select, values) {
   select.innerHTML = '<option value="">Choose option</option>';
   [...new Set(values.filter(Boolean))].forEach(v => {
      const opt = document.createElement('option');
      opt.value = String(v);
      opt.textContent = String(v);
      select.appendChild(opt);
   });
}


function renderProduct(p) {
   titleEl.textContent = p.name;
   priceEl.textContent = `$${p.price}`;
   shortEl.textContent = p.shortDescription || '';

   const rating = Number(p.rating ?? 4);
   starsEl.innerHTML = stars(rating);
   reviewsEl.textContent = `(${p.reviewsCount ?? 1} Clients Review)`;

   const images = p.images?.length ? p.images : [`${BASE}img/webp/selectedproducts/selected-1.webp`];
   const mainImageUrl = resolveImage(images[0] || p.imageUrl);
   mainImg.src = mainImageUrl;
   mainImg.alt = p.name;

   thumbsEl.innerHTML = images
      .map((src, i) => {
         const resolvedSrc = resolveImage(src || p.imageUrl);
         return `<li><img class="product__thumb${i === 0 ? ' is-active' : ''}" src="${resolvedSrc}" alt="${p.name} ${i + 1}" data-src="${resolvedSrc}" loading="lazy" width="100" height="100"></li>`;
      })
      .join('');

   fillSelect(selSize, Array.isArray(p.size) ? p.size : [p.size]);
   fillSelect(selColor, Array.isArray(p.color) ? p.color : [p.color]);
   fillSelect(selCategory, Array.isArray(p.category) ? p.category : [p.category]);

   const detailsText = p.description || p.shortDescription || 'Vestibulum commodo sapien non elit porttitor, vitae volutpat nibh mollis. Nulla porta risus id neque tempor, in efficitur justo imperdiet. Etiam a ex at ante tincidunt imperdiet. Nunc congue ex vel nisl viverra, sit amet aliquet lectus ullamcorper. Praesent luctus lacus non lorem elementum, eu tristique sapien suscipit. Sed bibendum, ipsum nec viverra malesuada, erat nisi sodales purus, eget hendrerit dui ligula eu enim. Ut non est nisi. Pellentesque tristique pretium dolor eu commodo. Proin iaculis nibh vitae lectus mollis bibendum. Quisque varius eget urna sit amet luctus. Suspendisse potenti. Curabitur ac placerat est, sit amet sodales risus. Pellentesque viverra dui auctor, ullamcorper turpis pharetra, facilisis quam.';
   
   tabDetails.innerHTML = `
    <p>${detailsText}</p>
    <p>Proin iaculis nibh vitae lectus mollis bibendum. Quisque varius eget urna sit amet luctus. Suspendisse potenti. Curabitur ac placerat est, sit amet sodales risus. Pellentesque viverra dui auctor, ullamcorper turpis pharetra, facilisis quam. Proin iaculis nibh vitae lectus mollis bibendum.</p>
    <p>Quisque varius eget urna sit amet luctus. Suspendisse potenti. Curabitur ac placerat est, sit amet sodales risus. Pellentesque viverra dui auctor, ullamcorper turpis pharetra, facilisis quam.</p>
  `;
}

thumbsEl?.addEventListener('click', (e) => {
   const img = e.target.closest('img[data-src]');
   if (!img) return;
   const src = img.getAttribute('data-src');
   mainImg.src = src;
   qsa('.product__thumb', thumbsEl).forEach(t => t.classList.remove('is-active'));
   img.classList.add('is-active');
});

const setQty = (n) => {
   const v = Math.max(1, Number(n) || 1);
   if (qtyInput) {
      qtyInput.value = String(v);
   }
};

const initQty = () => {
   if (qtyMinus) {
      qtyMinus.addEventListener('click', (e) => {
         e.preventDefault();
         const current = Number(qtyInput?.value || 1);
         setQty(current - 1);
      });
   }
   
   if (qtyPlus) {
      qtyPlus.addEventListener('click', (e) => {
         e.preventDefault();
         const current = Number(qtyInput?.value || 1);
         setQty(current + 1);
      });
   }
   
   if (qtyInput) {
      qtyInput.addEventListener('input', (e) => {
         setQty(e.target.value);
      });
      
      if (!qtyInput.value || qtyInput.value === '0') {
         qtyInput.value = '1';
      }
   }
};

addBtn?.addEventListener('click', () => {
   if (!product) return;

   const size = selSize?.value || product.size || 'M';
   const color = selColor?.value || product.color || 'default';
   const cat = selCategory?.value || (Array.isArray(product.category) ? product.category[0] : product.category);

   const qty = Math.max(1, Number(qtyInput.value) || 1);

   addToCart({
      ...product,
      size,
      color,
      category: cat
   }, qty);

   addBtn.textContent = 'Added';
   setTimeout(() => (addBtn.textContent = 'Add To Cart'), 1200);
});

const switchTab = (tabId) => {
   if (!tabId) return;
   
   tabBtns.forEach(b => b.classList.remove('is-active'));
   tabPanes.forEach(p => p.classList.remove('is-active'));
   
   const btn = tabBtns.find(b => b.dataset.tab === tabId);
   const pane = qs(`#tab-${tabId}`);
   
   if (btn && pane) {
      btn.classList.add('is-active');
      pane.classList.add('is-active');
      
      const url = new URL(window.location);
      url.searchParams.set('tab', tabId);
      window.history.pushState({ tab: tabId }, '', url);
   }
};

tabBtns.forEach(btn => {
   btn.addEventListener('click', () => {
      const id = btn.dataset.tab;
      switchTab(id);
   });
});

(() => {
   const starsWrap = qs('#revStars');
   const hiddenRating = qs('#revRating');
   const reviewForm = qs('#reviewForm');
   const msg = qs('#revMsg');
   const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

   const paint = (n = 0) => {
      starsWrap?.querySelectorAll('.stars__item').forEach((btn) => {
         const on = Number(btn.dataset.rate) <= n;
         btn.classList.toggle('is-on', on);
         btn.setAttribute('aria-checked', on ? 'true' : 'false');
      });
   };

   starsWrap?.addEventListener('click', (e) => {
      const btn = e.target.closest('.stars__item');
      if (!btn) return;
      hiddenRating.value = btn.dataset.rate;
      paint(Number(hiddenRating.value));
   });

   reviewForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = qs('#revName')?.value.trim() || '';
      const email = qs('#revEmail')?.value.trim() || '';
      const text = qs('#revText')?.value.trim() || '';
      const rating = Number(hiddenRating?.value || 0);

      if (!name || !emailRe.test(email) || !text || rating < 1) {
         if (msg) msg.textContent = 'Please fill all fields correctly.';
         return;
      }

      if (msg) msg.textContent = 'Thanks for your review!';
      reviewForm.reset();
      hiddenRating.value = '';
      paint(0);
   });
})();

function renderRelated(data, currentId) {
   const pool = data.filter(p => String(p.id) !== String(currentId));
   const pick = [...pool].sort(() => Math.random() - 0.5).slice(0, 4);

   const html = pick.map((p, index) => {
      const caseNumber = (index % 12) + 1;
      const img = resolveImage(`${BASE}img/webp/catalog/case-${caseNumber}.webp`);
      const hasSale = p.salesStatus === true || p.salesStatus === 'true' || String(p.salesStatus) === 'true';
      const sale = hasSale
         ? '<span class="product-card__badge product-card__badge--sale">SALE</span>'
         : '';
      const description = p?.shortDescription || p?.description || 'Vel vestibulum elit tuvel euqen.';
      return `
      <article class="product-card related__item">
      <div class="product-card__image-wrapper" data-goto="${p.id}">
         ${sale}
         <img class="product-card__image" src="${img}" alt="${p.name}" loading="lazy" width="296" height="400">
      </div>
      <p class="product-card__description">${description}</p>
      <p class="product-card__price">$${p.price}</p>
      <div class="product-card__actions">
         <button class="btn btn--primary product-card__btn" data-add="${p.id}">
            Add To Cart
         </button>
      </div>
      </article>`;
   }).join('');

   relatedEl.innerHTML = html;
}

relatedEl?.addEventListener('click', (e) => {
   const go = e.target.closest('[data-goto]');
   if (go) {
      const id = go.getAttribute('data-goto');
      location.href = `${BASE}html/product.html?id=${id}`;
      return;
   }
   const add = e.target.closest('[data-add]');
   if (add) {
      const id = add.getAttribute('data-add');
      const p = allProducts.find(x => String(x.id) === String(id));
      if (p) {
         addToCart({
            ...p,
            color: p.color ?? 'default',
            size: p.size ?? 'M'
         }, 1);
         add.textContent = 'Added';
         setTimeout(() => (add.textContent = 'Add To Cart'), 1200);
      }
   }
});

document.addEventListener('DOMContentLoaded', () => {
   initQty();
   
   const idParam = getParam('id');
   if (!idParam) {
      location.href = `${BASE}html/catalog.html`;
      return;
   }

   loadProducts().then(data => {
      allProducts = data;
      product = allProducts.find(p => String(p.id) === String(idParam)) ||
         allProducts.find(p => Number(p.id) === Number(idParam));
      if (!product) {
         alert('Product not found');
         location.href = `${BASE}html/catalog.html`;
         return;
      }
      renderProduct(product);
      renderRelated(allProducts, product.id);
      
      initQty();
      
      const tabParam = getParam('tab');
      if (tabParam && ['details', 'reviews', 'shipping'].includes(tabParam)) {
         switchTab(tabParam);
      }
   });
});