import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Package,
  RotateCcw,
  MoreVertical,
  LayoutGrid,
  List,
  Shield,
  Layers,
} from 'lucide-react';
import { useProducts } from '../hooks/useProducts.js';
import { productService } from '../services/productService.js';
import { formatCurrency, formatRelativeTime, truncate } from '../utils/helpers.js';
import { useToast } from '../context/ToastContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import StockBadge from '../components/StockBadge.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';

const SORT_OPTIONS = [
  { value: '', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low → High' },
  { value: 'price_desc', label: 'Price: High → Low' },
  { value: 'name_asc', label: 'Name: A → Z' },
  { value: 'name_desc', label: 'Name: Z → A' },
];

const STOCK_OPTIONS = [
  { value: '', label: 'All Stock Statuses' },
  { value: 'in stock', label: 'In Stock (>10)' },
  { value: 'low stock', label: 'Low Stock (1–10)' },
  { value: 'out of stock', label: 'Out of Stock (0)' },
];

export default function ProductsPage() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { isAdmin } = useAuth();
  const { products, meta, loading, error, params, updateParams, refresh } = useProducts();

  const [categories, setCategories] = useState([]);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [openActionId, setOpenActionId] = useState(null);
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'

  const actionMenuRef = useRef(null);

  // Close three-dot menu on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (actionMenuRef.current && !actionMenuRef.current.contains(e.target)) {
        setOpenActionId(null);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Fetch categories for filter dropdown
  useEffect(() => {
    productService.getCategories()
      .then((r) => setCategories(r.data || []))
      .catch(() => {});
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    if (!isAdmin) {
      addToast('Administrative role required to delete catalog products.', 'error');
      setDeleteTarget(null);
      return;
    }

    setIsDeleting(true);
    try {
      await productService.delete(deleteTarget._id);
      addToast(`"${deleteTarget.name}" deleted successfully.`, 'success');
      setDeleteTarget(null);
      refresh();
    } catch (err) {
      addToast(err.message || 'Failed to delete product.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleResetFilters = () => {
    updateParams({ search: '', category: '', stockStatus: '', sort: '', page: 1 });
  };

  const hasActiveFilters = Boolean(
    params.search || params.category || params.stockStatus || params.sort
  );

  const totalPages = meta?.totalPages || 1;

  return (
    <div>
      {/* ─── Header ──────────────────────────────────────────────────────── */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Products</h1>
          <p className="page-subtitle">
            Manage and monitor your product inventory across all categories.
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => navigate('/products/add')}
          id="add-product-btn"
        >
          <Plus size={15} /> Add Product
        </button>
      </div>

      {/* ─── Professional Toolbar ────────────────────────────────────────── */}
      <div
        className="card"
        style={{
          padding: '12px 16px',
          marginBottom: 16,
          background: 'var(--color-surface)',
        }}
      >
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Search Input */}
          <div className="search-input-wrapper" style={{ flex: '1 1 240px' }}>
            <Search size={14} className="search-icon" />
            <input
              id="product-search"
              className="form-input"
              placeholder="Search products by name, SKU..."
              value={params.search || ''}
              onChange={(e) => updateParams({ search: e.target.value, page: 1 })}
              style={{ height: 34, fontSize: 13 }}
            />
          </div>

          {/* Category Dropdown */}
          <select
            id="category-filter"
            className="form-select"
            style={{ width: 160, flex: '0 0 auto', height: 34, fontSize: 12.5 }}
            value={params.category || ''}
            onChange={(e) => updateParams({ category: e.target.value, page: 1 })}
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* Stock Status Dropdown */}
          <select
            id="stock-filter"
            className="form-select"
            style={{ width: 160, flex: '0 0 auto', height: 34, fontSize: 12.5 }}
            value={params.stockStatus || ''}
            onChange={(e) => updateParams({ stockStatus: e.target.value, page: 1 })}
          >
            {STOCK_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>

          {/* Sort Dropdown */}
          <select
            id="sort-select"
            className="form-select"
            style={{ width: 165, flex: '0 0 auto', height: 34, fontSize: 12.5 }}
            value={params.sort || ''}
            onChange={(e) => updateParams({ sort: e.target.value, page: 1 })}
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={handleResetFilters}
              style={{ fontSize: 12, gap: 4 }}
              title="Reset query"
            >
              <RotateCcw size={13} /> Clear
            </button>
          )}

          {/* View Toggle (Table / Card) */}
          <div
            style={{
              display: 'flex',
              marginLeft: 'auto',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-sm)',
              overflow: 'hidden',
            }}
          >
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`btn btn-ghost btn-sm ${viewMode === 'table' ? 'active' : ''}`}
              style={{
                borderRadius: 0,
                padding: '6px 8px',
                background: viewMode === 'table' ? 'var(--color-bg-subtle)' : 'transparent',
                color: viewMode === 'table' ? 'var(--color-accent)' : 'var(--color-text-muted)',
              }}
              title="Table View"
            >
              <List size={14} />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`btn btn-ghost btn-sm ${viewMode === 'grid' ? 'active' : ''}`}
              style={{
                borderRadius: 0,
                padding: '6px 8px',
                background: viewMode === 'grid' ? 'var(--color-bg-subtle)' : 'transparent',
                color: viewMode === 'grid' ? 'var(--color-accent)' : 'var(--color-text-muted)',
              }}
              title="Card Grid View"
            >
              <LayoutGrid size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* ─── Content Presentation (Table or Card Grid) ───────────────────── */}
      {loading ? (
        <div className="card card-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="skeleton" style={{ height: 44, width: '100%' }} />
          ))}
        </div>
      ) : error ? (
        <div className="empty-state">
          <p style={{ color: 'var(--color-danger)', fontSize: 14, fontWeight: 500 }}>
            Unable to load products: {error}
          </p>
          <button className="btn btn-secondary btn-sm" onClick={refresh} style={{ marginTop: 8 }}>
            Try Again
          </button>
        </div>
      ) : products.length === 0 ? (
        <div className="empty-state">
          <Package size={40} className="empty-state-icon" />
          <h3 style={{ fontSize: 16, fontWeight: 600, margin: '0 0 6px', color: 'var(--color-text-primary)' }}>
            No products found
          </h3>
          <p style={{ fontSize: 13, color: 'var(--color-text-muted)', margin: '0 0 16px', maxWidth: 360 }}>
            {hasActiveFilters
              ? 'No items match your active filters. Try loosening your keywords.'
              : 'Start building your inventory catalog by adding your first product.'}
          </p>
          {hasActiveFilters ? (
            <button className="btn btn-secondary btn-sm" onClick={handleResetFilters}>
              Clear All Filters
            </button>
          ) : (
            <button className="btn btn-primary btn-sm" onClick={() => navigate('/products/add')}>
              <Plus size={14} /> Add Product
            </button>
          )}
        </div>
      ) : viewMode === 'table' ? (
        /* ─── DESKTOP DATA TABLE ─────────────────────────────────────────── */
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Product</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Updated</th>
                <th style={{ textAlign: 'right', width: 60 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id}>
                  {/* Thumbnail + Name + Snippet */}
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <img
                        src={
                          p.image ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            p.name
                          )}&background=eef2ff&color=4f46e5&size=36&bold=true&format=svg`
                        }
                        alt={p.name}
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 6,
                          objectFit: 'cover',
                          border: '1px solid var(--color-border)',
                          flexShrink: 0,
                          background: 'var(--color-bg-subtle)',
                        }}
                        onError={(e) => {
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            p.name
                          )}&background=eef2ff&color=4f46e5&size=36&bold=true&format=svg`;
                        }}
                      />
                      <div>
                        <div
                          style={{
                            fontWeight: 600,
                            color: 'var(--color-text-primary)',
                            fontSize: 13.5,
                            cursor: 'pointer',
                          }}
                          onClick={() => navigate(`/products/${p._id}`)}
                          className="hover:underline"
                        >
                          {truncate(p.name, 40)}
                        </div>
                        <div style={{ fontSize: 11.5, color: 'var(--color-text-muted)' }}>
                          {truncate(p.description, 48)}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* SKU */}
                  <td>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 11.5,
                        color: 'var(--color-text-secondary)',
                        background: 'var(--color-bg-subtle)',
                        padding: '2px 6px',
                        borderRadius: 4,
                        border: '1px solid var(--color-border)',
                      }}
                    >
                      {p.sku}
                    </span>
                  </td>

                  {/* Category */}
                  <td>
                    <span className="badge badge-neutral">{p.category}</span>
                  </td>

                  {/* Price */}
                  <td style={{ fontWeight: 600, color: 'var(--color-text-primary)', fontFeatureSettings: 'tnum' }}>
                    {formatCurrency(p.price)}
                  </td>

                  {/* Stock Quantity */}
                  <td style={{ fontWeight: 500, color: 'var(--color-text-secondary)' }}>
                    {p.stockQuantity}
                  </td>

                  {/* Status Badge */}
                  <td>
                    <StockBadge status={p.stockStatus} stockQuantity={p.stockQuantity} />
                  </td>

                  {/* Updated Time */}
                  <td style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
                    {formatRelativeTime(p.updatedAt || p.createdAt)}
                  </td>

                  {/* Actions (Three-Dot Menu) */}
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                      <button
                        type="button"
                        className="btn btn-ghost btn-icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenActionId(openActionId === p._id ? null : p._id);
                        }}
                        style={{ width: 28, height: 28 }}
                        id={`action-menu-${p._id}`}
                      >
                        <MoreVertical size={14} />
                      </button>

                      {openActionId === p._id && (
                        <div
                          ref={actionMenuRef}
                          className="dropdown-menu"
                          style={{ right: 0, top: '100%' }}
                        >
                          <button
                            className="dropdown-item"
                            onClick={() => navigate(`/products/${p._id}`)}
                          >
                            <Eye size={13} /> View Details
                          </button>
                          <button
                            className="dropdown-item"
                            onClick={() => navigate(`/products/${p._id}/edit`)}
                          >
                            <Pencil size={13} /> Edit Product
                          </button>
                          {isAdmin ? (
                            <button
                              className="dropdown-item danger"
                              onClick={() => {
                                setOpenActionId(null);
                                setDeleteTarget(p);
                              }}
                            >
                              <Trash2 size={13} /> Delete Product
                            </button>
                          ) : (
                            <button
                              className="dropdown-item"
                              disabled
                              style={{ opacity: 0.4, cursor: 'not-allowed' }}
                              title="Admin required to delete"
                            >
                              <Trash2 size={13} /> Delete (Admin)
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* ─── CARD GRID VIEW (Responsive / Mobile-Friendly) ─────────────── */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
          {products.map((p) => (
            <div
              key={p._id}
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '16px',
                cursor: 'pointer',
              }}
              onClick={() => navigate(`/products/${p._id}`)}
            >
              <div>
                <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                  <img
                    src={
                      p.image ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        p.name
                      )}&background=eef2ff&color=4f46e5&size=50&bold=true&format=svg`
                    }
                    alt={p.name}
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 6,
                      objectFit: 'cover',
                      border: '1px solid var(--color-border)',
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--color-text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {p.name}
                    </div>
                    <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)', marginTop: 2 }}>
                      {p.sku}
                    </div>
                    <div style={{ marginTop: 6 }}>
                      <span className="badge badge-neutral" style={{ fontSize: 10 }}>{p.category}</span>
                    </div>
                  </div>
                </div>

                <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', lineHeight: 1.4, margin: '0 0 12px' }}>
                  {truncate(p.description, 70)}
                </p>
              </div>

              <div style={{ borderTop: '1px solid var(--color-border-subtle)', paddingTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-text-primary)' }}>
                    {formatCurrency(p.price)}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
                    {p.stockQuantity} in stock
                  </div>
                </div>
                <StockBadge status={p.stockStatus} stockQuantity={p.stockQuantity} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─── Pagination Bar ──────────────────────────────────────────────── */}
      {totalPages > 1 && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 18,
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <span style={{ fontSize: 12.5, color: 'var(--color-text-secondary)' }}>
            Showing page {params.page || 1} of {totalPages} ({meta?.total ?? 0} total items)
          </span>
          <div style={{ display: 'flex', gap: 6 }}>
            <button
              className="btn btn-secondary btn-sm"
              disabled={params.page <= 1}
              onClick={() => updateParams({ page: (params.page || 1) - 1 })}
              id="prev-page-btn"
            >
              <ChevronLeft size={13} /> Previous
            </button>
            <button
              className="btn btn-secondary btn-sm"
              disabled={params.page >= totalPages}
              onClick={() => updateParams({ page: (params.page || 1) + 1 })}
              id="next-page-btn"
            >
              Next <ChevronRight size={13} />
            </button>
          </div>
        </div>
      )}

      {/* ─── Confirmation Modal ─────────────────────────────────────────── */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete product?"
        description={`This action cannot be undone. "${deleteTarget?.name}" (${deleteTarget?.sku}) will be permanently erased.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        isLoading={isDeleting}
      />
    </div>
  );
}
