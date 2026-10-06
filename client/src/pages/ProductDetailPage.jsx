import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Pencil,
  Trash2,
  Package,
  Calendar,
  RefreshCw,
  Tag,
  DollarSign,
  ChevronRight,
  Shield,
  Layers,
  Sparkles,
} from 'lucide-react';
import { productService } from '../services/productService.js';
import { formatCurrency, formatDate, extractErrorMessage } from '../utils/helpers.js';
import { useToast } from '../context/ToastContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import StockBadge from '../components/StockBadge.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { isAdmin } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await productService.getById(id);
        setProduct(res.data);
      } catch (err) {
        setError(extractErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleDelete = async () => {
    if (!isAdmin) {
      addToast('Administrative role required to delete products.', 'error');
      setDeleteOpen(false);
      return;
    }

    setIsDeleting(true);
    try {
      await productService.delete(id);
      addToast(`"${product.name}" deleted successfully.`, 'success');
      navigate('/products');
    } catch (err) {
      addToast(extractErrorMessage(err), 'error');
      setIsDeleting(false);
      setDeleteOpen(false);
    }
  };

  if (loading) {
    return (
      <div style={{ maxWidth: 1040, margin: '0 auto' }}>
        <div className="skeleton" style={{ width: 140, height: 28, marginBottom: 20 }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
          <div className="skeleton" style={{ height: 340, borderRadius: 12 }} />
          <div className="card card-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[1, 2, 3, 4].map((i) => <div key={i} className="skeleton" style={{ height: 28 }} />)}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="empty-state" style={{ marginTop: 60, maxWidth: 480, margin: '60px auto 0' }}>
        <Package size={40} className="empty-state-icon" />
        <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 6px', color: 'var(--color-text-primary)' }}>
          Product Not Found
        </h3>
        <p style={{ color: 'var(--color-danger)', fontSize: 13, marginBottom: 16 }}>{error}</p>
        <button className="btn btn-secondary btn-sm" onClick={() => navigate('/products')}>
          <ArrowLeft size={14} /> Return to Catalog
        </button>
      </div>
    );
  }

  if (!product) return null;

  const totalValuation = (product.price || 0) * (product.stockQuantity || 0);

  return (
    <div style={{ maxWidth: 1080, margin: '0 auto' }}>
      {/* ─── Breadcrumbs ─────────────────────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          marginBottom: 16,
          fontSize: 13,
          color: 'var(--color-text-secondary)',
        }}
      >
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={() => navigate('/products')}
          style={{ padding: '2px 6px', height: 26 }}
        >
          <ArrowLeft size={13} /> Products
        </button>
        <span style={{ color: 'var(--color-text-muted)' }}>/</span>
        <span style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>
          {product.name}
        </span>
      </div>

      {/* ─── Top Header & Primary Actions ────────────────────────────────── */}
      <div className="page-header" style={{ marginBottom: 20 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <h1 className="page-title">{product.name}</h1>
            <StockBadge status={product.stockStatus} stockQuantity={product.stockQuantity} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 12,
                color: 'var(--color-text-secondary)',
                background: 'var(--color-bg-subtle)',
                padding: '2px 8px',
                borderRadius: 4,
                border: '1px solid var(--color-border)',
              }}
            >
              SKU: {product.sku}
            </span>
            <span style={{ color: 'var(--color-text-muted)' }}>•</span>
            <span className="badge badge-neutral">{product.category}</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button
            className="btn btn-secondary"
            onClick={() => navigate(`/products/${id}/edit`)}
            id="edit-product-btn"
          >
            <Pencil size={14} /> Edit Product
          </button>
          {isAdmin ? (
            <button
              className="btn btn-danger"
              onClick={() => setDeleteOpen(true)}
              id="delete-product-btn"
            >
              <Trash2 size={14} /> Delete
            </button>
          ) : (
            <button
              className="btn btn-danger"
              disabled
              title="Admin role required to delete products"
              style={{ opacity: 0.45, cursor: 'not-allowed' }}
            >
              <Trash2 size={14} /> Delete (Admin)
            </button>
          )}
        </div>
      </div>

      {/* ─── Detail Presentation Grid ────────────────────────────────────── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 22,
          alignItems: 'start',
        }}
      >
        {/* Left: Product Image Card */}
        <div className="card" style={{ overflow: 'hidden' }}>
          <div
            style={{
              width: '100%',
              aspectRatio: '16/11',
              backgroundColor: 'var(--color-bg-subtle)',
              position: 'relative',
              overflow: 'hidden',
              borderBottom: '1px solid var(--color-border)',
            }}
          >
            <img
              src={
                product.image ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  product.name
                )}&background=eef2ff&color=4f46e5&size=500&bold=true&format=svg`
              }
              alt={product.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  product.name
                )}&background=eef2ff&color=4f46e5&size=500&bold=true&format=svg`;
              }}
            />
          </div>

          <div style={{ padding: '16px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontSize: 13, color: 'var(--color-text-secondary)', fontWeight: 500 }}>
                Inventory Status
              </span>
              <StockBadge status={product.stockStatus} stockQuantity={product.stockQuantity} />
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '10px 12px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--color-bg-subtle)',
                fontSize: 12.5,
              }}
            >
              <span style={{ color: 'var(--color-text-secondary)' }}>Calculated Total Value:</span>
              <strong style={{ color: 'var(--color-text-primary)' }}>
                {formatCurrency(totalValuation)}
              </strong>
            </div>
          </div>
        </div>

        {/* Right: Metrics & Specifications */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Top Numerical Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="stat-card">
              <span style={{ fontSize: 11.5, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Unit Price
              </span>
              <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--color-text-primary)', marginTop: 4 }}>
                {formatCurrency(product.price)}
              </div>
            </div>

            <div className="stat-card">
              <span style={{ fontSize: 11.5, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Stock on Hand
              </span>
              <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--color-text-primary)', marginTop: 4 }}>
                {product.stockQuantity} units
              </div>
            </div>
          </div>

          {/* Description Block */}
          <div className="card card-body">
            <h3 style={{ margin: '0 0 10px', fontSize: 13, fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Description
            </h3>
            <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.6, color: 'var(--color-text-primary)', whiteSpace: 'pre-wrap' }}>
              {product.description}
            </p>
          </div>

          {/* Audit Metadata */}
          <div className="card card-body">
            <h3 style={{ margin: '0 0 12px', fontSize: 13, fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Metadata & Audit Trail
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5 }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>MongoDB Object ID</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, background: 'var(--color-bg-subtle)', padding: '2px 6px', borderRadius: 4 }}>
                  {product._id}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5 }}>
                <span style={{ color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Calendar size={13} /> Created
                </span>
                <span style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>
                  {formatDate(product.createdAt)}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5 }}>
                <span style={{ color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: 5 }}>
                  <RefreshCw size={13} /> Last Updated
                </span>
                <span style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>
                  {formatDate(product.updatedAt)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteOpen}
        title="Delete product?"
        description={`This action cannot be undone. "${product.name}" (${product.sku}) will be permanently erased.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(false)}
        isLoading={isDeleting}
      />
    </div>
  );
}
