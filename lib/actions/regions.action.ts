import { cache } from 'react';

import db from '@/lib/auth/db';


export const getAllSubRegions = cache(async () => {
  try {

    const regionsPrisma = await db.region.findMany({
      include: {
        subregions: true,
      },
    });

    return regionsPrisma;
  } catch (error) {
    console.log(error);
    throw error;
  }
});

export const getAllRegions = cache(async () => {
  try {
    const regions = await db.region.findMany();

    return regions;
  } catch (error) {
    console.log(error);
    throw error;
  }
});
