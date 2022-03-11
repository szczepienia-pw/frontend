import { createApp } from 'vue'
import router from './router/index'
import PrimeVue from 'primevue/config';
import Button from 'primevue/button';
import App from './App.vue'

import 'primevue/resources/themes/saga-blue/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';

createApp(App)
    .use(router)
    .use(PrimeVue, { ripple: true })
    .component('Button', Button)
    .mount('#app')
