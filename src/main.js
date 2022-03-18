import { createApp } from "vue";
import router from "./router/index";
import PrimeVue from "primevue/config";

import ToastService from "primevue/toastservice";
import Tooltip from "primevue/tooltip";
import Button from "primevue/button";
import Toast from "primevue/toast";
import Calendar from "primevue/calendar";
import Card from "primevue/card";
import InputText from "primevue/inputtext";
import Password from "primevue/password";
import Menu from "primevue/menu";

import App from "./App.vue";

import "primevue/resources/themes/saga-blue/theme.css";
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";

createApp(App)
  .use(router)
  .use(PrimeVue, { ripple: true })
  .use(ToastService)
  .directive("tooltip", Tooltip)
  .component("Button", Button)
  .component("Toast", Toast)
  .component("Calendar", Calendar)
  .component("Card", Card)
  .component("InputText", InputText)
  .component("Password", Password)
  .component("Menu", Menu)
  .mount("#app");
