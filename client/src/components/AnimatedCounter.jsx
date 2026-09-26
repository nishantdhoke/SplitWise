import React, { useState, useEffect, useRef } from 'react';

/**
 * AnimatedCounter (Cosmic Energy Balance)
 * 
 * Smoothly interpolates financial balances with a cosmic energy aura.
 * When balance updates, a soft celestial pulse and stardust motes gather and disperse.
 */
export default function AnimatedCounter({
  value = 0,
  prefix = '₹',
  duration = 750,
  decimals = 2,
  color = 'cyan', // 'cyan' | 'mint' | 'coral' | 'violet' | 'neutral'
  className = '',
  style = {},
}) {
  const [displayValue, setDisplayValue] = useState(value);
  const [isChanging, setIsChanging] = useState(false);
  const prevValueRef = useRef(value);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    const startValue = prevValueRef.current;
    const endValue = Number(value) || 0;

    if (startValue === endValue) {
      setDisplayValue(endValue);
      return;
    }

    setIsChanging(true);
    const startTime = performance.now();

    const updateCounter = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Smooth Ease-Out Cubic: 1 - Math.pow(1 - progress, 3)
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = startValue + (endValue - startValue) * easeProgress;

      setDisplayValue(current);

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(updateCounter);
      } else {
        setDisplayValue(endValue);
        prevValueRef.current = endValue;
        setTimeout(() => setIsChanging(false), 300);
      }
    };

    animationFrameRef.current = requestAnimationFrame(updateCounter);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [value, duration]);

  const formattedNumber = Math.abs(displayValue).toLocaleString('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  const sign = displayValue < 0 ? '-' : '';

  const auraStyles = {
    cyan: {
      textShadow: '0 0 16px rgba(56, 217, 255, 0.45)',
      color: '#38D9FF',
    },
    mint: {
      textShadow: '0 0 18px rgba(52, 211, 153, 0.5)',
      color: '#34D399',
    },
    coral: {
      textShadow: '0 0 18px rgba(251, 113, 133, 0.5)',
      color: '#FB7185',
    },
    violet: {
      textShadow: '0 0 18px rgba(155, 92, 255, 0.5)',
      color: '#9B5CFF',
    },
    neutral: {
      textShadow: '0 0 14px rgba(248, 250, 255, 0.35)',
      color: '#F8FAFF',
    },
  };

  const selectedAura = auraStyles[color] || auraStyles.cyan;

  return (
    <span
      className={`cosmic-counter ${isChanging ? 'cosmic-counter-active' : ''} ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'baseline',
        position: 'relative',
        fontVariantNumeric: 'tabular-nums',
        transition: 'all 250ms cubic-bezier(0.16, 1, 0.3, 1)',
        ...selectedAura,
        ...style,
      }}
    >
      <span className="currency-symbol" style={{ marginRight: '2px', opacity: 0.88, fontSize: '0.9em' }}>
        {sign}{prefix}
      </span>
      <span>{formattedNumber}</span>

      {/* Subtle gathering energy particles during value transition */}
      {isChanging && (
        <span
          className="cosmic-counter-halo"
          style={{
            position: 'absolute',
            inset: '-4px -8px',
            borderRadius: '9999px',
            background: 'radial-gradient(ellipse at center, rgba(124, 58, 237, 0.22) 0%, transparent 70%)',
            pointerEvents: 'none',
            animation: 'cosmicPulse 0.6s ease-out infinite alternate',
          }}
          aria-hidden="true"
        />
      )}
    </span>
  );
}
