'use client';
import React, { useRef, useState } from 'react';

import { adminLinks } from '@/constants/index';
import { cn } from '@/helpers/cn';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';

gsap.registerPlugin(useGSAP);
// import { SignedOut, useAuth } from '@clerk/nextjs';
import { ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
const LeftSidebar = () => {
  // const { userId } = useAuth();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const animationRef = useRef<GSAPAnimation | null>(null);

  const onSidebarTrigger = () => {
    if (!animationRef.current) {
      animationRef.current = gsap.to('#sidebar', {
        duration: 1,
        x: isOpen ? 0 : -233,
        ease: 'expo.inOut',
        paused: true,
      });
    }

    if (isOpen) {
      animationRef.current.reverse();
    } else {
      animationRef.current.play();
    }

    setIsOpen(!isOpen);
  };
  return (
    <section
      id="sidebar"
      className="background-light900_dark200 light-border custom-scrollbar fixed left-0 top-0 z-30 flex h-screen flex-col justify-between overflow-y-auto border-r p-6 pt-24 shadow-light-300 backdrop-blur-xl max-sm:hidden lg:w-[266px] dark:shadow-none"
    >
      <p className='mb-10 w-full rounded-xl bg-white/10 text-center text-lg font-semibold text-white'>CRUD</p>
      <button
        className={cn(
          'absolute right-0 top-0 hidden h-[100vh] px-1 hover:cursor-pointer hover:bg-black/10 lg:block',
          isOpen && 'bg-black/5 backdrop-blur-xl transition-colors duration-300'
        )}
        onClick={onSidebarTrigger}
      >
        <p
          className={cn(
            'font-bold text-black hover:scale-110'
          )}
        >
          <ChevronRight
            className={cn(
              'rotate-180 text-white',
              isOpen && 'rotate-0'
            )}
          />
        </p>
      </button>
      <div className="flex flex-1 flex-col gap-5">
        {adminLinks.map((item) => {
          const isActive =
            (pathname.includes(item.route) && item.route.length > 1) ||
            pathname === item.route;

          if (item.route === '/profile') {
            // if (userId) {
            //   item.route = `${item.route}/${userId}`;
            // } else {
            //   return null;
            // }
          }

          return (
            <Link
              key={item.route}
              href={item.route}
              className={cn(
                isActive
                  ? 'primary-gradient rounded-lg text-black'
                  : 'text-dark300_light900',
                'flex items-center justify-start gap-4 bg-transparent p-4'
              )}
            >
              {typeof item.imgURL === 'string' ? (
                // Renderowanie obrazu, gdy `imgURL` jest adresem URL
                <Image
                  src={item.imgURL}
                  alt={item.label}
                  width={20}
                  height={20}
                  className={cn(isActive ? 'invert' : 'invert-colors')}
                />
              ) : (
                // Renderowanie komponentu, gdy `imgURL` jest funkcją zwracającą komponent React
                <span>{item.imgURL}</span>
              )}

              <p
                className={cn(
                  isActive ? 'base-bold' : 'base-medium',
                  'max-lg:hidden'
                )}
              >
                {item.label}
              </p>
            </Link>
          );
        })}
      </div>
      {/* <SignedOut>
        <div className="flex flex-col gap-3">
          <Link href="/sign-in">
            <Button
              className="small-medium btn-secondary 
                        min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none"
            >
              <Image
                src="/assets/icons/account.svg"
                alt="login"
                width={20}
                height={20}
                className="invert-colors lg:hidden"
              />
              <span className="primary-text-gradient max-lg:hidden">
                Log In
              </span>
            </Button>
          </Link>

          <Link href="/sign-up">
            <Button
              className="small-medium light-border-2 btn-tertiary 
                        text-dark400_light900 min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none"
            >
              <Image
                src="/assets/icons/sign-up.svg"
                alt="sign up"
                width={20}
                height={20}
                className="invert-colors lg:hidden"
              />
              <span className="max-lg:hidden">Sign up</span>{' '}
            </Button>
          </Link>
        </div>
      </SignedOut> */}
    </section>
  );
};

export default LeftSidebar;
