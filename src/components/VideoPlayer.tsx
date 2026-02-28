import { useState, useMemo } from 'react';
import { Channel } from '../types';
import { ArrowLeft, Tv, Film, AlertCircle, MapPin, RefreshCw } from 'lucide-react';

interface VideoPlayerProps {
  channel: Channel;
  onBack: () => void;
}

// Build alternative stream options for sports channels
function getStreamOptions(streamUrl: string): { label: string; url: string }[] {
  // If it's a latamvidz1 sports stream, offer multiple servers
  if (streamUrl.includes('latamvidz1.com/canal.php')) {
    const match = streamUrl.match(/stream=([^&]+)/);
    const stream = match ? match[1] : '';
    return [
      { label: 'Opción 1', url: `https://latamvidz1.com/canal.php?stream=${stream}` },
      { label: 'Opción 2', url: `https://la14hd.com/vivo/canal.php?stream=${stream}` },
      { label: 'Opción 3', url: `https://streamtpcloud.com/global1.php?stream=${stream}` },
    ];
  }
  return [{ label: 'Principal', url: streamUrl }];
}

export function VideoPlayer({ channel, onBack }: VideoPlayerProps) {
  const streamOptions = useMemo(() => getStreamOptions(channel.streamUrl), [channel]);
  const [activeStream, setActiveStream] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const currentUrl = streamOptions[activeStream]?.url ?? channel.streamUrl;

  const handleIframeLoad = () => setLoading(false);
  const handleIframeError = () => { setLoading(false); setError(true); };

  const retry = () => { setError(false); setLoading(true); };
  const switchStream = (i: number) => { setActiveStream(i); setError(false); setLoading(true); };

  const isLive = channel.type === 'tv';
  const hasOptions = streamOptions.length > 1;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Bebas+Neue&display=swap');

        .player-root {
          min-height: 100vh;
          background: #0a0a0f;
          font-family: 'DM Sans', 'Helvetica Neue', sans-serif;
          color: #f0f0f0;
        }

        /* Header */
        .player-header {
          position: sticky;
          top: 0;
          z-index: 50;
          background: linear-gradient(180deg, rgba(10,10,15,0.98) 0%, rgba(10,10,15,0.85) 100%);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          padding: 14px 24px;
        }
        .header-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          gap: 16px;
        }

        /* Back button */
        .back-btn {
          display: flex; align-items: center; gap: 7px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 8px;
          color: #ccc;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.85rem;
          font-weight: 500;
          padding: 9px 14px;
          cursor: pointer;
          flex-shrink: 0;
          transition: all 0.2s;
        }
        .back-btn:hover {
          background: rgba(255,255,255,0.1);
          border-color: rgba(255,255,255,0.15);
          color: #fff;
        }

        /* Channel info in header */
        .header-info { flex: 1; min-width: 0; }
        .header-name {
          font-weight: 700;
          font-size: 1rem;
          color: #f0f0f0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          line-height: 1.2;
        }
        .header-desc {
          font-size: 0.78rem;
          color: #555;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-top: 2px;
        }

        /* Live badge in header */
        .header-badge {
          display: flex; align-items: center; gap: 5px;
          padding: 5px 10px;
          border-radius: 6px;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          flex-shrink: 0;
        }
        .badge-live { background: #e50914; color: #fff; }
        .badge-film { background: rgba(120,60,220,0.85); color: #fff; }
        .live-dot {
          width: 6px; height: 6px; border-radius: 50%; background: #fff;
          animation: livepulse 1.4s ease-in-out infinite;
        }
        @keyframes livepulse {
          0%,100% { opacity:1; transform:scale(1); }
          50% { opacity:0.3; transform:scale(0.65); }
        }

        /* Main layout */
        .player-main {
          max-width: 1200px;
          margin: 0 auto;
          padding: 28px 24px 64px;
        }

        /* Video wrapper */
        .video-outer {
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.06);
          box-shadow: 0 24px 80px rgba(0,0,0,0.8);
          background: #000;
          position: relative;
        }
        .video-ratio {
          position: relative;
          padding-bottom: 56.25%;
        }
        .video-ratio iframe {
          position: absolute; inset: 0;
          width: 100%; height: 100%;
          border: none;
        }

        /* Loading state */
        .video-state {
          position: absolute; inset: 0;
          display: flex; align-items: center; justify-content: center;
          background: #0d0d12;
          z-index: 5;
        }
        .spinner {
          width: 52px; height: 52px;
          border-radius: 50%;
          border: 3px solid rgba(255,255,255,0.06);
          border-top-color: #e50914;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .loading-text {
          margin-top: 16px;
          font-size: 0.85rem;
          color: #555;
          letter-spacing: 0.04em;
        }

        /* Error state */
        .error-icon {
          width: 64px; height: 64px;
          background: rgba(229,9,20,0.1);
          border: 1px solid rgba(229,9,20,0.2);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 16px;
        }
        .error-title {
          font-size: 1.1rem; font-weight: 700; margin-bottom: 8px;
        }
        .error-msg { font-size: 0.85rem; color: #555; margin-bottom: 20px; }
        .retry-btn {
          display: inline-flex; align-items: center; gap: 7px;
          background: #e50914;
          color: #fff;
          border: none;
          border-radius: 8px;
          padding: 10px 22px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s;
        }
        .retry-btn:hover { background: #b20710; transform: translateY(-1px); }

        /* Info panel */
        .info-panel {
          margin-top: 20px;
          background: #141418;
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 12px;
          padding: 22px 24px;
          display: flex;
          align-items: flex-start;
          gap: 20px;
          flex-wrap: wrap;
        }
        .info-main { flex: 1; min-width: 0; }
        .info-title {
          font-family: 'Bebas Neue', cursive;
          font-size: 1.8rem;
          letter-spacing: 0.06em;
          color: #f0f0f0;
          line-height: 1;
          margin-bottom: 8px;
        }
        .info-desc {
          font-size: 0.875rem;
          color: #777;
          line-height: 1.6;
          margin-bottom: 14px;
        }
        .meta-pills { display: flex; flex-wrap: wrap; gap: 8px; }
        .meta-pill {
          display: inline-flex; align-items: center; gap: 4px;
          padding: 4px 11px;
          border-radius: 20px;
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }
        .pill-cat {
          background: rgba(229,9,20,0.12);
          border: 1px solid rgba(229,9,20,0.2);
          color: #e55;
        }
        .pill-country {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          color: #666;
        }
        .pill-type-live {
          background: rgba(229,9,20,0.15);
          border: 1px solid rgba(229,9,20,0.25);
          color: #ff5555;
        }
        .pill-type-film {
          background: rgba(120,60,220,0.15);
          border: 1px solid rgba(120,60,220,0.3);
          color: #a580f0;
        }

        /* Tip bar */
        .tip-bar {
          margin-top: 16px;
          background: rgba(229,9,20,0.05);
          border: 1px solid rgba(229,9,20,0.12);
          border-radius: 10px;
          padding: 16px 20px;
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .tip-icon {
          width: 36px; height: 36px; flex-shrink: 0;
          background: rgba(229,9,20,0.12);
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
        }
        .tip-text { font-size: 0.82rem; color: #666; line-height: 1.5; }
        .tip-text strong { color: #aaa; font-weight: 600; }

        /* Stream selector */
        .stream-selector {
          max-width: 1200px;
          margin: 0 auto 0;
          padding: 14px 24px 0;
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }
        .stream-label {
          font-size: 0.78rem;
          color: #555;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          white-space: nowrap;
        }
        .stream-options {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .stream-opt {
          padding: 7px 18px;
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.04);
          color: #666;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.18s;
          white-space: nowrap;
        }
        .stream-opt:hover { border-color: rgba(229,9,20,0.4); color: #ccc; background: rgba(229,9,20,0.06); }
        .stream-opt.active { background: #e50914; border-color: #e50914; color: #fff; box-shadow: 0 4px 12px rgba(229,9,20,0.35); }
      `}</style>

      <div className="player-root">

        {/* ── HEADER ── */}
        <header className="player-header">
          <div className="header-inner">
            <button className="back-btn" onClick={onBack}>
              <ArrowLeft size={15} />
              <span>Volver</span>
            </button>

            <div className="header-info">
              <div className="header-name">{channel.name}</div>
              <div className="header-desc">{channel.description}</div>
            </div>

            <div className={`header-badge ${isLive ? 'badge-live' : 'badge-film'}`}>
              {isLive ? <><span className="live-dot" />En Vivo</> : <><Film size={11} />Película</>}
            </div>
          </div>
        </header>

        {/* ── MAIN ── */}
        <main className="player-main">

          {/* Video */}
          <div className="video-outer">
            <div className="video-ratio">

              {loading && !error && (
                <div className="video-state">
                  <div style={{ textAlign: 'center' }}>
                    <div className="spinner" />
                    <p className="loading-text">Cargando contenido…</p>
                  </div>
                </div>
              )}

              {error && (
                <div className="video-state">
                  <div style={{ textAlign: 'center', padding: '0 24px' }}>
                    <div className="error-icon">
                      <AlertCircle size={28} color="#e50914" />
                    </div>
                    <p className="error-title">No se pudo cargar el reproductor</p>
                    <p className="error-msg">El contenido no está disponible en este momento.</p>
                    <button className="retry-btn" onClick={retry}>
                      <RefreshCw size={14} />
                      Reintentar
                    </button>
                  </div>
                </div>
              )}

              <iframe
                key={`${activeStream}-${error}`}
                src={currentUrl}
                allowFullScreen
                allow="autoplay; encrypted-media; picture-in-picture"
                onLoad={handleIframeLoad}
                onError={handleIframeError}
                title={channel.name}
              />
            </div>
          </div>

          {/* Info panel */}
          <div className="info-panel">
            <div className="info-main">
              <div className="info-title">{channel.name}</div>
              <p className="info-desc">{channel.description}</p>
              <div className="meta-pills">
                <span className="meta-pill pill-cat">{channel.category}</span>
                <span className="meta-pill pill-country">
                  <MapPin size={10} />{channel.country}
                </span>
                <span className={`meta-pill ${isLive ? 'pill-type-live' : 'pill-type-film'}`}>
                  {isLive ? <><span className="live-dot" style={{ background: '#ff5555' }} />En Vivo</> : <><Film size={10} />Película</>}
                </span>
              </div>
            </div>
          </div>

          {/* Stream selector */}
          {hasOptions && (
            <div className="stream-selector">
              <span className="stream-label">Servidores:</span>
              <div className="stream-options">
                {streamOptions.map((opt, i) => (
                  <button
                    key={i}
                    className={`stream-opt ${activeStream === i ? 'active' : ''}`}
                    onClick={() => switchStream(i)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tip */}
          <div className="tip-bar">
            <div className="tip-icon">
              {isLive ? <Tv size={16} color="#e50914" /> : <Film size={16} color="#e50914" />}
            </div>
            <p className="tip-text">
              Estás viendo <strong>{isLive ? 'televisión en vivo' : 'una película'}</strong>.
              Activa <strong>pantalla completa</strong> para una experiencia inmersiva.
            </p>
          </div>

        </main>
      </div>
    </>
  );
}