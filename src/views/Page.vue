<template>
  <div class="w-screen h-screen grid place-content-center">
    <h1 class="text-4xl">{{ page?.title?.rendered || 'Not found' }}</h1>
    <p class="text-2xl font-mono">/pages/{{ slug }}</p>

    <div v-if="page" class="mt-4 max-w-prose">
      <div v-html="page.content?.rendered" class="html"></div>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, computed } from 'vue'
  import { useStore } from '../store'
  import { useRoute, onBeforeRouteUpdate } from 'vue-router'

  export default defineComponent({
    setup () {
      const store = useStore()
      const route = useRoute()

      const slug = computed(() => route.params.slug as string)
      const page = computed(() => store.pages[slug.value])

      onBeforeRouteUpdate((to) => {
        const { slug } = to.params
        store.getPage(slug as string)
      })

      return { slug, page }
    },
    beforeRouteEnter (to, _from, next) {
      console.log(to)
      const { slug } = to.params
      const store = useStore()

      store.getPage(slug as string).then(next)
    }
  })
</script>
