import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { useReducedMotion } from '../hooks/useReducedMotion';

const certifications = [
  {
    id: 1,
    title: 'Azure Administrator',
    issuer: 'Microsoft',
    date: 'Feb 2025',
    description: 'Managing Azure resources, identity, governance, storage, compute, and virtual networks.',
    link: 'https://learn.microsoft.com/en-us/users/irshadshanmikael-1967/credentials/5f29ed6b13d6e248?ref=https%3A%2F%2Fwww.linkedin.com%2F',
  },
  {
    id: 2,
    title: 'Azure Fundamentals',
    issuer: 'Microsoft',
    date: 'Jul 2024',
    description: 'Cloud concepts, Azure services, workloads, security, privacy, and pricing.',
    link: 'https://learn.microsoft.com/en-us/users/irshadshanmikael-1967/credentials/492a6cf91ff5ff73',
  },
];

const getInitialMobile = () => {
  if (typeof window !== 'undefined') return window.innerWidth <= 768;
  return false;
};

function CertRow({ cert, index, reducedMotion, isMobile }) {
  const rowRef = useRef(null);
  const isInView = useInView(rowRef, { once: true, margin: isMobile ? '-20px' : '-50px' });

  return (
    <motion.div
      ref={rowRef}
      className="exp-row"
      initial={{ opacity: 0, y: reducedMotion ? 0 : 5 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.05, duration: reducedMotion ? 0.08 : 0.24, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className="about-divider" />
      <div className="exp-row-inner">
        <span className="exp-date">{cert.date}</span>
        <div className="exp-body">
          <div className="exp-header">
            <a href={cert.link} target="_blank" rel="noopener noreferrer" className="cert-title-link">
              {cert.issuer} {cert.title} {'\u2197\uFE0E'}
            </a>
          </div>
          <p className="exp-description">{cert.description}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function Certifications() {
  const reducedMotion = useReducedMotion();
  const sectionRef = useRef(null);
  const [isMobile, setIsMobile] = useState(getInitialMobile);
  const isInView = useInView(sectionRef, { once: true, margin: isMobile ? '100px' : '-100px' });

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <section id="certifications" className="modern-section certifications-section" ref={sectionRef}>
      <div className="container">
        <motion.h2
          className="section-label"
          initial={{ opacity: 0, y: 0 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: reducedMotion ? 0.08 : 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          Certifications
        </motion.h2>

        <div className="exp-list">
          {certifications.map((cert, index) => (
            <CertRow
              key={cert.id}
              cert={cert}
              index={index}
              reducedMotion={reducedMotion}
              isMobile={isMobile}
            />
          ))}
          <div className="about-divider" />
        </div>
      </div>
    </section>
  );
}
