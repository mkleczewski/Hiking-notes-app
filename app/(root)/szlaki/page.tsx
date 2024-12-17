import { Suspense } from 'react';
import Pagination from '@/components/crud/pagination';
import Search from '@/components/crud/search';
import { SubregionsTableSkeleton } from '@/components/crud/skeletons';
import { fetchFilteredPaths, getPathsAmount } from '@/lib/actions/paths.action';
import PathCard from './components/PathCard';
import ClientPathFilters from './components/ClientPathFilters';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Szlaki',
};

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
    showUnvisited?: string;
    minPoints?: string;
    maxPoints?: string;
    sortBy?: string;
  };
}) {
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
  const showUnvisited = searchParams?.showUnvisited === 'true';
  const minPoints = Number(searchParams?.minPoints) || 0;
  const maxPoints = Number(searchParams?.maxPoints) || 100;
  const sortBy = searchParams?.sortBy || 'default';

  const totalPagesResult = await getPathsAmount(query, showUnvisited, minPoints, maxPoints);
  const paths = await fetchFilteredPaths(query, currentPage, showUnvisited, minPoints, maxPoints, sortBy);

  if (typeof totalPagesResult === 'object' && 'error' in totalPagesResult) {
    return (
      <div className="mx-auto w-full max-w-[1000px]">
        <h1 className="text-2xl">Szlaki</h1>
        <p>Error loading paths: {totalPagesResult.error}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-4 w-full max-w-[1400px] p-6">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl">Szlaki</h1>
      </div>
      <div className="mt-4 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <Search placeholder="Wyszukaj Szlak" />
        <ClientPathFilters />
      </div>
      <Suspense key={query + currentPage + showUnvisited + minPoints + maxPoints + sortBy} fallback={<SubregionsTableSkeleton />}>
        <div className="mt-5 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {paths.map((path) => (
            <PathCard key={path.id} path={path} />
          ))}
        </div>
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPagesResult} />
      </div>
    </div>
  );
}

