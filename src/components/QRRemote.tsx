import { useState } from 'react';

// URL del control remoto
const REMOTE_URL = 'https://techphantomarg.netlify.app/remote';

// ── QR Code generator (vanilla, sin librerías externas) ───────────────────
// Usamos la API de QR server que genera SVG/PNG estático
const QR_API = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&format=png&color=00c8ff&bgcolor=060608&qzone=1&data=${encodeURIComponent(REMOTE_URL)}`;

interface QRRemoteProps {
  /** Mostrar como overlay modal (false = inline) */
  modal?: boolean;
  onClose?: () => void;
}

export function QRRemote({ modal = false, onClose }: QRRemoteProps) {
  const [copied, setCopied] = useState(false);
  const [qrLoaded, setQrLoaded] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(REMOTE_URL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const content = (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Bebas+Neue&display=swap');

        .qrr-wrap {
          background: #0b0b14;
          border: 1px solid rgba(0,200,255,0.2);
          border-radius: 14px;
          padding: 22px 20px 18px;
          display: flex; flex-direction: column;
          align-items: center; gap: 14px;
          position: relative;
          max-width: 260px;
          font-family: 'Rajdhani', sans-serif;
          box-shadow: 0 20px 60px rgba(0,0,0,0.7), 0 0 30px rgba(0,200,255,0.06);
        }
        .qrr-wrap::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 1px;
          border-radius: 14px 14px 0 0;
          background: linear-gradient(90deg, transparent, rgba(0,200,255,0.6), transparent);
        }

        /* Close button (modal mode) */
        .qrr-close {
          position: absolute; top: 10px; right: 10px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 50%; width: 26px; height: 26px;
          display: flex; align-items: center; justify-content: center;
          color: #4a6a7a; cursor: pointer; font-size: 0.75rem;
          transition: all 0.2s;
        }
        .qrr-close:hover { background: rgba(0,200,255,0.1); color: #00c8ff; border-color: rgba(0,200,255,0.3); }

        /* Title */
        .qrr-title {
          font-family: 'Bebas Neue', cursive;
          font-size: 1.05rem; letter-spacing: 0.12em;
          color: #e8f4ff; text-align: center; line-height: 1.2;
        }
        .qrr-title span { color: #00c8ff; }

        .qrr-subtitle {
          font-size: 0.7rem; color: #4a6a7a;
          letter-spacing: 0.06em; text-transform: uppercase;
          font-weight: 600; text-align: center;
          margin-top: -10px;
        }

        /* QR frame */
        .qrr-qr-frame {
          position: relative;
          padding: 10px;
          background: #060608;
          border: 1px solid rgba(0,200,255,0.15);
          border-radius: 10px;
          box-shadow: 0 0 20px rgba(0,200,255,0.07), inset 0 0 16px rgba(0,0,0,0.5);
        }

        /* Corner accents */
        .qrr-corner {
          position: absolute;
          width: 14px; height: 14px;
        }
        .qrr-corner-tl { top: 5px; left: 5px; border-top: 2px solid #00c8ff; border-left: 2px solid #00c8ff; border-radius: 2px 0 0 0; }
        .qrr-corner-tr { top: 5px; right: 5px; border-top: 2px solid #00c8ff; border-right: 2px solid #00c8ff; border-radius: 0 2px 0 0; }
        .qrr-corner-bl { bottom: 5px; left: 5px; border-bottom: 2px solid #00c8ff; border-left: 2px solid #00c8ff; border-radius: 0 0 0 2px; }
        .qrr-corner-br { bottom: 5px; right: 5px; border-bottom: 2px solid #00c8ff; border-right: 2px solid #00c8ff; border-radius: 0 0 2px 0; }

        .qrr-img {
          display: block; width: 150px; height: 150px;
          border-radius: 4px;
          opacity: 0; transition: opacity 0.4s;
        }
        .qrr-img.loaded { opacity: 1; }

        .qrr-shimmer {
          position: absolute; inset: 10px;
          background: linear-gradient(90deg, #0b0b14 25%, #131320 50%, #0b0b14 75%);
          background-size: 200% 100%;
          animation: qrr-sh 1.4s infinite;
          border-radius: 4px;
        }
        .qrr-shimmer.done { display: none; }
        @keyframes qrr-sh { to { background-position: -200% 0; } }

        /* Scan hint */
        .qrr-hint {
          display: flex; align-items: center; gap: 7px;
          font-size: 0.72rem; color: #4a6a7a; font-weight: 600;
          letter-spacing: 0.04em;
        }
        .qrr-hint-icon {
          font-size: 1rem;
          animation: qrr-bounce 2s ease-in-out infinite;
        }
        @keyframes qrr-bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-3px)} }

        /* Divider */
        .qrr-divider {
          width: 100%; height: 1px;
          background: rgba(0,200,255,0.07);
        }

        /* URL row */
        .qrr-url-row {
          display: flex; align-items: center; gap: 8px;
          width: 100%;
        }
        .qrr-url {
          flex: 1; font-size: 0.65rem; color: rgba(0,200,255,0.5);
          font-weight: 600; letter-spacing: 0.04em;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
          font-family: 'Rajdhani', sans-serif;
        }
        .qrr-copy-btn {
          flex-shrink: 0;
          background: rgba(0,200,255,0.06);
          border: 1px solid rgba(0,200,255,0.2);
          border-radius: 5px; color: rgba(0,200,255,0.6);
          font-family: 'Rajdhani', sans-serif;
          font-size: 0.68rem; font-weight: 700;
          letter-spacing: 0.07em; text-transform: uppercase;
          padding: 5px 10px; cursor: pointer;
          transition: all 0.2s; white-space: nowrap;
        }
        .qrr-copy-btn:hover {
          background: rgba(0,200,255,0.12);
          border-color: rgba(0,200,255,0.4);
          color: #00c8ff;
        }
        .qrr-copy-btn.copied {
          background: rgba(0,200,100,0.1);
          border-color: rgba(0,200,100,0.4);
          color: #00e87a;
        }

        /* Channel count badge */
        .qrr-stats {
          display: flex; gap: 10px; justify-content: center;
        }
        .qrr-stat {
          text-align: center;
        }
        .qrr-stat-num {
          font-family: 'Bebas Neue', cursive;
          font-size: 1.3rem; letter-spacing: 0.06em;
          color: #00c8ff; line-height: 1;
          text-shadow: 0 0 12px rgba(0,200,255,0.4);
        }
        .qrr-stat-label {
          font-size: 0.58rem; color: #3a5a6a;
          font-weight: 700; letter-spacing: 0.1em;
          text-transform: uppercase; font-family: 'Rajdhani', sans-serif;
        }
        .qrr-stat-sep {
          width: 1px; background: rgba(0,200,255,0.1);
          align-self: stretch;
        }

        /* ── Trigger button (for use outside modal) ── */
        .qrr-trigger {
          display: flex; align-items: center; gap: 8px;
          background: rgba(0,200,255,0.06);
          border: 1px solid rgba(0,200,255,0.18);
          border-radius: 8px; color: rgba(0,200,255,0.8);
          font-family: 'Rajdhani', sans-serif;
          font-size: 0.85rem; font-weight: 700;
          letter-spacing: 0.06em; padding: 9px 15px;
          cursor: pointer; transition: all 0.2s;
        }
        .qrr-trigger:hover {
          background: rgba(0,200,255,0.12);
          border-color: rgba(0,200,255,0.45);
          color: #00c8ff;
          box-shadow: 0 0 16px rgba(0,200,255,0.1);
        }
        .qrr-trigger-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: #00c8ff; box-shadow: 0 0 6px #00c8ff;
          animation: qrr-dot 1.8s ease-in-out infinite;
        }
        @keyframes qrr-dot { 0%,100%{opacity:1} 50%{opacity:0.3} }

        /* Modal overlay */
        .qrr-overlay {
          position: fixed; inset: 0; z-index: 999;
          background: rgba(0,0,0,0.85);
          backdrop-filter: blur(10px);
          display: flex; align-items: center; justify-content: center;
          padding: 20px;
          animation: qrr-fi 0.18s ease;
        }
        @keyframes qrr-fi { from{opacity:0} to{opacity:1} }
      `}</style>

      <div className="qrr-wrap">
        {modal && onClose && (
          <button className="qrr-close" onClick={onClose}>✕</button>
        )}

        <div>
          <div className="qrr-title"><span>Control</span> Remoto</div>
          <div className="qrr-subtitle">Escaneá con tu celular</div>
        </div>

        {/* QR */}
        <div className="qrr-qr-frame">
          <div className={`qrr-corner qrr-corner-tl`} />
          <div className={`qrr-corner qrr-corner-tr`} />
          <div className={`qrr-corner qrr-corner-bl`} />
          <div className={`qrr-corner qrr-corner-br`} />
          <div className={`qrr-shimmer ${qrLoaded ? 'done' : ''}`} />
          <img
            src={QR_API}
            alt="QR Control Remoto"
            className={`qrr-img ${qrLoaded ? 'loaded' : ''}`}
            onLoad={() => setQrLoaded(true)}
          />
        </div>

        <div className="qrr-hint">
          <span className="qrr-hint-icon">📱</span>
          Apuntá la cámara al código QR
        </div>

        {/* Stats */}
        <div className="qrr-stats">
          <div className="qrr-stat">
            <div className="qrr-stat-num">60+</div>
            <div className="qrr-stat-label">Canales</div>
          </div>
          <div className="qrr-stat-sep" />
          <div className="qrr-stat">
            <div className="qrr-stat-num">8</div>
            <div className="qrr-stat-label">Categorías</div>
          </div>
          <div className="qrr-stat-sep" />
          <div className="qrr-stat">
            <div className="qrr-stat-num">HD</div>
            <div className="qrr-stat-label">Calidad</div>
          </div>
        </div>

        <div className="qrr-divider" />

        {/* URL + copy */}
        <div className="qrr-url-row">
          <span className="qrr-url">{REMOTE_URL}</span>
          <button
            className={`qrr-copy-btn ${copied ? 'copied' : ''}`}
            onClick={handleCopy}
          >
            {copied ? '✓ Copiado' : 'Copiar'}
          </button>
        </div>
      </div>
    </>
  );

  if (modal) {
    return (
      <div className="qrr-overlay" onClick={onClose}>
        <div onClick={e => e.stopPropagation()}>{content}</div>
      </div>
    );
  }

  return content;
}

