import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { RootProvider } from '@/components/layout/RootProvider';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'M1NDMAP11 | Decision Intelligence Platform',
    template: '%s | M1NDMAP11',
  },
  description:
    'Enterprise decision-intelligence platform for senior executives. Transform complex business challenges into structured decision artifacts.',
  keywords: [
    'decision intelligence',
    'executive tools',
    'strategic planning',
    'business analysis',
    'AI-powered decisions',
  ],
  authors: [{ name: 'M1NDMAP11' }],
  creator: 'M1NDMAP11',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://m1ndmap11.com',
    siteName: 'M1NDMAP11',
    title: 'M1NDMAP11 | Decision Intelligence Platform',
    description:
      'Enterprise decision-intelligence platform for senior executives.',
    images: [
      {
        url: '/images/logo.jpg',
        width: 1200,
        height: 630,
        alt: 'M1NDMAP11 Logo',
      },
    ],
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
    ],
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'M1NDMAP11 | Decision Intelligence Platform',
    description:
      'Enterprise decision-intelligence platform for senior executives.',
    images: ['/images/logo.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: '#F3EFE6', // canvas color from spec
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-canvas font-sans text-ink antialiased">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
