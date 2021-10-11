<template>
  <div>
    <div>
      <div v-for="project in projects" :key="project.id">
        <h2 class="font-serif uppercase text-3xl">{{ project.title?.rendered }}</h2>
        <figure v-if="project.acf?.image">
          <img :src="project.acf.image.sizes.large"/>
        </figure>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, computed } from 'vue'
  import { useStore } from '../store/index'

  export default defineComponent({
    name: 'Index',
    setup () {
      const store = useStore()
      const projects = computed(() => store.projects)

      return { projects }
    },
    beforeRouteEnter (_to, _from, next) {
      const store = useStore()
      store.getProjects().then(next)
    }
  })
</script>
