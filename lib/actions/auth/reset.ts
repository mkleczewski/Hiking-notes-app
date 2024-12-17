'use server';

import { getUserByEmail } from '@/lib/data/user';

import { sendPasswordResetEmail } from '@/lib/auth/mail';
import { ResetSchema } from '@/schemas/index';

import { generateResetPasswordToken } from './tokens';
import * as z from 'zod';

export const reset = async (values: z.infer<typeof ResetSchema>) => {
  const validatedFields = ResetSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Invalid email' };
  }

  const { email } = validatedFields.data;
  const user = await getUserByEmail(email);

  if (!user) {
    return { error: 'Email not found' };
  }

  const passwordResetToken = await generateResetPasswordToken(email);
  await sendPasswordResetEmail(
    passwordResetToken.email,
    passwordResetToken.token
  );

  return { success: 'Reset email sent' };
};
