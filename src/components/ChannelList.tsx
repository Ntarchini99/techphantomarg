import { useState, useMemo, useEffect } from 'react';
import { Channel, FilterOptions } from '../types';
import { ChannelCard } from './ChannelCard';
import { Search, SlidersHorizontal, X, ChevronDown, ChevronLeft, ChevronRight, Film, Star } from 'lucide-react';
import { categories, countries } from '../data/channels';
import { AppLayout } from './Livematches';
import { Footer } from './Footer';
import { getFavoriteIds } from './VideoPlayer';

interface ChannelListProps {
  channels: Channel[];
  onChannelSelect: (channel: Channel) => void;
  onMoviesClick: () => void;
}

const CHANNELS_PER_PAGE = 12;

const PRIORITY_CHANNELS = [
  'espn premium', 'tnt sport', 'tyc sport', 'directv sport',
  'fox sport', 'a24', 'c5n', 'espn', 'cnn', 'telefe', 'canal 13', 'america tv',
];

function getPriorityScore(channelName: string): number {
  const name = channelName.toLowerCase();
  const idx = PRIORITY_CHANNELS.findIndex(p => name.includes(p));
  return idx === -1 ? PRIORITY_CHANNELS.length : idx;
}

export function sortChannels(channels: Channel[]): Channel[] {
  return [...channels].sort((a, b) => {
    const pa = getPriorityScore(a.name);
    const pb = getPriorityScore(b.name);
    if (pa !== pb) return pa - pb;
    return a.name.localeCompare(b.name);
  });
}

