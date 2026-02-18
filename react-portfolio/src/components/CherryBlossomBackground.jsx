/**
 * CherryBlossomBackground — Fullscreen looping video background
 *
 * The video is a real cherry blossom tree with petals falling (Pexels, free license).
 * It covers the entire hero section via object-fit: cover.
 *
 * Props:
 *   reducedMotion (boolean) — if true, video is paused on first frame (still image fallback)
 */
import { useRef, useEffect } from 'react';

export default function CherryBlossomBackground({ reducedMotion = false }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && !reducedMotion) {
      videoRef.current.play().catch(() => {});
    }
  }, [reducedMotion]);

  return (
    <div className="cherry-blossom-bg">
      <video
        ref={videoRef}
        className="cherry-blossom-video"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
        poster=""
        fetchpriority="high"
      >
        <source src="/cherry-blossom.mp4" type="video/mp4" />
      </video>
      {/* Soft overlay to ensure text readability */}
      <div className="cherry-blossom-overlay" />
    </div>
  );
}
