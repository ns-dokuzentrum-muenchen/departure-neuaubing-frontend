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
  import { useRouter } from 'vue-router'

  const base = import.meta.env.VITE_API_ENDPOINT as string

  const postTypes: {
    [key: string]: string
  } = {
    kuenstler: 'Künstler*in',
    projekt: 'Projekt',
    glossar: 'Glossar',
    begriff: 'Begriff',
    markierung: 'Markierung',
    page: 'Seite',
    post: 'Post',
    ort: 'Ort',
    person: 'Person',
    'int-project': 'Projekt'
  }

  export default defineComponent({
    name: 'SearchResult',
    props: {
      post: Object
    },
    setup (props) {
      const post = props.post as Post

      const type = computed(() => {
        if (!post) return ''
        const t = (post.post_type || post.type || 'post') as PostType
        if (t === 'projekt') {
          return 'Projekt, Künstler*in (TODO)'
        }
        return postTypes[t]
      })

      const title = post?.title_highlighted
      const description = post?.content_highlighted

      const url = computed(() => {
        if (!post) return ''
        return (post.permalink || post.link)?.replace(base, '')
      })

      const router = useRouter()
      const internalLinks = (event: Event ) => {
        const el = event.target as HTMLElement
        if (el && (el.tagName === 'A' || el.tagName === 'a')) {
          event.preventDefault() // check first
          const path = el.getAttribute('href')
          if (!path) return

          // console.log('go to', path)
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
