import { motion } from 'framer-motion';
import { getLevelInfo } from '../data/gameData';
import { XPBar, LevelBadge } from './shared/XPBar';

const NAV_ITEMS = [
    { view: 'dashboard', label: 'MAP', icon: '🗺' },
    { view: 'reference', label: 'DATABASE', icon: '📡' },
    { view: 'profile', label: 'PROFILE', icon: '👾' },
];

export default function Navbar({ view, player, dispatch }) {
    const { current } = getLevelInfo(player.xp);

    return (
        <nav style={{
            position: 'sticky', top: 0, zIndex: 100,
            background: 'rgba(13, 17, 23, 0.92)',
            borderBottom: '1px solid rgba(57,255,20,0.2)',
            backdropFilter: 'blur(12px)',
            padding: '0.8rem 2rem',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            gap: '1.5rem',
        }}>
            {/* Logo */}
            <div
                style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}
                onClick={() => dispatch({ type: 'SET_VIEW', payload: 'dashboard' })}
            >
                <span style={{ fontSize: '1.8rem' }}>⚡</span>
                <div className="pixel neon-text" style={{ fontSize: '0.85rem' }}>
                    Gitopia
                </div>
            </div>

            {/* Navigation Links */}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
                {NAV_ITEMS.map(item => (
                    <button
                        key={item.view}
                        onClick={() => dispatch({ type: 'SET_VIEW', payload: item.view })}
                        style={{
                            background: view === item.view ? 'var(--neon-dim)' : 'transparent',
                            border: `2px solid ${view === item.view ? 'var(--neon)' : 'transparent'}`,
                            borderRadius: '8px',
                            padding: '0.55rem 1.1rem',
                            color: view === item.view ? 'var(--neon)' : 'var(--text-dim)',
                            fontFamily: 'var(--font-code)',
                            fontSize: '0.94rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            display: 'flex', alignItems: 'center', gap: '0.45rem',
                        }}
                    >
                        <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
                        <span className="hide-mobile">{item.label}</span>
                    </button>
                ))}
            </div>

            {/* Player info */}
            <div
                style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}
                onClick={() => dispatch({ type: 'SET_VIEW', payload: 'profile' })}
            >
                <div style={{ textAlign: 'right' }} className="hide-mobile">
                    <div style={{ color: 'var(--gold)', fontSize: '0.94rem', fontWeight: 800 }}>
                        {player.xp.toLocaleString()} XP
                    </div>
                    <div className="dim-text" style={{ fontSize: '0.8rem' }}>{current.title}</div>
                </div>
                <div style={{
                    width: 48, height: 48, borderRadius: '50%',
                    background: 'var(--neon-dim)',
                    border: '2px solid var(--neon)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.56rem',
                    boxShadow: 'var(--glow-neon)',
                }}>
                    {player.avatar}
                </div>
                <LevelBadge xp={player.xp} />
            </div>
        </nav>
    );
}
