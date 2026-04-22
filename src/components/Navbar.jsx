import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getLevelInfo } from '../data/gameData';
import { XPBar, LevelBadge } from './shared/XPBar';

const NAV_ITEMS = [
    { view: 'dashboard', label: 'MAP', icon: '🗺' },
    { view: 'reference', label: 'CHEATCODES', icon: '📡' },
    { view: 'profile', label: 'PROFILE', icon: '👾' },
];

function LogoTypewriter() {
    const text = 'Gitopia';
    const [displayed, setDisplayed] = useState('');
    const [showCursor, setShowCursor] = useState(true);

    useEffect(() => {
        let i = 0;
        const interval = setInterval(() => {
            if (i < text.length) {
                setDisplayed(text.slice(0, i + 1));
                i++;
            } else {
                clearInterval(interval);
                // Blink cursor for a moment then hide
                setTimeout(() => setShowCursor(false), 2000);
            }
        }, 120);
        return () => clearInterval(interval);
    }, []);

    return (
        <span className="pixel neon-text" style={{ fontSize: '0.85rem', position: 'relative' }}>
            {displayed}
            {showCursor && (
                <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity }}
                    style={{
                        display: 'inline-block',
                        width: '2px', height: '0.85rem',
                        background: 'var(--neon)',
                        marginLeft: '2px',
                        verticalAlign: 'middle',
                        boxShadow: '0 0 6px var(--neon)',
                    }}
                />
            )}
        </span>
    );
}

export default function Navbar({ view, player, dispatch }) {
    const { current } = getLevelInfo(player.xp);

    return (
        <nav style={{
            position: 'sticky', top: 0, zIndex: 100,
            background: 'rgba(10, 14, 20, 0.88)',
            borderBottom: '1px solid rgba(57,255,20,0.12)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            padding: '0.65rem 2rem',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            gap: '1.5rem',
        }}>
            {/* Animated bottom border glow */}
            <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0, height: '1px',
                background: 'linear-gradient(90deg, transparent, rgba(57,255,20,0.3), rgba(88,166,255,0.2), transparent)',
                animation: 'border-trace 6s linear infinite',
                backgroundSize: '200% 100%',
            }} />

            {/* Logo */}
            <motion.div
                style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
                onClick={() => dispatch({ type: 'SET_VIEW', payload: 'dashboard' })}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                <motion.span
                    style={{ fontSize: '1.6rem', filter: 'drop-shadow(0 0 8px rgba(57,255,20,0.5))' }}
                    animate={{ rotate: [0, -5, 5, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                >
                    ⚡
                </motion.span>
                <LogoTypewriter />
            </motion.div>

            {/* Navigation Links */}
            <div style={{ display: 'flex', gap: '0.35rem', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', padding: '3px' }}>
                {NAV_ITEMS.map(item => {
                    const isActive = view === item.view;
                    return (
                        <motion.button
                            key={item.view}
                            onClick={() => dispatch({ type: 'SET_VIEW', payload: item.view })}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.97 }}
                            style={{
                                background: isActive ? 'rgba(57,255,20,0.1)' : 'transparent',
                                border: 'none',
                                borderRadius: '8px',
                                padding: '0.5rem 1rem',
                                color: isActive ? 'var(--neon)' : 'var(--text-dim)',
                                fontFamily: 'var(--font-code)',
                                fontSize: '0.88rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                display: 'flex', alignItems: 'center', gap: '0.45rem',
                                position: 'relative',
                                letterSpacing: '0.02em',
                            }}
                        >
                            <span style={{ fontSize: '1rem' }}>{item.icon}</span>
                            <span className="hide-mobile">{item.label}</span>
                            {isActive && (
                                <motion.div
                                    layoutId="nav-active-indicator"
                                    style={{
                                        position: 'absolute', bottom: '-3px',
                                        left: '20%', right: '20%',
                                        height: '2px',
                                        background: 'var(--neon)',
                                        borderRadius: '1px',
                                        boxShadow: '0 0 8px var(--neon)',
                                    }}
                                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                />
                            )}
                        </motion.button>
                    );
                })}
            </div>

            {/* Player info */}
            <motion.div
                style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', cursor: 'pointer' }}
                onClick={() => dispatch({ type: 'SET_VIEW', payload: 'profile' })}
                whileHover={{ scale: 1.02 }}
            >
                <div style={{ textAlign: 'right' }} className="hide-mobile">
                    <div style={{
                        color: 'var(--gold)', fontSize: '0.88rem', fontWeight: 800,
                        textShadow: '0 0 8px rgba(240,192,64,0.3)',
                    }}>
                        {player.xp.toLocaleString()} XP
                    </div>
                    <div className="dim-text" style={{ fontSize: '0.72rem', letterSpacing: '0.03em' }}>{current.title}</div>
                </div>
                <motion.div
                    style={{
                        width: 44, height: 44, borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--neon-dim), rgba(88,166,255,0.1))',
                        border: '2px solid var(--neon)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1.4rem',
                        boxShadow: '0 0 12px rgba(57,255,20,0.25)',
                    }}
                    whileHover={{ boxShadow: '0 0 20px rgba(57,255,20,0.5)' }}
                >
                    {player.avatar}
                </motion.div>
                <LevelBadge xp={player.xp} />
            </motion.div>
        </nav>
    );
}
