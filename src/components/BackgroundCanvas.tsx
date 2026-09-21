'use client';

import React, { useRef, useEffect } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
}

export default function BackgroundCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      // Static, non-animated background for accessibility.
      return;
    }

    let animationFrameId: number;
    let particles: Particle[] = [];
    let running = true;
    let lastFrame = 0;
    const maxParticles = window.innerWidth < 640 ? 28 : 45;
    const connectionDist = 120;

    // Mouse coords state
    const mouse = { x: -9999, y: -9999, active: false };

    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resizeCanvas, 150);
    };

    window.addEventListener('resize', onResize);
    resizeCanvas();

    // Create particles
    const createParticles = () => {
      particles = [];
      const w = window.innerWidth;
      const h = window.innerHeight;
      const colors = ['rgba(255, 69, 48, 0.35)', 'rgba(255, 138, 0, 0.35)', 'rgba(171, 112, 255, 0.25)'];
      for (let i = 0; i < maxParticles; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          radius: Math.random() * 2 + 1.5,
          color: colors[Math.floor(Math.random() * colors.length)]
        });
      }
    };
    createParticles();

    // Mouse listeners (throttled via rAF flag)
    let mouseQueued = false;
    let queuedX = 0;
    let queuedY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      queuedX = e.clientX;
      queuedY = e.clientY;
      if (!mouseQueued) {
        mouseQueued = true;
        requestAnimationFrame(() => {
          mouse.x = queuedX;
          mouse.y = queuedY;
          mouse.active = true;
          mouseQueued = false;
        });
      }
    };

    const handleMouseLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
      mouse.active = false;
    };

    const onVisibility = () => {
      running = document.visibilityState === 'visible';
      if (running) {
        lastFrame = performance.now();
        animationFrameId = requestAnimationFrame(draw);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('visibilitychange', onVisibility);

    // Animation Loop (throttled to ~30fps for perf)
    const draw = (now: number = performance.now()) => {
      if (!running) return;
      if (now - lastFrame < 33) {
        animationFrameId = requestAnimationFrame(draw);
        return;
      }
      lastFrame = now;
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      const isDark = document.documentElement.classList.contains('dark-theme');

      // Connection line opacity parameters
      const lineAlphaBase = isDark ? 0.08 : 0.05;
      const lineColor = '255, 69, 48';

      // Move and draw particles
      particles.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;

        // Bounce boundaries
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        // Mouse attraction/influence
        if (mouse.active) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          if (dist < 150) {
            // Softly drift towards mouse
            p.x += dx * 0.005;
            p.y += dy * 0.005;
          }
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        // Connect to neighboring particles
        for (let j = idx + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx*dx + dy*dy);

          if (dist < connectionDist) {
            const alpha = (1 - dist / connectionDist) * lineAlphaBase;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(${lineColor}, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }

        // Draw connections to mouse
        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          if (dist < 130) {
            const alpha = (1 - dist / 130) * lineAlphaBase * 1.5;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(${lineColor}, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };
    animationFrameId = requestAnimationFrame(draw);

    return () => {
      running = false;
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('visibilitychange', onVisibility);
      clearTimeout(resizeTimer);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="interactive-bg-canvas"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        pointerEvents: 'none',
        opacity: 0.85,
        transition: 'opacity 0.5s ease'
      }}
    />
  );
}
