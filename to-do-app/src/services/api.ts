import axios from 'axios';

const api = axios.create({
  baseURL: 'https://localhost:44310',
  headers: {
    'Content-Type': 'application/json',
  },
});

const token = localStorage.getItem('token');
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export default api;