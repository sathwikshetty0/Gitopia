import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MODULES, BADGES, getLevelInfo } from '../data/gameData';
import { XPBar, LevelBadge } from './shared/XPBar';

const AVATARS = ['👾', '🤖', '🦊', '🐉', '🧠', '⚡', '🌊', '🔥', '🌙', '🎯', '🦾', '🕵️'];

export default function Dashboard({ player, dispatch }) {
    const { current: levelInfo } = getLevelInfo(player.xp);

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: '320px 1fr',
            gap: '1.5rem',
            padding: '1rem 1.5rem',
            maxWidth: '1600px',
            margin: '0 auto',
        }}>
            {/* LEFT — Profile */}
            <aside style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <ProfileCard player={player} levelInfo={levelInfo} dispatch={dispatch} />
                <BadgeGallery player={player} />
                <StatsCard player={player} />
            </aside>

            {/* RIGHT — Skill Tree */}
            <main>
                <SkillTree player={player} dispatch={dispatch} />
            </main>
        </div>
    );
}

function AnimatedCounter({ value, duration = 1500, color }) {
    const [display, setDisplay] = useState(0);
    useEffect(() => {
        const target = typeof value === 'number' ? value : parseInt(value) || 0;
        if (target === 0) { setDisplay(0); return; }
        let start = 0;
        const step = target / (duration / 16);
        const interval = setInterval(() => {
            start = Math.min(start + step, target);
            setDisplay(Math.round(start));
            if (start >= target) clearInterval(interval);
        }, 16);
        return () => clearInterval(interval);
    }, [value, duration]);
    return <span style={{ color, fontWeight: 700, fontSize: '0.9rem', fontVariantNumeric: 'tabular-nums' }}>{display.toLocaleString()}</span>;
}

function ProfileCard({ player, levelInfo, dispatch }) {
    return (
        <motion.div
            className="glass p-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ position: 'relative', overflow: 'visible' }}
        >
            {/* Decorative corner accent */}
            <div style={{
                position: 'absolute', top: -1, right: -1,
                width: '60px', height: '60px',
                borderRight: '2px solid var(--neon)',
                borderTop: '2px solid var(--neon)',
                borderRadius: '0 14px 0 0',
                opacity: 0.3,
                pointerEvents: 'none',
            }} />

            {/* Avatar */}
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                    className="animate-pulse-border"
                    style={{
                        width: 85, height: 85, borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--neon-dim), rgba(88,166,255,0.08))',
                        border: '2.5px solid var(--neon)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '2.5rem', margin: '0 auto 0.75rem',
                        cursor: 'pointer',
                        boxShadow: '0 0 20px rgba(57,255,20,0.15), inset 0 0 20px rgba(57,255,20,0.05)',
                    }}
                    onClick={() => {
                        const next = AVATARS[(AVATARS.indexOf(player.avatar) + 1) % AVATARS.length];
                        dispatch({ type: 'UPDATE_AVATAR', payload: next });
                    }}
                    title="Click to change avatar"
                >
                    {player.avatar}
                </motion.div>
                <div className="pixel neon-text" style={{ fontSize: '0.7rem' }}>{player.username}</div>
                <div className="dim-text text-xs" style={{ marginTop: '0.25rem', letterSpacing: '0.06em' }}>
                    {levelInfo.title}
                </div>
                <div style={{ marginTop: '0.5rem' }}>
                    <LevelBadge xp={player.xp} />
                </div>
            </div>

            <XPBar xp={player.xp} />

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem', marginTop: '1.25rem' }}>
                {[
                    { label: 'Total XP', value: player.xp, color: 'var(--gold)', icon: '⚡' },
                    { label: 'Missions', value: player.completedMissions.length, color: 'var(--neon)', icon: '🎯' },
                    { label: 'Badges', value: player.badges.length, color: 'var(--blue)', icon: '🏅' },
                ].map(s => (
                    <motion.div
                        key={s.label}
                        whileHover={{ scale: 1.03, borderColor: `${s.color}44` }}
                        style={{
                            background: 'rgba(255,255,255,0.02)', borderRadius: '10px', padding: '0.65rem',
                            border: '1px solid rgba(255,255,255,0.04)', textAlign: 'center',
                            transition: 'all 0.2s',
                            cursor: 'default',
                        }}
                    >
                        <div style={{ fontSize: '0.65rem', marginBottom: '2px' }}>{s.icon}</div>
                        <div className="dim-text" style={{ fontSize: '0.55rem', marginBottom: '4px', letterSpacing: '0.05em' }}>{s.label}</div>
                        <AnimatedCounter value={s.value} color={s.color} />
                    </motion.div>
                ))}
            </div>

            {/* Continue Mission CTA */}
            <ContinueMissionButton player={player} dispatch={dispatch} />
            <ClaimCertificateButton player={player} dispatch={dispatch} />
        </motion.div>
    );
}

