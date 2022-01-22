<template>
  <div>
    <app-header/>

    <main :class="{ 'md:-translate-x-36': offset }" class="transition-transform pt-px min-h-screen">
      <router-view/>
    </main>

    <meta-layer/>
    <app-footer/>

    <teleport v-if="meta" to="head">
      <title>{{ meta.og_title }}</title>
      <meta v-if="meta.description" name="description" :content="meta.description">
      <meta property="og:title" :content="meta.og_title"/>
      <meta v-if="meta.description" property="og:description" :content="meta.description"/>
      <meta property="og:url" :content="meta.canonical"/>
      <meta property="og:type" content="website"/>
    </teleport>
  </div>
</template>

<script lang="ts">
  import { defineComponent, computed, provide, onMounted } from 'vue'
  import { useStore } from './store/index'
  import { useRoute } from 'vue-router'
  import AppHeader from './components/AppHeader.vue'
  import MetaLayer from './components/MetaLayer.vue'
  import AppFooter from './components/AppFooter.vue'

  export default defineComponent({
    setup () {
      const store = useStore()
      store.getSettings()

      const route = useRoute()
      store.getProjects()

      const metaLayer = computed(() => {
        if (!route.hash) return 0

        const hs = route.hash

        if (/^#seitenleiste/.test(hs)) {
          return 1
        } else if (/^#(kontext|glossar|forum)/.test(hs)) {
          return 2
        }

        return 0
      })
      const offset = computed(() => metaLayer.value > 1)

      provide('metaLayer', metaLayer)

      // init user, if authToken exists
      store.getUser()

      onMounted(() => {
        document.documentElement.setAttribute('lang', store.locale)
        document.getElementById('temp-title')?.remove()
      })

      const meta = computed(() => store.meta)

      return { offset, meta }
    },
    components: { AppHeader, MetaLayer, AppFooter }
  })
</script>

<style>
  @import './style.css';
</style>
