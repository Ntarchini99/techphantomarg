import { useState, useMemo } from 'react';
import { Play, Film, Star, Clock, ChevronLeft, ChevronRight, Search, X, ExternalLink, ArrowLeft } from 'lucide-react';

export interface PlutoMovie {
  id: string;
  slug: string;
  title: string;
  year: number;
  genre: string;
  rating: string;
  duration: string;
  description: string;
  poster: string;
  imdb?: string;
}

const PLUTO_MOVIE = (slug: string) => `https://pluto.tv/on-demand/movies/${slug}`;

// Posters via https://image.tmdb.org/t/p/w500{path} — paths verificados manualmente
export const plutoMovies: PlutoMovie[] = [
  // ── Acción ─────────────────────────────────────────────────────────────────
  {
    id:'1', slug:'die-hard-1988-1-1', title:'Die Hard', year:1988, genre:'Acción', rating:'R', duration:'2h 11m', imdb:'8.2',
    description:'Un detective de Nueva York enfrenta a terroristas en un rascacielos de L.A. en Nochebuena.',
    poster:'https://image.tmdb.org/t/p/w500/yFihWxQcmqcaBR31QM6Y8gT6aYV.jpg',
  },
  {
    id:'2', slug:'die-hard-2-1990-1-1', title:'Die Hard 2', year:1990, genre:'Acción', rating:'R', duration:'2h 4m', imdb:'7.1',
    description:'John McClane lucha por salvar a su esposa cuando terroristas toman el aeropuerto Dulles.',
    poster:'https://image.tmdb.org/t/p/w500/6p9YDOoQXhgBi5RHOLfmX4UzE2U.jpg',
  },
  {
    id:'3', slug:'robocop-1987-1-1', title:'RoboCop', year:1987, genre:'Acción', rating:'R', duration:'1h 42m', imdb:'7.5',
    description:'Un policía asesinado y resucitado como cyborg lucha contra el crimen y descubre su pasado.',
    poster:'https://image.tmdb.org/t/p/w500/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg',
  },
  {
    id:'4', slug:'speed-1994-1-1', title:'Speed', year:1994, genre:'Acción', rating:'R', duration:'1h 56m', imdb:'7.3',
    description:'Un autobús bomba explotará si baja de 50 mph. Keanu Reeves y Sandra Bullock deben detenerlo.',
    poster:'https://image.tmdb.org/t/p/w500/mFMvBVsNGDJQf7MaBJpqMrEbHH2.jpg',
  },
  {
    id:'5', slug:'true-lies-1994-1-1', title:'True Lies', year:1994, genre:'Acción', rating:'R', duration:'2h 21m', imdb:'7.2',
    description:'Un agente secreto debe salvar al mundo mientras intenta salvar su matrimonio.',
    poster:'https://image.tmdb.org/t/p/w500/mUSdxrBpKqZc5hsTiybVXhc3Vcu.jpg',
  },
  {
    id:'6', slug:'lethal-weapon-1987-1-1', title:'Arma Mortal', year:1987, genre:'Acción', rating:'R', duration:'1h 50m', imdb:'7.6',
    description:'Dos detectives de L.A. muy diferentes forman una inesperada pero efectiva pareja.',
    poster:'https://image.tmdb.org/t/p/w500/fgMDORG8maPcFRuU9pDFVxFIPmr.jpg',
  },
  {
    id:'7', slug:'beverly-hills-cop-1984-1-1', title:'Superdetective en H.B.', year:1984, genre:'Acción', rating:'R', duration:'1h 45m', imdb:'7.3',
    description:'Un detective de Detroit viaja a Beverly Hills para investigar el asesinato de su amigo.',
    poster:'https://image.tmdb.org/t/p/w500/nOUPgBFJpLFSxGFN2R0IgWzl5ur.jpg',
  },
  {
    id:'8', slug:'total-recall-1990-1-1', title:'Total Recall', year:1990, genre:'Acción', rating:'R', duration:'1h 53m', imdb:'7.5',
    description:'Un obrero descubre que sus memorias son falsas y que en realidad es un espía encubierto.',
    poster:'https://image.tmdb.org/t/p/w500/yAybOHVSVw1MImHpUmNAB0IFa9X.jpg',
  },
  {
    id:'9', slug:'predator-1987-1-1', title:'Predator', year:1987, genre:'Acción', rating:'R', duration:'1h 47m', imdb:'7.8',
    description:'Un equipo de élite comandado por Arnold Schwarzenegger es cazado por un alienígena en la selva.',
    poster:'https://image.tmdb.org/t/p/w500/jHnkMJSvHJDwjUGGoMmVgdpFSiH.jpg',
  },
  {
    id:'10', slug:'the-rock-1996-1-1', title:'La Roca', year:1996, genre:'Acción', rating:'R', duration:'2h 16m', imdb:'7.4',
    description:'Alcatraz es tomada por ex-marines. Nicolas Cage y Sean Connery deben neutralizar la amenaza.',
    poster:'https://image.tmdb.org/t/p/w500/csPmfLQHn9U0SEZCkk9UFXkF6Pk.jpg',
  },
  // ── Sci-Fi ──────────────────────────────────────────────────────────────────
  {
    id:'11', slug:'the-fifth-element-1997-1-1', title:'El Quinto Elemento', year:1997, genre:'Sci-Fi', rating:'PG-13', duration:'2h 6m', imdb:'7.6',
    description:'En el siglo XXIII, un taxista se convierte en el último salvavidas del universo.',
    poster:'https://image.tmdb.org/t/p/w500/fPtlCO1yQtnoLFrWMoBpBJnFRud.jpg',
  },
  {
    id:'12', slug:'stargate-1994-1-1', title:'Stargate', year:1994, genre:'Sci-Fi', rating:'PG-13', duration:'1h 56m', imdb:'7.1',
    description:'Una puerta estelar conecta la Tierra con un planeta dominado por un falso dios egipcio.',
    poster:'https://image.tmdb.org/t/p/w500/s6k7GVmifCjEqXfDKiW0dCFvKFp.jpg',
  },
  {
    id:'13', slug:'the-terminator-1984-1-1', title:'Terminator', year:1984, genre:'Sci-Fi', rating:'R', duration:'1h 47m', imdb:'8.1',
    description:'Un cyborg asesino viaja al pasado para eliminar a la madre del futuro líder de la resistencia.',
    poster:'https://image.tmdb.org/t/p/w500/qvktm0BHcnmDpul4Hz01GIazWPr.jpg',
  },
  {
    id:'14', slug:'independence-day-1996-1-1', title:'Día de la Independencia', year:1996, genre:'Sci-Fi', rating:'PG-13', duration:'2h 25m', imdb:'7.0',
    description:'La humanidad enfrenta la mayor invasión alienígena de la historia el 4 de julio.',
    poster:'https://image.tmdb.org/t/p/w500/v3DpnMBSHY9sT2OlRWA6FO0ZCZE.jpg',
  },
  {
    id:'15', slug:'universal-soldier-1992-1-1', title:'Soldado Universal', year:1992, genre:'Sci-Fi', rating:'R', duration:'1h 42m', imdb:'5.7',
    description:'Dos soldados muertos en Vietnam son resucitados como supersoldados androides.',
    poster:'https://image.tmdb.org/t/p/w500/g8qdRt24MNHtFMnTFqhXXRMYxkT.jpg',
  },
  // ── Thriller ────────────────────────────────────────────────────────────────
  {
    id:'16', slug:'la-confidential-1997-1-1', title:'L.A. Confidential', year:1997, genre:'Thriller', rating:'R', duration:'2h 18m', imdb:'8.2',
    description:'Tres policías de Los Ángeles investigan una conspiración de corrupción en los años 50.',
    poster:'https://image.tmdb.org/t/p/w500/n4GJFGzsc7NinI1VeGDXIcQjtU2.jpg',
  },
  {
    id:'17', slug:'se7en-1995-1-1', title:'Se7en', year:1995, genre:'Thriller', rating:'R', duration:'2h 7m', imdb:'8.6',
    description:'Dos detectives persiguen a un asesino que usa los siete pecados capitales como motivo.',
    poster:'https://image.tmdb.org/t/p/w500/6yoghtyTpznpBik8EngEmJskVUO.jpg',
  },
  {
    id:'18', slug:'the-usual-suspects-1995-1-1', title:'Sospechosos de Siempre', year:1995, genre:'Thriller', rating:'R', duration:'1h 46m', imdb:'8.5',
    description:'Un interrogatorio revela la historia de cinco criminales y el misterioso Kaiser Soze.',
    poster:'https://image.tmdb.org/t/p/w500/eFBvqqMHRHNrBbFPHvJFRQHRCNF.jpg',
  },
  {
    id:'19', slug:'heat-1995-1-1', title:'Heat', year:1995, genre:'Thriller', rating:'R', duration:'2h 50m', imdb:'8.3',
    description:'Un detective obsesionado persigue a un maestro ladrón en una confrontación épica en L.A.',
    poster:'https://image.tmdb.org/t/p/w500/rrGCMAfTBsKCnlJ7SKpvBbBfJlh.jpg',
  },
  {
    id:'20', slug:'training-day-2001-1-1', title:'Training Day', year:2001, genre:'Thriller', rating:'R', duration:'2h 2m', imdb:'7.7',
    description:'Un novato aprende las reglas corruptas de las calles de Los Ángeles de su veterano mentor.',
    poster:'https://image.tmdb.org/t/p/w500/yjReg4bUF6iBEJIU2PuOCj5WUHB.jpg',
  },
  {
    id:'39', slug:'chinatown-1974-1-1', title:'Chinatown', year:1974, genre:'Thriller', rating:'R', duration:'2h 10m', imdb:'8.1',
    description:'Un detective privado de L.A. descubre una conspiración más profunda de lo esperado.',
    poster:'https://image.tmdb.org/t/p/w500/2rcHMej1yJjPZNIHYKaFRVsOgwS.jpg',
  },
  // ── Drama ───────────────────────────────────────────────────────────────────
  {
    id:'21', slug:'rocky-1976-1-1', title:'Rocky', year:1976, genre:'Drama', rating:'PG', duration:'1h 59m', imdb:'8.1',
    description:'Un boxeador de segunda categoría consigue una oportunidad de combatir al campeón mundial.',
    poster:'https://image.tmdb.org/t/p/w500/2vmMOMCLGlRxHxwsWfcJM15oJy0.jpg',
  },
  {
    id:'22', slug:'scarface-1983-1-1', title:'Scarface', year:1983, genre:'Drama', rating:'R', duration:'2h 50m', imdb:'8.3',
    description:'Un inmigrante cubano construye un impero criminal en Miami hasta su trágica caída.',
    poster:'https://image.tmdb.org/t/p/w500/iQ5ztdjvteGeboxtmRdXEChJOHh.jpg',
  },
  {
    id:'23', slug:'goodfellas-1990-1-1', title:'Buenos Muchachos', year:1990, genre:'Drama', rating:'R', duration:'2h 26m', imdb:'8.7',
    description:'Un aspirante a mafioso asciende en las filas del crimen organizado en Nueva York.',
    poster:'https://image.tmdb.org/t/p/w500/aKuFiU82s5ISJpGZp7YkIr3kCUd.jpg',
  },
  {
    id:'24', slug:'the-godfather-1972-1-1', title:'El Padrino', year:1972, genre:'Drama', rating:'R', duration:'2h 55m', imdb:'9.2',
    description:'El patriarca de una familia mafiosa transfiere el control de su imperio a su reticente hijo.',
    poster:'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsLLeHCm3zJyp.jpg',
  },
  {
    id:'25', slug:'casino-1995-1-1', title:'Casino', year:1995, genre:'Drama', rating:'R', duration:'2h 59m', imdb:'8.2',
    description:'Las historias de un apostador, su esposa y un matón en los casinos de Las Vegas.',
    poster:'https://image.tmdb.org/t/p/w500/9dHBKyxQQtIiUA8sQ5ib5nkotDP.jpg',
  },
  {
    id:'26', slug:'taxi-driver-1976-1-1', title:'Taxi Driver', year:1976, genre:'Drama', rating:'R', duration:'1h 54m', imdb:'8.2',
    description:'Un veterano de Vietnam trabaja de taxista nocturno en el Nueva York más oscuro.',
    poster:'https://image.tmdb.org/t/p/w500/ekstpH614fwDX8DUln1a2Opz0N8.jpg',
  },
  // ── Comedia ─────────────────────────────────────────────────────────────────
  {
    id:'27', slug:'coming-to-america-1988-1-1', title:'Un Príncipe en N.Y.', year:1988, genre:'Comedia', rating:'R', duration:'1h 56m', imdb:'6.9',
    description:'Un príncipe africano viaja a Nueva York para encontrar una esposa independiente.',
    poster:'https://image.tmdb.org/t/p/w500/t0e27SYkTFNBHZhJKajfS5uFq6C.jpg',
  },
  {
    id:'28', slug:'airplane-1980-1-1', title:'¿Y Dónde Está el Piloto?', year:1980, genre:'Comedia', rating:'PG', duration:'1h 28m', imdb:'7.7',
    description:'Un pasajero fóbico debe aterrizar un avión cuando la tripulación queda incapacitada.',
    poster:'https://image.tmdb.org/t/p/w500/qNOjPqgnqOZGf7HpkCiMC2QYNXN.jpg',
  },
  {
    id:'29', slug:'back-to-the-future-1985-1-1', title:'Volver al Futuro', year:1985, genre:'Comedia', rating:'PG', duration:'1h 56m', imdb:'8.5',
    description:'Un adolescente viaja al 1955 en un DeLorean y debe lograr que sus padres se enamoren.',
    poster:'https://image.tmdb.org/t/p/w500/fNOH9f1aA7XRTzl1sAOx9iF553Q.jpg',
  },
  {
    id:'30', slug:'ghostbusters-1984-1-1', title:'Los Cazafantasmas', year:1984, genre:'Comedia', rating:'PG', duration:'1h 45m', imdb:'7.8',
    description:'Tres parapsicólogos crean una empresa cazadora de fantasmas en Nueva York.',
    poster:'https://image.tmdb.org/t/p/w500/uMeJeO8l5vwD9WarYqGLaOFn8yz.jpg',
  },
  {
    id:'31', slug:'ferris-buellers-day-off-1986-1-1', title:"Ferris Bueller's Day Off", year:1986, genre:'Comedia', rating:'PG-13', duration:'1h 43m', imdb:'7.8',
    description:'Un adolescente convence a sus amigos de faltar a clase para vivir una aventura en Chicago.',
    poster:'https://image.tmdb.org/t/p/w500/Ci4GC11nSquKNKpBiJAXkHGJcsR.jpg',
  },
  // ── Terror ──────────────────────────────────────────────────────────────────
  {
    id:'32', slug:'halloween-1978-1-1', title:'Halloween', year:1978, genre:'Terror', rating:'R', duration:'1h 31m', imdb:'7.7',
    description:'Un asesino en serie escapa del manicomio y regresa a su pueblo para continuar matando.',
    poster:'https://image.tmdb.org/t/p/w500/qVpCaBcnjECehWME1lFa1w5Kz8.jpg',
  },
  {
    id:'33', slug:'a-nightmare-on-elm-street-1984-1-1', title:'Pesadilla en Elm Street', year:1984, genre:'Terror', rating:'R', duration:'1h 31m', imdb:'7.4',
    description:'Freddy Krueger acecha a adolescentes en sus sueños para matarlos en la realidad.',
    poster:'https://image.tmdb.org/t/p/w500/hXqhGaEzpDZYQYK8GYQpHpFSsHd.jpg',
  },
  {
    id:'34', slug:'friday-the-13th-1980-1-1', title:'Viernes 13', year:1980, genre:'Terror', rating:'R', duration:'1h 35m', imdb:'6.4',
    description:'Un grupo de monitores de campamento son asesinados misteriosamente en Crystal Lake.',
    poster:'https://image.tmdb.org/t/p/w500/HtE3xZyM7oFBqjjphoGFMDBSySy.jpg',
  },
  {
    id:'35', slug:'the-thing-1982-1-1', title:'La Cosa', year:1982, genre:'Terror', rating:'R', duration:'1h 49m', imdb:'8.2',
    description:'Una criatura alienígena capaz de imitar cualquier forma de vida ataca una base antártica.',
    poster:'https://image.tmdb.org/t/p/w500/tzGY49kseSE9QAKk47uuDGwnSCu.jpg',
  },
  {
    id:'36', slug:'the-shining-1980-1-1', title:'El Resplandor', year:1980, genre:'Terror', rating:'R', duration:'2h 26m', imdb:'8.4',
    description:'Un escritor y su familia pasan el invierno en un hotel aislado con un oscuro pasado.',
    poster:'https://image.tmdb.org/t/p/w500/xazWoLealQwEgqZ89MLZklLZD3k.jpg',
  },
  // ── Western ─────────────────────────────────────────────────────────────────
  {
    id:'37', slug:'the-good-the-bad-and-the-ugly-1966-1-1', title:'El Bueno, El Malo y El Feo', year:1966, genre:'Western', rating:'R', duration:'2h 58m', imdb:'8.8',
    description:'Tres hombres compiten por un tesoro enterrado en plena Guerra Civil americana.',
    poster:'https://image.tmdb.org/t/p/w500/bX2xnavhMYjWDoZp1VM6VnU1xwe.jpg',
  },
  {
    id:'38', slug:'tombstone-1993-1-1', title:'Tombstone', year:1993, genre:'Western', rating:'R', duration:'2h 10m', imdb:'7.8',
    description:'Wyatt Earp y Doc Holliday se enfrentan a los Cowboys en Tombstone, Arizona.',
    poster:'https://image.tmdb.org/t/p/w500/7VbwP3HhIBcCpP6VOjHLxbOrP0p.jpg',
  },
  {
    id:'40', slug:'the-outlaw-josey-wales-1976-1-1', title:'El Fuera de la Ley', year:1976, genre:'Western', rating:'PG', duration:'2h 15m', imdb:'7.9',
    description:'Un granjero busca venganza tras la muerte de su familia durante la Guerra Civil.',
    poster:'https://image.tmdb.org/t/p/w500/wXqOcLqvZGPOliRCxMFr5fKbz4f.jpg',
  },
];

