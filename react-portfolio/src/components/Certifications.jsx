import { useRef, useState, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useReducedMotion } from '../hooks/useReducedMotion';

const certifications = [
  {
    id: 1,
    title: 'Microsoft Azure Administrator',
    badge: 'https://learn.microsoft.com/en-us/media/learn/certification/badges/microsoft-certified-associate-badge.svg',
    hoverTitle: 'Azure Administrator',
    hoverDescription: 'Managing Azure resources & infrastructure',
    date: 'February 2025',
    description: 'Certified in implementing, managing, and monitoring identity, governance, storage, compute, and virtual networks in a cloud environment.',
    link: 'https://learn.microsoft.com/en-us/users/irshadshanmikael-1967/credentials/5f29ed6b13d6e248?ref=https%3A%2F%2Fwww.linkedin.com%2F',
  },
  {
    id: 2,
    title: 'Microsoft Azure Fundamentals',
    badge: 'https://learn.microsoft.com/en-us/media/learn/certification/badges/microsoft-certified-fundamentals-badge.svg',
    hoverTitle: 'Azure Fundamentals',
    hoverDescription: 'Cloud concepts & Azure basics',
    date: 'July 2024',
    description: 'Certified in cloud concepts, Azure services, Azure workloads, security and privacy in Azure, and Azure pricing and support.',
    link: 'https://learn.microsoft.com/en-us/users/irshadshanmikael-1967/credentials/492a6cf91ff5ff73',
  },
];

// Check if mobile on initial render
const getInitialMobile = () => {
  if (typeof window !== 'undefined') {
    return window.innerWidth <= 768;
  }
  return false;
};

function CertificationCard({ cert, index, reducedMotion, isMobile }) {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, margin: isMobile ? '0px' : '-50px' });

  // Mobile: simple fade
  if (isMobile) {
    return (
      <motion.div
        ref={cardRef}
        className="certification-card"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.4 }}
      >
        <div className="certification-badge-container">
          <img src={cert.badge} alt={cert.title} className="certification-badge" />
        </div>
        <div className="certification-details">
          <h3 className="certification-title">
            Microsoft <span className="gradient-role">{cert.hoverTitle}</span>
          </h3>
          <span className="experience-date-pill">{cert.date}</span>
          <a href={cert.link} target="_blank" rel="noopener noreferrer" className="certification-link">
            <i className="fas fa-external-link-alt" /> View Certification
          </a>
        </div>
      </motion.div>
    );
  }

  // Desktop: full animations
  return (
    <motion.div
      ref={cardRef}
      className="certification-card"
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        delay: index * 0.15,
        duration: reducedMotion ? 0.1 : 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{
        y: -5,
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.15), 0 4px 6px -2px rgba(0, 0, 0, 0.1)',
        transition: { duration: 0.3 },
      }}
    >
      <motion.div
        className="certification-badge-container"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ scale: 1.05 }}
      >
        <motion.img
          src={cert.badge}
          alt={cert.title}
          className="certification-badge"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: index * 0.15 + 0.2, duration: 0.5 }}
        />
        <AnimatePresence>
          {isHovered && (
            <motion.div
              className="certification-hover-info"
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '100%' }}
              transition={{ duration: 0.4, ease: [0.175, 0.885, 0.32, 1.275] }}
            >
              <h4>{cert.hoverTitle}</h4>
              <p>{cert.hoverDescription}</p>
              <span className="certification-date">{cert.date}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <div className="certification-details">
        <motion.h3
          className="certification-title"
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: index * 0.15 + 0.3, duration: 0.5 }}
        >
          Microsoft <span className="gradient-role">{cert.hoverTitle}</span>
        </motion.h3>
        <motion.span
          className="experience-date-pill"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: index * 0.15 + 0.4, duration: 0.4 }}
        >
          {cert.date}
        </motion.span>
        <motion.a
          href={cert.link}
          target="_blank"
          rel="noopener noreferrer"
          className="certification-link"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: index * 0.15 + 0.5, duration: 0.4 }}
          whileHover={{ x: 5, color: '#be185d' }}
        >
          <i className="fas fa-external-link-alt" /> View Certification
        </motion.a>
      </div>
    </motion.div>
  );
}

export default function Certifications() {
  const reducedMotion = useReducedMotion();
  const sectionRef = useRef(null);
  const [isMobile, setIsMobile] = useState(getInitialMobile);
  const isInView = useInView(sectionRef, { once: true, margin: isMobile ? '0px' : '-100px' });

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <section id="certifications" className="modern-section certifications-section" ref={sectionRef}>
      <div className="container">
        <motion.h2
          className="section-subtitle text-center"
          initial={{ opacity: 0, y: isMobile ? 0 : 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: isMobile ? 0.3 : 0.6 }}
        >
          <span className="section-title-gradient">Certifications</span>
        </motion.h2>

        <div className="certifications-container">
          {certifications.map((cert, index) => (
            <CertificationCard
              key={cert.id}
              cert={cert}
              index={index}
              reducedMotion={reducedMotion}
              isMobile={isMobile}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
