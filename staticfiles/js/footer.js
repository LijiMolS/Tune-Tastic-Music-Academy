// footer.js

document.addEventListener('DOMContentLoaded', function () {
    const newsletterForm = document.getElementById('newsletter-form');
    const emailInput = newsletterForm.querySelector('input[type="email"]');
    const newsletterMsg = document.getElementById('newsletter-msg');

    // Simple email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    newsletterForm.addEventListener('submit', function (e) {
        e.preventDefault(); // prevent page reload

        const email = emailInput.value.trim();

        // Clear previous message
        newsletterMsg.textContent = '';
        newsletterMsg.classList.remove('success', 'error');

        if (email === '') {
            newsletterMsg.textContent = 'Please enter your email.';
            newsletterMsg.classList.add('error');
            newsletterMsg.style.color = 'red';
            return;
        }

        if (!emailRegex.test(email)) {
            newsletterMsg.textContent = 'Please enter a valid email address.';
            newsletterMsg.classList.add('error');
            newsletterMsg.style.color = 'red';
            return;
        }

        // If valid, simulate a success (here you can add actual AJAX request)
        newsletterMsg.textContent = 'Thank you for subscribing!';
        newsletterMsg.classList.add('success');
        newsletterMsg.style.color = 'green';

        // Optional: reset form
        newsletterForm.reset();

        // Add fade-in animation for message
        newsletterMsg.classList.add('fade-in');

        setTimeout(() => {
            newsletterMsg.classList.remove('fade-in');
        }, 1500);
    });
});