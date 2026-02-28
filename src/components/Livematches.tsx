import { useState, useEffect, useCallback } from 'react';
import { Activity, Clock, ChevronRight, RefreshCw, Tv, Wifi } from 'lucide-react';

// ── ESPN Public API — no key needed ──────────────────────────────────────────
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

interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeLogo: string;
  awayLogo: string;
  homeScore: string;
  awayScore: string;
  status: 'live' | 'upcoming' | 'finished';
  clock: string;
  time: string;
  league: string;
  flag: string;
  channel: string;
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

    // Format local time
    let timeStr = '--:--';
    try {
      const d = new Date(e.date);
      timeStr = d.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
    } catch {}

    return {
      id:        e.id,
      homeTeam:  home?.team?.shortDisplayName ?? home?.team?.displayName ?? '?',
      awayTeam:  away?.team?.shortDisplayName ?? away?.team?.displayName ?? '?',
      homeLogo:  home?.team?.logo ?? '',
      awayLogo:  away?.team?.logo ?? '',
      homeScore: home?.score ?? '',
      awayScore: away?.score ?? '',
      status:    matchStatus,
      clock:     status?.displayClock ?? '',
      time:      timeStr,
      league:    league.name,
      flag:      league.flag,
      channel:   league.channel,
    };
  });
}

// ── Match Card ────────────────────────────────────────────────────────────────
function TeamLogo({ src, name }: { src: string; name: string }) {
  const [err, setErr] = useState(false);
  if (!src || err) return <span className="logo-fallback">{name[0]}</span>;
  return <img src={src} alt={name} className="team-logo" onError={() => setErr(true)} />;
}

