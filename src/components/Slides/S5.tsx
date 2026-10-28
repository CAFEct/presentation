import {
  animate,
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

const capImg = '/imgs/formatura.png';
const cameraImg = '/imgs/camera.png';

/* Cores em hex porque o Framer Motion não anima variáveis CSS (var(--rose)).
   São as mesmas cores usadas nos LEDs do App. */
const modules = [
  { title: 'Unha e Segurança', desc: 'Materiais essenciais e biossegurança', color: '#f0a9bf', lessons: 6 },
  { title: 'Cutilagem e Esmaltação', desc: 'Mãos e pés perfeitos', color: '#8ec5ff', lessons: 5 },
  { title: 'Nail Art', desc: 'Decoração e francesinha', color: '#7ef0c3', lessons: 4 },
  { title: 'Unhas de Gel', desc: 'Uma técnica premium', color: '#ffd98a', lessons: 4 },
  { title: 'Sua Carreira', desc: 'Como montar sua agenda', color: '#ff5b78', lessons: 4 },
];

const totalLessons = modules.reduce((sum, m) => sum + m.lessons, 0);

type Step = { title: string; desc: string; color: string; lessons: number; cert?: boolean };

/* O caminho: 5 módulos e, no fim, o certificado. */
const steps: Step[] = [
  ...modules,
  {
    title: 'Certificado',
    desc: `Ao concluir as ${totalLessons} aulas em vídeo, o certificado é seu.`,
    color: '#ffd0de',
    lessons: 0,
    cert: true,
  },
];

const facts = ['4–6 semanas', 'No seu ritmo', 'Comunidade exclusiva'];
const pad = (n: number) => String(n).padStart(2, '0');
const tint = (color: string) => ({ '--c': color }) as CSSProperties;

/* ------------------------------------------------------------------ */
/*  Peças                                                              */
/* ------------------------------------------------------------------ */

function CountUp({ to }: { to: number }) {
  const reduced = useReducedMotion();
  const mv = useMotionValue(reduced ? to : 0);
  const text = useTransform(mv, (v) => String(Math.round(v)));

  useEffect(() => {
    if (reduced) {
      mv.set(to);
      return;
    }
    const controls = animate(mv, to, { duration: 1.4, delay: 0.9, ease: [0.22, 1, 0.36, 1] });
    return () => controls.stop();
  }, [to, reduced, mv]);

  return <motion.b className="s5-fact-number">{text}</motion.b>;
}

interface CardProps {
  step: Step;
  index: number;
  active: boolean;
  onSelect: () => void;
}

/** Cartão de vidro: inclina em 3D, tem brilho que segue o mouse e revela os detalhes quando ativo. */
function StepCard({ step, index, active, onSelect }: CardProps) {
  const reduced = !!useReducedMotion();
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, { stiffness: 150, damping: 20, mass: 0.6 });
  const sy = useSpring(py, { stiffness: 150, damping: 20, mass: 0.6 });
  const rotateY = useTransform(sx, [0, 1], [-7, 7]);
  const rotateX = useTransform(sy, [0, 1], [7, -7]);
  const gx = useTransform(sx, (v) => `${v * 100}%`);
  const gy = useTransform(sy, (v) => `${v * 100}%`);
  const glare = useMotionTemplate`radial-gradient(300px circle at ${gx} ${gy}, rgba(255,255,255,.22), transparent 62%)`;

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
    <motion.button
      type="button"
      className="s5-card"
      aria-expanded={active}
      onClick={onSelect}
      onFocus={onSelect}
      onPointerMove={onMove}
      onPointerLeave={reset}
      style={{
        rotateX: reduced ? 0 : rotateX,
        rotateY: reduced ? 0 : rotateY,
        transformPerspective: 1200,
      }}
      whileHover={reduced ? undefined : { y: active ? 0 : -6 }}
      transition={{ type: 'spring', stiffness: 220, damping: 20 }}
    >
      <motion.span className="s5-glare" style={{ background: glare }} aria-hidden="true" />

      {/* Estado fechado: só o essencial */}
      <span className="s5-layer s5-collapsed" aria-hidden={active}>
        {step.cert ? (
          <img className="s5-mini-cap" src={capImg} alt="" draggable={false} />
        ) : (
          <span className="s5-count">
            <b>{pad(step.lessons)}</b>
            <small>aulas</small>
          </span>
        )}
        <span className="s5-collapsed-title">{step.title}</span>
      </span>

      {/* Estado aberto: detalhes do módulo */}
      <span className="s5-layer s5-expanded" aria-hidden={!active}>
        <span className="s5-kicker">
          {step.cert ? 'AO FINAL' : `MÓDULO ${index + 1} DE ${modules.length}`}
        </span>
        <span className="s5-card-title">{step.title}</span>
        <span className="s5-card-desc">{step.desc}</span>

        {active &&
          (step.cert ? (
            <span className="s5-cert-art" aria-hidden="true">
              <img src={capImg} alt="" draggable={false} />
              {[0, 1, 2, 3, 4].map((n) => (
                <i
                  key={n}
                  className="s5-spark"
                  style={{ '--x': `${[-46, 52, -62, 66, 8][n]}px`, '--y': `${[-34, -28, 18, 22, -50][n]}px`, '--d': `${n * 0.35}s` } as CSSProperties}
                />
              ))}
            </span>
          ) : (
            <span className="s5-lessons">
              <span className="s5-lessons-label">{step.lessons} aulas em vídeo</span>
              <span className="s5-tiles">
                {Array.from({ length: step.lessons }).map((_, n) => (
                  <span key={n} className="s5-tile" style={{ '--i': n } as CSSProperties}>
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M9 6.75L18 12L9 17.25V6.75Z" fill="currentColor" />
                    </svg>
                    {pad(n + 1)}
                  </span>
                ))}
              </span>
            </span>
          ))}
      </span>
    </motion.button>
  );
}

