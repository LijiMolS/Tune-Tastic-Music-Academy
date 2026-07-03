document.addEventListener("DOMContentLoaded", () => {

  const cards = document.querySelectorAll(".exercise-card");
  const progressFill = document.querySelector(".progress-fill");
  const scoreDisplay = document.querySelector(".score-display");

  const totalCards = cards.length;

  let currentCard = 0;
  let score = 0;

  // 👉 Show one card at a time
  function showCard(index) {
    cards.forEach((card, i) => {
      card.style.display = i === index ? "flex" : "none";
    });
  }

  showCard(0);

  // 👉 Loop through cards
  cards.forEach(card => {

    const type = card.dataset.type;
    const correctAnswer = card.dataset.answer;
    const feedback = card.querySelector(".feedback");

    // ======================
    // ✅ MCQ TYPE
    // ======================
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

    // ======================
    // ✅ SELECT TYPE
    // ======================
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

  // ======================
  // 🎯 HANDLE RESULT
  // ======================
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

    // 👉 Update score & progress bar
    scoreDisplay.textContent = `Score: ${score} / ${totalCards}`;
    progressFill.style.width = `${(score / totalCards) * 100}%`;

    // 👉 Disable buttons
    buttons.forEach(btn => {
      btn.style.pointerEvents = "none";
      btn.style.opacity = "0.6";
    });

    // 👉 Next card after short delay
    setTimeout(() => {
      currentCard++;
      if (currentCard < totalCards) {
        showCard(currentCard);
      } else {
        showCompletionScreen();
      }
    }, 900);
  }

  // ======================
  // 🎉 COMPLETION SCREEN
  // ======================
  function showCompletionScreen() {

    // 👉 Save score to backend
    fetch("/save-builder-score/", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-CSRFToken": getCSRFToken(),
      },
      body: `score=${score}`
    })
    .then(res => res.json())
    .then(data => {
      console.log("Score saved:", data.total_score);
    })
    .catch(err => console.log("Save error:", err));

    // 👉 Show final completion UI
    const container = document.querySelector(".carousel-container");
    container.innerHTML = `
      <div class="completion-screen">
        <h2>🎉 All Exercises Completed!</h2>
        <p>Your Final Score: <strong>${score} / ${totalCards}</strong></p>
        <a href="/builder-exercise/" class="btn-primary">Try Again</a>
        <a href="/" class="btn-secondary">Home</a>
      </div>
    `;
  }

  // ======================
  // 🔐 GET CSRF TOKEN
  // ======================
  function getCSRFToken() {
    const cookieValue = document.cookie.split('; ')
      .find(row => row.startsWith('csrftoken='))
      ?.split('=')[1];
    return cookieValue || '';
  }

});