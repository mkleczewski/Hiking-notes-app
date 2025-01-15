import { FC } from 'react';
import { ComponentPropsWithoutRef } from 'react';

import {
  BeskidyWschodnieMapAndArea,
  BeskidyZachodnieMapAndArea,
  // TatrySlowackieMapAndArea,
  // SlowacjaMapAndArea,
  BrakMapAndArea,
  // GorySwietokrzyskieMapAndArea,
  SudetyMapAndArea,
  TatryPodtatrzeMapAndArea,
} from '@/components/SubRegion/SubRegionMapArea';
import { cn } from '@/helpers/cn';
import { getAllSubRegions } from '@/lib/actions/regions.action';

interface MapaProps extends ComponentPropsWithoutRef<'div'> {
  name: string;
}

export const Mapa: FC<MapaProps> = async ({ className, name }) => {
  const regions = await getAllSubRegions();
  const newRegions = regions
    .filter((region) => region.name === name)
    .sort(
      (a, b) =>
        parseInt(a.subRegionCode.split('.')[1]) -
        parseInt(b.subRegionCode.split('.')[1])
    );

  // TODO: trzeba naprawić nazwy regionów w bazie danych i zmienić case'y w tym switch'u
  const SubRegionContent = () => {
    switch (name) {
      case 'Beskidy Zachodnie':
        return <BeskidyZachodnieMapAndArea />;
      case 'Beskidy Wschodnie':
        return <BeskidyWschodnieMapAndArea />;
      // case 'Góry Świętokrzyskie':
      //   return <GorySwietokrzyskieMapAndArea />;
      case 'Sudety':
        return <SudetyMapAndArea />;
      case 'Tatry i Podtatrze':
        return <TatryPodtatrzeMapAndArea />;
      // case 'Tatry Słowackie':
      //   return <TatrySlowackieMapAndArea />;
      // case 'Słowacjaa':
      //   return <SlowacjaMapAndArea />;
      default:
        return <BrakMapAndArea />;
    }
  };

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center px-4 lg:gap-4 xl:flex-row xl:items-start 2xl:gap-10 2xl:px-10',
        className
      )}
    >
      <SubRegionContent />
      {/* <div className="min-w-[330px] rounded-2xl border-l-[10px] border-t-[10px] border-l-gray-300 border-t-gray-200/70 bg-white p-6 shadow-2xl">
        <h2 className="pb-2 text-2xl font-bold"> 🏔️ Podregiony</h2>
        <div className="h-2 w-40 rounded-full bg-green-500 " />
        <div className="h-2 w-40 translate-x-2 rounded-full bg-black" />
        <ul className="flex flex-col gap-2 pt-3">
          {newRegions.map((region) => (
            <li
              key={region.subRegionCode}
              className="flex gap-4 border-b-2 border-gray-200"
            >
              <div className="font-bold">{region.subRegionCode}</div>
              <div>{region.subRegionName}</div>
            </li>
          ))}
        </ul>
      </div> */}
    </div>
  );
};
