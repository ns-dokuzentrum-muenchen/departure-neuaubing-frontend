import { defineStore } from 'pinia'
import state from './state'
// import axios from 'axios'

// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_ENDPOINT as string,
//   withCredentials: true
// })

export const useStore = defineStore({
  id: 'store',
  state,
  getters: {},
  actions: {}
})
