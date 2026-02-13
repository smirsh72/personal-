import { useState, useEffect } from 'react';

export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (event) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return prefersReducedMotion;
}

// Mobile-optimized animation variants
export const mobileOptimizedVariants = (reducedMotion) => ({
  fadeInUp: {
    initial: { opacity: 0, y: reducedMotion ? 0 : 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: reducedMotion ? 0 : -10 },
    transition: { duration: reducedMotion ? 0.1 : 0.5, ease: [0.25, 0.46, 0.45, 0.94] }
  },
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: reducedMotion ? 0.1 : 0.4 }
  },
  scaleIn: {
    initial: { opacity: 0, scale: reducedMotion ? 1 : 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: reducedMotion ? 1 : 0.95 },
    transition: { duration: reducedMotion ? 0.1 : 0.4 }
  },
  slideInLeft: {
    initial: { opacity: 0, x: reducedMotion ? 0 : -30 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: reducedMotion ? 0 : 30 },
    transition: { duration: reducedMotion ? 0.1 : 0.5, ease: 'easeOut' }
  },
  slideInRight: {
    initial: { opacity: 0, x: reducedMotion ? 0 : 30 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: reducedMotion ? 0 : -30 },
    transition: { duration: reducedMotion ? 0.1 : 0.5, ease: 'easeOut' }
  }
});
