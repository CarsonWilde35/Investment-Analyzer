// ============================================================
// PROPOSAL APP — Wizard navigation, proposal generation, PDF
// Mirrors the assessment tool's screen-based flow
// ============================================================

// ---- Category metadata ----
const CATEGORIES = [
  {
    key: 'cashflow',
    icon: '\u{1F4B0}',
    title: 'Cash Flow',
    defaultDesc: 'Analyze income sources, expenses, and savings rate to build a sustainable cash flow system that aligns with your goals.',
    focusAreas: [
      'Income analysis & sources',
      'Expense tracking & optimization',
      'Savings rate assessment',
      'Debt management strategy',
      'Emergency fund planning',
      'Cash flow forecasting'
    ],
    deliverables: [
      'Monthly cash flow projection model',
      'Spending category analysis',
      'Savings optimization recommendations',
      'Debt payoff strategy (if applicable)'
    ]
  },
  {
    key: 'tax',
    icon: '\u{1F4CA}',
    title: 'Tax Strategy',
    defaultDesc: 'Develop proactive tax strategies to minimize your lifetime tax burden through entity optimization, timing, and tax-advantaged vehicles.',
    focusAreas: [
      'Current tax liability review',
      'Entity structure optimization',
      'Tax-loss harvesting opportunities',
      'Retirement contribution strategies',
      'Charitable giving optimization',
      'Year-end planning strategies'
    ],
    deliverables: [
      'Tax projection & scenario analysis',
      'Entity structure recommendations',
      'Tax-advantaged account optimization plan',
      'Multi-year tax strategy roadmap'
    ]
  },
  {
    key: 'investment',
    icon: '\u{1F4C8}',
    title: 'Investment Strategy',
    defaultDesc: 'Design a diversified, goal-aligned investment portfolio with clear asset allocation, risk management, and rebalancing discipline.',
    focusAreas: [
      'Current portfolio analysis',
      'Asset allocation review',
      'Risk tolerance assessment',
      'Fee & expense audit',
      'Diversification analysis',
      'Rebalancing methodology'
    ],
    deliverables: [
      'Investment policy statement',
      'Target asset allocation model',
      'Account consolidation recommendations',
      'Ongoing rebalancing framework'
    ]
  },
  {
    key: 'retirement',
    icon: '\u{1F3E0}',
    title: 'Retirement Planning',
    defaultDesc: 'Project retirement readiness, optimize contribution strategies, and model income distribution plans for a confident retirement.',
    focusAreas: [
      'Retirement income projection',
      'Social Security optimization',
      'Contribution strategy analysis',
      'Withdrawal sequencing plan',
      'Healthcare cost planning',
      'Lifestyle & longevity modeling'
    ],
    deliverables: [
      'Retirement readiness analysis',
      'Projected retirement income model',
      'Contribution optimization plan',
      'Retirement income distribution strategy'
    ]
  },
  {
    key: 'risk',
    icon: '\u{1F6E1}\u{FE0F}',
    title: 'Risk Management',
    defaultDesc: 'Evaluate insurance coverage, liability exposure, and contingency planning to protect your family and assets from the unexpected.',
    focusAreas: [
      'Life insurance needs analysis',
      'Disability coverage review',
      'Liability protection assessment',
      'Property & casualty audit',
      'Long-term care evaluation',
      'Business continuity planning'
    ],
    deliverables: [
      'Insurance coverage gap analysis',
      'Risk mitigation recommendations',
      'Coverage optimization plan',
      'Beneficiary designation review'
    ]
  },
  {
    key: 'estate',
    icon: '\u{1F3DB}\u{FE0F}',
    title: 'Estate Planning',
    defaultDesc: 'Review wills, trusts, beneficiary designations, and wealth transfer strategies to ensure your legacy is protected and intentional.',
    focusAreas: [
      'Will & trust review',
      'Beneficiary designation audit',
      'Power of attorney documents',
      'Wealth transfer strategies',
      'Titling & ownership review',
      'Charitable legacy planning'
    ],
    deliverables: [
      'Estate plan summary & gap analysis',
      'Beneficiary review checklist',
      'Wealth transfer strategy options',
      'Document coordination recommendations'
    ]
  }
];

