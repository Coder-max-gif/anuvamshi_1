/* Generates the 7 subpages (CFA, investors, founders) into the site root. Edit content here, then run: node tools/build-pages.cjs */
const fs = require("fs");
const path = require("path");
const OUT = path.join(__dirname, "..") + "/"; // writes the subpages into the site root
const DM = "https://ig.me/m/anuvamshishetty";               // Instagram DM: booking / enquiries
const WA = "https://chat.whatsapp.com/GbIZ8FGaUT43KHjmvSTVZl"; // CFA study group (from Instagram bio)
const IG = "https://www.instagram.com/anuvamshishetty/";
const LI = "https://in.linkedin.com/in/anuvamshi-shetty-354aa7113";

const alphaSvg = `<svg class="s-alpha" viewBox="0 0 140 100" aria-hidden="true"><path pathLength="1" d="M128 14 C 104 30, 92 86, 56 86 C 30 86, 14 70, 14 50 C 14 30, 30 14, 54 14 C 92 14, 104 70, 130 88"/><path pathLength="1" d="M131 18 C 107 34, 95 90, 57 90 C 27 90, 10 72, 10 50 C 10 28, 27 10, 54 10 C 95 10, 108 66, 134 84"/></svg>`;
const back = (href, label) => `<a class="back" href="${href}"><span aria-hidden="true">←</span>${label}</a>`;
const next = (href, k, title) => `<section class="next" aria-label="Next page"><a href="${href}"><span class="nx-k">${k}</span><span class="nx-title">${title}</span><span class="nx-arr" aria-hidden="true">→</span></a></section>`;
const book = (label = "Book via Instagram DM") => `<a class="btn" href="${DM}" target="_blank" rel="noopener">${label} <span class="arr" aria-hidden="true">→</span></a>`;

const shell = ({ file, title, desc, main, disclaimer = "" }) => `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title} | Anuvamshi Shetty</title>
  <meta name="description" content="${desc}" />
  <meta name="theme-color" content="#0b1d3a" />
  <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%230b1d3a'/%3E%3Ctext x='50%25' y='54%25' text-anchor='middle' dominant-baseline='middle' font-family='Georgia,serif' font-style='italic' font-size='44' fill='white'%3E%CE%B1%3C/text%3E%3C/svg%3E" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@300;400;500&family=Instrument+Serif:ital@1&family=JetBrains+Mono:wght@400&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="styles.css" />
  <link rel="stylesheet" href="effects.css" />
  <link rel="stylesheet" href="sub.css" />
</head>
<body class="sub">
  <a class="skip" href="#main">Skip to content</a>
  <div class="grain" aria-hidden="true"></div>
  <header class="site-header" data-theme="light">
    <a class="brand" href="index.html" aria-label="Alpha, home">
      <span class="brand-full brand-alpha" aria-hidden="true">α</span>
      <span class="brand-mono brand-alpha" aria-hidden="true">α</span>
    </a>
    <button class="menu-toggle" aria-expanded="false" aria-controls="primary-nav"><span class="sr-only">Menu</span><span class="bars" aria-hidden="true"></span></button>
    <nav id="primary-nav" aria-label="Primary">
      <ul>
        <li><a href="index.html#cfa">CFA</a></li>
        <li><a href="index.html#investors">Investors</a></li>
        <li><a href="index.html#founders">Founders</a></li>
      </ul>
    </nav>
  </header>
  <main id="main">
${main}
  </main>
  <footer class="site-footer">
    <span class="brand-full brand-alpha" aria-label="Alpha">α</span>
    <ul class="social">
      <li><a href="${IG}" aria-label="Instagram"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 7.3a4.7 4.7 0 1 0 0 9.4 4.7 4.7 0 0 0 0-9.4zm0 7.7a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm6-7.9a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0zM12 3c-2.4 0-2.7 0-3.7.1-3.3.1-4.9 1.7-5 5C3 9.1 3 9.6 3 12s0 2.7.1 3.7c.1 3.3 1.7 4.9 5 5 1 .1 1.3.1 3.9.1s2.7 0 3.7-.1c3.3-.1 4.9-1.7 5-5 .1-1 .1-1.3.1-3.7s0-2.7-.1-3.7c-.1-3.3-1.7-4.9-5-5C14.7 3 14.4 3 12 3zm0 1.6c2.4 0 2.6 0 3.6.1 2.4.1 3.5 1.2 3.6 3.6.1.9.1 1.2.1 3.6s0 2.7-.1 3.6c-.1 2.4-1.2 3.5-3.6 3.6-1 .1-1.2.1-3.6.1s-2.6 0-3.6-.1c-2.4-.1-3.5-1.2-3.6-3.6-.1-.9-.1-1.2-.1-3.6s0-2.7.1-3.6c.1-2.4 1.2-3.5 3.6-3.6.9-.1 1.2-.1 3.6-.1z"/></svg></a></li>
      <li><a href="${LI}" aria-label="LinkedIn"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.1c.5-1 1.8-2 3.7-2 4 0 4.7 2.6 4.7 6V21h-4v-5.6c0-1.3 0-3-1.9-3s-2.1 1.4-2.1 2.9V21H9z"/></svg></a></li>
    </ul>
    <ul class="foot-links"><li><a href="index.html#cfa">CFA</a></li><li><a href="index.html#investors">Investors</a></li><li><a href="index.html#founders">Founders</a></li></ul>
    <p class="disclaimer">${disclaimer || "Educational content only, not investment advice."} CFA® and Chartered Financial Analyst® are registered trademarks owned by CFA Institute.</p>
  </footer>
  <script src="https://unpkg.com/lenis@1.1.13/dist/lenis.min.js"></script>
  <script type="module" src="sub.js"></script>
  <script type="module" src="transitions.js"></script>
</body>
</html>
`;


