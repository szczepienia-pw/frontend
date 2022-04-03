import { createWebHistory, createRouter } from 'vue-router';
import { useUserSession } from '@/services/useUserSession';

const router = createRouter({
    history: createWebHistory(),
    linkActiveClass: 'is-active',
    routes: [
        {
            path: '/',
            redirect: '/login'
        },
        {
            path: '/login',
            name: 'login',
            component: () => import("@/views/LoginPage.vue")
        },
        {
            path: '/doctor',
            name: 'doctor',
            component: () => import("@/views/DoctorDashboard.vue")
        },
        {
            path: '/patient',
            name: 'patient',
            component: () => import("@/views/PatientDashboard.vue")
        },
        {
            path: '/admin',
            name: 'admin',
            component: () => import("@/views/AdminDashboard.vue")
        },
    ]
});

router.beforeEach((to, from, next) => {
    if (to.name !== 'login' && !useUserSession().isLoggedIn) next({ name: 'login' })
    else if (to.name === 'login' && useUserSession().isLoggedIn) next({ name: useUserSession().userType })
    else next();
});

export default router;