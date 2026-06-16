import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import router from './router/index.js'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import 'swiper/css'
import './styles/main.scss'
import App from './App.vue'

// Pinia mit Persistenz-Plugin einrichten
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

// App erstellen und alle Plugins registrieren
const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(Toast, {
  position: 'top-right',
  timeout: 3000,
  closeOnClick: true,
  pauseOnHover: true
})

app.mount('#app')