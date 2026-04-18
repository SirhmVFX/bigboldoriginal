import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { StoreProvider } from '@/lib/store';
import { ThemeProvider } from '@/lib/theme';
import { AuthProvider } from '@/lib/auth';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'BIGBOLD ORIGINAL — Confidence, Simplified',
  description: 'More than a brand. A Lifestyle. Where sophistication meets unapologetic simplicity. EST. 2023.',
  keywords: 'BIGBOLD, streetwear, fashion, Nigeria, clothing, lifestyle',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // data-theme="light" set here as default — ThemeProvider will override on client
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`} data-theme="light">
      {/* Inline script runs before paint to apply saved theme, preventing flash */}
      <head>
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            try {
              var t = localStorage.getItem('bb-theme');
              if (t === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
            } catch(e) {}
          })();
        `}} />
      </head>
      <body style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <ThemeProvider>
          <AuthProvider>
            <StoreProvider>
              <Navbar />
              <main style={{ flex: 1 }}>
                {children}
              </main>
              <Footer />
            </StoreProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
