import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Tag,
  Plus,
  Package,
  DollarSign,
  ArrowRight,
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FolderOpen,
} from 'lucide-react';
import { productService } from '../services/productService.js';
import { formatCurrency } from '../utils/helpers.js';
import { useToast } from '../context/ToastContext.jsx';

export default function CategoriesPage() {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const prodRes = await productService.getAll({ limit: 100 });
        const prods = prodRes.data || [];

        const map = {};
        for (const p of prods) {
          const cat = p.category || 'Uncategorized';
          if (!map[cat]) {
            map[cat] = {
              name: cat,
              count: 0,
              totalValue: 0,
              inStock: 0,
              lowStock: 0,
              outOfStock: 0,
            };
          }
          map[cat].count += 1;
          map[cat].totalValue += (p.price || 0) * (p.stockQuantity || 0);
          if (p.stockQuantity === 0) map[cat].outOfStock += 1;
          else if (p.stockQuantity <= 10) map[cat].lowStock += 1;
          else map[cat].inStock += 1;
        }

        setCategories(Object.values(map).sort((a, b) => b.count - a.count));
      } catch (err) {
        addToast(err.message || 'Failed to load categories', 'error');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [addToast]);

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalValue = categories.reduce((sum, c) => sum + c.totalValue, 0);

  return (
    <div>
      {/* ─── Header ──────────────────────────────────────────────────────── */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Categories</h1>
          <p className="page-subtitle">
            Catalog organization and inventory valuation across product classifications.
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => navigate('/products/add')}
          id="add-category-product-btn"
        >
          <Plus size={15} /> Add Product
        </button>
      </div>

      {/* ─── Summary Cards ────────────────────────────────────────────────── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: 14,
          marginBottom: 20,
        }}
      >
        <div className="stat-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Categories
            </span>
            <div style={{ width: 28, height: 28, borderRadius: 6, background: 'var(--color-accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Tag size={15} color="var(--color-accent)" />
            </div>
          </div>
          <div className="stat-card-number">{loading ? '…' : categories.length}</div>
          <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 4 }}>
            Active classifications
          </div>
        </div>

        <div className="stat-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Largest Category
            </span>
            <div style={{ width: 28, height: 28, borderRadius: 6, background: 'var(--color-info-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Package size={15} color="var(--color-info)" />
            </div>
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-text-primary)' }}>
            {loading ? '…' : categories[0]?.name || 'N/A'}
          </div>
          <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 4 }}>
            {categories[0] ? `${categories[0].count} products registered` : ''}
          </div>
        </div>

        <div className="stat-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Total Valuation
            </span>
            <div style={{ width: 28, height: 28, borderRadius: 6, background: 'var(--color-success-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <DollarSign size={15} color="var(--color-success)" />
            </div>
          </div>
          <div className="stat-card-number">{loading ? '…' : formatCurrency(totalValue)}</div>
          <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 4 }}>
            Combined across all segments
          </div>
        </div>
      </div>

      {/* ─── Search / Filter ─────────────────────────────────────────────── */}
      <div className="card" style={{ padding: '12px 16px', marginBottom: 18 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div className="search-input-wrapper" style={{ flex: '1 1 280px' }}>
            <Search size={14} className="search-icon" />
            <input
              id="category-search"
              className="form-input"
              placeholder="Filter categories by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ height: 34, fontSize: 13 }}
            />
          </div>
          <span style={{ fontSize: 12.5, color: 'var(--color-text-muted)' }}>
            {filteredCategories.length} categor{filteredCategories.length === 1 ? 'y' : 'ies'} listed
          </span>
        </div>
      </div>

      {/* ─── Category Cards Grid ─────────────────────────────────────────── */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="card card-body" style={{ height: 140 }}>
              <div className="skeleton" style={{ width: '50%', height: 20, marginBottom: 10 }} />
              <div className="skeleton" style={{ width: '80%', height: 28 }} />
            </div>
          ))}
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="empty-state">
          <FolderOpen size={36} className="empty-state-icon" />
          <h3 style={{ fontSize: 15, fontWeight: 600, margin: '0 0 4px', color: 'var(--color-text-primary)' }}>
            No categories found
          </h3>
          <p style={{ fontSize: 13, color: 'var(--color-text-muted)', margin: 0 }}>
            Try adjusting your search query.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: 14 }}>
          {filteredCategories.map((cat) => (
            <div
              key={cat.name}
              className="card"
              style={{
                padding: '18px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 7,
                        background: 'var(--color-accent-light)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Tag size={16} color="var(--color-accent)" />
                    </div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: 14.5, fontWeight: 600, color: 'var(--color-text-primary)' }}>
                        {cat.name}
                      </h3>
                      <span style={{ fontSize: 11.5, color: 'var(--color-text-muted)' }}>
                        {cat.count} product{cat.count === 1 ? '' : 's'} registered
                      </span>
                    </div>
                  </div>

                  <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-primary)', fontFeatureSettings: 'tnum' }}>
                    {formatCurrency(cat.totalValue)}
                  </span>
                </div>

                {/* Stock health pill indicators */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    marginTop: 12,
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--color-bg-subtle)',
                    fontSize: 11.5,
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--color-success)', fontWeight: 500 }}>
                    <CheckCircle2 size={12} /> {cat.inStock} In Stock
                  </span>
                  {cat.lowStock > 0 && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--color-warning)', fontWeight: 500 }}>
                      <AlertTriangle size={12} /> {cat.lowStock} Low
                    </span>
                  )}
                  {cat.outOfStock > 0 && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--color-danger)', fontWeight: 500 }}>
                      <XCircle size={12} /> {cat.outOfStock} Out
                    </span>
                  )}
                </div>
              </div>

              {/* Action Link */}
              <div
                style={{
                  marginTop: 14,
                  paddingTop: 12,
                  borderTop: '1px solid var(--color-border-subtle)',
                  display: 'flex',
                  justifyContent: 'flex-end',
                }}
              >
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => navigate(`/products?category=${encodeURIComponent(cat.name)}`)}
                  style={{ fontSize: 12 }}
                >
                  View Catalog <ArrowRight size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
