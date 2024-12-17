import { Suspense } from 'react';

import Pagination from '@/components/crud/pagination';
import Search from '@/components/crud/search';
import { SubregionsTableSkeleton } from '@/components/crud/skeletons';
import Table from '@/components/crud/routes/table';
import {
  fetchFilteredRoutes,
  getRoutesAmount,
} from '@/lib/actions/admin/routes';

import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Szlaki',
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

  const totalPagesResult = await getRoutesAmount();
  const routes = await fetchFilteredRoutes(query, currentPage);

  if (typeof totalPagesResult === 'object' && 'error' in totalPagesResult) {
    // Handle error case
    return (
      <div className="mx-auto w-full max-w-[1000px]">
        <h1 className="text-2xl">Szlaki</h1>
        <p>Nie udało się załadować szlaków: {totalPagesResult.error}</p>
      </div>
    );
  }

  const totalPages = Math.ceil(totalPagesResult / 15);

  return (
    <div className="mx-auto mt-4 w-full max-w-[1400px]">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl">Szlaki</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Wyszukaj szlak" />
        <Link
          href="/crud/routes/create"
          className="rounded-md bg-green-500 px-4 py-2 font-bold text-white"
        >
          Utwórz szlak
        </Link>
      </div>
      <Suspense
        key={query + currentPage}
        fallback={<SubregionsTableSkeleton />}
      >
        <Table routes={routes} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