function ContinueMissionButton({ player, dispatch }) {
    const nextMission = MODULES.find(m =>
        !player.completedMissions.includes(m.id) &&
        m.deps.every(d => player.completedMissions.includes(d))
    );
    if (!nextMission) return (
        <motion.div
            className="text-center text-xs neon-text"
            style={{ marginTop: '1rem', opacity: 0.7 }}
            animate={{ opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
        >
            🏆 All missions complete!
        </motion.div>
    );
    return (
        <motion.button
            className="btn btn-primary w-full"
            style={{ marginTop: '1.25rem', fontFamily: 'var(--font-code)', letterSpacing: '0.05em', padding: '0.75rem' }}
            onClick={() => dispatch({ type: 'START_MISSION', payload: nextMission.id })}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
        >
            ▶ CONTINUE MISSION
        </motion.button>
    );
}

function ClaimCertificateButton({ player, dispatch }) {
    const isReady = player.completedMissions.length === MODULES.length;
    if (!isReady) return null;

    return (
        <motion.button
            className="btn w-full"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            style={{
                marginTop: '1rem',
                background: 'linear-gradient(135deg, var(--gold), #ff8c00)',
                color: '#000',
                border: 'none',
                fontFamily: 'var(--font-pixel)',
                fontSize: '0.55rem',
                padding: '0.8rem',
                boxShadow: '0 0 25px rgba(240,192,64,0.3)',
                position: 'relative',
                overflow: 'hidden',
            }}
            onClick={() => dispatch({ type: 'SET_VIEW', payload: 'certification' })}
        >
            <motion.div
                style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                }}
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            />
            <span style={{ position: 'relative', zIndex: 1 }}>✨ CLAIM CERTIFICATE ✨</span>
        </motion.button>
    );
}

