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
      // meta: { seite: true }
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
      path: '/forum',
      name: 'forum',
      component: () => import('./views/Forum.vue')
    },
    {
      path: '/glossar',
      name: 'glossar-index',
      component: () => import('./views/GlossarIndex.vue')
    },
    {
      path: '/glossar/:slug',
      name: 'glossar',
      component: () => import('./views/Glossar.vue')
    },
    {
      path: '/orte/:slug',
      name: 'orte',
      component: () => import('./views/Glossar.vue')
    },
    {
      path: '/personen/:slug',
      name: 'personen',
      component: () => import('./views/Glossar.vue')
    },
    {
      path: '/begriffe/:slug',
      name: 'begriffe',
      component: () => import('./views/Glossar.vue')
    },
    {
      path: '/suche',
      name: 'suche',
      component: () => import('./views/Suche.vue')
    },
    {
      path: '/verify',
      name: 'verify',
      component: () => import('./views/Verify.vue')
    },
    {
      path: '/pages/:slug',
      name: 'page',
      component: () => import('./views/Page.vue')
    }
  ],
  scrollBehavior (to, from, savedPosition) {
    if (to.hash || from.hash) {
      if (to.path === from.path) {
        return // sidebar thing
      }
    }

    if (to.query.marker || from.query.marker) return

    if (to.query.page) {
      const el = document.getElementById('pagelist')
      if (!el) return

      const top = (window.innerWidth / 3)
      return {
        top,
        el: '#pagelist',
        behavior: 'smooth'
      }
    }

    return savedPosition || { top: 0 }
  }
})

export default router
