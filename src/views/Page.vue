<template>
  <div class="min-h-screen">
    <article v-if="page">
      <component v-for="(block, i) in contentBlocks" :is="block.acf_fc_layout" :block="block" :slug="slug" :key="i"></component>
    </article>

    <div v-else class="w-screen h-screen grid place-content-center">
      <h1 class="text-4xl">{{ page?.title?.rendered || 'Not found' }}</h1>
      <p class="text-2xl font-mono">/pages/{{ slug }}</p>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, computed } from 'vue'
  import { useStore } from '../store'
  import { useRoute, onBeforeRouteUpdate } from 'vue-router'

  // auto-load the content Blocks
  const glob = import.meta.globEager('../components/blocks/*.vue')

  const components: { [key: string]: any } = {}

  Object.entries(glob).forEach(([path, definition]) => {
    const componentName = (path.split('/').pop() as string).replace(/\.\w+$/, '')
    components[componentName] = definition.default
  })

  export default defineComponent({
    setup () {
      const store = useStore()
      const route = useRoute()

      const slug = computed(() => route.params.slug as string)
      const page = computed(() => store.pages[slug.value])

      const contentBlocks = computed(() => {
        return page.value?.acf?.content || []
      })

      onBeforeRouteUpdate((to) => {
        const { slug } = to.params
        store.getPage(slug as string)
      })

      return { slug, page, contentBlocks }
    },
    beforeRouteEnter (to, _from, next) {
      const { slug } = to.params
      const store = useStore()

      store.getPage(slug as string).then(next)
    },
    components: { ...components }
  })
</script>
