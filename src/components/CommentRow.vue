<template>
  <div class="rounded-md bg-gray-600 p-4">
    <div v-if="comment" class="flex items-start space-x-4">
      <div class="w-14 h-14 flex-none">
        <img :src="comment.author_avatar_urls[96]" alt="Avatar" width="96" height="96" class="rounded-full" loading="lazy"/>
      </div>
      <div>
        <div class="flex font-light text-sm">
          <p>{{ comment.author_name }}</p>
          <div class="border-l mx-2"></div>
          <p>{{ time }}</p>
          <div class="border-l mx-2"></div>
          <p>{{ date }}</p>
        </div>
        <div v-html="comment.content.rendered" class="mt-2"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, toRefs } from 'vue'
  import { format } from 'fecha'

  export default defineComponent({
    name: 'CommentRow',
    props: {
      comment: Object,
      replies: Array
    },
    setup (props) {
      const { comment, replies } = toRefs(props)

      const dateObj = new Date(comment.value?.date)

      const time = format(dateObj, 'H:mm')
      const date = format(dateObj, 'DD.MM.YYYY')

      return { comment, replies, time, date }
    }
  })
</script>
