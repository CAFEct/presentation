import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useRef, type CSSProperties } from 'react';
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

interface S3Props {
  openVideo?: number | null;
  setOpenVideo?: (index: number | null) => void;
}

function S3({ openVideo = null, setOpenVideo }: S3Props) {
  const modalRef = useRef<HTMLElement>(null);
  const active = openVideo === null ? null : cards[openVideo];
  const isOpen = active !== null;

  const open = (index: number) => setOpenVideo?.(index);
  const close = useCallback(() => setOpenVideo?.(null), [setOpenVideo]);
  const move = useCallback(
    (step: -1 | 1) => {
      if (openVideo === null) return;
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

  return (
    <section className="esmalt-section" aria-labelledby="esmalt-heading">
      <div className="esmalt-heading">
        <Eyebrow>O que é o Esmalt'up</Eyebrow>
        <H2 id="esmalt-heading">
          Tudo para sua próxima <em className="esmalt-highlight">conquista</em>
        </H2>
        <p className="esmalt-intro">
          Produtos escolhidos para sua rotina e conhecimento para levar suas técnicas mais longe.
        </p>
      </div>

      <div className="esmalt-grid">
        {cards.map((card, i) => (
          <motion.article
            key={card.title}
            className="esmalt-card"
            style={accent(card)}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.4, delay: i * 0.08, ease: 'easeOut' }}
          >
            {/* Mesma ação do botão abaixo: fica fora da ordem de tabulação para não duplicar o foco. */}
            <button
              type="button"
              className="esmalt-preview"
              onClick={() => open(i)}
              tabIndex={-1}
              aria-hidden="true"
            >
              <span className="esmalt-icon">
                <img src={card.icon} alt="" loading="lazy" />
              </span>
              <span className="esmalt-play">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M9 6.75L18 12L9 17.25V6.75Z" fill="currentColor" />
                </svg>
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
                onClick={() => open(i)}
                aria-haspopup="dialog"
                aria-label={`${card.action}: assistir à apresentação de ${card.title}`}
              >
                {card.action}
                <span aria-hidden="true">↗</span>
              </button>
            </div>
          </motion.article>
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
            transition={{ duration: 0.2 }}
          >
            <motion.section
              ref={modalRef}
              className="esmalt-modal"
              style={accent(active)}
              role="dialog"
              aria-modal="true"
              aria-labelledby="esmalt-modal-title"
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
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
                  {cards.map((card, i) => (
                    <button
                      type="button"
                      key={card.title}
                      className={`esmalt-nav-item${openVideo === i ? ' is-active' : ''}`}
                      style={accent(card)}
                      onClick={() => open(i)}
                      aria-current={openVideo === i ? 'true' : undefined}
                    >
                      <img src={card.icon} alt="" />
                      <span>{card.title}</span>
                    </button>
                  ))}
                </nav>

                <div className="esmalt-player-col">
                  <div className="esmalt-player">
                    <video
                      key={active.video}
                      src={active.video}
                      autoPlay
                      muted
                      loop
                      playsInline
                      controls
                      aria-label={`Vídeo: ${active.title}`}
                    />
                  </div>
                  <div className="esmalt-caption">
                    <p>{active.description}</p>
                    <div className="esmalt-controls">
                      <button type="button" onClick={() => move(-1)} aria-label="Apresentação anterior">←</button>
                      <span aria-live="polite">
                        {pad(openVideo! + 1)} / {pad(cards.length)}
                      </span>
                      <button type="button" onClick={() => move(1)} aria-label="Próxima apresentação">→</button>
                    </div>
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
          --line: rgba(240,169,191,.2); --glass: rgba(255,255,255,.05); --glass-2: rgba(255,255,255,.1);
          position: relative; overflow: hidden; color: var(--ink); background: transparent;
        }
        .esmalt-section button { font: inherit; cursor: pointer; }
        .esmalt-section button:focus-visible { outline: 2px solid var(--card-accent, var(--pink)); outline-offset: 2px; }

        /* Cabeçalho */
        .esmalt-heading { max-width: 900px; margin: 0 auto 32px; text-align: center; }
        .esmalt-heading h2 { margin: 12px 0 14px; line-height: 1.12; letter-spacing: -.04em; }
        .esmalt-highlight { color: var(--pink); font-style: normal; }
        .esmalt-intro { max-width: 600px; margin: 0 auto; color: var(--muted); font-size: 16px; line-height: 1.6; }

        /* Cards */
        .esmalt-grid { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 20px; }
        .esmalt-card {
          display: flex; flex-direction: column; min-width: 0; padding: 12px; overflow: hidden;
          border: 1px solid var(--line); border-radius: 20px; background: var(--glass);
          backdrop-filter: blur(12px); box-shadow: 0 8px 28px rgba(0,0,0,.2);
          transition: border-color .25s, box-shadow .25s, transform .25s;
        }
        .esmalt-card:hover { border-color: var(--card-accent); box-shadow: 0 18px 44px rgba(0,0,0,.3); transform: translateY(-4px); }

        .esmalt-preview {
          position: relative; isolation: isolate; display: grid; place-items: center; min-height: 150px;
          overflow: hidden; border: 0; border-radius: 14px; background: rgba(255,255,255,.08);
        }
        .esmalt-preview::before, .esmalt-preview::after {
          content: ''; position: absolute; z-index: -1; border: 1px solid rgba(240,169,191,.15); border-radius: 50%;
        }
        .esmalt-preview::before { width: 160px; height: 160px; }
        .esmalt-preview::after { width: 110px; height: 110px; }
        .esmalt-icon {
          display: grid; place-items: center; width: 90px; height: 90px; border-radius: 24px;
          background: var(--glass-2); box-shadow: 0 8px 24px rgba(0,0,0,.15); transition: transform .25s;
        }
        .esmalt-preview:hover .esmalt-icon { transform: translateY(-4px) rotate(-3deg); }
        .esmalt-icon img { width: 56px; height: 56px; object-fit: contain; }
        .esmalt-play {
          position: absolute; bottom: 10px; left: 10px; display: inline-flex; align-items: center; gap: 6px;
          padding: 6px 10px; border: 1px solid rgba(255,255,255,.3); border-radius: 999px;
          background: rgba(255,255,255,.15); backdrop-filter: blur(12px); color: var(--ink); font-size: 10px; font-weight: 700;
        }
        .esmalt-play svg { width: 14px; height: 14px; color: var(--card-accent); }

        .esmalt-body { display: flex; flex: 1; flex-direction: column; align-items: flex-start; padding: 16px 8px 8px; }
        .esmalt-eyebrow { margin-bottom: 8px; color: var(--card-accent); font-size: 10px; font-weight: 800; letter-spacing: .12em; }
        .esmalt-body h3 { margin: 0 0 8px; color: #fff; font-size: 17px; line-height: 1.3; letter-spacing: -.025em; }
        .esmalt-description { min-height: 40px; margin: 0 0 12px; color: var(--muted); font-size: 13px; line-height: 1.45; }
        .esmalt-benefits { display: grid; gap: 6px; margin: 0 0 16px; padding: 0; list-style: none; }
        .esmalt-benefits li { display: flex; gap: 8px; color: #d0c5ca; font-size: 12px; line-height: 1.4; }
        .esmalt-benefits li::before {
          content: '✓'; display: grid; flex: 0 0 14px; place-items: center; width: 14px; height: 14px;
          border-radius: 50%; background: var(--glass-2); color: var(--card-accent); font-size: 9px; font-weight: 800;
        }
        .esmalt-cta {
          display: flex; align-items: center; justify-content: space-between; width: 100%; margin-top: auto;
          padding: 10px 12px; border: 1px solid var(--card-accent); border-radius: 10px;
          background: var(--card-accent); color: #fff; font-size: 11px; font-weight: 700;
          transition: transform .2s, filter .2s;
        }
        .esmalt-cta:hover { filter: brightness(1.1); transform: translateY(-1px); }
        .esmalt-cta span { font-size: 14px; line-height: 1; }
        .esmalt-footnote { margin: 16px 0 0; text-align: center; color: var(--muted); font-size: 12px; line-height: 1.5; }

        /* Modal */
        .esmalt-backdrop {
          position: fixed; inset: 0; z-index: 1000; display: grid; place-items: center; padding: 22px;
          overflow-y: auto; background: rgba(0,0,0,.85); backdrop-filter: blur(12px);
        }
        .esmalt-modal {
          display: flex; flex-direction: column; width: min(960px,100%); max-height: min(700px, calc(100dvh - 44px));
          overflow: hidden; border: 1px solid rgba(255,255,255,.15); border-radius: 20px;
          background: rgba(18,11,17,.95); backdrop-filter: blur(20px); box-shadow: 0 32px 100px rgba(0,0,0,.5);
        }
        .esmalt-modal-header { display: flex; align-items: center; justify-content: space-between; gap: 20px; padding: 18px 22px; border-bottom: 1px solid var(--line); }
        .esmalt-brand { display: flex; align-items: center; gap: 12px; min-width: 0; }
        .esmalt-mark { display: grid; flex: 0 0 38px; place-items: center; width: 38px; height: 38px; border-radius: 12px; background: rgba(240,169,191,.2); color: var(--pink); font: 22px Georgia, serif; }
        .esmalt-kicker { color: var(--muted); font-size: 10px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; }
        .esmalt-modal-header h3 { margin: 4px 0 0; color: #fff; font-size: 16px; letter-spacing: -.02em; overflow-wrap: anywhere; }
        .esmalt-close { display: grid; flex: 0 0 36px; place-items: center; width: 36px; height: 36px; border: 1px solid var(--line); border-radius: 50%; background: var(--glass-2); color: #fff; }
        .esmalt-close svg { width: 16px; height: 16px; fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linecap: round; }

        .esmalt-modal-body { display: grid; grid-template-columns: 220px minmax(0,1fr); min-height: 0; overflow: auto; }
        .esmalt-nav { display: flex; flex-direction: column; gap: 8px; padding: 16px; border-right: 1px solid var(--line); background: rgba(255,255,255,.03); }
        .esmalt-nav-item {
          display: grid; grid-template-columns: 36px minmax(0,1fr); align-items: center; gap: 10px; padding: 10px;
          border: 1px solid transparent; border-radius: 10px; background: transparent; color: var(--muted);
          text-align: left; font-size: 12px; font-weight: 600; line-height: 1.4;
        }
        .esmalt-nav-item img { width: 34px; height: 34px; padding: 4px; border-radius: 8px; background: rgba(255,255,255,.08); object-fit: contain; }
        .esmalt-nav-item.is-active { border-color: var(--card-accent); background: rgba(240,169,191,.15); color: #fff; }

        .esmalt-player-col { min-width: 0; padding: 20px; }
        .esmalt-player { display: grid; place-items: center; overflow: hidden; aspect-ratio: 16/9; border-radius: 12px; background: #000; }
        .esmalt-player video { display: block; width: 100%; height: 100%; max-height: 400px; object-fit: contain; }
        .esmalt-caption { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding-top: 16px; }
        .esmalt-caption p { max-width: 450px; margin: 0; color: var(--muted); font-size: 12px; line-height: 1.5; }
        .esmalt-controls { display: flex; flex: 0 0 auto; align-items: center; gap: 8px; color: var(--muted); font-size: 10px; font-weight: 800; }
        .esmalt-controls button { display: grid; place-items: center; width: 32px; height: 32px; border: 1px solid var(--line); border-radius: 50%; background: var(--glass-2); color: #fff; font-size: 16px; }

        /* Responsivo */
        @media (max-width: 900px) {
          .esmalt-grid { grid-template-columns: repeat(2, minmax(0,1fr)); }
          .esmalt-card:last-child { grid-column: 1 / -1; width: calc(50% - 10px); justify-self: center; }
          .esmalt-description { min-height: 0; }
        }
        @media (max-width: 620px) {
          .esmalt-heading { margin-bottom: 24px; }
          .esmalt-intro { font-size: 14px; }
          .esmalt-grid { grid-template-columns: minmax(0,1fr); gap: 16px; }
          .esmalt-card:last-child { grid-column: auto; width: auto; }
          .esmalt-card { border-radius: 16px; }
          .esmalt-preview { min-height: 160px; }
          .esmalt-backdrop { align-items: start; padding: 10px; }
          .esmalt-modal { max-height: calc(100dvh - 20px); border-radius: 16px; }
          .esmalt-modal-header { padding: 14px; }
          .esmalt-modal-header h3 { font-size: 14px; }
          .esmalt-modal-body { grid-template-columns: minmax(0,1fr); }
          .esmalt-nav { order: 2; display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 6px; padding: 10px; border-top: 1px solid var(--line); border-right: 0; }
          .esmalt-nav-item { display: flex; flex-direction: column; justify-content: flex-start; gap: 6px; padding: 9px 5px; text-align: center; font-size: 10px; }
          .esmalt-player-col { padding: 12px; }
          .esmalt-player { aspect-ratio: 4/3; }
          .esmalt-caption { flex-direction: column; align-items: flex-start; gap: 14px; }
          .esmalt-controls { align-self: flex-end; }
        }
        @media (prefers-reduced-motion: reduce) {
          .esmalt-card, .esmalt-icon, .esmalt-cta { transition: none; }
          .esmalt-card:hover, .esmalt-cta:hover { transform: none; }
        }
      `}</style>
    </section>
  );
}

export default S3;
