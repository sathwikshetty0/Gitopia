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
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.25 } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
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
      userSelect: 'none',
      WebkitUserSelect: 'none'
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
              <Certification player={player} onBack={() => dispatch({ type: 'SET_VIEW', payload: 'dashboard' })} />
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
  const pct = missionPhase === 'briefing' ? 20 : missionPhase === 'challenge' ? 60 : 100;
  const label = missionPhase === 'briefing' ? 'Phase 1/3: BRIEFING'
    : missionPhase === 'challenge' ? 'Phase 2/3: CHALLENGE'
      : 'Phase 3/3: REWARD';

  return (
    <div style={{
      padding: '0.45rem 1.5rem',
      background: 'rgba(13,17,23,0.98)',
      borderBottom: '1px solid rgba(255,77,77,0.25)',
      display: 'flex', alignItems: 'center', gap: '1rem',
      position: 'sticky', top: 0, zIndex: 100,
    }}>
      <button
        onClick={() => dispatch({ type: 'RETURN_TO_DASHBOARD' })}
        style={{
          background: 'none', border: '1px solid #444', borderRadius: '4px',
          color: 'var(--text-dim)', fontFamily: 'var(--font-code)',
          fontSize: '0.7rem', padding: '0.2rem 0.6rem', cursor: 'pointer',
          whiteSpace: 'nowrap',
        }}
      >
        ← EXIT
      </button>
      <span className="dim-text" style={{ fontSize: '0.7rem', whiteSpace: 'nowrap' }}>MISSION IN PROGRESS</span>
      <div style={{ flex: 1, height: '4px', background: 'rgba(255,77,77,0.12)', borderRadius: '2px' }}>
        <div style={{
          width: `${pct}%`, height: '100%',
          background: pct === 100 ? 'var(--neon)' : 'var(--red)',
          borderRadius: '2px', transition: 'width 0.6s ease',
          boxShadow: pct === 100 ? 'var(--glow-neon)' : '0 0 6px var(--red)',
        }} />
      </div>
      <span className="dim-text" style={{ fontSize: '0.7rem', whiteSpace: 'nowrap' }}>{label}</span>
    </div>
  );
}

/**
 * Advanced Security Shield
 * Deterrant against screenshots and screen recording
 */
function SecurityShield() {
  const [isSecure, setIsSecure] = useState(true);

  useEffect(() => {
    // 1. Prevent Right Click
    const handleContextMenu = (e) => e.preventDefault();
    
    // 2. Prevent Common Screenshot & Inspect Shortcuts
    const handleKeyDown = (e) => {
      // PrintScreen
      if (e.key === 'PrintScreen') {
        alert('Screenshots are disabled for security reasons.');
        e.preventDefault();
      }

      // Cmd+Shift+3/4 (Mac) or Win+Shift+S (Windows) triggers are OS level, 
      // but we can catch certain combinations
      if ((e.metaKey || e.ctrlKey) && (e.key === 's' || e.key === 'p' || e.key === 'S' || e.key === 'P')) {
        e.preventDefault();
      }

      // Disable F12 and Inspect
      if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C'))) {
        e.preventDefault();
      }
      if (e.metaKey && e.altKey && (e.key === 'i' || e.key === 'I')) {
        e.preventDefault();
      }
    };

    // 3. Focus Monitoring (Deter Screen Recording)
    const handleFocus = () => setIsSecure(true);
    const handleBlur = () => setIsSecure(false);

    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  return (
    <>
      {/* Visual Shield: Blurs content when focus is lost */}
      <AnimatePresence>
        {!isSecure && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              background: 'rgba(0,0,0,0.95)',
              backdropFilter: 'blur(20px)',
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
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
            <div style={{ fontSize: '1.2rem', letterSpacing: '2px' }}>SECURITY_SHIELD_ACTIVE</div>
            <div className="dim-text" style={{ fontSize: '0.8rem', marginTop: '1rem', fontFamily: 'var(--font-code)' }}>
              WINDOW FOCUS LOST // CONTENT PROTECTED
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Persistent subtle watermark across the screen */}
      <div style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 9998,
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gridTemplateRows: 'repeat(4, 1fr)',
        opacity: 0.03,
        fontSize: '0.7rem',
        color: 'white',
        fontFamily: 'var(--font-code)',
        transform: 'rotate(-20deg) scale(1.5)'
      }}>
        {Array.from({ length: 16 }).map((_, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            PRIVATE_GITOPIA_V2.0_ENCRYPTED
          </div>
        ))}
      </div>
    </>
  );
}

function BackgroundDecor() {
  return (
    <div style={{
      position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden',
    }}>
      {/* Subtle grid */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `
          linear-gradient(rgba(57,255,20,0.025) 1px, transparent 1px),
          linear-gradient(90deg, rgba(57,255,20,0.025) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
      }} />
      {/* Radial glows */}
      <div style={{
        position: 'absolute', bottom: '-100px', right: '-100px',
        width: '500px', height: '500px',
        background: 'radial-gradient(circle, rgba(57,255,20,0.05) 0%, transparent 65%)',
        borderRadius: '50%',
      }} />
      <div style={{
        position: 'absolute', top: '-100px', left: '-100px',
        width: '400px', height: '400px',
        background: 'radial-gradient(circle, rgba(88,166,255,0.05) 0%, transparent 65%)',
        borderRadius: '50%',
      }} />
    </div>
  );
}
