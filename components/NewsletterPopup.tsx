'use client';

import { useEffect, useState } from 'react';
import { newsletterApi } from '@/lib/firestore';

const STORAGE_KEY = 'bb-newsletter-shown';

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function NewsletterPopup() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    // Check if already shown
    try {
      if (localStorage.getItem(STORAGE_KEY)) return;
    } catch {
      return;
    }

    // Show after 3 seconds
    const timer = setTimeout(() => {
      setVisible(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setVisible(false);
    try {
      localStorage.setItem(STORAGE_KEY, 'true');
    } catch {
      // ignore
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!isValidEmail(email)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setStatus('loading');
    try {
      await newsletterApi.subscribe(email, 'popup');
      setStatus('success');
      try {
        localStorage.setItem(STORAGE_KEY, 'true');
      } catch {
        // ignore
      }
      // Auto-close after 2 seconds
      setTimeout(() => setVisible(false), 2000);
    } catch {
      setStatus('error');
      setErrorMsg('Something went wrong. Please try again.');
    }
  };

  if (!visible) return null;

  return (
    <>
      {/* Overlay */}
      <div
        onClick={handleClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.7)',
          zIndex: 9998,
          animation: 'fadeIn 0.3s ease',
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 9999,
          width: '90%',
          maxWidth: 480,
          background: 'var(--bb-bg)',
          border: '1px solid var(--bb-border)',
          padding: '48px 40px',
          animation: 'fadeUp 0.4s ease',
        }}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            background: 'none',
            border: 'none',
            color: 'var(--bb-muted)',
            cursor: 'pointer',
            fontSize: 20,
            lineHeight: 1,
            padding: 4,
            transition: 'color 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--bb-fg)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--bb-muted)')}
          aria-label="Close"
        >
          ×
        </button>

        {/* Brand mark */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 48,
            height: 48,
            background: 'var(--bb-fg)',
            color: 'var(--bb-bg)',
            fontWeight: 900,
            fontSize: 22,
            letterSpacing: '-0.02em',
            marginBottom: 16,
          }}>
            B
          </div>
          <h2 style={{
            fontSize: 'clamp(20px, 4vw, 28px)',
            fontWeight: 900,
            color: 'var(--bb-fg)',
            letterSpacing: '-0.02em',
            textTransform: 'uppercase',
            lineHeight: 1.1,
            marginBottom: 12,
          }}>
            JOIN THE BOLD<br />COMMUNITY
          </h2>
          <p style={{
            color: 'var(--bb-muted)',
            fontSize: 14,
            lineHeight: 1.7,
            maxWidth: 320,
            margin: '0 auto',
          }}>
            Get early access to drops, exclusive offers, and behind-the-scenes content.
          </p>
        </div>

        {status === 'success' ? (
          <div style={{
            textAlign: 'center',
            padding: '20px',
            border: '1px solid var(--bb-accent)',
            background: 'var(--bb-accent-bg)',
          }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>✓</div>
            <p style={{ color: 'var(--bb-fg)', fontWeight: 700, fontSize: 14 }}>
              You&apos;re in! Welcome to the bold community.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', gap: 0, marginBottom: 8 }}>
              <input
                type="email"
                placeholder="your@email.com"
                className="bb-input"
                style={{ flex: 1, fontSize: 14 }}
                value={email}
                onChange={e => setEmail(e.target.value)}
                disabled={status === 'loading'}
                autoFocus
              />
              <button
                type="submit"
                className="btn-primary"
                style={{ padding: '14px 24px', whiteSpace: 'nowrap', fontSize: 12, letterSpacing: '0.1em' }}
                disabled={status === 'loading'}
              >
                {status === 'loading' ? '...' : 'JOIN NOW'}
              </button>
            </div>
            {errorMsg && (
              <p style={{ color: 'var(--bb-muted)', fontSize: 12, marginTop: 4 }}>{errorMsg}</p>
            )}
            <p style={{ color: 'var(--bb-subtle)', fontSize: 11, textAlign: 'center', marginTop: 12 }}>
              No spam. Unsubscribe anytime.
            </p>
          </form>
        )}
      </div>
    </>
  );
}
