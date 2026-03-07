import { useState, useMemo, useEffect, useRef } from 'react';
import { Channel } from '../types';
import { ArrowLeft, Tv, Film, AlertCircle, MapPin, ChevronLeft, ChevronRight, ExternalLink, Star, Clock } from 'lucide-react';

interface VideoPlayerProps {
  channel: Channel;
  channels: Channel[];
  onBack: () => void;
  onChannelChange: (channel: Channel) => void;
}

const PJ_BASE = 'https://pelisjuanita.com/tv/';
const PJ_CVATT = (get: string) => `${PJ_BASE}cvatt.html?get=${get}`;
const PJ_EMBED  = (file: string) => `https://embed.saohgdasregions.fun/embed2/${file}`;
const PJ_EMBED2 = (file: string) => `https://embed.sdfgnksbounce.com/embed2/${file}`;

// Mapa slug → array de servidores (extraído directamente del HTML de pelisjuanita)
const PJ_STREAMS: Record<string, { label: string; url: string }[]> = {
  // ── Argentina — aire ──────────────────────────────────────────────────────
  'telefe': [
    { label: 'Servidor 1', url: PJ_EMBED('telefe.html') },
    { label: 'Servidor 2', url: PJ_CVATT('VGVsZWZlSEQ=') },
    { label: 'Servidor 3', url: PJ_EMBED2('telefe.html') },
  ],
  'el-trece': [
    { label: 'Servidor 1', url: `${PJ_BASE}f.html?get=https://live-01-02-eltrece.vodgc.net/eltrecetv/index.m3u8` },
    { label: 'Servidor 2', url: PJ_EMBED('eltrece.html') },
    { label: 'Servidor 3', url: PJ_EMBED2('eltrece.html') },
  ],
  'tn': [
    { label: 'Servidor 1', url: `${PJ_BASE}f.html?get=https://live-01-01-tn.vodgc.net/TN24/index.m3u8` },
    { label: 'Servidor 2', url: PJ_CVATT('VG9kb05vdGljaWFz') },
  ],
  'tv-publica': [
    { label: 'Servidor 1', url: PJ_EMBED('tvpublica.html') },
    { label: 'Servidor 2', url: PJ_CVATT('Q2FuYWw3') },
  ],
  'america': [
    { label: 'Servidor 1', url: PJ_CVATT('QW1lcmljYVRW') },
    { label: 'Servidor 2', url: `${PJ_BASE}americatv.html?1` },
  ],
  'c5n': [
    { label: 'Servidor 1', url: PJ_CVATT('QzVO') },
  ],
  'cronica': [
    { label: 'Servidor 1', url: PJ_CVATT('Q3JvbmljYVRW') },
  ],
  'canal-nueve': [
    { label: 'Servidor 1', url: PJ_CVATT('Q2FuYWw5') },
    { label: 'Servidor 2', url: 'https://player.twitch.tv/?channel=elnueveenvivo&parent=pelisjuanita.com' },
  ],
  'ln': [
    { label: 'Servidor 1', url: PJ_CVATT('TGFfTmFjaW9u') },
  ],
  'a24': [
    { label: 'Servidor 1', url: PJ_CVATT('QW1lcmljYTI0') },
  ],
  'canal-26': [
    { label: 'Servidor 1', url: PJ_CVATT('MjZfVFZfSEQ') },
  ],
  'telefe-rosario': [
    { label: 'Servidor 1', url: `${PJ_BASE}telefe-rosario.php` },
    { label: 'Servidor 2', url: PJ_CVATT('Q2FuYWxfNV9Sb3Nhcmlv') },
  ],
  'canal-doce': [
    { label: 'Servidor 1', url: PJ_CVATT('Q2FuYWxfMTJfQ0JB') },
  ],
  'el-tres': [
    { label: 'Servidor 1', url: `${PJ_BASE}eltres.php` },
  ],
  'encuentro': [
    { label: 'Servidor 1', url: PJ_CVATT('RW5jdWVudHJv') },
    { label: 'Servidor 2', url: `${PJ_BASE}f.html?get=https://538d0bde28ccf.streamlock.net/live-cont.ar/encuentro/chunklist_w2142228384.m3u8?WebM3UCL` },
  ],
  'paka-paka': [
    { label: 'Servidor 1', url: PJ_CVATT('UEFLQV9QQUtB') },
  ],
  'baby-tv': [
    { label: 'Servidor 1', url: `${PJ_BASE}trimi.html?id=BABY_TV` },
    { label: 'Servidor 2', url: PJ_CVATT('QmFieVRW') },
  ],
  'el-gourmet': [
    { label: 'Servidor 1', url: PJ_CVATT('R291cm1ldA==') },
    { label: 'Servidor 2', url: PJ_EMBED('elgourmet.html') },
  ],
  'cinecanal': [
    { label: 'Servidor 1', url: PJ_CVATT('Q2luZWNhbmFsSEQ=') },
    { label: 'Servidor 2', url: PJ_EMBED('cinecanal.html') },
  ],
  'cine-ar': [
    { label: 'Servidor 1', url: PJ_CVATT('SU5DQUFfVHY=') },
    { label: 'Servidor 2', url: `${PJ_BASE}trimi.html?id=CINE_AR` },
  ],
  'space': [
    { label: 'Servidor 1', url: `${PJ_BASE}trimi.html?id=SPACE` },
    { label: 'Servidor 2', url: PJ_EMBED('space.html') },
  ],
  'star-channel': [
    { label: 'Servidor 1', url: `${PJ_BASE}trimi.html?id=STAR` },
    { label: 'Servidor 2', url: PJ_EMBED('starchannel.html') },
  ],
  'volver': [
    { label: 'Servidor 1', url: PJ_CVATT('Vm9sdmVy') },
  ],
  'ciudad-magazine': [
    { label: 'Servidor 1', url: PJ_CVATT('TWFnYXppbmU=') },
  ],
  'tooncast': [
    { label: 'Servidor 1', url: `${PJ_BASE}trimi.html?id=TOONCAST` },
    { label: 'Servidor 2', url: `https://embed.ksdjugfsddeports.com/embed/tooncast.html` },
  ],
  'diputados-tv': [
    { label: 'Servidor 1', url: PJ_CVATT('RGlwdXRhZG9zX1RW') },
  ],
  'ip-noticias': [
    { label: 'Servidor 1', url: PJ_CVATT('SW52ZXN0aWdhY2lvbl9QZXJpb2Rpc3RpY2E=') },
  ],
  'metro': [
    { label: 'Servidor 1', url: PJ_CVATT('TWV0cm8') },
  ],
  'telemax': [
    { label: 'Servidor 1', url: `${PJ_BASE}f.html?get=https://stream-gtlc.telecentro.net.ar/hls/telemaxhls/main.m3u8?PlaylistM3UCL` },
    { label: 'Servidor 2', url: PJ_CVATT('VGVsZW1heA') },
  ],
  'argentinisima': [
    { label: 'Servidor 1', url: `${PJ_BASE}f.html?get=https://stream1.sersat.com/hls/argentinisima.m3u8` },
    { label: 'Servidor 2', url: PJ_CVATT('QXJnZW50aW5pc2ltYQ') },
  ],
  'nettv': [
    { label: 'Servidor 1', url: `${PJ_BASE}f.html?get=https://unlimited1-us.dps.live/nettv/nettv.smil/playlist.m3u8` },
    { label: 'Servidor 2', url: PJ_CVATT('TmV0X1RW') },
  ],
  'canal-de-la-ciudad': [
    { label: 'Servidor 1', url: PJ_CVATT('Q2FuYWxfZGVfbGFfY2l1ZGFk') },
    { label: 'Servidor 2', url: 'https://vmf.edge-apps.net/embed/live.php?streamname=gcba_video4-100042&autoplay=false' },
  ],
  'chacra-tv': [
    { label: 'Servidor 1', url: 'https://vmf.edge-apps.net/embed/live.php?streamname=gcba_video3-100042&autoplay=true' },
  ],
  'garage-tv': [
    { label: 'Servidor 1', url: `${PJ_BASE}f.html?get=//stream1.sersat.com/hls/garagetv.m3u8` },
    { label: 'Servidor 2', url: PJ_CVATT('RWxfR2FyYWdl') },
  ],
  'canal-luz': [
    { label: 'Servidor 1', url: 'https://vmf.edge-apps.net/embed/live.php?streamname=canal_luz01-100009&autoplay=0&loop=0' },
  ],
  'orbe-21': [
    { label: 'Servidor 1', url: `${PJ_BASE}f.html?get=aHR0cHM6Ly9zdHJlYW0uYXJjYXN0Lm5ldDo0NDQzL2NhbmFsMjEvbmdycDpjYW5hbDIxX2FsbC9jaHVua2xpc3RfdzExNzk4OTM3NjNfYjIyMTE4NDAubTN1OA==` },
  ],
  'cm': [
    { label: 'Servidor 1', url: `${PJ_BASE}trimi.html?id=CM` },
    { label: 'Servidor 2', url: PJ_CVATT('Q00=') },
  ],
  'quiero': [
    { label: 'Servidor 1', url: PJ_CVATT('UXVpZXJvX0hE') },
  ],
  'cumbia-mix': [
    { label: 'Servidor 1', url: `${PJ_BASE}f.html?get=aHR0cHM6Ly9jbG91ZC50dm9taXguY29tL0NVTUJJQU1JWC9pbmRleC5tM3U4` },
  ],
  'musica-top': [
    { label: 'Servidor 1', url: `${PJ_BASE}f.html?get=https://stream-gtlc.telecentro.net.ar/hls/musictophls/main.m3u8` },
  ],
  'unife': [
    { label: 'Servidor 1', url: `${PJ_BASE}f.html?get=aHR0cHM6Ly9jZG4ubXljbG91ZHN0cmVhbS5pby9obHMvbGl2ZS9icm9hZGNhc3QvcGd2NWtlcmsvbW9uby5tM3U4` },
  ],

  // ── Deportes — ESPN 1–7 desde pelisjuanita (otros ESPN) ───────────────────
  'espn': [
    { label: 'Servidor 1', url: PJ_CVATT('RVNQTjJIRA') },
    { label: 'Servidor 2', url: `${PJ_BASE}trimi.html?id=ESPN` },
    { label: 'Servidor 3', url: 'https://la14hd.com/vivo/canal.php?stream=espn' },
  ],
  'espn-2': [
    { label: 'Servidor 1', url: PJ_CVATT('RVNQTjJfQXJn') },
    { label: 'Servidor 2', url: `${PJ_BASE}trimi.html?id=ESPN_2` },
    { label: 'Servidor 3', url: PJ_EMBED('espn2.html') },
  ],
  'espn-3': [
    { label: 'Servidor 1', url: `${PJ_BASE}trimi.html?id=ESPN_3` },
    { label: 'Servidor 2', url: PJ_CVATT('RVNQTjM') },
    { label: 'Servidor 3', url: PJ_EMBED('espn3.html') },
  ],
  'espn-4': [
    { label: 'Servidor 1', url: `${PJ_BASE}trimi.html?id=ESPN_4` },
    { label: 'Servidor 2', url: PJ_CVATT('RVNQTkhE') },
    { label: 'Servidor 3', url: PJ_EMBED('espn4.html') },
  ],
  'espn-5': [
    { label: 'Servidor 1', url: PJ_CVATT('RVNQTjQ=') },
    { label: 'Servidor 2', url: PJ_EMBED('espn5.html') },
    { label: 'Servidor 3', url: 'https://deportelibre.space/canales/espn5/op2.php' },
  ],
  'espn-6': [
    { label: 'Servidor 1', url: PJ_CVATT('Rm94U3BvcnRzM19VWQ==') },
    { label: 'Servidor 2', url: PJ_EMBED('espn6.html') },
    { label: 'Servidor 3', url: 'https://deportelibre.space/canales/espn6/op2.php' },
  ],
  'espn-7': [
    { label: 'Servidor 1', url: PJ_CVATT('Rm94U3BvcnRzMl9VWQ==') },
    { label: 'Servidor 2', url: PJ_EMBED('espn7.html') },
    { label: 'Servidor 3', url: 'https://deportelibre.space/canales/espn7/op2.php' },
  ],
  'deportv': [
    { label: 'Servidor 1', url: `${PJ_BASE}trimi.html?id=DEPORTV` },
    { label: 'Servidor 2', url: PJ_CVATT('RGVwb3JUVkhE') },
  ],
  'fox-sports': [
    { label: 'Servidor 1', url: PJ_CVATT('Rm94U3BvcnRz') },
    { label: 'Servidor 2', url: 'https://la14hd.com/vivo/canales.php?stream=foxsports' },
    { label: 'Servidor 3', url: PJ_EMBED('foxsports.html') },
  ],
  'fox-sports-2': [
    { label: 'Servidor 1', url: `${PJ_BASE}trimi.html?id=Fox_Sports_2` },
    { label: 'Servidor 2', url: PJ_CVATT('Rm94U3BvcnRzMkhE') },
    { label: 'Servidor 3', url: PJ_EMBED('foxsports2.htm') },
  ],
  'fox-sports-3': [
    { label: 'Servidor 1', url: `${PJ_BASE}trimi.html?id=Fox_Sports_3` },
    { label: 'Servidor 2', url: PJ_CVATT('Rm94U3BvcnRzM0hE') },
    { label: 'Servidor 3', url: PJ_EMBED('foxsports3.html') },
  ],
  'espn-premium': [
    { label: 'Servidor 1', url: PJ_CVATT('Rm94X1Nwb3J0c19QcmVtaXVuX0hE') },
    { label: 'Servidor 2', url: `${PJ_BASE}trimi.html?id=ESPN_PREMIUM2` },
    { label: 'Servidor 3', url: 'https://la14hd.com/vivo/canal.php?stream=espnpremium' },
  ],
  'directv-sports': [
    { label: 'Servidor 1', url: PJ_CVATT('RGlyZWNUVl9TcG9ydHM=') },
    { label: 'Servidor 2', url: PJ_EMBED('directvsports.html') },
  ],
  'tyc-sports': [
    { label: 'Servidor 1', url: PJ_CVATT('VHlDU3BvcnQ') },
    { label: 'Servidor 2', url: 'https://la14hd.com/vivo/canales.php?stream=tycsports' },
    { label: 'Servidor 3', url: PJ_EMBED('tycsports.html') },
  ],
  'tyc-sports-internacional': [
    { label: 'Servidor 1', url: PJ_CVATT('VHlDX0ludGVybmFjaW9uYWw=') },
  ],
  'tnt-sports': [
    { label: 'Servidor 1', url: PJ_CVATT('VE5UX1Nwb3J0c19IRA') },
    { label: 'Servidor 2', url: `${PJ_BASE}trimi.html?id=TNT_SPORTS2` },
    { label: 'Servidor 3', url: 'https://la14hd.com/vivo/canal.php?stream=tntsports' },
  ],
  'tnt-sports-arg': [
    { label: 'Servidor 1', url: PJ_CVATT('VE5UX1Nwb3J0c19IRA') },
    { label: 'Servidor 2', url: `${PJ_BASE}trimi.html?id=TNT_SPORTS2` },
    { label: 'Servidor 3', url: 'https://la14hd.com/vivo/canal.php?stream=tntsports' },
  ],
  'nba-tv': [
    { label: 'Servidor 1', url: PJ_CVATT('TkJBX1RW') },
  ],
  'nba-tv2': [
    { label: 'Servidor 1', url: PJ_CVATT('TkJBX1RW') },
  ],
  'tudn': [
    { label: 'Servidor 1', url: 'https://embed.saohgdasregions.fun/embed/tudn.html' },
  ],
  'formula-1': [
    { label: 'Servidor 1', url: 'https://embed.ksdjugfsddeports.com/embed2/daznf1.html' },
    { label: 'Servidor 2', url: 'https://dtvlivegratis.com/cn.php?id=DAZN_F1' },
  ],

  // ── Cable Internacional ───────────────────────────────────────────────────
  'a-e': [
    { label: 'Servidor 1', url: `${PJ_BASE}trimi.html?id=AE` },
    { label: 'Servidor 2', url: PJ_CVATT('QUVIRA==') },
  ],
  'amc': [
    { label: 'Servidor 1', url: PJ_CVATT('QU1D') },
    { label: 'Servidor 2', url: PJ_EMBED('amc.html') },
  ],
  'animal-planet': [
    { label: 'Servidor 1', url: `${PJ_BASE}trimi.html?id=ANIMAL_PLANET` },
    { label: 'Servidor 2', url: PJ_EMBED('animalplanet.html') },
  ],
  'axn': [
    { label: 'Servidor 1', url: `${PJ_BASE}trimi.html?id=AXN` },
    { label: 'Servidor 2', url: PJ_CVATT('QVHOSEI=') },
    { label: 'Servidor 3', url: PJ_EMBED('axn.html') },
  ],
  'cartoon-network': [
    { label: 'Servidor 1', url: `${PJ_BASE}trimi.html?id=CARTOON` },
    { label: 'Servidor 2', url: PJ_EMBED('cartoonnetwork.html') },
  ],
  'cartoonito': [
    { label: 'Servidor 1', url: `${PJ_BASE}trimi.html?id=CARTOONITO` },
    { label: 'Servidor 2', url: PJ_EMBED('cartoonito.html') },
  ],
  'cinemax': [
    { label: 'Servidor 1', url: `${PJ_BASE}trimi.html?id=CINEMAX` },
    { label: 'Servidor 2', url: PJ_CVATT('Q2luZW1heA==') },
    { label: 'Servidor 3', url: PJ_EMBED('cinemax.htm') },
  ],
  'comedy-central': [
    { label: 'Servidor 1', url: `${PJ_BASE}trimi.html?id=COMEDY_CENTRAL` },
    { label: 'Servidor 2', url: PJ_EMBED('comedycentral.html') },
  ],
  'discovery-channel': [
    { label: 'Servidor 1', url: `${PJ_BASE}trimi.html?id=DISCOVERY_CHANNEL_BACKUP` },
    { label: 'Servidor 2', url: PJ_CVATT('RGlzY292ZXJ5SEQ=') },
    { label: 'Servidor 3', url: PJ_EMBED('discoverychannel.html') },
  ],
  'discovery-h-h': [
    { label: 'Servidor 1', url: PJ_EMBED('discoveryhyh.html') },
  ],
  'discovery-id': [
    { label: 'Servidor 1', url: `${PJ_BASE}trimi.html?id=Discovery_ID` },
    { label: 'Servidor 2', url: PJ_EMBED('idinvestigation.html') },
  ],
  'discovery-kids': [
    { label: 'Servidor 1', url: `${PJ_BASE}trimi.html?id=Discovery_KIDS` },
    { label: 'Servidor 2', url: PJ_EMBED('discoverykids.html') },
  ],
  'discovery-theater': [
    { label: 'Servidor 1', url: `${PJ_BASE}trimi.html?id=Discovery_THEATER` },
    { label: 'Servidor 2', url: PJ_EMBED('discoverytheater.html') },
  ],
  'discovery-tlc': [
    { label: 'Servidor 1', url: `${PJ_BASE}trimi.html?id=Discovery_TLC` },
    { label: 'Servidor 2', url: PJ_EMBED('discoverytlc.html') },
  ],
  'discovery-world': [
    { label: 'Servidor 1', url: `${PJ_BASE}trimi.html?id=Discovery_WORLD` },
  ],
  'disney-channel': [
    { label: 'Servidor 1', url: `${PJ_BASE}trimi.html?id=DISNEY` },
    { label: 'Servidor 2', url: PJ_EMBED('disneychannel.html') },
  ],
  'disney-jr': [
    { label: 'Servidor 1', url: `${PJ_BASE}trimi.html?id=DISNEY_JR` },
    { label: 'Servidor 2', url: PJ_EMBED('disneyjr.html') },
  ],
  'dreamworks': [
    { label: 'Servidor 1', url: PJ_CVATT('RHJlYW13b3Jrcw==') },
  ],
  'e-entertaiment': [
    { label: 'Servidor 1', url: `${PJ_BASE}trimi.html?id=CANAL_E` },
    { label: 'Servidor 2', url: PJ_CVATT('RV9FbnRlcnRhaW5tZW50X1RlbGV2aXNpb24=') },
  ],
  'fox-news': [
    { label: 'Servidor 1', url: PJ_CVATT('Rm94X05ld3M=') },
  ],
  'fxhd': [
    { label: 'Servidor 1', url: PJ_CVATT('RlhIRA==') },
    { label: 'Servidor 2', url: `${PJ_BASE}trimi.html?id=FX` },
    { label: 'Servidor 3', url: PJ_EMBED('fx.html') },
  ],
  'hbo': [
    { label: 'Servidor 1', url: PJ_CVATT('SEJPSEQ=') },
  ],
  'hbo-2': [
    { label: 'Servidor 1', url: PJ_CVATT('SEJPXzI=') },
  ],
  'hbo-family': [
    { label: 'Servidor 1', url: `${PJ_BASE}trimi.html?id=HBO_FAMILY` },
    { label: 'Servidor 2', url: PJ_CVATT('SEJPX0ZhbWlseQ==') },
  ],
  'hbo-mundi': [
    { label: 'Servidor 1', url: PJ_CVATT('SEJPX011bmRp') },
  ],
  'hbo-plus': [
    { label: 'Servidor 1', url: `${PJ_BASE}trimi.html?id=HBO_PLUS` },
    { label: 'Servidor 2', url: PJ_CVATT('SEJPX1BsdXM=') },
  ],
  'hbo-pop': [
    { label: 'Servidor 1', url: PJ_CVATT('SEJPX1BPUA==') },
  ],
  'hbo-signature': [
    { label: 'Servidor 1', url: `${PJ_BASE}trimi.html?id=HBO_SIGNATURE` },
    { label: 'Servidor 2', url: PJ_CVATT('SEJPX1NpZ25hdHVyZQ==') },
  ],
  'hbo-xtreme': [
    { label: 'Servidor 1', url: PJ_CVATT('SEJPX0V4dHJlbWU=') },
  ],
  'history': [
    { label: 'Servidor 1', url: `${PJ_BASE}trimi.html?id=HISTORY` },
    { label: 'Servidor 2', url: PJ_CVATT('SGlzdG9yeUhE') },
    { label: 'Servidor 3', url: PJ_EMBED('history.html') },
  ],
  'history-2': [
    { label: 'Servidor 1', url: `${PJ_BASE}trimi.html?id=HISTORY2` },
    { label: 'Servidor 2', url: PJ_EMBED('history2.html') },
  ],
  'htv': [
    { label: 'Servidor 1', url: `${PJ_BASE}trimi.html?id=HTV` },
    { label: 'Servidor 2', url: PJ_CVATT('SFRW') },
  ],
  'lifetime': [
    { label: 'Servidor 1', url: `${PJ_BASE}trimi.html?id=LIFETIME` },
    { label: 'Servidor 2', url: PJ_CVATT('TGlmZXRpbWU=') },
  ],
  'mtv': [
    { label: 'Servidor 1', url: `${PJ_BASE}trimi.html?id=MTV` },
    { label: 'Servidor 2', url: PJ_CVATT('TVRWX0hE') },
    { label: 'Servidor 3', url: PJ_EMBED('mtv.html') },
  ],
  'mtv-00s': [
    { label: 'Servidor 1', url: `${PJ_BASE}trimi.html?id=MTV_00s` },
    { label: 'Servidor 2', url: PJ_CVATT('TVRWMDA=') },
  ],
  'national-geographic': [
    { label: 'Servidor 1', url: `${PJ_BASE}trimi.html?id=NAT_GEO` },
    { label: 'Servidor 2', url: PJ_EMBED('natgeo.html') },
  ],
  'nick': [
    { label: 'Servidor 1', url: `${PJ_BASE}trimi.html?id=NICK` },
    { label: 'Servidor 2', url: PJ_EMBED('nick.html') },
  ],
  'nick-jr': [
    { label: 'Servidor 1', url: `${PJ_BASE}trimi.html?id=NICK_JR` },
    { label: 'Servidor 2', url: PJ_EMBED('nickjr.html') },
  ],
  'sony-channel': [
    { label: 'Servidor 1', url: `${PJ_BASE}trimi.html?id=SONY` },
    { label: 'Servidor 2', url: PJ_CVATT('U29ueUhE') },
    { label: 'Servidor 3', url: PJ_EMBED('sony.htm') },
  ],
  'studio-universal': [
    { label: 'Servidor 1', url: PJ_CVATT('U3R1ZGlvX1VuaXZlcnNhbA==') },
    { label: 'Servidor 2', url: PJ_EMBED('studiouniversal.html') },
    { label: 'Servidor 3', url: PJ_EMBED2('studiouniversal.html') },
  ],
  'tcm': [
    { label: 'Servidor 1', url: PJ_CVATT('VENN') },
  ],
  'tnt-hd': [
    { label: 'Servidor 1', url: `${PJ_BASE}trimi.html?id=TNT` },
    { label: 'Servidor 2', url: PJ_CVATT('VE5UX0hEX0FyZw==') },
    { label: 'Servidor 3', url: PJ_EMBED('tnt.html') },
  ],
  'tnt-novelas': [
    { label: 'Servidor 1', url: `${PJ_BASE}trimi.html?id=TNT_NOVELAS` },
    { label: 'Servidor 2', url: PJ_EMBED('tntnovelas.html') },
  ],
  'tnt-series': [
    { label: 'Servidor 1', url: `${PJ_BASE}trimi.html?id=TNT_SERIES` },
    { label: 'Servidor 2', url: PJ_EMBED('tntseries.htm') },
  ],
  'universal-cinema': [
    { label: 'Servidor 1', url: PJ_CVATT('VW5pdmVyc2FsX0NpbmVtYQ==') },
    { label: 'Servidor 2', url: 'https://embed.saohgdasregions.fun/embed/universalcinema.html' },
  ],
  'universal-tv': [
    { label: 'Servidor 1', url: PJ_CVATT('VW5pdmVyc2FsX0NoYW5uZWxfSEQ=') },
    { label: 'Servidor 2', url: PJ_EMBED('universalchannel.html') },
    { label: 'Servidor 3', url: PJ_EMBED2('universalchannel.html') },
  ],
  'usa-network': [
    { label: 'Servidor 1', url: PJ_CVATT('VVNBX05ldHdvcms=') },
  ],
  'warner': [
    { label: 'Servidor 1', url: `${PJ_BASE}trimi.html?id=WARNER` },
    { label: 'Servidor 2', url: PJ_CVATT('V2FybmVySEQ=') },
    { label: 'Servidor 3', url: PJ_EMBED2('warnerchannel.html') },
  ],
  'adult-swim': [
    { label: 'Servidor 1', url: PJ_CVATT('QWR1bHRfU3dpbQ==') },
    { label: 'Servidor 2', url: `${PJ_BASE}trimi.html?id=ADULT_SWIM` },
  ],

  // ── Noticias internacionales ──────────────────────────────────────────────
  'france-24-espanol': [
    { label: 'Servidor 1', url: `${PJ_BASE}f.html?get=https://live.france24.com/hls/live/2037220-b/F24_ES_HI_HLS/master_5000.m3u8` },
  ],
  'tv5-monde': [
    { label: 'Servidor 1', url: PJ_CVATT('VFY1X01vbmRl') },
  ],
  'rai': [
    { label: 'Servidor 1', url: PJ_CVATT('UkFJ') },
  ],
  'dw': [
    { label: 'Servidor 1', url: `${PJ_BASE}f.html?get=https://dwamdstream104.akamaized.net/hls/live/2015530/dwstream104/index.m3u8` },
    { label: 'Servidor 2', url: `${PJ_BASE}trimi.html?id=DW` },
  ],
  'rt-en-espanol': [
    { label: 'Servidor 1', url: `${PJ_BASE}f.html?get=https://rt-esp.rttv.com/live/rtesp/playlist.m3u8` },
  ],
  'telesur': [
    { label: 'Servidor 1', url: `${PJ_BASE}trimi.html?id=TELESUR` },
    { label: 'Servidor 2', url: PJ_CVATT('VGVsZXN1cg==') },
  ],
  'arirang': [
    { label: 'Servidor 1', url: `${PJ_BASE}f.html?get=aHR0cHM6Ly9hbWRsaXZlLWNoMDEtY3RuZC1jb20uYWthbWFpemVkLm5ldC9hcmlyYW5nXzFjaC9zbWlsOmFyaXJhbmdfMWNoLnNtaWwvY2h1bmtsaXN0X2I2NTYwMDBfc2xlbmcubTN1OA==` },
  ],

  // ── España ────────────────────────────────────────────────────────────────
  'antena-3': [
    { label: 'Servidor 1', url: PJ_CVATT('QW50ZW5hXzM=') },
    { label: 'Servidor 2', url: PJ_EMBED('antena3.html') },
  ],
  'tve-internacional': [
    { label: 'Servidor 1', url: `${PJ_BASE}f.html?get=https://ztnr.rtve.es/ztnr/1694255.m3u8?PlaylistM3UCL` },
    { label: 'Servidor 2', url: `${PJ_BASE}trimi.html?id=TVE` },
    { label: 'Servidor 3', url: PJ_CVATT('VFZfRXNwYW5h') },
  ],
  'hola-tv': [
    { label: 'Servidor 1', url: PJ_CVATT('SG9sYV9UVg==') },
  ],

  // ── México / Latinos ──────────────────────────────────────────────────────
  'telemundo': [
    { label: 'Servidor 1', url: `${PJ_BASE}trimi.html?id=TELEMUNDO_52` },
    { label: 'Servidor 2', url: PJ_CVATT('VGVsZW11bmRvX0hE') },
  ],
  'estrella-tv': [
    { label: 'Servidor 1', url: `${PJ_BASE}trimi.html?id=ESTRELLAS` },
    { label: 'Servidor 2', url: PJ_CVATT('Q2FuYWxfZGVfbGFzX2VzdHJlbGxhcw==') },
  ],
  'golden': [
    { label: 'Servidor 1', url: PJ_CVATT('R29sZGVu') },
    { label: 'Servidor 2', url: PJ_EMBED('goldenpremier2.html') },
  ],

  // ── Colombia ──────────────────────────────────────────────────────────────
  'rcn': [
    { label: 'Servidor 1', url: PJ_EMBED('rcn.html') },
  ],

  // ── Uruguay ───────────────────────────────────────────────────────────────
  'canal-10-uruguayo': [
    { label: 'Servidor 1', url: PJ_CVATT('Q2FuYWwxMF9VUlU=') },
  ],
  'canal-4-uruguay': [
    { label: 'Servidor 1', url: PJ_CVATT('Q2FuYWw0X1VSVQ==') },
  ],
  'vtv': [
    { label: 'Servidor 1', url: PJ_CVATT('VlRWX0hE') },
  ],
  'vtv-plus': [
    { label: 'Servidor 1', url: PJ_CVATT('VlRWX1BsdXNfSEQ') },
    { label: 'Servidor 2', url: 'https://la14hd.com/vivo/canales.php?stream=vtvplus' },
  ],
  'charrua-tv': [
    { label: 'Servidor 1', url: 'https://player.twitch.tv?autoplay=true&channel=charruatvcanal&height=100%&muted=true&parent=pelisjuanita.com' },
  ],
  'sun-channel': [
    { label: 'Servidor 1', url: PJ_CVATT('U3VuX0NoYW5uZWw=') },
  ],
  'latele': [
    { label: 'Servidor 1', url: PJ_CVATT('TEFfVEVMRV9DNA==') },
  ],
  'eurochannel': [
    { label: 'Servidor 1', url: `${PJ_BASE}trimi.html?id=EUROCHANNEL` },
    { label: 'Servidor 2', url: PJ_CVATT('RXVyb2NoYW5uZWw=') },
  ],
  'tv-chile': [
    { label: 'Servidor 1', url: PJ_CVATT('VHZfQ2hpbGU=') },
  ],
};

