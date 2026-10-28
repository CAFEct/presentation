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

const sparkleImg = '/imgs/trofeu.png';
const crownImg = '/imgs/crown.png';
const targetImg = '/imgs/brauin.png';
const moneyImg = '/imgs/money.png';
const certImg = '/imgs/formatura.png';
const deliveryImg = '/imgs/world.png';

/* Hex porque o Framer Motion não anima variáveis CSS (mesmas cores dos LEDs do App). */
const perks = [
  { icon: sparkleImg, title: 'Tudo em um só lugar', desc: 'Sem pesquisar em vários sites', color: '#f0a9bf' },
  { icon: crownImg, title: 'Qualidade garantida', desc: 'Materiais testados por profissionais', color: '#8ec5ff' },
  { icon: targetImg, title: 'Foco brasileiro', desc: 'Criado para o mercado do Brasil', color: '#7ef0c3' },
  { icon: moneyImg, title: 'Preços justos', desc: 'Qualidade sem cobrança abusiva', color: '#ffd98a' },
  { icon: certImg, title: 'Certificação oficial', desc: 'Reconhecimento do seu empreendimento', color: '#ff5b78' },
  { icon: deliveryImg, title: 'Entrega rápida', desc: 'Materiais entregues em tempo hábil', color: '#d9708f' },
];

const tint = (color: string) => ({ '--c': color }) as CSSProperties;

interface CardProps {
  perk: (typeof perks)[number];
  index: number;
  active: boolean;
  onSelect: () => void;
}

/** Cartão 3D: inclina com o mouse, o ícone flutua em profundidade e o brilho segue o cursor. */
function PerkCard({ perk, index, active, onSelect }: CardProps) {
  const reduced = !!useReducedMotion();
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, { stiffness: 150, damping: 20, mass: 0.6 });
  const sy = useSpring(py, { stiffness: 150, damping: 20, mass: 0.6 });
  const rotateY = useTransform(sx, [0, 1], [-11, 11]);
  const rotateX = useTransform(sy, [0, 1], [11, -11]);
  const gx = useTransform(sx, (v) => `${v * 100}%`);
  const gy = useTransform(sy, (v) => `${v * 100}%`);
  const glare = useMotionTemplate`radial-gradient(320px circle at ${gx} ${gy}, rgba(255,255,255,.26), transparent 62%)`;

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
      className={`s9-slot${active ? ' is-active' : ''}`}
      style={tint(perk.color)}
      initial={reduced ? false : { opacity: 0, y: 50, rotateX: 24, transformPerspective: 1200 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ type: 'spring', stiffness: 70, damping: 16, delay: 0.3 + index * 0.09 }}
    >
      <motion.button
        type="button"
        className="s9-card"
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
        whileHover={reduced ? undefined : { y: -8, scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 220, damping: 20 }}
      >
        <span className="s9-glass" aria-hidden="true" />
        <motion.span className="s9-glare" style={{ background: glare }} aria-hidden="true" />

        <span className="s9-orb" aria-hidden="true">
          <img src={perk.icon} alt="" draggable={false} />
          {active && [0, 1, 2, 3].map((n) => (
            <i
              key={n}
              className="s9-spark"
              style={{ '--x': `${[-44, 50, -52, 46][n]}px`, '--y': `${[-36, -30, 26, 34][n]}px`, '--d': `${n * 0.5}s` } as CSSProperties}
            />
          ))}
        </span>
        <span className="s9-title">{perk.title}</span>
        <span className="s9-desc">{perk.desc}</span>
        <span className="s9-bar" aria-hidden="true">
          <span className="s9-bar-fill" />
        </span>
      </motion.button>
    </motion.div>
  );
}

