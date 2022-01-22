<template>
  <div>
    <ul class="flex pb-3 mb-1 border-b-2 text-xs md:text-sm whitespace-nowrap truncate pr-4">
      <li class="chevron">
        <router-link to="/" class="underline">Start</router-link>
      </li>
      <li v-if="post.post_type === 'projekt'" class="chevron">
        <span class="border-b border-dotted">{{ lt('projects') }}</span>
      </li>
      <li class="chevron truncate">
        <span class="underline">{{ post.title?.rendered }}</span>
      </li>
    </ul>
    <div v-if="acf">
      <div class="mb-4 mt-2 max-w-prose-1 scroll-mt-18">
        <p class="font-medium text-lg mb-1">{{ post.title?.rendered }}</p>
        <div ref="txt" :class="{ 'line-clamp-2': truncated }" class="html overflow-hidden scroll-mt-16">
          <div v-html="acf.description" class="contents"></div>
        </div>
        <div v-if="!expanded" class="html">
          <router-link :to="`\#kontext`" class="">{{ lt('more') }}</router-link>
        </div>
      </div>

      <div class="mt-2 mb-8 max-w-prose-1">
        <artist-bio v-for="artist in acf.person" :key="artist.id" :person="artist" class="mb-4"/>
      </div>

      <div v-if="glossar?.length" class="mb-12">
        <p class="font-medium text-lg">{{ lt('glossar') }}</p>
        <ul>
          <li v-for="term in glossar" :key="term.ID">
            <connection-preview :post="term"/>
          </li>
        </ul>
      </div>

      <div v-if="places?.length" class="mb-12">
        <p class="font-medium text-lg">{{ lt('places') }}</p>
        <ul>
          <li v-for="term in places" :key="term.ID">
            <connection-preview :post="term"/>
          </li>
        </ul>
      </div>

      <div v-if="people?.length" class="mb-12">
        <p class="font-medium text-lg">{{ lt('people') }}</p>
        <ul>
          <li v-for="term in people" :key="term.ID">
            <connection-preview :post="term"/>
          </li>
        </ul>
      </div>

      <div v-if="tags?.length" class="mb-12 max-w-prose-1">
        <p class="font-medium text-lg">{{ lt('themes') }}</p>
        <ul class="flex flex-wrap html">
          <li v-for="term in tags" :key="term.term_id" class="commas">
            <locale-link :to="`/suchen?s=${term.name}`">{{ term.name }}</locale-link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import type { Post } from '../store/types'
  import { defineComponent, computed, ref, watch, nextTick } from 'vue'
  import { useStore } from '../store'
  import { useRoute } from 'vue-router'
  import ArtistBio from './ArtistBio.vue'
  import ConnectionPreview from './ConnectionPreview.vue'
  import LocaleLink from './LocaleLink.vue'

  export default defineComponent({
    props: {
      post: Object
    },
    setup (props) {
      const post = props.post as Post
      const acf = post.acf

      const allLinks = computed(() => {
        const conn = acf.connections || []
        return conn.concat(
          ...acf.links || []
        ) || []
      })

      const glossar = computed(() => {
        return allLinks.value.filter(p => p.post_type === 'glossar').sort(linkSort)
      })
      const places = computed(() => {
        return allLinks.value.filter(p => p.post_type === 'ort').sort(linkSort)
      })
      const people = computed(() => {
        return allLinks.value.filter(p => p.post_type === 'person').sort(linkSort)
      })

      const tags = computed(() => {
        return acf?.tags
      })

      function linkSort (a: Post, b: Post) {
        return a.post_title?.localeCompare(b.post_title)
      }

      const txt = ref<HTMLElement|null>(null)
      const route = useRoute()
      const expanded = computed(() => {
        if (!route.hash) return false
        return route.hash === '#kontext'
      })
      const truncated = ref(!expanded.value)

      watch(expanded, (val) => {
        if (val) {
          expand()
        } else {
          contract()
        }
      })

      async function expand () {
        if (!txt.value) return
        const from = `${txt.value.getBoundingClientRect().height}px`
        truncated.value = false
        await nextTick()
        const to = `${txt.value.getBoundingClientRect().height}px`

        txt.value.animate({
          height: [from, to]
        }, { duration: 250, easing: 'ease-out' })

        setTimeout(() => {
          txt.value?.parentElement?.scrollIntoView?.({
            block: 'start',
            behavior: 'smooth'
          })
        }, 300)
      }

      async function contract () {
        if (!txt.value) return
        const from = `${txt.value?.getBoundingClientRect().height}px`
        truncated.value = true
        await nextTick()
        const to = `${txt.value?.getBoundingClientRect().height}px`

        txt.value?.animate({
          height: [from, to]
        }, { duration: 250, easing: 'ease-out' })
      }

      const store = useStore()


      return { post, acf, glossar, places, people, tags, txt, expanded, truncated, lt: store.lt }
    },
    components: { ArtistBio, ConnectionPreview, LocaleLink }
  })
</script>
