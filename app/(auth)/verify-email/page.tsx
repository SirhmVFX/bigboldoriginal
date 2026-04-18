'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { sendEmailVerification } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function VerifyEmailPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [resent, setResent] = useState(false);
  const [loading, setLoading] = useState(false);

  const resend = async () => {
    if (!auth.currentUser) return;
    setLoading(true);
    try {
      await sendEmailVerification(auth.currentUser);
      setResent(true);
    } finally {
      setLoading(false);
    }
  };

  const checkVerified = async () => {
    await auth.currentUser?.reload();
    if (auth.currentUser?.emailVerified) {
      router.push('/profile');
    } else {
      alert('Email not verified yet. Please check your inbox.');
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 56, marginBottom: 24 }}>✉</div>

      <div className="tag" style={{ marginBottom: 16, display: 'inline-block' }}>Almost there</div>
      <h1 style={{ fontSize: 28, fontWeight: 900, color: 'var(--bb-fg)', letterSpacing: '-0.02em', marginBottom: 12 }}>
        VERIFY YOUR EMAIL
      </h1>
      <p style={{ color: 'var(--bb-muted)', fontSize: 14, lineHeight: 1.7, marginBottom: 8 }}>
        We sent a verification link to
      </p>
      <p style={{ color: 'var(--bb-fg)', fontSize: 15, fontWeight: 700, marginBottom: 32 }}>
        {user?.email}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <button onClick={checkVerified} className="btn-primary" style={{ padding: '14px' }}>
          I've verified my email →
        </button>

        <button onClick={resend} disabled={loading || resent} className="btn-outline"
          style={{ padding: '14px', opacity: resent ? 0.6 : 1, cursor: resent ? 'default' : 'pointer' }}>
          {resent ? 'Email resent ✓' : loading ? 'Sending...' : 'Resend verification email'}
        </button>

        <button onClick={logout} style={{ background: 'none', border: 'none', color: 'var(--bb-muted)', fontSize: 13, cursor: 'pointer', textDecoration: 'underline', marginTop: 8 }}>
          Sign out and use a different account
        </button>
      </div>

      <p style={{ color: 'var(--bb-subtle)', fontSize: 12, marginTop: 24, lineHeight: 1.6 }}>
        Didn't receive it? Check your spam folder or click resend above.
      </p>
    </div>
  );
}
