import { motion } from 'framer-motion';
import Eyebrow, { Led } from '../Eyebrow';
import Tilt from '../Tilt';
import ImageIcon from '../ImageIcon';
import FloatingIcons from '../FloatingIcons';

// Image paths
const worldImg = '/imgs/world.png';
const cameraImg = '/imgs/camera.png';
const nailImg = '/imgs/trofeu.png'; // Using trophy as nail art icon
const checkImg = '/imgs/check.png';
const trophyImg = '/imgs/trofeu.png';
const rocketImg = '/imgs/rocket.png';
const targetImg = '/imgs/target.png'; // Target/practice icon

function S7() {
  const st = [
    { step: 1, title: 'Escolha', desc: 'seu kit ou os materiais que quer', icon: worldImg, alt: 'Escolha' },
    { step: 2, title: 'Aprenda', desc: 'assistindo aos vídeos do curso', icon: cameraImg, alt: 'Aprenda' },
    { step: 3, title: 'Pratique', desc: 'com material profissional', icon: targetImg, alt: 'Pratique' },
    { step: 4, title: 'Complete', desc: 'todas as aulas até o final', icon: checkImg, alt: 'Complete' },
    { step: 5, title: 'Receba', desc: 'seu certificado de conclusão', icon: trophyImg, alt: 'Receba' },
    { step: 6, title: 'Comece', desc: 'sua nova carreira!', icon: rocketImg, alt: 'Comece' },
  ];

  return (
    <>
      <Eyebrow>Como funciona na prática</Eyebrow>
      <motion.h2
        variants="item"
        style={{
          fontSize: 42,
          fontWeight: 700,
          lineHeight: 1.12,
          marginBottom: 24,
        }}
      >
        Passo a passo <em>simples</em>
      </motion.h2>
      <div style={{ position: 'relative' }}>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.8, duration: 1.8, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            top: 34,
            left: '6%',
            right: '6%',
            height: 3,
            transformOrigin: 'left',
            background:
              'linear-gradient(90deg, var(--mint), var(--rose), var(--gold))',
            borderRadius: 3,
          }}
        />
        <div className="grid c6" style={{ gap: 14 }}>
          {st.map(({ step, title, desc, icon, alt }, k) => (
            <motion.div key={title} variants="item" style={{ textAlign: 'center' }}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8 + k * 0.28, type: 'spring', stiffness: 200 }}
                className="glass"
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  margin: '0 auto 16px',
                  display: 'grid',
                  placeItems: 'center',
                  padding: 0,
                }}
              >
                <ImageIcon src={icon} alt={alt} size={36} />
              </motion.div>
              <Tilt strength={14}>
                <b style={{ color: 'var(--rose)', fontSize: 13 }}>
                  0{step}
                </b>
                <h3 style={{ margin: '4px 0 6px', fontSize: 18 }}>{title}</h3>
                <p style={{ fontSize: 13 }}>{desc}</p>
              </Tilt>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Floating icons */}
      <FloatingIcons
        icons={[
          { src: checkImg, alt: 'Complete', size: 44 },
          { src: rocketImg, alt: 'Start', size: 48 },
          { src: trophyImg, alt: 'Success', size: 52 },
        ]}
        positions={[
          { top: 70, left: 55 },
          { top: 100, right: 65 },
          { bottom: 110, left: 85 },
        ]}
      />
    </>
  );
}

export default S7;