<template>
  <div>
    <div class="p-4 md:px-16 md:pb-10 bg-bg">
      <div class="font-bold text-base md:text-xl mb-1 relative">
        <p v-for="artist in artists" :key="artist.id">
          <router-link :to="artistLink(artist)" class="hover:opacity-50">{{ artist.post_title }}</router-link>
        </p>
      </div>
      <h1 v-html="title" class="text-4xl md:text-6xl lg:text-8xl whitespace-pre-line uppercase leading-none styled-text"></h1>

      <div v-if="altVersions.length" class="mt-4">
        <div class="flex items-center flex-wrap space-x-4">
          <div>Sprache</div>
          <div v-for="post in altVersions" :key="post.ID">
            <router-link :to="`/${post.post_type}e/${post.post_name}`" class="px-3 py-1 border rounded-full block theme-color">{{ post.acf.language }}</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import type { Post } from '../store/types'
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

      const artistLink = (post: Post) => {
        return '#kontext=/kuenstlerinnen/' + post.post_name
      }

      const altVersions = computed<Post[]>(() => {
        return props.project?.acf?.versions || []
      })

      return { title, artists, artistLink, altVersions }
    },
    components: { StyledText }
  })
</script>
