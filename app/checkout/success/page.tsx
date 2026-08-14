'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ordersApi } from '@/lib/firestore';
import { useStore } from '@/lib/store';
import { useCurrency } from '@/lib/currency';

function SuccessInner() {
  const params = useSearchParams();
  const { dispatch } = useStore();
  const { format } = useCurrency();
  const [status, setStatus] = useState<'loading' | 'ok' | 'error'>('loading');
  const [orderId, setOrderId] = useState('');
  const [total, setTotal] = useState(0);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const run = async () => {
      const gateway = params.get('gateway');
      const id = params.get('orderId') || '';
      setOrderId(id);

      try {
        if (gateway === 'paystack') {
          const reference = params.get('reference') || params.get('trxref');
          if (!reference) throw new Error('Missing Paystack reference');
          const res = await fetch('/api/paystack/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reference }),
          });
          const data = await res.json() as { paid?: boolean; error?: string };
          if (!res.ok || !data.paid) throw new Error(data.error || 'Verification failed');
          if (id) {
            await ordersApi.update(id, { paymentStatus: 'paid', paymentRef: reference, status: 'confirmed' });
          }
        } else if (gateway === 'stripe') {
          const sessionId = params.get('session_id');
          if (!sessionId) throw new Error('Missing Stripe session');
          const res = await fetch('/api/stripe/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionId }),
          });
          const data = await res.json() as { paid?: boolean; reference?: string; error?: string };
          if (!res.ok || !data.paid) throw new Error(data.error || 'Verification failed');
          if (id) {
            await ordersApi.update(id, { paymentStatus: 'paid', paymentRef: data.reference, status: 'confirmed' });
          }
        } else {
          throw new Error('Unknown payment gateway');
        }

        if (id) {
          const order = await ordersApi.getById(id);
          if (order) setTotal(order.total);
        }
        dispatch({ type: 'CLEAR_CART' });
        setStatus('ok');
      } catch (e) {
        setMessage(e instanceof Error ? e.message : 'Could not confirm payment');
        setStatus('error');
      }
    };
    void run();
  }, [params, dispatch]);

  if (status === 'loading') {
    return <p style={{ color: 'var(--bb-muted)' }}>Confirming your payment…</p>;
  }

  if (status === 'error') {
    return (
      <div>
        <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 12 }}>PAYMENT ISSUE</h1>
        <p style={{ color: '#ff4444', marginBottom: 24 }}>{message}</p>
        <Link href="/checkout"><button className="btn-outline">Back to checkout</button></Link>
      </div>
    );
  }

  return (
    <div>
      <div className="tag" style={{ marginBottom: 12 }}>Thank you</div>
      <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: 16 }}>ORDER CONFIRMED</h1>
      <p style={{ color: 'var(--bb-muted)', marginBottom: 8 }}>Order #{orderId.slice(-8).toUpperCase()}</p>
      {total > 0 && <p style={{ fontWeight: 800, marginBottom: 32 }}>{format(total)}</p>}
      <p style={{ color: 'var(--bb-muted)', marginBottom: 32, maxWidth: 480 }}>
        We received your payment. Track shipping from your profile or with your order ID.
      </p>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {orderId && <Link href={`/orders/${orderId}`}><button className="btn-primary">Track order</button></Link>}
        <Link href="/products"><button className="btn-outline">Continue shopping</button></Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '80px 24px' }}>
      <Suspense fallback={<p style={{ color: 'var(--bb-muted)' }}>Loading…</p>}>
        <SuccessInner />
      </Suspense>
    </div>
  );
}
