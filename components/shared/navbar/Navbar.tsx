'use client';

import React from 'react';

import { UserButton } from '@/components/auth/user-button';

import { UnderlineSvg } from '@/components/icons/Icon';
import { sidebarLinks } from '@/constants/index';
import { cn } from '@/helpers/cn';
import logo from '@/public/assets/images/logo.png';

import MobileNav from './MobileNav';
import Theme from './Theme';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
const Navbar = () => {
  // const { userId } = useAuth();

  const pathname = usePathname();
  return (
    <nav className="flex-between background-light900_dark200 fixed z-40 max-h-[80px] w-full gap-5 p-6 py-3 shadow-light-300 backdrop-blur-lg sm:px-12 dark:shadow-none">
      <Link href="/" className="flex items-center gap-1">
        <Image src={logo} width={30} height={30} alt="GOT PTTK" />
        <p className="h2-bold font-spaceGrotesk text-dark-100 max-sm:hidden dark:text-light-900">
          GOT <span className="text-primary-500">PTTK</span>
        </p>
      </Link>
      <div className="hidden lg:flex">
        {sidebarLinks.map((item) => {
          const isActive =
            (pathname.includes(item.route) && item.route.length > 1) ||
            pathname === item.route;
          return (
            <Link
              key={item.route}
              href={item.route}
              className={cn(
                'text-dark300_light900 mx-[12px]',
                'flex items-center justify-start gap-4 bg-transparent p-4'
              )}
            >
              <div
                className={cn(
                  'relative hover:text-dark-100 dark:hover:text-white',
                  isActive
                    ? 'base-semibold text-[#222] dark:text-white'
                    : 'font-normal',
                  'max-lg:hidden'
                )}
              >
                {item.label}
                {isActive && (
                  <UnderlineSvg
                    // width={200}
                    // height="10"
                    className="absolute top-4"
                  />
                )}
              </div>
            </Link>
          );
        })}
      </div>
      <div className="flex-between gap-5">
        <Theme />
        <UserButton />
        <MobileNav />
      </div>
    </nav>
  );
};

export default Navbar;
