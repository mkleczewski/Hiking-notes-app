import ReferatUprawnienia from '@/components/referat';
import {
  getLeaders,
  getUserRegionPrivileges,
} from '@/lib/actions/referat.action';

import Link from 'next/link';

export default async function Page({
  searchParams,
}: {
  searchParams?: { leader?: string; page?: string };
}) {
  const leadersQuery = await getLeaders();
  const query = searchParams?.leader || '';

  const privileges = await getUserRegionPrivileges(query);
  if (!leadersQuery || 'error' in leadersQuery) {
    return <div>Error loading leaders</div>;
  }

  return (
    <div className="p-10">
      <Link
        href="/referat/odznaki"
        className="ml-8 rounded-md border px-4 py-2"
      >
        Odznaki
      </Link>
      <ReferatUprawnienia
        leaders={leadersQuery}
        privileges={privileges}
        selectedLeader={query}
      />
    </div>
  );
}
