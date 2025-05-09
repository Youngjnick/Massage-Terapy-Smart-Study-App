// Core variables
let current = 0;
let streak = 0;
let filtered = [...questions];
let quiz = [];
let quizLength = 5;
let bookmarks = JSON.parse(localStorage.getItem('bookmarks') || "[]");
let reviewLog = [];
let missedQuestions = {}; // Tracks missed questions
let wrongAnswers = JSON.parse(localStorage.getItem('wrongAnswers') || "[]");
let mastered = JSON.parse(localStorage.getItem('mastered') || "[]");

// Updates the progress bar
function updateProgress() {
  const progress = (current / quiz.length) * 100;
  document.getElementById("progressFill").style.width = `${progress}%`;
}

// Starts the quiz
function startQuiz() {
  if (filtered.length === 0) {
    alert("No questions available. Please check your filters or reset progress.");
    return;
  }

  quiz = filtered.sort(() => 0.5 - Math.random()).slice(0, quizLength);
  current = 0;
  loadQuestion();
  refreshAnalytics();
}

// Loads the current question
function loadQuestion() {
  if (current >= quiz.length) {
    checkCompletion();
    showCelebration();
    return;
  }

  const q = quiz[current];
  if (!q) {
    console.error("Question is undefined. Check the quiz array.");
    return;
  }

  document.getElementById("quizTopic").innerText = `Topic: ${q.topic.toUpperCase()}`;
  document.getElementById("question").innerHTML = `${q.question} <span class="bookmark" data-question="${q.question}">🔖</span>`;
  document.getElementById("answers").innerHTML = q.answers
    .map((answer, index) => `<div class="answer" data-index="${index}">${answer}</div>`)
    .join('');
  document.getElementById("feedback").innerText = '';
  updateProgress();
}

// Checks if all questions are answered
function checkCompletion() {
  const totalQuestions = questions.length;
  const totalAnswered = mastered.length + wrongAnswers.length;

  if (totalAnswered === totalQuestions) {
    const quitButton = document.getElementById("quitButton");
    quitButton.innerText = "Complete!";
    quitButton.disabled = false;
  }
}

// Handles answer selection
function checkAnswer(selected) {
  const q = quiz[current];
  const correct = q.correct;

  if (selected === correct) {
    document.getElementById("feedback").innerText = "✅ Correct!";
    streak++;
    reviewLog.push(`✅ ${q.question} → ${q.answers[correct]}`);
    if (!mastered.find(mq => mq.question === q.question)) mastered.push(q);
  } else {
    document.getElementById("feedback").innerText = `❌ Incorrect. Correct: ${q.answers[correct]}`;
    streak = 0;
    wrongAnswers.push(q);
    reviewLog.push(`❌ ${q.question} → ${q.answers[correct]}`);
    missedQuestions[q.question] = (missedQuestions[q.question] || 0) + 1;
  }

  saveProgress();
  updateSettingsProgress();
  refreshAnalytics();
  setTimeout(() => { current++; loadQuestion(); }, 600);
}

// Saves progress to localStorage
function saveProgress() {
  localStorage.setItem('wrongAnswers', JSON.stringify(wrongAnswers));
  localStorage.setItem('mastered', JSON.stringify(mastered));
}

// Updates the progress bar in settings
function updateSettingsProgress() {
  const totalQuestions = questions.length;
  const totalAnswered = mastered.length + wrongAnswers.length;
  const totalCorrect = mastered.length;
  const totalMissed = wrongAnswers.length;
  const totalUnanswered = totalQuestions - totalAnswered;

  document.getElementById("totalQuestions").innerText = totalQuestions;
  document.getElementById("answeredQuestions").innerText = totalAnswered;

  const progressBar = document.getElementById("overallProgressBar");
  progressBar.innerHTML = `
    <div style="width: ${(totalCorrect / totalQuestions) * 100}%; background: #56AB2F;" title="Correct"></div>
    <div style="width: ${(totalMissed / totalQuestions) * 100}%; background: #FF6F61;" title="Missed"></div>
    <div style="width: ${(totalUnanswered / totalQuestions) * 100}%; background: #AAAAAA;" title="Unanswered"></div>
  `;
}

