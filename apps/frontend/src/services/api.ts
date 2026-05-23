import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  headers: { 'Content-Type': 'application/json' },
});

// Interceptor: adiciona token JWT
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Interceptor: refresh automático (simplificado)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const { data } = await axios.post(`${api.defaults.baseURL}/auth/refresh`, { refreshToken });
          localStorage.setItem('accessToken', data.accessToken);
          localStorage.setItem('refreshToken', data.refreshToken);
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
          return api(originalRequest);
        } catch {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  },
);

// Auth
export const authAPI = {
  register: (name: string, email: string, password: string) =>
    api.post('/auth/register', { name, email, password }),
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  me: () => api.get('/users/me'),
  updateProfile: (data: { name?: string; avatarUrl?: string }) =>
    api.put('/users/me', data),
};

// Produtos
export const productsAPI = {
  list: (params?: Record<string, any>) => api.get('/products', { params }),
  getById: (id: string) => api.get(`/products/${id}`),
  create: (data: FormData) => api.post('/products', data),
  update: (id: string, data: any) => api.put(`/products/${id}`, data),
  delete: (id: string) => api.delete(`/products/${id}`),
};

// Categorias
export const categoriesAPI = {
  list: () => api.get('/categories'),
};

// Carrinho
export const cartAPI = {
  get: () => api.get('/cart'),
  addItem: (productId: string, quantity: number, variation?: Record<string, string>) =>
    api.post('/cart/items', { productId, quantity, variation }),
  updateItem: (itemId: string, quantity: number) =>
    api.put(`/cart/items/${itemId}`, { quantity }),
  removeItem: (itemId: string) => api.delete(`/cart/items/${itemId}`),
};

// Pedidos
export const ordersAPI = {
  create: (data: { shippingAddress?: any; paymentMethod?: string }) =>
    api.post('/orders', data),
  list: () => api.get('/orders'),
  getById: (id: string) => api.get(`/orders/${id}`),
  updateStatus: (id: string, status: string) =>
  api.patch(`/orders/${id}/status`, { status }),
};

// Pagamentos
export const paymentsAPI = {
  checkout: (orderId: string, method: string) =>
    api.post('/payments/checkout', { orderId, method }),
  getStatus: (id: string) => api.get(`/payments/${id}`),
};

// Upload
export const uploadAPI = {
  uploadImages: (files: File[], folder = 'products') => {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));
    formData.append('folder', folder);
    return api.post('/upload/images', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

// Seller
export const sellersAPI = {
  getStore: () => api.get('/sellers/me'),
  updateStore: (data: { storeName?: string; description?: string; logoUrl?: string }) =>
    api.put('/sellers/me', data),
  getDashboard: () => api.get('/sellers/me/dashboard'),
  getProducts: () => api.get('/sellers/me/products'),
  getSales: () => api.get('/orders/sales'),
};

export default api;
