import { useEffect, useState, type ReactNode } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import Eyebrow from '../Eyebrow';

/* ------------------------------------------------------------------ */
/*  Slide 2 — "O problema"                                             */
/*  Fase 1: o caos (a pessoa não sabe por onde começar)                */
/*  Fase 2: a ordem (tudo se arruma numa bandeja Esmalt'up)            */
/*                                                                     */
/*  Dica: para a letra manuscrita, adicione no index.html:             */
/*  <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@600&display=swap" rel="stylesheet"> */
/* ------------------------------------------------------------------ */

const IMG = '/imgs';
const worldImg = `${IMG}/world.png`;
const moneyImg = `${IMG}/money.png`;
const formaturaImg = `${IMG}/formatura.png`;
const mapImg = `${IMG}/map.png`; // PNG com fundo transparente, no centro da cena
const logoImg = `${IMG}/sem_background.png`;

/* Palco da cena: todas as posições são em px a partir do CENTRO. */
const SCENE_W = 1128;
const SCENE_H = 400;
const CX = SCENE_W / 2;
const CY = SCENE_H / 2;
const ICON = 72;

const HAND = "'Caveat', 'Segoe Script', 'Comic Sans MS', cursive";

type Pt = { x: number; y: number };

/* Ícones que "voam" do caos para a bandeja. Tudo fixo: nada de Math.random no render. */
const items = [
  { id: 'info', img: worldImg, alt: 'Informação espalhada', chaos: { x: -250, y: -100 }, slotX: -270, f: { amp: 9, rot: 5, dur: 4.6, delay: 0 } },
  { id: 'preco', img: moneyImg, alt: 'Preço', chaos: { x: 250, y: -100 }, slotX: -150, f: { amp: 8, rot: 4, dur: 5.2, delay: 0.4 } },
  { id: 'curso', img: formaturaImg, alt: 'Curso', chaos: { x: -250, y: 100 }, slotX: 150, f: { amp: 10, rot: 6, dur: 4.2, delay: 0.8 } },
];

/* O "balão sem resposta" (sem suporte) também viaja para a bandeja, virando um ✓ */
const bubble = { chaos: { x: 250, y: 100 }, slotX: 270, f: { amp: 7, rot: 3, dur: 5.4, delay: 0.3 } };

/* O MAPA fica no centro. No caos ele é o "destino" confuso; na ordem vira o centro da bandeja. */
const MAP_W = 220;
const MAP_H = 250; // proporção do PNG (640 x 552)
const MAP_SCALE_ORDER = 0.56;
const map = { y: 0, f: { amp: 8, rot: 2.5, dur: 6.2, delay: 0.1 } };

const SLOT_Y = 12;

/* Anotações escritas à mão, sempre do lado de FORA do ícone, para nunca cruzar as linhas. */
const labels: { text: string; at: Pt; side: 'left' | 'right' }[] = [
  { text: 'Não sabem por onde começar', at: { x: -250, y: -100 }, side: 'left' },
  { text: 'Materiais caros ou ruins', at: { x: 250, y: -100 }, side: 'right' },
  { text: 'Curso mal estruturado', at: { x: -250, y: 100 }, side: 'left' },
  { text: 'Sem suporte', at: { x: 250, y: 100 }, side: 'right' },
];

/* "?" em posições fixas, só no miolo da cena, longe das anotações */
const questionMarks = [
  { x: -150, y: -30, size: 34, delay: 0 },
  { x: 30, y: -128, size: 28, delay: 0.7 },
  { x: 160, y: 24, size: 36, delay: 1.3 },
  { x: -30, y: 132, size: 30, delay: 0.4 },
  { x: -140, y: 70, size: 26, delay: 1.8 },
  { x: 130, y: -80, size: 26, delay: 1.1 },
];

/* Linha pontilhada curva do ícone até o miolo da cena */
function dottedPath({ x, y }: Pt): string {
  const sx = CX + x;
  const sy = CY + y;
  const len = Math.hypot(x, y) || 1;
  const ux = -x / len;
  const uy = -y / len;
  const px = sx + ux * 46; // começa fora do ícone
  const py = sy + uy * 46;
  // termina na borda do mapa (elipse em volta dele), não por baixo da imagem
  const ex = CX + (x / len) * (MAP_W / 2 + 16);
  const ey = CY + map.y + (y / len) * (MAP_H / 2 + 6);
  const mx = (px + ex) / 2 - uy * 28;
  const my = (py + ey) / 2 + ux * 28;
  return `M ${px} ${py} Q ${mx} ${my} ${ex} ${ey}`;
}

