'use server';

import db from '@/lib/auth/db';

import { unstable_noStore as noStore } from 'next/cache';
import { currentUser } from '../auth/sessionData';

const ITEMS_PER_PAGE = 9;

export const getPathsAmount = async (
  query: string,
  showUnvisited: boolean,
  minPoints: number,
  maxPoints: number
): Promise<number | { error: string; count: number }> => {
  try {
    const user = await currentUser();

    const count = await db.route.count({
      where: {
        OR: [
          {
            startPlace: {
              name: {
                contains: query,
                mode: 'insensitive',
              },
            },
          },
          {
            endPlace: {
              name: {
                contains: query,
                mode: 'insensitive',
              },
            },
          },
        ],
        AND: [
          {
            startPointDistance: {
              gte: minPoints,
              lte: maxPoints,
            },
          },
          showUnvisited && user
            ? {
                trips: {
                  none: {
                    userId: user.id,
                  },
                },
              }
            : {},
        ],
      },
    });
    const totalPages = Math.ceil(count / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    return { error: 'Error fetching all routes', count: 0 };
  }
};

export async function fetchFilteredPaths(
  query?: string,
  currentPage?: number,
  showUnvisited?: boolean,
  minPoints?: number,
  maxPoints?: number,
  sortBy?: string
) {
  noStore();
  const offset = ((currentPage ?? 1) - 1) * ITEMS_PER_PAGE;
  const user = await currentUser();

  try {
    const routes = await db.route.findMany({
      where: {
        OR: [
          {
            startPlace: {
              name: {
                contains: query,
                mode: 'insensitive',
              },
            },
          },
          {
            endPlace: {
              name: {
                contains: query,
                mode: 'insensitive',
              },
            },
          },
        ],
        AND: [
          {
            startPointDistance: {
              gte: minPoints,
              lte: maxPoints,
            },
          },
          showUnvisited && user
            ? {
                trips: {
                  none: {
                    userId: user.id,
                  },
                },
              }
            : {},
        ],
      },
      include: {
        startPlace: true,
        endPlace: true,
        trips: user
          ? {
              where: {
                userId: user.id,
              },
              take: 1,
            }
          : false,
      },
      take: ITEMS_PER_PAGE,
      skip: offset,
      orderBy: sortBy === 'pointsAsc' 
        ? { startPointDistance: 'asc' } 
        : sortBy === 'pointsDesc' 
        ? { startPointDistance: 'desc' } 
        : undefined,
    });

    return routes.map(route => ({
      ...route,
      visited: user ? route.trips.length > 0 : false,
    }));
  } catch (error) {
    throw new Error('Failed to fetch paths.');
  }
}

export async function fetchPathsPages(query: string) {
  noStore();
  try {
    const count = await db.route.count({
      where: {
        OR: [{ name: { contains: query } }],
      },
    });

    const totalPages = Math.ceil(count / ITEMS_PER_PAGE);

    return totalPages;
  } catch (error) {
    throw new Error('Failed to fetch total number of paths.');
  }
}
