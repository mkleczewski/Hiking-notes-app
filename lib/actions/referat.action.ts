'use server';

import { currentRoles, currentUser } from '@/lib/auth/sessionData';
import { ResponseData } from '@/schemas/index';

import db from '../auth/db';
import { revalidatePath } from 'next/cache';

export async function getLeaders() {
  const currUser = await currentUser();

  if (!currUser) {
    return { error: 'Not logged in' };
  }

  const leaders = await db.user.findMany({
    include: {
      userRoles: {
        include: {
          role: true,
        },
      },
    },
    where: {
      userRoles: {
        some: {
          role: {
            name: 'PRZODOWNIK',
          },
        },
      },
    },
  });
  return leaders;
}

export async function getUserRegionPrivileges(leaderPresent: string) {
  const currUser = await currentUser();
  const roles = await currentRoles();

  if (!currUser) {
    return { error: 'Not logged in' };
  }

  if (!roles?.includes('REFERAT')) {
    return { error: 'Insufficient permissions' };
  }

  try {
    // Pobierz wszystkie regiony i subregiony z uprawnieniami dla wybranego lidera
    const regions = await db.region.findMany({
      where: {
        deletedAt: null,
      },
      include: {
        subregions: {
          where: {
            deletedAt: null,
          },
          include: {
            privileges: {
              where: {
                userId: leaderPresent, // Używamy leaderPresent zamiast currUser.id
              },
              select: {
                userId: true,
              },
            },
          },
        },
      },
    });

    const responseData: ResponseData = {
      regions: regions.map((region) => ({
        ...region,
        subregions: region.subregions.map((subregion) => ({
          ...subregion,
          privileges: subregion.privileges,
        })),
      })),
    };

    return responseData;
  } catch (error) {
    throw new Error('Failed to fetch leader privileges');
  }
}

export async function toggleSubregionPrivilege(
  userId: string,
  privileges: {
    subregionId: string;
  }[]
) {
  const currUser = await currentUser();
  const roles = await currentRoles();

  if (!currUser) {
    return { error: 'Not logged in' };
  }

  if (!roles?.includes('REFERAT')) {
    return { error: 'Insufficient permissions' };
  }

  try {
    const existingPrivileges = await db.subregionPrivilege.findMany({
      where: {
        userId,
      },
    });

    const existingIds = existingPrivileges.map((p) => p.subregionId);
    const newIds = privileges.map((p) => p.subregionId);

    const toDelete = existingPrivileges.filter(
      (p) => !newIds.includes(p.subregionId)
    );

    if (toDelete.length > 0) {
      await db.subregionPrivilege.deleteMany({
        where: {
          id: { in: toDelete.map((p) => p.id) },
        },
      });
    }

    const toAdd = privileges.filter(
      (p) => !existingIds.includes(p.subregionId)
    );

    if (toAdd.length > 0) {
      await db.subregionPrivilege.createMany({
        data: toAdd.map((priv) => ({
          userId,
          subregionId: priv.subregionId,
        })),
      });
    }

    revalidatePath('/referat');
    return { message: 'Privileges updated successfully.' };
  } catch (error) {
    return { error: 'Failed to toggle privileges.' };
  }
}
