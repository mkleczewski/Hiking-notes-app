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

import { createPlace } from '../../../lib/actions/places.action';
import { DevTool } from '@hookform/devtools';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { ComboboxDemo } from './ComboBox';
import { toast } from 'sonner';

const formSchema = z.object({
  placeName: z.string().min(1, {
    message: 'placeName must be at least 1 character.',
  }),
  subregionId: z.string().min(1, {
    message: 'subregionId must be at least 1 character.',
  }),
});

function PlacesForm({ subregions }: any) {
  const [places, setPlaces] = useState([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      placeName: '',
      subregionId: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
    setError(null);
    setIsLoading(true);

    try {
      const newPlace = await createPlace(values.placeName, values.subregionId);
      toast.success('Miejsce zostało dodane');
      form.reset();
      setPlaces((prevPlaces) => [...prevPlaces, newPlace]);
    } catch (error: any) {
      setError(error.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-10 flex h-fit w-full max-w-[500px] flex-col items-start gap-4 rounded-xl bg-white/50 p-6 shadow-md backdrop-blur-3xl"
        >
          <FormField
            control={form.control}
            name="placeName"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Nazwa miejsca</FormLabel>
                <FormControl>
                  <Input
                    className="w-full"
                    placeholder="Wpisz nazwę miejsca"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="subregionId"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Nazwa podregionu</FormLabel>
                <FormControl>
                  <ComboboxDemo
                    data={subregions}
                    placeholder="Wybierz podregion"
                    onSelect={(id: string) => field.onChange(id)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            className="mt-2 flex max-w-[200px] self-end justify-self-center rounded-xl bg-red-500 text-white"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Wysyłanie...' : 'Wyślij'}
          </Button>
          {error && <p style={{ color: 'red' }}>{error}</p>}{' '}
        </form>
      </Form>
      <DevTool control={form.control} />
    </>
  );
}

export default PlacesForm;
