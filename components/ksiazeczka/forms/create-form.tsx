'use client';
import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Uploader from '@/components/Uploader';
import { createBook, editBook } from '@/lib/actions/admin/book';
import { BookSchema, Leaders } from '@/schemas/index';

import { zodResolver } from '@hookform/resolvers/zod';
import { Route, Trip } from '@prisma/client';
import { UploadFile } from 'antd';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

interface ExtendedRoute extends Route {
  startPlace: {
    name: string;
  };
  endPlace: {
    name: string;
  };
}

interface Props {
  type?: string;
  bookDetails?: Trip;
  routes?: ExtendedRoute[];
  leaders?: Leaders;
}

const BookForm = ({ type, bookDetails, routes, leaders }: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const [files, setFiles] = useState<
    UploadFile[] | { originFileObj?: string }[]
  >(bookDetails?.images ?? []);

  const parsedDate = bookDetails?.date?.split('T')[0];
  const form = useForm<z.infer<typeof BookSchema>>({
    resolver: zodResolver(BookSchema),
    defaultValues: {
      date: parsedDate ?? '',
      routeId: String(bookDetails?.routeId) ?? '',
      leaderPresent: String(bookDetails?.leaderPresent) ?? '',
      images: bookDetails?.images ?? [],
      comment: bookDetails?.comment ?? '',
      backtracked: bookDetails?.backtracked ?? false,
    },
    values: {
      date: parsedDate ?? '',
      routeId: String(bookDetails?.routeId) ?? '',
      leaderPresent: String(bookDetails?.leaderPresent) ?? '',
      images: bookDetails?.images ?? [],
      comment: bookDetails?.comment ?? '',
      backtracked: bookDetails?.backtracked ?? false,
    },
  });

  const onFilesChange = (newFiles: UploadFile[]) => {
    setFiles(newFiles);
    const urls = newFiles
      .map((file) => file.url || file.response?.url)
      .filter((url): url is string => !!url);

    form.setValue('images', urls);
  };
  const onSubmit = form.handleSubmit(async (values) => {
    const formData = new FormData();
    formData.append('date', values.date);
    formData.append('routeId', values.routeId);
    formData.append('leaderPresent', String(values?.leaderPresent));
    formData.append('comment', values.comment ?? '');
    formData.append('backtracked', String(values?.backtracked));
    files.forEach((file) => {
      if (file.originFileObj) {
        formData.append('images', file.originFileObj);
      }
    });

    setIsSubmitting(true);
    try {
      if (type === 'Edit') {
        await editBook(formData, bookDetails?.id as string);
        toast.success('Book updated successfully');

        router.push(`/ksiazeczka`);
        router.refresh();
      } else {
        await createBook(formData);
        toast.success('Record created successfully');
        router.push('/ksiazeczka');
        router.refresh();
      }
    } catch (error) {
      toast.error('Failed to create a record');
    } finally {
      setIsSubmitting(false);
    }
  });
  return (
    <Form {...form}>
      <form
        onSubmit={onSubmit}
        className="m-5 rounded-xl p-10 shadow-md backdrop-blur-3xl"
      >
        <div className="grid w-full grid-cols-1 gap-3">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col">
                <FormLabel className="paragraph-semibold ">
                  Data <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl className="mt-3.5">
                  <Input
                    type="date"
                    className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700  border"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="routeId"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>
                  Trasa <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Wybierz trasę" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {routes?.map((route) => (
                          <SelectItem key={route.id} value={route.id}>
                            {`${route?.startPlace?.name} -> ${route?.endPlace?.name}`}
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
            name="leaderPresent"
            render={({ field }) => {
              return (
                <FormItem className="flex flex-col">
                  <FormLabel>Przodownik</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Wybierz przodownika" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {leaders?.map((leader) => (
                            <SelectItem key={leader?.id} value={leader.id}>
                              {leader?.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <FormField
            control={form.control}
            name="comment"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col">
                <FormLabel className="paragraph-semibold ">Komentarz</FormLabel>
                <FormControl className="mt-3.5">
                  <Input
                    type="text"
                    className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700  border"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Zdjęcie</FormLabel>
                <FormControl>
                  <Uploader
                    onFilesChange={(files) => {
                      field.onChange(files);
                      onFilesChange(files);
                    }}
                    defaultFiles={bookDetails?.images}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="backtracked"
            render={({ field }) => {
              return (
                <FormItem className="flex flex-col">
                  <FormLabel className="paragraph-semibold ">
                    Powrotna trasa?
                  </FormLabel>
                  <FormControl className="mt-3.5">
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              );
            }}
          />
        </div>
        <Button
          type="submit"
          className="primary-gradient mt-10 w-fit !text-black"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>{type === 'Edit' ? 'Editing...' : 'Posting...'}</>
          ) : (
            <>{type === 'Edit' ? 'Edit book' : 'Dodaj rekord'}</>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default BookForm;
