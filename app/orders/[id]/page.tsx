'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ordersApi, Order, OrderStatus } from '@/lib/firestore';
import { useCurrency } from '@/lib/currency';
import { useAuth } from '@/lib/auth';

const STEPS: OrderStatus[] = ['pending', 'confirmed', 'shipped', 'delivered'];

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { format } = useCurrency();
  const { user } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ordersApi.getById(id).then(o => {
      setOrder(o);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <div style={{ padding: 80, textAlign: 'center', color: 'var(--bb-muted)' }}>Loading…</div>;
  if (!order) {
    return (
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '80px 24px', textAlign: 'center' }}>
        <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 12 }}>ORDER NOT FOUND</h1>
        <Link href="/track"><button className="btn-outline">Look up another order</button></Link>
      </div>
    );
  }

  const stepIndex = order.status === 'cancelled' ? -1 : STEPS.indexOf(order.status);

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '48px 24px' }}>
      <div className="tag" style={{ marginBottom: 12 }}>Order tracking</div>
      <h1 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 900, letterSpacing: '-0.02em', marginBottom: 8 }}>
        #{order.id?.slice(-8).toUpperCase()}
      </h1>
      <p style={{ color: 'var(--bb-muted)', marginBottom: 32 }}>
        {order.createdAt ? new Date(order.createdAt.toMillis()).toLocaleString() : ''} · {order.paymentStatus ?? 'pending'}
      </p>

      {order.status === 'cancelled' ? (
        <p style={{ color: '#ff4444', marginBottom: 32 }}>This order was cancelled.</p>
      ) : (
        <div style={{ display: 'flex', gap: 0, marginBottom: 40, overflowX: 'auto' }}>
          {STEPS.map((step, i) => (
            <div key={step} style={{ flex: 1, minWidth: 120, textAlign: 'center' }}>
              <div style={{ height: 4, background: i <= stepIndex ? 'var(--bb-accent)' : 'var(--bb-border)', marginBottom: 10 }} />
              <p style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 700, color: i <= stepIndex ? 'var(--bb-fg)' : 'var(--bb-muted)' }}>{step}</p>
            </div>
          ))}
        </div>
      )}

      {order.trackingNumber && (
        <div style={{ border: '1px solid var(--bb-border)', padding: 20, marginBottom: 32 }}>
          <p style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#888', marginBottom: 6 }}>Tracking number</p>
          <p style={{ fontWeight: 800 }}>{order.trackingNumber}</p>
          {order.trackingUrl && (
            <a href={order.trackingUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--bb-accent)', fontSize: 13 }}>Open courier tracking →</a>
          )}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
        {order.items.map((item, i) => (
          <div key={i} style={{ display: 'flex', gap: 16, alignItems: 'center', borderBottom: '1px solid var(--bb-border)', paddingBottom: 12 }}>
            {item.image && (
              <div style={{ position: 'relative', width: 64, height: 80, background: 'var(--bb-border)' }}>
                <Image src={item.image} alt={item.productName} fill style={{ objectFit: 'cover' }} />
              </div>
            )}
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 700 }}>{item.productName}</p>
              <p style={{ fontSize: 12, color: '#888' }}>{[item.size, item.color].filter(Boolean).join(' · ')} × {item.quantity}</p>
            </div>
            <p style={{ fontWeight: 800 }}>{format(item.price * item.quantity)}</p>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: 32 }}>
        <p style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}><span style={{ color: '#888' }}>Subtotal</span><span>{format(order.subtotal)}</span></p>
        <p style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}><span style={{ color: '#888' }}>Shipping</span><span>{format(order.shippingCost)}</span></p>
        {order.discount > 0 && <p style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}><span style={{ color: '#888' }}>Discount</span><span>-{format(order.discount)}</span></p>}
        <p style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 900, fontSize: 18 }}><span>Total</span><span>{format(order.total)}</span></p>
      </div>

      <p style={{ color: 'var(--bb-muted)', fontSize: 14, lineHeight: 1.7 }}>
        Ships to {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state}, {order.shippingAddress.country}
      </p>
      {user && <p style={{ marginTop: 24 }}><Link href="/profile" style={{ color: 'var(--bb-accent)' }}>Back to profile →</Link></p>}
    </div>
  );
}
