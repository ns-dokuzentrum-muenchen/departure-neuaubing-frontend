<template>
  <div>
    <ul class="flex pb-2 mb-1 border-b-2 text-sm">
      <li class="chevron">
        <span class="underline">Start</span>
      </li>
      <li class="chevron">
        <span class="underline">Projekte</span>
      </li>
      <li class="chevron">
        <span class="underline">{{ post.title?.rendered }}</span>
      </li>
    </ul>
    <template v-if="acf">
      <div class="mb-4">
        <p class="font-medium text-lg">{{ post.title?.rendered }}</p>
        <div v-html="acf.description"></div>
      </div>

      <div class="mb-4">
        <p class="font-medium text-lg">{{ acf.person?.[0].post_title }}</p>
        <div v-html="acf.person?.[0].acf?.biographie" class="line-clamp-3"></div>
      </div>

      <div v-if="links?.length" class="mb-4">
        <p class="font-medium text-lg">Glossar</p>
        <ul>
          <li v-for="term in links" :key="term.ID">
            <router-link :to="`/glossar/${term.post_name}`">
              <span>{{ term.post_title }}</span>
              <sup v-if="term.comment_count !== '0'">{{ term.comment_count }}</sup>
            </router-link>
          </li>
        </ul>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
  import { defineComponent, computed } from 'vue'
  import { Post } from '../store/types'

  export default defineComponent({
    name: 'GlossarPost',
    props: {
      post: Object
    },
    setup (props) {
      const post = props.post as Post
      const acf = post.acf

      const links = computed(() => {
        return post?.acf.connections
      })

      return { post, acf, links }
    }
  })
</script>
