import { createRouter, createWebHistory } from 'vue-router'

import { useStore } from './store'

import Index from './views/Index.vue'
import Project from './views/Project.vue'

const router = createRouter({
  history: createWebHistory('/'),
  routes: [
    {
      path: '/',
      alias: '/en',
      name: 'index',
      component: Index
    },
    {
      path: '/:pathMatch(projekte|int-projekte)/:slug',
      alias: '/en/:pathMatch(projekte|int-projekte)/:slug',
      name: 'projekt',
      component: Project,
      meta: { seite: true }
    },
    {
      path: '/forum',
      alias: '/en/forum',
      name: 'forum',
      component: () => import('./views/Forum.vue')
    },
    {
      path: '/forum/:slug',
      alias: '/en/forum/:slug',
      name: 'forum-post',
      component: () => import('./views/ForumPost.vue')
    },
    {
      path: '/:pathMatch(glossar|orte|personen|begriffe)',
      alias: '/en/:pathMatch(glossar|orte|personen|begriffe)',
      name: 'glossar-index',
      component: () => import('./views/GlossarIndex.vue')
    },
    {
      path: '/glossar/:slug',
      alias: '/en/glossar/:slug',
      name: 'glossar',
      component: () => import('./views/Glossar.vue')
    },
    {
      path: '/orte/:slug',
      alias: '/en/orte/:slug',
      name: 'orte',
      component: () => import('./views/Glossar.vue')
    },
    {
      path: '/personen/:slug',
      alias: '/en/personen/:slug',
      name: 'personen',
      component: () => import('./views/Glossar.vue')
    },
    {
      path: '/begriffe/:slug',
      alias: '/en/begriffe/:slug',
      name: 'begriffe',
      component: () => import('./views/Glossar.vue')
    },
    {
      path: '/suchen',
      alias: '/en/suchen',
      name: 'suche',
      component: () => import('./views/Suche.vue')
    },
    {
      path: '/verify',
      alias: '/en/verify',
      name: 'verify',
      component: () => import('./views/Verify.vue')
    },
    {
      path: '/pages/:slug',
      alias: '/en/pages/:slug',
      name: 'page',
      component: () => import('./views/Page.vue'),
      meta: { seite: true }
    },
    {
      path: '/konto',
      alias: '/en/konto',
      name: 'account',
      component: () => import('./views/Account.vue')
    },

    {
      path: '/access',
      alias: '/en/access',
      name: 'access',
      component: () => import('./views/Access.vue'),
      meta: { noheader: true, nofooter: true }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'error',
      component: () => import('./views/NotFound.vue')
    }
  ],
  scrollBehavior (to, from, savedPosition) {
    if (to.hash || from.hash) {
      if (to.hash === '#project-list') {
        const el = document.getElementById('project-list')
        if (!el) return

        return {
          el: to.hash,
          behaviour: 'smooth'
        }
      }
      if (to.path === from.path) {
        return // sidebar thing
      }
    }

    if (to.query.marker || from.query.marker) return
    if (to.query.replyto || from.query.replyto) return
    if (from.query.s && !to.query.s) return

    if (to.query.page || to.query.s) {
      const el = document.getElementById('pagelist')
      if (!el) return

      return {
        top: 18,
        el: '#pagelist',
        behavior: 'smooth'
      }
    }

    return savedPosition || { top: 0 }
  }
})

router.beforeEach((to) => {
  if (to.name === 'access') return true

  const store = useStore()
  store.checkLocale(to.path)
  if (store.pwRequired && !store.unlocked) {
    return '/access'
  } else {
    return true
  }
})

router.afterEach((to) => {
  if ('et_eC_Wrapper' in window === false) return

  const store = useStore()
  if (!store.analytics) return

  // send the tracker info
  // TODO: get pagename from store?
  (<any>window).et_eC_Wrapper?.({
    et_pagename: to.name
  })
})

export default router