/* ---------- Instagram thumbnail strip ----------
   Images live in assets/ig/<page>-1.jpg ... -4.jpg (square or 4:5).
   Missing files are hidden automatically by sub.js, so the strip only shows what exists.
   To link a tile to a specific post, put the post URL in IG_POSTS[page][i]. */
const IG_CAPS = {
  "cfa-courses": ["CFA study routine", "Level by level", "Exam-day mindset", "Study group sessions"],
  "cfa-notes": ["Notes that stick", "Formula sheets", "Revision days", "The study group"],
  "cfa-sessions": ["1-on-1 sessions", "Modeling in Excel", "Mock reviews", "Career questions"],
  "newsletter": ["Market thoughts", "Investing frameworks", "Behaviour & money", "Reading list"],
  "personal-finance": ["Money basics", "Saving habits", "Planning goals", "Ask me anything"],
  "financial-models": ["Inside a model", "Valuation 101", "Excel tips", "Building a DCF"],
  "founders-website": ["Founder life", "The Lighthouse Capital", "Behind the build", "On stage at TEDx"],
};
const IG_POSTS = {};
const igStrip = (page) => `
    <section class="ig light" data-ig>
      <div class="wrap">
        <div class="sec-head"><h2 class="h2">On <em>Instagram.</em></h2><a class="ig-handle" href="${IG}" target="_blank" rel="noopener">@anuvamshishetty <span aria-hidden="true">↗</span></a></div>
        <ul class="ig-grid">${(IG_CAPS[page] || []).map((cap, i) => `
          <li><a class="ig-tile" href="${(IG_POSTS[page] || [])[i] || IG}" target="_blank" rel="noopener"><img src="assets/ig/${page}-${i + 1}.jpg" alt="${cap}, from Instagram" loading="lazy" decoding="async" /><span class="ig-cap"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zm5 5a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm5.2-1.6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/></svg>${cap}</span></a></li>`).join("")}
        </ul>
      </div>
    </section>`;

const pages = [];

/* =============== 1. CFA: Explore courses =============== */
const lvl = (id, name, sel, h, p1, p2, chips) => `
        <div class="panel${sel ? " enter" : ""}" id="p-${id}" role="tabpanel" aria-labelledby="t-${id}"${sel ? "" : " hidden"}>
          <div><h3>${h}</h3><p>${p1}</p><p>${p2}</p></div>
          <ul class="chips">${chips.map((c, i) => `<li><b>${String(i + 1).padStart(2, "0")}</b>${c}</li>`).join("")}</ul>
        </div>`;
