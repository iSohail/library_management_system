import axios from 'axios';

export default {
  googleApi: axios.create({
    withCredentials: true,
    baseURL: 'https://www.googleapis.com',
    headers: { 'Content-Type': 'application/json' },
  }),
  endpoint2: axios.create({
    withCredentials: true,
    baseURL: 'endpoint1-url',
    headers: { 'Content-Type': 'application/json' },
  }),
};
