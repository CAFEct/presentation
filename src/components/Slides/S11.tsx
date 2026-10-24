import { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';

/* ------------------------------------------------------------------ */
/*  Slide 11 — Premium Glassmorphism Showcase                           */
/*  Modern cinematic presentation design with 3D depth               */
/* ------------------------------------------------------------------ */

// --- Gradient Background ---
const DARK_PURPLE = '#1a0a2a';
const DEEP_BLACK = '#07040a';
const PINK_ACCENT = '#f0a9bf';
const MAGENTA_GLOW = '#d9708f';

// --- Card Data ---
interface CardData {
  title: string;
  description: string;
  icon: string;
  badge: string;
  features: string[];
}

const cards: CardData[] = [
  {
    title: 'Kit Profissional Premium',
    description: 'Construído com materiais de alta qualidade para resultados impecáveis',
    icon: '/imgs/paleta.png',
    badge: 'KITS',
    features: [
      '50+ peças profissionais',
      'Organização inteligente',
      'Durabilidade premium',
      'Experiência de uso luxo'
    ]
  },
  {
    title: 'Curso Especializado',
    description: 'Aprenda técnicas avançadas com nossos especialistas certificados',
    icon: '/imgs/formatura.png',
    badge: 'CURSO',
    features: [
      '23 aulas + bônus exclusivos',
      'Módulos do básico ao avançado',
      'Suporte técnico 24/7',
      'Certificação reconhecida'
    ]
  },
  {
    title: 'Componentes Avulsos',
    description: 'Peças de qualidade para personalizar sua experiência profissional',
    icon: '/imgs/wrench.png',
    badge: 'PEÇAS',
    features: [
      '200+ itens disponíveis',
      'Compatibilidade total',
      'Entrega rápida garantida',
      'Garantia estendida'
    ]
  }
];

// --- Animation Variants ---
const pageVariants = {
  hidden: {
    opacity: 0,
    y: 30
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15
    }
  }
};

const headlineVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    filter: 'blur(10px)'
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

const subtitleVariants = {
  hidden: {
    opacity: 0,
    y: 15
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
      delay: 0.1
    }
  }
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 40,
    rotateX: -15,
    rotateY: 10,
    scale: 0.92
  },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    rotateY: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 80,
      damping: 18,
      mass: 0.9
    }
  }
};

const badgeVariants = {
  initial: { scale: 0, opacity: 0 },
  animate: {
    scale: 1,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 220,
      damping: 14,
      delay: 0.2
    }
  }
};

// --- 3D Card Component ---
interface GlassCardProps {
  card: CardData;
  index: number;
  isActive: boolean;
}

function GlassCard({ card, index, isActive }: GlassCardProps) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 120, damping: 18 });
  const sry = useSpring(ry, { stiffness: 120, damping: 18 });

  const move = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    ry.set(px * 25);
    rx.set(-py * 25);
  };

  const leave = () => {
    rx.set(0);
    ry.set(0);
  };

  // Floating idle animation
  const floatY = useMotionValue(0);
  const floatRot = useMotionValue(0);

  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => {
      floatY.set(Math.sin(Date.now() * 0.002) * 3);
      floatRot.set(Math.sin(Date.now() * 0.0015) * 1.5);
    }, 16);
    return () => clearInterval(id);
  }, [reduced, floatY, floatRot]);

  const badgeStyle = {
    background: `linear-gradient(135deg, ${PINK_ACCENT}, ${MAGENTA_GLOW})`,
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    color: 'transparent'
  } as React.CSSProperties;

  return (
    <motion.div
      variants={cardVariants}
      style={{
        flex: '0 0 320px',
        alignSelf: 'flex-start',
        perspective: 1200
      }}
    >
      <div
        ref={ref}
        onMouseMove={move}
        onMouseLeave={leave}
        style={{
          position: 'relative',
          width: '100%',
          padding: '32px 28px 28px',
          borderRadius: 28,
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(24px) saturate(1.6)',
          WebkitBackdropFilter: 'blur(24px) saturate(1.6)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          overflow: 'hidden',
          transformStyle: 'preserve-3d',
          rotateX: srx,
          rotateY: sry,
          willChange: 'transform'
        }}
        whileHover={{
          scale: 1.05,
          rotateX: -2,
          rotateY: 2,
          transition: {
            type: 'spring',
            stiffness: 200,
            damping: 16
          }
        }}
      >
        {/* Floating Badge */}
        <motion.div
          variants={badgeVariants}
          style={{
            position: 'absolute',
            top: -24,
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '8px 24px',
            borderRadius: 999,
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 0.08,
            textTransform: 'uppercase',
            boxShadow: '0 8px 32px rgba(217, 112, 143, 0.4)',
            color: '#fff',
            background: `linear-gradient(135deg, ${PINK_ACCENT}, ${MAGENTA_GLOW})`,
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)'
          }}
        >
          {card.badge}
        </motion.div>

        {/* Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.6, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease: 'easeOut' }}
          style={{
            width: 64,
            height: 64,
            marginBottom: 20,
            display: 'grid',
            placeItems: 'center',
            borderRadius: 20,
            background: 'rgba(240, 169, 191, 0.12)',
            border: '1px solid rgba(240, 169, 191, 0.25)'
          }}
        >
          <img
            src={card.icon}
            alt=""
            style={{ width: 36, height: 36, objectFit: 'contain', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' }}
          />
        </motion.div>

        {/* Content */}
        <h3
          style={{
            fontSize: 24,
            fontWeight: 700,
            lineHeight: 1.2,
            margin: '0 0 12px',
            background: 'linear-gradient(90deg, #fff, rgba(255,255,255,0.85))',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent'
          }}
        >
          {card.title}
        </h3>

        <p
          style={{
            fontSize: 15,
            lineHeight: 1.5,
            color: 'rgba(251, 238, 243, 0.75)',
            marginBottom: 20
          }}
        >
          {card.description}
        </p>

        {/* Features */}
        <ul
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            padding: 0,
            margin: 0,
            listStyle: 'none'
          }}
        >
          {card.features.map((feature, i) => (
            <motion.li
              key={feature}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.4 + i * 0.08 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                fontSize: 14,
                color: 'rgba(255, 255, 255, 0.6)'
              }}
            >
              <motion.span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: PINK_ACCENT,
                  boxShadow: `0 0 12px ${PINK_ACCENT}`,
                  display: 'grid',
                  placeItems: 'center'
                }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.25, delay: 0.5 }}
              >
                <motion.span
                  style={{
                    fontSize: 8,
                    fontWeight: 800,
                    color: '#fff'
                  }}
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                >✓</motion.span>
              </motion.span>
              {feature}
            </motion.li>
          ))}
        </ul>

        {/* Action Button */}
        <motion.button
          style={{
            marginTop: 'auto',
            padding: '12px 20px',
            borderRadius: 14,
            border: '1px solid rgba(240, 169, 191, 0.4)',
            background: 'linear-gradient(135deg, rgba(240, 169, 191, 0.15), rgba(217, 112, 143, 0.1))',
            color: '#fff',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8
          }}
          whileHover={{
            background: 'linear-gradient(135deg, rgba(240, 169, 191, 0.25), rgba(217, 112, 143, 0.2))',
            scale: 1.02,
            boxShadow: `0 0 24px rgba(240, 169, 191, 0.4)`
          }}
          whileTap={{ scale: 0.98 }}
        >
          Explorar
          <motion.span
            animate={{ x: [0, 4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{ fontSize: 16 }}>
            →
          </motion.span>
        </motion.button>
      </div>
    </motion.div>
  );
}

