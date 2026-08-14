'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useScrollReveal } from '@/lib/useScrollReveal';
import { useSite } from '@/lib/site';

export default function AboutPage() {
  useScrollReveal();
  const { about, homepage: hp, settings } = useSite();

  const values = about?.values ?? [];
  const processSteps = about?.processSteps ?? [];
  const gallery = about?.galleryImages ?? [];
  const whyItems = hp?.whyItems ?? [];

  return (
    <div>
      {/* ── HERO ── */}
      <section style={{ position: 'relative', minHeight: '70vh', display: 'flex', alignItems: 'center', overflow: 'hidden', background: 'var(--bb-bg)' }}>
        <div style={{ position: 'absolute', inset: 0 }}>
          <Image src={about?.heroImage || '/images/logo black.png'} alt="About BIGBOLD" fill style={{ objectFit: 'cover', opacity: 0.2 }} priority />
        </div>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: 'var(--bb-accent)' }} />
        <div style={{ position: 'relative', zIndex: 2, maxWidth: 1400, margin: '0 auto', padding: '80px 24px' }}>
          <div className="tag animate-fadeIn" style={{ marginBottom: 24 }}>{about?.heroTag}</div>
          <h1 className="animate-slideRight" style={{ fontSize: 'clamp(48px, 8vw, 100px)', fontWeight: 900, letterSpacing: '-0.03em', color: 'var(--bb-fg)', lineHeight: 0.92, opacity: 0, whiteSpace: 'pre-line' }}>
            {about?.heroTitle}
          </h1>
        </div>
      </section>

      {/* ── MISSION ── */}
      <section style={{ maxWidth: 1400, margin: '0 auto', padding: '80px 24px' }}>
        <div className="mission-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
          <div data-animate="slideRight">
            <div className="tag" style={{ marginBottom: 20 }}>The Beginning</div>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 900, letterSpacing: '-0.02em', color: 'var(--bb-fg)', lineHeight: 1, marginBottom: 24 }}>
              {about?.missionTitle}
            </h2>
            <p style={{ color: 'var(--bb-muted)', fontSize: 15, lineHeight: 1.9, marginBottom: 20 }}>{about?.missionBody1}</p>
            <p style={{ color: 'var(--bb-muted)', fontSize: 15, lineHeight: 1.9 }}>{about?.missionBody2}</p>
          </div>
          <div data-animate="slideLeft" style={{ position: 'relative' }}>
            <div style={{ position: 'relative', aspectRatio: '4/5', overflow: 'hidden' }}>
              <Image src={about?.missionImage || '/images/logo black.png'} alt="BIGBOLD Origin" fill style={{ objectFit: 'cover' }} />
            </div>
            <div style={{ position: 'absolute', bottom: -16, left: -16, background: 'var(--bb-accent)', padding: '20px 24px' }}>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', color: 'var(--bb-accent-fg)', textTransform: 'uppercase' }}>Founded</p>
              <p style={{ fontSize: 32, fontWeight: 900, color: 'var(--bb-accent-fg)', lineHeight: 1 }}>{about?.foundedYear}</p>
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
            {values.map((v, i) => (
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
            {about?.quote}
          </blockquote>
          <p style={{ color: 'var(--bb-subtle)', fontSize: 13, letterSpacing: '0.15em', textTransform: 'uppercase' }}>— {settings?.siteName}</p>
        </div>
      </section>

      {/* ── WHY BIGBOLD ── */}
      <section style={{ background: 'var(--bb-bg-2)', borderTop: '1px solid var(--bb-border)', borderBottom: '1px solid var(--bb-border)' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '64px 24px 0' }}>
          <div data-animate="fadeUp" style={{ marginBottom: 48 }}>
            <p style={{ fontSize: 'clamp(22px, 4vw, 36px)', fontWeight: 900, color: 'var(--bb-fg)', letterSpacing: '-0.02em' }}>
              {hp?.whyTitle}
            </p>
          </div>
        </div>
        <div className="why-grid" style={{ maxWidth: 1400, margin: '0 auto', borderTop: '1px solid var(--bb-border)' }}>
          {whyItems.map((item) => (
            <div key={item.num} className="why-item" style={{ background: 'var(--bb-bg-2)' }}>
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
        <div data-stagger className="process-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 0, background: 'var(--bb-border)' }}>
          {processSteps.map((s, i) => (
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
        <div className="about-gallery" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 2, height: 500 }}>
          {gallery.map((src, i) => (
            <div key={i} className="img-zoom" style={{ position: 'relative', overflow: 'hidden', background: 'var(--bb-border)', gridRow: i === 0 ? 'span 2' : 'auto' }}>
              <Image src={src} alt={`Gallery ${i}`} fill style={{ objectFit: 'cover' }} />
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section data-animate="scaleUp" style={{ background: 'var(--bb-accent)', padding: '64px 24px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(28px, 5vw, 60px)', fontWeight: 900, color: 'var(--bb-accent-fg)', letterSpacing: '-0.03em', marginBottom: 24 }}>{about?.ctaTitle}</h2>
        <p style={{ color: 'var(--bb-accent-fg)', fontSize: 16, marginBottom: 32, opacity: 0.7 }}>{about?.ctaSubtitle}</p>
        <Link href="/products">
          <button style={{ background: 'var(--bb-bg)', color: 'var(--bb-accent)', border: 'none', padding: '16px 48px', fontWeight: 800, fontSize: 14, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer' }}>
            {about?.ctaButton}
          </button>
        </Link>
      </section>
    </div>
  );
}
