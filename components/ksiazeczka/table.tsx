'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/helpers/cn';

import { DeleteRecordFromBook, UpdateBook } from '../crud/buttons';
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

export default function RecordsTable({ records = [] }: RecordsTableProps) {
  return (
    <div className="my-6">
      <Table
        isStriped
        classNames={{
          base: 'max-h-[620px] overflow-x-hidden',
          table: 'min-h-[500px] overflow-y-hidden',
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
          <TableColumn key="image">Zdjęcie dowodowe</TableColumn>
          <TableColumn>Akcja</TableColumn>
        </TableHeader>

        <TableBody>
          {records.map((item) => {
            const points = item?.backtracked
              ? item.route?.startPointDistance + item?.route?.endPointDistance
              : item.route?.startPointDistance;
            return (
              <TableRow
                key={item.id}
                className={cn(item.belongsToBadgeId && 'bg-green-500/15')}
              >
                <TableCell>{item.date}</TableCell>
                <TableCell>{item.tripNumber}</TableCell>
                <TableCell>
                  <div
                    className={cn('mb-2 flex flex-col justify-center gap-2')}
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
                  {item?.verifiedById !== null ? points : 'not verified yet'}
                </TableCell>
                <TableCell className="max-w-[80px] truncate text-nowrap">
                  <Tooltip content={item?.comment}>
                    {item?.comment ? item?.comment : '-'}
                  </Tooltip>
                </TableCell>
                <TableCell>
                  {item?.User_Trip_leaderPresentToUser?.name ?? '-'}
                </TableCell>
                <TableCell>
                  {item?.backtracked == true ? 'tak' : 'nie'}
                </TableCell>
                <TableCell>
                  {item?.images?.length > 0 ? (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline">Pokaz zdjęcie</Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Zdjęcie</DialogTitle>
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
                  <div className="flex gap-2">
                    <UpdateBook id={item.id} />
                    <DeleteRecordFromBook id={item.id} />
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
