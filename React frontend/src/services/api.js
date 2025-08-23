import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

export const publicApi = axios.create({
  baseURL: API_BASE_URL,
});

const axiosInstance = axios.create({
  baseURL: API_BASE_URL, 
});

// Set up an interceptor to automatically add the auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


export const api = {
  login: async (credentials) => {
        const response = await axiosInstance.post('/auth/login/', credentials);
        return response.data;
    },
  getProducts: async () => {
    const response = await axiosInstance.get('/products/');
    return response.data; 
  },

  searchProducts: async (query) => {
    const response = await axiosInstance.get('/products/search/', {
      params: { q: query }
    });
    return response.data;
  },

  createSale: async (saleData) => {
    const response = await axiosInstance.post('/sales/', saleData);
    return response.data;
  },

  getDashboardStats: async () => {
    const response = await axiosInstance.get('/sales/dashboard_stats/');
    return response.data;
  },

  getTodaySales: async () => {
    const response = await axiosInstance.get('/sales/today_sales/');
    return response.data;
  },

  createProduct: async (productData) => {
        const response = await axiosInstance.post('/products/', productData);
        return response.data;
    },

  updateProduct: async (productId, productData) => {
      // We use PATCH for partial updates, which is efficient for just changing stock.
      const response = await axiosInstance.patch(`/products/${productId}/`, productData);
      return response.data;
  },
};