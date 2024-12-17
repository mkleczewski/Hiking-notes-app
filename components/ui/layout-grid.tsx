'use client';
import React from 'react';

import { cn } from '@/lib/utils';

import Image from 'next/image';
import Link from 'next/link';

type Card = {
  id: number;
  className: string;
  thumbnail: string;
  href?: string;
  name?: string;
};

export const LayoutGrid = ({ cards }: { cards: Card[] }) => {
  return (
    <div className="relative mx-auto grid size-full max-w-7xl grid-cols-1 gap-4 p-10 md:grid-cols-3">
      {cards.map((card, i) => (
        <div key={i} className={cn(card.className, '')}>
          <div
            className={cn(
              card.className,
              'relative  flex h-full w-full items-center justify-center overflow-hidden rounded-xl'
            )}
          >
            <Link
              href={card.href ?? '/'}
              className="z-10 flex size-full items-center justify-center bg-black/40 text-[32px] text-white drop-shadow-2xl transition-transform hover:scale-125 hover:bg-transparent"
            >
              {card?.name}
            </Link>
            <ImageComponent card={card} />
          </div>
        </div>
      ))}
    </div>
  );
};

const ImageComponent = ({ card }: { card: Card }) => {
  return (
    <Image
      src={card.thumbnail}
      height="500"
      width="500"
      className={cn(
        'absolute inset-0 h-full w-full object-cover object-top transition duration-200'
      )}
      alt="thumbnail"
    />
  );
};
