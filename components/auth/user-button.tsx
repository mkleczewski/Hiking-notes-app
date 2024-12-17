'use client';

import { useState } from 'react';

import { useCurrentUser } from '@/hooks/use-current-user';

import { LoginButton } from '@/components/auth/login-button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button as ShadcnButton } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { logout } from '@/lib/actions/auth/logout';

import { Button } from '@nextui-org/button';
import { ExitIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import { FaUser, FaUserFriends } from 'react-icons/fa';

export const UserButton = () => {
  const user = useCurrentUser();
  const [closeDropdown, setCloseDropdown] = useState(false);

  if (!user) {
    return <LoginButton className="w-1/2">Zaloguj się</LoginButton>;
  }

  const onClick = () => {
    logout();
  };

  return (
    <DropdownMenu
      open={closeDropdown}
      onOpenChange={() => setCloseDropdown(!closeDropdown)}
      modal={false}
    >
      <DropdownMenuTrigger className="focus-visible:outline-none">
        <Avatar>
          <AvatarImage src={user.image ?? ''} />
          <AvatarFallback className="bg-gradient-to-b from-gray-700 via-gray-900 to-black text-white">
            <FaUser />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-72 bg-white" align="center">
        <DropdownMenuLabel>
          <div className="rounded-md px-4 py-2">
            <div>
              <h4 className="text-lg font-semibold tracking-tight">
                {user.name}
              </h4>
              <h4 className="mt-0 text-xs font-light">{user.email}</h4>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => setCloseDropdown(!close)}
          className="cursor-pointer"
        >
          <ShadcnButton
            className="ml-2 flex w-full gap-3"
            variant={'secondary'}
          >
            <FaUserFriends className="size-4" />
            <Link className="w-full text-left font-semibold" href={'/profil'}>
              Profil
            </Link>
          </ShadcnButton>
        </DropdownMenuItem>
        {user?.roles?.includes('ADMIN') && (
          <DropdownMenuItem
            onClick={() => setCloseDropdown(!close)}
            className="cursor-pointer"
          >
            <Button className="ml-2 flex w-full gap-3" color="warning">
              <FaUserFriends className="size-4" />
              <Link
                className="w-full text-left font-semibold"
                href={'/crud/regions'}
              >
               Administracja
              </Link>
            </Button>
          </DropdownMenuItem>
        )}
        {user?.roles?.includes('REFERAT') && (
          <DropdownMenuItem
            onClick={() => setCloseDropdown(!close)}
            className="cursor-pointer"
          >
            <Button className="ml-2 flex w-full gap-3" color="warning">
              <FaUserFriends className="size-4" />
              <Link
                className="w-full text-left font-semibold"
                href={'/referat'}
              >
                Referat
              </Link>
            </Button>
          </DropdownMenuItem>
        )}
        {user?.roles?.includes('PRZODOWNIK') && (
          <DropdownMenuItem
            onClick={() => setCloseDropdown(!close)}
            className="cursor-pointer"
          >
            <Button className="ml-2 flex w-full gap-3" color="warning">
              <FaUserFriends className="size-4" />
              <Link
                className="w-full text-left font-semibold"
                href={'/przodownik'}
              >
                Przodownik
              </Link>
            </Button>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem className="my-3 cursor-pointer">
          <Button
            onClick={onClick}
            variant="shadow"
            color="danger"
            className="ml-2 w-full"
          >
            <ExitIcon className="size-4" />
            <span className="w-full text-left font-semibold">Wyloguj się</span>
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
