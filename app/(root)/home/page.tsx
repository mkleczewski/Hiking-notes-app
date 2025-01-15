// import { getAllUsers } from '@/lib/actions/user.action';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home | GOT PTTK',
  description:
    'Projekt GOT PTTK to aplikacja webowa, która pozwala na zdobywanie odznak turystycznych PTTK w wersji elektronicznej.',
};

export default async function Home() {
  //   const { userId } = auth();
  // const result = await getAllUsers();
  return (
    <>
      {/* {result.map((item, index: number) => (
        <p key={index}>{item.email}</p>
      ))} */}
      <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        Witaj
      </div>
    </>
  );
}
