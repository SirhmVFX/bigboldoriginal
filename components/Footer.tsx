'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{ background: 'var(--bb-bg-2)', borderTop: '1px solid var(--bb-border)', marginTop: 'auto', transition: 'background 0.3s' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '64px 24px 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 48 }}>

          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div style={{ width: 40, height: 40, background: 'var(--bb-invert)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 18, color: 'var(--bb-invert-fg)', transition: 'background 0.3s, color 0.3s' }}>
                B
              </div>
              <span style={{ fontWeight: 800, fontSize: 16, letterSpacing: '0.12em', color: 'var(--bb-fg)', textTransform: 'uppercase', transition: 'color 0.3s' }}>BIGBOLD</span>
            </div>
            <p style={{ color: 'var(--bb-muted)', fontSize: 13, lineHeight: 1.8, maxWidth: 220 }}>
              EST. 2023<br />
              Confidence, Simplified.<br />
              More than a brand. A Lifestyle.<br />
              Where sophistication meets unapologetic simplicity.
            </p>
            <div style={{ display: 'flex', gap: 16, marginTop: 24 }}>
              {['IG', 'TW', 'TK'].map(s => (
                <a key={s} href="#" style={{
                  width: 36, height: 36, border: '1px solid var(--bb-border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--bb-muted)', fontSize: 11, fontWeight: 700, letterSpacing: '0.05em',
                  textDecoration: 'none', transition: 'all 0.2s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--bb-accent)'; e.currentTarget.style.color = 'var(--bb-accent)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--bb-border)'; e.currentTarget.style.color = 'var(--bb-muted)'; }}
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 style={{ color: 'var(--bb-fg)', fontSize: 12, letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 20 }}>Shop</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {['All Products', 'Tops', 'Bottoms', 'Outerwear', 'Accessories', 'New Arrivals', 'Best Sellers'].map(item => (
                <Link key={item} href="/products" style={{ color: 'var(--bb-muted)', fontSize: 13, textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--bb-fg)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--bb-muted)')}
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>

          {/* Info */}
          <div>
            <h4 style={{ color: 'var(--bb-fg)', fontSize: 12, letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 20 }}>Info</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { label: 'About Us', href: '/about' },
                { label: 'Contact', href: '/contact' },
                { label: 'Shipping & Returns', href: '/contact' },
                { label: 'Size Guide', href: '/products' },
                { label: 'FAQ', href: '/contact' },
              ].map(item => (
                <Link key={item.label} href={item.href} style={{ color: 'var(--bb-muted)', fontSize: 13, textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--bb-fg)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--bb-muted)')}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 style={{ color: 'var(--bb-fg)', fontSize: 12, letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 20 }}>Stay Bold</h4>
            <p style={{ color: 'var(--bb-muted)', fontSize: 13, lineHeight: 1.7, marginBottom: 16 }}>
              Get early access to drops, exclusive offers, and behind-the-scenes content.
            </p>
            <div style={{ display: 'flex' }}>
              <input type="email" placeholder="your@email.com" className="bb-input" style={{ flex: 1, fontSize: 13 }} />
              <button className="btn-primary" style={{ padding: '12px 20px', whiteSpace: 'nowrap' }}>→</button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid var(--bb-border)', padding: '20px 24px' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ color: 'var(--bb-subtle)', fontSize: 12, letterSpacing: '0.05em' }}>
            © 2024 BIGBOLD ORIGINAL. ALL RIGHTS RESERVED.
          </p>
          <div style={{ display: 'flex', gap: 24 }}>
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(item => (
              <a key={item} href="#" style={{ color: 'var(--bb-subtle)', fontSize: 12, textDecoration: 'none', letterSpacing: '0.05em', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--bb-accent)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--bb-subtle)')}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
