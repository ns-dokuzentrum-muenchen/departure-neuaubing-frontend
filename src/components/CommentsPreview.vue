<template>
  <div class="bg-gray-200 rounded-lg text-black">
    <div class="px-3 py-2 flex justify-between items-center">
      <p v-if="title" class="font-bold">{{ title }}</p>
        <div v-if="title" class="flex items-center space-x-2">
        <img src="../assets/chat-icon-dark.svg" width="18"/>
        <p>{{ commentCount }}</p>
      </div>
    </div>
    <div :class="{ 'px-4 border-t': padding }">
      <div v-if="comments?.length">
        <div v-for="comment in comments" :key="comment.id" class="my-4">
          <comment-row :comment="comment" :open="open"/>
        </div>
      </div>
      <div v-else-if="loading">
        <p class="my-4 text-center">{{ lt('loading') }}</p>
      </div>
      <div v-else>
        <p class="my-4">{{ lt('noComments') }}</p>
      </div>

      <div v-if="open">
        <transition @enter="slideOpen" @leave="slideClose">
          <div v-if="mainReply" data-overflow="hidden">
            <comment-form :post-id="id" class="py-2"/>
          </div>
          <div v-else data-overflow="hidden" class="pb-2">
            <button @click="mainComment" class="">&rdsh; {{ lt('newComment') }}</button>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, computed, ref, onMounted } from 'vue'
  import { useStore } from '../store'
  import { useRoute, useRouter } from 'vue-router'
  import { slideOpen, slideClose } from '../utils'
  import CommentRow from './CommentRow.vue'
  import CommentForm from './CommentForm.vue'

  export default defineComponent({
    props: {
      id: Number,
      open: Boolean,
      count: [String, Number],
      title: [String, Boolean],
      path: String,
      padding: Boolean
    },
    setup (props) {
      const id = props.id || 0
      const title = props.title
      const store = useStore()

      const loading = ref(true)

      const comments = computed(() => {
        return store.comments[id] // all of them
      })

      const commentCount = computed(() => props.count || 0)

      const url = computed(() => props.path)

      onMounted(() => {
        store.getComments(id).then(() => {
          loading.value = false
        })
      })

      const padding = props.padding

      const route = useRoute()
      const router = useRouter()
      const mainReply = computed(() => {
        return !route.query.replyto
      })
      const mainComment = () => {
        router.replace({ ...route, query: {} })
      }

      return { id, title, comments, commentCount, url, loading, padding, mainReply, mainComment, slideOpen, slideClose, lt: store.lt }
    },
    components: { CommentRow, CommentForm }
  })
</script>
