import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminAccess({ isOpen, onClose, onUnlock }) {
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);
    const inputRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            setPassword('');
            setError(false);
            setSuccess(false);
            setTimeout(() => inputRef.current?.focus(), 150);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e?.preventDefault();
        if (password === '123654') {
            setError(false);
            setSuccess(true);
            setTimeout(() => {
                onUnlock();
                onClose();
            }, 1000);
        } else {
            setError(true);
            setPassword('');
            setTimeout(() => setError(false), 2200);
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 10000,
                    background: 'rgba(5, 7, 10, 0.88)',
                    backdropFilter: 'blur(16px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '1.5rem',
                }}
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, y: 20, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    exit={{ scale: 0.9, y: 20, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 25 }}
                    style={{
                        maxWidth: '460px',
                        width: '100%',
                        background: 'rgba(15, 19, 26, 0.96)',
                        border: `1.5px solid ${error ? 'var(--red)' : success ? 'var(--neon)' : 'rgba(57,255,20,0.4)'}`,
                        borderRadius: '12px',
                        boxShadow: error
                            ? '0 0 35px rgba(255, 77, 77, 0.35)'
                            : success
                                ? '0 0 45px rgba(57, 255, 20, 0.45)'
                                : '0 0 35px rgba(57, 255, 20, 0.15)',
                        overflow: 'hidden',
                        fontFamily: 'var(--font-code)',
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Title Bar */}
                    <div style={{
                        padding: '0.75rem 1rem',
                        background: 'rgba(0, 0, 0, 0.6)',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{ width: 10, height: 10, borderRadius: '50%', background: error ? 'var(--red)' : success ? 'var(--neon)' : '#eab308' }} />
                            <span style={{ fontSize: '0.72rem', letterSpacing: '0.1em', color: 'var(--text-dim)', fontWeight: 700 }}>
                                ROOT_OVERRIDE_SHELL // v2.0
                            </span>
                        </div>
                        <button
                            onClick={onClose}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: 'var(--text-dim)',
                                cursor: 'pointer',
                                fontSize: '0.9rem',
                            }}
                        >
                            ✕
                        </button>
                    </div>

                    {/* Content */}
                    <div style={{ padding: '2rem 1.75rem' }}>
                        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
                                {success ? '⚡' : error ? '🛑' : '🔐'}
                            </div>
                            <div className="pixel" style={{
                                fontSize: '0.75rem',
                                color: error ? 'var(--red)' : success ? 'var(--neon)' : '#fff',
                                letterSpacing: '0.05em',
                                marginBottom: '0.5rem',
                            }}>
                                {success ? 'ACCESS GRANTED' : error ? 'ACCESS DENIED' : 'ADMIN ACCESS CONTROL'}
                            </div>
                            <div className="dim-text" style={{ fontSize: '0.78rem', lineHeight: 1.5 }}>
                                {success
                                    ? 'Unlocking all 10 missions, maximum XP, and God-mode account...'
                                    : error
                                        ? 'Invalid passcode sequence. Security violation logged.'
                                        : 'Enter root passcode to unlock all levels & instant completion.'}
                            </div>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: '1.25rem' }}>
                                <label style={{ display: 'block', fontSize: '0.68rem', color: 'var(--neon)', marginBottom: '0.4rem', letterSpacing: '0.08em' }}>
                                    SECURITY_PASSCODE:
                                </label>
                                <input
                                    ref={inputRef}
                                    type="password"
                                    maxLength={20}
                                    value={password}
                                    disabled={success}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter passcode..."
                                    style={{
                                        width: '100%',
                                        background: 'rgba(0, 0, 0, 0.65)',
                                        border: `1.5px solid ${error ? 'var(--red)' : success ? 'var(--neon)' : 'rgba(88, 166, 255, 0.4)'}`,
                                        borderRadius: '6px',
                                        padding: '0.75rem 1rem',
                                        color: '#fff',
                                        fontSize: '1rem',
                                        letterSpacing: '0.2em',
                                        outline: 'none',
                                        textAlign: 'center',
                                        fontFamily: 'var(--font-code)',
                                    }}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={success || !password}
                                className="btn btn-primary w-full"
                                style={{
                                    height: '46px',
                                    fontSize: '0.85rem',
                                    background: success ? 'var(--neon)' : error ? 'var(--red)' : 'var(--neon)',
                                    color: '#000',
                                    fontWeight: 800,
                                    letterSpacing: '0.05em',
                                }}
                            >
                                {success ? '✓ OVERRIDE COMPLETE' : error ? '✗ RETRY PASSCODE' : '▶ AUTHENTICATE'}
                            </button>
                        </form>

                        <div style={{
                            marginTop: '1.25rem',
                            textAlign: 'center',
                            fontSize: '0.68rem',
                            color: 'var(--text-dim)',
                            opacity: 0.6,
                        }}>
                            TARGET: NO LOCKS • ALL 10 MISSIONS FINISHED • GIT GOD RANK
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
