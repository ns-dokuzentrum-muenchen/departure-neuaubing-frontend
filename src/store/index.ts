import type { Post, Comment } from './types'
import { defineStore } from 'pinia'
import state from './state'
import axios from 'axios'

const endpoints: { [key: string]: string } = {
  de: import.meta.env.VITE_API_ENDPOINT as string,
  en: import.meta.env.VITE_API_EN_ENDPOINT as string
}
let currentLocale = /^(\/en|\/en\/.+)$/.test(window.location.pathname) ? 'en' : 'de'

const api = axios.create({
  baseURL: endpoints[currentLocale],
  withCredentials: true
})


export const useStore = defineStore({
  id: 'store',
  state,
  getters: {
    idToProject: (state) => (id: number) => state.projects?.find(p => p.id === id),
    slugToProject: (state) => (slug: string | undefined, page?: boolean) => {
      if (!slug) return
      if (page) {
        return state.pages[slug]
      }
      return state.projects?.find(p => p.slug === slug)
        || state.intProjects.find(p => p.slug === slug)
    },
    glossary: (state) => (type: string | string[]) => {
      const postType = type === 'orte' ? 'ort'
        : type === 'personen' ? 'person' : 'glossar'
      return Object.values(state.glossar)?.filter((p => p.type === postType)).sort((a, b) => {
        return a.slug.localeCompare(b.slug)
      })
    }
  },
  actions: {
    checkLocale (path: string) {
      const en = /^(\/en|\/en\/.+)$/.test(path)
      const locale = en ? 'en' : 'de'
      if (currentLocale !== locale) {
        api.defaults.baseURL = endpoints[locale]
      }
    },
    async getSettings () {
      if (this.settings) return
      return api.get('/wp-json/dn/v1/settings').then(({ data }) => {
        this.settings = data
      })
    },
    async getProjects () {
      if (this.projects?.length) return
      return api.get('/wp-json/wp/v2/projekte').then(({ data }) => {
        this.projects = data
      })
    },
    async getProject (type = 'projekte', slug: string | string[]) {
      if (!slug || typeof slug !== 'string') return
      if (this.slugToProject(slug, false)) return
      return api.get(`/wp-json/wp/v2/${type}`, {
        params: { slug }
      }).then(({ data }) => {
        this.intProjects.push(...data)
      })
    },

    async getVisitorDistance () {
      // if (this.visitorDistance) return
      return api.get('/wp-json/dn/v1/geo').then(({ data }) => {
        if (!data) return

        const city = data.city?.de || data.city?.en || data.country?.de || data.country?.en || ''
        const inMunich = /^M(ü|u)n(chen|ich)$/.test(city)

        this.visitorDistance.city = inMunich ? 'Der Hauptbahnhof München' : city
        this.visitorDistance.distance = Math.round(inMunich ? 12 : data.distance).toLocaleString()
      })
    },

    async getGlossarTerms (type: string | string[]) {
      if (typeof type !== 'string') return
      if (this.glossary(type).length > 1) return // get `whole` list

      return api.get(`/wp-json/wp/v2/${type}`, {
        params: { per_page: 100 }
      }).then(({ data }) => {
        if (!data || !data[0]) return
        data.forEach((post: Post) => {
          this.glossar[post.slug] = post
        })
      })
    },
    async getGlossaryTerm (slug: string, postType: string) {
      if (this.glossar[slug]) return

      return api.get(`/wp-json/wp/v2/${postType}`, {
        params: { slug }
      }).then(({ data }) => {
        if (!data[0]) return
        this.glossar[slug] = data[0]
      })
    },

    async getComments (post: number) {
      return api.get('/wp-json/dn/v1/comments', {
        params: { post, order: 'asc' }
      }).then(({ data }) => {
        this.comments[post] = data as Comment[]
      })
    },
    async postComment (id: string | number | undefined, formData: any) {
      if (!id) return

      return api.post('/wp-json/wp/v2/comments', {
        ...formData
      }, {
        headers: {
          Authorization: `Bearer ${this.authToken}`
        }
      }).then(({ data }) => {
        const idNo = Number(id)
        // this.comments[idNo]?.push(data)
        if (!this.comments[idNo]) return
        const added = formatComment(data)
        if (data.parent === 0) {
          this.comments[idNo].push(added)
        } else {
          appendComment(this.comments[idNo], added)
        }
      })

      function formatComment (comment: any): Comment {
        return {
          ...comment,
          content: comment.content?.rendered,
          author_avatar_url: comment.author_avatar_urls?.['24'],
          children: [],
          created: true
        }
      }
      function appendComment (list: Comment[], comment: Comment) {
        for (const c of list) {
          if (c.id === comment.parent) {
            c.children.push(comment)
          } else {
            appendComment(c.children, comment)
          }
        }
      }
    },

    async search (query: string) {
      return api.get('/wp-json/dn/v1/suche', {
        params: { s: query }
      }).then(({ data }) => {
        this.searchResults = data
      }).catch(() => {
        this.searchResults = []
      })
    },

    async getPage (slug: string) {
      return api.get('/wp-json/wp/v2/pages', {
        params: { slug }
      }).then(({ data }) => {
        // if (!data[0]) throw new Error('404')
        if (!data[0]) {
          console.error('Page not found')
          return
        }
        this.pages[slug] = data[0]
      })
    },

    async loginNonce () {
      return api.get('/').then((res) => {
        if (!res?.headers) return
        this.nonce = res.headers['x-wp-nonce']
      })
    },

    async login (nameOrEmail: string, nonce: string) {
      const params = new URLSearchParams()
      const { pathname, search, hash } = window.location
      const return_to = encodeURIComponent(pathname + search + hash)
      params.append('user_email_username', nameOrEmail)
      params.append('nonce', nonce)
      params.append('return_to', return_to)

      return api.post('/wp-json/dn/v1/login', params)
    },
    async verifyLogin (uid: string, token: string, nonce: string) {
      if (!uid || !token || !nonce) return
      return api.get('/wp-json/dn/v1/login', {
        params: { uid, token, nonce }
      }).then(({ data }) => {
        if (data.token) {
          try {
            window.localStorage?.setItem('token', data.token)
          } catch (err) {
            console.error('storage blocked')
          }
          this.authToken = data.token
          this.getUser()
        } else {
          throw new Error('Login-Fehler')
        }
      })
    },
    async validateToken () {
      if (!this.authToken) return Promise.reject()
      return api.post('/wp-json/jwt-auth/v1/token/validate', {}, {
        headers: {
          Authorization: `Bearer ${this.authToken}`
        }
      }).catch((err) => {
        console.log('Token error', err.response?.data)
        this.authToken = null
        try {
          window.localStorage?.removeItem('token')
        } catch (err) {
          console.error('storage blocked')
        }
      })
    },
    async getUser () {
      if (!this.authToken) return
      return api.get('/wp-json/wp/v2/users/me', {
        headers: {
          Authorization: `Bearer ${this.authToken}`
        }
      }).then(({ data }) => {
        this.user = data
      }).catch((err) => {
        console.log(err.message)
        this.logout()
      })
    },
    async getUserContent () {
      return api.get('/wp-json/dnu/v1/konto', {
        headers: {
          Authorization: `Bearer ${this.authToken}`
        }
      }).then(({ data }) => {
        this.userContent = data
      })
    },
    logout () {
      this.authToken = null
      this.user = null
      this.userContent = []
      try {
        window.localStorage?.removeItem('token')
      } catch (err) {
        console.error('storage blocked')
      }
    },

    async register (username: string, email: string, nonce: string) {
      const { pathname, search, hash } = window.location
      const return_to = encodeURIComponent(pathname + search + hash)
      return api.post('/wp-json/dn/v1/register', {
        return_to, username, email, nonce
      })
    },

    async getMarkers () {
      return api.get('/wp-json/dn/v1/places').then(({ data }) => {
        this.markers = data
      })
    },
    async searchMarkers (query: string) {
      return api.get('/wp-json/dn/v1/place-search', {
        params: { s: query }
      }).then(({ data }) => data)
    },
    async getMarker (postId: number): Promise<Post> {
      // handled in component
      return api.get(`/wp-json/wp/v2/markierungen/${postId}`).then(({ data }) => data)
    },
    async uploadFile (file: File) {
      if (!this.authToken) return

      return api.post('/wp-json/wp/v2/media', file, {
        headers: {
          Authorization: `Bearer ${this.authToken}`,
          'Content-Type': file.type,
          'Content-Disposition': `attachment; filename="${file.name}"`
        }
      }).then(({ data }) => data)
    },
    async createMarker (data: any) {
      return api.post('/wp-json/wp/v2/uploads', data, {
        headers: {
          Authorization: `Bearer ${this.authToken}`
        }
      }).then(({ data }) => {
        this.myMarkers.unshift(data)
      })
    },

    async createBegriff (data: any) {
      return api.post('/wp-json/wp/v2/begriffe', data, {
        headers: {
          Authorization: `Bearer ${this.authToken}`
        }
      }).then(({ data }) => {
        console.log(data)
      })
    },

    async getForum (page = 1) {
      return api.get('/wp-json/wp/v2/forum', {
        params: { page }
      }).then(({ data }) => {
        this.forum = data
      })
    },
    async getForumPost (slug: string | string[]) {
      if (!slug) return
      return api.get('/wp-json/wp/v2/forum', {
        params: { slug }
      }).then(({ data }) => {
        if (!data[0]) return
        this.forum.push(data[0]) // fix this maybe
      })
    }
  }
})
