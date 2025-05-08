// Smart Learning Module (Add to app.js or as separate smartLearning.js)

// Load or initialize spaced review queue
let spacedReview = JSON.parse(localStorage.getItem('spacedReview') || '[]');

// Schedules a review for a question
function scheduleReview(questionObj, priority = 'high') {
  const today = new Date();
  let nextReviewDate = new Date();

  nextReviewDate.setDate(today.getDate() + (priority === 'high' ? 1 : 3));

  spacedReview.push({
    question: questionObj,
    nextReview: nextReviewDate.toISOString().split('T')[0],
    correctStreak: 0,
  });

  localStorage.setItem('spacedReview', JSON.stringify(spacedReview));
}

// Updates review queue after a correct answer
function updateReviewAfterCorrect(questionText) {
  spacedReview = spacedReview
    .map(item => {
      if (item.question.question === questionText) {
        item.correctStreak++;
        if (item.correctStreak >= 3) return null; // Remove if mastered
      }
      return item;
    })
    .filter(Boolean);

  localStorage.setItem('spacedReview', JSON.stringify(spacedReview));
}

// Gets today's reviews
function getTodayReviews() {
  const today = new Date().toISOString().split('T')[0];
  return spacedReview.filter(item => item.nextReview <= today).map(item => item.question);
}

// Smart start quiz logic
function smartStartQuiz() {
  const todayReviews = getTodayReviews();
  const normalPool = filtered.sort(() => 0.5 - Math.random()).slice(0, quizLength - todayReviews.length);

  quiz = [...todayReviews, ...normalPool];
  current = 0;
  loadQuestion();
}

// Toggle Smart Learning mode
function toggleSmartLearning() {
  const isEnabled = document.getElementById("smartLearningToggle").checked;
  localStorage.setItem("smartLearningEnabled", isEnabled);
  startQuiz = isEnabled ? smartStartQuiz : normalStartQuiz;
  startQuiz();
}

// Backup normal startQuiz
const normalStartQuiz = startQuiz;

// Hook into checkAnswer to schedule reviews or mark questions as mastered
const originalCheckAnswer = checkAnswer;
checkAnswer = function (selected) {
  const q = quiz[current];
  const wasCorrect = selected === q.correct;

  originalCheckAnswer(selected);

  if (!wasCorrect) {
    scheduleReview(q, "high");
  } else {
    updateReviewAfterCorrect(q.question);
  }
};

// Initialize Smart Learning toggle state
window.addEventListener("load", () => {
  const isEnabled = localStorage.getItem("smartLearningEnabled") === "true";
  document.getElementById("smartLearningToggle").checked = isEnabled;
  startQuiz = isEnabled ? smartStartQuiz : normalStartQuiz;
});

document.addEventListener("DOMContentLoaded", () => {
  // Automatically enable Smart Learning
  localStorage.setItem("smartLearningEnabled", "true");
  startQuiz = smartStartQuiz; // Use the Smart Learning startQuiz function
});

if (typeof startQuiz === "undefined") {
  var startQuiz = function () {
    console.error("Default startQuiz function called. Ensure startQuiz is properly defined in app.js.");
  };
}
