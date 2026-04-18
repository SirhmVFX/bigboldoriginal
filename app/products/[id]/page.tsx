'use client';

import { useState, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProductById, getRelatedProducts, formatPrice } from '@/lib/products';
import { useStore } from '@/lib/store';
import ProductCard from '@/components/ProductCard';

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const product = getProductById(id);
  if (!product) notFound();

  const related = getRelatedProducts(product);
  const { state, dispatch, showToast } = useStore();
  const isFav = state.favorites.includes(product.id);

  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [activeTab, setActiveTab] = useState<'description' | 'details' | 'reviews'>('description');
  const [sizeError, setSizeError] = useState(false);

  const addToCart = () => {
    if (!selectedSize) { setSizeError(true); return; }
    setSizeError(false);
    dispatch({ type: 'ADD_TO_CART', item: { product, size: selectedSize, color: selectedColor, quantity: qty } });
    showToast(`${product.name} added to cart`);
  };

  const toggleFav = () => {
    dispatch({ type: 'TOGGLE_FAVORITE', id: product.id });
    showToast(isFav ? 'Removed from favourites' : 'Added to favourites ♥');
  };

  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ borderBottom: '1px solid #1a1a1a', padding: '14px 24px' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', gap: 8, alignItems: 'center', color: '#555', fontSize: 12, letterSpacing: '0.08em' }}>
          <Link href="/" style={{ color: '#555', textDecoration: 'none' }}>Home</Link>
          <span>/</span>
          <Link href="/products" style={{ color: '#555', textDecoration: 'none' }}>Products</Link>
          <span>/</span>
          <span style={{ color: 'var(--bb-fg)' }}>{product.name}</span>
        </div>
      </div>

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'start' }}>

          {/* Images */}
          <div>
            {/* Main image */}
            <div style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden', background: 'var(--bb-border)', marginBottom: 8 }}>
              <Image
                src={product.images[activeImg]}
                alt={product.name}
                fill
                style={{ objectFit: 'cover', transition: 'opacity 0.3s' }}
                priority
              />
              {product.isNew && (
                <div style={{ position: 'absolute', top: 16, left: 16, background: 'var(--bb-accent)', color: 'var(--bb-bg)', fontSize: 11, fontWeight: 800, padding: '4px 10px', letterSpacing: '0.1em' }}>NEW</div>
              )}
            </div>
            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div style={{ display: 'flex', gap: 8 }}>
                {product.images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(i)}
                    style={{ position: 'relative', width: 80, aspectRatio: '1', overflow: 'hidden', border: `2px solid ${activeImg === i ? 'var(--bb-accent)' : 'var(--bb-border)'}`, background: 'none', cursor: 'pointer', padding: 0, transition: 'border-color 0.2s' }}>
                    <Image src={img} alt={`View ${i + 1}`} fill style={{ objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product info */}
          <div style={{ position: 'sticky', top: 80 }}>
            <div style={{ marginBottom: 8 }}>
              <span style={{ color: '#555', fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{product.category} / {product.subcategory}</span>
            </div>

            <h1 style={{ fontSize: 'clamp(24px, 3vw, 40px)', fontWeight: 900, letterSpacing: '-0.02em', color: 'var(--bb-fg)', marginBottom: 16, lineHeight: 1.1 }}>
              {product.name}
            </h1>

            {/* Rating */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div style={{ display: 'flex', gap: 3 }}>
                {[1,2,3,4,5].map(s => (
                  <svg key={s} width="14" height="14" viewBox="0 0 24 24" fill={s <= Math.round(product.rating) ? 'var(--bb-accent)' : 'var(--bb-border-2)'}>
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                ))}
              </div>
              <span style={{ color: '#888', fontSize: 13 }}>{product.rating} ({product.reviews} reviews)</span>
            </div>

            {/* Price */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
              <span style={{ fontSize: 32, fontWeight: 900, color: 'var(--bb-fg)' }}>{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <>
                  <span style={{ fontSize: 20, color: '#555', textDecoration: 'line-through' }}>{formatPrice(product.originalPrice)}</span>
                  <span style={{ background: '#ff4444', color: '#fff', fontSize: 11, fontWeight: 800, padding: '3px 8px' }}>
                    -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                  </span>
                </>
              )}
            </div>

            <div style={{ width: '100%', height: 1, background: 'var(--bb-border)', marginBottom: 28 }} />

            {/* Color */}
            <div style={{ marginBottom: 24 }}>
              <p style={{ color: '#888', fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>
                Color: <span style={{ color: 'var(--bb-fg)', fontWeight: 700 }}>{selectedColor}</span>
              </p>
              <div style={{ display: 'flex', gap: 10 }}>
                {product.colors.map(c => (
                  <button key={c} onClick={() => setSelectedColor(c)}
                    style={{
                      width: 32, height: 32,
                      background: c === 'Black' ? 'var(--bb-bg)' : c === 'White' ? 'var(--bb-fg)' : c === 'Cream' ? '#e8e4d9' : c === 'Olive' ? '#4a5240' : c === 'Charcoal' ? 'var(--bb-border-2)' : '#888',
                      border: `2px solid ${selectedColor === c ? 'var(--bb-accent)' : 'var(--bb-border-2)'}`,
                      cursor: 'pointer',
                      transition: 'border-color 0.2s',
                    }}
                    title={c}
                  />
                ))}
              </div>
            </div>

            {/* Size */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <p style={{ color: '#888', fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  Size {selectedSize && <span style={{ color: 'var(--bb-fg)', fontWeight: 700 }}>: {selectedSize}</span>}
                </p>
                <button style={{ background: 'none', border: 'none', color: 'var(--bb-accent)', fontSize: 12, cursor: 'pointer', letterSpacing: '0.05em', textDecoration: 'underline' }}>
                  Size Guide
                </button>
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {product.sizes.map(s => (
                  <button key={s} onClick={() => { setSelectedSize(s); setSizeError(false); }}
                    className={`size-btn ${selectedSize === s ? 'active' : ''}`}>
                    {s}
                  </button>
                ))}
              </div>
              {sizeError && (
                <p style={{ color: '#ff4444', fontSize: 12, marginTop: 8 }}>Please select a size</p>
              )}
            </div>

            {/* Quantity */}
            <div style={{ marginBottom: 28 }}>
              <p style={{ color: '#888', fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>Quantity</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                <button className="qty-btn" onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
                <div style={{ width: 56, height: 36, border: '1px solid #2a2a2a', borderLeft: 'none', borderRight: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--bb-fg)', fontSize: 15, fontWeight: 700 }}>
                  {qty}
                </div>
                <button className="qty-btn" onClick={() => setQty(qty + 1)}>+</button>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
              <button className="btn-primary" onClick={addToCart} style={{ flex: 1, padding: '16px' }}>
                Add to Cart
              </button>
              <button onClick={toggleFav}
                style={{ width: 52, height: 52, border: `1px solid ${isFav ? 'var(--bb-accent)' : 'var(--bb-border-2)'}`, background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'border-color 0.2s' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill={isFav ? 'var(--bb-accent)' : 'none'} stroke={isFav ? 'var(--bb-accent)' : '#888'} strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </button>
            </div>

            <button className="btn-outline" style={{ width: '100%', padding: '16px' }}>
              Buy Now
            </button>

            {/* Trust badges */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginTop: 28, paddingTop: 28, borderTop: '1px solid #1a1a1a' }}>
              {[
                { icon: '🚚', label: 'Free Shipping', sub: 'Over ₦50k' },
                { icon: '↩', label: 'Easy Returns', sub: '14 days' },
                { icon: '✓', label: 'Authentic', sub: 'Guaranteed' },
              ].map(b => (
                <div key={b.label} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 20, marginBottom: 4 }}>{b.icon}</div>
                  <p style={{ color: 'var(--bb-fg)', fontSize: 11, fontWeight: 700, letterSpacing: '0.05em' }}>{b.label}</p>
                  <p style={{ color: '#555', fontSize: 11 }}>{b.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ marginTop: 64, borderTop: '1px solid #1a1a1a' }}>
          <div style={{ display: 'flex', borderBottom: '1px solid #1a1a1a' }}>
            {(['description', 'details', 'reviews'] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                style={{
                  padding: '16px 32px',
                  background: 'none',
                  border: 'none',
                  borderBottom: `2px solid ${activeTab === tab ? 'var(--bb-accent)' : 'transparent'}`,
                  color: activeTab === tab ? 'var(--bb-fg)' : '#555',
                  fontSize: 12,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  marginBottom: -1,
                }}>
                {tab}
              </button>
            ))}
          </div>

          <div style={{ padding: '32px 0' }}>
            {activeTab === 'description' && (
              <p style={{ color: '#aaa', fontSize: 15, lineHeight: 1.9, maxWidth: 640 }}>{product.description}</p>
            )}
            {activeTab === 'details' && (
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {product.details.map((d, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#aaa', fontSize: 14 }}>
                    <span style={{ color: 'var(--bb-accent)', fontWeight: 700 }}>—</span>
                    {d}
                  </li>
                ))}
              </ul>
            )}
            {activeTab === 'reviews' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 32, marginBottom: 32 }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 56, fontWeight: 900, color: 'var(--bb-fg)', lineHeight: 1 }}>{product.rating}</div>
                    <div style={{ display: 'flex', gap: 3, justifyContent: 'center', margin: '8px 0' }}>
                      {[1,2,3,4,5].map(s => (
                        <svg key={s} width="16" height="16" viewBox="0 0 24 24" fill={s <= Math.round(product.rating) ? 'var(--bb-accent)' : 'var(--bb-border-2)'}>
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                        </svg>
                      ))}
                    </div>
                    <p style={{ color: '#555', fontSize: 12 }}>{product.reviews} reviews</p>
                  </div>
                </div>
                <p style={{ color: '#555', fontSize: 14 }}>Reviews coming soon. Be the first to review this product.</p>
              </div>
            )}
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div style={{ marginTop: 64 }}>
            <h2 style={{ fontSize: 'clamp(20px, 3vw, 32px)', fontWeight: 900, letterSpacing: '-0.02em', color: 'var(--bb-fg)', marginBottom: 32 }}>
              YOU MAY ALSO LIKE
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 1, background: 'var(--bb-border)' }}>
              {related.map((p, i) => (
                <div key={p.id} style={{ background: 'var(--bb-bg)' }}>
                  <ProductCard product={p} index={i} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .product-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
