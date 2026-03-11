import { useState, useMemo } from 'react';

// ── Tipos mínimos necesarios ──────────────────────────────────────────────
interface Channel {
  id: string;
  slug: string;
  name: string;
  logo: string;
  category: string;
  streamUrl: string;
}

// ── Datos de canales (copiados desde channels.ts) ─────────────────────────
const W = (file: string) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${file}`;

const LOGOS: Record<string, string> = {
  espn: W('ESPN_wordmark.svg'),
  espn2: W('ESPN2_logo.svg'),
  espn3: W('ESPN3_logo.svg'),
  espn4: W('ESPN_4_logo.svg'),
  espn5: W('ESPN_5_logo.svg'),
  espnPremium: W('ESPN_Premium_logo.svg'),
  tntSports: W('TNT_Sports_2020_logo.svg'),
  tycSports: W('TyC_Sports_logo.svg'),
  directvSports: W('DirecTV_Sports_Latin_America_-_2018_logo_v2.svg'),
  foxSports: W('FOX_Sports_logo.svg'),
  deportv: W('DeporTV_logo.svg'),
  nbaTv: W('NBA_TV.svg'),
  tudn: W('TUDN_Logo.svg'),
  formula1: W('Formula_1_logo.svg'),
  telefe: W('Telefe_2020.svg'),
  elTrece: W('El_Trece_logo_2020.svg'),
  tvPublica: W('TVP_-_Televisión_Pública_(2021).svg'),
  tn: W('TN_todo_noticias_logo.svg'),
  america: W('Logotipo_de_America_TV.svg'),
  c5n: W('Logo-c5n.svg'),
  cronica: W('Crónica_TV_logo.svg'),
  canalNueve: W('Canal_9_Argentina_2019.svg'),
  lnMas: W('LN+_logo.svg'),
  encuentro: W('Canal_Encuentro_logo.svg'),
  pakaPaka: W('Paka-paka.svg'),
  elGourmet: W('El_Gourmet_logo.svg'),
  space: W('SpaceLogo.svg'),
  cinecanal: W('Cinecanal_logo.svg'),
  ciudadMagazine: W('Ciudad_Magazine_logo.svg'),
  tooncast: W('Tooncast_logo.svg'),
  volver: W('Volver_(Argentine_TV_channel)_logo.svg'),
  hbo: W('HBO_logo.svg'),
  discovery: W('Discovery_Channel_-_Logo_2019.svg'),
  discoveryKids: W('Discovery_Kids_logo_2017.svg'),
  discoveryId: W('Investigation_Discovery_Logo_2018.svg'),
  discoveryTlc: W('TLC_Logo.svg'),
  cartoonNetwork: W('Cartoon_Network_2010_logo.svg'),
  nick: W('Nickelodeon_2009_logo.svg'),
  nickJr: W('Nick_Jr._logo_2009.svg'),
  disney: W('Disney_Channel_logo_2019.svg'),
  disneyJr: W('Disney_Junior_LogoVector.svg'),
  history: W('History_logo.svg'),
  natGeo: W('National_Geographic_Channel.svg'),
  mtv: W('MTV_Logo_2021.svg'),
  aAndE: W('A&E_Network_logo.svg'),
  amc: W('AMC_-_Logo.svg'),
  animalPlanet: W('Animal_Planet_Logo_2018.svg'),
  axn: W('AXN_logo.svg'),
  comedyCentral: W('Comedy_Central_logo_2018.svg'),
  cinemax: W('Cinemax_logo.svg'),
  adultSwim: W('Adult_Swim_2003_logo.svg'),
  fx: W('FX_International_channel_logo.svg'),
  lifetime: W('Lifetime_logo.svg'),
  foxNews: W('Fox_News_Channel_logo.svg'),
  usaNetwork: W('USA_Network_logo_(2016).svg'),
  warnerChannel: W('Warner_Channel.svg'),
  sonyChannel: W('Sony_Channel_logo.svg'),
  tntHd: W('TNT_logo_2016.svg'),
  studioUniversal: W('Studio_Universal_logo.svg'),
  tcm: W('TCM_logo.svg'),
  eEntertainment: W('E!_logo.svg'),
  babyTv: W('BabyTV_Logo.svg'),
  dreamworks: W('DreamWorks_Animation_SKG_logo.svg'),
  cartoonito: W('Cartoonito_logo.svg'),
  france24: W('France24_logo.svg'),
  tv5monde: W('TV5MONDE_logo.svg'),
  dw: W('Deutsche_Welle_symbol_2012.svg'),
  rt: W('RT_logo.svg'),
  telesur: W('Telesur_logo.svg'),
  telemundo: W('Telemundo_logo.svg'),
  tvn: W('TVN_logo_2017.svg'),
  rcn: W('RCN_Television_logo.svg'),
  antena3: W('Antena_3_logo_2019.svg'),
  tveInternacional: W('TVE_Internacional_2021.svg'),
  arirang: W('Arirang_TV_logo.svg'),
  rai: W('RAI_-_Logo.svg'),
};

const CHANNELS: Channel[] = [
  // Deportes
  { id: '25', slug: 'espn', name: 'ESPN', logo: LOGOS.espn, category: 'Deportes', streamUrl: 'pj:espn' },
  { id: '32', slug: 'espn-premium', name: 'ESPN Premium', logo: LOGOS.espnPremium, category: 'Deportes', streamUrl: 'pj:espn-premium' },
  { id: '26', slug: 'espn-2', name: 'ESPN 2', logo: LOGOS.espn2, category: 'Deportes', streamUrl: 'pj:espn-2' },
  { id: '27', slug: 'espn-3', name: 'ESPN 3', logo: LOGOS.espn3, category: 'Deportes', streamUrl: 'pj:espn-3' },
  { id: '28', slug: 'espn-4', name: 'ESPN 4', logo: LOGOS.espn4, category: 'Deportes', streamUrl: 'pj:espn-4' },
  { id: '29', slug: 'espn-5', name: 'ESPN 5', logo: LOGOS.espn5, category: 'Deportes', streamUrl: 'pj:espn-5' },
  { id: '53', slug: 'tnt-sports', name: 'TNT Sports', logo: LOGOS.tntSports, category: 'Deportes', streamUrl: 'pj:tnt-sports' },
  { id: '56', slug: 'tyc-sports', name: 'TyC Sports', logo: LOGOS.tycSports, category: 'Deportes', streamUrl: 'pj:tyc-sports' },
  { id: '200', slug: 'directv-sports', name: 'DirecTV Sports', logo: LOGOS.directvSports, category: 'Deportes', streamUrl: 'pj:directv-sports' },
  { id: '35', slug: 'fox-sports', name: 'FOX Sports', logo: LOGOS.foxSports, category: 'Deportes', streamUrl: 'pj:fox-sports' },
  { id: '36', slug: 'fox-sports-2', name: 'FOX Sports 2', logo: LOGOS.foxSports, category: 'Deportes', streamUrl: 'pj:fox-sports-2' },
  { id: '37', slug: 'fox-sports-3', name: 'FOX Sports 3', logo: LOGOS.foxSports, category: 'Deportes', streamUrl: 'pj:fox-sports-3' },
  { id: '19', slug: 'deportv', name: 'DeporTV', logo: LOGOS.deportv, category: 'Deportes', streamUrl: 'pj:deportv' },
  { id: '109', slug: 'nba-tv', name: 'NBA TV', logo: LOGOS.nbaTv, category: 'Deportes', streamUrl: 'pj:nba-tv' },
  { id: '133', slug: 'tudn', name: 'TUDN', logo: LOGOS.tudn, category: 'Deportes', streamUrl: 'pj:tudn' },
  { id: '142', slug: 'formula-1', name: 'Fórmula 1', logo: LOGOS.formula1, category: 'Deportes', streamUrl: 'pj:formula-1' },
  // Noticias AR
  { id: '52', slug: 'tn', name: 'TN', logo: LOGOS.tn, category: 'Noticias', streamUrl: 'pj:tn' },
  { id: '55', slug: 'tv-publica', name: 'TV Pública', logo: LOGOS.tvPublica, category: 'Noticias', streamUrl: 'pj:tv-publica' },
  { id: '6', slug: 'c5n', name: 'C5N', logo: LOGOS.c5n, category: 'Noticias', streamUrl: 'pj:c5n' },
  { id: '17', slug: 'cronica', name: 'Crónica', logo: LOGOS.cronica, category: 'Noticias', streamUrl: 'pj:cronica' },
  { id: '40', slug: 'ln', name: 'LN+', logo: LOGOS.lnMas, category: 'Noticias', streamUrl: 'pj:ln' },
  { id: '1', slug: 'a24', name: 'A24', logo: 'https://i.postimg.cc/Kc0GKMJQ/header-logo-v2.jpg', category: 'Noticias', streamUrl: 'pj:a24' },
  { id: '7', slug: 'canal-26', name: 'Canal 26', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Canal_26_Argentina_Logo.svg/200px-Canal_26_Argentina_Logo.svg.png', category: 'Noticias', streamUrl: 'pj:canal-26' },
  // Entretenimiento AR
  { id: '49', slug: 'telefe', name: 'TELEFE', logo: LOGOS.telefe, category: 'Entretenimiento', streamUrl: 'pj:telefe' },
  { id: '22', slug: 'el-trece', name: 'EL TRECE', logo: LOGOS.elTrece, category: 'Entretenimiento', streamUrl: 'pj:el-trece' },
  { id: '3', slug: 'america', name: 'AMÉRICA', logo: LOGOS.america, category: 'Entretenimiento', streamUrl: 'pj:america' },
  { id: '11', slug: 'canal-nueve', name: 'Canal Nueve', logo: LOGOS.canalNueve, category: 'Entretenimiento', streamUrl: 'pj:canal-nueve' },
  { id: '21', slug: 'el-gourmet', name: 'El Gourmet', logo: LOGOS.elGourmet, category: 'Entretenimiento', streamUrl: 'pj:el-gourmet' },
  { id: '15', slug: 'ciudad-magazine', name: 'Ciudad Magazine', logo: LOGOS.ciudadMagazine, category: 'Entretenimiento', streamUrl: 'pj:ciudad-magazine' },
  // Películas y series
  { id: '94', slug: 'hbo', name: 'HBO', logo: LOGOS.hbo, category: 'Películas', streamUrl: 'pj:hbo' },
  { id: '95', slug: 'hbo-2', name: 'HBO 2', logo: LOGOS.hbo, category: 'Películas', streamUrl: 'pj:hbo-2' },
  { id: '98', slug: 'hbo-plus', name: 'HBO Plus', logo: LOGOS.hbo, category: 'Películas', streamUrl: 'pj:hbo-plus' },
  { id: '14', slug: 'cinecanal', name: 'Cinecanal', logo: LOGOS.cinecanal, category: 'Películas', streamUrl: 'pj:cinecanal' },
  { id: '47', slug: 'space', name: 'Space', logo: LOGOS.space, category: 'Películas', streamUrl: 'pj:space' },
  { id: '72', slug: 'amc', name: 'AMC', logo: LOGOS.amc, category: 'Películas', streamUrl: 'pj:amc' },
  { id: '74', slug: 'axn', name: 'AXN', logo: LOGOS.axn, category: 'Películas', streamUrl: 'pj:axn' },
  { id: '77', slug: 'cinemax', name: 'Cinemax', logo: LOGOS.cinemax, category: 'Películas', streamUrl: 'pj:cinemax' },
  { id: '93', slug: 'fxhd', name: 'FX', logo: LOGOS.fx, category: 'Películas', streamUrl: 'pj:fxhd' },
  { id: '116', slug: 'tnt-hd', name: 'TNT HD', logo: LOGOS.tntHd, category: 'Películas', streamUrl: 'pj:tnt-hd' },
  { id: '112', slug: 'sony-channel', name: 'Sony Channel', logo: LOGOS.sonyChannel, category: 'Películas', streamUrl: 'pj:sony-channel' },
  { id: '126', slug: 'warner', name: 'Warner', logo: LOGOS.warnerChannel, category: 'Películas', streamUrl: 'pj:warner' },
  { id: '114', slug: 'studio-universal', name: 'Studio Universal', logo: LOGOS.studioUniversal, category: 'Películas', streamUrl: 'pj:studio-universal' },
  // Documentales
  { id: '79', slug: 'discovery-channel', name: 'Discovery', logo: LOGOS.discovery, category: 'Documentales', streamUrl: 'pj:discovery-channel' },
  { id: '102', slug: 'history', name: 'History', logo: LOGOS.history, category: 'Documentales', streamUrl: 'pj:history' },
  { id: '108', slug: 'national-geographic', name: 'Nat Geo', logo: LOGOS.natGeo, category: 'Documentales', streamUrl: 'pj:national-geographic' },
  { id: '70', slug: 'a-e', name: 'A&E', logo: LOGOS.aAndE, category: 'Documentales', streamUrl: 'pj:a-e' },
  { id: '73', slug: 'animal-planet', name: 'Animal Planet', logo: LOGOS.animalPlanet, category: 'Documentales', streamUrl: 'pj:animal-planet' },
  { id: '81', slug: 'discovery-id', name: 'Discovery ID', logo: LOGOS.discoveryId, category: 'Documentales', streamUrl: 'pj:discovery-id' },
  // Infantil
  { id: '75', slug: 'cartoon-network', name: 'Cartoon Network', logo: LOGOS.cartoonNetwork, category: 'Infantil', streamUrl: 'pj:cartoon-network' },
  { id: '82', slug: 'discovery-kids', name: 'Discovery Kids', logo: LOGOS.discoveryKids, category: 'Infantil', streamUrl: 'pj:discovery-kids' },
  { id: '88', slug: 'disney-channel', name: 'Disney Channel', logo: LOGOS.disney, category: 'Infantil', streamUrl: 'pj:disney-channel' },
  { id: '89', slug: 'disney-jr', name: 'Disney JR', logo: LOGOS.disneyJr, category: 'Infantil', streamUrl: 'pj:disney-jr' },
  { id: '110', slug: 'nick', name: 'Nickelodeon', logo: LOGOS.nick, category: 'Infantil', streamUrl: 'pj:nick' },
  { id: '111', slug: 'nick-jr', name: 'Nick Jr', logo: LOGOS.nickJr, category: 'Infantil', streamUrl: 'pj:nick-jr' },
  { id: '45', slug: 'paka-paka', name: 'Paka Paka', logo: LOGOS.pakaPaka, category: 'Infantil', streamUrl: 'pj:paka-paka' },
  { id: '76', slug: 'cartoonito', name: 'Cartoonito', logo: LOGOS.cartoonito, category: 'Infantil', streamUrl: 'pj:cartoonito' },
  // Música
  { id: '106', slug: 'mtv', name: 'MTV', logo: LOGOS.mtv, category: 'Musicales', streamUrl: 'pj:mtv' },
  // Noticias internacionales
  { id: '127', slug: 'france-24-espanol', name: 'France 24', logo: LOGOS.france24, category: 'Internacional', streamUrl: 'pj:france-24-espanol' },
  { id: '66', slug: 'dw', name: 'DW', logo: LOGOS.dw, category: 'Internacional', streamUrl: 'pj:dw' },
  { id: '136', slug: 'rt-en-espanol', name: 'RT', logo: LOGOS.rt, category: 'Internacional', streamUrl: 'pj:rt-en-espanol' },
];

const CATEGORY_ICONS: Record<string, string> = {
  'Deportes': '⚽',
  'Noticias': '📰',
  'Entretenimiento': '🎭',
  'Películas': '🎬',
  'Documentales': '🔬',
  'Infantil': '🧸',
  'Musicales': '🎵',
  'Internacional': '🌍',
};

const BASE_URL = 'https://techphantomarg.netlify.app';

function goToChannel(slug: string) {
  // Navegamos a la app principal con el canal seleccionado via query param
  // La app ya maneja ?canal=ID, así que usamos el slug mapeado a ID
  const ch = CHANNELS.find(c => c.slug === slug);
  if (!ch) return;
  window.location.href = `${BASE_URL}?canal=${ch.id}`;
}

function ChannelButton({ channel }: { channel: Channel }) {
  const [imgError, setImgError] = useState(false);

  return (
    <button
      className="rc-ch-btn"
      onClick={() => goToChannel(channel.slug)}
      title={channel.name}
    >
      <div className="rc-ch-logo-wrap">
        {!imgError ? (
          <img
            src={channel.logo}
            alt={channel.name}
            onError={() => setImgError(true)}
            className="rc-ch-logo"
          />
        ) : (
          <span className="rc-ch-initials">
            {channel.name.slice(0, 2).toUpperCase()}
          </span>
        )}
      </div>
      <span className="rc-ch-name">{channel.name}</span>
      <span className="rc-ch-live-dot" />
    </button>
  );
}

export function RemoteControl() {
  const [activeCategory, setActiveCategory] = useState<string>('Todos');
  const [search, setSearch] = useState('');

  const categories = useMemo(() => {
    const cats = Array.from(new Set(CHANNELS.map(c => c.category)));
    return ['Todos', ...cats];
  }, []);

  const filtered = useMemo(() => {
    return CHANNELS.filter(ch => {
      const matchCat = activeCategory === 'Todos' || ch.category === activeCategory;
      const matchSearch = !search || ch.name.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [activeCategory, search]);

  const grouped = useMemo(() => {
    if (activeCategory !== 'Todos') return { [activeCategory]: filtered };
    return filtered.reduce<Record<string, Channel[]>>((acc, ch) => {
      if (!acc[ch.category]) acc[ch.category] = [];
      acc[ch.category].push(ch);
      return acc;
    }, {});
  }, [filtered, activeCategory]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Bebas+Neue&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: #060608;
          font-family: 'Rajdhani', sans-serif;
          color: #e8f4ff;
          overscroll-behavior: none;
        }

        .rc-root {
          min-height: 100vh;
          background: #060608;
          position: relative;
        }

        /* Animated grid background */
        .rc-root::before {
          content: '';
          position: fixed; inset: 0;
          background-image:
            linear-gradient(rgba(0,200,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,200,255,0.03) 1px, transparent 1px);
          background-size: 32px 32px;
          pointer-events: none; z-index: 0;
          animation: rc-pan 16s linear infinite;
        }
        @keyframes rc-pan { to { background-position: 32px 32px; } }

        /* Header */
        .rc-header {
          position: sticky; top: 0; z-index: 100;
          background: linear-gradient(180deg, rgba(6,6,8,0.99) 0%, rgba(6,6,8,0.92) 100%);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(0,200,255,0.12);
          padding: 12px 16px 0;
        }
        .rc-header::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, #00c8ff 40%, #00c8ff 60%, transparent);
          opacity: 0.6;
        }

        .rc-header-top {
          display: flex; align-items: center; gap: 10px;
          margin-bottom: 10px;
        }

        .rc-logo {
          width: 30px; height: 30px; border-radius: 50%; object-fit: cover;
          border: 1px solid rgba(0,200,255,0.4);
          box-shadow: 0 0 10px rgba(0,200,255,0.25);
          flex-shrink: 0;
        }
        .rc-brand {
          font-family: 'Bebas Neue', cursive;
          font-size: 1.35rem; letter-spacing: 0.12em;
          color: #e8f4ff; line-height: 1;
          text-shadow: 0 0 16px rgba(0,200,255,0.3);
        }
        .rc-brand span { color: #00c8ff; }

        .rc-badge {
          margin-left: auto;
          display: flex; align-items: center; gap: 5px;
          background: rgba(0,200,255,0.08);
          border: 1px solid rgba(0,200,255,0.25);
          border-radius: 4px;
          padding: 4px 9px;
          font-size: 0.65rem; font-weight: 700;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: #00c8ff;
        }
        .rc-live-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: #00c8ff; box-shadow: 0 0 6px #00c8ff;
          animation: rc-pulse 1.4s ease-in-out infinite;
        }
        @keyframes rc-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.3;transform:scale(0.5)} }

        /* Search */
        .rc-search-wrap {
          position: relative; margin-bottom: 10px;
        }
        .rc-search {
          width: 100%; background: rgba(0,200,255,0.04);
          border: 1px solid rgba(0,200,255,0.12);
          border-radius: 8px; color: #e8f4ff;
          font-family: 'Rajdhani', sans-serif; font-size: 0.95rem; font-weight: 500;
          padding: 9px 36px 9px 14px; outline: none;
          transition: border-color 0.2s, background 0.2s;
        }
        .rc-search::placeholder { color: #2a3a4a; }
        .rc-search:focus {
          border-color: rgba(0,200,255,0.4);
          background: rgba(0,200,255,0.07);
          box-shadow: 0 0 0 3px rgba(0,200,255,0.07);
        }
        .rc-search-clear {
          position: absolute; right: 10px; top: 50%; transform: translateY(-50%);
          background: none; border: none; color: rgba(0,200,255,0.3);
          font-size: 1rem; cursor: pointer; line-height: 1; padding: 2px;
          transition: color 0.2s;
        }
        .rc-search-clear:hover { color: #00c8ff; }

        /* Category pills */
        .rc-pills {
          display: flex; gap: 6px;
          overflow-x: auto; scrollbar-width: none;
          padding-bottom: 11px;
        }
        .rc-pills::-webkit-scrollbar { display: none; }
        .rc-pill {
          flex-shrink: 0;
          display: flex; align-items: center; gap: 4px;
          padding: 5px 11px; border-radius: 3px;
          border: 1px solid rgba(0,200,255,0.08);
          background: rgba(0,200,255,0.02);
          color: #3a5a6a;
          font-size: 0.7rem; font-weight: 700;
          letter-spacing: 0.07em; text-transform: uppercase;
          font-family: 'Rajdhani', sans-serif;
          cursor: pointer; transition: all 0.18s; white-space: nowrap;
          -webkit-tap-highlight-color: transparent;
        }
        .rc-pill:hover { border-color: rgba(0,200,255,0.28); color: #80c0d8; }
        .rc-pill.active {
          background: rgba(0,200,255,0.12);
          border-color: rgba(0,200,255,0.5);
          color: #00c8ff; font-weight: 700;
          box-shadow: 0 0 10px rgba(0,200,255,0.1);
        }

        /* Main */
        .rc-main {
          padding: 16px 14px 80px;
          position: relative; z-index: 1;
        }

        /* Group */
        .rc-group { margin-bottom: 24px; }
        .rc-group-title {
          display: flex; align-items: center; gap: 7px;
          font-family: 'Bebas Neue', cursive;
          font-size: 1.1rem; letter-spacing: 0.1em;
          color: #e8f4ff; margin-bottom: 12px;
          border-bottom: 1px solid rgba(0,200,255,0.08);
          padding-bottom: 7px;
        }
        .rc-group-title-icon { font-size: 1rem; }
        .rc-group-count {
          margin-left: auto;
          font-size: 0.6rem; color: rgba(0,200,255,0.35);
          font-weight: 700; letter-spacing: 0.12em;
          font-family: 'Rajdhani', sans-serif;
          text-transform: uppercase;
        }

        /* Channel grid */
        .rc-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
        }

        /* Channel button */
        .rc-ch-btn {
          position: relative;
          display: flex; flex-direction: column;
          align-items: center; gap: 6px;
          background: #0b0b14;
          border: 1px solid rgba(0,200,255,0.08);
          border-radius: 10px;
          padding: 12px 8px 10px;
          cursor: pointer;
          transition: transform 0.2s cubic-bezier(0.34,1.56,0.64,1),
                      border-color 0.2s, box-shadow 0.2s, background 0.2s;
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
          width: 100%;
        }
        .rc-ch-btn::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 1px;
          border-radius: 10px 10px 0 0;
          background: linear-gradient(90deg, transparent, rgba(0,200,255,0.5), transparent);
          opacity: 0; transition: opacity 0.2s;
        }
        .rc-ch-btn:hover, .rc-ch-btn:active {
          transform: scale(0.96);
          border-color: rgba(0,200,255,0.4);
          background: #0e0e1a;
          box-shadow: 0 8px 24px rgba(0,0,0,0.6), 0 0 14px rgba(0,200,255,0.08);
        }
        .rc-ch-btn:hover::before, .rc-ch-btn:active::before { opacity: 1; }

        .rc-ch-logo-wrap {
          width: 48px; height: 48px;
          display: flex; align-items: center; justify-content: center;
          background: rgba(255,255,255,0.03);
          border-radius: 8px;
          overflow: hidden;
          flex-shrink: 0;
        }
        .rc-ch-logo {
          width: 100%; height: 100%;
          object-fit: contain; padding: 6px;
          filter: brightness(0.95) saturate(0.9);
          transition: filter 0.2s;
        }
        .rc-ch-btn:hover .rc-ch-logo,
        .rc-ch-btn:active .rc-ch-logo {
          filter: brightness(1.05) saturate(1.1);
        }
        .rc-ch-initials {
          font-family: 'Bebas Neue', cursive;
          font-size: 1.1rem; color: rgba(0,200,255,0.7);
          letter-spacing: 0.05em;
        }

        .rc-ch-name {
          font-size: 0.68rem; font-weight: 700;
          color: #8aaaba; letter-spacing: 0.04em;
          text-align: center; line-height: 1.2;
          max-width: 100%; overflow: hidden;
          text-overflow: ellipsis; white-space: nowrap;
          width: 100%;
          font-family: 'Rajdhani', sans-serif;
        }

        .rc-ch-live-dot {
          position: absolute; top: 7px; right: 7px;
          width: 5px; height: 5px; border-radius: 50%;
          background: #00c8ff; opacity: 0.5;
          box-shadow: 0 0 4px #00c8ff;
          animation: rc-pulse 2s ease-in-out infinite;
        }

        /* Empty */
        .rc-empty {
          text-align: center; padding: 48px 16px;
          color: #3a5a6a; font-weight: 600;
          font-size: 0.9rem; letter-spacing: 0.05em;
        }

        /* Footer */
        .rc-footer {
          position: fixed; bottom: 0; left: 0; right: 0;
          background: rgba(6,6,8,0.95);
          border-top: 1px solid rgba(0,200,255,0.08);
          backdrop-filter: blur(12px);
          text-align: center;
          padding: 10px 16px;
          font-size: 0.65rem; color: #2a3a4a;
          font-weight: 600; letter-spacing: 0.1em;
          text-transform: uppercase; z-index: 100;
        }
        .rc-footer a {
          color: rgba(0,200,255,0.4);
          text-decoration: none;
          transition: color 0.2s;
        }
        .rc-footer a:hover { color: #00c8ff; }
      `}</style>

      <div className="rc-root">
        <header className="rc-header">
          <div className="rc-header-top">
            <img
              className="rc-logo"
              src="https://i.postimg.cc/j2WvZw96/Whats-App-Image-2026-03-02-at-11-44-07.jpg"
              alt="TechPhantom"
            />
            <span className="rc-brand"><span>Tech</span>Phantom</span>
            <div className="rc-badge">
              <span className="rc-live-dot" />
              Control Remoto
            </div>
          </div>

          <div className="rc-search-wrap">
            <input
              className="rc-search"
              type="text"
              placeholder="Buscar canal…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button className="rc-search-clear" onClick={() => setSearch('')}>✕</button>
            )}
          </div>

          <div className="rc-pills">
            {categories.map(cat => (
              <button
                key={cat}
                className={`rc-pill ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {CATEGORY_ICONS[cat] ?? ''} {cat}
              </button>
            ))}
          </div>
        </header>

        <main className="rc-main">
          {Object.keys(grouped).length === 0 ? (
            <div className="rc-empty">Sin resultados para "{search}"</div>
          ) : (
            Object.entries(grouped).map(([cat, chList]) => (
              <div key={cat} className="rc-group">
                <div className="rc-group-title">
                  <span className="rc-group-title-icon">{CATEGORY_ICONS[cat] ?? '📺'}</span>
                  {cat}
                  <span className="rc-group-count">{chList.length} canales</span>
                </div>
                <div className="rc-grid">
                  {chList.map(ch => (
                    <ChannelButton key={ch.id} channel={ch} />
                  ))}
                </div>
              </div>
            ))
          )}
        </main>

        <footer className="rc-footer">
          Control remoto · <a href={BASE_URL}>TechPhantom</a>
        </footer>
      </div>
    </>
  );
}