'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

const defaultFilters = {
  showUnvisited: false,
  minPoints: 0,
  maxPoints: 16,
  sortBy: 'default'
};

const PathFilters = ({ onFilterChange }) => {
  const searchParams = useSearchParams();
  const [showUnvisited, setShowUnvisited] = useState(defaultFilters.showUnvisited);
  const [pointRange, setPointRange] = useState([defaultFilters.minPoints, defaultFilters.maxPoints]);
  const [sortBy, setSortBy] = useState(defaultFilters.sortBy);

  useEffect(() => {
    setShowUnvisited(searchParams.get('showUnvisited') === 'true');
    setPointRange([
      Number(searchParams.get('minPoints') || defaultFilters.minPoints),
      Number(searchParams.get('maxPoints') || defaultFilters.maxPoints)
    ]);
    setSortBy(searchParams.get('sortBy') || defaultFilters.sortBy);
  }, [searchParams]);

  const handleUnvisitedChange = (checked: boolean) => {
    setShowUnvisited(checked);
  };

  const handlePointRangeChange = (value: number[]) => {
    setPointRange(value);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
  };

  const handleFilterClick = () => {
    onFilterChange({ showUnvisited, minPoints: pointRange[0], maxPoints: pointRange[1], sortBy });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Checkbox id="unvisited" checked={showUnvisited} onCheckedChange={handleUnvisitedChange} />
        <label htmlFor="unvisited">Pokaż tylko nieodwiedzone szlaki</label>
      </div>
      <div>
        <label>Zakres punktów GOT:</label>
        <Slider
          min={0}
          max={16}
          step={1}
          value={pointRange}
          onValueChange={handlePointRangeChange}
          className="mt-2"
        />
        <div className="mt-1 flex justify-between text-sm">
          <span>{pointRange[0]}</span>
          <span>{pointRange[1]}</span>
        </div>
      </div>
      <div>
        <label>Sortuj według:</label>
        <Select value={sortBy} onValueChange={handleSortChange}>
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Wybierz sortowanie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Domyślne</SelectItem>
            <SelectItem value="pointsAsc">Punkty (rosnąco)</SelectItem>
            <SelectItem value="pointsDesc">Punkty (malejąco)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button onClick={handleFilterClick} className="w-full">Zastosuj filtry</Button>
    </div>
  );
};

export default PathFilters;
