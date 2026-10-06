import { z } from 'zod';

/**
 * Client-side Zod validation schema for Product forms.
 * Mirrors the server-side schema in server/validators/productValidator.js
 */
export const productFormSchema = z.object({
  name: z
    .string({ required_error: 'Product name is required' })
    .min(1, 'Product name is required')
    .max(200, 'Cannot exceed 200 characters'),

  sku: z
    .string({ required_error: 'SKU is required' })
    .min(1, 'SKU is required')
    .max(50, 'Cannot exceed 50 characters'),

  description: z
    .string({ required_error: 'Description is required' })
    .min(1, 'Description is required')
    .max(2000, 'Cannot exceed 2000 characters'),

  category: z
    .string({ required_error: 'Category is required' })
    .min(1, 'Category is required'),

  price: z
    .string()
    .min(1, 'Price is required')
    .refine((v) => !isNaN(parseFloat(v)) && parseFloat(v) > 0, {
      message: 'Price must be a positive number',
    }),

  stockQuantity: z
    .string()
    .min(1, 'Stock quantity is required')
    .refine((v) => !isNaN(parseInt(v)) && parseInt(v) >= 0, {
      message: 'Stock quantity must be 0 or more',
    }),

  image: z.string().optional().default(''),
});
