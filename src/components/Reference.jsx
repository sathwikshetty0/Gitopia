import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CHEAT_SHEET } from '../data/gameData';

export default function Reference() {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');

    const categories = useMemo(() => ['All', ...CHEAT_SHEET.map(c => c.category)], []);

    const filteredData = useMemo(() => {
        return CHEAT_SHEET.filter(cat =>
            (activeCategory === 'All' || cat.category === activeCategory) &&
            cat.commands.some(cmd =>
                cmd.cmd.toLowerCase().includes(searchTerm.toLowerCase()) ||
                cmd.desc.toLowerCase().includes(searchTerm.toLowerCase())
            )
        ).map(cat => ({
            ...cat,
            commands: cat.commands.filter(cmd =>
                cmd.cmd.toLowerCase().includes(searchTerm.toLowerCase()) ||
                cmd.desc.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }));
    }, [searchTerm, activeCategory]);

    return (
        <div style={{
            maxWidth: '1600px',
            margin: '0 auto',
            padding: '2rem 3rem',
            display: 'grid',
            gridTemplateColumns: '280px 1fr',
            gap: '3.5rem',
            alignItems: 'start'
        }}>

            {/* LEFT SIDEBAR: Categories */}
            <aside style={{ position: 'sticky', top: '7rem' }}>
                <div className="pixel neon-text mb-6" style={{ fontSize: '0.72rem', letterSpacing: '1px' }}>
                    ◈ SYSTEM_CATALOG
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            style={{
                                background: activeCategory === cat ? 'var(--neon-dim)' : 'transparent',
                                border: `1px solid ${activeCategory === cat ? 'var(--neon)' : 'transparent'}`,
                                borderRadius: '8px',
                                padding: '0.75rem 1rem',
                                textAlign: 'left',
                                fontSize: '0.82rem',
                                color: activeCategory === cat ? 'var(--neon)' : 'var(--text-dim)',
                                cursor: 'pointer',
                                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                fontFamily: 'var(--font-code)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem'
                            }}
                        >
                            <span style={{ fontSize: '1rem', opacity: activeCategory === cat ? 1 : 0.4 }}>
                                {cat === 'All' ? '⚡' : '📂'}
                            </span>
                            <span style={{ flex: 1 }}>{cat}</span>
                            {activeCategory === cat && (
                                <motion.span layoutId="active-dot" style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--neon)', boxShadow: 'var(--glow-neon)' }} />
                            )}
                        </button>
                    ))}
                </div>

                <div className="glass p-4 mt-8" style={{ fontSize: '0.78rem', color: 'var(--text-dim)', lineHeight: 1.6 }}>
                    <div className="blue-text mb-2" style={{ fontWeight: 700 }}>PRO TIP</div>
                    Click any command to copy it to your clipboard. Use search to filter specific flags.
                </div>
            </aside>

            {/* MAIN CONTENT Area */}
            <section>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                    <div>
                        <h1 className="pixel neon-text" style={{ fontSize: '1.35rem', margin: 0 }}>GIT_REFERENCE</h1>
                        <p className="dim-text" style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
                            Showing <span className="neon-text">{filteredData.reduce((acc, c) => acc + c.commands.length, 0)}</span> commands in <span className="blue-text">{activeCategory}</span>
                        </p>
                    </div>

                    <div style={{ position: 'relative', width: '350px' }}>
                        <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--neon)', opacity: 0.6 }}>$ search_</span>
                        <input
                            type="text"
                            placeholder="Filter commands..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                width: '100%',
                                background: 'rgba(0,0,0,0.4)',
                                border: '1px solid var(--border)',
                                borderRadius: '12px',
                                padding: '0.8rem 1rem 0.8rem 5.5rem',
                                color: 'var(--text)',
                                fontFamily: 'var(--font-code)',
                                fontSize: '1rem',
                                outline: 'none',
                                transition: 'all 0.3s',
                                backdropFilter: 'blur(8px)'
                            }}
                            onFocus={(e) => e.target.style.borderColor = 'var(--neon)'}
                            onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
                        />
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <AnimatePresence mode="popLayout">
                        {filteredData.map((cat, idx) => (
                            cat.commands.length > 0 && (
                                <motion.div
                                    key={cat.category}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ delay: idx * 0.05 }}
                                    layout
                                >
                                    <div className="pixel dim-text mb-4" style={{ fontSize: '0.66rem', borderBottom: '1px solid #333', paddingBottom: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
                                        <span>{cat.category.toUpperCase()}</span>
                                        <span className="blue-text" style={{ opacity: 0.5 }}>MODULE_{idx + 1}</span>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                        {cat.commands.map(cmd => (
                                            <CommandCard key={cmd.cmd} cmd={cmd} />
                                        ))}
                                    </div>
                                </motion.div>
                            )
                        ))}
                    </AnimatePresence>
                </div>

                {filteredData.every(cat => cat.commands.length === 0) && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ textAlign: 'center', padding: '6rem 0', color: 'var(--text-dim)' }}
                    >
                        <div style={{ fontSize: '3.3rem', marginBottom: '1.5rem', filter: 'grayscale(1) opacity(0.5)' }}>📡</div>
                        <div className="pixel" style={{ fontSize: '0.8rem' }}>ERROR: NO RECORDS MATCHING "{searchTerm.toUpperCase()}"</div>
                        <button
                            onClick={() => { setSearchTerm(''); setActiveCategory('All'); }}
                            className="mt-4"
                            style={{ background: 'none', border: 'none', color: 'var(--neon)', cursor: 'pointer', fontFamily: 'var(--font-code)', textDecoration: 'underline' }}
                        >
                            Reset Search Configuration
                        </button>
                    </motion.div>
                )}
            </section>
        </div>
    );
}

