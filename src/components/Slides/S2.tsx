import { motion } from 'framer-motion';
import Eyebrow, { Led } from '../Eyebrow';
import Tilt from '../Tilt';
import { Lead, H2 } from '../Typography';
import { useState } from 'react';

// Image paths from public folder
const trophyImg = '/imgs/trofeu.png';
const worldImg = '/imgs/world.png';
const formaturaImg = '/imgs/formatura.png';
const moneyImg = '/imgs/money.png';

// Problem/Solution cards - flip animation
const problemSolutionData = [
  {
    problem: 'Não sabem por onde começar',
    solution: 'Trilha de 23 aulas, do zero ao profissional',
    color: 'var(--red)',
    icon: trophyImg,
  },
  {
    problem: 'Materiais caros ou ruins',
    solution: 'Kits prontos e peças avulsas com qualidade garantida',
    color: 'var(--rose)',
    icon: worldImg,
  },
  {
    problem: 'Curso mal estruturado',
    solution: 'Módulos em ordem com progresso salvo',
    color: 'var(--blue)',
    icon: formaturaImg,
  },
  {
    problem: 'Sem suporte',
    solution: 'Comunidade e certificado oficial',
    color: 'var(--gold)',
    icon: moneyImg,
  },
];

function S2() {
  const [flipped, setFlipped] = useState<number | null>(null);

  return (
    <>
      <Eyebrow color="var(--red)">O problema que resolvemos</Eyebrow>
      <H2>
        Muitos querem aprender manicure,
        <br />
        mas <em>enfrentam dificuldades</em>
      </H2>

      {/* 2x2 Grid of flip cards */}
      <div className="grid c2" style={{ gap: 24, marginBottom: 30 }}>
        {problemSolutionData.map((item, index) => (
          <Tilt key={item.problem} ledColor={item.color}>
            <div
              style={{
                position: 'relative',
                width: '100%',
                perspective: 1000,
                cursor: 'pointer',
              }}
              onClick={() => setFlipped(flipped === index ? null : index)}
            >
              <motion.div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: 180,
                  transformStyle: 'preserve-3d',
                  transform: `rotateY(${flipped === index ? 180 : 0}deg)`,
                  transition: 'transform 0.8s cubic-bezier(0.25, 0.1, 0.25, 1)',
                }}
              >
                {/* Front - Problem */}
                <motion.div
                  className="glass"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backfaceVisibility: 'hidden',
                    backgroundColor: 'rgba(217, 112, 143, 0.1)',
                    borderColor: item.color,
                  }}
                  initial={{ opacity: 1 }}
                  animate={{ opacity: flipped === index ? 0 : 1 }}
                  transition={{ duration: 0.8 }}
                >
                  <div style={{ textAlign: 'center', padding: 24 }}>
                    <div className="ico" style={{ fontSize: 48, marginBottom: 16 }}>
                      {item.icon}
                    </div>
                    <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>{item.problem}</h3>
                  </div>
                </motion.div>

                {/* Back - Solution */}
                <motion.div
                  className="glass"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backfaceVisibility: 'hidden',
                    backgroundColor: item.color,
                    transform: 'rotateY(180deg)',
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: flipped === index ? 1 : 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <div style={{ textAlign: 'center', padding: 24 }}>
                    <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12, color: '#fff' }}>
                      Solução
                    </h3>
                    <p style={{ fontSize: 16, lineHeight: 1.5 }}>{item.solution}</p>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </Tilt>
        ))}
      </div>

      {/* Closing statement */}
      <Tilt ledColor="var(--rose)">
        <motion.p
          variants="item"
          className="lead"
          style={{
            fontSize: 24,
            textAlign: 'center',
            background: 'linear-gradient(90deg, var(--rose), var(--gold))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Esmalt'up resolve tudo isso em um só lugar
        </motion.p>
      </Tilt>
    </>
  );
}

export default S2;