// --- Radial Glow Component ---
interface RadialGlowProps {
  color: string;
  opacity?: number;
  size: number;
  top: number | string;
  left: number | string;
  blur: number;
}

function RadialGlow({ color, opacity = 1, size, top, left, blur }: RadialGlowProps) {
  return (
    <motion.div
      style={{
        position: 'absolute',
        top: top,
        left: left,
        width: size,
        height: size,
        borderRadius: '50%',
        background: color,
        opacity: opacity,
        filter: `blur(${blur}px)`,
        pointerEvents: 'none',
        zIndex: 0
      }}
      animate={{
        opacity: [opacity, opacity + 0.15, opacity],
        scale: [1, 1.15, 1]
      }}
      transition={{
        duration: 6 + Math.random() * 4,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
    />
  );
}

// --- Noise SVG as data URI ---
const noiseSvg = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="256" height="256"%3E%3Cfilter id="noise"%3E%3Cfeiturbulence baseFrequency="0.9" numOctaves="4" stitchTiles="stitch"%3E%3C/feTurbulence%3E%3C/filter%3E%3Crect width="100%25" height="100%25" filter="url(%23noise)" opacity="0.1"/%3E%3C/svg%3E';

// --- Main Slide Component ---
function S11() {
  const reduced = useReducedMotion();
  const [inView, setInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Staggered reveal sequence
  useEffect(() => {
    if (reduced) {
      setInView(true);
      return;
    }
    const timer = setTimeout(() => {
      setInView(true);
    }, 400);
    return () => clearTimeout(timer);
  }, [reduced]);

  // 3D mouse tracking for entire page
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const srx = useSpring(mx, { stiffness: 40, damping: 30 });
  const sry = useSpring(my, { stiffness: 40, damping: 30 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      mx.set((e.clientX / innerWidth - 0.5) * 8);
      my.set((e.clientY / innerHeight - 0.5) * 6);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mx, my]);

  return (
    <section
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        transformStyle: 'preserve-3d',
        rotateX: sry,
        rotateY: srx
      }}
    >
      {/* Deep Purple Gradient Background */}
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          background: 'linear-gradient(135deg, #07040a 0%, #1a0a2a 40%, #0a001a 100%)',
          transition: 'background 20s linear'
        }}
        animate={{
          background: [
            'linear-gradient(135deg, #07040a 0%, #1a0a2a 40%, #0a001a 100%)',
            'linear-gradient(135deg, #0a001a 0%, #1a0a2a 40%, #07040a 100%)',
            'linear-gradient(135deg, #07040a 0%, #0a001a 40%, #1a0a2a 100%)'
          ]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'linear'
        }}
      />

      {/* Subtle Grid Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.35 }}
        transition={{ duration: 1.2, delay: 0.5 }}
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          backgroundImage: `
            linear-gradient(rgba(240, 169, 191, 0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(240, 169, 191, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          pointerEvents: 'none'
        }}
      />

      {/* Pink-Magenta Radial Glows */}
      <RadialGlow color={PINK_ACCENT} opacity={0.25} size={380} top={-120} left={-100} blur={120} />
      <RadialGlow color={MAGENTA_GLOW} opacity={0.2} size={420} top={120} left={-80} blur={140} />
      <RadialGlow color={PINK_ACCENT} opacity={0.15} size={280} top={300} left={160} blur={90} />

      {/* Noise Texture Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.08 }}
        transition={{ duration: 1.5, delay: 0.8 }}
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          pointerEvents: 'none',
          backgroundImage: noiseSvg,
          backgroundAttachment: 'fixed'
        }}
      />

      {/* Vignette Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        transition={{ duration: 2, delay: 1 }}
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          pointerEvents: 'none',
          background: 'radial-gradient(circle at 50% 50%, transparent 40%, rgba(0, 0, 0, 0.4) 100%)'
        }}
      />

      {/* Content Container */}
      <motion.div
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        variants={pageVariants}
        style={{
          position: 'relative',
          zIndex: 2,
          height: '100%',
          padding: '72px 80px 80px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        {/* Eyebrow */}
        <motion.div
          style={{
            marginBottom: 24,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            color: PINK_ACCENT,
            fontSize: 14,
            fontWeight: 600,
            letterSpacing: 0.25,
            textTransform: 'uppercase'
          }}
        >
          <motion.span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: PINK_ACCENT,
              boxShadow: `0 0 12px ${PINK_ACCENT}`,
              animation: 'pulse 2s ease-in-out infinite'
            }}
            animate={{
              boxShadow: [
                `0 0 8px ${PINK_ACCENT}`,
                `0 0 16px ${PINK_ACCENT}`,
                `0 0 8px ${PINK_ACCENT}`
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          apresentação premium
        </motion.div>

        {/* Main Headline */}
        <motion.h2
          variants={headlineVariants}
          style={{
            fontSize: 80,
            fontWeight: 800,
            lineHeight: 1.05,
            textAlign: 'center',
            margin: '0 0 20px',
            background: 'linear-gradient(90deg, #fff, #f0a9bf, #d9708f)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
            filter: 'blur(0px)'
          }}
        >
          Transforme sua carreira
          <br />
          <span style={{
            background: 'linear-gradient(90deg, #f0a9bf, #d9708f)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent'
          }}>com o Esmalt'up</span>
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          variants={subtitleVariants}
          style={{
            fontSize: 20,
            lineHeight: 1.5,
            color: 'rgba(251, 238, 243, 0.7)',
            maxWidth: 600,
            textAlign: 'center',
            margin: '0 0 40px'
          }}
        >
          Produtos exclusivos e conhecimento especializado para você começar sua jornada como profissional de manicure.
        </motion.p>

        {/* Cards Container */}
        <motion.div
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: 32,
            flexWrap: 'nowrap',
            alignItems: 'flex-start',
            justifyContent: 'center',
            width: '100%',
            maxWidth: 1400,
            paddingHorizontal: 40
          }}
        >
          {cards.map((card, i) => (
            <GlassCard key={card.title} card={card} index={i} isActive={inView} />
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          style={{
            marginTop: 56,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 16
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
        >
          <motion.button
            style={{
              padding: '16px 48px',
              borderRadius: 28,
              border: '1px solid rgba(240, 169, 191, 0.5)',
              background: 'linear-gradient(135deg, rgba(240, 169, 191, 0.2), rgba(217, 112, 143, 0.15))',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              color: '#fff',
              fontSize: 18,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.25s ease'
            }}
            whileHover={{
              scale: 1.05,
              boxShadow: `0 0 40px rgba(240, 169, 191, 0.5)`,
              background: 'linear-gradient(135deg, rgba(240, 169, 191, 0.3), rgba(217, 112, 143, 0.2))'
            }}
            whileTap={{ scale: 0.98 }}
          >
            Começar minha jornada
          </motion.button>

          <motion.p
            style={{
              fontSize: 13,
              color: 'rgba(255, 255, 255, 0.4)',
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            <motion.span
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              style={{ color: PINK_ACCENT }}
            >●</motion.span>
            Use as setas ou espaço para navegar
          </motion.p>
        </motion.div>
      </motion.div>

      {/* Global Styles */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.2); }
        }

        .content-wrapper {
          transform-style: preserve-3d;
        }

        @media (max-width: 960px) {
          .content-wrapper {
            padding: 72px 24px 60px;
          }

          h2 {
            font-size: 56px;
          }
        }

        @media (max-width: 600px) {
          .content-wrapper {
            padding: 60px 16px 50px;
          }

          h2 {
            font-size: 42px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .content-wrapper {
            transform: none !important;
            rotateX: 0 !important;
            rotateY: 0 !important;
          }
        }
      `}</style>
    </section>
  );
}

export default S11;