// Resets all progress and analytics
function resetAll() {
  if (confirm("Reset all progress and analytics data?")) {
    mastered = [];
    wrongAnswers = [];
    missedQuestions = {};
    saveProgress();
    updateSettingsProgress();
    refreshAnalytics();
    location.reload();
  }
}

// Shows the celebration screen
function showCelebration() {
  const celebrationDiv = document.getElementById("celebration");
  celebrationDiv.style.display = "flex";
  celebrationDiv.addEventListener("click", () => {
    celebrationDiv.style.opacity = "0";
    setTimeout(() => {
      celebrationDiv.style.display = "none";
    }, 500);
  });
  refreshAnalytics(); // Refresh analytics
}

function closeCelebration() {
  document.getElementById("celebration").style.display = "none";
}

function applyFocus() {
  const focus = document.getElementById("focus").value;

  if (focus === "all") {
    filtered = [...questions];
  } else if (focus === "missed") {
    filtered = wrongAnswers;
  } else if (focus === "unanswered") {
    filtered = questions.filter(q => !mastered.find(mq => mq.question === q.question));
  } else if (focus === "bookmarked") {
    filtered = questions.filter(q => bookmarks.includes(q.question));
  } else {
    filtered = questions.filter(q => q.topic === focus);
  }

  if (filtered.length === 0) {
    console.warn("No questions match the selected focus.");
    alert("No questions match the selected focus. Please try a different filter.");
  }

  console.log("Selected focus:", focus);
  console.log("Filtered questions:", filtered);

  showAnalytics(); // Update analytics when focus changes
  startQuiz();
}

function setQuizLength() {
  quizLength = parseInt(document.getElementById("quizLength").value);
  startQuiz();
}

function resetProgress() {
  if (confirm("Reset all progress?")) {
    mastered = [];
    wrongAnswers = [];
    missedQuestions = {};
    saveProgress(); // Save the reset state
    updateSettingsProgress(); // Reset progress bar in settings
    showAnalytics(); // Update analytics after resetting progress
    location.reload();
  }
}

function toggleSettings() {
  const settings = document.getElementById("settings");
  settings.style.display = settings.style.display === "block" ? "none" : "block";
  if (settings.style.display === "block") showAllQuestions();
}

function showAllQuestions() {
  const allQ = document.getElementById("allQuestions");
  allQ.innerHTML = questions.map(q => 
    `<div class="questionItem" onclick="this.querySelector('.questionAnswer').style.display = (this.querySelector('.questionAnswer').style.display==='block'?'none':'block')">
      ${q.topic.toUpperCase()}: ${q.question}
      <div class="questionAnswer">${q.answers.join("<br>")}</div>
    </div>`
  ).join('');
}

// Event listeners
document.body.addEventListener('click', (e) => {
  if (e.target.classList.contains('answer')) {
    checkAnswer(parseInt(e.target.dataset.index));
  } else if (e.target.classList.contains('bookmark')) {
    toggleBookmark(e.target.dataset.question);
  }
});

document.body.addEventListener('keydown', (e) => {
  if (e.key.toLowerCase() === 't') toggleTheme();
});

window.onload = () => {
  const analyticsVisible = localStorage.getItem("analyticsVisible");
  const analyticsDiv = document.getElementById("analytics");
  const toggleButton = document.getElementById("toggleAnalyticsButton");

  if (analyticsVisible === "true") {
    analyticsDiv.style.display = "block";
    toggleButton.innerText = "Hide Analytics";
  } else {
    analyticsDiv.style.display = "none";
    toggleButton.innerText = "Show Analytics";
  }

  startQuiz();
};

