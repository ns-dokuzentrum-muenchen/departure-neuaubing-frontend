<template>
  <div>
    <ul class="flex pb-3 mb-1 border-b-2 text-xs md:text-sm whitespace-nowrap truncate pr-4">
      <li class="chevron">
        <router-link to="/" class="underline">Start</router-link>
      </li>
      <li class="chevron">
        <span class="border-b border-dotted">Projekte</span>
      </li>
      <li class="chevron truncate">
        <span class="underline">{{ post.title?.rendered }}</span>
      </li>
    </ul>
    <div v-if="acf">
      <div class="mb-4 mt-2 max-w-prose-1">
        <p class="font-medium text-lg">{{ post.title?.rendered }}</p>
        <div v-html="acf.description"></div>
      </div>

      <div class="mt-2 mb-8 max-w-prose-1">
        <artist-bio v-for="artist in acf.person" :key="artist.id" :person="artist" class="mb-4"/>
      </div>

      <div v-if="glossar?.length" class="mb-12">
        <p class="font-medium text-lg">Glossar</p>
        <ul>
          <li v-for="term in glossar" :key="term.ID">
            <connection-preview :post="term"/>
          </li>
        </ul>
      </div>

      <div v-if="places?.length" class="mb-12">
        <p class="font-medium text-lg">Orte</p>
        <ul>
          <li v-for="term in places" :key="term.ID">
            <connection-preview :post="term"/>
          </li>
        </ul>
      </div>

      <div v-if="people?.length" class="mb-12">
        <p class="font-medium text-lg">Personen</p>
        <ul>
          <li v-for="term in people" :key="term.ID">
            <connection-preview :post="term"/>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { Post } from '../store/types'
  import { defineComponent, computed } from 'vue'
  // import { useRoute } from 'vue-router'
  import ArtistBio from './ArtistBio.vue'
  import ConnectionPreview from './ConnectionPreview.vue'

  export default defineComponent({
    props: {
      post: Object
    },
    setup (props) {
      const post = props.post as Post
      const acf = post.acf

      const allLinks = computed(() => {
        return acf.connections?.concat?.(
          ...acf.links || []
        ) || []
      })

      const glossar = computed(() => {
        return allLinks.value.filter(p => p.post_type === 'glossar')
      })
      const places = computed(() => {
        return allLinks.value.filter(p => p.post_type === 'ort')
      })
      const people = computed(() => {
        return allLinks.value.filter(p => p.post_type === 'person')
      })

      return { post, acf, glossar, places, people }
    },
    components: { ArtistBio, ConnectionPreview }
  })
</script>
