import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import '@/app/globals.css';
import RootLayout from '@/components/layout/RootLayout';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'IMPACT Global Academy - Equipping Leaders for Global Transformation',
    template: '%s | IMPACT Global Academy',
  },
  description:
    'Premier leadership development and capacity building platform. Transform your leadership, business strategy, and personal growth through innovative programmes.',
  keywords: [
    'leadership development',
    'business training',
    'capacity building',
    'entrepreneurship',
    'online learning',
    'coaching',
  ],
  authors: [{ name: 'IMPACT Global Academy' }],
  creator: 'IMPACT Global Academy',
  publisher: 'IMPACT Global Academy',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_NG',
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: 'IMPACT Global Academy',
    title: 'IMPACT Global Academy - Equipping Leaders for Global Transformation',
    description:
      'Premier leadership development and capacity building platform for global transformation.',
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_APP_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'IMPACT Global Academy',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IMPACT Global Academy',
    description:
      'Premier leadership development and capacity building platform for global transformation.',
    images: [`${process.env.NEXT_PUBLIC_APP_URL}/og-image.jpg`],
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${inter.variable} ${poppins.variable} antialiased`}>
        <RootLayout>{children}</RootLayout>
      </body>
    </html>
  );
}
