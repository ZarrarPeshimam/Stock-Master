import axios from 'axios';

// API Base Configuration
export const API_BASE_URL = "http://localhost:8000/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// JWT Token Management
export const TOKEN_KEY = 'auth_token';
export const REFRESH_TOKEN_KEY = 'refresh_token';

export const setAuthToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export const setRefreshToken = (token) => {
  localStorage.setItem(REFRESH_TOKEN_KEY, token);
};

export const getAuthToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const getRefreshToken = () => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

export const removeAuthTokens = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  delete api.defaults.headers.common['Authorization'];
};

// Initialize token from storage
export const initializeAuth = () => {
  const token = getAuthToken();
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
};

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = getRefreshToken();
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
            refresh: refreshToken,
          });

          const { access } = response.data.tokens;
          setAuthToken(access);

          originalRequest.headers['Authorization'] = `Bearer ${access}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        removeAuthTokens();
        // Redirect to login
        window.location.href = '/';
      }
    }

    return Promise.reject(error);
  }
);

// API Response Types (simplified)
export const ApiResponse = (data) => ({ success: true, data });

// Auth Services
export const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login/', credentials);
    return response.data;
  },

  signup: async (userData) => {
    const response = await api.post('/auth/signup/', userData);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile/');
    return response.data;
  },

  refreshToken: async (refreshToken) => {
    const response = await api.post('/auth/token/refresh/', { refresh: refreshToken });
    return response.data;
  },

  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password/', { email });
    return response.data;
  },

  resetPassword: async (data) => {
    const response = await api.post('/auth/reset-password/', data);
    return response.data;
  },
};

// Warehouse Services
export const warehouseService = {
  getWarehouses: async (params = {}) => {
    const response = await api.get('/warehouse/warehouses/', { params });
    return response.data.data;
  },

  createWarehouse: async (data) => {
    const response = await api.post('/warehouse/warehouses/', data);
    return response.data.data;
  },

  getWarehouse: async (id) => {
    const response = await api.get(`/warehouse/warehouses/${id}/`);
    return response.data.data;
  },

  updateWarehouse: async (id, data) => {
    const response = await api.put(`/warehouse/warehouses/${id}/`, data);
    return response.data.data;
  },

  deleteWarehouse: async (id) => {
    await api.delete(`/warehouse/warehouses/${id}/`);
  },

  getSubLocations: async (params = {}) => {
    const response = await api.get('/warehouse/sublocations/', { params });
    return response.data.data;
  },

  createSubLocation: async (data) => {
    const response = await api.post('/warehouse/sublocations/', data);
    return response.data.data;
  },

  getSubLocation: async (id) => {
    const response = await api.get(`/warehouse/sublocations/${id}/`);
    return response.data.data;
  },

  updateSubLocation: async (id, data) => {
    const response = await api.put(`/warehouse/sublocations/${id}/`, data);
    return response.data.data;
  },

  deleteSubLocation: async (id) => {
    await api.delete(`/warehouse/sublocations/${id}/`);
  },

  getStock: async (params = {}) => {
    const response = await api.get('/warehouse/stock/', { params });
    return response.data.data;
  },
};

// Product Services
export const productService = {
  getProducts: async (params = {}) => {
    const response = await api.get('/product/', { params });
    return response.data.data;
  },

  createProduct: async (data) => {
    const response = await api.post('/product/', data);
    return response.data.data;
  },

  getProduct: async (id) => {
    const response = await api.get(`/product/${id}/`);
    return response.data.data;
  },

  updateProduct: async (id, data) => {
    const response = await api.put(`/product/${id}/`, data);
    return response.data.data;
  },

  deleteProduct: async (id) => {
    await api.delete(`/product/${id}/`);
  },

  getLowStockProducts: async () => {
    const response = await api.get('/product/low-stock/');
    return response.data.low_stock_products || [];
  },

  getCategories: async () => {
    const response = await api.get('/product/categories/');
    return response.data.data;
  },
};

// Operations Services
export const operationsService = {
  // Receipts
  getReceipts: async (params = {}) => {
    const response = await api.get('/operations/receipts/', { params });
    return response.data.data;
  },

  createReceipt: async (data) => {
    const response = await api.post('/operations/receipts/', data);
    return response.data.data;
  },

  getReceipt: async (id) => {
    const response = await api.get(`/operations/receipts/${id}/`);
    return response.data.data;
  },

  updateReceipt: async (id, data) => {
    const response = await api.put(`/operations/receipts/${id}/`, data);
    return response.data.data;
  },

  validateReceipt: async (id) => {
    await api.post(`/operations/receipts/${id}/validate/`);
  },

  // Deliveries
  getDeliveries: async (params = {}) => {
    const response = await api.get('/operations/deliveries/', { params });
    return response.data.data;
  },

  createDelivery: async (data) => {
    const response = await api.post('/operations/deliveries/', data);
    return response.data.data;
  },

  getDelivery: async (id) => {
    const response = await api.get(`/operations/deliveries/${id}/`);
    return response.data.data;
  },

  updateDelivery: async (id, data) => {
    const response = await api.put(`/operations/deliveries/${id}/`, data);
    return response.data.data;
  },

  validateDelivery: async (id) => {
    await api.post(`/operations/deliveries/${id}/validate/`);
  },

  // Transfers
  getTransfers: async (params = {}) => {
    const response = await api.get('/operations/transfers/', { params });
    return response.data.data;
  },

  createTransfer: async (data) => {
    const response = await api.post('/operations/transfers/', data);
    return response.data.data;
  },

  getTransfer: async (id) => {
    const response = await api.get(`/operations/transfers/${id}/`);
    return response.data.data;
  },

  updateTransfer: async (id, data) => {
    const response = await api.put(`/operations/transfers/${id}/`, data);
    return response.data.data;
  },

  validateTransfer: async (id) => {
    await api.post(`/operations/transfers/${id}/validate/`);
  },

  // Adjustments
  getAdjustments: async (params = {}) => {
    const response = await api.get('/operations/adjustments/', { params });
    return response.data.data;
  },

  createAdjustment: async (data) => {
    const response = await api.post('/operations/adjustments/', data);
    return response.data.data;
  },

  getAdjustment: async (id) => {
    const response = await api.get(`/operations/adjustments/${id}/`);
    return response.data.data;
  },

  // Move History
  getMoveHistory: async (params = {}) => {
    const response = await api.get('/operations/move-history/', { params });
    return response.data.data;
  },
};

// Dashboard Services
export const dashboardService = {
  getKPIs: async (params = {}) => {
    const response = await api.get('/dashboard/kpis/', { params });
    return response.data.kpis;
  },

  getStatistics: async (params = {}) => {
    const response = await api.get('/dashboard/statistics/', { params });
    return response.data.data;
  },
};

// ML Services
export const mlService = {
  getNearestAbundantStock: async (params) => {
    const response = await api.get('/ml/nearest-abundant-stock/', { params });
    return response.data.data;
  },

  getDemandPrediction: async (params) => {
    const response = await api.get('/ml/demand-prediction/', { params });
    return response.data.data;
  },

  getSuspiciousActivity: async (params) => {
    const response = await api.get('/ml/suspicious-activity/', { params });
    return response.data.data;
  },

  getProductRecommendations: async (params) => {
    const response = await api.get('/ml/product-recommendations/', { params });
    return response.data.data;
  },
};