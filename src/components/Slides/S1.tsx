import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import Eyebrow, { Led } from '../Eyebrow';
import { Lead } from '../Typography';
import { useEffect, useState } from 'react';

// Nail logo image
const nailLogoImg = './public/imgs/sem_background.png';

const item = {
  enter: { opacity: 0, y: 46, rotateX: -28, scale: 0.94 },
  center: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 80, damping: 15 },
  },
};

function S1() {
  const [shouldAnimate, setShouldAnimate] = useState(true);
  const [isShaking, setIsShaking] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setShouldAnimate(!mediaQuery.matches);
    const handler = () => setShouldAnimate(!mediaQuery.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Tremidinha shake every 6 seconds
  useEffect(() => {
    if (!shouldAnimate) return;
    const interval = setInterval(() => {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 600);
    }, 6000);
    return () => clearInterval(interval);
  }, [shouldAnimate]);

  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 140, damping: 14 });
  const sry = useSpring(ry, { stiffness: 140, damping: 14 });

  const move = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    ry.set(px * 20);
    rx.set(-py * 20);
  };

  const leave = () => {
    rx.set(0);
    ry.set(0);
  };

  const title = "Esmalt'up";

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 30 }}>
      <div style={{ flex: 1.5 }}>
        <Eyebrow>Kits de manicure · Peças avulsas · Curso</Eyebrow>
        <motion.h1 variants={item} style={{ fontSize: 72, fontWeight: 800, lineHeight: 1.1 }}>
          {title.split('').map((letter, i) => (
            <motion.span
              key={i}
              animate={shouldAnimate ? {
                y: [-4, 4, -4],
              } : {}}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.08,
              }}
            >
              {letter}
            </motion.span>
          ))}
        </motion.h1>
        <Lead style={{ marginTop: 18 }}>
          Uma forma completa de começar sua carreira como profissional de unhas.
        </Lead>
        <motion.div
          variants={item}
          style={{ marginTop: 30, display: 'flex', gap: 12, flexWrap: 'wrap' }}
        >
          {[
            ['Kits', 'var(--rose)'],
            ['Peças avulsas', 'var(--blue)'],
            ['Curso profissional', 'var(--mint)'],
          ].map(([t, c], i) => (
            <motion.span
              key={t}
              className="glass chip"
              style={{ '--c': c, padding: '10px 18px' } as React.CSSProperties}
              whileHover={{ scale: 1.08, y: -4 }}
            >
              <Led c={c} delay={i * 0.4} />
              {t}
            </motion.span>
          ))}
        </motion.div>
      </div>

      {/* Nail Logo with continuous balancing motion */}
      <motion.div
        variants={item}
        style={{
          flex: 0.9,
          display: 'grid',
          placeItems: 'center',
          perspective: 1000,
          height: 360,
        }}
      >
        <motion.div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            perspective: 1000,
            transformStyle: 'preserve-3d',
            rotateX: srx,
            rotateY: sry,
          }}
          onMouseMove={move}
          onMouseLeave={leave}
        >
          <motion.img
            src={nailLogoImg}
            alt="Logo da Unha Esmalt'up"
            style={{
              width: 250,
              height: 250,
              objectFit: 'contain',
              filter: 'drop-shadow(0 8px 15px rgba(0, 0, 0, 0.2))',
              transform: 'translateZ(0)',
              transformOrigin: 'top center',
            }}
            animate={shouldAnimate ? {
              rotateZ: isShaking
                ? [0, 8, -8, 8, -8, 8, 0]
                : [-5, 5, -5],
            } : {}}
            transition={{
              duration: isShaking ? 0.6 : 4,
              repeat: Infinity,
              ease: isShaking ? 'easeOut' : 'easeInOut',
            }}
            whileHover={{ scale: 1.08 }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}

export default S1;