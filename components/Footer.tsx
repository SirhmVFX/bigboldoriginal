'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useTheme } from '@/lib/theme';
import { newsletterApi } from '@/lib/firestore';

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function Footer() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!isValidEmail(email)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setStatus('loading');
    try {
      await newsletterApi.subscribe(email, 'footer');
      setStatus('success');
      setEmail('');
    } catch {
      setStatus('error');
      setErrorMsg('Something went wrong. Please try again.');
    }
  };

  return (
    <footer style={{ background: 'var(--bb-bg-2)', borderTop: '1px solid var(--bb-border)', marginTop: 'auto', transition: 'background 0.3s' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '64px 24px 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 48 }}>

          {/* Brand */}
          <div>
            <div style={{ marginBottom: 20 }}>
              <Image
                src={isDark ? '/images/logo white.png' : '/images/logo black.png'}
                alt="BIGBOLD ORIGINAL"
                width={140}
                height={40}
                style={{ objectFit: 'contain', height: 40, width: 'auto' }}
              />
            </div>
            <p style={{ color: 'var(--bb-muted)', fontSize: 13, lineHeight: 1.8, maxWidth: 220 }}>
              EST. 2023<br />
              Confidence, Simplified.<br />
              More than a brand. A Lifestyle.
            </p>
            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              {['IG', 'TW', 'TK'].map(s => (
                <a key={s} href="#" style={{
                  width: 36, height: 36, border: '1px solid var(--bb-border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--bb-muted)', fontSize: 11, fontWeight: 700,
                  textDecoration: 'none', transition: 'all 0.2s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--bb-fg)'; e.currentTarget.style.color = 'var(--bb-fg)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--bb-border)'; e.currentTarget.style.color = 'var(--bb-muted)'; }}>
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
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--bb-muted)')}>
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
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--bb-muted)')}>
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
            {status === 'success' ? (
              <div style={{ padding: '12px 16px', background: 'var(--bb-accent-bg)', border: '1px solid var(--bb-accent)', color: 'var(--bb-fg)', fontSize: 13, fontWeight: 600 }}>
                ✓ You&apos;re in! Welcome to the bold community.
              </div>
            ) : (
              <form onSubmit={handleSubscribe}>
                <div style={{ display: 'flex' }}>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="bb-input"
                    style={{ flex: 1, fontSize: 13 }}
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    disabled={status === 'loading'}
                  />
                  <button
                    type="submit"
                    className="btn-primary"
                    style={{ padding: '12px 20px', whiteSpace: 'nowrap' }}
                    disabled={status === 'loading'}
                  >
                    {status === 'loading' ? '...' : '→'}
                  </button>
                </div>
                {errorMsg && (
                  <p style={{ color: 'var(--bb-accent)', fontSize: 12, marginTop: 6 }}>{errorMsg}</p>
                )}
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid var(--bb-border)', padding: '20px 24px' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ color: 'var(--bb-subtle)', fontSize: 12, letterSpacing: '0.05em' }}>
            © 2024 BIGBOLD ORIGINAL. ALL RIGHTS RESERVED.
          </p>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(item => (
              <a key={item} href="#" style={{ color: 'var(--bb-subtle)', fontSize: 12, textDecoration: 'none', letterSpacing: '0.05em', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--bb-fg)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--bb-subtle)')}>
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
