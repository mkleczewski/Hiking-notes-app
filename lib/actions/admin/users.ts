'use server';

import { currentRoles } from '@/lib/actions/actualUserInfo';
import db from '@/lib/auth/db';

import { unstable_noStore as noStore } from 'next/cache';
import { toast } from 'sonner';

export const admin = async () => {
  const roles = await currentRoles();

  if (roles?.includes("ADMIN")) {
    return { success: 'Allowed Server Action!' };
  }

  return { error: 'Forbidden Server Action!' };
};

export const getUsersAmount = async (): Promise<
  number | { error: string; count: number }
> => {
  const roles = await currentRoles();

  if (roles?.includes("ADMIN")) {
    try {
      const regions = await db.user.findMany();
      return regions.length;
    } catch (error) {
      return { error: 'Error fetching all regions', count: 0 };
    }
  }
  return { error: 'Forbidden Server Action!', count: 0 };
};

const ITEMS_PER_PAGE = 6;

export async function fetchFilteredUsers(query?: string, currentPage?: number) {
  noStore();
  const offset = ((currentPage ?? 1) - 1) * ITEMS_PER_PAGE;

  try {
    const users = await db.user.findMany({
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
      },
      where: {
        OR: [{ name: { contains: query } }],
      },
      take: ITEMS_PER_PAGE,
      skip: offset,
    });
    return users;
  } catch (error) {
    toast.error(`Database Error: ${error}`);
    throw new Error('Failed to fetch users.');
  }
}

export async function fetchRegionsPages(query: string) {
  noStore();
  try {
    const count = await db.user.count({
      where: {
        OR: [{ name: { contains: query } }],
      },
    });

    const totalPages = Math.ceil(count / ITEMS_PER_PAGE);

    return totalPages;
  } catch (error) {
    toast.error(`Database Error: ${error}`);
    throw new Error('Failed to fetch total number of regions.');
  }
}

export async function updateUserRole(userId: string, roleName: string, addRole: boolean) {
  const role = await db.role.findUnique({
    where: { name: roleName },
  });

  if (!role) {
    throw new Error(`Role ${roleName} not found`);
  }

  if (addRole) {
    await db.userRole.create({
      data: {
        userId,
        roleId: role.id,
      },
    });
  } else {
    await db.userRole.deleteMany({
      where: {
        userId,
        roleId: role.id,
      },
    });
  }
}
