// ================================
// PREMIUM FAQ JS
// ================================

// Select FAQ items and search input
const faqItems = document.querySelectorAll('.faq-item');
const faqSearch = document.getElementById('faq-search');

// ------------------------
// 1️⃣ Toggle FAQ answers with smooth animation
// ------------------------
faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    question.addEventListener('click', () => {
        item.classList.toggle('active');

        // Animate height
        if(item.classList.contains('active')){
            answer.style.height = answer.scrollHeight + 'px';
        } else {
            answer.style.height = '0';
        }
    });
});

// ------------------------
// 2️⃣ Real-time search with highlighted text
// ------------------------
faqSearch?.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();

    faqItems.forEach(item => {
        const questionEl = item.querySelector('.faq-question');
        const answerEl = item.querySelector('.faq-answer');
        const text = questionEl.textContent;
        const lowerText = text.toLowerCase();

        if(lowerText.includes(query) && query !== ''){
            // Show matching FAQ
            item.style.display = 'block';

            // Highlight matching text
            const regex = new RegExp(`(${query})`, 'gi');
            questionEl.innerHTML = text.replace(regex, '<span class="highlight">$1</span>');
        } else if(query === ''){
            // Show all FAQs when search is empty
            item.style.display = 'block';
            questionEl.innerHTML = text; // remove highlight
        } else {
            // Hide non-matching FAQs
            item.style.display = 'none';
            questionEl.innerHTML = text; // remove highlight
        }
    });
});