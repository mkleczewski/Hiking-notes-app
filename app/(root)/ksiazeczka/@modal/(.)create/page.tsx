import { Modal } from '@/components/ui/Modal';
import { getLeaders } from '@/lib/actions/referat.action';
import { getRoutesForForm } from '@/lib/actions/trips';

import BookForm from '../../../../../components/ksiazeczka/forms/create-form';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dodaj rekord do książeczki',
};

export default async function Page() {
  const routes = await getRoutesForForm();
  const leaders = await getLeaders();

  return (
    <Modal className="min-w-[750px]">
      <BookForm routes={routes} leaders={leaders} />
    </Modal>
  );
}
