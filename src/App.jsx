import { useReducer, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { gameReducer, initialState } from './state/gameState';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import MissionScreen from './components/MissionScreen';
import Profile from './components/Profile';
import Reference from './components/Reference';
import Certification from './components/Certification';
import Footer from './components/Footer';

const STORAGE_KEY = 'gitopia_v1_state';

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const saved = JSON.parse(raw);
      // merge saved player into fresh initial state
      return { ...initialState, player: { ...initialState.player, ...saved.player } };
    }
  } catch (_) { }
  return initialState;
}

const PAGE_TRANSITION = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.15 } },
};

export default function App() {
  const [state, dispatch] = useReducer(gameReducer, undefined, loadState);

  // Persist player to localStorage on every player change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ player: state.player }));
    } catch (_) { }
  }, [state.player]);

  const {
    view, activeMissionId, missionPhase,
    activeChallengeIndex, currentMissionXP, earnedBadge, player,
  } = state;

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
    }}>
      <SecurityShield />
      {/* Background decoration — always behind */}
      <BackgroundDecor />

      {/* NAVBAR — hidden only during active mission */}
      {view !== 'mission' && (
        <Navbar view={view} player={player} dispatch={dispatch} />
      )}

      {/* Mission progress strip */}
      {view === 'mission' && (
        <MissionProgressStrip missionPhase={missionPhase} dispatch={dispatch} />
      )}

      {/* Main content area */}
      <main style={{ flex: 1, position: 'relative', zIndex: 1 }}>
        <AnimatePresence mode="wait">
          {view === 'dashboard' && (
            <motion.div key="dashboard" {...PAGE_TRANSITION}>
              <Dashboard player={player} dispatch={dispatch} />
            </motion.div>
          )}

          {view === 'mission' && activeMissionId && (
            <motion.div key="mission" {...PAGE_TRANSITION}>
              <MissionScreen
                activeMissionId={activeMissionId}
                missionPhase={missionPhase}
                activeChallengeIndex={activeChallengeIndex}
                currentMissionXP={currentMissionXP}
                lastXPGain={state.lastXPGain}
                earnedBadge={earnedBadge}
                dispatch={dispatch}
              />
            </motion.div>
          )}


          {view === 'profile' && (
            <motion.div key="profile" {...PAGE_TRANSITION}>
              <Profile player={player} dispatch={dispatch} />
            </motion.div>
          )}


          {view === 'reference' && (
            <motion.div key="reference" {...PAGE_TRANSITION}>
              <Reference />
            </motion.div>
          )}

          {view === 'certification' && (
            <motion.div key="certification" {...PAGE_TRANSITION}>
              <Certification player={player} dispatch={dispatch} onBack={() => dispatch({ type: 'SET_VIEW', payload: 'dashboard' })} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* FOOTER — only visible in main views */}
      {view !== 'mission' && <Footer />}
    </div>
  );
}

