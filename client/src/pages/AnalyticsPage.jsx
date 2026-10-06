import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  Package,
  DollarSign,
  PieChart as PieIcon,
  ShieldCheck,
  ArrowRight,
  Eye,
  Pencil,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart,
  Pie,
  Legend,
} from 'recharts';
import { productService } from '../services/productService.js';
import { formatCurrency } from '../utils/helpers.js';
import StockBadge from '../components/StockBadge.jsx';

const CHART_PALETTE = ['#4f46e5', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const CUSTOM_TOOLTIP_STYLE = {
  background: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-md)',
  fontSize: 12.5,
  color: 'var(--color-text-primary)',
  boxShadow: 'var(--shadow-md)',
  padding: '8px 12px',
};

export default function AnalyticsPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [statsRes, prodRes] = await Promise.all([
          productService.getStats(),
          productService.getAll({ limit: 100 }),
        ]);
        setStats(statsRes.data);
        setProducts(prodRes.data || []);
      } catch (err) {
        console.error('Failed to load analytics data:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const totalProducts = stats?.totalProducts || 0;
  const totalValuation = stats?.totalValue || 0;
  const inStockCount = stats?.inStock || 0;
  const lowStockCount = stats?.lowStock || 0;
  const outOfStockCount = stats?.outOfStock || 0;

  const avgPrice = totalProducts > 0
    ? products.reduce((acc, p) => acc + (p.price || 0), 0) / (products.length || 1)
    : 0;

  const stockHealthRate = totalProducts > 0
    ? Math.round((inStockCount / totalProducts) * 100)
    : 100;

  const categoryData = stats?.categoryBreakdown?.map((c) => ({
    name: c._id || 'Uncategorized',
    products: c.count,
    valuation: Math.round(c.totalValue),
  })) || [];

  const stockDistribution = [
    { name: 'In Stock', value: inStockCount, color: '#10b981' },
    { name: 'Low Stock', value: lowStockCount, color: '#f59e0b' },
    { name: 'Out of Stock', value: outOfStockCount, color: '#ef4444' },
  ].filter((d) => d.value > 0);

  const restockAlerts = products.filter((p) => p.stockQuantity <= 10);

  return (
    <div>
      {/* ─── Header ──────────────────────────────────────────────────────── */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Analytics</h1>
          <p className="page-subtitle">
            Inventory valuation, stock distribution, and supply chain health indicators.
          </p>
        </div>
        <button
          className="btn btn-secondary"
          onClick={() => navigate('/products')}
          id="analytics-view-catalog-btn"
        >
          View Full Catalog <ArrowRight size={13} />
        </button>
      </div>

      {/* ─── Key KPI Metrics ─────────────────────────────────────────────── */}
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
              Inventory Valuation
            </span>
            <div style={{ width: 28, height: 28, borderRadius: 6, background: 'var(--color-success-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <DollarSign size={15} color="var(--color-success)" />
            </div>
          </div>
          <div className="stat-card-number">{loading ? '…' : formatCurrency(totalValuation)}</div>
          <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 4 }}>
            Aggregated worth
          </div>
        </div>

        <div className="stat-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Average Unit Price
            </span>
            <div style={{ width: 28, height: 28, borderRadius: 6, background: 'var(--color-accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp size={15} color="var(--color-accent)" />
            </div>
          </div>
          <div className="stat-card-number">{loading ? '…' : formatCurrency(avgPrice)}</div>
          <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 4 }}>
            Across {totalProducts} items
          </div>
        </div>

        <div className="stat-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Stock Health
            </span>
            <div style={{ width: 28, height: 28, borderRadius: 6, background: 'var(--color-info-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={15} color="var(--color-info)" />
            </div>
          </div>
          <div className="stat-card-number" style={{ color: 'var(--color-success)' }}>
            {loading ? '…' : `${stockHealthRate}%`}
          </div>
          <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 4 }}>
            {inStockCount} of {totalProducts} in healthy stock
          </div>
        </div>

        <div className="stat-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Restock Needed
            </span>
            <div style={{ width: 28, height: 28, borderRadius: 6, background: 'var(--color-danger-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AlertTriangle size={15} color="var(--color-danger)" />
            </div>
          </div>
          <div className="stat-card-number" style={{ color: restockAlerts.length > 0 ? 'var(--color-warning)' : 'inherit' }}>
            {loading ? '…' : restockAlerts.length}
          </div>
          <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 4 }}>
            {outOfStockCount} out of stock, {lowStockCount} low
          </div>
        </div>
      </div>

      {/* ─── Charts ──────────────────────────────────────────────────────── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: 16,
          marginBottom: 20,
        }}
      >
        {/* Inventory Value by Category */}
        <div className="card">
          <div className="card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: 'var(--color-text-primary)' }}>
                Inventory Valuation by Category
              </h2>
              <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--color-text-muted)' }}>
                Capital tied up per product line
              </p>
            </div>
            <BarChart3 size={16} color="var(--color-text-muted)" />
          </div>

          <div className="card-body" style={{ height: 260, paddingTop: 10 }}>
            {loading ? (
              <div className="skeleton" style={{ height: '100%', borderRadius: 8 }} />
            ) : categoryData.length === 0 ? (
              <div className="empty-state" style={{ height: '100%', padding: 20 }}>
                <p style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>No category data available.</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} margin={{ top: 10, right: 10, bottom: 20, left: 0 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }} axisLine={false} tickLine={false} />
                  <YAxis
                    tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `$${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
                  />
                  <Tooltip
                    contentStyle={CUSTOM_TOOLTIP_STYLE}
                    formatter={(val) => [formatCurrency(val), 'Valuation']}
                  />
                  <Bar dataKey="valuation" radius={[4, 4, 0, 0]}>
                    {categoryData.map((_, i) => (
                      <Cell key={i} fill={CHART_PALETTE[i % CHART_PALETTE.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Stock Distribution Donut */}
        <div className="card">
          <div className="card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: 'var(--color-text-primary)' }}>
                Stock Distribution
              </h2>
              <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--color-text-muted)' }}>
                Ratio of inventory readiness
              </p>
            </div>
            <PieIcon size={16} color="var(--color-text-muted)" />
          </div>

          <div className="card-body" style={{ height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {loading ? (
              <div className="skeleton" style={{ width: 170, height: 170, borderRadius: '50%' }} />
            ) : stockDistribution.length === 0 ? (
              <div className="empty-state" style={{ padding: 20 }}>
                <p style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>No stock distributions recorded.</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stockDistribution}
                    cx="50%" cy="46%"
                    innerRadius={60} outerRadius={88}
                    paddingAngle={3} dataKey="value"
                  >
                    {stockDistribution.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={CUSTOM_TOOLTIP_STYLE} />
                  <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: 11.5 }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* ─── Low Stock Restock Table ─────────────────────────────────────── */}
      <div className="card">
        <div className="card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: 'var(--color-text-primary)' }}>
              Low Stock & Restock Priorities
            </h2>
            <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--color-text-muted)' }}>
              Items with 10 units or fewer requiring procurement attention
            </p>
          </div>
          <span
            className="badge badge-warning"
            style={{ fontWeight: 600 }}
          >
            {restockAlerts.length} Action Items
          </span>
        </div>

        <div className="card-body" style={{ padding: 0 }}>
          {restockAlerts.length === 0 ? (
            <div style={{ padding: 36, textAlign: 'center', color: 'var(--color-success)' }}>
              <ShieldCheck size={32} style={{ margin: '0 auto 8px' }} />
              <p style={{ fontWeight: 600, fontSize: 14, margin: 0 }}>All items have healthy inventory levels!</p>
            </div>
          ) : (
            <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>SKU</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {restockAlerts.map((p) => (
                    <tr key={p._id}>
                      <td>
                        <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
                          {p.name}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, background: 'var(--color-bg-subtle)', padding: '2px 6px', borderRadius: 4 }}>
                          {p.sku}
                        </span>
                      </td>
                      <td>
                        <span className="badge badge-neutral">{p.category}</span>
                      </td>
                      <td style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
                        {formatCurrency(p.price)}
                      </td>
                      <td style={{ fontWeight: 600, color: p.stockQuantity === 0 ? 'var(--color-danger)' : 'var(--color-warning)' }}>
                        {p.stockQuantity} units
                      </td>
                      <td>
                        <StockBadge status={p.stockStatus} stockQuantity={p.stockQuantity} />
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: 4 }}>
                          <button
                            type="button"
                            className="btn btn-ghost btn-icon"
                            onClick={() => navigate(`/products/${p._id}`)}
                            title="View Details"
                            style={{ width: 28, height: 28 }}
                          >
                            <Eye size={13} />
                          </button>
                          <button
                            type="button"
                            className="btn btn-ghost btn-icon"
                            onClick={() => navigate(`/products/${p._id}/edit`)}
                            title="Edit / Restock"
                            style={{ width: 28, height: 28 }}
                          >
                            <Pencil size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
