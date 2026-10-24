import { motion, AnimatePresence } from 'framer-motion';
import { useCallback, useEffect, useRef } from 'react';
import Eyebrow from '../Eyebrow';
import { H2 } from '../Typography';

const cards = [
  {
    icon: './public/imgs/paleta.png',
    title: 'Kits de Manicure Completos',
    eyebrow: 'TUDO EM UM SÓ LUGAR',
    description: 'Tudo o que você precisa para começar ou elevar o nível do seu trabalho.',
    benefits: ['Kit completo e prático', 'Materiais de qualidade'],
    color: '#C66B85',
    softColor: '#F9E8ED',
    video: './public/videos/kits.mp4',
    action: 'Explorar os kits',
  },
  {
    icon: './public/imgs/wrench.png',
    title: 'Peças Avulsas',
    eyebrow: 'ESCOLHA DO SEU JEITO',
    description: 'Encontre as peças certas e monte uma seleção que combina com você.',
    benefits: ['Compre apenas o que precisa', 'Mais liberdade para escolher'],
    color: '#527DA8',
    softColor: '#EAF1F8',
    video: './public/videos/pecas.mp4',
    action: 'Conhecer as peças',
  },
  {
    icon: './public/imgs/formatura.png',
    title: 'Curso Preparatório',
    eyebrow: 'APRENDA COM CONFIANÇA',
    description: 'Desenvolva suas técnicas com aulas organizadas do básico ao avançado.',
    benefits: ['23 aulas + conteúdos bônus', 'Aprendizado passo a passo'],
    color: '#438C78',
    softColor: '#E6F3EE',
    video: './public/videos/curso.mp4',
    action: 'Conhecer o curso',
  },
] as const;

interface S3Props {
  openVideo?: number | null;
  setOpenVideo?: (index: number | null) => void;
}

