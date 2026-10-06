import { z } from 'zod';

export const registerSchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name cannot exceed 100 characters'),

  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .email('Please enter a valid email address (e.g. user@example.com)')
    .toLowerCase(),

  password: z
    .string({ required_error: 'Password is required' })
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password cannot exceed 100 characters'),

  role: z
    .preprocess((val) => {
      if (!val || typeof val !== 'string' || val.trim() === '') return 'STAFF';
      return val.trim().toUpperCase();
    }, z.enum(['ADMIN', 'STAFF'], {
      errorMap: () => ({ message: 'Role must be either ADMIN or STAFF' }),
    }))
    .optional()
    .default('STAFF'),
});

export const loginSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .email('Please enter a valid email address')
    .toLowerCase(),

  password: z
    .string({ required_error: 'Password is required' })
    .min(1, 'Password is required'),
});
