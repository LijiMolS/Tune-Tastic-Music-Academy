/* =====================================================
   Piano Free Course JS — Smooth Scroll & Lesson Highlight
===================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ======= Smooth scroll for scroll-nav links =======
    const navLinks = document.querySelectorAll('.scroll-nav a');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetID = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetID);

            if(targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 60, // adjust for any fixed header
                    behavior: 'smooth'
                });
            }
        });
    });

    // ======= Highlight current lesson =======
    const sections = document.querySelectorAll('.lesson-section');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.6 // 60% of section visible
    };

    const observerCallback = (entries) => {
        entries.forEach(entry => {
            const id = entry.target.getAttribute('id');
            const navLink = document.querySelector(`.scroll-nav a[href="#${id}"]`);

            if(entry.isIntersecting) {
                navLinks.forEach(link => link.classList.remove('active'));
                if(navLink) navLink.classList.add('active');
                // optional fade-in animation
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
            } else {
                entry.target.style.opacity = 0.6;
                entry.target.style.transform = 'translateY(20px)';
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    sections.forEach(section => {
        section.style.opacity = 0.6;
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'all 0.6s ease-out';
        observer.observe(section);
    });

});