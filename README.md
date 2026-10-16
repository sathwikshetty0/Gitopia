# ⚡ Gitopia Learn Git Like a Game

> **A mobile-friendly, gamified Git learning app built with React and Vite.**
> Learn Git from `git init` to open-source contributions with guided missions, an interactive terminal simulator, and visual commit graphs.

![Gitopia Dashboard](./docs/dashboard.png)

---

## 🎮 What is Gitopia?

Gitopia turns learning Git into a hacker-themed mission game. Instead of only reading documentation, you:

- **Practice Git commands** in a simulated terminal; commands are checked against each challenge, not run on your computer
- **Explore visual commit graphs** that explain commits, branches, merges, and rebases
- **Earn XP and badges** as you progress
- **Unlock new modules** in a progression tree
- **Look up commands** in a searchable cheat sheet and copy commands or examples

The aesthetic is inspired by **Hacknet**, **GitHub CLI**, and cyberpunk HUD dashboards — dark terminal theme, neon green accents, glassmorphism panels, and pixel fonts.

---

## ✨ Features

### 🗺️ Mission Map (Skill Tree)
- 10 progressive learning modules, locked until prerequisites are completed
- Each mission card shows XP reward, completion status, and difficulty

### 📋 3-Phase Mission Flow
| Phase | What Happens |
|-------|-------------|
| **① Briefing** | Animated line-by-line reveal of key concepts + ASCII diagram + live commit graph |
| **② Challenges** | Interactive challenges (6 types) that teach the concept hands-on |
| **③ Reward** | Animated XP counter, level-up check, badge unlock |

### 🖥️ Interactive Terminal Simulator
- Fake bash prompt with blinking cursor
- Validates your command against expected answers
- Red border flash on wrong input, green glow on success
- Hints and attempt/time penalties are reflected in challenge scores

### 🌿 Live Commit Graph
- Powered by **React Flow** (`@xyflow/react`)
- Visualizes commits, branches, merges, and rebases per module
- Step-by-step graph progression during briefing
- Branch-colored edges (main = green, feature = blue, merge = purple)

### 🎯 Challenge Types
| Type | Description |
|------|-------------|
| `terminal` | Type a Git command in the simulator |
| `multiple_choice` | Pick the right answer (wrong attempts cost 5 XP each) |
| `scenario` | Real-world Git situation, choose the correct approach |
| `order` | Click to arrange Git steps in the correct sequence |
| `fix_command` | Find and fix the broken Git command |
| `fix_conflict` | Edit a merge conflict and remove all markers |

### 📊 Scoring
- Challenge XP weights are normalized to the mission's advertised reward.
- Incorrect attempts, hints, and elapsed time reduce the challenge score; scores never go below zero.
- A perfect first-time completion awards the mission's listed XP. Replaying a completed mission does not award XP again.
- The current missions offer a total of **2,450 XP** across all first-time completions.

### 🏆 Progression System

**12 Ranks & Required XP:**

| Rank | Title | Required XP |
|------|-------|-------------|
| 1 | Git Rookie | 0 XP |
| 2 | Commit Cadet | 150 XP |
| 3 | Branch Scout | 400 XP |
| 4 | Merge Apprentice | 750 XP |
| 5 | Commit Knight | 1200 XP |
| 6 | Branch Paladin | 1700 XP |
| 7 | Rebase Ranger | 2200 XP |
| 8 | Conflict Slayer | 2700 XP |
| 9 | Remote Warrior | 3300 XP |
| 10 | Merge Master | 3900 XP |
| 11 | Git Ninja | 4300 XP |
| 12 | Git God | 4600 XP |

*With the current mission rewards, a perfect run across every mission awards 2,450 XP. Levels above the 2,200 XP Rebase Ranger threshold are not currently reachable through mission XP.*

- **11 badges**: one per module + completion badge
- **Streak stat** displayed in the player profile
- **Stats**: commands run, hints used, missions completed

### 👾 Player Profile
- Custom username (editable, no concatenation bugs!)
- 12 avatar options
- Achievement gallery with locked/earned states
- Full stats breakdown

### 📡 Git Command Database
- Searchable catalog of all core Git commands
- Syntax examples and usage descriptions
- Dedicated copy buttons for commands and examples, with copy feedback
- Filter by command category

### 📱 Responsive UI and visibility pause
- Dashboard, missions, profile, cheat sheet, and certificate layouts adapt to mobile screens.
- The app pauses visually while its browser tab is hidden and resumes when the tab becomes visible.
- The visibility pause is a user-experience feature, not screenshot protection or a security boundary.

### 🏅 Certificate
- Generate and print a certificate after completing all 10 modules.
- Certificate details require a name, email, section, and feedback.

### 💾 Persistence
- All progress saved to **localStorage**
- Survives page refresh and browser restarts

---

## 📚 The 10 Modules

