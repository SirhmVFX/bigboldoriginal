'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { settingsApi, SiteSettings, CurrencyRate } from './firestore';

const DEFAULT_CURRENCIES: CurrencyRate[] = [
  { code: 'NGN', symbol: '₦', name: 'Nigerian Naira', rateToNgn: 1, enabled: true },
  { code: 'USD', symbol: '$', name: 'US Dollar', rateToNgn: 1550, enabled: true },
  { code: 'GBP', symbol: '£', name: 'British Pound', rateToNgn: 2050, enabled: true },
  { code: 'EUR', symbol: '€', name: 'Euro', rateToNgn: 1800, enabled: true },
];

interface CurrencyContextType {
  code: string;
  currency: CurrencyRate;
  currencies: CurrencyRate[];
  setCode: (code: string) => void;
  convert: (ngnAmount: number) => number;
  format: (ngnAmount: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | null>(null);
const STORAGE_KEY = 'bb-currency';

export function CurrencyProvider({
  children,
  settings,
}: {
  children: React.ReactNode;
  settings: SiteSettings | null;
}) {
  const currencies = useMemo(() => {
    const list = settings?.currencies?.filter(c => c.enabled) ?? [];
    return list.length ? list : DEFAULT_CURRENCIES;
  }, [settings]);

  const defaultCode = settings?.defaultCurrency || 'NGN';
  const [code, setCodeState] = useState(defaultCode);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && currencies.some(c => c.code === saved)) {
        setCodeState(saved);
        return;
      }
    } catch { /* ignore */ }
    if (currencies.some(c => c.code === defaultCode)) setCodeState(defaultCode);
  }, [currencies, defaultCode]);

  const currency = currencies.find(c => c.code === code) ?? currencies[0] ?? DEFAULT_CURRENCIES[0];

  const setCode = (next: string) => {
    setCodeState(next);
    try { localStorage.setItem(STORAGE_KEY, next); } catch { /* ignore */ }
  };

  const convert = (ngnAmount: number) => {
    const rate = currency.rateToNgn || 1;
    return ngnAmount / rate;
  };

  const format = (ngnAmount: number) => {
    const converted = convert(ngnAmount);
    if (currency.code === 'NGN') {
      return `${currency.symbol}${Math.round(converted).toLocaleString()}`;
    }
    return `${currency.symbol}${converted.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <CurrencyContext.Provider value={{ code: currency.code, currency, currencies, setCode, convert, format }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error('useCurrency must be used within CurrencyProvider');
  return ctx;
}

export function formatNgn(price: number): string {
  return `₦${price.toLocaleString()}`;
}
