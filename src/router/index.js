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
            redirect: '/doctor/slots',
            component: () => import("@/views/doctor/DoctorIndex.vue"),
            children: [
                {
                    path: 'slots',
                    component: () => import("@/views/doctor/Slots.vue"),
                }
            ]
        },
        {
            path: '/patient',
            name: 'patient',
            redirect: '/patient/personal',
            component: () => import("@/views/patient/PatientIndex.vue"),
            children: [
                {
                    path: 'personal',
                    component: () => import("@/views/patient/PersonalData.vue"),
                },
                {
                    path: 'registration',
                    component: () => import("@/views/registration/RegistrationPage.vue"),
                    children: [
                        {
                            path: 'slots',
                            component: () => import("@/views/registration/VaccinationSlots.vue"),
                        },
                        {
                            path: 'vaccines',
                            component: () => import("@/views/registration/VaccineTypes.vue"),
                        },
                        {
                            path: 'confirm',
                            component: () => import("@/views/registration/ConfirmPage.vue"),
                        }
                    ]
                }
            ]
        },
        {
            path: '/admin',
            name: 'admin',
            redirect: '/admin/doctors',
            component: () => import("@/views/admin/AdminIndex.vue"),
            children: [
                {
                    path: 'doctors',
                    component: () => import("@/views/admin/Doctors.vue"),
                },
                {
                    path: 'settings',
                    component: () => import("@/views/admin/Settings.vue"),
                }
            ]
        },
    ]
});

router.beforeEach((to, from, next) => {
    if (to.name !== 'login' && !useUserSession().isLoggedIn) next({ name: 'login' })
    else if (to.name === 'login' && useUserSession().isLoggedIn) next({ name: useUserSession().userType })
    else next();
});

export default router;