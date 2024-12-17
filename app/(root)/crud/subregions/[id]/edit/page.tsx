import Breadcrumbs from '@/components/crud/breadcrumbs';
import SubregionForm from '@/components/crud/subregions/forms/create-form';
import { getRegionsForForm } from '@/lib/actions/admin/regions';
import { fetchSubregionById } from '@/lib/actions/admin/subregions';

import { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Edytuj podregion',
};

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  const regions = await getRegionsForForm();

  const result = await fetchSubregionById(id);

  if (!result) {
    return notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Podregiony', href: '/crud/subregions' },
          {
            label: 'Edytuj podregion',
            href: `/crud/subregions/${id}/edit`,
            active: true,
          },
        ]}
      />
      <SubregionForm
        regions={regions}
        type="Edit"
        subregionDetails={JSON.stringify(result)}
      />
    </main>
  );
}
