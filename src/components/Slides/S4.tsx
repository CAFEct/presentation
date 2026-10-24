import { motion } from 'framer-motion';
import Eyebrow, { Led } from '../Eyebrow';
import Tilt from '../Tilt';
import { useState } from 'react';

// Image paths from public folder
const certificateImg = '/imgs/certificate.png';
const qualityImg = '/imgs/vscod.png';
const priceImg = '/imgs/money.png';

function S4() {
  const [selectedKit, setSelectedKit] = useState(0);

  const kits = [
    {
      name: 'Iniciante',
      title: 'Kit Iniciante',
      price: 'R$ 189,90',
      color: 'var(--mint)',
      items: ['Esmaltes básicos', 'Base e top', 'Cuticle linter', 'Lixa de unha'],
    },
    {
      name: 'Profissional',
      title: 'Kit Profissional',
      price: 'R$ 349,90',
      color: 'var(--blue)',
      items: ['Kit Iniciante', '+ Esmaltes coloridos', 'Ferramentas premium', 'Guia completo'],
    },
    {
      name: 'Cabine LED',
      title: 'Kit Cabine LED',
      price: 'R$ 429,90',
      color: 'var(--gold)',
      items: ['Kit Profissional', '+ Lâmpada LED', 'Terminal de cobré', 'Suporte'],
    },
  ];

  const differentials = [
    { icon: qualityImg, text: 'Combinações testadas por profissionais' },
    { icon: priceImg, text: 'Preços que cabem no seu orçamento' },
    { icon: certificateImg, text: 'Entrega rápida' },
  ];

  return (
    <>
      <Eyebrow>Kits completos</Eyebrow>
      <motion.h2
        variants="item"
        style={{
          fontSize: 48,
          fontWeight: 800,
          lineHeight: 1.1,
          marginBottom: 24,
        }}
      >
        Tudo para começar, <em>em uma caixa</em>
      </motion.h2>

      {/* Selected kit showcase */}
      <Tilt key={kits[selectedKit].name} ledColor={kits[selectedKit].color} style={{ marginBottom: 30 }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 30,
          flexWrap: 'wrap',
        }}>
          {/* Product image placeholder */}
          <div
            className="glass"
            style={{
              width: 280,
              height: 280,
              borderRadius: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            <img
              src={certificateImg}
              alt={kits[selectedKit].title}
              style={{
                width: 180,
                height: 180,
                objectFit: 'contain',
                filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.15))',
              }}
            />
          </div>

          {/* Kit details */}
          <div style={{ flex: 1, minWidth: 250 }}>
            <small
              style={{
                color: kits[selectedKit].color,
                letterSpacing: '.2em',
                fontSize: 14,
                fontWeight: 600,
                marginBottom: 8,
              }}
            >
              {kits[selectedKit].name.toUpperCase()}
            </small>
            <h3 style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>{kits[selectedKit].title}</h3>
            <p style={{ fontSize: 20, fontWeight: 700, color: 'var(--rose)', marginBottom: 16 }}>
              {kits[selectedKit].price}
            </p>

            {/* Items */}
            <ul style={{ listStyle: 'none', padding: 0, margin: '16px 0' }}>
              {kits[selectedKit].items.map((item) => (
                <li key={item} style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
                  <Led c={kits[selectedKit].color} />
                  <span style={{ fontSize: 16 }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Tilt>

      {/* Kit selector */}
      <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginBottom: 30 }}>
        {kits.map((kit, i) => (
          <motion.button
            key={kit.name}
            className="glass"
            style={{
              padding: '12px 24px',
              cursor: 'pointer',
              background: selectedKit === i ? kit.color : 'rgba(255,255,255,0.05)',
              border: `2px solid ${selectedKit === i ? kit.color : 'rgba(255,255,255,0.2)'}`,
            }}
            onClick={() => setSelectedKit(i)}
            whileHover={{ scale: 1.05 }}
          >
            <span style={{ color: selectedKit === i ? '#fff' : kit.color, fontWeight: 600 }}>
              {kit.name}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Differentials */}
      <motion.div
        style={{
          display: 'grid',
          gap: 16,
          gridTemplateColumns: 'repeat(3, 1fr)',
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {differentials.map((d, i) => (
          <motion.div
            key={d.text}
            className="glass"
            style={{
              padding: 20,
              textAlign: 'center',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
            whileHover={{ scale: 1.03 }}
          >
            <motion.img
              src={d.icon}
              alt={d.text}
              style={{
                width: 40,
                height: 40,
                objectFit: 'contain',
                marginBottom: 12,
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))',
              }}
              whileHover={{ scale: 1.1 }}
            />
            <p style={{ fontSize: 16, lineHeight: 1.4 }}>{d.text}</p>
          </motion.div>
        ))}
      </motion.div>
    </>
  );
}

export default S4;