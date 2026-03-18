// ============================================================
// SCORING ENGINE — multipliers, penalties, normalization
// ============================================================

function getMultipliers(profile) {
  const multipliers = {};

  // Default all to 1.00
  SECTIONS.forEach(s => { multipliers[s.key] = 1.00; });

  // Tax Efficiency
  const profitMap = { 'under100k': 0.85, '100k-250k': 1.00, '250k-500k': 1.10, '500k+': 1.20 };
  if (profile.profit && profitMap[profile.profit] !== undefined) {
    multipliers.tax = profitMap[profile.profit];
  }

  // Business Value & Exit Readiness
  const exitMap = { '20+': 0.85, '10-19': 1.00, '5-9': 1.10, '0-4': 1.25, 'unsure': 1.00 };
  if (profile.yearsToExit && exitMap[profile.yearsToExit] !== undefined) {
    multipliers.exit = exitMap[profile.yearsToExit];
  }

  // Estate & Strategic Discipline
  const hasSpouseOrDeps = profile.marital === 'married' || profile.dependents === 'yes';
  const isUnder35 = profile.age === 'under35';
  const is55Plus = profile.age === '55-64' || profile.age === '65+';

  if (!hasSpouseOrDeps && isUnder35) {
    multipliers.estate = 0.85;
  } else if (is55Plus) {
    multipliers.estate = 1.15;
  } else if (hasSpouseOrDeps) {
    multipliers.estate = 1.10;
  }

  // Risk Protection
  const empCount = profile.employees;
  const hasDeps = profile.dependents === 'yes';
  if (empCount === '0' && !hasDeps) {
    multipliers.risk = 0.90;
  } else if (empCount === '6-20' || empCount === '21+') {
    multipliers.risk = 1.15;
  } else if (hasDeps || empCount === '1-5') {
    multipliers.risk = 1.05;
  }

  // Retirement & Investing
  const is45Plus = profile.age === '45-54' || is55Plus;
  const isMidHighIncome = profile.profit !== 'under100k';
  if (isUnder35 && profile.profit === 'under100k') {
    multipliers.retirement = 0.95;
  } else if (is45Plus) {
    multipliers.retirement = 1.10;
  } else if (isMidHighIncome) {
    multipliers.retirement = 1.05;
  }

  // Cash Flow & Reserves
  const isSoloLowRev = profile.businessType === 'solo' && profile.revenue === 'under250k';
  const hasTeam = profile.businessType !== 'solo';
  if (isSoloLowRev) {
    multipliers.cashflow = 0.95;
  } else if (hasTeam) {
    multipliers.cashflow = 1.10;
  }

  // Clamp all between 0.85 and 1.25
  Object.keys(multipliers).forEach(k => {
    multipliers[k] = Math.max(0.85, Math.min(1.25, multipliers[k]));
  });

  return multipliers;
}

function computePenalties(profile, answers) {
  let totalPenalty = 0;

  // Helper: get raw score for a question id
  function qScore(qid) {
    return answers[qid] !== undefined ? answers[qid] : null;
  }

  // No personal reserve + no business reserve
  if (qScore('q7') === 0 && qScore('q8') === 0) {
    totalPenalty += 6;
  }

  // No real tax planning at profit $250k+
  const highProfit = profile.profit === '250k-500k' || profile.profit === '500k+';
  if (highProfit && qScore('q4') === 0) {
    totalPenalty += 6;
  }

  // No retirement/investing system at age 45+
  const is45Plus = profile.age === '45-54' || profile.age === '55-64' || profile.age === '65+';
  if (is45Plus && qScore('q13') === 0) {
    totalPenalty += 6;
  }

  // No exit planning within 5 years of desired exit
  const nearExit = profile.yearsToExit === '0-4' || profile.yearsToExit === '5-9';
  if (nearExit && qScore('q17') === 0) {
    totalPenalty += 8;
  }

  // Business depends almost entirely on owner + no reserves
  if (qScore('q18') === 0 && qScore('q8') === 0) {
    totalPenalty += 6;
  }

  // No estate planning while married/with dependents
  const hasFamily = profile.marital === 'married' || profile.dependents === 'yes';
  if (hasFamily && qScore('q22') === 0) {
    totalPenalty += 5;
  }

  // Cap at -18
  return Math.min(totalPenalty, 18);
}

function calculateResults(profile, answers) {
  const multipliers = getMultipliers(profile);

  // Section results
  const sectionResults = [];
  let adjustedMax = 0;
  let adjustedRaw = 0;

  SECTIONS.forEach(section => {
    const scores = section.questions.map(q => answers[q.id] !== undefined ? answers[q.id] : 0);
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    const mult = multipliers[section.key];
    const weighted = avg * section.weight * mult;
    const maxWeighted = section.weight * mult;

    adjustedMax += maxWeighted;
    adjustedRaw += weighted;

    sectionResults.push({
      key: section.key,
      title: section.title,
      weight: section.weight,
      avg: avg,
      multiplier: mult,
      weighted: weighted,
      maxWeighted: maxWeighted,
      pct: avg * 100
    });
  });

  // Normalize to 100
  const normalizedScore = (adjustedRaw / adjustedMax) * 100;

  // Apply penalties
  const penalties = computePenalties(profile, answers);
  let finalScore = normalizedScore - penalties;
  finalScore = Math.max(0, Math.min(100, Math.round(finalScore)));

  // Score band
  let band;
  if (finalScore >= 90) band = 'Wealth Optimized';
  else if (finalScore >= 80) band = 'Wealth Strong';
  else if (finalScore >= 65) band = 'Wealth Stable';
  else if (finalScore >= 50) band = 'Wealth Exposed';
  else band = 'Wealth Fragile';

  // Summary sentence
  const summaries = {
    'Wealth Optimized': 'Your wealth-building system is well-optimized. You are converting business income into lasting wealth with strong discipline across the board.',
    'Wealth Strong': 'You have a strong foundation with most areas working well. A few targeted improvements could push your system to the next level.',
    'Wealth Stable': 'You have a solid foundation, but a few key gaps are limiting how efficiently your business income is turning into lasting wealth.',
    'Wealth Exposed': 'Your wealth-building system has meaningful gaps that are likely costing you. Addressing the top priorities below could make a significant difference.',
    'Wealth Fragile': 'There are critical gaps across your wealth-building system. The good news: identifying them is the first step, and focused action on a few areas can create rapid improvement.'
  };

  // Sort sections by pct for strengths/leaks
  const sorted = [...sectionResults].sort((a, b) => b.pct - a.pct);
  const strengths = sorted.slice(0, 2);
  const leaks = sorted.slice(-3).reverse();

  // Top 3 recommendation categories from weakest sections
  const weakest = sorted.slice(-3).reverse().map(s => s.key);
  const topRecs = weakest.slice(0, 3).map(key => RECOMMENDATIONS[key]);

  return {
    score: finalScore,
    band: band,
    summary: summaries[band],
    penalties: penalties,
    sections: sectionResults,
    strengths: strengths.map(s => STRENGTH_DESCRIPTIONS[s.key]),
    leaks: leaks.map(s => LEAK_DESCRIPTIONS[s.key]),
    recommendations: topRecs
  };
}
