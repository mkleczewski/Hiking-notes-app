import Breadcrumbs from '@/components/crud/breadcrumbs';
import { getLeaders } from '@/lib/actions/referat.action';
import { getRoutesForForm } from '@/lib/actions/trips';

import BookForm from '../../../../components/ksiazeczka/forms/create-form';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dodaj rekord do książeczki',
};

export default async function Page() {
  const routes = await getRoutesForForm();
  const leaders = await getLeaders();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Książeczka', href: '/ksiazeczka' },
          {
            label: 'Dodaj rekord',
            href: '/ksiazeczka/create',
            active: true,
          },
        ]}
      />
      <BookForm routes={routes} leaders={leaders} />
    </main>
  );
}
