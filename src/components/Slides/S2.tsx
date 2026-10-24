import { motion, AnimatePresence } from 'framer-motion';
import Eyebrow from '../Eyebrow';
import { useState, useEffect } from 'react';
import FloatingIcons from '../FloatingIcons';

// Image paths from public folder
const worldImg = './public/imgs/world.png';
const moneyImg = './public/imgs/money.png';
const formaturaImg = './public/imgs/formatura.png';
const paletaImg = './public/imgs/paleta.png';
const wrenchImg = './public/imgs/wrench.png';

// Floating objects for chaos scene
const chaosObjects = [
  { src: worldImg, alt: 'Informação espalhada', x: -200, y: -100 },
  { src: moneyImg, alt: 'Preço', x: 200, y: -150 },
  { src: formaturaImg, alt: 'Curso', x: -150, y: 100 },
  { src: paletaImg, alt: 'Esmalte', x: 180, y: 80 },
  { src: wrenchImg, alt: 'Ferramenta', x: 0, y: -180 },
];

// Handwritten annotations
const annotations = [
  { text: 'Não sabem por onde começar', x: -300, y: -120 },
  { text: 'Materiais caros ou ruins', x: 280, y: -100 },
  { text: 'Curso mal estruturado', x: -280, y: 140 },
  { text: 'Sem suporte', x: 300, y: 120 },
];

interface S2Props {
  toggle?: boolean;
  setToggle?: (value: boolean) => void;
}

function S2({ toggle, setToggle }: S2Props) {
  const [shouldAnimate, setShouldAnimate] = useState(true);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setShouldAnimate(!mediaQuery.matches);
    const handler = () => setShouldAnimate(!mediaQuery.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const organized = toggle || false;

  return (
    <>
      <Eyebrow>O problema</Eyebrow>

      {/* Phase 1: Chaos */}
      <AnimatePresence mode="wait">
        {!organized ? (
          <motion.div
            key="chaos"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            style={{ textAlign: 'center', position: 'relative', height: 500, cursor: 'pointer' }}
            onClick={() => setToggle?.(!toggle)}
          >
            {/* Central question with typing effect */}
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                fontSize: 56,
                fontWeight: 800,
                marginBottom: 40,
                background: 'linear-gradient(90deg, var(--rose), var(--gold))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Por onde eu começo?
            </motion.h2>

            {/* Floating chaotic objects */}
            {chaosObjects.map((obj, i) => (
              <motion.img
                key={i}
                src={obj.src}
                alt={obj.alt}
                style={{
                  position: 'absolute',
                  width: 60 + Math.random() * 20,
                  height: 60 + Math.random() * 20,
                  objectFit: 'contain',
                  left: '50%',
                  top: '50%',
                  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))',
                }}
                animate={shouldAnimate ? {
                  x: [obj.x, obj.x + Math.random() * 40 - 20, obj.x],
                  y: [obj.y, obj.y + Math.random() * 40 - 20, obj.y],
                  rotate: [0, (Math.random() - 0.5) * 20, 0],
                } : {}}
                transition={{
                  duration: 4 + Math.random() * 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 0.2,
                }}
              />
            ))}

            {/* Question marks and dots */}
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                style={{
                  position: 'absolute',
                  fontSize: 24,
                  color: 'var(--rose)',
                  fontWeight: 700,
                  left: 50 + Math.random() * 80 + '%',
                  top: 30 + Math.random() * 60 + '%',
                }}
                animate={shouldAnimate ? {
                  opacity: [0.3, 0.8, 0.3],
                  scale: [1, 1.2, 1],
                } : {}}
                transition={{
                  duration: 2 + Math.random() * 2,
                  repeat: Infinity,
                  delay: i * 0.3,
                }}
              >
                ?
              </motion.div>
            ))}

            {/* Handwritten annotations with dotted lines */}
            {annotations.map((ann, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.3, duration: 0.5 }}
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  color: 'var(--rose)',
                  fontSize: 16,
                  fontWeight: 600,
                  transform: `translate(${ann.x}px, ${ann.y}px)`,
                  fontFamily: 'cursive',
                  border: '1px dashed var(--rose)',
                  padding: '8px 12px',
                  borderRadius: 8,
                  background: 'rgba(240, 169, 191, 0.1)',
                }}
              >
                {ann.text}
              </motion.div>
            ))}

            {/* "..." message */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              style={{
                position: 'absolute',
                bottom: 100,
                left: '50%',
                transform: 'translateX(-50%)',
                fontSize: 32,
                color: 'var(--muted)',
                letterSpacing: 8,
              }}
            >
              ...
            </motion.div>
          </motion.div>
        ) : (
          /* Phase 2: Organized */
          <motion.div
            key="organized"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            style={{ textAlign: 'center', position: 'relative', height: 500 }}
          >
            {/* Organized kit/tray */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="glass"
              style={{
                width: 400,
                height: 300,
                margin: '0 auto',
                borderRadius: 20,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 20,
                padding: 30,
                background: 'rgba(240, 169, 191, 0.1)',
                border: '2px solid var(--rose)',
              }}
            >
              {chaosObjects.map((obj, i) => (
                <motion.img
                  key={i}
                  src={obj.src}
                  alt={obj.alt}
                  style={{
                    width: 50,
                    height: 50,
                    objectFit: 'contain',
                  }}
                  initial={{ scale: 0, rotate: Math.random() * 360 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                />
              ))}
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              style={{
                fontSize: 56,
                fontWeight: 800,
                marginTop: 40,
                background: 'linear-gradient(90deg, var(--rose), var(--gold))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Agora você sabe.
            </motion.h2>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 16,
                marginTop: 20,
              }}
            >
              <span style={{ fontSize: 32, fontWeight: 800, color: 'var(--rose)' }}>
                Esmalt'up
              </span>
              <img
                src="./public/imgs/sem_background.png"
                alt="Logo"
                style={{ width: 50, height: 50, objectFit: 'contain' }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating icons in background */}
      <FloatingIcons
        icons={[
          { src: worldImg, alt: 'Info', size: 48 },
          { src: moneyImg, alt: 'Money', size: 52 },
          { src: formaturaImg, alt: 'Course', size: 56 },
        ]}
        positions={[
          { top: 80, left: 60 },
          { top: 120, right: 80 },
          { bottom: 140, left: 100 },
        ]}
      />
    </>
  );
}

export default S2;