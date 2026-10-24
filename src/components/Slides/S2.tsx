import { motion } from 'framer-motion';
import Eyebrow, { Led } from '../Eyebrow';
import Tilt from '../Tilt';
import { Lead, H2 } from '../Typography';

function S2() {
  const pains = [
    'Não sabem por onde começar',
    'Não têm acesso a materiais de qualidade a preços acessíveis',
    'Não encontram um curso bem estruturado',
    'Não têm suporte para se tornarem profissionais',
  ];

  return (
    <>
      <Eyebrow color="var(--red)">O problema que resolvemos</Eyebrow>
      <H2>
        Muitos querem aprender manicure,
        <br />
        mas <em>enfrentam dificuldades</em>
      </H2>
      <div className="grid c2" style={{ marginBottom: 22 }}>
        {pains.map((p, i) => (
          <Tilt key={p} ledColor="var(--red)">
            <div className="row">
              <Led c="var(--red)" delay={i * 0.3} />
              <p style={{ fontSize: 17, color: 'var(--text)' }}>{p}</p>
            </div>
          </Tilt>
        ))}
      </div>
      <Tilt ledColor="var(--mint)" style={{}}>
        <div className="row" style={{ justifyContent: 'center' }}>
          <Led c="var(--mint)" />
          <span style={{ fontSize: 21, fontWeight: 600 }}>
            Nossa solução: <span style={{ color: 'var(--rose)' }}>Esmalt'up</span> — tudo em
            um único lugar!
          </span>
        </div>
      </Tilt>
    </>
  );
}

export default S2;