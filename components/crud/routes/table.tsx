'use client';

import { useMemo, useState } from 'react';

import { DeleteRoute, UpdateRoute } from '@/components/crud/buttons';

import {
  SortDescriptor,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/table';
import { Route } from '@prisma/client';

interface RoutesTableProps {
  routes: RouteWithPlaces[];
}

interface RouteWithPlaces extends Route {
  startPlace: {
    id: string;
    name: string;
  };
  endPlace: {
    id: string;
    name: string;
  };
}

interface SortDescriptorType {
  column: keyof RouteWithPlaces | 'startPlace' | 'endPlace';
  direction: 'ascending' | 'descending';
}

export default function RoutesTable({ routes }: RoutesTableProps) {
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptorType>({
    column: 'startPlace',
    direction: 'ascending',
  });

  const sortedItems = useMemo(() => {
    return [...routes].sort((a, b) => {
      const first =
        sortDescriptor.column === 'startPlace'
          ? a.startPlace.name
          : sortDescriptor.column === 'endPlace'
          ? a.endPlace.name
          : a[sortDescriptor.column] ?? '';
      const second =
        sortDescriptor.column === 'startPlace'
          ? b.startPlace.name
          : sortDescriptor.column === 'endPlace'
          ? b.endPlace.name
          : b[sortDescriptor.column] ?? '';
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === 'descending' ? -cmp : cmp;
    });
  }, [sortDescriptor, routes]);

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
          <TableColumn key="startPlace" allowsSorting={true}>
            Miejsce wyjścia
          </TableColumn>
          <TableColumn key="endPlace" allowsSorting={true}>
            Miejsce docelowe
          </TableColumn>
          <TableColumn key="startPointDistance" allowsSorting={true}>
            Punkty za wejście
          </TableColumn>
          <TableColumn key="endPointDistance" allowsSorting={true}>
            Punkty za zejście
          </TableColumn>
          <TableColumn>Akcja</TableColumn>
        </TableHeader>
        <TableBody items={sortedItems}>
          {(item) => (
            <TableRow key={item.id}>
              <TableCell>{item.startPlace.name}</TableCell>
              <TableCell>{item.endPlace.name}</TableCell>
              <TableCell>{item.startPointDistance}</TableCell>
              <TableCell>{item.endPointDistance ?? 'N/A'}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <UpdateRoute id={item.id} />
                  <DeleteRoute id={item.id} />
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
