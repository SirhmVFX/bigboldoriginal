'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { useAuth } from '@/lib/auth';
import { PRODUCTS, formatPrice } from '@/lib/products';
import ProductCard from '@/components/ProductCard';

type Tab = 'overview' | 'orders' | 'favourites' | 'settings';

const MOCK_ORDERS = [
  { id: 'BB-2024-001', date: 'Dec 12, 2024', status: 'Delivered', total: 41000, items: 3 },
  { id: 'BB-2024-002', date: 'Nov 28, 2024', status: 'Delivered', total: 28000, items: 1 },
  { id: 'BB-2024-003', date: 'Nov 5, 2024', status: 'Delivered', total: 65000, items: 2 },
];

export default function ProfilePage() {
  const { state } = useStore();
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [editMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '+234 801 234 5678',
    address: '14 Victoria Island, Lagos, Nigeria',
  });

  useEffect(() => {
    if (!loading && !user) router.push('/login');
    if (user) setProfile(p => ({ ...p, name: user.displayName || '', email: user.email || '' }));
  }, [user, loading, router]);

  if (loading || !user) return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: 'var(--bb-muted)', letterSpacing: '0.1em' }}>Loading...</p>
    </div>
  );

  const favouriteProducts = PRODUCTS.filter(p => state.favorites.includes(p.id));

  const statusColor = (s: string) => s === 'Delivered' ? 'var(--bb-accent)' : s === 'Processing' ? '#ffaa00' : '#888';

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: '48px 24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 48, paddingBottom: 40, borderBottom: '1px solid var(--bb-border)', flexWrap: 'wrap' }} className="profile-header">
        <div style={{ position: 'relative', width: 80, height: 80, overflow: 'hidden', background: 'var(--bb-border)', flexShrink: 0 }}>
          <Image
            src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=200&q=80"
            alt="Profile"
            fill
            style={{ objectFit: 'cover' }}
          />
        </div>
        <div>
          <div className="tag" style={{ marginBottom: 8 }}>Member Since 2024</div>
          <h1 style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 900, color: 'var(--bb-fg)', letterSpacing: '-0.02em' }}>
            {profile.name}
          </h1>
          <p style={{ color: '#555', fontSize: 14 }}>{profile.email}</p>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 12 }} className="profile-stats">
          <div style={{ textAlign: 'center', padding: '16px 24px', border: '1px solid #1a1a1a' }}>
            <div style={{ fontSize: 24, fontWeight: 900, color: 'var(--bb-accent)' }}>{MOCK_ORDERS.length}</div>
            <div style={{ color: '#555', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Orders</div>
          </div>
          <div style={{ textAlign: 'center', padding: '16px 24px', border: '1px solid #1a1a1a' }}>
            <div style={{ fontSize: 24, fontWeight: 900, color: 'var(--bb-accent)' }}>{favouriteProducts.length}</div>
            <div style={{ color: '#555', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Favourites</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--bb-border)', marginBottom: 40, overflowX: 'auto' }} className="profile-tabs">
        {(['overview', 'orders', 'favourites', 'settings'] as Tab[]).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            style={{
              padding: '14px 28px',
              background: 'none',
              border: 'none',
              borderBottom: `2px solid ${activeTab === tab ? 'var(--bb-accent)' : 'transparent'}`,
              color: activeTab === tab ? 'var(--bb-fg)' : '#555',
              fontSize: 12,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s',
              marginBottom: -1,
            }}>
            {tab}
            {tab === 'favourites' && favouriteProducts.length > 0 && (
              <span style={{ marginLeft: 8, background: 'var(--bb-accent)', color: 'var(--bb-bg)', fontSize: 10, fontWeight: 800, padding: '2px 6px' }}>
                {favouriteProducts.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Overview */}
      {activeTab === 'overview' && (
        <div className="animate-fadeIn">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 1, background: 'var(--bb-border)', marginBottom: 40 }}>
            {[
              { label: 'Total Spent', value: formatPrice(MOCK_ORDERS.reduce((s, o) => s + o.total, 0)) },
              { label: 'Total Orders', value: MOCK_ORDERS.length },
              { label: 'Favourites', value: favouriteProducts.length },
              { label: 'Loyalty Points', value: '2,340 pts' },
            ].map((stat, i) => (
              <div key={i} style={{ background: 'var(--bb-bg-2)', padding: 28 }}>
                <p style={{ color: '#555', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>{stat.label}</p>
                <p style={{ color: 'var(--bb-accent)', fontSize: 28, fontWeight: 900 }}>{stat.value}</p>
              </div>
            ))}
          </div>

          <h3 style={{ color: 'var(--bb-fg)', fontSize: 16, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 20 }}>Recent Orders</h3>
          <div style={{ border: '1px solid #1a1a1a' }}>
            {MOCK_ORDERS.slice(0, 2).map((order, i) => (
              <div key={order.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: i < 1 ? '1px solid #1a1a1a' : 'none' }}>
                <div>
                  <p style={{ color: 'var(--bb-fg)', fontSize: 14, fontWeight: 700 }}>{order.id}</p>
                  <p style={{ color: '#555', fontSize: 12 }}>{order.date} · {order.items} items</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ color: statusColor(order.status), fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>{order.status}</p>
                  <p style={{ color: 'var(--bb-fg)', fontSize: 15, fontWeight: 800 }}>{formatPrice(order.total)}</p>
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => setActiveTab('orders')} style={{ background: 'none', border: 'none', color: 'var(--bb-accent)', fontSize: 13, cursor: 'pointer', marginTop: 12, textDecoration: 'underline' }}>
            View all orders →
          </button>
        </div>
      )}

      {/* Orders */}
      {activeTab === 'orders' && (
        <div className="animate-fadeIn">
          <h2 style={{ fontSize: 24, fontWeight: 800, color: 'var(--bb-fg)', marginBottom: 24 }}>Order History</h2>
          {MOCK_ORDERS.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 24px' }}>
              <p style={{ color: '#555', marginBottom: 20 }}>No orders yet.</p>
              <Link href="/products"><button className="btn-primary">Start Shopping</button></Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: 'var(--bb-border)' }}>
              {MOCK_ORDERS.map(order => (
                <div key={order.id} style={{ background: 'var(--bb-bg-2)', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
                  <div>
                    <p style={{ color: 'var(--bb-fg)', fontSize: 16, fontWeight: 800, marginBottom: 4 }}>{order.id}</p>
                    <p style={{ color: '#555', fontSize: 13 }}>{order.date}</p>
                    <p style={{ color: '#888', fontSize: 13, marginTop: 4 }}>{order.items} item{order.items > 1 ? 's' : ''}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                    <div>
                      <span style={{ background: statusColor(order.status) + '22', color: statusColor(order.status), fontSize: 11, fontWeight: 700, padding: '4px 12px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                        {order.status}
                      </span>
                    </div>
                    <p style={{ color: 'var(--bb-fg)', fontSize: 18, fontWeight: 900 }}>{formatPrice(order.total)}</p>
                    <button className="btn-outline" style={{ padding: '8px 20px', fontSize: 11 }}>Details</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Favourites */}
      {activeTab === 'favourites' && (
        <div className="animate-fadeIn">
          <h2 style={{ fontSize: 24, fontWeight: 800, color: 'var(--bb-fg)', marginBottom: 24 }}>
            My Favourites <span style={{ color: '#555', fontWeight: 400, fontSize: 16 }}>({favouriteProducts.length})</span>
          </h2>
          {favouriteProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 24px' }}>
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="var(--bb-border-2)" strokeWidth="1.5" style={{ margin: '0 auto 20px' }}>
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              <p style={{ color: '#555', marginBottom: 20 }}>No favourites yet. Heart a product to save it here.</p>
              <Link href="/products"><button className="btn-primary">Browse Products</button></Link>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 1, background: 'var(--bb-border)' }}>
              {favouriteProducts.map((p, i) => (
                <div key={p.id} style={{ background: 'var(--bb-bg)' }}>
                  <ProductCard product={p} index={i} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Settings */}
      {activeTab === 'settings' && (
        <div className="animate-fadeIn" style={{ maxWidth: 600 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: 'var(--bb-fg)' }}>Account Settings</h2>
            <button onClick={() => setEditMode(!editMode)} className={editMode ? 'btn-primary' : 'btn-outline'} style={{ padding: '10px 24px', fontSize: 12 }}>
              {editMode ? 'Save Changes' : 'Edit Profile'}
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {[
              { label: 'Full Name', key: 'name', type: 'text' },
              { label: 'Email Address', key: 'email', type: 'email' },
              { label: 'Phone Number', key: 'phone', type: 'tel' },
              { label: 'Delivery Address', key: 'address', type: 'text' },
            ].map(field => (
              <div key={field.key}>
                <label style={{ color: '#888', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>{field.label}</label>
                <input
                  type={field.type}
                  value={profile[field.key as keyof typeof profile]}
                  onChange={e => setProfile({ ...profile, [field.key]: e.target.value })}
                  disabled={!editMode}
                  className="bb-input"
                  style={{ opacity: editMode ? 1 : 0.6 }}
                />
              </div>
            ))}
          </div>

          <div style={{ marginTop: 48, paddingTop: 32, borderTop: '1px solid #1a1a1a' }}>
            <h3 style={{ color: 'var(--bb-fg)', fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Notifications</h3>
            {[
              { label: 'Order updates', desc: 'Get notified about your order status' },
              { label: 'New arrivals', desc: 'Be first to know about new drops' },
              { label: 'Promotions', desc: 'Exclusive deals and discount codes' },
            ].map((n, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid #1a1a1a' }}>
                <div>
                  <p style={{ color: 'var(--bb-fg)', fontSize: 14, fontWeight: 600 }}>{n.label}</p>
                  <p style={{ color: '#555', fontSize: 12 }}>{n.desc}</p>
                </div>
                <div style={{ width: 44, height: 24, background: i === 0 ? 'var(--bb-accent)' : 'var(--bb-border-2)', cursor: 'pointer', position: 'relative', transition: 'background 0.2s' }}>
                  <div style={{ position: 'absolute', top: 3, left: i === 0 ? 23 : 3, width: 18, height: 18, background: i === 0 ? 'var(--bb-bg)' : '#555', transition: 'left 0.2s' }} />
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 32 }}>
            <button
              onClick={async () => { await logout(); router.push('/login'); }}
              style={{ background: 'none', border: '1px solid #ff4444', color: '#ff4444', padding: '12px 24px', fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#ff4444'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#ff4444'; }}>
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
