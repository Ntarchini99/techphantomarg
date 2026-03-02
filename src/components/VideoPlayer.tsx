import { useState, useMemo, useEffect, useRef } from 'react';
import { Channel } from '../types';
import { ArrowLeft, Tv, Film, AlertCircle, MapPin, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';

interface VideoPlayerProps {
  channel: Channel;
  channels: Channel[];
  onBack: () => void;
  onChannelChange: (channel: Channel) => void;
}

function getStreamOptions(streamUrl: string): { label: string; url: string }[] {
  if (streamUrl.includes('latamvidz1.com/canal.php')) {
    const match = streamUrl.match(/stream=([^&]+)/);
    const stream = match ? match[1] : '';
    return [
      { label: 'Servidor 1', url: `https://latamvidz1.com/canal.php?stream=${stream}` },
      { label: 'Servidor 2', url: `https://la14hd.com/vivo/canal.php?stream=${stream}` },
      { label: 'Servidor 3', url: `https://streamtpcloud.com/global1.php?stream=${stream}` },
    ];
  }
  return [{ label: 'Principal', url: streamUrl }];
}

const BLOCKED_DOMAINS = ['pelisjuanita.com', 'americatv.com.ar', 'youtube.com'];
const isLikelyBlocked = (url: string) => BLOCKED_DOMAINS.some(d => url.includes(d));

export function VideoPlayer({ channel, channels, onBack, onChannelChange }: VideoPlayerProps) {
  const streamOptions = useMemo(() => getStreamOptions(channel.streamUrl), [channel]);
  const [activeStream, setActiveStream] = useState(0);
  const [loading, setLoading] = useState(true);
  const [blocked, setBlocked] = useState(false);

  const currentIndex = channels.findIndex(c => c.id === channel.id);
  const prevChannel = currentIndex > 0 ? channels[currentIndex - 1] : null;
  const nextChannel = currentIndex < channels.length - 1 ? channels[currentIndex + 1] : null;
  const currentUrl = streamOptions[activeStream]?.url ?? channel.streamUrl;
  const siteBlocked = isLikelyBlocked(currentUrl);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' && nextChannel) handleChannelChange(nextChannel);
      if (e.key === 'ArrowLeft'  && prevChannel) handleChannelChange(prevChannel);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [prevChannel, nextChannel]);

  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
      if (dx < 0 && nextChannel) handleChannelChange(nextChannel);
      if (dx > 0 && prevChannel) handleChannelChange(prevChannel);
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  useEffect(() => {
    setLoading(true);
    setBlocked(false);
    const t = setTimeout(() => {
      setLoading(false);
      if (siteBlocked) setBlocked(true);
    }, siteBlocked ? 2000 : 6000);
    return () => clearTimeout(t);
  }, [channel.id, activeStream, siteBlocked]);

  const isLive = channel.type === 'tv';
  const hasOptions = streamOptions.length > 1;

  const handleChannelChange = (ch: Channel) => { setActiveStream(0); onChannelChange(ch); };
  const openInTab = () => window.open(currentUrl, '_blank', 'noopener,noreferrer');

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;400;500;600;700&family=Bebas+Neue&display=swap');

        .vp-root {
          min-height: 100vh;
          background: #060608;
          font-family: 'Rajdhani', 'Helvetica Neue', sans-serif;
          color: #e8f4ff;
          position: relative;
          overflow-x: hidden;
        }
        .vp-root::before {
          content: '';
          position: fixed; inset: 0;
          background-image:
            linear-gradient(rgba(0,200,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,200,255,0.02) 1px, transparent 1px);
          background-size: 48px 48px;
          mask-image: radial-gradient(ellipse 80% 60% at 50% 0%, black 0%, transparent 80%);
          pointer-events: none; z-index: 0;
        }
        .vp-header {
          position: sticky; top: 0; z-index: 50;
          background: linear-gradient(180deg, rgba(6,6,8,0.98) 0%, rgba(6,6,8,0.88) 100%);
          backdrop-filter: blur(24px);
          border-bottom: 1px solid rgba(0,200,255,0.1);
          padding: 14px 24px;
        }
        .vp-header::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(0,200,255,0.55) 30%, rgba(0,200,255,0.55) 70%, transparent);
        }
        .vp-header-inner {
          max-width: 1200px; margin: 0 auto;
          display: flex; align-items: center; gap: 16px;
        }
        .vp-back-btn {
          display: flex; align-items: center; gap: 7px;
          background: rgba(0,200,255,0.06);
          border: 1px solid rgba(0,200,255,0.15);
          border-radius: 7px; color: #7aaaba;
          font-family: 'Rajdhani', sans-serif; font-size: 0.88rem; font-weight: 600;
          letter-spacing: 0.05em;
          padding: 9px 14px; cursor: pointer; flex-shrink: 0;
          transition: all 0.2s;
        }
        .vp-back-btn:hover {
          background: rgba(0,200,255,0.1);
          border-color: rgba(0,200,255,0.35);
          color: #00c8ff;
          box-shadow: 0 0 12px rgba(0,200,255,0.08);
        }
        .vp-header-info { flex: 1; min-width: 0; }
        .vp-channel-name {
          font-family: 'Bebas Neue', cursive;
          font-weight: 700; font-size: 1.15rem; color: #e8f4ff;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
          letter-spacing: 0.08em; line-height: 1.2;
          text-shadow: 0 0 12px rgba(0,200,255,0.2);
        }
        .vp-channel-desc {
          font-size: 0.78rem; color: #6a8a9a;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
          margin-top: 2px; font-weight: 500;
        }
        .vp-status-badge {
          display: flex; align-items: center; gap: 5px;
          padding: 5px 10px; border-radius: 4px;
          font-size: 0.68rem; font-weight: 700;
          letter-spacing: 0.1em; text-transform: uppercase;
          flex-shrink: 0; font-family: 'Rajdhani', sans-serif;
        }
        .vp-badge-live  { background: rgba(0,200,255,0.12); border: 1px solid rgba(0,200,255,0.3); color: #00c8ff; }
        .vp-badge-movie { background: rgba(80,40,180,0.2);  border: 1px solid rgba(80,40,180,0.4);  color: #a080f0; }
        .vp-live-dot {
          width: 6px; height: 6px; border-radius: 50%; background: #00c8ff;
          box-shadow: 0 0 6px #00c8ff;
          animation: vp-pulse 1.4s ease-in-out infinite;
        }
        @keyframes vp-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.3;transform:scale(0.6)} }
        .vp-main {
          max-width: 1200px; margin: 0 auto;
          padding: 28px 24px 64px;
          position: relative; z-index: 1;
        }
        .vp-nav {
          display: flex; align-items: center; justify-content: space-between;
          gap: 12px; margin-bottom: 16px;
        }
        .vp-nav-btn {
          display: flex; align-items: center; gap: 8px;
          background: rgba(0,200,255,0.04);
          border: 1px solid rgba(0,200,255,0.1);
          border-radius: 8px; color: #6a8a9a;
          font-family: 'Rajdhani', sans-serif; font-size: 0.85rem; font-weight: 600;
          padding: 10px 16px; cursor: pointer; transition: all 0.2s;
          max-width: 240px; overflow: hidden;
        }
        .vp-nav-btn:hover {
          background: rgba(0,200,255,0.08);
          border-color: rgba(0,200,255,0.3);
          color: #90c8e8;
        }
        .vp-nav-btn:disabled { opacity: 0.2; cursor: not-allowed; pointer-events: none; }
        .vp-nav-label { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .vp-nav-count { font-size: 0.75rem; color: rgba(0,200,255,0.45); font-weight: 600; white-space: nowrap; }
        .vp-video-box {
          border-radius: 10px; overflow: hidden;
          border: 1px solid rgba(0,200,255,0.1);
          box-shadow: 0 24px 80px rgba(0,0,0,0.8), 0 0 40px rgba(0,200,255,0.04);
          background: #000; position: relative;
        }
        .vp-video-ratio { position: relative; padding-bottom: 56.25%; }
        .vp-video-ratio iframe {
          position: absolute; inset: 0; width: 100%; height: 100%; border: none;
        }
        .vp-overlay {
          position: absolute; inset: 0; z-index: 5;
          display: flex; align-items: center; justify-content: center;
          background: #08080f; transition: opacity 0.4s ease;
        }
        .vp-overlay.out { opacity: 0; pointer-events: none; }
        .vp-spinner {
          width: 48px; height: 48px; border-radius: 50%;
          border: 2px solid rgba(0,200,255,0.1);
          border-top-color: #00c8ff;
          animation: vp-spin 0.8s linear infinite;
        }
        @keyframes vp-spin { to { transform: rotate(360deg); } }
        .vp-loading-text {
          margin-top: 16px; font-size: 0.82rem; color: rgba(0,200,255,0.5);
          letter-spacing: 0.1em; text-transform: uppercase; font-weight: 600;
        }
        .vp-blocked-icon {
          width: 68px; height: 68px;
          background: rgba(255,160,0,0.06);
          border: 1px solid rgba(255,160,0,0.18);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 18px;
        }
        .vp-blocked-title { font-size: 1.05rem; font-weight: 700; margin-bottom: 8px; color: #e8f4ff; font-family: 'Rajdhani', sans-serif; }
        .vp-blocked-msg { font-size: 0.85rem; color: #6a8a9a; margin-bottom: 22px; max-width: 320px; line-height: 1.6; font-family: 'Rajdhani', sans-serif; }
        .vp-open-btn {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(0,200,255,0.12); color: #00c8ff;
          border: 1px solid rgba(0,200,255,0.35);
          border-radius: 8px; padding: 11px 28px;
          font-family: 'Rajdhani', sans-serif; font-size: 0.92rem; font-weight: 700;
          cursor: pointer; transition: all 0.2s;
          letter-spacing: 0.06em;
          box-shadow: 0 0 20px rgba(0,200,255,0.1);
        }
        .vp-open-btn:hover {
          background: rgba(0,200,255,0.2);
          border-color: rgba(0,200,255,0.6);
          box-shadow: 0 0 30px rgba(0,200,255,0.2);
        }
        .vp-blocked-url { margin-top: 12px; font-size: 0.68rem; color: #4a6a7a; word-break: break-all; }
        .vp-servers {
          margin-top: 14px; display: flex; align-items: center; gap: 12px; flex-wrap: wrap;
        }
        .vp-servers-label {
          font-size: 0.72rem; color: rgba(0,200,255,0.5); font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.12em; white-space: nowrap;
          font-family: 'Rajdhani', sans-serif;
        }
        .vp-server-btns { display: flex; gap: 8px; flex-wrap: wrap; }
        .vp-server-btn {
          padding: 6px 16px; border-radius: 4px;
          border: 1px solid rgba(0,200,255,0.15);
          background: rgba(0,200,255,0.04);
          color: rgba(0,200,255,0.55);
          font-family: 'Rajdhani', sans-serif; font-size: 0.8rem; font-weight: 600;
          letter-spacing: 0.06em;
          cursor: pointer; transition: all 0.18s; white-space: nowrap;
        }
        .vp-server-btn:hover {
          border-color: rgba(0,200,255,0.35);
          color: #90c8e0;
          background: rgba(0,200,255,0.07);
        }
        .vp-server-btn.active {
          background: rgba(0,200,255,0.12);
          border-color: rgba(0,200,255,0.5);
          color: #00c8ff;
          box-shadow: 0 0 10px rgba(0,200,255,0.1);
        }
        .vp-info {
          margin-top: 20px;
          background: #0b0b12;
          border: 1px solid rgba(0,200,255,0.08);
          border-radius: 10px; padding: 20px 22px;
          display: flex; align-items: flex-start; gap: 20px; flex-wrap: wrap;
        }
        .vp-info-main { flex: 1; min-width: 0; }
        .vp-info-name {
          font-family: 'Bebas Neue', cursive;
          font-size: 1.75rem; letter-spacing: 0.08em; color: #e8f4ff;
          line-height: 1; margin-bottom: 8px;
          text-shadow: 0 0 12px rgba(0,200,255,0.15);
        }
        .vp-info-desc { font-size: 0.875rem; color: #6a8a9a; line-height: 1.6; margin-bottom: 14px; font-weight: 500; }
        .vp-meta-pills { display: flex; flex-wrap: wrap; gap: 8px; }
        .vp-mpill {
          display: inline-flex; align-items: center; gap: 4px;
          padding: 3px 10px; border-radius: 3px;
          font-size: 0.7rem; font-weight: 700;
          letter-spacing: 0.06em; text-transform: uppercase;
          font-family: 'Rajdhani', sans-serif;
        }
        .vp-mpill-cat  { background: rgba(0,200,255,0.07); border: 1px solid rgba(0,200,255,0.2); color: rgba(0,200,255,0.8); }
        .vp-mpill-co   { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); color: #6a8a9a; }
        .vp-mpill-live { background: rgba(0,200,255,0.08); border: 1px solid rgba(0,200,255,0.25); color: #00c8ff; }
        .vp-mpill-film { background: rgba(80,40,180,0.1); border: 1px solid rgba(80,40,180,0.3); color: #a080f0; }
        .vp-tip {
          margin-top: 16px;
          background: rgba(0,200,255,0.03);
          border: 1px solid rgba(0,200,255,0.1);
          border-radius: 8px; padding: 14px 18px;
          display: flex; align-items: center; gap: 14px;
        }
        .vp-tip-icon {
          width: 34px; height: 34px; flex-shrink: 0;
          background: rgba(0,200,255,0.08);
          border-radius: 6px; display: flex; align-items: center; justify-content: center;
        }
        .vp-tip-text { font-size: 0.82rem; color: #6a8a9a; line-height: 1.5; font-weight: 500; }
        .vp-tip-text strong { color: rgba(0,200,255,0.7); font-weight: 700; }
      `}</style>

      <div className="vp-root" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        <header className="vp-header">
          <div className="vp-header-inner">
            <button className="vp-back-btn" onClick={onBack}><ArrowLeft size={15} /><span>Volver</span></button>
            <div className="vp-header-info">
              <div className="vp-channel-name">{channel.name}</div>
              <div className="vp-channel-desc">{channel.description}</div>
            </div>
            <div className={`vp-status-badge ${isLive ? 'vp-badge-live' : 'vp-badge-movie'}`}>
              {isLive ? <><span className="vp-live-dot" />En Vivo</> : <><Film size={11} />Película</>}
            </div>
          </div>
        </header>

        <main className="vp-main">
          <div className="vp-nav">
            <button className="vp-nav-btn" disabled={!prevChannel} onClick={() => prevChannel && handleChannelChange(prevChannel)}>
              <ChevronLeft size={16} /><span className="vp-nav-label">{prevChannel?.name ?? 'Anterior'}</span>
            </button>
            <span className="vp-nav-count">{currentIndex + 1} / {channels.length}</span>
            <button className="vp-nav-btn" disabled={!nextChannel} onClick={() => nextChannel && handleChannelChange(nextChannel)}>
              <span className="vp-nav-label">{nextChannel?.name ?? 'Siguiente'}</span><ChevronRight size={16} />
            </button>
          </div>

          <div className="vp-video-box">
            <div className="vp-video-ratio">
              <div className={`vp-overlay ${!loading ? 'out' : ''}`}>
                <div style={{ textAlign: 'center' }}>
                  <div className="vp-spinner" />
                  <p className="vp-loading-text">Cargando señal…</p>
                </div>
              </div>
              {blocked && (
                <div className="vp-overlay">
                  <div style={{ textAlign: 'center', padding: '0 32px' }}>
                    <div className="vp-blocked-icon"><AlertCircle size={28} color="#ffa000" /></div>
                    <p className="vp-blocked-title">Este canal no permite embedding</p>
                    <p className="vp-blocked-msg">El sitio bloquea la reproducción dentro de otras páginas. Podés verlo directamente.</p>
                    <button className="vp-open-btn" onClick={openInTab}><ExternalLink size={15} />Abrir en nueva pestaña</button>
                    <p className="vp-blocked-url">{currentUrl}</p>
                  </div>
                </div>
              )}
              <iframe
                key={`${channel.id}-${activeStream}`}
                src={currentUrl}
                allowFullScreen
                allow="autoplay; encrypted-media; picture-in-picture"
                onLoad={() => setLoading(false)}
                title={channel.name}
              />
            </div>
          </div>

          {hasOptions && (
            <div className="vp-servers">
              <span className="vp-servers-label">Servidores:</span>
              <div className="vp-server-btns">
                {streamOptions.map((opt, i) => (
                  <button key={i} className={`vp-server-btn ${activeStream === i ? 'active' : ''}`} onClick={() => setActiveStream(i)}>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="vp-info">
            <div className="vp-info-main">
              <div className="vp-info-name">{channel.name}</div>
              <p className="vp-info-desc">{channel.description}</p>
              <div className="vp-meta-pills">
                <span className="vp-mpill vp-mpill-cat">{channel.category}</span>
                <span className="vp-mpill vp-mpill-co"><MapPin size={9} />{channel.country}</span>
                <span className={`vp-mpill ${isLive ? 'vp-mpill-live' : 'vp-mpill-film'}`}>
                  {isLive ? <><span className="vp-live-dot" />En Vivo</> : <><Film size={9} />Película</>}
                </span>
              </div>
            </div>
          </div>

          <div className="vp-tip">
            <div className="vp-tip-icon">{isLive ? <Tv size={15} color="#00c8ff" /> : <Film size={15} color="#00c8ff" />}</div>
            <p className="vp-tip-text">
              Estás viendo <strong>{isLive ? 'televisión en vivo' : 'una película'}</strong>.
              Usá <strong>← →</strong> en PC · <strong>deslizá</strong> en tablet/móvil para cambiar de canal.
            </p>
          </div>
        </main>
      </div>
    </>
  );
}