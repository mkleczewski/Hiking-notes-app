
import { auth } from "@/lib/auth/auth";

export const currentUser = async () => {
  const session = await auth();
  return session?.user;
};

export const currentRoles = async () => {
  const session = await auth();
  return session?.user?.roles;
};
