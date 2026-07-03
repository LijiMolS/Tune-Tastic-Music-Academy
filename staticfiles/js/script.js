/* =========================================
   NAVBAR SCROLL EFFECT
========================================= */
window.addEventListener("scroll", function () {
    const navbar = document.querySelector(".neon-navbar");

    if (!navbar) return;

    if (window.scrollY > 50) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }
});


/* =========================================
   CAROUSEL MUSIC (SAFE VERSION)
========================================= */

const music = document.getElementById("carouselMusic");
const btn = document.getElementById("musicToggle");

if (music && btn) {

    let playing = false;
    let fadeInterval;

    function fadeInAudio() {
        music.volume = 0;
        music.play();

        fadeInterval = setInterval(() => {
            if (music.volume < 0.35) {
                music.volume += 0.02;
            } else {
                clearInterval(fadeInterval);
            }
        }, 120);
    }

    function fadeOutAudio() {
        fadeInterval = setInterval(() => {
            if (music.volume > 0.02) {
                music.volume -= 0.02;
            } else {
                music.pause();
                clearInterval(fadeInterval);
            }
        }, 120);
    }

    btn.addEventListener("click", () => {
        if (!playing) {
            fadeInAudio();
            btn.innerText = "🔇 Stop";
            playing = true;
        } else {
            fadeOutAudio();
            btn.innerText = "🔊 Music";
            playing = false;
        }
    });
}


document.addEventListener("DOMContentLoaded", function () {

    const toggle = document.getElementById("profileToggle");
    const menu = document.getElementById("profileMenu");

    // Toggle dropdown
    toggle.addEventListener("click", function (e) {
        e.stopPropagation();

        menu.classList.toggle("show");
        toggle.classList.toggle("active"); // ⭐ change button color
    });

    // Close when clicking outside
    document.addEventListener("click", function (e) {
        if (!menu.contains(e.target) && !toggle.contains(e.target)) {
            menu.classList.remove("show");
            toggle.classList.remove("active"); // ⭐ reset color
        }
    });

});