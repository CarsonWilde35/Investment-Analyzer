// ============================================================
// DATA — Profile questions, scored sections, and recommendations
// ============================================================

const PROFILE_QUESTIONS = [
  {
    id: 'age',
    label: 'What is your age range?',
    options: [
      { value: 'under35', text: 'Under 35' },
      { value: '35-44', text: '35\u201344' },
      { value: '45-54', text: '45\u201354' },
      { value: '55-64', text: '55\u201364' },
      { value: '65+', text: '65+' }
    ]
  },
  {
    id: 'marital',
    label: 'What is your marital status?',
    options: [
      { value: 'single', text: 'Single' },
      { value: 'married', text: 'Married / Partnered' },
      { value: 'divorced', text: 'Divorced / Widowed' }
    ]
  },
  {
    id: 'dependents',
    label: 'Do you have children or dependents?',
    options: [
      { value: 'no', text: 'No' },
      { value: 'yes', text: 'Yes' }
    ]
  },
  {
    id: 'businessType',
    label: 'What best describes your business?',
    options: [
      { value: 'solo', text: 'Solo / Self-employed' },
      { value: 'small', text: 'Small business with team' },
      { value: 'practice', text: 'Professional practice' },
      { value: 'partnership', text: 'Partnership / Multi-owner business' }
    ]
  },
  {
    id: 'employees',
    label: 'How many employees do you have?',
    options: [
      { value: '0', text: '0' },
      { value: '1-5', text: '1\u20135' },
      { value: '6-20', text: '6\u201320' },
      { value: '21+', text: '21+' }
    ]
  },
  {
    id: 'revenue',
    label: 'What is your approximate annual business revenue?',
    options: [
      { value: 'under250k', text: 'Under $250k' },
      { value: '250k-500k', text: '$250k\u2013$500k' },
      { value: '500k-1m', text: '$500k\u2013$1M' },
      { value: '1m-3m', text: '$1M\u2013$3M' },
      { value: '3m+', text: '$3M+' }
    ]
  },
  {
    id: 'profit',
    label: 'Approximate annual business profit or owner earnings?',
    options: [
      { value: 'under100k', text: 'Under $100k' },
      { value: '100k-250k', text: '$100k\u2013$250k' },
      { value: '250k-500k', text: '$250k\u2013$500k' },
      { value: '500k+', text: '$500k+' }
    ]
  },
  {
    id: 'yearsToExit',
    label: 'How many years until your desired retirement or exit?',
    options: [
      { value: '20+', text: '20+' },
      { value: '10-19', text: '10\u201319' },
      { value: '5-9', text: '5\u20139' },
      { value: '0-4', text: '0\u20134' },
      { value: 'unsure', text: 'Not sure' }
    ]
  }
];

