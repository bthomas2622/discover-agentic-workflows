/**
 * Workflow database — each entry describes a real workflow from github/gh-aw.
 * Tags are used for matching against user answers.
 */
const WORKFLOWS = [
  // ── Issue & PR Management ──────────────────────────────────────────
  {
    id: "auto-triage-issues",
    name: "Auto-Triage Issues",
    desc: "Automatically labels and classifies new issues by type (bug, feature, docs, question) and component. Runs on issue open and on a schedule to catch unlabeled backlog.",
    tags: ["issues", "triage", "labels", "automation", "schedule"],
    source: "github/gh-aw/.github/workflows/auto-triage-issues.md@v0.65.7",
    trigger: "issues:opened + schedule",
    engine: "copilot"
  },
  {
    id: "issue-triage-agent",
    name: "Issue Triage Agent",
    desc: "Responds to newly opened issues with a helpful comment acknowledging the issue, classifying it, asking for missing info, and suggesting related issues.",
    tags: ["issues", "triage", "comments", "respond"],
    source: "github/gh-aw/.github/workflows/issue-triage-agent.md@v0.65.7",
    trigger: "issues:opened",
    engine: "copilot"
  },
  {
    id: "pr-triage-agent",
    name: "PR Triage Agent",
    desc: "Categorizes open PRs by type and risk level, calculates priority scores, recommends actions (auto-merge, fast-track, defer, close), and applies labels.",
    tags: ["prs", "triage", "labels", "review", "schedule"],
    source: "github/gh-aw/.github/workflows/pr-triage-agent.md@v0.65.7",
    trigger: "schedule (every 6h)",
    engine: "copilot"
  },
  {
    id: "grumpy-reviewer",
    name: "Grumpy Reviewer",
    desc: "A senior-developer-persona code reviewer that leaves thorough, opinionated (but constructive) PR review comments focused on code quality, security, and best practices.",
    tags: ["prs", "review", "code-quality", "comments"],
    source: "github/gh-aw/.github/workflows/grumpy-reviewer.md@v0.65.7",
    trigger: "slash command or PR ready_for_review",
    engine: "codex"
  },
  {
    id: "security-review",
    name: "Security Review Agent",
    desc: "Reviews PR changes specifically for security implications — permission escalation, network boundary changes, sandbox bypasses, and credential exposure.",
    tags: ["prs", "review", "security", "comments"],
    source: "github/gh-aw/.github/workflows/security-review.md@v0.65.7",
    trigger: "slash command on PR",
    engine: "copilot"
  },
  {
    id: "ai-moderator",
    name: "AI Moderator",
    desc: "Moderates issue and PR content for policy compliance, spam detection, and community guidelines enforcement.",
    tags: ["issues", "prs", "moderation", "community"],
    source: "github/gh-aw/.github/workflows/ai-moderator.md@v0.65.7",
    trigger: "issues + pull_request",
    engine: "copilot"
  },

  // ── Code Quality & Refactoring ─────────────────────────────────────
  {
    id: "code-simplifier",
    name: "Code Simplifier",
    desc: "Analyzes code changed in the last 24 hours. Applies simplifications that improve clarity and consistency while preserving functionality. Opens a PR with the improvements.",
    tags: ["code-quality", "refactoring", "prs", "schedule", "simplify"],
    source: "github/gh-aw/.github/workflows/code-simplifier.md@v0.65.7",
    trigger: "daily schedule",
    engine: "copilot"
  },
  {
    id: "dead-code-remover",
    name: "Dead Code Remover",
    desc: "Runs static analysis to find unreachable functions, safely deletes a batch of up to 10 per day, verifies the build still passes, and opens a PR.",
    tags: ["code-quality", "refactoring", "prs", "schedule", "dead-code"],
    source: "github/gh-aw/.github/workflows/dead-code-remover.md@v0.65.7",
    trigger: "daily schedule",
    engine: "copilot"
  },
  {
    id: "duplicate-code-detector",
    name: "Duplicate Code Detector",
    desc: "Uses semantic code analysis to identify duplicate code patterns across the codebase. Creates issues with specific refactoring recommendations.",
    tags: ["code-quality", "issues", "analysis", "duplicates"],
    source: "github/gh-aw/.github/workflows/duplicate-code-detector.md@v0.65.7",
    trigger: "daily schedule + manual",
    engine: "codex"
  },
  {
    id: "breaking-change-checker",
    name: "Breaking Change Checker",
    desc: "Scans recent commits for breaking CLI changes — removed commands, renamed flags, output format changes, schema modifications — and creates an issue with migration guidance.",
    tags: ["code-quality", "issues", "breaking-changes", "schedule", "api"],
    source: "github/gh-aw/.github/workflows/breaking-change-checker.md@v0.65.7",
    trigger: "daily schedule (weekdays)",
    engine: "copilot"
  },
  {
    id: "super-linter",
    name: "Super Linter Agent",
    desc: "Runs comprehensive linting across multiple languages and creates issues or PRs for violations found.",
    tags: ["code-quality", "linting", "multi-language"],
    source: "github/gh-aw/.github/workflows/super-linter.md@v0.65.7",
    trigger: "schedule",
    engine: "copilot"
  },

  // ── CI/CD & Quality ────────────────────────────────────────────────
  {
    id: "ci-doctor",
    name: "CI Failure Doctor",
    desc: "Investigates failed CI workflow runs — downloads logs, identifies root causes, searches for patterns, and creates a diagnostic issue or PR comment with specific fix recommendations.",
    tags: ["ci", "debugging", "issues", "comments", "investigation"],
    source: "github/gh-aw/.github/workflows/ci-doctor.md@v0.65.7",
    trigger: "workflow_run failure + label command on PR",
    engine: "codex"
  },
  {
    id: "ci-coach",
    name: "CI Coach",
    desc: "Proactively analyzes CI health trends — identifies flaky tests, slow pipelines, and recurring failures. Creates improvement suggestions.",
    tags: ["ci", "analysis", "schedule", "performance"],
    source: "github/gh-aw/.github/workflows/ci-coach.md@v0.65.7",
    trigger: "schedule",
    engine: "copilot"
  },

  // ── Documentation ──────────────────────────────────────────────────
  {
    id: "daily-doc-updater",
    name: "Daily Documentation Updater",
    desc: "Scans merged PRs from the last 24 hours, identifies new features that need documentation, and creates a PR updating the relevant docs.",
    tags: ["docs", "prs", "schedule", "auto-update"],
    source: "github/gh-aw/.github/workflows/daily-doc-updater.md@v0.65.7",
    trigger: "daily schedule",
    engine: "claude"
  },
  {
    id: "daily-doc-healer",
    name: "Daily Documentation Healer",
    desc: "Companion to the Doc Updater — finds documentation gaps that were missed, fixes them, and proposes improvements to the updater's logic.",
    tags: ["docs", "prs", "schedule", "self-healing"],
    source: "github/gh-aw/.github/workflows/daily-doc-healer.md@v0.65.7",
    trigger: "daily schedule",
    engine: "claude"
  },
  {
    id: "technical-doc-writer",
    name: "Technical Doc Writer",
    desc: "Generates technical documentation for code, APIs, and features. Creates well-structured docs following best practices.",
    tags: ["docs", "prs", "technical-writing"],
    source: "github/gh-aw/.github/workflows/technical-doc-writer.md@v0.65.7",
    trigger: "manual / on demand",
    engine: "copilot"
  },

  // ── Reporting & Analytics ──────────────────────────────────────────
  {
    id: "daily-team-status",
    name: "Daily Team Status",
    desc: "Creates an upbeat daily status report as a GitHub issue — covers recent activity, productivity insights, community highlights, and recommendations.",
    tags: ["reporting", "issues", "schedule", "team", "daily"],
    source: "github/gh-aw/.github/workflows/daily-team-status.md@v0.65.7",
    trigger: "daily (weekdays 9am UTC)",
    engine: "copilot"
  },
  {
    id: "daily-issues-report",
    name: "Daily Issues Report",
    desc: "Comprehensive issues analysis with Python-generated trend charts, topic clustering, and key metrics. Posts as a GitHub Discussion.",
    tags: ["reporting", "issues", "schedule", "analytics", "charts"],
    source: "github/gh-aw/.github/workflows/daily-issues-report.md@v0.65.7",
    trigger: "daily schedule",
    engine: "codex"
  },
  {
    id: "weekly-issue-summary",
    name: "Weekly Issue Summary",
    desc: "Analyzes all issues opened in the past week. Creates a summary with trends, charts, patterns, and insights as a Discussion.",
    tags: ["reporting", "issues", "schedule", "weekly", "charts"],
    source: "github/gh-aw/.github/workflows/weekly-issue-summary.md@v0.65.7",
    trigger: "weekly (Mondays)",
    engine: "copilot"
  },
  {
    id: "org-health-report",
    name: "Organization Health Report",
    desc: "Cross-repo health analysis for an organization — activity trends, stale repos, contributor stats, and recommendations.",
    tags: ["reporting", "schedule", "org-wide", "multi-repo"],
    source: "github/gh-aw/.github/workflows/org-health-report.md@v0.65.7",
    trigger: "schedule",
    engine: "copilot"
  },

  // ── Security & Compliance ──────────────────────────────────────────
  {
    id: "security-compliance",
    name: "Security Compliance Checker",
    desc: "Audits repository configuration and workflows for security best practices — permissions, secret handling, dependency pinning, and policy compliance.",
    tags: ["security", "compliance", "schedule", "audit"],
    source: "github/gh-aw/.github/workflows/security-compliance.md@v0.65.7",
    trigger: "schedule",
    engine: "copilot"
  },
  {
    id: "code-scanning-fixer",
    name: "Code Scanning Fixer",
    desc: "Picks up code scanning alerts (CodeQL, etc.) and attempts to create PRs that fix the identified vulnerabilities.",
    tags: ["security", "prs", "code-scanning", "auto-fix"],
    source: "github/gh-aw/.github/workflows/code-scanning-fixer.md@v0.65.7",
    trigger: "schedule",
    engine: "copilot"
  },
  {
    id: "daily-malicious-code-scan",
    name: "Daily Malicious Code Scan",
    desc: "Scans the codebase for suspicious patterns — obfuscated code, credential exposure, supply chain indicators, and backdoor signatures.",
    tags: ["security", "schedule", "scanning"],
    source: "github/gh-aw/.github/workflows/daily-malicious-code-scan.md@v0.65.7",
    trigger: "daily schedule",
    engine: "copilot"
  },

  // ── Repository Maintenance ─────────────────────────────────────────
  {
    id: "stale-repo-identifier",
    name: "Stale Repository Identifier",
    desc: "Analyzes repositories across an organization to find inactive ones. Creates detailed activity reports with archive/maintain/investigate recommendations.",
    tags: ["maintenance", "org-wide", "multi-repo", "schedule", "stale"],
    source: "github/gh-aw/.github/workflows/stale-repo-identifier.md@v0.65.7",
    trigger: "monthly schedule",
    engine: "copilot"
  },
  {
    id: "draft-pr-cleanup",
    name: "Draft PR Cleanup",
    desc: "Identifies stale draft PRs and suggests closing or updating them to keep the PR list clean.",
    tags: ["maintenance", "prs", "cleanup", "schedule"],
    source: "github/gh-aw/.github/workflows/draft-pr-cleanup.md@v0.65.7",
    trigger: "schedule",
    engine: "copilot"
  },
  {
    id: "dependabot-burner",
    name: "Dependabot Burner",
    desc: "Analyzes and processes Dependabot PRs — batches compatible updates, validates changelogs, and recommends merge order.",
    tags: ["maintenance", "dependencies", "prs", "schedule"],
    source: "github/gh-aw/.github/workflows/dependabot-burner.md@v0.65.7",
    trigger: "schedule",
    engine: "copilot"
  },

  // ── Multi-Repo & Org ───────────────────────────────────────────────
  {
    id: "discussion-task-miner",
    name: "Discussion Task Miner",
    desc: "Mines GitHub Discussions for actionable tasks and converts them into trackable issues with context and links.",
    tags: ["issues", "discussions", "schedule", "task-extraction"],
    source: "github/gh-aw/.github/workflows/discussion-task-miner.md@v0.65.7",
    trigger: "schedule",
    engine: "copilot"
  },

  // ── Teamwork & Culture ─────────────────────────────────────────────
  {
    id: "poem-bot",
    name: "Poem Bot",
    desc: "Creates original poetry about repository events — blending coding concepts with poetic imagery. Supports haiku, limerick, sonnet, and free verse. A fun way to boost team morale.",
    tags: ["culture", "fun", "comments", "issues"],
    source: "github/gh-aw/.github/workflows/poem-bot.md@v0.65.7",
    trigger: "slash command (/poem-bot) + manual",
    engine: "copilot"
  },
  {
    id: "delight",
    name: "Delight Agent",
    desc: "Scans user-facing aspects (docs, CLI help text, error messages, workflow messages) and proposes single-file improvements to clarity, usability, and professionalism.",
    tags: ["culture", "ux", "docs", "code-quality", "schedule"],
    source: "github/gh-aw/.github/workflows/delight.md@v0.65.7",
    trigger: "daily schedule",
    engine: "copilot"
  },
  {
    id: "daily-fact",
    name: "Daily Fun Fact",
    desc: "Posts a fun daily fact or trivia about the repository, tech, or team to keep things engaging and lighthearted.",
    tags: ["culture", "fun", "schedule"],
    source: "github/gh-aw/.github/workflows/daily-fact.md@v0.65.7",
    trigger: "daily schedule",
    engine: "copilot"
  },

  // ── Interactive & ChatOps ──────────────────────────────────────────
  {
    id: "q",
    name: "Q — Workflow Optimizer",
    desc: "Invoked with /q in issues, PRs, or discussions. Analyzes workflow logs, detects missing tools, permission errors, and inefficiencies. Creates a PR with optimizations.",
    tags: ["chatops", "optimization", "prs", "interactive"],
    source: "github/gh-aw/.github/workflows/q.md@v0.65.7",
    trigger: "slash command (/q)",
    engine: "copilot"
  },
  {
    id: "plan",
    name: "Planning Assistant",
    desc: "Invoked with /plan in issues or discussions. Breaks down a task into up to 5 actionable sub-issues that can be assigned to Copilot coding agent.",
    tags: ["chatops", "planning", "issues", "interactive", "project"],
    source: "github/gh-aw/.github/workflows/plan.md@v0.65.7",
    trigger: "slash command (/plan)",
    engine: "copilot"
  },
  {
    id: "research",
    name: "Research Agent",
    desc: "Invoked manually with a topic. Performs web research using Tavily search, analyzes results, and creates a Discussion with a concise summary and sources.",
    tags: ["chatops", "research", "interactive", "discussions"],
    source: "github/gh-aw/.github/workflows/research.md@v0.65.7",
    trigger: "manual (workflow_dispatch)",
    engine: "copilot"
  },

  // ── Testing & Validation ───────────────────────────────────────────
  {
    id: "daily-testify-uber-super-expert",
    name: "Test Quality Expert",
    desc: "Analyzes one Go test file daily. Evaluates test quality against testify best practices, identifies coverage gaps, and creates an issue with specific improvement recommendations.",
    tags: ["testing", "code-quality", "issues", "schedule"],
    source: "github/gh-aw/.github/workflows/daily-testify-uber-super-expert.md@v0.65.7",
    trigger: "daily schedule",
    engine: "copilot"
  },
  {
    id: "refiner",
    name: "Code Refiner",
    desc: "Triggered when a PR is labeled 'refine'. Aligns code with repo conventions, scans for security issues, adds/improves tests, and creates a refinement PR with all fixes.",
    tags: ["testing", "prs", "code-quality", "security", "review"],
    source: "github/gh-aw/.github/workflows/refiner.md@v0.65.7",
    trigger: "PR labeled 'refine'",
    engine: "copilot"
  },

  // ── Tool & Infrastructure ──────────────────────────────────────────
  {
    id: "workflow-health-manager",
    name: "Workflow Health Manager",
    desc: "Monitors the health of all agentic workflows in the repo — tracks failures, success rates, and run times. Creates issues for workflows that need attention.",
    tags: ["infrastructure", "monitoring", "schedule", "issues"],
    source: "github/gh-aw/.github/workflows/workflow-health-manager.md@v0.65.7",
    trigger: "schedule",
    engine: "copilot"
  },
  {
    id: "instructions-janitor",
    name: "Instructions Janitor",
    desc: "Keeps .instructions.md and agent configuration files clean and consistent — fixes formatting issues, validates references, and ensures best practices.",
    tags: ["infrastructure", "maintenance", "schedule"],
    source: "github/gh-aw/.github/workflows/instructions-janitor.md@v0.65.7",
    trigger: "schedule",
    engine: "copilot"
  },

  // ── Multi-Phase Improvers ──────────────────────────────────────────
  {
    id: "repository-quality-improver",
    name: "Repository Quality Improver",
    desc: "Each day selects a different focus area (code quality, docs, testing, security, performance, custom areas) and creates a discussion with 3-5 actionable improvement tasks.",
    tags: ["multi-phase", "code-quality", "schedule", "improvement"],
    source: "github/gh-aw/.github/workflows/repository-quality-improver.md@v0.65.7",
    trigger: "daily schedule (weekdays)",
    engine: "copilot"
  },

  // ── Project Coordination ───────────────────────────────────────────
  {
    id: "daily-assign-issue-to-user",
    name: "Daily Issue Assigner",
    desc: "Automatically assigns unassigned issues to appropriate team members based on expertise, workload, and issue context.",
    tags: ["project", "issues", "schedule", "assignment"],
    source: "github/gh-aw/.github/workflows/daily-assign-issue-to-user.md@v0.65.7",
    trigger: "daily schedule",
    engine: "copilot"
  },

  // ── Advanced Analytics & ML ────────────────────────────────────────
  {
    id: "agent-performance-analyzer",
    name: "Agent Performance Analyzer",
    desc: "Meta-orchestrator that evaluates AI agent quality, effectiveness, and behavior across all workflows. Ranks agents, detects patterns, and recommends prompt improvements.",
    tags: ["analytics", "ml", "schedule", "meta", "performance"],
    source: "github/gh-aw/.github/workflows/agent-performance-analyzer.md@v0.65.7",
    trigger: "daily schedule",
    engine: "copilot"
  },
  {
    id: "daily-code-metrics",
    name: "Daily Code Metrics",
    desc: "Tracks comprehensive code metrics — LOC by language, test coverage ratios, code churn, quality scores — with 6 Python-generated visualization charts and 30-day trend analysis.",
    tags: ["analytics", "ml", "schedule", "charts", "metrics"],
    source: "github/gh-aw/.github/workflows/daily-code-metrics.md@v0.65.7",
    trigger: "daily schedule",
    engine: "claude"
  },
  {
    id: "copilot-session-insights",
    name: "Copilot Session Insights",
    desc: "Analyzes Copilot coding agent session data — token usage, tool call patterns, success rates — to find optimization opportunities across workflows.",
    tags: ["analytics", "ml", "schedule", "optimization"],
    source: "github/gh-aw/.github/workflows/copilot-session-insights.md@v0.65.7",
    trigger: "daily schedule",
    engine: "copilot"
  }
];
