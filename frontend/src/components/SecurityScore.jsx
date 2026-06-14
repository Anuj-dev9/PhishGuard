import React, { useEffect, useRef } from 'react';

export default function SecurityScore({ score = 94, size = 140 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const cx = size / 2, cy = size / 2, r = size / 2 - 16;
    const startAngle = Math.PI * 0.75;
    const endAngle   = Math.PI * 2.25;
    const scoreAngle = startAngle + (endAngle - startAngle) * (score / 100);

    ctx.clearRect(0, 0, size, size);

    // Track background
    ctx.beginPath();
    ctx.arc(cx, cy, r, startAngle, endAngle);
    ctx.lineWidth = 12;
    ctx.strokeStyle = '#1a2540';
    ctx.lineCap = 'round';
    ctx.stroke();

    // Score gradient arc
    const grad = ctx.createLinearGradient(0, 0, size, size);
    grad.addColorStop(0, '#10b981');
    grad.addColorStop(0.5, '#3b82f6');
    grad.addColorStop(1, '#8b5cf6');

    ctx.beginPath();
    ctx.arc(cx, cy, r, startAngle, scoreAngle);
    ctx.lineWidth = 12;
    ctx.strokeStyle = grad;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Glow
    ctx.shadowBlur = 16;
    ctx.shadowColor = '#10b981';
    ctx.beginPath();
    ctx.arc(cx, cy, r, startAngle, scoreAngle);
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(16,185,129,0.3)';
    ctx.stroke();
    ctx.shadowBlur = 0;

  }, [score, size]);

  const color = score >= 80 ? 'var(--success)' : score >= 60 ? 'var(--warning)' : 'var(--danger)';
  const label = score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : 'At Risk';

  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
      <canvas ref={canvasRef} width={size} height={size} style={{ position: 'absolute', inset: 0 }} />
      <div style={{ textAlign: 'center', zIndex: 1 }}>
        <div style={{ fontSize: size * 0.26, fontWeight: 800, color, lineHeight: 1, fontFamily: 'Outfit, sans-serif' }}>{score}</div>
        <div style={{ fontSize: size * 0.1, color: 'var(--text-muted)', fontWeight: 600, marginTop: 2 }}>{label}</div>
      </div>
    </div>
  );
}
