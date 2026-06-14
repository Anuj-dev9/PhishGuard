import React from 'react';

// ── Button ──────────────────────────────────────────────────────────────────
export function Button({ children, variant = 'primary', size = '', className = '', onClick, type = 'button', disabled = false, ...props }) {
  const base = 'btn';
  const v = variant === 'primary' ? 'btn-primary'
           : variant === 'outline' ? 'btn-outline'
           : variant === 'ghost'   ? 'btn-ghost'
           : variant === 'danger'  ? 'btn-danger'
           : variant === 'success' ? 'btn-success'
           : 'btn-primary';
  const s = size === 'lg' ? 'btn-lg' : size === 'sm' ? 'btn-sm' : size === 'xs' ? 'btn-xs' : '';
  return (
    <button
      type={type}
      className={`${base} ${v} ${s} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

// ── Card ────────────────────────────────────────────────────────────────────
export function Card({ children, className = '', hover = false, onClick, ...props }) {
  return (
    <div
      className={`card ${hover ? 'card-hover cursor-pointer' : ''} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
}

// ── Badge ───────────────────────────────────────────────────────────────────
export function Badge({ children, variant = 'info', className = '', dot = false }) {
  const v = `badge-${variant}`;
  return (
    <span className={`badge ${v} ${className}`}>
      {dot && (
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: 'currentColor', display: 'inline-block', flexShrink: 0 }}
        />
      )}
      {children}
    </span>
  );
}

// ── Input ───────────────────────────────────────────────────────────────────
export function Input({ className = '', type = 'text', icon: Icon, ...props }) {
  if (Icon) {
    return (
      <div style={{ position: 'relative' }}>
        <span style={{
          position: 'absolute', left: 12, top: '50%',
          transform: 'translateY(-50%)', color: 'var(--text-muted)',
          pointerEvents: 'none', display: 'flex'
        }}>
          <Icon size={16} />
        </span>
        <input
          type={type}
          className={`input ${className}`}
          style={{ paddingLeft: 36 }}
          {...props}
        />
      </div>
    );
  }
  return <input type={type} className={`input ${className}`} {...props} />;
}

// ── Select ──────────────────────────────────────────────────────────────────
export function Select({ className = '', children, ...props }) {
  return (
    <select
      className={`input ${className}`}
      style={{ cursor: 'pointer' }}
      {...props}
    >
      {children}
    </select>
  );
}

// ── Toggle ──────────────────────────────────────────────────────────────────
export function Toggle({ active, onChange }) {
  return (
    <div
      className={`toggle ${active ? 'active' : ''}`}
      onClick={() => onChange && onChange(!active)}
      role="switch"
      aria-checked={active}
    />
  );
}

// ── Avatar ──────────────────────────────────────────────────────────────────
export function Avatar({ name = 'U', size = 36, className = '' }) {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  return (
    <div
      className={className}
      style={{
        width: size, height: size, borderRadius: '50%',
        background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: size * 0.36, fontWeight: 700, color: '#fff',
        fontFamily: 'var(--font-sans)', flexShrink: 0,
        letterSpacing: '-0.02em'
      }}
    >
      {initials}
    </div>
  );
}

// ── Divider ─────────────────────────────────────────────────────────────────
export function Divider({ label, className = '' }) {
  if (label) {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <div className="divider flex-1" />
        <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, whiteSpace: 'nowrap' }}>{label}</span>
        <div className="divider flex-1" />
      </div>
    );
  }
  return <hr className={`divider ${className}`} />;
}

// ── Modal ───────────────────────────────────────────────────────────────────
export function Modal({ open, onClose, title, children, width = 500 }) {
  if (!open) return null;
  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px'
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose?.(); }}
    >
      <div
        className="card animate-fade-up"
        style={{ width: '100%', maxWidth: width, maxHeight: '90vh', overflow: 'auto', padding: 24 }}
      >
        {title && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{title}</h3>
            <button
              className="btn-ghost btn btn-icon"
              onClick={onClose}
              style={{ fontSize: '1.2rem', color: 'var(--text-muted)', padding: 6 }}
            >✕</button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

// ── Skeleton ────────────────────────────────────────────────────────────────
export function Skeleton({ width = '100%', height = 20, radius = 6, className = '' }) {
  return (
    <div
      className={`shimmer ${className}`}
      style={{ width, height, borderRadius: radius }}
    />
  );
}

// ── Tabs ────────────────────────────────────────────────────────────────────
export function Tabs({ tabs, active, onChange, className = '' }) {
  return (
    <div
      className={className}
      style={{
        display: 'flex', gap: 4,
        background: 'var(--surface-2)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        padding: 4
      }}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className="btn"
          onClick={() => onChange(tab.id)}
          style={{
            flex: 1,
            background: active === tab.id ? 'var(--surface)' : 'transparent',
            color: active === tab.id ? 'var(--text-primary)' : 'var(--text-muted)',
            border: active === tab.id ? '1px solid var(--border)' : '1px solid transparent',
            borderRadius: 'var(--radius-sm)',
            padding: '7px 16px',
            fontSize: '0.8125rem',
            fontWeight: 600,
            transition: 'all 0.2s',
            boxShadow: active === tab.id ? 'var(--shadow-card)' : 'none'
          }}
        >
          {tab.icon && <span style={{ marginRight: 6 }}>{tab.icon}</span>}
          {tab.label}
        </button>
      ))}
    </div>
  );
}

// ── ProgressBar ──────────────────────────────────────────────────────────────
export function ProgressBar({ value, color = 'var(--primary)', className = '' }) {
  return (
    <div className={`progress-bar ${className}`}>
      <div
        className="progress-fill"
        style={{ width: `${value}%`, background: color }}
      />
    </div>
  );
}

// ── Tooltip ──────────────────────────────────────────────────────────────────
export function Tooltip({ label, children }) {
  return (
    <div className="tooltip-wrap">
      {children}
      <span className="tooltip-tip">{label}</span>
    </div>
  );
}
