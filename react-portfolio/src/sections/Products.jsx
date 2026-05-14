import { products } from '../data/portfolio';
import TimelineRow from '../ui/TimelineRow';

export default function Products() {
  return (
    <section id="projects" className="modern-section experience-section">
      <div className="container">
        <h2 className="section-label">products</h2>

        <div className="exp-list">
          {products.map((product) => (
            <TimelineRow key={product.id} item={product} link={product.link} />
          ))}
          <div className="about-divider" />
        </div>
      </div>
    </section>
  );
}
