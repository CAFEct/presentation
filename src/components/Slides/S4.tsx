import { motion, AnimatePresence } from 'framer-motion';
import Eyebrow, { Led } from '../Eyebrow';
import Tilt from '../Tilt';
import { useState, useEffect } from 'react';
import FloatingIcons from '../FloatingIcons';

// Image paths from public folder
const trophyImg = './public/imgs/trofeu.png';
const priceImg = './public/imgs/money.png';
const rocketImg = './public/imgs/rocket.png';

// Kit images
const kitInicianteImg = './public/produtos/kits/kit_iniciante.jpg';
const kitProfissionalImg = './public/produtos/kits/kit_profissional.jpg';
const kitCabineImg = './public/produtos/kits/kit_cabine.jpg';

function S4() {
  const [selectedKit, setSelectedKit] = useState(0);
  const [shouldAnimate, setShouldAnimate] = useState(true);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setShouldAnimate(!mediaQuery.matches);
    const handler = () => setShouldAnimate(!mediaQuery.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Preload all kit images
  useEffect(() => {
    const kitImages = [kitInicianteImg, kitProfissionalImg, kitCabineImg];
    kitImages.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  const kits = [
    {
      name: 'Iniciante',
      title: 'Kit Iniciante',
      price: 'R$ 189,90',
      color: 'var(--mint)',
      items: ['Esmaltes básicos', 'Base e top', 'Cuticle linter', 'Lixa de unha'],
      image: kitInicianteImg,
    },
    {
      name: 'Profissional',
      title: 'Kit Profissional',
      price: 'R$ 349,90',
      color: 'var(--blue)',
      items: ['Kit Iniciante', '+ Esmaltes coloridos', 'Ferramentas premium', 'Guia completo'],
      image: kitProfissionalImg,
    },
    {
      name: 'Cabine LED',
      title: 'Kit Cabine LED',
      price: 'R$ 429,90',
      color: 'var(--gold)',
      items: ['Kit Profissional', '+ Lâmpada LED', 'Terminal de cobré', 'Suporte'],
      image: kitCabineImg,
    },
  ];

  const differentials = [
    { icon: trophyImg, text: 'Combinações testadas por profissionais' },
    { icon: priceImg, text: 'Preços que cabem no seu orçamento' },
    { icon: rocketImg, text: 'Entrega rápida' },
  ];

  return (
    <>
      <Eyebrow>Kits completos</Eyebrow>
      <motion.h2
        variants="item"
        style={{
          fontSize: 48,
          fontWeight: 800,
          lineHeight: 1.1,
          marginBottom: 24,
        }}
      >
        Tudo para começar, <em>em uma caixa</em>
      </motion.h2>

      {/* Selected kit showcase */}
      <Tilt key={kits[selectedKit].name} ledColor={kits[selectedKit].color} style={{ marginBottom: 20 }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 30,
          flexWrap: 'wrap',
        }}>
          {/* Product image with animation */}
          <div
            className="glass"
            style={{
              width: 380,
              height: 300,
              borderRadius: 28,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              flex: '0 0 auto',
            }}
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={selectedKit}
                src={kits[selectedKit].image}
                alt={kits[selectedKit].title}
                initial={{ opacity: 0, scale: 0.94, rotateY: 15 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  rotateY: 0,
                }}
                exit={{ opacity: 0, scale: 0.94, x: -20 }}
                transition={{
                  duration: 0.4,
                }}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.15))',
                }}
              />
            </AnimatePresence>
          </div>

          {/* Kit details */}
          <div style={{ flex: 1, minWidth: 250 }}>
            <small
              style={{
                color: kits[selectedKit].color,
                letterSpacing: '.2em',
                fontSize: 14,
                fontWeight: 600,
                marginBottom: 8,
              }}
            >
              {kits[selectedKit].name.toUpperCase()}
            </small>
            <h3 style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>{kits[selectedKit].title}</h3>
            <motion.p
              key={selectedKit}
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 1 }}
              style={{ fontSize: 20, fontWeight: 700, color: 'var(--rose)', marginBottom: 16 }}
            >
              {kits[selectedKit].price}
            </motion.p>

            {/* Items */}
            <ul style={{ listStyle: 'none', padding: 0, margin: '16px 0' }}>
              {kits[selectedKit].items.map((item) => (
                <li key={item} style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
                  <Led c={kits[selectedKit].color} />
                  <span style={{ fontSize: 16 }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Tilt>

      {/* Kit selector */}
      <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginBottom: 20 }}>
        {kits.map((kit, i) => (
          <motion.button
            key={kit.name}
            className="glass"
            style={{
              padding: '12px 24px',
              cursor: 'pointer',
              background: selectedKit === i ? kit.color : 'rgba(255,255,255,0.05)',
              border: `2px solid ${selectedKit === i ? kit.color : 'rgba(255,255,255,0.2)'}`,
            }}
            onClick={() => setSelectedKit(i)}
            whileHover={{ scale: 1.05 }}
          >
            <span style={{ color: selectedKit === i ? '#fff' : kit.color, fontWeight: 600 }}>
              {kit.name}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Differentials */}
      <motion.div
        style={{
          display: 'grid',
          gap: 12,
          gridTemplateColumns: 'repeat(3, 1fr)',
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {differentials.map((d, i) => (
          <motion.div
            key={d.text}
            className="glass"
            style={{
              padding: 16,
              textAlign: 'center',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
            whileHover={{ scale: 1.03 }}
          >
            <motion.img
              src={d.icon}
              alt={d.text}
              style={{
                width: 36,
                height: 36,
                objectFit: 'contain',
                marginBottom: 8,
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))',
              }}
              whileHover={{ scale: 1.1 }}
            />
            <p style={{ fontSize: 18, lineHeight: 1.3 }}>{d.text}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Floating icons */}
      <FloatingIcons
        icons={[
          { src: priceImg, alt: 'Price', size: 48 },
          { src: trophyImg, alt: 'Quality', size: 52 },
          { src: rocketImg, alt: 'Delivery', size: 56 },
        ]}
        positions={[
          { top: 100, left: 50 },
          { top: 80, right: 60 },
          { bottom: 120, left: 80 },
        ]}
      />
    </>
  );
}

export default S4;