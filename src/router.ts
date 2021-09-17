import { createRouter, createWebHistory } from 'vue-router'
import { h } from 'vue'

const router = createRouter({
  history: createWebHistory('/'),
  routes: [
    {
      path: '/',
      name: 'index',
      component: {
        render () {
          return h('div', 'welcome')
        }
      }
    }
  ]
})

export default router
