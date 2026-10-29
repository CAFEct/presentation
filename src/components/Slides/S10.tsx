import {
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from 'react';

const crownImg = '/imgs/crown.png';
const trophyImg = '/imgs/trofeu.png';
const cameraImg = '/imgs/camera.png';
const rocketImg = '/imgs/rocket.png';
const worldImg = '/imgs/world.png';
const checkImg = '/imgs/check.png';
const capImg = '/imgs/formatura.png';

/* Hex porque o Framer Motion não anima variáveis CSS (mesmas cores dos LEDs do App). */
const COLORS = ['#f0a9bf', '#8ec5ff', '#7ef0c3', '#ffd98a', '#ff5b78', '#d9708f'];

const orbitIcons = [
  { src: crownImg, color: '#ffd98a' },
  { src: cameraImg, color: '#f0a9bf' },
  { src: worldImg, color: '#8ec5ff' },
  { src: checkImg, color: '#7ef0c3' },
  { src: capImg, color: '#ffd0de' },
  { src: rocketImg, color: '#ff5b78' },
  { src: trophyImg, color: '#ffb36b' },
];

const WORD = 'Obrigado!'.split('');
const RX = 440; // raio horizontal da órbita
const RZ = 300; // profundidade da órbita
const rad = (deg: number) => (deg * Math.PI) / 180;

/* ------------------------------------------------------------------ */
/*  Peças                                                              */
/* ------------------------------------------------------------------ */

/** Ícone em órbita 3D: passa por trás e pela frente do título de verdade (z real). */
function OrbitIcon({ src, color, base, t }: { src: string; color: string; base: number; t: MotionValue<number> }) {
  const x = useTransform(t, (v) => Math.cos(rad(v + base)) * RX);
  const z = useTransform(t, (v) => Math.sin(rad(v + base)) * RZ);
  const y = useTransform(t, (v) => Math.sin(rad(v + base)) * 50 - 8);
  const opacity = useTransform(t, (v) => 0.5 + (Math.sin(rad(v + base)) + 1) * 0.25);

  return (
    <motion.span
      className="s10-orb"
      style={{ x, y, z, opacity, '--c': color } as unknown as CSSProperties}
      whileHover={{ scale: 1.3 }}
      transition={{ type: 'spring', stiffness: 260, damping: 16 }}
    >
      <img src={src} alt="" draggable={false} />
    </motion.span>
  );
}

/** Explosão de confete: sobe, abre e cai. */
function Burst({ x, y, onDone }: { x: number; y: number; onDone: () => void }) {
  const bits = useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => {
        const a = Math.random() * Math.PI * 2;
        const v = 140 + Math.random() * 280;
        const round = Math.random() > 0.6;
        const w = 6 + Math.random() * 6;
        return {
          dx: Math.cos(a) * v,
          dy: Math.sin(a) * v - 90,
          rot: (Math.random() - 0.5) * 720,
          c: COLORS[i % COLORS.length],
          w,
          h: round ? w : w + 5,
          round,
          delay: Math.random() * 0.08,
        };
      }),
    [],
  );

  useEffect(() => {
    const id = setTimeout(onDone, 2100);
    return () => clearTimeout(id);
  }, [onDone]);

  return (
    <span className="s10-burst" style={{ left: x, top: y }} aria-hidden="true">
      {bits.map((b, i) => (
        <motion.i
          key={i}
          className="s10-bit"
          style={{ width: b.w, height: b.h, background: b.c, borderRadius: b.round ? '50%' : 2 }}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
          animate={{ x: b.dx, y: [0, b.dy, b.dy + 280], opacity: [1, 1, 0], rotate: b.rot }}
          transition={{ duration: 1.9, ease: 'easeOut', times: [0, 0.45, 1], delay: b.delay }}
        />
      ))}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Slide 10                                                           */
/* ------------------------------------------------------------------ */

function S10() {
  const reduced = !!useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const [bursts, setBursts] = useState<{ id: number; x: number; y: number }[]>([]);
  const nextId = useRef(0);

  const addBurst = useCallback((x: number, y: number) => {
    setBursts((b) => [...b, { id: nextId.current++, x, y }]);
  }, []);
  const removeBurst = useCallback((id: number) => setBursts((b) => b.filter((i) => i.id !== id)), []);

  // Comemoração automática quando o "!" aterrissa.
  useEffect(() => {
    if (reduced) return;
    const id = setTimeout(() => {
      const r = ref.current?.getBoundingClientRect();
      if (r) addBurst(r.width / 2, r.height * 0.46);
    }, 1500);
    return () => clearTimeout(id);
  }, [reduced, addBurst]);

  // Órbita contínua
  const t = useMotionValue(0);
  useEffect(() => {
    if (reduced) return;
    const c = animate(t, 360, { duration: 36, ease: 'linear', repeat: Infinity });
    return () => c.stop();
  }, [reduced, t]);

  // Cena gira com o mouse + holofote que segue o cursor
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18 });
  const sy = useSpring(my, { stiffness: 60, damping: 18 });
  const rotateY = useTransform(sx, [-0.5, 0.5], [-10, 10]);
  const rotateX = useTransform(sy, [-0.5, 0.5], [7, -7]);
  const gx = useTransform(sx, (v) => `${(v + 0.5) * 100}%`);
  const gy = useTransform(sy, (v) => `${(v + 0.5) * 100}%`);
  const spot = useMotionTemplate`radial-gradient(520px circle at ${gx} ${gy}, rgba(255,214,228,.14), transparent 65%)`;

  const onMove = (e: ReactPointerEvent<HTMLElement>) => {
    if (reduced || e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };
  const onClick = (e: ReactPointerEvent<HTMLElement> | React.MouseEvent<HTMLElement>) => {
    if (reduced) return;
    const r = e.currentTarget.getBoundingClientRect();
    addBurst(e.clientX - r.left, e.clientY - r.top);
  };

  return (
    <section
      ref={ref}
      className="s10-section"
      aria-labelledby="s10-title"
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      onClick={onClick}
    >
      {/* Luz de fundo que muda de cor sozinha */}
      <motion.span
        className="s10-aura"
        aria-hidden="true"
        animate={{ backgroundColor: [...COLORS, COLORS[0]], scale: [1, 1.15, 1] }}
        transition={{
          backgroundColor: { duration: 18, repeat: Infinity, ease: 'linear' },
          scale: { duration: 7, repeat: Infinity, ease: 'easeInOut' },
        }}
      />
      <motion.span className="s10-spot" style={{ background: spot }} aria-hidden="true" />

      <div className="s10-hero">
        <motion.div className="s10-group" style={{ rotateX: reduced ? 0 : rotateX, rotateY: reduced ? 0 : rotateY }}>
          <div className="s10-titlebox">
            <div className="s10-orbit" aria-hidden="true">
              {orbitIcons.map((ic, i) => (
                <OrbitIcon key={ic.src} src={ic.src} color={ic.color} base={(360 / orbitIcons.length) * i} t={t} />
              ))}
            </div>

            <h1 id="s10-title" className="s10-title" aria-label="Obrigado!">
              {WORD.map((ch, i) => (
                <motion.span
                  key={i}
                  className="s10-letter"
                  aria-hidden="true"
                  initial={reduced ? false : { opacity: 0, y: 90, scale: 0.7 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 90, damping: 11, delay: 0.25 + i * 0.07 }}
                  whileHover={reduced ? undefined : { y: -24, rotate: i % 2 ? 5 : -5, scale: 1.14 }}
                >


                  <span
                    className={`s10-glyph${ch === '!' ? ' is-bang' : ''}`}
                    style={{ '--i': i } as CSSProperties}
                  >
                    {ch}
                  </span>
                </motion.span>
              ))}
            </h1>
          </div>

          <motion.p
            className="s10-lead"
            initial={reduced ? false : { opacity: 0, y: 18, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ delay: 1.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            Obrigado por ficar até o final.
          </motion.p>

          <motion.div
            className="s10-chips"
            initial={reduced ? false : { opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.span className="s10-chip s10-brand" whileHover={reduced ? undefined : { scale: 1.07, y: -4 }}>
              <i aria-hidden="true">✦</i> Esmalt'up
            </motion.span>
            <motion.span className="s10-chip" whileHover={reduced ? undefined : { scale: 1.05, y: -3 }}>
              Sua nova carreira começa aqui
            </motion.span>
          </motion.div>
        </motion.div>
      </div>

      <span className="s10-hint" aria-hidden="true">Clique para comemorar ✦</span>

      {bursts.map((b) => (
        <Burst key={b.id} x={b.x} y={b.y} onDone={() => removeBurst(b.id)} />
      ))}

      <style>{`
        .s10-section {
          --s10-ink: var(--text, #f7f1f4);
          --s10-muted: var(--muted, #b7aab2);
          --s10-ease: cubic-bezier(.22,1,.36,1);
          position: absolute; inset: var(--slot-top, 16px) var(--slot-x, 76px) var(--slot-bottom, 60px);
          isolation: isolate; display: flex; align-items: center; justify-content: center; min-height: 0;
          color: var(--s10-ink); overflow: visible; cursor: pointer;
        }
        .s10-aura { position: absolute; z-index: -2; left: 50%; top: 46%; width: 760px; height: 420px; margin: -210px 0 0 -380px; border-radius: 50%; filter: blur(130px); opacity: .26; pointer-events: none; }
        .s10-spot { position: absolute; z-index: -1; inset: -40px; pointer-events: none; }

        .s10-hero { perspective: 1500px; perspective-origin: 50% 40%; }
        .s10-group { display: flex; flex-direction: column; align-items: center; gap: 22px; transform-style: preserve-3d; }

        /* Título em blocos 3D (extrusão rosa) */
        .s10-titlebox { position: relative; transform-style: preserve-3d; }
        .s10-title { position: relative; display: flex; margin: 0; font-size: 152px; font-weight: 900; line-height: 1.05; letter-spacing: -.05em; }
        .s10-letter { display: inline-block; cursor: default; backface-visibility: hidden;}
        .s10-glyph {
          display: inline-block; color: #fff0f5; animation: s10-wave 4.4s ease-in-out infinite; animation-delay: calc(var(--i) * -.38s);
          text-shadow:
            0 1px 0 #f2a1b8, 0 2px 0 #e98fa9, 0 3px 0 #de7f9c, 0 4px 0 #d3708f, 0 5px 0 #c76384,
            0 6px 0 #bb5678, 0 7px 0 #a94a6b, 0 8px 0 #96405d,
            0 14px 14px rgba(0,0,0,.4), 0 30px 50px rgba(217,112,143,.5);
        }
        .s10-glyph.is-bang {
          color: #fff6dc;
          text-shadow:
            0 1px 0 #ffd98a, 0 2px 0 #f7c970, 0 3px 0 #eebb5c, 0 4px 0 #e0aa4a, 0 5px 0 #cf983c,
            0 6px 0 #bc852f, 0 7px 0 #a47227, 0 8px 0 #8b5f20,
            0 14px 14px rgba(0,0,0,.4), 0 30px 50px rgba(255,217,138,.5);
        }
        @keyframes s10-wave { 50% { transform: translateY(-9px) rotate(-1.2deg); } }

        /* Órbita: o centro fica no meio do título */
        .s10-orbit { position: absolute; left: 50%; top: 50%; width: 0; height: 0; transform-style: preserve-3d; }
        .s10-orb {
          position: absolute; left: -36px; top: -36px; display: grid; place-items: center; width: 72px; height: 72px; border-radius: 50%;
          border: 1px solid color-mix(in srgb, var(--c) 55%, rgba(255,255,255,.2));
          background:
            radial-gradient(circle at 32% 26%, rgba(255,255,255,.6) 0, rgba(255,255,255,.12) 18%, transparent 42%),
            linear-gradient(150deg, color-mix(in srgb, var(--c) 50%, #1a1217), color-mix(in srgb, var(--c) 14%, #0f0a0d));
          box-shadow: inset 0 -6px 12px rgba(0,0,0,.35), inset 0 2px 3px rgba(255,255,255,.5), 0 14px 30px -6px var(--c);
        }
        .s10-orb img { display: block; width: 38px; height: 38px; object-fit: contain; filter: drop-shadow(0 4px 6px rgba(0,0,0,.45)); pointer-events: none; }

        /* Texto e chips */
        .s10-lead { margin: 6px 0 0; font-size: 22px; font-weight: 500; letter-spacing: -.01em; color: var(--s10-muted); text-align: center; }
        .s10-chips { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 12px; }
        .s10-chip {
          position: relative; display: inline-flex; align-items: center; gap: 9px; overflow: hidden; padding: 11px 20px;
          border: 1px solid rgba(255,255,255,.16); border-radius: 999px;
          background: linear-gradient(160deg, rgba(255,255,255,.12), rgba(255,255,255,.03));
          backdrop-filter: blur(16px) saturate(1.4); -webkit-backdrop-filter: blur(16px) saturate(1.4);
          box-shadow: inset 0 1px 0 rgba(255,255,255,.28), 0 12px 28px rgba(0,0,0,.28), 0 22px 44px -18px rgba(0,0,0,.5);
          color: var(--s10-ink); font-size: 15px; font-weight: 650; transition: border-color .3s, box-shadow .3s;
        }
        .s10-chip:hover { border-color: rgba(240,169,191,.6); box-shadow: inset 0 1px 0 rgba(255,255,255,.35), 0 16px 34px rgba(0,0,0,.3), 0 26px 50px -16px rgba(240,169,191,.6); }
        .s10-brand { color: #fff; font-size: 17px; font-weight: 800; border-color: rgba(240,169,191,.5); background: linear-gradient(160deg, rgba(240,169,191,.34), rgba(217,112,143,.1)); }
        .s10-brand i { color: #ffd98a; font-style: normal; text-shadow: 0 0 12px #ffd98a; }
        .s10-brand::after {
          content: ''; position: absolute; inset: 0; transform: translateX(-120%); pointer-events: none;
          background: linear-gradient(100deg, transparent 30%, rgba(255,255,255,.35) 50%, transparent 70%); animation: s10-sweep 4.5s ease-in-out infinite 2s;
        }
        @keyframes s10-sweep { 0%, 55% { transform: translateX(-120%); } 100% { transform: translateX(120%); } }

        .s10-hint { position: absolute; left: 0; right: 0; bottom: 4px; text-align: center; font-size: 12px; color: rgba(183,170,178,.7); animation: s10-blink 2.6s ease-in-out infinite; pointer-events: none; }
        @keyframes s10-blink { 50% { opacity: .35; } }

        /* Confete */
        .s10-burst { position: absolute; z-index: 5; width: 0; height: 0; pointer-events: none; }
        .s10-bit { position: absolute; left: 0; top: 0; display: block; will-change: transform; }

        @media (prefers-reduced-motion: reduce) {
          .s10-glyph, .s10-brand::after, .s10-hint { animation: none; }
        }
      `}</style>
    </section>
  );
}

export default S10;
