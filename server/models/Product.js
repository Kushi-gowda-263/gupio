import mongoose from 'mongoose';

/**
 * Stock status is DERIVED from stockQuantity — never stored redundantly.
 *
 * Rules:
 *   0          → "Out of Stock"
 *   1 – 10     → "Low Stock"
 *   > 10       → "In Stock"
 */
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [200, 'Product name cannot exceed 200 characters'],
    },
    sku: {
      type: String,
      required: [true, 'SKU is required'],
      unique: true,
      uppercase: true,
      trim: true,
      maxlength: [50, 'SKU cannot exceed 50 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0.01, 'Price must be greater than 0'],
    },
    stockQuantity: {
      type: Number,
      required: [true, 'Stock quantity is required'],
      min: [0, 'Stock quantity cannot be negative'],
      default: 0,
    },
    image: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true, // automatically manages createdAt and updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

/**
 * Virtual field: stockStatus is computed on-the-fly from stockQuantity.
 * It is never persisted to the database.
 */
productSchema.virtual('stockStatus').get(function () {
  if (this.stockQuantity === 0) return 'Out of Stock';
  if (this.stockQuantity <= 10) return 'Low Stock';
  return 'In Stock';
});

// Compound index for faster search + category filter queries
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ createdAt: -1 });

const Product = mongoose.model('Product', productSchema);

export default Product;
