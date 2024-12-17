import React from 'react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { regulaminData } from '@/constants/content';

export const Regulamin = () => {
  return (
    <Accordion
      className="text-dark300_light700 background-regulamin z-10  w-full rounded px-4 py-2"
      type="single"
      collapsible
    >
      {regulaminData.map((item, number) => {
        return (
          <AccordionItem key={number.toString()} value={number.toString()}>
            <AccordionTrigger>{item.title}</AccordionTrigger>
            <AccordionContent className="flex flex-col gap-2">
              {item.content.map((temp, index) => {
                return (
                  <React.Fragment key={index}>
                    <p className="ml-1 font-bold">§{temp.number}</p>

                    <p dangerouslySetInnerHTML={{ __html: temp.paragraph }} />
                  </React.Fragment>
                );
              })}
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
};
