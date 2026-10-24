import { motion } from 'framer-motion';
import Eyebrow, { Led } from '../Eyebrow';
import Tilt from '../Tilt';
import ImageIcon from '../ImageIcon';

// Image paths
const trophyImg = '/imgs/trofeu.png';
const worldImg = '/imgs/world.png';
const briefcaseImg = '/imgs/money.png';
const cameraImg = '/imgs/camera.png';

function S6() {
  const b = [
    { icon: trophyImg, alt: 'Trophy', title: 'Certificado Oficial', desc: 'Mostra seu conhecimento e compromisso', color: 'var(--gold)' },
    { icon: worldImg, alt: 'World', title: 'Rede de profissionais', desc: 'Conecta você com outros artistas', color: 'var(--blue)' },
    { icon: briefcaseImg, alt: 'Briefcase', title: 'Guia para sua carreira', desc: 'Aprenda a atrair e fidelizar clientes', color: 'var(--mint)' },
    { icon: cameraImg, alt: 'Camera', title: 'Portfólio online', desc: 'Mostre seu trabalho', color: 'var(--rose)' },
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
        {b.map(({ icon, alt, title, desc, color }) => (
          <Tilt key={title} ledColor={color}>
            <div className="row" style={{ gap: 18 }}>
              <ImageIcon src={icon} alt={alt} size={56} />
              <div>
                <h3 style={{ margin: 0, fontSize: 21 }}>{title}</h3>
                <p style={{ fontSize: 15 }}>{desc}</p>
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