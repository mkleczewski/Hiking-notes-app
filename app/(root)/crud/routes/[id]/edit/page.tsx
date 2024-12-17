import Breadcrumbs from '@/components/crud/breadcrumbs';
import RouteForm from '@/components/crud/routes/forms/create-form';
import { getPlacesForForm } from '@/lib/actions/admin/places';
import { fetchRouteById } from '@/lib/actions/admin/routes';

import { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Edytuj szlak',
};

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  const places = await getPlacesForForm();

  const result = await fetchRouteById(id);

  if (!result) {
    return notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Szlaki', href: '/crud/routes' },
          {
            label: 'Edytuj szlak',
            href: `/crud/routes/${id}/edit`,
            active: true,
          },
        ]}
      />
      <RouteForm
        places={places}
        type="Edit"
        routeDetails={JSON.stringify(result)}
      />
    </main>
  );
}
