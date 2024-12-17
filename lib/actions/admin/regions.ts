'use server';

import { currentRoles } from '@/lib/actions/actualUserInfo';
import db from '@/lib/auth/db';

import { revalidatePath } from 'next/cache';
import { unstable_noStore as noStore } from 'next/cache';
import { toast } from 'sonner';
import { z } from 'zod';

const FormSchema = z.object({
  name: z.string(),
});

const CreateRegion = FormSchema;
const UpdateRegion = FormSchema;

export const admin = async () => {
  const roles = await currentRoles();

  if (roles?.includes('ADMIN')) {
    return { success: 'Allowed Server Action!' };
  }

  return { error: 'Forbidden Server Action!' };
};

export const getRegionsAmount = async (): Promise<
  number | { error: string; count: number }
> => {
  const roles = await currentRoles();

  if (roles?.includes('ADMIN')) {
    try {
      const regions = await db.region.findMany();
      return regions.length;
    } catch (error) {
      return { error: 'Error fetching all regions', count: 0 };
    }
  }
  return { error: 'Forbidden Server Action!', count: 0 };
};
export type State = {
  errors?: {
    name?: string[];
  };
  message?: string | null;
};

export const createRegion = async ({ name }: { name: string }) => {
  const roles = await currentRoles();

  const validatedFields = CreateRegion.safeParse({
    name: name,
  });

  if (!validatedFields.success) {
    // Flatten and return errors if validation fails
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Region.',
    };
  }

  // Data has been validated at this point
  const { name: validatedName } = validatedFields.data;

  if (roles?.includes('ADMIN')) {
    try {
      // Check if a region with the same name already exists
      const existingRegion = await db.region.findUnique({
        where: { name: validatedName },
      });

      if (existingRegion) {
        return {
          error: 'A region with this name already exists.',
        };
      }

      // Create the new region
      await db.region.create({
        data: {
          name: validatedName,
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

export async function editRegion(params: { id: string; name: string }) {
  const roles = await currentRoles();
  const { id, name } = params;

  const validatedFields = UpdateRegion.safeParse({
    name: name,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Region.',
    };
  }
  if (roles?.includes('ADMIN')) {
    try {
      await db.region.update({
        where: { id: id },
        data: {
          name: name,
        },
      });
      revalidatePath('/admin/regions');
      toast.success('Region updated');
      return { success: 'Region updated' };
    } catch (error) {
      toast.success(`Error updating region: ${error}`);

      return { error: 'Error updating region' };
    }
  }
  return { error: 'Forbidden Server Action!' };
}

export const deleteRegion = async (id: string) => {
  const roles = await currentRoles();

  if (roles?.includes('ADMIN')) {
    try {
      await db.region.delete({
        where: { id: id },
      });
      revalidatePath('/admin/regions');
      return { success: 'Region deleted' };
    } catch (error) {
      return { error: 'Error deleting region' };
    }
  }
  return { error: 'Forbidden Server Action!' };
};

const ITEMS_PER_PAGE = 6;

export async function fetchFilteredRegions(
  query?: string,
  currentPage?: number
) {
  noStore();
  const offset = ((currentPage ?? 1) - 1) * ITEMS_PER_PAGE;

  try {
    const regions = await db.region.findMany({
      where: {
        OR: [{ name: { contains: query } }],
      },
      take: ITEMS_PER_PAGE,
      skip: offset,
    });
    return regions;
  } catch (error) {
    toast.error(`Database Error: ${error}`);
    throw new Error('Failed to fetch regions.');
  }
}
export async function getRegionsForForm() {
  try {
    const regions = await db.region.findMany({});
    return regions;
  } catch (error) {
    toast.error(`Database Error: ${error}`);
    throw new Error('Failed to fetch regions.');
  }
}

export async function fetchRegionsPages(query: string) {
  noStore();
  try {
    const count = await db.region.count({
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

export async function fetchRegionById(id: string) {
  noStore();
  try {
    const region = await db.region.findUnique({
      where: { id: id },
    });

    return region;
  } catch (error) {
    toast.error(`Database Error: ${error}`);
    throw new Error('Failed to fetch region.');
  }
}