const core = ["Ethical &amp; Professional Standards", "Quantitative Methods", "Economics", "Financial Statement Analysis", "Corporate Issuers", "Equity Investments", "Fixed Income", "Derivatives", "Alternative Investments", "Portfolio Management"];
pages.push({ file: "cfa-courses.html", title: "Explore CFA courses", desc: "Structured CFA prep for Level I, II and III by Anuvamshi Shetty.", main: `
    <section class="s-hero light">
      ${alphaSvg}
      <div class="wrap">
        ${back("index.html#cfa", "For CFA candidates")}
        <p class="kicker">01 · For CFA candidates</p>
        <h1 class="s-title">Every level, <em>mapped.</em></h1>
        <p class="lede">A clear route through the CFA Program, from your first Ethics reading to your Level III essays. Pick your level to see what we cover.</p>
        <div class="s-hero-foot"><ul class="s-meta"><li>Level I</li><li>Level II</li><li>Level III</li></ul>${book("Join the next batch")}</div>
      </div>
    </section>
    <div class="marquee light" aria-hidden="true"><div class="marquee-track"><span>Ethics <i>α</i> Quant <i>σ</i> FSA <i>Σ</i> Fixed Income <i>θ</i> Derivatives <i>Δ</i> Equity <i>β</i> Portfolio <i>γ</i></span><span>Ethics <i>α</i> Quant <i>σ</i> FSA <i>Σ</i> Fixed Income <i>θ</i> Derivatives <i>Δ</i> Equity <i>β</i> Portfolio <i>γ</i></span></div></div>
    <section class="navy">
      <div class="wrap">
        <div class="sec-head"><h2 class="h2">Choose your <em>level.</em></h2><p class="lede">Each level asks something different of you. The course changes with it.</p></div>
        <div class="tabs" role="tablist" aria-label="CFA levels">
          <button class="tab" role="tab" id="t-l1" aria-controls="p-l1" aria-selected="true">Level I</button>
          <button class="tab" role="tab" id="t-l2" aria-controls="p-l2" aria-selected="false" tabindex="-1">Level II</button>
          <button class="tab" role="tab" id="t-l3" aria-controls="p-l3" aria-selected="false" tabindex="-1">Level III</button>
        </div>${lvl("l1", "Level I", true, "Level I: <em>the toolkit.</em>", "Build the vocabulary and tools of investment analysis across all ten topic areas.", "We focus on concepts first, then speed: how to recognise a question type and answer it cleanly.", core)}${lvl("l2", "Level II", false, "Level II: <em>application.</em>", "Apply the toolkit to vignettes. Valuation, analysis and judgement under time pressure.", "We train you to read a case once, find what matters and work the numbers with confidence.", core)}${lvl("l3", "Level III", false, "Level III: <em>synthesis.</em>", "Think like a portfolio manager: asset allocation, portfolio construction, risk and client needs, plus your chosen pathway.", "We drill constructed-response answers until your writing is precise, structured and exam-ready.", ["Asset Allocation", "Portfolio Construction", "Performance Measurement", "Derivatives &amp; Risk Management", "Ethical &amp; Professional Standards", "Pathway: Portfolio Management", "Pathway: Private Markets", "Pathway: Private Wealth"])}
      </div>
    </section>
    <section class="light">
      <div class="wrap">
        <div class="sec-head"><h2 class="h2">How the course <em>works.</em></h2><p class="lede">Built around how candidates actually study: alongside work, in focused blocks.</p></div>
        <ul class="cards4">
          <li class="card reveal"><span class="c-glyph" aria-hidden="true">α</span><span class="c-num">01</span><h3>A study roadmap</h3><p>Week-by-week plan from day one to exam day.</p></li>
          <li class="card reveal"><span class="c-glyph" aria-hidden="true">σ</span><span class="c-num">02</span><h3>Concept sessions</h3><p>Hard topics explained simply, with intuition before formulas.</p></li>
          <li class="card reveal"><span class="c-glyph" aria-hidden="true">Σ</span><span class="c-num">03</span><h3>Practice &amp; review</h3><p>Question sets, with the reasoning behind every answer.</p></li>
          <li class="card reveal"><span class="c-glyph" aria-hidden="true">Δ</span><span class="c-num">04</span><h3>Revision sprints</h3><p>Final-weeks strategy, mocks and exam-day technique.</p></li>
        </ul>
      </div>
    </section>
    <section class="white">
      <div class="wrap">
        <a class="big-cta reveal" href="${DM}" target="_blank" rel="noopener"><span class="alpha-bg" aria-hidden="true">α</span><p class="kicker">Next batch</p><h2 class="h2">Ready to start <em>your level?</em></h2><span class="btn">Message to enrol <span class="arr" aria-hidden="true">→</span></span></a>
      </div>
    </section>
    ${next("cfa-notes.html", "Next · For CFA candidates", "Notes &amp; <em>resources</em>")}`, disclaimer: "Course details are subject to change." });

/* =============== 2. CFA: Notes & resources =============== */
const res = [
  ["l1", "Level I", "Ethics in one page", "Σ", "The Code, the Standards and the traps examiners love, on a single sheet."],
  ["l1 formula", "Formula sheet", "Quant formula sheet", "σ", "Time value, statistics and hypothesis testing formulas, grouped by use."],
  ["l1", "Level I", "FSA cheat sheet", "Δ", "Ratios, adjustments and the statements that link them."],
  ["l1 l2 formula", "Formula sheet", "Fixed income formulas", "θ", "Duration, convexity and spreads with worked mini-examples."],
  ["l2", "Level II", "Equity valuation map", "β", "DDM, FCFE, FCFF and residual income: when to use which."],
  ["l2", "Level II", "Vignette reading method", "∂", "A repeatable way to read a case once and find what matters."],
  ["l3", "Level III", "IPS template", "γ", "Structure investment policy statements the way graders expect."],
  ["l3 strategy", "Strategy", "Constructed-response guide", "α", "How to write short, precise answers that earn every mark."],
  ["strategy", "Strategy", "Mock exam playbook", "Ω", "How to sit a mock, review it, and turn mistakes into marks."],
  ["strategy", "Strategy", "Study calendar", "λ", "A realistic weekly plan that works alongside a full-time job."],
];
pages.push({ file: "cfa-notes.html", title: "CFA notes & resources", desc: "CFA notes, formula sheets and the CFA study group by Anuvamshi Shetty.", main: `
    <section class="s-hero navy">
      <div class="glow" aria-hidden="true"></div>
      ${alphaSvg}
      <div class="wrap">
        ${back("index.html#cfa", "For CFA candidates")}
        <p class="kicker">02 · For CFA candidates</p>
        <h1 class="s-title">Notes that <em>actually stick.</em></h1>
        <p class="lede">Summaries, formula sheets and strategy guides, written for revision, not reading. Hover or tap a card to see what’s inside.</p>
        <div class="s-hero-foot"><ul class="s-meta"><li>Summaries</li><li>Formula sheets</li><li>Strategy</li></ul><a class="btn" href="${WA}" target="_blank" rel="noopener">Join the study group <span class="arr" aria-hidden="true">→</span></a></div>
      </div>
    </section>
    <section class="light">
      <div class="wrap">
        <div class="sec-head"><h2 class="h2">The <em>library.</em></h2><p class="lede">Filter by level or type. New resources are shared first in the study group.</p></div>
        <div class="filters" data-filter-for="lib" role="group" aria-label="Filter resources">
          <button class="filter" data-f="all" aria-pressed="true">All</button>
          <button class="filter" data-f="l1" aria-pressed="false">Level I</button>
          <button class="filter" data-f="l2" aria-pressed="false">Level II</button>
          <button class="filter" data-f="l3" aria-pressed="false">Level III</button>
          <button class="filter" data-f="formula" aria-pressed="false">Formula sheets</button>
          <button class="filter" data-f="strategy" aria-pressed="false">Strategy</button>
        </div>
        <ul class="flip-grid" id="lib">${res.map(([k, tag, t, ic, d]) => `
          <li data-k="${k}"><a class="flip" href="${WA}" target="_blank" rel="noopener"><div class="front"><span class="f-tag">${tag}</span><span class="f-icon" aria-hidden="true">${ic}</span><h3>${t}</h3></div><div class="back"><span class="f-tag">What’s inside</span><p>${d}</p><span class="f-go">Get it in the study group →</span></div></a></li>`).join("")}
        </ul>
      </div>
    </section>
    <section class="white">
      <div class="wrap">
        <a class="big-cta reveal" href="${WA}" target="_blank" rel="noopener"><span class="alpha-bg" aria-hidden="true">α</span><p class="kicker">CFA study group</p><h2 class="h2">Study with people who <em>get it.</em></h2><p class="lede">Questions answered, resources shared, accountability every week. Free to join on WhatsApp.</p><span class="btn">Join on WhatsApp <span class="arr" aria-hidden="true">→</span></span></a>
      </div>
    </section>
    ${next("cfa-sessions.html", "Next · For CFA candidates", "Modeling &amp; <em>1-on-1</em>")}` });

