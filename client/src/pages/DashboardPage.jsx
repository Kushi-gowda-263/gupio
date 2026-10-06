import { useNavigate } from 'react-router-dom';
import {
  Package,
  Tag,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Plus,
  ArrowRight,
  DollarSign,
  TrendingUp,
  BarChart2,
  PieChart as PieIcon,
  Sparkles,
} from 'lucide-react';
import { useProductStats } from '../hooks/useProductStats.js';
import { useAuth } from '../context/AuthContext.jsx';
import { formatCurrency, formatRelativeTime } from '../utils/helpers.js';
import StockBadge from '../components/StockBadge.jsx';
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

export default function DashboardPage() {
  const { stats, loading, error, refresh } = useProductStats();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Greeting time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const categoryChartData = stats?.categoryBreakdown?.map((c) => ({
    name: c._id || 'Uncategorized',
    count: c.count,
    valuation: Math.round(c.totalValue),
  })) || [];

  const stockDistData = [
    { name: 'In Stock',     value: stats?.inStock     || 0, color: '#10b981' },
    { name: 'Low Stock',    value: stats?.lowStock    || 0, color: '#f59e0b' },
    { name: 'Out of Stock', value: stats?.outOfStock  || 0, color: '#ef4444' },
  ].filter((d) => d.value > 0);

  const totalStockCount = (stats?.inStock || 0) + (stats?.lowStock || 0) + (stats?.outOfStock || 0);
  const healthRate = totalStockCount > 0
    ? Math.round(((stats?.inStock || 0) / totalStockCount) * 100)
    : 100;

  return (
    <div>
      {/* ─── Enterprise Greeting Banner ─────────────────────────────────── */}
      <div className="page-header" style={{ marginBottom: 20 }}>
        <div>
          <h1 className="page-title">
            {getGreeting()}, {user?.name?.split(' ')[0] || 'Operator'}
          </h1>
          <p className="page-subtitle">
            Here's what's happening with your product inventory and stock levels today.
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => navigate('/products/add')}
          id="dashboard-add-product-btn"
        >
          <Plus size={15} /> Add Product
        </button>
      </div>

      {/* ─── KPI Metric Cards ────────────────────────────────────────────── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: 14,
          marginBottom: 20,
        }}
      >
        {/* TOTAL PRODUCTS */}
        <div className="stat-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Total Products
            </span>
            <div style={{ width: 28, height: 28, borderRadius: 6, background: 'var(--color-accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Package size={15} color="var(--color-accent)" />
            </div>
          </div>
          {loading ? (
            <div className="skeleton" style={{ height: 32, width: 70, marginBottom: 6 }} />
          ) : (
            <div className="stat-card-number">{stats?.totalProducts?.toLocaleString() ?? 0}</div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--color-text-muted)', marginTop: 4 }}>
            <span style={{ color: 'var(--color-success)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 2 }}>
              <TrendingUp size={12} /> Active
            </span>
            <span>across {stats?.totalCategories ?? 0} categories</span>
          </div>
        </div>

        {/* INVENTORY VALUATION */}
        <div className="stat-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Inventory Value
            </span>
            <div style={{ width: 28, height: 28, borderRadius: 6, background: 'var(--color-success-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <DollarSign size={15} color="var(--color-success)" />
            </div>
          </div>
          {loading ? (
            <div className="skeleton" style={{ height: 32, width: 100, marginBottom: 6 }} />
          ) : (
            <div className="stat-card-number">{formatCurrency(stats?.totalValue)}</div>
          )}
          <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 4 }}>
            Aggregated catalog worth
          </div>
        </div>

        {/* IN STOCK */}
        <div className="stat-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              In Stock
            </span>
            <div style={{ width: 28, height: 28, borderRadius: 6, background: 'var(--color-success-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle2 size={15} color="var(--color-success)" />
            </div>
          </div>
          {loading ? (
            <div className="skeleton" style={{ height: 32, width: 60, marginBottom: 6 }} />
          ) : (
            <div className="stat-card-number" style={{ color: 'var(--color-success)' }}>
              {stats?.inStock?.toLocaleString() ?? 0}
            </div>
          )}
          <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 4 }}>
            Healthy levels (&gt;10 units)
          </div>
        </div>

        {/* LOW STOCK */}
        <div className="stat-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Low Stock
            </span>
            <div style={{ width: 28, height: 28, borderRadius: 6, background: 'var(--color-warning-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AlertTriangle size={15} color="var(--color-warning)" />
            </div>
          </div>
          {loading ? (
            <div className="skeleton" style={{ height: 32, width: 50, marginBottom: 6 }} />
          ) : (
            <div className="stat-card-number" style={{ color: 'var(--color-warning)' }}>
              {stats?.lowStock?.toLocaleString() ?? 0}
            </div>
          )}
          <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 4 }}>
            Procurement needed (1–10 units)
          </div>
        </div>

        {/* OUT OF STOCK */}
        <div className="stat-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Out of Stock
            </span>
            <div style={{ width: 28, height: 28, borderRadius: 6, background: 'var(--color-danger-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <XCircle size={15} color="var(--color-danger)" />
            </div>
          </div>
          {loading ? (
            <div className="skeleton" style={{ height: 32, width: 40, marginBottom: 6 }} />
          ) : (
            <div className="stat-card-number" style={{ color: 'var(--color-danger)' }}>
              {stats?.outOfStock?.toLocaleString() ?? 0}
            </div>
          )}
          <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 4 }}>
            Depleted inventory (0 units)
          </div>
        </div>
      </div>

      {/* ─── Analytics & Charts Row ──────────────────────────────────────── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: 16,
          marginBottom: 20,
        }}
      >
        {/* Products by Category Bar Chart */}
        <div className="card">
          <div className="card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: 'var(--color-text-primary)' }}>
                Products by Category
              </h2>
              <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--color-text-muted)' }}>
                Catalog volume distributed by classification
              </p>
            </div>
            <BarChart2 size={16} color="var(--color-text-muted)" />
          </div>

          <div className="card-body" style={{ height: 250, paddingTop: 10 }}>
            {loading ? (
              <div className="skeleton" style={{ height: '100%', borderRadius: 8 }} />
            ) : categoryChartData.length === 0 ? (
              <div className="empty-state" style={{ height: '100%', padding: 20 }}>
                <p style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>No category data available yet.</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryChartData} margin={{ top: 10, right: 10, bottom: 10, left: -16 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip contentStyle={CUSTOM_TOOLTIP_STYLE} cursor={{ fill: 'var(--color-bg-subtle)' }} />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]} name="Products">
                    {categoryChartData.map((_, i) => (
                      <Cell key={i} fill={CHART_PALETTE[i % CHART_PALETTE.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Stock Health Availability Donut */}
        <div className="card">
          <div className="card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: 'var(--color-text-primary)' }}>
                Stock Health
              </h2>
              <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--color-text-muted)' }}>
                Availability ratio: {healthRate}% inventory operational
              </p>
            </div>
            <PieIcon size={16} color="var(--color-text-muted)" />
          </div>

          <div className="card-body" style={{ height: 250, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {loading ? (
              <div className="skeleton" style={{ width: 160, height: 160, borderRadius: '50%' }} />
            ) : stockDistData.length === 0 ? (
              <div className="empty-state" style={{ padding: 20 }}>
                <p style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>No stock distributions recorded.</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stockDistData}
                    cx="50%" cy="46%"
                    innerRadius={58} outerRadius={84}
                    paddingAngle={3} dataKey="value"
                  >
                    {stockDistData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
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

      {/* ─── Recent Products Table ───────────────────────────────────────── */}
      <div className="card">
        <div className="card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: 'var(--color-text-primary)' }}>
              Recent Products
            </h2>
            <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--color-text-muted)' }}>
              Latest catalog modifications saved to MongoDB Atlas
            </p>
          </div>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => navigate('/products')}
            style={{ fontSize: 12 }}
          >
            View all catalog <ArrowRight size={13} />
          </button>
        </div>

        <div className="card-body" style={{ padding: 0 }}>
          {loading ? (
            <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[1, 2, 3].map((i) => <div key={i} className="skeleton" style={{ height: 38 }} />)}
            </div>
          ) : !stats?.recentProducts?.length ? (
            <div className="empty-state" style={{ padding: '36px' }}>
              <Package size={32} className="empty-state-icon" />
              <p style={{ fontWeight: 600, fontSize: 14, margin: '0 0 4px' }}>No products recorded</p>
              <button className="btn btn-primary btn-sm" onClick={() => navigate('/products/add')} style={{ marginTop: 8 }}>
                Add your first product
              </button>
            </div>
          ) : (
            <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Status</th>
                    <th>Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentProducts.map((p) => (
                    <tr
                      key={p._id}
                      style={{ cursor: 'pointer' }}
                      onClick={() => navigate(`/products/${p._id}`)}
                    >
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <img
                            src={
                              p.image ||
                              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                p.name
                              )}&background=eef2ff&color=4f46e5&size=32&bold=true&format=svg`
                            }
                            alt={p.name}
                            style={{
                              width: 32,
                              height: 32,
                              borderRadius: 6,
                              objectFit: 'cover',
                              border: '1px solid var(--color-border)',
                              flexShrink: 0,
                            }}
                            onError={(e) => {
                              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                p.name
                              )}&background=eef2ff&color=4f46e5&size=32&bold=true&format=svg`;
                            }}
                          />
                          <div>
                            <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', fontSize: 13 }}>
                              {p.name}
                            </div>
                            <div style={{ fontSize: 11, fontFamily: 'monospace', color: 'var(--color-text-muted)' }}>
                              {p.sku}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-neutral">{p.category}</span>
                      </td>
                      <td style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
                        {formatCurrency(p.price)}
                      </td>
                      <td style={{ color: 'var(--color-text-secondary)', fontWeight: 500 }}>
                        {p.stockQuantity}
                      </td>
                      <td>
                        <StockBadge status={p.stockStatus} stockQuantity={p.stockQuantity} />
                      </td>
                      <td style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
                        {formatRelativeTime(p.updatedAt || p.createdAt)}
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
