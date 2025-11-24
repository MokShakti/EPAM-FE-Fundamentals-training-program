const qs = (s, r = document) => r.querySelector(s);
const qsa = (s, r = document) => Array.from(r.querySelectorAll(s));
const BASE = location.pathname.includes('/html/') ? '../' : './';

const resolveImage = (img) => {
   if (!img) return `${BASE}img/webp/selectedproducts/selected-1.webp`;
   if (img.startsWith('./')) return img.replace(/^\.\//, BASE);
   if (img.startsWith('../')) return img.replace(/^\.\.\//, BASE);
   return `${BASE}${img.replace(/^\/+/, '')}`;
};

const listEl = qs('#catalog-list');
const resultsInfo = qs('#resultsInfo');
const sortSelect = qs('#sortSelect');
const searchForm = qs('#searchForm');
const searchInput = qs('#searchInput');
const paginationEl = qs('#pagination');
const bestSetsEl = qs('#bestSets');

const filterSize = qs('#filterSize');
const filterColor = qs('#filterColor');
const filterCategory = qs('#filterCategory');
const filterSales = qs('#filterSales');
const clearFiltersBtn = qs('#clearFilters');
const hideFiltersBtn = qs('#hideFilters');

const PER_PAGE = 12;

let allProducts = [];
let carryOnIndexMap = new Map();
let productImageMap = new Map();

const LUGGAGE_IMAGES = [
   '../img/webp/catalog/case-1.webp',
   '../img/webp/catalog/case-2.webp',
   '../img/webp/catalog/case-3.webp',
   '../img/webp/catalog/case-4.webp',
   '../img/webp/catalog/case-5.webp',
   '../img/webp/catalog/case-6.webp',
   '../img/webp/catalog/case-7.webp',
   '../img/webp/catalog/case-8.webp',
   '../img/webp/catalog/case-9.webp',
   '../img/webp/catalog/case-10.webp',
   '../img/webp/catalog/case-11.webp',
   '../img/webp/catalog/case-12.webp',
   '../img/webp/newproducts/new-1.webp',
   '../img/webp/newproducts/new-2.webp',
   '../img/webp/newproducts/new-3.webp',
   '../img/webp/newproducts/new-4.webp',
   '../img/webp/selectedproducts/selected-1.webp',
   '../img/webp/selectedproducts/selected-2.webp',
   '../img/webp/selectedproducts/selected-3.webp',
   '../img/webp/selectedproducts/selected-4.webp'
];
let view = {
   items: [],
   page: 1,
   q: '',
   sort: 'default',
   filters: {
      size: '',
      color: '',
      category: '',
      sales: false
   }
};

const loadProducts = () => fetch(`${BASE}assets/data.json`).then(r => r.json()).then(d => d?.data ?? d);

function renderResultsInfo(total, page, perPage) {
   const start = total === 0 ? 0 : (page - 1) * perPage + 1;
   const end = Math.min(page * perPage, total);
   resultsInfo && (resultsInfo.textContent = `Showing ${start}–${end} of ${total} Results`);
}

function productCardHTML(p, index, categoryIndex) {
   let imgPath;
   if (productImageMap.has(p.id)) {
      imgPath = productImageMap.get(p.id);
   } else {
      imgPath = LUGGAGE_IMAGES[0];
   }
   const img = resolveImage(imgPath);
   const saleBadge = (p.salesStatus === true || p.salesStatus === 'true')
      ? '<span class="product-card__badge product-card__badge--sale">SALE</span>'
      : '';
   const description = p?.shortDescription || p?.description || 'Vel vestibulum elit tuvel euqen.';
   return `
   <article class="product-card">
      <div class="product-card__image-wrapper" data-goto="${p.id}">
   ${saleBadge}
   <img class="product-card__image" src="${img}" alt="${p.name}" loading="lazy" width="296" height="400">
      </div>
      <p class="product-card__description">${description}</p>
      <p class="product-card__price">$${p.price}</p>
      <button class="btn btn--primary product-card__btn" data-add="${p.id}">
      Add To Cart
      </button>
   </article>`;
}

function renderList(items, page) {
   if (!listEl) return;
   const total = items.length;
   const start = (page - 1) * PER_PAGE;
   const slice = items.slice(start, start + PER_PAGE);

   listEl.innerHTML = slice.map((p, i) => {
      const cat = String(p.category || '').trim().toLowerCase();
      const categoryIndex = (cat === 'carry-ons' && carryOnIndexMap.has(p.id))
         ? carryOnIndexMap.get(p.id)
         : undefined;
      return productCardHTML(p, start + i + 1, categoryIndex);
   }).join('');
   renderResultsInfo(total, page, PER_PAGE);
   renderPagination(total, page);
}

function renderPagination(total, page) {
   const pages = Math.ceil(total / PER_PAGE) || 1;
   let html = '';

   const btn = (p, label = p, disabled = false, current = false) => `
    <button class="pagination__btn${disabled ? ' is-disabled' : ''}${current ? ' is-current' : ''}"
            data-page="${p}" ${disabled ? 'disabled' : ''}>${label}</button>
  `;

   html += btn(page - 1, 'Prev', page === 1);

   for (let i = 1; i <= pages; i += 1) {
      html += btn(i, i, false, i === page);
   }

   html += btn(page + 1, 'Next', page === pages);

   if (paginationEl) paginationEl.innerHTML = html;
}

function renderBestSets(data) {
   const bestSetsData = [
      {
         id: 'BS001',
         name: 'Premium Luggage Set',
         image: '../img/webp/small/small-1.webp',
         description: 'Primis in faucibus aenean laoreet rhoncus ipsum eget.',
         rating: 5,
         price: 1000
      },
      {
         id: 'BS002',
         name: 'Deluxe Travel Set',
         image: '../img/webp/small/small-2.webp',
         description: 'Vestibulum in elementum erat Interdum et malesuada fames.',
         rating: 5,
         price: 1200
      },
      {
         id: 'BS003',
         name: 'Modern Style Set',
         image: '../img/webp/small/small-3.webp',
         description: 'Laoreet rhoncus ipsum eget tempus raesent convallis.',
         rating: 4,
         price: 2100
      },
      {
         id: 'BS004',
         name: 'Classic Luggage Set',
         image: '../img/webp/small/small-4.webp',
         description: 'Interdum et malesuada fames ante ipsum primis in faucibus.',
         rating: 4,
         price: 1500
      },
      {
         id: 'BS005',
         name: 'Compact Travel Set',
         image: '../img/webp/small/small-5.webp',
         description: 'Rhoncus ipsum eget tempus Praesent convallis fermentum.',
         rating: 4,
         price: 1100
      }
   ];

   const itemHTML = (item) => {
      const img = resolveImage(item.image);
      const rating = Math.round(Number(item.rating || 4));
      const filledHTML = '★'.repeat(rating).split('').map(() => '<span class="stars-filled">★</span>').join('');
      const emptyHTML = '☆'.repeat(5 - rating).split('').map(() => '<span class="stars-empty">☆</span>').join('');
      const stars = filledHTML + emptyHTML;
      return `
      <li class="bestsets__item" data-goto="${item.id}">
      <img class="bestsets__thumb" src="${img}" alt="${item.name}" loading="lazy" width="100" height="100">
      <div class="bestsets__meta">
         <p class="bestsets__name">${item.description}</p>
         <p class="bestsets__stars" aria-label="rating">${stars}</p>
         <p class="bestsets__price">$${item.price}</p>
      </div>
      </li>`;
   };

   if (bestSetsEl) bestSetsEl.innerHTML = bestSetsData.map(itemHTML).join('');
}

function fillFilterSelect(select, values) {
   if (!select) return;
   const currentValue = select.value;
   select.innerHTML = '<option value="">Choose option</option>';
   const uniqueValues = Array.from(new Set(values.filter(v => v != null && v !== '').map(v => String(v))));
   uniqueValues.sort().forEach(v => {
      const opt = document.createElement('option');
      opt.value = v;
      opt.textContent = v;
      select.appendChild(opt);
   });
   if (currentValue) {
      const match = Array.from(select.options).find(opt => opt.value === currentValue);
      if (match) select.value = currentValue;
   }
}

function applySearch(base, q) {
   if (!q) return base;
   const s = q.trim().toLowerCase();
   return base.filter(p =>
      String(p.name).toLowerCase().includes(s)
      || String(p.color ?? '').toLowerCase().includes(s)
      || String(p.category ?? '').toLowerCase().includes(s)
   );
}

function applyFilters(base, filters) {
   let result = [...base];

   if (filters.size) {
      const filterSize = String(filters.size).trim().toLowerCase();
      result = result.filter(p => {
         const productSize = Array.isArray(p.size) ? p.size : [p.size];
         return productSize.some(s => String(s).trim().toLowerCase() === filterSize)
            || String(p.size).trim().toLowerCase() === filterSize;
      });
   }

   if (filters.color) {
      const filterColor = String(filters.color).trim().toLowerCase();
      result = result.filter(p => {
         const productColors = normalizeColor(p.color);
         const matchesColor = productColors.some(c => String(c).trim().toLowerCase() === filterColor);

         // Special case: if filtering by beige, only show products with selected-2.webp image
         if (filterColor === 'beige') {
            const imageUrl = p.imageUrl || '';
            return matchesColor && imageUrl.includes('selected-2.webp');
         }

         // Special case: if filtering by brown, only show products with case-8.webp image
         if (filterColor === 'brown') {
            const imageUrl = p.imageUrl || '';
            return matchesColor && imageUrl.includes('case-8.webp');
         }

         return matchesColor;
      });
   }

   if (filters.category) {
      const filterCategory = String(filters.category).trim().toLowerCase();
      result = result.filter(p => {
         if (!p.category) return false;
         const productCategory = String(p.category).trim().toLowerCase();
         const matchesCategory = productCategory === filterCategory;

         // Special case: if filtering by carry-ons, only show products with specific images
         if (filterCategory === 'carry-ons') {
            const imageUrl = p.imageUrl || '';
            const allowedImages = [
               'case-5.webp',
               'case-6.webp',
               'case-7.webp',
               'case-9.webp',
               'case-10.webp',
               'case-11.webp',
               'case-12.webp',
               'new-1.webp',
               'new-4.webp',
               'selected-1.webp'
            ];
            return matchesCategory && allowedImages.some(img => imageUrl.includes(img));
         }

         return matchesCategory;
      });
   }

   if (filters.sales) {
      result = result.filter(p =>
         p.salesStatus === true || p.salesStatus === 'true' || String(p.salesStatus) === 'true'
      );
   }

   return result;
}

function applySort(base, mode) {
   const arr = [...base];
   switch (mode) {
      case 'price-asc':
         arr.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
         break;
      case 'price-desc':
         arr.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
         break;
      case 'popularity':
         arr.sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0));
         break;
      case 'rating':
         arr.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
         break;
      default:
         break;
   }
   return arr;
}

