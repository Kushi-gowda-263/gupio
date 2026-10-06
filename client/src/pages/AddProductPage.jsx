import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { productService } from '../services/productService.js';
import { useToast } from '../context/ToastContext.jsx';
import { extractErrorMessage } from '../utils/helpers.js';
import ProductForm from '../components/ProductForm.jsx';

export default function AddProductPage() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState(null);

  const handleSubmit = async (data) => {
    setIsLoading(true);
    setServerError(null);
    try {
      const res = await productService.create(data);
      addToast(`"${res.data.name}" added to catalog successfully!`, 'success');
      navigate(`/products/${res.data._id}`);
    } catch (err) {
      setServerError(extractErrorMessage(err));
      addToast(extractErrorMessage(err), 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      {/* Back navigation */}
      <div style={{ marginBottom: 16 }}>
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => navigate('/products')}
          id="back-to-products-btn"
        >
          <ArrowLeft size={14} /> Back to Products
        </button>
      </div>

      <div className="page-header" style={{ marginBottom: 20 }}>
        <div>
          <h1 className="page-title">Add Product</h1>
          <p className="page-subtitle">Add a new product to your inventory.</p>
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
          onSubmit={handleSubmit}
          onCancel={() => navigate('/products')}
          isLoading={isLoading}
          submitLabel="Save Product"
        />
      </div>
    </div>
  );
}
