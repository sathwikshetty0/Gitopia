import { motion } from 'framer-motion';
import { MODULES, BADGES, getLevelInfo } from '../data/gameData';
import { XPBar, LevelBadge } from './shared/XPBar';

const AVATARS = ['👾', '🤖', '🦊', '🐉', '🧠', '⚡', '🌊', '🔥', '🌙', '🎯', '🦾', '🕵️'];

export default function Dashboard({ player, dispatch }) {
    const { current: levelInfo } = getLevelInfo(player.xp);

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '1rem', padding: '0.75rem 1.5rem', maxWidth: '1600px', margin: '0 auto' }}>
            {/* LEFT — Profile */}
            <aside className="flex-col gap-4" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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

function ProfileCard({ player, levelInfo, dispatch }) {
    return (
        <motion.div
            className="glass p-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
        >
            {/* Avatar */}
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <div
                    className="animate-pulse-border"
                    style={{
                        width: 80, height: 80, borderRadius: '50%',
                        background: 'var(--neon-dim)',
                        border: '2px solid var(--neon)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '2.5rem', margin: '0 auto 0.75rem',
                        cursor: 'pointer',
                    }}
                    onClick={() => {
                        const next = AVATARS[(AVATARS.indexOf(player.avatar) + 1) % AVATARS.length];
                        dispatch({ type: 'UPDATE_AVATAR', payload: next });
                    }}
                    title="Click to change avatar"
                >
                    {player.avatar}
                </div>
                <div className="pixel neon-text" style={{ fontSize: '0.7rem' }}>{player.username}</div>
                <div className="dim-text text-xs" style={{ marginTop: '0.25rem' }}>
                    {levelInfo.title}
                </div>
                <div style={{ marginTop: '0.5rem' }}>
                    <LevelBadge xp={player.xp} />
                </div>
            </div>

            <XPBar xp={player.xp} />

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '1.25rem' }}>
                {[
                    { label: 'Total XP', value: player.xp.toLocaleString(), color: 'var(--gold)' },
                    { label: 'Missions', value: player.completedMissions.length, color: 'var(--neon)' },
                    { label: 'Badges', value: player.badges.length, color: 'var(--blue)' },
                ].map(s => (
                    <div key={s.label} style={{
                        background: 'var(--bg-3)', borderRadius: '6px', padding: '0.6rem',
                        border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center',
                    }}>
                        <div className="dim-text text-xs mb-1">{s.label}</div>
                        <div style={{ color: s.color, fontWeight: 700, fontSize: '0.9rem' }}>{s.value}</div>
                    </div>
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
        <div className="text-center text-xs neon-text" style={{ marginTop: '1rem', opacity: 0.7 }}>
            🏆 All missions complete!
        </div>
    );
    return (
        <button
            className="btn btn-primary w-full"
            style={{ marginTop: '1.25rem', fontFamily: 'var(--font-code)', letterSpacing: '0.05em' }}
            onClick={() => dispatch({ type: 'START_MISSION', payload: nextMission.id })}
        >
            ▶ CONTINUE MISSION
        </button>
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
            whileHover={{ scale: 1.02 }}
            style={{
                marginTop: '1rem',
                background: 'linear-gradient(45deg, var(--gold), #ff8c00)',
                color: '#000',
                border: 'none',
                fontFamily: 'var(--font-pixel)',
                fontSize: '0.55rem',
                padding: '0.8rem',
                boxShadow: '0 0 20px rgba(240,192,64,0.4)'
            }}
            onClick={() => dispatch({ type: 'SET_VIEW', payload: 'certification' })}
        >
            ✨ CLAIM CERTIFICATE ✨
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
            <div className="pixel neon-text mb-3" style={{ fontSize: '0.6rem' }}>BADGES</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {BADGES.map(badge => {
                    const earned = player.badges.includes(badge.id);
                    return (
                        <motion.div
                            key={badge.id}
                            title={badge.desc}
                            whileHover={{ scale: 1.15 }}
                            style={{
                                padding: '0.4rem 0.65rem', borderRadius: '6px',
                                border: `1px solid ${earned ? 'var(--gold)' : '#333'}`,
                                background: earned ? 'rgba(240,192,64,0.1)' : 'transparent',
                                fontSize: '1.2rem', cursor: 'default',
                                opacity: earned ? 1 : 0.3,
                                filter: earned ? 'drop-shadow(0 0 6px var(--gold))' : 'none',
                                transition: 'all 0.2s',
                            }}
                        >
                            {badge.icon}
                            <div style={{ fontSize: '0.45rem', color: earned ? 'var(--gold)' : 'var(--text-dim)', marginTop: '2px', textAlign: 'center', fontFamily: 'var(--font-code)' }}>
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
    return (
        <motion.div
            className="glass p-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
        >
            <div className="pixel neon-text mb-3" style={{ fontSize: '0.6rem' }}>STATS</div>
            {[
                ['Commands run', player.totalCommandsRun],
                ['Hints used', player.hintsUsed],
                ['Missions done', `${player.completedMissions.length} / ${MODULES.length}`],
            ].map(([label, val]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.78rem' }}>
                    <span className="dim-text">{label}</span>
                    <span style={{ color: 'var(--text)' }}>{val}</span>
                </div>
            ))}
        </motion.div>
    );
}

// ────────────────────────────────────────────────────────────
//  SKILL TREE
// ────────────────────────────────────────────────────────────
function SkillTree({ player, dispatch }) {
    return (
        <div>
            <div className="pixel neon-text mb-4" style={{ fontSize: '0.8rem', textAlign: 'center' }}>
                ◈ MISSION MAP ◈
            </div>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '1.5rem',
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

    const borderColor = isCompleted ? 'var(--blue)' : isAvailable ? mod.color : '#333';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: index * 0.05 } }}
            whileHover={!isLocked ? { scale: 1.03, y: -2 } : {}}
            style={{
                background: isCompleted ? 'rgba(88,166,255,0.07)' : isAvailable ? `rgba(57,255,20,0.04)` : 'rgba(0,0,0,0.3)',
                border: `1.5px solid ${borderColor}`,
                borderRadius: '10px',
                padding: '1.25rem',
                cursor: isLocked ? 'not-allowed' : 'pointer',
                boxShadow: isAvailable ? `0 0 12px ${mod.color}25` : 'none',
                transition: 'all 0.3s ease',
                opacity: isLocked ? 0.4 : 1,
                position: 'relative',
                overflow: 'hidden',
                minHeight: '190px',
                display: 'flex',
                flexDirection: 'column'
            }}
            onClick={() => !isLocked && dispatch({ type: 'START_MISSION', payload: mod.id })}
        >
            {isCompleted && (
                <div style={{
                    position: 'absolute', top: '0.4rem', right: '0.5rem',
                    color: 'var(--blue)', fontSize: '1rem',
                }}>✓</div>
            )}
            {isLocked && (
                <div style={{
                    position: 'absolute', top: '0.4rem', right: '0.5rem',
                    fontSize: '0.9rem',
                }}>🔒</div>
            )}

            <div style={{ fontSize: '2rem', marginBottom: '0.4rem' }}>{mod.icon}</div>
            <div className="pixel" style={{ fontSize: '0.75rem', color: borderColor, marginBottom: '0.35rem' }}>
                {mod.title}
            </div>
            <div className="dim-text" style={{ fontSize: '0.78rem', marginBottom: '1rem', lineHeight: 1.5, flex: 1 }}>
                {mod.subtitle}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                <span style={{ color: 'var(--gold)', fontSize: '0.85rem', fontWeight: 800 }}>
                    +{mod.rewardXP} XP
                </span>
                {isCompleted && <span className="badge badge-blue" style={{ fontSize: '0.6rem', padding: '0.3rem 0.6rem' }}>REPLAY</span>}
                {isAvailable && <span className="badge badge-neon" style={{ fontSize: '0.6rem', padding: '0.3rem 0.6rem' }}>PLAY</span>}
                {isLocked && <span className="badge badge-dim" style={{ fontSize: '0.6rem', padding: '0.3rem 0.6rem' }}>LOCKED</span>}
            </div>
        </motion.div>
    );
}
