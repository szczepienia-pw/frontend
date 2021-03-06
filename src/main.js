import { createApp } from "vue";
import router from "./router/index";
import PrimeVue from "primevue/config";

import ToastService from "primevue/toastservice";
import Tooltip from "primevue/tooltip";

import App from "./App.vue";

import "@/styles/theme.scss";
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";

createApp(App)
    .use(router)
    .use(PrimeVue, { ripple: true })
    .use(ToastService)
    .directive("tooltip", Tooltip)
    .mount("#app");
