import React, { useMemo } from 'react';

/**
 * MoneyParticleBurst
 * 
 * Celebratory particle explosion of glowing ₹ symbols and sparkles.
 * Used sparingly upon successful expense logging and debt settlements.
 */
export default function MoneyParticleBurst({
  count = 12,
  color = 'mint', // 'mint' | 'violet' | 'coral'
  style = {},
}) {
  const particles = useMemo(() => {
    const list = [];
    const colors =
      color === 'mint'
        ? ['#35E0A1', '#52e8b0', '#35D6FF']
        : color === 'coral'
        ? ['#FF647C', '#ff8598', '#FBBF24']
        : ['#7C5CFC', '#9B7BFF', '#35D6FF'];

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * 2 * Math.PI + (Math.random() * 0.4 - 0.2);
      const distance = 45 + Math.random() * 55;
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance;
      const symbol = i % 3 === 0 ? '✨' : i % 2 === 0 ? '₹' : '•';
      const particleColor = colors[i % colors.length];
      const duration = 0.75 + Math.random() * 0.35;
      const delay = Math.random() * 0.1;
      const size = symbol === '₹' ? 14 : symbol === '✨' ? 13 : 8;

      list.push({
        id: i,
        x,
        y,
        symbol,
        color: particleColor,
        duration,
        delay,
        size,
      });
    }
    return list;
  }, [count, color]);

  return (
    <div
      className="money-particle-burst"
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: 0,
        height: 0,
        pointerEvents: 'none',
        zIndex: 50,
        ...style,
      }}
    >
      {particles.map((p) => (
        <span
          key={p.id}
          style={{
            position: 'absolute',
            color: p.color,
            fontSize: `${p.size}px`,
            fontWeight: 800,
            userSelect: 'none',
            textShadow: `0 0 10px ${p.color}`,
            transform: 'translate(-50%, -50%)',
            animation: `moneyBurstFly ${p.duration}s cubic-bezier(0.16, 1, 0.3, 1) ${p.delay}s forwards`,
            '--target-x': `${p.x}px`,
            '--target-y': `${p.y}px`,
          }}
        >
          {p.symbol}
        </span>
      ))}
    </div>
  );
}
