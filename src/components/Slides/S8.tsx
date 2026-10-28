import {
  AnimatePresence,
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
  type ReactNode,
} from 'react';
import Eyebrow from '../Eyebrow';

const crownImg = '/imgs/crown.png';

/* O caminho: cada passo acende um degrau do pódio (do 3º ao 1º lugar). */
const steps = [
  { title: 'Beta fechado', desc: 'Convidar colegas e conhecidas que querem aprender manicure', color: '#7ef0c3' },
  { title: 'Ouvir', desc: 'Formulário curto para saber o que travou e o que ajudou', color: '#8ec5ff' },
  { title: 'Ajustar e abrir', desc: 'Melhorar o site e chegar à primeira formada no Hall da Fama', color: '#f0a9bf' },
];

/* Ordem visual do pódio: 2º, 1º, 3º. "step" = passo que acende o degrau. */
const pillars = [
  { place: 2, height: 124, color: '#8ec5ff', step: 1 },
  { place: 1, height: 172, color: '#f0a9bf', step: 2 },
  { place: 3, height: 92, color: '#7ef0c3', step: 0 },
];

const goals = [
  { value: '20', count: 20, label: 'primeiras usuárias', color: '#f0a9bf' },
  { value: '1', label: 'aula concluída por usuária', color: '#8ec5ff' },
  { value: '1º', label: 'certificado emitido', color: '#ffd98a' },
];

const channels = ['Instagram', 'WhatsApp', 'Parcerias com salões e escolas'];

const AUTOPLAY_MS = 3600;
const vars = (o: Record<string, string | number>) => o as CSSProperties;

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
    const controls = animate(mv, to, { duration: 1.6, delay: 1.1, ease: [0.22, 1, 0.36, 1] });
    return () => controls.stop();
  }, [to, reduced, mv]);

  return <motion.span>{text}</motion.span>;
}

/** Meta do beta: vidro com inclinação 3D e brilho que segue o mouse. */
function GoalTile({ goal, index }: { goal: (typeof goals)[number]; index: number }) {
  const reduced = !!useReducedMotion();
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, { stiffness: 160, damping: 20, mass: 0.6 });
  const sy = useSpring(py, { stiffness: 160, damping: 20, mass: 0.6 });
  const rotateY = useTransform(sx, [0, 1], [-9, 9]);
  const rotateX = useTransform(sy, [0, 1], [9, -9]);
  const gx = useTransform(sx, (v) => `${v * 100}%`);
  const gy = useTransform(sy, (v) => `${v * 100}%`);
  const glare = useMotionTemplate`radial-gradient(220px circle at ${gx} ${gy}, rgba(255,255,255,.22), transparent 62%)`;

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
      className="s8-goal-cell"
      initial={reduced ? false : { opacity: 0, y: 30, rotateX: 18 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ type: 'spring', stiffness: 70, damping: 16, delay: 0.9 + index * 0.1 }}
      style={{ transformPerspective: 1000 }}
    >
      <motion.article
        className="s8-goal"
        style={{
          ...vars({ '--c': goal.color }),
          rotateX: reduced ? 0 : rotateX,
          rotateY: reduced ? 0 : rotateY,
          transformPerspective: 1000,
        }}
        whileHover={reduced ? undefined : { y: -5, scale: 1.03 }}
        transition={{ type: 'spring', stiffness: 220, damping: 20 }}
        onPointerMove={onMove}
        onPointerLeave={reset}
      >
        <motion.span className="s8-glare" style={{ background: glare }} aria-hidden="true" />
        <span className="s8-goal-value">{goal.count ? <CountUp to={goal.count} /> : goal.value}</span>
        <span className="s8-goal-label">{goal.label}</span>
      </motion.article>
    </motion.div>
  );
}

interface BoxProps {
  width: number | string;
  height: number;
  depth: number;
  color: string;
  lit?: boolean;
  delay?: number;
  className?: string;
  onHover?: () => void;
  children?: ReactNode;
}

