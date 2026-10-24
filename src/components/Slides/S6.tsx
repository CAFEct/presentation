import { motion } from 'framer-motion';
import Eyebrow, { Led } from '../Eyebrow';
import Tilt from '../Tilt';

function S6() {
  const b = [
    ['🏅', 'Certificado Oficial', 'Mostra seu conhecimento e compromisso', 'var(--gold)'],
    ['📱', 'Rede de profissionais', 'Conecta você com outros artistas', 'var(--blue)'],
    ['💼', 'Guia para sua carreira', 'Aprenda a atrair e fidelizar clientes', 'var(--mint)'],
    ['📸', 'Portfólio online', 'Mostre seu trabalho', 'var(--rose)'],
  ];

  return (
    <>
      <Eyebrow>Depois do curso</Eyebrow>
      <motion.h2
        variants="item"
        style={{
          fontSize: 42,
          fontWeight: 700,
          lineHeight: 1.12,
          marginBottom: 24,
        }}
      >
        Seu trabalho e sua vida <em>mudam</em>
      </motion.h2>
      <div className="grid c2" style={{ marginBottom: 22 }}>
        {b.map(([i, t, d, c]) => (
          <Tilt key={t} ledColor={c}>
            <div className="row" style={{ gap: 18 }}>
              <div className="ico" style={{ fontSize: 44 }}>
                {i}
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: 21 }}>{t}</h3>
                <p style={{ fontSize: 15 }}>{d}</p>
              </div>
            </div>
          </Tilt>
        ))}
      </div>
      <motion.p variants="item" className="lead" style={{ fontSize: 20 }}>
        E o melhor: você faz tudo isso <span style={{ color: 'var(--rose)' }}>do seu jeito</span>.
      </motion.p>
    </>
  );
}

export default S6;