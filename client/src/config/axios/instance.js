import axios from 'axios';
import { getAuthToken } from '../../utils/auth';
const instance = axios.create({
  baseURL: `http://localhost:3000/api/v1`,
});

// Set the AUTH token for any request
instance.interceptors.request.use(function(config) {
  const token = getAuthToken();
  config.headers.Authorization = token ? `Bearer ${token}` : '';
  return config;
});

export default instance;
