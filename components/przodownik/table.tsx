'use client';

import { Button } from '@nextui-org/react';
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/table';
import Link from 'next/link';

type UserEntry = {
  id: string;
  name: string;
  email: string;
  entryCount: number;
};

export type UnverifiedUserEntryTableProps = {
  userEntries: UserEntry[];
};

export default function UnverifiedUserEntryTable({
  userEntries,
}: UnverifiedUserEntryTableProps) {
  console.log('ból: ', userEntries);
  return (
    <div className="my-6">
      <Table isStriped aria-label="Example static collection table">
        <TableHeader>
          <TableColumn>Uytkownik</TableColumn>
          <TableColumn>Email</TableColumn>
          <TableColumn>Ilość wejść</TableColumn>
          <TableColumn>Akcja</TableColumn>
        </TableHeader>
        <TableBody>
          {userEntries.map((userEntry, index) => (
            <TableRow key={index}>
              <TableCell>{userEntry?.name}</TableCell>
              <TableCell>{userEntry?.email}</TableCell>
              <TableCell>{userEntry?.entryCount}</TableCell>
              <TableCell>
                <Button variant="shadow" color="success">
                  <Link
                    href={`/ksiazeczka/${userEntry?.id}/verify`}
                    className="font-bold"
                  >
                    Sprawdź wpisy
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
