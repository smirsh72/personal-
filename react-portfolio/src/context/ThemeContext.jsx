import { createContext, useContext, useState, useEffect, useRef } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved || 'light';
  });
  const hasMounted = useRef(false);
  const transitionTimerRef = useRef(null);
  const transitionFrameOneRef = useRef(null);
  const transitionFrameTwoRef = useRef(null);

  useEffect(() => {
    const root = document.documentElement;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const clearTransitionState = () => {
      if (transitionTimerRef.current) {
        window.clearTimeout(transitionTimerRef.current);
      }
      if (transitionFrameOneRef.current) {
        window.cancelAnimationFrame(transitionFrameOneRef.current);
      }
      if (transitionFrameTwoRef.current) {
        window.cancelAnimationFrame(transitionFrameTwoRef.current);
      }
      root.classList.remove('theme-transitioning');
    };
    const applyTheme = () => {
      root.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
    };

    if (hasMounted.current && !reduceMotion) {
      clearTransitionState();
      root.classList.add('theme-transitioning');

      transitionFrameOneRef.current = window.requestAnimationFrame(() => {
        transitionFrameTwoRef.current = window.requestAnimationFrame(() => {
          applyTheme();
          transitionTimerRef.current = window.setTimeout(() => {
            root.classList.remove('theme-transitioning');
          }, 280);
        });
      });
    } else {
      clearTransitionState();
      applyTheme();
    }

    hasMounted.current = true;

    return () => {
      clearTransitionState();
    };
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
