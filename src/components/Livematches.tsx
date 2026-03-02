import React, { useState, useEffect, useCallback } from 'react';
import { Activity, Clock, ChevronRight, RefreshCw, Tv, Wifi, ChevronDown, ChevronUp } from 'lucide-react';

const ESPN = 'https://site.api.espn.com/apis/site/v2/sports/soccer';

const LEAGUES = [
  { slug: 'arg.1',           name: 'Liga Profesional', flag: '🇦🇷', channel: 'ESPN Premium' },
  { slug: 'arg.copa',        name: 'Copa Argentina',    flag: '🇦🇷', channel: 'ESPN Premium' },
  { slug: 'uefa.champions',  name: 'Champions League',  flag: '🏆', channel: 'TNT Sports'   },
  { slug: 'uefa.europa',     name: 'Europa League',     flag: '🇪🇺', channel: 'ESPN'         },
  { slug: 'conmebol.libertadores', name: 'Libertadores', flag: '🌎', channel: 'ESPN'        },
  { slug: 'eng.1',           name: 'Premier League',    flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', channel: 'ESPN'    },
  { slug: 'esp.1',           name: 'La Liga',           flag: '🇪🇸', channel: 'ESPN 2'       },
  { slug: 'ger.1',           name: 'Bundesliga',        flag: '🇩🇪', channel: 'ESPN 2'       },
  { slug: 'ita.1',           name: 'Serie A',           flag: '🇮🇹', channel: 'ESPN 3'       },
  { slug: 'fra.1',           name: 'Ligue 1',           flag: '🇫🇷', channel: 'ESPN 3'       },
];

const INITIAL_VISIBLE = 2;

const W = (file: string) => `https://commons.wikimedia.org/wiki/Special:FilePath/${file}`;
const CHANNEL_LOGOS: Record<string, string> = {
  'ESPN':         W('ESPN_wordmark.svg'),
  'ESPN 2':       W('ESPN2_logo.svg'),
  'ESPN 3':       W('ESPN3_logo.svg'),
  'ESPN Premium': W('ESPN_Premium_logo.svg'),
  'TNT Sports':   W('TNT_Sports_2020_logo.svg'),
};

interface Match {
  id: string;
  homeTeam: string; awayTeam: string;
  homeLogo: string; awayLogo: string;
  homeScore: string; awayScore: string;
  status: 'live' | 'upcoming' | 'finished';
  clock: string; time: string;
  league: string; flag: string; channel: string;
}

function parseEvents(events: any[], league: typeof LEAGUES[0]): Match[] {
  return events.map((e: any) => {
    const comp   = e.competitions?.[0];
    const home   = comp?.competitors?.find((c: any) => c.homeAway === 'home');
    const away   = comp?.competitors?.find((c: any) => c.homeAway === 'away');
    const status = e.status?.type;

    let matchStatus: 'live' | 'upcoming' | 'finished' = 'upcoming';
    if (status?.completed) matchStatus = 'finished';
    else if (status?.state === 'in') matchStatus = 'live';

    let timeStr = '--:--';
    try {
      const d = new Date(e.date);
      timeStr = d.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
    } catch {}

    return {
      id: e.id,
      homeTeam:  home?.team?.shortDisplayName ?? home?.team?.displayName ?? '?',
      awayTeam:  away?.team?.shortDisplayName ?? away?.team?.displayName ?? '?',
      homeLogo:  home?.team?.logo ?? '',
      awayLogo:  away?.team?.logo ?? '',
      homeScore: home?.score ?? '',
      awayScore: away?.score ?? '',
      status:    matchStatus,
      clock:     status?.displayClock ?? '',
      time:      timeStr,
      league:    league.name, flag: league.flag, channel: league.channel,
    };
  });
}

function TeamLogo({ src, name }: { src: string; name: string }) {
  const [err, setErr] = useState(false);
  if (!src || err) return <span className="lm-logo-fb">{name[0]}</span>;
  return <img src={src} alt={name} className="lm-team-logo" onError={() => setErr(true)} />;
}

function MatchCard({ match, onWatchClick }: { match: Match; onWatchClick: (m: Match) => void }) {
  const hasScore = match.homeScore !== '' && match.awayScore !== '';
  return (
    <div className={`lm-card lm-card--${match.status}`}>
      <div className="lm-card-top">
        <span className="lm-league">{match.flag} {match.league}</span>
      </div>

      <div className="lm-status-row">
        {match.status === 'live' && (
          <span className="lm-live-lg"><span className="lm-dot-sm" />{match.clock ? match.clock : 'EN VIVO'}</span>
        )}
        {match.status === 'finished' && <span className="lm-fin-lg">⏹ Partido finalizado</span>}
        {match.status === 'upcoming' && (
          <span className="lm-upco-lg"><Clock size={10} />Comienza a las {match.time}</span>
        )}
      </div>

      <div className="lm-body">
        <div className="lm-team lm-team--home">
          <span className="lm-tname">{match.homeTeam}</span>
          <TeamLogo src={match.homeLogo} name={match.homeTeam} />
          {hasScore && <span className={`lm-score ${match.status === 'live' ? 'lm-score--live' : ''}`}>{match.homeScore}</span>}
        </div>
        <div className="lm-vs">
          {!hasScore ? <span className="lm-vs-txt">VS</span> : <span className="lm-sep">—</span>}
        </div>
        <div className="lm-team lm-team--away">
          {hasScore && <span className={`lm-score ${match.status === 'live' ? 'lm-score--live' : ''}`}>{match.awayScore}</span>}
          <TeamLogo src={match.awayLogo} name={match.awayTeam} />
          <span className="lm-tname">{match.awayTeam}</span>
        </div>
      </div>

      {match.status !== 'finished' && (
        <button className="lm-watch-btn" onClick={() => onWatchClick(match)}>
          <Tv size={10} />
          {CHANNEL_LOGOS[match.channel]
            ? <img src={CHANNEL_LOGOS[match.channel]} alt={match.channel} className="lm-ch-logo" />
            : <span>{match.channel}</span>}
          <ChevronRight size={10} />
        </button>
      )}
    </div>
  );
}

interface LiveMatchesProps {
  onWatchChannel?: (channelName: string) => void;
}

export function LiveMatches({ onWatchChannel }: LiveMatchesProps) {
  const [matches,   setMatches]   = useState<Match[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(false);
  const [lastFetch, setLastFetch] = useState<Date | null>(null);
  const [filter,    setFilter]    = useState<'live' | 'all'>('all');
  const [expanded,  setExpanded]  = useState(false);

  const fetchMatches = useCallback(async () => {
    setLoading(true); setError(false);
    try {
      const all: Match[] = [];
      await Promise.all(LEAGUES.map(async (league) => {
        try {
          const res = await fetch(`${ESPN}/${league.slug}/scoreboard`, { signal: AbortSignal.timeout(8000) });
          if (!res.ok) return;
          const data = await res.json();
          if (data.events?.length) all.push(...parseEvents(data.events, league));
        } catch {}
      }));
      all.sort((a, b) => {
        const order = { live: 0, upcoming: 1, finished: 2 };
        if (order[a.status] !== order[b.status]) return order[a.status] - order[b.status];
        return a.time.localeCompare(b.time);
      });
      setMatches(all);
      setLastFetch(new Date());
    } catch { setError(true); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    fetchMatches();
    const iv = setInterval(fetchMatches, 60_000);
    return () => clearInterval(iv);
  }, [fetchMatches]);

  useEffect(() => { setExpanded(false); }, [filter]);

  const liveMatches = matches.filter(m => m.status === 'live');
  const displayed   = filter === 'live' ? liveMatches : matches;
  const visibleMatches = expanded ? displayed : displayed.slice(0, INITIAL_VISIBLE);
  const hiddenCount    = displayed.length - INITIAL_VISIBLE;
  const hasMore        = displayed.length > INITIAL_VISIBLE;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Bebas+Neue&display=swap');

        .lm-root {
          font-family: 'Rajdhani', sans-serif;
          background: #0a0a12;
          border-radius: 10px;
          border: 1px solid rgba(0,200,255,0.1);
          overflow: hidden;
          margin-bottom: 8px;
          position: relative;
        }
        .lm-root::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(0,200,255,0.5), transparent);
        }

        .lm-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 11px 14px;
          background: rgba(0,200,255,0.03);
          border-bottom: 1px solid rgba(0,200,255,0.07);
          flex-wrap: wrap; gap: 8px;
        }
        .lm-title {
          display: flex; align-items: center; gap: 6px;
          font-family: 'Bebas Neue', cursive;
          font-size: 0.95rem; letter-spacing: 0.12em; color: #e8f4ff;
        }
        .lm-title-dot {
          width: 6px; height: 6px; border-radius: 50%; background: #00c8ff;
          box-shadow: 0 0 8px rgba(0,200,255,0.8);
          animation: lm-pulse 1.5s ease-in-out infinite;
        }
        @keyframes lm-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.65)} }

        .lm-actions { display: flex; align-items: center; gap: 6px; }
        .lm-pills { display: flex; gap: 4px; }
        .lm-pill {
          padding: 3px 9px; border-radius: 3px;
          border: 1px solid rgba(0,200,255,0.15);
          background: none; color: rgba(0,200,255,0.5);
          font-family: 'Rajdhani', sans-serif; font-size: 0.68rem; font-weight: 700;
          letter-spacing: 0.08em; text-transform: uppercase;
          cursor: pointer; transition: all 0.15s; white-space: nowrap;
        }
        .lm-pill:hover { color: rgba(0,200,255,0.8); border-color: rgba(0,200,255,0.35); }
        .lm-pill.active {
          background: rgba(0,200,255,0.12);
          border-color: rgba(0,200,255,0.45);
          color: #00c8ff;
        }
        .lm-pill-cnt {
          display: inline-flex; align-items: center; justify-content: center;
          width: 14px; height: 14px; border-radius: 50%;
          background: rgba(0,200,255,0.2); font-size: 0.58rem; margin-left: 3px;
        }

        .lm-expand-btn {
          display: flex; align-items: center; gap: 3px;
          padding: 3px 8px; border-radius: 3px;
          border: 1px solid rgba(0,200,255,0.15);
          background: none; color: rgba(0,200,255,0.5);
          font-family: 'Rajdhani', sans-serif; font-size: 0.68rem; font-weight: 700;
          letter-spacing: 0.06em; text-transform: uppercase;
          cursor: pointer; transition: all 0.15s; white-space: nowrap;
        }
        .lm-expand-btn:hover { color: rgba(0,200,255,0.8); border-color: rgba(0,200,255,0.35); }

        .lm-refresh-btn {
          width: 26px; height: 26px; border-radius: 5px;
          background: rgba(0,200,255,0.04); border: 1px solid rgba(0,200,255,0.15);
          color: rgba(0,200,255,0.5); cursor: pointer;
          display: flex; align-items: center; justify-content: center; transition: all 0.2s;
        }
        .lm-refresh-btn:hover { color: #00c8ff; border-color: rgba(0,200,255,0.4); }
        .lm-refresh-btn.spinning svg { animation: lm-spin 0.8s linear infinite; }
        @keyframes lm-spin { to { transform: rotate(360deg); } }

        .lm-card {
          padding: 9px 14px;
          border-bottom: 1px solid rgba(0,200,255,0.05);
          transition: background 0.15s;
        }
        .lm-card:last-child { border-bottom: none; }
        .lm-card:hover { background: rgba(0,200,255,0.02); }
        .lm-card--live { background: rgba(0,200,255,0.025); }
        .lm-card--live:hover { background: rgba(0,200,255,0.04); }
        .lm-card--finished { opacity: 0.5; }

        .lm-card-top { display: flex; align-items: center; gap: 7px; margin-bottom: 6px; }
        .lm-league {
          font-size: 0.63rem; color: rgba(0,200,255,0.55); font-weight: 600;
          text-transform: uppercase; letter-spacing: 0.06em;
          flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }

        .lm-status-row { display: flex; justify-content: center; margin-bottom: 7px; }
        .lm-live-lg {
          display: inline-flex; align-items: center; gap: 5px;
          background: rgba(0,200,255,0.08); border: 1px solid rgba(0,200,255,0.3);
          color: #00c8ff; font-size: 0.68rem; font-weight: 700;
          padding: 2px 9px; border-radius: 3px; letter-spacing: 0.1em; text-transform: uppercase;
        }
        .lm-dot-sm {
          width: 5px; height: 5px; border-radius: 50%; background: #00c8ff;
          box-shadow: 0 0 6px #00c8ff; animation: lm-pulse 1.4s ease-in-out infinite;
        }
        .lm-fin-lg { font-size: 0.65rem; color: #4a6a7a; font-weight: 600; letter-spacing: 0.05em; }
        .lm-upco-lg {
          display: inline-flex; align-items: center; gap: 4px;
          font-size: 0.65rem; color: rgba(0,200,255,0.55); font-weight: 500;
        }

        .lm-body { display: flex; align-items: center; gap: 6px; margin-bottom: 7px; }
        .lm-team { flex: 1; display: flex; align-items: center; gap: 5px; min-width: 0; }
        .lm-team--home { justify-content: flex-end; }
        .lm-team--away { justify-content: flex-start; }
        .lm-tname {
          font-size: 0.76rem; font-weight: 600; color: #90b0c8;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 85px;
        }
        .lm-team-logo { width: 20px; height: 20px; object-fit: contain; flex-shrink: 0; }
        .lm-logo-fb {
          width: 20px; height: 20px; border-radius: 50%;
          background: rgba(0,200,255,0.06); color: rgba(0,200,255,0.5);
          font-size: 0.62rem; font-weight: 700;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .lm-vs { flex-shrink: 0; padding: 0 4px; }
        .lm-vs-txt { font-size: 0.62rem; color: #3a5a6a; font-weight: 700; }
        .lm-score {
          font-family: 'Bebas Neue', cursive; font-size: 1.25rem;
          color: #3a5a6a; letter-spacing: 0.05em; line-height: 1; flex-shrink: 0;
        }
        .lm-score--live { color: #e8f4ff; text-shadow: 0 0 10px rgba(0,200,255,0.3); }
        .lm-sep { font-family: 'Bebas Neue', cursive; font-size: 1rem; color: #2a4a5a; }

        .lm-watch-btn {
          display: flex; align-items: center; justify-content: center; gap: 4px; width: 100%;
          background: rgba(0,200,255,0.05); border: 1px solid rgba(0,200,255,0.15);
          border-radius: 4px; color: rgba(0,200,255,0.6);
          font-family: 'Rajdhani', sans-serif; font-size: 0.67rem; font-weight: 700;
          letter-spacing: 0.06em; text-transform: uppercase;
          padding: 4px 10px; cursor: pointer; transition: all 0.15s;
        }
        .lm-watch-btn:hover {
          background: rgba(0,200,255,0.1);
          border-color: rgba(0,200,255,0.35);
          color: #00c8ff;
        }
        .lm-ch-logo {
          height: 14px; width: auto; max-width: 68px;
          object-fit: contain; opacity: 0.8; transition: opacity 0.15s;
        }
        .lm-watch-btn:hover .lm-ch-logo { opacity: 1; }

        .lm-extra { overflow: hidden; max-height: 0; transition: max-height 0.35s cubic-bezier(0.4,0,0.2,1); }
        .lm-extra.open { max-height: 2000px; transition: max-height 0.5s cubic-bezier(0.4,0,0.2,1); }

        .lm-state {
          padding: 32px 20px; display: flex; flex-direction: column; align-items: center; gap: 10px;
        }
        .lm-spinner {
          width: 24px; height: 24px; border-radius: 50%;
          border: 2px solid rgba(0,200,255,0.1); border-top-color: #00c8ff;
          animation: lm-spin 0.8s linear infinite;
        }
        .lm-state p { font-size: 0.76rem; color: rgba(0,200,255,0.45); font-weight: 500; }
        .lm-retry-btn {
          background: rgba(0,200,255,0.08); border: 1px solid rgba(0,200,255,0.2);
          color: rgba(0,200,255,0.7); border-radius: 5px; padding: 5px 14px;
          font-size: 0.75rem; font-weight: 700; cursor: pointer;
          font-family: 'Rajdhani', sans-serif; letter-spacing: 0.06em;
        }

        .lm-footer {
          padding: 6px 14px; border-top: 1px solid rgba(0,200,255,0.05);
          font-size: 0.6rem; color: rgba(0,200,255,0.35); text-align: right;
          font-family: 'Rajdhani', sans-serif; font-weight: 500;
        }
      `}</style>

      <div className="lm-root">
        <div className="lm-header">
          <div className="lm-title">
            <span className="lm-title-dot" />
            <Activity size={12} color="#00c8ff" />
            Partidos Hoy
          </div>
          <div className="lm-actions">
            <div className="lm-pills">
              <button className={`lm-pill ${filter === 'live' ? 'active' : ''}`} onClick={() => setFilter('live')}>
                En Vivo {liveMatches.length > 0 && <span className="lm-pill-cnt">{liveMatches.length}</span>}
              </button>
              <button className={`lm-pill ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
                Todos <span className="lm-pill-cnt">{matches.length}</span>
              </button>
            </div>
            {hasMore && (
              <button className="lm-expand-btn" onClick={() => setExpanded(p => !p)}>
                {expanded ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
                <span>{expanded ? 'Menos' : `+${hiddenCount}`}</span>
              </button>
            )}
            <button className={`lm-refresh-btn ${loading ? 'spinning' : ''}`} onClick={fetchMatches} title="Actualizar">
              <RefreshCw size={11} />
            </button>
          </div>
        </div>

        <div>
          {loading ? (
            <div className="lm-state"><div className="lm-spinner" /><p>Cargando partidos…</p></div>
          ) : error ? (
            <div className="lm-state">
              <Wifi size={24} color="#2a4a5a" />
              <p>No se pudo conectar</p>
              <button className="lm-retry-btn" onClick={fetchMatches}>Reintentar</button>
            </div>
          ) : displayed.length === 0 ? (
            <div className="lm-state">
              <Activity size={24} color="#2a4a5a" />
              <p>{filter === 'live' ? 'No hay partidos en vivo' : 'No hay partidos hoy'}</p>
            </div>
          ) : (
            <>
              {visibleMatches.slice(0, INITIAL_VISIBLE).map(m => (
                <MatchCard key={m.id} match={m} onWatchClick={(match) => onWatchChannel?.(match.channel)} />
              ))}
              {hasMore && (
                <div className={`lm-extra ${expanded ? 'open' : ''}`}>
                  {displayed.slice(INITIAL_VISIBLE).map(m => (
                    <MatchCard key={m.id} match={m} onWatchClick={(match) => onWatchChannel?.(match.channel)} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {lastFetch && !loading && (
          <div className="lm-footer">
            Actualizado: {lastFetch.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })} · cada 60s
          </div>
        )}
      </div>
    </>
  );
}

export function AppLayout({ children, onWatchChannel }: { children: React.ReactNode; onWatchChannel?: (channelName: string) => void }) {
  return (
    <>
      <style>{`
        .tp-app-layout {
          display: flex; align-items: flex-start; gap: 16px; width: 100%;
        }
        .tp-app-main { flex: 1; min-width: 0; }
        .tp-app-sidebar {
          width: 276px; flex-shrink: 0;
          position: sticky; top: 12px;
        }
        @media (max-width: 820px) {
          .tp-app-layout { flex-direction: column; }
          .tp-app-sidebar { width: 100%; position: static; }
        }
      `}</style>
      <div className="tp-app-layout">
        <div className="tp-app-main">{children}</div>
        <div className="tp-app-sidebar">
          <LiveMatches onWatchChannel={onWatchChannel} />
        </div>
      </div>
    </>
  );
}