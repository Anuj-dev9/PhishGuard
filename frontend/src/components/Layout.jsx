import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Shield, LayoutDashboard, Mail, MessageSquare, Globe,
  FileText, Settings, Bell, Search, Menu, X, LogOut,
  ChevronRight, AlertTriangle, Zap, TrendingUp, Activity
} from 'lucide-react';
import { Badge, Avatar } from './ui';

const navGroups = [
  {
    label: 'Overview',
    items: [
      { name: 'Dashboard',          path: '/dashboard',           icon: LayoutDashboard },
    ]
  },
  {
    label: 'Protection',
    items: [
      { name: 'Email Protection',   path: '/email-protection',    icon: Mail },
      { name: 'SMS Protection',     path: '/sms-protection',      icon: MessageSquare },
    ]
  },
  {
    label: 'Intelligence',
    items: [
      { name: 'Threat Intelligence',path: '/threat-intelligence', icon: Globe },
      { name: 'Analyze URL',        path: '/analyze',             icon: Activity },
    ]
  },
  {
    label: 'Reports',
    items: [
      { name: 'Reports',            path: '/reports',             icon: FileText },
      { name: 'Settings',           path: '/settings',            icon: Settings },
    ]
  }
];

const RECENT_NOTIFS = [];

export default function Layout({ children, user, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const notifRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Current page title
  const allItems = navGroups.flatMap(g => g.items);
  const currentItem = allItems.find(i => location.pathname.startsWith(i.path));

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>

      {/* ── Mobile overlay ── */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 40,
            background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(2px)'
          }}
        />
      )}

      {/* ── Sidebar ─────────────────────────────────────────────────────── */}
      <aside
        style={{
          width: 240, flexShrink: 0,
          background: 'var(--surface)',
          borderRight: '1px solid var(--border)',
          display: 'flex', flexDirection: 'column',
          position: 'fixed', top: 0, left: 0, height: '100vh',
          zIndex: 50, overflowY: 'auto',
          transform: sidebarOpen ? 'translateX(0)' : undefined,
          transition: 'transform 0.25s ease',
        }}
        className="sidebar"
      >
        {/* Logo */}
        <div style={{ padding: '20px 16px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(59,130,246,0.4)', flexShrink: 0
            }}>
              <Shield size={20} color="white" />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-primary)', letterSpacing: '-0.02em', fontFamily: 'Outfit, sans-serif' }}>
                Phishing Guard
              </div>
              <div style={{ fontSize: '0.65rem', color: 'var(--primary)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Enterprise
              </div>
            </div>
          </div>
        </div>

        {/* Security score widget */}
        <div style={{ margin: '12px', borderRadius: 12, background: 'var(--surface-2)', border: '1px solid var(--border)', padding: '12px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Security Score</span>
            <Badge variant="success" dot>Secure</Badge>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6 }}>
            <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--success)', lineHeight: 1, fontFamily: 'Outfit, sans-serif' }}>94</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 3 }}>/100</span>
          </div>
          <div className="progress-bar" style={{ marginTop: 8 }}>
            <div className="progress-fill" style={{ width: '94%', background: 'var(--success)' }} />
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '8px 8px', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {navGroups.map((group) => (
            <div key={group.label} style={{ marginBottom: 4 }}>
              <div style={{ padding: '10px 12px 4px', fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {group.label}
              </div>
              {group.items.map((item) => {
                const isActive = location.pathname.startsWith(item.path);
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '9px 12px', borderRadius: 8,
                      fontSize: '0.875rem', fontWeight: 500,
                      textDecoration: 'none', transition: 'all 0.18s ease',
                      color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                      background: isActive ? 'rgba(59,130,246,0.12)' : 'transparent',
                      border: isActive ? '1px solid rgba(59,130,246,0.2)' : '1px solid transparent',
                      marginBottom: 1
                    }}
                  >
                    <item.icon size={17} strokeWidth={isActive ? 2.2 : 1.8} />
                    {item.name}
                    {isActive && <ChevronRight size={14} style={{ marginLeft: 'auto', opacity: 0.5 }} />}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </nav>

        {/* User section */}
        <div style={{ padding: '12px', borderTop: '1px solid var(--border)' }}>
          <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <Avatar name={user?.email || 'User'} size={32} />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user?.name || user?.email?.split('@')[0] || 'Admin'}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user?.email || 'admin@company.com'}
                </div>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="btn btn-ghost btn-sm"
              style={{ width: '100%', justifyContent: 'center', gap: 6, color: 'var(--text-muted)', fontSize: '0.78rem' }}
            >
              <LogOut size={14} />
              Sign out
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main Content ─────────────────────────────────────────────────── */}
      <div style={{ flex: 1, marginLeft: 240, display: 'flex', flexDirection: 'column', minHeight: '100vh', minWidth: 0 }}>
        {/* Header */}
        <header style={{
          height: 60, background: 'var(--surface)',
          borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center',
          padding: '0 24px', gap: 16,
          position: 'sticky', top: 0, zIndex: 30
        }}>
          {/* Mobile menu toggle */}
          <button
            className="btn btn-ghost btn-icon"
            onClick={() => setSidebarOpen(s => !s)}
            style={{ display: 'none', color: 'var(--text-muted)' }}
            aria-label="Toggle sidebar"
          >
            <Menu size={20} />
          </button>

          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
            <Shield size={14} style={{ color: 'var(--text-muted)' }} />
            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Phishing Guard</span>
            <ChevronRight size={14} style={{ color: 'var(--text-muted)' }} />
            <span style={{ color: 'var(--text-primary)', fontSize: '0.8rem', fontWeight: 600 }}>
              {currentItem?.name || 'Dashboard'}
            </span>
          </div>

          {/* Live status badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginRight: 8 }}>
            <span style={{
              width: 7, height: 7, borderRadius: '50%',
              background: 'var(--success)', display: 'inline-block',
              animation: 'pulse-success 2s infinite'
            }} />
            <span style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: 600 }}>Live</span>
          </div>

          {/* Search trigger */}
          <button
            className="btn btn-ghost btn-icon"
            onClick={() => setSearchOpen(s => !s)}
            style={{ color: 'var(--text-muted)' }}
            aria-label="Search"
          >
            <Search size={18} />
          </button>

          {/* Notifications */}
          <div style={{ position: 'relative' }} ref={notifRef}>
            <button
              className="btn btn-ghost btn-icon"
              onClick={() => setNotifOpen(s => !s)}
              style={{ color: 'var(--text-muted)', position: 'relative' }}
              aria-label="Notifications"
            >
              <Bell size={18} />
              <span style={{
                position: 'absolute', top: 6, right: 6,
                width: 8, height: 8, borderRadius: '50%',
                background: 'var(--danger)', border: '2px solid var(--surface)'
              }} />
            </button>

            {notifOpen && (
              <div
                style={{
                  position: 'absolute', right: 0, top: 48,
                  width: 340, zIndex: 100,
                  background: 'var(--surface)', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-card)',
                  overflow: 'hidden'
                }}
                className="animate-fade-up"
              >
                <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>Notifications</span>
                  <Badge variant="info">0 new</Badge>
                </div>
                {RECENT_NOTIFS.length > 0 ? RECENT_NOTIFS.map((n) => (
                  <div
                    key={n.id}
                    style={{
                      padding: '12px 16px', borderBottom: '1px solid var(--border)',
                      display: 'flex', gap: 10, cursor: 'pointer',
                      transition: 'background 0.15s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-2)'}
                    onMouseLeave={e => e.currentTarget.style.background = ''}
                  >
                    <span style={{
                      width: 8, height: 8, borderRadius: '50%', flexShrink: 0, marginTop: 5,
                      background: n.type === 'danger' ? 'var(--danger)' : n.type === 'warning' ? 'var(--warning)' : n.type === 'success' ? 'var(--success)' : 'var(--info)'
                    }} />
                    <div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{n.text}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 3 }}>{n.time}</div>
                    </div>
                  </div>
                )) : (
                  <div style={{ padding: '24px 16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    You're all caught up.
                  </div>
                )}
                <div style={{ padding: '10px 16px', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--primary)', cursor: 'pointer', fontWeight: 600 }}>View all notifications</span>
                </div>
              </div>
            )}
          </div>

          <div style={{ width: 1, height: 24, background: 'var(--border)' }} />
          <Avatar name={user?.email || 'User'} size={32} style={{ cursor: 'pointer' }} />
        </header>

        {/* Page content */}
        <main style={{ flex: 1, padding: '28px 28px', background: 'var(--bg)' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
