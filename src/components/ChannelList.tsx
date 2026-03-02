import { useState, useMemo } from 'react';
import { Channel, FilterOptions } from '../types';
import { ChannelCard } from './ChannelCard';
import { Search, SlidersHorizontal, X, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { categories, countries } from '../data/channels';
import { AppLayout } from './Livematches';
import { Footer } from './Footer';

interface ChannelListProps {
  channels: Channel[];
  onChannelSelect: (channel: Channel) => void;
}

const CHANNELS_PER_PAGE = 12;

// Canales prioritarios que aparecen primero
const PRIORITY_CHANNELS = [
  'espn premium',
  'tnt sport',
  'tyc sport',
  'directv sport',
  'a24',
  'c5n',
  'espn',
  'fox sport',
  'cnn',
  'telefe',
  'canal 13',
  'america tv',
];

function getPriorityScore(channelName: string): number {
  const name = channelName.toLowerCase();
  const idx = PRIORITY_CHANNELS.findIndex(p => name.includes(p));
  return idx === -1 ? PRIORITY_CHANNELS.length : idx;
}

export function ChannelList({ channels, onChannelSelect }: ChannelListProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    category: 'Todas',
    country: 'Todos',
    search: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredChannels = useMemo(() => {
    const filtered = channels.filter(channel => {
      const matchesCategory = filters.category === 'Todas' || channel.category === filters.category;
      const matchesCountry = filters.country === 'Todos' || channel.country === filters.country;
      const matchesSearch =
        channel.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        channel.description.toLowerCase().includes(filters.search.toLowerCase());
      return matchesCategory && matchesCountry && matchesSearch;
    });

    // Sort: priority channels first, then rest alphabetically
    return filtered.sort((a, b) => {
      const pa = getPriorityScore(a.name);
      const pb = getPriorityScore(b.name);
      if (pa !== pb) return pa - pb;
      return a.name.localeCompare(b.name);
    });
  }, [channels, filters]);

  // Reset to page 1 when filters change
  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredChannels.length / CHANNELS_PER_PAGE);
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

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | '...')[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(i);
      }
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
          position: fixed;
          inset: 0;
          background-image:
            linear-gradient(rgba(0,200,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,200,255,0.025) 1px, transparent 1px);
          background-size: 48px 48px;
          mask-image: radial-gradient(ellipse 100% 80% at 50% 0%, black 0%, transparent 80%);
          pointer-events: none;
          z-index: 0;
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
          position: absolute;
          top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(0,200,255,0.6) 30%, rgba(0,200,255,0.6) 70%, transparent);
        }

        .tp-logo-img {
          width: 34px; height: 34px;
          border-radius: 50%;
          object-fit: cover;
          border: 1px solid rgba(0,200,255,0.4);
          box-shadow: 0 0 12px rgba(0,200,255,0.25);
        }
        .tp-logo-text {
          font-family: 'Bebas Neue', cursive;
          font-size: 1.9rem;
          letter-spacing: 0.12em;
          color: #e8f4ff;
          line-height: 1;
          text-shadow: 0 0 20px rgba(0,200,255,0.35);
        }
        .tp-logo-text .tp-accent { color: #00c8ff; }

        .tp-search-wrap { position: relative; }
        .tp-search-input {
          width: 100%;
          background: rgba(0,200,255,0.04);
          border: 1px solid rgba(0,200,255,0.12);
          border-radius: 8px;
          color: #e8f4ff;
          font-family: 'Rajdhani', sans-serif;
          font-size: 0.95rem; font-weight: 500;
          padding: 11px 44px 11px 42px;
          outline: none;
          transition: all 0.25s;
        }
        .tp-search-input::placeholder { color: #2a3a4a; }
        .tp-search-input:focus {
          border-color: rgba(0,200,255,0.4);
          background: rgba(0,200,255,0.06);
          box-shadow: 0 0 0 3px rgba(0,200,255,0.07), 0 0 20px rgba(0,200,255,0.06);
        }

        .tp-filter-btn {
          display: flex; align-items: center; gap: 6px;
          background: rgba(0,200,255,0.05);
          border: 1px solid rgba(0,200,255,0.12);
          border-radius: 8px;
          color: #4a7a9a;
          font-family: 'Rajdhani', sans-serif;
          font-size: 0.9rem; font-weight: 600;
          letter-spacing: 0.05em;
          padding: 10px 16px;
          cursor: pointer; white-space: nowrap;
          transition: all 0.2s;
        }
        .tp-filter-btn:hover, .tp-filter-btn.active {
          border-color: rgba(0,200,255,0.4);
          color: #00c8ff;
          background: rgba(0,200,255,0.08);
          box-shadow: 0 0 12px rgba(0,200,255,0.08);
        }
        .tp-filter-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #00c8ff; box-shadow: 0 0 6px #00c8ff;
        }

        .tp-pill-bar {
          display: flex; gap: 7px;
          overflow-x: auto; scrollbar-width: none; padding: 2px 0;
        }
        .tp-pill-bar::-webkit-scrollbar { display: none; }
        .tp-pill {
          flex-shrink: 0;
          padding: 5px 13px;
          border-radius: 3px;
          border: 1px solid rgba(0,200,255,0.08);
          background: rgba(0,200,255,0.02);
          color: #3a5a6a;
          font-size: 0.75rem; font-weight: 600;
          font-family: 'Rajdhani', sans-serif;
          letter-spacing: 0.08em;
          cursor: pointer;
          transition: all 0.18s;
          white-space: nowrap;
          text-transform: uppercase;
        }
        .tp-pill:hover {
          border-color: rgba(0,200,255,0.28);
          color: #80c0d8;
          background: rgba(0,200,255,0.05);
        }
        .tp-pill.active {
          background: rgba(0,200,255,0.1);
          border-color: rgba(0,200,255,0.45);
          color: #00c8ff;
          font-weight: 700;
          box-shadow: 0 0 10px rgba(0,200,255,0.1), inset 0 0 6px rgba(0,200,255,0.04);
        }

        .tp-filter-drawer {
          overflow: hidden;
          transition: max-height 0.35s cubic-bezier(0.4,0,0.2,1), opacity 0.25s;
        }
        .tp-filter-drawer.open  { max-height: 200px; opacity: 1; }
        .tp-filter-drawer.closed{ max-height: 0;     opacity: 0; }

        .tp-styled-select {
          appearance: none;
          background: rgba(0,200,255,0.04);
          border: 1px solid rgba(0,200,255,0.12);
          border-radius: 8px;
          color: #e8f4ff;
          font-family: 'Rajdhani', sans-serif;
          font-size: 0.9rem; font-weight: 500;
          padding: 10px 36px 10px 14px;
          cursor: pointer; outline: none; width: 100%;
          transition: border-color 0.2s, background 0.2s;
        }
        .tp-styled-select:hover, .tp-styled-select:focus {
          border-color: rgba(0,200,255,0.35);
          background: rgba(0,200,255,0.07);
        }
        .tp-styled-select option { background: #0d0d14; color: #e8f4ff; }

        .tp-select-wrap { position: relative; }
        .tp-select-wrap svg {
          position: absolute; right: 10px; top: 50%;
          transform: translateY(-50%);
          pointer-events: none; color: rgba(0,200,255,0.35);
        }

        .tp-section-heading {
          font-family: 'Bebas Neue', cursive;
          font-size: 1.6rem; letter-spacing: 0.08em;
          color: #e8f4ff;
          text-shadow: 0 0 16px rgba(0,200,255,0.15);
        }
        .tp-section-count {
          font-size: 0.72rem; color: rgba(0,200,255,0.4);
          font-weight: 600; letter-spacing: 0.12em;
          text-transform: uppercase; font-family: 'Rajdhani', sans-serif;
        }

        .tp-channel-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 16px;
        }

        .tp-ambient {
          position: fixed; top: -200px; left: 50%;
          transform: translateX(-50%);
          width: 900px; height: 500px;
          background: radial-gradient(ellipse, rgba(0,80,180,0.07) 0%, transparent 70%);
          pointer-events: none; z-index: 0;
        }

        .tp-empty { text-align: center; padding: 80px 20px; }
        .tp-empty-icon {
          width: 80px; height: 80px;
          background: rgba(0,200,255,0.03);
          border: 1px solid rgba(0,200,255,0.08);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 20px;
        }

        .tp-clear-btn {
          position: absolute; right: 12px; top: 50%;
          transform: translateY(-50%);
          background: none; border: none; cursor: pointer;
          color: rgba(0,200,255,0.25); padding: 2px;
          display: flex; align-items: center;
          transition: color 0.2s;
        }
        .tp-clear-btn:hover { color: #00c8ff; }

        .tp-divider { height: 1px; background: rgba(0,200,255,0.08); }

        /* Pagination */
        .tp-pagination {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          margin-top: 40px;
        }
        .tp-page-btn {
          min-width: 36px; height: 36px;
          display: flex; align-items: center; justify-content: center;
          background: rgba(0,200,255,0.03);
          border: 1px solid rgba(0,200,255,0.1);
          border-radius: 6px;
          color: #3a5a6a;
          font-family: 'Rajdhani', sans-serif;
          font-size: 0.85rem; font-weight: 600;
          cursor: pointer;
          transition: all 0.18s;
          padding: 0 6px;
        }
        .tp-page-btn:hover:not(:disabled):not(.dots) {
          border-color: rgba(0,200,255,0.35);
          color: #00c8ff;
          background: rgba(0,200,255,0.07);
          box-shadow: 0 0 10px rgba(0,200,255,0.08);
        }
        .tp-page-btn.active {
          background: rgba(0,200,255,0.12);
          border-color: rgba(0,200,255,0.5);
          color: #00c8ff;
          font-weight: 700;
          box-shadow: 0 0 12px rgba(0,200,255,0.12);
        }
        .tp-page-btn:disabled {
          opacity: 0.25;
          cursor: not-allowed;
        }
        .tp-page-btn.dots {
          cursor: default;
          border-color: transparent;
          background: none;
        }
        .tp-page-info {
          font-family: 'Rajdhani', sans-serif;
          font-size: 0.72rem;
          color: rgba(0,200,255,0.3);
          letter-spacing: 0.1em;
          text-transform: uppercase;
          text-align: center;
          margin-top: 12px;
        }
      `}</style>

      <div className="tp-root">
        <div className="tp-ambient" />

        {/* Header */}
        <header className="tp-header">
          <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 0 14px' }}>
              {/* Logo */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginRight: 8 }}>
                <img className="tp-logo-img" src="https://i.postimg.cc/j2WvZw96/Whats-App-Image-2026-03-02-at-11-44-07.jpg" alt="TechPhantom" />
                <span className="tp-logo-text"><span className="tp-accent">Tech</span>Phantom</span>
              </div>

              {/* Search */}
              <div className="tp-search-wrap" style={{ flex: 1, maxWidth: 480 }}>
                <Search size={16} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'rgba(0,200,255,0.28)', zIndex: 1 }} />
                <input
                  className="tp-search-input"
                  type="text"
                  placeholder="Buscar canales, series, películas…"
                  value={filters.search}
                  onChange={(e) => handleFilterChange({ ...filters, search: e.target.value })}
                />
                {filters.search && (
                  <button className="tp-clear-btn" onClick={() => handleFilterChange({ ...filters, search: '' })}>
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Filter toggle */}
              <button className={`tp-filter-btn ${showFilters ? 'active' : ''}`} onClick={() => setShowFilters(v => !v)}>
                <SlidersHorizontal size={15} />
                Filtros
                {hasActiveFilters && (filters.category !== 'Todas' || filters.country !== 'Todos') && <span className="tp-filter-dot" />}
              </button>
            </div>

            {/* Category pills */}
            <div className="tp-pill-bar" style={{ paddingBottom: 14 }}>
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`tp-pill ${filters.category === cat ? 'active' : ''}`}
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
                    <select className="tp-styled-select" value={filters.country} onChange={(e) => handleFilterChange({ ...filters, country: e.target.value })}>
                      {countries.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <ChevronDown size={14} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main */}
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '28px 24px 64px', position: 'relative', zIndex: 1 }}>
          <AppLayout onWatchChannel={handleWatchChannel}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 24 }}>
              <h2 className="tp-section-heading">
                {filters.search ? `Resultados para "${filters.search}"` : filters.category !== 'Todas' ? filters.category : 'En Emisión'}
              </h2>
              <span className="tp-section-count">{filteredChannels.length} canales</span>
            </div>

            {filteredChannels.length === 0 ? (
              <div className="tp-empty">
                <div className="tp-empty-icon">
                  <Search size={28} style={{ color: 'rgba(0,200,255,0.18)' }} />
                </div>
                <p style={{ fontSize: '1rem', marginBottom: 6, color: '#3a5a6a', fontFamily: 'Rajdhani', fontWeight: 600 }}>Sin resultados</p>
                <p style={{ fontSize: '0.85rem', color: '#2a3a4a', fontFamily: 'Rajdhani' }}>Intenta con otros términos o ajusta los filtros</p>
              </div>
            ) : (
              <>
                <div className="tp-channel-grid">
                  {paginatedChannels.map(channel => (
                    <ChannelCard key={channel.id} channel={channel} onClick={() => onChannelSelect(channel)} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <>
                    <div className="tp-pagination">
                      {/* Prev */}
                      <button
                        className="tp-page-btn"
                        onClick={() => { setCurrentPage(p => p - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft size={15} />
                      </button>

                      {/* Page numbers */}
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

                      {/* Next */}
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