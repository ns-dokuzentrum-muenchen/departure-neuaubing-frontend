<template>
  <div>
    <header class="p-3 border-b">
      <h1 class="font-medium">{{ title }}</h1>
    </header>

    <main class="p-3">
      <router-view/>

      <div class="max-w-2xl mt-3">
        <styled-map/>
      </div>
    </main>

    <footer class="p-3 hidden">
      <small class="text-gray-500 text-2xs">Work in progress</small>
    </footer>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  import { useStore } from './store'
  import StyledMap from './components/StyledMap.vue'

  export default defineComponent({
    name: 'App',
    setup () {
      const store = useStore()

      return {
        title: store.title
      }
    },
    components: { StyledMap }
  })
</script>

<style>
  @import './style.css';
</style>
