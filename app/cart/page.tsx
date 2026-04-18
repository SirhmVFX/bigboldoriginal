'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useStore } from '@/lib/store';
import { formatPrice } from '@/lib/products';

export default function CartPage() {
  const { state, dispatch, cartTotal, showToast } = useStore();
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);

  const applyPromo = () => {
    if (promoCode.toUpperCase() === 'BOLD10') {
      setDiscount(0.1);
      setPromoApplied(true);
      showToast('Promo code applied! 10% off');
    } else {
      showToast('Invalid promo code');
    }
  };

  const discountAmount = cartTotal * discount;
  const shipping = cartTotal >= 50000 ? 0 : 3500;
  const total = cartTotal - discountAmount + shipping;

  if (state.cart.length === 0) {
    return (
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ marginBottom: 32 }}>
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="var(--bb-border-2)" strokeWidth="1.5" style={{ margin: '0 auto 24px' }}>
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
          <h1 style={{ fontSize: 32, fontWeight: 900, color: 'var(--bb-fg)', marginBottom: 12 }}>YOUR CART IS EMPTY</h1>
          <p style={{ color: '#555', fontSize: 15, marginBottom: 32 }}>Looks like you haven't added anything yet.</p>
          <Link href="/products">
            <button className="btn-primary">Start Shopping</button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: '48px 24px' }}>
      <div style={{ marginBottom: 40 }}>
        <div className="tag" style={{ marginBottom: 12 }}>Your Bag</div>
        <h1 style={{ fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: 900, letterSpacing: '-0.02em', color: 'var(--bb-fg)' }}>
          SHOPPING CART
        </h1>
        <p style={{ color: '#555', fontSize: 14, marginTop: 8 }}>{state.cart.reduce((s, i) => s + i.quantity, 0)} items</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 40, alignItems: 'start' }}>
        {/* Cart items */}
        <div>
          {/* Header */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto auto', gap: 16, padding: '12px 0', borderBottom: '1px solid #1a1a1a', marginBottom: 0 }}>
            {['Product', 'Size', 'Qty', 'Total'].map(h => (
              <span key={h} style={{ color: '#555', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 700 }}>{h}</span>
            ))}
          </div>

          {state.cart.map((item, i) => (
            <div key={`${item.product.id}-${item.size}-${item.color}`}
              className="animate-fadeIn"
              style={{ display: 'grid', gridTemplateColumns: '1fr auto auto auto', gap: 16, padding: '24px 0', borderBottom: '1px solid #1a1a1a', alignItems: 'center', animationDelay: `${i * 0.05}s` }}>

              {/* Product */}
              <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                <div style={{ position: 'relative', width: 80, height: 100, flexShrink: 0, overflow: 'hidden', background: 'var(--bb-border)' }}>
                  <Image src={item.product.images[0]} alt={item.product.name} fill style={{ objectFit: 'cover' }} />
                </div>
                <div>
                  <Link href={`/products/${item.product.id}`} style={{ textDecoration: 'none' }}>
                    <h3 style={{ color: 'var(--bb-fg)', fontSize: 14, fontWeight: 700, marginBottom: 4, letterSpacing: '0.02em' }}>{item.product.name}</h3>
                  </Link>
                  <p style={{ color: '#555', fontSize: 12, marginBottom: 4 }}>Color: {item.color}</p>
                  <p style={{ color: 'var(--bb-fg)', fontSize: 14, fontWeight: 700 }}>{formatPrice(item.product.price)}</p>
                  <button
                    onClick={() => { dispatch({ type: 'REMOVE_FROM_CART', id: item.product.id, size: item.size, color: item.color }); showToast('Item removed'); }}
                    style={{ background: 'none', border: 'none', color: '#555', fontSize: 12, cursor: 'pointer', marginTop: 8, padding: 0, textDecoration: 'underline', transition: 'color 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#ff4444')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#555')}
                  >
                    Remove
                  </button>
                </div>
              </div>

              {/* Size */}
              <span style={{ color: 'var(--bb-fg)', fontSize: 13, fontWeight: 600, minWidth: 40, textAlign: 'center' }}>{item.size}</span>

              {/* Qty */}
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <button className="qty-btn" onClick={() => dispatch({ type: 'UPDATE_QTY', id: item.product.id, size: item.size, color: item.color, qty: item.quantity - 1 })}>−</button>
                <div style={{ width: 40, height: 36, border: '1px solid #2a2a2a', borderLeft: 'none', borderRight: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--bb-fg)', fontSize: 14, fontWeight: 700 }}>
                  {item.quantity}
                </div>
                <button className="qty-btn" onClick={() => dispatch({ type: 'UPDATE_QTY', id: item.product.id, size: item.size, color: item.color, qty: item.quantity + 1 })}>+</button>
              </div>

              {/* Total */}
              <span style={{ color: 'var(--bb-fg)', fontSize: 15, fontWeight: 800, minWidth: 80, textAlign: 'right' }}>
                {formatPrice(item.product.price * item.quantity)}
              </span>
            </div>
          ))}

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 24 }}>
            <Link href="/products">
              <button className="btn-outline" style={{ padding: '12px 24px', fontSize: 12 }}>← Continue Shopping</button>
            </Link>
            <button
              onClick={() => { dispatch({ type: 'CLEAR_CART' }); showToast('Cart cleared'); }}
              style={{ background: 'none', border: 'none', color: '#555', fontSize: 12, cursor: 'pointer', textDecoration: 'underline', letterSpacing: '0.05em' }}>
              Clear Cart
            </button>
          </div>
        </div>

        {/* Order summary */}
        <div style={{ background: 'var(--bb-bg-2)', border: '1px solid #1a1a1a', padding: 32, position: 'sticky', top: 80 }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--bb-fg)', marginBottom: 24 }}>
            Order Summary
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#888', fontSize: 14 }}>Subtotal</span>
              <span style={{ color: 'var(--bb-fg)', fontSize: 14, fontWeight: 600 }}>{formatPrice(cartTotal)}</span>
            </div>
            {discount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--bb-accent)', fontSize: 14 }}>Discount (BOLD10)</span>
                <span style={{ color: 'var(--bb-accent)', fontSize: 14, fontWeight: 600 }}>-{formatPrice(discountAmount)}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#888', fontSize: 14 }}>Shipping</span>
              <span style={{ color: shipping === 0 ? 'var(--bb-accent)' : 'var(--bb-fg)', fontSize: 14, fontWeight: 600 }}>
                {shipping === 0 ? 'FREE' : formatPrice(shipping)}
              </span>
            </div>
            {shipping > 0 && (
              <p style={{ color: '#555', fontSize: 12 }}>Add {formatPrice(50000 - cartTotal)} more for free shipping</p>
            )}
          </div>

          <div style={{ height: 1, background: 'var(--bb-border)', marginBottom: 20 }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 28 }}>
            <span style={{ color: 'var(--bb-fg)', fontSize: 16, fontWeight: 800, letterSpacing: '0.05em' }}>TOTAL</span>
            <span style={{ color: 'var(--bb-fg)', fontSize: 20, fontWeight: 900 }}>{formatPrice(total)}</span>
          </div>

          {/* Promo code */}
          {!promoApplied && (
            <div style={{ display: 'flex', gap: 0, marginBottom: 20 }}>
              <input
                type="text"
                placeholder="Promo code"
                value={promoCode}
                onChange={e => setPromoCode(e.target.value)}
                className="bb-input"
                style={{ flex: 1, fontSize: 13 }}
              />
              <button className="btn-primary" onClick={applyPromo} style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                Apply
              </button>
            </div>
          )}

          <button className="btn-primary" style={{ width: '100%', padding: '18px', fontSize: 14 }}>
            Checkout →
          </button>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 20 }}>
            {['VISA', 'MC', 'PAYSTACK'].map(p => (
              <span key={p} style={{ color: '#333', fontSize: 10, letterSpacing: '0.08em', border: '1px solid #1a1a1a', padding: '3px 8px' }}>{p}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
