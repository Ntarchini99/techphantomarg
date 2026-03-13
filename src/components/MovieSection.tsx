import { useState, useMemo, useRef, useEffect } from 'react';
import { Play, Film, Tv, Star, ChevronLeft, ChevronRight, Search, X, ArrowLeft, Minimize2 } from 'lucide-react';

export interface PJMovie {
  id: string;
  slug: string;
  title: string;
  year: number;
  genre: string;
  imdb?: string;
  poster: string;
  type: 'movie' | 'series';
  source?: 'pj' | 'archive';
  embedUrl?: string;
}

const PJ_MOVIE_URL  = (slug: string) => `https://pelisjuanita.com/movies/pelicula/${slug}`;
const PJ_SERIES_URL = (slug: string) => `https://pelisjuanita.com/series/ver-serie/${slug}`;
const ARCHIVE_URL   = (id: string)   => `https://archive.org/embed/${id}`;

export const pjMovies: PJMovie[] = [
  { id:'m1',  slug:'street-flow-3',                    title:'Flow callejero 3',                      year:2026, genre:'Drama',      imdb:'0.0', poster:'https://image.tmdb.org/t/p/w500/hm7ZSLYtAlrHFk8uMamXaVo1s3I.jpg',   type:'movie' },
  { id:'m2',  slug:'one-mile-chapter-two',             title:'One Mile: Chapter Two',                 year:2026, genre:'Acción',     imdb:'9.0', poster:'https://image.tmdb.org/t/p/w500/3sjc9qXXmQoUWKQ3qIjS1nZaUJy.jpg',   type:'movie' },
  { id:'m3',  slug:'acusada-2',                        title:'Acusada',                               year:2026, genre:'Drama',      imdb:'9.0', poster:'https://image.tmdb.org/t/p/w500/kkQJz9mhx9JHQbs8uRN86S6r4Ko.jpg',   type:'movie' },
  { id:'m4',  slug:'el-engano-2',                      title:'El engaño',                             year:2026, genre:'Acción',     imdb:'6.3', poster:'https://image.tmdb.org/t/p/w500/uuIP7lRgzSjaZ4CT33WHfctLARs.jpg',   type:'movie' },
  { id:'m5',  slug:'scream-7',                         title:'Scream 7',                              year:2026, genre:'Terror',     imdb:'6.1', poster:'https://image.tmdb.org/t/p/w500/hflipaW7mtfKZM9WFEyzUdFsgSk.jpg',   type:'movie' },
  { id:'m6',  slug:'ice-skater',                       title:'Ice Skater',                            year:2026, genre:'Drama',      imdb:'0.0', poster:'https://image.tmdb.org/t/p/w500/k6NdbpdN3591xR18VAVfXYmY6P0.jpg',   type:'movie' },
  { id:'m7',  slug:'cortafuego',                       title:'Cortafuego',                            year:2026, genre:'Acción',     imdb:'0.0', poster:'https://image.tmdb.org/t/p/w500/gqzIKAeBKkiwj5qz2oZCOuZKHPA.jpg',   type:'movie' },
  { id:'m8',  slug:'pavane',                           title:'Pavana',                                year:2026, genre:'Drama',      imdb:'6.0', poster:'https://image.tmdb.org/t/p/w500/22RlxpIT4u4psfIx9tmtbPvgAbm.jpg',   type:'movie' },
  { id:'m9',  slug:'one-mile-chapter-one',             title:'One Mile: Chapter One',                 year:2026, genre:'Acción',     imdb:'7.8', poster:'https://image.tmdb.org/t/p/w500/1GZaoYe0mQy211DgDSAxAXr30ul.jpg',   type:'movie' },
  { id:'m10', slug:'the-dreadful',                     title:'The Dreadful',                          year:2026, genre:'Terror',     imdb:'7.5', poster:'https://image.tmdb.org/t/p/w500/hGH8Ji7pG2ytHxo7ABqHM3TpzFA.jpg',   type:'movie' },
  { id:'m11', slug:'midwinter-break',                  title:'Midwinter Break',                       year:2026, genre:'Drama',      imdb:'7.0', poster:'https://image.tmdb.org/t/p/w500/vkMOruokVnD05xSiwI2hWBzG7UD.jpg',   type:'movie' },
  { id:'m12', slug:'redux-redux',                      title:'Redux Redux',                           year:2026, genre:'Acción',     imdb:'6.5', poster:'https://image.tmdb.org/t/p/w500/9u7sUTYPPTxGCXbkcw8FTq50PnO.jpg',   type:'movie' },
  { id:'m13', slug:'jugada-maestra',                   title:'Jugada maestra',                        year:2026, genre:'Comedia',    imdb:'6.3', poster:'https://image.tmdb.org/t/p/w500/75eegSmvQXEJulOE1oekOsbVgTU.jpg',   type:'movie' },
  { id:'m14', slug:'paul-mccartney-hombre-a-la-fuga',  title:'Paul McCartney: Hombre a la fuga',      year:2026, genre:'Documental', imdb:'8.5', poster:'https://image.tmdb.org/t/p/w500/j6GhGmlEpWYwuY0ZfUPdtACTFdD.jpg',   type:'movie' },
  { id:'m15', slug:'cold-storage',                     title:'Alerta extinción',                      year:2026, genre:'Comedia',    imdb:'4.7', poster:'https://image.tmdb.org/t/p/w500/aioKGmYADqq09GEIY9vPhK5xoza.jpg',   type:'movie' },
  { id:'m16', slug:'avatar-fire-and-ash',              title:'Avatar: Fuego y ceniza',                year:2025, genre:'Sci-Fi',     imdb:'7.1', poster:'https://image.tmdb.org/t/p/w500/cf7hE1ifY4UNbS25tGnaTyyDrI2.jpg',   type:'movie' },
  { id:'m17', slug:'shelter-el-protector',             title:'El Guardián: Último refugio',           year:2026, genre:'Acción',     imdb:'7.7', poster:'https://image.tmdb.org/t/p/w500/klvZs66SG19qmacdwxSRkdFQhQS.jpg',   type:'movie' },
  { id:'m18', slug:'en-un-instante',                   title:'En un abrir y cerrar de ojos',          year:2026, genre:'Drama',      imdb:'7.0', poster:'https://image.tmdb.org/t/p/w500/bN130HxJYMXPDEIO03wtpdhwj6K.jpg',   type:'movie' },
  { id:'m19', slug:'wuthering-heights-2',              title:'Cumbres Borrascosas',                   year:2026, genre:'Romance',    imdb:'6.7', poster:'https://image.tmdb.org/t/p/w500/afGUJcMBJloAUp9uC27MQiqkD7X.jpg',   type:'movie' },
  { id:'m20', slug:'greenland-2-migration',            title:'Greenland 2',                           year:2026, genre:'Acción',     imdb:'6.8', poster:'https://image.tmdb.org/t/p/w500/q7aijAKE98Fcp6dgR6oWiUkFO2g.jpg',   type:'movie' },
  { id:'m21', slug:'sin-piedad-2',                     title:'Sin piedad',                            year:2026, genre:'Acción',     imdb:'7.0', poster:'https://image.tmdb.org/t/p/w500/9zBNg8koM3fjUTPT7QeJHuGG2r9.jpg',   type:'movie' },
  { id:'m22', slug:'terror-em-silent-hill-regresso-para-o-inferno', title:'Terror en Silent Hill: Regreso al infierno', year:2026, genre:'Terror', imdb:'5.5', poster:'https://image.tmdb.org/t/p/w500/fGSmcSIZGam07ihABhVtaQAzOyd.jpg', type:'movie' },
  { id:'m23', slug:'hellfire',                         title:'Hellfire',                              year:2026, genre:'Acción',     imdb:'8.8', poster:'https://image.tmdb.org/t/p/w500/tQti9QTf13MfzNpXguijgNh7ojE.jpg',   type:'movie' },
  { id:'m24', slug:'goat-la-cabra-que-cambio-el-juego',title:'GOAT: La cabra que cambió el juego',    year:2026, genre:'Acción',     imdb:'7.3', poster:'https://image.tmdb.org/t/p/w500/2yblKPC6ZKEU6iv9sEZ0jktjiTU.jpg',   type:'movie' },
  { id:'m25', slug:'28-anos-despues-el-templo-de-los-huesos', title:'Exterminio: El templo de huesos', year:2026, genre:'Terror',   imdb:'5.9', poster:'https://image.tmdb.org/t/p/w500/2DTPapravB7kVBWjm6RsqEWyNqn.jpg',   type:'movie' },
  { id:'m26', slug:'la-asistenta',                     title:'La asistenta',                          year:2025, genre:'Terror',     imdb:'7.1', poster:'https://image.tmdb.org/t/p/w500/A6S15iqfHpoit02leDfDVnpklys.jpg',   type:'movie' },
  { id:'m27', slug:'whistle-el-silbido-del-mal',       title:'Whistle: El silbido del mal',           year:2026, genre:'Terror',     imdb:'4.5', poster:'https://image.tmdb.org/t/p/w500/otCoDQYnNy2x1QzTVn3JCp0jV4O.jpg',   type:'movie' },
  { id:'m28', slug:'marty-supreme',                    title:'Marty Supreme',                         year:2026, genre:'Drama',      imdb:'8.0', poster:'https://image.tmdb.org/t/p/w500/a1GzWegsPpt7yzlMT366oP7DZUJ.jpg',   type:'movie' },
  { id:'m29', slug:'hamnet',                           title:'Hamnet',                                year:2026, genre:'Drama',      imdb:'8.0', poster:'https://image.tmdb.org/t/p/w500/a9IQXoYCpsjqTOKXRTw1osLd5il.jpg',   type:'movie' },
  { id:'m30', slug:'el-momento',                       title:'El Momento',                            year:2026, genre:'Comedia',    imdb:'5.8', poster:'https://image.tmdb.org/t/p/w500/mfV9E5hMcqu0Bc15W4RI0hx5gK0.jpg',   type:'movie' },
  { id:'m31', slug:'good-luck-have-fun-dont-die',      title:'Buena suerte, diviértete, no mueras',   year:2026, genre:'Acción',     imdb:'7.5', poster:'https://image.tmdb.org/t/p/w500/dtEVoZBMuwlgz4mh4PA75eVbBM1.jpg',   type:'movie' },
  { id:'m32', slug:'hermandad-estado-de-terror',       title:'Aviso general: Hermandad',              year:2026, genre:'Acción',     imdb:'4.8', poster:'https://image.tmdb.org/t/p/w500/xdyCFS4jUzp7kghoptaiYqir48X.jpg',   type:'movie' },
  { id:'m33', slug:'reckless',                         title:'Reckless',                              year:2026, genre:'Comedia',    imdb:'6.2', poster:'https://image.tmdb.org/t/p/w500/76jjEatL53KYooIrDQK9wsk4rm1.jpg',   type:'movie' },
  { id:'m34', slug:'los-hermanos-demolicion',          title:'Los hermanos demolición',               year:2026, genre:'Comedia',    imdb:'8.0', poster:'https://image.tmdb.org/t/p/w500/gbVwHl4YPSq6BcC92TQpe7qUTh6.jpg',   type:'movie' },
  { id:'m35', slug:'el-botin',                         title:'El botín',                              year:2026, genre:'Acción',     imdb:'7.2', poster:'https://image.tmdb.org/t/p/w500/p4bW2sJKAwcHuLpfoZK7Zo63osA.jpg',   type:'movie' },
  { id:'m36', slug:'killer-whale',                     title:'Killer Whale',                          year:2026, genre:'Acción',     imdb:'0.0', poster:'https://image.tmdb.org/t/p/w500/xC6zdIoIHjhOIFmjNyGgtzhuhiF.jpg',   type:'movie' },
  { id:'m37', slug:'f-valentines-day',                 title:"F Valentine's Day",                     year:2026, genre:'Comedia',    imdb:'5.0', poster:'https://image.tmdb.org/t/p/w500/8zPExowfpfZOTpS1W4J7G27lH4H.jpg',   type:'movie' },
  { id:'m38', slug:'el-tour-universitario-con-joe',    title:'El tour universitario con Joe',          year:2026, genre:'Comedia',    imdb:'8.0', poster:'https://image.tmdb.org/t/p/w500/zp5RN4grAHUeCc9B7LKZcuu6HH5.jpg',   type:'movie' },
  { id:'m39', slug:'uf-solo-amigos',                   title:'¡Uf! ¿Solo amigos?',                    year:2026, genre:'Comedia',    imdb:'8.0', poster:'https://image.tmdb.org/t/p/w500/fDcHWsESmG7j8fnVbPxR6dQz0vA.jpg',   type:'movie' },
  { id:'m40', slug:'solo-mio',                         title:'Solo Mio',                              year:2026, genre:'Comedia',    imdb:'7.5', poster:'https://image.tmdb.org/t/p/w500/fFjCz7pX9gZofqgbEnYxk3C1Ixo.jpg',   type:'movie' },
  { id:'m41', slug:'la-meta-es-el-amor',               title:'La Meta es el Amor',                    year:2026, genre:'Comedia',    imdb:'7.5', poster:'https://image.tmdb.org/t/p/w500/eZRbRa0q9rKkPe0gfJ2a0NhygBX.jpg',   type:'movie' },
  { id:'m42', slug:'el-show-de-los-muppets',           title:'El show de los Muppets',                year:2026, genre:'Comedia',    imdb:'7.6', poster:'https://image.tmdb.org/t/p/w500/o0o6aJQvyDXc5NHGhUpEOO2cvPX.jpg',   type:'movie' },
  { id:'m43', slug:'un-hombre-por-semana',             title:'Un Hombre por Semana',                  year:2026, genre:'Comedia',    imdb:'7.0', poster:'https://image.tmdb.org/t/p/w500/ynrvcl6e3Ev0SGkpPeXdhfdv1Pt.jpg',   type:'movie' },
  { id:'m44', slug:'my-boo-2',                         title:'My Boo 2',                              year:2025, genre:'Comedia',    imdb:'4.0', poster:'https://image.tmdb.org/t/p/w500/jCXbS2yCqHKPpaSAdTClGIW8FtO.jpg',   type:'movie' },
  { id:'m45', slug:'wicked-one-wonderful-night',       title:'Wicked: One Wonderful Night',           year:2025, genre:'Musical',    imdb:'8.3', poster:'https://image.tmdb.org/t/p/w500/vI8gfZVhPnYo0gjK6vSP7p3idpV.jpg',   type:'movie' },
  { id:'m46', slug:'la-tregua',                        title:'La tregua',                             year:2025, genre:'Drama',      imdb:'0.0', poster:'https://image.tmdb.org/t/p/w500/g1O3wEA0ZaigQG0RHx7zXeuWbSc.jpg',   type:'movie' },
  { id:'m47', slug:'giant',                            title:'Giant',                                 year:2026, genre:'Drama',      imdb:'6.2', poster:'https://image.tmdb.org/t/p/w500/1KKmUdFulYDVSV31nQt9LVm3Oue.jpg',   type:'movie' },
  { id:'m48', slug:'sundays',                          title:'Los domingos',                          year:2025, genre:'Drama',      imdb:'7.3', poster:'https://image.tmdb.org/t/p/w500/1K5HtixJ9O6gqmK61shhnMO4VSy.jpg',   type:'movie' },
  { id:'a4',  slug:'hp4', title:'Harry Potter y el Cáliz de Fuego',              year:2005, genre:'Fantasía',  imdb:'7.7', poster:'https://i.postimg.cc/Gt5WGywX/caliz_fuego.webp',       type:'movie', source:'archive', embedUrl:ARCHIVE_URL('f290279344_202603/Harry+Potter+y+el+c%C3%A1liz+de+fuego.mp4') },
  { id:'a2',  slug:'hp2', title:'Harry Potter y la Cámara Secreta',              year:2002, genre:'Fantasía',  imdb:'7.4', poster:'https://i.postimg.cc/D0M9LXkp/camara_secreta.webp',    type:'movie', source:'archive', embedUrl:ARCHIVE_URL('f290279344_202603/Harry+Potter+y+la+camara+secreta.mp4') },
  { id:'a3',  slug:'hp3', title:'Harry Potter y el Prisionero de Azkaban',       year:2004, genre:'Fantasía',  imdb:'7.9', poster:'https://i.postimg.cc/C5Q3kqTt/prisionero_azkaban.webp', type:'movie', source:'archive', embedUrl:ARCHIVE_URL('f290279344_202603/Harry+Potter+y+el+pricionero+de+Azkaban.mp4') },
  { id:'a6',  slug:'hp1', title:'Harry Potter y la Piedra Filosofal',            year:2001, genre:'Fantasía',  imdb:'7.6', poster:'https://i.postimg.cc/D0M9LXkM/piedra_filosofal.webp',  type:'movie', source:'archive', embedUrl:ARCHIVE_URL('f290279344') },
  { id:'a7',  slug:'hp5', title:'Harry Potter y la Orden del Fénix',             year:2007, genre:'Fantasía',  imdb:'7.5', poster:'https://i.postimg.cc/j5qdjQBW/5.png',                   type:'movie', source:'archive', embedUrl:ARCHIVE_URL('harry-potter-y-la-orden-del-fenix_202603') },
  { id:'a8',  slug:'hp6', title:'Harry Potter y el Príncipe Mestizo',            year:2009, genre:'Fantasía',  imdb:'7.6', poster:'https://i.postimg.cc/rmyFpC7R/6.png',                   type:'movie', source:'archive', embedUrl:ARCHIVE_URL('harry-potter-y-el-misterio-del-principe_202603') },
  { id:'a9',  slug:'hp7', title:'Harry Potter y las Reliquias de la Muerte 1',  year:2010, genre:'Fantasía',  imdb:'7.7', poster:'https://i.postimg.cc/SsQNK7Hn/7.png',                   type:'movie', source:'archive', embedUrl:ARCHIVE_URL('harry-potter-y-las-reliquias-de-la-muerte-parte-1_202603') },
  { id:'a10', slug:'hp8', title:'Harry Potter y las Reliquias de la Muerte 2',  year:2011, genre:'Fantasía',  imdb:'8.1', poster:'https://i.postimg.cc/6365QLF2/8.png',                   type:'movie', source:'archive', embedUrl:ARCHIVE_URL('harry-potter-y-las-reliquias-de-la-muerte-parte-2-final_202603') },
  { id:'a5',  slug:'lilo-stitch', title:'Lilo y Stitch',                         year:2002, genre:'Animación', imdb:'7.3', poster:'https://image.tmdb.org/t/p/w500/5B0a13CUKoAqWg0MbWMXalIGEE.jpg', type:'movie', source:'archive', embedUrl:ARCHIVE_URL('f290279344_202603/f288495560.mp4') },
  { id:'m49', slug:'zootopia-2', title:'Zootrópolis 2',                          year:2026, genre:'Animación', imdb:'7.0', poster:'https://image.tmdb.org/t/p/w500/2VF8ZJ8BL4CBxr6Y4KhwJ7yGSsY.jpg', type:'movie' },
];

