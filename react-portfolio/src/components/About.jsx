import { useState, useRef, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useReducedMotion } from '../hooks/useReducedMotion';

// Typing indicator component
function TypingIndicator() {
  return (
    <div className="message assistant-message typing-indicator">
      <div className="typing-dots">
        <motion.span
          animate={{ scale: [0.6, 1, 0.6] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
        />
        <motion.span
          animate={{ scale: [0.6, 1, 0.6] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: 0.15 }}
        />
        <motion.span
          animate={{ scale: [0.6, 1, 0.6] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }}
        />
      </div>
    </div>
  );
}

// Chat message component
function ChatMessage({ content, isUser, reducedMotion }) {
  return (
    <motion.div
      className={`message ${isUser ? 'user-message' : 'assistant-message'}`}
      initial={{ opacity: 0, y: reducedMotion ? 0 : 15, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: reducedMotion ? 0.1 : 0.4,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      <div className="message-content">{content}</div>
    </motion.div>
  );
}

// AI Chat interface
function AIChat({ reducedMotion }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    // Add welcome message
    const timer = setTimeout(() => {
      setMessages([{
        id: 1,
        content: "Hi there! I'm Shan's AI assistant. Ask me anything about Shan!",
        isUser: false,
      }]);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Scroll within the chat container only, not the whole page
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const getResponse = (message) => {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('experience') || lowerMessage.includes('work') || lowerMessage.includes('job')) {
      return "Shan has experience as a Technical Product Manager at Nutrify AI and as a Site Reliability Engineer Intern at Mastercard, where he developed a Copilot-style AI assistant that reduced incident triage time by 40%.";
    }
    if (lowerMessage.includes('skill') || lowerMessage.includes('tech')) {
      return "Shan's technical skills include Python, React, TypeScript, FastAPI, Docker, Terraform, AWS, CI/CD, and ML/AI integration. He has strong cloud expertise with AWS services and DevOps practices.";
    }
    if (lowerMessage.includes('project') || lowerMessage.includes('ghosted')) {
      return "Shan's notable projects include Ghosted, a full-stack AI-native cloud automation platform using React, TypeScript, FastAPI, Python, and AWS. He also developed an AI assistant at Mastercard.";
    }
    if (lowerMessage.includes('education') || lowerMessage.includes('school')) {
      return "Shan is studying Computer Science at the University of Texas at Dallas with a focus on AI and cloud technologies.";
    }
    return "I'm Shan's AI assistant. I can tell you about his experience, technical skills, projects, or education. What would you like to know?";
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now(),
      content: input,
      isUser: true,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const response = getResponse(input);
      setMessages((prev) => [...prev, {
        id: Date.now() + 1,
        content: response,
        isUser: false,
      }]);
    }, 1000 + Math.random() * 500);
  };

  return (
    <div className="ai-chat-container">
      <div className="chat-header">
        <h3 className="chat-title">Chat with Shan's AI</h3>
        <p className="chat-subtitle">Ask anything about my work or what I'm building</p>
      </div>
      <div className="chat-messages" ref={chatContainerRef}>
        <AnimatePresence>
          {messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              content={msg.content}
              isUser={msg.isUser}
              reducedMotion={reducedMotion}
            />
          ))}
        </AnimatePresence>
        {isTyping && <TypingIndicator />}
      </div>
      <div className="chat-input-container">
        <input
          type="text"
          className="chat-input"
          placeholder="Ask me anything..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        />
        <motion.button
          className="send-button"
          onClick={handleSend}
          whileHover={reducedMotion ? {} : { scale: 1.05 }}
          whileTap={reducedMotion ? {} : { scale: 0.95 }}
        >
          <i className="fas fa-paper-plane" />
        </motion.button>
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
      whileHover={reducedMotion ? {} : {
        y: -3,
        color: '#f472b6',
        textShadow: '0 0 8px rgba(244, 114, 182, 0.6)',
      }}
    >
      <i className={icon} />
    </motion.a>
  );
}

// Exploring tag component
function ExploringTag({ children, delay, reducedMotion }) {
  return (
    <motion.span
      className="exploring-tag"
      initial={{ opacity: 0, scale: reducedMotion ? 1 : 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: reducedMotion ? 0 : delay, duration: 0.4 }}
      whileHover={reducedMotion ? {} : {
        y: -2,
        boxShadow: '0 4px 6px rgba(244, 114, 182, 0.15)',
      }}
    >
      {children}
    </motion.span>
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

  return (
    <section id="about" className="modern-section about-section" ref={sectionRef}>
      <div className="container">
        <motion.h2
          className="section-subtitle text-center"
          initial={{ opacity: 0, y: isMobile ? 0 : 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: isMobile ? 0.3 : 0.6 }}
        >
          <span className="section-title-gradient">About Me</span>
        </motion.h2>
        <motion.div
          className="about-grid"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {/* Left column */}
          <motion.div className="about-left-column" variants={itemVariants}>
            <motion.div
              className="profile-image-wrapper"
              whileHover={reducedMotion ? {} : { scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <motion.img
                src="/images/profile-pic.jpg"
                alt="Shan Irshad"
                className="profile-image"
                initial={{ opacity: 0, scale: reducedMotion ? 1 : 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: reducedMotion ? 0.1 : 0.8, ease: 'easeOut' }}
              />
            </motion.div>

            <div className="about-content">
              <motion.div className="about-text" variants={itemVariants}>
                <motion.p className="intro-paragraph" variants={itemVariants}>
                  Hi, I'm <span className="gradient-text highlight-text">Shan Irshad</span> — a product enthusiast who builds software that solves real problems.
                </motion.p>
                <motion.p className="secondary-paragraph" variants={itemVariants}>
                  I focus on <span className="gradient-text highlight-text">AI</span> and <span className="gradient-text highlight-text">cloud systems</span>, turning complex ideas into products people can actually use. My main project, <span className="gradient-text highlight-text">Ghosted</span>, lets you deploy cloud infrastructure using plain English.
                </motion.p>
                <motion.p className="secondary-paragraph" variants={itemVariants}>
                  When I'm not coding, you'll find me cheering on Liverpool FC or at the gym.
                </motion.p>
              </motion.div>

              <motion.div className="exploring-section" variants={itemVariants}>
                <h3 className="exploring-title">Currently Building Toward</h3>
                <div className="exploring-tags">
                  <ExploringTag delay={0.3} reducedMotion={reducedMotion}>AI</ExploringTag>
                  <ExploringTag delay={0.4} reducedMotion={reducedMotion}>AI-Powered Cloud Automation</ExploringTag>
                  <ExploringTag delay={0.5} reducedMotion={reducedMotion}>Product Roadmapping</ExploringTag>
                </div>
              </motion.div>

              <motion.p className="ai-prompt" variants={itemVariants}>
                For anything else, feel free to ask my AI <span className="emoji"></span>
              </motion.p>

              <motion.div className="social-icons-container" variants={itemVariants}>
                <SocialIcon href="https://www.linkedin.com/in/shan-irshad/" icon="fab fa-linkedin-in" label="LinkedIn" delay={0.6} reducedMotion={reducedMotion} />
                <SocialIcon href="mailto:shanirshad8@gmail.com" icon="far fa-envelope" label="Email" delay={0.7} reducedMotion={reducedMotion} />
                <SocialIcon href="tel:+14695449186" icon="fas fa-phone-alt" label="Phone" delay={0.8} reducedMotion={reducedMotion} />
              </motion.div>
            </div>
          </motion.div>

          {/* Right column - AI Chat */}
          <motion.div className="about-right-column" variants={itemVariants}>
            <motion.div
              className="ai-status-badge"
              initial={{ opacity: 0, x: reducedMotion ? 0 : -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: reducedMotion ? 0 : 0.5, duration: 0.4 }}
            >
              <motion.span
                className="status-dot"
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="status-text">Shan.ai Online</span>
            </motion.div>
            <AIChat reducedMotion={reducedMotion} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
