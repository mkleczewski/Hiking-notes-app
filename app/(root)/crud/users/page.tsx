import { Suspense } from 'react';

import Table from '@/components/crud/users/table';
import { fetchFilteredUsers, getUsersAmount } from '@/lib/actions/admin/users';

import Pagination from '@/components/crud/pagination';
import Search from '@/components/crud/search';
import { SubregionsTableSkeleton } from '@/components/crud/skeletons';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'users',
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

  const totalPagesResult = await getUsersAmount();
  const users = await fetchFilteredUsers(query, currentPage);

  if (typeof totalPagesResult === 'object' && 'error' in totalPagesResult) {
    // Handle error case
    return (
      <div className="mx-auto w-full max-w-[1000px]">
        <h1 className="text-2xl">Użytkownicy</h1>
        <p>Error podczas ładowania użytkowników: {totalPagesResult.error}</p>
      </div>
    );
  }

  const totalPages = Math.ceil(totalPagesResult / 6);

  return (
    <div className="mx-auto mt-4 w-full max-w-[1400px]">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl">Uzytkownicy</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Wyszukaj Uzytkownika" />
      </div>
      <Suspense key={query + currentPage} fallback={<SubregionsTableSkeleton />}>
        <Table users={users} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
