import { experiences } from '../data/portfolio';
import TimelineRow from '../ui/TimelineRow';

export default function Experience() {
  return (
    <section id="experience" className="modern-section experience-section">
      <div className="container">
        <h2 className="section-label">experience</h2>

        <div className="exp-list">
          {experiences.map((experience) => (
            <TimelineRow key={experience.id} item={experience} />
          ))}
          <div className="about-divider" />
        </div>
      </div>
    </section>
  );
}
