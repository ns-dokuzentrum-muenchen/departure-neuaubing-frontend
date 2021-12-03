import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router'

const store = createPinia().use(() => {{ router }})
const app = createApp(App)

app.use(store).use(router).mount('#app')

