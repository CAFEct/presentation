import { useState, useEffect } from 'react';
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion';

import S1 from './components/Slides/S1';
import S2 from './components/Slides/S2';
import S3 from './components/Slides/S3';
import S4 from './components/Slides/S4';
import S5 from './components/Slides/S5';
import S6 from './components/Slides/S6';
import S7 from './components/Slides/S7';
import S8 from './components/Slides/S8';
import S9 from './components/Slides/S9';
import S10 from './components/Slides/S10';

const SLIDES = [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10];
const LEDS = [
  '#f0a9bf',
  '#f0a9bf',
  '#8ec5ff',
  '#7ef0c3',
  '#7ef0c3',
  '#ffd98a',
  '#ffd98a',
  '#ff5b78',
  '#d9708f',
  '#f0a9bf',
];

const shell = {
  enter: (d: number) => ({
    opacity: 0,
    x: d * 280,
    rotateY: d * -38,
    rotateX: d * 15,
    scale: 0.86,
    z: -100,
  }),
  center: {
    opacity: 1,
    x: 0,
    rotateY: 0,
    rotateX: 0,
    scale: 1,
    z: 0,
    transition: {
      duration: 0.85,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.09,
      delayChildren: 0.3,
    },
  },
  exit: (d: number) => ({
    opacity: 0,
    x: d * -280,
    rotateY: d * 38,
    rotateX: d * -15,
    scale: 0.86,
    z: -100,
    transition: { duration: 0.5, ease: [0.65, 0, 0.35, 1] },
  }),
};

