// src/services/api.js

import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000', // Замените на ваш базовый URL бэкенда
});

// Добавляем токен в заголовок Authorization для каждого запроса
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
