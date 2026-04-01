import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getLevelInfo } from '../data/gameData';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Mono:wght@400;500&family=Figtree:wght@400;500;600;700;800&display=swap');

  :root {
    --neon: #39ff14;
    --ink: #0a0b0d;
    --surface: #111318;
    --border: rgba(255,255,255,0.07);
    --text: #f0f0ee;
    --text-dim: rgba(240,240,238,0.45);
    --text-muted: rgba(240,240,238,0.22);
  }

  .cert-page {
    font-family: 'Figtree', sans-serif;
    min-height: 100vh;
    background: var(--ink);
    color: var(--text);
    padding: 2.5rem 2rem 5rem;
  }

  .no-print {
    display: block;
  }

  /* ─── Preview Shell ─── */
  .cert-container {
    max-width: 1100px;
    margin: 0 auto;
  }

  /* ─── Certificate Card ─── */
  .cert-card {
    background: #ffffff;
    color: #111111;
    width: 100%;
    aspect-ratio: 1.414 / 1;
    position: relative;
    overflow: hidden;
    box-shadow: 0 40px 80px rgba(0,0,0,0.7);
    border-radius: 4px;
    box-sizing: border-box;
  }

  .cert-dotgrid {
    position: absolute;
    inset: 0;
    background-image: radial-gradient(circle, #cccccc 0.5px, transparent 0.5px);
    background-size: 22px 22px;
    opacity: 0.15;
    pointer-events: none;
  }

  .cert-inner {
    height: 100%;
    padding: 4rem 5rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
    z-index: 2;
    box-sizing: border-box;
  }

  .cert-border-outer {
    position: absolute;
    inset: 2rem;
    border: 2px solid #111;
    pointer-events: none;
  }

  .cert-border-inner {
    position: absolute;
    inset: 2.4rem;
    border: 1px solid var(--neon);
    pointer-events: none;
  }

  .cert-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  .cert-logo {
    height: 80px;
    margin-bottom: 2rem;
    display: block;
    object-fit: contain;
    mix-blend-mode: multiply;
  }

  .cert-org-h {
    font-family: 'DM Mono', monospace;
    font-size: 0.7rem;
    letter-spacing: 0.2em;
    color: #888;
    text-transform: uppercase;
    margin-bottom: 0.5rem;
  }

  .cert-title-h {
    font-family: 'DM Serif Display', serif;
    font-size: 3.5rem;
    color: #111;
    line-height: 1;
    margin: 0;
  }

  .cert-body-h {
    margin: 2rem 0;
  }

  .cert-label-h {
    font-size: 0.9rem;
    color: #999;
    margin-bottom: 1rem;
  }

  .cert-name-h {
    font-family: 'DM Serif Display', serif;
    font-size: 4.5rem;
    color: #111;
    line-height: 1;
    margin: 0 0 1.5rem;
    border-bottom: 3px solid var(--neon);
    display: inline-block;
    padding-bottom: 0.5rem;
  }

  .cert-desc-h {
    font-size: 1.1rem;
    color: #444;
    line-height: 1.6;
    max-width: 800px;
  }

  .cert-footer-h {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    border-top: 1px solid #eee;
    padding-top: 2rem;
  }

  .cert-field-h {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }

  .cert-field-label {
    font-family: 'DM Mono', monospace;
    font-size: 0.6rem;
    color: #bbb;
    letter-spacing: 0.1em;
  }

  .cert-field-value {
    font-weight: 700;
    color: #111;
    font-size: 1rem;
  }

  .cert-auth-h {
    position: absolute;
    bottom: 1.5rem;
    right: 5rem;
    font-family: 'DM Mono', monospace;
    font-size: 0.55rem;
    color: #ccc;
  }

  /* ─── Actions ─── */
  .cert-actions-wrapper {
    margin-top: 3rem;
    text-align: center;
  }

  .cert-btn {
    background: var(--neon);
    color: #000;
    border: none;
    padding: 1rem 3rem;
    font-family: 'DM Mono', monospace;
    font-weight: 700;
    font-size: 1rem;
    border-radius: 4px;
    cursor: pointer;
    box-shadow: 0 0 30px rgba(57,255,20,0.3);
    transition: all 0.2s;
  }
  .cert-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 0 45px rgba(57,255,20,0.5);
  }

  .cert-back-link {
    display: block;
    margin-top: 1.5rem;
    color: var(--text-dim);
    text-decoration: none;
    font-size: 0.8rem;
    font-family: 'DM Mono', monospace;
  }
  .cert-back-link:hover {
    color: var(--text);
  }

  /* ─── Print Logic ─── */
  @media print {
    /* Critical: Hide EVERYTHING in the document */
    * {
      visibility: hidden !important;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    /* Show ONLY the certificate card and its descendants */
    #certificate-print-area,
    #certificate-print-area * {
      visibility: visible !important;
    }

    /* Absolute positioning to prevent parent layout shifts/white space */
    #certificate-print-area {
      position: fixed !important;
      left: 0 !important;
      top: 0 !important;
      width: 297mm !important;
      height: 210mm !important;
      margin: 0 !important;
      padding: 0 !important;
      border: none !important;
      box-shadow: none !important;
      border-radius: 0 !important;
      z-index: 99999 !important;
    }

    /* Clean up the page background */
    html, body, #root, .cert-page, .cert-container {
      background: white !important;
      margin: 0 !important;
      padding: 0 !important;
      height: 100vh !important;
      overflow: hidden !important;
    }

    /* Ensure browser headers/footers are avoided */
    @page {
      size: A4 landscape;
      margin: 0;
    }
  }

  /* ─── Verification Overlay ─── */
  .verify-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.9);
    backdrop-filter: blur(12px);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
  }

  .verify-card {
    background: #111;
    border: 1px solid var(--neon);
    padding: 3rem;
    border-radius: 12px;
    width: 600px;
    max-width: 100%;
    box-shadow: 0 0 50px rgba(57,255,20,0.15);
  }

  .verify-title {
    font-size: 1.8rem;
    font-weight: 800;
    margin-bottom: 0.5rem;
    color: var(--neon);
    letter-spacing: 1px;
  }

  .verify-subtitle {
    color: var(--text-dim);
    font-size: 0.9rem;
    margin-bottom: 2rem;
    line-height:1.5;
  }

  .verify-group {
    margin-bottom: 1.5rem;
  }

  .verify-label {
    display: block;
    font-size: 0.75rem;
    color: var(--text-dim);
    margin-bottom: 0.5rem;
    font-family: 'DM Mono', monospace;
    text-transform: uppercase;
  }

  .verify-input {
    width: 100%;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    padding: 1rem;
    color: white;
    font-size: 1.1rem;
    border-radius: 6px;
    transition: all 0.2s;
  }

  .verify-input:focus {
    outline: none;
    border-color: var(--neon);
    background: rgba(255,255,255,0.08);
  }
