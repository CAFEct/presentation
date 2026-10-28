import {
  AnimatePresence,
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type Variants,
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
const priceImg = '/imgs/money.png';
const rocketImg = '/imgs/rocket.png';

const kits = [
  {
    name: 'Iniciante',
    title: 'Kit Iniciante',
    eyebrow: 'SEU PRIMEIRO PASSO',
    idealFor: 'Quem está começando e quer apenas o essencial para atender.',
    price: 'R$ 189,90',
    numericPrice: 189.9,
    color: '#68C9A7',
    tint: 'rgba(104, 201, 167, 0.14)',
    image: '/produtos/kits/kit_iniciante.jpg',
    description:
      'O essencial para começar sua jornada na manicure com mais praticidade e confiança.',
    items: ['Esmaltes básicos', 'Base e top coat', 'Cortador de cutículas', 'Lixa de unha'],
  },
  {
    name: 'Profissional',
    title: 'Kit Profissional',
    eyebrow: 'PARA IR MAIS LONGE',
    idealFor: 'Quem quer mais variedade de cores e ferramentas na rotina de trabalho.',
    price: 'R$ 349,90',
    numericPrice: 349.9,
    color: '#82B9F5',
    tint: 'rgba(130, 185, 245, 0.15)',
    image: '/produtos/kits/kit_profissional.jpg',
    description:
      'Uma seleção mais completa para ampliar suas possibilidades e elevar sua rotina de trabalho.',
    items: ['Tudo do Kit Iniciante', 'Esmaltes coloridos', 'Ferramentas premium', 'Guia completo'],
  },
  {
    name: 'Cabine LED',
    title: 'Kit Cabine LED',
    eyebrow: 'UMA EXPERIÊNCIA COMPLETA',
    idealFor: 'Quem quer sair com tudo, inclusive a cabine LED, sem comprar nada à parte.',
    price: 'R$ 429,90',
    numericPrice: 429.9,
    color: '#EAC16C',
    tint: 'rgba(234, 193, 108, 0.16)',
    image: '/produtos/kits/kit_cabine.jpg',
    description:
      'Uma opção ampliada que reúne os itens do kit profissional e uma cabine LED.',
    items: ['Tudo do Kit Profissional', 'Lâmpada LED', 'Terminal de cobre', 'Suporte'],
  },
] as const;

const benefits = [
  { icon: trophyImg, title: 'Seleção cuidadosa', description: 'Combinações pensadas para sua rotina.' },
  { icon: priceImg, title: 'Opções para seu bolso', description: 'Escolha o kit ideal para seu momento.' },
  { icon: rocketImg, title: 'Entrega rápida', description: 'Receba seus produtos sem complicação.' },
];

const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const kitStyle = (k: { color: string; tint: string }) =>
  ({ '--kit-color': k.color, '--kit-tint': k.tint }) as CSSProperties;

/* ------------------------------------------------------------------ */
/*  Peças pequenas                                                     */
/* ------------------------------------------------------------------ */

/** Preço que "conta" até o novo valor ao trocar de kit. */
function AnimatedPrice({ value }: { value: number }) {
  const reduced = useReducedMotion();
  const mv = useMotionValue(value);
  const text = useTransform(mv, (v) => brl.format(v));

  useEffect(() => {
    if (reduced) {
      mv.set(value);
      return;
    }
    const controls = animate(mv, value, { duration: 0.7, ease: [0.22, 1, 0.36, 1] });
    return () => controls.stop();
  }, [value, reduced, mv]);

  return <motion.span className="s4-price">{text}</motion.span>;
}

/** Barrinhas que mostram o "nível" do kit (1 a 3). */
function Tier({ level }: { level: number }) {
  return (
    <span className="s4-tier" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <span key={i} className={i <= level ? 'is-on' : ''} />
      ))}
    </span>
  );
}