const SECTIONS = [
  {
    key: 'income',
    title: 'Income Efficiency',
    weight: 12,
    questions: [
      {
        id: 'q1',
        label: 'How consistently does your business produce income for you personally?',
        options: [
          { text: 'Consistent salary/distributions with predictable surplus', score: 1.00 },
          { text: 'Mostly consistent, with some variability', score: 0.75 },
          { text: 'Inconsistent and reactive', score: 0.40 },
          { text: 'I often do not know what I can safely take', score: 0.00 }
        ]
      },
      {
        id: 'q2',
        label: 'How well do you understand your business profitability?',
        options: [
          { text: 'I know my margins/profit clearly and review them regularly', score: 1.00 },
          { text: 'I have a decent sense, but do not review consistently', score: 0.75 },
          { text: 'I only know roughly', score: 0.40 },
          { text: 'I am not confident in my true profitability', score: 0.00 }
        ]
      },
      {
        id: 'q3',
        label: 'How intentional is your owner pay strategy?',
        options: [
          { text: 'My compensation is planned and tied to business performance', score: 1.00 },
          { text: 'Somewhat planned, but not very structured', score: 0.75 },
          { text: 'Mostly ad hoc draws/distributions', score: 0.40 },
          { text: 'No clear strategy', score: 0.00 }
        ]
      }
    ]
  },
  {
    key: 'tax',
    title: 'Tax Efficiency',
    weight: 16,
    questions: [
      {
        id: 'q4',
        label: 'How proactive is your tax planning?',
        options: [
          { text: 'I actively plan before year-end with a CPA/advisor', score: 1.00 },
          { text: 'I do some planning, but not consistently', score: 0.75 },
          { text: 'I mostly react at tax time', score: 0.40 },
          { text: 'No real tax planning', score: 0.00 }
        ]
      },
      {
        id: 'q5',
        label: 'How optimized is your business/pay structure for taxes?',
        options: [
          { text: 'Well-structured and reviewed periodically', score: 1.00 },
          { text: 'Probably decent, but not recently reviewed', score: 0.75 },
          { text: 'Unsure whether my structure is optimal', score: 0.40 },
          { text: 'Not optimized or never reviewed', score: 0.00 }
        ]
      },
      {
        id: 'q6',
        label: 'Are you using tax-advantaged savings strategies available to you?',
        options: [
          { text: 'Yes, consistently', score: 1.00 },
          { text: 'Somewhat', score: 0.75 },
          { text: 'Very little', score: 0.40 },
          { text: 'No', score: 0.00 }
        ]
      }
    ]
  },
  {
    key: 'cashflow',
    title: 'Cash Flow & Reserves',
    weight: 14,
    questions: [
      {
        id: 'q7',
        label: 'How many months of personal living expenses do you keep liquid?',
        options: [
          { text: '6+ months', score: 1.00 },
          { text: '3\u20135 months', score: 0.75 },
          { text: '1\u20132 months', score: 0.40 },
          { text: 'Less than 1 month', score: 0.00 }
        ]
      },
      {
        id: 'q8',
        label: 'How many months of business operating expenses do you keep liquid?',
        options: [
          { text: '3+ months', score: 1.00 },
          { text: '1\u20132 months', score: 0.75 },
          { text: 'Less than 1 month', score: 0.40 },
          { text: 'No meaningful reserve', score: 0.00 }
        ]
      },
      {
        id: 'q9',
        label: 'How controlled is your overall cash flow?',
        options: [
          { text: 'I save/invest systematically and rarely feel cash pressure', score: 1.00 },
          { text: 'Usually under control, but occasional stress', score: 0.75 },
          { text: 'Often tight or reactive', score: 0.40 },
          { text: 'Frequently stressed / unclear', score: 0.00 }
        ]
      }
    ]
  },
  {
    key: 'risk',
    title: 'Risk Protection',
    weight: 10,
    questions: [
      {
        id: 'q10',
        label: 'How confident are you that your insurance/risk protection is appropriate?',
        options: [
          { text: 'Strong and reviewed periodically', score: 1.00 },
          { text: 'Mostly in place', score: 0.75 },
          { text: 'Some gaps likely', score: 0.40 },
          { text: 'Significant gaps / unsure', score: 0.00 }
        ]
      },
      {
        id: 'q11',
        label: 'If you could not work for 6\u201312 months, how resilient would your plan be?',
        options: [
          { text: 'We would be well protected', score: 1.00 },
          { text: 'We would manage, but it would hurt', score: 0.75 },
          { text: 'It would be a major problem', score: 0.40 },
          { text: 'It would be financially damaging', score: 0.00 }
        ]
      },
      {
        id: 'q12',
        label: 'How protected are you from major personal or business risks?',
        options: [
          { text: 'Well protected with intentional planning', score: 1.00 },
          { text: 'Moderately protected', score: 0.75 },
          { text: 'Underprotected in some areas', score: 0.40 },
          { text: 'Mostly unprotected / unsure', score: 0.00 }
        ]
      }
    ]
  },
  {
    key: 'retirement',
    title: 'Retirement & Investing',
    weight: 16,
    questions: [
      {
        id: 'q13',
        label: 'How consistently do you invest for long-term wealth?',
        options: [
          { text: 'Systematically and intentionally', score: 1.00 },
          { text: 'Fairly consistently', score: 0.75 },
          { text: 'Irregularly', score: 0.40 },
          { text: 'Rarely / not at all', score: 0.00 }
        ]
      },
      {
        id: 'q14',
        label: 'How well are your investment accounts and retirement vehicles optimized?',
        options: [
          { text: 'Well coordinated and aligned with goals', score: 1.00 },
          { text: 'Mostly okay, but could improve', score: 0.75 },
          { text: 'Fragmented / somewhat inefficient', score: 0.40 },
          { text: 'Little coordination / unsure', score: 0.00 }
        ]
      },
      {
        id: 'q15',
        label: 'How diversified and intentional is your investment approach?',
        options: [
          { text: 'Clear strategy, diversified, goal-based', score: 1.00 },
          { text: 'Some strategy, decent diversification', score: 0.75 },
          { text: 'Mostly scattered or reactive', score: 0.40 },
          { text: 'No real strategy', score: 0.00 }
        ]
      }
    ]
  },
  {
    key: 'exit',
    title: 'Business Value & Exit Readiness',
    weight: 12,
    questions: [
      {
        id: 'q16',
        label: 'Is your business becoming more valuable beyond your own labor?',
        options: [
          { text: 'Yes, clearly', score: 1.00 },
          { text: 'Somewhat', score: 0.75 },
          { text: 'Not much', score: 0.40 },
          { text: 'It mostly depends on me personally', score: 0.00 }
        ]
      },
      {
        id: 'q17',
        label: 'How prepared are you for an eventual exit, sale, or succession?',
        options: [
          { text: 'Clear plan', score: 1.00 },
          { text: 'Some early planning', score: 0.75 },
          { text: 'Very little planning', score: 0.40 },
          { text: 'No plan', score: 0.00 }
        ]
      },
      {
        id: 'q18',
        label: 'If you stepped away for 60 days, what would happen?',
        options: [
          { text: 'Business would continue fairly well', score: 1.00 },
          { text: 'It would struggle but continue', score: 0.75 },
          { text: 'It would seriously weaken', score: 0.40 },
          { text: 'It would mostly stop', score: 0.00 }
        ]
      }
    ]
  },
  {
    key: 'wealth',
    title: 'Personal Wealth Architecture',
    weight: 10,
    questions: [
      {
        id: 'q19',
        label: 'How well do your business and personal finances work together as one strategy?',
        options: [
          { text: 'Fully coordinated', score: 1.00 },
          { text: 'Mostly coordinated', score: 0.75 },
          { text: 'Somewhat disconnected', score: 0.40 },
          { text: 'Very fragmented', score: 0.00 }
        ]
      },
      {
        id: 'q20',
        label: 'How clearly do you track your overall household net worth and progress?',
        options: [
          { text: 'Very clearly and reviewed regularly', score: 1.00 },
          { text: 'Fairly clearly', score: 0.75 },
          { text: 'Roughly', score: 0.40 },
          { text: 'I do not track it well', score: 0.00 }
        ]
      },
      {
        id: 'q21',
        label: 'How aligned are your personal goals, family goals, and financial systems?',
        options: [
          { text: 'Highly aligned', score: 1.00 },
          { text: 'Mostly aligned', score: 0.75 },
          { text: 'Some gaps/confusion', score: 0.40 },
          { text: 'Not clearly aligned', score: 0.00 }
        ]
      }
    ]
  },
  {
    key: 'estate',
    title: 'Estate & Strategic Discipline',
    weight: 10,
    questions: [
      {
        id: 'q22',
        label: 'How current is your estate/beneficiary planning?',
        options: [
          { text: 'Fully current and intentional', score: 1.00 },
          { text: 'Mostly current', score: 0.75 },
          { text: 'Outdated or incomplete', score: 0.40 },
          { text: 'Not really in place', score: 0.00 }
        ]
      },
      {
        id: 'q23',
        label: 'How regularly do you review your financial strategy as an owner?',
        options: [
          { text: 'At least quarterly with structure', score: 1.00 },
          { text: 'A few times per year', score: 0.75 },
          { text: 'Occasionally', score: 0.40 },
          { text: 'Rarely / reactively', score: 0.00 }
        ]
      },
      {
        id: 'q24',
        label: 'How clear are your top financial priorities for the next 12 months?',
        options: [
          { text: 'Extremely clear', score: 1.00 },
          { text: 'Fairly clear', score: 0.75 },
          { text: 'Somewhat unclear', score: 0.40 },
          { text: 'Very unclear', score: 0.00 }
        ]
      }
    ]
  }
];

