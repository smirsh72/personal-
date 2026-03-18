import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const { toggleTheme } = useTheme();
  const reducedMotion = useReducedMotion();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [activeSection, setActiveSection] = useState('about');
  const [isMobile, setIsMobile] = useState(false);
  const lastScrollYRef = useRef(0);
  const isHiddenRef = useRef(false);
  const themeToggleRef = useRef(null);
  const themeToggleTimerRef = useRef(null);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 50);

      const entrySection = document.getElementById('about') || document.getElementById('hero');
      const entryBottom = entrySection ? entrySection.getBoundingClientRect().bottom : Number.POSITIVE_INFINITY;
      const directionDown = currentScrollY > lastScrollYRef.current + 2;
      const directionUp = currentScrollY < lastScrollYRef.current - 2;
      let nextHidden = isHiddenRef.current;

      if (isMobile) {
        const passedEntry = entryBottom <= 24;
        const nearEntry = entryBottom > 56;
        if (directionUp || nearEntry) {
          nextHidden = false;
        } else if (directionDown && passedEntry) {
          nextHidden = true;
        }
      } else {
        if (directionDown && currentScrollY > 100) {
          nextHidden = true;
        } else if (directionUp || currentScrollY <= 100) {
          nextHidden = false;
        }
      }

      if (nextHidden !== isHiddenRef.current) {
        isHiddenRef.current = nextHidden;
        setIsHidden(nextHidden);
      }

      lastScrollYRef.current = currentScrollY;

      // Determine active section
      const sections = ['projects', 'experience', 'about'];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element && element.getBoundingClientRect().top <= 100) {
          setActiveSection((prev) => (prev === section ? prev : section));
          break;
        }
      }
    };

    lastScrollYRef.current = window.scrollY;
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile]);

  useEffect(() => {
    return () => {
      if (themeToggleTimerRef.current) {
        window.clearTimeout(themeToggleTimerRef.current);
      }
    };
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
    }
  };

  const navLinks = [
    { id: 'experience', label: 'experience' },
    { id: 'projects', label: 'projects' },
  ];

  const handleThemeToggle = () => {
    toggleTheme();

    const button = themeToggleRef.current;
    if (!button) return;

    button.classList.remove('theme-toggle-animation');
    // Force reflow so repeated clicks replay the micro-interaction.
    void button.offsetWidth;
    button.classList.add('theme-toggle-animation');

    if (themeToggleTimerRef.current) {
      window.clearTimeout(themeToggleTimerRef.current);
    }

    themeToggleTimerRef.current = window.setTimeout(() => {
      button.classList.remove('theme-toggle-animation');
    }, 430);
  };

  return (
    <motion.nav
      className={`navbar ${isScrolled ? 'sticky-nav' : ''} ${isHidden ? 'navbar-hidden' : ''}`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: isHidden ? -100 : 0, opacity: isHidden ? 0 : 1 }}
      transition={{
        duration: reducedMotion ? 0.1 : 0.3,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
    >
      <div className="navbar-container">
        <div className="navbar-links">
          {navLinks.map((link, index) => (
            <motion.a
              key={link.id}
              href={`#${link.id}`}
              className={`navbar-link ${activeSection === link.id ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); scrollToSection(link.id); }}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: reducedMotion ? 0 : 0.1 * index,
                duration: reducedMotion ? 0.1 : 0.4
              }}
              whileHover={reducedMotion ? {} : {
                y: -2,
                transition: { duration: 0.2 }
              }}
            >
              {link.label}
            </motion.a>
          ))}
          <motion.button
            ref={themeToggleRef}
            className="theme-toggle founder-toggle"
            onClick={handleThemeToggle}
            whileHover={reducedMotion ? {} : { scale: 1.04 }}
            whileTap={reducedMotion ? {} : { scale: 0.97 }}
            transition={{ duration: reducedMotion ? 0.1 : 0.2 }}
            aria-label="Toggle dark mode"
          >
            <i className="fas fa-moon moon-icon" aria-hidden="true" />
            <i className="fas fa-sun sun-icon" aria-hidden="true" />
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
}
