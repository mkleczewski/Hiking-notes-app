import LeftSidebar from '@/components/shared/sidebar/LeftSidebar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <LeftSidebar />
      <main className="pl-[290px] pr-6">{children}</main>
    </>
  );
}
