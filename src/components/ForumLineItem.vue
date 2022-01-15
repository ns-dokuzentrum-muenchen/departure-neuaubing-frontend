<template>
  <div class="bg-gray-200 text-black rounded-xl p-4">
    <div class="mb-4">
      <h2 class="text-lg md:text-xl lg:text-2xl">{{ post?.title.rendered }}</h2>
      <div class="flex -mx-2 divide-x mt-2">
        <div class="px-2">{{ post?.author_name }}</div>
        <div class="px-2">16:45</div>
        <div class="px-2">12.12.2021</div>
      </div>
    </div>
    <div class="line-clamp-3 mb-4">
      <div v-html="post?.content.rendered" class="md:text-lg contents"></div>
    </div>
    <div v-if="post?.comment_status === 'open'" class="flex mt-2">
      <div class="flex-auto">
        <div class="flex items-center space-x-2">
          <img src="../assets/chat-icon-dark.svg"/>
          <p>{{ post?.comment_count || 0 }}</p>
        </div>
      </div>
      <div>
        <router-link :to="url" class="btn-outline text-sm inline-block">anzeigen</router-link>
      </div>
      <div></div>
    </div>
  </div>
</template>

<script lang="ts">
  import type { Post } from '../store/types'
  import { defineComponent, computed } from 'vue'

  export default defineComponent({
    props: {
      post: Object
    },
    setup (props) {
      const post = props.post as Post
      const url = computed(() => `/forum/${post?.slug}`)

      return { post, url }
    }
  })
</script>
