import { Suspense } from 'react';

import Pagination from '@/components/crud/pagination';
import Search from '@/components/crud/search';
import { SubregionsTableSkeleton } from '@/components/crud/skeletons';
import Table from '@/components/crud/places/table';
import {
  fetchFilteredPlaces,
  getPlacesAmount,
} from '@/lib/actions/admin/places';

import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Places',
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

  const totalPagesResult = await getPlacesAmount();
  const places = await fetchFilteredPlaces(query, currentPage);

  if (typeof totalPagesResult === 'object' && 'error' in totalPagesResult) {
    // Handle error case
    return (
      <div className="mx-auto w-full max-w-[1000px]">
        <h1 className="text-2xl">Miejsca orientacyjne</h1>
        <p>Nie udało się załadować miejsc orientacyjne {totalPagesResult.error}</p>
      </div>
    );
  }

  const totalPages = Math.ceil(totalPagesResult / 15);

  return (
    <div className="mx-auto mt-4 w-full max-w-[1400px]">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl">Miejsca orientacyjne</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Szukaj miejsca" />
        <Link
          href="/crud/places/create"
          className="rounded-md bg-green-500 px-4 py-2 font-bold text-white"
        >
          Utwórz miejsce
        </Link>
      </div>
      <Suspense
        key={query + currentPage}
        fallback={<SubregionsTableSkeleton />}
      >
        <Table places={places} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
