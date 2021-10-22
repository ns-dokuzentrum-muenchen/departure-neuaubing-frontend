<template>
  <div class="rounded-md bg-gray-600 p-4">
    <p>{{ comment.author_name }}</p>
    <div v-html="comment.content.rendered"></div>
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
