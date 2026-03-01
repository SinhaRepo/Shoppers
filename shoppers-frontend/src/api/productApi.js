import axiosInstance from './axiosInstance';

export const getAllProducts = () => axiosInstance.get('/products');

export const getProductById = (id) => axiosInstance.get(`/product/${id}`);

export const getRelatedProducts = (id, limit = 8) =>
  axiosInstance.get(`/product/${id}/related?limit=${limit}`);

export const getProductImage = (id) => `/api/product/${id}/image`;

export const searchProducts = (keyword) =>
  axiosInstance.get(`/products/search?keyword=${encodeURIComponent(keyword)}`);

export const addProduct = (formData) =>
  axiosInstance.post('/product', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const updateProduct = (id, formData) =>
  axiosInstance.put(`/product/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const deleteProduct = (id) => axiosInstance.delete(`/product/${id}`);
