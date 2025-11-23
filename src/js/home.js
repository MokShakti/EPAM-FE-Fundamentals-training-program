const qs = (sel, root = document) => root.querySelector(sel);
const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const BASE = location.pathname.includes('/html/') ? '../' : './';
const loadProducts = () =>
   fetch(`${BASE}assets/data.json`)
      .then((res) => {
         if (!res.ok) throw new Error(`Failed to load JSON: ${res.status}`);
         return res.json();
      })
      .then((d) => d?.data ?? d);

const resolveImage = (p) => {
   const raw = p?.imageUrl || (Array.isArray(p?.images) ? p.images[0] : '');
   if (!raw) return `${BASE}img/webp/selectedproducts/selected-1.webp`;
   if (raw.startsWith('./')) return raw.replace(/^\.\//, BASE);
   if (raw.startsWith('../')) return raw.replace(/^\.\.\//, BASE);
   return `${BASE}${raw.replace(/^\/+/, '')}`;
};
const getName = (p) => p?.name ?? 'Product';
const getPrice = (p) => Number(p?.price ?? 0);
const goToProduct = (id) => {
   const url = `${BASE}html/product.html?id=${encodeURIComponent(id)}`;
   window.location.href = url;
};
const productCardHTML = (p, useViewButton = false) => {
   const img = resolveImage(p);
   const title = getName(p);
   const price = getPrice(p);
   const isSale = Boolean(p?.salesStatus || p?.sale || p?.onSale);
   const description = p?.shortDescription || p?.description || 'Vel vestibulum elit<br>tuvel eugen.';
   const buttonText = useViewButton ? 'View Product' : 'Add To Cart';
   const buttonClass = useViewButton ? 'js-view' : 'js-add';

   return `
    <article class="product-card selected__item" data-id="${p.id}">
      <div class="product-card__image-wrapper">
        ${isSale ? '<span class="product-card__badge product-card__badge--sale">SALE</span>' : ''}
        <img class="product-card__image" src="${img}" alt="${title}" loading="lazy" width="296" height="400">
      </div>

      <p class="product-card__description">${description}</p>
      <p class="product-card__price">$${price}</p>

      <div class="product-card__actions">
        <button class="btn btn--primary product-card__btn ${buttonClass}" type="button">${buttonText}</button>
      </div>
    </article>
  `;
};
const bindProductCardEvents = (container) => {
   container.addEventListener('click', (e) => {
      const card = e.target.closest('.product-card');
      if (!card) return;

      const id = card.dataset.id;
      if (e.target.closest('.js-add')) {
         if (typeof window.addToCart === 'function') {
            const product = card.__data;
            window.addToCart(product, 1);
         }
         return;
      }
      if (e.target.closest('.js-view')) {
         goToProduct(id);
         return;
      }
      if (!e.target.closest('button')) {
         goToProduct(id);
      }
   });
};
const renderProducts = (list, container, useViewButton = false) => {
   if (!container) return;
   container.innerHTML = list.map(p => productCardHTML(p, useViewButton)).join('');
   qsa('.product-card', container).forEach((el, i) => {
      el.__data = list[i];
   });

   bindProductCardEvents(container);
};
const pickSelected = (all) => {
   const selected = all.filter((p) =>
      Array.isArray(p?.blocks) && p.blocks.includes("Selected Products")
   );

   const order = ['selected-1.webp', 'selected-2.webp', 'selected-3.webp', 'selected-4.webp'];
   const sorted = selected.sort((a, b) => {
      const aImg = a?.imageUrl || '';
      const bImg = b?.imageUrl || '';
      const aIndex = order.findIndex(img => aImg.includes(img));
      const bIndex = order.findIndex(img => bImg.includes(img));

      if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;
      return 0;
   });

   return sorted.slice(0, 4);
};
const pickNew = (all) => {
   const ids = ['SU003', 'SU013', 'SU010', 'SU014'];
   const picked = ids.map(id => all.find(p => p.id === id)).filter(Boolean);

   const fallback = all.filter(p => p?.blocks?.includes('New Products Arrival')).slice(0, 4);
   const result = picked.length === 4 ? picked : fallback;

   return result.map((item, index) => {
      const isSecondOrFourth = index === 1 || index === 3;
      return {
         ...item,
         salesStatus: isSecondOrFourth
      };
   });
};
document.addEventListener('DOMContentLoaded', async () => {
   try {
      const data = await loadProducts();
      const products = Array.isArray(data) ? data : [];
      const selectedWrap = qs('#selected-products');
      const selectedList = pickSelected(products);
      if (selectedWrap) {
         renderProducts(selectedList, selectedWrap, false);
      }

      const newWrap = qs('#new-products');
      const newList = pickNew(products);
      if (newWrap) {
         renderProducts(newList, newWrap, true);
      }

      const heroRandom = qs('#hero-random');
      if (heroRandom) {
         const phrases = [
            'Smart Styles for Every Destination',
            'Travel Light. Travel Right.',
            'Built to Last. Ready to Go.'
         ];
         heroRandom.textContent = phrases[Math.floor(Math.random() * phrases.length)];
      }
   } catch (err) {
      console.error(err);
      const selectedWrap = qs('#selected-products');
      if (selectedWrap) {
         selectedWrap.innerHTML = '<p style="opacity:.7">Failed to load products.</p>';
      }
   }
});