// ── Componente botón con modal integrado ──────────────────────────────────
export function QRRemoteButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@600;700&display=swap');
        .qrr-trigger {
          display: flex; align-items: center; gap: 8px;
          background: rgba(0,200,255,0.06);
          border: 1px solid rgba(0,200,255,0.18);
          border-radius: 8px; color: rgba(0,200,255,0.8);
          font-family: 'Rajdhani', sans-serif;
          font-size: 0.85rem; font-weight: 700;
          letter-spacing: 0.06em; padding: 9px 15px;
          cursor: pointer; transition: all 0.2s;
        }
        .qrr-trigger:hover {
          background: rgba(0,200,255,0.12);
          border-color: rgba(0,200,255,0.45);
          color: #00c8ff;
          box-shadow: 0 0 16px rgba(0,200,255,0.1);
        }
        .qrr-trigger-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: #00c8ff; box-shadow: 0 0 6px #00c8ff;
          animation: qrr-dot2 1.8s ease-in-out infinite;
        }
        @keyframes qrr-dot2 { 0%,100%{opacity:1} 50%{opacity:0.3} }
        .qrr-overlay2 {
          position: fixed; inset: 0; z-index: 999;
          background: rgba(0,0,0,0.85);
          backdrop-filter: blur(10px);
          display: flex; align-items: center; justify-content: center;
          padding: 20px;
          animation: qrr-fi2 0.18s ease;
        }
        @keyframes qrr-fi2 { from{opacity:0} to{opacity:1} }
      `}</style>

      <button className="qrr-trigger" onClick={() => setOpen(true)}>
        <span>📱</span>
        Control Remoto
        <span className="qrr-trigger-dot" />
      </button>

      {open && (
        <div className="qrr-overlay2" onClick={() => setOpen(false)}>
          <div onClick={e => e.stopPropagation()}>
            <QRRemote modal onClose={() => setOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}