function App() {
  const [[idx, dir], setPage] = useState<[number, number]>([0, 1]);
  const [scale, setScale] = useState(1);
  const [slide2Toggle, setSlide2Toggle] = useState(false);
  const [slide3Video, setSlide3Video] = useState<number | null>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const px = useSpring(mx, { stiffness: 40, damping: 20 });
  const py = useSpring(my, { stiffness: 40, damping: 20 });

  const go = (n: number) =>
    setPage(([i]) => {
      const x = Math.max(0, Math.min(SLIDES.length - 1, n));
      setSlide2Toggle(false);
      setSlide3Video(null);
      return [x, x >= i ? 1 : -1];
    });

  const step = (d: number) =>
    setPage(([i]) => {
      // If video pop-up is open on slide 3, don't navigate
      if (i === 2 && slide3Video !== null) {
        return [i, d];
      }
      const x = Math.max(0, Math.min(SLIDES.length - 1, i + d));
      if (x === i) {
        // Special case for slide 2: toggle between chaos and organized
        if (i === 1 && d === 1) {
          setSlide2Toggle(!slide2Toggle);
          return [i, d];
        }
        return [i, d];
      }
      setSlide2Toggle(false);
      setSlide3Video(null);
      return [x, d];
    });

  useEffect(() => {
    const f = () => setScale(Math.min(innerWidth / 1280, innerHeight / 720));
    f();
    addEventListener('resize', f);
    return () => removeEventListener('resize', f);
  }, []);

  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      const key = e.key;
      // If video pop-up is open, handle special keys
      if (slide3Video !== null) {
        if (key === 'Escape') {
          setSlide3Video(null);
          return;
        }
        if (key === 'ArrowLeft' && slide3Video > 0) {
          setSlide3Video(slide3Video - 1);
          return;
        }
        if (key === 'ArrowRight' && slide3Video < 2) {
          setSlide3Video(slide3Video + 1);
          return;
        }
        return; // Don't handle navigation when video is open
      }
      if (key === 'f' || key === 'F') {
        document.fullScreenElement
          ? (document as any).exitFullscreen()
          : (document.documentElement as any).requestFullscreen().catch(() => {});
        return;
      }
      if (key === ' ') {
        e.preventDefault();
        step(e.shiftKey ? -1 : 1);
      } else if (['ArrowRight', 'ArrowDown', 'PageDown'].includes(key)) {
        e.preventDefault();
        step(1);
      } else if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(key)) {
        e.preventDefault();
        step(-1);
      } else if (key === 'Home')
        go(0);
      else if (key === 'End')
        go(SLIDES.length - 1);
      else if (idx === 2 && ['1', '2', '3'].includes(key)) {
        // Open videos 1, 2, 3 on slide 3
        setSlide3Video(parseInt(key) - 1);
      }
    };
    addEventListener('keydown', k);
    return () => removeEventListener('keydown', k);
  }, [go, step, slide2Toggle, slide3Video, idx]);

  useEffect(() => {
    const m = (e: MouseEvent) => {
      mx.set((e.clientX / innerWidth - 0.5) * -60);
      my.set((e.clientY / innerHeight - 0.5) * -40);
    };
    addEventListener('mousemove', m);
    return () => removeEventListener('mousemove', m);
  }, [mx, my]);

  const Cur = SLIDES[idx];

  return (
    <div id="stage" style={{ transform: `translate(-50%, -50%) scale(${scale})` }}>
      {/* 3D Grid Background */}
      <div className="bg-grid" />

      {/* Floating 3D Orbs - Primary */}
      <motion.div
        className="orb"
        style={{
          x: px,
          y: py,
          width: 420,
          height: 420,
          left: -80,
          top: -100,
          background: 'rgba(217, 112, 143, 0.32)',
          filter: 'blur(80px)',
        }}
        animate={{ scale: [1, 1.2, 1], rotate: [0, 45, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Floating 3D Orbs - Secondary */}
      <motion.div
        className="orb"
        style={{
          x: py,
          y: px,
          width: 380,
          height: 380,
          right: -100,
          bottom: -120,
          background: 'rgba(142, 197, 255, 0.16)',
          filter: 'blur(70px)',
        }}
        animate={{ scale: [1.1, 0.9, 1.1], rotate: [0, -30, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Additional floating 3D elements */}
      <motion.div
        className="orb"
        style={{
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: 'rgba(240, 169, 191, 0.15)',
          filter: 'blur(50px)',
          position: 'absolute',
          right: 100,
          top: 50,
        }}
        animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="orb"
        style={{
          width: 180,
          height: 180,
          borderRadius: '50%',
          background: 'rgba(126, 240, 195, 0.12)',
          filter: 'blur(45px)',
          position: 'absolute',
          left: -120,
          bottom: 80,
        }}
        animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* 3D Particles effect */}
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          opacity: 0.15,
        }}
      >
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              width: 4,
              height: 4,
              borderRadius: '50%',
              background: '#f0a9bf',
            }}
            animate={{
              x: [0, Math.random() * 200 - 100, 0],
              y: [0, Math.random() * 200 - 100, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 6 + i * 0.3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </motion.div>

      <AnimatePresence mode="wait" custom={dir}>
        <motion.div
          key={idx}
          className="scene"
          custom={dir}
          variants={shell}
          initial="enter"
          animate="center"
          exit="exit"
        >
          {idx === 1 ? (
            <Cur toggle={slide2Toggle} setToggle={setSlide2Toggle} />
          ) : idx === 2 ? (
            <Cur openVideo={slide3Video} setOpenVideo={setSlide3Video} />
          ) : (
            <Cur />
          )}
        </motion.div>
      </AnimatePresence>

      <div className="hud">
        <span style={{ opacity: 0.7 }}>
          F tela cheia · espaço / setas para navegar
          {idx === 2 && ' · 1/2/3 para vídeos'}
        </span>
        <div className="nav">
          <button className="arrow" onClick={() => step(-1)}>
            ‹
          </button>
          {SLIDES.map((_, i) => (
            <motion.button
              key={i}
              className="dot"
              onClick={() => go(i)}
              animate={{
                scale: i === idx ? 1.5 : 1,
                background: i === idx ? LEDS[i] : 'rgba(255, 255, 255, 0.2)',
              }}
            />
          ))}
          <button className="arrow" onClick={() => step(1)}>
            ›
          </button>
        </div>
        <span>
          {idx + 1} / {SLIDES.length}
        </span>
      </div>
    </div>
  );
}

export default App;