// ---- Timeline data ----
const TIMELINE = [
  { week: 'Week 1', label: 'Engagement & Onboarding', desc: 'Sign agreement, collect fee, send intake questionnaire, send document checklist, send RightCapital invite, and schedule the key meetings.', highlight: false },
  { week: 'Week 2', label: 'Data Gathering & Review', desc: 'Client uploads statements, pay stubs, retirement information, debt details, savings, benefits, and insurance. Review everything and identify missing items.', highlight: false },
  { week: 'Week 3', label: 'Discovery Meeting', desc: '45-60 minute meeting to confirm goals, home purchase timeline, retirement questions, cash reserves, current savings, and the biggest mistakes to avoid.', highlight: false },
  { week: 'Week 4', label: 'Analysis & Strategy', desc: 'Run planning scenarios, evaluate rollover and withdrawal decisions, review home readiness, stress-test priorities, and determine the recommendation sequence.', highlight: false },
  { week: 'Week 5', label: 'Build the Blueprint', desc: 'Turn the strategy into a client-ready deliverable: summary visuals, key findings, action steps, and a clear structure for the presentation meeting.', highlight: false },
  { week: 'Week 6', label: 'Blueprint Presentation', desc: 'Present the recommendations, explain tradeoffs, review the action plan, and deliver the written Blueprint summary and next-step checklist.', highlight: false },
  { week: '30 Days Later', label: 'Follow-Up Meeting', desc: '30-45 minute implementation check-in to review progress, answer questions, revisit pending items, and decide whether ongoing support is needed.', highlight: true }
];

// ---- State ----
const STEPS = ['welcome', 'client', 'advisor', 'categories', 'pricing', 'disclosures', 'preview'];
let currentStep = 0;
let formData = {
  clientType: null,
  selectedCategories: new Set()
};

// ---- Screen management (same pattern as assessment) ----
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateProgress(step) {
  const total = 5; // 5 wizard steps (not counting welcome & preview)
  const pct = Math.min((step / total) * 100, 100);
  document.querySelectorAll('[id^="progress-fill"]').forEach(el => {
    el.style.width = pct + '%';
  });
}

// ---- Welcome ----
function startWizard() {
  currentStep = 1;
  showScreen('screen-client');
  updateProgress(1);
}

// ---- Option selection (radio-style, same as assessment) ----
function selectOption(field, value, el) {
  const parent = el.parentElement;
  parent.querySelectorAll('.option-item').forEach(i => i.classList.remove('selected'));
  el.classList.add('selected');
  formData[field] = value;

  // Toggle couple field
  if (field === 'clientType') {
    document.getElementById('client2-block').style.display = value === 'couple' ? 'block' : 'none';
  }

  checkStepComplete('client');
}

// ---- Checkbox selection (for categories) ----
function toggleCategory(key, el) {
  if (formData.selectedCategories.has(key)) {
    formData.selectedCategories.delete(key);
    el.classList.remove('selected');
  } else {
    formData.selectedCategories.add(key);
    el.classList.add('selected');
  }
  checkStepComplete('categories');
}

// ---- Step validation ----
function checkStepComplete(step) {
  switch (step) {
    case 'client': {
      const hasType = formData.clientType !== null;
      const hasName1 = document.getElementById('client1Name').value.trim().length > 0;
      const isCpl = formData.clientType === 'couple';
      const hasName2 = !isCpl || document.getElementById('client2Name').value.trim().length > 0;
      document.getElementById('client-next').disabled = !(hasType && hasName1 && hasName2);
      break;
    }
    case 'advisor': {
      const hasAdvisor = document.getElementById('advisorName').value.trim().length > 0;
      const hasFirm = document.getElementById('firmName').value.trim().length > 0;
      document.getElementById('advisor-next').disabled = !(hasAdvisor && hasFirm);
      break;
    }
    case 'categories': {
      document.getElementById('categories-next').disabled = formData.selectedCategories.size === 0;
      break;
    }
    case 'pricing': {
      const hasFee = document.getElementById('planFee').value.trim().length > 0;
      document.getElementById('pricing-next').disabled = !hasFee;
      break;
    }
  }
}

