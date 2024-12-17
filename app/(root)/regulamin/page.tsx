import { Regulamin } from '@/components/sections/Regulamin';

import type { Metadata } from 'next';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export const metadata: Metadata = {
  title: 'Regulamin | GOT PTTK',
  description: 'Regulamin GOT PTTK.',
};

export default function page() {
  return (
    <div className="flex w-full flex-col justify-between gap-4 px-6 sm:flex-col sm:items-center lg:px-40">
      <h1 className="h1-bold w-full text-2xl text-black">Regulamin Serwisu</h1>
      <Accordion
        className="text-dark300_light700 background-regulamin z-10  w-full rounded px-4 py-2"
        type="single"
        collapsible
      >
        <AccordionItem value="item-1">
          <AccordionTrigger>
            Jak zdobyć status niepełnosprawnego turysty?
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-2">
            Posiadanie statusu niepełnosprawnego pozwala turyście na zdobywanie
            odznak GOT przy pomniejszonych normach punktowych. Taki status można
            uzyskać, kontaktując się z administratorem serwisu poprzez wysłanie
            maila – dane kontaktowe można znaleźć na podstronie "O nas".
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>
            Jakich odznak nie oferuje serwis?
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-2">
            Serwis obecnie nie oferuje możliwości zdobywania odznak "W góry", dużych oraz specjalnych.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <h1 className="h1-bold w-full text-2xl text-black">Regulamin GOT PTTK</h1>
      <Regulamin />
    </div>
  );
}
