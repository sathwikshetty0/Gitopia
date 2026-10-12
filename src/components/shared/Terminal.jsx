import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Simulated / interactive terminal component
export function Terminal({ prompt = 'project/', expected = [], onSuccess, onError, onHint, hints = [], disabled = false }) {
    const [history, setHistory] = useState([]);
    const [input, setInput] = useState('');
    const [hintsShown, setHintsShown] = useState(0);
    const [solved, setSolved] = useState(false);
    const [flash, setFlash] = useState(null); // 'success' | 'error'
    const [wrongCount, setWrongCount] = useState(0);
    const [typingCmd, setTypingCmd] = useState(null); // for auto-type effect on success
    const inputRef = useRef(null);
    const bottomRef = useRef(null);

    useEffect(() => {
        if (!disabled && inputRef.current) inputRef.current.focus();
    }, [disabled]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history]);

    const runCommand = (cmd) => {
        const trimmed = cmd.trim().replace(/\s+/g, ' ');
        const isCorrect = expected.some(e => trimmed === e.trim().replace(/\s+/g, ' '));

        const newHistory = [...history, {
            prompt,
            cmd: trimmed,
            output: isCorrect
                ? null
                : trimmed === ''
                    ? null
                    : `git: '${trimmed.replace('git ', '')}' is not the command we expected.`,
            isError: !isCorrect && trimmed !== '',
        }];
        setHistory(newHistory);
        setInput('');

        if (isCorrect && !solved) {
            setSolved(true);
            setFlash('success');
            setTimeout(() => { setFlash(null); onSuccess && onSuccess(); }, 1500);
        } else if (!isCorrect && trimmed !== '') {
            setFlash('error');
            setTimeout(() => setFlash(null), 600);
            setWrongCount(w => {
                const nw = w + 1;
                if (nw === 3 && hintsShown === 0) setHintsShown(1);
                return nw;
            });
            onError && onError(trimmed);
        }
    };

    const showHint = () => {
        if (hintsShown < hints.length) {
            const next = hintsShown + 1;
            setHintsShown(next);
            onHint && onHint(next);
        }
    };

    const borderColor = flash === 'success'
        ? 'rgba(57,255,20,0.6)'
        : flash === 'error'
            ? 'rgba(255,77,77,0.6)'
            : 'rgba(255,255,255,0.08)';

    return (
        <div
            className="terminal-window"
            style={{
                border: `1px solid ${borderColor}`,
                transition: 'border-color 0.3s, box-shadow 0.3s',
                boxShadow: flash === 'success'
                    ? '0 0 20px rgba(57,255,20,0.15), inset 0 0 30px rgba(57,255,20,0.03)'
                    : flash === 'error'
                        ? '0 0 20px rgba(255,77,77,0.15), inset 0 0 30px rgba(255,77,77,0.03)'
                        : '0 8px 32px rgba(0,0,0,0.4)',
            }}
            onClick={() => !disabled && inputRef.current?.focus()}
        >
            <div className="terminal-titlebar">
                <div className="dot dot-red" />
                <div className="dot dot-yellow" />
                <div className="dot dot-green" />
                <span style={{ marginLeft: '0.5rem', letterSpacing: '0.03em' }}>gitquest-terminal — bash</span>
                {/* Live indicator */}
                <motion.div
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{
                        marginLeft: 'auto',
                        display: 'flex', alignItems: 'center', gap: '0.3rem',
                        fontSize: '0.6rem', color: solved ? 'var(--neon)' : 'var(--text-dim)',
                    }}
                >
                    <div style={{
                        width: 5, height: 5, borderRadius: '50%',
                        background: solved ? 'var(--neon)' : '#666',
                        boxShadow: solved ? '0 0 6px var(--neon)' : 'none',
                    }} />
                    {solved ? 'PASSED' : 'LIVE'}
                </motion.div>
            </div>
            <div className="terminal-body" style={{ maxHeight: '240px', overflowY: 'auto', padding: '0.75rem 1rem' }}>
                {/* Welcome message */}
                {history.length === 0 && !solved && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.4 }}
                        style={{
                            fontSize: '0.7rem', color: 'var(--text-dim)',
                            fontStyle: 'italic', marginBottom: '0.5rem',
                            fontFamily: 'var(--font-code)',
                        }}
                    >
                        Type the correct git command and press Enter...
                    </motion.div>
                )}

                {history.map((h, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.15 }}
                    >
                        <div className="terminal-line">
                            <span className="terminal-prompt">$ ({h.prompt}) &gt;</span>
                            <span style={{ color: h.isError ? 'rgba(255,255,255,0.7)' : 'var(--text)' }}>{h.cmd}</span>
                        </div>
                        {h.output && (
                            <motion.div
                                className="terminal-line"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.1 }}
                                style={{
                                    color: h.isError ? 'var(--red)' : 'var(--neon)',
                                    paddingLeft: '1rem',
                                    fontSize: '0.78rem',
                                }}
                            >
                                {h.isError ? '✗' : '✓'} {h.output}
                            </motion.div>
                        )}
                    </motion.div>
                ))}
                {solved && (
                    <AnimatePresence>
                        <motion.div
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="terminal-line"
                            style={{
                                color: 'var(--neon)', paddingTop: '0.5rem',
                                textShadow: '0 0 8px rgba(57,255,20,0.3)',
                            }}
                        >
                            <span className="terminal-prompt">sys:</span>
                            <span>✓ Command accepted. Mission progress updated.</span>
                        </motion.div>
                    </AnimatePresence>
                )}
                <div ref={bottomRef} />
            </div>

            {!solved && !disabled && (
                <div className="terminal-input-line" style={{
                    padding: '0.5rem 1rem',
                    borderTop: '1px solid rgba(57,255,20,0.08)',
                    background: 'rgba(0,0,0,0.2)',
                }}>
                    <span className="terminal-prompt neon-text" style={{ textShadow: '0 0 8px rgba(57,255,20,0.4)' }}>
                        $ ({prompt}) &gt;
                    </span>
                    <input
                        ref={inputRef}
                        type="text"
                        className="terminal-input"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && runCommand(input)}
                        placeholder="type a git command..."
                        autoComplete="off"
                        spellCheck={false}
                    />
                    <motion.span
                        className="terminal-cursor"
                        animate={{ opacity: [1, 0, 1] }}
                        transition={{ duration: 1.2, repeat: Infinity }}
                    />
                </div>
            )}

            {hints.length > 0 && !solved && (wrongCount >= 3 || hintsShown > 0) && (
                <div style={{
                    padding: '0.4rem 1rem 0.7rem',
                    borderTop: '1px solid rgba(240,192,64,0.1)',
                    background: 'rgba(240,192,64,0.02)',
                }}>
                    <motion.button
                        className="btn text-xs"
                        style={{
                            fontSize: '0.65rem', padding: '0.25rem 0.6rem',
                            borderColor: 'var(--gold)', color: 'var(--gold)',
                        }}
                        onClick={showHint}
                        disabled={hintsShown >= hints.length}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                    >
                        {hintsShown >= hints.length ? '🔓 Hints exhausted' : `💡 Request Hint (-10 XP) [${hints.length - hintsShown}]`}
                    </motion.button>
                    <AnimatePresence>
                        {Array.from({ length: hintsShown }).map((_, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                style={{
                                    marginTop: '0.4rem',
                                    padding: '0.4rem 0.6rem',
                                    background: 'rgba(240,192,64,0.06)',
                                    border: '1px solid rgba(240,192,64,0.2)',
                                    borderRadius: '6px',
                                    fontSize: '0.72rem',
                                    color: 'var(--gold)',
                                    lineHeight: 1.5,
                                }}
                            >
                                📡 <strong>TRANSMISSION:</strong> {hints[i]}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}
