document.addEventListener('DOMContentLoaded', () => {
   const cartItemsContainer = document.getElementById('cartItems');
   const subTotalEl = document.getElementById('subTotal');
   const cartTotalEl = document.getElementById('cartTotal');
   const shippingEl = document.getElementById('shipping');
   const discountEl = document.getElementById('discount');
   const discountRow = document.getElementById('discountRow');
   const clearCartBtn = document.getElementById('clearCart');
   const SHIPPING_COST = 30;

   function formatPrice(price) {
      return `$${price}`;
   }

   function calculateTotals() {
      const cart = getCart();
      let originalSubTotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
      const shipping = cart.length > 0 ? SHIPPING_COST : 0;
      
      let discount = 0;
      let subTotal = originalSubTotal;
      if (originalSubTotal > 3000) {
         discount = originalSubTotal * 0.1;
         subTotal = originalSubTotal - discount;
         if (discountRow) discountRow.style.display = 'flex';
         if (discountEl) discountEl.textContent = formatPrice(discount);
      }
      if (originalSubTotal <= 3000 && discountRow) {
         discountRow.style.display = 'none';
      }
      
      const total = subTotal + shipping;

      if (subTotalEl) subTotalEl.textContent = formatPrice(subTotal);
      if (shippingEl) shippingEl.textContent = formatPrice(shipping);
      if (cartTotalEl) cartTotalEl.textContent = formatPrice(total);
   }

   function renderCartItem(item, index) {
      const total = item.price * item.qty;
      const imagePath = item.image || '../img/webp/catalog/case-1.webp';
      
      return `
         <tr class="cart-table__row" data-id="${item.id}" data-color="${item.color || ''}" data-size="${item.size || ''}" data-index="${index}">
            <td class="cart-table__cell cart-table__cell--image">
               <img src="${imagePath}" alt="${item.name}" class="cart-table__img" loading="lazy" width="100" height="100">
            </td>
            <td class="cart-table__cell cart-table__cell--name">${item.name}</td>
            <td class="cart-table__cell cart-table__cell--price">${formatPrice(item.price)}</td>
            <td class="cart-table__cell cart-table__cell--quantity">
               <div class="qty">
                  <button class="qty__btn qty__btn--minus" type="button" data-id="${item.id}">-</button>
                  <input type="number" class="qty__input" value="${item.qty}" min="1" readonly data-id="${item.id}">
                  <button class="qty__btn qty__btn--plus" type="button" data-id="${item.id}">+</button>
               </div>
            </td>
            <td class="cart-table__cell cart-table__cell--total">${formatPrice(total)}</td>
            <td class="cart-table__cell cart-table__cell--delete">
               <button class="cart-table__delete" type="button" aria-label="Delete item" data-id="${item.id}">
                  <svg class="cart-table__delete-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                     <path d="M2.5 5H4.16667H17.5" stroke="#B92770" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                     <path d="M6.66667 5V3.33333C6.66667 2.89131 6.84226 2.46738 7.15482 2.15482C7.46738 1.84226 7.89131 1.66667 8.33333 1.66667H11.6667C12.1087 1.66667 12.5326 1.84226 12.8452 2.15482C13.1577 2.46738 13.3333 2.89131 13.3333 3.33333V5M15.8333 5V16.6667C15.8333 17.1087 15.6577 17.5326 15.3452 17.8452C15.0326 18.1577 14.6087 18.3333 14.1667 18.3333H5.83333C5.39131 18.3333 4.96738 18.1577 4.65482 17.8452C4.34226 17.5326 4.16667 17.1087 4.16667 16.6667V5H15.8333Z" stroke="#B92770" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                     <path d="M8.33333 9.16667V14.1667" stroke="#B92770" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                     <path d="M11.6667 9.16667V14.1667" stroke="#B92770" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
               </button>
            </td>
         </tr>
      `;
   }

   function renderCart() {
      const cart = getCart();
      
      if (!cartItemsContainer) return;

      if (cart.length === 0) {
         cartItemsContainer.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 2rem; color: var(--text-color); font-family: Montserrat, sans-serif;">Your cart is empty. Use the catalog to add new items.</td></tr>';
         calculateTotals();
         updateCartCounter();
         return;
      }

      cartItemsContainer.innerHTML = cart.map((item, index) => renderCartItem(item, index)).join('');
      calculateTotals();
      attachEventListeners();
   }

   function getItemFromRow(row) {
      const id = row.dataset.id;
      const color = row.dataset.color;
      const size = row.dataset.size;
      const cart = getCart();
      return cart.find(i => 
         i.id === id && 
         (i.color || '') === color && 
         (i.size || '') === size
      );
   }

   function handleMinusClick(e) {
      const row = e.target.closest('tr');
      const item = getItemFromRow(row);
      if (item && item.qty > 1) {
         item.qty--;
         saveCart(getCart());
         renderCart();
      }
   }

   function handlePlusClick(e) {
      const row = e.target.closest('tr');
      const item = getItemFromRow(row);
      if (item) {
         item.qty++;
         saveCart(getCart());
         renderCart();
      }
   }

   function handleDeleteClick(e) {
      const row = e.target.closest('tr');
      const id = row.dataset.id;
      const color = row.dataset.color;
      const size = row.dataset.size;
      const cart = getCart();
      const filtered = cart.filter(item => 
         !(item.id === id && 
           (item.color || '') === color && 
           (item.size || '') === size)
      );
      saveCart(filtered);
      renderCart();
   }

   function attachEventListeners() {
      document.querySelectorAll('.qty__btn--minus').forEach(btn => {
         btn.addEventListener('click', handleMinusClick);
      });

      document.querySelectorAll('.qty__btn--plus').forEach(btn => {
         btn.addEventListener('click', handlePlusClick);
      });

      document.querySelectorAll('.cart-table__delete').forEach(btn => {
         btn.addEventListener('click', handleDeleteClick);
      });
   }

   function clearCart() {
      saveCart([]);
      renderCart();
   }

   function handleCheckout() {
      const cart = getCart();
      if (cart.length === 0) {
         return;
      }
      
      saveCart([]);
      renderCart();
      
      const message = document.createElement('div');
      message.className = 'checkout-message';
      message.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.2); z-index: 10000; text-align: center;';
      message.innerHTML = '<h2 style="color: #B92770; margin: 0 0 1rem 0;">Thank you for your purchase.</h2>';
      
      document.body.appendChild(message);
      
      setTimeout(() => {
         message.remove();
      }, 3000);
   }

   if (clearCartBtn) {
      clearCartBtn.addEventListener('click', clearCart);
   }

   const checkoutBtn = document.querySelector('.cart-summary__checkout');
   if (checkoutBtn) {
      checkoutBtn.addEventListener('click', handleCheckout);
   }

   renderCart();
});

