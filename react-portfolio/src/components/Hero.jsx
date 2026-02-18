import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReducedMotion } from '../hooks/useReducedMotion';
import CherryBlossomBackground from './CherryBlossomBackground';

// Check if mobile on initial render (SSR-safe)
const getInitialMobile = () => {
  if (typeof window !== 'undefined') {
    return window.innerWidth <= 768;
  }
  return false;
};

// Ethereal Horizon Background - living, breathing atmosphere
function EtherealHorizon({ reducedMotion, isMobile }) {
  // Static background on mobile for performance
  if (isMobile) {
    return (
      <div className="ethereal-horizon">
        <div className="ethereal-base" />
        <div className="light-leak light-leak-1" />
        <div className="light-leak light-leak-2" />
        <div className="light-leak light-leak-3" />
        <div className="light-leak light-leak-4" />
        <div className="light-leak light-leak-5" />
        <div className="film-grain" />
      </div>
    );
  }

  return (
    <div className="ethereal-horizon">
      <div className="ethereal-base" />
      <motion.div
        className="light-leak light-leak-1"
        animate={reducedMotion ? {} : {
          scale: [1, 1.15, 1.05, 1.1, 1],
          x: [0, 30, -20, 10, 0],
          y: [0, 20, -10, 15, 0],
          opacity: [0.4, 0.6, 0.45, 0.55, 0.4],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="light-leak light-leak-2"
        animate={reducedMotion ? {} : {
          scale: [1, 1.2, 1.1, 1.15, 1],
          x: [0, -40, 20, -15, 0],
          y: [0, 30, -20, 25, 0],
          opacity: [0.35, 0.5, 0.4, 0.45, 0.35],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />
      <motion.div
        className="light-leak light-leak-3"
        animate={reducedMotion ? {} : {
          scale: [1, 1.1, 1.2, 1.05, 1],
          x: [0, 25, -30, 15, 0],
          y: [0, -25, 15, -10, 0],
          opacity: [0.3, 0.45, 0.35, 0.4, 0.3],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
      />
      <motion.div
        className="light-leak light-leak-4"
        animate={reducedMotion ? {} : {
          opacity: [0.2, 0.35, 0.25, 0.3, 0.2],
          scale: [1, 1.08, 1.02, 1.05, 1],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />
      <motion.div
        className="light-leak light-leak-5"
        animate={reducedMotion ? {} : {
          opacity: [0.15, 0.25, 0.18, 0.22, 0.15],
          x: [0, 15, -10, 5, 0],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
      />
      <div className="film-grain" />
    </div>
  );
}

// Word carousel component
function WordCarousel({ reducedMotion, isMobile }) {
  const words = useMemo(() => [
    'Shan Irshad',
    'An Innovator',
    'A Builder',
    'A Cloud Engineer',
    'A Product Manager',
    'An AI Engineer'
  ], []);

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % words.length);
      }, 4000);
      return () => clearInterval(interval);
    }, 8000);
    return () => clearTimeout(timer);
  }, [words.length]);

  // Mobile: simple fade only
  if (isMobile) {
    return (
      <div className="word-carousel-container">
        <AnimatePresence mode="wait">
          <motion.span
            key={currentIndex}
            className="gradient-text"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            {words[currentIndex]}
          </motion.span>
        </AnimatePresence>
      </div>
    );
  }

  // Desktop: full animations
  return (
    <div className="word-carousel-container">
      <AnimatePresence mode="wait">
        <motion.span
          key={currentIndex}
          className="gradient-text glow-effect"
          initial={{ y: 40, opacity: 0, rotateX: -45, filter: 'blur(4px)' }}
          animate={{ y: 0, opacity: 1, rotateX: 0, filter: 'blur(0px)' }}
          exit={{ y: -20, opacity: 0, rotateX: 45, filter: 'blur(4px)' }}
          transition={{
            duration: reducedMotion ? 0.3 : 0.8,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          {words[currentIndex]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

export default function Hero() {
  const reducedMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(getInitialMobile);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const scrollToNext = () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
    }
  };

  // Mobile: show content immediately, no entrance animations
  if (isMobile) {
    return (
      <section id="hero" className="hero">
        <CherryBlossomBackground reducedMotion={reducedMotion} />
        <EtherealHorizon reducedMotion={reducedMotion} isMobile={true} />
        <div className="content">
          <div className="intro-sequence">
            <div className="intro-text">
              <h1 className="hero-text">
                <div className="greeting-line">
                  <span className="static-text hi">Hi,</span>
                  <span className="static-text im">I'm</span>
                </div>
                <WordCarousel reducedMotion={reducedMotion} isMobile={true} />
              </h1>
            </div>
          </div>
        </div>
        <div className="scroll-indicator" onClick={scrollToNext} style={{ cursor: 'pointer', opacity: 0.6 }}>
          <div className="scroll-arrow-wrapper">
            <div className="scroll-arrow" />
          </div>
          <span className="scroll-text">Scroll</span>
        </div>
      </section>
    );
  }

  // Desktop: full animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.6, staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  };

  return (
    <motion.section
      id="hero"
      className="hero"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <CherryBlossomBackground reducedMotion={reducedMotion} />
      <EtherealHorizon reducedMotion={reducedMotion} isMobile={false} />
      <motion.div
        className="content"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="intro-sequence">
          <div className="intro-text">
            <h1 className="hero-text">
              <motion.div className="greeting-line" variants={itemVariants}>
                <motion.span
                  className="static-text hi"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  Hi,
                </motion.span>
                <motion.span
                  className="static-text im"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  I'm
                </motion.span>
              </motion.div>
              <motion.div variants={itemVariants}>
                <WordCarousel reducedMotion={reducedMotion} isMobile={false} />
              </motion.div>
            </h1>
          </div>
        </div>
      </motion.div>
      <motion.div
        className="scroll-indicator"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 2, duration: 0.6 }}
        onClick={scrollToNext}
        whileHover={{ opacity: 1 }}
        style={{ cursor: 'pointer' }}
      >
        <motion.div
          className="scroll-arrow-wrapper"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="scroll-arrow" />
        </motion.div>
        <span className="scroll-text">Scroll</span>
      </motion.div>
    </motion.section>
  );
}
