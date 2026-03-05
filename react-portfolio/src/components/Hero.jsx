import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '../hooks/useReducedMotion';

export default function Hero() {
  const reducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
  }, []);

  const scrollToNext = () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
    }
  };

  return (
    <motion.section
      id="hero"
      className="hero"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: reducedMotion ? 0.1 : 0.5 }}
    >
      <div className="content">
        <div className="intro-sequence">
          <motion.h1
            className="hero-text"
            initial={{ opacity: 0, y: 20 }}
            animate={mounted ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: reducedMotion ? 0.1 : 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            Shan Irshad
          </motion.h1>
          <motion.p
            className="hero-subline"
            initial={{ opacity: 0, y: 16 }}
            animate={mounted ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: reducedMotion ? 0 : 0.2, duration: reducedMotion ? 0.1 : 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            Product Manager · Engineer · Builder
          </motion.p>
        </div>
      </div>
      <motion.div
        className="scroll-indicator"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: reducedMotion ? 0 : 1.5, duration: 0.6 }}
        onClick={scrollToNext}
        whileHover={{ opacity: 0.9 }}
        style={{ cursor: 'pointer' }}
      >
        <motion.div
          className="scroll-arrow-wrapper"
          animate={reducedMotion ? {} : { y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="scroll-arrow" />
        </motion.div>
        <span className="scroll-text">Scroll</span>
      </motion.div>
    </motion.section>
  );
}
