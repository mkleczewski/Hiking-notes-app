'use server';

import db from '@/lib/auth/db';
import { currentRoles } from '@/lib/auth/sessionData';

import { revalidatePath } from 'next/cache';
import { unstable_noStore as noStore } from 'next/cache';
import { toast } from 'sonner';
import { z } from 'zod';

const FormSchema = z.object({
  name: z.string(),
});

const CreateSubregion = FormSchema;
const UpdateSubregion = FormSchema;

export const admin = async () => {
  const role = await currentRoles();

  if (role) {
    return { success: 'Allowed Server Action!' };
  }

  return { error: 'Forbidden Server Action!' };
};

export const getSubregionsAmount = async (): Promise<
  number | { error: string; count: number }
> => {
  const roles = await currentRoles();

  if (roles?.includes('ADMIN')) {
    try {
      const subregions = await db.subregion.findMany();
      return subregions.length;
    } catch (error) {
      return { error: 'Error fetching all subregions', count: 0 };
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

export const createSubregion = async ({
  name,
  regionId,
  code,
}: {
  name: string;
  regionId: string;
  code: string;
}) => {
  const roles = await currentRoles();

  const validatedFields = CreateSubregion.safeParse({
    name: name,
  });

  if (!validatedFields.success) {
    // Flatten and return errors if validation fails
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Subregion.',
    };
  }

  // Data has been validated at this point
  const { name: validatedName } = validatedFields.data;

  if (roles?.includes('ADMIN')) {
    try {
      // Check if a subregion with the same name already exists
      const existingSubregion = await db.subregion.findUnique({
        where: { name: validatedName },
      });

      if (existingSubregion) {
        return {
          error: 'A subregion with this name already exists.',
        };
      }

      // Create the new subregion
      await db.subregion.create({
        data: {
          name: validatedName,
          regionId: regionId,
          code: code,
        },
      });
      revalidatePath('/crud/subregions');
      return { success: 'Subregion created' };
    } catch (error) {
      return { error: `Error creating subregion, ${error}` };
    }
  }
  return { error: 'Forbidden Server Power!' };
};

export async function editSubregion(params: {
  id: string;
  name: string;
  regionId: string;
  code: string;
}) {
  const roles = await currentRoles();
  const { id, name, regionId, code } = params;

  const validatedFields = UpdateSubregion.safeParse({
    name: name,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Subregion.',
    };
  }
  if (roles?.includes('ADMIN')) {
    try {
      await db.subregion.update({
        where: { id: id },
        data: {
          name: name,
          regionId: regionId,
          code: code,
        },
      });
      revalidatePath('/admin/subregions');
      console.log('Subregion updated');
      return { success: 'Subregion updated' };
    } catch (error) {
      console.log(`Error updating subregion: ${error}`);

      return { error: 'Error updating subregion' };
    }
  }
  return { error: 'Forbidden Server Action!' };
}

export const deleteSubregion = async (id: string) => {
  const roles = await currentRoles();

  if (roles?.includes('ADMIN')) {
    try {
      await db.subregion.delete({
        where: { id: id },
      });
      revalidatePath('/admin/subregions');
      return { success: 'Subregion deleted' };
    } catch (error) {
      return { error: 'Error deleting subregion' };
    }
  }
  return { error: 'Forbidden Server Action!' };
};

const ITEMS_PER_PAGE = 15;

export async function fetchFilteredSubregions(
  query: string,
  currentPage: number
) {
  noStore();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const subregions = await db.subregion.findMany({
      where: {
        OR: [{ name: { contains: query } }],
      },
      include: {
        region: true,
      },
      take: ITEMS_PER_PAGE,
      skip: offset,
    });
    return subregions;
  } catch (error) {
    console.error(`Database Error: ${error}`);
    throw new Error('Failed to fetch subregions.');
  }
}

export async function getSubregionsForForm() {
  try {
    const subregions = await db.subregion.findMany({});
    return subregions;
  } catch (error) {
    toast.error(`Database Error: ${error}`);
  }
}

export async function fetchSubregionsPages(query: string) {
  noStore();
  try {
    const count = await db.subregion.count({
      where: {
        OR: [{ name: { contains: query } }],
      },
    });

    const totalPages = Math.ceil(count / ITEMS_PER_PAGE);

    return totalPages;
  } catch (error) {
    console.error(`Database Error: ${error}`);
    throw new Error('Failed to fetch total number of subregions.');
  }
}

export async function fetchSubregionById(id: string) {
  noStore();
  try {
    const subregion = await db.subregion.findUnique({
      where: { id: id },
    });

    return subregion;
  } catch (error) {
    console.error(`Database Error: ${error}`);
    throw new Error('Failed to fetch subregion.');
  }
}

export async function getSubRegions() {
  noStore();
  try {
    const subregions = await db.subregion.findMany({});
    return subregions;
  } catch (error) {
    console.error(`Database Error: ${error}`);
    throw new Error('Failed to fetch subregions.');
  }
}
