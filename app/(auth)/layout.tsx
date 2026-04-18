import Image from 'next/image';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr' }} className="auth-layout">
      {/* Left — brand panel */}
      <div style={{ position: 'relative', background: '#0a0a0a', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '48px', overflow: 'hidden' }} className="auth-brand-panel">
        <Image
          src="https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=1200&q=80"
          alt="BIGBOLD"
          fill
          style={{ objectFit: 'cover', opacity: 0.15 }}
        />
        {/* Vertical accent line */}
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: 'var(--bb-fg)' }} />

        <div style={{ position: 'relative', zIndex: 2 }}>
          <Image
            src="/images/logo white.png"
            alt="BIGBOLD ORIGINAL"
            width={140}
            height={40}
            style={{ objectFit: 'contain', height: 40, width: 'auto' }}
          />
        </div>

        <div style={{ position: 'relative', zIndex: 2 }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 16 }}>
            EST. 2023 — NIGERIA
          </p>
          <h2 style={{ fontSize: 'clamp(32px, 4vw, 56px)', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.03em', lineHeight: 0.95 }}>
            CONFIDENCE,<br />SIMPLIFIED.
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14, lineHeight: 1.7, marginTop: 20, maxWidth: 320 }}>
            More than a brand. A lifestyle. Where sophistication meets unapologetic simplicity.
          </p>
        </div>
      </div>

      {/* Right — form panel */}
      <div style={{ background: 'var(--bb-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 40px', overflowY: 'auto' }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          {children}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .auth-layout { grid-template-columns: 1fr !important; }
          .auth-brand-panel { display: none !important; }
        }
      `}</style>
    </div>
  );
}
