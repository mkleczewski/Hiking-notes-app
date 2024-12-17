import Breadcrumbs from '@/components/crud/breadcrumbs';
import { fetchBookById } from '@/lib/actions/admin/book';
import { getLeaders } from '@/lib/actions/referat.action';
import { getRoutesForForm } from '@/lib/actions/trips';

import BookForm from '@/components/ksiazeczka/forms/create-form';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Edit Book',
};

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  const routes = await getRoutesForForm();

  const result = await fetchBookById(id);
  if (!result) {
    return notFound();
  }
  const leaders = await getLeaders();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Books', href: '/ksiazeczka' },
          {
            label: 'Edit Book',
            href: `/ksiazeczka/${id}/edit`,
            active: true,
          },
        ]}
      />
      <BookForm
        routes={routes}
        type="Edit"
        bookDetails={result}
        leaders={leaders}
      />
    </main>
  );
}
