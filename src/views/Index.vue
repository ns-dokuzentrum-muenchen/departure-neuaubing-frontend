<template>
  <div v-if="settings?.video">
    <video-player :video="settings.video"/>
  </div>
  <div class="p-3">
    <div>
      <project-item v-for="project in projects" :key="project.id" :project="project"/>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, computed } from 'vue'
  import { useStore } from '../store/index'
  import VideoPlayer from '../components/VideoPlayer.vue'
  import ProjectItem from '../components/ProjectItem.vue'

  export default defineComponent({
    name: 'Index',
    setup () {
      const store = useStore()
      const settings = computed(() => store.settings)
      const projects = computed(() => store.projects)

      return { settings, projects }
    },
    // beforeRouteEnter (_to, _from, next) {
    //   const store = useStore()
    //   store.getProjects().then(next)
    // },
    components: { VideoPlayer, ProjectItem }
  })
</script>
