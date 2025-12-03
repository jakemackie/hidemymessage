import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { registerSW } from 'virtual:pwa-register'

createApp(App).use(router).mount('#app')

const updateSW = registerSW({ immediate: true })
setInterval(() => {
    updateSW()
}, 60 * 60 * 1000) // Check for updates every hour