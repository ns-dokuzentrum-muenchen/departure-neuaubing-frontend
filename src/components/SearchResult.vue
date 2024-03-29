<template>
  <li class="highlighting">
    <div class="text-sm">{{ type }}</div>
    <div class="mt-1">
      <router-link :to="url" class="hover:opacity-50 inline-block">
        <p v-html="title" class="text-xl lg:text-2xl"></p>
      </router-link>
    </div>
    <div class="mt-2 line-clamp-3">
      <div v-html="description" @click.native="internalLinks" class="html"></div>
    </div>
  </li>
</template>

<script lang="ts">
  import type { Post, PostType } from '../store/types'
  import { defineComponent, computed } from 'vue'
  import { useStore } from '../store'
  import { useRouter } from 'vue-router'
  import { fixLink } from '../utils'
  // import LocaleLink from './LocaleLink.vue'

  const postTypes: { [key: string]: string } = {
    kuenstler: 'Künstler*in',
    projekt: 'Projekt',
    glossar: 'Glossar',
    begriff: 'Mind the Memory Gap, Begriff',
    markierung: 'Mapping Memory, Markierung',
    page: 'Seite',
    post: 'Post',
    ort: 'Ort',
    person: 'Person',
    'int-project': 'Projekt'
  }
  const enPostTypes: { [key: string]: string } = {
    kuenstler: 'Artist',
    projekt: 'Project',
    glossar: 'Glossary',
    begriff: 'Mind the Memory Gap, Term',
    markierung: 'Mapping Memory, Marker',
    page: 'Page',
    post: 'Post',
    ort: 'Place',
    person: 'Person',
    'int-project': 'Project'
  }

  export default defineComponent({
    name: 'SearchResult',
    props: {
      post: Object
    },
    setup (props) {
      const post = props.post as Post
      const store = useStore()

      const type = computed(() => {
        if (!post) return ''
        const t = (post.post_type || post.type || 'post') as PostType
        if (t === 'projekt') {
          const artists = (post.acf?.person?.map((p) => p.post_title) || []).join(', ')
          return `Projekt, ${artists}`
        }
        if (store.locale === 'en') {
          return enPostTypes[t]
        }
        return postTypes[t]
      })

      const title = post?.title_highlighted || post?.title.rendered
      const description = post?.content_highlighted || post?.acf.description

      const url = computed(() => {
        if (!post) return ''

        const def = fixLink(post.permalink || post.link)
        const type = post.post_type || post.type || 'post'
        const pre = store.locale !== 'de' ? '/' + store.locale : ''

        if (type === 'markierung') {
          return `${pre}/projekte/memory-practice?marker=${post.id}`
        } else if (type === 'kuenstler') {
          const projBase = post.acf?.projekt
          return projBase ? `${projBase}#kontext=${def}` : def
        }

        return def
      })

      const router = useRouter()
      const internalLinks = (event: Event ) => {
        const el = event.target as HTMLElement
        if (el && (el.tagName === 'A' || el.tagName === 'a')) {
          const path = el.getAttribute('href') || ''
          if (!path) return

          const external = new RegExp(/^https?:/).test(path)
          if (external) return

          event.preventDefault()
          router.push(path)
        }
      }

      return {
        post,
        type,
        title,
        description,
        url,
        internalLinks
      }
    }
  })
</script>
