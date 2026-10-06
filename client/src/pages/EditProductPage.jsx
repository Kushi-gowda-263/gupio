import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { productService } from '../services/productService.js';
import { useToast } from '../context/ToastContext.jsx';
import { extractErrorMessage, formatRelativeTime } from '../utils/helpers.js';
import ProductForm from '../components/ProductForm.jsx';

export default function EditProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [product, setProduct] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [serverError, setServerError] = useState(null);

  useEffect(() => {
    productService.getById(id)
      .then((r) => setProduct(r.data))
      .catch((err) => setLoadError(extractErrorMessage(err)))
      .finally(() => setIsFetching(false));
  }, [id]);

  const handleSubmit = async (data) => {
    setIsLoading(true);
    setServerError(null);
    try {
      const res = await productService.update(id, data);
      addToast(`"${res.data.name}" updated successfully!`, 'success');
      navigate(`/products/${id}`);
    } catch (err) {
      setServerError(extractErrorMessage(err));
      addToast(extractErrorMessage(err), 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 24 }}>
          {[1, 2, 3].map((i) => <div key={i} className="skeleton" style={{ height: 50, borderRadius: 8 }} />)}
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="empty-state" style={{ marginTop: 60 }}>
        <p style={{ color: 'var(--color-danger)' }}>{loadError}</p>
        <button className="btn btn-secondary" onClick={() => navigate('/products')}>
          <ArrowLeft size={14} /> Back to Products
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ marginBottom: 16 }}>
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => navigate(`/products/${id}`)}
          id="back-to-product-btn"
        >
          <ArrowLeft size={14} /> Back to Product
        </button>
      </div>

      <div className="page-header" style={{ marginBottom: 20 }}>
        <div>
          <h1 className="page-title">Edit Product</h1>
          <p className="page-subtitle">
            Update pricing, inventory quantities, and specifications for {product?.name}.
            {product?.updatedAt && ` Last modified ${formatRelativeTime(product.updatedAt)}.`}
          </p>
        </div>
      </div>

      {serverError && (
        <div
          style={{
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            marginBottom: 20,
            background: 'var(--color-danger-bg)',
            border: '1px solid var(--color-danger-border)',
            color: 'var(--color-danger)',
            fontSize: 13,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <AlertCircle size={15} /> {serverError}
        </div>
      )}

      <div className="card card-body">
        <ProductForm
          defaultValues={product}
          onSubmit={handleSubmit}
          onCancel={() => navigate(`/products/${id}`)}
          isLoading={isLoading}
          submitLabel="Save Changes"
        />
      </div>
    </div>
  );
}