function recomputeView() {
   let items = applySearch(allProducts, view.q);
   items = applyFilters(items, view.filters);
   items = applySort(items, view.sort);

   view.items = items;
   const pages = Math.max(1, Math.ceil(items.length / PER_PAGE));
   if (view.page > pages) view.page = 1;

   renderList(view.items, view.page);
}

function normalizeSize(size) {
   if (size == null) return [];
   if (Array.isArray(size)) {
      return size.flatMap(s => {
         if (typeof s === 'string' && s.includes(',')) {
            return s.split(',').map(part => part.trim()).filter(part => part !== '');
         }
         return [s];
      });
   }
   // Handle comma-separated values like "S, M, XL"
   if (typeof size === 'string' && size.includes(',')) {
      return size.split(',').map(s => s.trim()).filter(s => s !== '');
   }
   return [size];
}

function normalizeColor(color) {
   if (color == null) return [];
   if (Array.isArray(color)) {
      return color.flatMap(c => {
         if (typeof c === 'string' && c.includes(',')) {
            return c.split(',').map(part => part.trim()).filter(part => part !== '');
         }
         return [c];
      });
   }
   // Handle comma-separated values like "red, blue" (if needed)
   if (typeof color === 'string' && color.includes(',')) {
      return color.split(',').map(c => c.trim()).filter(c => c !== '');
   }
   return [color];
}

