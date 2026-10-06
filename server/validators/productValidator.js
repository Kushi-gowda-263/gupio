import { z } from 'zod';

export const createProductSchema = z.object({
  name: z
    .string({ required_error: 'Product name is required' })
    .trim()
    .min(1, 'Product name is required')
    .max(200, 'Product name cannot exceed 200 characters'),

  sku: z
    .string({ required_error: 'SKU is required' })
    .trim()
    .min(1, 'SKU is required')
    .max(50, 'SKU cannot exceed 50 characters'),

  description: z
    .string({ required_error: 'Description is required' })
    .trim()
    .min(1, 'Description is required')
    .max(2000, 'Description cannot exceed 2000 characters'),

  category: z
    .string({ required_error: 'Category is required' })
    .trim()
    .min(1, 'Category is required'),

  price: z
    .number({ required_error: 'Price is required', invalid_type_error: 'Price must be a number' })
    .positive('Price must be greater than 0'),

  stockQuantity: z
    .number({ required_error: 'Stock quantity is required', invalid_type_error: 'Stock quantity must be a number' })
    .int('Stock quantity must be a whole number')
    .min(0, 'Stock quantity cannot be negative'),

  image: z
    .string()
    .trim()
    .optional()
    .default(''),
});

// For updates, all fields are optional but validated if provided
export const updateProductSchema = createProductSchema.partial();
