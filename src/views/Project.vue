<template>
  <div class="mt-36">
    <article>
      <project-title :project="project"/>

      <figure v-if="image" class="max-w-3xl mx-auto">
        <img :src="image.sizes?.large" loading="lazy"/>
      </figure>
      <div class="mb-36 max-w-3xl mx-auto">
        <div v-html="description"></div>
      </div>
    </article>
  </div>
</template>

<script lang="ts">
  import { defineComponent, computed } from 'vue'
  import { useStore } from '../store'
  import { useRoute } from 'vue-router'
  import ProjectTitle from '../components/ProjectTitle.vue'

  export default defineComponent({
    name: 'Project',
    setup () {
      const store = useStore()
      const route = useRoute()

      const slug = computed(() => route.params.slug)
      const project = computed(() => {
        return store.projects?.find(p => p?.slug === slug.value)
      })

      const image = computed(() => project.value?.acf.image)
      const description = computed(() => project.value?.acf.description)

      return { project, image, description }
    },
    beforeRouteEnter (_to, _from, next) {
      const store = useStore()
      store.getProjects().then(next)
    },
    components: { ProjectTitle }
  })
</script>
