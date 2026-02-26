import { useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useReducedMotion } from '../hooks/useReducedMotion';

export default function FloatingOrb() {
  const reducedMotion = useReducedMotion();
  const [windowHeight, setWindowHeight] = useState(0);

  const { scrollY } = useScroll();

  // Smooth spring for the orb position
  const smoothY = useSpring(scrollY, {
    stiffness: 50,
    damping: 20,
    mass: 0.5
  });

  // Transform scroll position to orb position (follows scroll with offset)
  const orbY = useTransform(smoothY, [0, 5000], [100, 4500]);

  // Subtle horizontal movement based on scroll
  const orbX = useTransform(smoothY,
    [0, 1000, 2000, 3000, 4000],
    [20, 80, 30, 70, 40]
  );

  // Scale changes slightly as you scroll
  const orbScale = useTransform(smoothY,
    [0, 1000, 2000, 3000],
    [1, 1.2, 0.9, 1.1]
  );

  // Rotation for extra dynamism
  const orbRotate = useTransform(smoothY, [0, 3000], [0, 180]);

  useEffect(() => {
    setWindowHeight(window.innerHeight);
    const handleResize = () => setWindowHeight(window.innerHeight);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (reducedMotion) return null;

  return (
    <motion.div
      className="floating-orb-container"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
      }}
    >
      {/* Main gradient orb */}
      <motion.div
        className="floating-orb"
        style={{
          position: 'absolute',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle at 30% 30%, rgba(236, 72, 153, 0.15), rgba(139, 92, 246, 0.1), transparent 70%)',
          filter: 'blur(60px)',
          y: orbY,
          x: orbX,
          scale: orbScale,
          rotate: orbRotate,
        }}
      />

      {/* Secondary smaller orb */}
      <motion.div
        className="floating-orb-secondary"
        style={{
          position: 'absolute',
          width: '250px',
          height: '250px',
          borderRadius: '50%',
          background: 'radial-gradient(circle at 50% 50%, rgba(249, 115, 22, 0.12), rgba(236, 72, 153, 0.08), transparent 70%)',
          filter: 'blur(50px)',
          right: '10%',
          y: useTransform(smoothY, [0, 5000], [200, 4200]),
          scale: useTransform(smoothY, [0, 1000, 2000], [0.8, 1.1, 0.9]),
        }}
      />

      {/* Accent glow that pulses */}
      <motion.div
        className="floating-orb-accent"
        style={{
          position: 'absolute',
          width: '150px',
          height: '150px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.2), transparent 60%)',
          filter: 'blur(30px)',
          left: '60%',
          y: useTransform(smoothY, [0, 5000], [300, 4000]),
        }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </motion.div>
  );
}
