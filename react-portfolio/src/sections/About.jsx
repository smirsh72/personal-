import { socialLinks } from '../data/portfolio';
import SocialLink from '../ui/SocialLink';

export default function About() {
  return (
    <section id="about" className="modern-section about-section">
      <div className="container">
        <div className="about-hero-grid">
          <div className="about-hero-left">
            <h1 className="about-hero-name">shan irshad</h1>
            <p className="about-hero-tagline">infrastructure, ml, and venture.</p>
            <div className="about-social-links">
              {socialLinks.map((link) => (
                <SocialLink key={link.href} {...link} />
              ))}
            </div>
          </div>

          <div className="about-hero-right">
            <img
              src="/images/profile-pic.jpg"
              alt="Shan Irshad"
              className="about-hero-photo"
              loading="eager"
              decoding="async"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
