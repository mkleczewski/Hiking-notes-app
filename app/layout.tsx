/* eslint-disable camelcase */
import React from 'react';

import '../styles/globals.css';

import { ThemeProvider } from '@/context/ThemeProvider';
import { auth } from '@/lib/auth/auth';

import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import { SessionProvider } from 'next-auth/react';

const inter = Inter({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-inter',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-spaceGrotesk',
});

export const metadata: Metadata = {
  title: 'GOT PTTK',
  description:
    'Projekt GOT PTTK to aplikacja webowa, która pozwala na zdobywanie odznak turystycznych PTTK w wersji elektronicznej.',
  icons: {
    icon: './assets/imagers/site-logo.svg',
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return (
    <SessionProvider session={session}>
      <html lang="en">
        <body className={`${inter.variable} ${spaceGrotesk.variable}`}>
          <ThemeProvider>{children}</ThemeProvider>
        </body>
      </html>
    </SessionProvider>
  );
}