/* =============== 3. CFA: Financial modeling & 1-on-1 =============== */
pages.push({ file: "cfa-sessions.html", title: "Financial modeling & 1-on-1 sessions", desc: "Personal 1-on-1 sessions on financial modeling and CFA topics, ₹5,000 per session.", main: `
    <section class="s-hero light">
      ${alphaSvg}
      <div class="wrap">
        ${back("index.html#cfa", "For CFA candidates")}
        <p class="kicker">03 · For CFA candidates</p>
        <h1 class="s-title">Your questions, <em>answered.</em></h1>
        <p class="lede">A private session built around you: the topic you keep getting wrong, the model you need to build, or the plan to get you to exam day.</p>
        <div class="s-hero-foot"><ul class="s-meta"><li>1-on-1</li><li>Online</li><li>₹5,000 per session</li></ul>${book()}</div>
      </div>
    </section>
    <section class="navy">
      <div class="wrap">
        <div class="sec-head"><h2 class="h2">What we can <em>cover.</em></h2><p class="lede">Bring one thing or several. We prioritise what moves your score or your skills most.</p></div>
        <ol class="rows">
          <li class="reveal"><span class="r-num">01</span><strong>Financial modeling</strong><span>Three-statement models, DCF and comparables, built step by step in Excel.</span></li>
          <li class="reveal"><span class="r-num">02</span><strong>Weak-topic rescue</strong><span>FSA, fixed income, derivatives or any area where marks keep slipping.</span></li>
          <li class="reveal"><span class="r-num">03</span><strong>Mock review</strong><span>We go through your mock and turn every mistake into a rule you remember.</span></li>
          <li class="reveal"><span class="r-num">04</span><strong>Study plan reset</strong><span>A realistic plan for the weeks you have left, around your job and life.</span></li>
          <li class="reveal"><span class="r-num">05</span><strong>Career questions</strong><span>Roles, interviews and how to use the CFA in the work you want.</span></li>
        </ol>
      </div>
    </section>
    <section class="light">
      <div class="wrap price-wrap">
        <div>
          <h2 class="h2">Simple, <em>transparent.</em></h2>
          <p class="lede">One price per session. Book as many or as few as you need.</p>
          <ol class="steps" style="margin-top:48px">
            <li><h3>Message to book</h3><p>Send a DM with your level and what you want to work on.</p></li>
            <li><h3>Share your material</h3><p>Send the questions, mock or model beforehand so we start fast.</p></li>
            <li><h3>Work together, live</h3><p>A focused 1-on-1 session online.</p></li>
            <li><h3>Leave with a plan</h3><p>Clear next steps you can act on the same day.</p></li>
          </ol>
        </div>
        <div class="price reveal"><div class="price-in">
          <p class="kicker">1-on-1 session</p>
          <div class="amt">₹5,000<small>per session</small></div>
          <ul><li>Financial modeling or CFA topics</li><li>Tailored to your level and goals</li><li>Online, at a time that suits you</li></ul>
          ${book("Book a session")}
          <p class="note">Payment and scheduling are confirmed over DM.</p>
        </div></div>
      </div>
    </section>
    ${next("cfa-courses.html", "Back to the start · For CFA candidates", "Explore <em>courses</em>")}` });

