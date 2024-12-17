import React from 'react';

import Odznaki from '@/components/sections/Odznaki';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Odznaki | GOT PTTK',
  description:
    'Projekt GOT PTTK to aplikacja webowa, która pozwala na zdobywanie odznak turystycznych PTTK w wersji elektronicznej.',
};
export default function page() {
  return (
    <div className="w-full overflow-hidden">
      <Odznaki />
    </div>
  );
}
