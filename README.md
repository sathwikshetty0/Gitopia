# ⚡ Gitopia Learn Git Like a Game

> **A fully interactive, gamified Git learning app built with React + Vite.**
> Master Git from `git init` to open-source contributions — through missions, a live terminal simulator, and a visual commit graph.

![Gitopia Dashboard](./docs/dashboard.png)

---

## 🎮 What is Gitopia?

Gitopia turns learning Git into a hacker-themed mission game. Instead of reading documentation, you:

- **Run real Git commands** in a simulated terminal
- **Watch the commit graph update** in real time
- **Earn XP and badges** as you progress
- **Unlock new modules** in a progression tree

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
| **② Challenges** | Interactive challenges (5 types) that teach the concept hands-on |
| **③ Reward** | Animated XP counter, level-up check, badge unlock |

### 🖥️ Interactive Terminal
- Fake bash prompt with blinking cursor
- Validates your command against expected answers
- Red border flash on wrong input, green glow on success
- Hint system (costs −10 XP each)

### 🌿 Live Commit Graph
- Powered by **React Flow** (`@xyflow/react`)
- Visualizes commits, branches, merges, and rebases per module
- Step-by-step graph progression during briefing
- Branch-colored edges (main = green, feature = blue, merge = purple)

### 🎯 5 Challenge Types
| Type | Description |
|------|-------------|
| `terminal` | Type a Git command in the simulator |
| `multiple_choice` | Pick the right answer (wrong attempts cost 5 XP each) |
| `scenario` | Real-world Git situation, choose the correct approach |
| `order` | Click to arrange Git steps in the correct sequence |
| `fix_command` | Find and fix the broken Git command |
| `fix_conflict` | Edit a merge conflict and remove all markers |

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

*Note: Achieving "Git God" requires acquiring maximum available XP across all modules. Requesting hints will drain XP!*

- **11 badges**: one per module + completion badge
- **Streak counter**: days in a row
- **Stats**: commands run, hints used, missions completed

### 👾 Player Profile
- Custom username (editable, no concatenation bugs!)
- 12 avatar options
- Achievement gallery with locked/earned states
- Full stats breakdown

### 📡 Git Command Database
- Searchable catalog of all core Git commands
- Syntax examples and usage descriptions
- One-click copy to clipboard

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
| **React 18** | UI framework |
| **Vite** | Build tool and dev server |
| **@xyflow/react** | Commit graph visualization |
| **Framer Motion** | Page transitions, card animations, reward screen |
| **CSS Variables** | Full design system (no Tailwind, no CSS-in-JS) |
| **localStorage** | Game state persistence |
| **Press Start 2P** | Pixel-style heading font (Google Fonts) |
| **Fira Code** | Monospace code/terminal font (Google Fonts) |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### Install & Run

```bash
# Clone the repo
git clone https://github.com/yourusername/Gitopia.git
cd Gitopia

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

---

## 📁 Project Structure

```
Gitopia/
├── index.html                    # Entry HTML, Google Fonts links
├── src/
│   ├── main.jsx                  # React root
│   ├── App.jsx                   # Router, localStorage persistence, layout
│   ├── index.css                 # Full design system (CSS variables, animations)
│   │
│   ├── data/
│   │   └── gameData.js           # All 10 modules, challenges, badges, levels
│   │
│   ├── state/
│   │   └── gameState.js          # useReducer state + all actions
│   │
│   └── components/
│       ├── Dashboard.jsx         # Mission map + profile sidebar
│       ├── MissionScreen.jsx     # 3-phase mission flow + all challenge types
│       ├── Navbar.jsx            # Sticky top nav with player info
│       ├── Profile.jsx           # Player profile, avatar picker, badge gallery
│       ├── Reference.jsx         # Searchable Git database
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
- [ ] **Mobile layout** — responsive mission cards
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
