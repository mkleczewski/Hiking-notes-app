import { Suspense } from 'react';

import Pagination from '@/components/crud/pagination';
import Search from '@/components/crud/search';
import { SubregionsTableSkeleton } from '@/components/crud/skeletons';
import VerifyTable from '@/components/ksiazeczka/verify-table';
import { fetchFilteredBooks, fetchVerifiedBook, getBooksAmount } from '@/lib/actions/admin/book';
import { findUser } from '@/lib/actions/admin/book';
import { currentUser } from '@/lib/auth/sessionData';

import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Veryfing user',
};

export default async function Page({
  searchParams,
  params,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
  params: { id: string };
}) {
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
  const user = await findUser(params?.id);

  const totalPagesResult = await getBooksAmount();
  const records = await fetchVerifiedBook(query, currentPage, params.id);
  console.log('records', records);
  if (typeof totalPagesResult === 'object' && 'error' in totalPagesResult) {
    return (
      <div className="mx-auto w-full max-w-[1000px]">
        <h1 className="text-2xl">Book</h1>
        <p>Error podczas ładowania: {totalPagesResult.error}</p>
      </div>
    );
  }

  const totalPages = Math.ceil(totalPagesResult / 15);

 const nameOrEmail = user?.name || `${user?.firstName} ${user?.lastName}` || user?.email;

  return (
    <div className="mx-auto mt-4 w-full max-w-[1400px]">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl">Książeczka - {nameOrEmail}</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Znajdź wpis..." />
        {/* <Link
          href="/ksiazeczka/create"
          className="rounded-md bg-green-500 px-4 py-2 font-bold text-white"
        >
          Dodaj wpis
        </Link> */}
      </div>
      <Suspense
        key={query + currentPage}
        fallback={<SubregionsTableSkeleton />}
      >
        <VerifyTable records={records} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
