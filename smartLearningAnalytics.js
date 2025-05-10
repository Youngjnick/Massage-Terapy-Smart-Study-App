function smartStartQuiz() {
  filtered = [...questions];
  quizLength = Math.min(quizLength, filtered.length);
  quiz = filtered.sort(() => Math.random() - 0.5).slice(0, quizLength);
  current = 0;
  loadQuestion();
}

// Ensure it is globally accessible
window.smartStartQuiz = smartStartQuiz;