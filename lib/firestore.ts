// FIRESTORE RULES NEEDED:
// products, blog, testimonials, team, content, config, faqs: allow read: if true
// newsletter: allow create: if true; allow read: if request.auth != null
// orders, users, admins: allow read, write: if request.auth != null

import { collection, getDocs, getDoc, doc, addDoc, query, where, orderBy, limit, Timestamp } from 'firebase/firestore';
import { db } from './firebase';

// ── Types ──────────────────────────────────────────────────────────────────

export interface FirestoreProduct {
  id?: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  subcategory?: string;
  images: string[];
  sizes: string[];
  colors: string[];
  description: string;
  details: string[];
  rating: number;
  reviews: number;
  inStock: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;
  tags: string[];
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface HeroContent {
  tagline: string;
  words: string[];
  description: string;
  backgroundImage: string;
  ctaPrimary: string;
  ctaSecondary: string;
}

export interface Testimonial {
  id?: string;
  name: string;
  location: string;
  text: string;
  rating: number;
  isVisible: boolean;
}

export interface BlogPost {
  id?: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  tags: string[];
  author: string;
  authorImage?: string;
  readTime: number;
  isPublished: boolean;
  isFeatured: boolean;
  publishedAt?: string;
  createdAt?: Timestamp;
}

export interface TeamMember {
  id?: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  order: number;
  isVisible: boolean;
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
  email: string;
  instagram: string;
  twitter: string;
  tiktok: string;
  promoBarText: string;
  freeShippingThreshold: number;
  shippingCost: number;
  returnDays: number;
}

export interface FAQ {
  id?: string;
  question: string;
  answer: string;
  order: number;
  isVisible: boolean;
}

// ── Products ───────────────────────────────────────────────────────────────

export const productsApi = {
  getAll: async (): Promise<FirestoreProduct[]> => {
    try {
      const snap = await getDocs(collection(db, 'products'));
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as FirestoreProduct));
    } catch {
      return [];
    }
  },
  getById: async (id: string): Promise<FirestoreProduct | null> => {
    try {
      const snap = await getDoc(doc(db, 'products', id));
      return snap.exists() ? ({ id: snap.id, ...snap.data() } as FirestoreProduct) : null;
    } catch {
      return null;
    }
  },
};

// ── Hero Content ───────────────────────────────────────────────────────────

export const heroApi = {
  get: async (): Promise<HeroContent | null> => {
    try {
      const snap = await getDoc(doc(db, 'content', 'hero'));
      return snap.exists() ? (snap.data() as HeroContent) : null;
    } catch {
      return null;
    }
  },
};

// ── Testimonials ───────────────────────────────────────────────────────────

export const testimonialsApi = {
  getVisible: async (): Promise<Testimonial[]> => {
    try {
      const q = query(collection(db, 'testimonials'), where('isVisible', '==', true));
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as Testimonial));
    } catch {
      return [];
    }
  },
};

// ── Blog ───────────────────────────────────────────────────────────────────

export const blogApi = {
  getPublished: async (): Promise<BlogPost[]> => {
    try {
      const q = query(
        collection(db, 'blog'),
        where('isPublished', '==', true),
        orderBy('publishedAt', 'desc'),
      );
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as BlogPost));
    } catch {
      // Fallback without orderBy in case index doesn't exist
      try {
        const q2 = query(collection(db, 'blog'), where('isPublished', '==', true));
        const snap2 = await getDocs(q2);
        const posts = snap2.docs.map(d => ({ id: d.id, ...d.data() } as BlogPost));
        return posts.sort((a, b) => {
          const ta = a.createdAt?.toMillis() ?? 0;
          const tb = b.createdAt?.toMillis() ?? 0;
          return tb - ta;
        });
      } catch {
        return [];
      }
    }
  },

  getBySlug: async (slug: string): Promise<BlogPost | null> => {
    try {
      const q = query(
        collection(db, 'blog'),
        where('slug', '==', slug),
        where('isPublished', '==', true),
        limit(1),
      );
      const snap = await getDocs(q);
      if (snap.empty) return null;
      const d = snap.docs[0];
      return { id: d.id, ...d.data() } as BlogPost;
    } catch {
      return null;
    }
  },

  getFeatured: async (count = 3): Promise<BlogPost[]> => {
    try {
      const q = query(
        collection(db, 'blog'),
        where('isPublished', '==', true),
        where('isFeatured', '==', true),
        limit(count),
      );
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as BlogPost));
    } catch {
      return [];
    }
  },

  getByCategory: async (category: string): Promise<BlogPost[]> => {
    try {
      const q = query(
        collection(db, 'blog'),
        where('isPublished', '==', true),
        where('category', '==', category),
      );
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as BlogPost));
    } catch {
      return [];
    }
  },
};

// ── Team ───────────────────────────────────────────────────────────────────

export const teamApi = {
  getVisible: async (): Promise<TeamMember[]> => {
    try {
      const q = query(collection(db, 'team'), where('isVisible', '==', true), orderBy('order', 'asc'));
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as TeamMember));
    } catch {
      try {
        const q2 = query(collection(db, 'team'), where('isVisible', '==', true));
        const snap2 = await getDocs(q2);
        const members = snap2.docs.map(d => ({ id: d.id, ...d.data() } as TeamMember));
        return members.sort((a, b) => a.order - b.order);
      } catch {
        return [];
      }
    }
  },
};

// ── Site Settings ──────────────────────────────────────────────────────────

export const settingsApi = {
  get: async (): Promise<SiteSettings | null> => {
    try {
      const snap = await getDoc(doc(db, 'content', 'settings'));
      return snap.exists() ? (snap.data() as SiteSettings) : null;
    } catch {
      return null;
    }
  },
};

// ── FAQs ───────────────────────────────────────────────────────────────────

export const faqsApi = {
  getVisible: async (): Promise<FAQ[]> => {
    try {
      const q = query(collection(db, 'faqs'), where('isVisible', '==', true), orderBy('order', 'asc'));
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as FAQ));
    } catch {
      try {
        const q2 = query(collection(db, 'faqs'), where('isVisible', '==', true));
        const snap2 = await getDocs(q2);
        const faqs = snap2.docs.map(d => ({ id: d.id, ...d.data() } as FAQ));
        return faqs.sort((a, b) => a.order - b.order);
      } catch {
        return [];
      }
    }
  },
};

// ── Newsletter ─────────────────────────────────────────────────────────────

export const newsletterApi = {
  subscribe: async (email: string, source: 'popup' | 'footer' | 'checkout'): Promise<void> => {
    await addDoc(collection(db, 'newsletter'), {
      email,
      source,
      subscribedAt: Timestamp.now(),
    });
  },
};
