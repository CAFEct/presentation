import { motion } from 'framer-motion';
import Eyebrow from '../Eyebrow';
import Tilt from '../Tilt';
import { useState } from 'react';
import FloatingIcons from '../FloatingIcons';

// Image paths from public folder
const trophyImg = './public/imgs/trofeu.png';
const worldImg = './public/imgs/world.png';
const certificateImg = './public/imgs/certificate.png';
const moneyImg = './public/imgs/money.png';

// Image paths
const certImg = './public/imgs/certificate.png';

function S6() {
  const [showAfter, setShowAfter] = useState(false);

  return (
    <>
      <Eyebrow>Depois do curso</Eyebrow>
      <motion.h2
        variants="item"
        style={{
          fontSize: 48,
          fontWeight: 800,
          lineHeight: 1.1,
          marginBottom: 24,
        }}
      >
        Seu trabalho e sua vida <em>mudam</em>
      </motion.h2>

      {/* Before/After slider */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 800,
          height: 320,
          borderRadius: 20,
          overflow: 'hidden',
          margin: '0 auto 30px',
          cursor: 'pointer',
        }}
        onClick={() => setShowAfter(!showAfter)}
      >
        {/* Before state - gray */}
        <motion.div
          className="glass"
          style={{
            position: 'absolute',
            inset: 0,
            opacity: showAfter ? 0 : 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 20,
            padding: 40,
          }}
          transition={{ duration: 0.5 }}
        >
          <h3 style={{ fontSize: 24, fontWeight: 700, color: 'var(--muted)' }}>Começando</h3>
          <p style={{ fontSize: 18, color: 'var(--muted)', textAlign: 'center', lineHeight: 1.5 }}>
            Não sabia por onde começar<br />
            Materiais desorganizados<br />
            Sem direção clara
          </p>
        </motion.div>

        {/* After state - color */}
        <motion.div
          className="glass"
          style={{
            position: 'absolute',
            inset: 0,
            opacity: showAfter ? 1 : 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 16,
            padding: 40,
          }}
          transition={{ duration: 0.5 }}
        >
          {/* 3D Certificate */}
          <div
            style={{
              position: 'relative',
              width: 200,
              height: 280,
              perspective: 1000,
            }}
          >
            <motion.div
              style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                transformStyle: 'preserve-3d',
                rotateY: showAfter ? 0 : 180,
                transition: 'transform 0.8s cubic-bezier(0.25, 0.1, 0.25, 1)',
              }}
            >
              <motion.img
                src={certImg}
                alt="Certificado"
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.2))',
                  transform: 'translateZ(0)',
                }}
                whileHover={{ scale: 1.02 }}
              />
            </motion.div>
          </div>

          <h3 style={{ fontSize: 26, fontWeight: 700, background: 'linear-gradient(90deg, var(--rose), var(--gold))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Profissional!
          </h3>
          <p style={{ fontSize: 16, color: 'var(--muted)', textAlign: 'center', lineHeight: 1.5 }}>
            Certificado oficial<br />
            Rede de profissionais<br />
            Agenda organizada
          </p>
        </motion.div>
      </div>

      {/* Benefits badges */}
      <div
        className="grid c2"
        style={{ gap: 20, justifyContent: 'center' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, staggerChildren: 0.1 }}
      >
        <motion.div
          className="glass"
          style={{
            padding: 20,
            textAlign: 'center',
            borderLeft: '4px solid var(--gold)',
          }}
          whileHover={{ x: 10 }}
        >
          <img src={trophyImg} alt="Trophy" style={{ width: 36, height: 36, marginBottom: 12 }} />
          <h4 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Certificado Oficial</h4>
          <p style={{ fontSize: 14, color: 'var(--muted)' }}>Reconhecimento profissional</p>
        </motion.div>

        <motion.div
          className="glass"
          style={{
            padding: 20,
            textAlign: 'center',
            borderLeft: '4px solid var(--blue)',
          }}
          whileHover={{ x: 10 }}
        >
          <img src={worldImg} alt="World" style={{ width: 36, height: 36, marginBottom: 12 }} />
          <h4 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Rede De Profissionais</h4>
          <p style={{ fontSize: 14, color: 'var(--muted)' }}>Conecta com outros artistas</p>
        </motion.div>

        <motion.div
          className="glass"
          style={{
            padding: 20,
            textAlign: 'center',
            borderLeft: '4px solid var(--mint)',
          }}
          whileHover={{ x: 10 }}
        >
          <img src={certificateImg} alt="Guide" style={{ width: 36, height: 36, marginBottom: 12 }} />
          <h4 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Guia de Carreira</h4>
          <p style={{ fontSize: 14, color: 'var(--muted)' }}>Como atrair e fidelizar clientes</p>
        </motion.div>

        <motion.div
          className="glass"
          style={{
            padding: 20,
            textAlign: 'center',
            borderLeft: '4px solid var(--rose)',
          }}
          whileHover={{ x: 10 }}
        >
          <img src={moneyImg} alt="Camera" style={{ width: 36, height: 36, marginBottom: 12 }} />
          <h4 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Portfólio Online</h4>
          <p style={{ fontSize: 14, color: 'var(--muted)' }}>Mostre seu trabalho</p>
        </motion.div>
      </div>

      <motion.p
        variants="item"
        className="lead"
        style={{ fontSize: 18, textAlign: 'center' }}
      >
        Clique para ver a transformação →
      </motion.p>

      {/* Floating icons */}
      <FloatingIcons
        icons={[
          { src: certificateImg, alt: 'Certificate', size: 48 },
          { src: trophyImg, alt: 'Trophy', size: 52 },
          { src: worldImg, alt: 'Network', size: 56 },
        ]}
        positions={[
          { top: 90, left: 40 },
          { top: 110, right: 70 },
          { bottom: 130, left: 90 },
        ]}
      />
    </>
  );
}

export default S6;