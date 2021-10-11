import { createRouter, createWebHistory } from 'vue-router'

import Index from './views/Index.vue'
import About from './views/About.vue'

const router = createRouter({
  history: createWebHistory('/'),
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index
    },
    {
      path: '/ueber',
      name: 'about',
      component: About
    }
  ]
})

export default router
