'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ordersApi } from '@/lib/firestore';

export default function TrackOrderPage() {
  const router = useRouter();
  const [orderId, setOrderId] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const order = await ordersApi.getById(orderId.trim());
      if (!order) {
        setError('No order found with that ID.');
        return;
      }
      if (email && order.customerEmail.toLowerCase() !== email.trim().toLowerCase()) {
        setError('That email does not match this order.');
        return;
      }
      router.push(`/orders/${order.id}`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ maxWidth: 560, margin: '0 auto', padding: '80px 24px' }}>
      <div className="tag" style={{ marginBottom: 12 }}>Tracking</div>
      <h1 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 900, letterSpacing: '-0.02em', marginBottom: 12 }}>TRACK ORDER</h1>
      <p style={{ color: 'var(--bb-muted)', marginBottom: 32 }}>Enter your order ID (from your confirmation page or email).</p>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <label style={{ color: '#888', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Order ID</label>
          <input required className="bb-input" value={orderId} onChange={e => setOrderId(e.target.value)} placeholder="Firestore document ID" />
        </div>
        <div>
          <label style={{ color: '#888', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Email (optional)</label>
          <input type="email" className="bb-input" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        {error && <p style={{ color: '#ff4444', fontSize: 13 }}>{error}</p>}
        <button className="btn-primary" type="submit" disabled={busy} style={{ padding: 16 }}>
          {busy ? 'Looking up…' : 'Track order'}
        </button>
      </form>
    </div>
  );
}
