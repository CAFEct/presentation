import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Eyebrow, { Led } from '../Eyebrow';

const trophyImg = '/imgs/trofeu.png';
const priceImg = '/imgs/money.png';
const rocketImg = '/imgs/rocket.png';
const placeholderImg = '/imgs/sem_background.png';

const kits = [
  {
    name: 'Iniciante',
    title: 'Kit Iniciante',
    eyebrow: 'SEU PRIMEIRO PASSO',
    price: 'R$ 189,90',
    numericPrice: 189.9,
    color: '#68C9A7',
    tint: 'rgba(104, 201, 167, 0.13)',
    image: '/produtos/kits/kit_iniciante.jpg',
    description:
      'O essencial para começar sua jornada na manicure com mais praticidade e confiança.',
    items: ['Esmaltes básicos', 'Base e top coat', 'Cortador de cutículas', 'Lixa de unha'],
  },
  {
    name: 'Profissional',
    title: 'Kit Profissional',
    eyebrow: 'PARA IR MAIS LONGE',
    price: 'R$ 349,90',
    numericPrice: 349.9,
    color: '#82B9F5',
    tint: 'rgba(130, 185, 245, 0.14)',
    image: '/produtos/kits/kit_profissional.jpg',
    description:
      'Uma seleção mais completa para ampliar suas possibilidades e elevar sua rotina de trabalho.',
    items: ['Tudo do Kit Iniciante', 'Esmaltes coloridos', 'Ferramentas premium', 'Guia completo'],
  },
  {
    name: 'Cabine LED',
    title: 'Kit Cabine LED',
    eyebrow: 'UMA EXPERIÊNCIA COMPLETA',
    price: 'R$ 429,90',
    numericPrice: 429.9,
    color: '#EAC16C',
    tint: 'rgba(234, 193, 108, 0.15)',
    image: '/produtos/kits/kit_cabine.jpg',
    description:
      'Uma opção ampliada que reúne os itens do kit profissional e uma cabine LED.',
    items: ['Tudo do Kit Profissional', 'Lâmpada LED', 'Terminal de cobre', 'Suporte'],
  },
] as const;

const benefits = [
  {
    icon: trophyImg,
    title: 'Seleção cuidadosa',
    description: 'Combinações pensadas para sua rotina.',
  },
  {
    icon: priceImg,
    title: 'Opções para seu bolso',
    description: 'Escolha o kit ideal para seu momento.',
  },
  {
    icon: rocketImg,
    title: 'Entrega rápida',
    description: 'Receba seus produtos sem complicação.',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { ease: 'easeOut' } },
};

