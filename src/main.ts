import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import i18n from "./i18n";
import { registerSW } from 'virtual:pwa-register'

const app = createApp(App);

app.use(router);
app.use(i18n);
app.mount("#app");

const updateSW = registerSW({ immediate: true })
setInterval(() => {
    updateSW()
}, 60 * 60 * 1000) // Check for updates every hour