/* ------------------------------------------------------------------ */
/*  Slide 5                                                            */
/* ------------------------------------------------------------------ */

function S5() {
  const reduced = !!useReducedMotion();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const current = steps[active];
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearHover = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
  };
  const hoverSelect = (i: number) => (e: ReactPointerEvent<HTMLElement>) => {
    if (e.pointerType !== 'mouse') return;
    clearHover();
    hoverTimer.current = setTimeout(() => setActive(i), 70);
  };
  useEffect(() => clearHover, []);

  // A jornada se mostra sozinha; pausa quando a pessoa interage.
  useEffect(() => {
    if (reduced || paused) return;
    const id = setInterval(() => setActive((a) => (a + 1) % steps.length), 3400);
    return () => clearInterval(id);
  }, [reduced, paused]);

  return (
    <section className="s5-section" aria-labelledby="s5-title">
      <motion.span
        className="s5-aura"
        aria-hidden="true"
        animate={{ backgroundColor: current.color }}
        transition={{ duration: 0.9 }}
      />

      <header className="s5-heading">
        <Eyebrow>Curso com especialistas</Eyebrow>
        <motion.h2
          id="s5-title"
          initial={reduced ? false : { opacity: 0, y: 16, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          Aprenda com as <span>melhores profissionais</span>
        </motion.h2>
        <p>Um caminho em {modules.length} módulos, do primeiro material até a sua carreira.</p>
      </header>

      <div
        className="s5-track"
        onPointerEnter={() => setPaused(true)}
        onPointerLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
      >
        {steps.map((step, i) => {
          const on = active === i;
          const done = i < active;
          const next = steps[i + 1];
          return (
            <motion.div
              key={step.title}
              className={`s5-col${on ? ' is-active' : ''}${done ? ' is-done' : ''}`}
              style={tint(step.color)}
              onPointerEnter={hoverSelect(i)}
              onPointerLeave={clearHover}
              initial={reduced ? false : { opacity: 0, y: 46, rotateX: 22, transformPerspective: 1200 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ type: 'spring', stiffness: 70, damping: 16, delay: 0.25 + i * 0.09 }}
            >
              <div className="s5-node-row" onClick={() => setActive(i)}>
                <motion.span
                  className="s5-orb"
                  aria-hidden="true"
                  animate={{ scale: on ? 1.16 : 1 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 16 }}
                >
                  {step.cert ? (
                    <img src={capImg} alt="" draggable={false} />
                  ) : done ? (
                    '✓'
                  ) : (
                    i + 1
                  )}
                </motion.span>
                {next && (
                  <span className="s5-line" aria-hidden="true">
                    <motion.span
                      className="s5-line-fill"
                      style={{ background: `linear-gradient(90deg, ${step.color}, ${next.color})` }}
                      initial={false}
                      animate={{ scaleX: done ? 1 : 0 }}
                      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </span>
                )}
              </div>
              <StepCard step={step} index={i} active={on} onSelect={() => setActive(i)} />
            </motion.div>
          );
        })}
      </div>

      <motion.div
        className="s5-facts"
        initial={reduced ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.6 }}
      >
        <span className="s5-fact s5-fact-main">
          <img src={cameraImg} alt="" draggable={false} />
          <span>
            <CountUp to={totalLessons} /> aulas em vídeo + certificado
          </span>
        </span>
        {facts.map((f) => (
          <span key={f} className="s5-fact">
            <i aria-hidden="true" />
            {f}
          </span>
        ))}
      </motion.div>

      <style>{`
        .s5-section {
          --s5-ink: var(--text, #f7f1f4);
          --s5-muted: var(--muted, #b7aab2);
          --s5-ease: cubic-bezier(.22,1,.36,1);
          position: absolute; inset: var(--slot-top, 16px) var(--slot-x, 76px) var(--slot-bottom, 60px);
          isolation: isolate; display: flex; flex-direction: column; justify-content: center; gap: 14px; min-height: 0;
          color: var(--s5-ink); overflow: visible;
        }
        .s5-section button { font: inherit; cursor: pointer; }
        .s5-section button:focus-visible { outline: 2px solid var(--c, #f0a9bf); outline-offset: 4px; }

        .s5-aura { position: absolute; z-index: -1; left: 50%; top: 56%; width: 640px; height: 400px; margin: -200px 0 0 -320px; border-radius: 50%; filter: blur(120px); opacity: .2; pointer-events: none; }

        /* Título */
        .s5-heading { flex: 0 0 auto; text-align: center; }
        .s5-heading h2 { margin: 8px 0 6px; font-size: clamp(30px, 3.4vw, 44px); font-weight: 800; letter-spacing: -.05em; line-height: 1.1; text-wrap: balance; }
        .s5-heading h2 span {
          background: linear-gradient(100deg, #ffd0de 10%, #f0a9bf 40%, #d9708f 60%, #ffd0de 90%); background-size: 220% 100%;
          -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; animation: s5-shine 6s linear infinite;
        }
        @keyframes s5-shine { to { background-position: -220% 0; } }
        .s5-heading > p { margin: 0 auto; max-width: 560px; color: var(--s5-muted); font-size: 15px; line-height: 1.55; }

        /* Caminho */
        .s5-track { flex: 0 1 372px; min-height: 0; display: flex; gap: 10px; padding: 10px 14px 0; }
        .s5-col { display: flex; flex: 1 1 0; min-width: 0; min-height: 0; flex-direction: column; gap: 10px; transition: flex-grow .8s var(--s5-ease); }
        .s5-col.is-active { flex-grow: 3.2; }

        .s5-node-row { display: flex; flex: 0 0 auto; align-items: center; gap: 10px; height: 50px; padding-left: 2px; cursor: pointer; }
        .s5-orb {
          position: relative; display: grid; flex: 0 0 46px; place-items: center; width: 46px; height: 46px; border-radius: 50%;
          color: #fff; font-size: 17px; font-weight: 800; text-shadow: 0 1px 3px rgba(0,0,0,.45);
          background:
            radial-gradient(circle at 32% 26%, rgba(255,255,255,.92) 0, rgba(255,255,255,.28) 16%, transparent 38%),
            linear-gradient(150deg, var(--c), color-mix(in srgb, var(--c) 45%, #000));
          box-shadow: inset 0 -6px 10px rgba(0,0,0,.28), inset 0 2px 3px rgba(255,255,255,.5), 0 10px 22px -6px var(--c);
        }
        .s5-orb::after { content: ''; position: absolute; inset: -6px; border-radius: 50%; border: 2px solid var(--c); opacity: 0; }
        .s5-col.is-active .s5-orb::after { animation: s5-ring 2s ease-out infinite; }
        @keyframes s5-ring { from { transform: scale(.85); opacity: .85; } to { transform: scale(1.5); opacity: 0; } }
        .s5-orb img { width: 26px; height: 26px; object-fit: contain; filter: drop-shadow(0 3px 4px rgba(0,0,0,.35)); }
        .s5-line { flex: 1; height: 4px; margin-right: 2px; overflow: hidden; border-radius: 4px; background: rgba(255,255,255,.1); }
        .s5-line-fill { display: block; width: 100%; height: 100%; transform-origin: left; border-radius: inherit; }

        /* Cartão de vidro */
        .s5-card {
          position: relative; flex: 1; min-height: 0; padding: 0; overflow: hidden; text-align: left; color: inherit;
          border: 1px solid rgba(255,255,255,.13); border-radius: 22px;
          background: linear-gradient(160deg, rgba(255,255,255,.1), rgba(255,255,255,.025) 60%, rgba(255,255,255,.05));
          backdrop-filter: blur(18px) saturate(1.4); -webkit-backdrop-filter: blur(18px) saturate(1.4);
          box-shadow: inset 0 1px 0 rgba(255,255,255,.26), inset 0 -1px 0 rgba(0,0,0,.2), 0 10px 28px rgba(0,0,0,.28), 0 26px 56px -22px rgba(0,0,0,.5);
          transition: border-color .5s, background .5s, box-shadow .5s;
          will-change: transform;
        }
        .s5-col:not(.is-active) .s5-card:hover { border-color: color-mix(in srgb, var(--c) 55%, transparent); }
        .s5-col.is-active .s5-card {
          border-color: color-mix(in srgb, var(--c) 75%, transparent);
          background: linear-gradient(160deg, color-mix(in srgb, var(--c) 26%, transparent), rgba(255,255,255,.03) 62%, rgba(255,255,255,.05));
          box-shadow: inset 0 1px 0 rgba(255,255,255,.38), inset 0 -1px 0 rgba(0,0,0,.2), 0 18px 44px rgba(0,0,0,.35), 0 44px 90px -26px var(--c);
        }
        .s5-glare { position: absolute; inset: 0; z-index: 3; border-radius: inherit; pointer-events: none; opacity: 0; transition: opacity .35s; }
        .s5-col.is-active .s5-card:hover .s5-glare { opacity: 1; }

        .s5-layer { position: absolute; inset: 0; display: flex; flex-direction: column; transition: opacity .4s, transform .6s var(--s5-ease); }
        .s5-layer span, .s5-layer img { display: block; }

        .s5-collapsed { justify-content: space-between; padding: 18px 14px; }
        .s5-count { display: grid; gap: 2px; }
        .s5-count b { font-size: 40px; font-weight: 850; line-height: 1; letter-spacing: -.04em; color: var(--c); filter: brightness(1.15); font-variant-numeric: tabular-nums; }
        .s5-count small { color: var(--s5-muted); font-size: 11px; font-weight: 700; }
        .s5-collapsed-title { font-size: 13px; font-weight: 700; line-height: 1.3; }
        .s5-mini-cap { width: 44px; height: 44px; object-fit: contain; filter: drop-shadow(0 8px 10px rgba(0,0,0,.35)); }
        .s5-col.is-active .s5-collapsed { opacity: 0; transform: translateX(-12px); pointer-events: none; }

        .s5-expanded { width: 360px; gap: 0; padding: 22px 22px 20px; opacity: 0; transform: translateX(16px); pointer-events: none; }
        .s5-col.is-active .s5-expanded { opacity: 1; transform: none; transition-delay: .25s; }
        .s5-kicker { color: var(--c); font-size: 10px; font-weight: 850; letter-spacing: .14em; filter: brightness(1.2); }
        .s5-card-title { margin: 8px 0 6px; color: #fff; font-size: 26px; font-weight: 800; line-height: 1.12; letter-spacing: -.04em; }
        .s5-card-desc { max-width: 300px; color: var(--s5-muted); font-size: 13px; line-height: 1.55; }

        .s5-lessons { margin-top: auto; }
        .s5-lessons-label { margin-bottom: 10px; color: var(--s5-ink); font-size: 12px; font-weight: 700; }
        .s5-tiles { display: grid !important; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
        .s5-tile {
          display: flex !important; align-items: center; gap: 7px; padding: 9px 10px; border: 1px solid rgba(255,255,255,.14); border-radius: 12px;
          background: linear-gradient(160deg, rgba(255,255,255,.14), rgba(255,255,255,.04));
          box-shadow: inset 0 1px 0 rgba(255,255,255,.3), 0 8px 16px -8px rgba(0,0,0,.5);
          color: var(--s5-ink); font-size: 12px; font-weight: 700; font-variant-numeric: tabular-nums;
          animation: s5-pop .55s var(--s5-ease) both; animation-delay: calc(var(--i) * 60ms + 320ms);
          transition: transform .3s var(--s5-ease), border-color .3s;
        }
        .s5-tile:hover { transform: translateY(-3px) scale(1.04); border-color: var(--c); }
        .s5-tile svg { width: 14px; height: 14px; color: var(--c); filter: brightness(1.2); }
        @keyframes s5-pop { from { opacity: 0; transform: translateY(12px) scale(.82); } to { opacity: 1; transform: none; } }

        .s5-cert-art { position: relative; margin: auto auto 6px; width: 120px; height: 120px; }
        .s5-cert-art img { width: 100%; height: 100%; object-fit: contain; filter: drop-shadow(0 18px 22px rgba(0,0,0,.4)); animation: s5-float 4s ease-in-out infinite; }
        @keyframes s5-float { 50% { transform: translateY(-9px) rotate(-3deg); } }
        .s5-spark { position: absolute !important; left: 50%; top: 50%; width: 8px; height: 8px; border-radius: 50%; background: #fff; box-shadow: 0 0 12px 3px var(--c); opacity: 0; animation: s5-spark 2.4s ease-out infinite; animation-delay: var(--d); }
        @keyframes s5-spark { 0% { transform: translate(0,0) scale(.3); opacity: 0; } 25% { opacity: 1; } 100% { transform: translate(var(--x), var(--y)) scale(1); opacity: 0; } }

        /* Fatos rápidos */
        .s5-facts { display: flex; flex: 0 0 auto; flex-wrap: wrap; align-items: center; justify-content: center; gap: 10px; }
        .s5-fact {
          display: inline-flex; align-items: center; gap: 9px; padding: 9px 16px; border: 1px solid rgba(255,255,255,.14); border-radius: 999px;
          background: linear-gradient(160deg, rgba(255,255,255,.1), rgba(255,255,255,.03)); backdrop-filter: blur(14px);
          box-shadow: inset 0 1px 0 rgba(255,255,255,.22), 0 8px 20px rgba(0,0,0,.22);
          color: var(--s5-muted); font-size: 13px; font-weight: 600;
          transition: transform .3s var(--s5-ease), border-color .3s;
        }
        .s5-fact:hover { transform: translateY(-2px); border-color: rgba(240,169,191,.45); }
        .s5-fact i { width: 7px; height: 7px; border-radius: 50%; background: #f0a9bf; box-shadow: 0 0 10px #f0a9bf; }
        .s5-fact-main { color: var(--s5-ink); font-size: 15px; font-weight: 700; }
        .s5-fact-main img { width: 24px; height: 24px; object-fit: contain; }
        .s5-fact-number { color: #f0a9bf; font-size: 22px; font-weight: 850; font-variant-numeric: tabular-nums; }

        @media (prefers-reduced-motion: reduce) {
          .s5-heading h2 span, .s5-orb::after, .s5-cert-art img, .s5-spark, .s5-tile { animation: none; }
          .s5-col, .s5-layer, .s5-card, .s5-fact, .s5-tile { transition: none; }
        }
      `}</style>
    </section>
  );
}

export default S5;