function MissionProgressStrip({ missionPhase, dispatch }) {
  const phases = [
    { id: 'briefing', label: 'BRIEFING', icon: '📋' },
    { id: 'challenge', label: 'CHALLENGE', icon: '⚔️' },
    { id: 'reward', label: 'REWARD', icon: '🏆' },
  ];
  const currentIdx = phases.findIndex(p => p.id === missionPhase);
  const pct = missionPhase === 'briefing' ? 20 : missionPhase === 'challenge' ? 60 : 100;

  return (
    <div style={{
      padding: '0.5rem 1.5rem',
      background: 'rgba(10,14,20,0.95)',
      borderBottom: '1px solid rgba(255,77,77,0.15)',
      display: 'flex', alignItems: 'center', gap: '1rem',
      position: 'sticky', top: 0, zIndex: 100,
      backdropFilter: 'blur(16px)',
    }}>
      <motion.button
        onClick={() => dispatch({ type: 'RETURN_TO_DASHBOARD' })}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px',
          color: 'var(--text-dim)', fontFamily: 'var(--font-code)',
          fontSize: '0.7rem', padding: '0.25rem 0.7rem', cursor: 'pointer',
          whiteSpace: 'nowrap', transition: 'all 0.2s',
        }}
      >
        ← EXIT
      </motion.button>

      {/* Phase indicators */}
      <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
        {phases.map((phase, i) => (
          <div key={phase.id} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.25rem',
              padding: '0.2rem 0.5rem', borderRadius: '4px',
              background: i === currentIdx ? 'rgba(57,255,20,0.1)' : 'transparent',
              border: i === currentIdx ? '1px solid rgba(57,255,20,0.2)' : '1px solid transparent',
              transition: 'all 0.3s',
            }}>
              <span style={{ fontSize: '0.65rem' }}>{phase.icon}</span>
              <span className="hide-mobile" style={{
                fontSize: '0.6rem', fontFamily: 'var(--font-code)',
                color: i < currentIdx ? 'var(--neon)' : i === currentIdx ? '#fff' : 'var(--text-dim)',
                fontWeight: i === currentIdx ? 700 : 400,
                letterSpacing: '0.04em',
              }}>
                {phase.label}
              </span>
            </div>
            {i < phases.length - 1 && (
              <div style={{
                width: '16px', height: '1px',
                background: i < currentIdx ? 'var(--neon)' : 'rgba(255,255,255,0.1)',
                transition: 'background 0.3s',
              }} />
            )}
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div style={{ flex: 1, height: '3px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
        <motion.div
          style={{
            height: '100%',
            background: pct === 100
              ? 'linear-gradient(90deg, var(--neon), var(--blue))'
              : 'linear-gradient(90deg, var(--red), #ff8844)',
            borderRadius: '2px',
            boxShadow: pct === 100 ? 'var(--glow-neon)' : '0 0 8px var(--red)',
          }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        />
      </div>

      <span className="dim-text" style={{ fontSize: '0.6rem', whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>
        {currentIdx + 1}/3
      </span>
    </div>
  );
}

function SecurityShield() {
  const [isVisible, setIsVisible] = useState(() => document.visibilityState === 'visible');

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(document.visibilityState === 'visible');
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  return !isVisible ? (
    <motion.div
      className="security-pause-overlay"
      role="status"
      aria-live="polite"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--neon)',
        fontFamily: 'var(--font-pixel)',
        textAlign: 'center',
        padding: '2rem'
      }}
    >
      <motion.div
        style={{ fontSize: '3rem', marginBottom: '1rem' }}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >⏸️</motion.div>
      <div style={{ fontSize: '1.2rem', letterSpacing: '2px' }}>SESSION_PAUSED</div>
      <div className="dim-text" style={{ fontSize: '0.8rem', marginTop: '1rem', fontFamily: 'var(--font-code)' }}>
        RETURN TO THIS TAB TO CONTINUE
      </div>
    </motion.div>
  ) : null;
}

function BackgroundDecor() {
  return (
    <div style={{
      position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden',
    }}>
      {/* Animated grid with subtle pulse */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `
          linear-gradient(rgba(57,255,20,0.02) 1px, transparent 1px),
          linear-gradient(90deg, rgba(57,255,20,0.02) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px',
        animation: 'ambient-drift 60s ease-in-out infinite alternate',
      }} />

      {/* Floating orbs */}
      <motion.div
        animate={{
          y: [0, -30, 0],
          x: [0, 15, 0],
          opacity: [0.03, 0.06, 0.03],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute', bottom: '-80px', right: '-80px',
          width: '500px', height: '500px',
          background: 'radial-gradient(circle, rgba(57,255,20,0.06) 0%, transparent 65%)',
          borderRadius: '50%',
        }}
      />
      <motion.div
        animate={{
          y: [0, 20, 0],
          x: [0, -10, 0],
          opacity: [0.03, 0.05, 0.03],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute', top: '-80px', left: '-80px',
          width: '400px', height: '400px',
          background: 'radial-gradient(circle, rgba(88,166,255,0.05) 0%, transparent 65%)',
          borderRadius: '50%',
        }}
      />
      <motion.div
        animate={{
          y: [0, -15, 0],
          opacity: [0.02, 0.04, 0.02],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute', top: '40%', right: '20%',
          width: '300px', height: '300px',
          background: 'radial-gradient(circle, rgba(189,147,249,0.04) 0%, transparent 65%)',
          borderRadius: '50%',
        }}
      />

      {/* Moving scanline */}
      <motion.div
        animate={{ y: ['-100%', '200vh'] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear', repeatDelay: 5 }}
        style={{
          position: 'absolute',
          left: 0, right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(57,255,20,0.06), transparent)',
          boxShadow: '0 0 20px rgba(57,255,20,0.04)',
        }}
      />
    </div>
  );
}
