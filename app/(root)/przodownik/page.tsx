import { Suspense } from 'react';

import Search from '@/components/crud/search';
import { SubregionsTableSkeleton } from '@/components/crud/skeletons';
import { getUserEntriesWithUnverifiedCount } from '@/lib/actions/przodownik.action';

import UnverifiedUserEntryTable from '@/components/przodownik/table';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Unverified Entries',
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
  const userEntries = await getUserEntriesWithUnverifiedCount();

  return (
    <div className="mx-auto mt-4 w-full max-w-[1400px]">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl">Ksiązeczki</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Wyszukaj ksiąeczke" />
      </div>
      <Suspense key={query} fallback={<SubregionsTableSkeleton />}>
        <UnverifiedUserEntryTable userEntries={userEntries as any} />
      </Suspense>
    </div>
  );
}
