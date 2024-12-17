'use server';

import { currentRoles,currentUser } from '@/lib/auth/sessionData';

import db from '../auth/db';

export async function getUserEntriesWithUnverifiedCount() {
  const currUser = await currentUser();
  const roles = await currentRoles();

  // Użytkownik musi być zalogowany i mieć rolę PRZODOWNIK
  if (!currUser) {
    return { error: 'Not logged in' };
  }

  if (!roles?.includes('PRZODOWNIK')) {
    return { error: 'Insufficient permissions' };
  }

  try {
    // Pobierz subregiony, do których użytkownik ma uprawnienia
    const userPrivileges = await db.subregionPrivilege.findMany({
      where: {
        userId: currUser.id,
      },
      select: {
        subregionId: true,
      },
    });

    const subregionIds = userPrivileges.map((priv) => priv.subregionId);

    if (subregionIds.length === 0) {
      return []; // Brak uprawnień do jakichkolwiek subregionów
    }

    // Pobierz użytkowników z liczbą ich nieweryfikowanych wpisów w subregionach, do których mamy uprawnienia
    const userEntries = await db.user.findMany({
      where: {
        trips: {
          some: {
            OR: [
              {
                verifiedById: null,
                route: {
                  startPlace: {
                    subregionId: { in: subregionIds }, // Szlaki w naszych subregionach
                  },
                },
              },
              { leaderPresent: currUser.id }, // Szlak nie w naszych subregionach, ale byliśmy obecni
            ],
          },
        },
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        name: true,
        email: true,
        trips: {
          where: {
            verifiedById: null,
            route: {
              startPlace: {
                subregionId: { in: subregionIds },
              },
            },
          },
          select: {
            id: true,
          },
        },
      },
    });

    // Przekształcenie wyników: użytkownik + liczba nieweryfikowanych wpisów
    const result = userEntries.map((user) => ({
      id: user.id,
      name:
        user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim(),
      email: user.email,
      entryCount: user.trips.length,
    }));

    return result;
  } catch (error) {
    console.error('Error fetching user entries:', error);
    return { error: 'Failed to fetch user entries.' };
  }
}