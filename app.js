let current = 0;
let streak = 0;
let isDark = false;
let filtered = [...questions];
let quiz = [];
let bookmarks = JSON.parse(localStorage.getItem('bookmarks') || "[]");
let quizLength = 5;
let reviewLog = [];
let correctAnswers = []; // Array to store correctly answered questions

let wrongAnswers = JSON.parse(localStorage.getItem('wrongAnswers') || "[]");
let mastered = JSON.parse(localStorage.getItem('mastered') || "[]");
let spacedReview = JSON.parse(localStorage.getItem('spacedReview') || "[]");

function updateProgress() {
  document.getElementById("progress").innerText = `Mastered: ${mastered.length} / ${questions.length} | Streak: ${streak}`;
  document.getElementById("progressFill").style.width = (current / quiz.length * 100) + "%";
}

function startQuiz() {
  quiz = filtered.sort(() => 0.5 - Math.random()).slice(0, quizLength);
  current = 0;
  loadQuestion();
}

function loadQuestion() {
  updateProgress();
  if (current >= quiz.length) {
    const celebrationDiv = document.getElementById("celebration");
    celebrationDiv.style.display = "flex"; // Show the celebration screen
    console.log("Celebration screen displayed."); // Debugging log
    return;
  }

  const q = quiz[current];
  document.getElementById("quizTopic").innerText = `Topic: ${q.topic.toUpperCase()}`;
  document.getElementById("question").innerHTML = q.question + `<span class="bookmark" onclick="toggleBookmark('${q.question}')">🔖</span>`;
  const answersDiv = document.getElementById("answers");
  answersDiv.innerHTML = '';

  q.answers.forEach((answer, index) => {
    const btn = document.createElement("div");
    btn.innerText = answer;
    btn.className = 'answer';
    btn.onclick = () => checkAnswer(index);
    answersDiv.appendChild(btn);
  });

  document.getElementById("feedback").innerText = '';
}

function toggleBookmark(question) {
  if (bookmarks.includes(question)) bookmarks = bookmarks.filter(q => q !== question);
  else bookmarks.push(question);
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
}

function checkAnswer(selected) {
  const q = quiz[current];
  const correct = q.correct;

  if (selected === correct) {
    document.getElementById("feedback").innerText = "✅ Correct!";
    streak++;
    reviewLog.push(`✅ ${q.question} → ${q.answers[correct]}`);
    if (!mastered.find(mq => mq.question === q.question)) mastered.push(q);

    // Add the question to the correctAnswers array if not already present
    if (!correctAnswers.find(cq => cq.question === q.question)) {
      correctAnswers.push(q);
    }
  } else {
    document.getElementById("feedback").innerText = `❌ Incorrect. Correct: ${q.answers[correct]}`;
    streak = 0;
    wrongAnswers.push(q);
    reviewLog.push(`❌ ${q.question} → Correct: ${q.answers[correct]}`);
  }

  localStorage.setItem('wrongAnswers', JSON.stringify(wrongAnswers));
  localStorage.setItem('mastered', JSON.stringify(mastered));

  setTimeout(() => { current++; loadQuestion(); }, 600);
}

function closeCelebration() {
  document.getElementById("celebration").style.display = "none";
}

function applyFocus() {
  const focus = document.getElementById("focus").value;

  console.log("Selected focus:", focus);
  console.log("All questions:", questions);

  if (focus === "all") {
    filtered = questions.filter(q => !correctAnswers.find(cq => cq.question === q.question)); // Exclude correct answers
  } else if (focus === "missed") {
    filtered = wrongAnswers.filter(q => !correctAnswers.find(cq => cq.question === q.question)); // Exclude correct answers
  } else if (focus === "unanswered") {
    filtered = questions.filter(q => !mastered.find(mq => mq.question === q.question) && !correctAnswers.find(cq => cq.question === q.question));
  } else if (focus === "bookmarked") {
    filtered = questions.filter(q => bookmarks.includes(q.question) && !correctAnswers.find(cq => cq.question === q.question));
  } else {
    // Filter by category
    filtered = questions.filter(q => q.topic === focus && !correctAnswers.find(cq => cq.question === q.question));
  }

  console.log("Filtered questions:", filtered);
  startQuiz();
}

function setQuizLength() {
  quizLength = parseInt(document.getElementById("quizLength").value);
  startQuiz();
}

function resetProgress() {
  if (confirm("Reset all progress?")) {
    localStorage.clear();
    location.reload();
  }
}

function resetCorrectAnswers() {
  if (confirm("Reset all correctly answered questions?")) {
    correctAnswers = [];
    console.log("Correct answers reset.");
    startQuiz();
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

document.body.addEventListener('click', (e) => {
  if (!e.target.classList.contains('answer') && !e.target.closest('button') && !e.target.classList.contains('bookmark')) {
    current++; loadQuestion();
  }
});

document.body.addEventListener('keydown', (e) => {
  if (e.key.toLowerCase() === 't') toggleTheme();
});

function toggleTheme() {
  isDark = !isDark;
  document.body.classList.toggle('dark', isDark);
}

window.onload = () => { startQuiz(); };

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
