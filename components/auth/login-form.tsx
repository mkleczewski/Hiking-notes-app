'use client';

import { useState, useTransition } from 'react';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { login } from '@/lib/actions/auth/login';
import { LoginSchema } from '@/schemas/index';

import { FormError } from '../form-error';
import { FormSuccess } from '../form-success';
import { Button as SButon } from '../ui/button';
import { CardWrapper } from './card-wrapper';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input } from '@nextui-org/react';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

export const LoginForm = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);
  const searchParams = useSearchParams();

  const callbackUrl = searchParams.get('callbackUrl');

  const urlError =
    searchParams.get('error') === 'OAuthAccountNotLinked'
      ? 'Email is already in use with different provider!'
      : '';

  const [showTwoFactor, setShowTwoFactor] = useState(false);

  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError('');
    setSuccess('');

    startTransition(() => {
      login(values, callbackUrl!)
        .then((data) => {
          if (data?.error) {
            form.reset();
            setError(data?.error);
          }

          if (data?.success) {
            form.reset();
            setSuccess(data?.success);
          }

          if (data?.twoFactor) {
            setShowTwoFactor(true);
          }
        })
        .catch(() => {
          setError('Something went wrong!');
        });
    });

    form.reset;
  };
  return (
    <CardWrapper
      headerLabel="Dołącz do programu zdobywców gór."
      backButtonLabel="Nie masz jeszcze konta?"
      backButtonHref="/auth/register"
      showSocial
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            {showTwoFactor && (
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>2FA</FormLabel>
                    <FormControl>
                      <InputOTP maxLength={6} {...field}>
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                        </InputOTPGroup>
                        <InputOTPSeparator />
                        <InputOTPGroup>
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {!showTwoFactor && (
              <>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          label="E-mail"
                          type="email"
                          autoCorrect="off"
                          autoComplete="off"
                          isClearable
                          disabled={isPending}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          label="Hasło"
                          type={isVisible ? 'text' : 'password'}
                          autoCorrect="off"
                          disabled={isPending}
                          endContent={
                            <button
                              className="focus:outline-none"
                              type="button"
                              onClick={toggleVisibility}
                            >
                              {isVisible ? (
                                <EyeOff className="pointer-events-none text-2xl text-default-400" />
                              ) : (
                                <Eye className="pointer-events-none text-2xl text-default-400" />
                              )}
                            </button>
                          }
                        />
                      </FormControl>
                      <SButon variant="link" size="sm" className="px-0">
                        <Link href="/auth/reset">Zapomniałeś hasła?</Link>
                      </SButon>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
          </div>
          <FormError message={error || urlError} />
          <FormSuccess message={success} />
          <Button
            variant="shadow"
            type="submit"
            disabled={isPending}
            className="w-full bg-slate-700 text-white"
          >
            {showTwoFactor ? 'Potwierdź' : 'Zaloguj się'}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
