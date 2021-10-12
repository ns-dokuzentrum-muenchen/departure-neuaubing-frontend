<template>
  <div class="flex m-12 items-center">
    <figure v-if="project.acf?.image" class="max-w-2xl">
      <img :src="project.acf.image.sizes.large"/>
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
        <button class="btn">Eintreten</button>
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
    computed: {
      artists () {
        return this.project?.acf?.person
      },
      description () {
        return this.project?.acf?.description
      }
    },
    components: { StyledText }
  })
</script>
