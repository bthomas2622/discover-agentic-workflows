/**
 * Agentic Workflow Finder — interactive questionnaire that recommends
 * the best GitHub Agentic Workflow based on user answers.
 */

// ── Question tree ────────────────────────────────────────────────────
// Each node: { id, question, hint?, answers: [{ text, tags[], next? }] }
// `tags` accumulate as the user answers; matching is done at leaf nodes.
// A node without `next` on an answer triggers recommendation.

const QUESTIONS = [
  // ── Top-level category ─────────────────────────────────────────────
  {
    id: "category",
    question: "What area are you looking to improve?",
    hint: "We'll narrow it down from here.",
    answers: [
      { text: "Code, testing & documentation", tags: [], next: "goal-code" },
      { text: "Issues, PRs & project management", tags: [], next: "goal-issues" },
      { text: "Security, maintenance & infrastructure", tags: [], next: "goal-ops" },
      { text: "Reporting, analytics & team culture", tags: [], next: "goal-insights" }
    ]
  },

  // ── Refined goal screens ───────────────────────────────────────────
  {
    id: "goal-code",
    question: "What's your primary goal?",
    answers: [
      { text: "Improve code quality", tags: ["code-quality", "refactoring"], next: "quality-detail" },
      { text: "Fix CI/CD failures faster", tags: ["ci", "debugging"], next: "ci-detail" },
      { text: "Improve testing and validation", tags: ["testing"], next: "testing-detail" },
      { text: "Keep documentation up to date", tags: ["docs"], next: "docs-detail" },
      { text: "Run multi-phase improvement cycles", tags: ["multi-phase", "improvement"] }
    ]
  },
  {
    id: "goal-issues",
    question: "What's your primary goal?",
    answers: [
      { text: "Manage issues and PRs better", tags: ["issues", "prs", "triage"], next: "issue-detail" },
      { text: "Coordinate projects and assign work", tags: ["project", "planning", "assignment"], next: "project-detail" },
      { text: "Use ChatOps / interactive commands", tags: ["chatops", "interactive"], next: "chatops-detail" }
    ]
  },
  {
    id: "goal-ops",
    question: "What's your primary goal?",
    answers: [
      { text: "Strengthen security and compliance", tags: ["security"], next: "security-detail" },
      { text: "Maintain and clean up repositories", tags: ["maintenance"], next: "maintenance-detail" },
      { text: "Monitor tools and infrastructure", tags: ["infrastructure", "monitoring"], next: "infra-detail" }
    ]
  },
  {
    id: "goal-insights",
    question: "What's your primary goal?",
    answers: [
      { text: "Get regular reports and insights", tags: ["reporting", "schedule"], next: "report-detail" },
      { text: "Get advanced analytics and metrics", tags: ["analytics", "ml"], next: "analytics-detail" },
      { text: "Boost team culture and morale", tags: ["culture", "fun"], next: "culture-detail" }
    ]
  },

  // ── Issue / PR branch ──────────────────────────────────────────────
  {
    id: "issue-detail",
    question: "What do you need help with?",
    answers: [
      { text: "Automatically label and classify new issues", tags: ["labels", "automation"] },
      { text: "Respond to new issues with helpful comments", tags: ["comments", "respond"] },
      { text: "Triage and prioritize pull requests", tags: ["prs", "review"] },
      { text: "Get AI code reviews on PRs", tags: ["review", "comments"], next: "review-style" },
      { text: "Moderate content for community guidelines", tags: ["moderation", "community"] },
      { text: "Extract tasks from Discussions into issues", tags: ["discussions", "task-extraction"] }
    ]
  },
  {
    id: "review-style",
    question: "What kind of review do you want?",
    answers: [
      { text: "General code quality and best practices", tags: ["code-quality"] },
      { text: "Security-focused review", tags: ["security"] }
    ]
  },

  // ── Code quality branch ────────────────────────────────────────────
  {
    id: "quality-detail",
    question: "What aspect of code quality?",
    answers: [
      { text: "Simplify and clean up recently changed code", tags: ["simplify", "prs"] },
      { text: "Find and remove dead/unreachable code", tags: ["dead-code", "prs"] },
      { text: "Detect duplicate code patterns", tags: ["duplicates", "analysis"] },
      { text: "Catch breaking API/CLI changes", tags: ["breaking-changes", "api"] },
      { text: "Run comprehensive linting", tags: ["linting", "multi-language"] }
    ]
  },

  // ── CI/CD branch ───────────────────────────────────────────────────
  {
    id: "ci-detail",
    question: "What CI/CD help do you need?",
    answers: [
      { text: "Investigate and diagnose CI failures automatically", tags: ["investigation", "issues"] },
      { text: "Get proactive CI health analysis and coaching", tags: ["analysis", "performance"] }
    ]
  },

  // ── Documentation branch ───────────────────────────────────────────
  {
    id: "docs-detail",
    question: "What documentation help?",
    answers: [
      { text: "Auto-update docs when code changes", tags: ["auto-update", "prs", "schedule"] },
      { text: "Find and fix documentation gaps the updater missed", tags: ["self-healing", "prs"] },
      { text: "Generate technical documentation", tags: ["technical-writing", "prs"] }
    ]
  },

  // ── Reporting branch ───────────────────────────────────────────────
  {
    id: "report-detail",
    question: "What kind of reports?",
    answers: [
      { text: "Daily team status summary", tags: ["daily", "team"] },
      { text: "Deep issue analytics with trend charts", tags: ["analytics", "charts"], next: "report-frequency" },
      { text: "Organization-wide health across repos", tags: ["org-wide", "multi-repo"] }
    ]
  },
  {
    id: "report-frequency",
    question: "How often should it run?",
    answers: [
      { text: "Daily", tags: ["daily"] },
      { text: "Weekly", tags: ["weekly"] }
    ]
  },

  // ── Security branch ────────────────────────────────────────────────
  {
    id: "security-detail",
    question: "What security area?",
    answers: [
      { text: "Audit repo config and workflow security", tags: ["compliance", "audit"] },
      { text: "Auto-fix code scanning alerts", tags: ["code-scanning", "auto-fix", "prs"] },
      { text: "Scan for malicious code patterns", tags: ["scanning"] },
      { text: "Security-focused PR reviews", tags: ["prs", "review", "comments"] }
    ]
  },

  // ── Maintenance branch ─────────────────────────────────────────────
  {
    id: "maintenance-detail",
    question: "What maintenance task?",
    answers: [
      { text: "Find stale/inactive repos across the org", tags: ["org-wide", "multi-repo", "stale"] },
      { text: "Clean up stale draft PRs", tags: ["prs", "cleanup"] },
      { text: "Process and batch Dependabot PRs", tags: ["dependencies", "prs"] }
    ]
  },

  // ── Culture branch ──────────────────────────────────────────────────
  {
    id: "culture-detail",
    question: "What would brighten your team's day?",
    answers: [
      { text: "Generate creative poems about repo events", tags: ["comments", "issues"] },
      { text: "Improve user-facing clarity and professionalism", tags: ["ux", "docs", "code-quality"] },
      { text: "Post fun daily facts or trivia", tags: ["schedule"] }
    ]
  },

  // ── ChatOps branch ──────────────────────────────────────────────────
  {
    id: "chatops-detail",
    question: "What interactive command do you want?",
    answers: [
      { text: "Optimize and fix workflows with /q", tags: ["optimization", "prs"] },
      { text: "Break down tasks into sub-issues with /plan", tags: ["planning", "issues", "project"] },
      { text: "Research a topic and summarize with /research", tags: ["research", "discussions"] },
      { text: "Get AI code reviews on demand", tags: ["review", "comments", "prs"] }
    ]
  },

  // ── Testing branch ──────────────────────────────────────────────────
  {
    id: "testing-detail",
    question: "What testing help do you need?",
    answers: [
      { text: "Improve test quality and coverage daily", tags: ["code-quality", "issues", "schedule"] },
      { text: "Refine PR code with tests, style, and security checks", tags: ["prs", "review", "security"] }
    ]
  },

  // ── Infrastructure branch ───────────────────────────────────────────
  {
    id: "infra-detail",
    question: "What infrastructure task?",
    answers: [
      { text: "Monitor health of all agentic workflows", tags: ["monitoring", "schedule", "issues"] },
      { text: "Keep agent instructions and config files clean", tags: ["maintenance", "schedule"] }
    ]
  },

  // ── Project branch ──────────────────────────────────────────────────
  {
    id: "project-detail",
    question: "What project coordination?",
    answers: [
      { text: "Auto-assign issues to team members", tags: ["issues", "schedule", "assignment"] },
      { text: "Break down work into sub-issues with /plan", tags: ["chatops", "planning", "issues", "interactive"] },
      { text: "Extract tasks from discussions into issues", tags: ["discussions", "task-extraction"] }
    ]
  },

  // ── Analytics branch ────────────────────────────────────────────────
  {
    id: "analytics-detail",
    question: "What analytics interest you?",
    answers: [
      { text: "AI agent performance and effectiveness scores", tags: ["meta", "performance"] },
      { text: "Codebase metrics with charts (LOC, churn, quality score)", tags: ["charts", "metrics"] },
      { text: "Copilot session insights and token optimization", tags: ["optimization"] }
    ]
  }
];

