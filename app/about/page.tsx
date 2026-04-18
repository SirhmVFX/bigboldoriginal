'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useScrollReveal } from '@/lib/useScrollReveal';

export default function AboutPage() {
  useScrollReveal();

  return (
    <div>
      {/* ── HERO ── */}
      <section style={{ position: 'relative', minHeight: '70vh', display: 'flex', alignItems: 'center', overflow: 'hidden', background: 'var(--bb-bg)' }}>
        <div style={{ position: 'absolute', inset: 0 }}>
          <Image src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=1600&q=80" alt="About BIGBOLD" fill style={{ objectFit: 'cover', opacity: 0.2 }} priority />
        </div>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: 'var(--bb-accent)' }} />
        <div style={{ position: 'relative', zIndex: 2, maxWidth: 1400, margin: '0 auto', padding: '80px 24px' }}>
          <div className="tag animate-fadeIn" style={{ marginBottom: 24 }}>Our Story</div>
          <h1 className="animate-slideRight" style={{ fontSize: 'clamp(48px, 8vw, 100px)', fontWeight: 900, letterSpacing: '-0.03em', color: 'var(--bb-fg)', lineHeight: 0.92, opacity: 0 }}>
            MORE THAN<br />A BRAND.<br /><span style={{ color: 'var(--bb-accent)' }}>A LIFESTYLE.</span>
          </h1>
        </div>
      </section>

      {/* ── MISSION ── */}
      <section style={{ maxWidth: 1400, margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
          <div data-animate="slideRight">
            <div className="tag" style={{ marginBottom: 20 }}>The Beginning</div>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 900, letterSpacing: '-0.02em', color: 'var(--bb-fg)', lineHeight: 1, marginBottom: 24 }}>
              WHEN A WEIRD<br />SKETCH TURNED INTO<br /><span style={{ color: 'var(--bb-accent)' }}>STUNNING MERCH.</span>
            </h2>
            <p style={{ color: 'var(--bb-muted)', fontSize: 15, lineHeight: 1.9, marginBottom: 20 }}>
              BIGBOLD ORIGINAL was founded in 2023 with a single, unapologetic belief: that confidence doesn't need to be loud to be felt. It started with a sketch — a weird, imperfect doodle that somehow captured everything we wanted to say.
            </p>
            <p style={{ color: 'var(--bb-muted)', fontSize: 15, lineHeight: 1.9 }}>
              That sketch became a tee. That tee became a movement. Today, BIGBOLD is worn by those who understand that the quietest voice in the room is often the most powerful.
            </p>
          </div>
          <div data-animate="slideLeft" style={{ position: 'relative' }}>
            <div style={{ position: 'relative', aspectRatio: '4/5', overflow: 'hidden' }}>
              <Image src="https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&q=80" alt="BIGBOLD Origin" fill style={{ objectFit: 'cover' }} />
            </div>
            <div style={{ position: 'absolute', bottom: -16, left: -16, background: 'var(--bb-accent)', padding: '20px 24px' }}>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', color: 'var(--bb-accent-fg)', textTransform: 'uppercase' }}>Founded</p>
              <p style={{ fontSize: 32, fontWeight: 900, color: 'var(--bb-accent-fg)', lineHeight: 1 }}>2023</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section style={{ background: 'var(--bb-bg-2)', borderTop: '1px solid var(--bb-border)', borderBottom: '1px solid var(--bb-border)', padding: '80px 24px' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <div data-animate="fadeUp" style={{ textAlign: 'center', marginBottom: 56 }}>
            <div className="tag" style={{ marginBottom: 12 }}>What We Stand For</div>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 900, letterSpacing: '-0.02em', color: 'var(--bb-fg)' }}>OUR VALUES</h2>
          </div>
          <div data-stagger style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 1, background: 'var(--bb-border)' }}>
            {[
              { num: '01', title: 'Confidence', desc: 'We design for those who don\'t need validation. Every piece is built to make you feel powerful without trying.' },
              { num: '02', title: 'Simplicity',  desc: 'Sophistication doesn\'t require complexity. We strip away the noise and let quality speak for itself.' },
              { num: '03', title: 'Authenticity',desc: 'Made in Nigeria, for the world. We celebrate our roots and wear them with pride in every stitch.' },
              { num: '04', title: 'Quality',     desc: 'We refuse to compromise. Every fabric, every print, every detail is held to the highest standard.' },
            ].map((v, i) => (
              <div key={i} style={{ background: 'var(--bb-bg)', padding: 40 }}>
                <div style={{ fontSize: 48, fontWeight: 900, color: 'var(--bb-border)', letterSpacing: '-0.03em', marginBottom: 16 }}>{v.num}</div>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: 'var(--bb-fg)', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 12 }}>{v.title}</h3>
                <p style={{ color: 'var(--bb-muted)', fontSize: 14, lineHeight: 1.8 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── QUOTE ── */}
      <section data-animate="fadeIn" style={{ padding: '80px 24px', textAlign: 'center', background: 'var(--bb-bg)' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{ fontSize: 80, color: 'var(--bb-border)', fontWeight: 900, lineHeight: 0.5, marginBottom: 24 }}>"</div>
          <blockquote style={{ fontSize: 'clamp(20px, 3vw, 32px)', fontWeight: 700, color: 'var(--bb-fg)', lineHeight: 1.4, letterSpacing: '-0.01em', marginBottom: 24 }}>
            In a world full of noise, sometimes the quietest voice is the loudest.
          </blockquote>
          <p style={{ color: 'var(--bb-subtle)', fontSize: 13, letterSpacing: '0.15em', textTransform: 'uppercase' }}>— BIGBOLD ORIGINAL</p>
        </div>
      </section>

      {/* ── WHY BIGBOLD ── */}
      <section style={{ background: 'var(--bb-bg-2)', borderTop: '1px solid var(--bb-border)', borderBottom: '1px solid var(--bb-border)' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '64px 24px 0' }}>
          <div data-animate="fadeUp" style={{ marginBottom: 48 }}>
            <p style={{ fontSize: 'clamp(22px, 4vw, 36px)', fontWeight: 900, color: 'var(--bb-fg)', letterSpacing: '-0.02em' }}>
              why <span style={{ fontStyle: 'italic', fontWeight: 400 }}>BIGBOLD?</span>
            </p>
          </div>
        </div>
        <div className="why-grid" style={{ maxWidth: 1400, margin: '0 auto', borderTop: '1px solid var(--bb-border)' }}>
          {[
            { num: '01', desc: 'Get your order delivered quickly, straight to your door.',                          title: 'FAST SHIPPING',     sub: '3–5 Business Days' },
            { num: '02', desc: 'Return your items hassle-free. Our flexible policy makes it simple.',               title: 'EASY RETURNS',      sub: '14 Days From Delivery' },
            { num: '03', desc: 'Pay for your order with confidence. Your details are always protected.',            title: 'SECURE PAYMENTS',   sub: 'Bank-Grade SSL Protection' },
            { num: '04', desc: 'Get the help you need, fast. Our dedicated team is here for you.',                  title: 'CUSTOMER SUPPORT',  sub: 'hello@bigboldoriginal.com' },
          ].map((item, i) => (
            <div key={i} className="why-item" style={{ background: 'var(--bb-bg-2)' }}>
              <span className="why-num">{item.num}</span>
              <p className="why-desc">{item.desc}</p>
              <p className="why-title">{item.title}</p>
              <p className="why-sub">{item.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── PROCESS ── */}
      <section style={{ maxWidth: 1400, margin: '0 auto', padding: '80px 24px' }}>
        <div data-animate="fadeUp" style={{ textAlign: 'center', marginBottom: 56 }}>
          <div className="tag" style={{ marginBottom: 12 }}>The Process</div>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 900, letterSpacing: '-0.02em', color: 'var(--bb-fg)' }}>HOW WE BUILD</h2>
        </div>
        <div data-stagger style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 0, background: 'var(--bb-border)' }}>
          {[
            { step: '01', title: 'Concept', desc: 'Every piece starts as an idea — a feeling, a word, a sketch on paper.' },
            { step: '02', title: 'Design',  desc: 'We refine until it\'s perfect. No shortcuts, no compromises.' },
            { step: '03', title: 'Source',  desc: 'Premium fabrics, locally and globally sourced for maximum quality.' },
            { step: '04', title: 'Produce', desc: 'Made in Nigeria with care, precision, and pride.' },
            { step: '05', title: 'Deliver', desc: 'Packaged with intention and delivered to your door.' },
          ].map((s, i) => (
            <div key={i} style={{ background: 'var(--bb-bg-2)', padding: 32, borderRight: i < 4 ? '1px solid var(--bb-border)' : 'none' }}>
              <div style={{ color: 'var(--bb-accent)', fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', marginBottom: 12 }}>STEP {s.step}</div>
              <h3 style={{ color: 'var(--bb-fg)', fontSize: 18, fontWeight: 800, marginBottom: 10 }}>{s.title}</h3>
              <p style={{ color: 'var(--bb-muted)', fontSize: 13, lineHeight: 1.7 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── GALLERY ── */}
      <section data-animate="fadeIn" style={{ padding: '0 24px 80px', maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 2, height: 500 }}>
          {[
            'https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=800&q=80',
            'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80',
            'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&q=80',
            'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&q=80',
            'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=600&q=80',
          ].map((src, i) => (
            <div key={i} className="img-zoom" style={{ position: 'relative', overflow: 'hidden', background: 'var(--bb-border)', gridRow: i === 0 ? 'span 2' : 'auto' }}>
              <Image src={src} alt={`Gallery ${i}`} fill style={{ objectFit: 'cover' }} />
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section data-animate="scaleUp" style={{ background: 'var(--bb-accent)', padding: '64px 24px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(28px, 5vw, 60px)', fontWeight: 900, color: 'var(--bb-accent-fg)', letterSpacing: '-0.03em', marginBottom: 24 }}>JOIN THE MOVEMENT</h2>
        <p style={{ color: 'var(--bb-accent-fg)', fontSize: 16, marginBottom: 32, opacity: 0.7 }}>Wear your confidence. Live the lifestyle.</p>
        <Link href="/products">
          <button style={{ background: 'var(--bb-bg)', color: 'var(--bb-accent)', border: 'none', padding: '16px 48px', fontWeight: 800, fontSize: 14, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer' }}>
            Shop Now →
          </button>
        </Link>
      </section>
    </div>
  );
}
