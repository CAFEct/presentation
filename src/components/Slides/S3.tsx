import { motion } from 'framer-motion';
import Eyebrow, { Led } from '../Eyebrow';
import Tilt from '../Tilt';
import { Lead, H2 } from '../Typography';
import { useState } from 'react';

// Image paths from public folder
const paletaImg = '/imgs/paleta.png';
const wrenchImg = '/imgs/wrench.png';
const formaturaImg = '/imgs/formatura.png';

// Color mapping for dots
const LEDS = ['#f0a9bf', '#8ec5ff', '#7ef0c3'];

// Panel data - using icons since site screenshots not available
const panels = [
  {
    icon: paletaImg,
    tag: 'Kits',
    title: 'Kits de Manicure Completos',
    desc: 'Tudo que você precisa em um único kit',
    color: 'var(--rose)',
    detail: 'Materiais profissionais de qualidade',
  },
  {
    icon: wrenchImg,
    tag: 'Peças',
    title: 'Peças Avulsas',
    desc: 'Montagem do seu kit à sua medida',
    color: 'var(--blue)',
    detail: 'Flexibilidade total na escolha',
  },
  {
    icon: formaturaImg,
    tag: 'Curso',
    title: 'Curso Preparatório',
    desc: '23 aulas com técnicas de especialistas',
    color: 'var(--mint)',
    detail: 'Do básico ao avançado',
  },
];

function S3() {
  const [activePanel, setActivePanel] = useState(0);

  return (
    <>
      <Eyebrow>O que é o Esmalt'up</Eyebrow>
      <H2>
        Três programas <em>integrados</em>
      </H2>

      {/* Three panels with perspective */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 30,
          height: 400,
          perspective: 1200,
        }}
      >
        {panels.map((panel, index) => {
          const isActive = activePanel === index;
          const isNear = Math.abs(activePanel - index) <= 1;

          return (
            <motion.div
              key={panel.title}
              style={{
                flex: isActive ? 1.3 : 0.8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transformStyle: 'preserve-3d',
                rotateY: isActive ? 0 : (activePanel > index ? -15 : 15) * Math.abs(activePanel - index),
                scale: isActive ? 1 : 0.9,
                opacity: isNear || isActive ? 1 : 0.7,
                transition: { type: 'spring', stiffness: 120, damping: 15 },
              }}
              onClick={() => setActivePanel(index)}
            >
              {/* Panel container - mimicking browser screen */}
              <div
                className="glass"
                style={{
                  width: '100%',
                  maxWidth: 300,
                  aspectRatio: '16/9',
                  borderRadius: 12,
                  padding: 20,
                  textAlign: 'left',
                  boxShadow: `0 20px 40px -10px ${panel.color}33`,
                  border: `1px solid ${panel.color}33`,
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                }}
                whileHover={{ scale: 1.02 }}
              >
                {/* Browser-like header */}
                <div style={{
                  display: 'flex',
                  gap: 8,
                  alignItems: 'center',
                  marginBottom: 16,
                  paddingBottom: 12,
                  borderBottom: '1px solid rgba(255,255,255,0.1)',
                }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'rgba(255,0,0,0.4)' }} />
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'rgba(255,165,0,0.4)' }} />
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'rgba(0,128,0,0.4)' }} />
                  </div>
                  <motion.span
                    className="led"
                    style={{ '--c': panel.color }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  />
                </div>

                {/* Icon with glow effect */}
                <motion.div
                  style={{
                    width: 60,
                    height: 60,
                    marginBottom: 16,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  whileHover={{ scale: 1.1 }}
                >
                  <img
                    src={panel.icon}
                    alt={panel.tag}
                    style={{
                      width: 48,
                      height: 48,
                      objectFit: 'contain',
                      filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.15))',
                    }}
                  />
                </motion.div>

                {/* Title */}
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{panel.tag}</h3>
                <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.4 }}>{panel.desc}</p>

                {/* Detail - only visible when active */}
                <motion.p
                  style={{ fontSize: 13, color: panel.color, marginTop: 12 }}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: isActive ? 20 : 0, opacity: isActive ? 1 : 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {panel.detail}
                </motion.p>
              </div>

              {/* Tag */}
              <motion.span
                className="tag"
                style={{ marginTop: 12, display: 'flex', gap: 6 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Led c={panel.color} />
                {panel.tag}
              </motion.span>
            </motion.div>
          );
        })}
      </div>

      {/* Navigation dots */}
      <motion.div
        className="row"
        style={{ justifyContent: 'center', marginTop: 24 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {panels.map((_, i) => (
          <motion.button
            key={i}
            className="dot"
            onClick={() => setActivePanel(i)}
            animate={{
              background: i === activePanel ? LEDS[i] : 'rgba(255, 255, 255, 0.2)',
              scale: i === activePanel ? 1.5 : 1,
            }}
            style={{ margin: '0 8px' }}
          />
        ))}
      </motion.div>
    </>
  );
}

export default S3;