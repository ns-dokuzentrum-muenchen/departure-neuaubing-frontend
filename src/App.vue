<template>
  <div class="">
    <app-header/>

    <main :class="{ 'md:-translate-x-36': offset }" class="transition-transform pt-px">
      <router-view/>
    </main>

    <meta-layer/>

    <app-footer/>
  </div>
</template>

<script lang="ts">
  import { defineComponent, computed, provide } from 'vue'
  import { useStore } from './store/index'
  import { useRoute } from 'vue-router'
  import AppHeader from './components/AppHeader.vue'
  import MetaLayer from './components/MetaLayer.vue'
  import AppFooter from './components/AppFooter.vue'

  export default defineComponent({
    setup () {
      const store = useStore()
      store.getSettings()
      store.getProjects()

      const route = useRoute()

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

      return { offset }
    },
    components: { AppHeader, MetaLayer, AppFooter }
  })
</script>

<style>
  @import './style.css';
</style>
