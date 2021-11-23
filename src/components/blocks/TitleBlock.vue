<template>
  <div class="relative bg-bg h-16 md:h-24 lg:h-32"></div>
  <div class="md:grid grid-cols-12 gap-4 mb-16 md:mb-24 lg:mb-32">
    <project-title :project="project" :text="block?.title" :class="position" class="col-span-9"/>
  </div>
</template>

<script lang="ts">
  import { defineComponent, computed } from 'vue'
  import { useStore } from '../../store'
  import ProjectTitle from '../ProjectTitle.vue'

  export default defineComponent({
    props: {
      block: Object,
      slug: String
    },
    setup (props) {
      const store = useStore()

      const block = computed(() => props.block)
      const project = computed(() => {
        return store.projects?.find(p => p?.slug === props.slug)
      })

      const position = computed(() => {
        return `col-start-${props.block?.position || '1'}`
      })

      return { block, project, position }
    },
    components: { ProjectTitle }
  })
</script>
