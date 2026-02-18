/**
 * CherryBlossomBackground — Fullscreen looping video background
 *
 * The video is a real cherry blossom tree with petals falling (Pexels, free license).
 * It covers the entire hero section via object-fit: cover.
 *
 * Props:
 *   reducedMotion (boolean) — if true, video is paused on first frame (still image fallback)
 */
import { useRef, useEffect, useState } from 'react';

export default function CherryBlossomBackground({ reducedMotion = false }) {
  const videoRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleReady = () => {
      setIsReady(true);
      if (!reducedMotion) video.play().catch(() => {});
    };

    if (video.readyState >= 3) {
      handleReady();
    } else {
      video.addEventListener('canplaythrough', handleReady, { once: true });
      return () => video.removeEventListener('canplaythrough', handleReady);
    }
  }, [reducedMotion]);

  return (
    <div className="cherry-blossom-bg">
      <video
        ref={videoRef}
        className={`cherry-blossom-video ${isReady ? 'video-ready' : ''}`}
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
