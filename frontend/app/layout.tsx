import type { Metadata } from 'next';
import { Inter, Oswald, Playfair_Display } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import CustomCursor from '@/components/CustomCursor';
import SmoothScroll from '@/components/SmoothScroll';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const oswald = Oswald({ subsets: ['latin'], variable: '--font-oswald' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

export const metadata: Metadata = {
  title: 'Shawarma Inn | Authentic Middle Eastern Craft',
  description: 'Experience the art of traditional shawarma in Chennai. Awwwards level interactive culinary journey.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${oswald.variable} ${playfair.variable}`}>
      <body className="font-body antialiased">
        <div className="blob blob-red" />
        <CustomCursor />
        <SmoothScroll>
          {children}
        </SmoothScroll>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#111',
              color: '#fff',
              border: '1px solid rgba(204,26,26,0.3)',
            },
            success: { iconTheme: { primary: '#CC1A1A', secondary: '#fff' } },
          }}
        />
      </body>
    </html>
  );
}
