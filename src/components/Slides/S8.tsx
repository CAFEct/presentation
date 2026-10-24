import { motion } from 'framer-motion';
import Eyebrow from '../Eyebrow';
import Tilt from '../Tilt';

function S8() {
  const t = [
    [
      'Comprei o kit básico e fiz o curso completo. Agora tenho minha própria assistência de manicure e estou faturando!',
      'Carla S.',
      'cliente desde 2024',
    ],
    [
      'As aulas de gel me ajudaram a entender uma técnica que antes parecia impossível. Recomendo 100%!',
      'Mariana R.',
      'profissional há 6 meses',
    ],
    [
      'O certificado ajudou muito na hora de me apresentar como profissional.',
      'Ana P.',
      'recém-formada',
    ],
  ];

  return (
    <>
      <Eyebrow>Depoimentos</Eyebrow>
      <motion.h2
        variants="item"
        style={{
          fontSize: 42,
          fontWeight: 700,
          lineHeight: 1.12,
          marginBottom: 24,
        }}
      >
        Quem já fez <em>recomenda</em>
      </motion.h2>
      <div className="grid c3" style={{ height: 300 }}>
        {t.map(([q, n, r], i) => (
          <Tilt key={n} ledColor={['var(--rose)', 'var(--mint)', 'var(--gold)'][i]}>
            <div style={{ fontSize: 46, color: 'var(--rose)', lineHeight: 0.6, marginBottom: 10 }}>
              “
            </div>
            <p style={{ fontSize: 16, color: 'var(--text)', fontStyle: 'italic' }}>{q}</p>
            <p style={{ marginTop: 16, fontWeight: 600, color: 'var(--rose)' }}>
              {n} <span style={{ color: 'var(--muted)', fontWeight: 400 }}>· {r}</span>
            </p>
          </Tilt>
        ))}
      </div>
      <motion.p
        variants="item"
        className="tag"
        style={{ marginTop: 16 }}
      >
        * Depoimentos ilustrativos, criados para este projeto acadêmico.
      </motion.p>
    </>
  );
}

export default S8;