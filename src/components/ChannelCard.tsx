import { useState } from 'react';
import { Channel } from '../types';
import { Play, Film, MapPin } from 'lucide-react';

interface ChannelCardProps {
  channel: Channel;
  onClick: () => void;
}

/** Fallback SVG con iniciales — solo si la imagen falla */
function makeInitialsAvatar(name: string): string {
  const words = name.trim().split(/\s+/);
  const initials = words.length >= 2
    ? (words[0][0] + words[1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase();
  const hue    = [...name].reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360;
  const bg     = `hsl(${hue},35%,11%)`;
  const accent = `hsl(${hue},65%,58%)`;
  const ring   = `hsl(${hue},35%,20%)`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="180" viewBox="0 0 320 180">
  <rect width="320" height="180" fill="${bg}"/>
  <rect x="0.5" y="0.5" width="319" height="179" fill="none" stroke="${ring}" stroke-width="1"/>
  <text x="160" y="108" font-family="'Helvetica Neue',Arial,sans-serif" font-size="58"
    font-weight="800" fill="${accent}" text-anchor="middle" letter-spacing="3">${initials}</text>
</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export function ChannelCard({ channel, onClick }: ChannelCardProps) {
  const [imgSrc, setImgSrc] = useState(channel.logo);
  const [loaded, setLoaded] = useState(false);
  const isFallback           = imgSrc.startsWith('data:');

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Bebas+Neue&display=swap');

        .channel-card {
          position: relative; background: #141418; border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.06); cursor: pointer; overflow: hidden;
          transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1), border-color 0.2s, box-shadow 0.25s;
          font-family: 'DM Sans', 'Helvetica Neue', sans-serif;
        }
        .channel-card:hover {
          transform: translateY(-4px) scale(1.02);
          border-color: rgba(229,9,20,0.35);
          box-shadow: 0 16px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(229,9,20,0.15);
        }
        .card-thumb { position: relative; aspect-ratio: 16/9; background: #0d0d12; overflow: hidden; }

        .card-shimmer {
          position: absolute; inset: 0; z-index: 0;
          background: linear-gradient(90deg, #141418 25%, #1e1e26 50%, #141418 75%);
          background-size: 200% 100%; animation: shimmer 1.4s infinite;
        }
        .card-shimmer.done { display: none; }
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

        .card-thumb img {
          position: relative; z-index: 1; width: 100%; height: 100%;
          object-fit: contain; padding: 16px;
          opacity: 0; transition: transform 0.35s ease, opacity 0.3s, filter 0.3s;
          filter: brightness(0.92);
        }
        .card-thumb img.visible { opacity: 1; }
        .card-thumb img.is-fallback { object-fit: cover; padding: 0; }
        .channel-card:hover .card-thumb img { transform: scale(1.06); filter: brightness(1); }

        .card-thumb::after {
          content: ''; position: absolute; inset: 0; z-index: 2;
          background: linear-gradient(180deg, transparent 40%, rgba(20,20,24,0.95) 100%);
          pointer-events: none;
        }
        .play-overlay {
          position: absolute; inset: 0; z-index: 3;
          background: rgba(0,0,0,0); display: flex; align-items: center; justify-content: center;
          transition: background 0.25s;
        }
        .channel-card:hover .play-overlay { background: rgba(0,0,0,0.45); }
        .play-btn {
          width: 52px; height: 52px; background: rgba(229,9,20,0.9); border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          transform: scale(0); opacity: 0;
          transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), opacity 0.2s;
          box-shadow: 0 4px 20px rgba(229,9,20,0.5);
        }
        .channel-card:hover .play-btn { transform: scale(1); opacity: 1; }

        .type-badge {
          position: absolute; top: 10px; left: 10px; z-index: 4;
          display: flex; align-items: center; gap: 4px; padding: 4px 8px; border-radius: 5px;
          font-size: 0.65rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;
        }
        .badge-live  { background: #e50914; color: #fff; }
        .badge-movie { background: rgba(120,60,220,0.9); color: #fff; }
        .live-dot {
          width: 6px; height: 6px; border-radius: 50%; background: #fff;
          animation: livepulse 1.4s ease-in-out infinite;
        }
        @keyframes livepulse { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.4; transform:scale(0.7); } }

        .card-body { padding: 12px 14px 14px; position: relative; z-index: 1; }
        .card-title {
          font-weight: 700; font-size: 0.95rem; color: #f0f0f0;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
          margin-bottom: 5px; letter-spacing: -0.01em;
        }
        .card-desc {
          font-size: 0.78rem; color: #666; line-height: 1.45;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
          overflow: hidden; margin-bottom: 10px; font-weight: 400;
        }
        .card-meta { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
        .cat-pill {
          display: inline-block; background: rgba(229,9,20,0.12); color: #e55;
          border: 1px solid rgba(229,9,20,0.2); font-size: 0.68rem; font-weight: 600;
          letter-spacing: 0.04em; padding: 3px 9px; border-radius: 20px;
          white-space: nowrap; text-transform: uppercase;
        }
        .country-tag {
          display: flex; align-items: center; gap: 3px;
          font-size: 0.72rem; color: #555; font-weight: 400; flex-shrink: 0;
        }
      `}</style>

      <div className="channel-card" onClick={onClick}>
        <div className="card-thumb">
          <div className={`card-shimmer ${loaded ? 'done' : ''}`} />

          <img
            src={imgSrc}
            alt={channel.name}
            referrerPolicy="no-referrer"
            className={`${loaded ? 'visible' : ''} ${isFallback ? 'is-fallback' : ''}`}
            onLoad={() => setLoaded(true)}
            onError={() => {
              if (!isFallback) {
                setImgSrc(makeInitialsAvatar(channel.name));
                setLoaded(true);
              }
            }}
          />

          <div className={`type-badge ${channel.type === 'tv' ? 'badge-live' : 'badge-movie'}`}>
            {channel.type === 'tv'
              ? <><span className="live-dot" />En Vivo</>
              : <><Film size={10} />Película</>}
          </div>

          <div className="play-overlay">
            <div className="play-btn"><Play size={22} color="#fff" fill="#fff" /></div>
          </div>
        </div>

        <div className="card-body">
          <div className="card-title">{channel.name}</div>
          <p className="card-desc">{channel.description}</p>
          <div className="card-meta">
            <span className="cat-pill">{channel.category}</span>
            <span className="country-tag"><MapPin size={10} />{channel.country}</span>
          </div>
        </div>
      </div>
    </>
  );
}