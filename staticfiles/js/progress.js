/* ==========================================
   PRACTICE TIMER
========================================== */

let seconds = 0;
let timerInterval = null;

const timerDisplay = document.getElementById("practiceTimer");
const startBtn = document.getElementById("startPractice");
const stopBtn = document.getElementById("stopPractice");

function updateTimer(){

    seconds++;

    let hrs = Math.floor(seconds / 3600);
    let mins = Math.floor((seconds % 3600) / 60);
    let secs = seconds % 60;

    timerDisplay.textContent =
        String(hrs).padStart(2,"0") + ":" +
        String(mins).padStart(2,"0") + ":" +
        String(secs).padStart(2,"0");
}


/* START TIMER */

startBtn.addEventListener("click",function(){

    if(timerInterval === null){

        timerInterval = setInterval(updateTimer,1000);

    }

});


/* STOP TIMER */

stopBtn.addEventListener("click",function(){

    clearInterval(timerInterval);
    timerInterval = null;

    savePractice(seconds);

    seconds = 0;

});


/* ==========================================
   SAVE PRACTICE DATA
========================================== */

function savePractice(sec){

    let minutes = Math.floor(sec/60);

    let totalMinutes =
        localStorage.getItem("totalPracticeMinutes");

    if(!totalMinutes){
        totalMinutes = 0;
    }

    totalMinutes = parseInt(totalMinutes) + minutes;

    localStorage.setItem(
        "totalPracticeMinutes",
        totalMinutes
    );

    updateStats();

    updateProgress(minutes);

}


/* ==========================================
   UPDATE STATS
========================================== */

function updateStats(){

    let total =
        localStorage.getItem("totalPracticeMinutes") || 0;

    document.getElementById("totalPractice")
        .textContent = total + " mins";

}


/* ==========================================
   UPDATE INSTRUMENT PROGRESS
========================================== */

function updateProgress(minutes){

    let keyboardProgress =
        localStorage.getItem("keyboardProgress") || 0;

    let pianoProgress =
        localStorage.getItem("pianoProgress") || 0;

    keyboardProgress =
        parseInt(keyboardProgress) + (minutes * 0.05);

    pianoProgress =
        parseInt(pianoProgress) + (minutes * 0.03);

    if(keyboardProgress > 100){
        keyboardProgress = 100;
    }

    if(pianoProgress > 100){
        pianoProgress = 100;
    }

    localStorage.setItem(
        "keyboardProgress",
        keyboardProgress
    );

    localStorage.setItem(
        "pianoProgress",
        pianoProgress
    );

    updateProgressBars();

}


/* ==========================================
   LOAD PROGRESS
========================================== */

function updateProgressBars(){

    let keyboard =
        localStorage.getItem("keyboardProgress") || 0;

    let piano =
        localStorage.getItem("pianoProgress") || 0;

    document.getElementById("keyboardBar")
        .style.width = keyboard + "%";

    document.getElementById("pianoBar")
        .style.width = piano + "%";

    document.getElementById("keyboardPercent")
        .textContent = Math.floor(keyboard) + "%";

    document.getElementById("pianoPercent")
        .textContent = Math.floor(piano) + "%";

}


/* ==========================================
   PAGE LOAD
========================================== */

document.addEventListener("DOMContentLoaded",function(){

    updateStats();

    updateProgressBars();

});

