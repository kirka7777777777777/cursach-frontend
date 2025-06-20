
// Импортируем наши компоненты страниц
import AuthPage from '../components/AuthPage.vue';
import MainPage from '../pages/MainPage.vue';
import WorkspacePage from '../components/WorkspacePage.vue'; // Импортируем новый компонент
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        name: 'home',
        component: MainPage,
        meta: { requiresAuth: false } // Главная страница не требует авторизации
    },
    {
        path: '/auth',
        name: 'auth',
        component: AuthPage,
        meta: { requiresAuth: false } // Страница авторизации не требует авторизации
    },
    {
        path: '/workspace',
        name: 'workspace',
        component: WorkspacePage,
        meta: { requiresAuth: true } // Рабочее пространство требует авторизации
    },
    {
        path: '/profile',
        name: 'profile',
        component: () => import('../components/ProfilePage.vue')
    },
    {
        path: '/notifications',
        name: 'notifications',
        component: () => import('../components/NotificationsPage.vue')
    },
    {
        path: '/reminders',
        name: 'reminders',
        component: () => import('../components/RemindersPage.vue')
    },
    {
        path: '/calendar',
        name: 'calendar',
        component: () => import('../components/CalendarPage.vue')
    }
    // Здесь вы можете добавить другие маршруты для будущих страниц
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// Навигационная защита
// router.beforeEach((to, from, next) => {
//     const isAuthenticated = localStorage.getItem('authToken');
//
//     // Если маршрут требует авторизации и пользователь не авторизован
//     if (to.meta.requiresAuth && !isAuthenticated) {
//         next('/auth'); // Перенаправляем на страницу авторизации
//     }
//     // Если пользователь авторизован и пытается зайти на страницу авторизации
//     else if (to.name === 'auth' && isAuthenticated) {
//         next('/workspace'); // Перенаправляем в рабочее пространство
//     }
//     else {
//         next(); // Продолжаем навигацию
//     }
// });


export default router;