'use client';

import { useEffect, useState } from 'react';

import { VerifyEntry } from '@/components/crud/buttons';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/helpers/cn';

import { Tooltip } from '@nextui-org/react';
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/table';
import { Trip } from '@prisma/client';
import { IconArrowDown } from '@tabler/icons-react';
import { MapPin } from 'lucide-react';
import Image from 'next/image';

interface RecordsTableProps {
  records: Trip[];
}

export default function VerifyTable({ records = [] }: RecordsTableProps) {
  const [showUnverifiedOnly, setShowUnverifiedOnly] = useState(false);
  const [filteredRecords, setFilteredRecords] = useState(records);

  // Check for duplicate routes within the same current badge
  useEffect(() => {
    // Replace 'currentBadgeId' with the actual current badge ID
    const currentBadgeId = 'currentBadgeId';
    const routeSet = new Set();
    const duplicates = [];

    records.forEach((record) => {
      if (record.badgeId === currentBadgeId) {
        const routeKey = record.routeId;
        if (routeSet.has(routeKey)) {
          duplicates.push(record);
        } else {
          routeSet.add(routeKey);
        }
      }
    });

    if (duplicates.length > 0) {
      alert('There are duplicate routes within the current badge.');
    }
  }, [records]);

  // Filter records based on the checkbox
  useEffect(() => {
    if (showUnverifiedOnly) {
      setFilteredRecords(
        records.filter((record) => record.verifiedById === null)
      );
    } else {
      setFilteredRecords(records);
    }
  }, [showUnverifiedOnly, records]);

  return (
    <div className="my-6 h-[300px]">
      <div className="mb-4 flex items-center">
        <input
          id="showUnverifiedOnly"
          type="checkbox"
          checked={showUnverifiedOnly}
          onChange={() => setShowUnverifiedOnly(!showUnverifiedOnly)}
          className="mr-2"
        />
        <label htmlFor="showUnverifiedOnly">
          Pokaż tylko niezweryfikowane wpisy
        </label>
      </div>

      <Table
        isStriped
        classNames={{
          base: 'h-[320px] overflow-x-hidden',
          table: 'h-[200px] overflow-y-hidden',
        }}
        aria-label="Hiking Log Table"
      >
        <TableHeader>
          <TableColumn key="date">Data</TableColumn>
          <TableColumn key="tripNumber">Numer wyprawy</TableColumn>
          <TableColumn key="route">Trasa</TableColumn>
          <TableColumn key="points">Punkty</TableColumn>
          <TableColumn key="comment">Komentarz</TableColumn>
          <TableColumn key="leaderPresent">Przodownik</TableColumn>
          <TableColumn key="backtracked">Czy zejście</TableColumn>
          <TableColumn key="image">Zdjęcie</TableColumn>
          <TableColumn>Akcja</TableColumn>
        </TableHeader>

        <TableBody>
          {filteredRecords.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.date}</TableCell>
              <TableCell>{item.tripNumber}</TableCell>
              <TableCell>
                <div
                  className={cn(
                    'mb-2 flex flex-col justify-center gap-2',
                    item?.backtracked && 'flex-col-reverse'
                  )}
                >
                  <div className="flex items-center">
                    <MapPin className="mr-1" size={16} />
                    <span className="text-sm">
                      {item?.route?.startPlace?.name}
                    </span>
                  </div>
                  <IconArrowDown />
                  <div className="flex items-center">
                    <MapPin className="mr-1" size={16} />
                    <span className="text-sm">
                      {item?.route?.endPlace?.name}
                    </span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                {item.verifiedById !== null
                  ? item.backtracked
                    ? item.route?.endPointDistance
                    : item.route?.startPointDistance
                  : 'not verified yet'}
              </TableCell>
              <TableCell className="max-w-[80px] truncate text-nowrap">
                <Tooltip content={item?.comment}>
                  {item?.comment ? item?.comment : '-'}
                </Tooltip>
              </TableCell>
              <TableCell>
                {item?.User_Trip_leaderPresentToUser?.name ?? '-'}
              </TableCell>
              <TableCell>{item?.backtracked == true ? 'tak' : 'nie'}</TableCell>
              <TableCell>
                {item?.images?.length > 0 ? (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline">Pokaz zdjęcie</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Zdjęcie dowodowe</DialogTitle>
                      </DialogHeader>
                      <Image
                        src={item?.images[0] ?? ''}
                        width={400}
                        height={400}
                        alt="image"
                      />
                    </DialogContent>
                  </Dialog>
                ) : (
                  '-'
                )}
              </TableCell>
              <TableCell>
                {!item.verifiedById && (
                  <div className="flex gap-2">
                    <VerifyEntry id={item.id} />
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
