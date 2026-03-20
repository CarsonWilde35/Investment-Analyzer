// ============================================================
// PROPOSAL APP — Form handling, proposal generation, PDF export
// ============================================================

// ---- Category metadata ----
const CATEGORY_META = {
  cashflow: {
    icon: '\u{1F4B0}',
    title: 'Cash Flow',
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
  tax: {
    icon: '\u{1F4CA}',
    title: 'Tax Strategy',
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
  investment: {
    icon: '\u{1F4C8}',
    title: 'Investment Strategy',
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
  retirement: {
    icon: '\u{1F3E0}',
    title: 'Retirement Planning',
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
  risk: {
    icon: '\u{1F6E1}\u{FE0F}',
    title: 'Risk Management',
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
  estate: {
    icon: '\u{1F3DB}\u{FE0F}',
    title: 'Estate Planning',
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
};

// ---- Timeline data (6 weeks) ----
const TIMELINE_DATA = [
  {
    week: 'Week 1',
    label: 'Discovery & Data Gathering',
    desc: 'Initial consultation to understand your goals, values, and concerns. We collect financial documents, account statements, and key information needed to build your plan.'
  },
  {
    week: 'Week 2',
    label: 'Analysis & Diagnostics',
    desc: 'Deep analysis of your current financial position across all planning categories. We identify gaps, opportunities, and areas requiring immediate attention.'
  },
  {
    week: 'Week 3',
    label: 'Strategy Development',
    desc: 'Build customized strategies for each planning area. Model scenarios, project outcomes, and develop actionable recommendations tailored to your specific situation.'
  },
  {
    week: 'Week 4',
    label: 'Plan Construction',
    desc: 'Compile all strategies into a comprehensive, written financial plan document with clear action items, timelines, and accountability milestones.'
  },
  {
    week: 'Week 5',
    label: 'Plan Presentation & Review',
    desc: 'Present the completed plan in a dedicated review meeting. Walk through every recommendation, answer questions, and refine priorities together.'
  },
  {
    week: 'Week 6',
    label: 'Implementation & Activation',
    desc: 'Begin executing the plan. Open or reallocate accounts, initiate insurance applications, coordinate with other professionals, and establish your ongoing review cadence.'
  }
];

// ---- Toggle couple fields ----
function toggleClientType() {
  const isCpl = document.getElementById('clientType').value === 'couple';
  document.querySelectorAll('.couple-field').forEach(el => {
    el.style.display = isCpl ? 'block' : 'none';
  });
}

// ---- Set default dates ----
(function setDefaultDates() {
  const today = new Date();
  const fmt = d => d.toISOString().split('T')[0];
  document.getElementById('proposalDate').value = fmt(today);
  const nextMon = new Date(today);
  nextMon.setDate(today.getDate() + ((8 - today.getDay()) % 7 || 7));
  document.getElementById('startDate').value = fmt(nextMon);
})();

// ---- Collect form data ----
function getFormData() {
  const isCpl = document.getElementById('clientType').value === 'couple';
  const client1 = document.getElementById('client1Name').value.trim();
  const client2 = document.getElementById('client2Name').value.trim();
  const clientDisplay = isCpl && client2 ? `${client1} & ${client2}` : client1;
  const clientFirstNames = isCpl && client2
    ? `${client1.split(' ')[0]} & ${client2.split(' ')[0]}`
    : client1.split(' ')[0];

  // Active categories
  const categories = [];
  document.querySelectorAll('[data-cat]').forEach(cb => {
    if (cb.checked) {
      const key = cb.getAttribute('data-cat');
      const descEl = document.querySelector(`[data-cat-desc="${key}"]`);
      categories.push({
        key,
        description: descEl ? descEl.value.trim() : ''
      });
    }
  });

  const proposalDate = document.getElementById('proposalDate').value;
  const startDate = document.getElementById('startDate').value;

  return {
    clientType: document.getElementById('clientType').value,
    clientDisplay,
    clientFirstNames,
    advisorName: document.getElementById('advisorName').value.trim(),
    firmName: document.getElementById('firmName').value.trim(),
    advisorTitle: document.getElementById('advisorTitle').value.trim(),
    advisorPhone: document.getElementById('advisorPhone').value.trim(),
    advisorEmail: document.getElementById('advisorEmail').value.trim(),
    advisorWebsite: document.getElementById('advisorWebsite').value.trim(),
    proposalDate: proposalDate ? formatDate(proposalDate) : '',
    startDate: startDate ? formatDate(startDate) : '',
    categories,
    planFee: document.getElementById('planFee').value.trim(),
    pricingIncludes: document.getElementById('pricingIncludes').value.trim(),
    ongoingFee: document.getElementById('ongoingFee').value.trim(),
    ongoingDesc: document.getElementById('ongoingDesc').value.trim(),
    disclosures: document.getElementById('disclosures').value.trim()
  };
}

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

// ---- Build proposal HTML ----
function generateProposal() {
  const d = getFormData();
  if (!d.clientDisplay || !d.advisorName || !d.firmName) {
    alert('Please fill in at least the client name, advisor name, and firm name.');
    return;
  }
  if (d.categories.length === 0) {
    alert('Please select at least one planning category.');
    return;
  }

  const container = document.getElementById('proposal-content');
  let pages = [];
  let pageNum = 1;

  // ---- Page 1: Cover ----
  pages.push(`
    <div class="page page-cover">
      <div class="cover-content">
        <div class="cover-label">Financial Planning Proposal</div>
        <div class="cover-title">Your Path to<br><strong>Financial Confidence</strong></div>
        <div class="cover-subtitle">A personalized financial plan designed for ${d.clientDisplay}</div>
        <div class="cover-divider"></div>
        <div class="cover-meta">
          Prepared by <span>${d.advisorName}</span>${d.advisorTitle ? ', ' + d.advisorTitle : ''}<br>
          ${d.proposalDate ? d.proposalDate : ''}
        </div>
      </div>
      <div class="cover-footer">
        <div class="firm-name">${d.firmName}</div>
        <div>${[d.advisorPhone, d.advisorEmail].filter(Boolean).join(' &nbsp;|&nbsp; ')}</div>
      </div>
    </div>
  `);
  pageNum++;

  // ---- Page 2: Table of Contents ----
  let tocItems = '';
  let tocNum = 1;
  d.categories.forEach(cat => {
    const meta = CATEGORY_META[cat.key];
    tocItems += `
      <li class="toc-item">
        <span class="toc-number">${tocNum}</span>
        <span class="toc-label">${meta.title}</span>
        <span class="toc-dots"></span>
      </li>`;
    tocNum++;
  });
  tocItems += `
    <li class="toc-item">
      <span class="toc-number">${tocNum++}</span>
      <span class="toc-label">Your 6-Week Timeline</span>
      <span class="toc-dots"></span>
    </li>
    <li class="toc-item">
      <span class="toc-number">${tocNum++}</span>
      <span class="toc-label">Why Now</span>
      <span class="toc-dots"></span>
    </li>
    <li class="toc-item">
      <span class="toc-number">${tocNum++}</span>
      <span class="toc-label">Pricing & Investment</span>
      <span class="toc-dots"></span>
    </li>
    <li class="toc-item">
      <span class="toc-number">${tocNum++}</span>
      <span class="toc-label">Firm Disclosures</span>
      <span class="toc-dots"></span>
    </li>`;

  pages.push(buildInnerPage(d, pageNum++, 'What We Will Cover', `
    <div class="section-eyebrow">Your Comprehensive Plan</div>
    <div class="section-title">What We Will Cover</div>
    <div class="section-subtitle">Every area of your financial life, analyzed and optimized — delivered in a clear, actionable plan.</div>
    <ul class="toc-list">${tocItems}</ul>
  `));

  // ---- Category pages ----
  d.categories.forEach(cat => {
    const meta = CATEGORY_META[cat.key];
    const focusHTML = meta.focusAreas.map(f =>
      `<div class="focus-item"><div class="focus-bullet"></div><span>${f}</span></div>`
    ).join('');
    const delHTML = meta.deliverables.map(dl =>
      `<div class="deliverable-item"><span class="deliverable-check">\u2713</span><span>${dl}</span></div>`
    ).join('');

    pages.push(buildInnerPage(d, pageNum++, meta.title, `
      <div class="cat-icon">${meta.icon}</div>
      <div class="section-eyebrow">Planning Category</div>
      <div class="section-title">${meta.title}</div>
      <div class="cat-description">${cat.description || meta.title + ' analysis and recommendations.'}</div>
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

  // ---- Timeline page ----
  const timelineHTML = TIMELINE_DATA.map((t, i) => `
    <div class="timeline-item">
      <div class="timeline-dot">${i + 1}</div>
      <div class="timeline-week">${t.week}</div>
      <div class="timeline-label">${t.label}</div>
      <div class="timeline-desc">${t.desc}</div>
    </div>
  `).join('');

  pages.push(buildInnerPage(d, pageNum++, 'Timeline', `
    <div class="section-eyebrow">The Process</div>
    <div class="section-title">Your 6-Week Timeline</div>
    <div class="section-subtitle">A structured, efficient process — from our first conversation to an actionable plan you can begin implementing immediately.</div>
    <div class="timeline">${timelineHTML}</div>
  `));

  // ---- Why Now page ----
  pages.push(buildInnerPage(d, pageNum++, 'Why Now', `
    <div class="section-eyebrow">The Cost of Waiting</div>
    <div class="section-title">Why Now</div>
    <div class="section-subtitle">Every month without a plan is a month of compounding cost. Here is what inaction really looks like.</div>

    <div class="why-now-hero">
      <h3>The greatest risk isn't making the <strong>wrong move</strong> —<br>it's making <strong>no move at all</strong>.</h3>
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
        <div class="cost-icon">\u26A0\u{FE0F}</div>
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
      <p>Key provisions from the Tax Cuts and Jobs Act are set to sunset. Rates, deductions, and exemptions are shifting — and what works today may not work tomorrow. Planning now locks in current opportunities.</p>
    </div>

    <div class="urgency-bar">
      <h4>Markets don't wait for you to get organized</h4>
      <p>Whether markets go up or down, having a clear investment strategy means you capture opportunity and avoid panic-driven decisions. The cost of sitting in cash or the wrong allocation compounds quietly every month.</p>
    </div>

    <div class="urgency-bar">
      <h4>Life doesn't send a warning before it changes</h4>
      <p>Health events, job transitions, family changes — the best time to build your safety net is before you need it. A plan built under pressure is rarely as good as one built with intention.</p>
    </div>

    <div class="why-now-cta">
      <p>${d.clientFirstNames}, the best financial decision you can make today is to stop delaying the plan that will protect and grow everything you have worked for.</p>
    </div>
  `));

  // ---- Pricing page ----
  const includeItems = d.pricingIncludes
    ? d.pricingIncludes.split('\n').filter(Boolean).map(line =>
        `<li><span class="includes-check">\u2713</span><span>${line.trim()}</span></li>`
      ).join('')
    : '';

  let ongoingHTML = '';
  if (d.ongoingFee) {
    ongoingHTML = `
      <div class="ongoing-section">
        <h4>Ongoing Advisory Services</h4>
        <div class="ongoing-fee">${d.ongoingFee}</div>
        ${d.ongoingDesc ? `<div class="ongoing-desc">${d.ongoingDesc}</div>` : ''}
      </div>`;
  }

  pages.push(buildInnerPage(d, pageNum++, 'Pricing', `
    <div class="section-eyebrow">Your Investment</div>
    <div class="section-title">Pricing & Investment</div>
    <div class="section-subtitle">Transparent pricing for a plan built around your life — not a one-size-fits-all template.</div>

    <div class="pricing-card">
      <div class="pricing-label">Comprehensive Financial Plan</div>
      <div class="pricing-amount">${d.planFee || 'Custom'}</div>
      <div class="pricing-tagline">One-time engagement fee</div>
    </div>

    ${includeItems ? `
      <h4 style="font-size:0.78rem;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;color:#0f2137;margin-bottom:12px;">What's Included</h4>
      <ul class="includes-list">${includeItems}</ul>
    ` : ''}

    ${ongoingHTML}
  `));

  // ---- Disclosures page ----
  const disclosureText = d.disclosures.replace(/\[Firm Name\]/g, d.firmName);
  pages.push(buildInnerPage(d, pageNum++, 'Disclosures', `
    <div class="section-eyebrow">Important Information</div>
    <div class="section-title">Firm Disclosures</div>
    <div class="disclosures-text">${escapeHTML(disclosureText)}</div>
  `));

  container.innerHTML = pages.join('');
  document.getElementById('editor-panel').style.display = 'none';
  document.getElementById('proposal-preview').style.display = 'block';
  window.scrollTo({ top: 0 });
}

function buildInnerPage(d, pageNum, pageTitle, content) {
  return `
    <div class="page">
      <div class="page-inner">
        <div class="page-header">
          <div class="header-firm">${d.firmName}</div>
          <div class="header-accent"></div>
        </div>
        ${content}
        <div class="page-footer">
          <span>Prepared for ${d.clientDisplay}</span>
          <span>Page ${pageNum}</span>
        </div>
      </div>
    </div>`;
}

function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ---- PDF Export ----
function downloadPDF() {
  const element = document.getElementById('proposal-content');
  const d = getFormData();
  const filename = `Financial_Plan_Proposal_${d.clientDisplay.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;

  const opt = {
    margin: 0,
    filename: filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      letterRendering: true
    },
    jsPDF: {
      unit: 'in',
      format: 'letter',
      orientation: 'portrait'
    },
    pagebreak: { mode: ['css', 'legacy'], avoid: '.page' }
  };

  // Show a brief loading state
  const btn = document.querySelector('.preview-toolbar button');
  const originalText = btn.textContent;
  btn.textContent = 'Generating PDF...';
  btn.disabled = true;

  html2pdf().set(opt).from(element).save().then(() => {
    btn.textContent = originalText;
    btn.disabled = false;
  }).catch(() => {
    btn.textContent = originalText;
    btn.disabled = false;
    alert('PDF generation encountered an issue. Try using your browser\'s Print > Save as PDF instead (Ctrl+P / Cmd+P).');
  });
}

// ---- Navigation ----
function backToEditor() {
  document.getElementById('proposal-preview').style.display = 'none';
  document.getElementById('editor-panel').style.display = 'block';
  window.scrollTo({ top: 0 });
}
