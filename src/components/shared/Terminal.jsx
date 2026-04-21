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
    const inputRef = useRef(null);
    const bottomRef = useRef(null);

    useEffect(() => {
        if (!disabled && inputRef.current) inputRef.current.focus();
    }, [disabled]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history]);

    const runCommand = (cmd) => {
        const trimmed = cmd.trim();
        const isCorrect = expected.some(e => trimmed === e);

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

    return (
        <div
            className="terminal-window"
            style={{
                border: flash === 'success' ? '1px solid var(--neon)' : flash === 'error' ? '1px solid var(--red)' : '1px solid #333',
                transition: 'border-color 0.3s',
                boxShadow: flash === 'success' ? 'var(--glow-neon)' : flash === 'error' ? '0 0 12px var(--red)' : 'none'
            }}
            onClick={() => !disabled && inputRef.current?.focus()}
        >
            <div className="terminal-titlebar">
                <div className="dot dot-red" />
                <div className="dot dot-yellow" />
                <div className="dot dot-green" />
                <span style={{ marginLeft: '0.5rem' }}>gitquest-terminal — bash</span>
            </div>
            <div className="terminal-body" style={{ maxHeight: '220px', overflowY: 'auto' }}>
                {history.map((h, i) => (
                    <div key={i}>
                        <div className="terminal-line">
                            <span className="terminal-prompt">$ ({h.prompt}) &gt;</span>
                            <span>{h.cmd}</span>
                        </div>
                        {h.output && (
                            <div
                                className="terminal-line"
                                style={{ color: h.isError ? 'var(--red)' : 'var(--neon)', paddingLeft: '1rem' }}
                            >
                                {h.isError ? '✗' : '✓'} {h.output}
                            </div>
                        )}
                    </div>
                ))}
                {solved && (
                    <AnimatePresence>
                        <motion.div
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="terminal-line"
                            style={{ color: 'var(--neon)', paddingTop: '0.5rem' }}
                        >
                            <span className="terminal-prompt">sys:</span>
                            <span>✓ Command accepted. Mission progress updated.</span>
                        </motion.div>
                    </AnimatePresence>
                )}
                <div ref={bottomRef} />
            </div>

            {!solved && !disabled && (
                <div className="terminal-input-line" style={{ padding: '0.5rem 1rem' }}>
                    <span className="terminal-prompt neon-text">$ ({prompt}) &gt;</span>
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
                    <span className="terminal-cursor" />
                </div>
            )}

            {hints.length > 0 && !solved && (wrongCount >= 3 || hintsShown > 0) && (
                <div style={{ padding: '0.3rem 1rem 0.7rem', borderTop: '1px solid #222' }}>
                    <button
                        className="btn text-xs"
                        style={{ fontSize: '0.68rem', padding: '0.25rem 0.6rem', borderColor: 'var(--gold)', color: 'var(--gold)' }}
                        onClick={showHint}
                        disabled={hintsShown >= hints.length}
                    >
                        {hintsShown >= hints.length ? '🔓 Hints exhausted' : '💡 Request Hint (-10 XP)'}
                    </button>
                    <AnimatePresence>
                        {Array.from({ length: hintsShown }).map((_, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                style={{
                                    marginTop: '0.4rem',
                                    padding: '0.4rem 0.6rem',
                                    background: 'rgba(240,192,64,0.08)',
                                    border: '1px solid rgba(240,192,64,0.3)',
                                    borderRadius: '4px',
                                    fontSize: '0.75rem',
                                    color: 'var(--gold)',
                                }}
                            >
                                📡 Incoming Transmission: {hints[i]}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}
