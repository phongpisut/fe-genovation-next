import { ThemeProvider } from '@/components/theme/theme-provider';
import type { Metadata } from 'next';
import { Geist, Geist_Mono, Noto_Sans_Thai } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const notoSansThai = Noto_Sans_Thai({
  variable: '--font-default-thai',
  subsets: ['latin', 'thai'],
});

export const metadata: Metadata = {
  title: 'Genovation Appointment System',
  description: 'Dev by Phongpisut Meemuk',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} ${notoSansThai.variable} antialiased `}>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange>
            {children}
          </ThemeProvider>
        </body>
      </html>
      <footer className="flex justify-center sm:justify-end items-center line-clamp-1 px-2 w-full h-[30px] text-sm bg-slate-950 text-slate-100">
        Dev : Phongpisut Meemuk
      </footer>
    </>
  );
}