function S4() {
  const [selectedKit, setSelectedKit] = useState(0);
  const [imageFailed, setImageFailed] = useState(false);
  const reduceMotion = useReducedMotion();
  const kit = kits[selectedKit];

  useEffect(() => {
    setImageFailed(false);
  }, [selectedKit]);

  useEffect(() => {
    kits.forEach(({ image }) => {
      const img = new Image();
      img.src = image;
    });
  }, []);

  const selectKit = (index: number) => {
    setSelectedKit(index);
  };

  return (
    <section className="s4-section" aria-labelledby="s4-title">
      <div className="s4-shell">
        <header className="s4-heading">
          <Eyebrow>Kits completos</Eyebrow>
          <motion.h2
            id="s4-title"
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.45 }}
          >
            Seu próximo passo começa <span>por aqui.</span>
          </motion.h2>
          <p>
            Escolha o kit que combina com seu momento e encontre tudo o que precisa para evoluir.
          </p>
        </header>

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
                className={`s4-kit-tab ${active ? 'is-active' : ''}`}
                style={{ '--kit-color': item.color, '--kit-tint': item.tint } as React.CSSProperties}
                onClick={() => selectKit(index)}
                onKeyDown={(event) => {
                  if (event.key === 'ArrowRight') {
                    event.preventDefault();
                    const next = (index + 1) % kits.length;
                    selectKit(next);
                    document.getElementById(`s4-tab-${next}`)?.focus();
                  }
                  if (event.key === 'ArrowLeft') {
                    event.preventDefault();
                    const previous = (index - 1 + kits.length) % kits.length;
                    selectKit(previous);
                    document.getElementById(`s4-tab-${previous}`)?.focus();
                  }
                }}
              >
                <span className="s4-tab-number">0{index + 1}</span>
                <span className="s4-tab-copy">
                  <strong>{item.name}</strong>
                  <small>{item.eyebrow}</small>
                </span>
                <span className="s4-tab-check" aria-hidden="true">{active ? '✓' : '+'}</span>
              </button>
            );
          })}
        </div>

        <div
          className="s4-showcase"
          id="s4-kit-panel"
          role="tabpanel"
          aria-labelledby={`s4-tab-${selectedKit}`}
          style={{ '--kit-color': kit.color, '--kit-tint': kit.tint } as React.CSSProperties}
        >
          <div className="s4-visual-column">
            <div className="s4-image-stage">
              <div className="s4-stage-glow" />
              <span className="s4-stage-label">
                <span className="s4-live-dot" />
                {kit.eyebrow}
              </span>

              <AnimatePresence mode="wait">
                <motion.div
                  key={kit.image}
                  className="s4-product-image-wrap"
                  initial={reduceMotion ? false : { opacity: 0, y: 12, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={reduceMotion ? undefined : { opacity: 0, y: -8, scale: 0.98 }}
                  transition={{ duration: 0.28, ease: 'easeOut' }}
                >
                  {!imageFailed ? (
                    <img
                      src={kit.image}
                      alt={`Conteúdo do ${kit.title}`}
                      className="s4-product-image"
                      onError={() => setImageFailed(true)}
                    />
                  ) : (
                    <div className="s4-image-fallback">
                      <span className="s4-fallback-monogram" style={{ background: `color-mix(in srgb, ${kit.color} 30%, transparent)` }}>E</span>
                      <strong>{kit.title}</strong>
                      <span>Imagem do produto indisponível</span>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              <div className="s4-image-caption">
                <span>ESMALT'UP</span>
                <span>SELEÇÃO {String(selectedKit + 1).padStart(2, '0')} / 03</span>
              </div>
            </div>
            <p className="s4-image-note">
              <span aria-hidden="true">✦</span>
              Encontre o conjunto ideal para sua jornada
            </p>
          </div>

          <div className="s4-details">
            <AnimatePresence mode="wait">
              <motion.div
                key={kit.name}
                className="s4-details-content"
                initial={reduceMotion ? false : { opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, x: -8 }}
                transition={{ duration: 0.24 }}
              >
                <div className="s4-product-kicker">
                  <span className="s4-product-kicker-line" />
                  {kit.eyebrow}
                </div>

                <h3>{kit.title}</h3>
                <p className="s4-product-description">{kit.description}</p>

                <div className="s4-price-block">
                  <span className="s4-price-label">INVESTIMENTO</span>
                  <div className="s4-price-line">
                    <span className="s4-price">{kit.price}</span>
                    <span className="s4-price-badge">Kit completo</span>
                  </div>
                </div>

                <div className="s4-includes-heading">
                  <strong>O que vem no kit</strong>
                  <span>{kit.items.length} itens / categorias</span>
                </div>

                <ul className="s4-items">
                  {kit.items.map((item, index) => (
                    <li key={item}>
                      <span className="s4-item-check" aria-hidden="true">✓</span>
                      <span>{item}</span>
                      <span className="s4-item-index">{String(index + 1).padStart(2, '0')}</span>
                    </li>
                  ))}
                </ul>

                <p className="s4-selection-note">
                  <span aria-hidden="true">ⓘ</span>
                  Compare as opções acima para encontrar a que faz sentido para você.
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="s4-benefits-heading">
          <div>
            <span className="s4-section-kicker">POR QUE ESMALT'UP</span>
            <h3>Uma escolha feita para facilitar sua rotina</h3>
          </div>
          <span className="s4-benefits-count">03 DIFERENCIAIS</span>
        </div>

        <motion.div
          className="s4-benefits"
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45, staggerChildren: 0.08, staggerDelay: 0.05 }}
        >
          {benefits.map((benefit, index) => (
            <motion.article
              key={benefit.title}
              className="s4-benefit"
              initial={reduceMotion ? false : { opacity: 0, y: 12, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.35, delay: index * 0.05 }}
            >
              <div className="s4-benefit-icon">
                <img src={benefit.icon} alt="" loading="lazy" />
              </div>
              <div className="s4-benefit-copy">
                <h4>{benefit.title}</h4>
                <p>{benefit.description}</p>
              </div>
              <span className="s4-benefit-arrow" aria-hidden="true">➤</span>
            </motion.article>
          ))}
        </motion.div>

        <footer className="s4-footer">
          <span className="s4-footer-mark">E</span>
          <p>Seu talento merece as ferramentas certas.</p>
          <span className="s4-footer-line" />
        </footer>
      </div>

      <style>{`
        .s4-section {
          --s4-ink: var(--text, #f7f1f4);
          --s4-muted: var(--muted, #b7aab2);
          --s4-line: rgba(255,255,255,.11);
          position: relative;
          isolation: isolate;
          width: 100%;
          padding: clamp(52px, 7vw, 94px) clamp(16px, 4vw, 44px);
          color: var(--s4-ink);
          overflow: clip;
        }
        .s4-shell { width: min(1120px, 100%); margin: 0 auto; }
        .s4-heading { max-width: 760px; margin: 0 auto clamp(28px, 4vw, 46px); text-align: center; }
        .s4-heading h2 { 
          margin: 13px 0 14px; 
          font-size: clamp(32px, 4.3vw, 54px); 
          font-weight: 800; 
          letter-spacing: -.055em; 
          line-height: 1.08; 
          text-wrap: balance;
          background: linear-gradient(90deg, #ffffff, var(--rose)) 
                        background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
          transition: transform 0.3s ease;
        }
        .s4-heading h2:hover { transform: translateY(-2px); }
        .s4-heading h2 span { 
          color: var(--rose, #f0a9bf);
          background: linear-gradient(90deg, transparent 45%, var(--rose) 50%, transparent 55%);
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
        }
        .s4-heading > p { max-width: 580px; margin: 0 auto; color: var(--s4-muted); font-size: clamp(14px, 1.4vw, 17px); line-height: 1.75; }

        /* Kit Picker - Improved */
        .s4-kit-picker { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; margin-bottom: 16px; }
        .s4-kit-tab { 
          display: flex; 
          min-width: 0; 
          align-items: center; 
          gap: 13px; 
          padding: 15px 17px; 
          border: 1px solid var(--s4-line); 
          border-radius: 15px; 
          background: rgba(255,255,255,.025); 
          color: var(--s4-ink); 
          text-align: left; 
          cursor: pointer; 
          transition: all .28s cubic-bezier(0.25, 0.1, 0.25, 1);
          position: relative;
          z-index: 1;
        }
        .s4-kit-tab:hover { 
          transform: translateY(-3px);
          border-color: color-mix(in srgb, var(--kit-color) 65%, transparent);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        }
        .s4-kit-tab.is-active { 
          border-color: color-mix(in srgb, var(--kit-color) 75%, transparent); 
          background: var(--kit-tint); 
          box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--kit-color) 14%, transparent), 0 4px 15px rgba(0,0,0,0.12);
        }
        .s4-tab-number { 
          display: grid; 
          flex: 0 0 36px; 
          place-items: center; 
          width: 36px; 
          height: 36px; 
          border-radius: 11px; 
          background: var(--kit-tint); 
          color: var(--kit-color); 
          font-size: 11px; 
          font-weight: 850; 
          letter-spacing: .04em;
          transition: all 0.25s ease;
        }
        .s4-kit-tab.is-active .s4-tab-number {
          animation: s4-pulse 2s infinite;
        }
        @keyframes s4-pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.08); }
          100% { transform: scale(1); }
        }
        .s4-tab-copy { display: flex; min-width: 0; flex: 1; flex-direction: column; gap: 4px; }
        .s4-tab-copy strong { font-size: 14px; line-height: 1.25; font-weight: 600; }
        .s4-tab-copy small { color: var(--s4-muted); font-size: 9px; font-weight: 750; letter-spacing: .09em; line-height: 1.4; }
        .s4-tab-check { color: var(--kit-color); font-size: 19px; font-weight: 500; opacity: 0.8; }
        .s4-showcase { 
          display: grid; 
          grid-template-columns: minmax(0, 1.02fr) minmax(0, .98fr); 
          gap: clamp(22px, 4vw, 48px); 
          padding: clamp(18px, 3vw, 32px); 
          border: 1px solid var(--s4-line); 
          border-radius: 24px; 
          background: linear-gradient(135deg, rgba(255,255,255,.055), rgba(255,255,255,.018));
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          box-shadow: 0 25px 60px rgba(0,0,0,0.12), 0 8px 25px rgba(0,0,0,0.08);
        }
        .s4-visual-column { min-width: 0; }
        .s4-image-stage { 
          position: relative; 
          isolation: isolate; 
          display: flex; 
          min-height: 380px; 
          flex-direction: column; 
          align-items: center; 
          justify-content: center; 
          overflow: hidden; 
          border: 1px solid color-mix(in srgb, var(--kit-color) 20%, transparent); 
          border-radius: 19px; 
          background: radial-gradient(ellipse at 50% 48%, var(--kit-tint), transparent 69%), rgba(0,0,0,.12);
          backdrop-filter: blur(8px);
        }
        .s4-stage-glow { 
          position: absolute; 
          z-index: -1; 
          width: 64%; 
          aspect-ratio: 1; 
          border: 1px solid color-mix(in srgb, var(--kit-color) 17%, transparent); 
          border-radius: 50%; 
          box-shadow: 0 0 0 32px color-mix(in srgb, var(--kit-color) 4%, transparent), 0 0 0 64px color-mix(in srgb, var(--kit-color) 3%, transparent), 0 0 40px color-mix(in srgb, var(--kit-color) 8%, transparent);
          animation: s4-glow 6s infinite ease-in-out;
        }
        @keyframes s4-glow {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        .s4-stage-label { 
          position: absolute; 
          top: 17px; 
          left: 17px; 
          display: inline-flex; 
          align-items: center; 
          gap: 8px; 
          padding: 8px 11px; 
          border: 1px solid var(--s4-line); 
          border-radius: 999px; 
          background: rgba(15,10,14,.35); 
          color: var(--s4-muted); 
          font-size: 9px; 
          font-weight: 800; 
          letter-spacing: .1em;
          backdrop-filter: blur(4px);
        }
        .s4-live-dot { 
          width: 8px; 
          height: 8px; 
          border-radius: 50%; 
          background: var(--kit-color); 
          box-shadow: 0 0 12px var(--kit-color), 0 0 25px var(--kit-color);
          animation: s4-blink 2s infinite;
        }
        @keyframes s4-blink {
          0%, 100% { opacity: 1; box-shadow: 0 0 12px var(--kit-color), 0 0 25px var(--kit-color); }
          50% { opacity: 0.7; box-shadow: 0 0 8px var(--kit-color); }
        }
        .s4-product-image-wrap { 
          display: grid; 
          place-items: center; 
          width: 100%; 
          height: 100%; 
          min-height: 330px; 
          padding: 36px; 
        }
        .s4-product-image { 
          display: block; 
          width: 100%; 
          height: 310px; 
          object-fit: contain; 
          filter: drop-shadow(0 25px 35px rgba(0,0,0,.28));
          transition: transform 0.4s ease;
        }
        .s4-product-image-wrap:hover .s4-product-image {
          transform: scale(1.02);
        }
        .s4-image-fallback { 
          display: flex; 
          flex-direction: column; 
          align-items: center; 
          gap: 10px; 
          color: var(--s4-muted); 
          text-align: center; 
          font-size: 12px; 
        }
        .s4-fallback-monogram { 
          display: grid; 
          place-items: center; 
          width: 74px; 
          height: 74px; 
          border: 1px solid var(--s4-line); 
          border-radius: 23px; 
          color: var(--kit-color); 
          font-family: Georgia,serif; 
          font-size: 44px; 
        }
        .s4-image-fallback strong { color: var(--s4-ink); font-size: 18px; }
        .s4-image-caption { 
          position: absolute; 
          right: 17px; 
          bottom: 15px; 
          left: 17px; 
          display: flex; 
          justify-content: space-between; 
          gap: 10px; 
          color: var(--s4-muted); 
          font-size: 9px; 
          font-weight: 750; 
          letter-spacing: .13em;
          text-shadow: 0 0 8px rgba(0,0,0,0.3);
        }
        .s4-image-note { 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          gap: 8px; 
          margin: 13px 0 0; 
          color: var(--s4-muted); 
          font-size: 11px; 
          line-height: 1.6; 
          text-align: center; 
        }
        .s4-image-note span { color: var(--kit-color); }
        .s4-details { 
          display: flex; 
          min-width: 0; 
          flex: 1;
        }
        .s4-details-content { width: 100%; }
        .s4-product-kicker { 
          display: flex; 
          align-items: center; 
          gap: 9px; 
          color: var(--kit-color); 
          font-size: 10px; 
          font-weight: 850; 
          letter-spacing: .13em;
        }
        .s4-product-kicker-line { width: 23px; height: 1px; background: var(--kit-color); }
        .s4-details h3 { 
          margin: 13px 0 10px; 
          font-size: clamp(27px, 3vw, 38px); 
          font-weight: 800; 
          letter-spacing: -.045em; 
          line-height: 1.1;
          background: linear-gradient(90deg, #ffffff, var(--kit-color));
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        .s4-product-description { max-width: 440px; margin: 0; color: var(--s4-muted); font-size: 13px; line-height: 1.8; }
        .s4-price-block { 
          margin: 23px 0 24px; 
          padding: 17px 0; 
          border-top: 1px solid var(--s4-line); 
          border-bottom: 1px solid var(--s4-line);
        }
        .s4-price-label { color: var(--s4-muted); font-size: 9px; font-weight: 800; letter-spacing: .13em; }
        .s4-price-line { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; margin-top: 6px; }
        .s4-price { 
          color: var(--rose, #f0a9bf); 
          font-size: clamp(29px, 3.3vw, 39px); 
          font-weight: 850; 
          letter-spacing: -.045em; 
          line-height: 1.2; 
          font-variant-numeric: tabular-nums;
          background: linear-gradient(90deg, #ffffff, var(--rose));
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        .s4-price-badge { padding: 6px 9px; border: 1px solid var(--s4-line); border-radius: 999px; color: var(--s4-muted); font-size: 9px; font-weight: 700; }
        .s4-includes-heading { 
          display: flex; 
          flex-wrap: wrap; 
          align-items: center; 
          justify-content: space-between; 
          gap: 8px; 
          margin-bottom: 10px;
        }
        .s4-includes-heading strong { font-size: 13px; }
        .s4-includes-heading > span { color: var(--s4-muted); font-size: 10px; }
        .s4-items { display: grid; gap: 0; margin: 0; padding: 0; list-style: none; }
        .s4-items li { 
          display: flex; 
          align-items: center; 
          gap: 10px; 
          min-width: 0; 
          padding: 11px 0; 
          border-bottom: 1px solid rgba(255,255,255,.055); 
          color: var(--s4-ink); 
          font-size: 12px; 
          line-height: 1.5; 
        }
        .s4-item-check { 
          display: grid; 
          flex: 0 0 20px; 
          place-items: center; 
          width: 20px; 
          height: 20px; 
          border-radius: 7px; 
          background: var(--kit-tint); 
          color: var(--kit-color); 
          font-size: 11px; 
          font-weight: 850;
          transition: transform 0.25s ease;
        }
        .s4-items li:hover .s4-item-check { transform: scale(1.1); }
        .s4-item-index { margin-left: auto; color: var(--s4-muted); font-size: 9px; font-variant-numeric: tabular-nums; }
        .s4-selection-note { 
          display: flex; 
          align-items: flex-start; 
          gap: 8px; 
          margin: 17px 0 0; 
          color: var(--s4-muted); 
          font-size: 10px; 
          line-height: 1.65; 
        }
        .s4-selection-note span { color: var(--kit-color); }
        .s4-benefits-heading { 
          display: flex; 
          align-items: flex-end; 
          justify-content: space-between; 
          gap: 20px; 
          margin: clamp(42px, 6vw, 68px) 0 18px;
        }
        .s4-section-kicker { 
          color: var(--rose, #f0a9bf); 
          font-size: 9px; 
          font-weight: 850; 
          letter-spacing: .15em;
        }
        .s4-benefits-heading h3 { 
          margin: 7px 0 0; 
          font-size: clamp(19px, 2.4vw, 27px); 
          font-weight: 750; 
          letter-spacing: -.035em; 
          line-height: 1.25;
        }
        .s4-benefits-count { padding-bottom: 3px; color: var(--s4-muted); font-size: 9px; font-weight: 800; letter-spacing: .12em; white-space: nowrap; }
        .s4-benefits { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }
        .s4-benefit { 
          display: flex; 
          min-width: 0; 
          align-items: center; 
          gap: 13px; 
          padding: 18px; 
          border: 1px solid var(--s4-line); 
          border-radius: 16px; 
          background: rgba(255,255,255,.025); 
          transition: all .25s ease;
        }
        .s4-benefit:hover { 
          border-color: rgba(240,169,191,.28); 
          background: rgba(255,255,255,.045);
          transform: translateY(-2px);
        }
        .s4-benefit-icon { 
          display: grid; 
          flex: 0 0 46px; 
          place-items: center; 
          width: 46px; 
          height: 46px; 
          border: 1px solid var(--s4-line); 
          border-radius: 14px; 
          background: rgba(255,255,255,.04);
          transition: all 0.25s ease;
        }
        .s4-benefit:hover .s4-benefit-icon { transform: scale(1.08); }
        .s4-benefit-icon img { width: 27px; height: 27px; object-fit: contain; }
        .s4-benefit-copy { min-width: 0; flex: 1; }
        .s4-benefit-copy h4 { 
          margin: 0 0 5px; 
          font-size: 12px; 
          font-weight: 750; 
          line-height: 1.4;
        }
        .s4-benefit-copy p { margin: 0; color: var(--s4-muted); font-size: 10px; line-height: 1.6; }
        .s4-benefit-arrow { 
          align-self: flex-start; 
          color: var(--s4-muted); 
          font-size: 15px;
          transition: color 0.2s ease;
        }
        .s4-benefit:hover .s4-benefit-arrow { color: var(--kit-color); }
        .s4-footer { 
          display: flex; 
          align-items: center; 
          gap: 12px; 
          margin-top: 38px;
        }
        .s4-footer-mark { 
          display: grid; 
          flex: 0 0 27px; 
          place-items: center; 
          width: 27px; 
          height: 27px; 
          border: 1px solid rgba(240,169,191,.35); 
          border-radius: 9px; 
          color: var(--rose, #f0a9bf); 
          font-family: Georgia,serif; 
          font-size: 16px;
        }
        .s4-footer p { margin: 0; color: var(--s4-muted); font-size: 11px; font-style: italic; }
        .s4-footer-line { flex: 1; height: 1px; background: var(--s4-line); }
        .s4-kit-tab:focus-visible { outline: 2px solid var(--kit-color); outline-offset: 3px; }
        @media (max-width: 820px) {
          .s4-showcase { grid-template-columns: minmax(0, 1fr); }
          .s4-image-stage { min-height: 330px; }
          .s4-product-image-wrap { min-height: 285px; }
          .s4-product-image { height: 265px; }
          .s4-details { padding: 8px 4px 4px; }
          .s4-benefits { grid-template-columns: minmax(0, 1fr); }
          .s4-benefit { padding: 14px 16px; }
        }
        @media (max-width: 560px) {
          .s4-section { padding: 52px 15px; }
          .s4-heading { margin-bottom: 25px; }
          .s4-kit-picker { grid-template-columns: minmax(0, 1fr); gap: 8px; }
          .s4-kit-tab { padding: 11px 13px; }
          .s4-tab-number { flex-basis: 32px; width: 32px; height: 32px; }
          .s4-tab-copy strong { font-size: 13px; }
          .s4-tab-copy small { font-size: 8px; }
          .s4-showcase { gap: 22px; padding: 12px; border-radius: 19px; }
          .s4-image-stage { min-height: 265px; border-radius: 14px; }
          .s4-product-image-wrap { min-height: 235px; padding: 28px; }
          .s4-product-image { height: 220px; }
          .s4-stage-label { top: 11px; left: 11px; font-size: 8px; }
          .s4-image-caption { right: 11px; bottom: 11px; left: 11px; font-size: 8px; }
          .s4-details h3 { font-size: 29px; }
          .s4-price { font-size: 32px; }
          .s4-benefits-heading { align-items: flex-start; flex-direction: column; gap: 9px; }
          .s4-benefit { gap: 11px; }
          .s4-footer { margin-top: 27px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .s4-kit-tab, .s4-benefit { transition: none; }
          .s4-product-image { transition: none; }
          .s4-blink, .s4-pulse, .s4-glow { animation: none; }
        }
      `}</style>
    </section>
  );
}

export default S4;