// ---- Navigation ----
function goNext() {
  const stepName = STEPS[currentStep];

  // Before moving to pricing, render category description blocks
  if (stepName === 'categories') {
    renderCategoryDescriptions();
  }

  currentStep++;
  showScreen('screen-' + STEPS[currentStep]);
  updateProgress(currentStep);

  // Re-check the next step's completeness
  if (STEPS[currentStep] === 'pricing') checkStepComplete('pricing');
}

function goBack() {
  if (currentStep <= 0) return;
  if (STEPS[currentStep] === 'preview') {
    currentStep = STEPS.indexOf('disclosures');
    showScreen('screen-disclosures');
    updateProgress(currentStep);
    return;
  }
  currentStep--;
  if (currentStep === 0) {
    showScreen('screen-welcome');
  } else {
    showScreen('screen-' + STEPS[currentStep]);
    updateProgress(currentStep);
  }
}

function backToEditor() {
  currentStep = STEPS.indexOf('disclosures');
  showScreen('screen-disclosures');
  updateProgress(currentStep);
}

function startOver() {
  formData = { clientType: null, selectedCategories: new Set() };
  currentStep = 0;

  // Clear inputs
  document.querySelectorAll('.text-input, .text-area').forEach(el => {
    if (el.id === 'pricingIncludes') return; // keep default
    if (el.id === 'disclosures') return; // keep default
    el.value = '';
  });
  document.querySelectorAll('.option-item').forEach(i => i.classList.remove('selected'));
  document.querySelectorAll('.checkbox-item').forEach(i => i.classList.remove('selected'));
  document.getElementById('client2-block').style.display = 'none';

  showScreen('screen-welcome');
}

// ---- Render category checkboxes ----
function renderCategoryCheckboxes() {
  const container = document.getElementById('category-checkboxes');
  container.innerHTML = '';
  CATEGORIES.forEach(cat => {
    const el = document.createElement('div');
    el.className = 'checkbox-item';
    el.setAttribute('tabindex', '0');
    el.setAttribute('role', 'checkbox');
    el.innerHTML = `<div class="checkbox-box">\u2713</div><span class="checkbox-label-text">${cat.icon} ${cat.title}</span>`;
    el.addEventListener('click', () => toggleCategory(cat.key, el));
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleCategory(cat.key, el); }
    });
    container.appendChild(el);
  });
}

// ---- Render editable category descriptions ----
function renderCategoryDescriptions() {
  const container = document.getElementById('category-description-blocks');
  container.innerHTML = '';
  CATEGORIES.filter(c => formData.selectedCategories.has(c.key)).forEach(cat => {
    const block = document.createElement('div');
    block.className = 'cat-desc-block';
    block.innerHTML = `
      <div class="cat-desc-header">
        <span class="cat-desc-icon">${cat.icon}</span>
        <span class="cat-desc-title">${cat.title} — Description</span>
      </div>
      <textarea class="text-area" id="cat-desc-${cat.key}" rows="3">${cat.defaultDesc}</textarea>
    `;
    container.appendChild(block);
  });
}

// ---- Set default dates ----
function setDefaultDates() {
  const today = new Date();
  const fmt = d => d.toISOString().split('T')[0];
  document.getElementById('proposalDate').value = fmt(today);
  const nextMon = new Date(today);
  nextMon.setDate(today.getDate() + ((8 - today.getDay()) % 7 || 7));
  document.getElementById('startDate').value = fmt(nextMon);
}

