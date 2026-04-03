# Discover Agentic Workflows

An interactive web app that helps you discover the right [GitHub Agentic Workflow](https://github.com/github/gh-aw) for your project. Answer a short series of questions about your goals — issue triage, code quality, CI/CD, documentation, security, and more — and get a tailored recommendation with links to the source workflow.

## How It Works

1. **Pick a category** — Choose a broad area: code & docs, issues & PRs, security & ops, or reporting & culture.
2. **Refine your goal** — Select a specific goal within that category (e.g. "Improve code quality" → "Find and remove dead/unreachable code").
3. **Get a recommendation** — The app matches your answers against a tagged database of 30+ agentic workflows and surfaces the best fit.
4. **Review details** — Each recommendation includes a description, trigger type, a direct link to the workflow source, and a copy-to-clipboard install command.

## Workflows Covered

The workflow database spans many categories including:

- **Issue & PR Management** — Auto-triage, AI code review, content moderation
- **Code Quality** — Code simplification, dead code removal, duplicate detection, breaking change checks, linting
- **CI/CD** — Failure investigation, health analysis
- **Documentation** — Auto-update docs, gap detection, technical writing
- **Security** — Security audits, code scanning auto-fix, malicious code detection
- **Reporting** — Daily summaries, issue analytics, org-wide health dashboards
- **Maintenance** — Stale repo detection, draft PR cleanup, Dependabot batching
- **ChatOps** — Slash commands for optimization, planning, research, and reviews
- **Testing** — Coverage improvement, PR refinement
- **Analytics** — Agent performance scores, codebase metrics, Copilot insights

## Tech Stack

Pure client-side HTML, CSS, and JavaScript — no build step or dependencies. Open `index.html` in a browser to run it.

- [index.html](index.html) — Page structure
- [style.css](style.css) — Styling inspired by the [gh-aw docs site](https://github.github.com/gh-aw/)
- [app.js](app.js) — Question tree and recommendation logic
- [workflows.js](workflows.js) — Tagged workflow database

## Data Sources

All workflows are sourced from the official Agentic Workflows repository at https://github.com/github/gh-aw/tree/v0.65.7/.github/workflows.

- **Repository:** https://github.com/github/gh-aw/
- **Documentation:** https://github.github.com/gh-aw/