// ── State ────────────────────────────────────────────────────────────
let collectedTags = [];
let answerTrail = []; // { question, answer }
let questionIndex = 0; // for progress

const questionMap = {};
QUESTIONS.forEach(q => questionMap[q.id] = q);

const questionArea = document.getElementById("question-area");
const recommendationArea = document.getElementById("recommendation");
const progressBar = document.getElementById("progress-bar");
const progressFill = document.getElementById("progress-fill");

// ── Render ───────────────────────────────────────────────────────────
function showQuestion(id) {
  const q = questionMap[id];
  if (!q) return;

  progressBar.classList.remove("hidden");
  const maxDepth = 4;
  const depth = answerTrail.length;
  progressFill.style.width = Math.min((depth / maxDepth) * 100, 95) + "%";

  let html = "";

  // Answer trail
  if (answerTrail.length > 0) {
    html += `<div class="answer-trail">`;
    answerTrail.forEach(t => {
      html += `<div class="trail-item"><span class="trail-q">${esc(t.question)}</span> → ${esc(t.answer)}</div>`;
    });
    html += `</div>`;
  }

  html += `<div class="question-card">`;
  html += `<h2>${esc(q.question)}</h2>`;
  if (q.hint) html += `<p>${esc(q.hint)}</p>`;
  html += `<div class="answers">`;
  q.answers.forEach((a, i) => {
    html += `<button class="answer-btn" data-qi="${q.id}" data-ai="${i}">${esc(a.text)}</button>`;
  });
  html += `</div></div>`;

  questionArea.innerHTML = html;

  // Bind clicks
  questionArea.querySelectorAll(".answer-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const qi = btn.getAttribute("data-qi");
      const ai = parseInt(btn.getAttribute("data-ai"), 10);
      handleAnswer(qi, ai);
    });
  });
}