const titleStyle = {
  margin: 0,
  fontSize: 64,
  lineHeight: 1.05,
  fontWeight: 800,
  background: 'linear-gradient(90deg, #ffd0de, #f0a9bf 45%, #d9708f)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
} as const;

/* ---------- peças pequenas ---------- */

/** Texto que "digita" letra por letra. Em reduced-motion aparece inteiro. */
function Typewriter({ text, speed = 55, start = 350 }: { text: string; speed?: number; start?: number }) {
  const reduced = useReducedMotion();
  const [n, setN] = useState(reduced ? text.length : 0);

  useEffect(() => {
    if (reduced) {
      setN(text.length);
      return;
    }
    setN(0);
    let i = 0;
    let interval: ReturnType<typeof setInterval> | undefined;
    const t = setTimeout(() => {
      interval = setInterval(() => {
        i += 1;
        setN(i);
        if (i >= text.length && interval) clearInterval(interval);
      }, speed);
    }, start);
    return () => {
      clearTimeout(t);
      if (interval) clearInterval(interval);
    };
  }, [text, speed, start, reduced]);

  return (
    <>
      <span style={titleStyle}>{text.slice(0, n)}</span>
      {n < text.length && (
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.8, repeat: Infinity }}
          style={{ display: 'inline-block', width: 4, height: 52, marginLeft: 6, background: '#f0a9bf', verticalAlign: 'middle', borderRadius: 2 }}
        />
      )}
    </>
  );
}

