import NextAuth, { type DefaultSession } from 'next-auth';

export type UserRole = 'ADMIN' | 'USER' | 'PRZODOWNIK' | 'REFERAT';

export type ExtendedUser = DefaultSession['user'] & {
  role: UserRole;
  image: string;
  isOAuth: boolean;
  isTwoFactorEnabled: boolean;
  roles: UserRole[];
};

declare module 'next-auth' {
  interface Session {
    user: ExtendedUser;
  }
}
