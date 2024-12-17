import { Role, SubregionPrivilege, User, UserRole } from '@prisma/client';
import * as z from 'zod';

export const SettingsSchema = z
  .object({
    name: z.optional(z.string().min(1)),
    isTwoFactorEnabled: z.optional(z.boolean()),
    role: z.enum(['ADMIN', 'USER', 'PRZODOWNIK', 'REFERAT']),
    email: z.optional(z.string().email()),
    password: z.optional(
      z.string().min(1, {
        message: 'The current password is needed to reset the password',
      })
    ),
    newPassword: z.optional(
      z
        .string()
        .min(8, {
          message: 'Password must be at least 8 characters',
        })
        .regex(
          new RegExp('(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[*.!@$%&]).{8,32}'),
          {
            message:
              'Password must contain one uppercase letter, one lowercase letter, one number and one of the following characters: * . ! @ $ % &',
          }
        )
    ),
  })
  .refine(
    (data) => {
      if (data.password && !data.newPassword) {
        return false;
      }

      return true;
    },
    {
      message: 'New password is required!',
      path: ['newPassword'],
    }
  )
  .refine(
    (data) => {
      if (data.newPassword && !data.password) {
        return false;
      }

      return true;
    },
    {
      message: 'Password is required!',
      path: ['password'],
    }
  );

export const NewPasswordSchema = z.object({
  password: z
    .string()
    .min(8, {
      message: 'Password must be at least 8 characters',
    })
    .regex(
      new RegExp('(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[*.!@$%&]).{8,32}'),
      {
        message:
          'Password must contain one uppercase letter, one lowercase letter, one number and one of the following characters: * . ! @ $ % &',
      }
    ),
});

export const ResetSchema = z.object({
  email: z.string().email({
    message: 'Email is required',
  }),
});

export const LoginSchema = z.object({
  email: z.string().email({
    message: 'Email is required',
  }),
  password: z.string().min(1, {
    message: 'Password is required',
  }),
  code: z.optional(
    z
      .string()
      .min(1, { message: 'Code is required' })
      .max(6, { message: 'Code cannot be longer than six chracters' })
  ),
});

export const RegisterSchema = z.object({
  email: z.string().email({
    message: 'Email is required',
  }),
  password: z
    .string()
    .min(8, {
      message: 'Password must be at least 8 characters',
    })
    .regex(
      new RegExp('(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[*.!@$%&]).{8,32}'),
      {
        message:
          'Password must contain one uppercase letter, one lowercase letter, one number and one of the following characters: * . ! @ $ % &',
      }
    ),
  name: z.string().min(1, {
    message: 'Name is required',
  }),
});

export const BookSchema = z.object({
  date: z.string(),
  routeId: z.string({
    message: 'Route is required',
  }),
  leaderPresent: z.string().optional(),
  images: z.array(z.string()).optional(),
  comment: z.string().optional(),
  backtracked: z.boolean().optional(),
});

export type Leader = User & {
  userRoles: (UserRole & {
    role: Role;
  })[];
};

export type Leaders = Leader[];

const SubregionSchema = z.object({
  privileges: z.array(z.object({ userId: z.string() })),
  name: z.string(),
  code: z.string().nullable(),
  id: z.string(),
  deletedAt: z.date().nullable(),
  regionId: z.string(),
});

// Zdefiniuj schemat Zod dla regionów
const RegionSchema = z.object({
  name: z.string(),
  id: z.string(),
  deletedAt: z.date().nullable(),
  subregions: z.array(SubregionSchema),
});

// Główny schemat dla całego obiektu
const ResponseDataSchema = z.object({
  regions: z.array(RegionSchema),
});

// Eksportuj typ TypeScript
export type ResponseData = z.infer<typeof ResponseDataSchema>;
