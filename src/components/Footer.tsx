import { useState } from 'react';
import { X, Shield, FileText, Scale } from 'lucide-react';

type ModalType = 'disclaimer' | 'privacidad' | 'terminos' | null;

function Modal({ type, onClose }: { type: ModalType; onClose: () => void }) {
  if (!type) return null;

  const content: Record<NonNullable<ModalType>, { title: string; icon: JSX.Element; body: JSX.Element }> = {
    disclaimer: {
      title: 'Aviso Legal / Disclaimer',
      icon: <Scale size={18} color="#00c8ff" />,
      body: (
        <>
          <p>TechPhantom es un <strong>reproductor multimedia</strong> que indexa y organiza enlaces de transmisión disponibles públicamente en internet. No almacena, aloja, genera ni distribuye ningún contenido audiovisual propio.</p>
          <p>Todo el contenido reproducido a través de esta plataforma es provisto por <strong>terceros externos</strong>. TechPhantom no tiene control sobre la disponibilidad, calidad, legalidad ni continuidad de dichas transmisiones.</p>
          <p>Este sitio opera de manera similar a un motor de búsqueda o agregador de enlaces. No nos responsabilizamos por el contenido emitido por los canales indexados, ni por eventuales interrupciones del servicio.</p>
          <p>Si sos titular de derechos sobre algún contenido y considerás que se vulneran tus derechos, podés contactarnos para solicitar la eliminación del enlace correspondiente.</p>
          <p>El uso de esta plataforma implica la aceptación de este aviso. Si no estás de acuerdo, te pedimos que discontinúes su uso.</p>
        </>
      ),
    },
    privacidad: {
      title: 'Política de Privacidad',
      icon: <Shield size={18} color="#00c8ff" />,
      body: (
        <>
          <p>En TechPhantom respetamos tu privacidad. Esta política describe cómo tratamos la información de los usuarios que acceden a nuestra plataforma.</p>
          <h4>Datos que NO recopilamos</h4>
          <p>No solicitamos ni almacenamos datos personales como nombre, correo electrónico, contraseñas ni información de pago. No es necesario registrarse para usar la plataforma.</p>
          <h4>Datos técnicos</h4>
          <p>Como cualquier sitio web, nuestros servidores pueden registrar automáticamente datos técnicos estándar como dirección IP, tipo de navegador, páginas visitadas y duración de la sesión. Esta información se usa exclusivamente con fines estadísticos y de seguridad, y no es compartida con terceros.</p>
          <h4>Cookies</h4>
          <p>Podemos utilizar cookies de sesión para mejorar la experiencia de navegación (como recordar preferencias de categoría o país). No utilizamos cookies de rastreo publicitario.</p>
          <h4>Servicios de terceros</h4>
          <p>Los reproductores de video embedidos pueden pertenecer a terceros con sus propias políticas de privacidad, sobre las cuales no tenemos control. Te recomendamos revisar las políticas de cada proveedor.</p>
          <h4>Cambios a esta política</h4>
          <p>Nos reservamos el derecho de actualizar esta política en cualquier momento. Los cambios serán publicados en esta misma sección.</p>
        </>
      ),
    },
    terminos: {
      title: 'Términos de Uso',
      icon: <FileText size={18} color="#00c8ff" />,
      body: (
        <>
          <p>Al acceder y utilizar TechPhantom, aceptás los siguientes términos y condiciones. Si no estás de acuerdo, por favor abandoná el sitio.</p>
          <h4>1. Naturaleza del servicio</h4>
          <p>TechPhantom es una plataforma de organización y reproducción de enlaces públicos de streaming. No somos un proveedor de contenido audiovisual ni una empresa de telecomunicaciones.</p>
          <h4>2. Uso permitido</h4>
          <p>El acceso a esta plataforma es exclusivamente para uso personal y no comercial. Queda prohibido reproducir, copiar, redistribuir o explotar comercialmente cualquier aspecto de la plataforma sin autorización expresa.</p>
          <h4>3. Disponibilidad del servicio</h4>
          <p>No garantizamos la disponibilidad ininterrumpida de la plataforma ni de los canales indexados. Los enlaces pueden dejar de funcionar en cualquier momento sin previo aviso, ya que dependen de terceros.</p>
          <h4>4. Limitación de responsabilidad</h4>
          <p>TechPhantom no se hace responsable por daños directos, indirectos o consecuentes derivados del uso o imposibilidad de uso de la plataforma, ni por el contenido emitido por terceros.</p>
          <h4>5. Propiedad intelectual</h4>
          <p>El diseño, código y marca de TechPhantom son propiedad de sus creadores. Los logotipos de canales de terceros son propiedad de sus respectivos dueños y se utilizan únicamente con fines informativos e identificativos.</p>
          <h4>6. Modificaciones</h4>
          <p>Nos reservamos el derecho de modificar estos términos en cualquier momento. El uso continuado de la plataforma implica la aceptación de los términos vigentes.</p>
        </>
      ),
    },
  };

  const { title, icon, body } = content[type];

  return (
    <>
      <style>{`
        .tp-modal-overlay {
          position: fixed; inset: 0; z-index: 1000;
          background: rgba(0,0,0,0.85);
          backdrop-filter: blur(8px);
          display: flex; align-items: center; justify-content: center;
          padding: 24px;
          animation: tp-modal-in 0.2s ease;
        }
        @keyframes tp-modal-in { from { opacity:0; } to { opacity:1; } }

        .tp-modal {
          background: #0b0b14;
          border: 1px solid rgba(0,200,255,0.18);
          border-radius: 12px;
          width: 100%; max-width: 620px;
          max-height: 80vh;
          display: flex; flex-direction: column;
          box-shadow: 0 40px 100px rgba(0,0,0,0.8), 0 0 40px rgba(0,200,255,0.06);
          animation: tp-modal-up 0.25s cubic-bezier(0.34,1.56,0.64,1);
          position: relative;
        }
        .tp-modal::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 1px; border-radius: 12px 12px 0 0;
          background: linear-gradient(90deg, transparent, rgba(0,200,255,0.5), transparent);
        }
        @keyframes tp-modal-up {
          from { opacity:0; transform: translateY(20px) scale(0.97); }
          to   { opacity:1; transform: translateY(0)   scale(1);    }
        }

        .tp-modal-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 18px 22px;
          border-bottom: 1px solid rgba(0,200,255,0.08);
          flex-shrink: 0;
        }
        .tp-modal-title {
          display: flex; align-items: center; gap: 10px;
          font-family: 'Bebas Neue', cursive;
          font-size: 1.2rem; letter-spacing: 0.1em; color: #e8f4ff;
          text-shadow: 0 0 12px rgba(0,200,255,0.2);
        }
        .tp-modal-close {
          width: 30px; height: 30px; border-radius: 6px;
          background: rgba(0,200,255,0.05); border: 1px solid rgba(0,200,255,0.12);
          color: rgba(0,200,255,0.5); cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.2s; flex-shrink: 0;
        }
        .tp-modal-close:hover { background: rgba(0,200,255,0.12); color: #00c8ff; }

        .tp-modal-body {
          padding: 22px; overflow-y: auto;
          font-family: 'Rajdhani', sans-serif;
          color: #7aaaba; font-size: 0.9rem; line-height: 1.7; font-weight: 500;
          scrollbar-width: thin; scrollbar-color: rgba(0,200,255,0.2) transparent;
        }
        .tp-modal-body p { margin-bottom: 14px; }
        .tp-modal-body h4 {
          font-family: 'Bebas Neue', cursive;
          font-size: 1rem; letter-spacing: 0.1em;
          color: rgba(0,200,255,0.75); margin: 20px 0 8px;
        }
        .tp-modal-body strong { color: rgba(0,200,255,0.9); font-weight: 700; }
      `}</style>

      <div className="tp-modal-overlay" onClick={onClose}>
        <div className="tp-modal" onClick={e => e.stopPropagation()}>
          <div className="tp-modal-header">
            <div className="tp-modal-title">{icon}{title}</div>
            <button className="tp-modal-close" onClick={onClose}><X size={14} /></button>
          </div>
          <div className="tp-modal-body">{body}</div>
        </div>
      </div>
    </>
  );
}

