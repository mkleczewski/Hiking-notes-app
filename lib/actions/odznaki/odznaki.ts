'use server';
import { cache } from 'react';

import db from '@/lib/auth/db';
import { currentUser } from '@/lib/auth/sessionData';

export const getPointsForUser = cache(async () => {
  const user = await currentUser();
  console.log(user?.id);
  try {
    const verifiedRecords = await db.trip.findMany({
      where: {
        userId: user?.id,
        NOT: {
          verifiedById: null,
        },
      },
      include: {
        route: true,
      },
    });

    return verifiedRecords;
  } catch (error) {
    console.log(error);
    throw error;
  }
});

export const getBooksForAchievements = cache(async () => {
  const user = await currentUser();
  console.log(user?.id);
  try {
    const verifiedRecords = await db.user.findMany({
      where: { sendForAchievement: true },
      include: {
        trips: {
          include: {
            route: true,
          },
        },
      },
    });

    return verifiedRecords;
  } catch (error) {
    console.log(error);
    throw error;
  }
});

export async function fetchVerifiedBook(
  query: string,
  currentPage: number,
  userId: string
) {
  const ITEMS_PER_PAGE = 10;
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const books = await db.trip.findMany({
      where: {
        userId: userId,
        OR: [{ date: { contains: query } }],
      },
      take: ITEMS_PER_PAGE,
      skip: offset,
      include: {
        route: {
          include: {
            startPlace: true,
            endPlace: true,
          },
        },
        User_Trip_leaderPresentToUser: true,
      },
    });
    return books;
  } catch (error) {
    throw new Error('Failed to fetch books.');
  }
}

export async function sendToReferat(userId: string) {
  try {
    await db.user.update({
      where: {
        id: userId,
      },
      data: {
        sendForAchievement: true,
      },
    });
  } catch (error) {
    throw new Error('Failed to send.');
  }
}

interface AssignBadgeParams {
  userId: string;
  badgeId: string;
  selectedPoints: number;
  selectedItems: string[]; // array of Trip IDs
  useUnusedPoints?: boolean;
  referatId?: string;
}

export async function assignBadge({
  userId,
  badgeId,
  selectedPoints,
  selectedItems,
  referatId,
  useUnusedPoints = false,
}: AssignBadgeParams) {
  try {
    // Pobierz odznakę
    const badge = await db.badge.findUnique({
      where: { id: badgeId },
    });
    if (!badge) {
      throw new Error('Odznaka nie została znaleziona.');
    }

    // Pobierz użytkownika
    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new Error('Użytkownik nie został znaleziony.');
    }
    await db.userAchievement.create({
      data: {
        userId,
        badgeId: badgeId,
        collectedAt: new Date(),
        referatId: referatId,
      },
    });

    // Jeśli zaznaczono opcję użycia niezużytych punktów, dodaj je do obecnych
    let totalPoints = selectedPoints;
    if (useUnusedPoints && user.unusedPoints > 0) {
      totalPoints += user.unusedPoints;
    }

    // Sprawdź czy mamy wystarczającą liczbę punktów do przyznania odznaki
    if (totalPoints < badge.pointsRequired) {
      throw new Error('Za mało punktów, aby przyznać tę odznakę.');
    }

    // Oblicz leftover
    const leftoverPoints = totalPoints - badge.pointsRequired;

    // Zaktualizuj Tripy, przypisując do nich odznakę
    await db.trip.updateMany({
      where: { id: { in: selectedItems } },
      data: { belongsToBadgeId: badgeId },
    });

    // Zaktualizuj użytkownika - ustaw unusedPoints na leftover
    await db.user.update({
      where: { id: userId },
      data: {
        unusedPoints: leftoverPoints, // jeśli leftover = 0 to zero punktów zostanie
      },
    });

    return { success: true };
  } catch (error: any) {
    throw new Error(`Failed to assign badge: ${error.message}`);
  }
}

export const getBadgesForUser = cache(async (userId: string) => {
  const badges = await db.userAchievement.findMany({
    where: {
      userId: userId,
    },
    include: {
      badge: true,
    },
  });
  return badges;
});

export const getBadgesForForm = cache(async (userId: string) => {
  const userHasBadge = await db.userAchievement.findMany({
    where: {
      userId: userId,
    },
  });

  const badges = await db.badge.findMany({
    where: {
      id: {
        notIn: userHasBadge.map((userBadge) => userBadge.badgeId),
      },
    },
  });

  return badges;
});
