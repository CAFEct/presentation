import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type Variants,
} from 'framer-motion';
import {
  useCallback,
  useEffect,
  useRef,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import Eyebrow from '../Eyebrow';
import { H2 } from '../Typography';

// Arquivos de /public são servidos a partir da raiz: use "/imgs/..." e não "./public/imgs/...".
const cards = [
  {
    icon: '/imgs/paleta.png',
    title: 'Kits de Manicure Completos',
    eyebrow: 'TUDO EM UM SÓ LUGAR',
    description: 'Tudo o que você precisa para começar ou elevar o nível do seu trabalho.',
    benefits: ['Kit completo e prático', 'Materiais de qualidade'],
    color: '#C66B85',
    video: '/videos/kits.mp4',
    action: 'Explorar os kits',
  },
  {
    icon: '/imgs/wrench.png',
    title: 'Peças Avulsas',
    eyebrow: 'ESCOLHA DO SEU JEITO',
    description: 'Encontre as peças certas e monte uma seleção que combina com você.',
    benefits: ['Compre apenas o que precisa', 'Mais liberdade para escolher'],
    color: '#527DA8',
    video: '/videos/pecas.mp4',
    action: 'Conhecer as peças',
  },
  {
    icon: '/imgs/formatura.png',
    title: 'Curso Preparatório',
    eyebrow: 'APRENDA COM CONFIANÇA',
    description: 'Desenvolva suas técnicas com aulas organizadas do básico ao avançado.',
    benefits: ['23 aulas + conteúdos bônus', 'Aprendizado passo a passo'],
    color: '#438C78',
    video: '/videos/curso.mp4',
    action: 'Conhecer o curso',
  },
] as const;

type Card = (typeof cards)[number];

const accent = (card: Card) => ({ '--card-accent': card.color }) as CSSProperties;
const pad = (n: number) => String(n).padStart(2, '0');

/* ------------------------------------------------------------------ */
/*  Card 3D: inclina seguindo o mouse, brilho (glare) e parallax       */
/* ------------------------------------------------------------------ */

interface TiltCardProps {
  card: Card;
  index: number;
  onOpen: (index: number) => void;
}

function TiltCard({ card, index, onOpen }: TiltCardProps) {
  const reduced = !!useReducedMotion();

  // posição do cursor dentro do card (0 → 1), suavizada por mola
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, { stiffness: 160, damping: 20, mass: 0.6 });
  const sy = useSpring(py, { stiffness: 160, damping: 20, mass: 0.6 });

  const rotateY = useTransform(sx, [0, 1], [-10, 10]);
  const rotateX = useTransform(sy, [0, 1], [10, -10]);
  const iconX = useTransform(sx, [0, 1], [-12, 12]);
  const iconY = useTransform(sy, [0, 1], [-8, 8]);
  const ringX = useTransform(sx, [0, 1], [10, -10]);
  const ringY = useTransform(sy, [0, 1], [7, -7]);

  const gx = useTransform(sx, (v) => `${v * 100}%`);
  const gy = useTransform(sy, (v) => `${v * 100}%`);
  const glare = useMotionTemplate`radial-gradient(360px circle at ${gx} ${gy}, rgba(255,255,255,.2), rgba(255,255,255,.04) 40%, transparent 65%)`;

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
      className="esmalt-cell"
      initial={reduced ? false : { opacity: 0, y: 48, rotateX: 22, scale: 0.94 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ type: 'spring', stiffness: 70, damping: 16, delay: index * 0.12 }}
      style={{ transformPerspective: 1100 }}
    >
      <motion.article
        className="esmalt-card"
        style={{
          ...accent(card),
          rotateX: reduced ? 0 : rotateX,
          rotateY: reduced ? 0 : rotateY,
          transformPerspective: 1100,
        }}
        whileHover={reduced ? undefined : { y: -8, scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 220, damping: 20 }}
        onPointerMove={onMove}
        onPointerLeave={reset}
      >
        <motion.span className="esmalt-glare" style={{ background: glare }} aria-hidden="true" />

        {/* Mesma ação do botão abaixo: fica fora da ordem de tabulação para não duplicar o foco. */}
        <button
          type="button"
          className="esmalt-preview"
          onClick={() => onOpen(index)}
          tabIndex={-1}
          aria-hidden="true"
        >
          <span className="esmalt-aura" />
          <motion.span className="esmalt-rings" style={{ x: ringX, y: ringY }} />
          <motion.span className="esmalt-icon-wrap" style={{ x: iconX, y: iconY }}>
            <motion.span
              className="esmalt-icon"
              animate={reduced ? undefined : { y: [0, -7, 0], rotate: [-2, 2, -2] }}
              transition={{ duration: 4.4 + index * 0.7, repeat: Infinity, ease: 'easeInOut' }}
            >
              <img src={card.icon} alt="" loading="lazy" draggable={false} />
            </motion.span>
          </motion.span>
          <span className="esmalt-play">
            <span className="esmalt-play-dot">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M9 6.75L18 12L9 17.25V6.75Z" fill="currentColor" />
              </svg>
            </span>
            Ver apresentação
          </span>
        </button>

        <div className="esmalt-body">
          <span className="esmalt-eyebrow">{card.eyebrow}</span>
          <h3>{card.title}</h3>
          <p className="esmalt-description">{card.description}</p>
          <ul className="esmalt-benefits">
            {card.benefits.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
          <button
            type="button"
            className="esmalt-cta"
            onClick={() => onOpen(index)}
            aria-haspopup="dialog"
            aria-label={`${card.action}: assistir à apresentação de ${card.title}`}
          >
            <span className="esmalt-cta-label">{card.action}</span>
            <span className="esmalt-cta-arrow" aria-hidden="true">↗</span>
          </button>
        </div>
      </motion.article>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Slide 3                                                            */
/* ------------------------------------------------------------------ */

const slideVariants: Variants = {
  enter: (d: number) => ({ opacity: 0, x: d * 56, scale: 0.96, filter: 'blur(10px)' }),
  center: { opacity: 1, x: 0, scale: 1, filter: 'blur(0px)' },
  exit: (d: number) => ({ opacity: 0, x: d * -56, scale: 0.96, filter: 'blur(10px)' }),
};

const textVariants: Variants = {
  enter: (d: number) => ({ opacity: 0, x: d * 20 }),
  center: { opacity: 1, x: 0 },
  exit: (d: number) => ({ opacity: 0, x: d * -20 }),
};

interface S3Props {
  openVideo?: number | null;
  setOpenVideo?: (index: number | null) => void;
}

function S3({ openVideo = null, setOpenVideo }: S3Props) {
  const reduced = !!useReducedMotion();
  const modalRef = useRef<HTMLElement>(null);
  const direction = useRef<1 | -1>(1);
  const active = openVideo === null ? null : cards[openVideo];
  const isOpen = active !== null;

  const open = useCallback(
    (index: number) => {
      if (openVideo !== null) direction.current = index >= openVideo ? 1 : -1;
      setOpenVideo?.(index);
    },
    [openVideo, setOpenVideo],
  );
  const close = useCallback(() => setOpenVideo?.(null), [setOpenVideo]);
  const move = useCallback(
    (step: -1 | 1) => {
      if (openVideo === null) return;
      direction.current = step;
      setOpenVideo?.((openVideo + step + cards.length) % cards.length);
    },
    [openVideo, setOpenVideo],
  );

  // Trava o scroll, leva o foco para o modal e devolve ao botão de origem ao fechar.
  useEffect(() => {
    if (!isOpen) return;
    const trigger = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    modalRef.current?.querySelector<HTMLElement>('.esmalt-close')?.focus();
    return () => {
      document.body.style.overflow = overflow;
      trigger?.focus?.();
    };
  }, [isOpen]);

  // Atalhos de teclado e foco preso dentro do modal.
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') return close();
      if (e.key === 'ArrowLeft') return move(-1);
      if (e.key === 'ArrowRight') return move(1);
      if (e.key !== 'Tab') return;

      const items = modalRef.current?.querySelectorAll<HTMLElement>('button, video[controls]');
      if (!items?.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, close, move]);

  const dir = direction.current;

  return (
    <section className="esmalt-section" aria-labelledby="esmalt-heading">
      <div className="esmalt-orbs" aria-hidden="true">
        <span className="esmalt-orb esmalt-orb-a" />
        <span className="esmalt-orb esmalt-orb-b" />
      </div>

      <motion.div
        className="esmalt-heading"
        initial={reduced ? false : { opacity: 0, y: 24, filter: 'blur(8px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <Eyebrow>O que é o Esmalt'up</Eyebrow>
        <H2 id="esmalt-heading">
          Tudo para sua próxima <em className="esmalt-highlight">conquista</em>
        </H2>
        <p className="esmalt-intro">
          Produtos escolhidos para sua rotina e conhecimento para levar suas técnicas mais longe.
        </p>
      </motion.div>

      <div className="esmalt-grid">
        {cards.map((card, i) => (
          <TiltCard key={card.title} card={card} index={i} onOpen={open} />
        ))}
      </div>

      <p className="esmalt-footnote">
        Não sabe por onde começar? Explore cada opção e encontre a que faz sentido para você.
      </p>

      <AnimatePresence>
        {active && (
          <motion.div
            className="esmalt-backdrop"
            role="presentation"
            onMouseDown={(e) => e.target === e.currentTarget && close()}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <motion.section
              ref={modalRef}
              className="esmalt-modal"
              style={{ ...accent(active), transformPerspective: 1400 }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="esmalt-modal-title"
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 40, rotateX: 14, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, y: 24, rotateX: 8, scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 190, damping: 24 }}
            >
              {/* Aura que muda de cor com a apresentação ativa */}
              <motion.span
                className="esmalt-modal-aura"
                aria-hidden="true"
                animate={{ backgroundColor: active.color }}
                transition={{ duration: 0.7 }}
              />

              <header className="esmalt-modal-header">
                <div className="esmalt-brand">
                  <span className="esmalt-mark" aria-hidden="true">E</span>
                  <div>
                    <span className="esmalt-kicker">Conheça o Esmalt'up</span>
                    <h3 id="esmalt-modal-title">{active.title}</h3>
                  </div>
                </div>
                <button type="button" className="esmalt-close" onClick={close} aria-label="Fechar apresentação">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M6 6L18 18M18 6L6 18" />
                  </svg>
                </button>
              </header>

              <div className="esmalt-modal-body">
                <nav className="esmalt-nav" aria-label="Outras apresentações">
                  {cards.map((card, i) => {
                    const isActive = openVideo === i;
                    return (
                      <button
                        type="button"
                        key={card.title}
                        className={`esmalt-nav-item${isActive ? ' is-active' : ''}`}
                        style={accent(card)}
                        onClick={() => open(i)}
                        aria-current={isActive ? 'true' : undefined}
                      >
                        {isActive && (
                          <motion.span
                            layoutId="esmalt-nav-pill"
                            className="esmalt-nav-pill"
                            transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                          />
                        )}
                        <img src={card.icon} alt="" />
                        <span className="esmalt-nav-label">{card.title}</span>
                      </button>
                    );
                  })}
                </nav>

                <div className="esmalt-player-col">
                  <div className="esmalt-player">
                    <AnimatePresence mode="wait" custom={dir} initial={false}>
                      <motion.div
                        key={active.video}
                        className="esmalt-player-slide"
                        custom={dir}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <video
                          src={active.video}
                          autoPlay
                          muted
                          loop
                          playsInline
                          controls
                          aria-label={`Vídeo: ${active.title}`}
                        />
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  <div className="esmalt-caption">
                    <div className="esmalt-caption-text">
                      <AnimatePresence mode="wait" custom={dir} initial={false}>
                        <motion.p
                          key={active.title}
                          custom={dir}
                          variants={textVariants}
                          initial="enter"
                          animate="center"
                          exit="exit"
                          transition={{ duration: 0.22 }}
                        >
                          {active.description}
                        </motion.p>
                      </AnimatePresence>
                      <span className="esmalt-hint" aria-hidden="true">← → para navegar · Esc para fechar</span>
                    </div>

                    <div className="esmalt-controls">
                      <button type="button" onClick={() => move(-1)} aria-label="Apresentação anterior">←</button>
                      <span aria-live="polite">
                        {pad(openVideo! + 1)} / {pad(cards.length)}
                      </span>
                      <button type="button" onClick={() => move(1)} aria-label="Próxima apresentação">→</button>
                    </div>
                  </div>

                  <div className="esmalt-progress" aria-hidden="true">
                    {cards.map((card, i) => (
                      <span key={card.title} className="esmalt-progress-seg">
                        <motion.span
                          className="esmalt-progress-fill"
                          style={{ background: card.color }}
                          initial={false}
                          animate={{ scaleX: openVideo === i ? 1 : 0 }}
                          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                        />
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .esmalt-section {
          --ink: #f0f0f0; --muted: #a89ba2; --pink: #f0a9bf;
          --line: rgba(240,169,191,.2); --glass: rgba(255,255,255,.06); --glass-2: rgba(255,255,255,.1);
          --ease: cubic-bezier(.22,1,.36,1);
          position: relative; overflow: hidden; padding: 12px 6px 20px; color: var(--ink); background: transparent;
        }
        .esmalt-section button { font: inherit; cursor: pointer; }
        .esmalt-section button:focus-visible { outline: 2px solid var(--card-accent, var(--pink)); outline-offset: 3px; }

        /* Luzes de fundo (dão profundidade ao vidro) */
        .esmalt-orbs { position: absolute; inset: 0; z-index: 0; pointer-events: none; }
        .esmalt-orb { position: absolute; border-radius: 50%; filter: blur(70px); opacity: .5; }
        .esmalt-orb-a { top: -60px; left: 8%; width: 320px; height: 320px; background: #C66B85; animation: esmalt-drift 14s ease-in-out infinite alternate; }
        .esmalt-orb-b { right: 6%; bottom: 40px; width: 360px; height: 360px; background: #527DA8; opacity: .32; animation: esmalt-drift 18s ease-in-out infinite alternate-reverse; }
        @keyframes esmalt-drift { to { transform: translate3d(48px, 36px, 0) scale(1.15); } }

        /* Cabeçalho */
        .esmalt-heading { position: relative; z-index: 1; max-width: 900px; margin: 0 auto 36px; text-align: center; }
        .esmalt-heading h2 { margin: 12px 0 14px; line-height: 1.12; letter-spacing: -.04em; }
        .esmalt-highlight {
          font-style: normal; color: var(--pink);
          background: linear-gradient(100deg, #ffd0de 10%, #f0a9bf 40%, #d9708f 60%, #ffd0de 90%);
          background-size: 220% 100%; -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;
          animation: esmalt-shine 6s linear infinite;
        }
        @keyframes esmalt-shine { to { background-position: -220% 0; } }
        .esmalt-intro { max-width: 600px; margin: 0 auto; color: var(--muted); font-size: 16px; line-height: 1.6; }

        /* Cards */
        .esmalt-grid { position: relative; z-index: 1; display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 22px; }
        .esmalt-cell { display: flex; min-width: 0; }
        .esmalt-card {
          position: relative; display: flex; flex: 1; flex-direction: column; min-width: 0; padding: 12px; overflow: hidden;
          border: 1px solid rgba(255,255,255,.14); border-radius: 22px;
          background: linear-gradient(155deg, rgba(255,255,255,.11), rgba(255,255,255,.03) 55%, rgba(255,255,255,.05));
          backdrop-filter: blur(18px) saturate(1.4); -webkit-backdrop-filter: blur(18px) saturate(1.4);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,.28),
            inset 0 -1px 0 rgba(0,0,0,.18),
            0 10px 30px rgba(0,0,0,.28),
            0 26px 60px -20px rgba(0,0,0,.45);
          transition: border-color .35s var(--ease), box-shadow .35s var(--ease);
          will-change: transform;
        }
        .esmalt-card:hover {
          border-color: color-mix(in srgb, var(--card-accent) 70%, white 10%);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,.4),
            inset 0 -1px 0 rgba(0,0,0,.18),
            0 18px 44px rgba(0,0,0,.35),
            0 40px 90px -24px color-mix(in srgb, var(--card-accent) 65%, transparent);
        }
        .esmalt-glare { position: absolute; inset: 0; z-index: 3; border-radius: inherit; pointer-events: none; opacity: 0; transition: opacity .35s; }
        .esmalt-card:hover .esmalt-glare { opacity: 1; }

        .esmalt-preview {
          position: relative; isolation: isolate; display: grid; place-items: center; min-height: 164px;
          overflow: hidden; border: 1px solid rgba(255,255,255,.08); border-radius: 15px; background: rgba(0,0,0,.18);
        }
        .esmalt-aura {
          position: absolute; z-index: -2; inset: 0;
          background: radial-gradient(circle at 50% 55%, color-mix(in srgb, var(--card-accent) 55%, transparent), transparent 68%);
          opacity: .55; transition: opacity .4s, transform .6s var(--ease);
        }
        .esmalt-card:hover .esmalt-aura { opacity: 1; transform: scale(1.2); }
        .esmalt-rings { position: absolute; z-index: -1; width: 170px; height: 170px; border: 1px solid rgba(240,169,191,.2); border-radius: 50%; }
        .esmalt-rings::after { content: ''; position: absolute; inset: 28px; border: 1px solid rgba(240,169,191,.18); border-radius: 50%; }
        .esmalt-icon-wrap { display: grid; place-items: center; }
        .esmalt-icon {
          position: relative; display: grid; place-items: center; width: 94px; height: 94px; border-radius: 26px;
          background: linear-gradient(150deg, rgba(255,255,255,.28), rgba(255,255,255,.06));
          border: 1px solid rgba(255,255,255,.25);
          box-shadow: inset 0 1px 0 rgba(255,255,255,.5), 0 14px 28px rgba(0,0,0,.3), 0 24px 40px -10px color-mix(in srgb, var(--card-accent) 60%, transparent);
          backdrop-filter: blur(8px);
        }
        .esmalt-icon img { width: 58px; height: 58px; object-fit: contain; filter: drop-shadow(0 8px 8px rgba(0,0,0,.35)); }
        .esmalt-play {
          position: absolute; bottom: 10px; left: 10px; display: inline-flex; align-items: center; gap: 7px;
          padding: 5px 12px 5px 5px; border: 1px solid rgba(255,255,255,.28); border-radius: 999px;
          background: rgba(255,255,255,.14); backdrop-filter: blur(14px); color: var(--ink); font-size: 10px; font-weight: 700;
          transition: transform .35s var(--ease), background .3s;
        }
        .esmalt-card:hover .esmalt-play { transform: translateY(-2px) scale(1.05); background: rgba(255,255,255,.22); }
        .esmalt-play-dot { position: relative; display: grid; place-items: center; width: 22px; height: 22px; border-radius: 50%; background: var(--card-accent); color: #fff; }
        .esmalt-play-dot::after { content: ''; position: absolute; inset: 0; border-radius: 50%; border: 2px solid var(--card-accent); animation: esmalt-ping 2.2s ease-out infinite; }
        .esmalt-play-dot svg { width: 13px; height: 13px; }
        @keyframes esmalt-ping { from { transform: scale(1); opacity: .7; } to { transform: scale(2); opacity: 0; } }

        .esmalt-body { display: flex; flex: 1; flex-direction: column; align-items: flex-start; padding: 16px 8px 8px; }
        .esmalt-eyebrow { margin-bottom: 8px; color: var(--card-accent); font-size: 10px; font-weight: 800; letter-spacing: .12em; filter: brightness(1.25); }
        .esmalt-body h3 { margin: 0 0 8px; color: #fff; font-size: 17px; line-height: 1.3; letter-spacing: -.025em; }
        .esmalt-description { min-height: 40px; margin: 0 0 12px; color: var(--muted); font-size: 13px; line-height: 1.45; }
        .esmalt-benefits { display: grid; gap: 6px; margin: 0 0 16px; padding: 0; list-style: none; }
        .esmalt-benefits li { display: flex; gap: 8px; color: #d0c5ca; font-size: 12px; line-height: 1.4; }
        .esmalt-benefits li::before {
          content: '✓'; display: grid; flex: 0 0 14px; place-items: center; width: 14px; height: 14px;
          border-radius: 50%; background: var(--glass-2); color: var(--card-accent); font-size: 9px; font-weight: 800; filter: brightness(1.3);
        }
        .esmalt-cta {
          position: relative; display: flex; align-items: center; justify-content: space-between; width: 100%; margin-top: auto;
          padding: 11px 12px 11px 14px; overflow: hidden; border: 1px solid rgba(255,255,255,.25); border-radius: 12px;
          background: linear-gradient(180deg, color-mix(in srgb, var(--card-accent) 82%, white), var(--card-accent));
          color: #fff; font-size: 11px; font-weight: 700;
          box-shadow: inset 0 1px 0 rgba(255,255,255,.4), 0 8px 18px -6px var(--card-accent);
          transition: transform .3s var(--ease), box-shadow .3s var(--ease);
        }
        .esmalt-cta::before {
          content: ''; position: absolute; inset: 0; transform: translateX(-120%) skewX(-18deg);
          background: linear-gradient(90deg, transparent, rgba(255,255,255,.4), transparent); transition: transform .7s var(--ease);
        }
        .esmalt-cta:hover { transform: translateY(-2px); box-shadow: inset 0 1px 0 rgba(255,255,255,.5), 0 14px 26px -6px var(--card-accent); }
        .esmalt-cta:hover::before { transform: translateX(120%) skewX(-18deg); }
        .esmalt-cta:active { transform: translateY(0) scale(.98); }
        .esmalt-cta-arrow { display: grid; place-items: center; width: 22px; height: 22px; border-radius: 50%; background: rgba(255,255,255,.22); font-size: 13px; line-height: 1; transition: transform .3s var(--ease); }
        .esmalt-cta:hover .esmalt-cta-arrow { transform: translate(2px, -2px) rotate(8deg); }
        .esmalt-footnote { position: relative; z-index: 1; margin: 20px 0 0; text-align: center; color: var(--muted); font-size: 12px; line-height: 1.5; }

        /* Modal */
        .esmalt-backdrop {
          position: fixed; inset: 0; z-index: 1000; display: grid; place-items: center; padding: 22px;
          overflow-y: auto; background: radial-gradient(circle at 50% 40%, rgba(40,20,32,.82), rgba(0,0,0,.92));
          backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
        }
        .esmalt-modal {
          position: relative; isolation: isolate; display: flex; flex-direction: column; width: min(980px,100%); max-height: min(720px, calc(100dvh - 44px));
          overflow: hidden; border: 1px solid rgba(255,255,255,.18); border-radius: 24px;
          background: linear-gradient(160deg, rgba(34,20,30,.9), rgba(14,9,13,.94));
          backdrop-filter: blur(24px) saturate(1.3);
          box-shadow: inset 0 1px 0 rgba(255,255,255,.2), 0 40px 120px rgba(0,0,0,.65), 0 0 90px -30px var(--card-accent);
        }
        .esmalt-modal-aura { position: absolute; z-index: -1; top: -140px; right: -100px; width: 420px; height: 420px; border-radius: 50%; filter: blur(110px); opacity: .32; pointer-events: none; }
        .esmalt-modal-header { display: flex; align-items: center; justify-content: space-between; gap: 20px; padding: 18px 22px; border-bottom: 1px solid var(--line); }
        .esmalt-brand { display: flex; align-items: center; gap: 12px; min-width: 0; }
        .esmalt-mark { display: grid; flex: 0 0 40px; place-items: center; width: 40px; height: 40px; border-radius: 13px; background: linear-gradient(150deg, rgba(240,169,191,.35), rgba(240,169,191,.1)); border: 1px solid rgba(240,169,191,.3); box-shadow: inset 0 1px 0 rgba(255,255,255,.35); color: var(--pink); font: 22px Georgia, serif; }
        .esmalt-kicker { color: var(--muted); font-size: 10px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; }
        .esmalt-modal-header h3 { margin: 4px 0 0; color: #fff; font-size: 16px; letter-spacing: -.02em; overflow-wrap: anywhere; }
        .esmalt-close { display: grid; flex: 0 0 38px; place-items: center; width: 38px; height: 38px; border: 1px solid var(--line); border-radius: 50%; background: var(--glass-2); color: #fff; transition: transform .35s var(--ease), background .25s; }
        .esmalt-close:hover { transform: rotate(90deg) scale(1.08); background: rgba(255,255,255,.2); }
        .esmalt-close svg { width: 16px; height: 16px; fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linecap: round; }

        .esmalt-modal-body { display: grid; grid-template-columns: 224px minmax(0,1fr); min-height: 0; overflow: auto; }
        .esmalt-nav { display: flex; flex-direction: column; gap: 8px; padding: 16px; border-right: 1px solid var(--line); background: rgba(255,255,255,.03); }
        .esmalt-nav-item {
          position: relative; display: grid; grid-template-columns: 36px minmax(0,1fr); align-items: center; gap: 10px; padding: 10px;
          border: 1px solid transparent; border-radius: 12px; background: transparent; color: var(--muted);
          text-align: left; font-size: 12px; font-weight: 600; line-height: 1.4; transition: color .25s, background .25s, transform .3s var(--ease);
        }
        .esmalt-nav-item:hover { color: #fff; background: rgba(255,255,255,.06); transform: translateX(3px); }
        .esmalt-nav-item.is-active { color: #fff; }
        .esmalt-nav-pill {
          position: absolute; inset: 0; z-index: 0; border: 1px solid var(--card-accent); border-radius: 12px;
          background: linear-gradient(135deg, color-mix(in srgb, var(--card-accent) 38%, transparent), rgba(255,255,255,.04));
          box-shadow: 0 10px 24px -10px var(--card-accent), inset 0 1px 0 rgba(255,255,255,.2);
        }
        .esmalt-nav-item img, .esmalt-nav-label { position: relative; z-index: 1; }
        .esmalt-nav-item img { width: 34px; height: 34px; padding: 4px; border-radius: 9px; background: rgba(255,255,255,.1); object-fit: contain; }

        .esmalt-player-col { min-width: 0; padding: 20px; }
        .esmalt-player {
          position: relative; display: grid; place-items: center; overflow: hidden; aspect-ratio: 16/9; border-radius: 16px; background: #000;
          border: 1px solid rgba(255,255,255,.12);
          box-shadow: 0 24px 60px -14px rgba(0,0,0,.7), 0 0 50px -16px var(--card-accent);
        }
        .esmalt-player-slide { position: absolute; inset: 0; display: grid; place-items: center; }
        .esmalt-player video { display: block; width: 100%; height: 100%; max-height: 400px; object-fit: contain; }
        .esmalt-caption { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding-top: 16px; }
        .esmalt-caption-text { display: grid; gap: 8px; min-width: 0; }
        .esmalt-caption p { max-width: 450px; margin: 0; color: var(--muted); font-size: 12px; line-height: 1.5; }
        .esmalt-hint { color: rgba(168,155,162,.6); font-size: 10px; }
        .esmalt-controls { display: flex; flex: 0 0 auto; align-items: center; gap: 8px; color: var(--muted); font-size: 10px; font-weight: 800; }
        .esmalt-controls button { display: grid; place-items: center; width: 34px; height: 34px; border: 1px solid var(--line); border-radius: 50%; background: var(--glass-2); color: #fff; font-size: 16px; transition: transform .3s var(--ease), background .25s; }
        .esmalt-controls button:hover { background: rgba(255,255,255,.2); transform: scale(1.12); }
        .esmalt-controls button:active { transform: scale(.94); }
        .esmalt-progress { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; margin-top: 16px; }
        .esmalt-progress-seg { height: 3px; overflow: hidden; border-radius: 3px; background: rgba(255,255,255,.1); }
        .esmalt-progress-fill { display: block; width: 100%; height: 100%; transform-origin: left; border-radius: 3px; }

        /* Responsivo */
        @media (max-width: 900px) {
          .esmalt-grid { grid-template-columns: repeat(2, minmax(0,1fr)); }
          .esmalt-cell:last-child { grid-column: 1 / -1; width: calc(50% - 11px); justify-self: center; }
          .esmalt-description { min-height: 0; }
        }
        @media (max-width: 620px) {
          .esmalt-heading { margin-bottom: 24px; }
          .esmalt-intro { font-size: 14px; }
          .esmalt-grid { grid-template-columns: minmax(0,1fr); gap: 16px; }
          .esmalt-cell:last-child { grid-column: auto; width: auto; }
          .esmalt-card { border-radius: 18px; }
          .esmalt-preview { min-height: 160px; }
          .esmalt-orb { opacity: .3; }
          .esmalt-backdrop { align-items: start; padding: 10px; }
          .esmalt-modal { max-height: calc(100dvh - 20px); border-radius: 18px; }
          .esmalt-modal-header { padding: 14px; }
          .esmalt-modal-header h3 { font-size: 14px; }
          .esmalt-modal-body { grid-template-columns: minmax(0,1fr); }
          .esmalt-nav { order: 2; display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 6px; padding: 10px; border-top: 1px solid var(--line); border-right: 0; }
          .esmalt-nav-item { display: flex; flex-direction: column; justify-content: flex-start; gap: 6px; padding: 9px 5px; text-align: center; font-size: 10px; }
          .esmalt-nav-item:hover { transform: none; }
          .esmalt-player-col { padding: 12px; }
          .esmalt-player { aspect-ratio: 4/3; }
          .esmalt-caption { flex-direction: column; align-items: flex-start; gap: 14px; }
          .esmalt-controls { align-self: flex-end; }
          .esmalt-hint { display: none; }
        }
        @media (hover: none) {
          .esmalt-glare { display: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          .esmalt-orb, .esmalt-highlight, .esmalt-play-dot::after { animation: none; }
          .esmalt-card, .esmalt-aura, .esmalt-cta, .esmalt-cta::before, .esmalt-cta-arrow, .esmalt-close, .esmalt-nav-item, .esmalt-controls button { transition: none; }
          .esmalt-cta:hover, .esmalt-close:hover, .esmalt-nav-item:hover, .esmalt-controls button:hover { transform: none; }
        }
      `}</style>
    </section>
  );
}

export default S3;
