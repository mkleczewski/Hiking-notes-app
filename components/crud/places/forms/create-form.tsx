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
import { createPlace, editPlace } from '@/lib/actions/admin/places';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const PlaceSchema = z.object({
  name: z.string().nonempty('Place name is required'),
  subregionId: z.string().nonempty('Subregion is required'),
});

interface Props {
  type?: string;
  placeDetails?: string;
  subregions?: { name: string; id: string; deletedAt: Date | null }[];
}

const PlaceForm = ({ type, placeDetails, subregions }: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const parseplaceDetails = placeDetails && JSON.parse(placeDetails || '');

  const form = useForm<z.infer<typeof PlaceSchema>>({
    resolver: zodResolver(PlaceSchema),
    defaultValues: {
      name: parseplaceDetails?.name || '',
      subregionId: parseplaceDetails?.subregionId || '',
    },
    values: {
      name: parseplaceDetails?.name || '',
      subregionId: parseplaceDetails?.subregionId || '',
    },
  });

  async function onSubmit(values: z.infer<typeof PlaceSchema>) {
    setIsSubmitting(true);
    try {
      if (type === 'Edit') {
        await editPlace({
					id: parseplaceDetails.id,
					subregionId: values.subregionId,
          name: values.name,
        });
        toast.success('Miejsce zmieniono pomyślnie!');

        router.push(`/crud/places`);
      } else {
        await createPlace({
          name: values.name,
          subregionId: values.subregionId,
        });
        toast.success('Miejsce stworzono pomyślnie');
        router.push('/crud/places');
      }
    } catch (error) {
      toast.error('Błąd w tworzeniu');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-2 rounded-xl bg-white/50 p-10 shadow-md backdrop-blur-3xl"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="paragraph-semibold ">
                Nazwa <span className="text-black">*</span>
              </FormLabel>
              <FormControl className="mt-3.5">
                <Input
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
          name="subregionId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Podregion</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a subregion" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Podregiony</SelectLabel>

                      {subregions?.map((subregion) => (
                        <SelectItem key={subregion.id} value={subregion.id}>
                          {subregion.name}
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
        <Button
          type="submit"
          className="primary-gradient w-fit !text-black"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>{type === 'Edit' ? 'Edycja...' : 'Tworzenie...'}</>
          ) : (
            <>{type === 'Edit' ? 'Edytuj miejsce orientacyne' : 'Stwórz miejsce orientacyne'}</>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default PlaceForm;
