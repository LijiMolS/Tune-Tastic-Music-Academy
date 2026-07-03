document.addEventListener("DOMContentLoaded", function() {

    const cards = document.querySelectorAll(".exercise-card");

    cards.forEach(card => {
        const video = card.querySelector(".card-bg-video");

        card.addEventListener("mouseenter", () => {
            if(video){
                video.play().catch(err => console.log(err));
            }
        });

        card.addEventListener("mouseleave", () => {
            if(video){
                video.pause();
            }
        });
    });

    const lazyVideos = document.querySelectorAll('video[data-src]');
    lazyVideos.forEach(video => {
        video.src = video.dataset.src;
        video.load();
    });

});