import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { getLevelInfo } from '../data/gameData';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Mono:wght@400;500;600;700&family=Figtree:wght@400;500;600;700;800&display=swap');

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
    padding: 2rem 1.5rem 5rem;
  }

  .no-print {
    display: block;
  }

  /* ─── Preview Shell ─── */
  .cert-container {
    max-width: 1100px;
    margin: 0 auto;
  }

  /* ─── Certificate Card with Template Background ─── */
  .cert-card {
    container-type: inline-size;
    container-name: cert;
    width: 100%;
    max-width: 1100px;
    margin: 0 auto;
    aspect-ratio: 1448 / 1086;
    position: relative;
    background-image: url('/certificate-template.png');
    background-size: 100% 100%;
    background-position: center;
    background-repeat: no-repeat;
    box-shadow: 0 40px 90px rgba(0,0,0,0.8), 0 0 40px rgba(57,255,20,0.1);
    border-radius: 6px;
    overflow: hidden;
    user-select: none;
    -webkit-user-select: none;
  }

  .cert-card ::selection,
  .cert-card *::selection {
    background: transparent !important;
    color: inherit !important;
  }

  /* ─── Overlay Elements Positioned Proportionally ─── */
  .cert-overlay-name-box {
    position: absolute;
    left: 7.2%;
    top: 46.6%;
    width: 85%;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    pointer-events: none;
    background: transparent !important;
  }

  .cert-overlay-name {
    font-family: 'DM Serif Display', Georgia, serif;
    font-size: 7cqw;
    color: #0b0f14;
    line-height: 1;
    letter-spacing: 0.015em;
    margin: 0;
    background: transparent !important;
    background-color: transparent !important;
    user-select: none;
    -webkit-user-select: none;
  }

  /* Footer column 1: Under CREDENTIAL ID / GitHub link */
  .cert-overlay-col1 {
    position: absolute;
    left: 7.2%;
    top: 84.8%;
    width: 32%;
    display: flex;
    flex-direction: column;
    gap: 0.2cqw;
    pointer-events: auto;
  }

  .cert-overlay-github {
    font-family: 'DM Mono', monospace;
    font-size: 1.22cqw;
    font-weight: 700;
    color: #0b1a0e;
    text-decoration: none;
    line-height: 1.25;
    word-break: break-all;
    display: flex;
    align-items: center;
    gap: 0.4cqw;
  }

  .cert-overlay-cred-sub {
    font-family: 'DM Mono', monospace;
    font-size: 0.95cqw;
    color: #15803d;
    font-weight: 600;
    letter-spacing: 0.04em;
  }

  /* Footer column 2: Under MASTERY RANK */
  .cert-overlay-col2 {
    position: absolute;
    left: 47%;
    top: 82.8%;
    width: 25%;
    display: flex;
    flex-direction: column;
    gap: 0.25cqw;
    pointer-events: auto;
  }

  .cert-overlay-rank-title {
    font-family: 'Figtree', sans-serif;
    font-size: 1.6cqw;
    font-weight: 800;
    color: #0e622b;
    line-height: 1.1;
    letter-spacing: 0.02em;
    text-transform: uppercase;
  }

  .cert-overlay-rank-xp {
    font-family: 'DM Mono', monospace;
    font-size: 1.15cqw;
    font-weight: 700;
    color: #1f2937;
  }

  .cert-overlay-rank-status {
    font-family: 'DM Mono', monospace;
    font-size: 0.85cqw;
    color: #15803d;
    font-weight: 600;
    letter-spacing: 0.05em;
  }

  /* Footer column 3: Under DATE OF ISSUE & VERIFIED CORE_NODE */
  .cert-overlay-col3-date {
    position: absolute;
    left: 74%;
    top: 82.6%;
    width: 21%;
    pointer-events: auto;
  }

  .cert-overlay-date-val {
    font-family: 'DM Mono', monospace;
    font-size: 1.18cqw;
    font-weight: 700;
    color: #111827;
    letter-spacing: 0.02em;
  }

  .cert-overlay-col3-node {
    position: absolute;
    left: 74%;
    top: 88.6%;
    width: 21%;
    pointer-events: auto;
  }

  .cert-overlay-node-val {
    font-family: 'DM Mono', monospace;
    font-size: 1.05cqw;
    font-weight: 700;
    color: #0e622b;
    letter-spacing: 0.05em;
  }

  /* ─── Editor Bar ─── */
  .cert-editor-card {
    background: rgba(22, 27, 34, 0.8);
    border: 1px solid rgba(57, 255, 20, 0.2);
    border-radius: 8px;
    padding: 1.25rem;
    margin-bottom: 1.75rem;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 1rem;
    backdrop-filter: blur(10px);
  }

  .cert-input-group label {
    display: block;
    font-family: 'DM Mono', monospace;
    font-size: 0.7rem;
    color: var(--neon);
    margin-bottom: 0.4rem;
    letter-spacing: 0.05em;
  }

  .cert-input-group input {
    width: 100%;
    background: rgba(0, 0, 0, 0.5);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 6px;
    padding: 0.55rem 0.8rem;
    color: #fff;
    font-family: 'Figtree', sans-serif;
    font-size: 0.88rem;
    outline: none;
    transition: border-color 0.2s;
  }

  .cert-input-group input:focus {
    border-color: var(--neon);
  }

  /* ─── Actions ─── */
  .cert-actions-wrapper {
    margin-top: 2.5rem;
    text-align: center;
  }

  .cert-btn {
    background: var(--neon);
    color: #000;
    border: none;
    padding: 1rem 3rem;
    font-family: 'DM Mono', monospace;
    font-weight: 800;
    font-size: 1rem;
    border-radius: 6px;
    cursor: pointer;
    box-shadow: 0 0 30px rgba(57,255,20,0.35);
    transition: all 0.2s;
    letter-spacing: 0.05em;
  }
  .cert-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 0 45px rgba(57,255,20,0.6);
  }

  .cert-back-link {
    display: inline-block;
    margin-top: 1.5rem;
    color: var(--text-dim);
    text-decoration: none;
    font-size: 0.82rem;
    font-family: 'DM Mono', monospace;
  }
  .cert-back-link:hover {
    color: var(--neon);
  }

  /* ─── Print Logic ─── */
  @media print {
    * {
      visibility: hidden !important;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    #certificate-print-area,
    #certificate-print-area * {
      visibility: visible !important;
    }

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
      background-image: url('/certificate-template.png') !important;
      background-size: 100% 100% !important;
      background-position: center !important;
      background-repeat: no-repeat !important;
    }

    html, body, #root, .cert-page, .cert-container {
      background: white !important;
      margin: 0 !important;
      padding: 0 !important;
      height: 100vh !important;
      overflow: hidden !important;
    }

    @page {
      size: A4 landscape;
      margin: 0;
    }
  }