`;

export default function Certification({ player, dispatch, onBack }) {
  const certRef = useRef(null);
  const { current } = getLevelInfo(player.xp);
  
  const [showVerify, setShowVerify] = useState(!player.hasClaimedCertificate);
  const [form, setForm] = useState({
    username: player.username || '',
    email: player.email || '',
    gitProfile: player.gitProfile || ''
  });

  const handleExport = () => {
    const originalTitle = document.title;
    document.title = `Gitopia_Certification_${player.username}`;
    window.print();
    document.title = originalTitle;
  };

  const authId = `HEX_${Math.random().toString(36).substr(2, 8).toUpperCase()}`;

  const handleVerify = () => {
    if (!form.username || !form.email) {
      alert("Name and Email are required for certification.");
      return;
    }
    dispatch({ 
      type: 'UPDATE_PLAYER_INFO', 
      payload: { ...form, hasClaimedCertificate: true } 
    });
    setShowVerify(false);
  };

  // ─── Google Sheets Integration ───
  useEffect(() => {
    if (showVerify) return; // Wait until verified to sync

    const syncData = async () => {
      const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbzcDskqqM8kqAtkrNIBDk1X2cLfXjl5z0O8BDJbdPYPuXT5RaLmojn8o-P67ZjOmptydQ/exec';

      try {
        await fetch(GOOGLE_SHEETS_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: player.username,
            email: player.email || 'N/A',
            score: player.xp,
            rank: current.title,
            github: player.gitProfile || 'N/A',
            date: new Date().toISOString()
          })
        });
      } catch (err) {
        console.error("Sheet sync failed:", err);
      }
    };

    syncData();
  }, [showVerify, player.username, player.email]);

  return (
    <div className="cert-page">
      <style>{styles}</style>

      {showVerify && (
        <div className="verify-overlay no-print">
          <motion.div 
            className="verify-card"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <h2 className="verify-title">Verify Credentials</h2>
            <p className="verify-subtitle">
              Please finalize your professional details. This information will be permanently 
              encoded into your Certificate of Mastery and recorded in our authority database.
            </p>

            <div className="verify-group">
              <label className="verify-label">Full Name (for certificate)</label>
              <input 
                className="verify-input"
                value={form.username}
                onChange={e => setForm({...form, username: e.target.value})}
                placeholder="Enter your legal/display name"
              />
            </div>

            <div className="verify-group">
              <label className="verify-label">Professional Email</label>
              <input 
                className="verify-input"
                type="email"
                value={form.email}
                onChange={e => setForm({...form, email: e.target.value})}
                placeholder="name@company.com"
              />
            </div>

            <div className="verify-group">
              <label className="verify-label">GitHub Handle (Optional)</label>
              <input 
                className="verify-input"
                value={form.gitProfile}
                onChange={e => setForm({...form, gitProfile: e.target.value})}
                placeholder="@username"
              />
            </div>

            <button 
              className="cert-btn" 
              style={{ width: '100%', marginTop: '1rem' }}
              onClick={handleVerify}
            >
              FINALIZE & GENERATE
            </button>
            
            <button 
                onClick={onBack}
                style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', fontFamily: 'DM Mono', fontSize: '0.8rem', width: '100%', marginTop: '1.5rem' }}
            >
                CANCEL_ACCREDITATION
            </button>
          </motion.div>
        </div>
      )}

      <div className="cert-container">

        {/* Navigation - Hidden in print */}
        <div className="no-print" style={{ marginBottom: '2rem' }}>
          <button
            onClick={onBack}
            style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', fontFamily: 'DM Mono', fontSize: '0.8rem' }}
          >
            ← SYSTEM_EXIT
          </button>
        </div>

        {/* THE CERTIFICATE */}
        <div id="certificate-print-area" ref={certRef} className="cert-card">
          <div className="cert-dotgrid" />
          <div className="cert-border-outer" />
          <div className="cert-border-inner" />

          <div className="cert-inner">
            <header className="cert-header">
              <div>
                <img src="/inunity-logo.png" alt="Inunity Logo" className="cert-logo" />
                <div className="cert-org-h">GITOPIA_ACCREDITATION_AUTHORITY</div>
                <h1 className="cert-title-h">Certificate of Mastery</h1>
                <div style={{ color: '#888', fontStyle: 'italic', marginTop: '0.5rem' }}>Distributed Version Control Systems</div>
              </div>
            </header>

            <main className="cert-body-h">
              <div className="cert-label-h">This document certifies that</div>
              <h2 className="cert-name-h">{player.username.toUpperCase()}</h2>
              <p className="cert-desc-h">
                Has successfully navigated the complex protocols of <strong style={{ color: '#111' }}>GITOPIA</strong>,
                demonstrating expertise in branch manipulation, atomic commit architecture, resolution of
                dynamic merge conflicts, and professional collaborative integration.
              </p>
            </main>

            <footer className="cert-footer-h">
              <div className="cert-field-h">
                <span className="cert-field-label">CREDENTIAL_ID</span>
                <span className="cert-field-value">{player.gitProfile || 'GUEST_PROTO_USER'}</span>
                <span style={{ fontSize: '0.7rem', color: '#999' }}>{player.email}</span>
              </div>
              <div className="cert-field-h" style={{ alignItems: 'center', textAlign: 'center' }}>
                <span className="cert-field-label">MASTERY_RANK</span>
                <span className="cert-field-value" style={{ color: 'var(--neon)' }}>{current.title}</span>
                <span style={{ fontSize: '0.7rem', color: '#999' }}>XP: {player.xp.toLocaleString()}</span>
              </div>
              <div className="cert-field-h" style={{ alignItems: 'flex-end', textAlign: 'right' }}>
                <span className="cert-field-label">DATE_OF_ISSUE</span>
                <span className="cert-field-value">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).toUpperCase()}</span>
                <span style={{ fontSize: '0.7rem', color: '#999' }}>VERIFIED_CORE_NODE</span>
              </div>
            </footer>

            <div className="cert-auth-h">
              {authId}
            </div>
          </div>
        </div>

        {/* Actions - Hidden in print */}
        <div className="cert-actions-wrapper no-print">
          <p style={{ color: 'var(--text-dim)', fontStyle: 'italic', marginBottom: '2rem' }}>
            "The repository of knowledge is the only one that truly matters."
          </p>
          <button className="cert-btn" onClick={handleExport}>
            💾 DOWNLOAD PDF CERTIFICATE
          </button>
          <div style={{ marginTop: '1.5rem', opacity: 0.4, fontSize: '0.7rem', color: 'var(--text-dim)', fontFamily: 'DM Mono' }}>
            FOR BEST OUTPUT: SELECT <span style={{ color: '#fff' }}>LANDSCAPE</span> & <span style={{ color: '#fff' }}>MARGINS: NONE</span>
          </div>
          <a href="#" onClick={(e) => { e.preventDefault(); onBack(); }} className="cert-back-link">
            LOGOUT_SESSION
          </a>
        </div>

      </div>
    </div>
  );
}