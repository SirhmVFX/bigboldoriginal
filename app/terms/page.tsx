'use client';

import { useSite } from '@/lib/site';

export default function TermsPage() {
  const { settings } = useSite();
  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '64px 24px' }}>
      <h1 style={{ fontSize: 40, fontWeight: 900, letterSpacing: '-0.02em', marginBottom: 24 }}>TERMS OF SERVICE</h1>
      <div
        style={{ color: 'var(--bb-muted)', lineHeight: 1.8, fontSize: 15 }}
        dangerouslySetInnerHTML={{ __html: settings?.termsContent || '<p>Terms will appear here after seeding site settings.</p>' }}
      />
    </div>
  );
}
