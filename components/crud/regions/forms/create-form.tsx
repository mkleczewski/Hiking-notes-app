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
import { createRegion, editRegion } from '@/lib/actions/admin/regions';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const RegionSchema = z.object({
  name: z.string().nonempty('Region name is required'),
});

interface Props {
  type?: string;
  regionDetails?: string;
}

const RegionForm = ({ type, regionDetails }: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const parseregionDetails = regionDetails && JSON.parse(regionDetails || '');

  const form = useForm<z.infer<typeof RegionSchema>>({
    resolver: zodResolver(RegionSchema),
    defaultValues: {
      name: parseregionDetails?.name || '',
    },
    values: {
      name: parseregionDetails?.name || '',
    },
  });

  async function onSubmit(values: z.infer<typeof RegionSchema>) {
    setIsSubmitting(true);
    try {
      if (type === 'Edit') {
        await editRegion({
          id: parseregionDetails.id,
          name: values.name,
        });
        toast.success('Region stworzono pomyślnie');

        router.push(`/crud/regions`);
      } else {
        await createRegion({
          name: values.name,
        });
        toast.success('Region zmieniono pomyślnie');
        router.push('/crud/regions');
      }
    } catch (error) {
      toast.error('Nie utworzono regionu');
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
        <Button
          type="submit"
          className="primary-gradient w-fit !text-black"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>{type === 'Edit' ? 'Edycja...' : 'Dodawanie...'}</>
          ) : (
            <>{type === 'Edit' ? 'Edytuj Region' : 'Stwórz Region'}</>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default RegionForm;
