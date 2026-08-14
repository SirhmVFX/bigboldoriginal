'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { useAuth } from '@/lib/auth';
import ProductCard from '@/components/ProductCard';
import { ordersApi, usersApi, productsApi, Order, FirestoreProduct } from '@/lib/firestore';
import { useCurrency } from '@/lib/currency';
import { Product } from '@/lib/store';

type Tab = 'overview' | 'orders' | 'favourites' | 'settings';

function toProduct(p: FirestoreProduct): Product {
  return {
    id: p.id ?? '',
    name: p.name,
    price: p.price,
    originalPrice: p.originalPrice,
    category: p.category,
    subcategory: p.subcategory,
    images: p.images,
    sizes: p.sizes,
    colors: p.colors,
    description: p.description,
    details: p.details,
    rating: p.rating,
    reviews: p.reviews,
    inStock: p.inStock,
    isNew: p.isNew,
    isBestSeller: p.isBestSeller,
    tags: p.tags,
  };
}

export default function ProfilePage() {
  const { state } = useStore();
  const { user, logout, updateUserProfile, changePassword, loading } = useAuth();
  const { format } = useCurrency();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [profile, setProfile] = useState({ name: '', email: '', phone: '', street: '', city: '', state: '', country: '' });
  const [pw, setPw] = useState({ current: '', next: '' });

  useEffect(() => {
    if (!loading && !user) router.push('/login');
    if (user) {
      setProfile(p => ({ ...p, name: user.displayName || '', email: user.email || '' }));
      usersApi.getOne(user.uid).then(doc => {
        if (!doc) return;
        setProfile(p => ({
          ...p,
          name: doc.displayName || p.name,
          phone: doc.phone || '',
          street: doc.address?.street || '',
          city: doc.address?.city || '',
          state: doc.address?.state || '',
          country: doc.address?.country || '',
        }));
      }).catch(() => {});
    }
  }, [user, loading, router]);

  useEffect(() => {
    productsApi.getAll().then(d => setAllProducts(d.map(toProduct))).catch(() => {});
  }, []);

  useEffect(() => {
    if ((activeTab === 'orders' || activeTab === 'overview') && user?.email && orders.length === 0) {
      setOrdersLoading(true);
      ordersApi.getByEmail(user.email)
        .then(setOrders)
        .catch(() => {})
        .finally(() => setOrdersLoading(false));
    }
  }, [activeTab, user, orders.length]);

  const handleSaveProfile = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await updateUserProfile(profile.name);
      await usersApi.update(user.uid, {
        displayName: profile.name,
        phone: profile.phone,
        address: { street: profile.street, city: profile.city, state: profile.state, country: profile.country },
      });
      if (pw.current && pw.next) {
        await changePassword(pw.current, pw.next);
        setPw({ current: '', next: '' });
      }
      setSaveMsg('Profile updated!');
      setTimeout(() => setSaveMsg(''), 3000);
      setEditMode(false);
    } catch {
      setSaveMsg('Failed to save. Try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !user) return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: 'var(--bb-muted)', letterSpacing: '0.1em' }}>Loading...</p>
    </div>
  );

  const favouriteProducts = allProducts.filter(p => state.favorites.includes(p.id));
  const statusColor = (s: string) => s === 'delivered' ? 'var(--bb-accent)' : (s === 'confirmed' || s === 'shipped') ? '#ffaa00' : s === 'cancelled' ? '#ff4444' : '#888';
  const orderDate = (o: Order) => o.createdAt ? new Date(o.createdAt.toMillis()).toLocaleDateString() : '—';

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: '48px 24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 48, paddingBottom: 40, borderBottom: '1px solid var(--bb-border)', flexWrap: 'wrap' }} className="profile-header">
        <div style={{ width: 80, height: 80, background: 'var(--bb-border)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: 32, fontWeight: 900, color: 'var(--bb-muted)' }}>
            {(profile.name || user.email || 'U')[0].toUpperCase()}
          </span>
        </div>
        <div>
          <div className="tag" style={{ marginBottom: 8 }}>Member</div>
          <h1 style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 900, color: 'var(--bb-fg)', letterSpacing: '-0.02em' }}>
            {profile.name || 'Welcome'}
          </h1>
          <p style={{ color: '#555', fontSize: 14 }}>{profile.email}</p>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 12 }} className="profile-stats">
          <div style={{ textAlign: 'center', padding: '16px 24px', border: '1px solid #1a1a1a' }}>
            <div style={{ fontSize: 24, fontWeight: 900, color: 'var(--bb-accent)' }}>{orders.length}</div>
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
            style={{ padding: '14px 28px', background: 'none', border: 'none', borderBottom: `2px solid ${activeTab === tab ? 'var(--bb-accent)' : 'transparent'}`, color: activeTab === tab ? 'var(--bb-fg)' : '#555', fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', marginBottom: -1 }}>
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
              { label: 'Total Spent', value: format(orders.reduce((s, o) => s + (o.total ?? 0), 0)) },
              { label: 'Total Orders', value: orders.length },
              { label: 'Favourites', value: favouriteProducts.length },
            ].map((stat, i) => (
              <div key={i} style={{ background: 'var(--bb-bg-2)', padding: 28 }}>
                <p style={{ color: '#555', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>{stat.label}</p>
                <p style={{ color: 'var(--bb-accent)', fontSize: 28, fontWeight: 900 }}>{stat.value}</p>
              </div>
            ))}
          </div>

          <h3 style={{ color: 'var(--bb-fg)', fontSize: 16, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 20 }}>Recent Orders</h3>
          {ordersLoading ? (
            <p style={{ color: '#555' }}>Loading orders...</p>
          ) : orders.length === 0 ? (
            <p style={{ color: '#555' }}>No orders yet. <Link href="/products" style={{ color: 'var(--bb-accent)' }}>Start shopping →</Link></p>
          ) : (
            <div style={{ border: '1px solid #1a1a1a' }}>
              {orders.slice(0, 3).map((order, i) => (
                <Link key={order.id} href={`/orders/${order.id}`} style={{ textDecoration: 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: i < Math.min(orders.length, 3) - 1 ? '1px solid #1a1a1a' : 'none' }}>
                  <div>
                    <p style={{ color: 'var(--bb-fg)', fontSize: 14, fontWeight: 700 }}>#{order.id?.slice(-8).toUpperCase()}</p>
                    <p style={{ color: '#555', fontSize: 12 }}>
                      {orderDate(order)} · {order.items?.length ?? 0} items
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ color: statusColor(order.status), fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>{order.status}</p>
                    <p style={{ color: 'var(--bb-fg)', fontSize: 15, fontWeight: 800 }}>{format(order.total)}</p>
                  </div>
                </div>
                </Link>
              ))}
            </div>
          )}
          <button onClick={() => setActiveTab('orders')} style={{ background: 'none', border: 'none', color: 'var(--bb-accent)', fontSize: 13, cursor: 'pointer', marginTop: 12, textDecoration: 'underline' }}>
            View all orders →
          </button>
        </div>
      )}

      {/* Orders */}
      {activeTab === 'orders' && (
        <div className="animate-fadeIn">
          <h2 style={{ fontSize: 24, fontWeight: 800, color: 'var(--bb-fg)', marginBottom: 24 }}>Order History</h2>
          {ordersLoading ? (
            <p style={{ color: '#555' }}>Loading orders...</p>
          ) : orders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 24px' }}>
              <p style={{ color: '#555', marginBottom: 20 }}>No orders yet.</p>
              <Link href="/products"><button className="btn-primary">Start Shopping</button></Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: 'var(--bb-border)' }}>
              {orders.map(order => (
                <Link key={order.id} href={`/orders/${order.id}`} style={{ textDecoration: 'none' }}>
                <div style={{ background: 'var(--bb-bg-2)', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
                  <div>
                    <p style={{ color: 'var(--bb-fg)', fontSize: 16, fontWeight: 800, marginBottom: 4 }}>#{order.id?.slice(-8).toUpperCase()}</p>
                    <p style={{ color: '#555', fontSize: 13 }}>
                      {orderDate(order)}
                    </p>
                    <p style={{ color: '#888', fontSize: 13, marginTop: 4 }}>{order.items?.length ?? 0} item(s)</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                    <span style={{ background: statusColor(order.status) + '22', color: statusColor(order.status), fontSize: 11, fontWeight: 700, padding: '4px 12px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                      {order.status}
                    </span>
                    <p style={{ color: 'var(--bb-fg)', fontSize: 18, fontWeight: 900 }}>{format(order.total)}</p>
                  </div>
                </div>
                </Link>
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
            {editMode ? (
              <button onClick={handleSaveProfile} className="btn-primary" style={{ padding: '10px 24px', fontSize: 12 }} disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            ) : (
              <button onClick={() => setEditMode(true)} className="btn-outline" style={{ padding: '10px 24px', fontSize: 12 }}>
                Edit Profile
              </button>
            )}
          </div>
          {saveMsg && (
            <p style={{ color: saveMsg.includes('Failed') ? '#ff4444' : 'var(--bb-accent)', fontSize: 13, marginBottom: 16 }}>{saveMsg}</p>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {[
              { label: 'Full Name', key: 'name', type: 'text' },
              { label: 'Email Address', key: 'email', type: 'email' },
              { label: 'Phone Number', key: 'phone', type: 'tel' },
              { label: 'Street', key: 'street', type: 'text' },
              { label: 'City', key: 'city', type: 'text' },
              { label: 'State', key: 'state', type: 'text' },
              { label: 'Country', key: 'country', type: 'text' },
            ].map(field => (
              <div key={field.key}>
                <label style={{ color: '#888', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>{field.label}</label>
                <input
                  type={field.type}
                  value={profile[field.key as keyof typeof profile]}
                  onChange={e => setProfile({ ...profile, [field.key]: e.target.value })}
                  disabled={!editMode || field.key === 'email'}
                  className="bb-input"
                  style={{ opacity: (editMode && field.key !== 'email') ? 1 : 0.6 }}
                />
              </div>
            ))}
            {editMode && (
              <>
                <div>
                  <label style={{ color: '#888', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Current password</label>
                  <input type="password" value={pw.current} onChange={e => setPw({ ...pw, current: e.target.value })} className="bb-input" />
                </div>
                <div>
                  <label style={{ color: '#888', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>New password</label>
                  <input type="password" value={pw.next} onChange={e => setPw({ ...pw, next: e.target.value })} className="bb-input" />
                </div>
              </>
            )}
          </div>
          <div style={{ marginTop: 48, paddingTop: 32, borderTop: '1px solid #1a1a1a' }}>
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
