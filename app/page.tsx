'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import ProductCard from '@/components/ProductCard';
import { PRODUCTS } from '@/lib/products';
import { useScrollReveal } from '@/lib/useScrollReveal';

function useCountUp(target: number, active: boolean, duration = 1800) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    let step = 0;
    const steps = 60;
    const t = setInterval(() => {
      step++;
      setVal(Math.round(target * (step / steps)));
      if (step >= steps) clearInterval(t);
    }, duration / steps);
    return () => clearInterval(t);
  }, [active, target, duration]);
  return val;
}

const HERO_WORDS = ['CONFIDENCE', 'SIMPLICITY', 'LIFESTYLE', 'BOLDNESS'];

export default function HomePage() {
  useScrollReveal();

  const [wordIdx, setWordIdx] = useState(0);
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsVisible, setStatsVisible] = useState(false);

  const products  = useCountUp(50,   statsVisible);
  const customers = useCountUp(2300, statsVisible);

  useEffect(() => {
    const t = setInterval(() => setWordIdx(i => (i + 1) % HERO_WORDS.length), 2200);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStatsVisible(true); }, { threshold: 0.2 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const featured    = PRODUCTS.filter(p => p.isBestSeller).slice(0, 4);
  const newArrivals = PRODUCTS.filter(p => p.isNew).slice(0, 4);

  return (
    <div>
      {/* ── HERO ── */}
      <section className="grid-bg noise" style={{ position: 'relative', minHeight: '95vh', display: 'flex', alignItems: 'center', overflow: 'hidden', background: 'var(--bb-bg)' }}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <Image src="https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=1600&q=80" alt="BIGBOLD Hero" fill style={{ objectFit: 'cover', opacity: 0.18 }} priority />
        </div>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: 'var(--bb-accent)', zIndex: 2 }} />

        <div style={{ position: 'relative', zIndex: 2, maxWidth: 1400, margin: '0 auto', padding: '80px 24px', width: '100%' }}>
          <div style={{ maxWidth: 800 }}>
            <div className="tag animate-fadeIn" style={{ marginBottom: 28 }}>EST. 2023 — NIGERIA</div>
            <h1 style={{ fontSize: 'clamp(52px, 10vw, 120px)', fontWeight: 900, lineHeight: 0.92, letterSpacing: '-0.03em', marginBottom: 32 }}>
              <span className="animate-slideRight"        style={{ display: 'block', color: 'var(--bb-fg)',     opacity: 0 }}>BIG</span>
              <span className="animate-slideRight delay-200" style={{ display: 'block', color: 'var(--bb-accent)', opacity: 0 }}>BOLD</span>
              <span className="animate-slideRight delay-400" style={{ display: 'block', color: 'var(--bb-fg)', opacity: 0, fontSize: 'clamp(18px, 3vw, 36px)', fontWeight: 400, letterSpacing: '0.15em', marginTop: 16 }}>
                {HERO_WORDS[wordIdx]}
              </span>
            </h1>
            <p className="animate-fadeUp delay-500" style={{ color: 'var(--bb-muted)', fontSize: 'clamp(14px, 2vw, 18px)', lineHeight: 1.7, maxWidth: 480, marginBottom: 40, opacity: 0 }}>
              Where sophistication meets unapologetic simplicity. More than a brand — a lifestyle built for those who move with quiet confidence.
            </p>
            <div className="animate-fadeUp delay-600" style={{ display: 'flex', gap: 16, flexWrap: 'wrap', opacity: 0 }}>
              <Link href="/products"><button className="btn-primary">Shop Now</button></Link>
              <Link href="/about"><button className="btn-outline">Our Story</button></Link>
            </div>
          </div>

          {/* Floating badge */}
          <div className="animate-float hero-badge" style={{ position: 'absolute', right: '8%', top: '8%', transform: 'translateY(-50%)', width: 540, height: 540,  alignItems: 'center', justifyContent: 'center' }}>
            <div className="animate-spin-slow" style={{ position: 'absolute', inset: -12 }}>
              <svg viewBox="0 0 120 120" style={{ width: '100%', height: '100%' }}>
                <path id="circle" d="M 60,60 m -45,0 a 45,45 0 1,1 90,0 a 45,45 0 1,1 -90,0" fill="none"/>
                <text fontSize="10" fill="var(--bb-accent)" letterSpacing="3" fontWeight="600">
                  <textPath href="#circle">BIGBOLD ORIGINAL · EST 2023 · </textPath>
                </text>
              </svg>
            </div>
            <span style={{ fontSize: 28, fontWeight: 900, color: 'var(--bb-accent)' }}>B</span>
          </div>
        </div>

        <div style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <span style={{ color: 'var(--bb-subtle)', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase' }}>Scroll</span>
          <div style={{ width: 1, height: 40, background: 'linear-gradient(to bottom, var(--bb-accent), transparent)' }} />
        </div>
      </section>

      {/* ── TICKER ── */}
      <div style={{ background: 'var(--bb-accent)', padding: '14px 0', overflow: 'hidden' }}>
        <div className="ticker-inner" style={{ color: 'var(--bb-accent-fg)', fontWeight: 800, fontSize: 13, letterSpacing: '0.12em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
          {Array(8).fill(null).map((_, i) => (
            <span key={i} style={{ marginRight: 48 }}>
              BIGBOLD ORIGINAL &nbsp;·&nbsp; CONFIDENCE SIMPLIFIED &nbsp;·&nbsp; MORE THAN A BRAND &nbsp;·&nbsp; A LIFESTYLE &nbsp;·&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* ── STATS ── */}
      <div ref={statsRef} style={{ background: 'var(--bb-bg-2)', borderBottom: '1px solid var(--bb-border)' }}>
        <div data-stagger className="stats-grid" style={{ maxWidth: 1400, margin: '0 auto', padding: '48px 24px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
          {[
            { value: `${products}+`,           label: 'Products' },
            { value: `${customers.toLocaleString()}+`, label: 'Customers' },
            { value: statsVisible ? '1+' : '0+', label: 'Year Strong' },
            { value: '100%',                   label: 'Made in Nigeria' },
          ].map((stat, i) => (
            <div key={i} style={{ textAlign: 'center', padding: '24px', borderRight: i < 3 ? '1px solid var(--bb-border)' : 'none' }}>
              <div style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 900, color: 'var(--bb-fg)', letterSpacing: '-0.02em' }}>{stat.value}</div>
              <div style={{ color: 'var(--bb-muted)', fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 6 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── WHY BIGBOLD ── */}
      <section style={{ borderBottom: '1px solid var(--bb-border)' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '64px 24px 0' }}>
          <div data-animate="fadeUp" style={{ marginBottom: 48 }}>
            <p style={{ fontSize: 'clamp(22px, 4vw, 36px)', fontWeight: 900, color: 'var(--bb-fg)', letterSpacing: '-0.02em' }}>
              why <span style={{ fontStyle: 'italic', fontWeight: 400 }}>BIGBOLD?</span>
            </p>
          </div>
        </div>

        <div className="why-grid" style={{ maxWidth: 1400, margin: '0 auto', borderTop: '1px solid var(--bb-border)' }}>
          {[
            {
              num: '01',
              desc: 'Get your order delivered quickly, straight to your door.',
              title: 'FAST SHIPPING',
              sub: '3–5 Business Days',
            },
            {
              num: '02',
              desc: 'Return your items hassle-free. Our flexible policy makes it simple.',
              title: 'EASY RETURNS',
              sub: '14 Days From Delivery',
            },
            {
              num: '03',
              desc: 'Pay for your order with confidence. Your details are always protected.',
              title: 'SECURE PAYMENTS',
              sub: 'Bank-Grade SSL Protection',
            },
            {
              num: '04',
              desc: 'Get the help you need, fast. Our dedicated team is here for you.',
              title: 'CUSTOMER SUPPORT',
              sub: 'hello@bigboldoriginal.com',
            },
          ].map((item, i) => (
            <div key={i} className="why-item">
              <span className="why-num">{item.num}</span>
              <p className="why-desc">{item.desc}</p>
              <p className="why-title">{item.title}</p>
              <p className="why-sub">{item.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── EDITORIAL SPLIT ── */}
      <section style={{ position: 'relative', overflow: 'hidden', borderBottom: '1px solid var(--bb-border)' }}>
        <div className="editorial-split" style={{ display: 'grid', gridTemplateColumns: '1fr 380px' }}>
          {/* Left — big photo + headline */}
          <div className="editorial-photo" data-animate="fadeIn" style={{ position: 'relative', minHeight: 560, overflow: 'hidden' }}>
            <Image
              src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=1200&q=85"
              alt="Wear the lifestyle"
              fill
              style={{ objectFit: 'cover', objectPosition: 'center top' }}
            />
            {/* dark gradient overlay */}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.18) 55%, transparent 100%)' }} />

            {/* Text overlay */}
            <div data-animate="fadeUp" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '40px 48px' }}>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', marginBottom: 14 }}>
                DRESS THE UNCONVENTIONAL
              </p>
              <h2 style={{
                fontSize: 'clamp(48px, 7vw, 88px)',
                fontWeight: 900,
                color: '#ffffff',
                letterSpacing: '-0.03em',
                lineHeight: 0.9,
                textTransform: 'uppercase',
              }}>
                WEAR THE<br />
                <span style={{ fontStyle: 'italic', fontWeight: 400 }}>LIFESTYLE</span>
              </h2>
            </div>

            {/* Shop Now bar pinned to bottom-right */}
            <Link href="/products" style={{ textDecoration: 'none' }}>
              <div style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                background: 'var(--bb-fg)',
                color: 'var(--bb-bg)',
                padding: '20px 36px',
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--bb-accent)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'var(--bb-fg)')}
              >
                <span style={{ fontSize: 18, fontWeight: 900, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'inherit' }}>SHOP NOW</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </div>
            </Link>
          </div>

          {/* Right — product stack */}
          <div className="editorial-sidebar" data-animate="slideLeft" style={{ background: 'var(--bb-bg-2)', borderLeft: '1px solid var(--bb-border)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {PRODUCTS.slice(0, 4).map((product, i) => (
              <Link key={product.id} href={`/products/${product.id}`} style={{ textDecoration: 'none' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 20,
                    padding: '20px 24px',
                    borderBottom: '1px solid var(--bb-border)',
                    background: 'var(--bb-bg-2)',
                    transition: 'background 0.2s',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--bb-bg-3)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'var(--bb-bg-2)')}
                >
                  {/* Product image */}
                  <div style={{ position: 'relative', width: 90, height: 110, flexShrink: 0, overflow: 'hidden', background: 'var(--bb-bg-3)' }}>
                    <Image src={product.images[0]} alt={product.name} fill style={{ objectFit: 'cover' }} sizes="90px" />
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ color: 'var(--bb-muted)', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 4 }}>{product.category}</p>
                    <p style={{ color: 'var(--bb-fg)', fontSize: 14, fontWeight: 700, lineHeight: 1.3, marginBottom: 8, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.name}</p>
                    <p style={{ color: 'var(--bb-fg)', fontSize: 15, fontWeight: 900 }}>
                      ₦{product.price.toLocaleString()}
                    </p>
                  </div>

                  {/* Arrow */}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--bb-muted)" strokeWidth="2" style={{ flexShrink: 0 }}>
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </div>
              </Link>
            ))}

            {/* View all */}
            <Link href="/products" style={{ textDecoration: 'none', marginTop: 'auto' }}>
              <div style={{
                padding: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'var(--bb-fg)',
                color: 'var(--bb-bg)',
                cursor: 'pointer',
                transition: 'opacity 0.2s',
              }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              >
                <span style={{ fontSize: 13, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' }}>View All Products</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </div>
            </Link>
          </div>
        </div>

        {/* Mobile responsive override */}
        <style>{`
          @media (max-width: 768px) {
            .editorial-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </section>

      {/* ── FEATURED PRODUCTS ── */}
      <section style={{ padding: '80px 24px', maxWidth: 1400, margin: '0 auto' }}>
        <div data-animate="fadeUp" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48 }}>
          <div>
            <div className="tag" style={{ marginBottom: 12 }}>Best Sellers</div>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 900, letterSpacing: '-0.02em', color: 'var(--bb-fg)' }}>THE ESSENTIALS</h2>
          </div>
          <Link href="/products" style={{ textDecoration: 'none' }}><button className="btn-accent-outline">View All</button></Link>
        </div>
        <div data-stagger className="product-grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, background: 'var(--bb-border)' }}>
          {featured.map((p, i) => (
            <div key={p.id} style={{ background: 'var(--bb-bg)' }}>
              <ProductCard product={p} index={i} />
            </div>
          ))}
        </div>
      </section>

      {/* ── PROMO BANNERS ── */}
      <section style={{ padding: '0 24px 80px', maxWidth: 1400, margin: '0 auto' }}>
        <div className="promo-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: 'var(--bb-border)' }}>
          <div data-animate="slideRight" style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden', background: '#111' }}>
            <Image src="https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&q=80" alt="New Arrivals" fill style={{ objectFit: 'cover', opacity: 0.5 }} />
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 32 }}>
              <div className="tag" style={{ marginBottom: 12, width: 'fit-content' }}>New Drop</div>
              <h3 style={{ fontSize: 'clamp(20px, 3vw, 36px)', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.02em', marginBottom: 16 }}>NEW ARRIVALS<br />ARE HERE</h3>
              <Link href="/products?filter=new"><button className="btn-primary">Shop New</button></Link>
            </div>
          </div>
          <div data-animate="slideLeft" style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden', background: 'var(--bb-accent)', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 40 }}>
            <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--bb-accent-fg)', marginBottom: 12 }}>Limited Time</p>
            <h3 style={{ fontSize: 'clamp(24px, 3.5vw, 48px)', fontWeight: 900, color: 'var(--bb-accent-fg)', letterSpacing: '-0.03em', lineHeight: 0.95, marginBottom: 20 }}>
              UP TO<br />20% OFF<br />SELECTED
            </h3>
            <Link href="/products?filter=sale">
              <button style={{ background: 'var(--bb-bg)', color: 'var(--bb-accent)', border: 'none', padding: '14px 32px', fontWeight: 700, fontSize: 13, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer' }}>Shop Sale</button>
            </Link>
          </div>
        </div>

        {/* Full-width promo */}
        <div className="promo-fullwidth" data-animate="fadeUp" style={{ marginTop: 1, position: 'relative', height: 200, overflow: 'hidden', background: 'var(--bb-bg-2)', border: '1px solid var(--bb-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 48px' }}>
          <div>
            <p style={{ color: 'var(--bb-muted)', fontSize: 12, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 8 }}>Free Shipping</p>
            <h3 style={{ fontSize: 'clamp(20px, 3vw, 36px)', fontWeight: 900, color: 'var(--bb-fg)' }}>
              ORDERS OVER <span style={{ color: 'var(--bb-accent)' }}>₦50,000</span>
            </h3>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ color: 'var(--bb-muted)', fontSize: 12, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 8 }}>Use Code</p>
            <div style={{ border: '1px solid var(--bb-accent)', padding: '12px 24px', display: 'inline-block' }}>
              <span style={{ color: 'var(--bb-accent)', fontSize: 24, fontWeight: 900, letterSpacing: '0.1em' }}>BOLD10</span>
            </div>
            <p style={{ color: 'var(--bb-muted)', fontSize: 11, marginTop: 8 }}>10% off your first order</p>
          </div>
        </div>
      </section>

      {/* ── NEW ARRIVALS ── */}
      <section style={{ padding: '0 24px 80px', maxWidth: 1400, margin: '0 auto' }}>
        <div data-animate="fadeUp" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48 }}>
          <div>
            <div className="tag" style={{ marginBottom: 12 }}>Just Dropped</div>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 900, letterSpacing: '-0.02em', color: 'var(--bb-fg)' }}>NEW ARRIVALS</h2>
          </div>
          <Link href="/products?filter=new" style={{ textDecoration: 'none' }}><button className="btn-accent-outline">See All New</button></Link>
        </div>
        <div data-stagger className="product-grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, background: 'var(--bb-border)' }}>
          {newArrivals.map((p, i) => (
            <div key={p.id} style={{ background: 'var(--bb-bg)' }}>
              <ProductCard product={p} index={i} />
            </div>
          ))}
        </div>
      </section>

      {/* ── ABOUT STRIP ── */}
      <section style={{ background: 'var(--bb-bg-2)', borderTop: '1px solid var(--bb-border)', borderBottom: '1px solid var(--bb-border)' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '80px 24px' }}>
          <div className="about-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
          <div data-animate="slideRight">
            <div className="tag" style={{ marginBottom: 20 }}>Our Story</div>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: 900, letterSpacing: '-0.02em', color: 'var(--bb-fg)', lineHeight: 1, marginBottom: 24 }}>
              IN A WORLD FULL<br />OF NOISE, WE CHOOSE<br /><span style={{ color: 'var(--bb-accent)' }}>QUIET CONFIDENCE.</span>
            </h2>
            <p style={{ color: 'var(--bb-muted)', fontSize: 15, lineHeight: 1.8, marginBottom: 32 }}>
              BIGBOLD was born in 2023 from a simple belief: that true style doesn't shout. It whispers. We create pieces for those who understand that confidence is the quietest — and loudest — statement you can make.
            </p>
            <Link href="/about"><button className="btn-outline">Read Our Story</button></Link>
          </div>
          <div data-animate="slideLeft" style={{ position: 'relative' }}>
            <div style={{ position: 'relative', aspectRatio: '4/5', overflow: 'hidden' }}>
              <Image src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&q=80" alt="BIGBOLD Story" fill style={{ objectFit: 'cover' }} />
            </div>
            <div style={{ position: 'absolute', bottom: -12, right: -12, width: 80, height: 80, border: '3px solid var(--bb-accent)', zIndex: 2 }} />
          </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ padding: '80px 24px', maxWidth: 1400, margin: '0 auto' }}>
        <div data-animate="fadeUp" style={{ textAlign: 'center', marginBottom: 56 }}>
          <div className="tag" style={{ marginBottom: 12 }}>Reviews</div>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 900, letterSpacing: '-0.02em', color: 'var(--bb-fg)' }}>WHAT THEY SAY</h2>
        </div>
        <div data-stagger style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 1, background: 'var(--bb-border)' }}>
          {[
            { name: 'Adaeze O.', location: 'Lagos',         text: 'BIGBOLD is not just clothing, it\'s a whole vibe. The quality is unmatched and the fit is perfect every time.', rating: 5 },
            { name: 'Emeka T.',  location: 'Abuja',         text: 'I\'ve been wearing BIGBOLD since day one. The Quiet Confidence Hoodie is my most-worn piece. Worth every naira.', rating: 5 },
            { name: 'Chisom A.', location: 'Port Harcourt', text: 'Finally a Nigerian brand that gets it. The attention to detail, the quality, the aesthetic — all 10/10.', rating: 5 },
          ].map((review, i) => (
            <div key={i} style={{ background: 'var(--bb-bg-2)', padding: 32 }}>
              <div style={{ display: 'flex', gap: 3, marginBottom: 16 }}>
                {[1,2,3,4,5].map(s => (
                  <svg key={s} width="14" height="14" viewBox="0 0 24 24" fill={s <= review.rating ? 'var(--bb-fg)' : 'var(--bb-border-2)'}>
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                ))}
              </div>
              <p style={{ color: 'var(--bb-muted)', fontSize: 14, lineHeight: 1.8, marginBottom: 20, fontStyle: 'italic' }}>&ldquo;{review.text}&rdquo;</p>
              <p style={{ color: 'var(--bb-fg)', fontSize: 13, fontWeight: 700 }}>{review.name}</p>
              <p style={{ color: 'var(--bb-subtle)', fontSize: 12 }}>{review.location}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── REWARDS ── */}
      <section style={{ background: 'var(--bb-fg)', overflow: 'hidden', position: 'relative' }}>
        {/* Subtle grid texture */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '48px 48px', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '80px 24px', position: 'relative', zIndex: 1 }}>
          {/* Header */}
          <div data-animate="fadeUp" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 64, flexWrap: 'wrap', gap: 20 }}>
            <div>
              <div style={{ display: 'inline-block', padding: '4px 12px', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.5)', fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 16 }}>
                Member Rewards
              </div>
              <h2 style={{ fontSize: 'clamp(28px, 5vw, 60px)', fontWeight: 900, color: 'var(--bb-bg)', letterSpacing: '-0.03em', lineHeight: 0.95 }}>
                SPEND MORE.<br />SAVE MORE.
              </h2>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, lineHeight: 1.7, maxWidth: 320 }}>
              Every purchase moves you closer to a reward tier. Unlock exclusive discounts that apply automatically to every order after.
            </p>
          </div>

          {/* Cards */}
          <div data-stagger style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: 'rgba(255,255,255,0.08)' }} className="rewards-grid">
            {[
              {
                tier: 'BOLD',
                range: '₦50,000 – ₦100,000',
                discount: '2%',
                label: 'off every purchase',
                desc: 'Your first step into the BIGBOLD family. Spend between ₦50k and ₦100k in a single order and unlock the Bold Member card.',
                cardBg: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
                cardAccent: 'rgba(255,255,255,0.15)',
                badge: 'ENTRY',
              },
              {
                tier: 'ELITE',
                range: '₦200,000 – ₦990,000',
                discount: '10%',
                label: 'off every purchase',
                desc: 'For those who move with intention. A single order between ₦200k and ₦990k earns you the Elite Member card.',
                cardBg: 'linear-gradient(135deg, #1c1c1c 0%, #3a3a3a 60%, #1c1c1c 100%)',
                cardAccent: 'rgba(255,255,255,0.25)',
                badge: 'POPULAR',
              },
              {
                tier: 'GOLD',
                range: '₦1,000,000+',
                discount: '5%',
                label: 'off every purchase',
                desc: 'The pinnacle of the BIGBOLD experience. Spend over ₦1 million in a single order and join the Gold tier — for life.',
                cardBg: 'linear-gradient(135deg, #2a2200 0%, #5a4800 50%, #2a2200 100%)',
                cardAccent: 'rgba(255,215,0,0.3)',
                badge: 'EXCLUSIVE',
              },
            ].map((card, i) => (
              <div key={i} style={{ background: 'var(--bb-fg)', padding: '40px 36px', display: 'flex', flexDirection: 'column', gap: 0 }}>
                {/* Badge */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
                  <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase' }}>{card.badge}</span>
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase' }}>{card.range}</span>
                </div>

                {/* Physical card mockup */}
                <div style={{
                  background: card.cardBg,
                  border: `1px solid ${card.cardAccent}`,
                  padding: '24px 20px',
                  marginBottom: 32,
                  position: 'relative',
                  overflow: 'hidden',
                  aspectRatio: '1.586 / 1',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}>
                  {/* Shine */}
                  <div style={{ position: 'absolute', top: -40, right: -40, width: 120, height: 120, background: card.cardAccent, borderRadius: '50%', filter: 'blur(40px)' }} />

                  {/* Top row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
                    <div>
                      <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', marginBottom: 2 }}>BIGBOLD</p>
                      <p style={{ fontSize: 13, fontWeight: 900, color: '#ffffff', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{card.tier}</p>
                    </div>
                    {/* Chip */}
                    <div style={{ width: 28, height: 20, background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, padding: 3 }}>
                      {[0,1,2,3].map(j => <div key={j} style={{ background: 'rgba(255,255,255,0.2)' }} />)}
                    </div>
                  </div>

                  {/* Discount */}
                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <p style={{ fontSize: 'clamp(28px, 4vw, 36px)', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.02em', lineHeight: 1 }}>{card.discount}</p>
                    <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 2 }}>{card.label}</p>
                  </div>

                  {/* Bottom */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', position: 'relative', zIndex: 1 }}>
                    <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.15em' }}>•••• •••• •••• 2025</p>
                    <p style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>MEMBER</p>
                  </div>
                </div>

                {/* Tier name */}
                <h3 style={{ fontSize: 22, fontWeight: 900, color: 'var(--bb-bg)', letterSpacing: '-0.01em', marginBottom: 12, textTransform: 'uppercase' }}>
                  {card.tier} MEMBER
                </h3>

                {/* Description */}
                <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, lineHeight: 1.8, marginBottom: 24, flex: 1 }}>
                  {card.desc}
                </p>

                {/* Spend threshold */}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Spend</span>
                  <span style={{ color: 'var(--bb-bg)', fontSize: 13, fontWeight: 800 }}>{card.range}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Footer note */}
          <div data-animate="fadeUp" style={{ marginTop: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, lineHeight: 1.7, maxWidth: 480 }}>
              Discounts are applied automatically on your next order once your tier is activated. Tiers are based on a single qualifying order, not cumulative spend.
            </p>
            <Link href="/products">
              <button style={{ background: 'var(--bb-bg)', color: 'var(--bb-fg)', border: 'none', padding: '14px 32px', fontWeight: 800, fontSize: 13, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer', transition: 'opacity 0.2s', whiteSpace: 'nowrap' }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
                Start Shopping →
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── INSTAGRAM GRID ── */}
      <section style={{ padding: '0 24px 80px', maxWidth: 1400, margin: '0 auto' }}>
        <div data-animate="fadeUp" style={{ textAlign: 'center', marginBottom: 40 }}>
          <div className="tag" style={{ marginBottom: 12 }}>@bigboldoriginal_</div>
          <h2 style={{ fontSize: 'clamp(24px, 3vw, 40px)', fontWeight: 900, letterSpacing: '-0.02em', color: 'var(--bb-fg)' }}>FOLLOW THE MOVEMENT</h2>
        </div>
        <div data-stagger className="insta-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 2 }}>
          {[
            'https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=400&q=80',
            'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400&q=80',
            'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80',
            'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=400&q=80',
            'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400&q=80',
            'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=400&q=80',
          ].map((src, i) => (
            <div key={i} className="img-zoom" style={{ position: 'relative', aspectRatio: '1', overflow: 'hidden', background: 'var(--bb-border)' }}>
              <Image src={src} alt={`Instagram ${i + 1}`} fill style={{ objectFit: 'cover' }} />
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA STRIP ── */}
      <section data-animate="scaleUp" style={{ background: 'var(--bb-accent)', padding: '64px 24px', textAlign: 'center' }}>
        <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--bb-accent-fg)', marginBottom: 12 }}>Ready to be bold?</p>
        <h2 style={{ fontSize: 'clamp(32px, 6vw, 72px)', fontWeight: 900, color: 'var(--bb-accent-fg)', letterSpacing: '-0.03em', lineHeight: 0.95, marginBottom: 32 }}>
          SHOP THE<br />COLLECTION
        </h2>
        <Link href="/products">
          <button style={{ background: 'var(--bb-bg)', color: 'var(--bb-accent)', border: 'none', padding: '16px 48px', fontWeight: 800, fontSize: 14, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', transition: 'transform 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-3px)')}
            onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}>
            Shop Now →
          </button>
        </Link>
      </section>
    </div>
  );
}
