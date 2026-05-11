'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { blogApi, BlogPost } from '@/lib/firestore';
import { useScrollReveal } from '@/lib/useScrollReveal';

function formatDate(post: BlogPost): string {
  if (post.publishedAt) {
    return new Date(post.publishedAt).toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' });
  }
  if (post.createdAt) {
    return new Date(post.createdAt.toMillis()).toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' });
  }
  return '';
}

export default function BlogPostPage() {
  useScrollReveal();
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [related, setRelated] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    blogApi.getBySlug(slug).then(async data => {
      if (!data) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      setPost(data);

      // Fetch related posts (same category, exclude current)
      try {
        const all = await blogApi.getPublished();
        const rel = all.filter(p => p.category === data.category && p.slug !== slug).slice(0, 3);
        setRelated(rel);
      } catch {
        // ignore
      }

      setLoading(false);
    }).catch(() => {
      setNotFound(true);
      setLoading(false);
    });
  }, [slug]);

  if (loading) {
    return (
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '80px 24px' }}>
        <div className="skeleton" style={{ height: 48, width: '70%', marginBottom: 24, borderRadius: 4 }} />
        <div className="skeleton" style={{ height: 400, marginBottom: 32, borderRadius: 4 }} />
        <div className="skeleton" style={{ height: 16, width: '100%', marginBottom: 8, borderRadius: 2 }} />
        <div className="skeleton" style={{ height: 16, width: '90%', marginBottom: 8, borderRadius: 2 }} />
        <div className="skeleton" style={{ height: 16, width: '80%', borderRadius: 2 }} />
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: 64, marginBottom: 24 }}>404</div>
        <h1 style={{ fontSize: 32, fontWeight: 900, color: 'var(--bb-fg)', marginBottom: 16 }}>Post Not Found</h1>
        <p style={{ color: 'var(--bb-muted)', fontSize: 15, marginBottom: 32 }}>
          This post doesn&apos;t exist or has been unpublished.
        </p>
        <Link href="/blog"><button className="btn-outline">← Back to Blog</button></Link>
      </div>
    );
  }

  return (
    <article>
      {/* Cover Image */}
      {post.coverImage && (
        <div style={{ position: 'relative', height: 'clamp(300px, 50vw, 560px)', overflow: 'hidden' }}>
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.6) 100%)' }} />
        </div>
      )}

      {/* Article Header */}
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '48px 24px 0' }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24, fontSize: 12, color: 'var(--bb-muted)' }}>
          <Link href="/" style={{ color: 'var(--bb-muted)', textDecoration: 'none' }}>Home</Link>
          <span>›</span>
          <Link href="/blog" style={{ color: 'var(--bb-muted)', textDecoration: 'none' }}>Blog</Link>
          <span>›</span>
          <span style={{ color: 'var(--bb-fg)' }}>{post.category}</span>
        </div>

        {/* Category */}
        <div className="tag" style={{ marginBottom: 20, fontSize: 10 }}>{post.category}</div>

        {/* Title */}
        <h1 style={{
          fontSize: 'clamp(28px, 5vw, 52px)',
          fontWeight: 900,
          color: 'var(--bb-fg)',
          letterSpacing: '-0.02em',
          lineHeight: 1.1,
          marginBottom: 24,
        }}>
          {post.title}
        </h1>

        {/* Meta */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, paddingBottom: 32, borderBottom: '1px solid var(--bb-border)', flexWrap: 'wrap' }}>
          {post.authorImage && (
            <div style={{ position: 'relative', width: 44, height: 44, borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
              <Image src={post.authorImage} alt={post.author} fill style={{ objectFit: 'cover' }} />
            </div>
          )}
          <div>
            <div style={{ color: 'var(--bb-fg)', fontSize: 14, fontWeight: 700 }}>{post.author}</div>
            <div style={{ color: 'var(--bb-subtle)', fontSize: 12 }}>
              {formatDate(post)} · {post.readTime} min read
            </div>
          </div>
          {post.tags && post.tags.length > 0 && (
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginLeft: 'auto' }}>
              {post.tags.slice(0, 4).map(tag => (
                <span key={tag} style={{ padding: '3px 10px', background: 'var(--bb-bg-2)', border: '1px solid var(--bb-border)', color: 'var(--bb-muted)', fontSize: 11, letterSpacing: '0.05em' }}>
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 24px 64px' }}>
        <div
          className="blog-content"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>

      {/* Related Posts */}
      {related.length > 0 && (
        <section style={{ borderTop: '1px solid var(--bb-border)', padding: '64px 24px' }}>
          <div style={{ maxWidth: 1400, margin: '0 auto' }}>
            <div style={{ marginBottom: 40 }}>
              <div className="tag" style={{ marginBottom: 12, fontSize: 10 }}>More from {post.category}</div>
              <h2 style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 900, color: 'var(--bb-fg)', letterSpacing: '-0.02em' }}>
                RELATED STORIES
              </h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 1, background: 'var(--bb-border)' }}>
              {related.map((relPost, i) => (
                <Link key={relPost.id ?? i} href={`/blog/${relPost.slug}`} style={{ textDecoration: 'none' }}>
                  <div
                    style={{ background: 'var(--bb-bg-2)', transition: 'background 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--bb-bg-3)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'var(--bb-bg-2)')}
                  >
                    {relPost.coverImage && (
                      <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden' }}>
                        <Image src={relPost.coverImage} alt={relPost.title} fill style={{ objectFit: 'cover' }} />
                      </div>
                    )}
                    <div style={{ padding: 24 }}>
                      <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--bb-fg)', marginBottom: 8, lineHeight: 1.3 }}>{relPost.title}</h3>
                      <p style={{ color: 'var(--bb-muted)', fontSize: 13, lineHeight: 1.6 }}>
                        {relPost.excerpt.length > 80 ? relPost.excerpt.slice(0, 80) + '...' : relPost.excerpt}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section style={{ background: 'var(--bb-fg)', padding: '64px 24px', textAlign: 'center' }}>
        <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--bb-bg)', opacity: 0.6, marginBottom: 12 }}>
          Ready to be bold?
        </p>
        <h2 style={{ fontSize: 'clamp(28px, 5vw, 56px)', fontWeight: 900, color: 'var(--bb-bg)', letterSpacing: '-0.03em', lineHeight: 0.95, marginBottom: 28 }}>
          SHOP THE<br />COLLECTION
        </h2>
        <Link href="/products">
          <button style={{ background: 'var(--bb-bg)', color: 'var(--bb-fg)', border: 'none', padding: '14px 40px', fontWeight: 800, fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', transition: 'opacity 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
            Shop Now →
          </button>
        </Link>
      </section>

      {/* Blog content styles */}
      <style>{`
        .blog-content {
          color: var(--bb-fg-2);
          font-size: 16px;
          line-height: 1.9;
        }
        .blog-content h1 { font-size: 2em; font-weight: 900; margin: 1.5em 0 0.5em; color: var(--bb-fg); letter-spacing: -0.02em; }
        .blog-content h2 { font-size: 1.6em; font-weight: 800; margin: 1.5em 0 0.5em; color: var(--bb-fg); letter-spacing: -0.01em; }
        .blog-content h3 { font-size: 1.3em; font-weight: 700; margin: 1.2em 0 0.4em; color: var(--bb-fg); }
        .blog-content p { margin: 0 0 1.2em; }
        .blog-content ul, .blog-content ol { padding-left: 1.5em; margin: 0 0 1.2em; }
        .blog-content li { margin-bottom: 0.4em; }
        .blog-content blockquote { border-left: 3px solid var(--bb-accent); padding: 12px 20px; margin: 1.5em 0; color: var(--bb-muted); font-style: italic; background: var(--bb-bg-2); }
        .blog-content pre { background: var(--bb-bg-2); padding: 16px; border-radius: 4px; overflow-x: auto; font-size: 14px; margin: 1.2em 0; border: 1px solid var(--bb-border); }
        .blog-content code { font-family: monospace; font-size: 0.9em; background: var(--bb-bg-2); padding: 2px 6px; border-radius: 3px; }
        .blog-content a { color: var(--bb-fg); text-decoration: underline; }
        .blog-content img { max-width: 100%; height: auto; display: block; margin: 1.5em 0; }
        .blog-content hr { border: none; border-top: 1px solid var(--bb-border); margin: 2em 0; }
        .blog-content strong { font-weight: 700; color: var(--bb-fg); }
      `}</style>
    </article>
  );
}
