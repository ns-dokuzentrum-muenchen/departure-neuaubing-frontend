<template>
  <div class="md:grid grid-cols-12 gap-4 py-16">
    <project-title :project="project" :text="block?.title" :class="position"/>
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
