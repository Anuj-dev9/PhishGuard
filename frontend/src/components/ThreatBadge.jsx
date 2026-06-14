import React from 'react';
import { AlertTriangle, AlertCircle, Info, CheckCircle, Zap } from 'lucide-react';

const CONFIG = {
  critical: { label: 'Critical', color: 'var(--critical)', bg: 'var(--critical-bg)', icon: Zap },
  high:     { label: 'High',     color: 'var(--danger)',   bg: 'var(--danger-bg)',   icon: AlertCircle },
  medium:   { label: 'Medium',   color: 'var(--warning)',  bg: 'var(--warning-bg)',  icon: AlertTriangle },
  low:      { label: 'Low',      color: 'var(--info)',     bg: 'var(--info-bg)',     icon: Info },
  safe:     { label: 'Safe',     color: 'var(--success)',  bg: 'var(--success-bg)',  icon: CheckCircle },
};

export default function ThreatBadge({ severity = 'low', showIcon = true, className = '' }) {
  const cfg = CONFIG[severity] || CONFIG.low;
  const Icon = cfg.icon;
  return (
    <span
      className={className}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 5,
        padding: '3px 10px',
        borderRadius: 99,
        fontSize: '0.72rem', fontWeight: 700,
        letterSpacing: '0.05em', textTransform: 'uppercase',
        color: cfg.color, background: cfg.bg,
        border: `1px solid ${cfg.color}40`,
      }}
    >
      {showIcon && <Icon size={11} strokeWidth={2.5} />}
      {cfg.label}
    </span>
  );
}
