'use client';

import { useMemo, useState } from 'react';

import { DeleteSubregion, UpdateSubregion } from '@/components/crud/buttons';

import {
  SortDescriptor,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/table';
import { Subregion } from '@prisma/client';

interface SubregionsTableProps {
  subregions: SubregionWithRegion[];
}

interface SubregionWithRegion extends Subregion {
  region: {
    id: string;
    name: string;
    deletedAt: string | null;
  };
}

interface SortDescriptorType {
  column: keyof SubregionWithRegion | 'region';
  direction: 'ascending' | 'descending';
}

export default function SubregionsTable({ subregions }: SubregionsTableProps) {
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptorType>({
    column: 'name',
    direction: 'ascending',
  });

  const sortedItems = useMemo(() => {
    return [...subregions].sort((a, b) => {
      const first =
        sortDescriptor.column === 'region'
          ? a.region.name
          : a[sortDescriptor.column] ?? '';
      const second =
        sortDescriptor.column === 'region'
          ? b.region.name
          : b[sortDescriptor.column] ?? '';
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === 'descending' ? -cmp : cmp;
    });
  }, [sortDescriptor, subregions]);

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
        aria-label="Subregions Table with sorting"
      >
        <TableHeader>
          <TableColumn key="name" allowsSorting={true}>
            Nazwa
          </TableColumn>
          <TableColumn key="code" allowsSorting={true}>
            Kod
          </TableColumn>
          <TableColumn key="region" allowsSorting={true}>
            Region
          </TableColumn>
          <TableColumn>Akcja</TableColumn>
        </TableHeader>
        <TableBody items={sortedItems}>
          {(item) => (
            <TableRow key={item.id}>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.code}</TableCell>
              <TableCell>{item.region.name}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <UpdateSubregion id={item.id} />
                  <DeleteSubregion id={item.id} />
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
