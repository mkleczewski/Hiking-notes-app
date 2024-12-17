'use client';

import React, { useEffect, useState } from 'react';

import { useCurrentUser } from '@/hooks/use-current-user';

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
import { createPath } from '@/lib/actions/admin/paths';

import { ComboboxDemo } from './ComboBox';
import { DevTool } from '@hookform/devtools';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export const formSchema = z.object({
  commentToRoute: z.string().min(0, {
    message: 'commentToRoute must be at least 0 characters.',
  }),
  startPlace: z.string().min(2, {
    message: 'startPlace must be at least 2 characters.',
  }),
  endPlace: z.string().min(2, {
    message: 'endPlace must be at least 2 characters.',
  }),
  startToEndPoints: z.number(),
  endToStartPoints: z.number(),
});

function BasicForm({ places }: any) {
  const currentUser = useCurrentUser();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      commentToRoute: 'null',
      startPlace: '',
      endPlace: '',
      startToEndPoints: 6,
      endToStartPoints: 4,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    setIsLoading(true);
    await createPath(values);
    setIsLoading(false);
  }

  const handleSelectPlace = (name: any, fieldName: any) => {
    form.setValue(fieldName, name);
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mx-auto mt-10 flex w-full max-w-[600px] flex-col items-stretch gap-4 rounded-xl bg-white/50 p-6 shadow-md backdrop-blur-3xl"
        >
          <FormField
            control={form.control}
            name="commentToRoute"
            render={({ field }) => (
              <FormItem className="hidden">
                <FormLabel>Comment to route</FormLabel>
                <FormControl>
                  <Input placeholder="null" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="startPlace"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Miejsce początkowe</FormLabel>
                <FormControl>
                  <ComboboxDemo
                    data={places}
                    placeholder="Wybierz miejsce początkowe"
                    onSelect={(name) => handleSelectPlace(name, 'startPlace')}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endPlace"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Miejsce końcowe</FormLabel>
                <FormControl>
                  <ComboboxDemo
                    data={places}
                    placeholder="Wybierz miejsce końcowe"
                    onSelect={(name) => handleSelectPlace(name, 'endPlace')}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="startToEndPoints"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Punkty za start</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="6"
                    {...field}
                    value={field.value || ''}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endToStartPoints"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Punkty za powrót</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="4"
                    {...field}
                    value={field.value || ''}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            className="mx-auto my-6 w-full rounded-xl bg-red-500 py-2 text-white"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Wysyłanie...' : 'Wyślij'}
          </Button>
        </form>
      </Form>
      <DevTool control={form.control} />
    </>
  );
}

export default BasicForm;
