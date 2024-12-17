import Breadcrumbs from '@/components/crud/breadcrumbs';
import RouteForm from '@/components/crud/routes/forms/create-form';
import { getPlacesForForm } from '@/lib/actions/admin/places';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Stwórz szlak',
};

export default async function Page() {
  const places = await getPlacesForForm();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Szlaki', href: '/crud/routes' },
          {
            label: 'Stwórz szlak',
            href: '/crud/routes/create',
            active: true,
          },
        ]}
      />
      <RouteForm places={places} />
    </main>
  );
}
