import { useRef, useEffect, useCallback } from 'react';

const PARTICLE_COUNT  = 88;
const CONNECTION_DIST = 155;
const REPEL_RADIUS    = 110;   // particles strongly flee this zone
const ATTRACT_RADIUS  = 260;   // gentle pull at medium distance → forms a visible halo
const REPEL_FORCE     = 1.1;
const ATTRACT_FORCE   = 0.03;
const BASE_SPEED      = 0.38;
const CURSOR_GLOW_R   = 220;
const LERP            = 0.1;
// Site palette: pink / fuchsia / purple — same as accent colours
const PALETTE = [
  [236,  72, 153],  // #ec4899 pink
  [244, 114, 182],  // #f472b6 pink-400
  [217,  70, 239],  // #d946ef fuchsia
  [168,  85, 247],  // #a855f7 purple
  [139,  92, 246],  // #8b5cf6 violet
];

function isDark() {
  return document.documentElement.getAttribute('data-theme') === 'dark';
}

function randColor() {
  return PALETTE[Math.floor(Math.random() * PALETTE.length)];
}

function createParticle(width, height) {
  const color = randColor();
  const angle = Math.random() * Math.PI * 2;
  const speed = BASE_SPEED * (0.5 + Math.random() * 0.5);
  return {
    x:        Math.random() * width,
    y:        Math.random() * height,
    vx:       Math.cos(angle) * speed,
    vy:       Math.sin(angle) * speed,
    size:     Math.random() * 2.2 + 1.2,
    color,
    opacity:  Math.random() * 0.25 + 0.6,
    isBurst:  false,
    life:     1,
  };
}

// Click burst — high-velocity particles that fade out
function createBurst(x, y) {
  return Array.from({ length: 22 }, () => {
    const angle = Math.random() * Math.PI * 2;
    const speed = 3.5 + Math.random() * 9;
    return {
      x, y,
      vx:      Math.cos(angle) * speed,
      vy:      Math.sin(angle) * speed,
      size:    1.2 + Math.random() * 2.8,
      color:   randColor(),
      opacity: 0.85,
      life:    1.0,
      isBurst: true,
    };
  });
}

