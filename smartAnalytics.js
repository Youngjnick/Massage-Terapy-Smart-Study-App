function showSmartAnalytics() {
  const smartAnalyticsDiv = document.getElementById("smartAnalytics");

  // Calculate totals
  const totalQuestions = questions.length;
  const totalMastered = mastered.length;
  const totalInReview = spacedReview.length;
  const totalRemaining = totalQuestions - totalMastered - totalInReview;

  // Calculate today's review count
  const todayReviews = getTodayReviews();
  const todayReviewCount = todayReviews.length;

  // Update Smart Analytics UI
  smartAnalyticsDiv.innerHTML = `
    <h2>📊 Smart Learning Analytics</h2>
    <p><strong>Total Questions:</strong> ${totalQuestions}</p>
    <p><strong>Mastered:</strong> ${totalMastered} (${Math.round((totalMastered / totalQuestions) * 100)}%)</p>
    <p><strong>In Review:</strong> ${totalInReview} (${Math.round((totalInReview / totalQuestions) * 100)}%)</p>
    <p><strong>Remaining to Master:</strong> ${totalRemaining} (${Math.round((totalRemaining / totalQuestions) * 100)}%)</p>
    <p><strong>Reviews Due Today:</strong> ${todayReviewCount}</p>
  `;
}

// Hook into toggleAnalytics or showAnalytics
function toggleAnalytics() {
  const analyticsDiv = document.getElementById("analytics");
  const smartAnalyticsDiv = document.getElementById("smartAnalytics");
  const toggleButton = document.getElementById("toggleAnalyticsButton");

  const visible = analyticsDiv.style.display === "block";
  analyticsDiv.style.display = visible ? "none" : "block";
  toggleButton.innerText = visible ? "Show Analytics" : "Hide Analytics";
  localStorage.setItem("analyticsVisible", !visible);

  if (!visible) {
    showAnalytics();
    showSmartAnalytics();
  }
}

// Auto-refresh analytics when quiz loads or completes
function refreshAnalytics() {
  showAnalytics();
  showSmartAnalytics();
}