import Breadcrumbs from '@/components/crud/breadcrumbs';
import RegionForm from '@/components/crud/regions/forms/create-form';
import { fetchRegionById } from '@/lib/actions/admin/regions';

import { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Edytuj Region',
};

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;

  const result = await fetchRegionById(id);

  if (!result) {
    return notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Regiony', href: '/crud/regions' },
          {
            label: 'Edytuj Region',
            href: `/crud/regions/${id}/edit`,
            active: true,
          },
        ]}
      />
      <RegionForm type="Edit" regionDetails={JSON.stringify(result)} />
    </main>
  );
}
