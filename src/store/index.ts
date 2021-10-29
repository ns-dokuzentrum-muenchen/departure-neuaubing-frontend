import { defineStore } from 'pinia'
import { useRoute } from 'vue-router'
import state from './state'
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_ENDPOINT as string,
  withCredentials: true
})

export const useStore = defineStore({
  id: 'store',
  state,
  actions: {
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

    async getGlossaryTerm (slug: string) {
      if (this.glossar[slug]) return
      return api.get('/wp-json/wp/v2/glossar', {
        params: { slug }
      }).then(({ data }) => {
        if (!data[0]) return
        this.glossar[slug] = data[0]
      })
    },
    async getComments (post: number) {
      return api.get('/wp-json/wp/v2/comments', {
        params: { post }
      }).then(({ data }) => {
        this.comments[post] = data
      })
    },

    async getCommentNonce (): Promise<string> {
      return api.get('/wp-json/dn/v1/comment-nonce').then(({ data }) => {
        return data?.nonce
      })
    },
    async postComment (id: string | number | undefined, formData: any) {
      if (!id) return

      return api.post('/wp-json/wp/v2/comments', {
        ...formData
      }).then(({ data }) => {
        const idNo = Number(id)
        this.comments[idNo]?.unshift(data)
      })
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

    async login (nameOrEmail: string) {
      return api.post('/wp-json/dn/v1/login', {
        user_email_username: nameOrEmail
      }).then((res) => {
        console.log(res)
      })
    }
  }
})
