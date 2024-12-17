'use server';

import { getUserByEmail, getUserById } from '@/lib/data/user';

import { generateVerificationToken } from '@/lib/actions/auth/tokens';
import db from '@/lib/auth/db';
import { sendVerificationEmail } from '@/lib/auth/mail';
import { currentUser } from '@/lib/auth/sessionData';
import { SettingsSchema } from '@/schemas/index';

import bcrypt from 'bcryptjs';
import * as z from 'zod';

export const settings = async (values: z.infer<typeof SettingsSchema>) => {
  const user = await currentUser();

  if (!user) {
    return { error: 'Unauthorized!' };
  }

  const dbUser = await getUserById(user.id as string);

  if (!dbUser) {
    return { error: 'Unauthorized!' };
  }

  if (user.isOAuth) {
    values.email = undefined;
    values.password = undefined;
    values.newPassword = undefined;
    values.isTwoFactorEnabled = undefined;
  }

  if (values.email && values.email !== user.email) {
    const existingUser = await getUserByEmail(values.email);

    if (existingUser && existingUser.id !== user.id) {
      return { error: 'Email is already taken!' };
    }

    const verificationToken = await generateVerificationToken(values.email);
    await sendVerificationEmail(
      verificationToken.token,
      verificationToken.email
    );

    return { success: 'Verification email sent!' };
  }

  if (values.password && values.password && dbUser.password) {
    const passwordsMatch = await bcrypt.compare(
      values.password,
      dbUser.password
    );

    if (!passwordsMatch) {
      return { error: 'Current password is incorrect!' };
    }

    if (!values.newPassword) {
      return { error: 'New password is required!' };
    }
    const hashedPassword = await bcrypt.hash(values.newPassword, 10);
    values.password = hashedPassword;
    values.newPassword = undefined;
  }

  await db.user.update({
    where: { id: dbUser.id },
    data: {
      ...values,
    },
  });

  return { success: 'Settings updated!' };
};
