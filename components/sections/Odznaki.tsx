'use client';

import React from 'react';

import { Tabs } from '@/components/ui/tabsActeternity';
import { cn } from '@/helpers/cn';

import Image from 'next/image';

const DummyContent = ({
  badges,
}: {
  badges: { imgUrl: string; title: string }[];
}) => {
  return (
    <div className="flex h-full flex-wrap justify-center gap-2 md:gap-4">
      {badges.map((badge, index) => (
        <div key={index} className="relative flex items-center justify-center">
          <div className="rounded-xl bg-white/70  p-2 backdrop-blur transition-transform duration-300 hover:scale-105 md:p-4">
            <Image
              src={badge.imgUrl}
              alt={badge.title}
              width="400"
              height="200"
              className="w-[65px] max-w-[150px] shrink  rounded-xl object-cover xs:w-[75px] sm:w-[100px] md:w-[120px] lg:w-[150px]"
            />
            <p className="mt-2 text-center text-sm font-semibold text-black">
              {badge.title}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
const Odznaki = () => {
  const tabs = [
    {
      title: 'W góry',
      value: 'w góry',
      content: (
        <div className="relative size-full overflow-hidden rounded-2xl bg-gradient-to-br from-[#72b87d] to-[#f6f0da] p-10 text-xl font-bold text-white shadow-lg md:text-4xl">
          <p>Odznaki &quot;W góry&quot;</p>
          <DummyContent
            badges={[
              {
                imgUrl: '/assets/odznaki/w-gory-brazowa.png',
                title: 'Brązowa',
              },
              {
                imgUrl: '/assets/odznaki/w-gory-srebrna.png',
                title: 'Srebrna',
              },
              {
                imgUrl: '/assets/odznaki/w-gory-zlota.png',
                title: 'Złota',
              },
            ]}
          />{' '}
        </div>
      ),
    },
    {
      title: 'Popularna',
      value: 'popularna',
      content: (
        <div className="relative size-full rounded-2xl bg-gradient-to-br from-[#72b87d] to-[#f6f0da] p-10 text-xl font-bold text-white shadow-lg md:text-4xl">
          <p>Popularna Odznaka</p>
          <DummyContent
            badges={[
              {
                imgUrl: '/assets/odznaki/popularna.png',
                title: 'Popularna',
              },
            ]}
          />
        </div>
      ),
    },
    {
      title: 'Małe',
      value: 'małe',
      content: (
        <div className="relative size-full overflow-hidden rounded-2xl bg-gradient-to-br from-[#72b87d] to-[#f6f0da] p-10 text-xl font-bold text-white shadow-lg md:text-4xl">
          <p>Małe odznaki</p>
          <DummyContent
            badges={[
              {
                imgUrl: '/assets/odznaki/mala-brazowa.png',
                title: 'Brązowa',
              },
              {
                imgUrl: '/assets/odznaki/mala-srebrna.png',
                title: 'Srebrna',
              },
              {
                imgUrl: '/assets/odznaki/mala-zlota.png',
                title: 'Złota',
              },
            ]}
          />{' '}
        </div>
      ),
    },
    {
      title: 'Duże',
      value: 'duże',
      content: (
        <div className="relative size-full  overflow-hidden  rounded-2xl bg-gradient-to-br from-[#72b87d] to-[#f6f0da] p-10 text-xl font-bold text-white shadow-lg md:text-4xl">
          <p>Duże odznaki</p>
          <DummyContent
            badges={[
              {
                imgUrl: '/assets/odznaki/duza-brazowa.png',
                title: 'Brązowa',
              },
              {
                imgUrl: '/assets/odznaki/duza-srebrna.png',
                title: 'Srebrna',
              },
              {
                imgUrl: '/assets/odznaki/duza-zlota.png',
                title: 'Złota',
              },
            ]}
          />{' '}
        </div>
      ),
    },

    {
      title: 'Specjalne',
      value: 'specjalne',
      numberOfBadges: 4,
      content: (
        <div className="relative size-full rounded-2xl bg-gradient-to-br from-[#72b87d] to-[#f6f0da] p-10 text-xl font-bold text-white shadow-lg md:text-4xl">
          <p>Specjalne odznaki</p>
          <DummyContent
            badges={[
              {
                imgUrl: '/assets/odznaki/za-wytrwalosc.png',
                title: 'Za wytrwałość',
              },
              {
                imgUrl: '/assets/odznaki/przodownik.png',
                title: 'Przodownik',
              },
              {
                imgUrl: '/assets/odznaki/honorowy-przewodnik.png',
                title: 'Honorowy przewodnik',
              },
            ]}
          />
        </div>
      ),
    },
  ];

  return (
    <div
      className={cn(
        'mx-auto mb-40 flex h-[20rem] w-full max-w-4xl flex-col items-start justify-start [perspective:1000px] md:h-[30rem]'
      )}
    >
      <Tabs tabs={tabs} />
    </div>
  );
};
export default Odznaki;
