import React, { useMemo } from 'react';

/**
 * CosmicParticleBurst Component
 * 
 * Generates an ethereal burst of cosmic energy particles, starlight motes,
 * and nebula sparks radiating outward during significant actions.
 * 
 * Replaces legacy coin/money animations with pure cosmic energy.
 */
export default function CosmicParticleBurst({
  active = false,
  count = 16,
  color = 'cyan', // 'cyan' | 'violet' | 'mint' | 'pink' | 'coral'
}) {
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * (Math.PI * 2) + (Math.random() - 0.5) * 0.35;
      const distance = 40 + Math.random() * 65;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance;
      const size = Math.random() * 5 + 3;
      const duration = 0.55 + Math.random() * 0.35;
      const delay = Math.random() * 0.08;
      const isStar = i % 3 === 0;

      return {
        id: i,
        tx: `${tx.toFixed(1)}px`,
        ty: `${ty.toFixed(1)}px`,
        size,
        duration,
        delay,
        isStar,
      };
    });
  }, [count, active]);

  if (!active) return null;

  const colorPalettes = {
    cyan: {
      core: '#38D9FF',
      glow: 'rgba(56, 217, 255, 0.8)',
    },
    violet: {
      core: '#9B5CFF',
      glow: 'rgba(155, 92, 255, 0.8)',
    },
    mint: {
      core: '#34D399',
      glow: 'rgba(52, 211, 153, 0.8)',
    },
    pink: {
      core: '#D946EF',
      glow: 'rgba(217, 70, 239, 0.8)',
    },
    coral: {
      core: '#FB7185',
      glow: 'rgba(251, 113, 133, 0.8)',
    },
  };

  const selectedPalette = colorPalettes[color] || colorPalettes.cyan;

  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: 0,
        height: 0,
        pointerEvents: 'none',
        zIndex: 20,
      }}
      aria-hidden="true"
    >
      {particles.map((p) => (
        <span
          key={p.id}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: `${p.size}px`,
            height: `${p.size}px`,
            borderRadius: p.isStar ? '1px' : '50%',
            transform: p.isStar ? 'rotate(45deg)' : 'none',
            backgroundColor: selectedPalette.core,
            boxShadow: `0 0 10px ${selectedPalette.glow}`,
            '--target-x': p.tx,
            '--target-y': p.ty,
            animation: `cosmicParticleFly ${p.duration}s cubic-bezier(0.16, 1, 0.3, 1) ${p.delay}s forwards`,
          }}
        />
      ))}
    </div>
  );
}
