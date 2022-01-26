<template>
  <div class="w-screen h-screen grid place-content-center">
    <h1 class="text-4xl">Not found</h1>
    <p class="text-2xl font-mono">{{ path }}</p>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'

  export default defineComponent({
    setup () {
      return {
        path: window.location.pathname
      }
    }
  })
</script>