export function Footer() {
  const [modal, setModal] = useState<ModalType>(null);
  const year = new Date().getFullYear();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Bebas+Neue&display=swap');

        .tp-footer {
          position: relative;
          border-top: 1px solid rgba(0,200,255,0.08);
          background: linear-gradient(180deg, transparent 0%, rgba(0,5,12,0.7) 100%);
          padding: 28px 24px 24px;
          font-family: 'Rajdhani', sans-serif;
          z-index: 10;
        }
        .tp-footer::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(0,200,255,0.35) 30%, rgba(0,200,255,0.35) 70%, transparent);
        }

        .tp-footer-inner {
          max-width: 1400px; margin: 0 auto;
          display: flex; flex-direction: column; align-items: center; gap: 16px;
        }

        .tp-footer-brand {
          display: flex; align-items: center; gap: 8px;
        }
        .tp-footer-logo {
          width: 26px; height: 26px; border-radius: 50%;
          object-fit: cover;
          border: 1px solid rgba(0,200,255,0.3);
          box-shadow: 0 0 8px rgba(0,200,255,0.15);
        }
        .tp-footer-name {
          font-family: 'Bebas Neue', cursive;
          font-size: 1.15rem; letter-spacing: 0.14em; color: #e8f4ff;
          text-shadow: 0 0 12px rgba(0,200,255,0.2);
        }
        .tp-footer-name .tp-accent { color: #00c8ff; }

        .tp-footer-links {
          display: flex; align-items: center; gap: 6px;
          flex-wrap: wrap; justify-content: center;
        }
        .tp-footer-link {
          display: flex; align-items: center; gap: 5px;
          background: none; border: 1px solid rgba(0,200,255,0.15);
          border-radius: 4px;
          color: rgba(0,200,255,0.55);
          font-family: 'Rajdhani', sans-serif; font-size: 0.72rem; font-weight: 700;
          letter-spacing: 0.1em; text-transform: uppercase;
          padding: 5px 13px; cursor: pointer;
          transition: all 0.2s;
        }
        .tp-footer-link:hover {
          background: rgba(0,200,255,0.06);
          border-color: rgba(0,200,255,0.35);
          color: #00c8ff;
          box-shadow: 0 0 10px rgba(0,200,255,0.06);
        }
        .tp-footer-sep {
          width: 3px; height: 3px; border-radius: 50%;
          background: rgba(0,200,255,0.2);
        }

        .tp-footer-disclaimer {
          background: rgba(0,200,255,0.025);
          border: 1px solid rgba(0,200,255,0.07);
          border-radius: 6px;
          padding: 10px 18px;
          text-align: center;
          max-width: 720px;
        }
        .tp-footer-disclaimer p {
          font-size: 0.73rem; color: #5a7a8a; line-height: 1.65;
          font-weight: 500; margin: 0;
        }
        .tp-footer-disclaimer strong { color: rgba(0,200,255,0.55); font-weight: 700; }

        .tp-footer-copy {
          font-size: 0.63rem; color: rgba(0,200,255,0.3);
          letter-spacing: 0.1em; text-align: center; font-weight: 500;
        }
      `}</style>

      <footer className="tp-footer">
        <div className="tp-footer-inner">
          <div className="tp-footer-brand">
            <img
              className="tp-footer-logo"
              src="https://i.postimg.cc/j2WvZw96/Whats-App-Image-2026-03-02-at-11-44-07.jpg"
              alt="TechPhantom"
            />
            <span className="tp-footer-name"><span className="tp-accent">Tech</span>Phantom</span>
          </div>

          <div className="tp-footer-links">
            <button className="tp-footer-link" onClick={() => setModal('disclaimer')}>
              <Scale size={11} />Aviso Legal
            </button>
            <div className="tp-footer-sep" />
            <button className="tp-footer-link" onClick={() => setModal('privacidad')}>
              <Shield size={11} />Privacidad
            </button>
            <div className="tp-footer-sep" />
            <button className="tp-footer-link" onClick={() => setModal('terminos')}>
              <FileText size={11} />Términos de Uso
            </button>
          </div>

          <div className="tp-footer-disclaimer">
            <p>
              TechPhantom es un <strong>reproductor de enlaces públicos</strong>. No aloja, almacena ni distribuye contenido audiovisual.
              Todo el contenido es provisto por terceros externos. No nos responsabilizamos por la disponibilidad ni legalidad de las transmisiones indexadas.
            </p>
          </div>

          <div className="tp-footer-copy">
            © {year} TechPhantom · Solo reproductor · Todos los derechos de los canales pertenecen a sus respectivos titulares
          </div>
        </div>
      </footer>

      <Modal type={modal} onClose={() => setModal(null)} />
    </>
  );
}