export const pjSeries: PJMovie[] = [
  { id:'s1',  slug:'el-joven-sherlock',                        title:'El joven Sherlock',                       year:2026, genre:'Misterio',   imdb:'9.8',  poster:'https://image.tmdb.org/t/p/w500/w426ObBzvHyTISiAqaeMujydmpi.jpg',  type:'series' },
  { id:'s2',  slug:'vladimir',                                 title:'Vladimir',                                year:2026, genre:'Drama',      imdb:'0.0',  poster:'https://image.tmdb.org/t/p/w500/cQhv0HrWrxXikH5R8d0tF1w3QHg.jpg',  type:'series' },
  { id:'s3',  slug:'novio-a-la-carta',                         title:'Novio a la carta',                        year:2026, genre:'Romance',    imdb:'10.0', poster:'https://image.tmdb.org/t/p/w500/oK0cCVIP5EnxtDxFhGECQKiSyA7.jpg',  type:'series' },
  { id:'s4',  slug:'ted',                                      title:'ted',                                     year:2024, genre:'Comedia',    imdb:'8.1',  poster:'https://image.tmdb.org/t/p/w500/iKmLCDudQXXOZr16bB7ApT7jXo3.jpg',  type:'series' },
  { id:'s5',  slug:'marshals-una-historia-de-yellowstone',     title:'Marshals: Una historia de Yellowstone',   year:2026, genre:'Western',    imdb:'8.3',  poster:'https://image.tmdb.org/t/p/w500/nInfaveN1iFpRIcMGNKENoVVUT2.jpg',  type:'series' },
  { id:'s6',  slug:'scrubs',                                   title:'Scrubs',                                  year:2026, genre:'Comedia',    imdb:'7.6',  poster:'https://image.tmdb.org/t/p/w500/nNNM50G7p9C3n4vgidCiybsIdHA.jpg',  type:'series' },
  { id:'s7',  slug:'el-caballero-de-los-siete-reinos',         title:'El caballero de los Siete Reinos',        year:2026, genre:'Fantasía',   imdb:'6.9',  poster:'https://image.tmdb.org/t/p/w500/uB0v0sqbOGjj7MZZ9sb2vYnUVP3.jpg',  type:'series' },
  { id:'s8',  slug:'the-pitt',                                 title:'The Pitt',                                year:2025, genre:'Drama',      imdb:'7.8',  poster:'https://image.tmdb.org/t/p/w500/6fMGktEDXMZZPACJ5cWkVQ6TSte.jpg',  type:'series' },
  { id:'s9',  slug:'bridgerton',                               title:'Bridgerton',                              year:2020, genre:'Romance',    imdb:'8.1',  poster:'https://image.tmdb.org/t/p/w500/wR7f51NSYoIWJFnkdEG1pzIRI2Y.jpg',  type:'series' },
  { id:'s10', slug:'los-dinosaurios',                          title:'Los dinosaurios',                         year:2026, genre:'Documental', imdb:'0.0',  poster:'https://image.tmdb.org/t/p/w500/x37IK9WWhuzi7tgyMT4ff3kiT5X.jpg',  type:'series' },
  { id:'s11', slug:'frieren-mas-alla-del-final-del-viaje',     title:'Frieren: Más allá del final del viaje',   year:2023, genre:'Animación',  imdb:'9.0',  poster:'https://image.tmdb.org/t/p/w500/v7i3yNKxsDwB5IG9ElWgOGPieE8.jpg',  type:'series' },
  { id:'s12', slug:'secuestro-aereo',                          title:'Secuestro aéreo',                         year:2023, genre:'Thriller',   imdb:'7.9',  poster:'https://image.tmdb.org/t/p/w500/vAo3QL02oOI9Xz90FILQN5vxMsQ.jpg',  type:'series' },
  { id:'s13', slug:'el-beso-de-la-sirena',                     title:'El beso de la sirena',                    year:2026, genre:'Romance',    imdb:'6.0',  poster:'https://image.tmdb.org/t/p/w500/4C5iHtnndCvlbMvsKdRFtCDSE5L.jpg',  type:'series' },
  { id:'s14', slug:'belleza-perfecta',                         title:'Belleza perfecta',                        year:2026, genre:'Sci-Fi',     imdb:'1.5',  poster:'https://image.tmdb.org/t/p/w500/tZTG2PPAukzksPkiQV9c4suIQXk.jpg',  type:'series' },
  { id:'s15', slug:'monarch-legado-de-monstruos',              title:'Monarch: legado de monstruos',            year:2023, genre:'Acción',     imdb:'7.9',  poster:'https://image.tmdb.org/t/p/w500/8ZSrqUsa1JN9FkIQU8iTFOMw4D5.jpg',  type:'series' },
  { id:'s16', slug:'furtivo',                                  title:'Furtivo',                                 year:2026, genre:'Thriller',   imdb:'8.5',  poster:'https://image.tmdb.org/t/p/w500/9StRZHTEUnBCYcTtFFrzLaq0XaA.jpg',  type:'series' },
  { id:'s17', slug:'doc-1',                                    title:'DOC',                                     year:2026, genre:'Drama',      imdb:'0.0',  poster:'https://image.tmdb.org/t/p/w500/83aGkh2ERYWjY0zW5X1e4KABFIH.jpg',  type:'series' },
  { id:'s18', slug:'the-boys',                                 title:'The Boys',                                year:2019, genre:'Acción',     imdb:'8.7',  poster:'https://image.tmdb.org/t/p/w500/2BpXQQE5bj8moa6vDOyoxm9pMip.jpg',  type:'series' },
  { id:'s19', slug:'star-trek-starfleet-academy',              title:'Star Trek: Starfleet Academy',            year:2026, genre:'Sci-Fi',     imdb:'7.0',  poster:'https://image.tmdb.org/t/p/w500/yIooeJNzV0x8obp5oE1VqffMNqC.jpg',  type:'series' },
  { id:'s20', slug:'one-piece',                                title:'One Piece',                               year:1999, genre:'Animación',  imdb:'8.7',  poster:'https://image.tmdb.org/t/p/w500/6nyfkXDGngwY6PCW58n7CHQ2aMt.jpg',  type:'series' },
  { id:'s21', slug:'paradise',                                 title:'Paradise',                                year:2025, genre:'Thriller',   imdb:'6.0',  poster:'https://image.tmdb.org/t/p/w500/rkwqy7uE0ORdUxDFNeVq7vpJORN.jpg',  type:'series' },
  { id:'s22', slug:'adolescencia',                             title:'Adolescencia',                            year:2026, genre:'Drama',      imdb:'9.0',  poster:'https://image.tmdb.org/t/p/w500/2HX6zbr6O7Up8UXHxNq8fydUREh.jpg',  type:'series' },
  { id:'s23', slug:'merlina',                                  title:'Merlina',                                 year:2022, genre:'Terror',     imdb:'8.2',  poster:'https://image.tmdb.org/t/p/w500/a3WgEfqaXfLtHFcpEtGCmAeBaGb.jpg',  type:'series' },
  { id:'s24', slug:'juego-de-tronos',                          title:'Juego de Tronos',                         year:2011, genre:'Fantasía',   imdb:'9.2',  poster:'https://image.tmdb.org/t/p/w500/uo064OLS7OCsiNjbmwHFXaijFl4.jpg',  type:'series' },
  { id:'s25', slug:'el-eternauta',                             title:'El Eternauta',                            year:2025, genre:'Sci-Fi',     imdb:'8.5',  poster:'https://image.tmdb.org/t/p/w500/rpbwbKlRGS1utRyJE8bd2lxIdze.jpg',  type:'series' },
  { id:'s26', slug:'the-walking-dead',                         title:'The Walking Dead',                        year:2010, genre:'Terror',     imdb:'8.2',  poster:'https://image.tmdb.org/t/p/w500/qK6FZ2tTAMkIUbxeuRGPnxcbMh1.jpg',  type:'series' },
  { id:'s27', slug:'dexter',                                   title:'Dexter',                                  year:2006, genre:'Thriller',   imdb:'8.6',  poster:'https://image.tmdb.org/t/p/w500/wHfvEWFmOKdAA9T11VaFxW8DH9t.jpg',  type:'series' },
  { id:'s28', slug:'gambito-de-dama',                          title:'Gambito de Dama',                         year:2020, genre:'Drama',      imdb:'8.6',  poster:'https://image.tmdb.org/t/p/w500/sglJW2J8l9ke2iELql2BEepaA60.jpg',  type:'series' },
  { id:'s29', slug:'lupin',                                    title:'Lupin',                                   year:2021, genre:'Thriller',   imdb:'7.5',  poster:'https://image.tmdb.org/t/p/w500/nb6A41gKVXAxLFES034lHWnKveP.jpg',  type:'series' },
  { id:'s30', slug:'baki-dou-el-samurai-invencible',           title:'Baki-Dou: El samurái invencible',         year:2026, genre:'Animación',  imdb:'0.0',  poster:'https://image.tmdb.org/t/p/w500/qC4JawqYlUS9fwvAzGfY5lSz5uB.jpg',  type:'series' },
  { id:'s31', slug:'cia',                                      title:'CIA',                                     year:2026, genre:'Thriller',   imdb:'9.5',  poster:'https://image.tmdb.org/t/p/w500/8XbgWv137Umc8resTDeWh9ff7Y0.jpg',  type:'series' },
];