/* =============== 4. INVESTORS: Newsletter (focus) =============== */
pages.push({ file: "newsletter.html", title: "The Alpha Letter, an investing newsletter", desc: "The Alpha Letter: clear, practical thinking on investing in financial markets, by Anuvamshi Shetty.", main: `
    <section class="s-hero light">
      ${alphaSvg}
      <div class="wrap">
        ${back("index.html#investors", "For investors")}
        <p class="kicker">01 · For investors · Newsletter</p>
        <h1 class="s-title">The <em>Alpha</em> Letter.</h1>
        <p class="lede">Clear thinking on financial markets, written for people who want to understand what they own. No hype, no tips. Just frameworks you can use.</p>
        <div class="s-hero-foot" style="display:block">
          <form class="signup" data-endpoint="" novalidate>
            <label class="sr-only" for="em1">Email address</label>
            <input id="em1" name="email" type="email" placeholder="you@email.com" autocomplete="email" required />
            <button class="btn" type="submit">Subscribe <span class="arr" aria-hidden="true">→</span></button>
          </form>
          <p class="signup-msg" role="status"></p>
        </div>
      </div>
    </section>
    <div class="marquee light" aria-hidden="true"><div class="marquee-track"><span>Markets <i>α</i> Valuation <i>β</i> Macro <i>σ</i> Behaviour <i>Δ</i> Risk <i>Σ</i> Compounding <i>γ</i></span><span>Markets <i>α</i> Valuation <i>β</i> Macro <i>σ</i> Behaviour <i>Δ</i> Risk <i>Σ</i> Compounding <i>γ</i></span></div></div>
    <section class="light">
      <div class="wrap sticky-split">
        <div class="stick">
          <p class="kicker">Inside every issue</p>
          <h2 class="h2">Four parts. <em>One</em> sharper investor.</h2>
          <p class="lede">Each issue is built to be read in one sitting and remembered for longer.</p>
        </div>
        <div class="feat">
          <article class="reveal"><span class="ico" aria-hidden="true">α</span><div><h3>Market pulse</h3><p>What moved, why it matters and what is just noise, in a few short paragraphs.</p></div></article>
          <article class="reveal"><span class="ico" aria-hidden="true">β</span><div><h3>One idea, deeply</h3><p>A single company, sector or theme taken apart with the tools analysts use.</p></div></article>
          <article class="reveal"><span class="ico" aria-hidden="true">σ</span><div><h3>Concept of the issue</h3><p>One finance concept explained simply, from duration to free cash flow.</p></div></article>
          <article class="reveal"><span class="ico" aria-hidden="true">Δ</span><div><h3>Behaviour check</h3><p>The biases that cost investors most, and the habits that protect returns.</p></div></article>
        </div>
      </div>
    </section>
    <section class="navy">
      <div class="wrap calc" style="align-items:center">
        <div>
          <p class="kicker">A taste of an issue</p>
          <h2 class="h2">Read it like a <em>letter</em>, not a feed.</h2>
          <p class="lede">Written to be read slowly, then reread. Move your cursor over it, or just read.</p>
        </div>
        <div class="letter-stage">
          <article class="letter" aria-label="Sample newsletter issue">
            <header><b>The Alpha Letter</b><span>Sample issue</span></header>
            <h4>Market pulse</h4>
            <p>Prices move daily; <mark>value moves slowly</mark>. Before reacting to a headline, ask what changed in the business, not just the chart.</p>
            <h4>Concept of the issue: margin of safety</h4>
            <p>Pay less than your estimate of value so that being wrong doesn’t ruin you. <mark>The gap is your protection</mark>, not your profit target.</p>
            <h4>Behaviour check</h4>
            <p>Loss aversion makes us sell winners early and hold losers long. <mark>Write your exit rules before you buy.</mark></p>
          </article>
        </div>
      </div>
    </section>
    <section class="light">
      <div class="wrap">
        <div class="sec-head"><h2 class="h2">Who it’s <em>for.</em></h2><p class="lede">If you invest, or want to, and prefer understanding to tips, you’ll feel at home.</p></div>
        <ol class="rows">
          <li class="reveal"><span class="r-num">01</span><strong>New investors</strong><span>Learn the fundamentals in plain language, one issue at a time.</span></li>
          <li class="reveal"><span class="r-num">02</span><strong>Busy professionals</strong><span>Stay sharp on markets without spending hours on news.</span></li>
          <li class="reveal"><span class="r-num">03</span><strong>Finance students &amp; CFA candidates</strong><span>See the curriculum applied to real markets.</span></li>
        </ol>
      </div>
    </section>
    <section class="white">
      <div class="wrap">
        <div class="sec-head"><h2 class="h2">Questions, <em>answered.</em></h2></div>
        <div class="faq">
          <details><summary>Is this investment advice?</summary><p>No. The Alpha Letter is educational. It explains how to think about markets; it does not tell you what to buy or sell.</p></details>
          <details><summary>Who writes it?</summary><p>Anuvamshi Shetty, founder of The Lighthouse Capital, TEDx speaker and CFA Level III candidate.</p></details>
          <details><summary>Can I unsubscribe?</summary><p>Any time, with one click at the bottom of every email.</p></details>
        </div>
        <div style="margin-top:72px">
          <form class="signup" data-endpoint="" novalidate>
            <label class="sr-only" for="em2">Email address</label>
            <input id="em2" name="email" type="email" placeholder="you@email.com" autocomplete="email" required />
            <button class="btn" type="submit">Subscribe <span class="arr" aria-hidden="true">→</span></button>
          </form>
          <p class="signup-msg" role="status"></p>
        </div>
      </div>
    </section>
    ${next("personal-finance.html", "Next · For investors", "1-on-1 personal <em>finance</em>")}` });

