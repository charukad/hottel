import { Cormorant_Garamond, Outfit } from 'next/font/google';
import Providers from '@/components/Providers';
import './globals.css';
import connectDB from '@/lib/db';
import Setting from '@/lib/models/Setting';

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

export async function generateMetadata() {
  try {
    await connectDB();
    const config = await Setting.findOne();
    if (config) {
      return {
        title: config.seoTitle,
        description: config.seoDescription,
        keywords: config.seoKeywords?.split(',').map(k => k.trim()),
        openGraph: {
          title: config.seoTitle,
          description: config.seoDescription,
        },
        icons: {
          icon: config.faviconUrl || '/favicon.ico',
          apple: config.faviconUrl || '/apple-touch-icon.png',
        }
      };
    }
  } catch (err) {
    console.error('Failed to fetch settings for metadata:', err.message);
  }

  // Fallback defaults
  return {
    title: 'Mountain Breeze Villa – Ella, Sri Lanka',
    description: 'Eco-friendly luxury stay in Ella, Sri Lanka. Peaceful mountain retreat surrounded by nature.',
    icons: {
      icon: '/favicon.ico',
      apple: '/apple-touch-icon.png',
    }
  };
}

export default async function RootLayout({ children }) {
  let primaryColor = '#2b4c3b';
  let secondaryColor = '#8fa87a';
  
  try {
    await connectDB();
    const config = await Setting.findOne();
    if (config) {
      primaryColor = config.primaryColor;
      secondaryColor = config.secondaryColor;
    }
  } catch (e) {
    // silently fail back to defaults
  }

  return (
    <html lang="en" className={`${cormorant.variable} ${outfit.variable}`} suppressHydrationWarning>
      <head>
        <style>{`
          :root {
            --green-dark: ${primaryColor};
            --forest-night: ${primaryColor};
            --green-deep: ${primaryColor};
            --emerald: ${secondaryColor};
            --emerald-deep: ${secondaryColor};
            --green-light: ${secondaryColor};
            --green-soft: ${secondaryColor};
          }
        `}</style>
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
