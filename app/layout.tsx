// app/layout.tsx - CORRECT VERSION
import { Inter } from 'next/font/google';
import './globals.css';
import { Metadata, Viewport } from 'next';

const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-inter' });

export const viewport: Viewport = { width: 'device-width', initialScale: 1, maximumScale: 5, themeColor: '#000000' };
export const metadata: Metadata = { title: 'Living Weather', description: 'Real-time simulation.' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased bg-black text-white">
        {children}
      </body>
    </html>
  );
}