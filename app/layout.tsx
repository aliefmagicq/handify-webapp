import { cn } from '@/lib/utils';
import '@/styles/globals.css';
import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';

const manropeSans = Manrope({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Handify',
  description: 'Platform for tunarungu',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={cn(manropeSans.className)}>
        <header></header>
        <main>{children}</main>
        <footer></footer>
        <Toaster />
      </body>
    </html>
  );
}
