import { cache } from "react";

import db from "@/lib/auth/db";

export const getPasswordResetTokenByToken = cache(async (token: string) => {
  try {
    const passwordResetToken = await db.passwordResetToken.findUnique({
      where: {
        token,
      },
    });
    return passwordResetToken;
  } catch {
    return null;
  }
});

export const getPasswordResetTokenByEmail = cache(async (email: string) => {
  try {
    const passwordResetToken = await db.passwordResetToken.findFirst({
      where: {
        email,
      },
    });
    return passwordResetToken;
  } catch {
    return null;
  }
});
