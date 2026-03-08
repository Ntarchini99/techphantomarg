import { useState } from 'react';
import { Channel } from '../types';
import { Play, Film, MapPin } from 'lucide-react';

interface ChannelCardProps {
  channel: Channel;
  onClick: () => void;
}

function makeInitialsAvatar(name: string): string {
  const words = name.trim().split(/\s+/);
  const initials = words.length >= 2
    ? (words[0][0] + words[1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase();
  const hue = [...name].reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360;
  const bg = `hsl(${hue},30%,8%)`;
  const accent = `hsl(${190},70%,55%)`;
  const ring = `hsl(${190},40%,16%)`;
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
  const isFallback = imgSrc.startsWith('data:');

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Bebas+Neue&display=swap');

        .tp-card {
          position: relative;
          background: #0b0b12;
          border-radius: 8px;
          border: 1px solid rgba(0,200,255,0.08);
          cursor: pointer; overflow: hidden;
          transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1), border-color 0.2s, box-shadow 0.25s;
          font-family: 'Rajdhani', 'Helvetica Neue', sans-serif;
        }
        .tp-card:hover {
          transform: translateY(-4px) scale(1.02);
          border-color: rgba(0,200,255,0.35);
          box-shadow: 0 16px 40px rgba(0,0,0,0.7), 0 0 0 1px rgba(0,200,255,0.12), 0 0 20px rgba(0,200,255,0.06);
        }

        .tp-card-thumb {
          position: relative; aspect-ratio: 16/9;
          background: #08080f; overflow: hidden;
        }

        .tp-card-shimmer {
          position: absolute; inset: 0; z-index: 0;
          background: linear-gradient(90deg, #0b0b12 25%, #131320 50%, #0b0b12 75%);
          background-size: 200% 100%; animation: tp-shimmer 1.4s infinite;
        }
        .tp-card-shimmer.done { display: none; }
        @keyframes tp-shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

        .tp-card-thumb img {
          position: relative; z-index: 1; width: 100%; height: 100%;
          object-fit: contain; padding: 16px;
          opacity: 0; transition: transform 0.35s ease, opacity 0.3s, filter 0.3s;
          filter: brightness(0.9) saturate(0.9);
        }
        .tp-card-thumb img.visible { opacity: 1; }
        .tp-card-thumb img.is-fallback { object-fit: cover; padding: 0; }
        .tp-card:hover .tp-card-thumb img { transform: scale(1.06); filter: brightness(1) saturate(1.1); }

        .tp-card-thumb::after {
          content: ''; position: absolute; inset: 0; z-index: 2;
          background: linear-gradient(180deg, transparent 40%, rgba(11,11,18,0.95) 100%);
          pointer-events: none;
        }

        .tp-play-overlay {
          position: absolute; inset: 0; z-index: 3;
          background: rgba(0,0,0,0);
          display: flex; align-items: center; justify-content: center;
          transition: background 0.25s;
        }
        .tp-card:hover .tp-play-overlay { background: rgba(0,10,20,0.5); }

        .tp-play-btn {
          width: 52px; height: 52px;
          background: rgba(0,200,255,0.85);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          transform: scale(0); opacity: 0;
          transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), opacity 0.2s;
          box-shadow: 0 4px 24px rgba(0,200,255,0.5), 0 0 40px rgba(0,200,255,0.2);
        }
        .tp-card:hover .tp-play-btn { transform: scale(1); opacity: 1; }

        .tp-type-badge {
          position: absolute; top: 10px; left: 10px; z-index: 4;
          display: flex; align-items: center; gap: 4px;
          padding: 3px 8px; border-radius: 3px;
          font-size: 0.62rem; font-weight: 700;
          letter-spacing: 0.1em; text-transform: uppercase;
          font-family: 'Rajdhani', sans-serif;
        }
        .tp-badge-live  { background: rgba(0,200,255,0.18); border: 1px solid rgba(0,200,255,0.4); color: #00c8ff; }
        .tp-badge-movie { background: rgba(80,40,180,0.25); border: 1px solid rgba(80,40,180,0.5); color: #a080f0; }

        .tp-live-dot {
          width: 5px; height: 5px; border-radius: 50%; background: #00c8ff;
          box-shadow: 0 0 6px #00c8ff;
          animation: tp-livepulse 1.4s ease-in-out infinite;
        }
        @keyframes tp-livepulse { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.3; transform:scale(0.6); } }

        .tp-card-body {
          padding: 11px 13px 13px; position: relative; z-index: 1;
        }
        .tp-card-title {
          font-weight: 700; font-size: 0.95rem; color: #e8f4ff;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
          margin-bottom: 4px; letter-spacing: 0.02em;
          font-family: 'Rajdhani', sans-serif;
        }
        .tp-card-desc {
          font-size: 0.78rem; color: #6a8a9a; line-height: 1.45;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
          overflow: hidden; margin-bottom: 10px; font-weight: 500;
        }
        .tp-card-meta {
          display: flex; align-items: center; justify-content: space-between; gap: 8px;
        }
        .tp-cat-pill {
          display: inline-block;
          background: rgba(0,200,255,0.07);
          color: rgba(0,200,255,0.8);
          border: 1px solid rgba(0,200,255,0.18);
          font-size: 0.65rem; font-weight: 700;
          letter-spacing: 0.06em; padding: 2px 8px; border-radius: 2px;
          white-space: nowrap; text-transform: uppercase;
          font-family: 'Rajdhani', sans-serif;
        }
        .tp-country-tag {
          display: flex; align-items: center; gap: 3px;
          font-size: 0.7rem; color: #6a8a9a; font-weight: 500; flex-shrink: 0;
          font-family: 'Rajdhani', sans-serif;
        }

        .tp-card::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(0,200,255,0.6), transparent);
          opacity: 0; z-index: 5;
          transition: opacity 0.25s;
        }
        .tp-card:hover::before { opacity: 1; }
      `}</style>

      <div className="tp-card" onClick={onClick}>
        <div className="tp-card-thumb">
          <div className={`tp-card-shimmer ${loaded ? 'done' : ''}`} />
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
          <div className={`tp-type-badge ${channel.type === 'tv' ? 'tp-badge-live' : 'tp-badge-movie'}`}>
            {channel.type === 'tv'
              ? <><span className="tp-live-dot" />En Vivo</>
              : <><Film size={9} />Película</>}
          </div>
          <div className="tp-play-overlay">
            <div className="tp-play-btn"><Play size={20} color="#060608" fill="#060608" /></div>
          </div>
        </div>
        <div className="tp-card-body">
          <div className="tp-card-title">{channel.name}</div>
          <p className="tp-card-desc">{channel.description}</p>
          <div className="tp-card-meta">
            <span className="tp-cat-pill">{channel.category}</span>
            <span className="tp-country-tag"><MapPin size={9} />{channel.country}</span>
          </div>
        </div>
      </div>
    </>
  );
}