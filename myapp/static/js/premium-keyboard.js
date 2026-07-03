document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.scroll-nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetID = link.getAttribute('href').substring(1);
            const target = document.getElementById(targetID);
            if(target) window.scrollTo({ top: target.offsetTop - 60, behavior: 'smooth' });
        });
    });

    const sections = document.querySelectorAll('.lesson-section');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            const id = entry.target.getAttribute('id');
            const navLink = document.querySelector(`.scroll-nav a[href="#${id}"]`);
            if(entry.isIntersecting){
                navLinks.forEach(link => link.classList.remove('active'));
                if(navLink) navLink.classList.add('active');
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
            } else {
                entry.target.style.opacity = 0.6;
                entry.target.style.transform = 'translateY(20px)';
            }
        });
    }, { threshold: 0.6 });

    sections.forEach(section => {
        section.style.opacity = 0.6;
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'all 0.6s ease-out';
        observer.observe(section);
    });
});