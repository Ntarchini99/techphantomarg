import { useState, useEffect } from 'react';
import { Channel } from './types';
import { channels as channelsData } from './data/channels';
import { ChannelList } from './components/ChannelList';
import { VideoPlayer } from './components/VideoPlayer';

function App() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'logo' | 'loading'>('logo');

  useEffect(() => {
    const logoTimer = setTimeout(() => setPhase('loading'), 1800);

    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 90) { clearInterval(interval); return p; }
        return p + Math.random() * 15;
      });
    }, 140);

    const load = async () => {
      await new Promise(resolve => setTimeout(resolve, 2800));
      setChannels(channelsData);
      setProgress(100);
      await new Promise(resolve => setTimeout(resolve, 350));
      setLoading(false);
    };

    load();
    return () => { clearInterval(interval); clearTimeout(logoTimer); };
  }, []);

  if (loading) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Rajdhani:wght@300;400;500;600;700&display=swap');

          * { margin: 0; padding: 0; box-sizing: border-box; }

          .splash {
            min-height: 100vh;
            background: #060608;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            font-family: 'Rajdhani', sans-serif;
            position: relative;
            overflow: hidden;
          }

          .splash::before {
            content: '';
            position: absolute; inset: 0;
            background-image:
              linear-gradient(rgba(0,200,255,0.04) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,200,255,0.04) 1px, transparent 1px);
            background-size: 48px 48px;
            mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%);
            animation: gridpan 12s linear infinite;
          }
          @keyframes gridpan {
            0% { background-position: 0 0; }
            100% { background-position: 48px 48px; }
          }

          .glow-orb {
            position: absolute;
            width: 500px; height: 500px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(0,200,255,0.08) 0%, rgba(0,100,200,0.06) 40%, transparent 70%);
            pointer-events: none;
            animation: orb-breathe 3s ease-in-out infinite;
          }
          @keyframes orb-breathe {
            0%, 100% { transform: scale(1); opacity: 0.8; }
            50% { transform: scale(1.15); opacity: 1; }
          }

          .scanlines {
            position: absolute; inset: 0;
            background: repeating-linear-gradient(
              0deg, transparent, transparent 3px,
              rgba(0,0,0,0.08) 3px, rgba(0,0,0,0.08) 4px
            );
            pointer-events: none;
          }

          .logo-container {
            position: relative; z-index: 10;
            display: flex; flex-direction: column;
            align-items: center; gap: 20px;
          }

          .logo-img-wrap {
            position: relative;
            width: 140px; height: 140px;
            animation: logo-appear 0.6s cubic-bezier(0.34,1.56,0.64,1) both;
          }
          @keyframes logo-appear {
            from { opacity: 0; transform: scale(0.5) rotate(-15deg); }
            to   { opacity: 1; transform: scale(1) rotate(0deg); }
          }

          .logo-ring {
            position: absolute; inset: -8px;
            border-radius: 50%;
            border: 2px solid rgba(0,200,255,0.4);
            animation: ring-spin 4s linear infinite;
          }
          .logo-ring::before {
            content: '';
            position: absolute; top: -3px; left: 50%;
            width: 8px; height: 8px; border-radius: 50%;
            background: #00c8ff;
            transform: translateX(-50%);
            box-shadow: 0 0 12px #00c8ff, 0 0 24px rgba(0,200,255,0.5);
          }
          @keyframes ring-spin {
            from { transform: rotate(0deg); }
            to   { transform: rotate(360deg); }
          }

          .logo-ring-2 {
            position: absolute; inset: -18px;
            border-radius: 50%;
            border: 1px solid rgba(0,200,255,0.15);
            animation: ring-spin 8s linear infinite reverse;
          }
          .logo-ring-2::before {
            content: '';
            position: absolute; bottom: -3px; left: 50%;
            width: 5px; height: 5px; border-radius: 50%;
            background: rgba(0,200,255,0.6);
            transform: translateX(-50%);
            box-shadow: 0 0 8px rgba(0,200,255,0.8);
          }

          .logo-img {
            width: 140px; height: 140px;
            border-radius: 50%; object-fit: cover;
            border: 2px solid rgba(0,200,255,0.3);
            box-shadow: 0 0 30px rgba(0,200,255,0.2), 0 0 60px rgba(0,100,200,0.15), inset 0 0 20px rgba(0,0,0,0.5);
          }

          .logo-img-wrap::after {
            content: ''; position: absolute; inset: 0;
            border-radius: 50%;
            background: rgba(0,200,255,0.08);
            animation: logo-pulse 2s ease-in-out infinite 0.3s;
          }
          @keyframes logo-pulse {
            0%, 100% { opacity: 0; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.08); }
          }

          .brand-name {
            font-family: 'Bebas Neue', cursive;
            font-size: clamp(2.5rem, 7vw, 4.2rem);
            letter-spacing: 0.18em;
            color: #f0f8ff;
            position: relative;
            animation: name-appear 0.5s ease 0.3s both;
            text-shadow: 0 0 20px rgba(0,200,255,0.4), 0 0 40px rgba(0,100,200,0.2);
          }
          @keyframes name-appear {
            from { opacity: 0; transform: translateY(16px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          .brand-name .accent { color: #00c8ff; }

          .brand-tagline {
            font-size: 0.72rem;
            letter-spacing: 0.35em;
            text-transform: uppercase;
            color: rgba(0,200,255,0.7);
            font-weight: 500;
            animation: name-appear 0.5s ease 0.45s both;
          }

          .loading-section {
            margin-top: 48px;
            width: min(340px, 75vw);
            animation: name-appear 0.4s ease 0.6s both;
          }
          .loading-section.hidden {
            opacity: 0; pointer-events: none;
          }

          .progress-header {
            display: flex; justify-content: space-between; align-items: center;
            margin-bottom: 10px;
          }
          .progress-label {
            font-size: 0.65rem; letter-spacing: 0.2em;
            text-transform: uppercase;
            color: rgba(0,200,255,0.65);
            font-weight: 600;
          }
          .progress-pct {
            font-family: 'Rajdhani', sans-serif;
            font-size: 0.75rem; font-weight: 600;
            color: rgba(0,200,255,0.85);
            letter-spacing: 0.05em;
          }

          .progress-track {
            height: 2px;
            background: rgba(255,255,255,0.05);
            border-radius: 2px; overflow: visible; position: relative;
          }
          .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #0066cc, #00c8ff);
            border-radius: 2px;
            transition: width 0.2s ease;
            position: relative;
            box-shadow: 0 0 10px rgba(0,200,255,0.8), 0 0 20px rgba(0,200,255,0.4);
          }
          .progress-fill::after {
            content: '';
            position: absolute; right: -1px; top: 50%;
            transform: translateY(-50%);
            width: 6px; height: 6px; border-radius: 50%;
            background: #00c8ff;
            box-shadow: 0 0 8px #00c8ff, 0 0 16px rgba(0,200,255,0.6);
          }

          .particles { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }
          .particle {
            position: absolute; border-radius: 50%;
            background: rgba(0,200,255,0.7);
            animation: float-up linear infinite;
          }
          @keyframes float-up {
            0% { transform: translateY(0) translateX(0); opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 0.6; }
            100% { transform: translateY(-100vh) translateX(var(--drift, 20px)); opacity: 0; }
          }

          .corner { position: absolute; width: 40px; height: 40px; }
          .corner-tl { top: 24px; left: 24px; border-top: 1px solid rgba(0,200,255,0.3); border-left: 1px solid rgba(0,200,255,0.3); }
          .corner-tr { top: 24px; right: 24px; border-top: 1px solid rgba(0,200,255,0.3); border-right: 1px solid rgba(0,200,255,0.3); }
          .corner-bl { bottom: 24px; left: 24px; border-bottom: 1px solid rgba(0,200,255,0.3); border-left: 1px solid rgba(0,200,255,0.3); }
          .corner-br { bottom: 24px; right: 24px; border-bottom: 1px solid rgba(0,200,255,0.3); border-right: 1px solid rgba(0,200,255,0.3); }
        `}</style>

        <div className="splash">
          <div className="glow-orb" />
          <div className="scanlines" />

          <div className="particles">
            {Array.from({ length: 18 }).map((_, i) => (
              <div
                key={i}
                className="particle"
                style={{
                  left: `${Math.random() * 100}%`,
                  bottom: `${Math.random() * 20}%`,
                  animationDuration: `${4 + Math.random() * 8}s`,
                  animationDelay: `${Math.random() * 6}s`,
                  width: `${1 + Math.random() * 2}px`,
                  height: `${1 + Math.random() * 2}px`,
                  opacity: 0.5 + Math.random() * 0.4,
                  ['--drift' as any]: `${(Math.random() - 0.5) * 60}px`,
                }}
              />
            ))}
          </div>

          <div className="corner corner-tl" />
          <div className="corner corner-tr" />
          <div className="corner corner-bl" />
          <div className="corner corner-br" />

          <div className="logo-container">
            <div className="logo-img-wrap">
              <div className="logo-ring" />
              <div className="logo-ring-2" />
              <img
                className="logo-img"
                src="https://i.postimg.cc/j2WvZw96/Whats-App-Image-2026-03-02-at-11-44-07.jpg"
                alt="TechPhantom"
              />
            </div>

            <div>
              <div className="brand-name">
                <span className="accent">Tech</span>Phantom
              </div>
              <div className="brand-tagline">Streaming · HD · Live · Películas · Series · Streams</div>
            </div>

            <div className={`loading-section ${phase === 'logo' ? 'hidden' : ''}`}>
              <div className="progress-header">
                <span className="progress-label">Iniciando sistema</span>
                <span className="progress-pct">{Math.round(Math.min(progress, 100))}%</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${Math.min(progress, 100)}%` }} />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (selectedChannel) {
    return (
      <VideoPlayer
        channel={selectedChannel}
        channels={channels}
        onBack={() => setSelectedChannel(null)}
        onChannelChange={setSelectedChannel}
      />
    );
  }

  return <ChannelList channels={channels} onChannelSelect={setSelectedChannel} />;
}

export default App;