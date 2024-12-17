'use client';

import { Button } from '@/components/ui/button';
import { DEFAULT_LOGIN_REDIRECT } from '@/lib/auth/routes';

import { useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { FaGithub } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';

export const Social = () => {
  const searchParams = useSearchParams();

  const callbackUrl = searchParams.get('callbackUrl');

  const onClick = (provider: 'google' | 'github') => {
    signIn(provider, { callbackUrl: callbackUrl || DEFAULT_LOGIN_REDIRECT });
  };

  return (
    <div className="flex w-full items-center gap-x-2">
      <Button
        variant="outline"
        className="w-full"
        size="lg"
        onClick={() => onClick('google')}
      >
        <FcGoogle className="size-5" />
      </Button>
      <Button
        variant="outline"
        className="w-full"
        size="lg"
        onClick={() => onClick('github')}
      >
        <FaGithub className="size-5" />
      </Button>
    </div>
  );
};
