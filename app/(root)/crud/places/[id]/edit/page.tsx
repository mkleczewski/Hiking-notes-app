import Breadcrumbs from '@/components/crud/breadcrumbs';
import PlaceForm from '@/components/crud/places/forms/create-form';
import { fetchPlaceById } from '@/lib/actions/admin/places';
import { getSubregionsForForm } from '@/lib/actions/admin/subregions';

import { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Edytuj miejsce odniesienia',
};

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;
  const subregions = await getSubregionsForForm();

  const result = await fetchPlaceById(id);

  if (!result) {
    return notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Miejsca orientacyjne', href: '/crud/places' },
          {
            label: 'Edytuj miejsce odniesienia',
            href: `/crud/places/${id}/edit`,
            active: true,
          },
        ]}
      />
      <PlaceForm
        subregions={subregions}
        type="Edit"
        placeDetails={JSON.stringify(result)}
      />
    </main>
  );
}
