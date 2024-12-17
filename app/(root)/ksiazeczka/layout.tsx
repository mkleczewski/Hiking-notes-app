import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Książeczka',
  description: 'Książeczka do wpisów GOT PTTK.',
  icons: {
    icon: '/public/favicon-32x32.png',
  },
};

export default async function Layout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-[1400px] pt-10">
      {modal} {children}
    </div>
  );
}
