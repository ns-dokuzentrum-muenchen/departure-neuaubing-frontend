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
      component: Index
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
      component: Project
    },
    {
      path: '/glossar/:slug',
      name: 'glossar',
      component: () => import('./views/Glossar.vue')
    }
  ],
  scrollBehavior (to, _from, savedPosition) {
    if (to.hash) {
      return {
        el: to.hash
      }
    }
    return savedPosition || { top: 0 }
  }
})

export default router
