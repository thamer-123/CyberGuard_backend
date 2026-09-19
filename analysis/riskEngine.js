function calculateRisk(data) {
  let score = 0;

  const reasons = [];

  // Domain Age Analysis

  if (data.reputation.ageDays < 30) {
    score += 25;

    reasons.push("Domain registered less than 30 days ago");
  } else if (data.reputation.ageDays < 180) {
    score += 10;

    reasons.push("Domain is relatively new");
  } else {
    reasons.push("Domain has an established history");
  }

  let status;

  if (score >= 80) {
    status = "dangerous";
  } else if (score >= 40) {
    status = "warning";
  } else {
    status = "safe";
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
