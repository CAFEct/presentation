import { motion } from 'framer-motion';
import { Lead } from '../Typography';

function S10() {
  return (
    <div
      style={{
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <motion.h1 variants="item" style={{ fontSize: 120 }}>
        Obrigado!
      </motion.h1>
      <Lead style={{ marginTop: 22, textAlign: 'center' }}>
        Obrigado por ficar até o final.
      </Lead>
      <motion.div variants="item" style={{ marginTop: 34 }}>
        <motion.span className="glass chip" whileHover={{ scale: 1.06, y: -3 }}>
          ✦ Esmalt'up
        </motion.span>
      </motion.div>
    </div>
  );
}

export default S10;