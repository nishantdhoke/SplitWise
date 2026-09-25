import React, { useState, useEffect, useRef } from 'react';

/**
 * SignatureEye Component
 * 
 * Signature visual element of FairShare:
 * - Outer glow: Electric Violet (#7C5CFC) with slow breathing animation
 * - Iris: Electric Violet (#7C5CFC) + Cyan (#35D6FF) gradient
 * - Pupil: Near-black (#080A12)
 * - Specular highlight: Crisp white (#FFFFFF)
 * - Interactive cursor tracking: Iris smoothly follows the mouse cursor
 */
export default function SignatureEye({
  size = 100,
  interactive = true,
  glowIntensity = 'normal',
  className = '',
  style = {},
}) {
  const eyeRef = useRef(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!interactive) return;

    const handleMouseMove = (e) => {
      if (!eyeRef.current) return;
      const rect = eyeRef.current.getBoundingClientRect();
      const eyeCenterX = rect.left + rect.width / 2;
      const eyeCenterY = rect.top + rect.height / 2;

      const deltaX = e.clientX - eyeCenterX;
      const deltaY = e.clientY - eyeCenterY;
      const distance = Math.hypot(deltaX, deltaY);
      const angle = Math.atan2(deltaY, deltaX);

      // Maximum offset radius for the iris inside the eye (proportional to size)
      const maxOffset = size * 0.085;
      const limitedDistance = Math.min(distance * 0.03, maxOffset);

      setOffset({
        x: Math.cos(angle) * limitedDistance,
        y: Math.sin(angle) * limitedDistance,
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [interactive, size]);

  const scale = size / 100;
  const glowBlur = isHovered ? 28 : glowIntensity === 'high' ? 24 : 16;
  const glowOpacity = isHovered ? 0.75 : 0.45;

  return (
    <div
      ref={eyeRef}
      className={`signature-eye-container ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'relative',
        width: `${size}px`,
        height: `${size * 0.62}px`,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: interactive ? 'pointer' : 'default',
        transition: 'transform 300ms cubic-bezier(0.16, 1, 0.3, 1)',
        ...style,
      }}
    >
      {/* Outer ambient glow halo */}
      <div
        className="signature-eye-aura"
        style={{
          position: 'absolute',
          inset: '-10%',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124, 92, 252, 0.35) 0%, rgba(53, 214, 255, 0.15) 45%, transparent 70%)',
          filter: `blur(${glowBlur}px)`,
          opacity: glowOpacity,
          pointerEvents: 'none',
          transition: 'all 350ms ease',
        }}
      />

      {/* Futuristic Eye SVG */}
      <svg
        width={size}
        height={size * 0.62}
        viewBox="0 0 100 62"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: 'visible', filter: `drop-shadow(0 0 ${isHovered ? 14 : 8}px rgba(124, 92, 252, 0.5))` }}
      >
        <defs>
          {/* Eye Contour Outer Clip */}
          <clipPath id="eyeContourClip">
            <path d="M 5 31 C 22 8, 78 8, 95 31 C 78 54, 22 54, 5 31 Z" />
          </clipPath>

          {/* Iris Gradient: Electric Violet -> Bright Cyan */}
          <radialGradient id="irisGradient" cx="45%" cy="40%" r="55%">
            <stop offset="0%" stopColor="#35D6FF" />
            <stop offset="40%" stopColor="#7C5CFC" />
            <stop offset="85%" stopColor="#4F35B8" />
            <stop offset="100%" stopColor="#1E134D" />
          </radialGradient>

          {/* Sclera / Background Gradient */}
          <linearGradient id="scleraGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#171B2B" />
            <stop offset="50%" stopColor="#10131F" />
            <stop offset="100%" stopColor="#0B0D17" />
          </linearGradient>

          {/* Outer Border Stroke Gradient */}
          <linearGradient id="borderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#35D6FF" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#7C5CFC" />
            <stop offset="100%" stopColor="#9B7BFF" stopOpacity="0.4" />
          </linearGradient>

          {/* Eye Interior Shadow */}
          <radialGradient id="eyeShadow" cx="50%" cy="50%" r="50%">
            <stop offset="70%" stopColor="transparent" />
            <stop offset="100%" stopColor="#080A12" stopOpacity="0.8" />
          </radialGradient>
        </defs>

        {/* Outer Eye Shell Contour */}
        <path
          d="M 5 31 C 22 8, 78 8, 95 31 C 78 54, 22 54, 5 31 Z"
          fill="url(#scleraGradient)"
          stroke="url(#borderGradient)"
          strokeWidth="1.6"
        />

        {/* Clipped eyeball elements */}
        <g clipPath="url(#eyeContourClip)">
          {/* Subtle eyelid shading overlay */}
          <path
            d="M 5 31 C 22 8, 78 8, 95 31 C 78 54, 22 54, 5 31 Z"
            fill="url(#eyeShadow)"
          />

          {/* Iris & Pupil Group with dynamic cursor tracking offset */}
          <g
            style={{
              transform: `translate(${offset.x}px, ${offset.y}px)`,
              transition: 'transform 80ms ease-out',
            }}
          >
            {/* Iris Outer Ring / Glow */}
            <circle
              cx="50"
              cy="31"
              r="17"
              fill="url(#irisGradient)"
              stroke="#35D6FF"
              strokeWidth="0.8"
              strokeOpacity="0.6"
            />

            {/* Iris Internal Futuristic Digital Ring */}
            <circle
              cx="50"
              cy="31"
              r="12.5"
              fill="none"
              stroke="#35D6FF"
              strokeWidth="0.5"
              strokeDasharray="2 1.5"
              opacity="0.75"
            />

            {/* Pupil: Deep near-black with cyan depth */}
            <circle
              cx="50"
              cy="31"
              r={isHovered ? 7.8 : 7}
              fill="#080A12"
              stroke="#7C5CFC"
              strokeWidth="0.6"
              style={{ transition: 'r 250ms ease' }}
            />

            {/* Primary Specular Highlight (Crisp White Reflection) */}
            <circle
              cx="46.5"
              cy="27"
              r="2.2"
              fill="#FFFFFF"
              opacity="0.95"
            />

            {/* Secondary Tiny Reflection */}
            <circle
              cx="53"
              cy="34"
              r="1.1"
              fill="#35D6FF"
              opacity="0.8"
            />
          </g>
        </g>

        {/* Tech Corner Accent Dots */}
        <circle cx="5" cy="31" r="1.5" fill="#35D6FF" opacity="0.85" />
        <circle cx="95" cy="31" r="1.5" fill="#7C5CFC" opacity="0.85" />
      </svg>
    </div>
  );
}
