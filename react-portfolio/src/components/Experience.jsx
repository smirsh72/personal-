import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { useReducedMotion } from '../hooks/useReducedMotion';

const experiences = [
  {
    id: 1,
    title: 'Site Reliability Engineer Intern',
    company: 'Mastercard',
    date: 'Summer 2025',
    logo: 'https://shanirshad.com/images/mastercard-logo.png',
    bullets: [
      '40% reduction in mean time to triage by building an AI-powered incident management tool with Python, LLMs, Splunk & Remedy APIs',
      '25% improvement in anomaly detection accuracy by engineering ML algorithms across 100K+ log events',
      '40% faster deployment cycles by automating cloud infrastructure provisioning with Terraform & Jenkins CI/CD',
    ],
  },
  {
    id: 2,
    title: 'Technical Product Manager',
    company: 'Nutrify AI',
    date: 'Spring 2025',
    logo: 'https://shanirshad.com/images/nutrify-logo.jpeg',
    bullets: [
      '25% increase in app downloads by building a conversational AI chatbot with FastAPI & OpenAI, validated through 15 interviews and 100+ surveys',
      '45% boost in user engagement by implementing ML-powered personalization features',
      '30% lift in overall user activity by optimizing performance and leading technical architecture for the nutrition platform',
    ],
  },
];

// Check if mobile on initial render
const getInitialMobile = () => {
  if (typeof window !== 'undefined') {
    return window.innerWidth <= 768;
  }
  return false;
};

function ExperienceCard({ experience, index, reducedMotion, isMobile }) {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, margin: isMobile ? '0px' : '-50px' });

  // Mobile: show immediately with simple fade
  if (isMobile) {
    return (
      <motion.div
        ref={cardRef}
        className="experience-card"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.4 }}
      >
        <div className="experience-card-content">
          <div className="company-logo-wrapper">
            <div className="company-logo-container">
              <img src={experience.logo} alt={`${experience.company} logo`} className="company-logo" />
            </div>
          </div>
          <div className="experience-details">
            <div className="experience-header">
              <h3 className="experience-title">
                <span className="gradient-role">{experience.title}</span>
              </h3>
              <p className="experience-company">@ {experience.company}</p>
              <span className="experience-date-pill">{experience.date}</span>
            </div>
            <ul className="experience-bullets">
              {experience.bullets.map((bullet, i) => (
                <li key={i} className="experience-bullet">{bullet}</li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>
    );
  }

  // Desktop: full animations
  return (
    <motion.div
      ref={cardRef}
      className="experience-card"
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
      <div className="experience-card-content">
        <div className="company-logo-wrapper">
          <div className="company-logo-container">
            <img src={experience.logo} alt={`${experience.company} logo`} className="company-logo" />
          </div>
        </div>
        <div className="experience-details">
          <div className="experience-header">
            <h3 className="experience-title">
              <span className="gradient-role">{experience.title}</span>
            </h3>
            <p className="experience-company">@ {experience.company}</p>
            <span className="experience-date-pill">{experience.date}</span>
          </div>
          <ul className="experience-bullets">
            {experience.bullets.map((bullet, i) => (
              <li key={i} className="experience-bullet">{bullet}</li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}

export default function Experience() {
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
    <section id="experience" className="modern-section experience-section" ref={sectionRef}>
      <div className="container">
        <motion.h2
          className="section-subtitle text-center"
          initial={{ opacity: 0, y: isMobile ? 0 : 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: isMobile ? 0.3 : 0.6 }}
        >
          <span className="section-title-gradient">Experience</span>
        </motion.h2>

        <div className="experience-cards">
          {experiences.map((exp, index) => (
            <ExperienceCard
              key={exp.id}
              experience={exp}
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
