// ============================================================
// APP — UI logic, navigation, rendering
// ============================================================

let profile = {};
let answers = {};
let currentSectionIndex = 0;
const totalSteps = 1 + SECTIONS.length; // profile + 8 sections

// --- Screen management ---
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateProgress(step) {
  const pct = ((step) / totalSteps) * 100;
  document.getElementById('progress-fill').style.width = pct + '%';
  document.getElementById('section-progress-fill').style.width = pct + '%';
}

// --- Welcome ---
function startAssessment() {
  renderProfileQuestions();
  showScreen('screen-profile');
  updateProgress(0.5);
}

// --- Profile ---
function renderProfileQuestions() {
  const container = document.getElementById('profile-questions');
  container.innerHTML = '';
  PROFILE_QUESTIONS.forEach(pq => {
    const block = document.createElement('div');
    block.className = 'question-block';
    block.innerHTML = `<div class="q-label">${pq.label}</div><div class="option-list" id="profile-${pq.id}"></div>`;
    const list = block.querySelector('.option-list');
    pq.options.forEach(opt => {
      const item = document.createElement('div');
      item.className = 'option-item';
      item.setAttribute('data-qid', pq.id);
      item.setAttribute('data-value', opt.value);
      item.setAttribute('tabindex', '0');
      item.setAttribute('role', 'radio');
      item.innerHTML = `<div class="option-radio"></div><span>${opt.text}</span>`;
      item.addEventListener('click', () => selectProfileOption(pq.id, opt.value, item));
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectProfileOption(pq.id, opt.value, item); }
      });
      list.appendChild(item);
    });
    container.appendChild(block);
  });
}

function selectProfileOption(qid, value, el) {
  // Deselect siblings
  const parent = el.parentElement;
  parent.querySelectorAll('.option-item').forEach(i => i.classList.remove('selected'));
  el.classList.add('selected');
  profile[qid] = value;
  checkProfileComplete();
}

function checkProfileComplete() {
  const allAnswered = PROFILE_QUESTIONS.every(pq => profile[pq.id] !== undefined);
  document.getElementById('profile-next-btn').disabled = !allAnswered;
}

function submitProfile() {
  if (PROFILE_QUESTIONS.some(pq => profile[pq.id] === undefined)) return;
  currentSectionIndex = 0;
  renderSection(currentSectionIndex);
  showScreen('screen-section');
  updateProgress(1);
}

// --- Sections ---
function renderSection(index) {
  const section = SECTIONS[index];
  document.getElementById('section-label').textContent = `Section ${index + 1} of ${SECTIONS.length}`;
  document.getElementById('section-title').textContent = section.title;

  const container = document.getElementById('section-questions');
  container.innerHTML = '';

  section.questions.forEach(q => {
    const block = document.createElement('div');
    block.className = 'question-block';
    block.innerHTML = `<div class="q-label">${q.label}</div><div class="option-list" id="opts-${q.id}"></div>`;
    const list = block.querySelector('.option-list');
    q.options.forEach((opt, oi) => {
      const item = document.createElement('div');
      item.className = 'option-item';
      if (answers[q.id] === opt.score) item.classList.add('selected');
      item.setAttribute('tabindex', '0');
      item.setAttribute('role', 'radio');
      item.innerHTML = `<div class="option-radio"></div><span>${opt.text}</span>`;
      item.addEventListener('click', () => selectScoredOption(q.id, opt.score, item));
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectScoredOption(q.id, opt.score, item); }
      });
      list.appendChild(item);
    });
    container.appendChild(block);
  });

  checkSectionComplete();

  // Update button text for last section
  const btn = document.getElementById('section-next-btn');
  btn.textContent = index === SECTIONS.length - 1 ? 'See My Results' : 'Continue';
}

function selectScoredOption(qid, score, el) {
  const parent = el.parentElement;
  parent.querySelectorAll('.option-item').forEach(i => i.classList.remove('selected'));
  el.classList.add('selected');
  answers[qid] = score;
  checkSectionComplete();
}

function checkSectionComplete() {
  const section = SECTIONS[currentSectionIndex];
  const allAnswered = section.questions.every(q => answers[q.id] !== undefined);
  document.getElementById('section-next-btn').disabled = !allAnswered;
}

function nextSection() {
  const section = SECTIONS[currentSectionIndex];
  if (section.questions.some(q => answers[q.id] === undefined)) return;

  if (currentSectionIndex < SECTIONS.length - 1) {
    currentSectionIndex++;
    renderSection(currentSectionIndex);
    updateProgress(1 + currentSectionIndex);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    showResults();
  }
}

