import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface EyebrowProps {
  children: ReactNode;
  color?: string;
}

const item = {
  enter: { opacity: 0, y: -10 },
  center: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 80, damping: 15 } },
};

const Led = ({ c, delay = 0 }: { c: string; delay?: number }) => (
  <span className="led" style={{ '--c': c, animationDelay: `${delay}s` } as React.CSSProperties} />
);

function Eyebrow({ children, color }: EyebrowProps) {
  return (
    <motion.div variants={item} className="eyebrow">
      <Led c={color || 'var(--rose)'} />
      {children}
    </motion.div>
  );
}

export default Eyebrow;
export { Led };