export function ChannelList({ channels, onChannelSelect, onMoviesClick }: ChannelListProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    category: 'Todas',
    country: 'Todos',
    search: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFavorites, setShowFavorites] = useState(false);

  const favoriteIds = useMemo(() => getFavoriteIds(), [showFavorites]);

  const filteredChannels = useMemo(() => {
    const filtered = channels.filter(channel => {
      if (showFavorites) return favoriteIds.includes(channel.id);
      const matchesCategory = filters.category === 'Todas' || channel.category === filters.category;
      const matchesCountry  = filters.country === 'Todos'  || channel.country === filters.country;
      const matchesSearch   =
        channel.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        channel.description.toLowerCase().includes(filters.search.toLowerCase());
      return matchesCategory && matchesCountry && matchesSearch;
    });
    return filtered.sort((a, b) => {
      const pa = getPriorityScore(a.name);
      const pb = getPriorityScore(b.name);
      if (pa !== pb) return pa - pb;
      return a.name.localeCompare(b.name);
    });
  }, [channels, filters, showFavorites, favoriteIds]);

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    setCurrentPage(1);
    setShowFavorites(false);
  };

  const handleToggleFavorites = () => {
    setShowFavorites(v => !v);
    setCurrentPage(1);
  };

  const totalPages        = Math.ceil(filteredChannels.length / CHANNELS_PER_PAGE);
  const paginatedChannels = filteredChannels.slice(
    (currentPage - 1) * CHANNELS_PER_PAGE,
    currentPage * CHANNELS_PER_PAGE
  );

  const hasActiveFilters = filters.category !== 'Todas' || filters.country !== 'Todos' || filters.search !== '';

  const handleWatchChannel = (channelName: string) => {
    const ch = channels.find(c =>
      c.name.toLowerCase().includes(channelName.toLowerCase().split(' ')[0])
    );
    if (ch) onChannelSelect(ch);
  };

  const getPageNumbers = () => {
    const pages: (number | '...')[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div style={{ minHeight: '100vh', background: '#060608', fontFamily: "'Rajdhani', 'Helvetica Neue', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;400;500;600;700&family=Bebas+Neue&display=swap');

        .tp-root { position: relative; }
        .tp-root::before {
          content: '';
          position: fixed; inset: 0;
          background-image:
            linear-gradient(rgba(0,200,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,200,255,0.025) 1px, transparent 1px);
          background-size: 48px 48px;
          mask-image: radial-gradient(ellipse 100% 80% at 50% 0%, black 0%, transparent 80%);
          pointer-events: none; z-index: 0;
          animation: tp-bgpan 20s linear infinite;
        }
        @keyframes tp-bgpan {
          0%   { background-position: 0 0; }
          100% { background-position: 48px 48px; }
        }

        .tp-header {
          background: linear-gradient(180deg, rgba(6,6,8,0.98) 0%, rgba(6,6,8,0.88) 100%);
          backdrop-filter: blur(24px);
          border-bottom: 1px solid rgba(0,200,255,0.12);
          position: sticky; top: 0; z-index: 50;
        }
        .tp-header::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(0,200,255,0.6) 30%, rgba(0,200,255,0.6) 70%, transparent);
        }

        .tp-logo-img {
          width: 34px; height: 34px; border-radius: 50%; object-fit: cover;
          border: 1px solid rgba(0,200,255,0.4); box-shadow: 0 0 12px rgba(0,200,255,0.25);
        }
        .tp-logo-text {
          font-family: 'Bebas Neue', cursive; font-size: 1.9rem;
          letter-spacing: 0.12em; color: #e8f4ff; line-height: 1;
          text-shadow: 0 0 20px rgba(0,200,255,0.35);
        }
        .tp-logo-text .tp-accent { color: #00c8ff; }

        .tp-movies-btn {
          display: flex; align-items: center; gap: 7px;
          background: rgba(0,200,255,0.06);
          border: 1px solid rgba(0,200,255,0.18);
          border-radius: 7px; color: rgba(0,200,255,0.75);
          font-family: 'Rajdhani', sans-serif; font-size: 0.85rem; font-weight: 700;
          letter-spacing: 0.06em; padding: 8px 14px; cursor: pointer; flex-shrink: 0;
          transition: all 0.2s; white-space: nowrap;
        }
        .tp-movies-btn:hover {
          background: rgba(0,200,255,0.12); border-color: rgba(0,200,255,0.45); color: #00c8ff;
          box-shadow: 0 0 16px rgba(0,200,255,0.12);
        }
        .tp-movies-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: #00c8ff; box-shadow: 0 0 6px #00c8ff;
          animation: tp-mdot 2s ease-in-out infinite;
        }
        @keyframes tp-mdot { 0%,100%{opacity:1} 50%{opacity:0.3} }

        /* ── QR button en header ── */
        .tp-qr-btn {
          display: flex; align-items: center; gap: 7px;
          background: rgba(0,200,255,0.04);
          border: 1px solid rgba(0,200,255,0.14);
          border-radius: 7px; color: rgba(0,200,255,0.6);
          font-family: 'Rajdhani', sans-serif; font-size: 0.85rem; font-weight: 700;
          letter-spacing: 0.06em; padding: 8px 13px; cursor: pointer; flex-shrink: 0;
          transition: all 0.2s; white-space: nowrap;
        }
        .tp-qr-btn:hover {
          background: rgba(0,200,255,0.1);
          border-color: rgba(0,200,255,0.4);
          color: #00c8ff;
          box-shadow: 0 0 14px rgba(0,200,255,0.1);
        }
        .tp-qr-icon { font-size: 0.95rem; line-height: 1; }

        /* ── QR modal overlay ── */
        .tp-qr-overlay {
          position: fixed; inset: 0; z-index: 200;
          background: rgba(0,0,0,0.88);
          backdrop-filter: blur(12px);
          display: flex; align-items: center; justify-content: center;
          padding: 20px;
          animation: tp-qr-fi 0.18s ease;
        }
        @keyframes tp-qr-fi { from{opacity:0} to{opacity:1} }

        /* ── QR card ── */
        .tp-qr-card {
          background: #0b0b14;
          border: 1px solid rgba(0,200,255,0.22);
          border-radius: 16px;
          padding: 24px 22px 20px;
          display: flex; flex-direction: column;
          align-items: center; gap: 14px;
          position: relative;
          width: 280px;
          font-family: 'Rajdhani', sans-serif;
          box-shadow: 0 24px 80px rgba(0,0,0,0.8), 0 0 40px rgba(0,200,255,0.07);
          animation: tp-qr-su 0.26s cubic-bezier(0.34,1.56,0.64,1);
        }
        @keyframes tp-qr-su { from{opacity:0;transform:scale(0.9) translateY(12px)} to{opacity:1;transform:scale(1) translateY(0)} }
        .tp-qr-card::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 1px;
          border-radius: 16px 16px 0 0;
          background: linear-gradient(90deg, transparent, rgba(0,200,255,0.65), transparent);
        }
        .tp-qr-close {
          position: absolute; top: 10px; right: 10px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 50%; width: 28px; height: 28px;
          display: flex; align-items: center; justify-content: center;
          color: #4a6a7a; cursor: pointer; font-size: 0.8rem;
          transition: all 0.2s; line-height: 1;
        }
        .tp-qr-close:hover { background: rgba(0,200,255,0.1); color: #00c8ff; border-color: rgba(0,200,255,0.3); }

        .tp-qr-title {
          font-family: 'Bebas Neue', cursive;
          font-size: 1.1rem; letter-spacing: 0.13em;
          color: #e8f4ff; text-align: center;
        }
        .tp-qr-title span { color: #00c8ff; }
        .tp-qr-sub {
          font-size: 0.68rem; color: #3a5a6a;
          letter-spacing: 0.08em; text-transform: uppercase;
          font-weight: 600; margin-top: -10px;
        }

        .tp-qr-frame {
          position: relative; padding: 10px;
          background: #060608;
          border: 1px solid rgba(0,200,255,0.14);
          border-radius: 10px;
          box-shadow: 0 0 22px rgba(0,200,255,0.07), inset 0 0 18px rgba(0,0,0,0.5);
        }
        .tp-qr-corner { position: absolute; width: 14px; height: 14px; }
        .tp-qr-c-tl { top: 5px; left: 5px; border-top: 2px solid #00c8ff; border-left: 2px solid #00c8ff; border-radius: 2px 0 0 0; }
        .tp-qr-c-tr { top: 5px; right: 5px; border-top: 2px solid #00c8ff; border-right: 2px solid #00c8ff; border-radius: 0 2px 0 0; }
        .tp-qr-c-bl { bottom: 5px; left: 5px; border-bottom: 2px solid #00c8ff; border-left: 2px solid #00c8ff; border-radius: 0 0 0 2px; }
        .tp-qr-c-br { bottom: 5px; right: 5px; border-bottom: 2px solid #00c8ff; border-right: 2px solid #00c8ff; border-radius: 0 0 2px 0; }

        .tp-qr-img { display: block; width: 160px; height: 160px; border-radius: 4px; opacity:0; transition: opacity 0.4s; }
        .tp-qr-img.rdy { opacity: 1; }
        .tp-qr-shimmer { position: absolute; inset: 10px; background: linear-gradient(90deg,#0b0b14 25%,#131320 50%,#0b0b14 75%); background-size: 200% 100%; animation: tp-qrsh 1.4s infinite; border-radius: 4px; }
        .tp-qr-shimmer.done { display: none; }
        @keyframes tp-qrsh { to { background-position: -200% 0; } }

        .tp-qr-hint {
          display: flex; align-items: center; gap: 7px;
          font-size: 0.74rem; color: #4a6a7a; font-weight: 600;
        }
        .tp-qr-hint-emoji { animation: tp-bounce 2s ease-in-out infinite; display: inline-block; }
        @keyframes tp-bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-3px)} }

        .tp-qr-divider { width: 100%; height: 1px; background: rgba(0,200,255,0.07); }

        .tp-qr-stats { display: flex; gap: 12px; align-items: center; }
        .tp-qr-stat { text-align: center; }
        .tp-qr-stat-n { font-family: 'Bebas Neue', cursive; font-size: 1.3rem; letter-spacing: 0.06em; color: #00c8ff; line-height:1; text-shadow: 0 0 10px rgba(0,200,255,0.35); }
        .tp-qr-stat-l { font-size: 0.57rem; color: #2a3a4a; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; }
        .tp-qr-stat-sep { width: 1px; height: 28px; background: rgba(0,200,255,0.08); }

        .tp-qr-url-row { display: flex; align-items: center; gap: 8px; width: 100%; }
        .tp-qr-url { flex: 1; font-size: 0.62rem; color: rgba(0,200,255,0.4); font-weight: 600; letter-spacing: 0.03em; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .tp-qr-copy {
          flex-shrink: 0;
          background: rgba(0,200,255,0.06); border: 1px solid rgba(0,200,255,0.18);
          border-radius: 5px; color: rgba(0,200,255,0.6);
          font-family: 'Rajdhani', sans-serif; font-size: 0.68rem; font-weight: 700;
          letter-spacing: 0.07em; text-transform: uppercase;
          padding: 5px 10px; cursor: pointer; transition: all 0.2s; white-space: nowrap;
        }
        .tp-qr-copy:hover { background: rgba(0,200,255,0.12); border-color: rgba(0,200,255,0.4); color: #00c8ff; }
        .tp-qr-copy.ok { background: rgba(0,200,100,0.1); border-color: rgba(0,200,100,0.4); color: #00e87a; }

        .tp-search-wrap { position: relative; }
        .tp-search-input {
          width: 100%;
          background: rgba(0,200,255,0.04); border: 1px solid rgba(0,200,255,0.12);
          border-radius: 8px; color: #e8f4ff;
          font-family: 'Rajdhani', sans-serif; font-size: 0.95rem; font-weight: 500;
          padding: 11px 44px 11px 42px; outline: none; transition: all 0.25s;
        }
        .tp-search-input::placeholder { color: #2a3a4a; }
        .tp-search-input:focus {
          border-color: rgba(0,200,255,0.4); background: rgba(0,200,255,0.06);
          box-shadow: 0 0 0 3px rgba(0,200,255,0.07), 0 0 20px rgba(0,200,255,0.06);
        }
        .tp-filter-btn {
          display: flex; align-items: center; gap: 6px;
          background: rgba(0,200,255,0.05); border: 1px solid rgba(0,200,255,0.12);
          border-radius: 8px; color: #4a7a9a;
          font-family: 'Rajdhani', sans-serif; font-size: 0.9rem; font-weight: 600;
          letter-spacing: 0.05em; padding: 10px 16px; cursor: pointer; white-space: nowrap;
          transition: all 0.2s;
        }
        .tp-filter-btn:hover, .tp-filter-btn.active {
          border-color: rgba(0,200,255,0.4); color: #00c8ff;
          background: rgba(0,200,255,0.08); box-shadow: 0 0 12px rgba(0,200,255,0.08);
        }
        .tp-filter-dot { width: 6px; height: 6px; border-radius: 50%; background: #00c8ff; box-shadow: 0 0 6px #00c8ff; }
        .tp-pill-bar { display: flex; gap: 7px; overflow-x: auto; scrollbar-width: none; padding: 2px 0; align-items: center; }
        .tp-pill-bar::-webkit-scrollbar { display: none; }
        .tp-pill {
          flex-shrink: 0; padding: 5px 13px; border-radius: 3px;
          border: 1px solid rgba(0,200,255,0.08); background: rgba(0,200,255,0.02);
          color: #3a5a6a; font-size: 0.75rem; font-weight: 600;
          font-family: 'Rajdhani', sans-serif; letter-spacing: 0.08em;
          cursor: pointer; transition: all 0.18s; white-space: nowrap; text-transform: uppercase;
        }
        .tp-pill:hover { border-color: rgba(0,200,255,0.28); color: #80c0d8; background: rgba(0,200,255,0.05); }
        .tp-pill.active { background: rgba(0,200,255,0.1); border-color: rgba(0,200,255,0.45); color: #00c8ff; font-weight: 700; box-shadow: 0 0 10px rgba(0,200,255,0.1), inset 0 0 6px rgba(0,200,255,0.04); }
        .tp-pill-fav {
          flex-shrink: 0; display: flex; align-items: center; gap: 5px;
          padding: 5px 13px; border-radius: 3px;
          border: 1px solid rgba(255,200,0,0.15); background: rgba(255,200,0,0.03);
          color: #6a5a2a; font-size: 0.75rem; font-weight: 700;
          font-family: 'Rajdhani', sans-serif; letter-spacing: 0.08em;
          cursor: pointer; transition: all 0.18s; white-space: nowrap; text-transform: uppercase;
        }
        .tp-pill-fav:hover { border-color: rgba(255,200,0,0.35); color: #ffc800; background: rgba(255,200,0,0.06); }
        .tp-pill-fav.active { background: rgba(255,200,0,0.1); border-color: rgba(255,200,0,0.5); color: #ffc800; box-shadow: 0 0 10px rgba(255,200,0,0.08); }
        .tp-pill-fav-count { background: rgba(255,200,0,0.18); border-radius: 2px; padding: 0 5px; font-size: 0.68rem; line-height: 1.5; }
        .tp-pill-sep { width: 1px; height: 16px; background: rgba(0,200,255,0.1); flex-shrink: 0; }
        .tp-filter-drawer { overflow: hidden; transition: max-height 0.35s cubic-bezier(0.4,0,0.2,1), opacity 0.25s; }
        .tp-filter-drawer.open  { max-height: 200px; opacity: 1; }
        .tp-filter-drawer.closed{ max-height: 0;     opacity: 0; }
        .tp-styled-select { appearance: none; background: rgba(0,200,255,0.04); border: 1px solid rgba(0,200,255,0.12); border-radius: 8px; color: #e8f4ff; font-family: 'Rajdhani', sans-serif; font-size: 0.9rem; font-weight: 500; padding: 10px 36px 10px 14px; cursor: pointer; outline: none; width: 100%; transition: border-color 0.2s, background 0.2s; }
        .tp-styled-select:hover, .tp-styled-select:focus { border-color: rgba(0,200,255,0.35); background: rgba(0,200,255,0.07); }
        .tp-styled-select option { background: #0d0d14; color: #e8f4ff; }
        .tp-select-wrap { position: relative; }
        .tp-select-wrap svg { position: absolute; right: 10px; top: 50%; transform: translateY(-50%); pointer-events: none; color: rgba(0,200,255,0.35); }
        .tp-section-heading { font-family: 'Bebas Neue', cursive; font-size: 1.6rem; letter-spacing: 0.08em; color: #e8f4ff; text-shadow: 0 0 16px rgba(0,200,255,0.15); }
        .tp-section-heading.fav { color: #ffc800; text-shadow: 0 0 16px rgba(255,200,0,0.2); }
        .tp-section-count { font-size: 0.72rem; color: rgba(0,200,255,0.4); font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; font-family: 'Rajdhani', sans-serif; }
        .tp-channel-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; }
        .tp-ambient { position: fixed; top: -200px; left: 50%; transform: translateX(-50%); width: 900px; height: 500px; background: radial-gradient(ellipse, rgba(0,80,180,0.07) 0%, transparent 70%); pointer-events: none; z-index: 0; }
        .tp-empty { text-align: center; padding: 80px 20px; }
        .tp-empty-icon { width: 80px; height: 80px; background: rgba(0,200,255,0.03); border: 1px solid rgba(0,200,255,0.08); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; }
        .tp-empty-icon.fav { background: rgba(255,200,0,0.03); border-color: rgba(255,200,0,0.12); }
        .tp-clear-btn { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: rgba(0,200,255,0.25); padding: 2px; display: flex; align-items: center; transition: color 0.2s; }
        .tp-clear-btn:hover { color: #00c8ff; }
        .tp-divider { height: 1px; background: rgba(0,200,255,0.08); }
        .tp-pagination { display: flex; align-items: center; justify-content: center; gap: 6px; margin-top: 40px; }
        .tp-page-btn { min-width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; background: rgba(0,200,255,0.03); border: 1px solid rgba(0,200,255,0.1); border-radius: 6px; color: #3a5a6a; font-family: 'Rajdhani', sans-serif; font-size: 0.85rem; font-weight: 600; cursor: pointer; transition: all 0.18s; padding: 0 6px; }
        .tp-page-btn:hover:not(:disabled):not(.dots) { border-color: rgba(0,200,255,0.35); color: #00c8ff; background: rgba(0,200,255,0.07); box-shadow: 0 0 10px rgba(0,200,255,0.08); }
        .tp-page-btn.active { background: rgba(0,200,255,0.12); border-color: rgba(0,200,255,0.5); color: #00c8ff; font-weight: 700; box-shadow: 0 0 12px rgba(0,200,255,0.12); }
        .tp-page-btn:disabled { opacity: 0.25; cursor: not-allowed; }
        .tp-page-btn.dots { cursor: default; border-color: transparent; background: none; }
        .tp-page-info { font-family: 'Rajdhani', sans-serif; font-size: 0.72rem; color: rgba(0,200,255,0.3); letter-spacing: 0.1em; text-transform: uppercase; text-align: center; margin-top: 12px; }
      `}</style>

      {/* ── QR Modal integrado ── */}
      <QRModal />

      <div className="tp-root">
        <div className="tp-ambient" />

        <header className="tp-header">
          <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 0 12px', flexWrap: 'wrap' }}>

              {/* Logo */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginRight: 4 }}>
                <img className="tp-logo-img" src="https://i.postimg.cc/j2WvZw96/Whats-App-Image-2026-03-02-at-11-44-07.jpg" alt="TechPhantom" />
                <span className="tp-logo-text"><span className="tp-accent">Tech</span>Phantom</span>
              </div>

              {/* Search */}
              <div className="tp-search-wrap" style={{ flex: 1, maxWidth: 440, minWidth: 180 }}>
                <Search size={16} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'rgba(0,200,255,0.28)', zIndex: 1 }} />
                <input
                  className="tp-search-input"
                  type="text"
                  placeholder="Buscar canales, deportes, noticias…"
                  value={filters.search}
                  onChange={(e) => handleFilterChange({ ...filters, search: e.target.value })}
                />
                {filters.search && (
                  <button className="tp-clear-btn" onClick={() => handleFilterChange({ ...filters, search: '' })}>
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Movies button */}
              <button className="tp-movies-btn" onClick={onMoviesClick}>
                <Film size={14} />
                Películas
                <span className="tp-movies-dot" />
              </button>

              {/* ── QR Remote button ── */}
              <QRRemoteButton />

              {/* Filter toggle */}
              <button
                className={`tp-filter-btn ${showFilters ? 'active' : ''}`}
                onClick={() => setShowFilters(v => !v)}
              >
                <SlidersHorizontal size={15} />
                Filtros
                {hasActiveFilters && (filters.category !== 'Todas' || filters.country !== 'Todos') && (
                  <span className="tp-filter-dot" />
                )}
              </button>
            </div>

            {/* Category pills */}
            <div className="tp-pill-bar" style={{ paddingBottom: 13 }}>
              <button
                className={`tp-pill-fav ${showFavorites ? 'active' : ''}`}
                onClick={handleToggleFavorites}
              >
                <Star size={11} fill={showFavorites ? 'currentColor' : 'none'} />
                Favoritos
                {favoriteIds.length > 0 && (
                  <span className="tp-pill-fav-count">{favoriteIds.length}</span>
                )}
              </button>
              <div className="tp-pill-sep" />
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`tp-pill ${!showFavorites && filters.category === cat ? 'active' : ''}`}
                  onClick={() => handleFilterChange({ ...filters, category: cat })}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Filter drawer */}
            <div className={`tp-filter-drawer ${showFilters ? 'open' : 'closed'}`}>
              <div className="tp-divider" style={{ marginBottom: 14 }} />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12, paddingBottom: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.68rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(0,200,255,0.35)', marginBottom: 6, fontFamily: 'Rajdhani', fontWeight: 600 }}>
                    País
                  </label>
                  <div className="tp-select-wrap">
                    <select
                      className="tp-styled-select"
                      value={filters.country}
                      onChange={(e) => handleFilterChange({ ...filters, country: e.target.value })}
                    >
                      {countries.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <ChevronDown size={14} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* ── Main ── */}
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '28px 24px 64px', position: 'relative', zIndex: 1 }}>
          <AppLayout onWatchChannel={handleWatchChannel}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 24 }}>
              <h2 className={`tp-section-heading ${showFavorites ? 'fav' : ''}`}>
                {showFavorites
                  ? '★ Mis Favoritos'
                  : filters.search
                    ? `Resultados para "${filters.search}"`
                    : filters.category !== 'Todas'
                      ? filters.category
                      : 'En Emisión'}
              </h2>
              <span className="tp-section-count">{filteredChannels.length} canales</span>
            </div>

            {filteredChannels.length === 0 ? (
              <div className="tp-empty">
                <div className={`tp-empty-icon ${showFavorites ? 'fav' : ''}`}>
                  {showFavorites
                    ? <Star size={28} style={{ color: 'rgba(255,200,0,0.3)' }} />
                    : <Search size={28} style={{ color: 'rgba(0,200,255,0.18)' }} />
                  }
                </div>
                <p style={{ fontSize: '1rem', marginBottom: 6, color: '#3a5a6a', fontFamily: 'Rajdhani', fontWeight: 600 }}>
                  {showFavorites ? 'Todavía no tenés favoritos' : 'Sin resultados'}
                </p>
                <p style={{ fontSize: '0.85rem', color: '#2a3a4a', fontFamily: 'Rajdhani' }}>
                  {showFavorites
                    ? 'Entrá a un canal y tocá ★ Agregar a favoritos para guardarlo acá'
                    : 'Intenta con otros términos o ajusta los filtros'}
                </p>
              </div>
            ) : (
              <>
                <div className="tp-channel-grid">
                  {paginatedChannels.map(channel => (
                    <ChannelCard key={channel.id} channel={channel} onClick={() => onChannelSelect(channel)} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <>
                    <div className="tp-pagination">
                      <button
                        className="tp-page-btn"
                        onClick={() => { setCurrentPage(p => p - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft size={15} />
                      </button>
                      {getPageNumbers().map((page, i) =>
                        page === '...'
                          ? <span key={`dots-${i}`} className="tp-page-btn dots">···</span>
                          : (
                            <button
                              key={page}
                              className={`tp-page-btn ${currentPage === page ? 'active' : ''}`}
                              onClick={() => { setCurrentPage(page as number); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                            >
                              {page}
                            </button>
                          )
                      )}
                      <button
                        className="tp-page-btn"
                        onClick={() => { setCurrentPage(p => p + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        disabled={currentPage === totalPages}
                      >
                        <ChevronRight size={15} />
                      </button>
                    </div>
                    <p className="tp-page-info">
                      Página {currentPage} de {totalPages} — {filteredChannels.length} canales en total
                    </p>
                  </>
                )}
              </>
            )}
          </AppLayout>
          <Footer />
        </div>
      </div>
    </div>
  );
}

// ── QR Modal (self-contained, no depende de QRRemote.tsx) ──────────────────
const REMOTE_URL = 'https://techphantomarg.netlify.app/remote';
const QR_IMG = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&format=png&color=00c8ff&bgcolor=060608&qzone=1&data=${encodeURIComponent(REMOTE_URL)}`;

function QRModal() {
  const [open, setOpen]     = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try { await navigator.clipboard.writeText(REMOTE_URL); } catch {}
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  // Exponer open al botón del header via evento customizado
  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener('tp:openQR', handler);
    return () => window.removeEventListener('tp:openQR', handler);
  }, []);

  if (!open) return null;

  return (
    <div className="tp-qr-overlay" onClick={() => setOpen(false)}>
      <div className="tp-qr-card" onClick={e => e.stopPropagation()}>
        <button className="tp-qr-close" onClick={() => setOpen(false)}>✕</button>

        <div style={{ textAlign: 'center' }}>
          <div className="tp-qr-title"><span>Control</span> Remoto</div>
          <div className="tp-qr-sub">Escaneá con tu celular</div>
        </div>

        <div className="tp-qr-frame">
          <div className="tp-qr-corner tp-qr-c-tl" />
          <div className="tp-qr-corner tp-qr-c-tr" />
          <div className="tp-qr-corner tp-qr-c-bl" />
          <div className="tp-qr-corner tp-qr-c-br" />
          <div className={`tp-qr-shimmer ${loaded ? 'done' : ''}`} />
          <img
            src={QR_IMG} alt="QR Control Remoto"
            className={`tp-qr-img ${loaded ? 'rdy' : ''}`}
            onLoad={() => setLoaded(true)}
          />
        </div>

        <div className="tp-qr-hint">
          <span className="tp-qr-hint-emoji">📱</span>
          Apuntá la cámara al código QR
        </div>

        <div className="tp-qr-stats">
          <div className="tp-qr-stat">
            <div className="tp-qr-stat-n">60+</div>
            <div className="tp-qr-stat-l">Canales</div>
          </div>
          <div className="tp-qr-stat-sep" />
          <div className="tp-qr-stat">
            <div className="tp-qr-stat-n">8</div>
            <div className="tp-qr-stat-l">Categorías</div>
          </div>
          <div className="tp-qr-stat-sep" />
          <div className="tp-qr-stat">
            <div className="tp-qr-stat-n">HD</div>
            <div className="tp-qr-stat-l">Calidad</div>
          </div>
        </div>

        <div className="tp-qr-divider" />

        <div className="tp-qr-url-row">
          <span className="tp-qr-url">{REMOTE_URL}</span>
          <button className={`tp-qr-copy ${copied ? 'ok' : ''}`} onClick={copy}>
            {copied ? '✓ Copiado' : 'Copiar'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Botón que dispara el modal via evento ─────────────────────────────────
function QRRemoteButton() {
  return (
    <button
      className="tp-qr-btn"
      onClick={() => window.dispatchEvent(new Event('tp:openQR'))}
    >
      <span className="tp-qr-icon">📱</span>
      Control Remoto
    </button>
  );
}