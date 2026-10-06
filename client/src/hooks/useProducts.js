import { useState, useEffect, useCallback, useRef } from 'react';
import { productService } from '../services/productService.js';

/**
 * Hook for fetching a paginated, filtered product list.
 * Debounces search input to avoid excessive API calls.
 */
export const useProducts = (initialParams = {}) => {
  const [products, setProducts] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 10, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [params, setParams] = useState({ page: 1, limit: 10, ...initialParams });

  const debounceRef = useRef(null);

  const fetchProducts = useCallback(async (queryParams) => {
    setLoading(true);
    setError(null);
    try {
      const res = await productService.getAll(queryParams);
      setProducts(res.data);
      setMeta(res.meta);
    } catch (err) {
      setError(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchProducts(params);
    }, params.search ? 350 : 0);

    return () => clearTimeout(debounceRef.current);
  }, [params, fetchProducts]);

  const updateParams = useCallback((updates) => {
    setParams((prev) => ({
      ...prev,
      ...updates,
      // reset to page 1 when filters change (not when changing page itself)
      ...(updates.page === undefined ? { page: 1 } : {}),
    }));
  }, []);

  const refresh = useCallback(() => fetchProducts(params), [params, fetchProducts]);

  return { products, meta, loading, error, params, updateParams, refresh };
};
