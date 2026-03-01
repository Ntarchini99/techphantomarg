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

  useEffect(() => {
    // Animación de progreso suave
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 90) { clearInterval(interval); return p; }
        return p + Math.random() * 18;
      });
    }, 120);

    const load = async () => {
      await new Promise(resolve => setTimeout(resolve, 900));
      setChannels(channelsData);
      setProgress(100);
      // Pequeño delay para que se vea el 100%
      await new Promise(resolve => setTimeout(resolve, 250));
      setLoading(false);
    };

    load();
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500&display=swap');

          .splash {
            min-height: 100vh;
            background: #0a0a0f;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            font-family: 'DM Sans', sans-serif;
            position: relative;
            overflow: hidden;
          }

          /* Ambient red glow */
          .splash::before {
            content: '';
            position: absolute;
            top: -30%;
            left: 50%;
            transform: translateX(-50%);
            width: 600px; height: 400px;
            background: radial-gradient(ellipse, rgba(229,9,20,0.12) 0%, transparent 70%);
            pointer-events: none;
          }

          .splash-logo {
            font-family: 'Bebas Neue', cursive;
            font-size: clamp(3rem, 8vw, 5rem);
            letter-spacing: 0.1em;
            background: linear-gradient(135deg, #fff 0%, #e50914 55%, #ff6b6b 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 8px;
            animation: fadein 0.5s ease;
          }

          .splash-sub {
            font-size: 0.85rem;
            color: #444;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            margin-bottom: 52px;
            animation: fadein 0.5s ease 0.1s both;
          }

          /* Progress bar */
          .progress-wrap {
            width: min(320px, 70vw);
            animation: fadein 0.5s ease 0.2s both;
          }
          .progress-track {
            height: 2px;
            background: rgba(255,255,255,0.07);
            border-radius: 2px;
            overflow: hidden;
            margin-bottom: 14px;
          }
          .progress-fill {
            height: 100%;
            background: #e50914;
            border-radius: 2px;
            transition: width 0.15s ease;
            box-shadow: 0 0 8px rgba(229,9,20,0.6);
          }
          .progress-label {
            text-align: center;
            font-size: 0.75rem;
            color: #444;
            letter-spacing: 0.06em;
          }

          @keyframes fadein {
            from { opacity: 0; transform: translateY(10px); }
            to   { opacity: 1; transform: translateY(0); }
          }
        `}</style>

        <div className="splash">
          <div className="splash-logo">NazzStream</div>
          <div className="splash-sub">Cargando contenido</div>
          <div className="progress-wrap">
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${Math.min(progress, 100)}%` }} />
            </div>
            <div className="progress-label">{Math.round(Math.min(progress, 100))}%</div>
          </div>
        </div>
      </>
    );
  }

  if (selectedChannel) {
    return <VideoPlayer channel={selectedChannel} onBack={() => setSelectedChannel(null)} />;
  }

  return <ChannelList channels={channels} onChannelSelect={setSelectedChannel} />;
}

export default App;