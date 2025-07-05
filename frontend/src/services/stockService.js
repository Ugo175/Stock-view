import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const stockService = {
  getAllStocks: () => {
    return api.get('/stocks');
  },

  getStockBySymbol: (symbol) => {
    return api.get(`/stocks/${symbol}`);
  },

  searchStocks: (query) => {
    return api.get(`/stocks/search?query=${query}`);
  },

  getStocksBySector: (sector) => {
    return api.get(`/stocks/sector/${sector}`);
  }
};

export default stockService;