// ---- Collect all form data ----
function collectFormData() {
  const isCpl = formData.clientType === 'couple';
  const client1 = document.getElementById('client1Name').value.trim();
  const client2 = document.getElementById('client2Name').value.trim();
  const clientDisplay = isCpl && client2 ? `${client1} & ${client2}` : client1;
  const clientFirstNames = isCpl && client2
    ? `${client1.split(' ')[0]} & ${client2.split(' ')[0]}`
    : client1.split(' ')[0];

  const cats = CATEGORIES.filter(c => formData.selectedCategories.has(c.key)).map(cat => ({
    ...cat,
    description: (document.getElementById('cat-desc-' + cat.key) || {}).value || cat.defaultDesc
  }));

  const proposalDate = document.getElementById('proposalDate').value;
  const firmName = document.getElementById('firmName').value.trim();

  return {
    clientDisplay,
    clientFirstNames,
    advisorName: document.getElementById('advisorName').value.trim(),
    firmName,
    advisorTitle: document.getElementById('advisorTitle').value.trim(),
    advisorPhone: document.getElementById('advisorPhone').value.trim(),
    advisorEmail: document.getElementById('advisorEmail').value.trim(),
    advisorWebsite: document.getElementById('advisorWebsite').value.trim(),
    proposalDate: proposalDate ? formatDate(proposalDate) : '',
    categories: cats,
    planFee: document.getElementById('planFee').value.trim(),
    pricingIncludes: document.getElementById('pricingIncludes').value.trim(),
    ongoingFee: document.getElementById('ongoingFee').value.trim(),
    ongoingDesc: document.getElementById('ongoingDesc').value.trim(),
    disclosures: document.getElementById('disclosures').value.trim().replace(/\[Firm Name\]/g, firmName)
  };
}

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ============================================================
// GENERATE PROPOSAL
// ============================================================
function generateProposal() {
  const d = collectFormData();
  const container = document.getElementById('proposal-content');
  let pages = [];
  let pageNum = 1;

  // ---- Cover ----
  pages.push(`
    <div class="page page-cover">
      <div class="cover-content">
        <div class="cover-label">Financial Planning Proposal</div>
        <div class="cover-title">Your Path to<br><strong>Financial Confidence</strong></div>
        <div class="cover-subtitle">A personalized financial plan designed for ${escapeHTML(d.clientDisplay)}</div>
        <div class="cover-divider"></div>
        <div class="cover-meta">
          Prepared by <span>${escapeHTML(d.advisorName)}</span>${d.advisorTitle ? ', ' + escapeHTML(d.advisorTitle) : ''}<br>
          ${d.proposalDate ? escapeHTML(d.proposalDate) : ''}
        </div>
      </div>
      <div class="cover-footer">
        <div class="firm-name">${escapeHTML(d.firmName)}</div>
        <div>${[d.advisorPhone, d.advisorEmail].filter(Boolean).map(escapeHTML).join(' &nbsp;|&nbsp; ')}</div>
      </div>
    </div>
  `);
  pageNum++;

  // ---- Table of Contents ----
  let tocItems = '';
  let tocNum = 1;
  d.categories.forEach(cat => {
    tocItems += `<li class="toc-item"><span class="toc-number">${tocNum}</span><span class="toc-label">${escapeHTML(cat.title)}</span><span class="toc-dots"></span></li>`;
    tocNum++;
  });
  tocItems += `
    <li class="toc-item"><span class="toc-number">${tocNum++}</span><span class="toc-label">Financial Blueprint Timeline</span><span class="toc-dots"></span></li>
    <li class="toc-item"><span class="toc-number">${tocNum++}</span><span class="toc-label">Why Now</span><span class="toc-dots"></span></li>
    <li class="toc-item"><span class="toc-number">${tocNum++}</span><span class="toc-label">Pricing &amp; Investment</span><span class="toc-dots"></span></li>
    <li class="toc-item"><span class="toc-number">${tocNum++}</span><span class="toc-label">Firm Disclosures</span><span class="toc-dots"></span></li>
  `;

  pages.push(innerPage(d, pageNum++, `
    <div class="pg-eyebrow">Your Comprehensive Plan</div>
    <div class="pg-title">What We Will Cover</div>
    <div class="pg-subtitle">Every area of your financial life, analyzed and optimized \u2014 delivered in a clear, actionable plan.</div>
    <ul class="toc-list">${tocItems}</ul>
  `));

  // ---- Category pages ----
  d.categories.forEach(cat => {
    const focusHTML = cat.focusAreas.map(f =>
      `<div class="focus-item"><div class="focus-bullet"></div><span>${escapeHTML(f)}</span></div>`
    ).join('');
    const delHTML = cat.deliverables.map(dl =>
      `<div class="deliverable-item"><span class="deliverable-check">\u2713</span><span>${escapeHTML(dl)}</span></div>`
    ).join('');

    pages.push(innerPage(d, pageNum++, `
      <div class="cat-icon-lg">${cat.icon}</div>
      <div class="pg-eyebrow">Planning Category</div>
      <div class="pg-title">${escapeHTML(cat.title)}</div>
      <div class="cat-description">${escapeHTML(cat.description)}</div>
      <div class="cat-focus-areas">
        <h4>Focus Areas</h4>
        <div class="focus-grid">${focusHTML}</div>
      </div>
      <div class="cat-deliverables">
        <h4>What You Will Receive</h4>
        <div class="deliverable-list">${delHTML}</div>
      </div>
    `));
  });

  // ---- Timeline ----
  const timelineRows = TIMELINE.map(t => `
    <tr class="${t.highlight ? 'timeline-row-highlight' : ''}">
      <td class="timeline-cell-week">${escapeHTML(t.week)}</td>
      <td class="timeline-cell-label">${escapeHTML(t.label)}</td>
      <td class="timeline-cell-desc">${escapeHTML(t.desc)}</td>
    </tr>
  `).join('');

  pages.push(innerPage(d, pageNum++, `
    <div class="pg-eyebrow">The Process</div>
    <div class="pg-title">Financial Blueprint Timeline</div>
    <div class="pg-subtitle">One-time planning engagement structured over 6 weeks, followed by a 30-day implementation check-in. Designed to give enough time for thoughtful analysis without letting the process drag.</div>

    <div class="timeline-callout">
      <strong>Included in the process:</strong> agreement + onboarding, discovery, analysis and strategy, blueprint presentation, written action plan, and a 30-day follow-up meeting.
    </div>

    <table class="timeline-table">
      <tbody>${timelineRows}</tbody>
    </table>

    <div class="timeline-note">
      <strong>Positioning note:</strong> The 6-week window is the planning phase. Account transfers or rollovers may continue after the Blueprint is delivered depending on paperwork, provider timelines, and client responsiveness.
    </div>
  `));

  // ---- Why Now ----
  pages.push(innerPage(d, pageNum++, `
    <div class="pg-eyebrow">The Cost of Waiting</div>
    <div class="pg-title">Why Now</div>
    <div class="pg-subtitle">Every month without a plan is a month of compounding cost. Here is what inaction really looks like.</div>

    <div class="why-now-hero">
      <h3>The greatest risk isn\u2019t making the <strong>wrong move</strong> \u2014<br>it\u2019s making <strong>no move at all</strong>.</h3>
      <p>Time is the most powerful force in financial planning. It works for you or against you.</p>
    </div>

    <div class="cost-grid">
      <div class="cost-card">
        <div class="cost-icon">\u23F3</div>
        <div class="cost-stat">$100K+</div>
        <div class="cost-label">Potential taxes overpaid over 10 years without proactive tax planning</div>
      </div>
      <div class="cost-card">
        <div class="cost-icon">\u{1F4C9}</div>
        <div class="cost-stat">$250K+</div>
        <div class="cost-label">Lost growth from 5 years of delayed or disorganized investing</div>
      </div>
      <div class="cost-card">
        <div class="cost-icon">\u26A0\uFE0F</div>
        <div class="cost-stat">40%</div>
        <div class="cost-label">Of families face an unplanned financial shock within 5 years</div>
      </div>
      <div class="cost-card">
        <div class="cost-icon">\u{1F4CB}</div>
        <div class="cost-stat">70%</div>
        <div class="cost-label">Of estate plans are outdated or missing critical documents</div>
      </div>
    </div>

    <div class="urgency-bar">
      <h4>Tax law changes are accelerating</h4>
      <p>Key provisions from the Tax Cuts and Jobs Act are set to sunset. Rates, deductions, and exemptions are shifting \u2014 and what works today may not work tomorrow. Planning now locks in current opportunities.</p>
    </div>

    <div class="urgency-bar">
      <h4>Markets don\u2019t wait for you to get organized</h4>
      <p>Whether markets go up or down, having a clear investment strategy means you capture opportunity and avoid panic-driven decisions. The cost of sitting in cash or the wrong allocation compounds quietly every month.</p>
    </div>

    <div class="urgency-bar">
      <h4>Life doesn\u2019t send a warning before it changes</h4>
      <p>Health events, job transitions, family changes \u2014 the best time to build your safety net is before you need it. A plan built under pressure is rarely as good as one built with intention.</p>
    </div>

    <div class="why-now-cta">
      <p>${escapeHTML(d.clientFirstNames)}, the best financial decision you can make today is to stop delaying the plan that will protect and grow everything you have worked for.</p>
    </div>
  `));

  // ---- Pricing ----
  const includeItems = d.pricingIncludes
    ? d.pricingIncludes.split('\n').filter(Boolean).map(line =>
        `<li><span class="includes-check">\u2713</span><span>${escapeHTML(line.trim())}</span></li>`
      ).join('')
    : '';

  let ongoingHTML = '';
  if (d.ongoingFee) {
    ongoingHTML = `
      <div class="ongoing-section">
        <h4>Ongoing Advisory Services</h4>
        <div class="ongoing-fee">${escapeHTML(d.ongoingFee)}</div>
        ${d.ongoingDesc ? `<div class="ongoing-desc">${escapeHTML(d.ongoingDesc)}</div>` : ''}
      </div>`;
  }

  pages.push(innerPage(d, pageNum++, `
    <div class="pg-eyebrow">Your Investment</div>
    <div class="pg-title">Pricing &amp; Investment</div>
    <div class="pg-subtitle">Transparent pricing for a plan built around your life \u2014 not a one-size-fits-all template.</div>

    <div class="pricing-card">
      <div class="pricing-label">Comprehensive Financial Plan</div>
      <div class="pricing-amount">${escapeHTML(d.planFee || 'Custom')}</div>
      <div class="pricing-tagline">One-time engagement fee</div>
    </div>

    ${includeItems ? `
      <h4 style="font-size:0.78rem;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;color:#0f2137;margin-bottom:12px;">What\u2019s Included</h4>
      <ul class="includes-list">${includeItems}</ul>
    ` : ''}

    ${ongoingHTML}
  `));

  // ---- Disclosures ----
  pages.push(innerPage(d, pageNum++, `
    <div class="pg-eyebrow">Important Information</div>
    <div class="pg-title">Firm Disclosures</div>
    <div class="disclosures-text">${escapeHTML(d.disclosures)}</div>
  `));

  // Inject into DOM
  container.innerHTML = pages.join('');

  // Update preview header
  document.getElementById('preview-title').textContent = `Proposal for ${d.clientDisplay}`;
  document.getElementById('preview-subtitle').textContent = `Prepared by ${d.advisorName} at ${d.firmName}`;

  // Show preview screen
  currentStep = STEPS.indexOf('preview');
  showScreen('screen-preview');
}

