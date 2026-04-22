import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getLevelInfo, BADGES, MODULES } from '../data/gameData';
import { XPBar } from './shared/XPBar';

const AVATARS = ['👾', '🤖', '🦊', '🐉', '🧠', '⚡', '🌊', '🔥', '🌙', '🎯', '🦾', '🕵️'];

const cardVariant = (delay = 0) => ({
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0, transition: { delay, duration: 0.4, ease: [0.4, 0, 0.2, 1] } },
});

export default function Profile({ player, dispatch }) {
    const inputStyle = {
        width: '100%',
        background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '8px', padding: '0.65rem 0.9rem',
        color: 'var(--text)', fontFamily: 'var(--font-code)',
        fontSize: '0.85rem', outline: 'none',
        transition: 'border-color 0.2s, background 0.2s',
        opacity: player.hasClaimedCertificate ? 0.6 : 1,
        cursor: player.hasClaimedCertificate ? 'not-allowed' : 'text',
    };

    const { current, next } = getLevelInfo(player.xp);
    // Controlled username input with local state — fixes concatenation bug
    const [editName, setEditName] = useState(player.username);
    const [editEmail, setEditEmail] = useState(player.email || '');
    const [editGit, setEditGit] = useState(player.gitProfile || '');
    const [saveFlash, setSaveFlash] = useState(false);

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
        setSaveFlash(true);
        setTimeout(() => setSaveFlash(false), 2000);
    };

    return (
        <div style={{ maxWidth: '960px', margin: '0 auto', padding: '1.5rem' }}>
            <motion.div
                className="pixel neon-text text-center"
                style={{ fontSize: '0.75rem', marginBottom: '1.5rem' }}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
            >
                ◈ PLAYER PROFILE ◈
            </motion.div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>

                {/* ── LEFT COLUMN ── */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                    {/* Identity card */}
                    <motion.div
                        className="glass p-6"
                        {...cardVariant(0)}
                        style={{ position: 'relative' }}
                    >
                        {/* Corner decorations */}
                        <div style={{
                            position: 'absolute', top: -1, left: -1,
                            width: '40px', height: '40px',
                            borderLeft: '2px solid var(--neon)', borderTop: '2px solid var(--neon)',
                            borderRadius: '14px 0 0 0', opacity: 0.3, pointerEvents: 'none',
                        }} />
                        <div style={{
                            position: 'absolute', bottom: -1, right: -1,
                            width: '40px', height: '40px',
                            borderRight: '2px solid var(--blue)', borderBottom: '2px solid var(--blue)',
                            borderRadius: '0 0 14px 0', opacity: 0.2, pointerEvents: 'none',
                        }} />

                        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                            <motion.div
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                whileTap={{ scale: 0.96 }}
                                onClick={() => {
                                    const i = AVATARS.indexOf(player.avatar);
                                    dispatch({ type: 'UPDATE_AVATAR', payload: AVATARS[(i + 1) % AVATARS.length] });
                                }}
                                style={{
                                    width: 95, height: 95, borderRadius: '50%', margin: '0 auto 1rem',
                                    background: 'linear-gradient(135deg, var(--neon-dim), rgba(88,166,255,0.08))',
                                    border: '2.5px solid var(--neon)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '3rem', cursor: 'pointer',
                                    boxShadow: '0 0 25px rgba(57,255,20,0.2), inset 0 0 20px rgba(57,255,20,0.05)',
                                }}
                                title="Click to cycle avatar"
                            >
                                {player.avatar}
                            </motion.div>

                            <div className="pixel neon-text" style={{ fontSize: '0.7rem', marginBottom: '0.3rem' }}>
                                {player.username}
                            </div>
                            <div className="dim-text text-xs" style={{ letterSpacing: '0.06em' }}>{current.title}</div>

                            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '0.6rem', flexWrap: 'wrap' }}>
                                <span className="badge badge-neon">LVL {current.level}</span>
                            </div>
                        </div>

                        <XPBar xp={player.xp} />

                        {next && (
                            <motion.div
                                className="dim-text text-xs text-center"
                                style={{ marginTop: '0.5rem' }}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1, transition: { delay: 0.5 } }}
                            >
                                {(next.minXP - player.xp).toLocaleString()} XP until <strong style={{ color: 'var(--neon)' }}>{next.title}</strong>
                            </motion.div>
                        )}
                    </motion.div>

                    {/* Edit Profile Info */}
                    <motion.div
                        className="glass p-6"
                        {...cardVariant(0.08)}
                    >
                        <div className="pixel neon-text mb-4" style={{ fontSize: '0.55rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span>📝 REGISTRY DETAILS</span>
                            <AnimatePresence>
                                {saveFlash && (
                                    <motion.span
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0 }}
                                        style={{
                                            fontSize: '0.5rem', color: 'var(--neon)',
                                            background: 'var(--neon-dim)', padding: '2px 8px',
                                            borderRadius: '4px', fontFamily: 'var(--font-code)',
                                        }}
                                    >
                                        ✓ SAVED
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ fontSize: '0.6rem', color: 'var(--text-dim)', display: 'block', marginBottom: '0.4rem', letterSpacing: '0.05em' }}>
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
                                    onFocus={e => e.target.style.borderColor = 'var(--neon)'}
                                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                                />
                            </div>

                            <div>
                                <label style={{ fontSize: '0.6rem', color: 'var(--text-dim)', display: 'block', marginBottom: '0.4rem', letterSpacing: '0.05em' }}>
                                    EMAIL ADDRESS {player.hasClaimedCertificate && '🔒'}
                                </label>
                                <input
                                    type="email"
                                    value={editEmail}
                                    disabled={player.hasClaimedCertificate}
                                    onChange={e => setEditEmail(e.target.value)}
                                    placeholder="your@email.com"
                                    style={inputStyle}
                                    onFocus={e => e.target.style.borderColor = 'var(--blue)'}
                                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                                />
                            </div>

                            <div>
                                <label style={{ fontSize: '0.6rem', color: 'var(--text-dim)', display: 'block', marginBottom: '0.4rem', letterSpacing: '0.05em' }}>
                                    GITHUB HANDLE {player.hasClaimedCertificate && '🔒'}
                                </label>
                                <input
                                    type="text"
                                    value={editGit}
                                    disabled={player.hasClaimedCertificate}
                                    onChange={e => setEditGit(e.target.value)}
                                    placeholder="@username"
                                    style={inputStyle}
                                    onFocus={e => e.target.style.borderColor = 'var(--purple)'}
                                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                                />
                            </div>

                            <motion.button
                                className={player.hasClaimedCertificate ? "btn btn-dim w-full" : "btn btn-primary w-full"}
                                style={{ marginTop: '0.5rem', padding: '0.75rem', fontSize: '0.75rem' }}
                                onClick={saveInfo}
                                disabled={player.hasClaimedCertificate}
                                whileHover={!player.hasClaimedCertificate ? { scale: 1.02 } : {}}
                                whileTap={!player.hasClaimedCertificate ? { scale: 0.98 } : {}}
                            >
                                {player.hasClaimedCertificate ? "🔒 IDENTITY LOCKED" : "UPDATE REGISTRY"}
                            </motion.button>
                        </div>
                    </motion.div>

                    {/* Avatar picker */}
                    <motion.div
                        className="glass p-4"
                        {...cardVariant(0.12)}
                    >
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            🎭 Choose Avatar
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                            {AVATARS.map(av => (
                                <motion.button
                                    key={av}
                                    whileHover={{ scale: 1.18, y: -2 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => dispatch({ type: 'UPDATE_AVATAR', payload: av })}
                                    style={{
                                        background: av === player.avatar ? 'rgba(57,255,20,0.12)' : 'rgba(255,255,255,0.03)',
                                        border: `1.5px solid ${av === player.avatar ? 'var(--neon)' : 'rgba(255,255,255,0.06)'}`,
                                        padding: '0.3rem 0.4rem',
                                        borderRadius: '8px', fontSize: '1.25rem', cursor: 'pointer',
                                        transition: 'all 0.15s',
                                        boxShadow: av === player.avatar ? '0 0 12px rgba(57,255,20,0.25)' : 'none',
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
                        {...cardVariant(0.05)}
                    >
                        <div className="pixel neon-text" style={{ fontSize: '0.55rem', marginBottom: '0.75rem' }}>
                            📊 STATS
                        </div>
                        {[
                            ['Total XP', player.xp.toLocaleString(), 'var(--gold)', '⚡'],
                            ['Level', `${current.level} — ${current.title}`, 'var(--neon)', '🎖'],
                            ['Missions Completed', `${player.completedMissions.length} / ${MODULES.length}`, 'var(--blue)', '🎯'],
                            ['Badges Earned', `${player.badges.length} / ${BADGES.length}`, 'var(--gold)', '🏅'],
                            ['Commands Run', player.totalCommandsRun, 'var(--text)', '⌨️'],
                            ['Hints Used', player.hintsUsed, 'var(--red)', '💡'],
                        ].map(([label, val, color, icon]) => (
                            <motion.div
                                key={label}
                                whileHover={{ x: 3, backgroundColor: 'rgba(57,255,20,0.02)' }}
                                style={{
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    padding: '0.5rem 0.25rem', borderBottom: '1px solid rgba(255,255,255,0.04)',
                                    fontSize: '0.78rem', borderRadius: '4px', transition: 'all 0.2s',
                                }}
                            >
                                <span style={{ color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                    <span style={{ fontSize: '0.7rem' }}>{icon}</span>
                                    {label}
                                </span>
                                <span className="stat-value" style={{ color, fontWeight: 600 }}>{val}</span>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Badge gallery */}
                    <motion.div
                        className="glass p-4"
                        {...cardVariant(0.1)}
                    >
                        <div className="pixel neon-text" style={{ fontSize: '0.55rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span>🏅 ACHIEVEMENT GALLERY</span>
                            <span style={{ color: 'var(--text-dim)', fontFamily: 'var(--font-code)', fontSize: '0.5rem' }}>
                                {player.badges.length}/{BADGES.length}
                            </span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.55rem' }}>
                            {BADGES.map((badge, i) => {
                                const earned = player.badges.includes(badge.id);
                                return (
                                    <motion.div
                                        key={badge.id}
                                        whileHover={{ scale: earned ? 1.06 : 1.02 }}
                                        title={badge.desc}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0, transition: { delay: 0.15 + i * 0.03 } }}
                                        style={{
                                            textAlign: 'center', padding: '0.7rem 0.3rem',
                                            border: `1px solid ${earned ? 'var(--gold)' : 'rgba(255,255,255,0.04)'}`,
                                            borderRadius: '10px',
                                            background: earned ? 'rgba(240,192,64,0.06)' : 'rgba(255,255,255,0.02)',
                                            opacity: earned ? 1 : 0.4,
                                            filter: earned ? 'drop-shadow(0 0 8px rgba(240,192,64,0.3))' : 'grayscale(0.8)',
                                            transition: 'all 0.2s',
                                            cursor: 'default',
                                        }}
                                    >
                                        <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{badge.icon}</div>
                                        <div style={{
                                            fontSize: '0.5rem', fontFamily: 'var(--font-code)', fontWeight: 600,
                                            color: earned ? 'var(--gold)' : 'var(--text-dim)',
                                            lineHeight: 1.3,
                                        }}>
                                            {badge.name}
                                        </div>
                                        <div style={{ fontSize: '0.42rem', color: earned ? 'var(--neon)' : 'var(--text-dim)', marginTop: '3px', letterSpacing: '0.03em' }}>
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
