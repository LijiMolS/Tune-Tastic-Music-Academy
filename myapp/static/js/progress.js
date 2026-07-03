document.addEventListener("DOMContentLoaded", function(){

    let seconds = 0;
    let timerInterval = null;

    const timerDisplay = document.getElementById("practiceTimer");
    const startBtn = document.getElementById("startPractice");
    const stopBtn = document.getElementById("stopPractice");

    if(!startBtn || !stopBtn || !timerDisplay){
        return;
    }

    /* ================= TIMER ================= */

    function updateTimer(){

        seconds++;

        let hrs = Math.floor(seconds / 3600);
        let mins = Math.floor((seconds % 3600) / 60);
        let secs = seconds % 60;

        timerDisplay.textContent =
            String(hrs).padStart(2,"0") + ":" +
            String(mins).padStart(2,"0") + ":" +
            String(secs).padStart(2,"0");

        // 🔥 Save running state
        localStorage.setItem("runningSeconds", seconds);
        localStorage.setItem("timerRunning", "true");
    }

    /* ================= START ================= */

    startBtn.addEventListener("click", function(){

        if(timerInterval === null){
            timerInterval = setInterval(updateTimer, 1000);
        }

    });

    /* ================= STOP ================= */

    stopBtn.addEventListener("click", function(){

        clearInterval(timerInterval);
        timerInterval = null;

        savePractice(seconds);

        seconds = 0;
        timerDisplay.textContent = "00:00:00";

        // clear running state
        localStorage.removeItem("runningSeconds");
        localStorage.removeItem("timerRunning");

    });

    /* ================= AUTO SAVE ON CLOSE ================= */

    window.addEventListener("beforeunload", function () {
        if (seconds > 0) {
            savePractice(seconds);
        }
    });

    /* ================= SAVE PRACTICE ================= */

    function savePractice(sec){

        let minutes = Math.floor(sec / 60);

        let totalMinutes =
            localStorage.getItem("totalPracticeMinutes") || 0;

        totalMinutes = parseInt(totalMinutes) + minutes;

        localStorage.setItem("totalPracticeMinutes", totalMinutes);

        updateStats();
        updateProgress(minutes);
    }

    /* ================= STATS ================= */

    function updateStats(){

        let total =
            parseInt(localStorage.getItem("totalPracticeMinutes") || 0);

        let el = document.getElementById("totalPractice");

        if(el){
            el.textContent = (total / 60).toFixed(1) + " hrs";
        }
    }

    /* ================= PROGRESS ================= */

    function updateProgress(minutes){

        let keyboard =
            parseFloat(localStorage.getItem("keyboardProgress") || 0);

        let piano =
            parseFloat(localStorage.getItem("pianoProgress") || 0);

        keyboard += minutes * 0.05;
        piano += minutes * 0.03;

        keyboard = Math.min(keyboard, 100);
        piano = Math.min(piano, 100);

        localStorage.setItem("keyboardProgress", keyboard);
        localStorage.setItem("pianoProgress", piano);

        updateProgressBars();
    }

    /* ================= LOAD BARS ================= */

    function updateProgressBars(){

        let keyboard =
            parseFloat(localStorage.getItem("keyboardProgress") || 0);

        let piano =
            parseFloat(localStorage.getItem("pianoProgress") || 0);

        let kBar = document.getElementById("keyboardBar");
        let pBar = document.getElementById("pianoBar");

        if(kBar) kBar.style.width = keyboard + "%";
        if(pBar) pBar.style.width = piano + "%";

        let kText = document.getElementById("keyboardPercent");
        let pText = document.getElementById("pianoPercent");

        if(kText) kText.textContent = Math.floor(keyboard) + "%";
        if(pText) pText.textContent = Math.floor(piano) + "%";
    }

    /* ================= RESTORE TIMER ================= */

    let savedSeconds = localStorage.getItem("runningSeconds");
    let isRunning = localStorage.getItem("timerRunning");

    if(savedSeconds && isRunning === "true"){
        seconds = parseInt(savedSeconds);

        timerInterval = setInterval(updateTimer, 1000);
    }

    /* ================= INITIAL LOAD ================= */

    updateStats();
    updateProgressBars();

});