// Recommendation actions mapped by section key
const RECOMMENDATIONS = {
  income: {
    label: 'Strengthen Income Consistency',
    actions: [
      'Define a predictable owner compensation structure tied to business performance',
      'Build a profit review cadence (monthly or quarterly) to track real margins',
      'Separate business reinvestment from personal draw strategy'
    ]
  },
  tax: {
    label: 'Improve Tax Efficiency',
    actions: [
      'Review entity structure and owner compensation strategy with your CPA',
      'Coordinate tax planning before year-end rather than at filing time',
      'Evaluate tax-advantaged savings opportunities you may be missing'
    ]
  },
  cashflow: {
    label: 'Build Cash Reserves & Flow Control',
    actions: [
      'Build personal liquidity to cover at least 3\u20136 months of living expenses',
      'Establish a dedicated business operating reserve',
      'Separate tax reserves from spending cash to avoid surprises'
    ]
  },
  risk: {
    label: 'Close Protection Gaps',
    actions: [
      'Audit current insurance coverage for known gaps',
      'Ensure disability and key-person risks are addressed',
      'Stress-test your plan against a 6\u201312 month inability to work'
    ]
  },
  retirement: {
    label: 'Systematize Investing',
    actions: [
      'Create a systematic, recurring investing process',
      'Coordinate retirement accounts with taxable investing for efficiency',
      'Align investments with long-term goals instead of ad hoc decisions'
    ]
  },
  exit: {
    label: 'Develop Exit Readiness',
    actions: [
      'Identify how dependent the business is on you personally',
      'Improve transferability and operating independence',
      'Define a 3\u2013 to 10\u2013year exit direction, even if approximate'
    ]
  },
  wealth: {
    label: 'Unify Your Wealth Architecture',
    actions: [
      'Map all personal and business accounts into one net-worth view',
      'Align personal goals with financial structure and accounts',
      'Ensure business and personal strategies reinforce each other'
    ]
  },
  estate: {
    label: 'Strengthen Strategic Discipline',
    actions: [
      'Update or create estate basics (will, trust, beneficiary designations)',
      'Review beneficiaries and titling across all accounts',
      'Set quarterly financial strategy reviews on your calendar'
    ]
  }
};

// Strength descriptions (used when a section scores well)
const STRENGTH_DESCRIPTIONS = {
  income: 'Strong income consistency and business profitability awareness',
  tax: 'Proactive and well-structured tax planning',
  cashflow: 'Solid cash reserves and disciplined cash flow management',
  risk: 'Well-protected against personal and business risks',
  retirement: 'Strong long-term investing habits and retirement planning',
  exit: 'Good business value-building and exit readiness',
  wealth: 'Well-coordinated personal wealth architecture',
  estate: 'Current estate planning and disciplined financial reviews'
};

// Leak descriptions (used when a section scores poorly)
const LEAK_DESCRIPTIONS = {
  income: 'Income from the business is inconsistent or unstructured',
  tax: 'Tax planning is more reactive than proactive',
  cashflow: 'Liquidity reserves are thinner than ideal',
  risk: 'Protection against major risks has notable gaps',
  retirement: 'Investing for long-term wealth is inconsistent or uncoordinated',
  exit: 'Exit readiness is underdeveloped',
  wealth: 'Business and personal finances are not well coordinated',
  estate: 'Estate planning or strategic review discipline is lacking'
};
