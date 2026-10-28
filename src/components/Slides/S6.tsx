import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'framer-motion';
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import Eyebrow from '../Eyebrow';

const trophyImg = '/imgs/trofeu.png';
const worldImg = '/imgs/world.png';
const mapImg = '/imgs/map.png';
const cameraImg = '/imgs/camera.png';
const certificateImg = '/imgs/certificate.png';

const pains = ['Não sabia por onde começar', 'Materiais desorganizados', 'Sem direção clara'];
const gains = ['Certificado oficial', 'Rede de profissionais', 'Agenda organizada'];

const benefits = [
  { title: 'Certificado Oficial', desc: 'Reconhecimento profissional', icon: trophyImg, color: '#ffd98a' },
  { title: 'Rede de Profissionais', desc: 'Conecta com outros artistas', icon: worldImg, color: '#8ec5ff' },
  { title: 'Guia de Carreira', desc: 'Como atrair e fidelizar clientes', icon: mapImg, color: '#7ef0c3' },
  { title: 'Portfólio Online', desc: 'Mostre seu trabalho', icon: cameraImg, color: '#f0a9bf' },
];

const tint = (color: string) => ({ '--c': color }) as CSSProperties;

/* ------------------------------------------------------------------ */
/*  Cartão de benefício: acende quando a transformação acontece        */
/* ------------------------------------------------------------------ */

