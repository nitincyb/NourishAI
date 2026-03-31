import { memo } from 'react';

interface Shape {
  w: number; h: number; bg: string; delay: string;
  top?: string; right?: string; bottom?: string; left?: string;
}

const SHAPES: Shape[] = [
  { w: 280, h: 280, bg: 'rgba(255, 77, 141, 0.06)', top: '8%', right: '5%', delay: '0s' },
  { w: 200, h: 200, bg: 'rgba(255, 133, 162, 0.05)', bottom: '15%', left: '3%', delay: '3s' },
  { w: 140, h: 140, bg: 'rgba(91, 141, 239, 0.04)', top: '50%', left: '60%', delay: '5s' },
  { w: 100, h: 100, bg: 'rgba(168, 85, 247, 0.03)', top: '30%', left: '15%', delay: '7s' },
];

export const FloatingBackground = memo(function FloatingBackground() {
  return (
    <div className="floating-shapes" aria-hidden="true">
      {SHAPES.map((s, i) => (
        <div key={i} className="floating-shape" style={{
          width: s.w, height: s.h, background: s.bg,
          top: s.top, right: s.right, bottom: s.bottom, left: s.left,
          animationDelay: s.delay,
        }} />
      ))}
    </div>
  );
});
