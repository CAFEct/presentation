import { motion } from 'framer-motion';
import Eyebrow, { Led } from '../Eyebrow';
import Tilt from '../Tilt';
import { Lead } from '../Typography';

function S1() {
  const faces = ['Kits', 'Peças', 'Curso', 'Certificado'];

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 30 }}>
      <div style={{ flex: 1.5 }}>
        <Eyebrow>Kits de manicure · Peças avulsas · Curso</Eyebrow>
        <motion.h1 variants="item">Esmalt'up</motion.h1>
        <Lead style={{ marginTop: 18 }}>
          Uma forma completa de começar sua carreira como profissional de unhas.
        </Lead>
        <motion.div
          variants="item"
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
        <motion.p
          variants="item"
          className="tag"
          style={{ marginTop: 26 }}
        >
          [Nomes da equipe] · [Disciplina] · [Professor(a)]
        </motion.p>
      </div>
      <motion.div
        variants="item"
        style={{
          flex: 0.9,
          display: 'grid',
          placeItems: 'center',
          perspective: 900,
          height: 360,
        }}
      >
        <motion.div
          className="cube"
          animate={{ rotateY: 360, rotateX: [-18, 18, -18] }}
          transition={{
            rotateY: { duration: 20, repeat: Infinity, ease: 'linear' },
            rotateX: { duration: 10, repeat: Infinity, ease: 'easeInOut' },
          }}
        >
          {faces.map((f, i) => (
            <div
              key={f}
              className="face"
              style={{ transform: `rotateY(${i * 90}deg) translateZ(85px)` }}
            >
              {f}
            </div>
          ))}
          <div
            className="face"
            style={{ transform: 'rotateX(90deg) translateZ(85px)', fontSize: 44 }}
          >
            ✦
          </div>
          <div
            className="face"
            style={{ transform: 'rotateX(-90deg) translateZ(85px)', fontSize: 44 }}
          >
            💅
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default S1;