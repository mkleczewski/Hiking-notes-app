'use client';
import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createRoute, editRoute } from '@/lib/actions/admin/routes';

import { zodResolver } from '@hookform/resolvers/zod';
import { code } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const RouteSchema = z.object({
  startPlaceId: z.string().nonempty('Start place is required'),
  endPlaceId: z.string().nonempty('End place is required'),
  startPointDistance: z.coerce.number().min(0, 'Distance is required'),
  endPointDistance: z.coerce.number().min(0, 'End distance is required'),
});

interface Props {
  type?: string;
  routeDetails?: string;
  places?: { name: string; id: string; deletedAt: Date | null }[];
}

const RouteForm = ({ type, routeDetails, places }: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const parseRouteDetails = routeDetails && JSON.parse(routeDetails || '');

  const form = useForm<z.infer<typeof RouteSchema>>({
    resolver: zodResolver(RouteSchema),
    defaultValues: {
      startPlaceId: parseRouteDetails?.startPlaceId ?? '',
      endPlaceId: parseRouteDetails?.endPlaceId ?? '',
      startPointDistance: parseRouteDetails?.startPointDistance ?? 0,
      endPointDistance: parseRouteDetails?.endPointDistance ?? 0,
    },
    values: {
      startPlaceId: parseRouteDetails?.startPlaceId ?? '',
      endPlaceId: parseRouteDetails?.endPlaceId ?? '',
      startPointDistance: parseRouteDetails?.startPointDistance ?? 0,
      endPointDistance: parseRouteDetails?.endPointDistance ?? 0,
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setIsSubmitting(true);
    try {
      if (type === 'Edit') {
        await editRoute({
          id: parseRouteDetails.id,
          startPlaceId: values.startPlaceId,
          endPlaceId: values.endPlaceId,
          startPointDistance: values.startPointDistance,
          endPointDistance: values.endPointDistance,
        });
        toast.success('Ścieżka zmieniona pomyślnie');

        router.push(`/crud/routes`);
      } else {
        await createRoute({
          startPlaceId: values.startPlaceId,
          endPlaceId: values.endPlaceId,
          startPointDistance: values.startPointDistance,
          endPointDistance: values.endPointDistance,
        });
        toast.success('Ścieżka dodana pomyślnie');
        router.push('/crud/routes');
      }
    } catch (error) {
      toast.error('Błąd podczas tworzenia ścieżki');
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <Form {...form}>
      <form
        onSubmit={onSubmit}
        className="flex w-full flex-col gap-2 rounded-xl bg-white/50 p-10 shadow-md backdrop-blur-3xl"
      >
        <FormField
          control={form.control}
          name="startPlaceId"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel>Miejsce rozpoczęcia trasy</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Wybierz miejsce początkowe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Miejsca</SelectLabel>
                      {places?.map((place) => (
                        <SelectItem key={place.id} value={place.id}>
                          {place.name}
                        </SelectItem>
                      ))}
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
          name="endPlaceId"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel>Miejsce zakończenia trasy</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Wybierz miejsce końcowe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Miejsca</SelectLabel>
                      {places?.map((place) => (
                        <SelectItem key={place.id} value={place.id}>
                          {place.name}
                        </SelectItem>
                      ))}
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
          name="startPointDistance"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel>Punkty za wejście</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  defaultValue={0}              
                  className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] border"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="endPointDistance"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel>Punkty za zejście</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  defaultValue={0}
                  className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] border"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="primary-gradient w-fit !text-black"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>{type === 'Edit' ? 'Edycja...' : 'Dodawanie...'}</>
          ) : (
            <>{type === 'Edit' ? 'Edytuj szlak' : 'Stwórz szlak'}</>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default RouteForm;
