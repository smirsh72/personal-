import { useRef, useEffect } from 'react';

const TRAIL_LENGTH = 26;
const LERP         = 0.1;

function isDark() {
  return document.documentElement.getAttribute('data-theme') === 'dark';
}

export default function CursorTrail() {
  const canvasRef = useRef(null);
  const animRef   = useRef(null);
  const mouse     = useRef({ x: -9999, y: -9999 });
  const smooth    = useRef({ x: -9999, y: -9999 });
  const trail     = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const onMove = (e) => {
      const nx = e.clientX;
      const ny = e.clientY;
      // Snap smooth cursor on first entry so trail doesn't fly in from offscreen
      if (mouse.current.x < -400) {
        smooth.current.x = nx;
        smooth.current.y = ny;
      }
      mouse.current = { x: nx, y: ny };
    };

    const onLeave = () => {
      mouse.current = { x: -9999, y: -9999 };
      trail.current = [];
    };

    window.addEventListener('mousemove', onMove);
    document.addEventListener('mouseleave', onLeave);

    const draw = () => {
      const ctx  = canvas.getContext('2d');
      const dark = isDark();
      const mx   = mouse.current.x;
      const my   = mouse.current.y;
      const sm   = smooth.current;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Lerp smooth cursor toward real mouse
      sm.x += (mx - sm.x) * LERP;
      sm.y += (my - sm.y) * LERP;

      if (mx > -500) {
        const tr = trail.current;
        tr.push({ x: sm.x, y: sm.y });
        if (tr.length > TRAIL_LENGTH) tr.shift();

        // Trail dots — purple (oldest) → pink (newest)
        for (let i = 0; i < tr.length; i++) {
          const prog  = (i + 1) / tr.length;
          const alpha = prog * prog * (dark ? 0.82 : 0.72);
          const ri    = Math.round(168 + (236 - 168) * prog);
          const gi    = Math.round( 85 + ( 72 -  85) * prog);
          const bi    = Math.round(247 + (153 - 247) * prog);
          ctx.beginPath();
          ctx.arc(tr[i].x, tr[i].y, 1.5 + prog * 6.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${ri},${gi},${bi},${alpha})`;
          ctx.fill();
        }

        // Head — solid pink circle with white core
        if (tr.length > 0) {
          const h = tr[tr.length - 1];

          // Outer soft ring
          ctx.beginPath();
          ctx.arc(h.x, h.y, 12, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(236,72,153,${dark ? 0.22 : 0.18})`;
          ctx.fill();

          // Pink body
          ctx.beginPath();
          ctx.arc(h.x, h.y, 8, 0, Math.PI * 2);
          ctx.fillStyle = dark ? 'rgba(236,72,153,0.92)' : 'rgba(217,70,239,0.88)';
          ctx.fill();

          // White highlight
          ctx.beginPath();
          ctx.arc(h.x, h.y, 3.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,255,${dark ? 0.65 : 0.78})`;
          ctx.fill();
        }
      }

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position:      'fixed',
        top:           0,
        left:          0,
        width:         '100vw',
        height:        '100vh',
        pointerEvents: 'none',
        zIndex:        9999,
      }}
    />
  );
}