/* =============== 5. INVESTORS: Personal finance 1-on-1 (focus) =============== */
pages.push({ file: "personal-finance.html", title: "1-on-1 personal finance sessions", desc: "Private 1-on-1 personal finance sessions with Anuvamshi Shetty, ₹5,000 per session.", disclaimer: "Sessions are educational and are not personalised investment advice.", main: `
    <section class="s-hero navy">
      <div class="glow" aria-hidden="true"></div>
      ${alphaSvg}
      <div class="wrap">
        ${back("index.html#investors", "For investors")}
        <p class="kicker">02 · For investors · 1-on-1</p>
        <h1 class="s-title">Your money, <em>mapped.</em></h1>
        <p class="lede">A private session to see your whole financial picture clearly, and leave with a plan you understand and can follow.</p>
        <div class="s-hero-foot"><ul class="s-meta"><li>1-on-1</li><li>Online</li><li>₹5,000 per session</li></ul>${book()}</div>
      </div>
    </section>
    <section class="light">
      <div class="wrap">
        <div class="sec-head"><h2 class="h2">The money <em>map.</em></h2><p class="lede">Six areas we walk through together. Hover or tap each one to see what we look at.</p></div>
        <div class="map">
          <article tabindex="0"><span class="m-ico" aria-hidden="true">₹</span><h3>Cash flow</h3><p>Where your money goes each month, and how to make saving automatic.</p></article>
          <article tabindex="0"><span class="m-ico" aria-hidden="true">Ω</span><h3>Emergency fund</h3><p>How much cushion you need, and where to keep it so it’s there when needed.</p></article>
          <article tabindex="0"><span class="m-ico" aria-hidden="true">σ</span><h3>Insurance</h3><p>Understanding term and health cover so one bad event doesn’t undo years of saving.</p></article>
          <article tabindex="0"><span class="m-ico" aria-hidden="true">Δ</span><h3>Debt</h3><p>Which loans to clear first and how to think about EMIs against investing.</p></article>
          <article tabindex="0"><span class="m-ico" aria-hidden="true">θ</span><h3>Tax</h3><p>The basics of tax-efficient saving and investing, explained clearly.</p></article>
          <article tabindex="0"><span class="m-ico" aria-hidden="true">α</span><h3>Investing &amp; goals</h3><p>Linking each goal to a time horizon, a risk level and a simple plan.</p></article>
        </div>
      </div>
    </section>
    <section class="navy">
      <div class="wrap calc" data-calc="sip">
        <div class="calc-in">
          <p class="kicker">Try it</p>
          <h2 class="h2">See what <em>consistency</em> does.</h2>
          <div class="field"><label for="amt">Monthly investment <output data-o="amt"></output></label><input id="amt" name="amt" type="range" min="1000" max="100000" step="1000" value="10000" /></div>
          <div class="field"><label for="yrs">Time horizon <output data-o="yrs"></output></label><input id="yrs" name="yrs" type="range" min="1" max="35" step="1" value="20" /></div>
          <div class="field"><label for="ret">Assumed annual return <output data-o="ret"></output></label><input id="ret" name="ret" type="range" min="4" max="15" step="0.5" value="12" /></div>
        </div>
        <div class="calc-out" aria-live="polite">
          <div class="big-num"><small>Estimated value</small><span data-o="fv"></span></div>
          <div class="bars">
            <div class="bar"><span>You invest: <b data-o="inv"></b></span><i><b data-b="inv"></b></i></div>
            <div class="bar gain"><span>Growth: <b data-o="gain"></b></span><i><b data-b="gain"></b></i></div>
          </div>
          <p class="calc-note">Illustrative only. Assumes a constant return compounded monthly. Real returns vary and can be negative.</p>
        </div>
      </div>
    </section>
    <section class="light">
      <div class="wrap price-wrap">
        <div>
          <h2 class="h2">How a session <em>works.</em></h2>
          <ol class="steps" style="margin-top:48px">
            <li><h3>Message to book</h3><p>Tell me briefly where you are and what you want to sort out.</p></li>
            <li><h3>A short questionnaire</h3><p>Income, expenses, savings and goals, so the session starts with your real numbers.</p></li>
            <li><h3>The session</h3><p>We go through your money map together, one area at a time.</p></li>
            <li><h3>Your action list</h3><p>A short, prioritised list of what to do next, in order.</p></li>
          </ol>
        </div>
        <div class="price reveal"><div class="price-in">
          <p class="kicker">Personal finance 1-on-1</p>
          <div class="amt">₹5,000<small>per session</small></div>
          <ul><li>Your full money map, reviewed</li><li>Goals linked to a simple plan</li><li>A prioritised action list</li></ul>
          ${book("Book a session")}
          <p class="note">Educational session, not personalised investment advice.</p>
        </div></div>
      </div>
    </section>
    ${next("financial-models.html", "Next · For investors", "Financial models <em>course</em>")}` });