function S9() {
  const reduced = !!useReducedMotion();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const current = perks[active];

  const clearHover = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
  };
  const hoverSelect = (i: number) => (e: ReactPointerEvent<HTMLElement>) => {
    if (e.pointerType !== 'mouse') return;
    clearHover();
    hoverTimer.current = setTimeout(() => setActive(i), 70);
  };
  useEffect(() => clearHover, []);

  // O destaque percorre os diferenciais sozinho; pausa quando a pessoa interage.
  useEffect(() => {
    if (reduced || paused) return;
    const id = setInterval(() => setActive((a) => (a + 1) % perks.length), 3200);
    return () => clearInterval(id);
  }, [reduced, paused]);

  return (
    <section className="s9-section" aria-labelledby="s9-title">
      <motion.span
        className="s9-aura"
        aria-hidden="true"
        animate={{ backgroundColor: current.color }}
        transition={{ duration: 0.9 }}
      />

      <header className="s9-heading">
        <Eyebrow>Diferenciais</Eyebrow>
        <motion.h2
          id="s9-title"
          initial={reduced ? false : { opacity: 0, y: 16, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          Por que escolher o <span>Esmalt'up?</span>
        </motion.h2>
      </header>

      <div
        className="s9-grid"
        onPointerEnter={() => setPaused(true)}
        onPointerLeave={() => {
          clearHover();
          setPaused(false);
        }}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
      >
        {perks.map((perk, i) => (
          <div key={perk.title} className="s9-hit" onPointerEnter={hoverSelect(i)}>
            <PerkCard perk={perk} index={i} active={active === i} onSelect={() => setActive(i)} />
          </div>
        ))}
      </div>

      <style>{`
        .s9-section {
          --s9-ink: var(--text, #f7f1f4);
          --s9-muted: var(--muted, #b7aab2);
          --s9-ease: cubic-bezier(.22,1,.36,1);
          position: absolute; inset: var(--slot-top, 16px) var(--slot-x, 76px) var(--slot-bottom, 60px);
          isolation: isolate; display: flex; flex-direction: column; justify-content: center; gap: 22px; min-height: 0;
          color: var(--s9-ink); overflow: visible;
        }
        .s9-section button { font: inherit; cursor: pointer; }
        .s9-section button:focus-visible { outline: 2px solid var(--c, #f0a9bf); outline-offset: 4px; }

        .s9-aura { position: absolute; z-index: -1; left: 50%; top: 58%; width: 720px; height: 420px; margin: -210px 0 0 -360px; border-radius: 50%; filter: blur(130px); opacity: .22; pointer-events: none; }

        .s9-heading { flex: 0 0 auto; text-align: center; }
        .s9-heading h2 { margin: 8px 0 0; font-size: clamp(32px, 3.6vw, 46px); font-weight: 800; letter-spacing: -.05em; line-height: 1.1; text-wrap: balance; }
        .s9-heading h2 span {
          background: linear-gradient(100deg, #ffd0de 10%, #f0a9bf 40%, #d9708f 60%, #ffd0de 90%); background-size: 220% 100%;
          -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; animation: s9-shine 6s linear infinite;
        }
        @keyframes s9-shine { to { background-position: -220% 0; } }

        .s9-grid { flex: 0 1 auto; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 18px; padding: 6px 14px 0; perspective: 1400px; }
        .s9-hit, .s9-slot { display: flex; min-width: 0; }
        .s9-slot { flex: 1; }

        /* Cartão: o vidro fica numa camada própria para o preserve-3d não ser achatado pelo backdrop-filter */
        .s9-card {
          position: relative; display: flex; flex: 1; flex-direction: column; align-items: flex-start; gap: 6px;
          min-height: 168px; padding: 20px 22px 22px; text-align: left; color: inherit;
          border: 0; background: none; transform-style: preserve-3d; will-change: transform;
        }
        .s9-card > span { display: block; }
        .s9-glass {
          position: absolute; inset: 0; border-radius: 24px; border: 1px solid rgba(255,255,255,.13);
          background: linear-gradient(160deg, rgba(255,255,255,.1), rgba(255,255,255,.025) 60%, rgba(255,255,255,.05));
          backdrop-filter: blur(18px) saturate(1.4); -webkit-backdrop-filter: blur(18px) saturate(1.4);
          box-shadow: inset 0 1px 0 rgba(255,255,255,.26), inset 0 -1px 0 rgba(0,0,0,.2), 0 10px 28px rgba(0,0,0,.28), 0 26px 56px -22px rgba(0,0,0,.5);
          transition: border-color .5s, background .5s, box-shadow .5s;
        }
        .s9-slot:hover .s9-glass { border-color: color-mix(in srgb, var(--c) 55%, transparent); }
        .s9-slot.is-active .s9-glass {
          border-color: color-mix(in srgb, var(--c) 75%, transparent);
          background: linear-gradient(160deg, color-mix(in srgb, var(--c) 26%, transparent), rgba(255,255,255,.03) 62%, rgba(255,255,255,.05));
          box-shadow: inset 0 1px 0 rgba(255,255,255,.38), inset 0 -1px 0 rgba(0,0,0,.2), 0 18px 44px rgba(0,0,0,.35), 0 44px 90px -26px var(--c);
        }
        .s9-glare { position: absolute; inset: 0; border-radius: 24px; pointer-events: none; opacity: 0; transition: opacity .35s; transform: translateZ(2px); }
        .s9-slot:hover .s9-glare { opacity: 1; }

        /* Ícone flutuando em profundidade */
        .s9-orb {
          position: relative; display: grid !important; place-items: center; width: 74px; height: 74px; margin-bottom: 8px; border-radius: 50%;
          transform: translateZ(46px); transition: transform .6s var(--s9-ease);
          background:
            radial-gradient(circle at 32% 26%, rgba(255,255,255,.55) 0, rgba(255,255,255,.12) 18%, transparent 42%),
            linear-gradient(150deg, color-mix(in srgb, var(--c) 55%, transparent), color-mix(in srgb, var(--c) 12%, transparent));
          box-shadow: inset 0 -6px 10px rgba(0,0,0,.25), inset 0 2px 3px rgba(255,255,255,.45), 0 14px 26px -8px var(--c);
        }
        .s9-orb::after { content: ''; position: absolute; inset: -7px; border-radius: 50%; border: 2px solid var(--c); opacity: 0; }
        .s9-slot.is-active .s9-orb { transform: translateZ(74px) scale(1.12); }
        .s9-slot.is-active .s9-orb::after { animation: s9-ring 2s ease-out infinite; }
        @keyframes s9-ring { from { transform: scale(.85); opacity: .85; } to { transform: scale(1.5); opacity: 0; } }
        .s9-orb img { width: 46px; height: 46px; object-fit: contain; filter: drop-shadow(0 6px 8px rgba(0,0,0,.4)); animation: s9-float 4.2s ease-in-out infinite; }
        .s9-slot:nth-child(2n) .s9-orb img { animation-delay: -1.4s; }
        .s9-slot:nth-child(3n) .s9-orb img { animation-delay: -2.6s; }
        @keyframes s9-float { 50% { transform: translateY(-5px) rotate(-3deg); } }
        .s9-spark { position: absolute !important; left: 50%; top: 50%; width: 7px; height: 7px; border-radius: 50%; background: #fff; box-shadow: 0 0 12px 3px var(--c); opacity: 0; animation: s9-spark 2.4s ease-out infinite; animation-delay: var(--d); }
        @keyframes s9-spark { 0% { transform: translate(0,0) scale(.3); opacity: 0; } 25% { opacity: 1; } 100% { transform: translate(var(--x), var(--y)) scale(1); opacity: 0; } }

        .s9-title { color: #fff; font-size: 20px; font-weight: 800; line-height: 1.15; letter-spacing: -.03em; transform: translateZ(30px); }
        .s9-desc { max-width: 260px; color: var(--s9-muted); font-size: 13px; line-height: 1.5; transform: translateZ(18px); }

        /* Barra que enche enquanto o cartão está em destaque */
        .s9-bar { position: absolute !important; left: 22px; right: 22px; bottom: 12px; height: 3px; overflow: hidden; border-radius: 3px; background: rgba(255,255,255,.1); }
        .s9-bar-fill { display: block; width: 100%; height: 100%; border-radius: inherit; background: var(--c); transform: scaleX(0); transform-origin: left; transition: transform .5s var(--s9-ease); }
        .s9-slot.is-active .s9-bar-fill { transform: scaleX(1); }

        @media (prefers-reduced-motion: reduce) {
          .s9-heading h2 span, .s9-orb::after, .s9-orb img, .s9-spark { animation: none; }
          .s9-orb, .s9-glass, .s9-bar-fill { transition: none; }
        }
      `}</style>
    </section>
  );
}

export default S9;
