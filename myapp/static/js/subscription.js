document.addEventListener('DOMContentLoaded', function() {

    const subscribeButtons = document.querySelectorAll('.btn-subscribe');

    subscribeButtons.forEach(button => {
        button.replaceWith(button.cloneNode(true)); // remove old listeners
    });

    const newSubscribeButtons = document.querySelectorAll('.btn-subscribe');

    newSubscribeButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();

            const planCard = button.closest('.subscription-card');
            const planName = planCard.querySelector('.plan-title').textContent.trim().toLowerCase();

            // Always go to course selection first, even Free plan
            localStorage.setItem('selectedPlan', planName);
            window.location.href = '/choose-course/';
        });
    });

});