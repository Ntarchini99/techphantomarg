import { useState, useMemo } from 'react';
import { Channel, FilterOptions } from '../types';
import { ChannelCard } from './ChannelCard';
import { Search, SlidersHorizontal, Tv2, X, ChevronDown } from 'lucide-react';
import { categories, countries } from '../data/channels';
import { LiveMatches } from './Livematches';

interface ChannelListProps {
  channels: Channel[];
  onChannelSelect: (channel: Channel) => void;
}

export function ChannelList({ channels, onChannelSelect }: ChannelListProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    category: 'Todas',
    country: 'Todos',
    search: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  const filteredChannels = useMemo(() => {
    return channels.filter(channel => {
      const matchesCategory = filters.category === 'Todas' || channel.category === filters.category;
      const matchesCountry = filters.country === 'Todos' || channel.country === filters.country;
      const matchesSearch =
        channel.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        channel.description.toLowerCase().includes(filters.search.toLowerCase());
      return matchesCategory && matchesCountry && matchesSearch;
    });
  }, [channels, filters]);

  const hasActiveFilters = filters.category !== 'Todas' || filters.country !== 'Todos' || filters.search !== '';

  return (
    <div className="min-h-screen" style={{ background: '#0a0a0f', fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif" }}>

      {/* CSS Variables + Custom Styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300&family=Bebas+Neue&display=swap');

        :root {
          --red: #e50914;
          --red-dark: #b20710;
          --surface: #141418;
          --surface2: #1c1c24;
          --border: rgba(255,255,255,0.06);
          --text: #f0f0f0;
          --muted: #888;
          --accent: #e50914;
        }

        .streamtv-root * { box-sizing: border-box; }

        /* Header blur + border */
        .header-bar {
          background: linear-gradient(180deg, rgba(10,10,15,0.98) 0%, rgba(10,10,15,0.85) 100%);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border);
        }

        /* Logo */
        .logo-text {
          font-family: 'Bebas Neue', cursive;
          font-size: 2rem;
          letter-spacing: 0.08em;
          background: linear-gradient(135deg, #fff 0%, #e50914 60%, #ff6b6b 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1;
        }

        /* Search */
        .search-wrap {
          position: relative;
          transition: all 0.3s ease;
        }
        .search-input {
          width: 100%;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 8px;
          color: #f0f0f0;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem;
          padding: 11px 44px 11px 42px;
          outline: none;
          transition: all 0.25s ease;
        }
        .search-input::placeholder { color: #555; }
        .search-input:focus {
          border-color: var(--red);
          background: rgba(229,9,20,0.05);
          box-shadow: 0 0 0 3px rgba(229,9,20,0.12);
        }

        /* Filter drawer */
        .filter-drawer {
          overflow: hidden;
          transition: max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s ease;
        }
        .filter-drawer.open { max-height: 200px; opacity: 1; }
        .filter-drawer.closed { max-height: 0; opacity: 0; }

        /* Select */
        .styled-select {
          appearance: none;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 8px;
          color: #f0f0f0;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.875rem;
          padding: 10px 36px 10px 14px;
          cursor: pointer;
          outline: none;
          width: 100%;
          transition: border-color 0.2s, background 0.2s;
        }
        .styled-select:focus, .styled-select:hover {
          border-color: rgba(229,9,20,0.5);
          background: rgba(229,9,20,0.04);
        }
        .styled-select option { background: #1c1c24; color: #f0f0f0; }

        /* Select wrapper */
        .select-wrap { position: relative; }
        .select-wrap svg {
          position: absolute; right: 10px; top: 50%; transform: translateY(-50%);
          pointer-events: none; color: #555;
        }

        /* Filter toggle btn */
        .filter-btn {
          display: flex; align-items: center; gap: 6px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 8px;
          color: #aaa;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.85rem;
          padding: 10px 16px;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s;
        }
        .filter-btn:hover, .filter-btn.active {
          border-color: var(--red);
          color: #fff;
          background: rgba(229,9,20,0.08);
        }
        .filter-btn .dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--red);
          margin-left: 2px;
        }

        /* Section heading */
        .section-heading {
          font-family: 'Bebas Neue', cursive;
          font-size: 1.6rem;
          letter-spacing: 0.06em;
          color: #f0f0f0;
        }
        .section-count {
          font-size: 0.8rem;
          color: #555;
          font-weight: 400;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        /* Channel grid */
        .channel-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 16px;
        }

        /* Ambient glow behind hero area */
        .ambient-glow {
          position: fixed;
          top: -200px;
          left: 50%;
          transform: translateX(-50%);
          width: 800px;
          height: 400px;
          background: radial-gradient(ellipse, rgba(229,9,20,0.06) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }

        /* Empty state */
        .empty-state {
          text-align: center;
          padding: 80px 20px;
          color: var(--muted);
        }
        .empty-icon {
          width: 80px; height: 80px;
          background: rgba(255,255,255,0.03);
          border: 1px solid var(--border);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 20px;
        }

        /* Clear search btn */
        .clear-btn {
          position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
          background: none; border: none; cursor: pointer;
          color: #555; padding: 2px;
          display: flex; align-items: center;
          transition: color 0.2s;
        }
        .clear-btn:hover { color: #aaa; }

        /* Category pills */
        .pill-bar {
          display: flex; gap: 8px;
          overflow-x: auto;
          scrollbar-width: none;
          padding: 2px 0;
        }
        .pill-bar::-webkit-scrollbar { display: none; }
        .pill {
          flex-shrink: 0;
          padding: 6px 14px;
          border-radius: 20px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.03);
          color: #888;
          font-size: 0.8rem;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: all 0.18s;
          white-space: nowrap;
        }
        .pill:hover { border-color: rgba(229,9,20,0.4); color: #ccc; }
        .pill.active {
          background: var(--red);
          border-color: var(--red);
          color: #fff;
          font-weight: 600;
        }

        /* Divider */
        .divider { height: 1px; background: var(--border); }
      `}</style>

      <div className="streamtv-root">
        <div className="ambient-glow" />

        {/* ── HEADER ── */}
        <header className="header-bar sticky top-0 z-50">
          <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 24px' }}>

            {/* Top row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 0 14px' }}>

              {/* Logo */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginRight: 8 }}>
                <div style={{
                  background: 'var(--red)',
                  borderRadius: 6,
                  padding: '5px 6px',
                  display: 'flex',
                  alignItems: 'center',
                }}>
                  <Tv2 size={18} color="#fff" strokeWidth={2.5} />
                </div>
                <span className="logo-text">NazzStream</span>
              </div>

              {/* Search — grows */}
              <div className="search-wrap" style={{ flex: 1, maxWidth: 480 }}>
                <Search
                  size={16}
                  style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: '#555', zIndex: 1 }}
                />
                <input
                  className="search-input"
                  type="text"
                  placeholder="Buscar canales, series, películas…"
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                />
                {filters.search && (
                  <button className="clear-btn" onClick={() => setFilters({ ...filters, search: '' })}>
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Filter toggle */}
              <button
                className={`filter-btn ${showFilters ? 'active' : ''}`}
                onClick={() => setShowFilters(v => !v)}
              >
                <SlidersHorizontal size={15} />
                Filtros
                {hasActiveFilters && (filters.category !== 'Todas' || filters.country !== 'Todos') && (
                  <span className="dot" />
                )}
              </button>
            </div>

            {/* Category pills */}
            <div className="pill-bar" style={{ paddingBottom: 14 }}>
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`pill ${filters.category === cat ? 'active' : ''}`}
                  onClick={() => setFilters({ ...filters, category: cat })}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Expandable country filter */}
            <div className={`filter-drawer ${showFilters ? 'open' : 'closed'}`}>
              <div className="divider" style={{ marginBottom: 14 }} />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12, paddingBottom: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#555', marginBottom: 6 }}>
                    País
                  </label>
                  <div className="select-wrap">
                    <select
                      className="styled-select"
                      value={filters.country}
                      onChange={(e) => setFilters({ ...filters, country: e.target.value })}
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

        {/* ── LIVE MATCHES ── */}
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '20px 24px 0', position: 'relative', zIndex: 1 }}>
          <LiveMatches onWatchChannel={(channelName: string) => {
            const ch = channels.find(c => c.name.toLowerCase().includes(channelName.toLowerCase().split(' ')[0]));
            if (ch) onChannelSelect(ch);
          }} />
        </div>

        {/* ── MAIN ── */}
        <main style={{ maxWidth: 1400, margin: '0 auto', padding: '32px 24px 64px', position: 'relative', zIndex: 1 }}>

          {/* Count row */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 24 }}>
            <h2 className="section-heading">
              {filters.search
                ? `Resultados para "${filters.search}"`
                : filters.category !== 'Todas'
                  ? filters.category
                  : 'En Emisión'}
            </h2>
            <span className="section-count">{filteredChannels.length} canales</span>
          </div>

          {/* Grid or empty */}
          {filteredChannels.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <Search size={28} style={{ color: '#444' }} />
              </div>
              <p style={{ fontSize: '1rem', marginBottom: 6, color: '#666' }}>Sin resultados</p>
              <p style={{ fontSize: '0.85rem', color: '#444' }}>Intenta con otros términos o ajusta los filtros</p>
            </div>
          ) : (
            <div className="channel-grid">
              {filteredChannels.map(channel => (
                <ChannelCard
                  key={channel.id}
                  channel={channel}
                  onClick={() => onChannelSelect(channel)}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}