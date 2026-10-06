import api from './api.js';

export const productService = {
  /**
   * Fetch paginated/filtered list of products.
   * @param {Object} params - search, category, stockStatus, sort, page, limit
   */
  getAll: (params = {}) =>
    api.get('/products', { params }).then((r) => r.data),

  getById: (id) =>
    api.get(`/products/${id}`).then((r) => r.data),

  create: (data) =>
    api.post('/products', data).then((r) => r.data),

  update: (id, data) =>
    api.put(`/products/${id}`, data).then((r) => r.data),

  delete: (id) =>
    api.delete(`/products/${id}`).then((r) => r.data),

  getStats: () =>
    api.get('/products/stats').then((r) => r.data),

  getCategories: () =>
    api.get('/products/categories').then((r) => r.data),
};
