import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

function useCounter(target, duration = 1200) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else { setCount(Math.floor(start)); }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
}

export default function StatCard({ icon: Icon, label, value, unit = '', trend, trendLabel, color = 'var(--primary)', animate = true, className = '' }) {
  const numericValue = typeof value === 'number' ? value : parseInt(value) || 0;
  const displayed = animate ? useCounter(numericValue) : numericValue;

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = trend === 'up' ? 'var(--danger)' : trend === 'down' ? 'var(--success)' : 'var(--text-muted)';

  return (
    <div className={`stat-card animate-fade-up ${className}`}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 10,
          background: `${color}18`, border: `1px solid ${color}30`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
        }}>
          {Icon && <Icon size={18} color={color} strokeWidth={2} />}
        </div>
        {trend && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <TrendIcon size={13} color={trendColor} />
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: trendColor }}>{trendLabel}</span>
          </div>
        )}
      </div>
      <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1, fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.03em' }}>
        {displayed.toLocaleString()}<span style={{ fontSize: '1rem', color, marginLeft: 2 }}>{unit}</span>
      </div>
      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 6, fontWeight: 500 }}>{label}</div>
    </div>
  );
}
