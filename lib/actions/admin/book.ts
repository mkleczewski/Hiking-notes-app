'use server';
import { currentUser } from '@/lib/actions/actualUserInfo';
import db from '@/lib/auth/db';
import { slugifyFileName } from '@/lib/utils';
import { BookSchema } from '@/schemas/index';

import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';
import { unstable_noStore as noStore } from 'next/cache';
import { toast } from 'sonner';

export const getBooksAmount = async (): Promise<
  number | { error: string; count: number }
> => {
  try {
    const user = await currentUser();
    const books = await db.trip.findMany({
      where: {
        userId: user?.id,
      },
    });
    return books.length;
  } catch (error) {
    return { error: 'Error fetching all books', count: 0 };
  }
};

export const deleteBook = async (id: string) => {
  try {
    await db.trip.delete({
      where: { id: id },
    });
    revalidatePath('/ksiazeczka');
    return { success: 'Record deleted' };
  } catch (error) {
    return { error: 'Error deleting record' };
  }
};

export const findUser = async (id: string) => {
  try {
    const user = await db.user.findUnique({
      where: { id: id },
    });
    return user;
  } catch (error) {
    return { error: 'Error fetching user' };
  }
};

export const verifyEntry = async (id: string) => {
  const currUser = await currentUser();
  try {
    await db.trip.update({
      where: { id: id },
      data: {
        verifiedById: currUser?.id as string,
      },
    });
    revalidatePath('/przodownik');
    return { success: 'Record verified' };
  } catch (error) {
    return { error: 'Error verifying record' };
  }
};

const ITEMS_PER_PAGE = 15;

export async function fetchFilteredBooks(query: string, currentPage: number) {
  noStore();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  const user = await currentUser();

  try {
    const books = await db.trip.findMany({
      where: {
        userId: user?.id,
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

export async function fetchVerifiedBook(
  query: string,
  currentPage: number,
  userId: string
) {
  noStore();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const books = await db.trip.findMany({
      where: {
        userId: userId,
        belongsToBadgeId: null,
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

export async function getBooksForForm() {
  try {
    const books = await db.trip.findMany({});
    return books;
  } catch (error) {
    toast.error(`Database Error: ${error}`);
  }
}

export async function fetchBooksPages(query: string) {
  noStore();
  try {
    const user = await currentUser();

    const count = await db.trip.count({
      where: {
        userId: user?.id,
        OR: [{ date: { contains: query } }],
      },
    });

    const totalPages = Math.ceil(count / ITEMS_PER_PAGE);

    return totalPages;
  } catch (error) {
    throw new Error('Failed to fetch total number of books.');
  }
}

export async function fetchBookById(id: string) {
  noStore();
  try {
    const trip = await db.trip.findUnique({
      where: { id: id },
    });

    return trip;
  } catch (error) {
    throw new Error('Failed to fetch trip.');
  }
}

export async function getSubRegions() {
  noStore();
  try {
    const books = await db.trip.findMany({});
    return books;
  } catch (error) {
    throw new Error('Failed to fetch books.');
  }
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);
async function uploadFileToSupabase(file: File, path: string) {
  const PARTIAL_URL =
    'https://omdpmzfvacgvhwprbslc.supabase.co/storage/v1/object/public/routes_images/';
  try {
    const { data, error } = await supabase.storage
      .from('routes_images')
      .upload(path, file, {
        upsert: true,
      });

    if (error) {
      console.error('Supabase error:', error.message);
      throw new Error(`File upload failed: ${error.message}`);
    }
    return PARTIAL_URL + data?.path;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`File upload failed: ${error.message}`);
    }
  }
}

export const createBook = async (values: FormData) => {
  const user = await currentUser();

  if (!user) {
    return {
      status: 'error',
      message: 'You need to be logged in to create a product',
    };
  }

  const userId = user?.id as string;
  const date = values.get('date') as string;
  const routeId = values.get('routeId') as string;
  const leaderPresent = values.get('leaderPresent') as string;
  const imageFiles = values.getAll('images') as File[];
  const comment = values.get('comment') as string;
  const backtracked = values.get('backtracked') === 'true';

  const validateFields = BookSchema.safeParse({
    date: date,
    routeId: routeId,
    leaderPresent: leaderPresent,
    comment: comment,
    backtracked: backtracked,
  });

  if (!validateFields?.success) {
    console.log('Validation error:', validateFields.error);
    return {
      status: 'error',
      message: 'Oops, I think there is a mistake with your inputs.',
    };
  }

  try {
    const imageUploads = await Promise.all(
      imageFiles.map((file) => {
        const filePath = `images/${user.id}/${slugifyFileName(
          (file as File).name
        )}`;
        return uploadFileToSupabase(file as File, filePath);
      })
    );

    if (!imageUploads) {
      throw new Error('Error uploading product images');
    }

    const {
      data: { date, routeId, leaderPresent },
    } = validateFields;
    await db.trip.create({
      data: {
        userId,
        date,
        routeId,
        leaderPresent,
        comment,
        backtracked,
        images: imageUploads as string[],
      },
    });
  } catch (error) {
    return { error: `Error creating trip, ${error}` };
  }
};
export async function editBook(values: FormData, id: string) {
  const user = await currentUser();
  const userId = user?.id as string;
  const date = values.get('date') as string;
  const routeId = values.get('routeId') as string;
  const leaderPresent = values.get('leaderPresent') as string;
  const imageFiles = values.getAll('images');
  const comment = values.get('comment') as string;
  const backtracked = values.get('backtracked') === 'true';

  const newImageFiles = imageFiles.filter(
    (item) => item instanceof File
  ) as File[];

  if (newImageFiles.length === 0) {
    const images = await db.trip.findUnique({
      where: { id: id },
      select: {
        images: true,
      },
    });

    await db.trip.update({
      where: { id: id },
      data: {
        userId,
        date,
        routeId,
        comment,
        backtracked,
        leaderPresent,
        images: images?.images,
      },
    });
  } else {
    const oldTrip = await db.trip.findUnique({
      where: { id: id },
      select: { images: true },
    });
    const oldImageUrl = oldTrip?.images[0];

    if (oldImageUrl) {
      const baseUrl =
        'https://omdpmzfvacgvhwprbslc.supabase.co/storage/v1/object/public/routes_images/';
      const oldFilePath = oldImageUrl.replace(baseUrl, '');

      const { error: deleteError } = await supabase.storage
        .from('routes_images')
        .remove([oldFilePath]);

      if (deleteError) {
        console.error('Error deleting old image:', deleteError);
        throw new Error('Error deleting old image');
      }
    }

    const imageUploads = await Promise.all(
      newImageFiles.map((file) => {
        const filePath = `images/${userId}/${slugifyFileName(file.name)}`;
        return uploadFileToSupabase(file, filePath);
      })
    );

    if (!imageUploads) {
      throw new Error('Error uploading images');
    }

    await db.trip.update({
      where: { id: id },
      data: {
        userId,
        date,
        routeId,
        leaderPresent: leaderPresent as string,
        images: imageUploads as string[],
      },
    });
  }

  revalidatePath('/ksiazeczka');
  return { success: 'Book updated' };
}
