import { motion } from 'framer-motion';
import Eyebrow, { Led } from '../Eyebrow';
import Tilt from '../Tilt';

function S7() {
  const st = [
    ['Escolha', 'seu kit ou os materiais que quer', '🛍️'],
    ['Aprenda', 'assistindo aos vídeos do curso', '🎬'],
    ['Pratique', 'com material profissional', '💅'],
    ['Complete', 'todas as aulas até o final', '✅'],
    ['Receba', 'seu certificado de conclusão', '🏅'],
    ['Comece', 'sua nova carreira!', '🚀'],
  ];

  return (
    <>
      <Eyebrow>Como funciona na prática</Eyebrow>
      <motion.h2
        variants="item"
        style={{
          fontSize: 42,
          fontWeight: 700,
          lineHeight: 1.12,
          marginBottom: 24,
        }}
      >
        Passo a passo <em>simples</em>
      </motion.h2>
      <div style={{ position: 'relative' }}>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.8, duration: 1.8, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            top: 34,
            left: '6%',
            right: '6%',
            height: 3,
            transformOrigin: 'left',
            background:
              'linear-gradient(90deg, var(--mint), var(--rose), var(--gold))',
            borderRadius: 3,
          }}
        />
        <div className="grid c6" style={{ gap: 14 }}>
          {st.map(([t, d, i], k) => (
            <motion.div key={t} variants="item" style={{ textAlign: 'center' }}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8 + k * 0.28, type: 'spring', stiffness: 200 }}
                className="glass"
                style={{
                  width: 68,
                  height: 68,
                  borderRadius: '50%',
                  margin: '0 auto 16px',
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: 28,
                  padding: 0,
                }}
              >
                {i}
              </motion.div>
              <Tilt strength={14}>
                <b style={{ color: 'var(--rose)', fontSize: 13 }}>
                  0{k + 1}
                </b>
                <h3 style={{ margin: '4px 0 6px', fontSize: 18 }}>{t}</h3>
                <p style={{ fontSize: 13 }}>{d}</p>
              </Tilt>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
}

export default S7;