function CommandCard({ cmd }) {
    const [copied, setCopied] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <motion.div
            className="glass"
            style={{
                position: 'relative',
                transition: 'background-color 0.2s, border-color 0.2s, transform 0.2s',
                backgroundColor: isHovered ? 'var(--gh-hover)' : 'rgba(22, 27, 34, 0.8)',
                borderColor: isHovered ? 'rgba(88, 166, 255, 0.4)' : 'var(--border)',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '12px'
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            whileHover={{ y: -4 }}
        >
            {/* Upper Content Area */}
            <div style={{ padding: '1.5rem', flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.75rem' }}>
                    <code style={{
                        color: isHovered ? 'var(--blue)' : 'var(--neon)',
                        fontFamily: 'var(--font-code)',
                        fontWeight: 700,
                        fontSize: '1.22rem',
                        display: 'block',
                        cursor: 'pointer',
                        transition: 'color 0.2s'
                    }} onClick={() => handleCopy(cmd.cmd)}>
                        {cmd.cmd}
                    </code>
                    <AnimatePresence>
                        {copied && (
                            <motion.span
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0 }}
                                style={{
                                    fontSize: '0.66rem',
                                    color: 'var(--neon)',
                                    fontWeight: 700,
                                    letterSpacing: '0.05em',
                                    background: 'var(--neon-dim)',
                                    padding: '2px 8px',
                                    borderRadius: '4px'
                                }}
                            >
                                COPIED!
                            </motion.span>
                        )}
                    </AnimatePresence>
                </div>

                <p className="dim-text" style={{
                    fontSize: '0.94rem',
                    marginBottom: '0',
                    lineHeight: 1.5,
                    color: isHovered ? 'var(--text)' : 'var(--text-dim)',
                    transition: 'color 0.2s'
                }}>
                    {cmd.desc}
                </p>
            </div>

            {/* Bottom Syntax Area (Bleeds to edges) */}
            <div style={{
                background: isHovered ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.25)',
                padding: '1.25rem 1.5rem',
                borderTop: '1px solid rgba(255,255,255,0.05)',
                transition: 'all 0.2s',
                borderRadius: '0 0 12px 12px'
            }}>
                <div style={{
                    fontSize: '0.66rem',
                    color: 'var(--blue)',
                    opacity: 0.7,
                    marginBottom: '0.75rem',
                    fontWeight: 700,
                    letterSpacing: '0.05em'
                }}>
                    SYNTAX_EXAMPLES
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {cmd.examples.map(ex => (
                        <SyntaxExample key={ex} ex={ex} handleCopy={handleCopy} cardHovered={isHovered} />
                    ))}
                </div>
            </div>
        </motion.div>
    );
}

