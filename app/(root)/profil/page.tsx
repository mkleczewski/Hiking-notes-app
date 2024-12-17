import Settings from '@/components/profil/Settings';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  getBadgesForUser,
  getPointsForUser,
} from '@/lib/actions/odznaki/odznaki';
import { currentUser } from '@/lib/auth/sessionData';
import { ExtendedUser } from '@/types/next-auth';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home | GOT PTTK',
  description:
    'Projekt GOT PTTK to aplikacja webowa, która pozwala na zdobywanie odznak turystycznych PTTK w wersji elektronicznej.',
};

export default async function Page() {
  const currUser = await currentUser();
  const badges = await getBadgesForUser(currUser?.id ?? '');
  return (
    <main>
      <section className="mb-10 flex items-center justify-center">
        <Card>
          <CardHeader>
            <CardTitle>Odznaki: </CardTitle>
          </CardHeader>
          <CardContent>
            {badges.map((badge) => (
              <div key={badge.id}>
                <div>{badge?.badge?.title}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
      <Settings user={currUser as ExtendedUser} />
    </main>
  );
}
