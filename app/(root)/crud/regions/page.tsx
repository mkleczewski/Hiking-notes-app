import { Suspense } from 'react';

import Pagination from '@/components/crud/pagination';
import Table from '@/components/crud/regions/table';
import Search from '@/components/crud/search';
import { SubregionsTableSkeleton } from '@/components/crud/skeletons';
import {
  fetchFilteredRegions,
  getRegionsAmount,
} from '@/lib/actions/admin/regions';

import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Regions',
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
  const currentPage = Number(searchParams?.page) || 1;

  const totalPagesResult = await getRegionsAmount();
  const regions = await fetchFilteredRegions(query, currentPage);

  if (typeof totalPagesResult === 'object' && 'error' in totalPagesResult) {
    // Handle error case
    return (
      <div className="mx-auto w-full max-w-[1000px]">
        <h1 className="text-2xl">Regiony</h1>
        <p>Błąd wczytywania regionów: {totalPagesResult.error}</p>
      </div>
    );
  }

  const totalPages = Math.ceil(totalPagesResult / 6);

  return (
    <div className="mx-auto mt-4 w-full max-w-[1400px]">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl">Regiony</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Wyszukaj region" />
        <Link
          href="/crud/regions/create"
          className="rounded-md bg-green-500 px-4 py-2 font-bold text-white"
        >
          Stwórz region
        </Link>
      </div>
      <Suspense
        key={query + currentPage}
        fallback={<SubregionsTableSkeleton />}
      >
        <Table regions={regions} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