const MOVIE_GENRES  = ['Todos','Acción','Animación','Comedia','Documental','Drama','Fantasía','Musical','Romance','Sci-Fi','Terror'];
const SERIES_GENRES = ['Todos','Acción','Animación','Comedia','Documental','Drama','Fantasía','Misterio','Romance','Sci-Fi','Terror','Thriller','Western'];
const ITEMS_PER_PAGE = 24;

const FALLBACK = (title: string) => {
  const initials = title.replace(/[^a-zA-Z ]/g,'').split(' ').slice(0,2).map(w => w[0] ?? '').join('').toUpperCase();
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="300">
      <defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0a0a18"/><stop offset="100%" stop-color="#0f1824"/>
      </linearGradient></defs>
      <rect width="200" height="300" fill="url(#g)"/>
      <rect x="0" y="0" width="200" height="2" fill="#00c8ff" opacity="0.5"/>
      <text x="100" y="138" font-family="Arial" font-size="52" fill="#00c8ff" text-anchor="middle" opacity="0.18">🎬</text>
      <text x="100" y="185" font-family="Arial Black,Arial" font-size="38" fill="#00c8ff" text-anchor="middle" opacity="0.55" font-weight="bold">${initials}</text>
    </svg>`
  )}`;
};

// ─── MovieCard ────────────────────────────────────────────────────────────────
function MovieCard({ item, onClick }: { item: PJMovie; onClick: () => void }) {
  const [errored, setErrored] = useState(false);
  return (
    <div className="mv-card" onClick={onClick}>
      <div className="mv-poster-wrap">
        <img src={errored ? FALLBACK(item.title) : item.poster} alt={item.title} loading="lazy" decoding="async" crossOrigin="anonymous" onError={() => setErrored(true)}/>
        <div className="mv-poster-grad"/>
        <span className="mv-badge mv-badge-type">{item.type === 'movie' ? '🎬' : '📺'}</span>
        {item.source === 'archive' && <span className="mv-badge mv-badge-archive">▶ DIRECTO</span>}
        <span className="mv-badge mv-badge-year">{item.year}</span>
        <div className="mv-play-wrap">
          <div className="mv-play-btn"><Play size={20} color="#060608" fill="#060608"/></div>
        </div>
      </div>
      <div className="mv-card-body">
        <div className="mv-title">{item.title}</div>
        <div className="mv-meta-row">
          {item.imdb && parseFloat(item.imdb) > 0 && (
            <span className="mv-imdb"><Star size={9} fill="#f5c518" color="#f5c518"/>{item.imdb}</span>
          )}
        </div>
        <span className="mv-genre-pill">{item.genre}</span>
      </div>
    </div>
  );
}