| # | Module | XP | Key Concepts |
|---|--------|----|-------------|
| 1 | 📂 Git Foundations | 100 | `git init`, `git status`, `git log` |
| 2 | 📸 Staging & Commits | 150 | `git add`, `git commit`, staging area |
| 3 | 🌿 Branching | 200 | `git branch`, `git switch`, HEAD |
| 4 | 🔀 Merging | 250 | Fast-forward vs 3-way, `git merge` |
| 5 | 🌍 Remote Repositories | 200 | `git remote`, `git push`, `git pull`, `git fetch` |
| 6 | 🔍 Pull Requests | 200 | PR workflow, draft PRs, review cycle |
| 7 | ⚔️ Conflict Resolution | 300 | Merge markers, resolving conflicts |
| 8 | 🔄 Rebasing | 350 | `git rebase`, interactive rebase, golden rule |
| 9 | 🤝 Collaboration Workflows | 300 | Git Flow, GitHub Flow, conventional commits |
| 10 | 🏆 Open Source Contribution | 400 | Forking, upstream remotes, signing commits |

---

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| **React 19** | UI framework |
| **Vite** | Build tool and dev server |
| **@xyflow/react** | Commit graph visualization |
| **Framer Motion** | Page transitions, card animations, and reward screen |
| **CSS Variables** | Full design system (no Tailwind, no CSS-in-JS) |
| **localStorage** | Game state persistence |
| **Press Start 2P** | Pixel-style heading font (Google Fonts) |
| **Fira Code** | Monospace code/terminal font (Google Fonts) |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20.19+ or 22.12+ (required by Vite 8)
- npm

### Install & Run

```bash
# Clone the repo
git clone https://github.com/sathwikshetty0/Gitopia.git
cd Gitopia

# Install dependencies
npm ci

# Start the dev server
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

### Tests and lint

The scoring and game-state tests use Node's built-in test runner:

```bash
node --test src/state/scoring.test.js src/state/gameState.test.js
```

Run ESLint with:

```bash
npm run lint
```

---

## 📁 Project Structure

```
Gitopia/
├── index.html                    # Entry HTML, Google Fonts links
├── src/
│   ├── main.jsx                  # React root
│   ├── App.jsx                   # App shell, persistence, tab-visibility pause
│   ├── index.css                 # Design system and responsive layouts
│   │
│   ├── data/
│   │   └── gameData.js           # Modules, challenges, badges, levels, cheat sheet
│   │
│   ├── state/
│   │   ├── gameState.js          # useReducer state and actions
│   │   ├── gameState.test.js     # Reducer tests
│   │   ├── scoring.js            # Mission/challenge score calculation
│   │   └── scoring.test.js       # Score allocation and penalty tests
│   │
│   └── components/
│       ├── Dashboard.jsx         # Mission map + profile sidebar
│       ├── MissionScreen.jsx     # 3-phase mission flow + all challenge types
│       ├── Navbar.jsx            # Sticky top nav with player info
│       ├── Profile.jsx           # Player profile, avatar picker, badge gallery
│       ├── Reference.jsx         # Searchable Git cheat sheet and copy controls
│       ├── Certification.jsx     # Certificate verification and print view
│       └── shared/
│           ├── Terminal.jsx      # Interactive terminal simulator
│           ├── CommitGraph.jsx   # React Flow commit graph
│           └── XPBar.jsx         # XP progress bar + level badge
```

---

## 🎨 Design System

The entire UI is built on a CSS variable design system in `src/index.css`:

```css
--bg:       #0d1117   /* GitHub dark background */
--neon:     #39ff14   /* Neon green accent */
--blue:     #58a6ff   /* GitHub blue */
--gold:     #f0c040   /* XP / badge gold */
--red:      #ff4d4d   /* Error / conflict red */
--purple:   #bd93f9   /* Dracula purple */

--font-pixel: 'Press Start 2P'  /* HUD headings */
--font-code:  'Fira Code'       /* Everything else */

--glow-neon: 0 0 8px rgba(57,255,20,0.6), 0 0 24px rgba(57,255,20,0.2)
```

### Key UI Patterns
- **Glassmorphism** cards: `backdrop-filter: blur(10px)` + semi-transparent background
- **Neon glows** on active elements via CSS `box-shadow`
- **Framer Motion** for all page transitions (150ms exit, 250ms enter)
- **Blinking cursor** animation in terminal (`@keyframes blink`)
- **XP bar fill** with `cubic-bezier(0.22, 1, 0.36, 1)` smooth spring

---

## 🗺️ Roadmap

- [ ] **Real terminal history** with ↑ arrow key navigation
- [ ] **Animated commit graph updates** when terminal commands succeed
- [ ] **Global Git AI assistant** — ask questions mid-mission
- [ ] **GitHub OAuth** — real leaderboard with GitHub profiles
- [ ] **Daily challenge** — one Git puzzle per day
- [ ] **Sound effects** — terminal keystrokes, XP gain, level-up fanfare

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit with conventional commits: `git commit -m "feat: add daily challenge"`
4. Push and open a PR

---

## 📄 License

MIT © 2026 — Built with ⚡ and too much `git rebase`
