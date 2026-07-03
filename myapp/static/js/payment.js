document.addEventListener('DOMContentLoaded', function() {

    const urlParams = new URLSearchParams(window.location.search);
    const plan = urlParams.get('plan');      
    const course = urlParams.get('course');  

    let price = '';
    if(plan === 'standard') price = '₹499 / month';
    else if(plan === 'premium') price = '₹999 / month';
    else price = 'Free';

    document.getElementById('courseName').textContent =
        course ? course.toUpperCase() : 'N/A';

    document.getElementById('planName').textContent =
        plan ? plan.charAt(0).toUpperCase() + plan.slice(1) : 'N/A';

    document.getElementById('planPrice').textContent = price;

    document.querySelector('.btn-confirm').addEventListener('click', function() {

        const method = document.querySelector('input[name="method"]:checked')?.value || 'Unknown';

        alert(`Payment successful for ${course?.toUpperCase()} (${plan?.charAt(0).toUpperCase() + plan?.slice(1)}) at ${price} using ${method}.`);

        if(course === 'piano' && plan === 'standard') window.location.href = '/standard/piano/';
        else if(course === 'piano' && plan === 'premium') window.location.href = '/premium/piano/';
        else if(course === 'keyboard' && plan === 'standard') window.location.href = '/standard/keyboard/';
        else if(course === 'keyboard' && plan === 'premium') window.location.href = '/premium/keyboard/';
        else window.location.href = '/#courses';
    });

});