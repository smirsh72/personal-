import { useState, useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';

function SocialLink({ href, icon, label }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="about-social-link"
      aria-label={label}
    >
      <i className={icon} />
      <span>{label}</span>
    </a>
  );
}

const getInitialMobile = () => {
  if (typeof window !== 'undefined') return window.innerWidth <= 768;
  return false;
};

export default function About() {
  const sectionRef = useRef(null);
  const [isMobile, setIsMobile] = useState(getInitialMobile);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const isInView = useInView(sectionRef, { once: true, margin: isMobile ? '200px' : '-100px' });

  const containerVariants = {
    hidden: { opacity: isMobile ? 1 : 0 },
    visible: {
      opacity: 1,
      transition: { duration: isMobile ? 0 : 0.3, staggerChildren: isMobile ? 0 : 0.08 },
    },
  };

  const itemVariants = {
    hidden: { opacity: isMobile ? 1 : 0, y: 0 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: isMobile ? 0 : 0.28, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  };

  return (
    <section id="about" className="modern-section about-section" ref={sectionRef}>
      <div className="container">
        <motion.div
          className="about-hero-grid"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          <motion.div className="about-hero-left" variants={itemVariants}>
            <h1 className="about-hero-name">Shan Irshad</h1>
            <p className="about-hero-tagline">Infrastructure, ML, and venture.</p>
            <div className="about-social-links">
              <SocialLink href="https://www.linkedin.com/in/shan-irshad/" icon="fab fa-linkedin-in" label="LinkedIn" />
              <SocialLink href="mailto:shanirshad8@gmail.com" icon="far fa-envelope" label="Email" />
              <SocialLink href="tel:+14695449186" icon="fas fa-phone" label="Phone" />
            </div>
          </motion.div>

          <motion.div className="about-hero-right" variants={itemVariants}>
            <img
              src="/images/profile-pic.jpg"
              alt="Shan Irshad"
              className="about-hero-photo"
              loading="eager"
              decoding="async"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
