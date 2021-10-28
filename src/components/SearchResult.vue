<template>
  <li class="highlighting">
    <div class="text-sm">{{ type }}</div>
    <div class="mt-1">
      <p v-html="title" class="text-xl lg:text-2xl"></p>
    </div>
    <div v-html="description" class="mt-2 line-clamp-3"></div>
  </li>
</template>

<script lang="ts">
  import { defineComponent, computed } from 'vue'
  import { Post, PostType } from '../store/state'

  const postTypes: {
    [key: string]: string
  } = {
    kuenstler: 'Künstler/in',
    projekt: 'Projekt',
    glossar: 'Glossar',
    begriff: 'Begriff',
    markierung: 'Markierung',
    page: 'Seite',
    post: 'Post',
    'int-project': 'Projekt'
  }

  export default defineComponent({
    name: 'SearchResult',
    props: {
      post: Object
    },
    setup (props) {
      const post = props.post as Post
      if (!post) return

      const type = computed(() => {
        const t = (post.post_type || post.type || 'post') as PostType
        if (t === 'projekt') {
          return 'Projekt, Künstler/in (TODO)'
        }
        return postTypes[t]
      })

      return {
        post,
        type,
        title: post.title_highlighted,
        description: post.content_highlighted
      }
    }
  })
</script>
