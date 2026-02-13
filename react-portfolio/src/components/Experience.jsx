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
    description: `During my internship at Mastercard, I developed an AI-powered incident management tool using Python and LLMs that automated data ingestion from Splunk and Remedy APIs, reducing mean time to triage by 40%. I also engineered ML detection algorithms to analyze over 100,000 log events, which improved anomaly detection accuracy by 25% while automating cloud infrastructure provisioning using Terraform and Jenkins CI/CD pipelines to accelerate deployment cycles by 40%.`,
  },
  {
    id: 2,
    title: 'Technical Product Manager',
    company: 'Nutrify AI',
    date: 'Spring 2025',
    logo: 'https://shanirshad.com/images/nutrify-logo.jpeg',
    description: `At Nutrify AI, I led the technical architecture for an AI-powered nutrition app with an ML recommendation engine, building and deploying a conversational AI chatbot using FastAPI and OpenAI API integration. Through user validation with 15 interviews and 100+ surveys, the chatbot resulted in a 25% increase in app downloads. I optimized performance and implemented ML personalization features that improved user engagement by 45% and overall user activity by 30%.`,
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
              <p className="experience-date">{experience.date}</p>
            </div>
            <p className="experience-paragraph">{experience.description}</p>
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
            <p className="experience-date">{experience.date}</p>
          </div>
          <p className="experience-paragraph">{experience.description}</p>
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
          Experience
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
