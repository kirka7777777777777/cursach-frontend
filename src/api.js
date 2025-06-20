// CourseworkFront/src/api.js
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api', // Базовый URL вашего Laravel API
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: true, // ВАЖНО: разрешает отправку куки и токенов (для Sanctum)
});

// Интерцептор для добавления токена авторизации
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken'); // Получаем токен из localStorage
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
