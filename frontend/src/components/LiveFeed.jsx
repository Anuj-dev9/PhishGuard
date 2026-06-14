import React, { useState, useEffect, useRef } from 'react';
import { AlertCircle, Mail, MessageSquare, Globe, Shield } from 'lucide-react';
import ThreatBadge from './ThreatBadge';

const SEED_EVENTS = [
  { id: 1,  type: 'email', severity: 'critical', msg: 'Spear-phishing attack targeting CFO email',       src: 'support@paypa1-secure.net',         time: '14:32:01' },
  { id: 2,  type: 'sms',   severity: 'high',     msg: 'Smishing attempt — fake bank alert',              src: '+1 (555) 0192',                     time: '14:31:44' },
  { id: 3,  type: 'url',   severity: 'medium',   msg: 'Lookalike domain detected: amaz0n-login.com',    src: 'https://amaz0n-login.com',          time: '14:31:22' },
  { id: 4,  type: 'email', severity: 'high',     msg: 'Business email compromise (BEC) attempt',        src: 'ceo-urgent@company-hq.co',          time: '14:30:58' },
  { id: 5,  type: 'url',   severity: 'low',      msg: 'Suspicious redirect chain detected',             src: 'https://bit.ly/3xR9kLm',            time: '14:30:33' },
  { id: 6,  type: 'email', severity: 'medium',   msg: 'Credential harvesting link in email body',       src: 'no-reply@micrsoft-login.org',       time: '14:29:11' },
  { id: 7,  type: 'sms',   severity: 'critical', msg: 'SIM-swap social engineering attempt detected',   src: '+44 7911 123456',                   time: '14:28:50' },
  { id: 8,  type: 'url',   severity: 'safe',     msg: 'URL cleared: reputation verified by AI',         src: 'https://docs.google.com',           time: '14:28:30' },
  { id: 9,  type: 'email', severity: 'high',     msg: 'Invoice fraud: mismatched sender domain',        src: 'billing@acme-invoices.ru',          time: '14:27:55' },
  { id: 10, type: 'sms',   severity: 'medium',   msg: 'Package delivery scam SMS intercepted',          src: '+61 400 555 123',                   time: '14:27:22' },
];

const LIVE_POOL = [
  { type: 'email', severity: 'critical', msg: 'Zero-day phishing kit detected in email attachment',  src: 'update@microsft-365.com' },
  { type: 'url',   severity: 'high',     msg: 'Malicious payload URL blocked before delivery',       src: 'https://free-gift-claim.xyz' },
  { type: 'sms',   severity: 'medium',   msg: 'OTP bypass scam via SMS flooding',                    src: '+1 (800) 555-0199' },
  { type: 'email', severity: 'high',     msg: 'Impersonation of IT helpdesk detected',               src: 'it-support@companyhelpdesk.co' },
  { type: 'url',   severity: 'low',      msg: 'Domain age < 7 days — flagged for monitoring',        src: 'https://newsite-deals.com' },
  { type: 'email', severity: 'safe',     msg: 'Newsletter verified — sender reputation clean',        src: 'news@techcrunch.com' },
];

const TypeIcon = ({ type }) => {
  const props = { size: 12, strokeWidth: 2.5 };
  if (type === 'email') return <Mail {...props} />;
  if (type === 'sms')   return <MessageSquare {...props} />;
  if (type === 'url')   return <Globe {...props} />;
  return <Shield {...props} />;
};

let nextId = 100;

export default function LiveFeed({ maxItems = 8 }) {
  const [events, setEvents] = useState(SEED_EVENTS.slice(0, maxItems));
  const listRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const pool = LIVE_POOL;
      const raw  = pool[Math.floor(Math.random() * pool.length)];
      const now  = new Date();
      const time = now.toTimeString().split(' ')[0];
      const newEvent = { ...raw, id: nextId++, time };

      setEvents(prev => [newEvent, ...prev].slice(0, maxItems));
    }, 3500);
    return () => clearInterval(interval);
  }, [maxItems]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }} ref={listRef}>
      {events.map((ev, i) => (
        <div
          key={ev.id}
          className={i === 0 ? 'animate-fade-up' : ''}
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '9px 12px', borderRadius: 8,
            background: i === 0 ? 'var(--surface-2)' : 'transparent',
            border: '1px solid transparent',
            borderColor: i === 0 ? 'var(--border)' : 'transparent',
            transition: 'all 0.3s ease',
          }}
        >
          {/* Type icon */}
          <div style={{
            width: 28, height: 28, borderRadius: 7, flexShrink: 0,
            background: 'var(--surface-3)', border: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--text-muted)'
          }}>
            <TypeIcon type={ev.type} />
          </div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {ev.msg}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {ev.src}
            </div>
          </div>

          {/* Severity + time */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3, flexShrink: 0 }}>
            <ThreatBadge severity={ev.severity} showIcon={false} />
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{ev.time}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
