import { createWebHistory, createRouter } from 'vue-router';
import { useCookies } from '@vueuse/integrations/useCookies';

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
    ]
});

router.beforeEach((to, from, next) => {
  if(to.name != 'login' && !useCookies().get('logged-in')) next({ name: 'login' })
  else next();
});

export default router;