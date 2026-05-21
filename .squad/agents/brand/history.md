# Brand — History

## Project Context

- **Project:** snake-game — Browser-based canvas snake game
- **Stack:** HTML, CSS, JavaScript, Canvas API, Git, GitHub
- **User:** Emil Verwoerd
- **Team:** Mikey (Lead), Data (Game Dev), Chunk (Tester), Mouth (E2E), Emil (Product Owner)

## Learnings

### 2026-05-21 — Initial Repo Setup & PR Workflow

- Created public GitHub repo `emilverwoerd/snake-game` using `gh repo create --source . --push=false`
- Workflow: commit README on `main` first, then feature branch for all game code — keeps main clean for PR base
- `.gitignore` must be committed before staging to prevent `node_modules/` from being tracked
- Used `git add` with explicit paths (never `git add .`) for safety
- PowerShell backtick escaping breaks `gh pr create --body`; use `--body-file` with a temp .md file instead
- PR #1: `feature/neon-snake-game` → `main` with full feature list and architecture docs
- Repo URL: https://github.com/emilverwoerd/snake-game
- PR URL: https://github.com/emilverwoerd/snake-game/pull/1
