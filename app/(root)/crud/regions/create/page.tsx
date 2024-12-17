import Breadcrumbs from '@/components/crud/breadcrumbs';
import RegionForm from '@/components/crud/regions/forms/create-form';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Stwórz Region',
};

export default function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Regiony', href: '/crud/regions' },
          {
            label: 'Stwórz Region',
            href: '/crud/regions/create',
            active: true,
          },
        ]}
      />
      <RegionForm />
    </main>
  );
}
