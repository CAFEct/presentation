import { motion, useMotionValue, useSpring } from 'framer-motion';
import type { ReactNode } from 'react';

interface TiltProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  strength?: number;
  led?: boolean;
  ledColor?: string;
}

function Tilt({ children, className = '', style = {}, strength = 9, led, ledColor }: TiltProps) {
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 140, damping: 14 });
  const sry = useSpring(ry, { stiffness: 140, damping: 14 });

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

  const move = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    ry.set(px * strength * 2);
    rx.set(-py * strength * 2);
  };

  const leave = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <motion.div variants={item} style={{ transformStyle: 'preserve-3d', ...style }}>
      <motion.div
        className={`glass card ${className}`}
        style={{
          rotateX: srx,
          rotateY: sry,
          transformStyle: 'preserve-3d',
          height: '100%',
          '--c': ledColor || 'var(--rose)',
        } as React.CSSProperties}
        whileHover={{
          scale: 1.03,
          y: -4,
          boxShadow:
            '0 30px 60px -12px rgba(0, 0, 0, 0.65), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
        }}
        transition={{ type: 'spring', stiffness: 200, damping: 18 }}
        onMouseMove={move}
        onMouseLeave={leave}
      >
        <div style={{ transform: 'translateZ(26px)', height: '100%' }}>{children}</div>
      </motion.div>
    </motion.div>
  );
}

export default Tilt;