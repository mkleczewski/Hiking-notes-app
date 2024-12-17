'use server';

import { formSchema } from '@/app/(root)/testowanie/BasicForm';
import { currentRoles } from '@/lib/actions/actualUserInfo';
import db from '@/lib/auth/db';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';

export const createPath = async (values: z.infer<typeof formSchema>) => {
  const roles = await currentRoles();
  const { startPlace, startToEndPoints, endToStartPoints, endPlace } = values;

  if (roles?.includes('ADMIN')) {
    try {
      // Create the new region
      await db.route.create({
        data: {
          startPlaceId: startPlace,
          startPointDistance: startToEndPoints,
          endPointDistance: endToStartPoints,
          endPlaceId: endPlace,
          createdAt: new Date(),
        },
      });
      revalidatePath('/crud/regions');
      return { success: 'Region created' };
    } catch (error) {
      return { error: `Error creating region, ${error}` };
    }
  }
  return { error: 'Forbidden Server Power!' };
};
