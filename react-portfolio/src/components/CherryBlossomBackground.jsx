/**
 * CherryBlossomBackground — Fullscreen looping video background
 *
 * Desktop: real cherry blossom video with petals falling.
 * Mobile: static CSS gradient (no video download) for instant load.
 *
 * Props:
 *   reducedMotion (boolean) — if true, video is paused on first frame
 *   isMobile (boolean) — if true, skip video entirely
 */
import { useRef, useEffect, useState } from 'react';

export default function CherryBlossomBackground({ reducedMotion = false, isMobile = false }) {
  const videoRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (isMobile) return;
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
  }, [reducedMotion, isMobile]);

  if (isMobile) {
    return (
      <div className="cherry-blossom-bg">
        <div className="cherry-blossom-static" />
        <div className="cherry-blossom-overlay" />
      </div>
    );
  }

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
      <div className="cherry-blossom-overlay" />
    </div>
  );
}
