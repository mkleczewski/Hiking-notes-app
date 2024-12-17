'use server';

import { getUserByEmail } from '@/lib/data/user';

import db from '@/lib/auth/db';
import { sendVerificationEmail } from '@/lib/auth/mail';
import { RegisterSchema } from '@/schemas/index';

import { generateVerificationToken } from './tokens';
import bcrypt from 'bcryptjs';
import * as z from 'zod';

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Invalid fields!' };
  }

  const { email, password, name } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { error: 'Email is already taken' };
  }

  // Fetch the Role ID for "USER"
  const userRole = await db.role.findUnique({
    where: { name: 'USER' },
  });

  if (!userRole) {
    return { error: 'Default role USER not found in the database' };
  }

  // Create the user and assign the "USER" role
  await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      userRoles: {
        create: {
          role: {
            connect: { id: userRole.id },
          },
        },
      },
    },
  });

  const verificationToken = await generateVerificationToken(email);

  await sendVerificationEmail(verificationToken.email, verificationToken.token);

  return { success: 'Confirmation email sent!' };
};
