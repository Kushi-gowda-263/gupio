import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productFormSchema } from '../utils/validators.js';
import {
  AlertCircle,
  Image as ImageIcon,
  DollarSign,
  Package,
  Layers,
  Sparkles,
  UploadCloud,
} from 'lucide-react';
import { formatCurrency } from '../utils/helpers.js';
import StockBadge from './StockBadge.jsx';

const CATEGORIES = [
  'Electronics',
  'Clothing',
  'Furniture',
  'Food & Beverage',
  'Sports & Outdoors',
  'Books',
  'Toys & Games',
  'Health & Beauty',
  'Automotive',
  'Tools & Hardware',
  'Office Supplies',
  'Other',
];

export default function ProductForm({
  defaultValues = {},
  onSubmit,
  onCancel,
  isLoading = false,
  submitLabel = 'Save Product',
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: defaultValues.name || '',
      sku: defaultValues.sku || '',
      description: defaultValues.description || '',
      category: defaultValues.category || '',
      price: defaultValues.price !== undefined ? String(defaultValues.price) : '',
      stockQuantity: defaultValues.stockQuantity !== undefined ? String(defaultValues.stockQuantity) : '',
      image: defaultValues.image || '',
    },
  });

  const watchedValues = watch();
  const currentPrice = parseFloat(watchedValues.price) || 0;
  const currentStock = parseInt(watchedValues.stockQuantity, 10) || 0;
  const currentValuation = currentPrice * currentStock;

  const handleFormSubmit = (data) => {
    onSubmit({
      ...data,
      price: parseFloat(data.price),
      stockQuantity: parseInt(data.stockQuantity, 10),
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 28,
          alignItems: 'start',
        }}
      >
        {/* ─── LEFT: FORM FIELDS (60%) ──────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Product Name & SKU */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div className="form-group">
              <label className="form-label" htmlFor="field-name">
                Product Name <span style={{ color: 'var(--color-danger)' }}>*</span>
              </label>
              <input
                id="field-name"
                className={`form-input${errors.name ? ' error' : ''}`}
                placeholder="e.g. Wireless Keypad"
                {...register('name')}
              />
              {errors.name && (
                <span className="form-error">
                  <AlertCircle size={12} /> {errors.name.message}
                </span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="field-sku">
                SKU Identifier <span style={{ color: 'var(--color-danger)' }}>*</span>
              </label>
              <input
                id="field-sku"
                className={`form-input${errors.sku ? ' error' : ''}`}
                placeholder="e.g. WK-001"
                style={{ textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}
                {...register('sku')}
              />
              {errors.sku && (
                <span className="form-error">
                  <AlertCircle size={12} /> {errors.sku.message}
                </span>
              )}
            </div>
          </div>

          {/* Category, Price, Stock */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 14 }}>
            <div className="form-group">
              <label className="form-label" htmlFor="field-category">
                Category <span style={{ color: 'var(--color-danger)' }}>*</span>
              </label>
              <select
                id="field-category"
                className={`form-select${errors.category ? ' error' : ''}`}
                {...register('category')}
              >
                <option value="">Select category</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              {errors.category && (
                <span className="form-error">
                  <AlertCircle size={12} /> {errors.category.message}
                </span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="field-price">
                Unit Price (USD) <span style={{ color: 'var(--color-danger)' }}>*</span>
              </label>
              <input
                id="field-price"
                type="number"
                step="0.01"
                min="0.01"
                className={`form-input${errors.price ? ' error' : ''}`}
                placeholder="0.00"
                {...register('price')}
              />
              {errors.price && (
                <span className="form-error">
                  <AlertCircle size={12} /> {errors.price.message}
                </span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="field-stock">
                Stock Quantity <span style={{ color: 'var(--color-danger)' }}>*</span>
              </label>
              <input
                id="field-stock"
                type="number"
                min="0"
                step="1"
                className={`form-input${errors.stockQuantity ? ' error' : ''}`}
                placeholder="0"
                {...register('stockQuantity')}
              />
              {errors.stockQuantity && (
                <span className="form-error">
                  <AlertCircle size={12} /> {errors.stockQuantity.message}
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label" htmlFor="field-description">
              Product Description <span style={{ color: 'var(--color-danger)' }}>*</span>
            </label>
            <textarea
              id="field-description"
              className={`form-textarea${errors.description ? ' error' : ''}`}
              placeholder="Outline item specifications, material properties, and warranty details..."
              rows={4}
              {...register('description')}
            />
            {errors.description && (
              <span className="form-error">
                <AlertCircle size={12} /> {errors.description.message}
              </span>
            )}
          </div>

          {/* Image URL with drag/drop upload styling */}
          <div className="form-group">
            <label className="form-label" htmlFor="field-image">
              Product Image URL <span style={{ color: 'var(--color-text-muted)', fontWeight: 400 }}>(Optional)</span>
            </label>
            <input
              id="field-image"
              className="form-input"
              placeholder="https://images.unsplash.com/..."
              {...register('image')}
            />
            <span className="form-hint" style={{ fontSize: 11.5 }}>
              Direct web image link. A clean branded fallback icon is generated if omitted.
            </span>
          </div>

          {/* Bottom Actions */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: 10,
              paddingTop: 12,
              borderTop: '1px solid var(--color-border)',
            }}
          >
            {onCancel && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onCancel}
                disabled={isLoading}
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={isLoading}
              id="product-form-submit"
            >
              {isLoading ? 'Saving changes…' : submitLabel}
            </button>
          </div>
        </div>

        {/* ─── RIGHT: LIVE PREVIEW & INVENTORY SUMMARY (40%) ──────────────── */}
        <div style={{ position: 'sticky', top: 80 }}>
          <div className="card" style={{ overflow: 'hidden' }}>
            <div className="card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Live Catalog Preview
              </span>
              <Sparkles size={14} color="var(--color-accent)" />
            </div>

            {/* Simulated Card Image Frame */}
            <div
              style={{
                width: '100%',
                height: 180,
                background: 'var(--color-bg-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
                borderBottom: '1px solid var(--color-border)',
              }}
            >
              {watchedValues.image ? (
                <img
                  src={watchedValues.image}
                  alt="Live preview"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              ) : (
                <div style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>
                  <ImageIcon size={32} style={{ margin: '0 auto 6px' }} />
                  <span style={{ fontSize: 11.5 }}>No image specified</span>
                </div>
              )}
            </div>

            {/* Summary Details */}
            <div className="card-body" style={{ padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: 'var(--color-text-primary)' }}>
                    {watchedValues.name || 'Untitled Product'}
                  </h4>
                  <span style={{ fontSize: 11.5, fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>
                    {watchedValues.sku || 'SKU-PENDING'}
                  </span>
                </div>
                <StockBadge stockQuantity={currentStock} />
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 8,
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--color-bg-subtle)',
                  marginTop: 12,
                  fontSize: 12,
                }}
              >
                <div>
                  <span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Unit Price</span>
                  <strong style={{ fontSize: 13, color: 'var(--color-text-primary)' }}>
                    {formatCurrency(currentPrice)}
                  </strong>
                </div>
                <div>
                  <span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Total Value</span>
                  <strong style={{ fontSize: 13, color: 'var(--color-text-primary)' }}>
                    {formatCurrency(currentValuation)}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
