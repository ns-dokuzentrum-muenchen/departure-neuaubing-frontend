<template>
  <div class="mt-12">
    <article>
      <figure v-if="image">
        <img :src="image.sizes?.large" loading="lazy"/>
      </figure>
      <h1 class="font-serif text-5xl my-12 uppercase">{{ project?.title.rendered }}</h1>
      <div>
        <div v-html="description"></div>
      </div>
    </article>
  </div>
</template>

<script lang="ts">
  import { defineComponent, computed } from 'vue'
  import { useStore } from '../store'
  import { useRoute } from 'vue-router'

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
    }
  })
</script>