/* =============== 6. INVESTORS: Financial models course (focus) =============== */
const mods = [
  ["Excel for analysts", "Shortcuts, structure and formatting conventions that make models fast and readable.", ["Shortcuts", "Formatting", "Error checks"]],
  ["The three statements", "Build linked income statement, balance sheet and cash flow, and make them balance.", ["Linking", "Schedules", "Balancing"]],
  ["Forecasting drivers", "Turn business understanding into revenue, margin and capex assumptions.", ["Revenue build", "Margins", "Working capital"]],
  ["DCF valuation", "Free cash flow, discount rates and terminal value, step by step.", ["FCFF", "WACC", "Terminal value"]],
  ["Relative valuation", "Pick peers, clean multiples and triangulate value.", ["Comps", "EV/EBITDA", "P/E"]],
  ["Scenarios &amp; sensitivity", "Stress-test your assumptions so you know what really drives value.", ["Data tables", "Scenarios", "Tornado"]],
  ["Presenting a model", "Turn a spreadsheet into a clear investment view.", ["Summary page", "Charts", "Write-up"]],
];
pages.push({ file: "financial-models.html", title: "Financial models course", desc: "Learn to build the financial models analysts use: three statements, DCF, comparables and scenarios.", main: `
    <section class="s-hero light">
      ${alphaSvg}
      <div class="wrap">
        ${back("index.html#investors", "For investors")}
        <p class="kicker">03 · For investors · Course</p>
        <h1 class="s-title">Build models that <em>think.</em></h1>
        <p class="lede">Learn to build the financial models analysts actually use, from a blank sheet to a valuation you can defend.</p>
        <div class="s-hero-foot"><ul class="s-meta"><li>7 modules</li><li>Excel</li><li>Hands-on</li></ul>${book("Join the waitlist")}</div>
      </div>
    </section>
    <section class="navy">
      <div class="wrap calc" data-calc="dcf">
        <div class="calc-in">
          <p class="kicker">Model playground</p>
          <h2 class="h2">Move the <em>drivers.</em></h2>
          <div class="field"><label for="g">Revenue growth (5 yrs) <output data-o="g"></output></label><input id="g" name="g" type="range" min="0" max="25" step="1" value="12" /></div>
          <div class="field"><label for="m">Operating margin <output data-o="m"></output></label><input id="m" name="m" type="range" min="5" max="35" step="1" value="20" /></div>
          <div class="field"><label for="w">Discount rate <output data-o="w"></output></label><input id="w" name="w" type="range" min="9" max="13" step="1" value="11" /></div>
          <div class="field"><label for="tg">Terminal growth <output data-o="tg"></output></label><input id="tg" name="tg" type="range" min="2" max="5" step="1" value="4" /></div>
        </div>
        <div class="calc-out" aria-live="polite">
          <div class="big-num"><small>Enterprise value (illustrative)</small><span data-o="ev"></span></div>
          <div class="bar"><i><b data-b="ev"></b></i></div>
          <p class="kicker" style="margin:6px 0 0">Sensitivity · value in ₹ ’000 Cr</p>
          <div class="sens" aria-hidden="true"></div>
          <p class="calc-note">A simplified 5-year DCF on a hypothetical company with ₹1,000 Cr revenue. In the course, you build the full version.</p>
        </div>
      </div>
    </section>
    <section class="navy" style="padding-top:0">
      <div class="wrap">
        <div class="sec-head"><h2 class="h2">The <em>modules.</em></h2><p class="lede">Open any module to see what you’ll build.</p></div>
        <div class="modules">${mods.map(([t, d, tags], i) => `
          <details><summary><span class="mn">${String(i + 1).padStart(2, "0")}</span><span class="mt">${t}</span><span class="mx" aria-hidden="true">+</span></summary><div class="mb"><p>${d}</p><ul>${tags.map((x) => `<li>${x}</li>`).join("")}</ul></div></details>`).join("")}
        </div>
      </div>
    </section>
    <section class="light">
      <div class="wrap">
        <div class="sec-head"><h2 class="h2">Made <em>for.</em></h2></div>
        <ul class="cards3">
          <li class="card reveal"><span class="c-glyph" aria-hidden="true">α</span><span class="c-num">01</span><h3>Investors</h3><p>Value businesses yourself instead of relying on someone else’s target price.</p></li>
          <li class="card reveal"><span class="c-glyph" aria-hidden="true">Σ</span><span class="c-num">02</span><h3>CFA candidates</h3><p>Turn curriculum formulas into working models.</p></li>
          <li class="card reveal"><span class="c-glyph" aria-hidden="true">Δ</span><span class="c-num">03</span><h3>Aspiring analysts</h3><p>Build the portfolio of models that interviews ask about.</p></li>
        </ul>
        <div style="margin-top:56px">${book("Join the waitlist")}</div>
      </div>
    </section>
    ${next("newsletter.html", "Next · For investors", "The <em>Alpha</em> Letter")}` });

