'use server';

import db from '../auth/db';
import { toast } from 'sonner';

export async function getRoutesForForm() {
  try {
    const routes = await db.route.findMany({
      include: {
        startPlace: true,
        endPlace: true,
      },
    });
    return routes;
  } catch (error) {
    toast.error(`Database Error: ${error}`);
  }
}
