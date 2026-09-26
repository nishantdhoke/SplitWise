import React, { useEffect, useRef } from 'react';

/**
 * CosmicBackground Component
 * 
 * High-performance, cinematic deep-space background.
 * Layers:
 * 1. Deep Space (#03040B) base with breathing cosmic nebula clouds
 * 2. Rotating distant spiral galaxy & celestial dust
 * 3. Multi-depth parallax stars (tiny distant, medium, bright twinkling)
 * 4. Faint constellation lines connecting star nodes
 * 5. Subtle cursor resonance & repulsion
 * 
 * Performance:
 * - Single full-screen <canvas>
 * - Respects prefers-reduced-motion
 * - Auto-pauses when tab is hidden
 * - Adapts particle count for mobile screens
 */
export default function CosmicBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = width < 768;

    // Mouse coordinates with smooth damping
    const mouse = {
      x: width / 2,
      y: height / 2,
      targetX: width / 2,
      targetY: height / 2,
      radius: isMobile ? 80 : 140,
    };

    const handleMouseMove = (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initStars();
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    // Star generation
    const starCount = isMobile ? 120 : (prefersReducedMotion ? 180 : 320);
    let stars = [];

    const initStars = () => {
      stars = [];
      for (let i = 0; i < starCount; i++) {
        const depth = Math.random(); // 0 = far, 1 = near
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          originX: 0,
          originY: 0,
          radius: depth * 1.4 + 0.3,
          baseAlpha: Math.random() * 0.6 + 0.25,
          alpha: 0,
          twinkleSpeed: Math.random() * 0.02 + 0.005,
          twinkleOffset: Math.random() * Math.PI * 2,
          speedX: (Math.random() - 0.5) * (depth * 0.15 + 0.03),
          speedY: (Math.random() - 0.5) * (depth * 0.15 + 0.03),
          depth,
          color:
            depth > 0.85
              ? '#38D9FF' // Starlight Cyan
              : depth > 0.65
              ? '#F8FAFF' // Star White
              : depth > 0.4
              ? '#9B5CFF' // Nebula Violet
              : '#7C3AED', // Cosmic Purple
        });
      }
    };

    initStars();

    // Subtle Spiral Galaxy coordinates
    let galaxyAngle = 0;
    const galaxyX = width * 0.82;
    const galaxyY = height * 0.22;

    // Time ticker for breathing nebulae
    let time = 0;

    const render = () => {
      time += 0.006;
      galaxyAngle += prefersReducedMotion ? 0.0001 : 0.0008;

      // Smooth mouse follow
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // 1. Draw Deep Space Void Base
      ctx.fillStyle = '#03040B';
      ctx.fillRect(0, 0, width, height);

      // 2. Layer 1: Breathing Nebula Clouds
      // Nebula 1: Deep Violet / Purple (Center-Left)
      const neb1X = width * 0.28 + Math.cos(time * 0.7) * 40;
      const neb1Y = height * 0.38 + Math.sin(time * 0.5) * 30;
      const neb1Radius = Math.min(width, height) * (0.45 + Math.sin(time) * 0.03);
      const grad1 = ctx.createRadialGradient(neb1X, neb1Y, 0, neb1X, neb1Y, neb1Radius);
      grad1.addColorStop(0, 'rgba(124, 58, 237, 0.14)'); // Cosmic Purple
      grad1.addColorStop(0.5, 'rgba(76, 29, 149, 0.07)');
      grad1.addColorStop(1, 'rgba(3, 4, 11, 0)');
      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, width, height);

      // Nebula 2: Deep Cosmic Blue / Indigo (Bottom-Right)
      const neb2X = width * 0.75 + Math.sin(time * 0.6) * 35;
      const neb2Y = height * 0.7 + Math.cos(time * 0.4) * 25;
      const neb2Radius = Math.min(width, height) * (0.5 + Math.cos(time * 0.8) * 0.03);
      const grad2 = ctx.createRadialGradient(neb2X, neb2Y, 0, neb2X, neb2Y, neb2Radius);
      grad2.addColorStop(0, 'rgba(37, 99, 235, 0.12)'); // Cosmic Blue
      grad2.addColorStop(0.5, 'rgba(14, 34, 94, 0.06)');
      grad2.addColorStop(1, 'rgba(3, 4, 11, 0)');
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, width, height);

      // Nebula 3: Starlight Cyan glow around mouse position
      const gradMouse = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, mouse.radius * 1.6);
      gradMouse.addColorStop(0, 'rgba(56, 217, 255, 0.05)');
      gradMouse.addColorStop(0.6, 'rgba(124, 58, 237, 0.02)');
      gradMouse.addColorStop(1, 'rgba(3, 4, 11, 0)');
      ctx.fillStyle = gradMouse;
      ctx.fillRect(0, 0, width, height);

      // 3. Layer 2: Subtle Distant Spiral Galaxy
      ctx.save();
      ctx.translate(galaxyX, galaxyY);
      ctx.rotate(galaxyAngle);
      for (let arm = 0; arm < 2; arm++) {
        const armAngleOffset = arm * Math.PI;
        for (let i = 0; i < 35; i++) {
          const r = i * 2.2;
          const theta = armAngleOffset + i * 0.22;
          const gx = Math.cos(theta) * r;
          const gy = Math.sin(theta) * r * 0.55; // Elliptical perspective
          const gAlpha = Math.max(0, (1 - i / 35) * 0.28);
          ctx.fillStyle = `rgba(155, 92, 255, ${gAlpha})`;
          ctx.beginPath();
          ctx.arc(gx, gy, Math.random() * 1.2 + 0.6, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();

      // 4. Layer 3: Constellations (Faint connecting lines between close stars)
      if (!isMobile && !prefersReducedMotion) {
        ctx.strokeStyle = 'rgba(155, 92, 255, 0.06)';
        ctx.lineWidth = 0.6;
        for (let i = 0; i < stars.length; i += 4) {
          const s1 = stars[i];
          for (let j = i + 1; j < Math.min(i + 5, stars.length); j++) {
            const s2 = stars[j];
            const dx = s1.x - s2.x;
            const dy = s1.y - s2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 85) {
              ctx.beginPath();
              ctx.moveTo(s1.x, s1.y);
              ctx.lineTo(s2.x, s2.y);
              ctx.stroke();
            }
          }
        }
      }

      // 5. Layer 4: Stars with parallax, twinkle & gentle cursor repulsion
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];

        if (!prefersReducedMotion) {
          star.x += star.speedX;
          star.y += star.speedY;

          // Wrap edges
          if (star.x < 0) star.x = width;
          if (star.x > width) star.x = 0;
          if (star.y < 0) star.y = height;
          if (star.y > height) star.y = 0;
        }

        // Mouse proximity interaction (subtle push)
        const dx = star.x - mouse.x;
        const dy = star.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        let offsetX = 0;
        let offsetY = 0;

        if (dist < mouse.radius && dist > 0) {
          const force = (1 - dist / mouse.radius) * 8 * star.depth;
          offsetX = (dx / dist) * force;
          offsetY = (dy / dist) * force;
        }

        // Twinkle calculation
        const twinkle = Math.sin(time * 3 + star.twinkleOffset);
        const currentAlpha = Math.min(1, Math.max(0.1, star.baseAlpha + twinkle * 0.25));

        // Draw star
        ctx.fillStyle = star.color;
        ctx.globalAlpha = currentAlpha;
        ctx.beginPath();
        ctx.arc(star.x + offsetX, star.y + offsetY, star.radius, 0, Math.PI * 2);
        ctx.fill();

        // Brightest stars get subtle diffraction cross glow
        if (star.depth > 0.9 && star.radius > 1.2 && !isMobile) {
          ctx.strokeStyle = star.color;
          ctx.globalAlpha = currentAlpha * 0.35;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(star.x + offsetX - 3.5, star.y + offsetY);
          ctx.lineTo(star.x + offsetX + 3.5, star.y + offsetY);
          ctx.moveTo(star.x + offsetX, star.y + offsetY - 3.5);
          ctx.lineTo(star.x + offsetX, star.y + offsetY + 3.5);
          ctx.stroke();
        }
      }

      ctx.globalAlpha = 1.0;

      if (!document.hidden) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    // Start loop
    animationFrameId = requestAnimationFrame(render);

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = requestAnimationFrame(render);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
        display: 'block',
      }}
    />
  );
}
