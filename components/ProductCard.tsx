'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Product } from '@/lib/store';
import { useStore } from '@/lib/store';
import { formatPrice } from '@/lib/products';

interface Props {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: Props) {
  const { state, dispatch, showToast } = useStore();
  const [imgIdx, setImgIdx] = useState(0);
  const isFav = state.favorites.includes(product.id);

  const toggleFav = (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch({ type: 'TOGGLE_FAVORITE', id: product.id });
    showToast(isFav ? 'Removed from favourites' : 'Added to favourites ♥');
  };

  const quickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch({
      type: 'ADD_TO_CART',
      item: { product, size: product.sizes[0], color: product.colors[0], quantity: 1 }
    });
    showToast(`${product.name} added to cart`);
  };

  return (
    <div
      className="product-card animate-fadeUp"
      style={{ animationDelay: `${index * 0.08}s`, opacity: 0, background: 'var(--bb-card)', transition: 'background 0.3s' }}
    >
      <Link href={`/products/${product.id}`} style={{ textDecoration: 'none', display: 'block' }}>
        {/* Image */}
        <div
          className="img-zoom"
          style={{ position: 'relative', aspectRatio: '3/4', background: 'var(--bb-bg-3)', overflow: 'hidden' }}
          onMouseEnter={() => product.images[1] && setImgIdx(1)}
          onMouseLeave={() => setImgIdx(0)}
        >
          <Image
            src={product.images[imgIdx]}
            alt={product.name}
            fill
            style={{ objectFit: 'cover' }}
            sizes="(max-width: 768px) 50vw, 25vw"
          />

          {/* Badges */}
          <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {product.isNew && (
              <span style={{ background: 'var(--bb-accent)', color: '#0a0a0a', fontSize: 10, fontWeight: 800, padding: '3px 8px', letterSpacing: '0.1em' }}>NEW</span>
            )}
            {product.isBestSeller && (
              <span style={{ background: 'var(--bb-invert)', color: 'var(--bb-invert-fg)', fontSize: 10, fontWeight: 800, padding: '3px 8px', letterSpacing: '0.1em' }}>BEST SELLER</span>
            )}
            {product.originalPrice && (
              <span style={{ background: '#ff4444', color: '#fff', fontSize: 10, fontWeight: 800, padding: '3px 8px', letterSpacing: '0.1em' }}>SALE</span>
            )}
          </div>

          {/* Overlay actions */}
          <div className="overlay">
            <button
              onClick={quickAdd}
              style={{ background: 'var(--bb-accent)', color: '#0a0a0a', border: 'none', padding: '10px 20px', fontWeight: 700, fontSize: 12, letterSpacing: '0.08em', cursor: 'pointer', textTransform: 'uppercase' }}
            >
              Quick Add
            </button>
          </div>
        </div>

        {/* Info */}
        <div style={{ padding: '16px 16px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
            <div>
              <p style={{ color: 'var(--bb-muted)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>{product.category}</p>
              <h3 style={{ color: 'var(--bb-fg)', fontSize: 14, fontWeight: 700, letterSpacing: '0.02em', lineHeight: 1.3 }}>{product.name}</h3>
            </div>
            <button onClick={toggleFav} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, flexShrink: 0 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill={isFav ? 'var(--bb-accent)' : 'none'} stroke={isFav ? 'var(--bb-accent)' : 'var(--bb-muted)'} strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </button>
          </div>

          {/* Rating */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
            <div style={{ display: 'flex', gap: 2 }}>
              {[1,2,3,4,5].map(s => (
                <svg key={s} width="10" height="10" viewBox="0 0 24 24" fill={s <= Math.round(product.rating) ? 'var(--bb-accent)' : 'var(--bb-border)'}>
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
              ))}
            </div>
            <span style={{ color: 'var(--bb-muted)', fontSize: 11 }}>({product.reviews})</span>
          </div>

          {/* Price */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ color: 'var(--bb-fg)', fontSize: 15, fontWeight: 700 }}>{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span style={{ color: 'var(--bb-muted)', fontSize: 13, textDecoration: 'line-through' }}>{formatPrice(product.originalPrice)}</span>
            )}
          </div>

          {/* Colors */}
          <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
            {product.colors.map(c => (
              <div key={c}
                title={c}
                style={{
                  width: 14, height: 14,
                  background: c === 'Black' ? '#0a0a0a' : c === 'White' ? '#f5f5f0' : c === 'Cream' ? '#e8e4d9' : c === 'Olive' ? '#4a5240' : c === 'Charcoal' ? '#2a2a2a' : '#888',
                  border: '1px solid var(--bb-border)',
                }}
              />
            ))}
          </div>
        </div>
      </Link>
    </div>
  );
}
