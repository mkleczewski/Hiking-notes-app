import React from 'react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getAllRegions, getAllSubRegions } from '@/lib/actions/regions.action';

import { Mapa } from './(data)/data';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Regiony | GOT PTTK',
  description:
    'Projekt GOT PTTK to aplikacja webowa, która pozwala na zdobywanie odznak turystycznych PTTK w wersji elektronicznej.',
};
// const data: string[] = [
//   'Beskidy Zachodnie',
//   'Beskkidy Wschodnie',
//   'Góry Świętokrzyskie',
//   'Słowacja',
//   'Sudety',
//   'Tatry i Podtatrze',
//   'Tatry Słowackie',
// ];
const page = async () => {
  const regions = await getAllRegions();

  return (
    <div className="">
      <Tabs defaultValue="account" className="">
        <TabsList className="mx-auto w-full">
          {regions.map((region) => (
            <TabsTrigger key={region.name} value={region.name}>
              {region.name}
            </TabsTrigger>
          ))}
        </TabsList>
        {regions.map((region) => (
          <TabsContent key={region.name} value={region.name}>
            <Mapa name={region.name} />
          </TabsContent>
        ))}
      </Tabs>
      {/* {regions[3].name} */}
    </div>
  );
};

export default page;
