import Breadcrumbs from '@/components/crud/breadcrumbs';
import SubregionForm from '@/components/crud/subregions/forms/create-form';
import { getRegionsForForm } from '@/lib/actions/admin/regions';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Stwórz podregion',
};

export default async function Page() {
  const regions = await getRegionsForForm();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Podregiony', href: '/crud/subregions' },
          {
            label: 'Stwórz podregion',
            href: '/crud/subregions/create',
            active: true,
          },
        ]}
      />
      <SubregionForm regions={regions} />
    </main>
  );
}
