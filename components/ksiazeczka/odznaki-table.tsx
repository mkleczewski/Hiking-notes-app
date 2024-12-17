'use client';

import { useEffect, useState } from 'react';

import { getUserById } from '@/lib/data/user';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { odznaki } from '@/constants/odznaki';
import { cn } from '@/helpers/cn';
import { assignBadge } from '@/lib/actions/odznaki/odznaki';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
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
import { useRouter } from 'next/navigation';
import { getSession, useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Checkbox } from '../ui/checkbox';

interface RecordsTableProps {
  records: (Trip & {
    route?: {
      startPointDistance: number;
      endPointDistance: number;
      startPlace?: { name: string };
      endPlace?: { name: string };
    };
    images?: string[];
    User_Trip_leaderPresentToUser?: { name: string };
  })[];
  userId: string;
  badgesForForm: { id: string; title: string; pointsRequired: number }[];
}

export default function OdznakiTable({
  records = [],
  userId,
  badgesForForm,
}: RecordsTableProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const session = useSession();
  const actualUserId = session?.data?.user?.id;
  const [showUnverifiedOnly, setShowUnverifiedOnly] = useState(false);
  const [filteredRecords, setFilteredRecords] = useState(records);

  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectedPoints, setSelectedPoints] = useState<number>(0);

  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
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

  useEffect(() => {
    if (showUnverifiedOnly) {
      setFilteredRecords(
        records.filter((record) => record.verifiedById !== null)
      );
    } else {
      setFilteredRecords(records);
    }
  }, [showUnverifiedOnly, records]);

  const getPoints = (item: any) => {
    if (item?.verifiedById === null) return null;
    const points = item?.backtracked
      ? item.route?.startPointDistance + item.route?.endPointDistance
      : item.route?.startPointDistance;
    return points;
  };

  const handleCheckChange = (
    id: string,
    points: number | null,
    checked: boolean
  ) => {
    if (points === null) return;

    if (checked) {
      setSelectedItems((prev) => [...prev, id]);
      setSelectedPoints((prev) => prev + points);
    } else {
      setSelectedItems((prev) => prev.filter((itemId) => itemId !== id));
      setSelectedPoints((prev) => prev - points);
    }
  };

  const form = useForm({
    defaultValues: {
      badgeTitle: '',
      useUnusedPoints: false,
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setIsSubmitting(true);
    try {
      await assignBadge({
        userId: userId,
        badgeId: values.badgeTitle,
        selectedPoints: selectedPoints,
        selectedItems: selectedItems,
        referatId: actualUserId,
        useUnusedPoints: values.useUnusedPoints,
      });

      toast('Odznaka przydzielona');
      router.push(`/referat`);
    } catch (error) {
      toast('Nie udało się przydzielić odznaki');
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <div className="my-6">
      <div className="mb-4 flex items-center">
        <input
          id="showUnverifiedOnly"
          type="checkbox"
          checked={showUnverifiedOnly}
          onChange={() => setShowUnverifiedOnly(!showUnverifiedOnly)}
          className="mr-2"
        />
        <label htmlFor="showUnverifiedOnly">Pokaż tylko wpisy z punktami</label>
      </div>

      <Table
        isStriped
        classNames={{
          base: 'max-h-[360px] overflow-x-hidden',
        }}
        aria-label="Hiking Log Table"
      >
        <TableHeader>
          <TableColumn key="select">Select</TableColumn>
          <TableColumn key="date">Data</TableColumn>
          <TableColumn key="tripNumber">Numer wyprawy</TableColumn>
          <TableColumn key="route">Trasa</TableColumn>
          <TableColumn key="points">Punkty</TableColumn>
          <TableColumn key="comment">Komentarz</TableColumn>
          <TableColumn key="leaderPresent">Przodownik</TableColumn>
          <TableColumn key="backtracked">Cze zejście</TableColumn>
          <TableColumn key="image">Zdjęcie dowodowe</TableColumn>
        </TableHeader>

        <TableBody>
          {filteredRecords.map((item) => {
            const points = getPoints(item);
            const isSelected = selectedItems.includes(item.id);
            return (
              <TableRow key={item.id}>
                <TableCell>
                  {points !== null && (
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) =>
                        handleCheckChange(item.id, points, e.target.checked)
                      }
                    />
                  )}
                </TableCell>
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
                  {item.verifiedById !== null ? points : 'not verified yet'}
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
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-lg font-medium">
          Suma zaznaczonych punktów: {selectedPoints}
        </div>

        <Dialog open={openModal} onOpenChange={setOpenModal}>
          <DialogTrigger asChild>
            <Button disabled={selectedPoints === 0}>Przydziel odznakę</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Wybierz odznakę za {selectedPoints} punktów
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={onSubmit}
                className="flex w-full flex-col gap-4 p-4"
              >
                <FormField
                  control={form.control}
                  name="badgeTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Odznaka</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Wybierz odznakę" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Odznaki</SelectLabel>

                              {badgesForForm.length > 0 ? (
                                badgesForForm.map((item) => (
                                  <SelectItem
                                    key={item.id}
                                    value={String(item.id)}
                                    disabled={
                                      item.pointsRequired > selectedPoints
                                    }
                                  >
                                    {item.title} ({item.pointsRequired})
                                  </SelectItem>
                                ))
                              ) : (
                                <p className="text-center">Za mało punktów</p>
                              )}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="useUnusedPoints"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={(checked) =>
                              field.onChange(!!checked)
                            }
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-medium leading-none">
                          Użyj niezużytych punktów
                        </FormLabel>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Przydzielanie...' : 'Zatwierdź'}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
