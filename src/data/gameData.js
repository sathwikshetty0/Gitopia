// ============================================================
//  GitQuest — All quiz/module data
// ============================================================

export const LEVELS = [
    { level: 1, minXP: 0, title: 'Git Rookie' },
    { level: 2, minXP: 100, title: 'Commit Cadet' },
    { level: 3, minXP: 250, title: 'Branch Scout' },
    { level: 4, minXP: 500, title: 'Merge Apprentice' },
    { level: 5, minXP: 800, title: 'Commit Knight' },
    { level: 6, minXP: 1200, title: 'Branch Paladin' },
    { level: 7, minXP: 1700, title: 'Rebase Ranger' },
    { level: 8, minXP: 2300, title: 'Conflict Slayer' },
    { level: 9, minXP: 3000, title: 'Remote Warrior' },
    { level: 10, minXP: 3800, title: 'Merge Master' },
    { level: 15, minXP: 6000, title: 'Git Ninja' },
    { level: 20, minXP: 10000, title: 'Git God' },
];

export function getLevelInfo(xp) {
    let current = LEVELS[0];
    let next = LEVELS[1];
    for (let i = 0; i < LEVELS.length; i++) {
        if (xp >= LEVELS[i].minXP) {
            current = LEVELS[i];
            next = LEVELS[i + 1] || null;
        }
    }
    const progress = next
        ? ((xp - current.minXP) / (next.minXP - current.minXP)) * 100
        : 100;
    return { current, next, progress };
}

export const BADGES = [
    { id: 'first_commit', icon: '🌱', name: 'First Commit', desc: 'Complete Git Foundations' },
    { id: 'staged', icon: '📦', name: 'Staging Master', desc: 'Complete Staging & Commits' },
    { id: 'branch_master', icon: '🌿', name: 'Branch Master', desc: 'Complete Branching module' },
    { id: 'merge_warrior', icon: '⚔️', name: 'Merge Warrior', desc: 'Complete Merging module' },
    { id: 'remote_hero', icon: '🌍', name: 'Remote Hero', desc: 'Complete Remotes module' },
    { id: 'code_reviewer', icon: '🔍', name: 'Code Reviewer', desc: 'Complete Pull Requests' },
    { id: 'conflict_slayer', icon: '💥', name: 'Conflict Slayer', desc: 'Complete Conflict Resolution' },
    { id: 'rebase_ninja', icon: '🔄', name: 'Rebase Ninja', desc: 'Complete Rebasing module' },
    { id: 'collab_pro', icon: '🤝', name: 'Collab Pro', desc: 'Complete Collaboration Workflows' },
    { id: 'oss_hero', icon: '🏆', name: 'Open Source Hero', desc: 'Complete Open Source module' },
    { id: 'git_god', icon: '⚡', name: 'Git God', desc: 'Complete all modules' },
];

// ============================================================
//  MODULES
// ============================================================

