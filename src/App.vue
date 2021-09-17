<template>
  <div>
    <header class="p-3 border-b">
      <h1 class="font-medium">Departure Neuaubing</h1>
    </header>

    <main class="p-3 border-b">
      <router-view/>
    </main>

    <footer class="p-3">
      <small class="text-2xs">&copy; 2021</small>
    </footer>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'

  export default defineComponent({
    name: 'App'
  })
</script>

<style>
  @import './style.css';
</style>
