document.addEventListener('DOMContentLoaded', () => {
   const contactForm = document.querySelector('.contact-form__form');
   const emailInput = document.getElementById('email');
   const nameInput = document.getElementById('name');
   const topicInput = document.getElementById('topic');
   const messageInput = document.getElementById('message');
   
   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
   let messageEl = document.createElement('p');
   messageEl.className = 'contact-form__message';
   messageEl.style.cssText = 'margin-top: 1rem; padding: 0.75rem; border-radius: 4px; font-family: Montserrat, sans-serif; font-size: 0.875rem;';
   if (emailInput) {
      emailInput.addEventListener('input', () => {
         const isValid = emailRegex.test(emailInput.value);
         if (emailInput.value.trim() !== '') {
            emailInput.classList.toggle('is-valid', isValid);
            emailInput.classList.toggle('is-invalid', !isValid);
         } else {
            emailInput.classList.remove('is-valid', 'is-invalid');
         }
      });
   }
   
   if (contactForm) {
      contactForm.addEventListener('submit', (e) => {
         e.preventDefault();
         const existingMessage = contactForm.querySelector('.contact-form__message');
         if (existingMessage) {
            existingMessage.remove();
         }
         const name = nameInput?.value.trim() || '';
         const email = emailInput?.value.trim() || '';
         const topic = topicInput?.value.trim() || '';
         const message = messageInput?.value.trim() || '';
         const isEmailValid = emailRegex.test(email);
         const isNameValid = name.length > 0;
         const isTopicValid = topic.length > 0;
         const isMessageValid = message.length > 0;
         if (isEmailValid && isNameValid && isTopicValid && isMessageValid) {
            messageEl.textContent = 'Thank you! Your message has been sent successfully.';
            messageEl.style.backgroundColor = '#d4edda';
            messageEl.style.color = '#155724';
            messageEl.style.border = '1px solid #c3e6cb';
            contactForm.appendChild(messageEl);
            contactForm.reset();
            emailInput?.classList.remove('is-valid', 'is-invalid');
         } else {
            messageEl.textContent = 'Please fill all required fields correctly.';
            messageEl.style.backgroundColor = '#f8d7da';
            messageEl.style.color = '#721c24';
            messageEl.style.border = '1px solid #f5c6cb';
            contactForm.appendChild(messageEl);
         }
      });
   }
});

