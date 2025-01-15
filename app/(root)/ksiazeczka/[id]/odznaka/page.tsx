import { Suspense } from 'react';

import Pagination from '@/components/crud/pagination';
import Search from '@/components/crud/search';
import { SubregionsTableSkeleton } from '@/components/crud/skeletons';
import OdznakiTable from '@/components/ksiazeczka/odznaki-table';
import { fetchVerifiedBook, getBooksAmount } from '@/lib/actions/admin/book';
import { findUser } from '@/lib/actions/admin/book';

import { User } from '@prisma/client';
import { Metadata } from 'next';
import {
  getBadgesForForm,
  getBadgesForUser,
} from '@/lib/actions/odznaki/odznaki';

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
  const user = (await findUser(params?.id)) as User;

  const totalPagesResult = await getBooksAmount();
  const records = await fetchVerifiedBook(query, currentPage, params.id);
  const badgesForForm = await getBadgesForForm(user?.id);

  if (typeof totalPagesResult === 'object' && 'error' in totalPagesResult) {
    return (
      <div className="mx-auto w-full max-w-[1000px]">
        <h1 className="text-2xl">Book</h1>
        <p>Error podczas ładowania książki: {totalPagesResult.error}</p>
      </div>
    );
  }

  const totalPages = Math.ceil(totalPagesResult / 15);

  const nameOrEmail =
    user?.name || `${user?.firstName} ${user?.lastName}` || user?.email;

  return (
    <div className="mx-auto mt-4 w-full max-w-[1400px]">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl">Książeczka - {nameOrEmail}</h1>
        <h2>Niezuzyte punkty: {user?.unusedPoints}</h2>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Znajdź wpis..." />
      </div>
      <Suspense
        key={query + currentPage}
        fallback={<SubregionsTableSkeleton />}
      >
        <OdznakiTable
          records={records}
          userId={params.id}
          badgesForForm={badgesForForm}
        />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