function BadgeGallery({ player }) {
    return (
        <motion.div
            className="glass p-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
        >
            <div className="pixel neon-text mb-3" style={{ fontSize: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>BADGES</span>
                <span style={{ fontSize: '0.5rem', color: 'var(--text-dim)', fontFamily: 'var(--font-code)' }}>
                    {player.badges.length}/{BADGES.length}
                </span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                {BADGES.map(badge => {
                    const earned = player.badges.includes(badge.id);
                    return (
                        <motion.div
                            key={badge.id}
                            title={badge.desc}
                            whileHover={{ scale: 1.18, y: -2 }}
                            style={{
                                padding: '0.35rem 0.55rem', borderRadius: '8px',
                                border: `1px solid ${earned ? 'var(--gold)' : 'rgba(255,255,255,0.06)'}`,
                                background: earned ? 'rgba(240,192,64,0.08)' : 'rgba(255,255,255,0.02)',
                                fontSize: '1.15rem', cursor: 'default',
                                opacity: earned ? 1 : 0.25,
                                filter: earned ? 'drop-shadow(0 0 8px rgba(240,192,64,0.4))' : 'grayscale(0.8)',
                                transition: 'all 0.2s',
                            }}
                        >
                            {badge.icon}
                            <div style={{ fontSize: '0.4rem', color: earned ? 'var(--gold)' : 'var(--text-dim)', marginTop: '2px', textAlign: 'center', fontFamily: 'var(--font-code)' }}>
                                {badge.name.split(' ')[0]}
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </motion.div>
    );
}

function StatsCard({ player }) {
    const stats = [
        ['Commands run', player.totalCommandsRun, '⌨️'],
        ['Hints used', player.hintsUsed, '💡'],
        ['Missions done', `${player.completedMissions.length} / ${MODULES.length}`, '🎯'],
    ];

    return (
        <motion.div
            className="glass p-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
        >
            <div className="pixel neon-text mb-3" style={{ fontSize: '0.6rem' }}>STATS</div>
            {stats.map(([label, val, icon]) => (
                <motion.div
                    key={label}
                    whileHover={{ x: 3, backgroundColor: 'rgba(57,255,20,0.03)' }}
                    style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: '0.4rem 0.2rem', borderBottom: '1px solid rgba(255,255,255,0.04)',
                        fontSize: '0.78rem', borderRadius: '4px', transition: 'all 0.2s',
                    }}
                >
                    <span className="dim-text" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span style={{ fontSize: '0.7rem' }}>{icon}</span>
                        {label}
                    </span>
                    <span className="stat-value" style={{ color: 'var(--text)', fontWeight: 600 }}>{val}</span>
                </motion.div>
            ))}
        </motion.div>
    );
}

// ────────────────────────────────────────────────────────────
//  SKILL TREE
// ────────────────────────────────────────────────────────────
function SkillTree({ player, dispatch }) {
    const completedCount = player.completedMissions.length;
    const totalCount = MODULES.length;
    const progressPct = Math.round((completedCount / totalCount) * 100);

    return (
        <div>
            {/* Header with progress */}
            <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                marginBottom: '1.25rem', padding: '0 0.25rem',
            }}>
                <div className="pixel neon-text" style={{ fontSize: '0.8rem' }}>
                    ◈ MISSION MAP ◈
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                        width: '120px', height: '6px',
                        background: 'var(--bg-3)', borderRadius: '3px',
                        overflow: 'hidden', border: '1px solid rgba(57,255,20,0.1)',
                    }}>
                        <motion.div
                            style={{
                                height: '100%', background: 'var(--neon)',
                                borderRadius: '3px',
                                boxShadow: '0 0 6px var(--neon)',
                            }}
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPct}%` }}
                            transition={{ duration: 1, delay: 0.3 }}
                        />
                    </div>
                    <span className="dim-text text-xs" style={{ fontVariantNumeric: 'tabular-nums' }}>
                        {completedCount}/{totalCount}
                    </span>
                </div>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '1.25rem',
            }}>
                {MODULES.map((mod, i) => (
                    <MissionNode key={mod.id} mod={mod} player={player} dispatch={dispatch} index={i} />
                ))}
            </div>
        </div>
    );
}

function MissionNode({ mod, player, dispatch, index }) {
    const isCompleted = player.completedMissions.includes(mod.id);
    const isLocked = mod.deps.some(dep => !player.completedMissions.includes(dep));
    const isAvailable = !isLocked && !isCompleted;

    const borderColor = isCompleted ? 'var(--blue)' : isAvailable ? mod.color : 'rgba(255,255,255,0.06)';
    const statusColor = isCompleted ? 'var(--blue)' : isAvailable ? 'var(--neon)' : 'var(--text-dim)';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: index * 0.04 } }}
            whileHover={!isLocked ? { scale: 1.03, y: -4 } : {}}
            whileTap={!isLocked ? { scale: 0.98 } : {}}
            style={{
                background: isCompleted
                    ? 'rgba(88,166,255,0.05)'
                    : isAvailable
                        ? 'rgba(57,255,20,0.03)'
                        : 'rgba(0,0,0,0.25)',
                border: `1.5px solid ${borderColor}`,
                borderRadius: '14px',
                padding: '1.25rem',
                cursor: isLocked ? 'not-allowed' : 'pointer',
                boxShadow: isAvailable
                    ? `0 0 15px ${mod.color}15, 0 4px 20px rgba(0,0,0,0.3)`
                    : isCompleted
                        ? '0 4px 20px rgba(0,0,0,0.2)'
                        : 'none',
                transition: 'all 0.3s ease',
                opacity: isLocked ? 0.35 : 1,
                position: 'relative',
                overflow: 'hidden',
                minHeight: '195px',
                display: 'flex',
                flexDirection: 'column',
            }}
            onClick={() => !isLocked && dispatch({ type: 'START_MISSION', payload: mod.id })}
        >
            {/* Top gradient accent */}
            <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
                background: isCompleted
                    ? 'linear-gradient(90deg, transparent, var(--blue), transparent)'
                    : isAvailable
                        ? `linear-gradient(90deg, transparent, ${mod.color}, transparent)`
                        : 'none',
                opacity: 0.6,
            }} />

            {isCompleted && (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    style={{
                        position: 'absolute', top: '0.5rem', right: '0.5rem',
                        width: 24, height: 24, borderRadius: '50%',
                        background: 'rgba(88,166,255,0.15)',
                        border: '1.5px solid var(--blue)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'var(--blue)', fontSize: '0.7rem', fontWeight: 800,
                    }}
                >✓</motion.div>
            )}
            {isLocked && (
                <div style={{
                    position: 'absolute', top: '0.5rem', right: '0.5rem',
                    fontSize: '0.9rem', opacity: 0.5,
                }}>🔒</div>
            )}

            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{mod.icon}</div>
            <div className="pixel" style={{
                fontSize: '0.7rem', color: statusColor, marginBottom: '0.3rem',
                lineHeight: 1.4,
            }}>
                {mod.title}
            </div>
            <div className="dim-text" style={{ fontSize: '0.75rem', marginBottom: '1rem', lineHeight: 1.55, flex: 1 }}>
                {mod.subtitle}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                <span style={{
                    color: 'var(--gold)', fontSize: '0.8rem', fontWeight: 800,
                    textShadow: isAvailable ? '0 0 8px rgba(240,192,64,0.3)' : 'none',
                }}>
                    +{mod.rewardXP} XP
                </span>
                {isCompleted && (
                    <motion.span
                        className="badge badge-blue"
                        style={{ fontSize: '0.55rem', padding: '0.25rem 0.55rem' }}
                        whileHover={{ scale: 1.08 }}
                    >REPLAY</motion.span>
                )}
                {isAvailable && (
                    <motion.span
                        className="badge badge-neon"
                        style={{ fontSize: '0.55rem', padding: '0.25rem 0.55rem' }}
                        animate={{ boxShadow: ['0 0 4px rgba(57,255,20,0.2)', '0 0 12px rgba(57,255,20,0.4)', '0 0 4px rgba(57,255,20,0.2)'] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >PLAY</motion.span>
                )}
                {isLocked && <span className="badge badge-dim" style={{ fontSize: '0.55rem', padding: '0.25rem 0.55rem' }}>LOCKED</span>}
            </div>
        </motion.div>
    );
}