/** Caixa 3D de vidro: frente, topo e lateral. A altura cresce na entrada. */
function Box({ width, height, depth, color, lit, delay = 0, className = '', onHover, children }: BoxProps) {
  const reduced = !!useReducedMotion();
  return (
    <motion.div
      className={`s8-box ${className}${lit ? ' is-lit' : ''}`}
      style={vars({ width, '--c': color, '--d': `${depth}px` })}
      initial={reduced ? { height } : { height: 0 }}
      animate={{ height }}
      transition={{ delay, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      whileHover={reduced || !onHover ? undefined : { z: 26 }}
      onPointerEnter={onHover}
    >
      <span className="s8-face s8-front">{children}</span>
      <span className="s8-face s8-top" />
      <span className="s8-face s8-side" />
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Slide 8                                                            */
/* ------------------------------------------------------------------ */

function S8() {
  const reduced = !!useReducedMotion();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const landed = active === steps.length - 1;
  const current = steps[active];

  // A história se conta sozinha: 3º → 2º → 1º lugar. Pausa quando a pessoa interage.
  useEffect(() => {
    if (reduced || paused) return;
    const t = setTimeout(() => setActive((a) => (a + 1) % steps.length), AUTOPLAY_MS);
    return () => clearTimeout(t);
  }, [active, paused, reduced]);

  const clearHover = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
  };
  const intent = (i: number) => {
    clearHover();
    hoverTimer.current = setTimeout(() => setActive(i), 70);
  };
  useEffect(() => clearHover, []);

  // pódio gira com o mouse
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 70, damping: 18 });
  const sy = useSpring(my, { stiffness: 70, damping: 18 });
  const rotateY = useTransform(sx, [-0.5, 0.5], [-36, -4]);
  const rotateX = useTransform(sy, [-0.5, 0.5], [-8, -24]);

  const onStageMove = (e: ReactPointerEvent<HTMLElement>) => {
    if (reduced || e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onStageLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <section className="s8-section" aria-labelledby="s8-title">
      <header className="s8-heading">
        <Eyebrow>Próximo passo</Eyebrow>
        <motion.h2
          id="s8-title"
          initial={reduced ? false : { opacity: 0, y: 16, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          Nosso 1º lugar <span>ainda está livre</span>
        </motion.h2>
      </header>

      <div
        className="s8-main"
        onPointerEnter={() => setPaused(true)}
        onPointerLeave={() => {
          clearHover();
          setPaused(false);
        }}
      >
        {/* Pódio 3D */}
        <motion.div
          className="s8-stage"
          initial={reduced ? false : { opacity: 0, y: 40, rotateX: 14 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ type: 'spring', stiffness: 70, damping: 16, delay: 0.15 }}
          style={{ transformPerspective: 1400 }}
          onPointerMove={onStageMove}
          onPointerLeave={onStageLeave}
        >
          <motion.span
            className="s8-glow"
            aria-hidden="true"
            animate={{ backgroundColor: current.color }}
            transition={{ duration: 0.9 }}
          />
          <motion.span
            className="s8-beam"
            aria-hidden="true"
            animate={{ opacity: landed ? 1 : 0.5 }}
            transition={{ duration: 0.9 }}
          />

          <div className="s8-label-wrap">
            <AnimatePresence mode="wait">
              <motion.span
                key={landed ? 'hall' : 'free'}
                className={`s8-label${landed ? ' is-hall' : ''}`}
                initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -10, filter: 'blur(6px)' }}
                transition={{ duration: 0.35 }}
              >
                <i aria-hidden="true" />
                {landed ? 'Hall da Fama' : '1º lugar disponível'}
              </motion.span>
            </AnimatePresence>
          </div>

          <div className="s8-scene">
            <motion.div className="s8-group" style={{ rotateX: reduced ? -14 : rotateX, rotateY: reduced ? -20 : rotateY }}>
              <div className="s8-base-wrap">
                <Box width="100%" height={14} depth={190} color="#ffffff" delay={0.1} className="s8-base" />
              </div>

              <div className="s8-row">
                {pillars.map((p, i) => (
                  <Box
                    key={p.place}
                    width={112}
                    height={p.height}
                    depth={120}
                    color={p.color}
                    lit={active >= p.step}
                    delay={0.35 + i * 0.18}
                    className="s8-pillar"
                    onHover={() => intent(p.step)}
                  >
                    <span className="s8-num">{p.place}</span>

                    {p.place === 1 && (
                      <motion.span
                        className="s8-crown"
                        style={{ x: '-50%', z: -56 }}
                        initial={reduced ? false : { opacity: 0, y: -60, scale: 0.5, rotate: -15 }}
                        animate={
                          landed
                            ? { opacity: 1, y: 12, scale: 1.14, rotate: 0 }
                            : reduced
                              ? { opacity: 1, y: 0, scale: 1, rotate: 0 }
                              : { opacity: 1, y: [0, -10, 0], scale: 1, rotate: [-4, 4, -4] }
                        }
                        transition={
                          landed
                            ? { type: 'spring', stiffness: 120, damping: 12 }
                            : { delay: 1.1, duration: 3.6, repeat: Infinity, ease: 'easeInOut' }
                        }
                      >
                        <img src={crownImg} alt="Coroa de 1º lugar" draggable={false} />
                      </motion.span>
                    )}
                  </Box>
                ))}
              </div>
            </motion.div>
          </div>

          <span className="s8-hint">Passe o mouse nos degraus e gire o pódio</span>
        </motion.div>

        {/* Caminho */}
        <div className="s8-path">
          <motion.h3
            initial={reduced ? false : { opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Caminho para a primeira formada
          </motion.h3>

          <ol className="s8-steps">
            {steps.map((step, i) => {
              const on = active === i;
              const done = i < active;
              return (
                <motion.li
                  key={step.title}
                  className={`s8-step${on ? ' is-active' : ''}${done ? ' is-done' : ''}`}
                  style={vars({ '--c': step.color })}
                  initial={reduced ? false : { opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.55 + i * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  onPointerEnter={(e) => e.pointerType === 'mouse' && intent(i)}
                  onClick={() => setActive(i)}
                >
                  <button type="button" className="s8-step-btn" aria-expanded={on} onFocus={() => setActive(i)}>
                    <span className="s8-coin" aria-hidden="true">
                      {done ? '✓' : i + 1}
                    </span>
                    <span className="s8-step-main">
                      <span className="s8-step-title">{step.title}</span>
                      <span className="s8-step-desc">
                        <span>{step.desc}</span>
                      </span>
                    </span>
                  </button>

                  {i < steps.length - 1 && (
                    <span className="s8-seg" aria-hidden="true">
                      <motion.span
                        className="s8-seg-fill"
                        style={{ background: `linear-gradient(180deg, ${step.color}, ${steps[i + 1].color})` }}
                        initial={false}
                        animate={{ scaleY: done ? 1 : 0 }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                      />
                    </span>
                  )}
                  {on && !paused && !reduced && <span key={active} className="s8-timer" aria-hidden="true" />}
                </motion.li>
              );
            })}
          </ol>
        </div>
      </div>

      {/* Metas do beta */}
      <div className="s8-goals">
        <span className="s8-goals-title">Metas do beta</span>
        <div className="s8-goals-grid">
          {goals.map((g, i) => (
            <GoalTile key={g.label} goal={g} index={i} />
          ))}
        </div>
      </div>

      {/* Canais */}
      <motion.div
        className="s8-channels"
        initial={reduced ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.6 }}
      >
        <span className="s8-channels-title">Canais</span>
        {channels.map((c) => (
          <span key={c} className="s8-chip">
            <i aria-hidden="true" />
            {c}
          </span>
        ))}
      </motion.div>

      <style>{`
        @property --s8-unused { syntax: '<number>'; inherits: false; initial-value: 0; }
        .s8-section {
          --s8-ink: var(--text, #f7f1f4);
          --s8-muted: var(--muted, #b7aab2);
          --s8-ease: cubic-bezier(.22,1,.36,1);
          position: absolute; inset: var(--slot-top, 16px) var(--slot-x, 76px) var(--slot-bottom, 60px);
          isolation: isolate; display: flex; flex-direction: column; justify-content: center; gap: 12px; min-height: 0;
          color: var(--s8-ink); overflow: visible;
        }
        .s8-section button { font: inherit; cursor: pointer; }
        .s8-section button:focus-visible { outline: 2px solid var(--c, #f0a9bf); outline-offset: 3px; }

        /* Título */
        .s8-heading { flex: 0 0 auto; text-align: center; }
        .s8-heading h2 { margin: 6px 0 0; font-size: clamp(28px, 3.2vw, 42px); font-weight: 800; letter-spacing: -.05em; line-height: 1.1; text-wrap: balance; }
        .s8-heading h2 span {
          background: linear-gradient(100deg, #ffd0de 10%, #f0a9bf 40%, #d9708f 60%, #ffd0de 90%); background-size: 220% 100%;
          -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; animation: s8-shine 6s linear infinite;
        }
        @keyframes s8-shine { to { background-position: -220% 0; } }

        .s8-main { flex: 0 1 330px; min-height: 0; display: grid; grid-template-columns: minmax(0, 1.02fr) minmax(0, .98fr); gap: 26px; }

        /* Palco do pódio */
        .s8-stage {
          position: relative; min-width: 0; min-height: 0; overflow: hidden; border: 1px solid rgba(255,255,255,.14); border-radius: 28px;
          background: linear-gradient(160deg, rgba(255,255,255,.09), rgba(255,255,255,.02) 55%, rgba(255,255,255,.05));
          backdrop-filter: blur(18px) saturate(1.4); -webkit-backdrop-filter: blur(18px) saturate(1.4);
          box-shadow: inset 0 1px 0 rgba(255,255,255,.26), inset 0 -1px 0 rgba(0,0,0,.2), 0 16px 40px rgba(0,0,0,.32), 0 40px 90px -30px rgba(0,0,0,.6);
        }
        .s8-glow { position: absolute; left: 50%; bottom: -60px; width: 520px; height: 260px; margin-left: -260px; border-radius: 50%; filter: blur(70px); opacity: .34; pointer-events: none; }
        .s8-beam {
          position: absolute; z-index: 0; left: 50%; top: 0; bottom: 70px; width: 270px; margin-left: -135px; pointer-events: none;
          background: linear-gradient(180deg, rgba(255,217,138,.55), rgba(240,169,191,.14) 70%, transparent);
          clip-path: polygon(40% 0, 60% 0, 100% 100%, 0 100%); filter: blur(7px); mix-blend-mode: screen;
        }
        .s8-label-wrap { position: absolute; z-index: 4; top: 16px; left: 0; right: 0; display: flex; justify-content: center; }
        .s8-label {
          display: inline-flex; align-items: center; gap: 9px; padding: 8px 16px; border: 1px solid rgba(255,255,255,.22); border-radius: 999px;
          background: rgba(15,10,14,.55); backdrop-filter: blur(12px); font-size: 13px; font-weight: 750;
          background-image: linear-gradient(90deg, rgba(240,169,191,.25), rgba(255,217,138,.2));
          box-shadow: inset 0 1px 0 rgba(255,255,255,.3), 0 10px 24px -8px rgba(240,169,191,.6);
        }
        .s8-label i { width: 8px; height: 8px; border-radius: 50%; background: #f0a9bf; box-shadow: 0 0 12px #f0a9bf; animation: s8-blink 1.8s ease-in-out infinite; }
        .s8-label.is-hall i { background: #ffd98a; box-shadow: 0 0 14px #ffd98a; }
        @keyframes s8-blink { 50% { opacity: .45; } }
        .s8-hint { position: absolute; z-index: 4; left: 0; right: 0; bottom: 12px; text-align: center; color: rgba(183,170,178,.75); font-size: 11px; }

        /* Cena 3D */
        .s8-scene { position: absolute; inset: 0; z-index: 1; display: grid; place-items: end center; padding-bottom: 46px; perspective: 1300px; perspective-origin: 50% 28%; }
        .s8-group { position: relative; width: 380px; height: 250px; transform-style: preserve-3d; transform-origin: 50% 85%; }
        .s8-base-wrap { position: absolute; left: -34px; right: -34px; bottom: 0; height: 14px; transform-style: preserve-3d; }
        .s8-row { position: absolute; left: 0; right: 0; bottom: 14px; display: flex; align-items: flex-end; justify-content: center; gap: 8px; transform-style: preserve-3d; transform: translateZ(-24px); }

        .s8-box { position: relative; flex: 0 0 auto; transform-style: preserve-3d; }
        .s8-base-wrap .s8-box { width: 100%; }
        .s8-face { position: absolute; display: block; }
        .s8-front {
          inset: 0; border: 1px solid rgba(255,255,255,.18); border-radius: 6px 6px 0 0;
          background: linear-gradient(170deg, rgba(255,255,255,.16), rgba(255,255,255,.04));
          box-shadow: inset 0 1px 0 rgba(255,255,255,.4), 0 0 0 transparent; transition: box-shadow .9s var(--s8-ease), border-color .9s;
        }
        .s8-top {
          left: 0; top: 0; width: 100%; height: var(--d); transform-origin: top; transform: rotateX(-90deg);
          border: 1px solid rgba(255,255,255,.2); background: linear-gradient(180deg, rgba(255,255,255,.3), rgba(255,255,255,.1));
        }
        .s8-side {
          right: 0; top: 0; width: var(--d); height: 100%; transform-origin: right; transform: rotateY(-90deg);
          border: 1px solid rgba(255,255,255,.12); background: linear-gradient(90deg, rgba(255,255,255,.04), rgba(0,0,0,.28));
        }
        /* camada colorida que "acende" o degrau */
        .s8-face::after { content: ''; position: absolute; inset: 0; opacity: 0; transition: opacity .9s var(--s8-ease); pointer-events: none; }
        .s8-front::after { background: linear-gradient(170deg, color-mix(in srgb, var(--c) 62%, transparent), color-mix(in srgb, var(--c) 16%, transparent)); border-radius: inherit; }
        .s8-top::after { background: linear-gradient(180deg, color-mix(in srgb, var(--c) 80%, #fff 10%), color-mix(in srgb, var(--c) 40%, transparent)); }
        .s8-side::after { background: linear-gradient(90deg, color-mix(in srgb, var(--c) 30%, transparent), color-mix(in srgb, var(--c) 55%, #000)); }
        .s8-box.is-lit .s8-face::after { opacity: 1; }
        .s8-box.is-lit .s8-front { border-color: color-mix(in srgb, var(--c) 75%, transparent); box-shadow: inset 0 1px 0 rgba(255,255,255,.55), 0 0 46px color-mix(in srgb, var(--c) 60%, transparent); }

        .s8-base .s8-front { border-radius: 4px; background: linear-gradient(170deg, rgba(255,255,255,.2), rgba(255,255,255,.06)); }
        .s8-pillar { cursor: pointer; }
        .s8-num {
          position: absolute; left: 0; right: 0; bottom: 12px; z-index: 2; text-align: center; font-size: 46px; font-weight: 850; line-height: 1; letter-spacing: -.04em;
          color: rgba(255,255,255,.4); text-shadow: 0 2px 10px rgba(0,0,0,.35); transition: color .9s var(--s8-ease), text-shadow .9s;
        }
        .s8-box.is-lit .s8-num { color: #fff; text-shadow: 0 0 22px var(--c), 0 2px 8px rgba(0,0,0,.4); }
        .s8-crown { position: absolute; left: 50%; bottom: 100%; z-index: 3; display: block; width: 62px; height: 62px; margin-bottom: 4px; }
        .s8-crown img { display: block; width: 100%; height: 100%; object-fit: contain; filter: drop-shadow(0 0 18px rgba(255,217,138,.8)) drop-shadow(0 10px 10px rgba(0,0,0,.4)); }

        /* Caminho */
        .s8-path { display: flex; min-width: 0; min-height: 0; flex-direction: column; justify-content: center; gap: 14px; }
        .s8-path h3 { margin: 0; color: #f0a9bf; font-size: 21px; font-weight: 800; letter-spacing: -.03em; }
        .s8-steps { display: grid; gap: 10px; margin: 0; padding: 0; list-style: none; perspective: 1100px; }
        .s8-step {
          position: relative; border: 1px solid rgba(255,255,255,.12); border-radius: 20px;
          background: linear-gradient(160deg, rgba(255,255,255,.08), rgba(255,255,255,.02) 60%, rgba(255,255,255,.04));
          backdrop-filter: blur(16px) saturate(1.3); -webkit-backdrop-filter: blur(16px) saturate(1.3);
          box-shadow: inset 0 1px 0 rgba(255,255,255,.2), 0 10px 26px rgba(0,0,0,.26);
          transform-origin: left center; opacity: .72;
          transition: transform .8s var(--s8-ease), opacity .6s, border-color .6s, box-shadow .8s, background .6s;
        }
        .s8-step:not(.is-active) { transform: rotateY(-9deg) translateX(8px) scale(.97); }
        .s8-step:not(.is-active):hover { border-color: color-mix(in srgb, var(--c) 55%, transparent); opacity: .95; }
        .s8-step.is-done { opacity: .88; }
        .s8-step.is-active {
          opacity: 1; border-color: color-mix(in srgb, var(--c) 75%, transparent);
          background: linear-gradient(160deg, color-mix(in srgb, var(--c) 24%, transparent), rgba(255,255,255,.03) 62%, rgba(255,255,255,.05));
          box-shadow: inset 0 1px 0 rgba(255,255,255,.35), 0 18px 44px rgba(0,0,0,.34), 0 36px 80px -26px var(--c);
        }
        .s8-step-btn { display: flex; width: 100%; align-items: flex-start; gap: 14px; padding: 14px 18px; border: 0; background: transparent; color: inherit; text-align: left; border-radius: inherit; }
        .s8-coin {
          position: relative; z-index: 1; display: grid; flex: 0 0 38px; place-items: center; width: 38px; height: 38px; border-radius: 12px;
          border: 1px solid rgba(255,255,255,.2); color: var(--s8-muted); font-size: 16px; font-weight: 800;
          background: linear-gradient(150deg, rgba(255,255,255,.2), rgba(255,255,255,.05));
          box-shadow: inset 0 1px 0 rgba(255,255,255,.4), 0 8px 14px -6px rgba(0,0,0,.5);
          transition: background .6s, color .6s, box-shadow .6s, transform .5s var(--s8-ease);
        }
        .s8-step.is-active .s8-coin, .s8-step.is-done .s8-coin {
          color: #fff; text-shadow: 0 1px 3px rgba(0,0,0,.4);
          background: radial-gradient(circle at 30% 24%, rgba(255,255,255,.55), transparent 42%), linear-gradient(150deg, var(--c), color-mix(in srgb, var(--c) 50%, #000));
          box-shadow: inset 0 1px 0 rgba(255,255,255,.6), 0 12px 22px -6px var(--c);
        }
        .s8-step.is-active .s8-coin { transform: scale(1.1); }
        .s8-step-main { display: grid; min-width: 0; }
        .s8-step-title { align-self: center; min-height: 38px; display: flex; align-items: center; font-size: 17px; font-weight: 700; color: #fff; letter-spacing: -.02em; }
        .s8-step-desc { display: grid; grid-template-rows: 0fr; transition: grid-template-rows .6s var(--s8-ease); color: var(--s8-muted); font-size: 14px; line-height: 1.5; }
        .s8-step-desc > span { overflow: hidden; opacity: 0; transition: opacity .5s; }
        .s8-step.is-active .s8-step-desc { grid-template-rows: 1fr; }
        .s8-step.is-active .s8-step-desc > span { opacity: 1; transition-delay: .2s; padding-bottom: 2px; }
        .s8-seg { position: absolute; z-index: 0; left: 36px; top: 54px; bottom: -24px; width: 3px; overflow: hidden; border-radius: 3px; background: rgba(255,255,255,.1); }
        .s8-seg-fill { display: block; width: 100%; height: 100%; transform-origin: top; }
        .s8-timer { position: absolute; left: 20px; right: 20px; bottom: 0; height: 2px; border-radius: 2px; transform-origin: left; background: var(--c); opacity: .85; animation: s8-timer ${AUTOPLAY_MS}ms linear forwards; }
        @keyframes s8-timer { from { transform: scaleX(0); } to { transform: scaleX(1); } }

        /* Metas */
        .s8-goals { flex: 0 0 auto; display: flex; align-items: center; gap: 16px; }
        .s8-goals-title { flex: 0 0 auto; width: 92px; color: #f0a9bf; font-size: 12px; font-weight: 850; letter-spacing: .14em; text-transform: uppercase; line-height: 1.4; }
        .s8-goals-grid { flex: 1; min-width: 0; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }
        .s8-goal-cell { display: flex; min-width: 0; }
        .s8-goal {
          position: relative; display: flex; flex: 1; align-items: center; gap: 14px; min-width: 0; padding: 12px 18px; overflow: hidden;
          border: 1px solid rgba(255,255,255,.12); border-radius: 18px;
          background: linear-gradient(160deg, rgba(255,255,255,.09), rgba(255,255,255,.02) 60%, rgba(255,255,255,.04));
          backdrop-filter: blur(16px) saturate(1.3); -webkit-backdrop-filter: blur(16px) saturate(1.3);
          box-shadow: inset 0 1px 0 rgba(255,255,255,.22), 0 10px 26px rgba(0,0,0,.26);
          transition: border-color .4s, box-shadow .4s; will-change: transform;
        }
        .s8-goal:hover { border-color: color-mix(in srgb, var(--c) 60%, transparent); box-shadow: inset 0 1px 0 rgba(255,255,255,.3), 0 16px 34px rgba(0,0,0,.3), 0 26px 50px -20px var(--c); }
        .s8-glare { position: absolute; inset: 0; z-index: 3; border-radius: inherit; pointer-events: none; opacity: 0; transition: opacity .35s; }
        .s8-goal:hover .s8-glare { opacity: 1; }
        .s8-goal-value { flex: 0 0 auto; min-width: 44px; font-size: 38px; font-weight: 850; line-height: 1; letter-spacing: -.045em; font-variant-numeric: tabular-nums; color: var(--c); filter: brightness(1.15); }
        .s8-goal-label { font-size: 13px; font-weight: 600; line-height: 1.35; color: var(--s8-ink); }

        /* Canais */
        .s8-channels { flex: 0 0 auto; display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 10px; }
        .s8-channels-title { margin-right: 4px; color: var(--s8-muted); font-size: 11px; font-weight: 850; letter-spacing: .14em; text-transform: uppercase; }
        .s8-chip {
          display: inline-flex; align-items: center; gap: 9px; padding: 8px 16px; border: 1px solid rgba(255,255,255,.14); border-radius: 999px;
          background: linear-gradient(160deg, rgba(255,255,255,.1), rgba(255,255,255,.03)); backdrop-filter: blur(14px);
          box-shadow: inset 0 1px 0 rgba(255,255,255,.22), 0 8px 20px rgba(0,0,0,.22); color: var(--s8-ink); font-size: 13px; font-weight: 600;
          transition: transform .3s var(--s8-ease), border-color .3s;
        }
        .s8-chip:hover { transform: translateY(-2px); border-color: rgba(240,169,191,.5); }
        .s8-chip i { width: 7px; height: 7px; border-radius: 50%; background: #f0a9bf; box-shadow: 0 0 10px #f0a9bf; }

        @media (prefers-reduced-motion: reduce) {
          .s8-heading h2 span, .s8-label i { animation: none; }
          .s8-timer { display: none; }
          .s8-step, .s8-step-desc, .s8-coin, .s8-face::after, .s8-front, .s8-num, .s8-goal, .s8-chip { transition: none; }
          .s8-step:not(.is-active) { transform: none; }
        }
      `}</style>
    </section>
  );
}

export default S8;
