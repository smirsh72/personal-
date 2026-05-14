export default function SocialLink({ href, icon, label }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="about-social-link"
      aria-label={label}
    >
      <i className={icon} />
      <span>{label}</span>
    </a>
  );
}
