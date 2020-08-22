import axios from 'axios';

const api = axios.create({
  // baseURL: 'http://10.0.2.2:3333',
  baseURL: 'http://192.168.0.192:3333',
});

export default api;
