<template>
  <div class="flex m-12">
    <figure v-if="project.acf?.image" class="max-w-2xl">
      <img :src="project.acf.image.sizes.large"/>
    </figure>

    <div class="ml-4 mt-8">
      <h2 class="uppercase text-4xl">
        <styled-text :text="project.title?.rendered"/>
      </h2>
      <div class="font-bold my-3">
        <p v-for="artist in artists" :key="artist.id">{{ artist.post_title }}</p>
      </div>
      <div v-if="description" v-html="description" class="font-medium"></div>
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