function handleAnswer(questionId, answerIndex) {
  const q = questionMap[questionId];
  const a = q.answers[answerIndex];

  collectedTags.push(...a.tags);
  answerTrail.push({ question: q.question, answer: a.text });

  if (a.next && questionMap[a.next]) {
    showQuestion(a.next);
  } else {
    showRecommendations();
  }
}

// ── Matching ─────────────────────────────────────────────────────────
function scoreWorkflow(wf) {
  let score = 0;
  const tagSet = new Set(collectedTags);
  wf.tags.forEach(t => {
    if (tagSet.has(t)) score++;
  });
  return score;
}

function showRecommendations() {
  progressFill.style.width = "100%";
  questionArea.innerHTML = "";

  const scored = WORKFLOWS.map(wf => ({ wf, score: scoreWorkflow(wf) }))
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score);

  const best = scored.slice(0, 1);
  const also = scored.slice(1, 4);

  let html = "";

  // Trail
  if (answerTrail.length > 0) {
    html += `<div class="answer-trail">`;
    answerTrail.forEach(t => {
      html += `<div class="trail-item"><span class="trail-q">${esc(t.question)}</span> → ${esc(t.answer)}</div>`;
    });
    html += `</div>`;
  }

  html += `<div class="results-header"><h2>Your Recommended Workflow${also.length > 0 ? "s" : ""}</h2>`;
  html += `<p>Based on your answers, here's what fits best.</p></div>`;

  html += `<button class="restart-btn" id="restart">Start over</button>`;

  best.forEach(s => {
    html += renderCard(s.wf, "Best match", "badge-best");
  });
  also.forEach(s => {
    html += renderCard(s.wf, "Also relevant", "badge-also");
  });

  if (scored.length === 0) {
    html += `<div class="rec-card"><p>No exact match found. Try the <a href="https://github.github.com/gh-aw/blog/2026-01-12-welcome-to-pelis-agent-factory/" target="_blank" rel="noopener">full workflow gallery</a> for more options.</p></div>`;
  }

  recommendationArea.innerHTML = html;
  recommendationArea.classList.remove("hidden");

  // Copy buttons — use raw command text from the sibling <code> element
  recommendationArea.querySelectorAll(".copy-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const codeEl = btn.parentElement.querySelector("code");
      if (!codeEl) return;
      const cmd = codeEl.textContent;

      function onSuccess() {
        btn.textContent = "Copied!";
        btn.classList.add("copied");
        setTimeout(() => {
          btn.textContent = "Copy";
          btn.classList.remove("copied");
        }, 2000);
      }

      // Try modern API first, then fallback
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(cmd).then(onSuccess).catch(() => fallbackCopy(cmd, onSuccess));
      } else {
        fallbackCopy(cmd, onSuccess);
      }
    });
  });

  document.getElementById("restart").addEventListener("click", restart);
}

