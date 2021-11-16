<template>
  <div class="mt-16">
    <article>
      <div v-for="(block, i) in contentBlocks" :key="i" class="px-4 md:px-8">
        <component :is="block.acf_fc_layout" :block="block" :slug="slug"></component>
      </div>
    </article>
  </div>
</template>

<script lang="ts">
  import { defineComponent, computed } from 'vue'
  import { useStore } from '../store'
  import { useRoute } from 'vue-router'

  const glob = import.meta.globEager('../components/blocks/*.vue')

  const components: { [key: string]: any } = {}

  Object.entries(glob).forEach(([path, definition]) => {
    const componentName = (path.split('/').pop() as string).replace(/\.\w+$/, '')
    components[componentName] = definition.default
  })

  export default defineComponent({
    name: 'Project',
    setup () {
      const store = useStore()
      const route = useRoute()

      const slug = computed(() => route.params.slug)
      const project = computed(() => {
        return store.projects?.find(p => p?.slug === slug.value)
      })

      const contentBlocks = computed(() => {
        return project.value?.acf?.content || []
      })

      return { slug, contentBlocks }
    },
    components: { ...components }
  })
</script>
