'use server';

import db from '@/lib/auth/db';

import { revalidatePath } from 'next/cache';

export const createPlace = async (placeName: string, subregionName: string) => {
  try {
    const existingPlace = await db.place.findFirst({
      where: {
        name: placeName,
      },
    });

    if (existingPlace) {
      throw new Error('Place name must be unique');
    }

    const result = await db.place.create({
      data: {
        name: placeName,
        subregionId: subregionName,
      },
    });

    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
