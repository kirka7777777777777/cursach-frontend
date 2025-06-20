// CourseworkFront/src/api/index.js
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api', // <-- УБЕДИТЕСЬ, ЧТО ЭТО ТОЧНЫЙ АДРЕС ВАШЕГО LARAVEL API
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: true, // ВАЖНО: разрешает отправку куки и токенов (для Sanctum)
});

// Интерцептор для добавления токена авторизации к каждому запросу
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

// Ваши функции для взаимодействия с API
export const authService = {
    async register(name, email, password) {
        try {
            const response = await api.post('/register', { name, email, password });
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : error;
        }
    },
    registerManager: (name, email, password, secretKey) => {
        return api.post('/register/manager', {
            name,
            email,
            password,
            secret_key: secretKey
        });
    },

    async login(email, password) {
        try {
            const response = await api.post('/login', { email, password });
            // Если вход успешен, сохраняем токен
            if (response.data.token) {
                localStorage.setItem('authToken', response.data.token);
            }
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : error;
        }
    },

    async deleteAccount() {
        try {
            const response = await api.delete('/delete-account'); // Убедитесь, что этот маршрут защищен аутентификацией
            localStorage.removeItem('authToken'); // Удаляем токен после удаления аккаунта
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : error;
        }
    },

    // Функция для получения текущего пользователя (если у вас есть такой эндпоинт)
    async getUser() {
        try {
            const response = await api.get('/user'); // Пример эндпоинта для получения текущего пользователя
            return response.data;
        } catch (error) {
            // Если токен недействителен, удаляем его
            if (error.response && error.response.status === 401) {
                localStorage.removeItem('authToken');
            }
            throw error.response ? error.response.data : error;
        }
    }
};

// Вы можете добавить сюда функции для работы с карточками и другими данными
export const cardsService = {
    async getCards() {
        try {
            const response = await api.get('/cards');
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : error;
        }
    },
    async createCard(cardData) {
        try {
            const response = await api.post('/cards', cardData);
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : error;
        }
    }
    // ... другие CRUD операции для карточек
};
// В конце файла src/api/index.js должно быть:
export { api } // или аналогичный экспорт