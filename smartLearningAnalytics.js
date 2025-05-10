// Load or initialize spaced review queue
let spacedReview = JSON.parse(localStorage.getItem('spacedReview') || '[]');

// Load or initialize daily stats
let dailyStats = JSON.parse(localStorage.getItem('dailyStats') || JSON.stringify({ date: null, mastered: 0, missed: 0 }));

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

// Updates daily stats
function updateDailyStats(correct) {
  const today = new Date().toISOString().split('T')[0];
  if (dailyStats.date !== today) {
    dailyStats = { date: today, mastered: 0, missed: 0 };
  }
  if (correct) {
    dailyStats.mastered++;
  } else {
    dailyStats.missed++;
  }

  localStorage.setItem('dailyStats', JSON.stringify(dailyStats));
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

// Show Smart Analytics (Daily or Lifetime)
let currentAnalyticsView = "lifetime";
function showSmartAnalytics(view = "lifetime") {
  const smartAnalyticsDiv = document.getElementById("smartAnalytics");
  const totalQuestions = questions.length;
  const totalMastered = mastered.length;
  const totalInReview = spacedReview.length;
  const totalRemaining = totalQuestions - totalMastered - totalInReview;
  const todayReviews = getTodayReviews();
  const overdueReviews = spacedReview.filter(item => item.nextReview < new Date().toISOString().split("T")[0]);

  const percentMastered = Math.round((totalMastered / totalQuestions) * 100);
  const percentInReview = Math.round((totalInReview / totalQuestions) * 100);
  const percentRemaining = Math.round((totalRemaining / totalQuestions) * 100);
  const overallProgress = Math.round(((totalMastered + totalInReview) / totalQuestions) * 100);

  let content = `
    <div class="analytics-card">
      <h2>🚀 Smart Learning Progress</h2>
      <div class="progress-bar">
        <div style="width: ${overallProgress}%; background: #56AB2F;"></div>
      </div>
      <p>${overallProgress}% towards mastering all questions</p>
    </div>
  `;

  if (view === "daily") {
    content += `
    <div class="analytics-card">
      <h2>📅 Daily Stats (${dailyStats.date})</h2>
      <p><strong>Mastered Today:</strong> ${dailyStats.mastered}</p>
      <p><strong>Missed Today:</strong> ${dailyStats.missed}</p>
    </div>
    `;
  } else {
    content += `
    <div class="analytics-card">
      <h2>📊 Smart Analytics (Lifetime)</h2>
      <p><strong>Mastered:</strong> ${totalMastered} (${percentMastered}%)</p>
      <div class="progress-bar"><div style="width: ${percentMastered}%; background: #4CAF50;"></div></div>

      <p><strong>In Review:</strong> ${totalInReview} (${percentInReview}%)</p>
      <div class="progress-bar"><div style="width: ${percentInReview}%; background: #FFC107;"></div></div>

      <p><strong>Remaining:</strong> ${totalRemaining} (${percentRemaining}%)</p>
      <div class="progress-bar"><div style="width: ${percentRemaining}%; background: #AAAAAA;"></div></div>

      <h3>⏰ Reviews Due</h3>
      <p><strong>Due Today:</strong> ${todayReviews.length} | <strong>Overdue:</strong> ${overdueReviews.length}</p>
    </div>
    `;
  }

  content += `
    <div style="text-align: center; margin-top: 10px;">
      <button onclick="toggleSmartAnalyticsView()" style="padding: 6px 12px; border-radius: 5px; border: none; background: #00aaff; color: white; cursor: pointer;">
        Switch to ${view === "daily" ? "Lifetime" : "Daily"} View
      </button>
    </div>
  `;

  smartAnalyticsDiv.innerHTML = content;
}

// Toggle between Daily and Lifetime views
function toggleSmartAnalyticsView() {
  currentAnalyticsView = currentAnalyticsView === "lifetime" ? "daily" : "lifetime";
  showSmartAnalytics(currentAnalyticsView);
}

// Refresh analytics
function refreshAnalytics() {
  showAnalytics();
  showSmartAnalytics(currentAnalyticsView);
}

// Smart Streak Tracker + Encouragement Messages
let longestStreak = parseInt(localStorage.getItem("longestStreak") || "0");

function updateStreakTracker(correct) {
  if (correct) {
    streak++;
    if (streak > longestStreak) {
      longestStreak = streak;
      localStorage.setItem("longestStreak", longestStreak);
    }
  } else {
    streak = 0;
  }
  updateEncouragementMessage();
}

function updateEncouragementMessage() {
  const streakDiv = document.getElementById("streak");

  if (streak >= 10) {
    streakDiv.innerText = `🔥 Incredible! ${streak} in a row!`;
  } else if (streak >= 5) {
    streakDiv.innerText = `💪 Great job! ${streak} correct answers straight!`;
  } else if (streak >= 1) {
    streakDiv.innerText = `✅ Current streak: ${streak}`;
  } else {
    streakDiv.innerText = `❌ Keep going — you’ve got this!`;
  }

  // Add motivational tips every so often
  const tipDiv = document.getElementById("encouragementTip");
  if (!tipDiv) return;

  const tips = [
    "Tip: Review missed topics to boost retention!",
    "Tip: Switch to Smart Learning for adaptive review!",
    "Tip: Try longer quizzes to challenge your memory!",
    "Tip: Bookmark tricky questions for later practice!"
  ];

  if (Math.random() < 0.25) {
    tipDiv.innerText = tips[Math.floor(Math.random() * tips.length)];
  } else {
    tipDiv.innerText = "";
  }
}

// Hook into checkAnswer to update stats and schedule reviews
const originalCheckAnswer = checkAnswer;
checkAnswer = function (selected) {
  const q = quiz[current];
  const isCorrect = selected === q.correct;

  updateDailyStats(isCorrect);
  if (!isCorrect) {
    scheduleReview(q, "high");
  } else {
    updateReviewAfterCorrect(q.question);
  }

  updateStreakTracker(isCorrect);
  originalCheckAnswer(selected);
};

// Initialize Smart Learning toggle state
document.addEventListener("DOMContentLoaded", () => {
  const isEnabled = localStorage.getItem("smartLearningEnabled") === "true";
  document.getElementById("smartLearningToggle").checked = isEnabled;
  startQuiz = isEnabled ? smartStartQuiz : normalStartQuiz;

  // Automatically enable Smart Learning
  localStorage.setItem("smartLearningEnabled", "true");
  startQuiz();
});

function updateAnalytics() {
  const correctAnswers = quiz.filter(q => q.answered && q.correct).length;
  const totalQuestions = quiz.length;
  document.getElementById('correctAnswers').textContent = correctAnswers;
  document.getElementById('totalQuestions').textContent = totalQuestions;

  const topicStats = calculateTopicStats();
  document.getElementById('strongestTopic').textContent = topicStats.strongest;
  document.getElementById('weakestTopic').textContent = topicStats.weakest;
}