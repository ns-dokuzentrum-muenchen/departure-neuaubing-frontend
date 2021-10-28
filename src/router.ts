import { createRouter, createWebHistory } from 'vue-router'

import Index from './views/Index.vue'
import About from './views/About.vue'
import Project from './views/Project.vue'

const router = createRouter({
  history: createWebHistory('/'),
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index,
      meta: { seite: true }
    },
    {
      path: '/ueber',
      name: 'about',
      component: About
    },
    {
      path: '/impressum',
      name: 'impressum',
      component: About
    },
    {
      path: '/sitemap',
      name: 'sitemap',
      component: About
    },
    {
      path: '/projekte/:slug',
      name: 'projekt',
      component: Project,
      meta: { seite: true }
    },
    {
      path: '/glossar/:slug',
      name: 'glossar',
      component: () => import('./views/Glossar.vue')
    },
    {
      path: '/suche',
      name: 'suche',
      component: () => import('./views/Suche.vue')
    }
  ],
  scrollBehavior (to, from, savedPosition) {
    if (to.hash || from.hash) return // sidebar thing
    return savedPosition || { top: 0 }
  }
})

export default router