function BenefitCard({
  benefit,
  index,
  lit,
}: {
  benefit: (typeof benefits)[number];
  index: number;
  lit: boolean;
}) {
  const reduced = !!useReducedMotion();
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, { stiffness: 160, damping: 20, mass: 0.6 });
  const sy = useSpring(py, { stiffness: 160, damping: 20, mass: 0.6 });
  const rotateY = useTransform(sx, [0, 1], [-10, 10]);
  const rotateX = useTransform(sy, [0, 1], [10, -10]);
  const gx = useTransform(sx, (v) => `${v * 100}%`);
  const gy = useTransform(sy, (v) => `${v * 100}%`);
  const glare = useMotionTemplate`radial-gradient(260px circle at ${gx} ${gy}, rgba(255,255,255,.2), transparent 62%)`;

  const onMove = (e: ReactPointerEvent<HTMLElement>) => {
    if (reduced || e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };
  const reset = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <motion.div
      className="s6-cell"
      initial={reduced ? false : { opacity: 0, y: 40, rotateX: 20 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ type: 'spring', stiffness: 70, damping: 16, delay: 0.5 + index * 0.09 }}
      style={{ transformPerspective: 1100 }}
    >
      <motion.article
        className={`s6-benefit${lit ? ' is-lit' : ''}`}
        style={{
          ...tint(benefit.color),
          '--delay': `${index * 0.14}s`,
          rotateX: reduced ? 0 : rotateX,
          rotateY: reduced ? 0 : rotateY,
          transformPerspective: 1100,
        } as unknown as CSSProperties}
        whileHover={reduced ? undefined : { y: -6, scale: 1.03 }}
        transition={{ type: 'spring', stiffness: 220, damping: 20 }}
        onPointerMove={onMove}
        onPointerLeave={reset}
      >
        <motion.span className="s6-glare" style={{ background: glare }} aria-hidden="true" />
        <span className="s6-b-orb">
          <img src={benefit.icon} alt="" draggable={false} />
        </span>
        <div className="s6-b-copy">
          <h3>{benefit.title}</h3>
          <p>{benefit.desc}</p>
        </div>
      </motion.article>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Slide 6                                                            */
/* ------------------------------------------------------------------ */

function S6() {
  const reduced = !!useReducedMotion();
  const [after, setAfter] = useState(false);
  const [burst, setBurst] = useState(0);
  const touched = useRef(false);

  // inclinação 3D do cartão "Profissional"
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, { stiffness: 120, damping: 20 });
  const sy = useSpring(py, { stiffness: 120, damping: 20 });
  const rotateY = useTransform(sx, [0, 1], [-5, 5]);
  const rotateX = useTransform(sy, [0, 1], [4, -4]);

  const onMove = (e: ReactPointerEvent<HTMLElement>) => {
    if (reduced || !after || e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };
  const resetTilt = () => {
    px.set(0.5);
    py.set(0.5);
  };

  const setState = (next: boolean) => {
    setAfter(next);
    if (next) setBurst((b) => b + 1);
  };
  const toggle = () => {
    touched.current = true;
    setState(!after);
  };

  // A transformação acontece sozinha uma vez, se ninguém clicar antes.
  useEffect(() => {
    if (reduced) return;
    const t = setTimeout(() => {
      if (!touched.current) setState(true);
    }, 2800);
    return () => clearTimeout(t);
  }, [reduced]);

  return (
    <section className="s6-section" aria-labelledby="s6-title">
      <motion.span
        className="s6-aura"
        aria-hidden="true"
        animate={{ backgroundColor: after ? '#f0a9bf' : '#5b4a55', opacity: after ? 0.22 : 0.12 }}
        transition={{ duration: 1 }}
      />

      <header className="s6-heading">
        <Eyebrow>Depois do curso</Eyebrow>
        <motion.h2
          id="s6-title"
          initial={reduced ? false : { opacity: 0, y: 16, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          Seu trabalho e sua vida <span>mudam</span>
        </motion.h2>
      </header>

      {/* Antes → Depois */}
      <div className="s6-stage">
        {/* ANTES */}
        <motion.div
          className={`s6-card s6-before${after ? ' is-past' : ''}`}
          initial={reduced ? false : { opacity: 0, x: -40, rotateY: 18 }}
          animate={{ opacity: 1, x: 0, rotateY: 0 }}
          transition={{ type: 'spring', stiffness: 70, damping: 16, delay: 0.2 }}
          style={{ transformPerspective: 1200 }}
          onClick={() => after && toggle()}
        >
          <span className="s6-kicker">ANTES</span>
          <h3 className="s6-card-title">Começando</h3>
          <ul className="s6-list">
            {pains.map((p) => (
              <li key={p}>
                <span className="s6-mark s6-mark-no" aria-hidden="true">✕</span>
                {p}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Ponte */}
        <div className="s6-bridge">
          <span className="s6-bridge-line" aria-hidden="true">
            <motion.span
              className="s6-bridge-fill"
              initial={false}
              animate={{ scaleX: after ? 1 : 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            />
          </span>
          <button
            type="button"
            className={`s6-orb${after ? ' is-on' : ''}`}
            onClick={toggle}
            aria-label={after ? 'Ver como tudo começou' : 'Ver a transformação'}
          >
            <motion.span animate={{ rotate: after ? 360 : 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
              →
            </motion.span>
          </button>
        </div>

        {/* DEPOIS */}
        <div className={`s6-after-wrap${after ? ' is-on' : ''}`}>
          <motion.div
            className="s6-card s6-after"
            initial={reduced ? false : { opacity: 0, x: 40, rotateY: -18 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ type: 'spring', stiffness: 70, damping: 16, delay: 0.3 }}
            style={{ transformPerspective: 1200 }}
          >
            <motion.div
              className="s6-tilt"
              style={{
                rotateX: reduced ? 0 : rotateX,
                rotateY: reduced ? 0 : rotateY,
                transformPerspective: 1200,
              }}
              onPointerMove={onMove}
              onPointerLeave={resetTilt}
            >
              <div className="s6-after-inner">
                <div className="s6-cert">
                  <motion.img
                    src={certificateImg}
                    alt="Certificado"
                    draggable={false}
                    initial={false}
                    animate={after ? { rotateY: 0, opacity: 1, scale: 1 } : { rotateY: 100, opacity: 0, scale: 0.8 }}
                    transition={{ type: 'spring', stiffness: 70, damping: 14, delay: after ? 0.25 : 0 }}
                  />
                  {after &&
                    [0, 1, 2, 3, 4, 5, 6].map((n) => (
                      <i
                        key={`${burst}-${n}`}
                        className="s6-spark"
                        style={
                          {
                            '--x': `${[-70, 74, -84, 88, 6, -40, 52][n]}px`,
                            '--y': `${[-60, -50, 20, 34, -88, 70, 80][n]}px`,
                            '--d': `${n * 0.09}s`,
                          } as CSSProperties
                        }
                      />
                    ))}
                </div>

                <div className="s6-after-copy">
                  <span className="s6-kicker s6-kicker-after">DEPOIS</span>
                  <h3 className="s6-card-title s6-grad">Profissional!</h3>
                  <ul className="s6-list">
                    {gains.map((g, i) => (
                      <motion.li
                        key={g}
                        initial={false}
                        animate={after ? { opacity: 1, x: 0 } : { opacity: 0, x: 18 }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: after ? 0.45 + i * 0.13 : 0 }}
                      >
                        <span className="s6-mark s6-mark-yes" aria-hidden="true">✓</span>
                        {g}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Convite para clicar: aparece só antes da transformação */}
            <button
              type="button"
              className="s6-reveal"
              onClick={toggle}
              tabIndex={after ? -1 : 0}
              aria-hidden={after}
            >
              <span className="s6-reveal-pill">
                Clique para ver a transformação <span aria-hidden="true">→</span>
              </span>
            </button>

          </motion.div>
        </div>
      </div>

      {/* Benefícios: acendem um a um na transformação */}
      <div className="s6-benefits">
        {benefits.map((b, i) => (
          <BenefitCard key={b.title} benefit={b} index={i} lit={after} />
        ))}
      </div>

      <style>{`
        .s6-section {
          --s6-ink: var(--text, #f7f1f4);
          --s6-muted: var(--muted, #b7aab2);
          --s6-ease: cubic-bezier(.22,1,.36,1);
          position: absolute; inset: var(--slot-top, 16px) var(--slot-x, 76px) var(--slot-bottom, 60px);
          isolation: isolate; display: flex; flex-direction: column; justify-content: center; gap: 18px; min-height: 0;
          color: var(--s6-ink); overflow: hidden;
        }
        .s6-section button { font: inherit; cursor: pointer; }
        .s6-section button:focus-visible { outline: 2px solid #f0a9bf; outline-offset: 4px; }

        .s6-aura { position: absolute; z-index: -1; left: 50%; top: 44%; width: 720px; height: 380px; margin: -190px 0 0 -360px; border-radius: 50%; filter: blur(120px); pointer-events: none; }

        /* Título */
        .s6-heading { flex: 0 0 auto; text-align: center; }
        .s6-heading h2 { margin: 8px 0 0; font-size: clamp(30px, 3.4vw, 44px); font-weight: 800; letter-spacing: -.05em; line-height: 1.1; text-wrap: balance; }
        .s6-heading h2 span {
          background: linear-gradient(100deg, #ffd0de 10%, #f0a9bf 40%, #d9708f 60%, #ffd0de 90%); background-size: 220% 100%;
          -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; animation: s6-shine 6s linear infinite;
        }
        @keyframes s6-shine { to { background-position: -220% 0; } }

        /* Palco antes / depois */
        .s6-stage { position: relative; flex: 0 1 290px; min-height: 0; display: grid; grid-template-columns: minmax(0, .82fr) 72px minmax(0, 1.18fr); align-items: stretch; }
        .s6-card {
          position: relative; display: flex; flex-direction: column; justify-content: center; min-width: 0; padding: 22px 26px;
          border: 1px solid rgba(255,255,255,.13); border-radius: 24px;
          background: linear-gradient(160deg, rgba(255,255,255,.09), rgba(255,255,255,.025) 60%, rgba(255,255,255,.05));
          backdrop-filter: blur(18px) saturate(1.3); -webkit-backdrop-filter: blur(18px) saturate(1.3);
          box-shadow: inset 0 1px 0 rgba(255,255,255,.24), inset 0 -1px 0 rgba(0,0,0,.2), 0 12px 32px rgba(0,0,0,.28), 0 30px 60px -24px rgba(0,0,0,.5);
        }
        .s6-before { transition: opacity .8s var(--s6-ease), transform .9s var(--s6-ease), filter .8s; cursor: default; }
        .s6-before.is-past { opacity: .5; transform: scale(.95) translateX(-6px); filter: saturate(.4); cursor: pointer; }

        .s6-kicker { color: var(--s6-muted); font-size: 10px; font-weight: 850; letter-spacing: .16em; }
        .s6-kicker-after { color: #ffd98a; }
        .s6-card-title { margin: 8px 0 14px; font-size: 28px; font-weight: 800; line-height: 1.1; letter-spacing: -.04em; color: var(--s6-muted); }
        .s6-grad { background: linear-gradient(90deg, #f0a9bf, #ffd98a); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; font-size: 34px; }

        .s6-list { display: grid; gap: 10px; margin: 0; padding: 0; list-style: none; }
        .s6-list li { display: flex; align-items: center; gap: 11px; font-size: 14px; line-height: 1.35; color: var(--s6-muted); }
        .s6-after-copy .s6-list li { color: var(--s6-ink); font-size: 15px; font-weight: 600; }
        .s6-mark { display: grid; flex: 0 0 24px; place-items: center; width: 24px; height: 24px; border-radius: 8px; font-size: 12px; font-weight: 850; }
        .s6-mark-no { background: rgba(255,255,255,.07); color: #8a7c84; border: 1px solid rgba(255,255,255,.08); }
        .s6-mark-yes { background: linear-gradient(150deg, #ffd98a, #f0a9bf); color: #3b2430; box-shadow: 0 6px 14px -4px #f0a9bf; }

        /* Ponte */
        .s6-bridge { position: relative; display: grid; place-items: center; }
        .s6-bridge-line { position: absolute; left: 0; right: 0; top: 50%; height: 3px; margin-top: -1.5px; overflow: hidden; border-radius: 3px; background: repeating-linear-gradient(90deg, rgba(255,255,255,.22) 0 6px, transparent 6px 12px); }
        .s6-bridge-fill { display: block; width: 100%; height: 100%; transform-origin: left; background: linear-gradient(90deg, #f0a9bf, #ffd98a); }
        .s6-orb {
          position: relative; display: grid; place-items: center; width: 52px; height: 52px; border: 1px solid rgba(255,255,255,.25); border-radius: 50%;
          color: #fff; font-size: 22px; font-weight: 800;
          background: radial-gradient(circle at 32% 26%, rgba(255,255,255,.7) 0, rgba(255,255,255,.12) 22%, transparent 42%), linear-gradient(150deg, #6b5560, #3a2c34);
          box-shadow: inset 0 -6px 10px rgba(0,0,0,.3), inset 0 2px 3px rgba(255,255,255,.4), 0 12px 24px -6px rgba(0,0,0,.6);
          transition: background .8s, box-shadow .8s, transform .3s var(--s6-ease);
        }
        .s6-orb:hover { transform: scale(1.1); }
        .s6-orb::after { content: ''; position: absolute; inset: -6px; border-radius: 50%; border: 2px solid #f0a9bf; opacity: 0; animation: s6-ring 2s ease-out infinite; }
        .s6-orb.is-on { background: radial-gradient(circle at 32% 26%, rgba(255,255,255,.9) 0, rgba(255,255,255,.25) 18%, transparent 40%), linear-gradient(150deg, #f0a9bf, #d9708f); box-shadow: inset 0 -6px 10px rgba(0,0,0,.25), inset 0 2px 3px rgba(255,255,255,.55), 0 12px 30px -4px #f0a9bf; }
        .s6-orb.is-on::after { animation: none; }
        @keyframes s6-ring { from { transform: scale(.85); opacity: .8; } to { transform: scale(1.6); opacity: 0; } }

        /* Depois */
        .s6-after-wrap { min-width: 0; display: flex; transition: opacity .9s var(--s6-ease), transform 1s var(--s6-ease); opacity: .55; transform: scale(.95) translateX(6px); }
        .s6-after-wrap.is-on { opacity: 1; transform: none; }
        .s6-after { flex: 1; transition: border-color .9s, box-shadow .9s, background .9s; }
        .s6-after-wrap.is-on .s6-after {
          border-color: rgba(240,169,191,.65);
          background: linear-gradient(160deg, rgba(240,169,191,.24), rgba(255,217,138,.07) 55%, rgba(255,255,255,.05));
          box-shadow: inset 0 1px 0 rgba(255,255,255,.4), inset 0 -1px 0 rgba(0,0,0,.2), 0 20px 50px rgba(0,0,0,.35), 0 50px 100px -28px #f0a9bf;
        }
        .s6-tilt { display: flex; flex: 1; align-items: center; }
        .s6-after-inner { display: flex; flex: 1; align-items: center; gap: 28px; transition: filter .9s var(--s6-ease), opacity .9s; }
        .s6-after-wrap:not(.is-on) .s6-after-inner { filter: grayscale(1) blur(5px); opacity: .5; }
        .s6-cert { position: relative; flex: 0 0 150px; height: 210px; perspective: 900px; }
        .s6-cert img { display: block; width: 100%; height: 100%; object-fit: contain; filter: drop-shadow(0 18px 22px rgba(0,0,0,.45)); animation: s6-float 4.4s ease-in-out infinite; }
        @keyframes s6-float { 50% { transform: translateY(-9px) rotate(-2deg); } }
        .s6-spark { position: absolute; left: 50%; top: 50%; width: 8px; height: 8px; border-radius: 50%; background: #fff; box-shadow: 0 0 12px 3px #f0a9bf; opacity: 0; animation: s6-spark 1.6s ease-out both; animation-delay: var(--d); }
        @keyframes s6-spark { 0% { transform: translate(0,0) scale(.3); opacity: 0; } 20% { opacity: 1; } 100% { transform: translate(var(--x), var(--y)) scale(1); opacity: 0; } }
        .s6-after-copy { min-width: 0; }
        .s6-after-copy .s6-card-title { margin-bottom: 14px; }

        .s6-reveal { position: absolute; inset: 0; z-index: 4; display: grid; place-items: center; border: 0; border-radius: inherit; background: transparent; color: #fff; transition: opacity .5s; }
        .s6-after-wrap.is-on .s6-reveal { opacity: 0; pointer-events: none; }
        .s6-reveal-pill {
          display: inline-flex; align-items: center; gap: 10px; padding: 13px 22px; border: 1px solid rgba(255,255,255,.3); border-radius: 999px;
          background: linear-gradient(150deg, rgba(240,169,191,.55), rgba(217,112,143,.4)); backdrop-filter: blur(14px);
          box-shadow: inset 0 1px 0 rgba(255,255,255,.5), 0 16px 34px -8px #d9708f; font-size: 15px; font-weight: 700;
          transition: transform .35s var(--s6-ease);
          animation: s6-pulse 2.4s ease-in-out infinite;
        }
        .s6-reveal:hover .s6-reveal-pill { transform: scale(1.06); animation-play-state: paused; }
        @keyframes s6-pulse { 50% { transform: translateY(-4px); } }

        /* Benefícios */
        .s6-benefits { flex: 0 0 auto; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 14px; }
        .s6-cell { display: flex; min-width: 0; }
        .s6-benefit {
          position: relative; display: flex; flex: 1; align-items: center; gap: 14px; min-width: 0; padding: 16px; overflow: hidden;
          border: 1px solid rgba(255,255,255,.1); border-radius: 20px;
          background: linear-gradient(160deg, rgba(255,255,255,.08), rgba(255,255,255,.02) 60%, rgba(255,255,255,.04));
          backdrop-filter: blur(16px) saturate(1.3); -webkit-backdrop-filter: blur(16px) saturate(1.3);
          box-shadow: inset 0 1px 0 rgba(255,255,255,.2), 0 10px 26px rgba(0,0,0,.26);
          transition: border-color .7s var(--s6-ease) var(--delay), box-shadow .7s var(--s6-ease) var(--delay);
          will-change: transform;
        }
        .s6-benefit::before {
          content: ''; position: absolute; inset: 0 0 auto 0; height: 3px; transform: scaleX(0); transform-origin: left;
          background: linear-gradient(90deg, var(--c), transparent); transition: transform .8s var(--s6-ease) var(--delay);
        }
        .s6-benefit.is-lit { border-color: color-mix(in srgb, var(--c) 55%, transparent); box-shadow: inset 0 1px 0 rgba(255,255,255,.3), 0 16px 36px rgba(0,0,0,.3), 0 30px 60px -22px var(--c); }
        .s6-benefit.is-lit::before { transform: scaleX(1); }
        .s6-glare { position: absolute; inset: 0; z-index: 3; border-radius: inherit; pointer-events: none; opacity: 0; transition: opacity .35s; }
        .s6-benefit:hover .s6-glare { opacity: 1; }
        .s6-b-orb {
          display: grid; flex: 0 0 54px; place-items: center; width: 54px; height: 54px; border-radius: 17px;
          border: 1px solid rgba(255,255,255,.18);
          background: linear-gradient(150deg, rgba(255,255,255,.22), rgba(255,255,255,.05));
          box-shadow: inset 0 1px 0 rgba(255,255,255,.4), 0 10px 18px -8px rgba(0,0,0,.5);
          filter: grayscale(1) opacity(.55); transition: filter .7s var(--s6-ease) var(--delay), box-shadow .7s var(--s6-ease) var(--delay);
        }
        .s6-benefit.is-lit .s6-b-orb { filter: none; box-shadow: inset 0 1px 0 rgba(255,255,255,.5), 0 12px 26px -6px var(--c); }
        .s6-b-orb img { width: 32px; height: 32px; object-fit: contain; filter: drop-shadow(0 4px 4px rgba(0,0,0,.35)); }
        .s6-b-copy { min-width: 0; }
        .s6-b-copy h3 { margin: 0 0 4px; font-size: 14px; font-weight: 750; line-height: 1.25; color: var(--s6-muted); transition: color .6s var(--delay); }
        .s6-benefit.is-lit .s6-b-copy h3 { color: #fff; }
        .s6-b-copy p { margin: 0; color: var(--s6-muted); font-size: 12px; line-height: 1.4; }

        @media (prefers-reduced-motion: reduce) {
          .s6-heading h2 span, .s6-orb::after, .s6-cert img, .s6-spark, .s6-reveal-pill { animation: none; }
          .s6-before, .s6-after-wrap, .s6-after, .s6-after-inner, .s6-benefit, .s6-benefit::before, .s6-b-orb, .s6-b-copy h3 { transition: none; }
        }
      `}</style>
    </section>
  );
}

export default S6;