function renderCard(wf, label, badgeClass) {
  const addCmd = `gh aw add-wizard ${wf.source}`;
  const filename = wf.source.split("/").pop();
  const sourceUrl = `https://github.com/github/gh-aw/tree/v0.65.7/.github/workflows/${filename}`;
  let html = `<div class="rec-card">`;
  html += `<div class="rec-header"><span class="badge ${badgeClass}">${label}</span></div>`;
  html += `<h3><a href="${sourceUrl}" target="_blank" rel="noopener">${esc(wf.name)}</a></h3>`;
  html += `<p class="rec-desc">${esc(wf.desc)}</p>`;

  html += `<div class="rec-tags">`;
  html += `<span class="tag">Trigger: ${esc(wf.trigger)}</span>`;
  html += `</div>`;

  html += `<div class="install-box"><code>${esc(addCmd)}</code>`;
  html += `<button class="copy-btn" data-cmd="${esc(addCmd)}">Copy</button>`;
  html += `</div>`;

  html += `</div>`;
  return html;
}

function restart() {
  collectedTags = [];
  answerTrail = [];
  questionIndex = 0;
  recommendationArea.innerHTML = "";
  recommendationArea.classList.add("hidden");
  progressFill.style.width = "0%";
  showQuestion("category");
}

function esc(str) {
  const d = document.createElement("div");
  d.textContent = str;
  return d.innerHTML;
}

function fallbackCopy(text, onSuccess) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  try {
    document.execCommand("copy");
    onSuccess();
  } catch (e) {
    // silent fail
  }
  document.body.removeChild(textarea);
}

// ── Init ─────────────────────────────────────────────────────────────
showQuestion("category");
