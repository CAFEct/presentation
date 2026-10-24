import { motion } from 'framer-motion';
import Eyebrow from '../Eyebrow';
import Tilt from '../Tilt';
import ImageIcon from '../ImageIcon';
import FloatingIcons from '../FloatingIcons';

// Image paths
const sparkleImg = './public/imgs/trofeu.png'; // Sparkle-like effect
const crownImg = './public/imgs/crown.png'; // Crown as quality/badge hero visual
const targetImg = './public/imgs/brauin.png'; // Target/aim (Brazil flag style)
const moneyImg = './public/imgs/money.png';
const certImg = './public/imgs/formatura.png';
const deliveryImg = './public/imgs/world.png';

function S9() {
  const w = [
    { icon: sparkleImg, alt: 'Tudo em um só lugar', title: 'Tudo em um só lugar', desc: 'Sem pesquisar em vários sites', color: 'var(--rose)' },
    { icon: crownImg, alt: 'Qualidade garantida', title: 'Qualidade garantida', desc: 'Materiais testados por profissionais', color: 'var(--blue)' },
    { icon: targetImg, alt: 'Foco brasileiro', title: 'Foco brasileiro', desc: 'Criado para o mercado do Brasil', color: 'var(--mint)' },
    { icon: moneyImg, alt: 'Preços justos', title: 'Preços justos', desc: 'Qualidade sem cobrança abusiva', color: 'var(--gold)' },
    { icon: certImg, alt: 'Certificação oficial', title: 'Certificação oficial', desc: 'Reconhecimento do seu empreendimento', color: 'var(--rose)' },
    { icon: deliveryImg, alt: 'Entrega rápida', title: 'Entrega rápida', desc: 'Materiais entregues em tempo hábil', color: 'var(--blue)' },
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
        {w.map(({ icon, alt, title, desc, color }) => (
          <Tilt key={title} ledColor={color}>
            <ImageIcon src={icon} alt={alt} size={56} />
            <h3>{title}</h3>
            <p>{desc}</p>
          </Tilt>
        ))}
      </div>

      {/* Floating icons */}
      <FloatingIcons
        icons={[
          { src: sparkleImg, alt: 'Tudo em um só lugar', size: 48 },
          { src: crownImg, alt: 'Qualidade', size: 52 },
          { src: certImg, alt: 'Cert', size: 56 },
        ]}
        positions={[
          { top: 80, left: 45 },
          { top: 90, right: 55 },
          { bottom: 100, left: 75 },
        ]}
      />
    </>
  );
}

export default S9;