import { createRouter, createWebHistory } from 'vue-router'

import { useStore } from './store'

import Index from './views/Index.vue'
import Project from './views/Project.vue'

const router = createRouter({
  history: createWebHistory('/'),
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index,
      alias: '/en'
    },
    {
      path: '/:pathMatch(projekte|int-projekte)/:slug',
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
      path: '/forum/:slug',
      name: 'forum-post',
      component: () => import('./views/ForumPost.vue')
    },
    {
      path: '/:pathMatch(glossar|orte|personen|begriffe)',
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
      path: '/suchen',
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
      component: () => import('./views/Page.vue'),
      meta: { seite: true }
    },
    {
      path: '/konto',
      name: 'account',
      component: () => import('./views/Account.vue')
    },

    {
      path: '/access',
      name: 'access',
      component: () => import('./views/Access.vue'),
      meta: { noheader: true, nofooter: true }
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

    if (to.query.page) {
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
