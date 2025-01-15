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
import { createSubregion, editSubregion } from '@/lib/actions/admin/subregions';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const SubregionSchema = z.object({
  name: z.string().nonempty('Subregion name is required'),
  regionId: z.string().nonempty('Region is required'),
  code: z.string().nonempty('Code is required'),
});

interface Props {
  type?: string;
  subregionDetails?: string;
  regions?: { name: string; id: string; deletedAt: Date | null }[];
}

const SubregionForm = ({ type, subregionDetails, regions }: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const parsesubregionDetails =
    subregionDetails && JSON.parse(subregionDetails || '');

  const form = useForm<z.infer<typeof SubregionSchema>>({
    resolver: zodResolver(SubregionSchema),
    defaultValues: {
      name: parsesubregionDetails?.name || '',
      regionId: parsesubregionDetails?.regionId || '',
      code: parsesubregionDetails?.code || '',
    },
    values: {
      name: parsesubregionDetails?.name || '',
      regionId: parsesubregionDetails?.regionId || '',
      code: parsesubregionDetails?.code || '',
    },
  });

  async function onSubmit(values: z.infer<typeof SubregionSchema>) {
    setIsSubmitting(true);
    try {
      if (type === 'Edit') {
        await editSubregion({
          id: parsesubregionDetails.id,
          regionId: values.regionId,
          name: values.name,
          code: values.code,
        });
        toast.success('Podregion zmieniono pomyślnie');

        router.push(`/crud/subregions`);
      } else {
        await createSubregion({
          name: values.name,
          regionId: values.regionId,
          code: values.code,
        });
        toast.success('Podregion stworzono pomyślnie');
        router.push('/crud/subregions');
      }
    } catch (error) {
      toast.error('Nie udało się stworzyć podregionu');
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
          name="code"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="paragraph-semibold ">
                Kod <span className="text-black">*</span>
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
          name="regionId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Region</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Wybierz Region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Regiony</SelectLabel>

                      {regions?.map((region) => (
                        <SelectItem key={region.id} value={region.id}>
                          {region.name}
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
            <>{type === 'Edit' ? 'Edytuj podregion' : 'Stwórz podregion'}</>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default SubregionForm;
