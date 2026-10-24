import { motion } from 'framer-motion';
import Eyebrow, { Led } from '../Eyebrow';
import Tilt from '../Tilt';
import Counter from '../Counter';

// Image paths
const modIcon = './public/imgs/formatura.png';
const courseImg = './public/imgs/camera.png';

function S5() {
  const mods = [
    { num: 6, title: 'Unha e Segurança', desc: 'Materiais essenciais e biossegurança', color: 'var(--rose)' },
    { num: 5, title: 'Cutilagem e Esmaltação', desc: 'Mãos e pés perfeitos', color: 'var(--blue)' },
    { num: 4, title: 'Nail Art', desc: 'Decoração e francesinha', color: 'var(--mint)' },
    { num: 4, title: 'Unhas de Gel', desc: 'Uma técnica premium', color: 'var(--gold)' },
    { num: 4, title: 'Sua Carreira', desc: 'Como montar sua agenda', color: 'var(--red)' },
  ];

  // Total lessons
  const totalLessons = mods.reduce((sum, m) => sum + m.num, 0);

  return (
    <>
      <Eyebrow>Curso com especialistas</Eyebrow>
      <motion.h2
        variants="item"
        style={{
          fontSize: 48,
          fontWeight: 800,
          lineHeight: 1.1,
          marginBottom: 24,
        }}
      >
        Aprenda com as <em>melhores profissionais</em>
      </motion.h2>

      {/* Course pathway visualization */}
      <div
        style={{
          position: 'relative',
          height: 280,
          marginBottom: 30,
          padding: '0 40px',
        }}
      >
        {/* Path line */}
        <svg
          viewBox="0 0 100 30"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            overflow: 'visible',
          }}
        >
          <path
            d="M 10 20 C 30 5, 70 5, 90 20"
            fill="none"
            stroke="rgba(240, 169, 191, 0.3)"
            strokeWidth="2"
          />
          {/* Nodes */}
          {mods.map((mod, i) => (
            <g key={mod.title}>
              <circle
                cx={10 + i * 20}
                cy={20}
                r="8"
                fill={mod.color}
                stroke="#fff"
                strokeWidth="2"
              />
              <circle
                cx={10 + i * 20}
                cy={20}
                r="4"
                fill="#fff"
              />
            </g>
          ))}
        </svg>

        {/* Animated logo traveling along path */}
        <motion.div
          style={{
            position: 'absolute',
            top: '50%',
            left: '10%',
            transform: 'translate(-50%, -50%)',
            rotate: 0,
          }}
          animate={{
            x: [0, 80],
            rotate: [0, 360],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'linear',
            delay: 1,
          }}
        >
          <img
            src={modIcon}
            alt="Logo"
            style={{
              width: 40,
              height: 40,
              objectFit: 'contain',
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))',
            }}
          />
        </motion.div>
      </div>

      {/* Module cards */}
      <div className="grid c5" style={{ height: 220, gap: 16 }}>
        {mods.map((mod, i) => (
          <Tilt key={mod.title} ledColor={mod.color}>
            <div style={{ textAlign: 'center' }}>
              <motion.div
                className="glass"
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  display: 'grid',
                  placeItems: 'center',
                  marginBottom: 12,
                }}
                whileHover={{ scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              >
                <span style={{ fontSize: 24, fontWeight: 700, color: mod.color }}>{mod.num}</span>
              </motion.div>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>{mod.title}</h3>
              <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.3 }}>{mod.desc}</p>
            </div>
          </Tilt>
        ))}
      </div>

      {/* Stats */}
      <motion.div
        className="row"
        style={{ justifyContent: 'center', marginTop: 24 }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <span style={{ fontSize: 28 }}>
          <b className="neon" style={{ color: 'var(--rose)', fontSize: 36 }}>
            <Counter to={totalLessons} />
          </b>{' '}
          aulas em vídeo + certificado
        </span>
      </motion.div>

      <motion.p variants="item" style={{ marginTop: 16, fontSize: 16, color: 'var(--muted)' }}>
        4–6 semanas · no seu ritmo · comunidade exclusiva
      </motion.p>
    </>
  );
}

export default S5;
