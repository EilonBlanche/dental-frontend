import axios from 'axios';
const baseURL = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_API_URL : process.env.REACT_APP_API_URL_LOCAL;
const API = axios.create({
  baseURL: baseURL,
  headers: { 'Content-Type': 'application/json' }
});

export default API;