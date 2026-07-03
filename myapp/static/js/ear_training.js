document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".exercise-card");
  const progressFill = document.querySelector(".progress-fill");
  const scoreDisplay = document.querySelector(".score-display");
  const totalCards = cards.length;

  let currentCard = 0;
  let score = 0;

  // Show only first card
  function showCard(index) {
    cards.forEach((c, i) => {
      c.style.display = i === index ? "flex" : "none";
    });
  }
  showCard(0);

  // Setup audio
  cards.forEach((card) => {
    const playBtn = card.querySelector(".play-btn");
    const audioEl = document.createElement("audio");
    audioEl.src = playBtn.dataset.audio;
    card.appendChild(audioEl);

    playBtn.addEventListener("click", () => {
      audioEl.currentTime = 0;
      audioEl.play().catch(err => console.log("Audio play error:", err));
    });
  });

  // Answer handling
  cards.forEach((card) => {
    const answerBtns = card.querySelectorAll(".answer-btn");
    const feedback = card.querySelector(".feedback");
    const correctAnswer = card.dataset.answer;

    answerBtns.forEach((btn) => {
      btn.addEventListener("click", () => {

        const isCorrect = btn.dataset.choice === correctAnswer;

        // Feedback
        feedback.textContent = isCorrect
          ? "✅ Correct!"
          : `❌ Wrong! Correct: ${correctAnswer}`;

        // Increase score
        if (isCorrect) score++;

        // Progress bar
        const percent = (score / totalCards) * 100;
        progressFill.style.width = percent + "%";

        // Score display
        scoreDisplay.textContent = `Score: ${score} / ${totalCards}`;

        // Disable buttons
        answerBtns.forEach(b => b.disabled = true);

        // Move to next
        setTimeout(() => {
          currentCard++;
          if (currentCard < totalCards) {
            showCard(currentCard);
          } else {
            showCompletionScreen();
          }
        }, 800);
      });
    });
  });

  // ✅ FINAL SAVE ONLY ONCE
  function showCompletionScreen() {

    fetch("/save-score/", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-CSRFToken": getCSRFToken(),
      },
      body: `score=${score}`
    })
    .then(res => res.json())
    .then(data => console.log("Saved:", data))
    .catch(err => console.log("Save error:", err));

    const container = document.querySelector(".carousel-container");
    container.innerHTML = `
      <div class="completion-screen">
        <h2>All Exercises Completed!</h2>
        <p>Your Final Score: <strong>${score} / ${totalCards}</strong></p>
        <a href="/ear_training_play/" class="btn-primary">Try Again</a>
        <a href="/" class="btn-secondary">Home</a>
      </div>
    `;
  }

  // CSRF helper
  function getCSRFToken() {
    const cookieValue = document.cookie.split('; ')
      .find(row => row.startsWith('csrftoken='))
      ?.split('=')[1];
    return cookieValue || '';
  }
});