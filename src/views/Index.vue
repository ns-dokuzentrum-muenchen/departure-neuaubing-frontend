<template>
  <div>
    <div>
      <project-item v-for="project in projects" :key="project.id" :project="project"/>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, computed } from 'vue'
  import { useStore } from '../store/index'
  import ProjectItem from '../components/ProjectItem.vue'

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
    },
    components: { ProjectItem }
  })
</script>
