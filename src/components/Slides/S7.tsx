import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'framer-motion';
import { useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from 'react';
import Eyebrow from '../Eyebrow';

const worldImg = '/imgs/world.png';
const cameraImg = '/imgs/camera.png';
const checkImg = '/imgs/check.png';
const trophyImg = '/imgs/trofeu.png';
const rocketImg = '/imgs/rocket.png';
const targetImg = '/imgs/target.png';

/* Hex porque o Framer Motion não anima variáveis CSS (mesmas cores dos LEDs do App). */
const steps = [
  { step: 1, title: 'Escolha', desc: 'seu kit ou os materiais que quer', icon: worldImg, color: '#8ec5ff' },
  { step: 2, title: 'Aprenda', desc: 'assistindo aos vídeos do curso', icon: cameraImg, color: '#f0a9bf' },
  { step: 3, title: 'Pratique', desc: 'com material profissional', icon: targetImg, color: '#7ef0c3' },
  { step: 4, title: 'Complete', desc: 'todas as aulas até o final', icon: checkImg, color: '#ffd98a' },
  { step: 5, title: 'Receba', desc: 'seu certificado de conclusão', icon: trophyImg, color: '#ffb36b' },
  { step: 6, title: 'Comece', desc: 'sua nova carreira!', icon: rocketImg, color: '#ff5b78' },
];

const last = steps.length - 1;
const tint = (color: string) => ({ '--c': color }) as CSSProperties;

interface CardProps {
  item: (typeof steps)[number];
  active: boolean;
  onSelect: () => void;
}

/** Cartão de vidro 3D: inclina com o mouse, brilho segue o cursor, o texto flutua em camadas. */
function StepCard({ item, active, onSelect }: CardProps) {
  const reduced = !!useReducedMotion();
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, { stiffness: 150, damping: 20, mass: 0.6 });
  const sy = useSpring(py, { stiffness: 150, damping: 20, mass: 0.6 });
  const rotateY = useTransform(sx, [0, 1], [-12, 12]);
  const rotateX = useTransform(sy, [0, 1], [12, -12]);
  const gx = useTransform(sx, (v) => `${v * 100}%`);
  const gy = useTransform(sy, (v) => `${v * 100}%`);
  const glare = useMotionTemplate`radial-gradient(260px circle at ${gx} ${gy}, rgba(255,255,255,.26), transparent 62%)`;

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
      className="s7-card"
      aria-pressed={active}
      onClick={onSelect}
      onFocus={onSelect}
      onPointerMove={onMove}
      onPointerLeave={reset}
      style={{
        rotateX: reduced ? 0 : rotateX,
        rotateY: reduced ? 0 : rotateY,
        transformPerspective: 1100,
      }}
      animate={{ y: active && !reduced ? -10 : 0 }}
      whileHover={reduced ? undefined : { y: -12 }}
      transition={{ type: 'spring', stiffness: 220, damping: 20 }}
    >
      <span className="s7-glass" aria-hidden="true" />
      <motion.span className="s7-glare" style={{ background: glare }} aria-hidden="true" />
      <span className="s7-num">{String(item.step).padStart(2, '0')}</span>
      <span className="s7-title">{item.title}</span>
      <span className="s7-desc">{item.desc}</span>
    </motion.button>
  );
}

