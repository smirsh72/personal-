import { useState, useRef, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useReducedMotion } from '../hooks/useReducedMotion';

// Chat message component — plain text, no bubbles
function ChatMessage({ content, isUser, reducedMotion }) {
  return (
    <motion.div
      className={`dm-message ${isUser ? 'dm-user' : 'dm-ai'}`}
      initial={{ opacity: 0, y: reducedMotion ? 0 : 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reducedMotion ? 0.1 : 0.3, ease: 'easeOut' }}
    >
      <span className="dm-label">{isUser ? 'you' : 'ai'}</span>
      <span className="dm-text">{content}</span>
    </motion.div>
  );
}

// AI Chat interface
function AIChat({ reducedMotion }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMessages([{ id: 1, content: "what's up. ask me anything about shan.", isUser: false }]);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = { id: Date.now(), content: input, isUser: true };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    try {
      const res = await fetch('/.netlify/functions/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      setIsTyping(false);
      setMessages((prev) => [...prev, { id: Date.now() + 1, content: data.reply || "couldn't get a response.", isUser: false }]);
    } catch {
      setIsTyping(false);
      setMessages((prev) => [...prev, { id: Date.now() + 1, content: "something went wrong. try again.", isUser: false }]);
    }
  };

  return (
    <div className="dm-container">
      <div className="dm-messages" ref={chatContainerRef}>
        <AnimatePresence>
          {messages.map((msg) => (
            <ChatMessage key={msg.id} content={msg.content} isUser={msg.isUser} reducedMotion={reducedMotion} />
          ))}
        </AnimatePresence>
        {isTyping && <div className="dm-typing"><span className="dm-label">ai</span><span className="dm-text">...</span></div>}
      </div>
      <div className="dm-input-row">
        <input
          type="text"
          className="dm-input"
          placeholder="type something..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        />
        <button className="dm-send" onClick={handleSend}>→</button>
      </div>
    </div>
  );
}

// Social icon component
function SocialIcon({ href, icon, label, delay, reducedMotion }) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="social-icon"
      aria-label={label}
      initial={{ opacity: 0, y: reducedMotion ? 0 : 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: reducedMotion ? 0 : delay, duration: 0.4 }}
      whileHover={reducedMotion ? {} : { scale: 1.06 }}
      whileTap={reducedMotion ? {} : { scale: 0.9 }}
    >
      <i className={icon} />
    </motion.a>
  );
}


// Check if mobile on initial render (SSR-safe)
const getInitialMobile = () => {
  if (typeof window !== 'undefined') {
    return window.innerWidth <= 768;
  }
  return false;
};

export default function About() {
  const reducedMotion = useReducedMotion();
  const sectionRef = useRef(null);
  const [isMobile, setIsMobile] = useState(getInitialMobile);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Always trigger on mobile (no margin delay)
  const isInView = useInView(sectionRef, { once: true, margin: isMobile ? '200px' : '-100px' });

  // Mobile: instant, Desktop: staggered fade
  const containerVariants = {
    hidden: { opacity: isMobile ? 1 : 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: isMobile ? 0 : 0.6,
        staggerChildren: isMobile ? 0 : 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: isMobile ? 1 : 0, y: 0 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: isMobile ? 0 : 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const profileContent = (animate) => (
    <div className="about-left-column">
      {/* Identity block */}
      <div className="about-identity">
        <img
          src="/images/profile-pic.jpg"
          alt="Shan Irshad"
          className="profile-image-circle"
          loading="eager"
          decoding="async"
        />
        <div className="about-identity-text">
          <span className="about-name">Shan Irshad</span>
          <span className="about-handle">learning</span>
          <div className="social-icons-container">
            <SocialIcon href="https://www.linkedin.com/in/shan-irshad/" icon="fab fa-linkedin-in" label="LinkedIn" delay={0.6} reducedMotion={!animate} />
            <SocialIcon href="mailto:shanirshad8@gmail.com" icon="far fa-envelope" label="Email" delay={0.7} reducedMotion={!animate} />
            <SocialIcon href="tel:+14695449186" icon="fas fa-phone" label="Phone" delay={0.8} reducedMotion={!animate} />
          </div>
        </div>
      </div>

      <div className="about-divider" />

      {/* Projects */}
      <div className="about-projects">
        <div className="about-project-row">
          <span className="project-label">now</span>
          <span className="project-arrow">→</span>
          <span className="project-desc"><strong>Prismo</strong> — AI routing layer for cost, reliability &amp; governance.</span>
        </div>
        <div className="about-project-row">
          <span className="project-label">before</span>
          <span className="project-arrow">→</span>
          <span className="project-desc"><strong>Ghosted</strong> — deploy cloud infra with plain English.</span>
        </div>
      </div>

      <div className="about-divider" />

      {/* Personal */}
      <p className="about-personal">liverpool fc 🔴 &nbsp;·&nbsp; gym &nbsp;·&nbsp; shipping</p>

    </div>
  );

  if (isMobile) {
    return (
      <section id="about" className="modern-section about-section" ref={sectionRef}>
        <div className="container">
          <div className="about-grid">
            {profileContent(false)}
            <div className="about-right-column">
              <div className="ai-status-badge">
                <span className="status-dot" />
                <span className="status-text">shan.ai · online</span>
              </div>
              <AIChat reducedMotion={true} />
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="about" className="modern-section about-section" ref={sectionRef}>
      <div className="container">
        <motion.div
          className="about-grid"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          <motion.div variants={itemVariants}>
            {profileContent(true)}
          </motion.div>

          <motion.div className="about-right-column" variants={itemVariants}>
            <motion.div
              className="ai-status-badge"
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              <span className="status-dot" />
              <span className="status-text">shan.ai · online</span>
            </motion.div>
            <AIChat reducedMotion={reducedMotion} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