/* =============== 7. FOUNDERS: Website =============== */
pages.push({ file: "founders-website.html", title: "Websites for founders", desc: "Premium, story-led websites for founders and startups.", disclaimer: "Project scope and pricing are agreed per project.", main: `
    <section class="s-hero navy">
      <div class="glow" aria-hidden="true"></div>
      ${alphaSvg}
      <div class="wrap">
        ${back("index.html#founders", "For founders")}
        <p class="kicker">For founders · Websites</p>
        <h1 class="s-title">Look as serious <em>as you are.</em></h1>
        <p class="lede">Story-led websites with motion, 3D and craft, built for founders who need investors, customers and talent to take them seriously from the first scroll.</p>
        <div class="s-hero-foot"><ul class="s-meta"><li>Strategy</li><li>Design</li><li>Build</li></ul>${book("Start a project")}</div>
      </div>
    </section>
    <section class="light">
      <div class="wrap">
        <div class="sec-head"><h2 class="h2">Directions we <em>build.</em></h2><p class="lede">Each frame scrolls through a sample page. The site you’re on is one of them.</p></div>
        <div class="mocks">
          <a class="mock" href="index.html"><div class="frame"><div class="bar3"><i></i><i></i><i></i></div><div class="screen"><div class="page pg pg-a"><div class="t"></div><div class="t s"></div><div class="blk"></div><div class="row"><i></i><i></i><i></i></div><div class="t s"></div><div class="blk"></div><div class="row"><i></i><i></i><i></i></div></div></div></div><span class="cap">Cinematic 3D <span>Fintech</span></span></a>
          <div class="mock"><div class="frame"><div class="bar3"><i></i><i></i><i></i></div><div class="screen"><div class="page pg pg-b"><div class="t"></div><div class="t s"></div><div class="row"><i></i><i></i><i></i></div><div class="blk"></div><div class="t s"></div><div class="row"><i></i><i></i><i></i></div><div class="blk"></div></div></div></div><span class="cap">Editorial clean <span>SaaS</span></span></div>
          <div class="mock"><div class="frame"><div class="bar3"><i></i><i></i><i></i></div><div class="screen"><div class="page pg pg-c"><div class="blk"></div><div class="t"></div><div class="t s"></div><div class="row"><i></i><i></i><i></i></div><div class="blk"></div><div class="row"><i></i><i></i><i></i></div></div></div></div><span class="cap">Bold &amp; dark <span>Deeptech</span></span></div>
        </div>
      </div>
    </section>
    <section class="navy">
      <div class="wrap">
        <div class="sec-head"><h2 class="h2">What you <em>get.</em></h2><p class="lede">Everything a founder site needs, and nothing it doesn’t.</p></div>
        <ol class="rows">
          <li class="reveal"><span class="r-num">01</span><strong>Story &amp; copy</strong><span>We shape your narrative so investors understand you in one scroll.</span></li>
          <li class="reveal"><span class="r-num">02</span><strong>Design &amp; motion</strong><span>A distinctive look with purposeful animation, not templates.</span></li>
          <li class="reveal"><span class="r-num">03</span><strong>Fast &amp; accessible</strong><span>Quick to load, works on every phone, usable by everyone.</span></li>
          <li class="reveal"><span class="r-num">04</span><strong>Yours to run</strong><span>Clean handover so you can update it without us.</span></li>
        </ol>
      </div>
    </section>
    <section class="light">
      <div class="wrap price-wrap">
        <div><h2 class="h2">From call to <em>launch.</em></h2></div>
        <ol class="steps">
          <li><h3>Discovery call</h3><p>Your company, your audience and what the site must achieve.</p></li>
          <li><h3>Direction</h3><p>A visual direction and site structure to agree on.</p></li>
          <li><h3>Design &amp; build</h3><p>Pages designed and built, with reviews along the way.</p></li>
          <li><h3>Launch</h3><p>Go live, with analytics and a handover session.</p></li>
        </ol>
      </div>
    </section>
    <section class="white">
      <div class="wrap">
        <a class="big-cta reveal" href="${DM}" target="_blank" rel="noopener"><span class="alpha-bg" aria-hidden="true">α</span><p class="kicker">Founders</p><h2 class="h2">Let’s build your <em>first impression.</em></h2><span class="btn">Start a project <span class="arr" aria-hidden="true">→</span></span></a>
      </div>
    </section>
    ${next("index.html", "Back home", "Back to <em>α</em>")}` });

for (const p of pages) {
  const key = p.file.replace(".html", "");
  p.main = p.main.replace('\n    <section class="next"', igStrip(key) + '\n    <section class="next"');
  fs.writeFileSync(OUT + p.file, shell(p));
}
console.log(pages.map((p) => p.file).join("\n"));
