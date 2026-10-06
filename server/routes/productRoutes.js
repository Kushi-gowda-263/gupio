import { Router } from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductStats,
  getCategories,
} from '../controllers/productController.js';
import { validate } from '../middleware/validate.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { createProductSchema, updateProductSchema } from '../validators/productValidator.js';

const router = Router();

// Stats and categories must come BEFORE /:id
router.get('/stats', authenticate, getProductStats);
router.get('/categories', authenticate, getCategories);

// Product read endpoints - accessible to all authenticated users (STAFF & ADMIN)
router.get('/', authenticate, getProducts);
router.get('/:id', authenticate, getProductById);

// Product write endpoints - STAFF and ADMIN can create & edit
router.post(
  '/',
  authenticate,
  authorize('ADMIN', 'STAFF'),
  validate(createProductSchema),
  createProduct
);

router.put(
  '/:id',
  authenticate,
  authorize('ADMIN', 'STAFF'),
  validate(updateProductSchema),
  updateProduct
);

// Delete endpoint - STRICTLY ADMIN ONLY
router.delete(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  deleteProduct
);

export default router;
