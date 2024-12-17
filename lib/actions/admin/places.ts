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

const CreatePlace = FormSchema;
const UpdatePlace = FormSchema;

// TODO: sprawdzić czy to jest jeszcze gdzieś używane

// export async function getPlaces() {
//   try {
//     const places = await db.place.findMany();
//     return places;
//   } catch (error) {
//     return { error: 'Error fetching all places' };
//   }
// }

// nowe akcje

export const admin = async () => {
  const roles = await currentRoles();

  if (roles?.includes('ADMIN')) {
    return { success: 'Allowed Server Action!' };
  }

  return { error: 'Forbidden Server Action!' };
};

export const getPlacesAmount = async (): Promise<
  number | { error: string; count: number }
> => {
  const roles = await currentRoles();

  if (roles?.includes('ADMIN')) {
    try {
      const places = await db.place.findMany();
      return places.length;
    } catch (error) {
      return { error: 'Error fetching all places', count: 0 };
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

export const createPlace = async ({
  name,
  subregionId,
}: {
  name: string;
  subregionId: string;
}) => {
  const roles = await currentRoles();

  const validatedFields = CreatePlace.safeParse({
    name: name,
  });

  if (!validatedFields.success) {
    // Flatten and return errors if validation fails
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Place.',
    };
  }

  // Data has been validated at this point
  const { name: validatedName } = validatedFields.data;

  if (roles?.includes('ADMIN')) {
    try {
      // Check if a place with the same name already exists
      const existingPlace = await db.place.findUnique({
        where: { name: validatedName },
      });

      if (existingPlace) {
        return {
          error: 'A place with this name already exists.',
        };
      }

      // Create the new place
      await db.place.create({
        data: {
          name: validatedName,
          subregionId: subregionId,
        },
      });
      revalidatePath('/crud/places');
      return { success: 'Place created' };
    } catch (error) {
      return { error: `Error creating place, ${error}` };
    }
  }
  return { error: 'Forbidden Server Power!' };
};

export async function editPlace(params: {
  id: string;
  name: string;
  subregionId: string;
}) {
  const roles = await currentRoles();
  const { id, name, subregionId } = params;

  const validatedFields = UpdatePlace.safeParse({
    name: name,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Place.',
    };
  }
  if (roles?.includes('ADMIN')) {
    try {
      await db.place.update({
        where: { id: id },
        data: {
          name: name,
          subregionId: subregionId,
        },
      });
      revalidatePath('/admin/places');
      toast.success('Place updated');
      return { success: 'Place updated' };
    } catch (error) {
      toast.success(`Error updating place: ${error}`);

      return { error: 'Error updating place' };
    }
  }
  return { error: 'Forbidden Server Action!' };
}

export const deletePlace = async (id: string) => {
  const roles = await currentRoles();

  if (roles?.includes('ADMIN')) {
    try {
      await db.place.delete({
        where: { id: id },
      });
      revalidatePath('/admin/places');
      return { success: 'Place deleted' };
    } catch (error) {
      return { error: 'Error deleting place' };
    }
  }
  return { error: 'Forbidden Server Action!' };
};

const ITEMS_PER_PAGE = 15;

export async function fetchFilteredPlaces(
  query?: string,
  currentPage?: number
) {
  noStore();
  const offset = ((currentPage ?? 1) - 1) * ITEMS_PER_PAGE;

  try {
    const places = await db.place.findMany({
      where: {
        OR: [{ name: { contains: query } }],
      },
      include: {
        subregion: true,
      },
      take: ITEMS_PER_PAGE,
      skip: offset,
    });
    return places;
  } catch (error) {
    toast.error(`Database Error: ${error}`);
    throw new Error('Failed to fetch places.');
  }
}
export async function getPlacesForForm() {
  try {
    const places = await db.place.findMany({});
    return places;
  } catch (error) {
    toast.error(`Database Error: ${error}`);
    throw new Error('Failed to fetch places.');
  }
}

export async function fetchPlacesPages(query: string) {
  noStore();
  try {
    const count = await db.place.count({
      where: {
        OR: [{ name: { contains: query } }],
      },
    });

    const totalPages = Math.ceil(count / ITEMS_PER_PAGE);

    return totalPages;
  } catch (error) {
    toast.error(`Database Error: ${error}`);
    throw new Error('Failed to fetch total number of places.');
  }
}

export async function fetchPlaceById(id: string) {
  noStore();
  try {
    const place = await db.place.findUnique({
      where: { id: id },
    });

    return place;
  } catch (error) {
    toast.error(`Database Error: ${error}`);
    throw new Error('Failed to fetch place.');
  }
}

export async function getSubPlaces() {
  noStore();
  try {
    const places = await db.place.findMany({});
    return places;
  } catch (error) {
    console.error(`Database Error: ${error}`);
    throw new Error('Failed to fetch places.');
  }
}
