export default function TimelineRow({ item, link }) {
  const title = link ? (
    <a href={link} target="_blank" rel="noopener noreferrer" className="cert-title-link">
      {item.title} {'\u2197\uFE0E'}
    </a>
  ) : (
    <p className="exp-combined-title">
      {item.company}
      <span className="exp-dot"> · </span>
      {item.title}
    </p>
  );

  return (
    <div className="exp-row">
      <div className="about-divider" />
      <div className="exp-row-inner">
        <div className="exp-body">
          {item.date && <span className="exp-date">{item.date}</span>}
          {title}
          <p className="exp-description">{item.description}</p>
        </div>
        <img src={item.logo} alt={item.company || item.title} className={link ? 'project-logo-right' : 'exp-logo-right'} />
      </div>
    </div>
  );
}
