import React from 'react';

import Navbar from '@/components/shared/navbar/Navbar';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { Toaster } from '@/components/ui/toaster';

import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'GOT PTTK',
  description:
    'Projekt GOT PTTK to aplikacja webowa, która pozwala na zdobywanie odznak turystycznych PTTK w wersji elektronicznej.',
};

const Layout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="relative ">
      <Navbar />
      <div className="flex">
        {/* <LeftSideBar /> */}
        <section className="mt-24 flex flex-1 flex-col">
          <Image
            src="/assets/images/fourth-bg.png"
            alt="bg"
            fill
            className="fixed -z-10 h-screen"
            style={{ backgroundAttachment: 'fixed' }}
          />
          <div className=" overflow-x-hidden">{children}</div>
        </section>
      </div>
      <Toaster />
      <Sonner />
    </main>
  );
};

export default Layout;