export const MODULES = [
    // ──────────────────────────────────────────────────────────
    {
        id: 'git_foundations',
        title: 'Git Foundations',
        subtitle: 'What is version control?',
        icon: '📂',
        rewardXP: 100,
        badgeId: 'first_commit',
        deps: [],
        color: '#39ff14',
        briefing: {
            title: 'MISSION BRIEFING: Git Foundations',
            lines: [
                'Git is a distributed version control system.',
                'It tracks every change to your code over time.',
                'A repository (repo) is Git\'s database for a project.',
                'git init  ────────►  creates a new repo in any folder.',
                'git log   ────────►  shows the list of past commits.',
            ],
            ascii: `
   Project Folder
        │
        ▼
  ┌─────────────────┐
  │ Git Repo (.git) │
  └─────────────────┘
        │
        ● Initial Commit  ← HEAD
      `
        },
        challenges: [
            {
                id: 'c1',
                type: 'terminal',
                instruction: 'Initialize a new Git repository in your project folder.',
                prompt: 'project/',
                expected: ['git init'],
                successMsg: 'Initialized empty Git repository! .git folder created.',
                hints: ['The command starts with git', 'Think: git ___t'],
                xp: 30,
            },
            {
                id: 'c2',
                type: 'multiple_choice',
                question: 'What does `git status` show you?',
                options: [
                    'The list of all commits ever made',
                    'Current state of your working directory and staging area',
                    'All remote repositories',
                    'Shows who wrote each line of code',
                ],
                correct: 1,
                hints: ['It shows what\'s changed and what\'s staged'],
                xp: 30,
            },
            {
                id: 'c3',
                type: 'multiple_choice',
                question: 'Which command shows the history of commits?',
                options: ['git history', 'git show', 'git log', 'git trace'],
                correct: 2,
                hints: ['Like a ship\'s log — it records what happened'],
                xp: 40,
            },
        ],
        graphSteps: [
            { nodes: [{ id: 'a', label: 'Init', x: 100, y: 80, branch: 'main', isHead: true }], edges: [] },
        ],
    },

    // ──────────────────────────────────────────────────────────
    {
        id: 'staging_commits',
        title: 'Staging & Commits',
        subtitle: 'Add  ────────►  Commit  ────────►  Repeat',
        icon: '📸',
        rewardXP: 150,
        badgeId: 'staged',
        deps: ['git_foundations'],
        color: '#39ff14',
        briefing: {
            title: 'MISSION BRIEFING: Staging & Commits',
            lines: [
                'The staging area is a checkpoint before committing.',
                'git add <file>   ────────►  moves changes into staging.',
                'git commit -m "msg"   ────────►  saves a permanent snapshot.',
                'Each commit gets a unique SHA hash (e.g. a3f4bc2).',
                'git push  ────────►  uploads your commits to a remote server.',
                'Think of it as: edit  ────────►  stage  ────────►  save for history.',
            ],
            ascii: `
 Working Dir      Staging Area       Repository
    ┌────┐           ┌────┐           ┌────┐
    │ ✏  │  git add  │ 📦  │  commit  │●──●│
    │    │  ───────► │    │  ───────► │    │
    └────┘           └────┘           └────┘
      `
        },
        challenges: [
            {
                id: 'c1',
                type: 'order',
                question: 'Put these Git commands in the correct workflow order:',
                items: ['git commit -m "feat"', 'git add index.js', 'git status', 'git push origin main'],
                correct: ['git status', 'git add index.js', 'git commit -m "feat"', 'git push origin main'],
                hints: ['Always check status first', 'Stage before you commit'],
                xp: 50,
            },
            {
                id: 'c2',
                type: 'terminal',
                instruction: 'Stage ALL changed files for commit.',
                prompt: 'project/',
                expected: ['git add .', 'git add -A'],
                successMsg: 'All files staged! Ready to commit.',
                hints: ['A single dot . means "everything"', 'git add .'],
                xp: 40,
            },
            {
                id: 'c3',
                type: 'fix_command',
                question: 'Spot the bug in this commit command:',
                broken: 'git comit -m "fix bug"',
                correct: 'git commit -m "fix bug"',
                hints: ['Check the spelling of "commit"'],
                xp: 60,
            },
        ],
        graphSteps: [
            {
                nodes: [
                    { id: 'a', label: 'C1', x: 80, y: 80, branch: 'main', isHead: true },
                ], edges: []
            },
            {
                nodes: [
                    { id: 'a', label: 'C1', x: 80, y: 80, branch: 'main' },
                    { id: 'b', label: 'C2', x: 200, y: 80, branch: 'main', isHead: true },
                ], edges: [{ from: 'a', to: 'b' }]
            },
        ],
    },

    // ──────────────────────────────────────────────────────────
    {
        id: 'branching',
        title: 'Branching',
        subtitle: 'Parallel universes for your code',
        icon: '🌿',
        rewardXP: 200,
        badgeId: 'branch_master',
        deps: ['staging_commits'],
        color: '#58a6ff',
        briefing: {
            title: 'MISSION BRIEFING: Branching',
            lines: [
                'A branch is a pointer to a specific commit.',
                'main is the default branch (or master in older repos).',
                'git branch feature   ────────►  creates a new branch.',
                'git switch feature   ────────►  moves HEAD to that branch.',
                'git checkout <branch>  ────────►  older way to switch branches.',
                'git checkout -b <name>  ────────►  creates AND switches in one go.',
                'Branches are cheap and fast! Use them liberally.',
            ],
            ascii: `
 main  ──●──●──●
              \\
 feature       ●──●
      `
        },
        challenges: [
            {
                id: 'c1',
                type: 'terminal',
                instruction: 'Create a new branch called "feature-login".',
                prompt: 'project/ (main)',
                expected: ['git branch feature-login', 'git checkout -b feature-login', 'git switch -c feature-login'],
                successMsg: 'Branch "feature-login" created!',
                hints: ['git branch <name>', 'or use git checkout -b <name>'],
                xp: 40,
            },
            {
                id: 'c2',
                type: 'terminal',
                instruction: 'Switch to the "feature-login" branch.',
                prompt: 'project/ (main)',
                expected: ['git switch feature-login', 'git checkout feature-login'],
                successMsg: 'You are now on branch feature-login!',
                hints: ['git switch <branchname>', 'or git checkout <branchname>'],
                xp: 40,
            },
            {
                id: 'c3',
                type: 'multiple_choice',
                question: 'What does HEAD point to in Git?',
                options: [
                    'The first commit ever made',
                    'The currently checked-out commit or branch',
                    'The remote repository URL',
                    'The last pushed commit',
                ],
                correct: 1,
                hints: ['HEAD is "where you are right now"'],
                xp: 50,
            },
            {
                id: 'c4',
                type: 'multiple_choice',
                question: 'How do you delete a branch that has been merged?',
                options: ['git branch --remove', 'git branch -d feature', 'git delete feature', 'git rm -branch feature'],
                correct: 1,
                hints: ['The flag is a lowercase -d'],
                xp: 70,
            },
        ],
        graphSteps: [
            {
                nodes: [
                    { id: 'a', label: 'C1', x: 80, y: 80, branch: 'main' },
                    { id: 'b', label: 'C2', x: 200, y: 80, branch: 'main', isHead: true },
                ], edges: [{ from: 'a', to: 'b' }]
            },
            {
                nodes: [
                    { id: 'a', label: 'C1', x: 80, y: 80, branch: 'main' },
                    { id: 'b', label: 'C2', x: 200, y: 80, branch: 'main' },
                    { id: 'c', label: 'F1', x: 320, y: 160, branch: 'feature', isHead: true },
                ], edges: [{ from: 'a', to: 'b' }, { from: 'b', to: 'c' }]
            },
        ],
    },

    // ──────────────────────────────────────────────────────────
    {
        id: 'merging',
        title: 'Merging',
        subtitle: 'Bring branches back together',
        icon: '🔀',
        rewardXP: 250,
        badgeId: 'merge_warrior',
        deps: ['branching'],
        color: '#bd93f9',
        briefing: {
            title: 'MISSION BRIEFING: Merging',
            lines: [
                'Merging combines two branch histories.',
                'git merge feature  ────────►  applies feature changes onto current branch.',
                'Fast-forward merge: no divergence, pointer just moves.',
                'Three-way merge: creates a new merge commit.',
                'Always merge INTO the target branch (e.g. checkout main first).',
            ],
            ascii: `
 main  ──●──●──────●  ← merge commit
              \\  /
 feature       ●──●
      `
        },
        challenges: [
            {
                id: 'c1',
                type: 'scenario',
                situation: 'You have finished work on "feature-ui" branch. You want to bring those changes into main.',
                question: 'What is the CORRECT sequence of commands?',
                options: [
                    'git merge feature-ui (while on feature-ui)',
                    'git checkout main  ────────►  git merge feature-ui',
                    'git push feature-ui  ────────►  git pull main',
                    'git merge main (while on feature-ui)',
                ],
                correct: 1,
                hints: ['You must be ON the target branch', 'checkout main, then merge the feature INTO it'],
                xp: 80,
            },
            {
                id: 'c2',
                type: 'multiple_choice',
                question: 'What is a "fast-forward" merge?',
                options: [
                    'A merge that skips some commits',
                    'When the target branch has no new commits, Git just moves the pointer forward',
                    'A merge that goes backwards in history',
                    'A merge completed with no commit message',
                ],
                correct: 1,
                hints: ['No divergence occurred, so Git just fast-forwards the pointer'],
                xp: 80,
            },
            {
                id: 'c3',
                type: 'terminal',
                instruction: 'You are on main. Merge the branch called "feature-ui".',
                prompt: 'project/ (main)',
                expected: ['git merge feature-ui', 'git merge feature-ui --no-ff'],
                successMsg: 'Merge successful! feature-ui changes are now in main.',
                hints: ['git merge <branchname>'],
                xp: 90,
            },
        ],
        graphSteps: [
            {
                nodes: [
                    { id: 'a', label: 'C1', x: 80, y: 80, branch: 'main' },
                    { id: 'b', label: 'C2', x: 200, y: 80, branch: 'main' },
                    { id: 'c', label: 'F1', x: 280, y: 180, branch: 'feature' },
                    { id: 'd', label: 'F2', x: 380, y: 180, branch: 'feature', isHead: true },
                ], edges: [{ from: 'a', to: 'b' }, { from: 'b', to: 'c' }, { from: 'c', to: 'd' }]
            },
            {
                nodes: [
                    { id: 'a', label: 'C1', x: 80, y: 80, branch: 'main' },
                    { id: 'b', label: 'C2', x: 200, y: 80, branch: 'main' },
                    { id: 'c', label: 'F1', x: 280, y: 180, branch: 'feature' },
                    { id: 'd', label: 'F2', x: 380, y: 180, branch: 'feature' },
                    { id: 'e', label: 'M', x: 480, y: 80, branch: 'main', isMerge: true, isHead: true },
                ], edges: [
                    { from: 'a', to: 'b' }, { from: 'b', to: 'c' }, { from: 'c', to: 'd' },
                    { from: 'b', to: 'e' }, { from: 'd', to: 'e' }
                ]
            },
        ],
    },

    // ──────────────────────────────────────────────────────────
    {
        id: 'remotes',
        title: 'Remote Repositories',
        subtitle: 'Push to the cloud',
        icon: '🌍',
        rewardXP: 200,
        badgeId: 'remote_hero',
        deps: ['merging'],
        color: '#f0c040',
        briefing: {
            title: 'MISSION BRIEFING: Remotes',
            lines: [
                'A remote is a version of your repo hosted on the internet.',
                'GitHub, GitLab, and Bitbucket host remotes.',
                'git remote add origin <url>  ────────►  links local to remote.',
                'git push origin main  ────────►  uploads your commits.',
                'git pull  ────────►  fetch + merge remote changes into local.',
            ],
            ascii: `
 Local Repo          GitHub Remote
    ●──●──●   push►   ●──●──●
    ●──●──●   ◄pull   ●──●──●
      `
        },
        challenges: [
            {
                id: 'c1',
                type: 'multiple_choice',
                question: 'What does `git fetch` do (vs `git pull`)?',
                options: [
                    'Fetch downloads remote changes but does NOT merge them',
                    'Fetch and pull are identical',
                    'Fetch deletes the remote branch',
                    'Fetch only works with private repos',
                ],
                correct: 0,
                hints: ['Fetch = download only. Pull = fetch + merge'],
                xp: 60,
            },
            {
                id: 'c2',
                type: 'terminal',
                instruction: 'Push your local "main" branch to the remote named "origin".',
                prompt: 'project/ (main)',
                expected: ['git push origin main', 'git push'],
                successMsg: '✓ Branch pushed to origin/main!',
                hints: ['git push <remote> <branch>', 'The default remote is called "origin"'],
                xp: 60,
            },
            {
                id: 'c3',
                type: 'scenario',
                situation: 'A colleague pushed commits to main on GitHub. You want those changes locally.',
                question: 'Which command gets the latest remote changes AND merges them?',
                options: ['git fetch origin main', 'git pull origin main', 'git sync', 'git download main'],
                correct: 1,
                hints: ['Pull = fetch + merge in one step'],
                xp: 80,
            },
        ],
        graphSteps: [],
    },

    // ──────────────────────────────────────────────────────────
    {
        id: 'pull_requests',
        title: 'Pull Requests',
        subtitle: 'Collaborate through code review',
        icon: '🔍',
        rewardXP: 200,
        badgeId: 'code_reviewer',
        deps: ['remotes'],
        color: '#58a6ff',
        briefing: {
            title: 'MISSION BRIEFING: Pull Requests',
            lines: [
                'A Pull Request (PR) proposes your branch changes to be merged.',
                'Team members review your code before it lands in main.',
                'PRs are a GitHub/GitLab concept, not core Git.',
                'Workflow: branch  ────────►  commit  ────────►  push  ────────►  open PR  ────────►  review  ────────►  merge.',
                'Good PRs have a clear title, description, and small diff.',
            ],
            ascii: `
 Your Branch ──► [Open PR on GitHub] ──► Review ──► Merge to main
      `
        },
        challenges: [
            {
                id: 'c1',
                type: 'order',
                question: 'Arrange the Pull Request workflow in order:',
                items: ['Open PR on GitHub', 'git push origin feature-x', 'git commit -m "feat: add login"', 'git checkout -b feature-x', 'Team reviews & approves', 'PR merged to main'],
                correct: ['git checkout -b feature-x', 'git commit -m "feat: add login"', 'git push origin feature-x', 'Open PR on GitHub', 'Team reviews & approves', 'PR merged to main'],
                hints: ['Create branch  ────────►  commit  ────────►  push  ────────►  PR  ────────►  review  ────────►  merge'],
                xp: 80,
            },
            {
                id: 'c2',
                type: 'scenario',
                situation: 'Your PR has a requested change from the reviewer. You fix the code locally. What next?',
                question: 'How do you update the PR with your fix?',
                options: [
                    'Close the PR and open a new one',
                    'git commit the fix, then git push — the PR updates automatically',
                    'Email the reviewer directly',
                    'git merge the fix manually',
                ],
                correct: 1,
                hints: ['Pushing to the same branch automatically updates the PR'],
                xp: 70,
            },
            {
                id: 'c3',
                type: 'multiple_choice',
                question: 'What is a "draft PR"?',
                options: [
                    'A PR with no commits',
                    'A PR that signals work-in-progress, not ready for review',
                    'A deleted PR',
                    'A PR only visible to the author',
                ],
                correct: 1,
                hints: ['Draft = work in progress, alerting reviewers not to merge yet'],
                xp: 50,
            },
        ],
        graphSteps: [],
    },

    // ──────────────────────────────────────────────────────────
    {
        id: 'conflicts',
        title: 'Conflict Resolution',
        subtitle: 'Tame the merge beast',
        icon: '⚔️',
        rewardXP: 300,
        badgeId: 'conflict_slayer',
        deps: ['pull_requests'],
        color: '#ff4d4d',
        briefing: {
            title: 'MISSION BRIEFING: Conflict Resolution',
            lines: [
                'A conflict happens when two branches changed the same line.',
                'Git marks the conflicting section with <<<, ===, >>> markers.',
                'You manually edit the file to choose what to keep.',
                'Then: git add <file>  ────────►  git commit to complete the merge.',
                'Prevention: pull often, keep branches short-lived.',
            ],
            ascii: `
 <<<<<<< HEAD
 console.log("Hello")     ← your version
 =======
 console.log("Hi World")  ← incoming version
 >>>>>>> feature
      `
        },
        challenges: [
            {
                id: 'c1',
                type: 'fix_conflict',
                description: 'A merge conflict occurred. Resolve it by keeping the FEATURE branch version.',
                conflictText: `<<<<<<< HEAD
console.log("Hello from main")
=======
console.log("Hello from feature")
>>>>>>> feature`,
                correct: 'console.log("Hello from feature")',
                hints: ['Remove the conflict markers', 'Keep only the feature version'],
                xp: 100,
            },
            {
                id: 'c2',
                type: 'multiple_choice',
                question: 'After manually resolving a conflict in a file, what is the next step?',
                options: [
                    'git merge --done',
                    'git add <file>, then git commit',
                    'git checkout --ours',
                    'git push immediately',
                ],
                correct: 1,
                hints: ['Stage the resolved file then commit the merge'],
                xp: 80,
            },
            {
                id: 'c3',
                type: 'multiple_choice',
                question: 'Which command cancels an in-progress merge?',
                options: ['git merge --stop', 'git merge --abort', 'git reset --hard', 'git undo-merge'],
                correct: 1,
                hints: ['The flag is --abort'],
                xp: 70,
            },
        ],
        graphSteps: [],
    },

    // ──────────────────────────────────────────────────────────
    {
        id: 'rebasing',
        title: 'Rebasing',
        subtitle: 'Rewrite history cleanly',
        icon: '🔄',
        rewardXP: 350,
        badgeId: 'rebase_ninja',
        deps: ['conflicts'],
        color: '#bd93f9',
        briefing: {
            title: 'MISSION BRIEFING: Rebasing',
            lines: [
                'Rebase moves your branch commits to start from a new base.',
                'It creates a linear history — no merge commits.',
                'git rebase main  ────────►  replays your commits on top of main.',
                'git rebase -i  ────────►  interactive rebase (squash, edit, reorder).',
                'Golden rule: never rebase shared/public branches!',
            ],
            ascii: `
 Before:  main ──●──●     After:  main ──●──●──●──●
                  \\                              feature
                   ●──● (feature)    (linear!)
      `
        },
        challenges: [
            {
                id: 'c1',
                type: 'terminal',
                instruction: 'You are on "feature" branch. Rebase it on top of main.',
                prompt: 'project/ (feature)',
                expected: ['git rebase main'],
                successMsg: 'Feature branch replayed on top of main! Linear history achieved.',
                hints: ['git rebase <base-branch>'],
                xp: 100,
            },
            {
                id: 'c2',
                type: 'multiple_choice',
                question: 'What is the main advantage of rebasing over merging?',
                options: [
                    'Rebase is always faster',
                    'Rebase creates a clean, linear commit history',
                    'Rebase never causes conflicts',
                    'Rebase creates backup branches automatically',
                ],
                correct: 1,
                hints: ['Clean linear history — no merge commits'],
                xp: 80,
            },
            {
                id: 'c3',
                type: 'scenario',
                situation: 'You ran `git rebase main` and a conflict appeared. How do you continue?',
                question: 'After resolving the conflict and staging the file:',
                options: [
                    'git rebase --abort',
                    'git merge --continue',
                    'git rebase --continue',
                    'git commit -m "fix conflict"',
                ],
                correct: 2,
                hints: ['Same pattern as merge: resolve  ────────►  add  ────────►  continue'],
                xp: 80,
            },
        ],
        graphSteps: [],
    },

    // ──────────────────────────────────────────────────────────
    {
        id: 'collaboration',
        title: 'Collaboration Workflows',
        subtitle: 'Team Git strategies',
        icon: '🤝',
        rewardXP: 300,
        badgeId: 'collab_pro',
        deps: ['rebasing'],
        color: '#f0c040',
        briefing: {
            title: 'MISSION BRIEFING: Collaboration Workflows',
            lines: [
                'Git Flow: main + develop + feature/* + release/* + hotfix/*.',
                'GitHub Flow: simpler — branch off main, PR, merge, deploy.',
                'Trunk Based: everyone commits to main (short-lived branches).',
                'Good commit messages: feat: / fix: / chore: / docs: prefixes.',
                'Squash commits to keep history clean before merging.',
            ],
            ascii: `
 main   ──────────────●───────
                     / (merge)
 feature ──●──●──●──
      `
        },
        challenges: [
            {
                id: 'c1',
                type: 'multiple_choice',
                question: 'In GitHub Flow, what branch do you always branch off from?',
                options: ['develop', 'release', 'main', 'staging'],
                correct: 2,
                hints: ['GitHub Flow is simple: always branch from main'],
                xp: 80,
            },
            {
                id: 'c2',
                type: 'scenario',
                situation: 'Your feature branch has 8 messy commits like "fix", "fix again", "oops". Other devs will find these noisy.',
                question: 'What should you do before opening the PR?',
                options: [
                    'Push as-is, commits are fine',
                    'Interactive rebase to squash them into 1 clean commit',
                    'Delete the branch and start over',
                    'Open a draft PR only',
                ],
                correct: 1,
                hints: ['git rebase -i HEAD~8 allows you to squash commits'],
                xp: 100,
            },
            {
                id: 'c3',
                type: 'multiple_choice',
                question: 'What does a conventional commit message prefix "fix:" indicate?',
                options: ['A new feature', 'A bug fix', 'Documentation update', 'Test additions'],
                correct: 1,
                hints: ['Conventional Commits spec: feat, fix, docs, chore...'],
                xp: 70,
            },
        ],
        graphSteps: [],
    },

    // ──────────────────────────────────────────────────────────
    {
        id: 'open_source',
        title: 'Open Source Contribution',
        subtitle: 'Ship code to the world',
        icon: '🏆',
        rewardXP: 400,
        badgeId: 'oss_hero',
        deps: ['collaboration'],
        color: '#39ff14',
        briefing: {
            title: 'MISSION BRIEFING: Open Source',
            lines: [
                'Fork: copy someone\'s repo to your GitHub account.',
                'Clone: download your fork to your local machine.',
                'Create a feature branch, commit, push to YOUR fork.',
                'Open a PR from your fork  ────────►  upstream repo.',
                'Good first issues are labeled "good first issue" on GitHub.',
            ],
            ascii: `
 Upstream ──► Fork (yours) ──► Clone (local)
     ↑                               │
     └── PR ◄── push ◄── commits ◄──┘
      `
        },
        challenges: [
            {
                id: 'c1',
                type: 'order',
                question: 'Arrange the open-source contribution workflow:',
                items: [
                    'git push origin my-fix',
                    'Fork the repo on GitHub',
                    'Open a PR to the upstream repo',
                    'git clone <your-fork-url>',
                    'git checkout -b my-fix',
                    'Make changes & git commit',
                ],
                correct: [
                    'Fork the repo on GitHub',
                    'git clone <your-fork-url>',
                    'git checkout -b my-fix',
                    'Make changes & git commit',
                    'git push origin my-fix',
                    'Open a PR to the upstream repo',
                ],
                hints: ['Fork first, then clone YOUR fork', 'Push to fork, then open PR'],
                xp: 120,
            },
            {
                id: 'c2',
                type: 'multiple_choice',
                question: 'You want to keep your fork in sync with the upstream repo. What do you add?',
                options: [
                    'git remote add origin <upstream-url>',
                    'git remote add upstream <upstream-url> then git fetch upstream',
                    'git sync upstream',
                    'Only forks with push access can sync',
                ],
                correct: 1,
                hints: ['Add the upstream remote under the name "upstream"'],
                xp: 100,
            },
            {
                id: 'c3',
                type: 'scenario',
                situation: 'The upstream project\'s CONTRIBUTING.md says: "Sign your commits". How?',
                question: 'Which Git flag signs a commit with your GPG key?',
                options: ['git commit --sign', 'git commit -S', 'git commit --gpg', 'git sign -m "msg"'],
                correct: 1,
                hints: ['Capital -S flag enables GPG signing'],
                xp: 80,
            },
        ],
        graphSteps: [],
    },
];

