import Breadcrumbs from '@/components/crud/breadcrumbs';
import PlaceForm from '@/components/crud/places/forms/create-form';
import { getSubregionsForForm } from '@/lib/actions/admin/subregions';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Stwórz miejsce orientacyne',
};

export default async function Page() {
  const subregions = await getSubregionsForForm();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Miejsca orientacyjne', href: '/crud/places' },
          {
            label: 'Stwórz miejsce orientacyne',
            href: '/crud/places/create',
            active: true,
          },
        ]}
      />
      <PlaceForm subregions={subregions} />
    </main>
  );
}
