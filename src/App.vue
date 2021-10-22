<template>
  <div>
    <app-header/>

    <meta-layer/>

    <main>
      <router-view/>
    </main>

    <app-footer/>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  import { useStore } from './store/index'
  import AppHeader from './components/AppHeader.vue'
  import MetaLayer from './components/MetaLayer.vue'
  import AppFooter from './components/AppFooter.vue'

  export default defineComponent({
    name: 'App',
    setup () {
      const store = useStore()
      store.getSettings()
      store.getProjects()
    },
    components: { AppHeader, MetaLayer, AppFooter }
  })
</script>

<style>
  @import './style.css';
</style>
