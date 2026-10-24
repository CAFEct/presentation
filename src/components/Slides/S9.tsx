import { motion } from 'framer-motion';
import Eyebrow from '../Eyebrow';
import Tilt from '../Tilt';

function S9() {
  const w = [
    ['✨', 'Tudo em um só lugar', 'Sem pesquisar em vários sites', 'var(--rose)'],
    ['💎', 'Qualidade garantida', 'Materiais testados por profissionais', 'var(--blue)'],
    ['🎯', 'Foco brasileiro', 'Criado para o mercado do Brasil', 'var(--mint)'],
    ['💰', 'Preços justos', 'Qualidade sem cobrança abusiva', 'var(--gold)'],
    ['🎓', 'Certificação oficial', 'Reconhecimento do seu empreendimento', 'var(--rose)'],
    ['🚚', 'Entrega rápida', 'Materiais entregues em tempo hábil', 'var(--blue)'],
  ];

  return (
    <>
      <Eyebrow>Diferenciais</Eyebrow>
      <motion.h2
        variants="item"
        style={{
          fontSize: 42,
          fontWeight: 700,
          lineHeight: 1.12,
          marginBottom: 24,
        }}
      >
        Por que escolher o <em>Esmalt'up?</em>
      </motion.h2>
      <div className="grid c3" style={{ gap: 18 }}>
        {w.map(([i, t, d, c]) => (
          <Tilt key={t} ledColor={c}>
            <div className="ico">{i}</div>
            <h3>{t}</h3>
            <p>{d}</p>
          </Tilt>
        ))}
      </div>
    </>
  );
}

export default S9;