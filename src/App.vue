<template>
  <div>
    <app-header/>

    <main :class="{ '-translate-x-36': offset }" class="transition-transform delay-75">
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
    name: 'App',
    setup () {
      const store = useStore()
      store.getSettings()
      store.getProjects()

      const route = useRoute()

      const metaLayer = computed(() => {
        if (!route.hash) return 0
        switch (route.hash) {
          case '#seitenleiste':
            return 1
          case '#kontext':
          case '#glossar':
          case '#forum':
            return 2
          default:
            return 0
        }
      })
      const offset = computed(() => metaLayer.value > 1)

      provide('metaLayer', metaLayer)

      return { offset }
    },
    components: { AppHeader, MetaLayer, AppFooter }
  })
</script>

<style>
  @import './style.css';
</style>
