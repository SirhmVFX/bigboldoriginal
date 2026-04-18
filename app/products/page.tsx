'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import { PRODUCTS, CATEGORIES, SORT_OPTIONS, formatPrice } from '@/lib/products';

function ProductsContent() {
  const searchParams = useSearchParams();
  const initialFilter = searchParams.get('filter') || 'All';

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('Featured');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    if (initialFilter === 'new') setCategory('All');
  }, [initialFilter]);

  const filtered = useMemo(() => {
    let list = [...PRODUCTS];

    // Search
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tags.some(t => t.includes(q)) ||
        p.description.toLowerCase().includes(q)
      );
    }

    // Category
    if (category !== 'All') {
      list = list.filter(p => p.category === category);
    }

    // Filter param
    if (initialFilter === 'new') list = list.filter(p => p.isNew);
    if (initialFilter === 'sale') list = list.filter(p => p.originalPrice);

    // Price
    list = list.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Sort
    switch (sort) {
      case 'Price: Low to High': list.sort((a, b) => a.price - b.price); break;
      case 'Price: High to Low': list.sort((a, b) => b.price - a.price); break;
      case 'Newest': list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)); break;
      case 'Best Sellers': list.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0)); break;
      case 'Top Rated': list.sort((a, b) => b.rating - a.rating); break;
    }

    return list;
  }, [search, category, sort, priceRange, initialFilter]);

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: '48px 24px' }}>
      {/* Header */}
      <div style={{ marginBottom: 48 }}>
        <div className="tag" style={{ marginBottom: 12 }}>Collection</div>
        <h1 style={{ fontSize: 'clamp(32px, 5vw, 64px)', fontWeight: 900, letterSpacing: '-0.03em', color: 'var(--bb-fg)' }}>
          ALL PRODUCTS
        </h1>
        <p style={{ color: '#555', fontSize: 14, marginTop: 8 }}>{filtered.length} items</p>
      </div>

      {/* Search + Controls */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: 1, minWidth: 240 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2"
            style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }}>
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bb-input"
            style={{ paddingLeft: 44 }}
          />
        </div>

        {/* Sort */}
        <select
          value={sort}
          onChange={e => setSort(e.target.value)}
          className="bb-input"
          style={{ width: 'auto', minWidth: 200, cursor: 'pointer' }}
        >
          {SORT_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
        </select>

        {/* Filter toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="btn-outline"
          style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 8 }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/>
          </svg>
          Filters
        </button>

        {/* View mode */}
        <div style={{ display: 'flex', border: '1px solid #2a2a2a' }}>
          {(['grid', 'list'] as const).map(mode => (
            <button key={mode} onClick={() => setViewMode(mode)}
              style={{ padding: '10px 14px', background: viewMode === mode ? 'var(--bb-accent)' : 'transparent', border: 'none', cursor: 'pointer', color: viewMode === mode ? 'var(--bb-bg)' : '#555', transition: 'all 0.2s' }}>
              {mode === 'grid' ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div style={{ background: 'var(--bb-bg-2)', border: '1px solid #1a1a1a', padding: 24, marginBottom: 24, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 32 }}
          className="animate-fadeIn">
          {/* Categories */}
          <div>
            <h4 style={{ color: 'var(--bb-fg)', fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16, fontWeight: 700 }}>Category</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {CATEGORIES.map(cat => (
                <button key={cat} onClick={() => setCategory(cat)}
                  className={`filter-chip ${category === cat ? 'active' : ''}`}>
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Price range */}
          <div>
            <h4 style={{ color: 'var(--bb-fg)', fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16, fontWeight: 700 }}>Price Range</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input type="range" min={0} max={100000} step={1000} value={priceRange[1]}
                onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
                style={{ accentColor: 'var(--bb-accent)', width: '100%' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#888', fontSize: 13 }}>
                <span>{formatPrice(priceRange[0])}</span>
                <span>{formatPrice(priceRange[1])}</span>
              </div>
            </div>
          </div>

          {/* Quick filters */}
          <div>
            <h4 style={{ color: 'var(--bb-fg)', fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16, fontWeight: 700 }}>Quick Filter</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {['New Arrivals', 'Best Sellers', 'On Sale'].map(f => (
                <button key={f} className="filter-chip"
                  onClick={() => {
                    if (f === 'New Arrivals') setSort('Newest');
                    if (f === 'Best Sellers') setSort('Best Sellers');
                    if (f === 'On Sale') setSort('Featured');
                  }}>
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Reset */}
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button className="btn-outline" style={{ padding: '10px 20px', fontSize: 12 }}
              onClick={() => { setSearch(''); setCategory('All'); setSort('Featured'); setPriceRange([0, 100000]); }}>
              Reset Filters
            </button>
          </div>
        </div>
      )}

      {/* Category chips */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 32, flexWrap: 'wrap' }}>
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setCategory(cat)}
            className={`filter-chip ${category === cat ? 'active' : ''}`}>
            {cat}
          </button>
        ))}
      </div>

      {/* Products grid */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 24px' }}>
          <p style={{ color: '#555', fontSize: 18, marginBottom: 16 }}>No products found</p>
          <button className="btn-outline" onClick={() => { setSearch(''); setCategory('All'); }}>
            Clear Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 1, background: 'var(--bb-border)' }}>
          {filtered.map((p, i) => (
            <div key={p.id} style={{ background: 'var(--bb-bg)' }}>
              <ProductCard product={p} index={i} />
            </div>
          ))}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: 'var(--bb-border)' }}>
          {filtered.map((p, i) => (
            <div key={p.id} style={{ background: 'var(--bb-bg-2)', display: 'grid', gridTemplateColumns: '200px 1fr auto', gap: 24, padding: 20, alignItems: 'center' }}
              className="animate-fadeIn">
              <div style={{ position: 'relative', aspectRatio: '1', overflow: 'hidden', background: 'var(--bb-border)' }}>
                <img src={p.images[0]} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div>
                <p style={{ color: '#555', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>{p.category}</p>
                <h3 style={{ color: 'var(--bb-fg)', fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{p.name}</h3>
                <p style={{ color: '#888', fontSize: 13, lineHeight: 1.6, marginBottom: 12 }}>{p.description.slice(0, 100)}...</p>
                <div style={{ display: 'flex', gap: 3 }}>
                  {[1,2,3,4,5].map(s => (
                    <svg key={s} width="12" height="12" viewBox="0 0 24 24" fill={s <= Math.round(p.rating) ? 'var(--bb-accent)' : 'var(--bb-border-2)'}>
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                  ))}
                </div>
              </div>
              <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-end' }}>
                <span style={{ color: 'var(--bb-fg)', fontSize: 20, fontWeight: 800 }}>{formatPrice(p.price)}</span>
                <a href={`/products/${p.id}`}>
                  <button className="btn-primary" style={{ padding: '10px 24px' }}>View</button>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div style={{ padding: 80, textAlign: 'center', color: '#555' }}>Loading...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
