'use client';

import { useCallback, useEffect, useState } from 'react';

import { newVerification } from '@/lib/actions/auth/new-verification';

import { FormError } from '../form-error';
import { FormSuccess } from '../form-success';
import { CardWrapper } from './card-wrapper';
import { useSearchParams } from 'next/navigation';
import { CircleLoader } from 'react-spinners';

export const NewVerificationForm = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  const onSubmit = useCallback(async () => {
    if (success || error) return;

    if (!token) {
      setError('Nie podano tokenu');
      return;
    }

    try {
      const data = await newVerification(token);
      setSuccess(data.success);
      setError(data.error);
    } catch {
      setError('Coś poszło nie tak.');
    }
  }, [token, success, error]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <CardWrapper
      headerLabel="Weryfikowanie danych..."
      backButtonLabel="Wróć do logowania"
      backButtonHref="/auth/login"
    >
      <div className="flex w-full items-center justify-center">
        {!success && !error && <CircleLoader color="#ff35ba" size={50} />}
        <FormSuccess message={success} />
        {!success && <FormError message={error} />}
      </div>
    </CardWrapper>
  );
};
