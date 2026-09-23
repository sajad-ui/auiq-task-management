import React, { useEffect, useRef } from 'react';

interface WaterRippleCanvasProps {
  enabled: boolean;
  rippleColor?: 'gold' | 'cyan' | 'emerald';
  intensity?: number;
}

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  speed: number;
  lineWidth: number;
}

export const WaterRippleCanvas: React.FC<WaterRippleCanvasProps> = ({
  enabled = true,
  rippleColor = 'gold',
  intensity = 1.0,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ripplesRef = useRef<Ripple[]>([]);
  const lastPosRef = useRef<{ x: number; y: number; time: number }>({ x: 0, y: 0, time: 0 });
  const animFrameId = useRef<number | null>(null);

  // Color mappings
  const getColorRGB = () => {
    switch (rippleColor) {
      case 'cyan':
        return '56, 189, 248'; // Sky cyan
      case 'emerald':
        return '52, 211, 153'; // Emerald
      case 'gold':
      default:
        return '212, 175, 55'; // Presidential Gold (AUIQ Gold)
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const addRipple = (x: number, y: number, isClick = false) => {
      if (!enabled) return;
      const baseMaxRadius = isClick ? 130 * intensity : 70 * intensity;
      const baseSpeed = isClick ? 2.5 : 1.6;

      ripplesRef.current.push({
        x,
        y,
        radius: 0,
        maxRadius: baseMaxRadius + Math.random() * 20,
        alpha: (isClick ? 0.65 : 0.35) * intensity,
        speed: baseSpeed + Math.random() * 0.8,
        lineWidth: isClick ? 2.5 : 1.5,
      });

      // Secondary reverberating wave for clicks or fast moves
      if (isClick) {
        setTimeout(() => {
          if (canvasRef.current && enabled) {
            ripplesRef.current.push({
              x: x + (Math.random() - 0.5) * 6,
              y: y + (Math.random() - 0.5) * 6,
              radius: 0,
              maxRadius: baseMaxRadius * 0.75,
              alpha: 0.45 * intensity,
              speed: baseSpeed * 0.9,
              lineWidth: 1.8,
            });
          }
        }, 120);
      }

      // Limit array size to avoid CPU overhead
      if (ripplesRef.current.length > 50) {
        ripplesRef.current.shift();
      }
    };

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const now = Date.now();
      const clientX = 'touches' in e ? e.touches[0]?.clientX : (e as MouseEvent).clientX;
      const clientY = 'touches' in e ? e.touches[0]?.clientY : (e as MouseEvent).clientY;

      if (clientX === undefined || clientY === undefined) return;

      const last = lastPosRef.current;
      const dist = Math.hypot(clientX - last.x, clientY - last.y);
      const timeDiff = now - last.time;

      // Only trigger ripple if moved significantly or after min interval
      if (dist > 18 || (dist > 6 && timeDiff > 45)) {
        addRipple(clientX, clientY, false);
        lastPosRef.current = { x: clientX, y: clientY, time: now };
      }
    };

    const handleClick = (e: MouseEvent) => {
      addRipple(e.clientX, e.clientY, true);
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('click', handleClick);

    const rgb = getColorRGB();

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (enabled && ripplesRef.current.length > 0) {
        const activeRipples: Ripple[] = [];

        for (let i = 0; i < ripplesRef.current.length; i++) {
          const r = ripplesRef.current[i];
          r.radius += r.speed;
          r.alpha *= 0.96; // Smooth decay

          if (r.alpha > 0.01 && r.radius < r.maxRadius) {
            // Draw outer wave ring
            ctx.save();
            ctx.beginPath();
            ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(${rgb}, ${r.alpha})`;
            ctx.lineWidth = r.lineWidth;
            ctx.stroke();

            // Subtle inner refraction highlight
            if (r.radius > 15) {
              ctx.beginPath();
              ctx.arc(r.x, r.y, r.radius * 0.65, 0, Math.PI * 2);
              ctx.strokeStyle = `rgba(${rgb}, ${r.alpha * 0.4})`;
              ctx.lineWidth = 1;
              ctx.stroke();
            }

            ctx.restore();
            activeRipples.push(r);
          }
        }

        ripplesRef.current = activeRipples;
      }

      animFrameId.current = requestAnimationFrame(render);
    };

    animFrameId.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('click', handleClick);
      if (animFrameId.current) {
        cancelAnimationFrame(animFrameId.current);
      }
    };
  }, [enabled, rippleColor, intensity]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-30 transition-opacity duration-300"
      style={{ mixBlendMode: 'screen' }}
      aria-hidden="true"
    />
  );
};
