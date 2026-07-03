// Select all subscription buttons
const subscribeButtons = document.querySelectorAll('.btn-subscribe');

// Add click event listener to each button
subscribeButtons.forEach(button => {
    button.addEventListener('click', () => {
        const planCard = button.closest('.subscription-card');
        const planName = planCard.querySelector('.plan-title').textContent;
        const planPrice = planCard.querySelector('.plan-price').textContent;

        // Simple feedback — replace with real payment/signup logic later
        alert(`You selected the "${planName}" plan at ${planPrice}. Redirecting to payment...`);

        // Example: redirect to payment page (uncomment when ready)
        // window.location.href = `/payment?plan=${planName}`;
    });
});