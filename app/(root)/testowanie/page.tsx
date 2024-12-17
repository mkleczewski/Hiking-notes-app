import { getPlaces } from '@/lib/actions/admin/places';
import { getSubRegions } from '@/lib/actions/admin/subregions';

import BasicForm from './BasicForm';
import PlacesForm from './PlacesForm';

export default async function Page() {
  const [places, subregions] = await Promise.all([
    getPlaces(),
    getSubRegions(),
  ]);
  return (
    <div className="mx-auto flex max-w-[1200px] gap-x-6 px-4">
      <BasicForm places={places as any} />
      <PlacesForm subregions={subregions as any} />
    </div>
  );
}
