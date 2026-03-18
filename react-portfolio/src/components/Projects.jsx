import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { useReducedMotion } from '../hooks/useReducedMotion';

const projects = [
  {
    id: 1,
    label: 'now',
    title: 'Prismo',
    description: 'AI routing layer for cost, reliability & governance.',
    link: 'https://getprismo.dev',
    logo: '/images/prismo-logo.png',
  },
  {
    id: 2,
    label: 'before',
    title: 'Ghosted',
    description: 'Deploy cloud infrastructure with plain English.',
    link: 'https://ghostedai.net',
    logo: '/images/ghosted-logo.png',
  },
];

const getInitialMobile = () => {
  if (typeof window !== 'undefined') return window.innerWidth <= 768;
  return false;
};

function ProjectRow({ project, index, reducedMotion, isMobile }) {
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
        <div className="exp-body">
          <div className="exp-header">
            <a href={project.link} target="_blank" rel="noopener noreferrer" className="cert-title-link">
              {project.title} ↗
            </a>
          </div>
          <p className="exp-description">{project.description}</p>
        </div>
        <img src={project.logo} alt={project.title} className="exp-logo project-logo-right" />
      </div>
    </motion.div>
  );
}

export default function Projects() {
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
    <section id="projects" className="modern-section experience-section" ref={sectionRef}>
      <div className="container">
        <motion.h2
          className="section-label"
          initial={{ opacity: 0, y: 0 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: reducedMotion ? 0.08 : 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          Projects
        </motion.h2>

        <div className="exp-list">
          {projects.map((project, index) => (
            <ProjectRow
              key={project.id}
              project={project}
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
