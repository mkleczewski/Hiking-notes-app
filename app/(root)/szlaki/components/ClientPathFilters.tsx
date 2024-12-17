'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import FilterModal from './FilterModal';
import { Button } from '@/components/ui/button';

const defaultFilters = {
  showUnvisited: false,
  minPoints: 0,
  maxPoints: 16,
  sortBy: 'default'
};

const ClientPathFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleFilterChange = (filters) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== defaultFilters[key]) {
        newSearchParams.set(key, value.toString());
      } else {
        newSearchParams.delete(key);
      }
    });

    // Always keep the page parameter if it exists
    const page = searchParams.get('page');
    if (page && page !== '1') {
      newSearchParams.set('page', page);
    } else {
      newSearchParams.delete('page');
    }

    const newSearch = newSearchParams.toString();
    const query = newSearch ? `?${newSearch}` : '';
    router.push(`${window.location.pathname}${query}`);
  };

  const handleResetFilters = () => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    ['showUnvisited', 'minPoints', 'maxPoints', 'sortBy', 'page'].forEach(param => {
      newSearchParams.delete(param);
    });
    router.push(`${window.location.pathname}${newSearchParams.toString() ? '?' + newSearchParams.toString() : ''}`);
  };

  return (
    <div className="space-y-4">
      <FilterModal onFilterChange={handleFilterChange} />
      <Button onClick={handleResetFilters} variant="outline" className="w-full">
        Zresetuj filtry
      </Button>
    </div>
  );
};

export default ClientPathFilters;