/** Flutuação suave e contínua (só quando "active"). Fica DENTRO do wrapper que posiciona. */
function Floaty({
  children,
  active,
  amp,
  rot,
  dur,
  delay,
}: {
  children: ReactNode;
  active: boolean;
  amp: number;
  rot: number;
  dur: number;
  delay: number;
}) {
  return (
    <motion.div
      style={{ width: '100%', height: '100%' }}
      animate={
        active
          ? { y: [0, -amp, 0], x: [0, amp * 0.5, 0], rotate: [-rot, rot, -rot] }
          : { y: 0, x: 0, rotate: 0 }
      }
      transition={active ? { duration: dur, repeat: Infinity, ease: 'easeInOut', delay } : { duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
}

/** Sublinhado "rabiscado" que se desenha sozinho */
function Squiggle({ delay, align }: { delay: number; align: 'left' | 'right' }) {
  return (
    <svg width="170" height="12" viewBox="0 0 170 12" style={{ display: 'block', marginLeft: align === 'right' ? 'auto' : 0, marginTop: 4 }}>
      <motion.path
        d="M2 7 Q 14 1, 26 7 T 50 7 T 74 7 T 98 7 T 122 7 T 146 7 T 168 6"
        fill="none"
        stroke="#f0a9bf"
        strokeWidth="2.5"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.8 }}
        transition={{ delay, duration: 0.8, ease: 'easeOut' }}
      />
    </svg>
  );
}

/* ---------- slide ---------- */

interface S2Props {
  toggle?: boolean;
  setToggle?: (value: boolean) => void;
}

function S2({ toggle, setToggle }: S2Props) {
  const reduced = !!useReducedMotion();
  const organized = !!toggle;
  const floating = !organized && !reduced;

  const spring = { type: 'spring', stiffness: 70, damping: 16 } as const;

  return (
    <>
      <Eyebrow>{organized ? 'A solução' : 'O problema'}</Eyebrow>

      {/* Título (altura fixa para o resto da cena não pular) */}
      <div style={{ height: 96, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 4 }}>
        <AnimatePresence mode="wait">
          {organized ? (
            <motion.h2
              key="done"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.5 }}
              style={titleStyle}
            >
              Agora você sabe.
            </motion.h2>
          ) : (
            <motion.h2
              key="ask"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4 }}
              style={{ margin: 0 }}
            >
              <Typewriter text="Por onde eu começo?" />
            </motion.h2>
          )}
        </AnimatePresence>
      </div>

      {/* Cena */}
      <div
        onClick={() => setToggle?.(!toggle)}
        style={{ position: 'relative', width: '100%', height: SCENE_H, cursor: setToggle ? 'pointer' : 'default' }}
      >
        {/* Bandeja do kit (só na fase 2) */}
        <motion.div
          className="glass"
          initial={false}
          animate={{ opacity: organized ? 1 : 0, scaleX: organized ? 1 : 0.85 }}
          transition={{ duration: 0.7, delay: organized ? 0.25 : 0 }}
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: 760,
            height: 150,
            marginLeft: -380,
            marginTop: -75 + SLOT_Y,
            borderRadius: 28,
            padding: 0,
            border: '1.5px solid rgba(240,169,191,0.45)',
            pointerEvents: 'none',
          }}
        />

        {/* Linhas pontilhadas (só no caos) */}
        <AnimatePresence>
          {!organized && (
            <motion.svg
              key="lines"
              viewBox={`0 0 ${SCENE_W} ${SCENE_H}`}
              preserveAspectRatio="none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
            >
              {labels.map((l, i) => (
                <motion.path
                  key={l.text}
                  d={dottedPath(l.at)}
                  fill="none"
                  stroke="#f0a9bf"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  strokeDasharray="2 9"
                  opacity={0.55}
                  vectorEffect="non-scaling-stroke"
                  animate={reduced ? undefined : { strokeDashoffset: [0, -22] }}
                  transition={{ duration: 1.6 + i * 0.2, repeat: Infinity, ease: 'linear' }}
                />
              ))}
            </motion.svg>
          )}
        </AnimatePresence>

        {/* Pontos de interrogação (só no caos) */}
        <AnimatePresence>
          {!organized &&
            questionMarks.map((q, i) => (
              <div
                key={i}
                style={{ position: 'absolute', left: `calc(50% + ${q.x}px)`, top: `calc(50% + ${q.y}px)`, transform: 'translate(-50%, -50%)', pointerEvents: 'none' }}
              >
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={reduced ? { opacity: 0.6 } : { opacity: [0.25, 0.8, 0.25], scale: [1, 1.18, 1] }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 2.6, repeat: Infinity, delay: q.delay }}
                  style={{ display: 'block', fontSize: q.size, fontWeight: 800, color: '#f0a9bf' }}
                >
                  ?
                </motion.span>
              </div>
            ))}
        </AnimatePresence>

        {/* Ícones: UM conjunto só, que anda do caos para a bandeja */}
        {items.map((it, i) => (
          <motion.div
            key={it.id}
            initial={{ x: it.chaos.x, y: it.chaos.y, opacity: 0, scale: 0.6 }}
            animate={{
              x: organized ? it.slotX : it.chaos.x,
              y: organized ? SLOT_Y : it.chaos.y,
              opacity: 1,
              scale: organized ? 0.95 : 1,
            }}
            transition={{ ...spring, delay: organized ? 0.35 + i * 0.09 : 0.15 + i * 0.12 }}
            style={{ position: 'absolute', left: '50%', top: '50%', width: ICON, height: ICON, marginLeft: -ICON / 2, marginTop: -ICON / 2, pointerEvents: 'none' }}
          >
            <Floaty active={floating} {...it.f}>
              <img
                src={it.img}
                alt={it.alt}
                draggable={false}
                style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'drop-shadow(0 6px 10px rgba(0,0,0,0.35))' }}
              />
            </Floaty>
          </motion.div>
        ))}

        {/* MAPA no centro da cena: sai do caos e vira o coração da bandeja */}
        <motion.div
          initial={{ y: map.y + 30, opacity: 0, scale: 0.7 }}
          animate={{
            y: organized ? SLOT_Y : map.y,
            opacity: 1,
            scale: organized ? MAP_SCALE_ORDER : 1,
          }}
          transition={{ ...spring, delay: organized ? 0.3 : 0.1 }}
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: MAP_W,
            height: MAP_H,
            marginLeft: -MAP_W / 2,
            marginTop: -MAP_H / 2,
            pointerEvents: 'none',
          }}
        >
          <Floaty active={floating} {...map.f}>
            <img
              src={mapImg}
              alt="Mapa"
              draggable={false}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                imageRendering: 'pixelated', // mantém o pixel art nítido ao ampliar
                filter: 'drop-shadow(0 120px 18px rgba(0,0,0,0.45))',
              }}
            />
          </Floaty>
        </motion.div>

        {/* Balão "sem suporte": vira ✓ quando a ordem chega */}
        <motion.div
          initial={{ x: bubble.chaos.x, y: bubble.chaos.y, opacity: 0, scale: 0.6 }}
          animate={{
            x: organized ? bubble.slotX : bubble.chaos.x,
            y: organized ? SLOT_Y : bubble.chaos.y,
            opacity: 1,
            scale: organized ? 0.95 : 1,
          }}
          transition={{ ...spring, delay: organized ? 0.35 + items.length * 0.09 : 0.15 + items.length * 0.12 }}
          style={{ position: 'absolute', left: '50%', top: '50%', width: 80, height: 58, marginLeft: -40, marginTop: -29, pointerEvents: 'none' }}
        >
          <Floaty active={floating} {...bubble.f}>
            <div
              style={{
                width: '100%',
                height: '100%',
                borderRadius: 22,
                background: organized ? 'rgba(126,240,195,0.16)' : 'rgba(240,169,191,0.14)',
                border: `1.5px solid ${organized ? 'rgba(126,240,195,0.55)' : 'rgba(240,169,191,0.45)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 7,
                transition: 'background 0.5s, border-color 0.5s',
              }}
            >
              {organized ? (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 220, damping: 14, delay: 0.9 }}
                  style={{ fontSize: 30, fontWeight: 800, color: '#7ef0c3', lineHeight: 1 }}
                >
                  ✓
                </motion.span>
              ) : (
                [0, 1, 2].map((d) => (
                  <motion.span
                    key={d}
                    animate={reduced ? { opacity: 0.7 } : { opacity: [0.25, 1, 0.25] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: d * 0.2 }}
                    style={{ width: 9, height: 9, borderRadius: '50%', background: '#f0a9bf' }}
                  />
                ))
              )}
            </div>
          </Floaty>
        </motion.div>

        {/* Anotações à mão (só no caos). O wrapper posiciona; o motion.div só anima. */}
        <AnimatePresence>
          {!organized &&
            labels.map((l, i) => {
              const left = l.side === 'left';
              const edge = left ? l.at.x - ICON / 2 - 14 : l.at.x + ICON / 2 + 14;
              return (
                <div
                  key={l.text}
                  style={{
                    position: 'absolute',
                    left: `calc(50% + ${edge}px)`,
                    top: `calc(50% + ${l.at.y}px)`,
                    transform: left ? 'translate(-100%, -50%)' : 'translate(0, -50%)',
                    width: 250,
                    pointerEvents: 'none',
                  }}
                >
                  <motion.div
                    initial={{ opacity: 0, x: left ? 16 : -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, transition: { duration: 0.25 } }}
                    transition={{ delay: 0.9 + i * 0.35, duration: 0.6, ease: 'easeOut' }}
                    style={{ textAlign: left ? 'right' : 'left' }}
                  >
                    <div style={{ fontFamily: HAND, fontSize: 30, lineHeight: 1.05, fontWeight: 600, color: '#fbeef3' }}>{l.text}</div>
                    <Squiggle delay={1.2 + i * 0.35} align={left ? 'right' : 'left'} />
                  </motion.div>
                </div>
              );
            })}
        </AnimatePresence>

        {/* Marca (só na fase 2) */}
        <AnimatePresence>
          {organized && (
            <div
              style={{ position: 'absolute', left: '50%', top: `calc(50% + ${SLOT_Y + 118}px)`, transform: 'translateX(-50%)', pointerEvents: 'none' }}
            >
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 1, duration: 0.6 }}
                style={{ display: 'flex', alignItems: 'center', gap: 14 }}
              >
                <img src={logoImg} alt="Esmalt'up" draggable={false} style={{ width: 58, height: 58, objectFit: 'contain' }} />
                <span style={{ fontSize: 38, fontWeight: 800, color: '#f0a9bf' }}>Esmalt'up</span>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

export default S2;