function normalizeCategory(category) {
   if (category == null) return [];
   return Array.isArray(category) ? category : [category];
}

function initFilters(products) {
   const sizes = products.map(p => normalizeSize(p.size))
      .flat()
      .filter(v => v != null && v !== '')
      .filter(v => {
         // Exclude combined values like "S, M, XL" - they are already split
         const str = String(v);
         return !str.includes(',');
      });

   const colors = products.map(p => normalizeColor(p.color))
      .flat()
      .filter(v => v != null && v !== '')
      .filter(v => {
         // Exclude combined values like "red, blue" - they are already split
         const str = String(v);
         return !str.includes(',');
      });

   const categories = products.map(p => normalizeCategory(p.category))
      .flat()
      .filter(v => v != null && v !== '')
      .filter(cat => {
         const catLower = cat.toLowerCase();
         return catLower !== 'luggage sets' && catLower !== 'travel-suitcases';
      });

   fillFilterSelect(filterSize, sizes);
   fillFilterSelect(filterColor, colors);
   fillFilterSelect(filterCategory, categories);
}

function clearFilters() {
   if (filterSize) filterSize.value = '';
   if (filterColor) filterColor.value = '';
   if (filterCategory) filterCategory.value = '';
   if (filterSales) filterSales.checked = false;

   view.filters = {
      size: '',
      color: '',
      category: '',
      sales: false
   };
   view.page = 1;
   recomputeView();
}

