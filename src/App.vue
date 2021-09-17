<template>
  <div>
    <header class="p-3 border-b">
      <h1 class="font-medium">{{ title }}</h1>
    </header>

    <main class="p-3">
      <router-view/>
    </main>

    <footer class="p-3 hidden">
      <small class="text-gray-500 text-2xs">Work in progress</small>
    </footer>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  import { useStore } from './store'

  export default defineComponent({
    name: 'App',
    setup () {
      const store = useStore()

      return {
        title: store.title
      }
    }
  })
</script>

<style>
  @import './style.css';
</style>