// ─── FullscreenPlayer ─────────────────────────────────────────────────────────
// Monta el iframe a pantalla completa directamente, sin modal intermedio.
// El contenedor div solicita fullscreen en el useEffect del primer render
// (mismo evento de usuario que disparó el click en la card).
function FullscreenPlayer({ item, onClose }: { item: PJMovie; onClose: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [barVisible, setBarVisible] = useState(true);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const embedUrl = item.embedUrl
    ? item.embedUrl
    : item.type === 'movie' ? PJ_MOVIE_URL(item.slug) : PJ_SERIES_URL(item.slug);

  // ── Solicita fullscreen del contenedor al montar ──────────────────────────
  useEffect(() => {
    const el = containerRef.current as any;
    if (!el) return;
    try {
      if      (el.requestFullscreen)            el.requestFullscreen();
      else if (el.webkitRequestFullscreen)      el.webkitRequestFullscreen();
      else if (el.mozRequestFullScreen)         el.mozRequestFullScreen();
      else if (el.msRequestFullscreen)          el.msRequestFullscreen();
    } catch (_) {}
  }, []);

  // ── Cuando el usuario sale del fullscreen (Esc) → cierra el player ────────
  useEffect(() => {
    const onFsChange = () => {
      const isFs = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement
      );
      if (!isFs) onClose();
    };
    document.addEventListener('fullscreenchange', onFsChange);
    document.addEventListener('webkitfullscreenchange', onFsChange);
    document.addEventListener('mozfullscreenchange', onFsChange);
    return () => {
      document.removeEventListener('fullscreenchange', onFsChange);
      document.removeEventListener('webkitfullscreenchange', onFsChange);
      document.removeEventListener('mozfullscreenchange', onFsChange);
    };
  }, [onClose]);

  // ── Oculta barra tras 3 s de inactividad ─────────────────────────────────
  const resetHideTimer = () => {
    setBarVisible(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setBarVisible(false), 3000);
  };
  useEffect(() => {
    resetHideTimer();
    return () => { if (hideTimer.current) clearTimeout(hideTimer.current); };
  }, []);

  const handleClose = () => {
    try {
      if      (document.exitFullscreen)                        document.exitFullscreen();
      else if ((document as any).webkitExitFullscreen)         (document as any).webkitExitFullscreen();
      else if ((document as any).mozCancelFullScreen)          (document as any).mozCancelFullScreen();
    } catch (_) {}
    onClose();
  };

  return (
    <div
      ref={containerRef}
      className="fsp-root"
      onMouseMove={resetHideTimer}
      onTouchStart={resetHideTimer}
    >
      {/* El iframe ocupa el 100% — es lo primero que ve el usuario */}
      <iframe
        src={embedUrl}
        title={item.title}
        allowFullScreen
        allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
        className="fsp-iframe"
        referrerPolicy="no-referrer"
      />

      {/* Barra superior flotante — se oculta sola */}
      <div className={`fsp-bar ${barVisible ? 'fsp-bar-on' : ''}`}>
        <div className="fsp-bar-info">
          <span className="fsp-title">{item.title}</span>
          <span className="fsp-meta">
            {item.year}
            {item.imdb && parseFloat(item.imdb) > 0 && (
              <><Star size={10} fill="#f5c518" color="#f5c518" style={{margin:'0 2px 0 8px'}}/>{item.imdb}</>
            )}
            <span className="fsp-genre">{item.genre}</span>
          </span>
        </div>
        <button className="fsp-close" onClick={handleClose}>
          <Minimize2 size={15}/> Cerrar
        </button>
      </div>
    </div>
  );
}

