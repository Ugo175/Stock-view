import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const authService = {
  login: (username, password) => {
    return axios.post(`${API_URL}/auth/signin`, {
      username,
      password
    });
  },

  register: (userData) => {
    return axios.post(`${API_URL}/auth/signup`, userData);
  }
};

export default authService;
