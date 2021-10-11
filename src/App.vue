<template>
  <div>
    <app-header/>

    <main class="p-3">
      <router-view/>
    </main>

    <app-footer/>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  import { useStore } from './store/index'
  import AppHeader from './components/AppHeader.vue'
  import AppFooter from './components/AppFooter.vue'

  export default defineComponent({
    name: 'App',
    setup () {
      const store = useStore()
      store.getSettings()
    },
    components: { AppHeader, AppFooter }
  })
</script>

<style>
  @import './style.css';
</style>
