'use client';

import { useState, useTransition } from 'react';

import { FormError } from '@/components/form-error';
import { FormSuccess } from '@/components/form-success';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { settings } from '@/lib/actions/auth/settings';
import { SettingsSchema } from '@/schemas/index';
import { ExtendedUser } from '@/types/next-auth';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/react';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const Settings = ({ user }: { user: ExtendedUser }) => {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const { update } = useSession();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof SettingsSchema>>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      name: `${user?.name}` || undefined,
      email: `${user?.email}` || undefined,
      password: undefined,
      newPassword: undefined,
      role: user?.role || undefined,
      isTwoFactorEnabled: user?.isTwoFactorEnabled || undefined,
    },
  });

  const onSubmit = (values: z.infer<typeof SettingsSchema>) => {
    startTransition(() => {
      settings(values)
        .then((data) => {
          if (data.error) {
            setError(data.error);
          }

          if (data.success) {
            update();
            setSuccess(data.success);
          }
        })
        .catch(() => setError('Something went wrong!'));
    });
  };

  return (
    <section className="mx-auto flex w-1/2 bg-white/80 backdrop-blur-xl">
      <Card className="flex w-full flex-col justify-between border-none shadow-lg">
        <CardHeader>
          <p className="text-center text-2xl font-semibold">⚙️ Ustawienia</p>
        </CardHeader>
        <Separator />
        <CardContent className="mt-4">
          <Form {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          label="Imię"
                          disabled={isPending}
                          autoComplete="off"
                          autoCorrect="off"
                          autoCapitalize="on"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {user?.isOAuth === false && (
                  <>
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="email"
                              {...field}
                              label="E-mail"
                              disabled={isPending}
                              autoComplete="off"
                              autoCorrect="off"
                              autoCapitalize="on"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                {user?.isOAuth === false && (
                  <>
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="password"
                              {...field}
                              label="Hasło"
                              disabled={isPending}
                              autoComplete="off"
                              autoCorrect="off"
                              autoCapitalize="on"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                {user?.isOAuth === false && (
                  <>
                    <FormField
                      control={form.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="password"
                              {...field}
                              label="Nowe hasło"
                              disabled={isPending}
                              autoComplete="off"
                              autoCorrect="off"
                              autoCapitalize="on"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
                {user?.isOAuth === false && (
                  <>
                    <FormField
                      control={form.control}
                      name="isTwoFactorEnabled"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                          <div className="space-y-0.5">
                            <FormLabel>2FA</FormLabel>
                            <FormDescription>
                              Włącz dwuetapowe uwierzytelnianie
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              disabled={isPending}
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </>
                )}
              </div>
              <FormError message={error} />
              <FormSuccess message={success} />
              <Button
                disabled={isPending}
                className="w-full"
                size="lg"
                type="submit"
              >
                Zapisz
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </section>
  );
};

export default Settings;
