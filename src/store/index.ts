import { defineStore } from 'pinia'
import state from './state'
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_ENDPOINT as string,
  withCredentials: true
})

export const useStore = defineStore({
  id: 'store',
  state,
  getters: {},
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
    }
  }
})
