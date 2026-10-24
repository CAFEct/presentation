import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

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

interface H2Props {
  children: ReactNode;
}

const H2 = ({ children }: H2Props) => (
  <motion.h2 variants={item} style={{ fontSize: '42px', fontWeight: 700, lineHeight: 1.12, marginBottom: 24 }}>
    {children}
  </motion.h2>
);

interface LeadProps {
  children: ReactNode;
  style?: React.CSSProperties;
}

const Lead = ({ children, style }: LeadProps) => (
  <motion.p variants={item} className="lead" style={style}>
    {children}
  </motion.p>
);

export { H2, Lead };