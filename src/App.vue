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
  import AppHeader from './components/AppHeader.vue'
  import AppFooter from './components/AppFooter.vue'

  export default defineComponent({
    name: 'App',
    components: { AppHeader, AppFooter }
  })
</script>

<style>
  @import './style.css';
</style>