const plateVariants: Variants = {
  enter: (d: number) => ({ opacity: 0, x: d * 48, scale: 0.95, filter: 'blur(8px)' }),
  center: { opacity: 1, x: 0, scale: 1, filter: 'blur(0px)' },
  exit: (d: number) => ({ opacity: 0, x: d * -48, scale: 0.95, filter: 'blur(8px)' }),
};

const detailVariants: Variants = {
  enter: (d: number) => ({ opacity: 0, x: d * 24 }),
  center: { opacity: 1, x: 0, transition: { duration: 0.3, ease: 'easeOut', staggerChildren: 0.05 } },
  exit: (d: number) => ({ opacity: 0, x: d * -16, transition: { duration: 0.18 } }),
};

const rowVariants: Variants = {
  enter: { opacity: 0, y: 8 },
  center: { opacity: 1, y: 0 },
};

/* ------------------------------------------------------------------ */
/*  Slide 4                                                            */
/* ------------------------------------------------------------------ */

function S4() {
  const reduced = !!useReducedMotion();
  const [selectedKit, setSelectedKit] = useState(0);
  const [imageFailed, setImageFailed] = useState(false);
  const direction = useRef<1 | -1>(1);
  const kit = kits[selectedKit];
  const previous = selectedKit > 0 ? kits[selectedKit - 1] : null;
  const diff = previous ? kit.numericPrice - previous.numericPrice : 0;

  // inclinação 3D suave da foto do produto
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, { stiffness: 140, damping: 20 });
  const sy = useSpring(py, { stiffness: 140, damping: 20 });
  const rotateY = useTransform(sx, [0, 1], [-7, 7]);
  const rotateX = useTransform(sy, [0, 1], [6, -6]);
  const gx = useTransform(sx, (v) => `${v * 100}%`);
  const gy = useTransform(sy, (v) => `${v * 100}%`);
  const glare = useMotionTemplate`radial-gradient(320px circle at ${gx} ${gy}, rgba(255,255,255,.55), transparent 60%)`;

  const onMove = (e: ReactPointerEvent<HTMLElement>) => {
    if (reduced || e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };
  const resetTilt = () => {
    px.set(0.5);
    py.set(0.5);
  };

  useEffect(() => setImageFailed(false), [selectedKit]);

  useEffect(() => {
    kits.forEach(({ image }) => {
      const img = new Image();
      img.src = image;
    });
  }, []);

  const selectKit = (index: number) => {
    direction.current = index >= selectedKit ? 1 : -1;
    setSelectedKit(index);
  };

  const dir = direction.current;

  return (
    <section className="s4-section" aria-labelledby="s4-title">
      <div className="s4-orbs" aria-hidden="true">
        <motion.span
          className="s4-orb s4-orb-a"
          animate={{ backgroundColor: kit.color }}
          transition={{ duration: 0.8 }}
        />
        <span className="s4-orb s4-orb-b" />
      </div>

      <div className="s4-shell">
        {/* Título */}
        <header className="s4-heading">
          <Eyebrow>Kits completos</Eyebrow>
          <motion.h2
            id="s4-title"
            initial={reduced ? false : { opacity: 0, y: 14, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            Qual kit combina com <span>o seu momento?</span>
          </motion.h2>
          <p>Compare os três kits: cada um inclui o anterior e acrescenta mais.</p>
        </header>

        {/* Seletor de kits (com preço visível para comparar) */}
        <div className="s4-kit-picker" role="tablist" aria-label="Escolha um kit">
          {kits.map((item, index) => {
            const active = selectedKit === index;
            return (
              <button
                key={item.name}
                type="button"
                role="tab"
                id={`s4-tab-${index}`}
                aria-selected={active}
                aria-controls="s4-kit-panel"
                tabIndex={active ? 0 : -1}
                className={`s4-kit-tab${active ? ' is-active' : ''}`}
                style={kitStyle(item)}
                onClick={() => selectKit(index)}
                onKeyDown={(event) => {
                  if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
                  event.preventDefault();
                  const step = event.key === 'ArrowRight' ? 1 : -1;
                  const next = (index + step + kits.length) % kits.length;
                  selectKit(next);
                  document.getElementById(`s4-tab-${next}`)?.focus();
                }}
              >
                {active && (
                  <motion.span
                    layoutId="s4-tab-pill"
                    className="s4-tab-pill"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                <Tier level={index} />
                <span className="s4-tab-copy">
                  <strong>{item.title}</strong>
                  <small>{item.eyebrow}</small>
                </span>
                <span className="s4-tab-price">{item.price}</span>
              </button>
            );
          })}
        </div>

        {/* Vitrine */}
        <div
          className="s4-showcase"
          id="s4-kit-panel"
          role="tabpanel"
          aria-labelledby={`s4-tab-${selectedKit}`}
          style={kitStyle(kit)}
        >
          <div className="s4-visual">
            <AnimatePresence mode="wait" custom={dir} initial={false}>
              <motion.div
                key={kit.image}
                className="s4-plate-motion"
                custom={dir}
                variants={plateVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
              >
                <motion.div
                  className="s4-plate"
                  style={{
                    rotateX: reduced ? 0 : rotateX,
                    rotateY: reduced ? 0 : rotateY,
                    transformPerspective: 1100,
                  }}
                  onPointerMove={onMove}
                  onPointerLeave={resetTilt}
                >
                  {!imageFailed ? (
                    <img
                      src={kit.image}
                      alt={`Conteúdo do ${kit.title}`}
                      className="s4-product-image"
                      draggable={false}
                      onError={() => setImageFailed(true)}
                    />
                  ) : (
                    <div className="s4-image-fallback">
                      <span className="s4-fallback-monogram">E</span>
                      <strong>{kit.title}</strong>
                      <span>Imagem do produto indisponível</span>
                    </div>
                  )}
                  <motion.span className="s4-glare" style={{ background: glare }} aria-hidden="true" />
                </motion.div>
              </motion.div>
            </AnimatePresence>
            <span className="s4-chip">
              <span className="s4-live-dot" />
              {kit.title}
            </span>
          </div>

          <div className="s4-details">
            <AnimatePresence mode="wait" custom={dir} initial={false}>
              <motion.div
                key={kit.name}
                className="s4-details-content"
                custom={dir}
                variants={detailVariants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                <motion.div variants={rowVariants} className="s4-product-kicker">
                  <span className="s4-product-kicker-line" />
                  {kit.eyebrow}
                </motion.div>

                <motion.h3 variants={rowVariants}>{kit.title}</motion.h3>
                <motion.p variants={rowVariants} className="s4-product-description">
                  {kit.description}
                </motion.p>

                <motion.p variants={rowVariants} className="s4-ideal">
                  <strong>Ideal para</strong>
                  {kit.idealFor}
                </motion.p>

                <motion.div variants={rowVariants} className="s4-price-block">
                  <div className="s4-price-line">
                    <AnimatedPrice value={kit.numericPrice} />
                    <span className="s4-price-badge">Kit completo</span>
                  </div>
                  <p className="s4-diff">
                    {previous ? (
                      <>
                        <b>+ {brl.format(diff)}</b> em relação ao {previous.title}
                      </>
                    ) : (
                      <>Menor investimento para começar</>
                    )}
                  </p>
                </motion.div>

                <motion.div variants={rowVariants} className="s4-includes-heading">
                  <strong>O que vem no kit</strong>
                  <span>{kit.items.length} itens</span>
                </motion.div>

                <ul className="s4-items">
                  {kit.items.map((item) => {
                    const inherited = item.startsWith('Tudo do');
                    return (
                      <motion.li
                        key={item}
                        variants={rowVariants}
                        className={inherited ? 's4-item is-inherited' : 's4-item'}
                      >
                        <span className="s4-item-check" aria-hidden="true">{inherited ? '+' : '✓'}</span>
                        <span>{item}</span>
                      </motion.li>
                    );
                  })}
                </ul>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Diferenciais, em uma linha compacta */}
        <motion.div
          className="s4-benefits"
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
        >
          {benefits.map((benefit) => (
            <article key={benefit.title} className="s4-benefit">
              <span className="s4-benefit-icon">
                <img src={benefit.icon} alt="" loading="lazy" />
              </span>
              <div className="s4-benefit-copy">
                <h4>{benefit.title}</h4>
                <p>{benefit.description}</p>
              </div>
            </article>
          ))}
        </motion.div>
      </div>

      <style>{`
        .s4-section {
          --s4-ink: var(--text, #f7f1f4);
          --s4-muted: var(--muted, #b7aab2);
          --s4-rose: var(--rose, #f0a9bf);
          --s4-line: rgba(255,255,255,.12);
          --s4-ease: cubic-bezier(.22,1,.36,1);
          position: absolute; inset: var(--slot-top, 16px) var(--slot-x, 76px) var(--slot-bottom, 60px);
          isolation: isolate; display: flex; flex-direction: column; align-items: center; min-height: 0;
          color: var(--s4-ink); overflow: hidden;
        }
        .s4-section button { font: inherit; cursor: pointer; }
        .s4-section button:focus-visible { outline: 2px solid var(--kit-color, var(--s4-rose)); outline-offset: 3px; }

        .s4-orbs { position: absolute; inset: 0; z-index: -1; pointer-events: none; }
        .s4-orb { position: absolute; border-radius: 50%; filter: blur(90px); }
        .s4-orb-a { top: 18%; left: 4%; width: 340px; height: 340px; opacity: .22; }
        .s4-orb-b { right: 2%; bottom: 6%; width: 320px; height: 320px; background: #C66B85; opacity: .2; }

        .s4-shell { display: flex; flex-direction: column; gap: 10px; width: min(1120px, 100%); height: 100%; min-height: 0; }

        /* Título */
        .s4-heading { flex: 0 0 auto; text-align: center; }
        .s4-heading h2 {
          margin: 6px 0 4px; font-size: clamp(24px, 2.8vw, 38px); font-weight: 800; letter-spacing: -.05em; line-height: 1.1; text-wrap: balance;
        }
        .s4-heading h2 span {
          background: linear-gradient(100deg, #ffd0de 10%, #f0a9bf 40%, #d9708f 60%, #ffd0de 90%);
          background-size: 220% 100%; -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;
          animation: s4-shine 6s linear infinite;
        }
        @keyframes s4-shine { to { background-position: -220% 0; } }
        .s4-heading > p { margin: 0 auto; max-width: 560px; color: var(--s4-muted); font-size: clamp(13px, 1.2vw, 15px); line-height: 1.55; }

        /* Seletor */
        .s4-kit-picker { flex: 0 0 auto; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; }
        .s4-kit-tab {
          position: relative; display: flex; min-width: 0; align-items: center; gap: 12px; padding: 11px 14px;
          border: 1px solid var(--s4-line); border-radius: 15px; text-align: left; color: var(--s4-ink);
          background: linear-gradient(155deg, rgba(255,255,255,.08), rgba(255,255,255,.02));
          backdrop-filter: blur(14px) saturate(1.3); -webkit-backdrop-filter: blur(14px) saturate(1.3);
          box-shadow: inset 0 1px 0 rgba(255,255,255,.18), 0 8px 22px rgba(0,0,0,.2);
          transition: transform .3s var(--s4-ease), border-color .3s, box-shadow .3s;
        }
        .s4-kit-tab:hover { transform: translateY(-2px); border-color: color-mix(in srgb, var(--kit-color) 60%, transparent); box-shadow: inset 0 1px 0 rgba(255,255,255,.25), 0 14px 30px -8px color-mix(in srgb, var(--kit-color) 45%, transparent); }
        .s4-kit-tab.is-active { border-color: color-mix(in srgb, var(--kit-color) 80%, transparent); }
        .s4-tab-pill {
          position: absolute; inset: 0; z-index: 0; border-radius: inherit;
          background: linear-gradient(135deg, color-mix(in srgb, var(--kit-color) 30%, transparent), rgba(255,255,255,.03));
          box-shadow: 0 12px 28px -12px var(--kit-color), inset 0 1px 0 rgba(255,255,255,.25);
        }
        .s4-kit-tab > :not(.s4-tab-pill) { position: relative; z-index: 1; }
        .s4-tier { display: flex; flex: 0 0 auto; align-items: flex-end; gap: 3px; height: 22px; }
        .s4-tier span { width: 5px; border-radius: 2px; background: rgba(255,255,255,.18); transition: background .3s; }
        .s4-tier span:nth-child(1) { height: 9px; } .s4-tier span:nth-child(2) { height: 15px; } .s4-tier span:nth-child(3) { height: 22px; }
        .s4-tier span.is-on { background: var(--kit-color); box-shadow: 0 0 10px color-mix(in srgb, var(--kit-color) 70%, transparent); }
        .s4-tab-copy { display: flex; min-width: 0; flex: 1; flex-direction: column; gap: 3px; }
        .s4-tab-copy strong { font-size: 14px; font-weight: 700; line-height: 1.2; }
        .s4-tab-copy small { color: var(--s4-muted); font-size: 9px; font-weight: 750; letter-spacing: .09em; line-height: 1.3; }
        .s4-tab-price { flex: 0 0 auto; color: var(--kit-color); font-size: 14px; font-weight: 800; font-variant-numeric: tabular-nums; filter: brightness(1.15); }

        /* Vitrine */
        .s4-showcase {
          flex: 1 1 auto; min-height: 0; container-type: size; container-name: s4; display: grid; grid-template-columns: minmax(0, .9fr) minmax(0, 1.1fr); gap: clamp(18px, 3vw, 36px);
          padding: clamp(14px, 2vw, 22px); border: 1px solid rgba(255,255,255,.14); border-radius: 24px;
          background: linear-gradient(155deg, rgba(255,255,255,.09), rgba(255,255,255,.025) 55%, rgba(255,255,255,.05));
          backdrop-filter: blur(18px) saturate(1.4); -webkit-backdrop-filter: blur(18px) saturate(1.4);
          box-shadow: inset 0 1px 0 rgba(255,255,255,.25), 0 14px 40px rgba(0,0,0,.3), 0 40px 90px -30px color-mix(in srgb, var(--kit-color) 55%, transparent);
          transition: box-shadow .6s;
        }

        .s4-visual {
          position: relative; isolation: isolate; display: flex; min-width: 0; min-height: 0;
          border-radius: 18px; background: radial-gradient(ellipse at 50% 50%, var(--kit-tint), transparent 70%), rgba(0,0,0,.16);
          border: 1px solid color-mix(in srgb, var(--kit-color) 22%, transparent);
        }
        .s4-plate-motion { display: flex; flex: 1; min-width: 0; min-height: 0; padding: 14px; perspective: 1100px; }
        /* "Placa" clara: o fundo branco da foto se mistura com ela, sem parecer um recorte */
        .s4-plate {
          position: relative; display: grid; flex: 1; place-items: center; min-width: 0; min-height: 0; overflow: hidden;
          border-radius: 16px; padding: 14px;
          background: linear-gradient(180deg, #ffffff 35%, color-mix(in srgb, var(--kit-color) 22%, #ffffff));
          box-shadow: inset 0 0 0 1px rgba(255,255,255,.6), 0 22px 44px -10px rgba(0,0,0,.5), 0 30px 60px -20px color-mix(in srgb, var(--kit-color) 60%, transparent);
          will-change: transform;
        }
        .s4-product-image { display: block; width: 100%; height: 100%; max-height: 100%; object-fit: contain; mix-blend-mode: multiply; }
        .s4-glare { position: absolute; inset: 0; border-radius: inherit; pointer-events: none; mix-blend-mode: soft-light; opacity: .9; }
        .s4-chip {
          position: absolute; z-index: 3; top: 24px; left: 24px; display: inline-flex; align-items: center; gap: 8px;
          padding: 6px 12px; border: 1px solid rgba(255,255,255,.2); border-radius: 999px;
          background: rgba(15,10,14,.72); backdrop-filter: blur(10px); color: #fff; font-size: 11px; font-weight: 700;
          box-shadow: 0 8px 20px rgba(0,0,0,.35);
        }
        .s4-live-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--kit-color); box-shadow: 0 0 12px var(--kit-color); animation: s4-blink 2s ease-in-out infinite; }
        @keyframes s4-blink { 50% { opacity: .55; } }
        .s4-image-fallback { display: flex; flex-direction: column; align-items: center; gap: 8px; color: #6b5a63; text-align: center; font-size: 12px; }
        .s4-fallback-monogram { display: grid; place-items: center; width: 64px; height: 64px; border-radius: 20px; background: color-mix(in srgb, var(--kit-color) 30%, #fff); color: #3b2a33; font: 38px Georgia, serif; }
        .s4-image-fallback strong { color: #2a1d24; font-size: 17px; }

        /* Detalhes */
        .s4-details { display: flex; min-width: 0; min-height: 0; align-items: center; align-items: safe center; overflow-y: auto; scrollbar-width: none; }
        .s4-details::-webkit-scrollbar { display: none; }
        .s4-details-content { display: flex; width: 100%; flex-direction: column; }
        .s4-product-kicker { display: flex; align-items: center; gap: 9px; color: var(--kit-color); font-size: 10px; font-weight: 850; letter-spacing: .13em; filter: brightness(1.15); }
        .s4-product-kicker-line { width: 23px; height: 1px; background: var(--kit-color); }
        .s4-details h3 { margin: 8px 0 6px; font-size: clamp(24px, 2.8vw, 34px); font-weight: 800; letter-spacing: -.045em; line-height: 1.1; color: #fff; }
        .s4-product-description { max-width: 460px; margin: 0; color: var(--s4-muted); font-size: 13px; line-height: 1.6; }
        .s4-ideal {
          display: grid; gap: 3px; max-width: 460px; margin: 12px 0 0; padding: 10px 12px; border-left: 3px solid var(--kit-color);
          border-radius: 4px 12px 12px 4px; background: var(--kit-tint); color: var(--s4-ink); font-size: 12px; line-height: 1.5;
        }
        .s4-ideal strong { color: var(--kit-color); font-size: 9px; font-weight: 850; letter-spacing: .13em; text-transform: uppercase; filter: brightness(1.2); }
        .s4-price-block { margin: 14px 0; padding: 12px 0; border-top: 1px solid var(--s4-line); border-bottom: 1px solid var(--s4-line); }
        .s4-price-line { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; }
        .s4-price {
          font-size: clamp(28px, 3.2vw, 38px); font-weight: 850; letter-spacing: -.045em; line-height: 1.1; font-variant-numeric: tabular-nums;
          background: linear-gradient(90deg, #ffffff, var(--s4-rose)); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;
        }
        .s4-price-badge { padding: 5px 10px; border: 1px solid var(--s4-line); border-radius: 999px; background: rgba(255,255,255,.06); color: var(--s4-muted); font-size: 10px; font-weight: 700; }
        .s4-diff { margin: 6px 0 0; color: var(--s4-muted); font-size: 12px; line-height: 1.4; }
        .s4-diff b { color: var(--kit-color); font-weight: 800; filter: brightness(1.15); }
        .s4-includes-heading { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 8px; }
        .s4-includes-heading strong { font-size: 13px; }
        .s4-includes-heading > span { color: var(--s4-muted); font-size: 11px; }
        .s4-items { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; margin: 0; padding: 0; list-style: none; }
        .s4-item {
          display: flex; align-items: center; gap: 9px; min-width: 0; padding: 9px 10px; border: 1px solid rgba(255,255,255,.08); border-radius: 11px;
          background: rgba(255,255,255,.04); font-size: 12px; line-height: 1.35; transition: transform .25s var(--s4-ease), border-color .25s, background .25s;
        }
        .s4-item:hover { transform: translateY(-2px); border-color: color-mix(in srgb, var(--kit-color) 55%, transparent); background: rgba(255,255,255,.07); }
        .s4-item.is-inherited { grid-column: 1 / -1; border-color: color-mix(in srgb, var(--kit-color) 45%, transparent); background: var(--kit-tint); font-weight: 700; }
        .s4-item-check { display: grid; flex: 0 0 20px; place-items: center; width: 20px; height: 20px; border-radius: 7px; background: var(--kit-tint); color: var(--kit-color); font-size: 11px; font-weight: 850; filter: brightness(1.2); }
        .s4-item.is-inherited .s4-item-check { background: var(--kit-color); color: #14100f; filter: none; }

        /* Compacto: ativa quando o cartão é baixo (o conteúdo se reorganiza em vez de vazar) */
        @container s4 (max-height: 430px) {
          .s4-product-description { display: none; }
          .s4-details h3 { margin: 6px 0 8px; font-size: 28px; }
          .s4-ideal { margin: 0; padding: 7px 10px; font-size: 11.5px; line-height: 1.4; }
          .s4-ideal strong { font-size: 8.5px; }
          .s4-price-block { display: flex; flex-wrap: wrap; align-items: center; gap: 4px 14px; margin: 10px 0; padding: 8px 0; }
          .s4-price { font-size: 30px; }
          .s4-diff { margin: 0; font-size: 11.5px; }
          .s4-includes-heading { margin-bottom: 6px; }
          .s4-items { grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 6px; }
          .s4-item { padding: 7px 9px; font-size: 11.5px; }
        }
        @container s4 (max-height: 340px) {
          .s4-includes-heading { display: none; }
          .s4-ideal strong { display: none; }
          .s4-details h3 { font-size: 24px; }
        }

        /* Diferenciais */
        .s4-benefits { flex: 0 0 auto; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; }
        .s4-benefit {
          display: flex; min-width: 0; align-items: center; gap: 11px; padding: 10px 14px; border: 1px solid var(--s4-line); border-radius: 14px;
          background: linear-gradient(155deg, rgba(255,255,255,.07), rgba(255,255,255,.02)); backdrop-filter: blur(12px);
          box-shadow: inset 0 1px 0 rgba(255,255,255,.14);
          transition: transform .3s var(--s4-ease), border-color .3s;
        }
        .s4-benefit:hover { transform: translateY(-2px); border-color: rgba(240,169,191,.35); }
        .s4-benefit-icon { display: grid; flex: 0 0 38px; place-items: center; width: 38px; height: 38px; border: 1px solid var(--s4-line); border-radius: 12px; background: rgba(255,255,255,.07); }
        .s4-benefit-icon img { width: 22px; height: 22px; object-fit: contain; }
        .s4-benefit-copy { min-width: 0; }
        .s4-benefit-copy h4 { margin: 0 0 2px; font-size: 12px; font-weight: 750; line-height: 1.3; }
        .s4-benefit-copy p { margin: 0; color: var(--s4-muted); font-size: 10px; line-height: 1.45; }

        /* Sem media queries de largura: o palco é sempre 1280x720 (escalado pelo App). */
        @media (prefers-reduced-motion: reduce) {
          .s4-heading h2 span, .s4-live-dot { animation: none; }
          .s4-kit-tab, .s4-item, .s4-benefit, .s4-showcase { transition: none; }
          .s4-kit-tab:hover, .s4-item:hover, .s4-benefit:hover { transform: none; }
        }
      `}</style>
    </section>
  );
}

export default S4;
