const CART_KEY = 'bestshop_cart';

function getCart() {
   try {
      const data = localStorage.getItem(CART_KEY);
      return data ? JSON.parse(data) : [];
   } catch {
      return [];
   }
}

function saveCart(items) {
   localStorage.setItem(CART_KEY, JSON.stringify(items));
   updateCartCounter();
}

function addToCart(product, qty = 1) {
   const cart = getCart();
   const index = cart.findIndex(
      (item) =>
         item.id === product.id &&
         item.color === product.color &&
         item.size === product.size
   );

   if (index !== -1) {
      cart[index].qty += qty;
   } else {
      cart.push({
         id: product.id,
         name: product.name,
         price: product.price,
         color: product.color,
         size: product.size,
         image: product.images?.[0] ?? '',
         qty
      });
   }

   saveCart(cart);
}

function removeFromCart(id) {
   const cart = getCart().filter((item) => item.id !== id);
   saveCart(cart);
}

function updateQty(id, qty) {
   const cart = getCart();
   const item = cart.find((i) => i.id === id);
   if (!item) return;

   item.qty = Math.max(1, qty);
   saveCart(cart);
}

function updateCartCounter() {
   const cart = getCart();
   const count = cart.reduce((acc, item) => acc + item.qty, 0);

   const counter = document.getElementById('cartCounter');
   if (!counter) return;

   counter.textContent = String(count);
   counter.style.visibility = count ? 'visible' : 'hidden';
}

document.addEventListener('click', (e) => {
   if (e.target.closest('.icon-menu')) {
      document.documentElement.classList.toggle('open-menu');
      e.preventDefault();
   }
});

document.addEventListener('DOMContentLoaded', () => {
   updateCartCounter();

   const logo = document.querySelector('.header__logo');
   if (logo) {
      logo.addEventListener('click', (event) => {
         if (location.pathname.includes('/html/')) {
            event.preventDefault();
            window.location.href = '../index.html';
         }
      });
   }
   const accountLink = document.getElementById('openAccount');
   const accountModal = document.querySelector('.account-modal');
   const loginForm = document.getElementById('loginForm');
   const loginEmail = document.getElementById('loginEmail');
   const loginPassword = document.getElementById('loginPassword');
   const togglePwd = document.getElementById('togglePwd');
   const loginMsg = document.getElementById('loginMsg');
   const closeModalBtn = document.getElementById('closeModal');

   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

   const showAccountModal = () => {
      if (accountModal) {
         accountModal.style.display = 'flex';
         document.body.style.overflow = 'hidden';
      }
   };

   const hideAccountModal = () => {
      if (accountModal) {
         accountModal.style.display = 'none';
         document.body.style.overflow = '';
      }
   };

   if (accountLink) {
      accountLink.addEventListener('click', (e) => {
         e.preventDefault();
         showAccountModal();
      });
   }

   if (accountModal) {
      accountModal.addEventListener('click', (e) => {
         if (e.target === accountModal) hideAccountModal();
      });
   }

   if (closeModalBtn) {
      closeModalBtn.addEventListener('click', () => {
         hideAccountModal();
      });
   }

   if (togglePwd && loginPassword) {
      togglePwd.addEventListener('click', () => {
         loginPassword.type =
            loginPassword.type === 'password' ? 'text' : 'password';
      });
   }

   if (loginEmail) {
      loginEmail.classList.add('input');
      loginEmail.addEventListener('input', () => {
         const ok = emailRegex.test(loginEmail.value);
         loginEmail.classList.toggle('is-valid', ok);
         loginEmail.classList.toggle('is-invalid', !ok && loginEmail.value.trim() !== '');
      });
   }

   if (loginForm) {
      loginForm.addEventListener('submit', (event) => {
         event.preventDefault();

         const emailOk = loginEmail && emailRegex.test(loginEmail.value);
         const pwdOk =
            loginPassword && loginPassword.value.trim().length > 0;

         if (emailOk && pwdOk) {
            if (loginMsg) loginMsg.textContent = 'Logged in successfully!';
            setTimeout(hideAccountModal, 800);
         } else {
            if (loginMsg) loginMsg.textContent =
               'Please check email and password.';
         }
      });
   }
   const cartLink = document.querySelector(
      '.header-actions__link[href="/cart"]'
   );
   if (cartLink) {
      cartLink.addEventListener('click', (event) => {
         event.preventDefault();
         const BASE = location.pathname.includes('/html/') ? '../' : './';
         window.location.href = `${BASE}html/cart.html`;
      });
   }
});