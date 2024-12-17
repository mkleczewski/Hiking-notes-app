'use server';

import { currentRole } from '@/lib/auth/sessionData';

export const admin = async () => {
  const role = await currentRole();

  if (role !== 'PRO') {
    return { error: 'Forbidden' };
  }

  return { success: 'Success!' };
};
