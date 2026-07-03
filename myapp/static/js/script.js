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

let startTime = localStorage.getItem("startTime");

// 👉 If already started, resume everywhere
if (startTime) {
    startTime = new Date(startTime);
    startTimer();
}

// START
document.getElementById("startPractice")?.addEventListener("click", () => {

    if (startTime) return;

    startTime = new Date();
    localStorage.setItem("startTime", startTime);

    startTimer();
});

// STOP
document.getElementById("stopPractice")?.addEventListener("click", () => {

    if (!startTime) {
        alert("Click Start first!");
        return;
    }

    clearInterval(timerInterval);

    let endTime = new Date();
    let duration = Math.floor((endTime - startTime) / 1000);

    fetch('/save-practice/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCSRFToken()
        },
        body: JSON.stringify({ duration: duration })
    })
    .then(res => res.json())
    .then(data => {
        alert("Saved!");
        localStorage.removeItem("startTime");
        location.reload();
    });

    startTime = null;
});

let timerInterval;

function startTimer() {

    timerInterval = setInterval(() => {

        let now = new Date();
        let diff = Math.floor((now - startTime) / 1000);

        let hrs = Math.floor(diff / 3600);
        let mins = Math.floor((diff % 3600) / 60);
        let secs = diff % 60;

        let timerElement = document.getElementById("practiceTimer");

        if (timerElement) {
            timerElement.innerText =
            `${hrs.toString().padStart(2,'0')}:${mins.toString().padStart(2,'0')}:${secs.toString().padStart(2,'0')}`;
        }

    }, 1000);
}

function getCSRFToken() {
    let token = document.cookie.split('; ')
        .find(row => row.startsWith('csrftoken='));
    return token ? token.split('=')[1] : '';
}