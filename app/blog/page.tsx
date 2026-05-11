'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { blogApi, BlogPost } from '@/lib/firestore';
import { useScrollReveal } from '@/lib/useScrollReveal';

const CATEGORIES = ['All', 'Fashion', 'Style Tips', 'Brand Story', 'Behind the Scenes', 'Lookbook', 'News'];

function BlogSkeleton() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 1, background: 'var(--bb-border)' }}>
      {[1, 2, 3, 4, 5, 6].map(i => (
        <div key={i} style={{ background: 'var(--bb-bg-2)' }}>
          <div className="skeleton" style={{ aspectRatio: '16/9' }} />
          <div style={{ padding: 24 }}>
            <div className="skeleton" style={{ height: 12, width: '30%', marginBottom: 12, borderRadius: 2 }} />
            <div className="skeleton" style={{ height: 20, width: '80%', marginBottom: 8, borderRadius: 2 }} />
            <div className="skeleton" style={{ height: 14, width: '100%', marginBottom: 4, borderRadius: 2 }} />
            <div className="skeleton" style={{ height: 14, width: '70%', borderRadius: 2 }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function formatDate(post: BlogPost): string {
  if (post.publishedAt) {
    return new Date(post.publishedAt).toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' });
  }
  if (post.createdAt) {
    return new Date(post.createdAt.toMillis()).toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' });
  }
  return '';
}

export default function BlogPage() {
  useScrollReveal();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    blogApi.getPublished().then(data => {
      setPosts(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filtered = activeCategory === 'All'
    ? posts
    : posts.filter(p => p.category === activeCategory);

  const featuredPost = filtered.find(p => p.isFeatured);
  const regularPosts = filtered.filter(p => !p.isFeatured || filtered.indexOf(p) > 0);

  return (
    <div>
      {/* Header */}
      <section style={{ borderBottom: '1px solid var(--bb-border)', padding: '64px 24px 48px' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <div className="tag animate-fadeIn" style={{ marginBottom: 16 }}>Journal</div>
          <h1 style={{ fontSize: 'clamp(40px, 8vw, 96px)', fontWeight: 900, letterSpacing: '-0.03em', color: 'var(--bb-fg)', lineHeight: 0.95 }}>
            THE BOLD<br /><span style={{ fontStyle: 'italic', fontWeight: 400 }}>JOURNAL</span>
          </h1>
          <p style={{ color: 'var(--bb-muted)', fontSize: 15, lineHeight: 1.7, maxWidth: 480, marginTop: 20 }}>
            Stories, style guides, and behind-the-scenes from the BIGBOLD world.
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <div style={{ borderBottom: '1px solid var(--bb-border)', overflowX: 'auto' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 24px', display: 'flex', gap: 0 }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '16px 20px',
                background: 'none',
                border: 'none',
                borderBottom: `2px solid ${activeCategory === cat ? 'var(--bb-fg)' : 'transparent'}`,
                color: activeCategory === cat ? 'var(--bb-fg)' : 'var(--bb-muted)',
                cursor: 'pointer',
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s',
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '48px 24px' }}>
        {loading ? (
          <BlogSkeleton />
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 24px' }}>
            <p style={{ color: 'var(--bb-muted)', fontSize: 16 }}>No posts in this category yet.</p>
            <button
              onClick={() => setActiveCategory('All')}
              className="btn-outline"
              style={{ marginTop: 20 }}
            >
              View All Posts
            </button>
          </div>
        ) : (
          <>
            {/* Featured Post */}
            {featuredPost && (
              <Link href={`/blog/${featuredPost.slug}`} style={{ textDecoration: 'none', display: 'block', marginBottom: 1 }}>
                <div
                  style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', background: 'var(--bb-bg-2)', transition: 'background 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--bb-bg-3)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'var(--bb-bg-2)')}
                  className="featured-post-grid"
                >
                  {featuredPost.coverImage && (
                    <div style={{ position: 'relative', minHeight: 400, overflow: 'hidden' }}>
                      <Image src={featuredPost.coverImage} alt={featuredPost.title} fill style={{ objectFit: 'cover' }} />
                    </div>
                  )}
                  <div style={{ padding: '48px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 20 }}>
                      <span className="tag" style={{ fontSize: 10 }}>{featuredPost.category}</span>
                      <span className="tag" style={{ fontSize: 10, borderColor: 'var(--bb-muted)', color: 'var(--bb-muted)' }}>Featured</span>
                    </div>
                    <h2 style={{ fontSize: 'clamp(24px, 3vw, 40px)', fontWeight: 900, color: 'var(--bb-fg)', letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 16 }}>
                      {featuredPost.title}
                    </h2>
                    <p style={{ color: 'var(--bb-muted)', fontSize: 14, lineHeight: 1.8, marginBottom: 24 }}>
                      {featuredPost.excerpt}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      {featuredPost.authorImage && (
                        <div style={{ position: 'relative', width: 36, height: 36, borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
                          <Image src={featuredPost.authorImage} alt={featuredPost.author} fill style={{ objectFit: 'cover' }} />
                        </div>
                      )}
                      <div>
                        <div style={{ color: 'var(--bb-fg)', fontSize: 13, fontWeight: 700 }}>{featuredPost.author}</div>
                        <div style={{ color: 'var(--bb-subtle)', fontSize: 11 }}>
                          {formatDate(featuredPost)} · {featuredPost.readTime} min read
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            )}

            {/* Regular Posts Grid */}
            {regularPosts.length > 0 && (
              <div data-stagger style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 1, background: 'var(--bb-border)', marginTop: 1 }}>
                {regularPosts.map((post, i) => (
                  <Link key={post.id ?? i} href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
                    <div
                      style={{ background: 'var(--bb-bg-2)', height: '100%', transition: 'background 0.2s' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'var(--bb-bg-3)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'var(--bb-bg-2)')}
                    >
                      {post.coverImage ? (
                        <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden' }}>
                          <Image src={post.coverImage} alt={post.title} fill style={{ objectFit: 'cover', transition: 'transform 0.4s ease' }} />
                        </div>
                      ) : (
                        <div style={{ aspectRatio: '16/9', background: 'var(--bb-bg-3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ color: 'var(--bb-subtle)', fontSize: 32, fontWeight: 900 }}>B</span>
                        </div>
                      )}
                      <div style={{ padding: 24 }}>
                        <div className="tag" style={{ marginBottom: 12, fontSize: 10 }}>{post.category}</div>
                        <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--bb-fg)', letterSpacing: '-0.01em', lineHeight: 1.3, marginBottom: 10 }}>
                          {post.title}
                        </h3>
                        <p style={{ color: 'var(--bb-muted)', fontSize: 13, lineHeight: 1.7, marginBottom: 20 }}>
                          {post.excerpt.length > 120 ? post.excerpt.slice(0, 120) + '...' : post.excerpt}
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, borderTop: '1px solid var(--bb-border)', paddingTop: 16 }}>
                          {post.authorImage && (
                            <div style={{ position: 'relative', width: 28, height: 28, borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
                              <Image src={post.authorImage} alt={post.author} fill style={{ objectFit: 'cover' }} />
                            </div>
                          )}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ color: 'var(--bb-fg)', fontSize: 12, fontWeight: 700 }}>{post.author}</div>
                            <div style={{ color: 'var(--bb-subtle)', fontSize: 11 }}>
                              {formatDate(post)} · {post.readTime} min read
                            </div>
                          </div>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--bb-muted)" strokeWidth="2">
                            <path d="M5 12h14M12 5l7 7-7 7"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .featured-post-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
