<template>
  <div class="rounded-md bg-gray-600 p-4">
    <div class="flex items-start space-x-4">
      <div class="w-14 h-14 flex-none">
        <img :src="comment.author_avatar_urls[96]" alt="Avatar" width="96" height="96" class="rounded-full" loading="lazy"/>
      </div>
      <div>
        <p>{{ comment.author_name }}</p>
        <div v-html="comment.content.rendered"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, toRefs } from 'vue'

  export default defineComponent({
    name: 'CommentRow',
    props: {
      comment: Object,
      replies: Array
    },
    setup (props) {
      const { comment, replies } = toRefs(props)

      return { comment, replies }
    }
  })
</script>
