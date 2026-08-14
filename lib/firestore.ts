// FIRESTORE RULES NEEDED:
// products, blog, testimonials, team, content, config, faqs: allow read: if true
// newsletter: allow create: if true; allow read: if request.auth != null
// orders, users, admins: allow read, write: if request.auth != null

import { collection, getDocs, getDoc, doc, addDoc, updateDoc, setDoc, query, where, orderBy, limit, Timestamp } from 'firebase/firestore';
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
  phone?: string;
  location: string;
  hours: string;
  instagram: string;
  twitter: string;
  tiktok: string;
  instagramUrl: string;
  twitterUrl: string;
  tiktokUrl: string;
  promoBarText: string;
  freeShippingThreshold: number;
  shippingCost: number;
  shippingDays: string;
  returnDays: number;
  footerBlurb: string;
  footerCopyright: string;
  currencies: CurrencyRate[];
  defaultCurrency: string;
  paystackPublicKey: string;
  stripePublicKey: string;
  newsletterTitle: string;
  newsletterBody: string;
  sizeGuide: string;
  privacyContent: string;
  termsContent: string;
}

export interface CurrencyRate {
  code: string;
  symbol: string;
  name: string;
  rateToNgn: number;
  enabled: boolean;
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

// ── About Content ──────────────────────────────────────────────────────────

export interface AboutContent {
  missionTitle: string;
  missionBody1: string;
  missionBody2: string;
  quote: string;
  values: { num: string; title: string; desc: string }[];
  processSteps: { step: string; title: string; desc: string }[];
  heroTag: string;
  heroTitle: string;
  heroImage: string;
  missionImage: string;
  foundedYear: string;
  galleryImages: string[];
  ctaTitle: string;
  ctaSubtitle: string;
  ctaButton: string;
}

export interface HomepageContent {
  tickerText: string;
  stats: { label: string; target: number; suffix: string }[];
  whyTitle: string;
  whyItems: { num: string; title: string; desc: string; sub: string }[];
  editorialImage: string;
  editorialTag: string;
  editorialTitle: string;
  editorialItalic: string;
  editorialCta: string;
  promoNewImage: string;
  promoNewTag: string;
  promoNewTitle: string;
  promoNewCta: string;
  promoNewHref: string;
  promoSaleTag: string;
  promoSaleTitle: string;
  promoSaleCta: string;
  promoSaleHref: string;
  promoShippingLabel: string;
  promoShippingTitle: string;
  promoCodeLabel: string;
  promoCode: string;
  promoCodeSub: string;
  aboutTag: string;
  aboutTitle: string;
  aboutTitleAccent: string;
  aboutBody: string;
  aboutImage: string;
  aboutCta: string;
  rewardsTag: string;
  rewardsTitle: string;
  rewardsSubtitle: string;
  rewardsFooter: string;
  rewardsCta: string;
  rewards: {
    tier: string;
    range: string;
    discount: string;
    label: string;
    desc: string;
    badge: string;
  }[];
  instagramHandle: string;
  instagramTitle: string;
  instagramImages: string[];
  ctaTag: string;
  ctaTitle: string;
  ctaButton: string;
  featuredTag: string;
  featuredTitle: string;
  newArrivalsTag: string;
  newArrivalsTitle: string;
}

export const aboutApi = {
  get: async (): Promise<AboutContent | null> => {
    try {
      const snap = await getDoc(doc(db, 'content', 'about'));
      return snap.exists() ? (snap.data() as AboutContent) : null;
    } catch {
      return null;
    }
  },
};

export const homepageApi = {
  get: async (): Promise<HomepageContent | null> => {
    try {
      const snap = await getDoc(doc(db, 'content', 'homepage'));
      return snap.exists() ? (snap.data() as HomepageContent) : null;
    } catch {
      return null;
    }
  },
};

// ── Promo Codes (read-only on client) ─────────────────────────────────────

export interface PromoCode {
  id?: string;
  code: string;
  discount: number;
  type: 'percentage' | 'fixed';
  isActive: boolean;
  usageCount: number;
}

export const promoCodesApi = {
  getAll: async (): Promise<PromoCode[]> => {
    try {
      const snap = await getDocs(collection(db, 'promoCodes'));
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as PromoCode));
    } catch {
      return [];
    }
  },
  getActive: async (): Promise<PromoCode[]> => {
    try {
      const q = query(collection(db, 'promoCodes'), where('isActive', '==', true));
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as PromoCode));
    } catch {
      return [];
    }
  },
  incrementUsage: async (id: string, current: number): Promise<void> => {
    try {
      await updateDoc(doc(db, 'promoCodes', id), { usageCount: current + 1 });
    } catch {
      // non-fatal
    }
  },
};

// ── Categories ─────────────────────────────────────────────────────────────

export interface Category {
  id?: string;
  name: string;
  slug: string;
  description?: string;
  order: number;
}

export const categoriesApi = {
  getAll: async (): Promise<Category[]> => {
    try {
      const snap = await getDocs(collection(db, 'categories'));
      const cats = snap.docs.map(d => ({ id: d.id, ...d.data() } as Category));
      return cats.sort((a, b) => a.order - b.order);
    } catch {
      return [];
    }
  },
};

// ── Users ──────────────────────────────────────────────────────────────────

export interface AppUser {
  id?: string;
  email: string;
  displayName?: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
  };
  totalOrders: number;
  totalSpend: number;
}

export const usersApi = {
  getOne: async (uid: string): Promise<AppUser | null> => {
    try {
      const snap = await getDoc(doc(db, 'users', uid));
      return snap.exists() ? ({ id: snap.id, ...snap.data() } as AppUser) : null;
    } catch {
      return null;
    }
  },
  update: async (uid: string, data: Partial<AppUser>): Promise<void> => {
    await setDoc(doc(db, 'users', uid), { ...data, updatedAt: Timestamp.now() }, { merge: true });
  },
};

// ── Orders ─────────────────────────────────────────────────────────────────

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed';

export interface OrderItem {
  productId: string;
  productName: string;
  image?: string;
  size?: string;
  color?: string;
  quantity: number;
  price: number;
}

export interface Order {
  id?: string;
  userId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  discount: number;
  promoCode?: string;
  total: number;
  status: OrderStatus;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    country: string;
  };
  notes?: string;
  paymentMethod?: 'paystack' | 'stripe';
  paymentStatus?: PaymentStatus;
  paymentRef?: string;
  currency?: string;
  trackingNumber?: string;
  trackingUrl?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export const ordersApi = {
  create: async (data: Omit<Order, 'id'>): Promise<string> => {
    const ref = await addDoc(collection(db, 'orders'), {
      ...data,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return ref.id;
  },
  getById: async (id: string): Promise<Order | null> => {
    try {
      const snap = await getDoc(doc(db, 'orders', id));
      return snap.exists() ? ({ id: snap.id, ...snap.data() } as Order) : null;
    } catch {
      return null;
    }
  },
  getByEmail: async (email: string): Promise<Order[]> => {
    try {
      const q = query(collection(db, 'orders'), where('customerEmail', '==', email));
      const snap = await getDocs(q);
      const orders = snap.docs.map(d => ({ id: d.id, ...d.data() } as Order));
      return orders.sort((a, b) => {
        const ta = a.createdAt?.toMillis() ?? 0;
        const tb = b.createdAt?.toMillis() ?? 0;
        return tb - ta;
      });
    } catch {
      return [];
    }
  },
  update: async (id: string, data: Partial<Order>): Promise<void> => {
    await updateDoc(doc(db, 'orders', id), { ...data, updatedAt: Timestamp.now() });
  },
};

