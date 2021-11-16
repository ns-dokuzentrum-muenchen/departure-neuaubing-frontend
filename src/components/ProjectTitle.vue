<template>
  <div class="col-span-8">
    <div class="font-bold text-xl mb-1">
      <p v-for="artist in artists" :key="artist.id">{{ artist.post_title }}</p>
    </div>
    <h1 v-html="title" class="text-5xl lg:text-8xl whitespace-pre-line uppercase leading-none styled-text">
    </h1>
  </div>
</template>

<script lang="ts">
  import { defineComponent, computed } from 'vue'
  import StyledText from './StyledText.vue'

  export default defineComponent({
    name: 'ProjectTitle',
    props: {
      project: Object,
      text: String
    },
    setup (props) {
      const title = computed(() => {
        if (props.text) return props.text
        return props.project?.acf.html_title || props.project?.title.rendered
      })
      const artists = computed(() => props.project?.acf.person)

      return { title, artists }
    },
    components: { StyledText }
  })
</script>
