<template>
  <div class="max-w-4xl mx-auto my-24">
    <div class="font-bold text-xl mb-1">
      <p v-for="artist in artists" :key="artist.id">{{ artist.post_title }}</p>
    </div>
    <h1 class="text-5xl lg:text-8xl uppercase leading-none">
      <styled-text :text="title"/>
    </h1>
  </div>
</template>

<script lang="ts">
  import { defineComponent, computed } from 'vue'
  import StyledText from './StyledText.vue'

  export default defineComponent({
    name: 'ProjectTitle',
    props: {
      project: Object
    },
    setup (props) {
      const title = computed(() => props.project?.title.rendered)
      const artists = computed(() => props.project?.acf.person)

      return { title, artists }
    },
    components: { StyledText }
  })
</script>
