import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MODULES, BADGES } from '../data/gameData';
import { CommitGraph } from './shared/CommitGraph';
import { Terminal } from './shared/Terminal';

// Utility for fuzzy matching command text
const normalizeForMatch = (str) => {
    if (!str) return '';
    return str.toLowerCase()
        .replace(/────────►/g, ' ') // Remove long arrows
        .replace(/→/g, ' ')           // Remove standard arrows
        // Remove dashes/separators that aren't command flags (e.g., "cmd1 - cmd2")
        .replace(/\s+[-–—]+\s+/g, ' ') 
        // Remove symbols like ( ) that might be in descriptive text but not crucial for the gist
        .replace(/[()]/g, '')
        .replace(/\s+/g, ' ')         // Collapse all whitespace to single spaces
        .trim();
};

export default function MissionScreen({ 
    activeMissionId, missionPhase, activeChallengeIndex, 
    currentMissionXP, lastXPGain, earnedBadge, dispatch 
}) {
    const mission = MODULES.find(m => m.id === activeMissionId);
    if (!mission) return null;

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '1rem 1rem 2rem' }}>
            {/* Mission Title bar */}
            <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                marginBottom: '1.25rem', padding: '0.75rem 1rem',
                background: 'rgba(22,27,34,0.7)', border: '1px solid rgba(57,255,20,0.15)',
                borderRadius: '8px',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '1.5rem' }}>{mission.icon}</span>
                    <div>
                        <div className="pixel neon-text" style={{ fontSize: '0.6rem' }}>{mission.title}</div>
                        <div className="dim-text text-xs" style={{ marginTop: '2px' }}>{mission.subtitle}</div>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ color: 'var(--gold)', fontSize: '0.75rem', fontWeight: 700 }}>
                        +{mission.rewardXP} XP
                    </span>
                    {/* Phase dots */}
                    <div style={{ display: 'flex', gap: '4px' }}>
                        {['briefing', 'challenge', 'reward'].map((ph, i) => (
                            <div key={ph} style={{
                                width: 8, height: 8, borderRadius: '50%',
                                background: missionPhase === ph ? 'var(--neon)'
                                    : ['briefing', 'challenge', 'reward'].indexOf(missionPhase) > i ? 'var(--blue)'
                                        : '#333',
                                boxShadow: missionPhase === ph ? 'var(--glow-neon)' : 'none',
                                transition: 'all 0.3s',
                            }} />
                        ))}
                    </div>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {missionPhase === 'briefing' && (
                    <motion.div key="briefing"
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20, transition: { duration: 0.15 } }}
                    >
                        <BriefingPhase mission={mission} dispatch={dispatch} />
                    </motion.div>
                )}
                {missionPhase === 'challenge' && (
                    <motion.div key={`challenge-${activeChallengeIndex}`}
                        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12, transition: { duration: 0.12 } }}
                    >
                        <ChallengePhase mission={mission} activeChallengeIndex={activeChallengeIndex} dispatch={dispatch} />
                    </motion.div>
                )}
                {missionPhase === 'reward' && (
                    <motion.div key="reward"
                        initial={{ opacity: 0, scale: 0.88 }} animate={{ opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 200, damping: 20 } }}
                        exit={{ opacity: 0 }}
                    >
                        <RewardPhase 
                            mission={mission} 
                            totalXP={currentMissionXP} 
                            actualGainedXP={lastXPGain} 
                            earnedBadge={earnedBadge} 
                            dispatch={dispatch} 
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// ═══════════════════════════════════════════════════
// PHASE 1: BRIEFING
// ═══════════════════════════════════════════════════
function BriefingPhase({ mission, dispatch }) {
    const [visibleLines, setVisibleLines] = useState(0);
    const [graphStep, setGraphStep] = useState(0);
    const allLinesVisible = visibleLines >= mission.briefing.lines.length;

    useEffect(() => {
        if (!allLinesVisible) {
            const t = setTimeout(() => setVisibleLines(v => v + 1), 480);
            return () => clearTimeout(t);
        }
    }, [visibleLines, allLinesVisible]);

    const hasGraph = mission.graphSteps?.length > 0;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="glass p-6">
                <div className="pixel neon-text" style={{ fontSize: '0.58rem', marginBottom: '1.25rem' }}>
                    {mission.briefing.title}
                </div>

                {/* Animated bullet lines */}
                <div style={{ marginBottom: '1.5rem' }}>
                    {mission.briefing.lines.map((line, i) => (
                        <AnimatePresence key={i}>
                            {i < visibleLines && (
                                <BriefingLine text={line.replaceAll('→', ' ────────► ')} />
                            )}
                        </AnimatePresence>
                    ))}
                </div>

                {/* ASCII Diagram terminal */}
                <div className="terminal-window" style={{ marginBottom: hasGraph ? '1.5rem' : '0' }}>
                    <div className="terminal-titlebar">
                        <div className="dot dot-red" />
                        <div className="dot dot-yellow" />
                        <div className="dot dot-green" />
                        <span style={{ marginLeft: '0.5rem' }}>diagram.sh</span>
                    </div>
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center',
                        background: 'rgba(0,0,0,0.6)',
                        minHeight: '220px',
                        overflowX: 'auto',
                        padding: '1rem',
                    }}>
                        <pre style={{
                            fontFamily: '"Fira Code", "Courier New", monospace', 
                            fontSize: '0.9rem',
                            color: 'var(--neon)', 
                            whiteSpace: 'pre', 
                            lineHeight: '1.2',
                            margin: 0,
                            textAlign: 'left',
                            letterSpacing: '0',
                        }}>
                            {mission.briefing.ascii}
                        </pre>
                    </div>
                </div>

                {/* Commit graph */}
                {hasGraph && (
                    <div style={{ marginBottom: '1.5rem', marginTop: '1rem' }}>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>
                            ◈ LIVE COMMIT GRAPH
                        </div>
                        <CommitGraph graphData={mission.graphSteps[graphStep]} />
                        {mission.graphSteps.length > 1 && (
                            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                                {mission.graphSteps.map((_, i) => (
                                    <button
                                        key={i}
                                        className="btn"
                                        style={{ 
                                            padding: '0.4rem 1.1rem', 
                                            fontSize: '0.92rem', 
                                            opacity: i === graphStep ? 1 : 0.4,
                                            fontWeight: 700,
                                            letterSpacing: '0.05em',
                                            borderColor: i === graphStep ? 'var(--neon)' : 'rgba(57,255,20,0.2)',
                                            boxShadow: i === graphStep ? '0 0 10px rgba(57,255,20,0.3)' : 'none',
                                            transform: i === graphStep ? 'scale(1.05)' : 'scale(1)',
                                            transition: 'all 0.2s ease'
                                        }}
                                        onClick={() => setGraphStep(i)}
                                    >
                                        STEP {i + 1}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Skip animation or begin challenges */}
            <div style={{ display: 'flex', gap: '0.75rem' }}>
                {!allLinesVisible && (
                    <button
                        className="btn"
                        style={{ flex: '0 0 auto' }}
                        onClick={() => setVisibleLines(mission.briefing.lines.length)}
                    >
                        Skip Animation
                    </button>
                )}
                <button
                    className="btn btn-primary"
                    style={{ flex: 1, padding: '0.8rem', fontSize: '0.85rem' }}
                    disabled={!allLinesVisible}
                    onClick={() => dispatch({ type: 'BEGIN_CHALLENGES' })}
                >
                    ▶ BEGIN CHALLENGES ({mission.challenges.length} challenge{mission.challenges.length > 1 ? 's' : ''})
                </button>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════
// PHASE 2: CHALLENGES
// ═══════════════════════════════════════════════════
function ChallengePhase({ mission, activeChallengeIndex, dispatch }) {
    const challenge = mission.challenges[activeChallengeIndex];
    const total = mission.challenges.length;

    const handleComplete = (xpEarned, hintPenalty = 0) => {
        const finalXP = Math.max(0, xpEarned - hintPenalty);
        dispatch({ type: 'CHALLENGE_COMPLETE', payload: finalXP });

        const isLast = activeChallengeIndex + 1 >= total;
        setTimeout(() => {
            if (isLast) {
                dispatch({ type: 'FINISH_MISSION', payload: { module: mission, bonusXP: 0 } });
            } else {
                dispatch({ type: 'NEXT_CHALLENGE' });
            }
        }, 800);
    };

    return (
        <div>
            {/* Progress header */}
            <div style={{
                display: 'flex', alignItems: 'center', gap: '1rem',
                padding: '0.65rem 1rem', marginBottom: '1rem',
                background: 'rgba(22,27,34,0.7)', border: '1px solid rgba(88,166,255,0.15)',
                borderRadius: '8px',
            }}>
                <span className="dim-text text-xs" style={{ whiteSpace: 'nowrap' }}>
                    Challenge {activeChallengeIndex + 1} / {total}
                </span>
                <div style={{ flex: 1, height: '5px', background: 'var(--bg-3)', borderRadius: '3px', overflow: 'hidden' }}>
                    <motion.div
                        style={{ height: '100%', background: 'var(--blue)', borderRadius: '3px' }}
                        animate={{ width: `${(activeChallengeIndex / total) * 100}%` }}
                        transition={{ duration: 0.4 }}
                    />
                </div>
                <span style={{ color: 'var(--gold)', fontSize: '0.72rem', fontWeight: 700, whiteSpace: 'nowrap' }}>
                    +{challenge.xp} XP
                </span>
                <span className="badge badge-blue" style={{ fontSize: '0.52rem' }}>
                    {challenge.type.replace('_', ' ').toUpperCase()}
                </span>
            </div>

            {challenge.type === 'terminal' && (
                <TerminalChallenge challenge={challenge} onComplete={handleComplete} />
            )}
            {(challenge.type === 'multiple_choice' || challenge.type === 'scenario') && (
                <MCQChallenge challenge={challenge} onComplete={handleComplete} />
            )}
            {challenge.type === 'order' && (
                <OrderChallenge challenge={challenge} onComplete={handleComplete} />
            )}
            {challenge.type === 'fix_command' && (
                <FixCommandChallenge challenge={challenge} onComplete={handleComplete} />
            )}
            {challenge.type === 'fix_conflict' && (
                <ConflictChallenge challenge={challenge} onComplete={handleComplete} />
            )}
        </div>
    );
}

// ── Terminal Challenge ────────────────────────────
function TerminalChallenge({ challenge, onComplete }) {
    const [hintsUsed, setHintsUsed] = useState(0);
    const [solved, setSolved] = useState(false);

    const handleSuccess = () => {
        if (solved) return;
        setSolved(true);
        onComplete(challenge.xp, hintsUsed * 10);
    };

    return (
        <div className="glass p-6">
            <div className="pixel" style={{ color: 'var(--blue)', fontSize: '0.52rem', marginBottom: '1rem' }}>
                ⌨ TERMINAL CHALLENGE
            </div>
            <p style={{ marginBottom: '1.25rem', fontSize: '0.85rem', lineHeight: 1.65, color: 'var(--text)' }}>
                {challenge.instruction}
            </p>
            <Terminal
                prompt={challenge.prompt}
                expected={challenge.expected}
                hints={challenge.hints}
                onSuccess={handleSuccess}
            />
            <AnimatePresence>
                {solved && (
                    <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                            marginTop: '1rem', padding: '0.75rem 1rem',
                            background: 'var(--neon-dim)', border: '1px solid var(--neon)',
                            borderRadius: '6px', color: 'var(--neon)', fontSize: '0.82rem',
                        }}
                    >
                        ✓ {challenge.successMsg}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// ── Multiple Choice / Scenario ────────────────────
function MCQChallenge({ challenge, onComplete }) {
    const [selected, setSelected] = useState(null);
    const [result, setResult] = useState(null); // null | 'correct' | 'wrong'
    const [hintsShown, setHintsShown] = useState(0);
    const [wrongCount, setWrongCount] = useState(0);

    const isCommand = challenge.options[challenge.correct].trim().toLowerCase().startsWith('git');

    const handleSubmit = (clickedIndex = null) => {
        const val = clickedIndex !== null ? clickedIndex : selected;
        if (val === null || result) return;

        const correctOptionText = challenge.options[challenge.correct];
        const correctOptionLetter = String.fromCharCode(65 + challenge.correct);

        let isCorrect = false;
        if (isCommand) {
            // Fuzzy match for commands: ignore arrows/separators but keep command syntax
            isCorrect = normalizeForMatch(val) === normalizeForMatch(correctOptionText);
        } else {
            // Clicking or typing for theory
            if (typeof val === 'number') {
                isCorrect = val === challenge.correct;
            } else {
                isCorrect = (val.trim().toLowerCase() === correctOptionLetter.trim().toLowerCase()) ||
                            (normalizeForMatch(val) === normalizeForMatch(correctOptionText));
            }
        }
        
        setResult(isCorrect ? 'correct' : 'wrong');

        if (isCorrect) {
            onComplete(challenge.xp, wrongCount * 5 + hintsShown * 10);
        } else {
            setWrongCount(c => c + 1);
            setTimeout(() => {
                setResult(null);
                setSelected(isCommand ? '' : null);
            }, 1600);
        }
    };

    return (
        <div className="glass p-6">
            <div className="pixel" style={{ color: 'var(--blue)', fontSize: '0.52rem', marginBottom: '1rem' }}>
                {isCommand ? '💻 COMMAND CHALLENGE' : '📜 THEORY CHALLENGE'}
            </div>
            
            {challenge.situation && (
                <div style={{
                    background: 'rgba(88,166,255,0.08)', border: '1px solid rgba(88,166,255,0.2)',
                    padding: '1rem', borderRadius: '8px', marginBottom: '1.25rem',
                    fontSize: '0.85rem', lineHeight: 1.6, color: 'var(--text)',
                    userSelect: 'none'
                }}>
                    📡 <strong style={{ color: 'var(--blue)' }}>SITUATION:</strong> {challenge.situation}
                </div>
            )}

            <p style={{ marginBottom: '1.25rem', fontSize: '0.88rem', lineHeight: 1.65, color: 'var(--text)', userSelect: 'none' }}>
                {challenge.question}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.5rem', userSelect: isCommand ? 'none' : 'auto' }}>
                <div className="dim-text text-xs" style={{ marginBottom: '0.2rem', opacity: 0.6, letterSpacing: '0.05em' }}>
                    {isCommand ? 'AVAILABLE OPTIONS (CANNOT BE COPIED)' : 'CHOOSE THE CORRECT OPTION:'}
                </div>
                {challenge.options.map((opt, i) => {
                    // Logic for display colors
                    let bg = 'rgba(255,255,255,0.03)', border = '#3d444d', color = 'var(--text)';
                    
                    if (result === 'correct' && i === challenge.correct) { bg = 'rgba(57,255,20,0.12)'; border = 'var(--neon)'; color = 'var(--neon)'; }
                    if (result === 'wrong' && i === challenge.correct) { bg = 'rgba(57,255,20,0.08)'; border = 'var(--neon)'; color = 'var(--neon)'; }
                    if (result === 'wrong' && !isCommand && i === selected && i !== challenge.correct) { bg = 'rgba(255,77,77,0.12)'; border = 'var(--red)'; color = 'var(--red)'; }
                    if (!result && !isCommand && i === selected) { bg = 'rgba(88,166,255,0.10)'; border = 'var(--blue)'; color = 'var(--blue)'; }

                    return (
                        <motion.button
                            key={i}
                            disabled={!!result || isCommand}
                            whileHover={(!result && !isCommand) ? { x: 4 } : {}}
                            onClick={() => {
                                if (!isCommand && !result) {
                                    setSelected(i);
                                }
                            }}
                            style={{
                                textAlign: 'left', padding: '0.8rem 1rem', borderRadius: '6px',
                                background: bg, border: `1.5px solid ${border}`, color,
                                fontFamily: 'var(--font-code)', fontSize: '0.82rem',
                                cursor: (isCommand || result) ? 'default' : 'pointer',
                                transition: 'all 0.2s ease',
                                userSelect: isCommand ? 'none' : 'auto'
                            }}
                        >
                            <span style={{ marginRight: '0.6rem', opacity: 0.6, color: 'var(--blue)' }}>{String.fromCharCode(65 + i)}.</span>
                            {opt.replaceAll('→', ' ────────► ')}
                        </motion.button>
                    );
                })}
            </div>

            {isCommand && (
                <div className="terminal-window" style={{ marginBottom: '1.5rem', border: result === 'wrong' ? '1px solid var(--red)' : '1px solid var(--blue)' }}>
                    <div className="terminal-titlebar">
                        <div className="dot dot-red" /><div className="dot dot-yellow" /><div className="dot dot-green" />
                        <span style={{ marginLeft: '0.5rem', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                            Command Entry Terminal
                        </span>
                    </div>
                    <div style={{ padding: '0.8rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ color: 'var(--blue)', fontWeight: 'bold' }}>EXEC:</span>
                        <input
                            type="text"
                            placeholder="Full git command required..."
                            value={selected !== null ? selected : ''}
                            onChange={e => !result && setSelected(e.target.value)}
                            onKeyDown={e => !result && e.key === 'Enter' && handleSubmit()}
                            onPaste={e => {
                                e.preventDefault();
                                alert("⚠️ SECURITY TRIGGERED: No cheating! You must type the answer manually to learn.");
                            }}
                            onContextMenu={e => e.preventDefault()}
                            style={{
                                background: 'transparent', border: 'none', outline: 'none', flex: 1,
                                color: result === 'correct' ? 'var(--neon)' : result === 'wrong' ? 'var(--red)' : '#fff',
                                fontFamily: 'var(--font-code)', fontSize: '0.9rem',
                            }}
                            autoComplete="off"
                            autoCorrect="off"
                            spellCheck="false"
                            disabled={!!result}
                        />
                    </div>
                </div>
            )}

            {wrongCount > 0 && (
                <div className="dim-text text-xs" style={{ marginBottom: '0.5rem', color: 'var(--red)', textAlign: 'center' }}>
                    ✗ {wrongCount} wrong attempt{wrongCount > 1 ? 's' : ''} — focus cadet!
                </div>
            )}

            <HintRow hints={challenge.hints} hintsShown={hintsShown} setHintsShown={setHintsShown} />

            <button
                className="btn btn-primary w-full"
                style={{ 
                    marginTop: '1rem', 
                    height: '50px',
                    fontSize: '1rem',
                    background: result === 'correct' ? 'var(--neon)' : result === 'wrong' ? 'var(--red)' : 'var(--blue)',
                    borderColor: 'transparent',
                    color: '#000',
                    fontWeight: 800,
                    opacity: (selected === null && isCommand) || result ? 0.6 : 1
                }}
                disabled={(selected === null && !isCommand) || (selected === '' && isCommand) || !!result}
                onClick={() => handleSubmit()}
            >
                {result === 'correct' ? 'MISSION ACCOMPLISHED' : result === 'wrong' ? '✗ WRONG — TRY AGAIN' : (isCommand ? 'EXECUTE COMMAND' : 'SUBMIT ANSWER')}
            </button>
        </div>
    );
}

// ── Sequence / Order Challenge ────────────────────
function OrderChallenge({ challenge, onComplete }) {
    const [pool, setPool] = useState([...challenge.items]);
    const [sequence, setSequence] = useState([]);
    const [feedback, setFeedback] = useState(null); // null | 'correct' | 'wrong'
    const [hintsShown, setHintsShown] = useState(0);
    const [wrongCount, setWrongCount] = useState(0);

    const addToSeq = item => {
        setPool(p => p.filter(i => i !== item));
        setSequence(s => [...s, item]);
    };
    const removeFromSeq = item => {
        setSequence(s => s.filter(i => i !== item));
        setPool(p => [...p, item]);
        setFeedback(null);
    };
    const clearAll = () => { setPool([...challenge.items]); setSequence([]); setFeedback(null); };

    const handleCheck = () => {
        const correct = JSON.stringify(sequence) === JSON.stringify(challenge.correct);
        setFeedback(correct ? 'correct' : 'wrong');
        if (correct) {
            onComplete(challenge.xp, wrongCount * 5 + hintsShown * 10);
        } else {
            setWrongCount(c => c + 1);
            setTimeout(() => setFeedback(null), 2000);
        }
    };

    return (
        <div className="glass p-6">
            <div className="pixel" style={{ color: 'var(--purple)', fontSize: '0.52rem', marginBottom: '1rem' }}>
                🔢 SEQUENCE CHALLENGE
            </div>
            <p style={{ marginBottom: '1.25rem', fontSize: '0.88rem', lineHeight: 1.65 }}>{challenge.question}</p>

            {/* Available items */}
            <div style={{ marginBottom: '1rem' }}>
                <div className="dim-text text-xs" style={{ marginBottom: '0.5rem' }}>
                    Click items to add to your sequence:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', minHeight: '40px' }}>
                    {pool.map(item => (
                        <motion.button
                            key={item}
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.97 }}
                            className="btn"
                            style={{ padding: '0.3rem 0.65rem', fontSize: '0.72rem', userSelect: 'none' }}
                            onClick={() => addToSeq(item)}
                        >
                            {item.replaceAll('→', ' ────────► ')}
                        </motion.button>
                    ))}
                    {pool.length === 0 && (
                        <span className="dim-text text-xs" style={{ alignSelf: 'center' }}>All items placed ↓</span>
                    )}
                </div>
            </div>

            {/* Sequence area */}
            <div style={{
                minHeight: '110px', padding: '0.75rem',
                border: `1.5px dashed ${feedback === 'correct' ? 'var(--neon)' : feedback === 'wrong' ? 'var(--red)' : '#3d444d'}`,
                borderRadius: '6px', marginBottom: '0.75rem',
                background: feedback === 'correct' ? 'rgba(57,255,20,0.06)' : feedback === 'wrong' ? 'rgba(255,77,77,0.06)' : 'var(--bg-3)',
                transition: 'all 0.3s',
            }}>
                <div className="dim-text text-xs" style={{ marginBottom: '0.5rem' }}>Your sequence:</div>
                {sequence.length === 0 && (
                    <div className="dim-text text-xs" style={{ opacity: 0.4, fontStyle: 'italic' }}>
                        (empty — click items above to build sequence)
                    </div>
                )}
                {sequence.map((item, i) => (
                    <motion.div
                        key={`${item}-${i}`}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        style={{
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            padding: '0.3rem 0.5rem', marginBottom: '0.25rem',
                            background: 'rgba(255,255,255,0.04)', borderRadius: '4px',
                            fontSize: '0.78rem',
                        }}
                    >
                        <span>
                            <span style={{ color: 'var(--neon)', marginRight: '0.5rem' }}>{i + 1}.</span>
                            {item.replaceAll('→', ' ────────► ')}
                        </span>
                        <button
                            onClick={() => removeFromSeq(item)}
                            style={{ background: 'none', border: 'none', color: 'var(--red)', cursor: 'pointer', fontSize: '0.75rem', padding: '0 0.25rem' }}
                            title="Remove"
                        >✕</button>
                    </motion.div>
                ))}
            </div>

            <HintRow hints={challenge.hints} hintsShown={hintsShown} setHintsShown={setHintsShown} />

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                <button className="btn" onClick={clearAll} style={{ whiteSpace: 'nowrap' }}>
                    Reset
                </button>
                <button
                    className="btn btn-primary"
                    style={{ flex: 1 }}
                    disabled={sequence.length !== challenge.correct.length || feedback === 'correct'}
                    onClick={handleCheck}
                >
                    {feedback === 'wrong' ? '✗ WRONG — TRY AGAIN' : 'CHECK SEQUENCE'}
                </button>
            </div>
        </div>
    );
}

// ── Fix the Command ───────────────────────────────
function FixCommandChallenge({ challenge, onComplete }) {
    const [answer, setAnswer] = useState(challenge.broken);
    const [feedback, setFeedback] = useState(null);
    const [hintsShown, setHintsShown] = useState(0);
    const [wrongCount, setWrongCount] = useState(0);

    const handleCheck = () => {
        if (feedback === 'correct') return;
        // Use fuzzy matching for "Fix the Command" too
        const isCorrect = normalizeForMatch(answer) === normalizeForMatch(challenge.correct);
        setFeedback(isCorrect ? 'correct' : 'wrong');
        if (isCorrect) {
            onComplete(challenge.xp, wrongCount * 5 + hintsShown * 10);
        } else {
            setWrongCount(c => c + 1);
            setTimeout(() => setFeedback(null), 1500);
        }
    };

    return (
        <div className="glass p-6">
            <div className="pixel" style={{ color: 'var(--red)', fontSize: '0.52rem', marginBottom: '1rem' }}>
                🔧 FIX THE COMMAND
            </div>
            <p style={{ marginBottom: '1.25rem', fontSize: '0.88rem', lineHeight: 1.65 }}>{challenge.question}</p>

            <div className="terminal-window" style={{ marginBottom: '1rem' }}>
                <div className="terminal-titlebar">
                    <div className="dot dot-red" /><div className="dot dot-yellow" /><div className="dot dot-green" />
                    <span style={{ marginLeft: '0.5rem', color: feedback === 'correct' ? 'var(--neon)' : 'var(--red)' }}>
                        {feedback === 'correct' ? '✓ FIXED!' : '⚠ BROKEN COMMAND'}
                    </span>
                </div>
                <div style={{ padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ color: 'var(--neon)', fontSize: '0.8rem' }}>$</span>
                    <input
                        type="text"
                        value={answer}
                        onChange={e => setAnswer(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleCheck()}
                        onPaste={e => {
                            e.preventDefault();
                            alert("⚠️ SECURITY TRIGGERED: No cheating! You must type the fix manually.");
                        }}
                        onContextMenu={e => e.preventDefault()}
                        style={{
                            background: 'transparent', border: 'none', outline: 'none', flex: 1,
                            color: feedback === 'correct' ? 'var(--neon)' : feedback === 'wrong' ? 'var(--red)' : 'var(--text)',
                            fontFamily: 'var(--font-code)', fontSize: '0.9rem',
                        }}
                        autoComplete="off"
                        autoCorrect="off"
                        spellCheck="false"
                    />
                </div>
            </div>

            <HintRow hints={challenge.hints} hintsShown={hintsShown} setHintsShown={setHintsShown} />

            <button
                className="btn btn-primary w-full"
                style={{ marginTop: '1rem' }}
                disabled={feedback === 'correct'}
                onClick={handleCheck}
            >
                {feedback === 'wrong' ? '✗ WRONG — TRY AGAIN' : 'EXECUTE FIX'}
            </button>
        </div>
    );
}

// ── Conflict Resolution ───────────────────────────
function ConflictChallenge({ challenge, onComplete }) {
    const [resolved, setResolved] = useState(challenge.conflictText);
    const [feedback, setFeedback] = useState(null);
    const [hintsShown, setHintsShown] = useState(0);
    const [wrongCount, setWrongCount] = useState(0);

    const handleResolve = () => {
        if (feedback === 'correct') return;
        const hasMarkers = resolved.includes('<<<<') || resolved.includes('====') || resolved.includes('>>>>');
        if (hasMarkers) {
            setFeedback('markers-remain');
            setTimeout(() => setFeedback(null), 2500);
            return;
        }
        const correct = resolved.trim() === challenge.correct.trim();
        setFeedback(correct ? 'correct' : 'wrong');
        if (correct) {
            onComplete(challenge.xp, wrongCount * 5 + hintsShown * 10);
        } else {
            setWrongCount(c => c + 1);
            setTimeout(() => setFeedback(null), 2000);
        }
    };

    const feedbackMsg = {
        'markers-remain': '⚠ Conflict markers (<<<, ===, >>>) are still present. Remove them!',
        'wrong': '✗ That\'s not the feature branch version. Try again!',
        'correct': '✓ CONFLICT RESOLVED! Perfect.',
    }[feedback] || '';

    return (
        <div className="glass p-6">
            <div className="pixel" style={{ color: 'var(--red)', fontSize: '0.52rem', marginBottom: '1rem' }}>
                ⚔️ CONFLICT RESOLUTION
            </div>
            <p style={{ marginBottom: '0.5rem', fontSize: '0.88rem', lineHeight: 1.65 }}>{challenge.description}</p>
            <p className="dim-text text-xs" style={{ marginBottom: '1.25rem' }}>
                Delete the conflict markers ({"<<<"}, {"==="}, {">>>"}). Keep only the version of code you want.
            </p>

            <div className="terminal-window" style={{ marginBottom: '1rem' }}>
                <div className="terminal-titlebar">
                    <div className="dot dot-red" /><div className="dot dot-yellow" /><div className="dot dot-green" />
                    <span style={{ marginLeft: '0.5rem', color: 'var(--red)' }}>app.js — CONFLICT</span>
                </div>
                <textarea
                    value={resolved}
                    onChange={e => setResolved(e.target.value)}
                    onPaste={e => {
                        e.preventDefault();
                        alert("⚠️ SECURITY TRIGGERED: No cheating! You must resolve the conflict manually.");
                    }}
                    onContextMenu={e => e.preventDefault()}
                    rows={7}
                    style={{
                        width: '100%', background: 'transparent', border: 'none', outline: 'none',
                        fontFamily: 'var(--font-code)', fontSize: '0.82rem', padding: '1rem',
                        color: 'var(--text)', resize: 'vertical', lineHeight: 1.7,
                    }}
                />
            </div>

            <AnimatePresence>
                {feedback && (
                    <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        style={{
                            padding: '0.6rem 1rem', marginBottom: '0.75rem', borderRadius: '6px',
                            background: feedback === 'correct' ? 'var(--neon-dim)' : 'var(--red-dim)',
                            border: `1px solid ${feedback === 'correct' ? 'var(--neon)' : 'var(--red)'}`,
                            color: feedback === 'correct' ? 'var(--neon)' : 'var(--red)',
                            fontSize: '0.82rem',
                        }}
                    >
                        {feedbackMsg}
                    </motion.div>
                )}
            </AnimatePresence>

            <HintRow hints={challenge.hints} hintsShown={hintsShown} setHintsShown={setHintsShown} />

            <button
                className="btn btn-primary w-full"
                style={{ marginTop: '1rem' }}
                disabled={feedback === 'correct'}
                onClick={handleResolve}
            >
                RESOLVE CONFLICT
            </button>
        </div>
    );
}

function BriefingLine({ text }) {
    const [hover, setHover] = useState(false);
    return (
        <motion.div
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={{
                display: 'flex', gap: '0.6rem', padding: '0.4rem 0.6rem',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
                fontFamily: 'var(--font-code)', fontSize: '0.84rem',
                color: 'var(--text)', lineHeight: 1.55,
                cursor: 'pointer',
                position: 'relative',
                borderRadius: '4px',
                marginLeft: '-0.6rem',
                width: 'calc(100% + 1.2rem)'
            }}
            onClick={() => {
                navigator.clipboard.writeText(text);
            }}
        >
            <span style={{ color: 'var(--neon)', opacity: 0.8 }}>▸</span>
            <span>{text}</span>
            {hover && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 0.8, scale: 1 }}
                    style={{
                        position: 'absolute',
                        right: '0.75rem',
                        fontSize: '0.8rem',
                        display: 'flex',
                        gap: '0.4rem',
                        alignItems: 'center',
                        background: 'var(--bg-3)',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        border: '1px solid var(--border-blue)',
                        zIndex: 5
                    }}
                >
                    <span style={{ fontSize: '0.65rem', color: 'var(--blue)' }}>🔗 COPY</span>
                </motion.div>
            )}
        </motion.div>
    );
}

// ── Shared Hint Row ───────────────────────────────
function HintRow({ hints, hintsShown, setHintsShown }) {
    if (!hints || hints.length === 0) return null;
    return (
        <div>
            <button
                className="btn"
                style={{ borderColor: 'var(--gold)', color: 'var(--gold)', padding: '0.25rem 0.7rem', fontSize: '0.68rem' }}
                disabled={hintsShown >= hints.length}
                onClick={() => setHintsShown(h => Math.min(h + 1, hints.length))}
            >
                {hintsShown >= hints.length ? '🔓 All hints revealed' : `💡 Request Hint (-10 XP) [${hints.length - hintsShown} left]`}
            </button>
            <AnimatePresence>
                {Array.from({ length: hintsShown }).map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginTop: '0.4rem' }}
                        exit={{ opacity: 0, height: 0 }}
                        style={{
                            padding: '0.4rem 0.75rem',
                            background: 'rgba(240,192,64,0.07)', border: '1px solid rgba(240,192,64,0.3)',
                            borderRadius: '4px', fontSize: '0.75rem', color: 'var(--gold)',
                            overflow: 'hidden',
                        }}
                    >
                        📡 <strong>INCOMING TRANSMISSION:</strong> {hints[i]}
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}

// ═══════════════════════════════════════════════════
// PHASE 3: REWARD
// ═══════════════════════════════════════════════════
function RewardPhase({ mission, totalXP, actualGainedXP, earnedBadge, dispatch }) {
    const badge = BADGES.find(b => b.id === earnedBadge);
    const [animatedXP, setAnimatedXP] = useState(0);
    const isPerfect = totalXP >= mission.rewardXP;

    useEffect(() => {
        if (totalXP === 0) return;
        let current = 0;
        const step = totalXP / 50;
        const interval = setInterval(() => {
            current = Math.min(current + step, totalXP);
            setAnimatedXP(Math.round(current));
            if (current >= totalXP) clearInterval(interval);
        }, 20);
        return () => clearInterval(interval);
    }, [totalXP]);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '1rem 0 2rem' }}>
            <motion.div
                className="glass"
                style={{
                    maxWidth: '480px', width: '100%', textAlign: 'center',
                    padding: '2.5rem 2rem',
                    border: '2px solid var(--gold)',
                    boxShadow: 'var(--glow-gold)',
                }}
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
            >
                <motion.div
                    className="pixel gold-text"
                    style={{ fontSize: '0.9rem', letterSpacing: '0.1em', marginBottom: '1.25rem' }}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
                >
                    ✦ MISSION COMPLETE ✦
                </motion.div>

                <motion.div
                    style={{ fontSize: '4rem', marginBottom: '0.75rem' }}
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0, transition: { type: 'spring', stiffness: 200, delay: 0.25 } }}
                >
                    🏆
                </motion.div>

                <motion.div
                    style={{ fontSize: '3rem', fontWeight: 700, color: 'var(--gold)', lineHeight: 1, marginBottom: '0.5rem' }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { delay: 0.4 } }}
                >
                    +{animatedXP === 0 && actualGainedXP === 0 ? 0 : animatedXP} XP
                </motion.div>

                <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginBottom: '1.5rem' }}>
                    {actualGainedXP === 0 && (
                        <span style={{ color: 'var(--blue)' }}>🛰️ REPLAY: You already earned rewards for this mission!</span>
                    )}
                    {actualGainedXP > 0 && isPerfect && (
                        <span style={{ color: 'var(--neon)' }}>⚡ PERFECT RUN — Full XP awarded!</span>
                    )}
                    {actualGainedXP > 0 && !isPerfect && (
                        `${totalXP} / ${mission.rewardXP} XP earned`
                    )}
                </div>

                {badge && (
                    <motion.div
                        initial={{ scale: 0, rotate: -30 }}
                        animate={{ scale: 1, rotate: 0, transition: { type: 'spring', delay: 0.65 } }}
                        style={{
                            display: 'inline-block', padding: '1rem 1.5rem', marginBottom: '1.75rem',
                            background: 'rgba(240,192,64,0.12)', border: '2px solid var(--gold)',
                            borderRadius: '12px', boxShadow: 'var(--glow-gold)',
                        }}
                    >
                        <div style={{ fontSize: '2.5rem', marginBottom: '0.3rem' }}>{badge.icon}</div>
                        <div className="pixel gold-text" style={{ fontSize: '0.48rem', letterSpacing: '0.05em' }}>
                            {badge.name}
                        </div>
                        <div style={{ fontSize: '0.62rem', color: 'var(--text-dim)', marginTop: '3px' }}>
                            BADGE UNLOCKED!
                        </div>
                    </motion.div>
                )}

                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                    <motion.button
                        className="btn btn-primary"
                        style={{ padding: '0.85rem 2rem', fontSize: '0.85rem' }}
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.97 }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0, transition: { delay: 0.8 } }}
                        onClick={() => dispatch({ type: 'RETURN_TO_DASHBOARD' })}
                    >
                        ▶ RETURN TO BASE
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
}
