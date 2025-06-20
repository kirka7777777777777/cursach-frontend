// CourseworkFront/src/main.js
import { createApp } from 'vue';
import './style.css'; // Ваш общий файл стилей, если он есть
import App from './App.vue';
import router from './router'; // Импортируем наш маршрутизатор

const app = createApp(App);
app.use(router); // Используем маршрутизатор
app.mount('#app');
