'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useTheme } from '@/lib/theme';
import { newsletterApi, categoriesApi, Category } from '@/lib/firestore';
import { useSite } from '@/lib/site';

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function Footer() {
  const { theme } = useTheme();
  const { settings } = useSite();
  const isDark = theme === 'dark';
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    categoriesApi.getAll().then(setCategories).catch(() => {});
  }, []);

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

  const socials = [
    { label: 'IG', href: settings?.instagramUrl || '#' },
    { label: 'TW', href: settings?.twitterUrl || '#' },
    { label: 'TK', href: settings?.tiktokUrl || '#' },
  ];

  return (
    <footer style={{ background: 'var(--bb-bg-2)', borderTop: '1px solid var(--bb-border)', marginTop: 'auto', transition: 'background 0.3s' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '64px 24px 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 48 }}>
          <div>
            <div style={{ marginBottom: 20 }}>
              <Image
                src={isDark ? '/images/logo white.png' : '/images/logo black.png'}
                alt={settings?.siteName || 'BIGBOLD ORIGINAL'}
                width={140}
                height={40}
                style={{ objectFit: 'contain', height: 40, width: 'auto' }}
              />
            </div>
            <p style={{ color: 'var(--bb-muted)', fontSize: 13, lineHeight: 1.8, maxWidth: 220, whiteSpace: 'pre-line' }}>
              {settings?.footerBlurb}
            </p>
            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              {socials.map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noreferrer" style={{
                  width: 36, height: 36, border: '1px solid var(--bb-border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--bb-muted)', fontSize: 11, fontWeight: 700,
                  textDecoration: 'none', transition: 'all 0.2s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--bb-fg)'; e.currentTarget.style.color = 'var(--bb-fg)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--bb-border)'; e.currentTarget.style.color = 'var(--bb-muted)'; }}>
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 style={{ color: 'var(--bb-fg)', fontSize: 12, letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 20 }}>Shop</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Link href="/products" style={{ color: 'var(--bb-muted)', fontSize: 13, textDecoration: 'none' }}>All Products</Link>
              {categories.map(cat => (
                <Link key={cat.id} href={`/products`} style={{ color: 'var(--bb-muted)', fontSize: 13, textDecoration: 'none' }}>
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 style={{ color: 'var(--bb-fg)', fontSize: 12, letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 20 }}>Info</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { label: 'About Us', href: '/about' },
                { label: 'Contact', href: '/contact' },
                { label: 'Track Order', href: '/track' },
                { label: 'FAQ', href: '/contact' },
                { label: 'Privacy Policy', href: '/privacy' },
                { label: 'Terms of Service', href: '/terms' },
              ].map(item => (
                <Link key={item.label} href={item.href} style={{ color: 'var(--bb-muted)', fontSize: 13, textDecoration: 'none' }}>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 style={{ color: 'var(--bb-fg)', fontSize: 12, letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 20 }}>Stay Bold</h4>
            <p style={{ color: 'var(--bb-muted)', fontSize: 13, lineHeight: 1.7, marginBottom: 16 }}>
              {settings?.newsletterBody}
            </p>
            {status === 'success' ? (
              <div style={{ padding: '12px 16px', background: 'var(--bb-accent-bg)', border: '1px solid var(--bb-accent)', color: 'var(--bb-fg)', fontSize: 13, fontWeight: 600 }}>
                ✓ You&apos;re in!
              </div>
            ) : (
              <form onSubmit={handleSubscribe}>
                <div style={{ display: 'flex' }}>
                  <input type="email" placeholder="your@email.com" className="bb-input" style={{ flex: 1, fontSize: 13 }} value={email} onChange={e => setEmail(e.target.value)} disabled={status === 'loading'} />
                  <button type="submit" className="btn-primary" style={{ padding: '12px 20px' }} disabled={status === 'loading'}>
                    {status === 'loading' ? '...' : '→'}
                  </button>
                </div>
                {errorMsg && <p style={{ color: 'var(--bb-accent)', fontSize: 12, marginTop: 6 }}>{errorMsg}</p>}
              </form>
            )}
          </div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid var(--bb-border)', padding: '20px 24px' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ color: 'var(--bb-subtle)', fontSize: 12, letterSpacing: '0.05em' }}>
            {settings?.footerCopyright}
          </p>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            <Link href="/privacy" style={{ color: 'var(--bb-subtle)', fontSize: 12, textDecoration: 'none' }}>Privacy Policy</Link>
            <Link href="/terms" style={{ color: 'var(--bb-subtle)', fontSize: 12, textDecoration: 'none' }}>Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
