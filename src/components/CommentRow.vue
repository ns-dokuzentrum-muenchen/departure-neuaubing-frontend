<template>
  <div class="">
    <div v-if="comment" class="flex items-start space-x-4">
      <div class="w-10 h-10 flex-none">
        <img :src="comment.author_avatar_url" alt="Avatar" width="96" height="96" class="rounded-full" loading="lazy"/>
      </div>
      <div class="w-full">
        <div class="flex font-light text-sm">
          <p>{{ comment.fullname || comment.author_name }}</p>
          <div class="border-l mx-2"></div>
          <p>{{ time }}</p>
          <div class="border-l mx-2"></div>
          <p>{{ date }}</p>
        </div>
        <div v-html="comment.content" class="mt-px text-base"></div>
        <div v-if="depth < 5" class="mt-0">
          <button @click="addComment = true" class="text-xs opacity-50 underline">antworten</button>
        </div>
        <transition name="fade">
          <comment-form v-if="addComment"/>
        </transition>
      </div>
    </div>

    <div v-if="comment?.children.length" class="my-2 ml-4 pl-4 border-l-2 border-gray-400">
      <div v-for="childComment in comment.children" :key="childComment.id" class="my-4">
        <comment-row :comment="childComment" :depth="depth + 1"/>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, toRefs, defineAsyncComponent } from 'vue'
  import { format } from 'fecha'
  import CommentForm from './CommentForm.vue'

  export default defineComponent({
    props: {
      comment: Object,
      depth: Number
    },
    setup (props) {
      const { comment } = toRefs(props)

      const dateObj = new Date(comment.value?.date)

      const time = format(dateObj, 'H:mm')
      const date = format(dateObj, 'DD.MM.YYYY')

      const depth = props.depth || 0

      const addComment = ref(false)

      return { comment, time, date, depth, addComment }
    },
    components: {
      CommentForm,
      CommentRow: defineAsyncComponent<any>(() => import('./CommentRow.vue'))
    }
  })
</script>
