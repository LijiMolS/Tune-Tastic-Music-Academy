/* ======================================================
   LIVE SESSIONS SECTION JS
====================================================== */

document.addEventListener("DOMContentLoaded", function () {

    /* ---------- Card Hover Effect ---------- */
    const liveCards = document.querySelectorAll(".live-card");

    liveCards.forEach(card => {

        card.addEventListener("mouseenter", () => {
            card.style.transform = "translateY(-8px)";
            card.style.transition = "0.3s ease";
        });

        card.addEventListener("mouseleave", () => {
            card.style.transform = "translateY(0)";
        });

    });


    /* ---------- Join Session Button Click ---------- */
    const joinButtons = document.querySelectorAll(".live-btn");

    joinButtons.forEach(btn => {

        btn.addEventListener("click", function () {

            alert("Live Session feature will be available soon!");

        });

    });


    /* ---------- Scroll Animation ---------- */
    const observer = new IntersectionObserver(entries => {

        entries.forEach(entry => {

            if(entry.isIntersecting){

                entry.target.classList.add("show-live-card");

            }

        });

    }, { threshold: 0.2 });


    liveCards.forEach(card => {
        observer.observe(card);
    });

});
