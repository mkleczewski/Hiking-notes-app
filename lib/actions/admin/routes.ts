'use server';

import db from '@/lib/auth/db';
import { currentRoles } from '@/lib/actions/actualUserInfo';

import { revalidatePath } from 'next/cache';
import { unstable_noStore as noStore } from 'next/cache';
import { toast } from 'sonner';
import { z } from 'zod';

const FormSchema = z.object({
  startPlaceId: z.string(),
  endPlaceId: z.string(),
  startPointDistance: z.number(),
  endPointDistance: z.number().nullable(),
});

const CreateRoute = FormSchema;
const UpdateRoute = FormSchema;

export const admin = async () => {
  const role = await currentRoles();

  if (role) {
    return { success: 'Allowed Server Action!' };
  }

  return { error: 'Forbidden Server Action!' };
};

export const getRoutesAmount = async (): Promise<
  number | { error: string; count: number }
> => {
  const roles = await currentRoles();

  if (roles?.includes('ADMIN')) {
    try {
      const routes = await db.route.findMany();
      return routes.length;
    } catch (error) {
      return { error: 'Error fetching all routes', count: 0 };
    }
  }
  return { error: 'Forbidden Server Action!', count: 0 };
};

export type State = {
  errors?: {
    startPlaceId?: string[];
    endPlaceId?: string[];
    startPointDistance?: string[];
    endPointDistance?: string[];
  };
  message?: string | null;
};

export const createRoute = async ({
  startPlaceId,
  endPlaceId,
  startPointDistance,
  endPointDistance,
}: {
  startPlaceId: string;
  endPlaceId: string;
  startPointDistance: number;
  endPointDistance?: number | null;
}) => {
  const roles = await currentRoles();

  const validatedFields = CreateRoute.safeParse({
    startPlaceId,
    endPlaceId,
    startPointDistance,
    endPointDistance,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Route.',
    };
  }

  if (roles?.includes('ADMIN')) {
    try {
      const {
        startPlaceId: validatedStartPlaceId,
        endPlaceId: validatedEndPlaceId,
      } = validatedFields.data;

			// ? Nie powinien tutaj być unique constraint?
      await db.route.create({
        data: {
          startPlaceId: validatedStartPlaceId,
          endPlaceId: validatedEndPlaceId,
          startPointDistance,
          endPointDistance,
          createdAt: new Date(),
        },
      });
      revalidatePath('/crud/routes');
      return { success: 'Route created' };
    } catch (error) {
      return { error: `Error creating route, ${error}` };
    }
  }
  return { error: 'Forbidden Server Power!' };
};

export async function editRoute(params: {
  id: string;
  startPlaceId: string;
  endPlaceId: string;
  startPointDistance: number;
  endPointDistance?: number | null;
}) {
  const roles = await currentRoles();
  const { id, startPlaceId, endPlaceId, startPointDistance, endPointDistance } = params;

  const validatedFields = UpdateRoute.safeParse({
    startPlaceId,
    endPlaceId,
    startPointDistance,
    endPointDistance,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Route.',
    };
  }
  if (roles?.includes('ADMIN')) {
    try {
      await db.route.update({
        where: { id },
        data: {
          startPlaceId,
          endPlaceId,
          startPointDistance,
          endPointDistance,
        },
      });
      revalidatePath('/admin/routes');
      return { success: 'Route updated' };
    } catch (error) {
      console.error(`Error updating route: ${error}`);
      return { error: 'Error updating route' };
    }
  }
  return { error: 'Forbidden Server Action!' };
}

export const deleteRoute = async (id: string) => {
  const roles = await currentRoles();

  if (roles?.includes('ADMIN')) {
    try {
      await db.route.delete({
        where: { id },
      });
      revalidatePath('/admin/routes');
      return { success: 'Route deleted' };
    } catch (error) {
      return { error: 'Error deleting route' };
    }
  }
  return { error: 'Forbidden Server Action!' };
};

const ITEMS_PER_PAGE = 15;

export async function fetchFilteredRoutes(
	query: string,
	currentPage: number
) {
  noStore();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const routes = await db.route.findMany({
      where: {
        OR: [
          { startPlaceId: { contains: query } },
          { endPlaceId: { contains: query } },
        ],
      },
      include: {
        startPlace: true,
        endPlace: true,
      },
      take: ITEMS_PER_PAGE,
      skip: offset,
    });
    return routes;
  } catch (error) {
    console.error(`Database Error: ${error}`);
    throw new Error('Failed to fetch routes.');
  }
}

export async function getRoutesForForm() {
  try {
    const routes = await db.route.findMany({});
    return routes;
  } catch (error) {
    toast.error(`Database Error: ${error}`);
    throw new Error('Failed to fetch routes.');
  }
}

export async function fetchRoutesPages(query: string) {
  noStore();
  try {
    const count = await db.route.count({
      where: {
        OR: [
          { startPlaceId: { contains: query } },
          { endPlaceId: { contains: query } },
        ],
      },
    });

    const totalPages = Math.ceil(count / ITEMS_PER_PAGE);

    return totalPages;
  } catch (error) {
    console.error(`Database Error: ${error}`);
    throw new Error('Failed to fetch total number of routes.');
  }
}

export async function fetchRouteById(id: string) {
  noStore();
  try {
    const route = await db.route.findUnique({
      where: { id },
    });

    return route;
  } catch (error) {
    console.error(`Database Error: ${error}`);
    throw new Error('Failed to fetch route.');
  }
}

export async function getRoutes() {
  noStore();
  try {
    const routes = await db.route.findMany({});
    return routes;
  } catch (error) {
    console.error(`Database Error: ${error}`);
    throw new Error('Failed to fetch routes.');
  }
}