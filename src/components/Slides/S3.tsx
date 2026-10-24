import { motion } from 'framer-motion';
import Eyebrow, { Led } from '../Eyebrow';
import Tilt from '../Tilt';
import ImageIcon from '../ImageIcon';

// Image paths from public folder
const paletaImg = '/imgs/paleta.png';
const wrenchImg = '/imgs/wrench.png';
const formaturaImg = '/imgs/formatura.png';

function S3() {
  const cols = [
    {
      icon: <ImageIcon src={paletaImg} alt="Paleta de cores" />,
      title: 'Kits de Manicure Completos',
      list: ['Tudo que você precisa em um único kit', 'Materiais profissionais de qualidade'],
      color: 'var(--rose)',
    },
    {
      icon: <ImageIcon src={wrenchImg} alt="Chave inglesa" />,
      title: 'Peças Avulsas',
      list: ['Produtos individuais para montar seu kit', 'Flexibilidade no que você quer comprar'],
      color: 'var(--blue)',
    },
    {
      icon: <ImageIcon src={formaturaImg} alt="Formatura" />,
      title: 'Curso Preparatório',
      list: ['23 aulas com técnicas de especialistas', 'Do básico ao avançado, com aulas bônus'],
      color: 'var(--mint)',
    },
  ];

  return (
    <>
      <Eyebrow>O que é o Esmalt'up</Eyebrow>
      <motion.h2
        variants="item"
        style={{
          fontSize: 42,
          fontWeight: 700,
          lineHeight: 1.12,
          marginBottom: 24,
        }}
      >
        Três programas <em>integrados</em>
      </motion.h2>
      <div className="grid c3" style={{ height: 340 }}>
        {cols.map(({ icon, title, list, color }) => (
          <Tilt key={title} ledColor={color}>
            <div className="ico">{icon}</div>
            <h3 style={{ fontSize: 22, margin: '10px 0 6px' }}>{title}</h3>
            <ul>
              {list.map((x) => (
                <li
                  key={x}
                  style={{
                    display: 'flex',
                    gap: 10,
                    margin: '10px 0',
                    fontSize: 16,
                  }}
                >
                  <Led c={color} />
                  {x}
                </li>
              ))}
            </ul>
          </Tilt>
        ))}
      </div>
    </>
  );
}

export default S3;