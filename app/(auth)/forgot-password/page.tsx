'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await resetPassword(email);
      setSent(true);
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code;
      if (code === 'auth/user-not-found') setError('No account found with this email.');
      else setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 40 }}>
        <div className="tag" style={{ marginBottom: 16 }}>Account Recovery</div>
        <h1 style={{ fontSize: 32, fontWeight: 900, color: 'var(--bb-fg)', letterSpacing: '-0.02em', marginBottom: 8 }}>
          RESET PASSWORD
        </h1>
        <p style={{ color: 'var(--bb-muted)', fontSize: 14 }}>
          Enter your email and we'll send you a reset link.
        </p>
      </div>

      {sent ? (
        <div style={{ border: '1px solid var(--bb-border)', padding: 32, textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>✉</div>
          <h3 style={{ color: 'var(--bb-fg)', fontSize: 18, fontWeight: 800, marginBottom: 8 }}>Check your inbox</h3>
          <p style={{ color: 'var(--bb-muted)', fontSize: 14, lineHeight: 1.7, marginBottom: 24 }}>
            We sent a password reset link to <strong style={{ color: 'var(--bb-fg)' }}>{email}</strong>.
            Check your spam folder if you don't see it.
          </p>
          <button onClick={() => { setSent(false); setEmail(''); }} className="btn-outline" style={{ marginRight: 12 }}>
            Try again
          </button>
          <Link href="/login">
            <button className="btn-primary">Back to Login</button>
          </Link>
        </div>
      ) : (
        <>
          {error && (
            <div style={{ background: 'rgba(255,68,68,0.08)', border: '1px solid #ff4444', padding: '12px 16px', marginBottom: 20 }}>
              <p style={{ color: '#ff4444', fontSize: 13 }}>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ color: 'var(--bb-muted)', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Email Address</label>
              <input required type="email" placeholder="your@email.com"
                value={email} onChange={e => setEmail(e.target.value)}
                className="bb-input" />
            </div>

            <button type="submit" className="btn-primary" disabled={loading}
              style={{ padding: '16px', fontSize: 14, opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading ? 'Sending...' : 'Send Reset Link →'}
            </button>
          </form>

          <p style={{ color: 'var(--bb-muted)', fontSize: 13, marginTop: 24, textAlign: 'center' }}>
            Remember your password?{' '}
            <Link href="/login" style={{ color: 'var(--bb-fg)', fontWeight: 700, textDecoration: 'underline' }}>
              Sign in
            </Link>
          </p>
        </>
      )}
    </div>
  );
}