document.addEventListener("DOMContentLoaded", () => {
  const celebrationDiv = document.getElementById("celebration");

  if (celebrationDiv) {
    console.log("Celebration element found!"); // Debugging log
    celebrationDiv.addEventListener("click", () => {
      console.log("Celebration clicked!"); // Debugging log
      console.log("Before hiding, display:", celebrationDiv.style.display); // Debugging log
      celebrationDiv.style.opacity = "0"; // Optional: Add fade-out effect
      setTimeout(() => {
        celebrationDiv.style.display = "none"; // Hide the celebration screen
        console.log("After hiding, display:", celebrationDiv.style.display); // Debugging log
      }, 500); // Match the transition duration if any
    });
  } else {
    console.error("Celebration element not found!");
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const resetAllButton = document.getElementById("resetAllButton");
  const resetProgressButton = document.getElementById("resetProgressButton");
  const resetAnalyticsButton = document.getElementById("resetAnalyticsButton");

  if (resetAllButton) {
    resetAllButton.addEventListener("click", resetAll);
  } else {
    console.error("Reset All button not found!");
  }

  if (resetProgressButton) {
    resetProgressButton.addEventListener("click", resetProgress);
  } else {
    console.error("Reset Progress button not found!");
  }

  if (resetAnalyticsButton) {
    resetAnalyticsButton.addEventListener("click", resetAnalytics);
  } else {
    console.error("Reset Analytics button not found!");
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const resetAllButton = document.getElementById("resetAllButton");

  if (resetAllButton) {
    resetAllButton.addEventListener("click", resetAll);
  } else {
    console.error("Reset All button not found!");
  }
});

document.addEventListener("DOMContentLoaded", () => {
  // Automatically enable Smart Learning
  localStorage.setItem("smartLearningEnabled", "true");
  startQuiz = smartStartQuiz; // Use the Smart Learning startQuiz function
});

function showReview() {
  const reviewContent = document.getElementById("reviewContent");
  reviewContent.innerHTML = reviewLog.map(log => `<p>${log}</p>`).join('');
  document.getElementById("review").style.display = "block";
}

function checkAchievements() {
  if (mastered.length === questions.length) {
    alert("🎉 Achievement Unlocked: Master of All Topics!");
  }
}

// Displays analytics
function showAnalytics() {
  const missedQuestionsStatsDiv = document.getElementById("missedQuestionsStats");
  const missedTopicsStatsDiv = document.getElementById("missedTopicsStats");

  // Calculate total questions
  const totalQuestions = questions.length;
  const totalAnswered = mastered.length + wrongAnswers.length;
  const totalCorrect = mastered.length;
  const totalMissed = wrongAnswers.length;
  const totalUnanswered = totalQuestions - totalAnswered;

  // Calculate percentages
  const percentAnswered = Math.round((totalAnswered / totalQuestions) * 100);
  const percentCorrect = Math.round((totalCorrect / totalQuestions) * 100);
  const percentMissed = Math.round((totalMissed / totalQuestions) * 100);
  const percentUnanswered = Math.round((totalUnanswered / totalQuestions) * 100);

  // Display overall stats with progress bars
  missedQuestionsStatsDiv.innerHTML = `
    <h3>Overall Performance</h3>
    <p><strong>Total Questions:</strong> ${totalQuestions}</p>
    <p><strong>Answered:</strong> ${totalAnswered} (${percentAnswered}%)</p>
    <div class="progress-bar">
      <div style="width: ${percentAnswered}%; background: #56AB2F;"></div>
    </div>
    <p><strong>Correct:</strong> ${totalCorrect} (${percentCorrect}%)</p>
    <div class="progress-bar">
      <div style="width: ${percentCorrect}%; background: #4CAF50;"></div>
    </div>
    <p><strong>Missed:</strong> ${totalMissed} (${percentMissed}%)</p>
    <div class="progress-bar">
      <div style="width: ${percentMissed}%; background: #FF6F61;"></div>
    </div>
    <p><strong>Unanswered:</strong> ${totalUnanswered} (${percentUnanswered}%)</p>
    <div class="progress-bar">
      <div style="width: ${percentUnanswered}%; background: #AAAAAA;"></div>
    </div>
  `;

  // Calculate stats for each topic
  const topicStats = questions.reduce((acc, q) => {
    const topic = q.topic;
    if (!acc[topic]) {
      acc[topic] = { total: 0, correct: 0, missed: 0 };
    }
    acc[topic].total++;
    if (mastered.find(mq => mq.question === q.question)) {
      acc[topic].correct++;
    } else if (wrongAnswers.find(wq => wq.question === q.question)) {
      acc[topic].missed++;
    }
    return acc;
  }, {});

  // Display stats for each topic
  missedTopicsStatsDiv.innerHTML = `
    <h3>Performance by Topic</h3>
    ${Object.entries(topicStats)
      .map(([topic, stats]) => {
        const unanswered = stats.total - stats.correct - stats.missed;
        const percentCorrect = Math.round((stats.correct / stats.total) * 100);
        const percentMissed = Math.round((stats.missed / stats.total) * 100);
        const percentUnanswered = Math.round((unanswered / stats.total) * 100);

        return `
          <div>
            <p><strong>${topic.toUpperCase()}</strong></p>
            <p>Total: ${stats.total}</p>
            <p>Correct: ${stats.correct} (${percentCorrect}%)</p>
            <p>Missed: ${stats.missed} (${percentMissed}%)</p>
            <p>Unanswered: ${unanswered} (${percentUnanswered}%)</p>
            <div class="progress-bar">
              <div style="width: ${percentCorrect}%; background: #56AB2F;"></div>
              <div style="width: ${percentMissed}%; background: #FF6F61;"></div>
              <div style="width: ${percentUnanswered}%; background: #AAAAAA;"></div>
            </div>
          </div>
        `;
      })
      .join('')}
  `;
}

// Resets analytics
function resetAnalytics() {
  if (confirm("Reset all analytics data?")) {
    missedQuestions = {};
    wrongAnswers = [];
    localStorage.setItem('wrongAnswers', JSON.stringify(wrongAnswers));
    showAnalytics();
  }
}

function debugAnalytics() {
  console.log("Questions Array:", questions);
  console.log("Wrong Answers Array:", wrongAnswers);
  console.log("Missed Questions Object:", missedQuestions);
}

function toggleAnalytics() {
  const analyticsDiv = document.getElementById("analytics");
  const toggleButton = document.getElementById("toggleAnalyticsButton");

  if (analyticsDiv.style.display === "none" || analyticsDiv.style.display === "") {
    analyticsDiv.style.display = "block";
    toggleButton.innerText = "Hide Analytics";
    localStorage.setItem("analyticsVisible", "true"); // Save state
  } else {
    analyticsDiv.style.display = "none";
    toggleButton.innerText = "Show Analytics";
    localStorage.setItem("analyticsVisible", "false"); // Save state
  }
}

function refreshAnalytics() {
  showAnalytics(); // Update general analytics
  if (typeof showSmartAnalytics === "function") {
    showSmartAnalytics(); // Update smart analytics if the function exists
  }
}

document.getElementById("toggleAnalyticsButton").addEventListener("click", toggleAnalytics);

document.addEventListener("DOMContentLoaded", () => {
  console.log("Analytics container:", document.getElementById("analyticsContainer"));
  console.log("Missed Questions Stats:", document.getElementById("missedQuestionsStats"));
  console.log("Missed Topics Stats:", document.getElementById("missedTopicsStats"));
});

document.addEventListener("DOMContentLoaded", () => {
  // Initialize analytics
  showAnalytics();
});

function toggleBookmark(questionText) {
  let bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");

  if (bookmarks.includes(questionText)) {
    // Remove the bookmark
    bookmarks = bookmarks.filter(bookmark => bookmark !== questionText);
    console.log(`Removed bookmark for: ${questionText}`);
  } else {
    // Add the bookmark
    bookmarks.push(questionText);
    console.log(`Added bookmark for: ${questionText}`);
  }

  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  updateBookmarkUI(questionText, bookmarks.includes(questionText));
}

// Update the UI to reflect the bookmark state
function updateBookmarkUI(questionText, isBookmarked) {
  const bookmarkElement = document.querySelector(`[data-question="${questionText}"]`);
  if (bookmarkElement) {
    bookmarkElement.innerText = isBookmarked ? "🔖" : "➕";
  }
}

function renderAllQuestions() {
  const allQuestionsDiv = document.getElementById("allQuestions");
  allQuestionsDiv.innerHTML = ""; // Clear any existing content

  questions.forEach((q, index) => {
    const questionHTML = `
      <div class="question-item">
        <p><strong>Q${index + 1}:</strong> ${q.question}</p>
        <ul>
          ${q.answers.map((answer, i) => `<li>${answer}</li>`).join("")}
        </ul>
        <p><em>Correct Answer:</em> ${q.answers[q.correct]}</p>
        <p><em>Topic:</em> ${q.topic}</p>
      </div>
    `;
    allQuestionsDiv.innerHTML += questionHTML;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderAllQuestions();
});
