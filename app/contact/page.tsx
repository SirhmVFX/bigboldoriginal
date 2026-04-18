'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  const faqs = [
    { q: 'How long does shipping take?', a: 'Standard shipping within Nigeria takes 3-5 business days. Express shipping (1-2 days) is available at checkout. International shipping takes 7-14 business days.' },
    { q: 'What is your return policy?', a: 'We accept returns within 14 days of delivery. Items must be unworn, unwashed, and in original packaging. Sale items are final sale.' },
    { q: 'How do I find my size?', a: 'Check our size guide on each product page. BIGBOLD pieces are generally oversized — if you prefer a more fitted look, size down. When in doubt, reach out to us.' },
    { q: 'Are your products made in Nigeria?', a: 'Yes. BIGBOLD ORIGINAL is proudly made in Nigeria. We work with local manufacturers who share our commitment to quality and fair practices.' },
    { q: 'Do you ship internationally?', a: 'Yes, we ship worldwide. International orders may be subject to customs duties and taxes, which are the responsibility of the customer.' },
    { q: 'How can I track my order?', a: 'Once your order ships, you\'ll receive a tracking number via email. You can use this to track your package on our courier\'s website.' },
  ];

  return (
    <div>
      {/* Hero */}
      <section style={{ background: 'var(--bb-bg-2)', borderBottom: '1px solid #1a1a1a', padding: '80px 24px' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <div className="tag animate-fadeIn" style={{ marginBottom: 20 }}>Get In Touch</div>
          <h1 className="animate-slideRight" style={{ fontSize: 'clamp(40px, 7vw, 88px)', fontWeight: 900, letterSpacing: '-0.03em', color: 'var(--bb-fg)', lineHeight: 0.92, opacity: 0 }}>
            CONTACT<br /><span style={{ color: 'var(--bb-accent)' }}>US.</span>
          </h1>
        </div>
      </section>

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '64px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64 }}>
          {/* Contact form */}
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: 'var(--bb-fg)', letterSpacing: '-0.01em', marginBottom: 8 }}>Send a Message</h2>
            <p style={{ color: '#555', fontSize: 14, marginBottom: 32 }}>We typically respond within 24 hours.</p>

            {sent ? (
              <div className="animate-scaleIn" style={{ border: '1px solid var(--bb-accent)', padding: 40, textAlign: 'center' }}>
                <div style={{ fontSize: 40, marginBottom: 16 }}>✓</div>
                <h3 style={{ color: 'var(--bb-accent)', fontSize: 20, fontWeight: 800, marginBottom: 8 }}>Message Sent!</h3>
                <p style={{ color: '#888', fontSize: 14 }}>We'll get back to you within 24 hours.</p>
                <button className="btn-outline" style={{ marginTop: 24 }} onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }); }}>
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{ color: '#888', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Name *</label>
                    <input required type="text" placeholder="Your name" value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      className="bb-input" />
                  </div>
                  <div>
                    <label style={{ color: '#888', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Email *</label>
                    <input required type="email" placeholder="your@email.com" value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      className="bb-input" />
                  </div>
                </div>

                <div>
                  <label style={{ color: '#888', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Subject *</label>
                  <select required value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}
                    className="bb-input" style={{ cursor: 'pointer' }}>
                    <option value="">Select a subject</option>
                    <option>Order Inquiry</option>
                    <option>Returns & Exchanges</option>
                    <option>Product Question</option>
                    <option>Wholesale / Collaboration</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label style={{ color: '#888', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Message *</label>
                  <textarea required placeholder="Tell us how we can help..." value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    className="bb-input" rows={6} style={{ resize: 'vertical' }} />
                </div>

                <button type="submit" className="btn-primary" style={{ padding: '16px', fontSize: 14 }}>
                  Send Message →
                </button>
              </form>
            )}
          </div>

          {/* Info */}
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: 'var(--bb-fg)', letterSpacing: '-0.01em', marginBottom: 32 }}>Contact Info</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 0, marginBottom: 48, border: '1px solid #1a1a1a' }}>
              {[
                { label: 'Email', value: 'hello@bigboldoriginal.com', icon: '✉' },
                { label: 'Instagram', value: '@bigboldoriginal_', icon: '◎' },
                { label: 'Location', value: 'Lagos, Nigeria', icon: '◈' },
                { label: 'Hours', value: 'Mon–Fri, 9am–6pm WAT', icon: '◷' },
              ].map((info, i) => (
                <div key={i} style={{ display: 'flex', gap: 20, padding: '20px 24px', borderBottom: i < 3 ? '1px solid #1a1a1a' : 'none', alignItems: 'center' }}>
                  <span style={{ color: 'var(--bb-accent)', fontSize: 18, width: 24, flexShrink: 0 }}>{info.icon}</span>
                  <div>
                    <p style={{ color: '#555', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 2 }}>{info.label}</p>
                    <p style={{ color: 'var(--bb-fg)', fontSize: 14, fontWeight: 600 }}>{info.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Social */}
            <div style={{ marginBottom: 48 }}>
              <h3 style={{ color: 'var(--bb-fg)', fontSize: 14, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>Follow Us</h3>
              <div style={{ display: 'flex', gap: 12 }}>
                {[
                  { name: 'Instagram', handle: '@bigboldoriginal_' },
                  { name: 'Twitter', handle: '@bigboldoriginal' },
                  { name: 'TikTok', handle: '@bigboldoriginal_' },
                ].map(s => (
                  <a key={s.name} href="#"
                    style={{ border: '1px solid #2a2a2a', padding: '10px 16px', textDecoration: 'none', transition: 'all 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--bb-accent)'; e.currentTarget.style.color = 'var(--bb-accent)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--bb-border-2)'; e.currentTarget.style.color = '#888'; }}>
                    <p style={{ color: 'inherit', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{s.name}</p>
                    <p style={{ color: '#555', fontSize: 11 }}>{s.handle}</p>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div style={{ marginTop: 64, borderTop: '1px solid #1a1a1a', paddingTop: 64 }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div className="tag" style={{ marginBottom: 12 }}>FAQ</div>
            <h2 style={{ fontSize: 'clamp(24px, 3vw, 40px)', fontWeight: 900, letterSpacing: '-0.02em', color: 'var(--bb-fg)' }}>
              FREQUENTLY ASKED
            </h2>
          </div>

          <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 0, border: '1px solid #1a1a1a' }}>
            {faqs.map((faq, i) => (
              <div key={i} style={{ borderBottom: i < faqs.length - 1 ? '1px solid #1a1a1a' : 'none' }}>
                <button
                  onClick={() => setActiveAccordion(activeAccordion === i ? null : i)}
                  style={{ width: '100%', background: 'none', border: 'none', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', textAlign: 'left' }}>
                  <span style={{ color: 'var(--bb-fg)', fontSize: 15, fontWeight: 600 }}>{faq.q}</span>
                  <span style={{ color: 'var(--bb-accent)', fontSize: 20, fontWeight: 300, transition: 'transform 0.3s', transform: activeAccordion === i ? 'rotate(45deg)' : 'rotate(0)' }}>+</span>
                </button>
                <div className={`accordion-content ${activeAccordion === i ? 'open' : ''}`}>
                  <p style={{ color: '#888', fontSize: 14, lineHeight: 1.8, padding: '0 24px 20px' }}>{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