function S7() {
  const reduced = !!useReducedMotion();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const current = steps[active];

  const clearHover = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
  };
  const hoverSelect = (i: number) => (e: ReactPointerEvent<HTMLElement>) => {
    if (e.pointerType !== 'mouse') return;
    clearHover();
    hoverTimer.current = setTimeout(() => setActive(i), 70);
  };
  useEffect(() => clearHover, []);

  // O caminho se percorre sozinho; pausa quando a pessoa interage.
  useEffect(() => {
    if (reduced || paused) return;
    const id = setInterval(() => setActive((a) => (a + 1) % steps.length), 3000);
    return () => clearInterval(id);
  }, [reduced, paused]);

  const progress = active / last;
  const gradient = `linear-gradient(90deg, ${steps.map((s) => s.color).join(', ')})`;

  return (
    <section className="s7-section" aria-labelledby="s7-title">
      <motion.span
        className="s7-aura"
        aria-hidden="true"
        animate={{ backgroundColor: current.color }}
        transition={{ duration: 0.9 }}
      />

      <header className="s7-heading">
        <Eyebrow>Como funciona na prática</Eyebrow>
        <motion.h2
          id="s7-title"
          initial={reduced ? false : { opacity: 0, y: 16, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          Passo a passo <span>simples</span>
        </motion.h2>
      </header>

      <div
        className="s7-path"
        onPointerEnter={() => setPaused(true)}
        onPointerLeave={() => {
          clearHover();
          setPaused(false);
        }}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
      >
        {/* Trilho: começa no centro do primeiro orbe e termina no centro do último */}
        <span className="s7-rail" aria-hidden="true">
          <motion.span
            className="s7-rail-fill"
            style={{ background: gradient, backgroundSize: `${100 / Math.max(progress, 0.01)}% 100%` }}
            initial={false}
            animate={{ scaleX: progress }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          />
        </span>

        {steps.map((item, i) => {
          const on = active === i;
          const done = i < active;
          return (
            <motion.div
              key={item.title}
              className={`s7-col${on ? ' is-active' : ''}${done ? ' is-done' : ''}`}
              style={tint(item.color)}
              onPointerEnter={hoverSelect(i)}
              initial={reduced ? false : { opacity: 0, y: 50, rotateX: 24, transformPerspective: 1200 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ type: 'spring', stiffness: 70, damping: 16, delay: 0.25 + i * 0.1 }}
            >
              <motion.button
                type="button"
                className="s7-orb"
                aria-label={`Passo ${item.step}: ${item.title}`}
                onClick={() => setActive(i)}
                animate={{ scale: on ? 1.18 : 1, y: on && !reduced ? -4 : 0 }}
                transition={{ type: 'spring', stiffness: 260, damping: 16 }}
              >
                <img
                  src={item.icon}
                  alt=""
                  draggable={false}
                  className={i === last && on ? 's7-launch' : undefined}
                />
                {done && <i className="s7-done" aria-hidden="true">✓</i>}
              </motion.button>
              <StepCard item={item} active={on} onSelect={() => setActive(i)} />
            </motion.div>
          );
        })}
      </div>

      <style>{`
        .s7-section {
          --s7-ink: var(--text, #f7f1f4);
          --s7-muted: var(--muted, #b7aab2);
          --s7-ease: cubic-bezier(.22,1,.36,1);
          position: absolute; inset: var(--slot-top, 16px) var(--slot-x, 76px) var(--slot-bottom, 60px);
          isolation: isolate; display: flex; flex-direction: column; justify-content: center; gap: 34px; min-height: 0;
          color: var(--s7-ink); overflow: visible;
        }
        .s7-section button { font: inherit; cursor: pointer; }
        .s7-section button:focus-visible { outline: 2px solid var(--c, #f0a9bf); outline-offset: 4px; }

        .s7-aura { position: absolute; z-index: -1; left: 50%; top: 60%; width: 760px; height: 400px; margin: -200px 0 0 -380px; border-radius: 50%; filter: blur(130px); opacity: .22; pointer-events: none; }

        .s7-heading { flex: 0 0 auto; text-align: center; }
        .s7-heading h2 { margin: 8px 0 0; font-size: clamp(32px, 3.6vw, 46px); font-weight: 800; letter-spacing: -.05em; line-height: 1.1; text-wrap: balance; }
        .s7-heading h2 span {
          background: linear-gradient(100deg, #ffd0de 10%, #f0a9bf 40%, #d9708f 60%, #ffd0de 90%); background-size: 220% 100%;
          -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; animation: s7-shine 6s linear infinite;
        }
        @keyframes s7-shine { to { background-position: -220% 0; } }

        /* 6 colunas iguais: o centro de cada orbe é o centro da coluna, então o trilho fica sempre alinhado */
        .s7-path { position: relative; display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 14px; perspective: 1400px; }
        .s7-rail { position: absolute; z-index: 0; top: 44px; left: calc(100% / 12); right: calc(100% / 12); height: 4px; border-radius: 4px; background: rgba(255,255,255,.1); overflow: hidden; }
        .s7-rail-fill { display: block; width: 100%; height: 100%; transform-origin: left; border-radius: inherit; box-shadow: 0 0 14px rgba(255,255,255,.35); }

        .s7-col { position: relative; z-index: 1; display: flex; min-width: 0; flex-direction: column; align-items: stretch; gap: 22px; }

        .s7-orb {
          position: relative; display: grid; place-items: center; align-self: center; width: 88px; height: 88px; padding: 0; border-radius: 50%; color: #fff;
          border: 1px solid color-mix(in srgb, var(--c) 40%, rgba(255,255,255,.18));
          background:
            radial-gradient(circle at 32% 26%, rgba(255,255,255,.5) 0, rgba(255,255,255,.1) 18%, transparent 42%),
            linear-gradient(150deg, color-mix(in srgb, var(--c) 40%, #1a1217), #14100f 85%);
          box-shadow: inset 0 -8px 14px rgba(0,0,0,.35), inset 0 2px 3px rgba(255,255,255,.4), 0 14px 28px -8px rgba(0,0,0,.6);
          transition: border-color .5s, box-shadow .5s, background .5s;
        }
        .s7-orb::after { content: ''; position: absolute; inset: -7px; border-radius: 50%; border: 2px solid var(--c); opacity: 0; pointer-events: none; }
        .s7-col.is-done .s7-orb { border-color: color-mix(in srgb, var(--c) 70%, transparent); }
        .s7-col.is-active .s7-orb {
          border-color: var(--c);
          background:
            radial-gradient(circle at 32% 26%, rgba(255,255,255,.65) 0, rgba(255,255,255,.14) 18%, transparent 42%),
            linear-gradient(150deg, color-mix(in srgb, var(--c) 75%, #1a1217), color-mix(in srgb, var(--c) 30%, #000));
          box-shadow: inset 0 -8px 14px rgba(0,0,0,.3), inset 0 2px 3px rgba(255,255,255,.55), 0 18px 40px -6px var(--c);
        }
        .s7-col.is-active .s7-orb::after { animation: s7-ring 2s ease-out infinite; }
        @keyframes s7-ring { from { transform: scale(.85); opacity: .85; } to { transform: scale(1.5); opacity: 0; } }
        .s7-orb img { width: 44px; height: 44px; object-fit: contain; filter: drop-shadow(0 5px 6px rgba(0,0,0,.45)); }
        .s7-col.is-active .s7-orb img { animation: s7-float 3.4s ease-in-out infinite; }
        @keyframes s7-float { 50% { transform: translateY(-4px) rotate(-4deg); } }
        .s7-orb img.s7-launch { animation: s7-launch 1.8s var(--s7-ease) infinite; }
        @keyframes s7-launch { 0%, 20% { transform: translate(0,0) rotate(0); } 55% { transform: translate(5px,-9px) rotate(6deg); } 100% { transform: translate(0,0) rotate(0); } }
        .s7-done {
          position: absolute; right: -2px; bottom: 0; display: grid; place-items: center; width: 22px; height: 22px; border-radius: 50%;
          background: var(--c); color: #1a1217; font-size: 12px; font-style: normal; font-weight: 900; box-shadow: 0 4px 10px rgba(0,0,0,.4);
        }

        /* Cartão: o vidro fica em camada própria para o preserve-3d não ser achatado pelo backdrop-filter */
        .s7-card {
          position: relative; display: flex; flex: 1; flex-direction: column; align-items: center; justify-content: center; gap: 6px;
          min-height: 176px; padding: 20px 14px; text-align: center; color: inherit;
          border: 0; background: none; transform-style: preserve-3d; will-change: transform;
        }
        .s7-card > span { display: block; }
        .s7-glass {
          position: absolute; inset: 0; border-radius: 22px; border: 1px solid rgba(255,255,255,.13);
          background: linear-gradient(160deg, rgba(255,255,255,.1), rgba(255,255,255,.025) 60%, rgba(255,255,255,.05));
          backdrop-filter: blur(18px) saturate(1.4); -webkit-backdrop-filter: blur(18px) saturate(1.4);
          box-shadow: inset 0 1px 0 rgba(255,255,255,.26), inset 0 -1px 0 rgba(0,0,0,.2), 0 10px 28px rgba(0,0,0,.28), 0 26px 56px -22px rgba(0,0,0,.5);
          transition: border-color .5s, background .5s, box-shadow .5s;
        }
        .s7-col:not(.is-active) .s7-card:hover .s7-glass { border-color: color-mix(in srgb, var(--c) 55%, transparent); }
        .s7-col.is-active .s7-glass {
          border-color: color-mix(in srgb, var(--c) 75%, transparent);
          background: linear-gradient(160deg, color-mix(in srgb, var(--c) 26%, transparent), rgba(255,255,255,.03) 62%, rgba(255,255,255,.05));
          box-shadow: inset 0 1px 0 rgba(255,255,255,.38), inset 0 -1px 0 rgba(0,0,0,.2), 0 18px 44px rgba(0,0,0,.35), 0 40px 80px -24px var(--c);
        }
        .s7-glare { position: absolute; inset: 0; border-radius: 22px; pointer-events: none; opacity: 0; transition: opacity .35s; transform: translateZ(2px); }
        .s7-card:hover .s7-glare { opacity: 1; }

        .s7-num { color: var(--c); font-size: 13px; font-weight: 850; letter-spacing: .08em; filter: brightness(1.2); font-variant-numeric: tabular-nums; transform: translateZ(22px); }
        .s7-title { color: #fff; font-size: 21px; font-weight: 800; letter-spacing: -.03em; line-height: 1.15; transform: translateZ(36px); transition: transform .5s var(--s7-ease); }
        .s7-desc { max-width: 150px; color: var(--s7-muted); font-size: 13px; line-height: 1.5; transform: translateZ(16px); }
        .s7-col.is-active .s7-title { transform: translateZ(54px); }

        @media (prefers-reduced-motion: reduce) {
          .s7-heading h2 span, .s7-orb::after, .s7-orb img { animation: none; }
          .s7-orb, .s7-glass, .s7-title { transition: none; }
        }
      `}</style>
    </section>
  );
}

export default S7;
