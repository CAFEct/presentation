import { motion, useMotionValue, useSpring } from 'framer-motion';
import type { CSSProperties } from 'react';

interface ImageIconProps {
  src: string;
  alt: string;
  size?: number;
  className?: string;
  style?: CSSProperties;
  colored?: boolean;
}

const ImageIcon = ({
  src,
  alt,
  size = 44,
  className = '',
  style = {},
  colored = false,
}: ImageIconProps) => {
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 140, damping: 14 });
  const sry = useSpring(ry, { stiffness: 140, damping: 14 });

  const move = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    ry.set(px * 15);
    rx.set(-py * 15);
  };

  const leave = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <motion.div
      style={{ display: 'inline-block' }}
    >
      <motion.img
        src={src}
        alt={alt}
        className={className}
        style={{
          width: size,
          height: size,
          objectFit: 'contain',
          filter: colored
            ? 'drop-shadow(0 6px 12px rgba(0, 0, 0, 0.5))'
            : 'drop-shadow(0 6px 10px rgba(0, 0, 0, 0.4))',
          transformStyle: 'preserve-3d',
          rotateX: srx,
          rotateY: sry,
          ...style,
        } as CSSProperties}
        onMouseMove={move}
        onMouseLeave={leave}
        whileHover={{ scale: 1.15 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      />
    </motion.div>
  );
};

export default ImageIcon;