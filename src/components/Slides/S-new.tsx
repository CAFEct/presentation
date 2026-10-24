import { useEffect, useState, type ReactNode } from 'react';
import { motion, AnimatePresence, useReducedMotion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Eyebrow from '../Eyebrow';
import { Lead } from '../Typography';

const GridSize = 80;

function GridBackground({ reduced }: { reduced: boolean }) {
  const [size, setSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    const updateSize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  const u = useTransform(size.width, [0, 1920], [GridSize, GridSize * 2]);
  const v = useTransform(size.height, [0, 1080], [GridSize, GridSize * 2]);
  return reduced
    ? null
    : motion.rect {
        width: size.width,
        height: size.height,
        style: {
          backgroundImage: `linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)`,
          backgroundSize: `${u}px ${v}px`,
          opacity: 0.8,
        },
        animate: {
          backgroundPosition: [`-${u}px -${v}px`, `0 0`],
          transition: { duration: 20, repeat: Infinity, ease: 'linear' },
        },
        className: 'grid-overlay',
      };
}
export default function S2Premium() {
  const [reduced, setReduced] = useState(false);
  const [idx, setIdx] = useState(0);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  useEffect(() => {
    const updateScale = () => {
      setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  const go = (n: number) => setIdx((i) => Math.max(0, Math.min(4, n)));

  const steps = [
    {
      title: 'Descomplicando',
      subtitle: 'O caminho mais rápido para crescer na carreira',
      badge: 'Novo',
    },
    {
      title: 'Planejamento',
      subtitle: 'Estratégias personalizadas para o seu objetivo',
      badge: 'Planejado',
    },
    {
      title: 'Execução',
      subtitle: 'Resultados mensuráveis em menos tempo',
      badge: 'Acelerado',
    },
    {
      title: 'Escala',
      subtitle: 'Leve seu negócio ao próximo nível',
      badge: 'Expandido',
    },
    {
      title: 'Liderança',
      subtitle: 'Comando e influência digital',
      badge: 'Premium',
    },
  ];
return (
<AnimatePresence mode="wait">
            {idx === 0 && (
              <motion.h1
                initial={{ opacity: 0, y: -40, filter: 'blur(20px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] }}}
                style={{
                  fontSize: 72,
                  fontWeight: 800,
                  lineHeight: 1.1,
                  color: '#fff',
                  letterSpacing: '-0.03em',
                  marginBottom: 32,
                  textShadow: '0 2px 20px rgba(0,0,0,0.3)',
                  marginTop: 40,
                }}
              >
                Transforme sua
              </motion.h1>
            )}
          </AnimatePresence>
          <AnimatePresence mode="wait">
            {idx === 0 && (
              <motion.h1
                initial={{ opacity: 0, y: -40, filter: 'blur(20px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}}
                style={{
                  fontSize: 72,
                  fontWeight: 800,
                  lineHeight: 1.1,
                  color: '#fff',
                  letterSpacing: '-0.03em',
                  marginBottom: 32,
                  textShadow: '0 2px 20px rgba(0,0,0,0.3)',
                }}
              >
                Carreira de
              </motion.h1>
            )}
          </AnimatePresence>
          <AnimatePresence mode="wait">
            {idx === 0 && (
              <motion.h1
                initial={{ opacity: 0, y: -40, filter: 'blur(20px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 1.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}}
                style={{
                  fontSize: 72,
                  fontWeight: 800,
                  lineHeight: 1.1,
                  color: '#fff',
                  letterSpacing: '-0.03em',
                  marginBottom: 32,
                  textShadow: '0 2px 20px rgba(0,0,0,0.3)',
                }}
              >
                Profissional
              </motion.h1>
            )}
          </AnimatePresence>
          <div style={{ marginTop: 40, maxWidth: 600 }}>
            <Lead
              style={{
                fontSize: 20,
                color: 'rgba(255, 255, 255, 0.7)',
                lineHeight: 1.8,
                marginBottom: 32,
              }}
            >
              Do zero ao topo na carreira de unhas. Kits completos, peças avulsas e treinamento profissional certificados.
            </Lead>
            <div style={{ display: 'flex', gap: 16 }}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  padding: '14px 32px',
                  borderRadius: 32,
                  border: 'none',
                  fontSize: 16,
                  fontWeight: 700,
                  color: '#fff',
                  background: 'linear-gradient(135deg, #1a0e2e, #0a0a0f)',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease',
                  minWidth: 180,
                }}
                animate={{ scale: [1, 1.05, 1] }}
              >
                Começar Agora
                <svg width: 20 height: 20 viewBox: "0 0 24 24" fill: "none" stroke: "currentColor" strokeWidth: 2>
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  padding: '14px 32px',
                  borderRadius: 32,
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  fontSize: 16,
                  fontWeight: 700,
                  color: 'rgba(255, 255, 255, 0.6)',
                  background: 'transparent',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease',
                }}
                animate={{ scale: [1, 1.03, 1] }}
              >
                Assistir depoimento
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: 32,
          left: 32,
          right: 32,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          color: 'rgba(255, 255, 255, 0.4)',
          fontSize: 12,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
        }}
      >
        <span>Swipe navigational · Space para fullscreen</span>
        <span>{idx + 1} / {5}</span>
      </div>

      {reduced && (
        <div
          style={{
            position: 'absolute',
            top: 32,
            left: 32,
            padding: 24,
            background: 'rgba(0,0,0,0.7)',
            borderRadius: 20,
            backdropFilter: 'blur(10px)',
            color: '#fff',
          }}
        >
          <h3 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Premium Presentation</h3>
          <p style={{ margin: '12px 0 0', color: 'rgba(255,255,255,0.5)' }}>Modo de movimento reduzido ativo</p>
        </div>
      )}
    </div>
  );
}"}/svg+xml,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'200\\' height=\\'200\\'%3E%3Cfilter id=\\'noise\\'%3E%3CfeTurbulence type=\\'fractalNoise\\' baseFrequency=\\.9\\' numOctaves=\\'4\\' stitchTiles=\\'stitch\\'/%3E%3E/filter%3E%3Crect width=\\'100%\\' height=\\'100\\' fill=\\'url(%23noise)\\' /%3E%3C/svg\\>")',
          }
        }}
        animate={{ opacity: [1, 0.9, 1] }}
      />
      <div
        style={{
          position: 'absolute',
          borderRadius: '50%',
          filter: 'blur(80px)',
          background: 'radial-gradient(circle, rgba(255, 107, 107, 0.08) 0%, transparent 70%)',
          opacity: 0.6,
          top: -100,
          right: -100,
        }}
        animate={{ top: [-100, -50, -100], right: [-100, 50, -100], opacity: [0.4, 0.6, 0.4], transition: { duration: 15, repeat: Infinity, ease: 'easeInOut' } }}
      />
      <div
        style={{
          position: 'absolute',
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 107, 107, 0.05) 0%, transparent 70%)',
          filter: 'blur(60px)',
          opacity: 0.4,
          left: -200,
          top: 50,
        }}
        animate={{ left: [-200, 50, -200], top: [50, 100, 50], opacity: [0.3, 0.5, 0.3], transition: { duration: 20, repeat: Infinity, ease: 'easeInOut' } }}
      />
      <div
        style={{
          position: 'absolute',
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 170, 255, 0.05) 0%, transparent 70%)',
          filter: 'blur(50px)',
          opacity: 0.3,
          right: -150,
          bottom: -100,
        }}
        animate={{ right: [-150, 100, -150], bottom: [-100, 50, -100], opacity: [0.2, 0.4, 0.2], transition: { duration: 18, repeat: Infinity, ease: 'easeInOut' } }}
      />

      <div style={{ position: 'relative', zIndex: 10, padding: '60px 24px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>