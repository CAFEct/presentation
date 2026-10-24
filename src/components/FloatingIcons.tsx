import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface FloatingIcon {
  src: string;
  alt: string;
  size?: number;
}

interface FloatingIconsProps {
  icons: FloatingIcon[];
  positions?: { top?: number; bottom?: number; left?: number; right?: number }[];
}

function FloatingIcons({ icons, positions = [] }: FloatingIconsProps) {
  const [shouldAnimate, setShouldAnimate] = useState(true);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setShouldAnimate(!mediaQuery.matches);
    const handler = () => setShouldAnimate(!mediaQuery.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  if (!shouldAnimate) return null;

  return (
    <>
      {icons.map((icon, i) => {
        const pos = positions[i] || {};
        const size = icon.size || 56;
        const duration = 10 + Math.random() * 6; // 10-16s total cycle
        const floatDuration = 8 + Math.random() * 6; // 8-14s floating
        const verticalOffset = 12 + Math.random() * 16; // 12-28px
        const rotation = 6 + Math.random() * 6; // ±6°
        const delay = Math.random() * 3; // Random start delay

        return (
          <motion.img
            key={i}
            src={icon.src}
            alt={icon.alt}
            style={{
              position: 'absolute',
              width: size,
              height: size,
              objectFit: 'contain',
              opacity: 0,
              filter: 'blur(0px)',
              zIndex: 0,
              pointerEvents: 'none',
              ...pos,
            }}
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 0.6 + Math.random() * 0.2, 0.6 + Math.random() * 0.2, 0],
              y: [0, -verticalOffset, verticalOffset, 0],
              rotate: [0, rotation, -rotation, 0],
            }}
            transition={{
              duration: floatDuration,
              delay: delay,
              repeat: Infinity,
              repeatDelay: 1 + Math.random() * 2, // 1-3s pause
              ease: 'easeInOut',
            }}
          />
        );
      })}
    </>
  );
}

export default FloatingIcons;
