import { motion } from 'framer-motion';
import Eyebrow from '../Eyebrow';
import Tilt from '../Tilt';
import { useState, useEffect } from 'react';

function S8() {
  const [shouldAnimate, setShouldAnimate] = useState(true);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setShouldAnimate(!mediaQuery.matches);
    const handler = () => setShouldAnimate(!mediaQuery.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return (
    <>
      <Eyebrow>Próximo passo</Eyebrow>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          fontSize: 48,
          fontWeight: 800,
          lineHeight: 1.1,
          marginBottom: 32,
        }}
      >
        Nosso 1º lugar <em>ainda está livre</em>
      </motion.h2>

      <div style={{ display: 'flex', gap: 40, alignItems: 'center' }}>
        {/* Left: Hall of Fame Podium */}
        <div style={{ flex: 1, position: 'relative', height: 380 }}>
          {/* Background image if available */}
          <div style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.1,
            background: 'linear-gradient(135deg, var(--rose), var(--gold))',
            borderRadius: 20,
          }} />

          {/* Podium */}
          <div style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 16 }}>
            {/* 2nd place */}
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: shouldAnimate ? 140 : 140 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              style={{
                width: 80,
                background: 'rgba(142, 197, 255, 0.3)',
                borderRadius: '8px 8px 0 0',
                border: '1px solid rgba(142, 197, 255, 0.5)',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                paddingBottom: 12,
              }}
            >
              <span style={{ fontSize: 32, fontWeight: 700, color: 'var(--blue)' }}>2</span>
            </motion.div>

            {/* 1st place */}
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: shouldAnimate ? 200 : 200 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              style={{
                width: 100,
                background: 'rgba(240, 169, 191, 0.3)',
                borderRadius: '8px 8px 0 0',
                border: '1px solid rgba(240, 169, 191, 0.5)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-end',
                paddingBottom: 12,
                position: 'relative',
              }}
            >
              {/* Crown */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
                style={{
                  position: 'absolute',
                  top: -50,
                  fontSize: 48,
                }}
              >
                👑
              </motion.div>
              <span style={{ fontSize: 40, fontWeight: 700, color: 'var(--rose)' }}>1</span>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: shouldAnimate ? [0.5, 1, 0.5] : 0.5 }}
                transition={{ duration: 2, repeat: Infinity, delay: 1.2 }}
                style={{
                  position: 'absolute',
                  top: -80,
                  background: 'linear-gradient(90deg, var(--rose), var(--gold))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontSize: 16,
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                }}
              >
                1º lugar disponível
              </motion.div>
            </motion.div>

            {/* 3rd place */}
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: shouldAnimate ? 100 : 100 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              style={{
                width: 80,
                background: 'rgba(126, 240, 195, 0.3)',
                borderRadius: '8px 8px 0 0',
                border: '1px solid rgba(126, 240, 195, 0.5)',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                paddingBottom: 12,
              }}
            >
              <span style={{ fontSize: 32, fontWeight: 700, color: 'var(--mint)' }}>3</span>
            </motion.div>
          </div>
        </div>

        {/* Right: Path to first user */}
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24, color: 'var(--rose)' }}>
            Caminho para a primeira formada
          </h3>

          {[
            { step: 1, title: 'Beta fechado', desc: 'Convidar colegas e conhecidas que querem aprender manicure' },
            { step: 2, title: 'Ouvir', desc: 'Formulário curto para saber o que travou e o que ajudou' },
            { step: 3, title: 'Ajustar e abrir', desc: 'Melhorar o site e chegar à primeira formada no Hall da Fama' },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + i * 0.2, duration: 0.5 }}
              className="glass"
              style={{
                padding: 20,
                marginBottom: 16,
                borderLeft: `4px solid ${['var(--rose)', 'var(--blue)', 'var(--mint)'][i]}`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: ['var(--rose)', 'var(--blue)', 'var(--mint)'][i],
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: 16,
                }}>
                  {item.step}
                </div>
                <h4 style={{ fontSize: 18, fontWeight: 600 }}>{item.title}</h4>
              </div>
              <p style={{ fontSize: 16, color: 'var(--muted)', marginLeft: 44 }}>{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Beta goals */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4 }}
        style={{
          marginTop: 32,
          padding: 20,
          background: 'rgba(240, 169, 191, 0.1)',
          borderRadius: 12,
          border: '1px solid rgba(240, 169, 191, 0.3)',
        }}
      >
        <h4 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12, color: 'var(--rose)' }}>
          Metas do beta
        </h4>
        <div style={{ display: 'flex', gap: 32, fontSize: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: 'var(--rose)', fontWeight: 700 }}>•</span>
            <span>20 primeiras usuárias</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: 'var(--rose)', fontWeight: 700 }}>•</span>
            <span>1 aula concluída por usuária</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: 'var(--rose)', fontWeight: 700 }}>•</span>
            <span>Primeiro certificado emitido</span>
          </div>
        </div>
      </motion.div>

      {/* Channels */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.6 }}
        style={{
          marginTop: 16,
          fontSize: 16,
          color: 'var(--muted)',
          textAlign: 'center',
        }}
      >
        Canais: Instagram · WhatsApp · Parcerias com salões e escolas
      </motion.div>
    </>
  );
}

export default S8;
