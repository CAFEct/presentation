import { motion, AnimatePresence } from 'framer-motion';
import Eyebrow, { Led } from '../Eyebrow';
import Tilt from '../Tilt';
import { H2 } from '../Typography';
import { useState, useRef, useEffect } from 'react';

// Image paths from public folder
const paletaImg = './public/imgs/paleta.png';
const wrenchImg = './public/imgs/wrench.png';
const formaturaImg = './public/imgs/formatura.png';

// Color mapping
const LEDS = ['#f0a9bf', '#8ec5ff', '#7ef0c3'];

// Card data
const cards = [
  {
    icon: paletaImg,
    title: 'Kits de Manicure Completos',
    desc1: 'Tudo que você precisa em um único kit',
    desc2: 'Materiais profissionais de qualidade',
    color: 'var(--rose)',
    video: './public/videos/kits.mp4',
  },
  {
    icon: wrenchImg,
    title: 'Peças Avulsas',
    desc1: 'Produtos individuais para montar seu kit',
    desc2: 'Flexibilidade no que você quer comprar',
    color: 'var(--blue)',
    video: './public/videos/pecas.mp4',
  },
  {
    icon: formaturaImg,
    title: 'Curso Preparatório',
    desc1: '23 aulas com técnicas de especialistas',
    desc2: 'Do básico ao avançado, com aulas bônus',
    color: 'var(--mint)',
    video: './public/videos/curso.mp4',
  },
];

interface S3Props {
  openVideo?: number;
  setOpenVideo?: (index: number | null) => void;
}

function S3({ openVideo, setOpenVideo }: S3Props) {
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const videoRefs = useRef<{ [key: number]: HTMLVideoElement | null }>({});

  const handleCardClick = (index: number) => {
    setOpenVideo?.(index);
  };

  const handleClose = () => {
    setOpenVideo?.(null);
  };

  const handleVideoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRefs.current[openVideo ?? 0];
    if (video) {
      if (video.paused) {
        video.play();
      } else {
        video.pause();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClose();
    } else if (e.key === 'ArrowLeft' && openVideo! > 0) {
      setOpenVideo?.(openVideo! - 1);
    } else if (e.key === 'ArrowRight' && openVideo! < cards.length - 1) {
      setOpenVideo?.(openVideo! + 1);
    } else if (e.key === ' ') {
      e.preventDefault();
      handleVideoClick(e as any);
    }
  };

  useEffect(() => {
    if (openVideo !== null) {
      const video = videoRefs.current[openVideo];
      if (video) {
        video.currentTime = 0;
        video.play().catch(() => {});
      }
    }
  }, [openVideo, videoRefs]);

  return (
    <>
      <Eyebrow>O que é o Esmalt'up</Eyebrow>
      <H2>
        Três programas <em style={{ color: 'var(--rose)' }}>integrados</em>
      </H2>

      {/* Three glass cards */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 24,
          marginTop: 40,
        }}
      >
        {cards.map((card, index) => (
          <Tilt key={card.title} ledColor={card.color}>
            <motion.div
              className="glass"
              style={{
                width: 340,
                height: 340,
                padding: 28,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                cursor: 'pointer',
                border: `1px solid ${card.color}33`,
              }}
              whileHover={{ scale: 1.03 }}
              onClick={() => handleCardClick(index)}
            >
              {/* Browser-like header dots */}
              <div style={{
                display: 'flex',
                gap: 6,
                marginBottom: 20,
                alignSelf: 'flex-start',
              }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'rgba(255,0,0,0.4)' }} />
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'rgba(255,165,0,0.4)' }} />
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'rgba(0,128,0,0.4)' }} />
              </div>

              {/* Icon */}
              <img
                src={card.icon}
                alt={card.title}
                style={{
                  width: 72,
                  height: 72,
                  objectFit: 'contain',
                  marginBottom: 20,
                  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.15))',
                }}
              />

              {/* Title */}
              <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16, color: card.color }}>
                {card.title}
              </h3>

              {/* Description with dots */}
              <div style={{ fontSize: 18, lineHeight: 1.6, color: 'var(--text)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 8 }}>
                  <span style={{ color: card.color, marginTop: 6 }}>•</span>
                  <span>{card.desc1}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <span style={{ color: card.color, marginTop: 6 }}>•</span>
                  <span>{card.desc2}</span>
                </div>
              </div>

              {/* View button */}
              <motion.button
                className="glass"
                style={{
                  marginTop: 'auto',
                  padding: '8px 16px',
                  fontSize: 14,
                  border: `1px solid ${card.color}`,
                  color: card.color,
                  background: 'transparent',
                  cursor: 'pointer',
                }}
                whileHover={{ scale: 1.05 }}
              >
                ▶ Ver no site
              </motion.button>
            </motion.div>
          </Tilt>
        ))}
      </div>

      {/* Video Pop-up */}
      <AnimatePresence>
        {openVideo !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
            }}
          >
            <motion.div
              layoutId={`card-${openVideo}`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass"
              style={{
                width: 960,
                height: 580,
                display: 'flex',
                borderRadius: 16,
                overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.2)',
              }}
            >
              {/* Left menu */}
              <div style={{
                width: 200,
                background: 'rgba(0,0,0,0.3)',
                padding: 20,
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
              }}>
                {cards.map((card, i) => (
                  <motion.button
                    key={i}
                    onClick={() => setOpenVideo?.(i)}
                    style={{
                      padding: 12,
                      background: openVideo === i ? card.color : 'rgba(255,255,255,0.05)',
                      border: 'none',
                      borderRadius: 8,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      color: openVideo === i ? '#fff' : 'var(--text)',
                    }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <img
                      src={card.icon}
                      alt={card.title}
                      style={{ width: 32, height: 32, objectFit: 'contain' }}
                    />
                    <span style={{ fontSize: 14, fontWeight: 600 }}>{card.title.split(' ')[0]}</span>
                  </motion.button>
                ))}
              </div>

              {/* Right video area */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 20 }}>
                {/* Browser header */}
                <div style={{
                  display: 'flex',
                  gap: 6,
                  marginBottom: 12,
                  paddingBottom: 8,
                  borderBottom: '1px solid rgba(255,255,255,0.1)',
                }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'rgba(255,255,255,0.3)' }} />
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'rgba(255,255,255,0.3)' }} />
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'rgba(255,255,255,0.3)' }} />
                </div>

                {/* Video */}
                <div style={{ flex: 1, background: '#000', borderRadius: 8, overflow: 'hidden', position: 'relative' }}>
                  <video
                    ref={(el) => { if (openVideo !== null) videoRefs.current[openVideo] = el; }}
                    src={cards[openVideo!].video}
                    autoPlay
                    muted
                    loop
                    playsInline
                    onClick={handleVideoClick}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                    }}
                    onError={(e) => {
                      const video = e.target as HTMLVideoElement;
                      video.style.display = 'none';
                      const fallback = video.nextElementSibling as HTMLDivElement;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                  {/* Fallback if video doesn't exist */}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'none',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--muted)',
                    fontSize: 18,
                  }}>
                    Vídeo em breve
                  </div>
                </div>

                {/* Caption */}
                <div style={{ marginTop: 12, fontSize: 16, color: 'var(--text)' }}>
                  {cards[openVideo!].title}
                </div>

                {/* Close button */}
                <button
                  onClick={handleClose}
                  style={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.1)',
                    border: 'none',
                    color: '#fff',
                    cursor: 'pointer',
                    fontSize: 20,
                  }}
                >
                  ×
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default S3;