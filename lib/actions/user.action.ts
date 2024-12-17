/* eslint-disable no-console */
import { cache } from 'react';

import db from '@/lib/auth/db';

export const getAllUsers = cache(async () => {
  try {
    const users = await db.user.findMany();

    return users;
  } catch (error) {
    console.log(error);
    throw error;
  }
});
