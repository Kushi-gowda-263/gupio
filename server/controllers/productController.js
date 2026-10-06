import mongoose from 'mongoose';
import Product from '../models/Product.js';
import { sendSuccess, sendError } from '../utils/responseUtils.js';

/**
 * GET /api/products
 * Supports: search, category, stockStatus, sort (price_asc/price_desc), page, limit
 */
export const getProducts = async (req, res, next) => {
  try {
    const {
      search,
      category,
      stockStatus,
      sort,
      page = 1,
      limit = 10,
    } = req.query;

    const filter = {};

    // Text search on name/description
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
      ];
    }

    // Category filter
    if (category) {
      filter.category = { $regex: `^${category}$`, $options: 'i' };
    }

    // Stock status filter — derived from stockQuantity ranges
    if (stockStatus) {
      switch (stockStatus.toLowerCase()) {
        case 'out of stock':
          filter.stockQuantity = 0;
          break;
        case 'low stock':
          filter.stockQuantity = { $gte: 1, $lte: 10 };
          break;
        case 'in stock':
          filter.stockQuantity = { $gt: 10 };
          break;
      }
    }

    // Sorting
    let sortOption = { createdAt: -1 }; // default: newest first
    if (sort === 'price_asc') sortOption = { price: 1 };
    if (sort === 'price_desc') sortOption = { price: -1 };
    if (sort === 'name_asc') sortOption = { name: 1 };
    if (sort === 'name_desc') sortOption = { name: -1 };

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      Product.find(filter).sort(sortOption).skip(skip).limit(limitNum),
      Product.countDocuments(filter),
    ]);

    return sendSuccess(res, 200, products, 'Products retrieved successfully', {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/products/:id
 */
export const getProductById = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return sendError(res, 400, 'Invalid product ID format');
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return sendError(res, 404, 'Product not found');
    }

    return sendSuccess(res, 200, product, 'Product retrieved successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/products
 * Body is pre-validated by validate middleware (req.validatedData)
 */
export const createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.validatedData);
    return sendSuccess(res, 201, product, 'Product created successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/products/:id
 * Body is pre-validated by validate middleware (req.validatedData)
 */
export const updateProduct = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return sendError(res, 400, 'Invalid product ID format');
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.validatedData,
      { new: true, runValidators: true }
    );

    if (!product) {
      return sendError(res, 404, 'Product not found');
    }

    return sendSuccess(res, 200, product, 'Product updated successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/products/:id
 */
export const deleteProduct = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return sendError(res, 400, 'Invalid product ID format');
    }

    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return sendError(res, 404, 'Product not found');
    }

    return sendSuccess(res, 200, null, 'Product deleted successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/products/stats
 * Returns aggregated statistics for the dashboard.
 */
export const getProductStats = async (req, res, next) => {
  try {
    const stats = await Product.aggregate([
      {
        $group: {
          _id: null,
          totalProducts: { $sum: 1 },
          totalValue: { $sum: { $multiply: ['$price', '$stockQuantity'] } },
          outOfStock: { $sum: { $cond: [{ $eq: ['$stockQuantity', 0] }, 1, 0] } },
          lowStock: { $sum: { $cond: [{ $and: [{ $gte: ['$stockQuantity', 1] }, { $lte: ['$stockQuantity', 10] }] }, 1, 0] } },
          inStock: { $sum: { $cond: [{ $gt: ['$stockQuantity', 10] }, 1, 0] } },
        },
      },
    ]);

    const categoryBreakdown = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 }, totalValue: { $sum: { $multiply: ['$price', '$stockQuantity'] } } } },
      { $sort: { count: -1 } },
    ]);

    const recentProducts = await Product.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .lean({ virtuals: true });

    const result = stats[0] || {
      totalProducts: 0,
      totalValue: 0,
      outOfStock: 0,
      lowStock: 0,
      inStock: 0,
    };

    return sendSuccess(res, 200, {
      ...result,
      totalCategories: categoryBreakdown.length,
      categoryBreakdown,
      recentProducts,
    }, 'Stats retrieved successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/products/categories
 * Returns distinct category list.
 */
export const getCategories = async (req, res, next) => {
  try {
    const categories = await Product.distinct('category');
    return sendSuccess(res, 200, categories.sort(), 'Categories retrieved successfully');
  } catch (err) {
    next(err);
  }
};