paginationEl?.addEventListener('click', (e) => {
   const btn = e.target.closest('[data-page]');
   if (!btn) return;
   const p = Number(btn.dataset.page);
   if (Number.isFinite(p)) {
      view.page = p;
      renderList(view.items, view.page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
   }
});

sortSelect?.addEventListener('change', () => {
   view.sort = sortSelect.value;
   view.page = 1;
   recomputeView();
});

searchForm?.addEventListener('submit', (e) => {
   e.preventDefault();
   const value = searchInput?.value ?? '';
   view.q = value;
   view.page = 1;

   recomputeView();
   if (view.items.length === 0) {
      alert('Product not found');
   } else if (view.items.length === 1) {
      window.location.href = `${BASE}html/product.html?id=${view.items[0].id}`;
   }
});

searchInput?.addEventListener('input', (e) => {
   const value = e.target.value ?? '';
   view.q = value;
   view.page = 1;

   recomputeView();
   if (view.items.length === 0) {
      if (listEl) listEl.innerHTML = '<p>No products found.</p>';
   }
});
listEl?.addEventListener('click', (e) => {
   const go = e.target.closest('[data-goto]');
   if (go) {
      const id = go.getAttribute('data-goto');
      window.location.href = `${BASE}html/product.html?id=${id}`;
      return;
   }

   const addBtn = e.target.closest('[data-add]');
   if (addBtn) {
      const id = addBtn.getAttribute('data-add');
      const product = allProducts.find(p => String(p.id) === String(id));
      if (product) {
         addToCart({
            ...product,
            color: product.color ?? 'default',
            size: product.size ?? 'M'
         }, 1);

         addBtn.textContent = 'Added';
         setTimeout(() => (addBtn.textContent = 'Add To Cart'), 1200);
      }
   }
});
bestSetsEl?.addEventListener('click', (e) => {
   const li = e.target.closest('[data-goto]');
   if (!li) return;
   const id = li.getAttribute('data-goto');
   window.location.href = `${BASE}html/product.html?id=${id}`;
});

filterSize?.addEventListener('change', (e) => {
   view.filters.size = e.target.value || '';
   view.page = 1;
   recomputeView();
});

filterColor?.addEventListener('change', (e) => {
   view.filters.color = e.target.value || '';
   view.page = 1;
   recomputeView();
});

filterCategory?.addEventListener('change', (e) => {
   const selectedOption = e.target.options[e.target.selectedIndex];
   view.filters.category = selectedOption ? selectedOption.value : '';
   view.page = 1;
   recomputeView();
});

filterSales?.addEventListener('change', (e) => {
   view.filters.sales = e.target.checked;
   view.page = 1;
   recomputeView();
});

clearFiltersBtn?.addEventListener('click', () => {
   clearFilters();
});

hideFiltersBtn?.addEventListener('click', () => {
   const filtersPanel = qs('.filters__panel');
   if (filtersPanel) {
      filtersPanel.style.display = filtersPanel.style.display === 'none' ? 'block' : 'none';
      hideFiltersBtn.textContent = filtersPanel.style.display === 'none' ? 'SHOW FILTERS' : 'HIDE FILTERS';
   }
});

document.addEventListener('DOMContentLoaded', () => {
   loadProducts()
      .then((data) => {
         if (!data || !Array.isArray(data)) {
            console.error('Invalid data format:', data);
            return;
         }
         allProducts = data;

         productImageMap.clear();
         allProducts.forEach((p, index) => {
            // Use imageUrl from product data if available, otherwise use fallback
            const imagePath = p.imageUrl || LUGGAGE_IMAGES[index % LUGGAGE_IMAGES.length];
            productImageMap.set(p.id, imagePath);
         });

         carryOnIndexMap.clear();
         let globalCarryOnIndex = 0;
         allProducts.forEach((p) => {
            const cat = String(p.category || '').trim().toLowerCase();
            if (cat === 'carry-ons') {
               carryOnIndexMap.set(p.id, globalCarryOnIndex);
               globalCarryOnIndex++;
            }
         });

         initFilters(allProducts);
         renderBestSets(allProducts);
         recomputeView();
      })
      .catch((error) => {
         console.error('Error loading products:', error);
         if (listEl) {
            listEl.innerHTML = '<p>Error loading products. Please refresh the page.</p>';
         }
      });
});