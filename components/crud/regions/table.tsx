'use client';

import { DeleteRegion, UpdateRegion } from '@/components/crud/buttons';

import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/table';
import { Region } from '@prisma/client';

export default function RegionsTable({ regions }: { regions: Region[] }) {
  return (
    <div className="my-6">
      <Table isStriped aria-label="Example static collection table">
        <TableHeader>
          <TableColumn>Nazwa</TableColumn>
          <TableColumn>Akcja</TableColumn>
        </TableHeader>
        <TableBody>
          {regions.map((region) => (
            <TableRow key={region.name}>
              <TableCell>{region.name}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <UpdateRegion id={region.id} />
                  <DeleteRegion id={region.id} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
