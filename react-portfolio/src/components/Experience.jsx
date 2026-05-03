import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { useReducedMotion } from '../hooks/useReducedMotion';

const experiences = [
  {
    id: 3,
    date: 'current',
    company: 'LvlUp VC',
    title: 'venture',
    logo: 'https://shanirshad.com/images/lvlup_vc_logo.jpeg',
    description: "selected for LvlUp VC's residency program, partnering with AI founders on thesis-driven strategy, category creation, and scaling.",
  },
  {
    id: 1,
    date: '2025',
    company: 'Mastercard',
    title: 'platform engineer',
    logo: 'https://shanirshad.com/images/mastercard-logo.png',
    description: 'ai tooling for incident triage and infra automation at scale.',
  },
  {
    id: 2,
    date: '2025',
    company: 'Nutrify AI',
    title: 'product engineer',
    logo: 'https://shanirshad.com/images/nutrify-logo.jpeg',
    description: 'shipped llm and computer vision features for an ai nutrition platform.',
  },
];

const getInitialMobile = () => {
  if (typeof window !== 'undefined') return window.innerWidth <= 768;
  return false;
};

function ExperienceRow({ experience, index, reducedMotion, isMobile }) {
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
          <span className="exp-date">{experience.date}</span>
          <p className="exp-combined-title">
            {experience.company}
            <span className="exp-dot"> · </span>
            {experience.title}
          </p>
          <p className="exp-description">{experience.description}</p>
        </div>
        <img src={experience.logo} alt={experience.company} className="exp-logo-right" />
      </div>
    </motion.div>
  );
}

export default function Experience() {
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
    <section id="experience" className="modern-section experience-section" ref={sectionRef}>
      <div className="container">
        <motion.h2
          className="section-label"
          initial={{ opacity: 0, y: 0 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: reducedMotion ? 0.08 : 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          experience
        </motion.h2>

        <div className="exp-list">
          {experiences.map((exp, index) => (
            <ExperienceRow
              key={exp.id}
              experience={exp}
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
