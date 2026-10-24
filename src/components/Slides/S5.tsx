import { motion } from 'framer-motion';
import Eyebrow, { Led } from '../Eyebrow';
import Tilt from '../Tilt';
import Counter from '../Counter';

function S5() {
  const mods = [
    ['Unha e Segurança', 6, 'Materiais essenciais e biossegurança', 'var(--rose)'],
    ['Cutilagem e Esmaltação', 5, 'Mãos e pés perfeitos', 'var(--blue)'],
    ['Nail Art', 4, 'Decoração e francesinha', 'var(--mint)'],
    ['Unhas de Gel', 4, 'Uma técnica premium', 'var(--gold)'],
    ['Sua Carreira', 4, 'Como montar sua agenda', 'var(--red)'],
  ];

  return (
    <>
      <Eyebrow>Curso com especialistas</Eyebrow>
      <motion.h2
        variants="item"
        style={{
          fontSize: 42,
          fontWeight: 700,
          lineHeight: 1.12,
          marginBottom: 24,
        }}
      >
        Aprenda com as <em>melhores profissionais</em>
      </motion.h2>
      <div className="grid c5" style={{ height: 240 }}>
        {mods.map(([t, n, d, c], i) => (
          <Tilt key={t} ledColor={c}>
            <div className="big" style={{ fontSize: 48, color: c, textShadow: 'none' }}>
              {n}
            </div>
            <small style={{ color: 'var(--muted)' }}>aulas</small>
            <h3>{t}</h3>
            <p>{d}</p>
          </Tilt>
        ))}
      </div>
      <motion.div
        variants="item"
        style={{ display: 'flex', gap: 6, margin: '20px 0 10px' }}
      >
        {mods
          .flatMap(([, n, , c]) => Array.from({ length: n }, (_, k) => c))
          .map((c, i) => (
            <motion.div
              key={i}
              initial={{ scaleY: 0, opacity: 0 }}
              animate={{ scaleY: 1, opacity: 1 }}
              transition={{ delay: 0.9 + i * 0.05 }}
              style={{
                flex: 1,
                height: 10,
                borderRadius: 3,
                background: c,
                opacity: 0.85,
              }}
            />
          ))}
      </motion.div>
      <motion.div
        variants="item"
        className="row"
        style={{ justifyContent: 'space-between' }}
      >
        <span style={{ fontSize: 20 }}>
          <b className="neon" style={{ color: 'var(--rose)', fontSize: 30 }}>
            <Counter to={23} />
          </b>{' '}
          aulas em vídeo + certificado
        </span>
        <span style={{ fontSize: 14, color: 'var(--muted)' }}>
          4–6 semanas · no seu ritmo · comunidade exclusiva
        </span>
      </motion.div>
    </>
  );
}

export default S5;