function getStreamOptions(streamUrl: string): { label: string; url: string }[] {
  // ── Canales de pelisjuanita (pj:slug) ─────────────────────────────────────
  if (streamUrl.startsWith('pj:')) {
    const slug = streamUrl.slice(3);
    const opts = PJ_STREAMS[slug];
    if (opts && opts.length > 0) return opts;
    // fallback genérico si no hay entradas para el slug
    return [{ label: 'Servidor 1', url: `${PJ_BASE}cvatt.html?get=${slug}` }];
  }

  // ── Pluto TV ──────────────────────────────────────────────────────────────
  if (streamUrl.includes('pluto.tv')) {
    return [{ label: 'Principal', url: streamUrl }];
  }

  // ── Fallback genérico ─────────────────────────────────────────────────────
  return [{ label: 'Principal', url: streamUrl }];
}

// Dominios que bloquean embedding
const BLOCKED_DOMAINS = [
  'americatv.com.ar',
  'c5n.com',
  'youtube.com',
];

const isLikelyBlocked = (url: string) => BLOCKED_DOMAINS.some(d => url.includes(d));

export function VideoPlayer({ channel, channels, onBack, onChannelChange }: VideoPlayerProps) {
  const streamOptions = useMemo(() => getStreamOptions(channel.streamUrl), [channel]);
  const [activeStream, setActiveStream] = useState(0);
  const [loading, setLoading] = useState(true);
  const [blocked, setBlocked] = useState(false);

  // ── Favoritos ─────────────────────────────────────────────────────────────
  const [favorites, setFavorites] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('tv_favorites') || '[]'); } catch { return []; }
  });
  const isFavorite = favorites.includes(channel.id);
  const toggleFavorite = () => {
    const next = isFavorite
      ? favorites.filter(id => id !== channel.id)
      : [...favorites, channel.id];
    setFavorites(next);
    localStorage.setItem('tv_favorites', JSON.stringify(next));
  };

  // ── Recientes ─────────────────────────────────────────────────────────────
  const [recents, setRecents] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('tv_recents') || '[]'); } catch { return []; }
  });
  useEffect(() => {
    const next = [channel.id, ...recents.filter(id => id !== channel.id)].slice(0, 8);
    setRecents(next);
    localStorage.setItem('tv_recents', JSON.stringify(next));
    localStorage.setItem('tv_last_channel', channel.id);
  }, [channel.id]);

  const recentChannels = recents
    .map(id => channels.find(c => c.id === id))
    .filter(Boolean)
    .filter(c => c!.id !== channel.id) as Channel[];

  const currentIndex = channels.findIndex(c => c.id === channel.id);
  const prevChannel = currentIndex > 0 ? channels[currentIndex - 1] : null;
  const nextChannel = currentIndex < channels.length - 1 ? channels[currentIndex + 1] : null;
  const currentUrl = streamOptions[activeStream]?.url ?? channel.streamUrl;
  const siteBlocked = isLikelyBlocked(currentUrl);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' && nextChannel) handleChannelChange(nextChannel);
      if (e.key === 'ArrowLeft'  && prevChannel) handleChannelChange(prevChannel);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [prevChannel, nextChannel]);

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
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
      if (dx < 0 && nextChannel) handleChannelChange(nextChannel);
      if (dx > 0 && prevChannel) handleChannelChange(prevChannel);
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

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
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;400;500;600;700&family=Bebas+Neue&display=swap');

        .vp-root {
          min-height: 100vh;
          background: #060608;
          font-family: 'Rajdhani', 'Helvetica Neue', sans-serif;
          color: #e8f4ff;
          position: relative;
          overflow-x: hidden;
        }
        .vp-root::before {
          content: '';
          position: fixed; inset: 0;
          background-image:
            linear-gradient(rgba(0,200,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,200,255,0.02) 1px, transparent 1px);
          background-size: 48px 48px;
          mask-image: radial-gradient(ellipse 80% 60% at 50% 0%, black 0%, transparent 80%);
          pointer-events: none; z-index: 0;
        }
        .vp-header {
          position: sticky; top: 0; z-index: 50;
          background: linear-gradient(180deg, rgba(6,6,8,0.98) 0%, rgba(6,6,8,0.88) 100%);
          backdrop-filter: blur(24px);
          border-bottom: 1px solid rgba(0,200,255,0.1);
          padding: 14px 24px;
        }
        .vp-header::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(0,200,255,0.55) 30%, rgba(0,200,255,0.55) 70%, transparent);
        }
        .vp-header-inner {
          max-width: 1200px; margin: 0 auto;
          display: flex; align-items: center; gap: 16px;
        }
        .vp-back-btn {
          display: flex; align-items: center; gap: 7px;
          background: rgba(0,200,255,0.06);
          border: 1px solid rgba(0,200,255,0.15);
          border-radius: 7px; color: #7aaaba;
          font-family: 'Rajdhani', sans-serif; font-size: 0.88rem; font-weight: 600;
          letter-spacing: 0.05em;
          padding: 9px 14px; cursor: pointer; flex-shrink: 0;
          transition: all 0.2s;
        }
        .vp-back-btn:hover {
          background: rgba(0,200,255,0.1);
          border-color: rgba(0,200,255,0.35);
          color: #00c8ff;
          box-shadow: 0 0 12px rgba(0,200,255,0.08);
        }
        .vp-header-info { flex: 1; min-width: 0; }
        .vp-channel-name {
          font-family: 'Bebas Neue', cursive;
          font-weight: 700; font-size: 1.15rem; color: #e8f4ff;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
          letter-spacing: 0.08em; line-height: 1.2;
          text-shadow: 0 0 12px rgba(0,200,255,0.2);
        }
        .vp-channel-desc {
          font-size: 0.78rem; color: #6a8a9a;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
          margin-top: 2px; font-weight: 500;
        }
        .vp-status-badge {
          display: flex; align-items: center; gap: 5px;
          padding: 5px 10px; border-radius: 4px;
          font-size: 0.68rem; font-weight: 700;
          letter-spacing: 0.1em; text-transform: uppercase;
          flex-shrink: 0; font-family: 'Rajdhani', sans-serif;
        }
        .vp-badge-live  { background: rgba(0,200,255,0.12); border: 1px solid rgba(0,200,255,0.3); color: #00c8ff; }
        .vp-badge-movie { background: rgba(80,40,180,0.2);  border: 1px solid rgba(80,40,180,0.4);  color: #a080f0; }
        .vp-live-dot {
          width: 6px; height: 6px; border-radius: 50%; background: #00c8ff;
          box-shadow: 0 0 6px #00c8ff;
          animation: vp-pulse 1.4s ease-in-out infinite;
        }
        @keyframes vp-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.3;transform:scale(0.6)} }
        .vp-main {
          max-width: 1200px; margin: 0 auto;
          padding: 28px 24px 64px;
          position: relative; z-index: 1;
        }
        .vp-nav {
          display: flex; align-items: center; justify-content: space-between;
          gap: 12px; margin-bottom: 16px;
        }
        .vp-nav-btn {
          display: flex; align-items: center; gap: 8px;
          background: rgba(0,200,255,0.04);
          border: 1px solid rgba(0,200,255,0.1);
          border-radius: 8px; color: #6a8a9a;
          font-family: 'Rajdhani', sans-serif; font-size: 0.85rem; font-weight: 600;
          padding: 10px 16px; cursor: pointer; transition: all 0.2s;
          max-width: 240px; overflow: hidden;
        }
        .vp-nav-btn:hover {
          background: rgba(0,200,255,0.08);
          border-color: rgba(0,200,255,0.3);
          color: #90c8e8;
        }
        .vp-nav-btn:disabled { opacity: 0.2; cursor: not-allowed; pointer-events: none; }
        .vp-nav-label { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .vp-nav-count { font-size: 0.75rem; color: rgba(0,200,255,0.45); font-weight: 600; white-space: nowrap; }
        .vp-video-box {
          border-radius: 10px; overflow: hidden;
          border: 1px solid rgba(0,200,255,0.1);
          box-shadow: 0 24px 80px rgba(0,0,0,0.8), 0 0 40px rgba(0,200,255,0.04);
          background: #000; position: relative;
        }
        .vp-video-ratio { position: relative; padding-bottom: 56.25%; }
        .vp-video-ratio iframe {
          position: absolute; inset: 0; width: 100%; height: 100%; border: none;
        }
        .vp-overlay {
          position: absolute; inset: 0; z-index: 5;
          display: flex; align-items: center; justify-content: center;
          background: #08080f; transition: opacity 0.4s ease;
        }
        .vp-overlay.out { opacity: 0; pointer-events: none; }
        .vp-spinner {
          width: 48px; height: 48px; border-radius: 50%;
          border: 2px solid rgba(0,200,255,0.1);
          border-top-color: #00c8ff;
          animation: vp-spin 0.8s linear infinite;
        }
        @keyframes vp-spin { to { transform: rotate(360deg); } }
        .vp-loading-text {
          margin-top: 16px; font-size: 0.82rem; color: rgba(0,200,255,0.5);
          letter-spacing: 0.1em; text-transform: uppercase; font-weight: 600;
        }
        .vp-blocked-icon {
          width: 68px; height: 68px;
          background: rgba(255,160,0,0.06);
          border: 1px solid rgba(255,160,0,0.18);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 18px;
        }
        .vp-blocked-title { font-size: 1.05rem; font-weight: 700; margin-bottom: 8px; color: #e8f4ff; font-family: 'Rajdhani', sans-serif; }
        .vp-blocked-msg { font-size: 0.85rem; color: #6a8a9a; margin-bottom: 22px; max-width: 320px; line-height: 1.6; font-family: 'Rajdhani', sans-serif; }
        .vp-open-btn {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(0,200,255,0.12); color: #00c8ff;
          border: 1px solid rgba(0,200,255,0.35);
          border-radius: 8px; padding: 11px 28px;
          font-family: 'Rajdhani', sans-serif; font-size: 0.92rem; font-weight: 700;
          cursor: pointer; transition: all 0.2s;
          letter-spacing: 0.06em;
          box-shadow: 0 0 20px rgba(0,200,255,0.1);
        }
        .vp-open-btn:hover {
          background: rgba(0,200,255,0.2);
          border-color: rgba(0,200,255,0.6);
          box-shadow: 0 0 30px rgba(0,200,255,0.2);
        }
        .vp-blocked-url { margin-top: 12px; font-size: 0.68rem; color: #4a6a7a; word-break: break-all; }
        .vp-servers {
          margin-top: 14px; display: flex; align-items: center; gap: 12px; flex-wrap: wrap;
        }
        .vp-servers-label {
          font-size: 0.72rem; color: rgba(0,200,255,0.5); font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.12em; white-space: nowrap;
          font-family: 'Rajdhani', sans-serif;
        }
        .vp-server-btns { display: flex; gap: 8px; flex-wrap: wrap; }
        .vp-server-btn {
          padding: 6px 16px; border-radius: 4px;
          border: 1px solid rgba(0,200,255,0.15);
          background: rgba(0,200,255,0.04);
          color: rgba(0,200,255,0.55);
          font-family: 'Rajdhani', sans-serif; font-size: 0.8rem; font-weight: 600;
          letter-spacing: 0.06em;
          cursor: pointer; transition: all 0.18s; white-space: nowrap;
        }
        .vp-server-btn:hover {
          border-color: rgba(0,200,255,0.35);
          color: #90c8e0;
          background: rgba(0,200,255,0.07);
        }
        .vp-server-btn.active {
          background: rgba(0,200,255,0.12);
          border-color: rgba(0,200,255,0.5);
          color: #00c8ff;
          box-shadow: 0 0 10px rgba(0,200,255,0.1);
        }
        .vp-info {
          margin-top: 20px;
          background: #0b0b12;
          border: 1px solid rgba(0,200,255,0.08);
          border-radius: 10px; padding: 20px 22px;
          display: flex; align-items: flex-start; gap: 20px; flex-wrap: wrap;
        }
        .vp-info-main { flex: 1; min-width: 0; }
        .vp-info-name {
          font-family: 'Bebas Neue', cursive;
          font-size: 1.75rem; letter-spacing: 0.08em; color: #e8f4ff;
          line-height: 1; margin-bottom: 8px;
          text-shadow: 0 0 12px rgba(0,200,255,0.15);
        }
        .vp-info-desc { font-size: 0.875rem; color: #6a8a9a; line-height: 1.6; margin-bottom: 14px; font-weight: 500; }
        .vp-meta-pills { display: flex; flex-wrap: wrap; gap: 8px; }
        .vp-mpill {
          display: inline-flex; align-items: center; gap: 4px;
          padding: 3px 10px; border-radius: 3px;
          font-size: 0.7rem; font-weight: 700;
          letter-spacing: 0.06em; text-transform: uppercase;
          font-family: 'Rajdhani', sans-serif;
        }
        .vp-mpill-cat  { background: rgba(0,200,255,0.07); border: 1px solid rgba(0,200,255,0.2); color: rgba(0,200,255,0.8); }
        .vp-mpill-co   { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); color: #6a8a9a; }
        .vp-mpill-live { background: rgba(0,200,255,0.08); border: 1px solid rgba(0,200,255,0.25); color: #00c8ff; }
        .vp-mpill-film { background: rgba(80,40,180,0.1); border: 1px solid rgba(80,40,180,0.3); color: #a080f0; }
        .vp-tip {
          margin-top: 16px;
          background: rgba(0,200,255,0.03);
          border: 1px solid rgba(0,200,255,0.1);
          border-radius: 8px; padding: 14px 18px;
          display: flex; align-items: center; gap: 14px;
        }
        .vp-tip-icon {
          width: 34px; height: 34px; flex-shrink: 0;
          background: rgba(0,200,255,0.08);
          border-radius: 6px; display: flex; align-items: center; justify-content: center;
        }
        .vp-tip-text { font-size: 0.82rem; color: #6a8a9a; line-height: 1.5; font-weight: 500; }
        .vp-tip-text strong { color: rgba(0,200,255,0.7); font-weight: 700; }

        /* ── Favorito ── */
        .vp-fav-btn {
          display: flex; align-items: center; gap: 6px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 4px; color: #6a8a9a;
          font-family: 'Rajdhani', sans-serif; font-size: 0.8rem; font-weight: 600;
          letter-spacing: 0.05em; padding: 6px 14px;
          cursor: pointer; transition: all 0.2s; white-space: nowrap; margin-left: auto;
        }
        .vp-fav-btn:hover {
          background: rgba(255,200,0,0.06);
          border-color: rgba(255,200,0,0.25);
          color: #ffc800;
        }
        .vp-fav-btn.fav-active {
          background: rgba(255,200,0,0.08);
          border-color: rgba(255,200,0,0.35);
          color: #ffc800;
        }

        /* ── Recientes ── */
        .vp-recents {
          margin-top: 20px;
        }
        .vp-recents-title {
          font-size: 0.72rem; color: rgba(0,200,255,0.5); font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.12em;
          font-family: 'Rajdhani', sans-serif;
          display: flex; align-items: center; gap: 6px;
          margin-bottom: 10px;
        }
        .vp-recents-list {
          display: flex; gap: 8px; flex-wrap: wrap;
        }
        .vp-recent-btn {
          display: flex; align-items: center; gap: 8px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 8px; padding: 7px 12px;
          cursor: pointer; transition: all 0.2s;
          font-family: 'Rajdhani', sans-serif;
        }
        .vp-recent-btn:hover {
          background: rgba(0,200,255,0.07);
          border-color: rgba(0,200,255,0.2);
        }
        .vp-recent-logo {
          width: 24px; height: 24px; object-fit: contain;
          border-radius: 3px; flex-shrink: 0;
        }
        .vp-recent-name {
          font-size: 0.8rem; color: #8aaaba; font-weight: 600;
          white-space: nowrap;
        }
      `}</style>

      <div className="vp-root" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        <header className="vp-header">
          <div className="vp-header-inner">
            <button className="vp-back-btn" onClick={onBack}><ArrowLeft size={15} /><span>Volver</span></button>
            <div className="vp-header-info">
              <div className="vp-channel-name">{channel.name}</div>
              <div className="vp-channel-desc">{channel.description}</div>
            </div>
            <div className={`vp-status-badge ${isLive ? 'vp-badge-live' : 'vp-badge-movie'}`}>
              {isLive ? <><span className="vp-live-dot" />En Vivo</> : <><Film size={11} />Película</>}
            </div>
          </div>
        </header>

        <main className="vp-main">
          <div className="vp-nav">
            <button className="vp-nav-btn" disabled={!prevChannel} onClick={() => prevChannel && handleChannelChange(prevChannel)}>
              <ChevronLeft size={16} /><span className="vp-nav-label">{prevChannel?.name ?? 'Anterior'}</span>
            </button>
            <span className="vp-nav-count">{currentIndex + 1} / {channels.length}</span>
            <button className="vp-nav-btn" disabled={!nextChannel} onClick={() => nextChannel && handleChannelChange(nextChannel)}>
              <span className="vp-nav-label">{nextChannel?.name ?? 'Siguiente'}</span><ChevronRight size={16} />
            </button>
          </div>

          <div className="vp-video-box">
            <div className="vp-video-ratio">
              <div className={`vp-overlay ${!loading ? 'out' : ''}`}>
                <div style={{ textAlign: 'center' }}>
                  <div className="vp-spinner" />
                  <p className="vp-loading-text">Cargando señal…</p>
                </div>
              </div>
              {blocked && (
                <div className="vp-overlay">
                  <div style={{ textAlign: 'center', padding: '0 32px' }}>
                    <div className="vp-blocked-icon"><AlertCircle size={28} color="#ffa000" /></div>
                    <p className="vp-blocked-title">Este canal no permite embedding</p>
                    <p className="vp-blocked-msg">El sitio bloquea la reproducción dentro de otras páginas. Podés verlo directamente.</p>
                    <button className="vp-open-btn" onClick={openInTab}><ExternalLink size={15} />Abrir en nueva pestaña</button>
                    <p className="vp-blocked-url">{currentUrl}</p>
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

          {(hasOptions || true) && (
            <div className="vp-servers">
              {hasOptions && (
                <>
                  <span className="vp-servers-label">Servidores:</span>
                  <div className="vp-server-btns">
                    {streamOptions.map((opt, i) => (
                      <button
                        key={i}
                        className={`vp-server-btn ${activeStream === i ? 'active' : ''}`}
                        onClick={() => setActiveStream(i)}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
              <button
                className={`vp-fav-btn ${isFavorite ? 'fav-active' : ''}`}
                onClick={toggleFavorite}
                title={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
              >
                <Star size={13} fill={isFavorite ? 'currentColor' : 'none'} />
                {isFavorite ? 'En favoritos' : 'Agregar a favoritos'}
              </button>
            </div>
          )}

          <div className="vp-info">
            <div className="vp-info-main">
              <div className="vp-info-name">{channel.name}</div>
              <p className="vp-info-desc">{channel.description}</p>
              <div className="vp-meta-pills">
                <span className="vp-mpill vp-mpill-cat">{channel.category}</span>
                <span className="vp-mpill vp-mpill-co"><MapPin size={9} />{channel.country}</span>
                <span className={`vp-mpill ${isLive ? 'vp-mpill-live' : 'vp-mpill-film'}`}>
                  {isLive ? <><span className="vp-live-dot" />En Vivo</> : <><Film size={9} />Película</>}
                </span>
              </div>
            </div>
          </div>

          <div className="vp-tip">
            <div className="vp-tip-icon">{isLive ? <Tv size={15} color="#00c8ff" /> : <Film size={15} color="#00c8ff" />}</div>
            <p className="vp-tip-text">
              Estás viendo <strong>{isLive ? 'televisión en vivo' : 'una película'}</strong>.
              Usá <strong>← →</strong> en PC · <strong>deslizá</strong> en tablet/móvil para cambiar de canal.
            </p>
          </div>

          {recentChannels.length > 0 && (
            <div className="vp-recents">
              <div className="vp-recents-title">
                <Clock size={12} />
                Vistos recientemente
              </div>
              <div className="vp-recents-list">
                {recentChannels.map(ch => (
                  <button key={ch.id} className="vp-recent-btn" onClick={() => handleChannelChange(ch)}>
                    <img className="vp-recent-logo" src={ch.logo} alt={ch.name} onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    <span className="vp-recent-name">{ch.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}

// ── Helpers exportables para el componente padre ──────────────────────────
/** Devuelve el ID del último canal visto (para restaurar al abrir la app) */
export function getLastChannelId(): string | null {
  try { return localStorage.getItem('tv_last_channel'); } catch { return null; }
}

/** Devuelve los IDs marcados como favoritos */
export function getFavoriteIds(): string[] {
  try { return JSON.parse(localStorage.getItem('tv_favorites') || '[]'); } catch { return []; }
}

/** Devuelve los IDs de los canales vistos recientemente */
export function getRecentIds(): string[] {
  try { return JSON.parse(localStorage.getItem('tv_recents') || '[]'); } catch { return []; }
}