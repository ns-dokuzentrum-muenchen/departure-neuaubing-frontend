import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router'

function routerSync () {
  return { router }
}

createApp(App).use(createPinia().use(routerSync)).use(router).mount('#app')
