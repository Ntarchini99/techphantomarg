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
      { label: 'Opción 1', url: `https://latamvidz1.com/canal.php?stream=${stream}` },
      { label: 'Opción 2', url: `https://la14hd.com/vivo/canal.php?stream=${stream}` },
      { label: 'Opción 3', url: `https://streamtpcloud.com/global1.php?stream=${stream}` },
    ];
  }
  return [{ label: 'Principal', url: streamUrl }];
}

// Sites known to set X-Frame-Options: DENY/SAMEORIGIN
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

  // ── Keyboard navigation (PC) ──────────────────────────────────────────────
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' && nextChannel) handleChannelChange(nextChannel);
      if (e.key === 'ArrowLeft'  && prevChannel) handleChannelChange(prevChannel);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [prevChannel, nextChannel]);

  // ── Touch swipe navigation (tablet / mobile) ───────────────────────────────
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
    // Only trigger if horizontal swipe is dominant and long enough (>50px)
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
      if (dx < 0 && nextChannel) handleChannelChange(nextChannel); // swipe left → next
      if (dx > 0 && prevChannel) handleChannelChange(prevChannel); // swipe right → prev
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  // Reset + auto-timeout on every channel/stream change
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
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Bebas+Neue&display=swap');
        .pr { min-height:100vh; background:#0a0a0f; font-family:'DM Sans','Helvetica Neue',sans-serif; color:#f0f0f0; }
        .ph { position:sticky;top:0;z-index:50; background:linear-gradient(180deg,rgba(10,10,15,.98) 0%,rgba(10,10,15,.85) 100%); backdrop-filter:blur(20px); border-bottom:1px solid rgba(255,255,255,.06); padding:14px 24px; }
        .phi { max-width:1200px;margin:0 auto;display:flex;align-items:center;gap:16px; }
        .bb { display:flex;align-items:center;gap:7px; background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.08);border-radius:8px;color:#ccc;font-family:'DM Sans',sans-serif;font-size:.85rem;font-weight:500;padding:9px 14px;cursor:pointer;flex-shrink:0;transition:all .2s; }
        .bb:hover { background:rgba(255,255,255,.1);border-color:rgba(255,255,255,.15);color:#fff; }
        .hi { flex:1;min-width:0; }
        .hn { font-weight:700;font-size:1rem;color:#f0f0f0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;line-height:1.2; }
        .hd { font-size:.78rem;color:#555;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:2px; }
        .hbg { display:flex;align-items:center;gap:5px;padding:5px 10px;border-radius:6px;font-size:.7rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase;flex-shrink:0; }
        .bl { background:#e50914;color:#fff; } .bf { background:rgba(120,60,220,.85);color:#fff; }
        .ld { width:6px;height:6px;border-radius:50%;background:#fff;animation:lp 1.4s ease-in-out infinite; }
        @keyframes lp { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.3;transform:scale(.65)} }
        .pm { max-width:1200px;margin:0 auto;padding:28px 24px 64px; }
        .cn { display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:14px; }
        .nb { display:flex;align-items:center;gap:8px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);border-radius:10px;color:#aaa;font-family:'DM Sans',sans-serif;font-size:.82rem;font-weight:600;padding:10px 16px;cursor:pointer;transition:all .2s;max-width:240px;overflow:hidden; }
        .nb:hover { background:rgba(229,9,20,.1);border-color:rgba(229,9,20,.3);color:#fff; }
        .nb:disabled { opacity:.2;cursor:not-allowed;pointer-events:none; }
        .nbl { white-space:nowrap;overflow:hidden;text-overflow:ellipsis; }
        .nc { font-size:.78rem;color:#444;font-weight:600;white-space:nowrap; }
        .vo { border-radius:12px;overflow:hidden;border:1px solid rgba(255,255,255,.06);box-shadow:0 24px 80px rgba(0,0,0,.8);background:#000;position:relative; }
        .vr { position:relative;padding-bottom:56.25%; }
        .vr iframe { position:absolute;inset:0;width:100%;height:100%;border:none; }
        .ov { position:absolute;inset:0;z-index:5;display:flex;align-items:center;justify-content:center;background:#0d0d12;transition:opacity .4s ease; }
        .ov.out { opacity:0;pointer-events:none; }
        .sp { width:52px;height:52px;border-radius:50%;border:3px solid rgba(255,255,255,.06);border-top-color:#e50914;animation:spin .8s linear infinite; }
        @keyframes spin { to { transform:rotate(360deg); } }
        .lt { margin-top:16px;font-size:.85rem;color:#555;letter-spacing:.04em; }
        .bi { width:72px;height:72px;background:rgba(255,160,0,.08);border:1px solid rgba(255,160,0,.2);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 18px; }
        .bt { font-size:1.1rem;font-weight:700;margin-bottom:8px;color:#f0f0f0; }
        .bm { font-size:.85rem;color:#666;margin-bottom:22px;max-width:320px;line-height:1.6; }
        .otb { display:inline-flex;align-items:center;gap:8px;background:#e50914;color:#fff;border:none;border-radius:10px;padding:12px 28px;font-family:'DM Sans',sans-serif;font-size:.9rem;font-weight:700;cursor:pointer;transition:background .2s,transform .15s;box-shadow:0 6px 20px rgba(229,9,20,.4); }
        .otb:hover { background:#c0070f;transform:translateY(-2px); }
        .oh { margin-top:12px;font-size:.72rem;color:#3a3a3a;word-break:break-all; }
        .ss { margin-top:14px;display:flex;align-items:center;gap:12px;flex-wrap:wrap; }
        .sl { font-size:.78rem;color:#555;font-weight:600;text-transform:uppercase;letter-spacing:.06em;white-space:nowrap; }
        .so { display:flex;gap:8px;flex-wrap:wrap; }
        .soo { padding:7px 18px;border-radius:8px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.04);color:#666;font-family:'DM Sans',sans-serif;font-size:.8rem;font-weight:600;cursor:pointer;transition:all .18s;white-space:nowrap; }
        .soo:hover { border-color:rgba(229,9,20,.4);color:#ccc;background:rgba(229,9,20,.06); }
        .soo.act { background:#e50914;border-color:#e50914;color:#fff;box-shadow:0 4px 12px rgba(229,9,20,.35); }
        .ip { margin-top:20px;background:#141418;border:1px solid rgba(255,255,255,.06);border-radius:12px;padding:22px 24px;display:flex;align-items:flex-start;gap:20px;flex-wrap:wrap; }
        .im { flex:1;min-width:0; }
        .it { font-family:'Bebas Neue',cursive;font-size:1.8rem;letter-spacing:.06em;color:#f0f0f0;line-height:1;margin-bottom:8px; }
        .id { font-size:.875rem;color:#777;line-height:1.6;margin-bottom:14px; }
        .mp { display:flex;flex-wrap:wrap;gap:8px; }
        .mpill { display:inline-flex;align-items:center;gap:4px;padding:4px 11px;border-radius:20px;font-size:.72rem;font-weight:600;letter-spacing:.04em;text-transform:uppercase; }
        .pc { background:rgba(229,9,20,.12);border:1px solid rgba(229,9,20,.2);color:#e55; }
        .pco { background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);color:#666; }
        .ptl { background:rgba(229,9,20,.15);border:1px solid rgba(229,9,20,.25);color:#ff5555; }
        .ptf { background:rgba(120,60,220,.15);border:1px solid rgba(120,60,220,.3);color:#a580f0; }
        .tb { margin-top:16px;background:rgba(229,9,20,.05);border:1px solid rgba(229,9,20,.12);border-radius:10px;padding:16px 20px;display:flex;align-items:center;gap:14px; }
        .ti { width:36px;height:36px;flex-shrink:0;background:rgba(229,9,20,.12);border-radius:8px;display:flex;align-items:center;justify-content:center; }
        .tt { font-size:.82rem;color:#666;line-height:1.5; }
        .tt strong { color:#aaa;font-weight:600; }
      `}</style>

      <div className="pr" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        <header className="ph">
          <div className="phi">
            <button className="bb" onClick={onBack}><ArrowLeft size={15} /><span>Volver</span></button>
            <div className="hi">
              <div className="hn">{channel.name}</div>
              <div className="hd">{channel.description}</div>
            </div>
            <div className={`hbg ${isLive ? 'bl' : 'bf'}`}>
              {isLive ? <><span className="ld" />En Vivo</> : <><Film size={11} />Película</>}
            </div>
          </div>
        </header>

        <main className="pm">
          {/* Channel nav */}
          <div className="cn">
            <button className="nb" disabled={!prevChannel} onClick={() => prevChannel && handleChannelChange(prevChannel)}>
              <ChevronLeft size={16} /><span className="nbl">{prevChannel?.name ?? 'Anterior'}</span>
            </button>
            <span className="nc">{currentIndex + 1} / {channels.length}</span>
            <button className="nb" disabled={!nextChannel} onClick={() => nextChannel && handleChannelChange(nextChannel)}>
              <span className="nbl">{nextChannel?.name ?? 'Siguiente'}</span><ChevronRight size={16} />
            </button>
          </div>

          {/* Video */}
          <div className="vo">
            <div className="vr">
              {/* Loading spinner overlay */}
              <div className={`ov ${!loading ? 'out' : ''}`}>
                <div style={{ textAlign: 'center' }}>
                  <div className="sp" />
                  <p className="lt">Cargando contenido…</p>
                </div>
              </div>

              {/* Blocked overlay */}
              {blocked && (
                <div className="ov">
                  <div style={{ textAlign: 'center', padding: '0 32px' }}>
                    <div className="bi"><AlertCircle size={30} color="#ffa000" /></div>
                    <p className="bt">Este canal no permite embedding</p>
                    <p className="bm">
                      El sitio bloquea la reproducción dentro de otras páginas.<br />
                      Podés verlo directamente en su sitio.
                    </p>
                    <button className="otb" onClick={openInTab}>
                      <ExternalLink size={16} />Abrir en nueva pestaña
                    </button>
                    <p className="oh">{currentUrl}</p>
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

          {/* Stream selector */}
          {hasOptions && (
            <div className="ss">
              <span className="sl">Servidores:</span>
              <div className="so">
                {streamOptions.map((opt, i) => (
                  <button key={i} className={`soo ${activeStream === i ? 'act' : ''}`} onClick={() => setActiveStream(i)}>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Info */}
          <div className="ip">
            <div className="im">
              <div className="it">{channel.name}</div>
              <p className="id">{channel.description}</p>
              <div className="mp">
                <span className="mpill pc">{channel.category}</span>
                <span className="mpill pco"><MapPin size={10} />{channel.country}</span>
                <span className={`mpill ${isLive ? 'ptl' : 'ptf'}`}>
                  {isLive ? <><span className="ld" style={{ background: '#ff5555' }} />En Vivo</> : <><Film size={10} />Película</>}
                </span>
              </div>
            </div>
          </div>

          <div className="tb">
            <div className="ti">{isLive ? <Tv size={16} color="#e50914" /> : <Film size={16} color="#e50914" />}</div>
            <p className="tt">
              Estás viendo <strong>{isLive ? 'televisión en vivo' : 'una película'}</strong>.
              Usá <strong>← →</strong> en PC · <strong>deslizá</strong> en tablet/móvil para cambiar de canal.
            </p>
          </div>
        </main>
      </div>
    </>
  );
}