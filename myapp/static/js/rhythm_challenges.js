document.addEventListener("DOMContentLoaded", () => {

  const cards = document.querySelectorAll(".exercise-card");
  const progressFill = document.querySelector(".progress-fill");
  const scoreDisplay = document.querySelector(".score-display");

  const totalCards = cards.length;
  let currentCard = 0;
  let score = 0;

  // Show only current card
  function showCard(index) {
    cards.forEach((card, i) => {
      card.style.display = i === index ? "flex" : "none";
    });
  }

  showCard(0);

  // Loop through each exercise card
  cards.forEach(card => {

    const type = card.dataset.type; // "mcq" or "select"
    const correctAnswer = card.dataset.answer;
    const feedback = card.querySelector(".feedback");

    // ✅ MCQ exercises
    if (type === "mcq") {
      const answerBtns = card.querySelectorAll(".answer-btn");

      answerBtns.forEach(btn => {
        btn.addEventListener("click", () => {
          if (feedback.classList.contains("done")) return;

          const isCorrect = btn.dataset.choice === correctAnswer;
          handleResult(isCorrect, correctAnswer, feedback, answerBtns);
        }, { once: true });
      });
    }

    // ✅ Select-type exercises (if any)
    if (type === "select") {
      const noteBtns = card.querySelectorAll(".note-btn");
      const checkBtn = card.querySelector(".check-btn");
      let selected = [];

      noteBtns.forEach(btn => {
        btn.addEventListener("click", () => {
          if (feedback.classList.contains("done")) return;

          const note = btn.dataset.note;
          if (selected.includes(note)) {
            selected = selected.filter(n => n !== note);
            btn.classList.remove("active");
          } else {
            selected.push(note);
            btn.classList.add("active");
          }
        });
      });

      if (checkBtn) {
        checkBtn.addEventListener("click", () => {
          if (feedback.classList.contains("done")) return;

          const correct = correctAnswer.split(",");
          const isCorrect =
            selected.length === correct.length &&
            correct.every(n => selected.includes(n));

          handleResult(isCorrect, correct.join(", "), feedback, noteBtns);
        }, { once: true });
      }
    }

  });

  // Handle result of an exercise
  function handleResult(isCorrect, correctAnswer, feedback, buttons) {
    if (feedback.classList.contains("done")) return;
    feedback.classList.add("done");

    if (isCorrect) {
      feedback.textContent = "✅ Correct!";
      feedback.style.color = "black";
      score++;
    } else {
      feedback.textContent = `❌ Wrong! Correct: ${correctAnswer}`;
      feedback.style.color = "black";
    }

    // Update progress
    scoreDisplay.textContent = `Score: ${score} / ${totalCards}`;
    progressFill.style.width = `${(score / totalCards) * 100}%`;

    // Disable buttons
    buttons.forEach(btn => {
      btn.style.pointerEvents = "none";
      btn.style.opacity = "0.6";
    });

    // Next card after short delay
    setTimeout(() => {
      currentCard++;
      if (currentCard < totalCards) {
        showCard(currentCard);
      } else {
        showCompletionScreen();
      }
    }, 800);
  }

  // Show final completion screen & send score to backend
  function showCompletionScreen() {

    // ✅ Send final score to Django backend
    fetch("/save-rhythm-score/", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-CSRFToken": getCSRFToken(),
      },
      body: `score=${score}`
    })
    .then(res => res.json())
    .then(data => {
      console.log("Rhythm score saved:", data);
    })
    .catch(err => console.log("Save error:", err));

    const container = document.querySelector(".carousel-container");
    container.innerHTML = `
      <div class="completion-screen">
        <h2>🎉 All Exercises Completed!</h2>
        <p>Your Final Score: <strong>${score} / ${totalCards}</strong></p>
        <a href="/rhythm-challenges/" class="btn-primary">Try Again</a>
        <a href="/" class="btn-secondary">Home</a>
      </div>
    `;
  }

  // Get CSRF token
  function getCSRFToken() {
    const cookieValue = document.cookie.split('; ')
      .find(row => row.startsWith('csrftoken='))
      ?.split('=')[1];
    return cookieValue || '';
  }

});

// ✅ Visual flash for Exercise 5
const exercise5 = document.querySelector(
  '.exercise-card[data-answer="Ta – Ta – Taaa – Ta – Ta"] .visual-rhythm'
);

if (exercise5) {
  const beats = exercise5.querySelectorAll(".beat");
  let i = 0;

  function flashBeat() {
    beats.forEach(b => b.classList.remove("highlight"));
    if (i < beats.length) {
      beats[i].classList.add("highlight");
      const delay = beats[i].classList.contains("long") ? 800 : 400;
      i++;
      setTimeout(flashBeat, delay);
    }
  }

  flashBeat();
}