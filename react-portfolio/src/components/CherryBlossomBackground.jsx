/**
 * CherryBlossomBackground — Fullscreen looping video background
 *
 * The video is a real cherry blossom tree with petals falling (Pexels, free license).
 * It covers the entire hero section via object-fit: cover.
 *
 * Props:
 *   reducedMotion (boolean) — if true, video is paused on first frame (still image fallback)
 */
export default function CherryBlossomBackground({ reducedMotion = false }) {
  return (
    <div className="cherry-blossom-bg">
      <video
        className="cherry-blossom-video"
        autoPlay={!reducedMotion}
        loop
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
        poster=""
      >
        <source src="/cherry-blossom.mp4" type="video/mp4" />
      </video>
      {/* Soft overlay to ensure text readability */}
      <div className="cherry-blossom-overlay" />
    </div>
  );
}
