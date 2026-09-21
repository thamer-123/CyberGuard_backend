function criticalVerdict(reason) {
  return {
    score: 100,
    status: "dangerous",
    reasons: [reason],
  };
}

function calculateRisk(data) {
  // =====================================
  // Critical Threat Intelligence
  // =====================================

  if (data.threatIntel?.listed) {
    return criticalVerdict("Domain was found in OpenPhish");
  }

  // =====================================
  // Heuristic Scoring
  // =====================================

  let score = 0;

  const reasons = [];

  if (data.reputation.ageDays < 30) {
    score += 25;

    reasons.push("Domain registered less than 30 days ago");
  } else if (data.reputation.ageDays < 180) {
    score += 10;

    reasons.push("Domain is relatively new");
  } else {
    reasons.push("Domain has an established history");
  }

  score = Math.min(score, 100);

  let status;

  if (score >= 80) {
    status = "Dangerous";
  } else if (score >= 40) {
    status = "Warning";
  } else {
    status = "Safe";
  }

  return {
    score,
    status,
    reasons,
  };
}

module.exports = {
  calculateRisk,
};
