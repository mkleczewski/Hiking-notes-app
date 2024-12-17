import { cache } from "react";

import db from "@/lib/auth/db";

export const getVerificationTokenByToken = cache(async (token: string) => {
  try {
    const verificationToken = await db.verificationToken.findUnique({
      where: { token },
    });

    return verificationToken;
  } catch (error) {
    return null;
  }
});

export const getVerificationTokenByEmail = cache(async (email: string) => {
  try {
    const verificationToken = await db.verificationToken.findFirst({
      where: { email },
    });

    return verificationToken;
  } catch (error) {
    return null;
  }
});
