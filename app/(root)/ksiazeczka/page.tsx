import { Suspense } from 'react';

import Pagination from '@/components/crud/pagination';
import Search from '@/components/crud/search';
import { SubregionsTableSkeleton } from '@/components/crud/skeletons';
import RecordsTable from '@/components/ksiazeczka/table';
import { Button } from '@/components/ui/button';
import { currentUser } from '@/lib/actions/actualUserInfo';
import { fetchFilteredBooks, getBooksAmount } from '@/lib/actions/admin/book';
import { sendToReferat } from '@/lib/actions/odznaki/odznaki';

import SendToReferat from './SendToReferat';
import { Metadata } from 'next';
import Link from 'next/link';
import { toast } from 'sonner';

export const metadata: Metadata = {
  title: 'Book',
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

  const totalPagesResult = await getBooksAmount();
  const records = await fetchFilteredBooks(query, currentPage);
  if (typeof totalPagesResult === 'object' && 'error' in totalPagesResult) {
    return (
      <div className="mx-auto w-full max-w-[1000px]">
        <h1 className="text-2xl">Book</h1>
        <p>Error loading book: {totalPagesResult.error}</p>
      </div>
    );
  }
  const totalPages = Math.ceil(totalPagesResult / 15);

  const userId = await currentUser();

  return (
    <div className="mx-auto mt-4 w-full max-w-[1400px]">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl">Książeczka</h1>
        <SendToReferat userId={userId?.id ?? ''} />
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Znajdź wpis..." />
        <Link
          href="/ksiazeczka/create"
          className="rounded-md bg-green-500 px-4 py-2 font-bold text-white"
        >
          Dodaj wpis
        </Link>
      </div>
      <Suspense
        key={query + currentPage}
        fallback={<SubregionsTableSkeleton />}
      >
        <RecordsTable records={records} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
