import { Suspense } from 'react';

import Search from '@/components/crud/search';
import { SubregionsTableSkeleton } from '@/components/crud/skeletons';
import UnverifiedUserEntryTable from '@/components/przodownik/table';
import OdznakiUsersTable from '@/components/referat/odznaki/table';
import { getBooksForAchievements } from '@/lib/actions/odznaki/odznaki';
import { getUserEntriesWithUnverifiedCount } from '@/lib/actions/przodownik.action';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Przyznawanie odznak',
};

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const query = searchParams?.query || '';
  const booksForAchievements = await getBooksForAchievements();

  return (
    <div className="mx-auto mt-4 w-full max-w-[1400px]">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl">Przyznawanie odznak</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
         <Search placeholder="Wyszukaj ksiąeczke" />
      </div>
      <Suspense key={query} fallback={<SubregionsTableSkeleton />}>
        <OdznakiUsersTable userEntries={booksForAchievements as any} />
      </Suspense>
    </div>
  );
}