// ─── MovieSection ─────────────────────────────────────────────────────────────
export function MovieSection({ onBack }: { onBack: () => void }) {
  const [tab,         setTab]         = useState<'movie' | 'series'>('movie');
  const [search,      setSearch]      = useState('');
  const [activeGenre, setActiveGenre] = useState('Todos');
  const [currentPage, setCurrentPage] = useState(1);
  const [playing,     setPlaying]     = useState<PJMovie | null>(null);

  const catalog = tab === 'movie' ? pjMovies : pjSeries;
  const genres  = tab === 'movie' ? MOVIE_GENRES : SERIES_GENRES;

  const filtered = useMemo(() => catalog.filter(m => {
    const g = activeGenre === 'Todos' || m.genre === activeGenre;
    const s = !search || m.title.toLowerCase().includes(search.toLowerCase());
    return g && s;
  }), [catalog, search, activeGenre]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated  = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const go = (p: number) => { setCurrentPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const switchTab = (t: 'movie' | 'series') => { setTab(t); setSearch(''); setActiveGenre('Todos'); setCurrentPage(1); };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;400;500;600;700&family=Bebas+Neue&display=swap');

        /* ── FullscreenPlayer ──────────────────────────────────────────────── */
        .fsp-root {
          position: fixed; inset: 0; z-index: 9999;
          background: #000;
          width: 100vw; height: 100vh;
        }
        .fsp-iframe {
          position: absolute; inset: 0;
          width: 100%; height: 100%;
          border: none; display: block;
        }
        .fsp-bar {
          position: absolute; top: 0; left: 0; right: 0; z-index: 10;
          padding: 16px 20px;
          background: linear-gradient(180deg, rgba(0,0,0,0.88) 0%, transparent 100%);
          display: flex; align-items: center; justify-content: space-between; gap: 16px;
          opacity: 0; pointer-events: none;
          transition: opacity 0.3s ease;
        }
        .fsp-bar-on { opacity: 1; pointer-events: auto; }
        .fsp-bar-info { display: flex; flex-direction: column; gap: 4px; }
        .fsp-title {
          font-family: 'Bebas Neue', cursive; font-size: 1.4rem;
          letter-spacing: 0.08em; color: #fff;
          text-shadow: 0 1px 8px rgba(0,0,0,0.9);
        }
        .fsp-meta {
          display: flex; align-items: center; gap: 4px;
          font-family: 'Rajdhani', sans-serif; font-size: 0.8rem;
          color: rgba(255,255,255,0.65); font-weight: 600;
        }
        .fsp-genre {
          margin-left: 8px;
          background: rgba(0,200,255,0.15); border: 1px solid rgba(0,200,255,0.4);
          color: #00c8ff; font-size: 0.63rem; font-weight: 700;
          padding: 1px 7px; border-radius: 3px; letter-spacing: 0.08em; text-transform: uppercase;
        }
        .fsp-close {
          display: flex; align-items: center; gap: 7px;
          background: rgba(0,0,0,0.6); border: 1px solid rgba(255,255,255,0.2);
          border-radius: 7px; color: rgba(255,255,255,0.9);
          font-family: 'Rajdhani', sans-serif; font-size: 0.85rem; font-weight: 700;
          letter-spacing: 0.05em; padding: 8px 18px; cursor: pointer;
          transition: all 0.2s; backdrop-filter: blur(8px);
        }
        .fsp-close:hover { background: rgba(200,40,40,0.4); border-color: rgba(220,60,60,0.6); }

        /* ── App shell ─────────────────────────────────────────────────────── */
        .mvs-root { min-height:100vh; background:#060608; font-family:'Rajdhani','Helvetica Neue',sans-serif; color:#e8f4ff; position:relative; }
        .mvs-root::before { content:''; position:fixed; inset:0; pointer-events:none; z-index:0; background-image:linear-gradient(rgba(0,200,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(0,200,255,0.025) 1px,transparent 1px); background-size:48px 48px; mask-image:radial-gradient(ellipse 100% 70% at 50% 0%,black 0%,transparent 80%); animation:mvs-pan 20s linear infinite; }
        @keyframes mvs-pan { 0%{background-position:0 0} 100%{background-position:48px 48px} }
        .mvs-header { background:linear-gradient(180deg,rgba(6,6,8,0.98),rgba(6,6,8,0.88)); backdrop-filter:blur(24px); border-bottom:1px solid rgba(0,200,255,0.1); position:sticky; top:0; z-index:50; }
        .mvs-header::before { content:''; position:absolute; top:0; left:0; right:0; height:1px; background:linear-gradient(90deg,transparent,rgba(0,200,255,0.55) 30%,rgba(0,200,255,0.55) 70%,transparent); }
        .mvs-header-row { max-width:1400px; margin:0 auto; padding:13px 24px; display:flex; align-items:center; gap:12px; flex-wrap:wrap; }
        .mvs-back { display:flex; align-items:center; gap:7px; background:rgba(0,200,255,0.06); border:1px solid rgba(0,200,255,0.15); border-radius:7px; color:#7aaaba; font-family:'Rajdhani',sans-serif; font-size:0.88rem; font-weight:600; letter-spacing:0.05em; padding:8px 13px; cursor:pointer; flex-shrink:0; transition:all 0.2s; }
        .mvs-back:hover { background:rgba(0,200,255,0.1); border-color:rgba(0,200,255,0.35); color:#00c8ff; }
        .mvs-brand { display:flex; align-items:center; gap:8px; flex-shrink:0; }
        .mvs-brand img { width:30px; height:30px; border-radius:50%; object-fit:cover; border:1px solid rgba(0,200,255,0.4); box-shadow:0 0 10px rgba(0,200,255,0.2); }
        .mvs-brand-name { font-family:'Bebas Neue',cursive; font-size:1.5rem; letter-spacing:0.12em; color:#e8f4ff; line-height:1; text-shadow:0 0 20px rgba(0,200,255,0.35); }
        .mvs-brand-name .acc { color:#00c8ff; }
        .mvs-vdiv { width:1px; height:26px; background:rgba(0,200,255,0.12); flex-shrink:0; }
        .mvs-tabs { display:flex; gap:6px; }
        .mvs-tab { display:flex; align-items:center; gap:6px; padding:7px 14px; border-radius:7px; border:1px solid rgba(0,200,255,0.1); background:rgba(0,200,255,0.02); color:#3a5a6a; font-family:'Rajdhani',sans-serif; font-size:0.82rem; font-weight:700; letter-spacing:0.06em; cursor:pointer; transition:all 0.2s; text-transform:uppercase; }
        .mvs-tab:hover { border-color:rgba(0,200,255,0.28); color:#80c0d8; }
        .mvs-tab.on { background:rgba(0,200,255,0.12); border-color:rgba(0,200,255,0.5); color:#00c8ff; box-shadow:0 0 12px rgba(0,200,255,0.1); }
        .mvs-search-wrap { position:relative; flex:1; max-width:360px; min-width:140px; }
        .mvs-search-ico { position:absolute; left:12px; top:50%; transform:translateY(-50%); color:rgba(0,200,255,0.28); pointer-events:none; }
        .mvs-search { width:100%; background:rgba(0,200,255,0.04); border:1px solid rgba(0,200,255,0.12); border-radius:8px; color:#e8f4ff; font-family:'Rajdhani',sans-serif; font-size:0.9rem; font-weight:500; padding:9px 36px 9px 36px; outline:none; transition:all 0.25s; }
        .mvs-search::placeholder { color:#2a3a4a; }
        .mvs-search:focus { border-color:rgba(0,200,255,0.4); background:rgba(0,200,255,0.06); box-shadow:0 0 0 3px rgba(0,200,255,0.07); }
        .mvs-clear { position:absolute; right:10px; top:50%; transform:translateY(-50%); background:none; border:none; cursor:pointer; color:rgba(0,200,255,0.3); display:flex; align-items:center; transition:color 0.2s; }
        .mvs-clear:hover { color:#00c8ff; }
        .mvs-pills-row { max-width:1400px; margin:0 auto; padding:8px 24px 11px; display:flex; gap:6px; overflow-x:auto; scrollbar-width:none; }
        .mvs-pills-row::-webkit-scrollbar { display:none; }
        .mvs-pill { flex-shrink:0; padding:5px 13px; border-radius:3px; border:1px solid rgba(0,200,255,0.08); background:rgba(0,200,255,0.02); color:#3a5a6a; font-size:0.73rem; font-weight:600; font-family:'Rajdhani',sans-serif; letter-spacing:0.08em; cursor:pointer; transition:all 0.18s; white-space:nowrap; text-transform:uppercase; }
        .mvs-pill:hover { border-color:rgba(0,200,255,0.28); color:#80c0d8; background:rgba(0,200,255,0.04); }
        .mvs-pill.on { background:rgba(0,200,255,0.1); border-color:rgba(0,200,255,0.45); color:#00c8ff; font-weight:700; box-shadow:0 0 10px rgba(0,200,255,0.1); }
        .mvs-main { max-width:1400px; margin:0 auto; padding:22px 24px 64px; position:relative; z-index:1; }
        .mvs-heading-row { display:flex; align-items:baseline; gap:10px; margin-bottom:18px; }
        .mvs-heading { font-family:'Bebas Neue',cursive; font-size:1.45rem; letter-spacing:0.08em; color:#e8f4ff; }
        .mvs-count { font-size:0.7rem; color:rgba(0,200,255,0.4); font-weight:600; letter-spacing:0.12em; text-transform:uppercase; font-family:'Rajdhani',sans-serif; }
        .mvs-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(148px,1fr)); gap:14px; }
        .mvs-pager { display:flex; align-items:center; justify-content:center; gap:5px; margin-top:32px; }
        .mvs-pager-btn { min-width:34px; height:34px; display:flex; align-items:center; justify-content:center; background:rgba(0,200,255,0.03); border:1px solid rgba(0,200,255,0.1); border-radius:6px; color:#3a5a6a; font-family:'Rajdhani',sans-serif; font-size:0.83rem; font-weight:600; cursor:pointer; transition:all 0.18s; padding:0 5px; }
        .mvs-pager-btn:hover:not(:disabled) { border-color:rgba(0,200,255,0.35); color:#00c8ff; background:rgba(0,200,255,0.07); }
        .mvs-pager-btn.on { background:rgba(0,200,255,0.12); border-color:rgba(0,200,255,0.5); color:#00c8ff; font-weight:700; }
        .mvs-pager-btn:disabled { opacity:0.25; cursor:not-allowed; }
        .mvs-pager-info { text-align:center; margin-top:9px; font-size:0.68rem; color:rgba(0,200,255,0.28); letter-spacing:0.1em; text-transform:uppercase; font-family:'Rajdhani',sans-serif; }
        .mvs-empty { text-align:center; padding:72px 20px; }
        .mvs-empty-icon { width:72px; height:72px; border-radius:50%; margin:0 auto 16px; background:rgba(0,200,255,0.03); border:1px solid rgba(0,200,255,0.08); display:flex; align-items:center; justify-content:center; }

        /* ── Cards ─────────────────────────────────────────────────────────── */
        .mv-card { cursor:pointer; background:#0b0b12; border:1px solid rgba(0,200,255,0.07); border-radius:7px; overflow:hidden; position:relative; transition:transform 0.25s cubic-bezier(0.34,1.56,0.64,1),border-color 0.2s,box-shadow 0.25s; font-family:'Rajdhani',sans-serif; }
        .mv-card:hover { transform:translateY(-5px) scale(1.02); border-color:rgba(0,200,255,0.35); box-shadow:0 18px 45px rgba(0,0,0,0.8),0 0 22px rgba(0,200,255,0.06); }
        .mv-card::before { content:''; position:absolute; top:0; left:0; right:0; height:1px; background:linear-gradient(90deg,transparent,rgba(0,200,255,0.6),transparent); opacity:0; z-index:5; transition:opacity 0.25s; }
        .mv-card:hover::before { opacity:1; }
        .mv-poster-wrap { position:relative; aspect-ratio:2/3; overflow:hidden; background:linear-gradient(135deg,#080810,#0f1824); }
        .mv-poster-wrap img { width:100%; height:100%; object-fit:cover; display:block; transition:transform 0.4s ease,filter 0.3s; filter:brightness(0.93) saturate(0.9); }
        .mv-card:hover .mv-poster-wrap img { transform:scale(1.06); filter:brightness(1) saturate(1.1); }
        .mv-poster-grad { position:absolute; inset:0; background:linear-gradient(180deg,transparent 50%,rgba(6,6,10,0.97) 100%); pointer-events:none; }
        .mv-badge { position:absolute; font-size:0.57rem; font-weight:700; padding:2px 6px; border-radius:3px; letter-spacing:0.07em; font-family:'Rajdhani',sans-serif; backdrop-filter:blur(4px); }
        .mv-badge-type { top:8px; left:8px; background:rgba(0,0,0,0.6); border:1px solid rgba(255,255,255,0.15); color:rgba(255,255,255,0.8); font-size:0.75rem; }
        .mv-badge-archive { bottom:8px; left:8px; background:rgba(0,200,100,0.18); border:1px solid rgba(0,200,100,0.5); color:#00e87a; font-size:0.55rem; }
        .mv-badge-year { top:8px; right:8px; background:rgba(0,0,0,0.65); border:1px solid rgba(255,255,255,0.1); color:rgba(255,255,255,0.7); }
        .mv-play-wrap { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; background:rgba(0,0,0,0); transition:background 0.25s; }
        .mv-card:hover .mv-play-wrap { background:rgba(0,8,18,0.5); }
        .mv-play-btn { width:52px; height:52px; border-radius:50%; background:rgba(0,200,255,0.88); display:flex; align-items:center; justify-content:center; transform:scale(0); opacity:0; transition:transform 0.3s cubic-bezier(0.34,1.56,0.64,1),opacity 0.2s; box-shadow:0 4px 24px rgba(0,200,255,0.5); }
        .mv-card:hover .mv-play-btn { transform:scale(1); opacity:1; }
        .mv-card-body { padding:8px 10px 11px; }
        .mv-title { font-weight:700; font-size:0.86rem; color:#e0eeff; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; margin-bottom:3px; font-family:'Rajdhani',sans-serif; }
        .mv-meta-row { display:flex; align-items:center; gap:4px; font-size:0.65rem; color:#4a6a7a; margin-bottom:5px; font-family:'Rajdhani',sans-serif; font-weight:500; }
        .mv-imdb { display:flex; align-items:center; gap:2px; font-size:0.65rem; color:#f5c518; font-weight:700; }
        .mv-genre-pill { display:inline-block; background:rgba(0,200,255,0.06); color:rgba(0,200,255,0.75); border:1px solid rgba(0,200,255,0.16); font-size:0.58rem; font-weight:700; letter-spacing:0.06em; padding:2px 7px; border-radius:2px; text-transform:uppercase; font-family:'Rajdhani',sans-serif; }
      `}</style>

      <div className="mvs-root">
        <header className="mvs-header">
          <div className="mvs-header-row">
            <button className="mvs-back" onClick={onBack}><ArrowLeft size={14}/> Canales</button>
            <div className="mvs-brand">
              <img src="https://i.postimg.cc/j2WvZw96/Whats-App-Image-2026-03-02-at-11-44-07.jpg" alt="TechPhantom"/>
              <span className="mvs-brand-name"><span className="acc">Tech</span>Phantom</span>
            </div>
            <div className="mvs-vdiv"/>
            <div className="mvs-tabs">
              <button className={`mvs-tab ${tab === 'movie' ? 'on' : ''}`} onClick={() => switchTab('movie')}><Film size={13}/> Películas</button>
              <button className={`mvs-tab ${tab === 'series' ? 'on' : ''}`} onClick={() => switchTab('series')}><Tv size={13}/> Series</button>
            </div>
            <div className="mvs-search-wrap">
              <Search size={13} className="mvs-search-ico"/>
              <input className="mvs-search" type="text" placeholder={tab === 'movie' ? 'Buscar película…' : 'Buscar serie…'} value={search} onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}/>
              {search && <button className="mvs-clear" onClick={() => { setSearch(''); setCurrentPage(1); }}><X size={12}/></button>}
            </div>
          </div>
          <div className="mvs-pills-row">
            {genres.map(g => (
              <button key={g} className={`mvs-pill ${activeGenre === g ? 'on' : ''}`} onClick={() => { setActiveGenre(g); setCurrentPage(1); }}>{g}</button>
            ))}
          </div>
        </header>

        <main className="mvs-main">
          <div className="mvs-heading-row">
            <span className="mvs-heading">
              {search ? `"${search}"` : activeGenre !== 'Todos' ? activeGenre : tab === 'movie' ? 'Películas' : 'Series'}
            </span>
            <span className="mvs-count">{filtered.length} títulos · pelisjuanita.com</span>
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
                  <MovieCard key={m.id} item={m} onClick={() => setPlaying(m)}/>
                ))}
              </div>
              {totalPages > 1 && (
                <>
                  <div className="mvs-pager">
                    <button className="mvs-pager-btn" disabled={currentPage === 1} onClick={() => go(currentPage - 1)}><ChevronLeft size={14}/></button>
                    {Array.from({length: totalPages}, (_, i) => i + 1).map(p => (
                      <button key={p} className={`mvs-pager-btn ${currentPage === p ? 'on' : ''}`} onClick={() => go(p)}>{p}</button>
                    ))}
                    <button className="mvs-pager-btn" disabled={currentPage === totalPages} onClick={() => go(currentPage + 1)}><ChevronRight size={14}/></button>
                  </div>
                  <p className="mvs-pager-info">Página {currentPage} de {totalPages} — {ITEMS_PER_PAGE} por página</p>
                </>
              )}
            </>
          )}
        </main>
      </div>

      {/* Reproductor fullscreen — montado encima de todo, sin modal */}
      {playing && <FullscreenPlayer item={playing} onClose={() => setPlaying(null)}/>}
    </>
  );
}