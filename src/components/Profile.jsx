import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getLevelInfo, BADGES, MODULES } from '../data/gameData';
import { XPBar } from './shared/XPBar';

const AVATARS = ['👾', '🤖', '🦊', '🐉', '🧠', '⚡', '🌊', '🔥', '🌙', '🎯', '🦾', '🕵️'];

export default function Profile({ player, dispatch }) {
    const inputStyle = {
        width: '100%',
        background: 'var(--bg-3)', border: '1px solid var(--border)',
        borderRadius: '6px', padding: '0.6rem 0.8rem',
        color: 'var(--text)', fontFamily: 'var(--font-code)',
        fontSize: '0.85rem', outline: 'none',
        transition: 'border-color 0.2s',
        opacity: player.hasClaimedCertificate ? 0.6 : 1,
        cursor: player.hasClaimedCertificate ? 'not-allowed' : 'text',
    };

    const { current, next } = getLevelInfo(player.xp);
    // Controlled username input with local state — fixes concatenation bug
    const [editName, setEditName] = useState(player.username);
    const [editEmail, setEditEmail] = useState(player.email || '');
    const [editGit, setEditGit] = useState(player.gitProfile || '');

    // Keep local state in sync if player name is updated externally (e.g. reset)
    useEffect(() => {
        setEditName(player.username);
        setEditEmail(player.email || '');
        setEditGit(player.gitProfile || '');
    }, [player.username, player.email, player.gitProfile]);

    const saveInfo = () => {
        const trimmedName = editName.trim();
        dispatch({
            type: 'UPDATE_PLAYER_INFO',
            payload: {
                username: trimmedName || player.username,
                email: editEmail.trim(),
                gitProfile: editGit.trim()
            }
        });
        if (!trimmedName) setEditName(player.username);
    };

    return (
        <div style={{ maxWidth: '960px', margin: '0 auto', padding: '1.5rem' }}>
            <div className="pixel neon-text text-center" style={{ fontSize: '0.75rem', marginBottom: '1.5rem' }}>
                ◈ PLAYER PROFILE ◈
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>

                {/* ── LEFT COLUMN ── */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                    {/* Identity card */}
                    <motion.div
                        className="glass p-6"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                            <motion.div
                                whileHover={{ scale: 1.08 }}
                                whileTap={{ scale: 0.96 }}
                                onClick={() => {
                                    const i = AVATARS.indexOf(player.avatar);
                                    dispatch({ type: 'UPDATE_AVATAR', payload: AVATARS[(i + 1) % AVATARS.length] });
                                }}
                                style={{
                                    width: 90, height: 90, borderRadius: '50%', margin: '0 auto 1rem',
                                    background: 'var(--neon-dim)', border: '2px solid var(--neon)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '3rem', cursor: 'pointer',
                                    boxShadow: 'var(--glow-neon)',
                                }}
                                title="Click to cycle avatar"
                            >
                                {player.avatar}
                            </motion.div>

                            <div className="pixel neon-text" style={{ fontSize: '0.7rem', marginBottom: '0.3rem' }}>
                                {player.username}
                            </div>
                            <div className="dim-text text-xs">{current.title}</div>

                            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '0.6rem', flexWrap: 'wrap' }}>
                                <span className="badge badge-neon">LVL {current.level}</span>
                                <span className="badge badge-gold">🔥 {player.streak} day streak</span>
                            </div>
                        </div>

                        <XPBar xp={player.xp} />

                        {next && (
                            <div className="dim-text text-xs text-center" style={{ marginTop: '0.5rem' }}>
                                {(next.minXP - player.xp).toLocaleString()} XP until <strong style={{ color: 'var(--neon)' }}>{next.title}</strong>
                            </div>
                        )}
                    </motion.div>

                    {/* Edit Profile Info */}
                    <motion.div
                        className="glass p-6"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0, transition: { delay: 0.08 } }}
                    >
                        <div className="pixel neon-text mb-4" style={{ fontSize: '0.55rem' }}>
                            📝 REGISTRY DETAILS
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ fontSize: '0.65rem', color: 'var(--text-dim)', display: 'block', marginBottom: '0.4rem' }}>
                                    USERNAME {player.hasClaimedCertificate && '🔒'}
                                </label>
                                <input
                                    type="text"
                                    value={editName}
                                    maxLength={20}
                                    disabled={player.hasClaimedCertificate}
                                    onChange={e => setEditName(e.target.value)}
                                    placeholder="Hacker name"
                                    style={inputStyle}
                                />
                            </div>

                            <div>
                                <label style={{ fontSize: '0.65rem', color: 'var(--text-dim)', display: 'block', marginBottom: '0.4rem' }}>
                                    EMAIL ADDRESS {player.hasClaimedCertificate && '🔒'}
                                </label>
                                <input
                                    type="email"
                                    value={editEmail}
                                    disabled={player.hasClaimedCertificate}
                                    onChange={e => setEditEmail(e.target.value)}
                                    placeholder="your@email.com"
                                    style={inputStyle}
                                />
                            </div>

                            <div>
                                <label style={{ fontSize: '0.65rem', color: 'var(--text-dim)', display: 'block', marginBottom: '0.4rem' }}>
                                    GITHUB HANDLE {player.hasClaimedCertificate && '🔒'}
                                </label>
                                <input
                                    type="text"
                                    value={editGit}
                                    disabled={player.hasClaimedCertificate}
                                    onChange={e => setEditGit(e.target.value)}
                                    placeholder="@username"
                                    style={inputStyle}
                                />
                            </div>

                            <button
                                className={player.hasClaimedCertificate ? "btn btn-dim w-full" : "btn btn-primary w-full"}
                                style={{ marginTop: '0.5rem', padding: '0.75rem', fontSize: '0.75rem' }}
                                onClick={saveInfo}
                                disabled={player.hasClaimedCertificate}
                            >
                                {player.hasClaimedCertificate ? "🔒 IDENTITY LOCKED" : "UPDATE REGISTRY"}
                            </button>
                        </div>
                    </motion.div>

                    {/* Avatar picker */}
                    <motion.div
                        className="glass p-4"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0, transition: { delay: 0.12 } }}
                    >
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginBottom: '0.6rem' }}>
                            🎭 Choose Avatar
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {AVATARS.map(av => (
                                <motion.button
                                    key={av}
                                    whileHover={{ scale: 1.15 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => dispatch({ type: 'UPDATE_AVATAR', payload: av })}
                                    style={{
                                        background: av === player.avatar ? 'var(--neon-dim)' : 'var(--bg-3)',
                                        border: `1.5px solid ${av === player.avatar ? 'var(--neon)' : '#444'}`,
                                        padding: '0.3rem 0.4rem',
                                        borderRadius: '6px', fontSize: '1.25rem', cursor: 'pointer',
                                        transition: 'all 0.15s',
                                        boxShadow: av === player.avatar ? 'var(--glow-neon)' : 'none',
                                    }}
                                >
                                    {av}
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* ── RIGHT COLUMN ── */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                    {/* Stats */}
                    <motion.div
                        className="glass p-4"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0, transition: { delay: 0.05 } }}
                    >
                        <div className="pixel neon-text" style={{ fontSize: '0.55rem', marginBottom: '0.75rem' }}>
                            📊 STATS
                        </div>
                        {[
                            ['Total XP', player.xp.toLocaleString(), 'var(--gold)'],
                            ['Level', `${current.level} — ${current.title}`, 'var(--neon)'],
                            ['Missions Completed', `${player.completedMissions.length} / ${MODULES.length}`, 'var(--blue)'],
                            ['Badges Earned', `${player.badges.length} / ${BADGES.length}`, 'var(--gold)'],
                            ['Commands Run', player.totalCommandsRun, 'var(--text)'],
                            ['Hints Used', player.hintsUsed, 'var(--red)'],
                            ['Day Streak', `${player.streak} 🔥`, 'var(--red)'],
                        ].map(([label, val, color]) => (
                            <div key={label} style={{
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                padding: '0.45rem 0', borderBottom: '1px solid rgba(255,255,255,0.04)',
                                fontSize: '0.78rem',
                            }}>
                                <span style={{ color: 'var(--text-dim)' }}>{label}</span>
                                <span style={{ color, fontWeight: 600 }}>{val}</span>
                            </div>
                        ))}
                    </motion.div>

                    {/* Badge gallery */}
                    <motion.div
                        className="glass p-4"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
                    >
                        <div className="pixel neon-text" style={{ fontSize: '0.55rem', marginBottom: '0.75rem' }}>
                            🏅 ACHIEVEMENT GALLERY
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.6rem' }}>
                            {BADGES.map(badge => {
                                const earned = player.badges.includes(badge.id);
                                return (
                                    <motion.div
                                        key={badge.id}
                                        whileHover={{ scale: earned ? 1.06 : 1.02 }}
                                        title={badge.desc}
                                        style={{
                                            textAlign: 'center', padding: '0.65rem 0.3rem',
                                            border: `1px solid ${earned ? 'var(--gold)' : '#2d333b'}`,
                                            borderRadius: '8px',
                                            background: earned ? 'rgba(240,192,64,0.08)' : 'var(--bg-3)',
                                            opacity: earned ? 1 : 0.45,
                                            filter: earned ? 'drop-shadow(0 0 6px rgba(240,192,64,0.35))' : 'none',
                                            transition: 'all 0.2s',
                                            cursor: 'default',
                                        }}
                                    >
                                        <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{badge.icon}</div>
                                        <div style={{
                                            fontSize: '0.52rem', fontFamily: 'var(--font-code)', fontWeight: 600,
                                            color: earned ? 'var(--gold)' : 'var(--text-dim)',
                                            lineHeight: 1.3,
                                        }}>
                                            {badge.name}
                                        </div>
                                        <div style={{ fontSize: '0.45rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                                            {earned ? '✓ EARNED' : badge.desc.replace('Complete ', '')}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>

                </div>
            </div>
        </div>
    );
}
