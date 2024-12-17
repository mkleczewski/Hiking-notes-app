import { LayoutGrid } from '@/components/ui/layout-grid';

import { cards } from './data';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home | GOT PTTK',
  description:
    'Projekt GOT PTTK to aplikacja webowa, która pozwala na zdobywanie odznak turystycznych PTTK w wersji elektronicznej.',
};

export default async function Home() {
  return (
    <main>
      <div className="h-screen w-full pb-20">
        <LayoutGrid cards={cards} />
      </div>
    </main>
  );
}