`;

export default function Certification({ player, onBack }) {
    const certRef = useRef(null);
    const { current } = getLevelInfo(player.xp);

    // Editable state so user can refine their certificate credentials live
    const [name, setName] = useState(player.username || 'Bharath Kumar');
    const [gitProfile, setGitProfile] = useState(
        player.gitProfile || (player.username ? `github.com/${player.username.toLowerCase()}` : 'github.com/bharathkumar000')
    );

    const [authId] = useState(() => `NODE_0x${Math.random().toString(16).substring(2, 8).toUpperCase()}`);
    const issueDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const handleExport = () => {
        const originalTitle = document.title;
        document.title = `Gitopia_Mastery_Certificate_${name.replace(/\s+/g, '_')}`;
        window.print();
        document.title = originalTitle;
    };

    return (
        <div className="cert-page">
            <style>{styles}</style>

            <div className="cert-container">

                {/* Top Header & Back Button */}
                <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <button
                        onClick={onBack}
                        style={{
                            background: 'none', border: '1px solid rgba(255,255,255,0.15)',
                            padding: '0.4rem 0.8rem', borderRadius: '4px',
                            color: 'var(--text-dim)', cursor: 'pointer', fontFamily: 'DM Mono', fontSize: '0.8rem'
                        }}
                    >
                        ← RETURN TO MISSION MAP
                    </button>
                    <div style={{ color: 'var(--neon)', fontFamily: 'DM Mono', fontSize: '0.8rem' }}>
                        ◈ OFFICIAL CERTIFICATE OF MASTERY
                    </div>
                </div>

                {/* Live Customizer Card (Hidden on Print) */}
                <div className="cert-editor-card no-print">
                    <div className="cert-input-group">
                        <label>CERTIFIED NAME</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your full name"
                        />
                    </div>
                    <div className="cert-input-group">
                        <label>GITHUB PROFILE / URL</label>
                        <input
                            type="text"
                            value={gitProfile}
                            onChange={(e) => setGitProfile(e.target.value)}
                            placeholder="github.com/username"
                        />
                    </div>
                </div>

                {/* ─── THE CERTIFICATE CANVAS WITH 2.png TEMPLATE ─── */}
                <div id="certificate-print-area" ref={certRef} className="cert-card">

                    {/* ① Name Overlay (Placed right above the green underline) */}
                    <div className="cert-overlay-name-box">
                        <h2 className="cert-overlay-name">
                            {name.toUpperCase()}
                        </h2>
                    </div>

                    {/* ② Column 1: CREDENTIAL ID & GitHub Link */}
                    <div className="cert-overlay-col1">
                        <div className="cert-overlay-github" title={gitProfile}>
                            {gitProfile.startsWith('http') ? gitProfile.replace(/^https?:\/\//, '') : gitProfile}
                        </div>
                        <div className="cert-overlay-cred-sub">
                            ID: {authId.replace('NODE_', 'GIT_')}
                        </div>
                    </div>

                    {/* ③ Column 2: MASTERY RANK */}
                    <div className="cert-overlay-col2">
                        <div className="cert-overlay-rank-title">
                            {current.title}
                        </div>
                        <div className="cert-overlay-rank-xp">
                            Level {current.level} • {player.xp.toLocaleString()} XP
                        </div>
                        <div className="cert-overlay-rank-status">
                            ✓ PROTOCOLS VERIFIED
                        </div>
                    </div>

                    {/* ④ Column 3: DATE OF ISSUE */}
                    <div className="cert-overlay-col3-date">
                        <div className="cert-overlay-date-val">
                            {issueDate}
                        </div>
                    </div>

                </div>

                {/* Actions & Print Prompt */}
                <div className="cert-actions-wrapper no-print">
                    <button className="cert-btn" onClick={handleExport}>
                        🖨️ PRINT / DOWNLOAD CERTIFICATE (PDF)
                    </button>
                    <div style={{ marginTop: '1.25rem', opacity: 0.6, fontSize: '0.75rem', color: 'var(--text-dim)', fontFamily: 'DM Mono' }}>
                        TIP: IN PRINT PREVIEW, SELECT <strong style={{ color: '#fff' }}>LANDSCAPE</strong> AND SET MARGINS TO <strong style={{ color: '#fff' }}>NONE</strong> FOR 100% CLEAN FIT.
                    </div>
                    <div>
                        <a href="#" onClick={(e) => { e.preventDefault(); onBack(); }} className="cert-back-link">
                            ← BACK TO DASHBOARD
                        </a>
                    </div>
                </div>

            </div>
        </div>
    );
}