function MatchCard({ match, onWatchClick }: { match: Match; onWatchClick: (m: Match) => void }) {
  const hasScore = match.homeScore !== '' && match.awayScore !== '';

  return (
    <div className={`match-card match-${match.status}`}>
      {/* Top */}
      <div className="match-top">
        <span className="match-league">{match.flag} {match.league}</span>
        {match.status === 'live' && (
          <span className="live-badge">
            <span className="live-dot-sm" />
            {match.clock || 'EN VIVO'}
          </span>
        )}
        {match.status === 'finished' && <span className="finished-badge">Final</span>}
        {match.status === 'upcoming' && (
          <span className="time-badge"><Clock size={10} />{match.time}</span>
        )}
      </div>

      {/* Teams */}
      <div className="match-body">
        <div className="match-team home">
          <span className="team-name">{match.homeTeam}</span>
          <TeamLogo src={match.homeLogo} name={match.homeTeam} />
          {hasScore && <span className={`score ${match.status === 'live' ? 'score-live' : ''}`}>{match.homeScore}</span>}
        </div>

        <div className="match-vs">
          {!hasScore ? <span className="vs-text">VS</span> : <span className="score-sep">—</span>}
        </div>

        <div className="match-team away">
          {hasScore && <span className={`score ${match.status === 'live' ? 'score-live' : ''}`}>{match.awayScore}</span>}
          <TeamLogo src={match.awayLogo} name={match.awayTeam} />
          <span className="team-name">{match.awayTeam}</span>
        </div>
      </div>

      {/* Watch */}
      {match.status !== 'finished' && (
        <button className="watch-btn" onClick={() => onWatchClick(match)}>
          <Tv size={11} />{match.channel}<ChevronRight size={11} />
        </button>
      )}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
interface LiveMatchesProps {
  onWatchChannel?: (channelName: string) => void;
}

export function LiveMatches({ onWatchChannel }: LiveMatchesProps) {
  const [matches,   setMatches]   = useState<Match[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(false);
  const [lastFetch, setLastFetch] = useState<Date | null>(null);
  const [filter,    setFilter]    = useState<'live' | 'all'>('all');

  const fetchMatches = useCallback(async () => {
    setLoading(true); setError(false);
    try {
      const all: Match[] = [];

      await Promise.all(
        LEAGUES.map(async (league) => {
          try {
            const res = await fetch(`${ESPN}/${league.slug}/scoreboard`, {
              signal: AbortSignal.timeout(8000),
            });
            if (!res.ok) return;
            const data = await res.json();
            if (data.events?.length) {
              all.push(...parseEvents(data.events, league));
            }
          } catch { /* skip league on error */ }
        })
      );

      // Sort: live → upcoming → finished, then by time
      all.sort((a, b) => {
        const order = { live: 0, upcoming: 1, finished: 2 };
        if (order[a.status] !== order[b.status]) return order[a.status] - order[b.status];
        return a.time.localeCompare(b.time);
      });

      setMatches(all);
      setLastFetch(new Date());
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMatches();
    const iv = setInterval(fetchMatches, 60_000);
    return () => clearInterval(iv);
  }, [fetchMatches]);

  const liveMatches = matches.filter(m => m.status === 'live');
  const displayed   = filter === 'live' ? liveMatches : matches;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Bebas+Neue&display=swap');

        .live-matches-root {
          font-family: 'DM Sans', sans-serif;
          background: #0f0f14;
          border-radius: 14px;
          border: 1px solid rgba(255,255,255,0.06);
          overflow: hidden;
          margin-bottom: 8px;
        }
        .lm-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 12px 16px;
          background: rgba(229,9,20,0.04);
          border-bottom: 1px solid rgba(255,255,255,0.05);
          flex-wrap: wrap; gap: 8px;
        }
        .lm-title {
          display: flex; align-items: center; gap: 7px;
          font-family: 'Bebas Neue', cursive;
          font-size: 1rem; letter-spacing: 0.1em; color: #f0f0f0;
        }
        .lm-title-dot {
          width: 7px; height: 7px; border-radius: 50%; background: #e50914;
          box-shadow: 0 0 8px rgba(229,9,20,0.8);
          animation: lmpulse 1.5s ease-in-out infinite;
        }
        @keyframes lmpulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(.7)} }
        .lm-actions { display: flex; align-items: center; gap: 6px; }
        .filter-pills { display: flex; gap: 4px; }
        .filter-pill {
          padding: 4px 10px; border-radius: 20px;
          border: 1px solid rgba(255,255,255,0.08);
          background: none; color: #555;
          font-family: 'DM Sans', sans-serif; font-size: 0.7rem; font-weight: 600;
          letter-spacing: 0.04em; text-transform: uppercase;
          cursor: pointer; transition: all 0.15s; white-space: nowrap;
        }
        .filter-pill:hover { color: #ccc; border-color: rgba(255,255,255,0.15); }
        .filter-pill.active { background: #e50914; border-color: #e50914; color: #fff; }
        .pill-count {
          display: inline-flex; align-items: center; justify-content: center;
          width: 15px; height: 15px; border-radius: 50%;
          background: rgba(255,255,255,0.2); font-size: 0.6rem; margin-left: 3px;
        }
        .refresh-btn {
          width: 28px; height: 28px; border-radius: 7px;
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
          color: #555; cursor: pointer;
          display: flex; align-items: center; justify-content: center; transition: all 0.2s;
        }
        .refresh-btn:hover { color: #ccc; }
        .refresh-btn.spinning svg { animation: lmspin 0.8s linear infinite; }
        @keyframes lmspin { to { transform: rotate(360deg); } }

        .lm-body {
          max-height: 400px; overflow-y: auto;
          scrollbar-width: thin; scrollbar-color: rgba(229,9,20,0.3) transparent;
        }
        .lm-body::-webkit-scrollbar { width: 3px; }
        .lm-body::-webkit-scrollbar-thumb { background: rgba(229,9,20,0.3); border-radius: 2px; }

        .match-card {
          padding: 10px 16px;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          transition: background 0.15s;
        }
        .match-card:last-child { border-bottom: none; }
        .match-card:hover { background: rgba(255,255,255,0.02); }
        .match-card.match-live { background: rgba(229,9,20,0.03); }
        .match-card.match-live:hover { background: rgba(229,9,20,0.05); }
        .match-card.match-finished { opacity: 0.5; }

        .match-top { display: flex; align-items: center; gap: 7px; margin-bottom: 7px; }
        .match-league {
          font-size: 0.65rem; color: #555; font-weight: 500;
          text-transform: uppercase; letter-spacing: 0.05em;
          flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .live-badge {
          display: flex; align-items: center; gap: 4px;
          background: rgba(229,9,20,0.15); border: 1px solid rgba(229,9,20,0.3);
          color: #ff4444; font-size: 0.62rem; font-weight: 700;
          padding: 2px 6px; border-radius: 4px; letter-spacing: 0.06em; white-space: nowrap;
        }
        .live-dot-sm {
          width: 5px; height: 5px; border-radius: 50%; background: #e50914;
          animation: lmpulse 1.4s ease-in-out infinite;
        }
        .finished-badge { font-size: 0.62rem; color: #444; font-weight: 600; }
        .time-badge { display: flex; align-items: center; gap: 3px; font-size: 0.65rem; color: #555; white-space: nowrap; }

        .match-body { display: flex; align-items: center; gap: 6px; margin-bottom: 7px; }
        .match-team { flex: 1; display: flex; align-items: center; gap: 6px; min-width: 0; }
        .match-team.home { justify-content: flex-end; }
        .match-team.away { justify-content: flex-start; }
        .team-name {
          font-size: 0.78rem; font-weight: 600; color: #d0d0d0;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 90px;
        }
        .team-logo { width: 22px; height: 22px; object-fit: contain; flex-shrink: 0; }
        .logo-fallback {
          width: 22px; height: 22px; border-radius: 50%;
          background: rgba(255,255,255,0.08); color: #666;
          font-size: 0.65rem; font-weight: 700;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .match-vs { flex-shrink: 0; padding: 0 4px; }
        .vs-text { font-size: 0.65rem; color: #333; font-weight: 700; }
        .score {
          font-family: 'Bebas Neue', cursive; font-size: 1.3rem;
          color: #666; letter-spacing: 0.05em; line-height: 1; flex-shrink: 0;
        }
        .score.score-live { color: #f0f0f0; }
        .score-sep { font-family: 'Bebas Neue', cursive; font-size: 1rem; color: #2a2a2a; }

        .watch-btn {
          display: flex; align-items: center; justify-content: center; gap: 4px; width: 100%;
          background: rgba(229,9,20,0.07); border: 1px solid rgba(229,9,20,0.14);
          border-radius: 6px; color: #cc3333;
          font-family: 'DM Sans', sans-serif; font-size: 0.68rem; font-weight: 600;
          padding: 4px 10px; cursor: pointer; transition: all 0.15s;
        }
        .watch-btn:hover { background: rgba(229,9,20,0.14); color: #ff5555; }

        .lm-state { padding: 36px 20px; display: flex; flex-direction: column; align-items: center; gap: 10px; }
        .lm-spinner {
          width: 26px; height: 26px; border: 2px solid rgba(229,9,20,0.15);
          border-top-color: #e50914; border-radius: 50%; animation: lmspin 0.8s linear infinite;
        }
        .lm-state p { font-size: 0.78rem; color: #444; }
        .retry-btn {
          background: rgba(229,9,20,0.1); border: 1px solid rgba(229,9,20,0.2);
          color: #e50914; border-radius: 6px; padding: 6px 14px;
          font-size: 0.75rem; font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif;
        }
        .lm-footer {
          padding: 6px 16px; border-top: 1px solid rgba(255,255,255,0.04);
          font-size: 0.62rem; color: #333; text-align: right;
        }
      `}</style>

      <div className="live-matches-root">
        {/* Header */}
        <div className="lm-header">
          <div className="lm-title">
            <span className="lm-title-dot" />
            <Activity size={13} color="#e50914" />
            Partidos Hoy
          </div>
          <div className="lm-actions">
            <div className="filter-pills">
              <button className={`filter-pill ${filter === 'live' ? 'active' : ''}`} onClick={() => setFilter('live')}>
                En Vivo {liveMatches.length > 0 && <span className="pill-count">{liveMatches.length}</span>}
              </button>
              <button className={`filter-pill ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
                Todos <span className="pill-count">{matches.length}</span>
              </button>
            </div>
            <button className={`refresh-btn ${loading ? 'spinning' : ''}`} onClick={fetchMatches} title="Actualizar">
              <RefreshCw size={12} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="lm-body">
          {loading ? (
            <div className="lm-state">
              <div className="lm-spinner" />
              <p>Cargando partidos…</p>
            </div>
          ) : error ? (
            <div className="lm-state">
              <Wifi size={28} color="#333" />
              <p>No se pudo conectar</p>
              <button className="retry-btn" onClick={fetchMatches}>Reintentar</button>
            </div>
          ) : displayed.length === 0 ? (
            <div className="lm-state">
              <Activity size={28} color="#2a2a2a" />
              <p>{filter === 'live' ? 'No hay partidos en vivo ahora' : 'No hay partidos programados hoy'}</p>
            </div>
          ) : (
            displayed.map(m => (
              <MatchCard
                key={m.id}
                match={m}
                onWatchClick={(match) => onWatchChannel?.(match.channel)}
              />
            ))
          )}
        </div>

        {lastFetch && !loading && (
          <div className="lm-footer">
            Actualizado: {lastFetch.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
            {' · '}Se actualiza cada 60s
          </div>
        )}
      </div>
    </>
  );
}