export default function ParticleNetwork({ reducedMotion = false, isMobile = false }) {
  const canvasRef  = useRef(null);
  const animRef    = useRef(null);
  const ptsRef     = useRef([]);     // persistent particles
  const burstRef   = useRef([]);     // temporary burst particles
  const mouse      = useRef({ x: -9999, y: -9999 });
  const smooth     = useRef({ x: -9999, y: -9999 });
  // trail is handled globally by CursorTrail component

  const drawFrame = useCallback((now) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const { width, height } = canvas;
    const dark = isDark();
    const mx   = mouse.current.x;
    const my   = mouse.current.y;
    const sm   = smooth.current;
    const opMult = dark ? 1 : 1.45;   // light mode: boosted so it reads on white bg

    ctx.clearRect(0, 0, width, height);

    // ── Smooth cursor lerp ─────────────────────────────────────────────────
    sm.x += (mx - sm.x) * LERP;
    sm.y += (my - sm.y) * LERP;

    // ── Cursor soft glow (behind everything) ──────────────────────────────
    if (sm.x > -500) {
      const grd = ctx.createRadialGradient(sm.x, sm.y, 0, sm.x, sm.y, CURSOR_GLOW_R);
      if (dark) {
        grd.addColorStop(0,    'rgba(236, 72,153,0.18)');
        grd.addColorStop(0.4,  'rgba(217, 70,239,0.09)');
        grd.addColorStop(1,    'rgba(168, 85,247,0)');
      } else {
        grd.addColorStop(0,    'rgba(217, 70,239,0.35)');
        grd.addColorStop(0.4,  'rgba(168, 85,247,0.18)');
        grd.addColorStop(1,    'rgba(139, 92,246,0)');
      }
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, width, height);
    }

    // ── Burst particles (click explosions) ────────────────────────────────
    burstRef.current = burstRef.current.filter(p => p.life > 0.01);
    for (const p of burstRef.current) {
      p.vx *= 0.91; p.vy *= 0.91;   // heavy friction so they slow fast
      p.x  += p.vx; p.y  += p.vy;
      p.life -= 0.022;               // fade over ~45 frames
      const a = p.life * p.opacity;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * p.life + 0.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color[0]},${p.color[1]},${p.color[2]},${a * opMult})`;
      ctx.fill();
    }

    // ── Persistent particles ───────────────────────────────────────────────
    const pts = ptsRef.current;

    for (let i = 0; i < pts.length; i++) {
      const p  = pts[i];
      const dx = mx - p.x;
      const dy = my - p.y;
      const d  = Math.sqrt(dx * dx + dy * dy);

      // Zone 1: strong repulsion (cursor too close)
      if (d < REPEL_RADIUS && d > 1) {
        const force = ((REPEL_RADIUS - d) / REPEL_RADIUS) * REPEL_FORCE * 0.12;
        p.vx -= (dx / d) * force;
        p.vy -= (dy / d) * force;
      }
      // Zone 2: gentle attraction (medium distance) → creates a halo ring
      else if (d < ATTRACT_RADIUS) {
        const force = (1 - d / ATTRACT_RADIUS) * ATTRACT_FORCE;
        p.vx += (dx / d) * force;
        p.vy += (dy / d) * force;
      }

      // Speed cap + friction
      const spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      const max = BASE_SPEED * 5.5;
      if (spd > max) { p.vx = (p.vx / spd) * max; p.vy = (p.vy / spd) * max; }
      p.vx *= 0.992; p.vy *= 0.992;

      // Move + wrap
      p.x += p.vx; p.y += p.vy;
      if (p.x < -10) p.x = width + 10; else if (p.x > width + 10) p.x = -10;
      if (p.y < -10) p.y = height + 10; else if (p.y > height + 10) p.y = -10;

      // Near-cursor boost
      const nearCursor  = d < 180 ? (1 - d / 180) : 0;
      const drawOpacity = Math.min(1, (p.opacity + nearCursor * 0.55) * opMult);
      const drawSize    = p.size + nearCursor * 2;

      ctx.beginPath();
      ctx.arc(p.x, p.y, drawSize, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color[0]},${p.color[1]},${p.color[2]},${drawOpacity})`;
      ctx.fill();

      // ── Connections ────────────────────────────────────────────────────
      for (let j = i + 1; j < pts.length; j++) {
        const q  = pts[j];
        const cx = p.x - q.x;
        const cy = p.y - q.y;
        const cd = Math.sqrt(cx * cx + cy * cy);
        if (cd >= CONNECTION_DIST) continue;

        const distFade  = 1 - cd / CONNECTION_DIST;
        const cursorNear = nearCursor > 0.05;

        // Lines near cursor → vivid pink; otherwise use particle colour
        if (cursorNear) {
          const alpha = Math.min(0.9, distFade * 0.9 + nearCursor * 0.3) * opMult;
          ctx.strokeStyle = `rgba(236,72,153,${alpha})`;
          ctx.lineWidth   = 1.2;
        } else {
          const alpha = distFade * (dark ? 0.45 : 0.65) * opMult;
          ctx.strokeStyle = `rgba(${p.color[0]},${p.color[1]},${p.color[2]},${alpha})`;
          ctx.lineWidth   = dark ? 0.9 : 1.4;
        }

        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(q.x, q.y);
        ctx.stroke();
      }
    }

    animRef.current = requestAnimationFrame(drawFrame);
  }, []);

  useEffect(() => {
    if (isMobile) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      ptsRef.current = Array.from(
        { length: PARTICLE_COUNT },
        () => createParticle(canvas.width, canvas.height)
      );
    };
    resize();
    window.addEventListener('resize', resize);

    const onMove = (e) => {
      const r  = canvas.getBoundingClientRect();
      const nx = e.clientX - r.left;
      const ny = e.clientY - r.top;
      if (mouse.current.x < -400) {
        smooth.current.x = nx;
        smooth.current.y = ny;
      }
      mouse.current = { x: nx, y: ny };
    };

    const onLeave = () => {
      mouse.current = { x: -9999, y: -9999 };
    };

    // Click burst
    const onClick = (e) => {
      const r = canvas.getBoundingClientRect();
      burstRef.current.push(
        ...createBurst(e.clientX - r.left, e.clientY - r.top)
      );
    };

    window.addEventListener('mousemove', onMove);
    document.addEventListener('mouseleave', onLeave);
    canvas.addEventListener('click', onClick);

    if (!reducedMotion) {
      animRef.current = requestAnimationFrame(drawFrame);
    } else {
      drawFrame(performance.now());
      cancelAnimationFrame(animRef.current);
    }

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      canvas.removeEventListener('click', onClick);
    };
  }, [isMobile, reducedMotion, drawFrame]);

  if (isMobile) {
    return <div className="particle-network-bg particle-network-static" />;
  }

  return (
    <div className="particle-network-bg">
      <canvas ref={canvasRef} className="particle-network-canvas" aria-hidden="true" />
    </div>
  );
}