function goBack() {
  if (document.getElementById('screen-section').classList.contains('active')) {
    if (currentSectionIndex > 0) {
      currentSectionIndex--;
      renderSection(currentSectionIndex);
      updateProgress(1 + currentSectionIndex);
    } else {
      showScreen('screen-profile');
      updateProgress(0);
    }
  } else if (document.getElementById('screen-profile').classList.contains('active')) {
    showScreen('screen-welcome');
  }
}

// --- Results ---
function showResults() {
  const results = calculateResults(profile, answers);
  showScreen('screen-results');

  // Animate score ring with band-appropriate color
  const circumference = 2 * Math.PI * 52; // ~326.73
  const arc = document.getElementById('score-arc');
  const offset = circumference - (results.score / 100) * circumference;
  let ringColor = '#c0392b'; // Fragile
  if (results.score >= 90) ringColor = '#1b4d3e';
  else if (results.score >= 80) ringColor = '#27ae60';
  else if (results.score >= 65) ringColor = '#2ecc71';
  else if (results.score >= 50) ringColor = '#e67e22';
  arc.style.stroke = ringColor;
  requestAnimationFrame(() => {
    arc.style.strokeDashoffset = offset;
  });

  // Animate number
  animateNumber(document.getElementById('score-number'), results.score);

  // Band & summary
  document.getElementById('score-label').textContent = results.band;
  document.getElementById('score-summary').textContent = results.summary;

  // Strengths
  const strengthsEl = document.getElementById('strengths-list');
  if (results.strengths.length === 0) {
    strengthsEl.innerHTML = '<p style="color:#5a5a5a;font-size:0.93rem;">No standout strengths identified yet. Focus on the priorities below to build momentum.</p>';
  } else {
    strengthsEl.innerHTML = results.strengths.map(s =>
      `<div class="insight-item"><div class="insight-dot strength"></div><span>${s}</span></div>`
    ).join('');
  }

  // Leaks
  const leaksEl = document.getElementById('leaks-list');
  if (results.leaks.length === 0) {
    leaksEl.innerHTML = '<p style="color:#5a5a5a;font-size:0.93rem;">No major wealth leaks detected. Your system is working well across the board.</p>';
  } else {
    leaksEl.innerHTML = results.leaks.map(l =>
      `<div class="insight-item"><div class="insight-dot leak"></div><span>${l}</span></div>`
    ).join('');
  }

  // Priorities
  const priEl = document.getElementById('priorities-list');
  if (results.recommendations.length === 0) {
    priEl.innerHTML = '<p style="color:#5a5a5a;font-size:0.93rem;">You are performing well across all areas. Consider a comprehensive review to fine-tune your strategy.</p>';
  } else {
    priEl.innerHTML = results.recommendations.map((rec, i) => {
      const actionList = rec.actions.map(a => `<li>${a}</li>`).join('');
      return `<div class="priority-item"><span class="priority-num">${i + 1}</span><strong>${rec.label}</strong><ul style="margin:8px 0 0 36px;font-size:0.9rem;line-height:1.6;color:#5a5a5a;">${actionList}</ul></div>`;
    }).join('');
  }

  // Section breakdown bars
  const breakdownEl = document.getElementById('breakdown-list');
  breakdownEl.innerHTML = results.sections.map(s => {
    const pct = Math.round(s.pct);
    const earned = Math.round(s.avg * s.weight * 10) / 10;
    let colorClass = 'score-low';
    if (pct >= 80) colorClass = 'score-great';
    else if (pct >= 65) colorClass = 'score-good';
    else if (pct >= 45) colorClass = 'score-ok';
    return `<div class="breakdown-row">
      <div class="bar-header"><span>${s.title}</span><span>${earned} / ${s.weight}</span></div>
      <div class="bar-track"><div class="bar-fill ${colorClass}" style="width:${pct}%"></div></div>
    </div>`;
  }).join('');
}

function restartAssessment() {
  profile = {};
  answers = {};
  currentSectionIndex = 0;
  // Reset score ring
  document.getElementById('score-arc').style.strokeDashoffset = 326.73;
  document.getElementById('score-number').textContent = '0';
  showScreen('screen-welcome');
}

function animateNumber(el, target) {
  let current = 0;
  const duration = 1200;
  const start = performance.now();
  function step(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    current = Math.round(eased * target);
    el.textContent = current;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
