<template>
  <div :id="`comment-${comment.id}`">
    <div v-if="comment" class="flex items-start space-x-4">
      <div class="w-10 h-10 flex-none">
        <img :src="comment.author_avatar_url" alt="Avatar" width="96" height="96" class="rounded-full" loading="lazy"/>
      </div>
      <div class="w-full">
        <div class="flex font-light text-sm">
          <p v-if="comment.created" class="font-medium mr-2">
            {{ comment.status === 'approved' ? 'NEU' : 'AUSSTEHEND' }}
          </p>
          <p>{{ comment.fullname || comment.author_name }}</p>
          <div class="border-l mx-2"></div>
          <p>{{ time }}</p>
          <div class="border-l mx-2"></div>
          <p>{{ date }}</p>
        </div>
        <div v-html="comment.content" class="mt-px text-base"></div>
        <div v-if="depth < 5" class="mt-0">
          <button @click="toggleForm" class="text-xs opacity-50 underline">
            {{ addComment ? 'abbrechen' : 'antworten' }}
          </button>
        </div>
        <transition @enter="slideOpen" @leave="slideClose">
          <div v-if="addComment" data-overflow="hidden">
            <comment-form :post-id="comment.post" :reply-to="comment.id" class="pt-2 pb-px"/>
          </div>
        </transition>
      </div>
    </div>

    <div v-if="comment?.children?.length" class="my-2 ml-4 pl-4 border-l-2 border-gray-400">
      <div v-for="childComment in comment.children" :key="childComment.id" class="my-4">
        <comment-row :comment="childComment" :depth="depth + 1"/>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import type { Comment } from '../store/types'
  import { defineComponent, ref, computed, defineAsyncComponent } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { format } from 'fecha'
  import CommentForm from './CommentForm.vue'
  import { slideOpen, slideClose } from '../utils'

  export default defineComponent({
    props: {
      comment: Object,
      depth: Number
    },
    setup (props) {
      const comment = ref(props.comment as Comment)

      const dateObj = new Date(comment.value?.date)

      const time = format(dateObj, 'H:mm')
      const date = format(dateObj, 'DD.MM.YYYY')

      const depth = props.depth || 0

      const id = computed(() => (comment.value?.id || 0).toString())

      const route = useRoute()
      const router = useRouter()
      const addComment = computed(() => {
        return route.query?.replyto === id.value
      })
      const toggleForm = () => {
        if (addComment.value) {
          router.replace({ ...route, query: {} })
        } else {
          router.replace({ ...route, query: { replyto: id.value } })
        }
      }

      return { comment, time, date, depth, addComment, toggleForm, slideOpen, slideClose }
    },
    components: {
      CommentForm,
      CommentRow: defineAsyncComponent<any>(() => import('./CommentRow.vue'))
    }
  })
</script>
