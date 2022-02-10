<template>
  <div class="w-screen h-screen grid place-content-center">
    <h1 class="text-4xl">
      Not found
      <span class="font-mono">{{ path }}</span>
    </h1>
    <p class="mt-1 text-2xl">
      &rarr; <locale-link to="/#project-list" class="hover:underline">{{ lt('perspectives') }}</locale-link>
    </p>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  import LocaleLink from '../components/LocaleLink.vue'
  import { useStore } from '../store'

  export default defineComponent({
    setup () {
      const store = useStore()

      return {
        lt: store.lt,
        path: window.location.pathname
      }
    },
    components: { LocaleLink }
  })
</script>