const GENRES = ['Todos', 'Acción', 'Sci-Fi', 'Thriller', 'Drama', 'Comedia', 'Terror', 'Western'];
const MOVIES_PER_PAGE = 24;

// SVG fallback inline — se muestra si el poster falla
const FALLBACK = (title: string) => {
  const initials = title.replace(/[^a-zA-Z ]/g, '').split(' ').slice(0, 2).map(w => w[0] ?? '').join('').toUpperCase();
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="300">
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0a0a18"/>
          <stop offset="100%" stop-color="#0f1824"/>
        </linearGradient>
      </defs>
      <rect width="200" height="300" fill="url(#g)"/>
      <rect x="0" y="0" width="200" height="2" fill="#00c8ff" opacity="0.5"/>
      <rect x="0" y="298" width="200" height="2" fill="#00c8ff" opacity="0.2"/>
      <text x="100" y="138" font-family="Arial" font-size="52" fill="#00c8ff" text-anchor="middle" opacity="0.18">🎬</text>
      <text x="100" y="185" font-family="Arial Black,Arial" font-size="38" fill="#00c8ff" text-anchor="middle" opacity="0.55" font-weight="bold">${initials}</text>
    </svg>`
  )}`;
};

// ─── MovieCard ────────────────────────────────────────────────────────────────
function MovieCard({ movie, onClick }: { movie: PlutoMovie; onClick: () => void }) {
  const [errored, setErrored] = useState(false);

  return (
    <div className="mv-card" onClick={onClick}>
      <div className="mv-poster-wrap">
        <img
          src={errored ? FALLBACK(movie.title) : movie.poster}
          alt={movie.title}
          loading="lazy"
          decoding="async"
          crossOrigin="anonymous"
          onError={() => setErrored(true)}
        />
        <div className="mv-poster-grad" />
        <span className="mv-badge mv-badge-rating">{movie.rating}</span>
        <span className="mv-badge mv-badge-year">{movie.year}</span>
        <div className="mv-play-wrap">
          <div className="mv-play-btn"><Play size={20} color="#060608" fill="#060608" /></div>
        </div>
      </div>
      <div className="mv-card-body">
        <div className="mv-title">{movie.title}</div>
        <div className="mv-meta-row">
          <Clock size={9} style={{flexShrink:0}}/>
          <span>{movie.duration}</span>
          {movie.imdb && (
            <span className="mv-imdb"><Star size={9} fill="#f5c518" color="#f5c518"/>{movie.imdb}</span>
          )}
        </div>
        <span className="mv-genre-pill">{movie.genre}</span>
      </div>
    </div>
  );
}

