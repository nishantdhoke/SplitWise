import React, { useState, useEffect, useRef } from 'react';

/**
 * AnimatedCounter
 * 
 * Smoothly interpolates numerical financial amounts from previous value to new value
 * using requestAnimationFrame and cubic bezier easing.
 * 
 * @param {number} value - The target numerical value
 * @param {string} prefix - Currency prefix, default '₹'
 * @param {number} duration - Animation duration in ms, default 700ms
 * @param {string} className - Additional CSS classes
 * @param {object} style - Inline styles
 */
export default function AnimatedCounter({
  value = 0,
  prefix = '₹',
  duration = 750,
  decimals = 2,
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
        setTimeout(() => setIsChanging(false), 250);
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

  return (
    <span
      className={`animated-counter ${isChanging ? 'counter-active' : ''} ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'baseline',
        fontVariantNumeric: 'tabular-nums',
        transition: 'transform 200ms ease, filter 200ms ease',
        ...style,
      }}
    >
      <span className="currency-symbol" style={{ marginRight: '2px', opacity: 0.9 }}>
        {sign}{prefix}
      </span>
      <span>{formattedNumber}</span>
    </span>
  );
}
