import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '40px 24px' }}>
      <div style={{ fontSize: 'clamp(80px, 15vw, 160px)', fontWeight: 900, color: '#1a1a1a', letterSpacing: '-0.05em', lineHeight: 1 }}>
        404
      </div>
      <h1 style={{ fontSize: 'clamp(20px, 3vw, 32px)', fontWeight: 900, color: '#f5f5f0', letterSpacing: '-0.02em', marginBottom: 16 }}>
        PAGE NOT FOUND
      </h1>
      <p style={{ color: '#555', fontSize: 15, marginBottom: 40, maxWidth: 400 }}>
        The page you're looking for doesn't exist. Maybe it was moved, or you mistyped the URL.
      </p>
      <div style={{ display: 'flex', gap: 16 }}>
        <Link href="/">
          <button className="btn-primary">Go Home</button>
        </Link>
        <Link href="/products">
          <button className="btn-outline">Shop Now</button>
        </Link>
      </div>
    </div>
  );
}
