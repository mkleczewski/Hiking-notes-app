'use client';

import { useMemo, useState } from 'react';

import { DeletePlace, UpdatePlace } from '@/components/crud/buttons';
import {
  SortDescriptor,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/table';
import { Place } from '@prisma/client';

interface PlacesTableProps {
  places: PlaceWithSubregion[];
}

interface PlaceWithSubregion extends Place {
  subregion: {
    id: string;
    name: string;
    deletedAt: string | null;
  };
}

interface SortDescriptorType {
  column: keyof PlaceWithSubregion | 'subregion';
  direction: 'ascending' | 'descending';
}

export default function PlacesTable({ places }: PlacesTableProps) {
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptorType>({
    column: 'name',
    direction: 'ascending',
  });

  const sortedItems = useMemo(() => {
    return [...places].sort((a, b) => {
      const first =
        sortDescriptor.column === 'subregion'
          ? a.subregion.name
          : a[sortDescriptor.column] ?? '';
      const second =
        sortDescriptor.column === 'subregion'
          ? b.subregion.name
          : b[sortDescriptor.column] ?? '';
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === 'descending' ? -cmp : cmp;
    });
  }, [sortDescriptor, places]);

  return (
    <div className="my-6">
      <Table
        sortDescriptor={sortDescriptor as SortDescriptor}
        onSortChange={(descriptor) =>
          setSortDescriptor(descriptor as SortDescriptorType)
        }
        isHeaderSticky
        isStriped
        classNames={{
          base: 'max-h-[420px] overflow-x-hidden',
          table: 'min-h-[300px] overflow-y-hidden',
        }}
        aria-label="Places Table with sorting"
      >
        <TableHeader>
          <TableColumn key="name" allowsSorting={true}>
            Name
          </TableColumn>
          <TableColumn key="subregion" allowsSorting={true}>
            Subregion
          </TableColumn>
          <TableColumn>Actions</TableColumn>
        </TableHeader>
        <TableBody items={sortedItems}>
          {(item) => (
            <TableRow key={item.id}>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.subregion.name}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <UpdatePlace id={item.id} />
                  <DeletePlace id={item.id} />
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
