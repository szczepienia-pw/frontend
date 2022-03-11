import { createWebHistory, createRouter } from 'vue-router';
import LoginPage from "@/views/LoginPage.vue";

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
            component: LoginPage
        },
    ],
    scrollBehavior (to, from, savedPosition) {
        let position = { x: 0, y: 0 }
        // Keep scroll position when using browser buttons
        if (savedPosition) {
          position = savedPosition
        }
    
        // Workaround for transitions scrolling to the top of the page
        // However, there are still some problems being fixed by the vue team
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(position)
          }, 1000)
        })
      }
      
});

export default router;