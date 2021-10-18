<template>
  <div class="flex m-12 items-center">
    <figure v-if="project.acf?.image" class="max-w-2xl">
      <router-link :to="link">
        <img :src="project.acf.image.sizes.large"/>
      </router-link>
    </figure>

    <div class="ml-4">
      <h2 class="uppercase text-4xl lg:text-5xl">
        <styled-text :text="project.title?.rendered"/>
      </h2>
      <div class="font-bold text-xl my-3">
        <p v-for="artist in artists" :key="artist.id">{{ artist.post_title }}</p>
      </div>
      <div v-if="description" v-html="description" class="font-medium my-3"></div>
      <div class="my-4">
        <router-link :to="link" class="btn inline-block">Eintreten</router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  import StyledText from './StyledText.vue'

  export default defineComponent({
    name: 'ProjectItem',
    props: {
      project: Object
    },
    setup (props) {
      const project = props.project
      const artists = project?.acf?.person
      const description = project?.acf?.description

      const link = `/projekte/${project?.slug}`

      return { project, artists, description, link }
    },
    components: { StyledText }
  })
</script>