function innerPage(d, pageNum, content) {
  return `
    <div class="page">
      <div class="page-inner">
        <div class="page-header">
          <div class="header-firm">${escapeHTML(d.firmName)}</div>
          <div class="header-accent"></div>
        </div>
        ${content}
        <div class="page-footer">
          <span>Prepared for ${escapeHTML(d.clientDisplay)}</span>
          <span>Page ${pageNum}</span>
        </div>
      </div>
    </div>`;
}

// ============================================================
// PDF & PRINT
// ============================================================
function downloadPDF() {
  const element = document.getElementById('proposal-content');
  const d = collectFormData();
  const filename = 'Financial_Plan_Proposal_' + d.clientDisplay.replace(/[^a-zA-Z0-9]/g, '_') + '.pdf';

  const opt = {
    margin: 0,
    filename: filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, letterRendering: true },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
    pagebreak: { mode: ['css', 'legacy'], avoid: '.page' }
  };

  // Show loading on both PDF buttons
  const buttons = document.querySelectorAll('.preview-actions .btn-primary');
  buttons.forEach(b => { b.textContent = 'Generating PDF...'; b.disabled = true; });

  html2pdf().set(opt).from(element).save().then(() => {
    buttons.forEach(b => { b.textContent = 'Save as PDF'; b.disabled = false; });
  }).catch(() => {
    buttons.forEach(b => { b.textContent = 'Save as PDF'; b.disabled = false; });
    alert('PDF generation encountered an issue. Try Print > Save as PDF instead (Ctrl+P / Cmd+P).');
  });
}

function printProposal() {
  window.print();
}

// ============================================================
// INIT
// ============================================================
(function init() {
  setDefaultDates();
  renderCategoryCheckboxes();
})();
