import { Cormorant_Garamond, Outfit } from 'next/font/google';
import Providers from '@/components/Providers';
import './globals.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-outfit',
  display: 'swap',
});

export const metadata = {
  title: 'Mountain Breeze Villa – Ella, Sri Lanka',
  description:
    'Mountain Breeze Villa – Eco-friendly luxury stay in Ella, Sri Lanka. Peaceful mountain retreat surrounded by nature.',
  keywords: [
    'Ella hotel',
    'Sri Lanka villa',
    'eco-friendly stay',
    'mountain retreat',
    'Mountain Breeze Villa',
  ],
  openGraph: {
    title: 'Mountain Breeze Villa – Ella, Sri Lanka',
    description:
      'Eco-friendly stay in the heart of Sri Lanka mountains. Luxury eco resort experience.',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${outfit.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
