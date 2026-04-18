'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { useTheme } from '@/lib/theme';

export default function Navbar() {
  const { cartCount } = useStore();
  const { theme, toggle } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const isDark = theme === 'dark';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navBg = scrolled
    ? `${isDark ? 'rgba(10,10,10,0.97)' : 'rgba(245,245,240,0.97)'}`
    : 'var(--bb-bg)';

  return (
    <>
      {/* Promo bar */}
      <div className="promo-banner ticker-wrap">
        <div className="ticker-inner">
          {Array(6).fill(null).map((_, i) => (
            <span key={i} className="mx-8">
              FREE SHIPPING ON ORDERS OVER ₦50,000 &nbsp;·&nbsp; EST. 2023 &nbsp;·&nbsp; CONFIDENCE, SIMPLIFIED &nbsp;·&nbsp; MORE THAN A BRAND. A LIFESTYLE &nbsp;·&nbsp;
            </span>
          ))}
        </div>
      </div>

      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        background: navBg,
        borderBottom: '1px solid var(--bb-border)',
        transition: 'background 0.3s ease',
        backdropFilter: 'blur(12px)',
      }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>

          {/* Logo */}
          <Link href="/" style={{ textDecoration: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 36, height: 36,
                background: 'var(--bb-invert)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 900, fontSize: 16, color: 'var(--bb-invert-fg)',
                letterSpacing: '-0.05em',
                transition: 'background 0.3s, color 0.3s',
              }}>
                B
              </div>
              <span style={{ fontWeight: 800, fontSize: 15, letterSpacing: '0.12em', color: 'var(--bb-fg)', textTransform: 'uppercase', transition: 'color 0.3s' }}>
                BIGBOLD
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div style={{ display: 'flex', gap: 32, alignItems: 'center' }} className="hidden-mobile">
            {[
              { label: 'Shop', href: '/products' },
              { label: 'About', href: '/about' },
              { label: 'Contact', href: '/contact' },
            ].map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="nav-link"
                style={{ color: 'var(--bb-muted)', fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none', fontWeight: 600, transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--bb-fg)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--bb-muted)')}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>

            {/* Search */}
            <Link href="/products" style={{ color: 'var(--bb-muted)', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--bb-accent)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--bb-muted)')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </Link>

            {/* Profile */}
            <Link href="/profile" style={{ color: 'var(--bb-muted)', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--bb-accent)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--bb-muted)')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
            </Link>

            {/* Cart */}
            <Link href="/cart" style={{ position: 'relative', color: 'var(--bb-muted)', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--bb-accent)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--bb-muted)')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              {cartCount > 0 && (
                <span className="cart-badge">{cartCount}</span>
              )}
            </Link>

            {/* Theme toggle */}
            <button
              onClick={toggle}
              aria-label="Toggle theme"
              style={{
                width: 40,
                height: 22,
                background: isDark ? 'var(--bb-accent)' : 'var(--bb-border)',
                border: 'none',
                cursor: 'pointer',
                position: 'relative',
                transition: 'background 0.3s ease',
                flexShrink: 0,
              }}
            >
              {/* Track knob */}
              <span style={{
                position: 'absolute',
                top: 3,
                left: isDark ? 21 : 3,
                width: 16,
                height: 16,
                background: isDark ? '#0a0a0a' : '#ffffff',
                transition: 'left 0.3s ease, background 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 9,
              }}>
                {isDark ? '🌙' : '☀️'}
              </span>
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              style={{ background: 'none', border: 'none', color: 'var(--bb-muted)', cursor: 'pointer', padding: 4 }}
              className="show-mobile"
            >
              {menuOpen ? (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              ) : (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div style={{
            background: 'var(--bb-bg-2)',
            borderTop: '1px solid var(--bb-border)',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
          }}>
            {[
              { label: 'Shop', href: '/products' },
              { label: 'About', href: '/about' },
              { label: 'Contact', href: '/contact' },
              { label: 'Profile', href: '/profile' },
              { label: 'Cart', href: '/cart' },
            ].map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                style={{ color: 'var(--bb-fg)', fontSize: 18, letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none', fontWeight: 700 }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </nav>

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
        @media (min-width: 769px) {
          .show-mobile { display: none !important; }
        }
      `}</style>
    </>
  );
}
