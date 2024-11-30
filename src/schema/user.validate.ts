import { GenderSchema, UserRoleSchema } from '@/enums'
import { z } from 'zod'
import { RelationshipsTypeSchema } from './relationship.validate'

// Zod schema for the User interface
export const UserSchema = z.object({
  id: z.number().int().positive(), // Must be a positive integer
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters long')
    .max(20, 'Username must be at most 20 characters long')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  avatar: z
    .string()
    .url()
    .refine(
      (url) => /\.(jpg|jpeg|png|gif)$/i.test(url),
      'Avatar must be a valid image URL (.jpg, .jpeg, .png, or .gif)',
    )
    .nullable()
    .optional(),
  isFirstLogin: z.boolean().optional(),
  email: z.string().email('Invalid email address'),
  phone: z
    .string()
    .length(10, 'Phone number must be exactly 10 digits')
    .regex(/^\d{10}$/, 'Phone number must contain only digits'),
  gender: GenderSchema,
  nationId: z
    .string()
    .min(12, 'Nation ID is 12 characters required')
    .max(12, 'At most 12 characters required'),
  fullName: z
    .string()
    .min(2, 'Full name must be at least 2 characters long')
    .max(50, 'Full name must be at most 50 characters long'),
  userType: UserRoleSchema,
  dateOfBirth: z.coerce
    .date()
    .refine((date) => date <= new Date(), 'Date of birth cannot be in the future')
    .refine((date) => {
      const age = new Date().getFullYear() - date.getFullYear()
      return age <= 100 // Check if age is 100 years or less
    }, 'Bro are you a vampire?'),
  isStaying: z.boolean().optional(),
})

export type UserFormSchema = z.infer<typeof UserSchema>
// Example of schema for Nullable type
export const NullableUserSchema = UserSchema.partial().nullable()

// Zod schema for UserLogin type
export const UserLoginSchema = z.object({
  username: z.string().trim().min(1, 'Username is required'),
  password: z.string().trim().min(1, 'Password is required'),
})

export interface UserLogin extends z.infer<typeof UserLoginSchema> {}

// Example Zod schema for UserPartial (Partial<User>)

export interface User extends UserFormSchema, BaseEntity {
  relationships?: RelationshipsTypeSchema[]
}

export const FirstLoginSchema = z
  .object({
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(/[\W_]/, 'Password must contain at least one special character'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

export interface FirstLogin extends z.infer<typeof FirstLoginSchema> {}
