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

const tradingService = {
  buyStock: (stockSymbol, quantity) => {
    return api.post('/trading/buy', {
      stockSymbol,
      quantity,
      type: 'BUY'
    });
  },

  sellStock: (stockSymbol, quantity) => {
    return api.post('/trading/sell', {
      stockSymbol,
      quantity,
      type: 'SELL'
    });
  },

  getPortfolio: () => {
    return api.get('/portfolio');
  },

  getTransactions: () => {
    return api.get('/portfolio/transactions');
  },

  getBalance: () => {
    return api.get('/portfolio/balance');
  }
};

export default tradingService;