export const MOCK_LEADERBOARD = [
    { rank: 1, avatar: '👾', username: 'ByteWizard', xp: 12450, badges: 10 },
    { rank: 2, avatar: '🤖', username: 'CodePhantom', xp: 11200, badges: 9 },
    { rank: 3, avatar: '🦊', username: 'NullPointer99', xp: 9800, badges: 8 },
    { rank: 4, avatar: '🐉', username: 'GitDragon', xp: 8600, badges: 7 },
    { rank: 5, avatar: '🧠', username: 'AlgoSage', xp: 7900, badges: 7 },
    { rank: 6, avatar: '⚡', username: 'FluxCoder', xp: 6200, badges: 6 },
    { rank: 7, avatar: '🌊', username: 'WaveRunner', xp: 5100, badges: 5 },
    { rank: 8, avatar: '🔥', username: 'HotFix', xp: 4300, badges: 4 },
    { rank: 9, avatar: '🌙', username: 'DarkMerge', xp: 3500, badges: 3 },
    { rank: 10, avatar: '🎯', username: 'TargetMain', xp: 2700, badges: 2 },
];

export const CHEAT_SHEET = [
    {
        category: "Repository Setup & Configuration",
        commands: [
            { cmd: "git init", desc: "Initialize a new Git repository in the current directory", examples: ["git init", "git init my-project"] },
            { cmd: "git clone", desc: "Create a local copy of a remote repository", examples: ["git clone https://github.com/user/repo.git", "git clone git@github.com:user/repo.git"] },
            { cmd: "git config", desc: "Set configuration options for Git", examples: ["git config --global user.name \"Your Name\"", "git config --global user.email \"your.email@example.com\"", "git config --list"] },
        ]
    },
    {
        category: "Basic Commands",
        commands: [
            { cmd: "git status", desc: "Show the working tree status", examples: ["git status", "git status -s"] },
            { cmd: "git add", desc: "Add file contents to the staging area", examples: ["git add filename.txt", "git add .", "git add -A"] },
            { cmd: "git commit", desc: "Record changes to the repository", examples: ["git commit -m \"Commit message\"", "git commit -am \"Add and commit\""] },
            { cmd: "git log", desc: "Show commit history", examples: ["git log", "git log --oneline", "git log --graph"] },
            { cmd: "git diff", desc: "Show changes between commits, commit and working tree, etc", examples: ["git diff", "git diff --staged", "git diff HEAD~1"] },
        ]
    },
    {
        category: "Branching & Merging",
        commands: [
            { cmd: "git branch", desc: "List, create, or delete branches", examples: ["git branch", "git branch new-feature", "git branch -d old-branch"] },
            { cmd: "git checkout", desc: "Switch branches or restore working tree files", examples: ["git checkout main", "git checkout -b new-branch", "git checkout -- filename"] },
            { cmd: "git switch", desc: "Switch to a different branch", examples: ["git switch main", "git switch -c new-branch"] },
            { cmd: "git merge", desc: "Join two or more development histories together", examples: ["git merge feature-branch", "git merge --no-ff feature-branch"] },
            { cmd: "git rebase", desc: "Reapply commits on top of another base tip", examples: ["git rebase main", "git rebase -i HEAD~3"] },
        ]
    },
    {
        category: "Remote Repositories",
        commands: [
            { cmd: "git remote", desc: "Manage set of tracked repositories", examples: ["git remote -v", "git remote add origin url", "git remote remove origin"] },
            { cmd: "git fetch", desc: "Download objects and refs from another repository", examples: ["git fetch", "git fetch origin", "git fetch --all"] },
            { cmd: "git pull", desc: "Fetch from and integrate with another repository or local branch", examples: ["git pull", "git pull origin main", "git pull --rebase"] },
            { cmd: "git push", desc: "Update remote refs along with associated objects", examples: ["git push", "git push origin main", "git push -u origin feature-branch"] },
        ]
    },
    {
        category: "Inspection & Comparison",
        commands: [
            { cmd: "git show", desc: "Show various types of objects (commits, tags, etc.)", examples: ["git show", "git show HEAD", "git show commit-hash"] },
            { cmd: "git blame", desc: "Show what revision and author last modified each line of a file", examples: ["git blame filename.txt", "git blame -L 10,20 filename.txt"] },
            { cmd: "git log (Formatting)", desc: "Show commit logs with various formatting options", examples: ["git log --graph --all", "git log --author=\"Name\"", "git log --since=\"2 weeks ago\""] },
        ]
    },
    {
        category: "Undoing Changes",
        commands: [
            { cmd: "git reset", desc: "Reset current HEAD to the specified state", examples: ["git reset HEAD~1", "git reset --hard origin/main", "git reset --soft HEAD~1"] },
            { cmd: "git revert", desc: "Create new commit that undoes changes from previous commits", examples: ["git revert HEAD", "git revert commit-hash", "git revert HEAD~3..HEAD"] },
            { cmd: "git clean", desc: "Remove untracked files from the working tree", examples: ["git clean -f", "git clean -fd", "git clean -n"] },
        ]
    },
    {
        category: "Stashing",
        commands: [
            { cmd: "git stash", desc: "Temporarily save changes in a dirty working directory", examples: ["git stash", "git stash save \"message\"", "git stash -u"] },
            { cmd: "git stash pop", desc: "Apply stashed changes and remove them from stash", examples: ["git stash pop", "git stash pop stash@{2}"] },
            { cmd: "git stash list", desc: "List all stashes", examples: ["git stash list"] },
            { cmd: "git stash apply", desc: "Apply stashed changes without removing them from stash", examples: ["git stash apply", "git stash apply stash@{1}"] },
        ]
    },
    {
        category: "Advanced Operations",
        commands: [
            { cmd: "git cherry-pick", desc: "Apply the changes introduced by some existing commits", examples: ["git cherry-pick commit-hash", "git cherry-pick branch-name"] },
            { cmd: "git reflog", desc: "Show a log of where your HEAD and branch references have been", examples: ["git reflog", "git reflog show main"] },
            { cmd: "git bisect", desc: "Use binary search to find the commit that introduced a bug", examples: ["git bisect start", "git bisect bad", "git bisect good commit-hash"] },
            { cmd: "git tag", desc: "Create, list, delete or verify tags", examples: ["git tag", "git tag v1.0", "git tag -a v1.0 -m \"Version 1.0\""] },
        ]
    },
    {
        category: "File Management",
        commands: [
            { cmd: "git rm", desc: "Remove files from the working tree and from the index", examples: ["git rm filename", "git rm --cached filename", "git rm -r directory/"] },
            { cmd: "git mv", desc: "Move or rename a file, directory, or symlink", examples: ["git mv oldname newname", "git mv file.txt directory/"] },
        ]
    },
    {
        category: "Modern Alternatives",
        commands: [
            { cmd: "git restore", desc: "Restore working tree files", examples: ["git restore filename", "git restore --staged filename"] },
            { cmd: "git switch", desc: "Switch to a different branch", examples: ["git switch main", "git switch -c new-feature"] },
        ]
    },
    {
        category: "Submodules & Worktrees",
        commands: [
            { cmd: "git submodule", desc: "Initialize, update or inspect submodules", examples: ["git submodule add url", "git submodule update --init"] },
            { cmd: "git worktree", desc: "Manage multiple working trees", examples: ["git worktree add ../path branch", "git worktree list"] },
            { cmd: "git sparse-checkout", desc: "Reduce working tree to a subset of directories", examples: ["git sparse-checkout init", "git sparse-checkout set dir/"] },
        ]
    },
    {
        category: "Collaboration & Patching",
        commands: [
            { cmd: "git format-patch", desc: "Prepare patches for e-mail submission", examples: ["git format-patch main", "git format-patch -1 HEAD"] },
            { cmd: "git am", desc: "Apply a series of patches from a mailbox", examples: ["git am patch-file.patch", "git am --continue"] },
            { cmd: "git shortlog", desc: "Summarize git log output", examples: ["git shortlog", "git shortlog -sn"] },
        ]
    },
    {
        category: "Internal Inspection",
        commands: [
            { cmd: "git grep", desc: "Print lines matching a pattern", examples: ["git grep \"search-term\"", "git grep -n \"term\""] },
            { cmd: "git describe", desc: "Give an object a human readable name based on an available ref", examples: ["git describe", "git describe --tags"] },
            { cmd: "git rev-parse", desc: "Pick out and massage parameters", examples: ["git rev-parse --show-toplevel", "git rev-parse HEAD"] },
        ]
    },
    {
        category: "Advanced Utility",
        commands: [
            { cmd: "git archive", desc: "Create an archive of files from a named tree", examples: ["git archive --format=zip HEAD > project.zip"] },
            { cmd: "git instaweb", desc: "Instantly browse your working repository in gitweb", examples: ["git instaweb", "git instaweb --stop"] },
            { cmd: "git notes", desc: "Add or inspect object notes", examples: ["git notes add -m \"Comment\"", "git notes show"] },
        ]
    },
    {
        category: "Deep Maintenance",
        commands: [
            { cmd: "git maintenance", desc: "Run tasks to keep repository optimized", examples: ["git maintenance start", "git maintenance run"] },
            { cmd: "git prune", desc: "Prune all unreachable objects from the object database", examples: ["git prune", "git prune --dry-run"] },
            { cmd: "git count-objects", desc: "Count unpacked number of objects and their disk consumption", examples: ["git count-objects -v"] },
        ]
    }
];