function S3({ openVideo, setOpenVideo }: S3Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const activeIndex = typeof openVideo === 'number' ? openVideo : null;
  const activeCard = activeIndex === null ? null : cards[activeIndex];

  const close = useCallback(() => setOpenVideo?.(null), [setOpenVideo]);

  const move = useCallback((direction: -1 | 1) => {
    if (activeIndex === null) return;
    const next = (activeIndex + direction + cards.length) % cards.length;
    setOpenVideo?.(next);
  }, [activeIndex, setOpenVideo]);

  useEffect(() => {
    if (activeIndex === null) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
      if (event.key === 'ArrowLeft') move(-1);
      if (event.key === 'ArrowRight') move(1);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [activeIndex, close, move]);

  useEffect(() => {
    if (!activeCard || !videoRef.current) return;
    videoRef.current.currentTime = 0;
    void videoRef.current.play().catch(() => {
      // Playback can be blocked by browser settings; native controls remain available.
    });
  }, [activeCard]);

  return (
    <section className="esmalt-section" aria-labelledby="esmalt-heading">
      <div className="esmalt-inner">
        <div className="esmalt-heading">
          <Eyebrow>O que é o Esmalt'up</Eyebrow>
          <H2>
            Tudo para sua próxima <em className="esmalt-highlight">conquista</em>
          </H2>
          <p className="esmalt-intro">
            Produtos escolhidos para sua rotina e conhecimento para levar suas técnicas mais longe.
          </p>
        </div>

        <div className="esmalt-grid">
          {cards.map((card, index) => (
            <motion.article
              key={card.title}
              className="esmalt-card"
              style={{ '--card-accent': card.color, '--card-soft': card.softColor } as React.CSSProperties}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.42, delay: index * 0.08, ease: 'easeOut' }}
              whileHover={{ y: -5 }}
            >
              <div className="esmalt-card-topline">
                <span className="esmalt-card-index">0{index + 1}</span>
                <span className="esmalt-card-eyebrow">{card.eyebrow}</span>
              </div>

              <button
                type="button"
                className="esmalt-preview"
                onClick={() => setOpenVideo?.(index)}
                aria-label={`Assistir à apresentação: ${card.title}`}
              >
                <span className="esmalt-icon-wrap">
                  <img src={card.icon} alt="" loading="lazy" />
                </span>
                <span className="esmalt-play" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M9 6.75L18 12L9 17.25V6.75Z" fill="currentColor" />
                  </svg>
                  Ver apresentação
                </span>
              </button>

              <div className="esmalt-card-content">
                <h3>{card.title}</h3>
                <p className="esmalt-description">{card.description}</p>
                <ul className="esmalt-benefits">
                  {card.benefits.map((benefit) => (
                    <li key={benefit}>
                      <span aria-hidden="true">✓</span>
                      {benefit}
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  className="esmalt-cta"
                  onClick={() => setOpenVideo?.(index)}
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
      </div>

      <AnimatePresence>
        {activeCard && (
          <motion.div
            className="esmalt-modal-backdrop"
            role="presentation"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) close();
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.section
              className="esmalt-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="esmalt-modal-title"
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              <header className="esmalt-modal-header">
                <div className="esmalt-modal-brand">
                  <span className="esmalt-modal-mark">E</span>
                  <div>
                    <span className="esmalt-modal-kicker">CONHEÇA O ESMALT'UP</span>
                    <h3 id="esmalt-modal-title">{activeCard.title}</h3>
                  </div>
                </div>
                <button
                  ref={closeButtonRef}
                  type="button"
                  className="esmalt-close"
                  onClick={close}
                  aria-label="Fechar apresentação"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M6 6L18 18M18 6L6 18" />
                  </svg>
                </button>
              </header>

              <div className="esmalt-modal-body">
                <nav className="esmalt-modal-nav" aria-label="Outras apresentações">
                  {cards.map((card, index) => (
                    <button
                      type="button"
                      key={card.title}
                      className={`esmalt-modal-nav-item ${activeIndex === index ? 'is-active' : ''}`}
                      onClick={() => setOpenVideo?.(index)}
                      aria-current={activeIndex === index ? 'page' : undefined}
                    >
                      <img src={card.icon} alt="" />
                      <span>{card.title}</span>
                      <span className="esmalt-nav-arrow" aria-hidden="true">↗</span>
                    </button>
                  ))}
                </nav>

                <div className="esmalt-player-column">
                  <div className="esmalt-player">
                    <video
                      key={activeCard.video}
                      ref={videoRef}
                      src={activeCard.video}
                      autoPlay
                      muted
                      loop
                      playsInline
                      controls
                      aria-label={`Vídeo: ${activeCard.title}`}
                    />
                  </div>
                  <div className="esmalt-player-caption">
                    <div>
                      <span className="esmalt-card-eyebrow">APRESENTAÇÃO</span>
                      <h4>{activeCard.title}</h4>
                      <p>{activeCard.description}</p>
                    </div>
                    <div className="esmalt-player-controls">
                      <button type="button" onClick={() => move(-1)} aria-label="Apresentação anterior">
                        ←
                      </button>
                      <span>{String(activeIndex! + 1).padStart(2, '0')} / 03</span>
                      <button type="button" onClick={() => move(1)} aria-label="Próxima apresentação">
                        →
                      </button>
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
          --esmalt-ink: #f0f0f0;
          --esmalt-muted: #a89ba2;
          --esmalt-line: rgba(240, 169, 191, 0.2);
          position: relative;
          padding: 0;
          color: var(--esmalt-ink);
          background: transparent;
          overflow: hidden;
        }
        .esmalt-inner { width: 100%; margin: 0 auto; }
        .esmalt-heading { max-width: 900px; margin: 0 auto 32px; text-align: center; }
        .esmalt-heading h2 { margin: 12px 0 14px; line-height: 1.12; letter-spacing: -.04em; }
        .esmalt-highlight { color: #f0a9bf; font-style: normal; }
        .esmalt-intro { max-width: 600px; margin: 0 auto; color: var(--esmalt-muted); font-size: 16px; line-height: 1.6; }
        .esmalt-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 20px; align-items: stretch; }
        .esmalt-card {
          min-width: 0; overflow: hidden; display: flex; flex-direction: column;
          border: 1px solid var(--esmalt-line); border-radius: 20px; background: rgba(255,255,255,0.05);
          backdrop-filter: blur(12px);
          box-shadow: 0 8px 28px rgba(0, 0, 0, 0.2);
          transition: border-color .25s ease, box-shadow .25s ease;
        }
        .esmalt-card:hover { border-color: var(--card-accent); box-shadow: 0 18px 44px rgba(0,0,0,0.3); }
        .esmalt-card-topline { display: flex; align-items: center; gap: 10px; padding: 20px 20px 12px; }
        .esmalt-card-index { color: var(--card-accent); font-size: 11px; font-weight: 800; letter-spacing: .12em; }
        .esmalt-card-eyebrow { color: var(--card-accent, #f0a9bf); font-size: 10px; font-weight: 800; letter-spacing: .12em; line-height: 1.5; }
        .esmalt-preview {
          position: relative; isolation: isolate; display: grid; place-items: center; min-height: 150px; margin: 0 12px;
          overflow: hidden; border: 0; border-radius: 15px; background: rgba(255,255,255,0.08); cursor: pointer;
        }
        .esmalt-preview::before, .esmalt-preview::after { content: ''; position: absolute; z-index: -1; border: 1px solid rgba(240, 169, 191, 0.15); border-radius: 50%; }
        .esmalt-preview::before { width: 160px; height: 160px; }
        .esmalt-preview::after { width: 110px; height: 110px; }
        .esmalt-icon-wrap { display: grid; place-items: center; width: 90px; height: 90px; border-radius: 24px; background: rgba(255,255,255,0.1); box-shadow: 0 8px 24px rgba(0,0,0,0.15); transition: transform .25s ease; }
        .esmalt-preview:hover .esmalt-icon-wrap { transform: translateY(-4px) rotate(-3deg); }
        .esmalt-icon-wrap img { width: 56px; height: 56px; object-fit: contain; }
        .esmalt-play { position: absolute; bottom: 10px; left: 10px; display: inline-flex; align-items: center; gap: 6px; padding: 6px 10px; border: 1px solid rgba(255,255,255,0.3); border-radius: 999px; background: rgba(255,255,255,0.15); color: var(--esmalt-ink); font-size: 10px; font-weight: 700; backdrop-filter: blur(12px); }
        .esmalt-play svg { width: 14px; height: 14px; color: var(--card-accent); }
        .esmalt-card-content { display: flex; flex: 1; flex-direction: column; align-items: flex-start; padding: 16px; }
        .esmalt-card-content h3 { margin: 0 0 8px; font-size: 17px; line-height: 1.3; letter-spacing: -.025em; color: #fff; }
        .esmalt-description { min-height: 40px; margin: 0 0 12px; color: var(--esmalt-muted); font-size: 13px; line-height: 1.4; }
        .esmalt-benefits { display: grid; gap: 6px; margin: 0 0 14px; padding: 0; list-style: none; }
        .esmalt-benefits li { display: flex; align-items: flex-start; gap: 6px; color: #d0c5ca; font-size: 12px; line-height: 1.4; }
        .esmalt-benefits li span { display: grid; flex: 0 0 14px; place-items: center; width: 14px; height: 14px; border-radius: 50%; background: rgba(255,255,255,0.1); color: var(--card-accent); font-size: 9px; font-weight: 800; }
        .esmalt-cta { display: flex; width: 100%; align-items: center; justify-content: space-between; gap: 10px; margin-top: auto; padding: 10px 12px; border: 1px solid var(--card-accent); border-radius: 10px; background: var(--card-accent); color: white; font: inherit; font-size: 11px; font-weight: 700; cursor: pointer; transition: transform .2s ease, filter .2s ease; }
        .esmalt-cta:hover { filter: brightness(1.1); transform: translateY(-1px); }
        .esmalt-cta:focus-visible, .esmalt-preview:focus-visible, .esmalt-close:focus-visible, .esmalt-modal button:focus-visible { outline: 2px solid var(--card-accent); outline-offset: 2px; }
        .esmalt-cta span { font-size: 14px; line-height: 1; }
        .esmalt-footnote { margin: 16px 0 0; text-align: center; color: var(--esmalt-muted); font-size: 12px; line-height: 1.5; }
        .esmalt-modal-backdrop { position: fixed; inset: 0; z-index: 1000; display: grid; place-items: center; padding: 22px; background: rgba(0, 0, 0, 0.85); backdrop-filter: blur(12px); overflow-y: auto; }
        .esmalt-modal { position: relative; width: min(960px, 100%); max-height: min(700px, calc(100dvh - 44px)); display: flex; flex-direction: column; overflow: hidden; border: 1px solid rgba(255,255,255,0.15); border-radius: 20px; background: rgba(18, 11, 17, 0.95); backdrop-filter: blur(20px); box-shadow: 0 32px 100px rgba(0,0,0,0.5); }
        .esmalt-modal-header { display: flex; align-items: center; justify-content: space-between; gap: 20px; padding: 18px 22px; border-bottom: 1px solid var(--esmalt-line); }
        .esmalt-modal-brand { display: flex; align-items: center; gap: 12px; min-width: 0; }
        .esmalt-modal-mark { display: grid; flex: 0 0 38px; place-items: center; width: 38px; height: 38px; border-radius: 12px; background: rgba(240, 169, 191, 0.2); color: #f0a9bf; font-family: Georgia, serif; font-size: 22px; }
        .esmalt-modal-kicker { color: #a89ba2; font-size: 9px; font-weight: 800; letter-spacing: .14em; }
        .esmalt-modal-header h3 { margin: 4px 0 0; overflow-wrap: anywhere; font-size: 16px; letter-spacing: -.02em; color: #fff; }
        .esmalt-close { display: grid; flex: 0 0 36px; place-items: center; width: 36px; height: 36px; border: 1px solid var(--esmalt-line); border-radius: 50%; background: rgba(255,255,255,0.1); color: #fff; cursor: pointer; }
        .esmalt-close svg { width: 16px; height: 16px; fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linecap: round; }
        .esmalt-modal-body { display: grid; grid-template-columns: 220px minmax(0, 1fr); min-height: 0; overflow: auto; }
        .esmalt-modal-nav { display: flex; flex-direction: column; gap: 8px; padding: 16px; border-right: 1px solid var(--esmalt-line); background: rgba(255,255,255,0.03); }
        .esmalt-modal-nav-item { display: grid; grid-template-columns: 36px minmax(0,1fr) 14px; align-items: center; gap: 10px; padding: 10px; border: 1px solid transparent; border-radius: 10px; background: transparent; color: #a89ba2; text-align: left; font: inherit; font-size: 12px; font-weight: 600; line-height: 1.4; cursor: pointer; }
        .esmalt-modal-nav-item img { width: 34px; height: 34px; object-fit: contain; padding: 4px; border-radius: 8px; background: rgba(255,255,255,0.08); }
        .esmalt-modal-nav-item.is-active { border-color: var(--card-accent); background: rgba(240, 169, 191, 0.15); color: #fff; }
        .esmalt-nav-arrow { opacity: .6; }
        .esmalt-player-column { min-width: 0; padding: 20px; }
        .esmalt-player { display: grid; place-items: center; overflow: hidden; aspect-ratio: 16 / 9; border-radius: 12px; background: #000; }
        .esmalt-player video { display: block; width: 100%; height: 100%; max-height: 400px; object-fit: contain; }
        .esmalt-player-caption { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding-top: 16px; }
        .esmalt-player-caption h4 { margin: 4px 0; font-size: 15px; color: #fff; }
        .esmalt-player-caption p { max-width: 450px; margin: 0; color: var(--esmalt-muted); font-size: 12px; line-height: 1.5; }
        .esmalt-player-controls { display: flex; flex: 0 0 auto; align-items: center; gap: 8px; color: var(--esmalt-muted); font-size: 10px; font-weight: 800; }
        .esmalt-player-controls button { display: grid; place-items: center; width: 32px; height: 32px; border: 1px solid var(--esmalt-line); border-radius: 50%; background: rgba(255,255,255,0.1); color: #fff; font-size: 16px; cursor: pointer; }
        @media (max-width: 900px) {
          .esmalt-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .esmalt-card:last-child { grid-column: 1 / -1; width: calc(50% - 12px); justify-self: center; }
          .esmalt-description { min-height: 0; }
        }
        @media (max-width: 620px) {
          .esmalt-section { padding: 0; }
          .esmalt-heading { margin-bottom: 24px; }
          .esmalt-intro { font-size: 14px; }
          .esmalt-grid { grid-template-columns: minmax(0,1fr); gap: 16px; }
          .esmalt-card:last-child { grid-column: auto; width: auto; }
          .esmalt-card { border-radius: 16px; }
          .esmalt-card-topline { padding: 16px 16px 10px; }
          .esmalt-preview { min-height: 160px; }
          .esmalt-card-content { padding: 16px; }
          .esmalt-card-content h3 { font-size: 18px; }
          .esmalt-description { font-size: 13px; }
          .esmalt-modal-backdrop { align-items: start; padding: 10px; }
          .esmalt-modal { max-height: calc(100dvh - 20px); border-radius: 16px; }
          .esmalt-modal-header { padding: 14px; }
          .esmalt-modal-header h3 { font-size: 14px; }
          .esmalt-modal-body { grid-template-columns: minmax(0,1fr); overflow-y: auto; }
          .esmalt-modal-nav { order: 2; display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 6px; padding: 10px; border-top: 1px solid var(--esmalt-line); border-right: 0; }
          .esmalt-modal-nav-item { display: flex; flex-direction: column; align-items: center; justify-content: flex-start; gap: 6px; padding: 9px 5px; text-align: center; font-size: 10px; }
          .esmalt-modal-nav-item img { width: 34px; height: 34px; }
          .esmalt-nav-arrow { display: none; }
          .esmalt-player-column { padding: 12px; }
          .esmalt-player { aspect-ratio: 4 / 3; }
          .esmalt-player-caption { align-items: flex-start; flex-direction: column; gap: 14px; }
          .esmalt-player-controls { align-self: flex-end; }
        }
        @media (prefers-reduced-motion: reduce) {
          .esmalt-card, .esmalt-icon-wrap, .esmalt-cta { transition: none; }
        }
      `}</style>
    </section>
  );
}

export default S3;
