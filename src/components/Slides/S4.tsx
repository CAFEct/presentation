import { motion } from 'framer-motion';
import Eyebrow, { Led } from '../Eyebrow';
import Tilt from '../Tilt';

function S4() {
  const incl = [
    'Esmaltes de alta qualidade',
    'Ferramentas profissionais',
    'Guia de técnicas',
    'Todo o material para começar',
  ];
  const kits = [
    ['Iniciante', 'Kit Iniciante', 'R$ 189,90', 'var(--mint)'],
    ['Profissional', 'Kit Profissional', 'R$ 349,90', 'var(--blue)'],
    ['Completo', 'Kit Cabine LED', 'R$ 429,90', 'var(--gold)'],
  ];

  return (
    <>
      <Eyebrow>Kits completos</Eyebrow>
      <motion.h2
        variants="item"
        style={{
          fontSize: 42,
          fontWeight: 700,
          lineHeight: 1.12,
          marginBottom: 24,
        }}
      >
        Tudo para começar, <em>em uma caixa</em>
      </motion.h2>
      <div style={{ display: 'flex', gap: 20, marginBottom: 20 }}>
        <Tilt style={{ flex: 1 }}>
          <h3 style={{ marginTop: 0 }}>Nossos kits incluem</h3>
          {incl.map((x) => (
            <div key={x} className="row" style={{ margin: '10px 0', fontSize: 16 }}>
              <Led c="var(--mint)" />
              {x}
            </div>
          ))}
        </Tilt>
        <Tilt style={{ flex: 1 }} ledColor="var(--gold)">
          <h3 style={{ marginTop: 0 }}>Diferenciais</h3>
          {['Combinações testadas por profissionais', 'Preços que cabem no seu orçamento', 'Entrega rápida'].map(
            (x) => (
              <div key={x} className="row" style={{ margin: '10px 0', fontSize: 16 }}>
                <Led c="var(--gold)" />
                {x}
              </div>
            )
          )}
        </Tilt>
      </div>
      <div className="grid c3">
        {kits.map(([n, t, p, c]) => (
          <Tilt key={t} ledColor={c}>
            <small
              style={{
                color: c,
                letterSpacing: '.15em',
                fontSize: 11,
                fontWeight: 600,
              }}
            >
              {n.toUpperCase()}
            </small>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 4,
              }}
            >
              <b style={{ fontSize: 18 }}>{t}</b>
              <span className="price">{p}</span>
            </div>
          </Tilt>
        ))}
      </div>
    </>
  );
}

export default S4;