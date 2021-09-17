import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory('/'),
  routes: [
    {
      path: '/',
      name: 'index',
      component: {
        render () {}
      }
    }
  ]
})

export default router