// ─── MovieModal ───────────────────────────────────────────────────────────────
function MovieModal({ movie, onClose }: { movie: PlutoMovie; onClose: () => void }) {
  const [errored, setErrored] = useState(false);
  const url = PLUTO_MOVIE(movie.slug);

  return (
    <div className="mv-overlay" onClick={onClose}>
      <div className="mv-modal" onClick={e => e.stopPropagation()}>
        <button className="mv-modal-close" onClick={onClose}>✕</button>

        {/* Hero */}
        <div className="mv-modal-hero">
          <img
            src={errored ? FALLBACK(movie.title) : movie.poster}
            alt={movie.title}
            crossOrigin="anonymous"
            onError={() => setErrored(true)}
          />
          <div className="mv-modal-hero-grad" />
          <div className="mv-modal-hero-info">
            <div className="mv-modal-thumb">
              <img src={errored ? FALLBACK(movie.title) : movie.poster} alt={movie.title} crossOrigin="anonymous" />
            </div>
            <div>
              <div className="mv-modal-title">{movie.title}</div>
              <div className="mv-modal-meta">
                <span className="mv-modal-rbadge">{movie.rating}</span>
                <span className="mv-modal-txt">{movie.year}</span>
                <span className="mv-modal-sep">·</span>
                <span className="mv-modal-txt" style={{display:'flex',alignItems:'center',gap:3}}><Clock size={10}/>{movie.duration}</span>
                {movie.imdb && <>
                  <span className="mv-modal-sep">·</span>
                  <span className="mv-modal-imdb"><Star size={10} fill="#f5c518" color="#f5c518"/>IMDb {movie.imdb}</span>
                </>}
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="mv-modal-body">
          <p className="mv-modal-desc">{movie.description}</p>
          <div className="mv-modal-cta">
            <a className="mv-cta-primary" href={url} target="_blank" rel="noopener noreferrer">
              <Play size={15} fill="currentColor"/> Ver en Pluto TV
            </a>
            <a className="mv-cta-sec" href={url} target="_blank" rel="noopener noreferrer">
              <ExternalLink size={13}/> Nueva pestaña
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MovieSection ─────────────────────────────────────────────────────────────
export function MovieSection({ onBack }: { onBack: () => void }) {
  const [search,        setSearch]        = useState('');
  const [activeGenre,   setActiveGenre]   = useState('Todos');
  const [currentPage,   setCurrentPage]   = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<PlutoMovie | null>(null);

  const filtered = useMemo(() => plutoMovies.filter(m => {
    const g = activeGenre === 'Todos' || m.genre === activeGenre;
    const s = !search || m.title.toLowerCase().includes(search.toLowerCase()) || m.description.toLowerCase().includes(search.toLowerCase());
    return g && s;
  }), [search, activeGenre]);

  const totalPages = Math.ceil(filtered.length / MOVIES_PER_PAGE);
  const paginated  = filtered.slice((currentPage - 1) * MOVIES_PER_PAGE, currentPage * MOVIES_PER_PAGE);

  const go = (p: number) => { setCurrentPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;400;500;600;700&family=Bebas+Neue&display=swap');

        /* ── Root bg ── */
        .mvs-root {
          min-height: 100vh; background: #060608;
          font-family: 'Rajdhani','Helvetica Neue',sans-serif; color: #e8f4ff; position: relative;
        }
        .mvs-root::before {
          content:''; position:fixed; inset:0; pointer-events:none; z-index:0;
          background-image:
            linear-gradient(rgba(0,200,255,0.025) 1px,transparent 1px),
            linear-gradient(90deg,rgba(0,200,255,0.025) 1px,transparent 1px);
          background-size:48px 48px;
          mask-image:radial-gradient(ellipse 100% 70% at 50% 0%,black 0%,transparent 80%);
          animation:mvs-pan 20s linear infinite;
        }
        @keyframes mvs-pan { 0%{background-position:0 0} 100%{background-position:48px 48px} }

        /* ── Header ── */
        .mvs-header {
          background:linear-gradient(180deg,rgba(6,6,8,0.98) 0%,rgba(6,6,8,0.88) 100%);
          backdrop-filter:blur(24px); border-bottom:1px solid rgba(0,200,255,0.1);
          position:sticky; top:0; z-index:50;
        }
        .mvs-header::before {
          content:''; position:absolute; top:0; left:0; right:0; height:1px;
          background:linear-gradient(90deg,transparent,rgba(0,200,255,0.55) 30%,rgba(0,200,255,0.55) 70%,transparent);
        }
        .mvs-header-row {
          max-width:1400px; margin:0 auto; padding:13px 24px;
          display:flex; align-items:center; gap:12px; flex-wrap:wrap;
        }

        /* back */
        .mvs-back {
          display:flex; align-items:center; gap:7px;
          background:rgba(0,200,255,0.06); border:1px solid rgba(0,200,255,0.15); border-radius:7px;
          color:#7aaaba; font-family:'Rajdhani',sans-serif; font-size:0.88rem; font-weight:600;
          letter-spacing:0.05em; padding:8px 13px; cursor:pointer; flex-shrink:0; transition:all 0.2s;
        }
        .mvs-back:hover { background:rgba(0,200,255,0.1); border-color:rgba(0,200,255,0.35); color:#00c8ff; }

        /* brand */
        .mvs-brand { display:flex; align-items:center; gap:8px; flex-shrink:0; }
        .mvs-brand img {
          width:30px; height:30px; border-radius:50%; object-fit:cover;
          border:1px solid rgba(0,200,255,0.4); box-shadow:0 0 10px rgba(0,200,255,0.2);
        }
        .mvs-brand-name {
          font-family:'Bebas Neue',cursive; font-size:1.5rem;
          letter-spacing:0.12em; color:#e8f4ff; line-height:1;
          text-shadow:0 0 20px rgba(0,200,255,0.35);
        }
        .mvs-brand-name .acc { color:#00c8ff; }

        /* divider */
        .mvs-vdiv { width:1px; height:26px; background:rgba(0,200,255,0.12); flex-shrink:0; }

        /* section title */
        .mvs-sec-title { display:flex; align-items:center; gap:9px; flex-shrink:0; }
        .mvs-film-icon {
          width:30px; height:30px; border-radius:7px;
          background:rgba(0,200,255,0.1); border:1px solid rgba(0,200,255,0.28);
          display:flex; align-items:center; justify-content:center;
        }
        .mvs-sec-title-txt {
          font-family:'Bebas Neue',cursive; font-size:1.4rem;
          letter-spacing:0.1em; color:#e8f4ff; line-height:1;
        }
        .mvs-free-badge {
          background:rgba(0,200,255,0.07); border:1px solid rgba(0,200,255,0.18);
          color:rgba(0,200,255,0.65); font-size:0.6rem; font-weight:700;
          letter-spacing:0.1em; padding:3px 8px; border-radius:3px;
          text-transform:uppercase; font-family:'Rajdhani',sans-serif;
        }

        /* search */
        .mvs-search-wrap { position:relative; flex:1; max-width:380px; min-width:160px; }
        .mvs-search-ico { position:absolute; left:12px; top:50%; transform:translateY(-50%); color:rgba(0,200,255,0.28); pointer-events:none; }
        .mvs-search {
          width:100%; background:rgba(0,200,255,0.04); border:1px solid rgba(0,200,255,0.12);
          border-radius:8px; color:#e8f4ff; font-family:'Rajdhani',sans-serif;
          font-size:0.9rem; font-weight:500; padding:9px 36px 9px 36px; outline:none; transition:all 0.25s;
        }
        .mvs-search::placeholder { color:#2a3a4a; }
        .mvs-search:focus { border-color:rgba(0,200,255,0.4); background:rgba(0,200,255,0.06); box-shadow:0 0 0 3px rgba(0,200,255,0.07); }
        .mvs-clear {
          position:absolute; right:10px; top:50%; transform:translateY(-50%);
          background:none; border:none; cursor:pointer; color:rgba(0,200,255,0.3);
          display:flex; align-items:center; transition:color 0.2s;
        }
        .mvs-clear:hover { color:#00c8ff; }

        /* genre pills row */
        .mvs-pills-row {
          max-width:1400px; margin:0 auto; padding:8px 24px 11px;
          display:flex; gap:6px; overflow-x:auto; scrollbar-width:none;
        }
        .mvs-pills-row::-webkit-scrollbar { display:none; }
        .mvs-pill {
          flex-shrink:0; padding:5px 13px; border-radius:3px;
          border:1px solid rgba(0,200,255,0.08); background:rgba(0,200,255,0.02);
          color:#3a5a6a; font-size:0.73rem; font-weight:600;
          font-family:'Rajdhani',sans-serif; letter-spacing:0.08em;
          cursor:pointer; transition:all 0.18s; white-space:nowrap; text-transform:uppercase;
        }
        .mvs-pill:hover { border-color:rgba(0,200,255,0.28); color:#80c0d8; background:rgba(0,200,255,0.04); }
        .mvs-pill.on { background:rgba(0,200,255,0.1); border-color:rgba(0,200,255,0.45); color:#00c8ff; font-weight:700; box-shadow:0 0 10px rgba(0,200,255,0.1); }

        /* ── Main ── */
        .mvs-main { max-width:1400px; margin:0 auto; padding:22px 24px 64px; position:relative; z-index:1; }

        /* info note */
        .mvs-note {
          background:rgba(0,200,255,0.025); border:1px solid rgba(0,200,255,0.08);
          border-radius:8px; padding:10px 15px; margin-bottom:18px;
          font-size:0.78rem; color:#4a6a7a; font-family:'Rajdhani',sans-serif; font-weight:500; line-height:1.55;
        }
        .mvs-note strong { color:rgba(0,200,255,0.6); font-weight:700; }

        /* heading */
        .mvs-heading-row { display:flex; align-items:baseline; gap:10px; margin-bottom:18px; }
        .mvs-heading {
          font-family:'Bebas Neue',cursive; font-size:1.45rem;
          letter-spacing:0.08em; color:#e8f4ff;
        }
        .mvs-count { font-size:0.7rem; color:rgba(0,200,255,0.4); font-weight:600; letter-spacing:0.12em; text-transform:uppercase; font-family:'Rajdhani',sans-serif; }

        /* grid — 6 cols en wide, se adapta */
        .mvs-grid {
          display:grid;
          grid-template-columns:repeat(auto-fill,minmax(148px,1fr));
          gap:14px;
        }

        /* pagination */
        .mvs-pager { display:flex; align-items:center; justify-content:center; gap:5px; margin-top:32px; }
        .mvs-pager-btn {
          min-width:34px; height:34px; display:flex; align-items:center; justify-content:center;
          background:rgba(0,200,255,0.03); border:1px solid rgba(0,200,255,0.1); border-radius:6px;
          color:#3a5a6a; font-family:'Rajdhani',sans-serif; font-size:0.83rem; font-weight:600;
          cursor:pointer; transition:all 0.18s; padding:0 5px;
        }
        .mvs-pager-btn:hover:not(:disabled) { border-color:rgba(0,200,255,0.35); color:#00c8ff; background:rgba(0,200,255,0.07); }
        .mvs-pager-btn.on { background:rgba(0,200,255,0.12); border-color:rgba(0,200,255,0.5); color:#00c8ff; font-weight:700; }
        .mvs-pager-btn:disabled { opacity:0.25; cursor:not-allowed; }
        .mvs-pager-info { text-align:center; margin-top:9px; font-size:0.68rem; color:rgba(0,200,255,0.28); letter-spacing:0.1em; text-transform:uppercase; font-family:'Rajdhani',sans-serif; }

        /* empty */
        .mvs-empty { text-align:center; padding:72px 20px; }
        .mvs-empty-icon {
          width:72px; height:72px; border-radius:50%; margin:0 auto 16px;
          background:rgba(0,200,255,0.03); border:1px solid rgba(0,200,255,0.08);
          display:flex; align-items:center; justify-content:center;
        }

        /* ── Card ── */
        .mv-card {
          cursor:pointer; background:#0b0b12; border:1px solid rgba(0,200,255,0.07);
          border-radius:7px; overflow:hidden; position:relative;
          transition:transform 0.25s cubic-bezier(0.34,1.56,0.64,1), border-color 0.2s, box-shadow 0.25s;
          font-family:'Rajdhani',sans-serif;
        }
        .mv-card:hover {
          transform:translateY(-5px) scale(1.02);
          border-color:rgba(0,200,255,0.35);
          box-shadow:0 18px 45px rgba(0,0,0,0.8),0 0 22px rgba(0,200,255,0.06);
        }
        .mv-card::before {
          content:''; position:absolute; top:0; left:0; right:0; height:1px;
          background:linear-gradient(90deg,transparent,rgba(0,200,255,0.6),transparent);
          opacity:0; z-index:5; transition:opacity 0.25s;
        }
        .mv-card:hover::before { opacity:1; }

        .mv-poster-wrap {
          position:relative; aspect-ratio:2/3; overflow:hidden;
          background:linear-gradient(135deg,#080810,#0f1824);
        }
        .mv-poster-wrap img {
          width:100%; height:100%; object-fit:cover; display:block;
          transition:transform 0.4s ease, filter 0.3s;
          filter:brightness(0.93) saturate(0.9);
        }
        .mv-card:hover .mv-poster-wrap img { transform:scale(1.06); filter:brightness(1) saturate(1.1); }

        .mv-poster-grad {
          position:absolute; inset:0;
          background:linear-gradient(180deg,transparent 50%,rgba(6,6,10,0.97) 100%);
          pointer-events:none;
        }

        .mv-badge {
          position:absolute; font-size:0.57rem; font-weight:700;
          padding:2px 6px; border-radius:3px; letter-spacing:0.07em;
          font-family:'Rajdhani',sans-serif; backdrop-filter:blur(4px);
        }
        .mv-badge-rating {
          top:8px; left:8px;
          background:rgba(0,200,255,0.15); border:1px solid rgba(0,200,255,0.35); color:#00c8ff;
        }
        .mv-badge-year {
          top:8px; right:8px;
          background:rgba(0,0,0,0.65); border:1px solid rgba(255,255,255,0.1); color:rgba(255,255,255,0.7);
        }

        .mv-play-wrap {
          position:absolute; inset:0;
          display:flex; align-items:center; justify-content:center;
          background:rgba(0,0,0,0); transition:background 0.25s;
        }
        .mv-card:hover .mv-play-wrap { background:rgba(0,8,18,0.5); }
        .mv-play-btn {
          width:52px; height:52px; border-radius:50%;
          background:rgba(0,200,255,0.88);
          display:flex; align-items:center; justify-content:center;
          transform:scale(0); opacity:0;
          transition:transform 0.3s cubic-bezier(0.34,1.56,0.64,1), opacity 0.2s;
          box-shadow:0 4px 24px rgba(0,200,255,0.5);
        }
        .mv-card:hover .mv-play-btn { transform:scale(1); opacity:1; }

        .mv-card-body { padding:8px 10px 11px; }
        .mv-title {
          font-weight:700; font-size:0.86rem; color:#e0eeff;
          white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
          margin-bottom:3px; font-family:'Rajdhani',sans-serif;
        }
        .mv-meta-row {
          display:flex; align-items:center; gap:4px;
          font-size:0.65rem; color:#4a6a7a; margin-bottom:5px;
          font-family:'Rajdhani',sans-serif; font-weight:500;
        }
        .mv-imdb { display:flex; align-items:center; gap:2px; font-size:0.65rem; color:#f5c518; font-weight:700; margin-left:auto; }
        .mv-genre-pill {
          display:inline-block; background:rgba(0,200,255,0.06); color:rgba(0,200,255,0.75);
          border:1px solid rgba(0,200,255,0.16); font-size:0.58rem; font-weight:700;
          letter-spacing:0.06em; padding:2px 7px; border-radius:2px; text-transform:uppercase;
          font-family:'Rajdhani',sans-serif;
        }

        /* ── Modal ── */
        .mv-overlay {
          position:fixed; inset:0; z-index:1000;
          background:rgba(0,0,0,0.88); backdrop-filter:blur(10px);
          display:flex; align-items:center; justify-content:center; padding:20px;
          animation:mv-fi 0.18s ease;
        }
        @keyframes mv-fi { from{opacity:0} to{opacity:1} }
        .mv-modal {
          background:#0c0c16; border:1px solid rgba(0,200,255,0.18);
          border-radius:14px; width:100%; max-width:660px; max-height:90vh;
          overflow-y:auto; display:flex; flex-direction:column; position:relative;
          box-shadow:0 40px 100px rgba(0,0,0,0.9),0 0 50px rgba(0,200,255,0.05);
          animation:mv-su 0.26s cubic-bezier(0.34,1.56,0.64,1);
          scrollbar-width:thin; scrollbar-color:rgba(0,200,255,0.2) transparent;
        }
        .mv-modal::before {
          content:''; position:absolute; top:0; left:0; right:0; height:1px; border-radius:14px 14px 0 0;
          background:linear-gradient(90deg,transparent,rgba(0,200,255,0.5),transparent);
        }
        @keyframes mv-su { from{opacity:0;transform:translateY(22px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }

        .mv-modal-close {
          position:absolute; top:12px; right:12px; z-index:10;
          width:28px; height:28px; border-radius:50%;
          background:rgba(0,0,0,0.65); backdrop-filter:blur(6px);
          border:1px solid rgba(255,255,255,0.1); color:rgba(255,255,255,0.7);
          display:flex; align-items:center; justify-content:center;
          cursor:pointer; font-size:0.9rem; font-weight:700; transition:all 0.2s;
        }
        .mv-modal-close:hover { background:rgba(0,200,255,0.2); color:#00c8ff; }

        .mv-modal-hero { position:relative; height:220px; overflow:hidden; border-radius:14px 14px 0 0; }
        .mv-modal-hero > img { width:100%; height:100%; object-fit:cover; filter:brightness(0.5) saturate(0.8); }
        .mv-modal-hero-grad { position:absolute; inset:0; background:linear-gradient(180deg,transparent 25%,#0c0c16 100%); }
        .mv-modal-hero-info {
          position:absolute; bottom:0; left:0; right:0;
          padding:16px 20px; display:flex; align-items:flex-end; gap:13px;
        }
        .mv-modal-thumb {
          width:68px; height:102px; border-radius:5px; overflow:hidden; flex-shrink:0;
          border:2px solid rgba(0,200,255,0.3); box-shadow:0 8px 22px rgba(0,0,0,0.6);
        }
        .mv-modal-thumb img { width:100%; height:100%; object-fit:cover; }
        .mv-modal-title {
          font-family:'Bebas Neue',cursive; font-size:1.75rem; letter-spacing:0.08em;
          color:#fff; line-height:1; text-shadow:0 2px 10px rgba(0,0,0,0.8); margin-bottom:5px;
        }
        .mv-modal-meta { display:flex; flex-wrap:wrap; gap:5px; align-items:center; }
        .mv-modal-rbadge {
          background:rgba(0,200,255,0.15); border:1px solid rgba(0,200,255,0.35);
          color:#00c8ff; font-size:0.6rem; font-weight:700;
          padding:2px 7px; border-radius:3px; letter-spacing:0.08em; font-family:'Rajdhani',sans-serif;
        }
        .mv-modal-txt { font-size:0.7rem; color:rgba(255,255,255,0.6); font-family:'Rajdhani',sans-serif; font-weight:600; display:flex; align-items:center; gap:3px; }
        .mv-modal-sep { font-size:0.7rem; color:rgba(255,255,255,0.28); font-family:'Rajdhani',sans-serif; }
        .mv-modal-imdb { font-size:0.7rem; color:#f5c518; font-weight:700; font-family:'Rajdhani',sans-serif; display:flex; align-items:center; gap:3px; }

        .mv-modal-body { padding:16px 20px 22px; flex:1; }
        .mv-modal-desc { font-family:'Rajdhani',sans-serif; font-size:0.9rem; color:#7aaaba; line-height:1.7; margin-bottom:18px; font-weight:500; }
        .mv-modal-cta { display:flex; gap:9px; flex-wrap:wrap; }
        .mv-cta-primary {
          display:flex; align-items:center; gap:7px;
          background:rgba(0,200,255,0.18); color:#00c8ff;
          border:1px solid rgba(0,200,255,0.45); border-radius:8px; padding:10px 22px;
          font-family:'Rajdhani',sans-serif; font-size:0.9rem; font-weight:700;
          letter-spacing:0.05em; cursor:pointer; text-decoration:none; transition:all 0.2s;
          box-shadow:0 0 22px rgba(0,200,255,0.1);
        }
        .mv-cta-primary:hover { background:rgba(0,200,255,0.28); box-shadow:0 0 32px rgba(0,200,255,0.2); }
        .mv-cta-sec {
          display:flex; align-items:center; gap:7px;
          background:rgba(255,255,255,0.04); color:#6a8a9a;
          border:1px solid rgba(255,255,255,0.07); border-radius:8px; padding:10px 16px;
          font-family:'Rajdhani',sans-serif; font-size:0.86rem; font-weight:600;
          cursor:pointer; transition:all 0.2s; text-decoration:none;
        }
        .mv-cta-sec:hover { border-color:rgba(0,200,255,0.2); color:#90b0c8; }
      `}</style>

      <div className="mvs-root">
        {/* ── Header ── */}
        <header className="mvs-header">
          <div className="mvs-header-row">
            <button className="mvs-back" onClick={onBack}>
              <ArrowLeft size={14}/> Canales
            </button>

            <div className="mvs-brand">
              <img src="https://i.postimg.cc/j2WvZw96/Whats-App-Image-2026-03-02-at-11-44-07.jpg" alt="TechPhantom"/>
              <span className="mvs-brand-name"><span className="acc">Tech</span>Phantom</span>
            </div>

            <div className="mvs-vdiv"/>

            <div className="mvs-sec-title">
              <div className="mvs-film-icon"><Film size={15} color="#00c8ff"/></div>
              <span className="mvs-sec-title-txt">Películas</span>
              <span className="mvs-free-badge">Pluto TV · Gratis</span>
            </div>

            <div className="mvs-search-wrap">
              <Search size={13} className="mvs-search-ico"/>
              <input
                className="mvs-search"
                type="text"
                placeholder="Buscar película…"
                value={search}
                onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
              />
              {search && <button className="mvs-clear" onClick={() => { setSearch(''); setCurrentPage(1); }}><X size={12}/></button>}
            </div>
          </div>

          {/* Genre pills */}
          <div className="mvs-pills-row">
            {GENRES.map(g => (
              <button
                key={g}
                className={`mvs-pill ${activeGenre === g ? 'on' : ''}`}
                onClick={() => { setActiveGenre(g); setCurrentPage(1); }}
              >{g}</button>
            ))}
          </div>
        </header>

        {/* ── Main ── */}
        <main className="mvs-main">
          <div className="mvs-note">
            🎬 Todas las películas son <strong>gratuitas y sin registro</strong> en Pluto TV.
            Hacé clic en una tarjeta para ver detalles y abrirla directamente en Pluto TV.
          </div>

          <div className="mvs-heading-row">
            <span className="mvs-heading">
              {search ? `"${search}"` : activeGenre !== 'Todos' ? activeGenre : 'Catálogo Completo'}
            </span>
            <span className="mvs-count">{filtered.length} películas</span>
          </div>

          {filtered.length === 0 ? (
            <div className="mvs-empty">
              <div className="mvs-empty-icon"><Film size={26} style={{color:'rgba(0,200,255,0.18)'}}/></div>
              <p style={{color:'#3a5a6a',fontFamily:'Rajdhani',fontWeight:600,marginBottom:5}}>Sin resultados</p>
              <p style={{color:'#2a3a4a',fontSize:'0.84rem',fontFamily:'Rajdhani'}}>Probá con otro término o género</p>
            </div>
          ) : (
            <>
              <div className="mvs-grid">
                {paginated.map(m => (
                  <MovieCard key={m.id} movie={m} onClick={() => setSelectedMovie(m)}/>
                ))}
              </div>

              {totalPages > 1 && (
                <>
                  <div className="mvs-pager">
                    <button className="mvs-pager-btn" disabled={currentPage === 1} onClick={() => go(currentPage - 1)}>
                      <ChevronLeft size={14}/>
                    </button>
                    {Array.from({length: totalPages}, (_, i) => i + 1).map(p => (
                      <button key={p} className={`mvs-pager-btn ${currentPage === p ? 'on' : ''}`} onClick={() => go(p)}>{p}</button>
                    ))}
                    <button className="mvs-pager-btn" disabled={currentPage === totalPages} onClick={() => go(currentPage + 1)}>
                      <ChevronRight size={14}/>
                    </button>
                  </div>
                  <p className="mvs-pager-info">Página {currentPage} de {totalPages} — {MOVIES_PER_PAGE} por página</p>
                </>
              )}
            </>
          )}
        </main>
      </div>

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)}/>
      )}
    </>
  );
}