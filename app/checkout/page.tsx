'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { useStore } from '@/lib/store';
import { useAuth } from '@/lib/auth';
import { useCurrency } from '@/lib/currency';
import { useSite } from '@/lib/site';
import { ordersApi, promoCodesApi, usersApi } from '@/lib/firestore';

function CheckoutForm() {
  const { state, dispatch, cartTotal } = useStore();
  const { user } = useAuth();
  const { format, currency } = useCurrency();
  const { settings } = useSite();
  const router = useRouter();
  const searchParams = useSearchParams();
  const cancelled = searchParams.get('cancelled');

  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [promoLabel, setPromoLabel] = useState('');
  const [promoId, setPromoId] = useState<string | null>(null);
  const [promoUsage, setPromoUsage] = useState(0);
  const [paying, setPaying] = useState<'paystack' | 'stripe' | null>(null);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    country: 'Nigeria',
    notes: '',
  });

  useEffect(() => {
    if (user) {
      setForm(f => ({
        ...f,
        name: user.displayName || f.name,
        email: user.email || f.email,
      }));
      usersApi.getOne(user.uid).then(doc => {
        if (!doc) return;
        setForm(f => ({
          ...f,
          name: doc.displayName || f.name,
          phone: doc.phone || f.phone,
          street: doc.address?.street || f.street,
          city: doc.address?.city || f.city,
          state: doc.address?.state || f.state,
          country: doc.address?.country || f.country,
        }));
      }).catch(() => {});
    }
  }, [user]);

  const freeShippingThreshold = settings?.freeShippingThreshold ?? 50000;
  const shippingCost = settings?.shippingCost ?? 3500;
  const shipping = cartTotal >= freeShippingThreshold ? 0 : shippingCost;
  const discountAmount = cartTotal * discount;
  const total = Math.max(0, cartTotal - discountAmount + shipping);

  const applyPromo = async () => {
    setError('');
    const codes = await promoCodesApi.getActive();
    const match = codes.find(c => c.code.toUpperCase() === promoCode.toUpperCase());
    if (!match) {
      setError('Invalid promo code');
      return;
    }
    setDiscount(match.type === 'percentage' ? match.discount / 100 : match.discount / cartTotal);
    setPromoLabel(match.code);
    setPromoId(match.id ?? null);
    setPromoUsage(match.usageCount);
  };

  const createOrder = async (method: 'paystack' | 'stripe') => {
    const orderId = await ordersApi.create({
      userId: user?.uid,
      customerName: form.name,
      customerEmail: form.email,
      customerPhone: form.phone,
      items: state.cart.map(i => ({
        productId: i.product.id,
        productName: i.product.name,
        image: i.product.images[0],
        size: i.size,
        color: i.color,
        quantity: i.quantity,
        price: i.product.price,
      })),
      subtotal: cartTotal,
      shippingCost: shipping,
      discount: discountAmount,
      promoCode: promoLabel || undefined,
      total,
      status: 'pending',
      shippingAddress: {
        street: form.street,
        city: form.city,
        state: form.state,
        country: form.country,
      },
      notes: form.notes || undefined,
      paymentMethod: method,
      paymentStatus: 'pending',
      currency: method === 'paystack' ? 'NGN' : currency.code,
    });
    if (promoId) await promoCodesApi.incrementUsage(promoId, promoUsage);
    if (user) {
      const existing = await usersApi.getOne(user.uid);
      await usersApi.update(user.uid, {
        displayName: form.name,
        phone: form.phone,
        address: { street: form.street, city: form.city, state: form.state, country: form.country },
        totalOrders: (existing?.totalOrders ?? 0) + 1,
        totalSpend: (existing?.totalSpend ?? 0) + total,
      });
    }
    return orderId;
  };

  const payPaystack = async () => {
    setError('');
    setPaying('paystack');
    try {
      const orderId = await createOrder('paystack');
      const res = await fetch('/api/paystack/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, amountNgn: total, orderId }),
      });
      const data = await res.json() as { authorization_url?: string; error?: string };
      if (!res.ok || !data.authorization_url) throw new Error(data.error || 'Could not start Paystack');
      window.location.href = data.authorization_url;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Payment failed');
      setPaying(null);
    }
  };

  const payStripe = async () => {
    setError('');
    setPaying('stripe');
    try {
      const orderId = await createOrder('stripe');
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email,
          amountNgn: total,
          orderId,
          currency: currency.code,
          rateToNgn: currency.rateToNgn,
          description: `BIGBOLD order (${state.cart.length} items)`,
        }),
      });
      const data = await res.json() as { url?: string; error?: string };
      if (!res.ok || !data.url) throw new Error(data.error || 'Could not start Stripe');
      window.location.href = data.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Payment failed');
      setPaying(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  if (state.cart.length === 0) {
    return (
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '80px 24px', textAlign: 'center' }}>
        <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 16 }}>YOUR CART IS EMPTY</h1>
        <Link href="/products"><button className="btn-primary">Shop Now</button></Link>
      </div>
    );
  }

  const busy = paying !== null;
  const nigeria = form.country.toLowerCase().includes('nigeria');

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: '48px 24px' }}>
      <div className="tag" style={{ marginBottom: 12 }}>Checkout</div>
      <h1 style={{ fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: 900, letterSpacing: '-0.02em', marginBottom: 32 }}>CHECKOUT</h1>
      {cancelled && <p style={{ color: '#ffaa00', marginBottom: 16 }}>Payment was cancelled. You can try again.</p>}
      {error && <p style={{ color: '#ff4444', marginBottom: 16 }}>{error}</p>}

      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 40, alignItems: 'start' }} className="cart-grid">
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 20 }}>Shipping details</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[
              { key: 'name', label: 'Full name', span: true },
              { key: 'email', label: 'Email', type: 'email' },
              { key: 'phone', label: 'Phone', type: 'tel' },
              { key: 'street', label: 'Street address', span: true },
              { key: 'city', label: 'City' },
              { key: 'state', label: 'State / Region' },
            ].map(field => (
              <div key={field.key} style={{ gridColumn: field.span ? '1 / -1' : undefined }}>
                <label style={{ color: '#888', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>{field.label}</label>
                <input
                  required
                  type={field.type || 'text'}
                  className="bb-input"
                  value={form[field.key as keyof typeof form]}
                  onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                />
              </div>
            ))}
            <div>
              <label style={{ color: '#888', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Country</label>
              <select className="bb-input" value={form.country} onChange={e => setForm({ ...form, country: e.target.value })}>
                {['Nigeria', 'Ghana', 'Kenya', 'United Kingdom', 'United States', 'Canada', 'Other'].map(c => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ color: '#888', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Notes</label>
              <textarea className="bb-input" rows={3} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
            </div>
          </div>
        </div>

        <div style={{ background: 'var(--bb-bg-2)', border: '1px solid var(--bb-border)', padding: 32, position: 'sticky', top: 80 }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 20 }}>Order</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
            {state.cart.map(item => (
              <div key={`${item.product.id}-${item.size}-${item.color}`} style={{ display: 'flex', gap: 12 }}>
                <div style={{ position: 'relative', width: 56, height: 70, flexShrink: 0, background: 'var(--bb-border)' }}>
                  <Image src={item.product.images[0]} alt={item.product.name} fill style={{ objectFit: 'cover' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 13, fontWeight: 700 }}>{item.product.name}</p>
                  <p style={{ fontSize: 11, color: '#888' }}>{item.size} · {item.color} × {item.quantity}</p>
                </div>
                <p style={{ fontSize: 13, fontWeight: 700 }}>{format(item.product.price * item.quantity)}</p>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 0, marginBottom: 16 }}>
            <input className="bb-input" placeholder="Promo code" value={promoCode} onChange={e => setPromoCode(e.target.value)} />
            <button type="button" className="btn-primary" style={{ padding: '12px 16px' }} onClick={applyPromo}>Apply</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20, fontSize: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#888' }}>Subtotal</span><span>{format(cartTotal)}</span></div>
            {discountAmount > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--bb-accent)' }}><span>Discount</span><span>-{format(discountAmount)}</span></div>}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#888' }}>Shipping</span><span>{shipping === 0 ? 'FREE' : format(shipping)}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 900, fontSize: 18, borderTop: '1px solid var(--bb-border)', paddingTop: 12 }}><span>TOTAL</span><span>{format(total)}</span></div>
          </div>

          <p style={{ fontSize: 12, color: '#888', marginBottom: 12 }}>
            {nigeria ? 'Paystack is recommended for Nigerian cards, bank transfer and USSD.' : 'Stripe is recommended for international cards.'}
          </p>
          <button type="button" className="btn-primary" disabled={busy} onClick={payPaystack} style={{ width: '100%', marginBottom: 10, padding: 16 }}>
            {paying === 'paystack' ? 'Redirecting…' : 'Pay with Paystack (NGN)'}
          </button>
          <button type="button" className="btn-outline" disabled={busy} onClick={payStripe} style={{ width: '100%', padding: 16 }}>
            {paying === 'stripe' ? 'Redirecting…' : `Pay with Stripe (${currency.code})`}
          </button>
          <button type="button" onClick={() => router.push('/cart')} style={{ background: 'none', border: 'none', color: '#888', marginTop: 16, cursor: 'pointer', width: '100%' }}>← Back to cart</button>
        </div>
      </form>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div style={{ padding: 80, textAlign: 'center' }}>Loading…</div>}>
      <CheckoutForm />
    </Suspense>
  );
}