function SyntaxExample({ ex, handleCopy, cardHovered }) {
    const [isHovered, setIsHovered] = useState(false);
    const [copyFeedback, setCopyFeedback] = useState(false);

    const onCopy = (e) => {
        if (e) e.stopPropagation();
        handleCopy(ex);
        setCopyFeedback(true);
        setTimeout(() => setCopyFeedback(false), 1500);
    };

    const getExplanation = (syntax) => {
        // --- Repository Setup & Configuration ---
        if (syntax === 'git init') return "// Initializes a new Git repository";
        if (syntax === 'git init my-project') return "// Creates and inits a new project folder";
        if (syntax.includes('clone https://')) return "// Downloads repo via HTTPS URL";
        if (syntax.includes('clone git@')) return "// Downloads repo via SSH key";
        if (syntax.includes('config --global user.name')) return "// Sets your global display name";
        if (syntax.includes('config --global user.email')) return "// Sets your contact email for commits";
        if (syntax === 'git config --list') return "// Lists all active Git configurations";

        // --- Basic Commands ---
        if (syntax === 'git status') return "// Shows current working tree status";
        if (syntax === 'git status -s') return "// Shows a condensed status view";
        if (syntax.includes('git add ') && syntax.includes('.txt')) return "// Stages a specific text file";
        if (syntax === 'git add .') return "// Stages all changes in current directory";
        if (syntax === 'git add -A') return "// Stages all modifications and deletions";
        if (syntax.includes('git commit -m')) return "// Creates a commit with the given message";
        if (syntax.includes('git commit -am')) return "// Stages and commits all tracked files";
        if (syntax === 'git log') return "// Displays the full commit history";
        if (syntax === 'git log --oneline') return "// Summarizes history in tiny one-liners";
        if (syntax === 'git log --graph') return "// Visualizes branch history with ASCII art";
        if (syntax === 'git diff') return "// Compares working tree vs staging area";
        if (syntax === 'git diff --staged') return "// Compares staging area vs last commit";
        if (syntax.includes('git diff HEAD~1')) return "// Compares working tree with parent commit";

        // --- Branching & Merging ---
        if (syntax === 'git branch') return "// Lists all local branches";
        if (syntax.includes('git branch ') && !syntax.includes('-d')) return "// Creates a new development branch";
        if (syntax.includes('git branch -d')) return "// Safely deletes a merged branch";
        if (syntax === 'git checkout main') return "// Switches focus to the main branch";
        if (syntax.includes('git checkout -b')) return "// Creates and jumps to a new branch";
        if (syntax.includes('git checkout -- ')) return "// Restores a file to its last committed state";
        if (syntax === 'git switch main') return "// Modern way to switch to main branch";
        if (syntax.includes('git switch -c')) return "// Modern way to create and switch branch";
        if (syntax.includes('git merge ') && !syntax.includes('--no-ff')) return "// Joins a loginpage branch into current branch";
        if (syntax.includes('git merge --no-ff')) return "// Forces creation of a merge commit";
        if (syntax === 'git rebase main') return "// Replays your commits on top of main";
        if (syntax.includes('git rebase -i')) return "// Opens interactive rebase (edit history)";

        // --- Remote Repositories ---
        if (syntax === 'git remote -v') return "// Lists all tracked remote connections";
        if (syntax.includes('git remote add')) return "// Links a URL as a remote named 'origin'";
        if (syntax.includes('git remote remove')) return "// Deletes a remote repository connection";
        if (syntax === 'git fetch') return "// Downloads remote data (no merge)";
        if (syntax === 'git fetch origin') return "// Fetches latest updates from origin";
        if (syntax === 'git fetch --all') return "// Fetches data from all remotes";
        if (syntax === 'git pull') return "// Fetches then merges into current branch";
        if (syntax.includes('git pull origin main')) return "// Pulls updates from main into current";
        if (syntax === 'git pull --rebase') return "// Pulls and rebases your local changes";
        if (syntax === 'git push') return "// Uploads local commits to default remote";
        if (syntax.includes('git push origin main')) return "// Pushes your main branch to origin";
        if (syntax.includes('git push -u')) return "// Pushes and sets the upstream tracking";

        // --- Inspection & Comparison ---
        if (syntax === 'git show') return "// Shows details of the latest commit";
        if (syntax === 'git show HEAD') return "// Inspects the status of the current head";
        if (syntax.includes('git show commit-hash')) return "// Shows details of a specific commit ID";
        if (syntax.includes('git blame ') && !syntax.includes('-L')) return "// Shows who changed which line & when";
        if (syntax.includes('git blame -L')) return "// Inspects specific line ranges of a file";
        if (syntax.includes('git log --graph --all')) return "// Shows graph of all branches everywhere";
        if (syntax.includes('git log --author')) return "// Filters history by a specific author";
        if (syntax.includes('git log --since')) return "// Filters history by a relative date";

        // --- Undoing Changes ---
        if (syntax.includes('git reset HEAD~1')) return "// Undoes latest commit, keeps files modified";
        if (syntax.includes('git reset --hard')) return "// Atomic reset: DISCARDS ALL LOCAL CHANGES";
        if (syntax.includes('git reset --soft')) return "// Undoes commit but keeps changes staged";
        if (syntax === 'git revert HEAD') return "// Inverts the latest commit with a new one";
        if (syntax.includes('git revert commit-hash')) return "// Undoes a specific commit via inversion";
        if (syntax.includes('git revert HEAD~3..HEAD')) return "// Inverts a range of recent commits";
        if (syntax === 'git clean -f') return "// Forcibly removes untracked files";
        if (syntax === 'git clean -fd') return "// Removes untracked files and directories";
        if (syntax === 'git clean -n') return "// Dry run: shows what would be deleted";

        // --- Stashing ---
        if (syntax === 'git stash') return "// Saves dirty state to a temporary stack";
        if (syntax.includes('git stash save')) return "// Stashes changes with a custom message";
        if (syntax === 'git stash -u') return "// Stashes changes AND untracked files";
        if (syntax === 'git stash pop') return "// Restores latest stash and deletes it";
        if (syntax.includes('git stash pop stash@')) return "// Restores & deletes a specific stash ID";
        if (syntax === 'git stash list') return "// Lists all stashed snapshots";
        if (syntax === 'git stash apply') return "// Restores latest stash, keeps it in list";

        // --- Advanced Operations ---
        if (syntax.includes('git cherry-pick')) return "// Copies a specific commit to your branch";
        if (syntax === 'git reflog') return "// Shows local log of all reference changes";
        if (syntax.includes('git reflog show')) return "// Inspects the history of a specific branch";
        if (syntax === 'git bisect start') return "// Begins binary search to find bugs";
        if (syntax === 'git bisect bad') return "// Marks the current version as buggy";
        if (syntax.includes('git bisect good')) return "// Marks a specific commit as bug-free";
        if (syntax === 'git tag') return "// Lists all tags in the repository";
        if (syntax.includes('git tag v1.0')) return "// Creates a lightweight tag named v1.0";
        if (syntax.includes('git tag -a')) return "// Creates an annotated tag with message";

        // --- File Management ---
        if (syntax.includes('git rm ') && !syntax.includes('--cached')) return "// Deletes file from disk and Git index";
        if (syntax.includes('git rm --cached')) return "// Keeps file on disk, removes it from Git";
        if (syntax.includes('git rm -r')) return "// Recursively removes a directory";
        if (syntax.includes('git mv ')) return "// Renames or moves a file in the repo";

        // --- Repository Maintenance ---
        if (syntax === 'git gc') return "// Optimizes local repo & cleans trash";
        if (syntax === 'git gc --aggressive') return "// Intense optimization for large repos";
        if (syntax === 'git fsck') return "// Basic check for database connectivity";
        if (syntax === 'git fsck --full') return "// Deep audit of Git object validity";

        // --- Modern Alternatives ---
        if (syntax === 'git restore filename') return "// Discards uncommitted changes in a file";
        if (syntax === 'git restore --staged filename') return "// Unstages a file without losing changes";
        if (syntax === 'git switch main') return "// Focuses on the main development branch";
        if (syntax === 'git switch -c loginpage') return "// Creates and switches to a loginpage branch";

        // --- Submodules & Worktrees ---
        if (syntax === 'git submodule add url') return "// Links an external repo as a project dependency";
        if (syntax === 'git submodule update --init') return "// Pulls down content for all submodules";
        if (syntax.includes('git worktree add')) return "// Checks out a branch in a separate folder";
        if (syntax === 'git worktree list') return "// Shows all active supplementary worktrees";
        if (syntax === 'git sparse-checkout init') return "// Configures repo to only show specific folders";
        if (syntax.includes('git sparse-checkout set')) return "// Limits the view to a specific directory";

        // --- Collaboration & Patching ---
        if (syntax === 'git format-patch main') return "// Converts commits into email-ready patches";
        if (syntax === 'git format-patch -1 HEAD') return "// Creates a patch from the very last commit";
        if (syntax === 'git am patch-file.patch') return "// Applies codes changes from a mailbox/patch";
        if (syntax === 'git am --continue') return "// Resumes patch application after a conflict";
        if (syntax === 'git shortlog') return "// Group commits by author for a high-level view";
        if (syntax === 'git shortlog -sn') return "// Shows summary of commit counts per author";

        // --- Internal Inspection ---
        if (syntax.includes('git grep')) return "// Fast text search across your local history";
        if (syntax === 'git describe') return "// Finds the latest tag reachable from current state";
        if (syntax === 'git describe --tags') return "// Describes state using any available tags";
        if (syntax === 'git rev-parse --show-toplevel') return "// Shows the absolute path to repo root";
        if (syntax === 'git rev-parse HEAD') return "// Outputs the full hash of the current commit";

        // --- Advanced Utility ---
        if (syntax.includes('git archive')) return "// Packages the current project into a ZIP/tar";
        if (syntax === 'git instaweb') return "// Launches a web-browser GUI for the repo";
        if (syntax === 'git instaweb --stop') return "// Shuts down the local web-based repo viewer";
        if (syntax.includes('git notes add')) return "// Attaches a sticky-note to a specific commit";
        if (syntax === 'git notes show') return "// Displays the attached notes for a commit";

        // --- Deep Maintenance ---
        if (syntax === 'git maintenance start') return "// Schedules background repo health checks";
        if (syntax === 'git maintenance run') return "// Instantly triggers maintenance tasks";
        if (syntax === 'git prune') return "// Cleans up unreachable objects from database";
        if (syntax === 'git prune --dry-run') return "// Shows which orphaned files would be deleted";
        if (syntax === 'git count-objects -v') return "// Detailed report on repo disk consumption";

        return "// Run this command template";
    };

    return (
        <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={onCopy}
            style={{
                fontFamily: 'var(--font-code)',
                fontSize: '0.86rem',
                color: cardHovered ? '#fff' : '#ddd',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'baseline', // Better for wrapped text
                gap: '0.75rem',
                transition: 'color 0.2s',
                position: 'relative',
                width: '100%', // Take full width
                maxWidth: '100%'
            }}
        >
            <span style={{ color: cardHovered ? 'var(--blue)' : 'var(--neon)', transition: 'color 0.2s', flexShrink: 0 }}>λ</span>
            <span style={{ 
                color: copyFeedback ? 'var(--neon)' : 'inherit',
                wordBreak: 'break-word', // Wrap long words if needed
                whiteSpace: 'pre-wrap'  // Preserves spacing but allows wrapping
            }}>{ex}</span>

            <AnimatePresence>
                {isHovered && (
                    <motion.div
                        initial={{ opacity: 0, y: 5, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 5, scale: 0.95 }}
                        style={{
                            position: 'absolute',
                            bottom: '140%', // Position above the line
                            left: '20px',
                            background: '#161b22',
                            color: 'var(--text)',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            fontSize: '0.78rem',
                            fontWeight: 500,
                            whiteSpace: 'nowrap',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                            border: '1px solid #30363d',
                            zIndex: 100,
                            cursor: 'default', // Passive comment, not a button
                            pointerEvents: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                        }}
                    >
                        {/* Tooltip Arrow */}
                        <div style={{
                            position: 'absolute',
                            bottom: '-5px',
                            left: '12px',
                            width: '10px',
                            height: '10px',
                            background: 'inherit',
                            transform: 'rotate(45deg)',
                            borderRight: '1px solid #30363d',
                            borderBottom: '1px solid #30363d',
                        }} />
                        
                        <span style={{ opacity: 0.5 }}>ℹ</span>
                        {getExplanation(ex).replace('// ', '')}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
