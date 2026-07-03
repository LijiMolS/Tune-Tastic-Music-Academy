document.addEventListener('DOMContentLoaded', function () {
    const newsletterForm = document.getElementById('newsletter-form');
    const emailInput = newsletterForm.querySelector('input[type="email"]');
    const newsletterMsg = document.getElementById('newsletter-msg');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    newsletterForm.addEventListener('submit', function (e) {

        e.preventDefault();   // stop page redirect

        const email = emailInput.value.trim();

        newsletterMsg.textContent = '';
        newsletterMsg.classList.remove('success', 'error');

        if (email === '') {
            newsletterMsg.textContent = 'Please enter your email.';
            newsletterMsg.style.color = 'red';
            return;
        }

        if (!emailRegex.test(email)) {
            newsletterMsg.textContent = 'Please enter a valid email address.';
            newsletterMsg.style.color = 'red';
            return;
        }

        // send to Django
        fetch('/subscribe/', {
            method: 'POST',
            body: new FormData(newsletterForm),
            headers: {
                'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
            }
        });

        newsletterMsg.textContent = 'Thank you for subscribing!';
        newsletterMsg.style.color = '#C084FC';

        newsletterForm.reset();
    });
});