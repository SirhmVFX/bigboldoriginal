'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import {
  settingsApi,
  homepageApi,
  aboutApi,
  heroApi,
  SiteSettings,
  HomepageContent,
  AboutContent,
  HeroContent,
} from './firestore';
import { CurrencyProvider } from './currency';

interface SiteContextType {
  settings: SiteSettings | null;
  homepage: HomepageContent | null;
  about: AboutContent | null;
  hero: HeroContent | null;
  loading: boolean;
}

const SiteContext = createContext<SiteContextType | null>(null);

export function SiteProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [homepage, setHomepage] = useState<HomepageContent | null>(null);
  const [about, setAbout] = useState<AboutContent | null>(null);
  const [hero, setHero] = useState<HeroContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      settingsApi.get().catch(() => null),
      homepageApi.get().catch(() => null),
      aboutApi.get().catch(() => null),
      heroApi.get().catch(() => null),
    ]).then(([s, h, a, heroData]) => {
      if (s) setSettings(s);
      if (h) setHomepage(h);
      if (a) setAbout(a);
      if (heroData) setHero(heroData);
      setLoading(false);
    });
  }, []);

  return (
    <SiteContext.Provider value={{ settings, homepage, about, hero, loading }}>
      <CurrencyProvider settings={settings}>
        {children}
      </CurrencyProvider>
    </SiteContext.Provider>
  );
}

export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error('useSite must be used within SiteProvider');
  return ctx;
}
