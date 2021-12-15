<template>
  <div class="bg-gray-700 rounded-lg text-white">
    <div class="px-3 py-2 border-b-2 flex justify-between items-baseline">
      <p class="font-bold">{{ title }}</p>
      <p class="text-xs">Vor 12 stunden</p>
    </div>
    <div class="px-3">
      <div v-if="comments?.length">
        <div v-for="comment in comments" :key="comment.id" class="my-4">
          <comment-row :comment="comment" :replies="[]"/>
        </div>
      </div>
      <div v-else-if="loading">
        <p class="my-4 text-center">Lädt...</p>
      </div>
      <div v-else>
        <p class="my-4">No comments yet...</p>
      </div>

      <div class="flex justify-between items-center pb-3 pl-4 pr-2">
        <div class="flex items-center space-x-2">
          <img src="../assets/chat-icon.svg"/>
          <p>{{ commentCount }}</p>
        </div>
        <div>
          <router-link :to="url" class="btn-outline text-sm inline-block">diskutieren</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, computed, ref, onMounted } from 'vue'
  import { useStore } from '../store'
  import CommentRow from './CommentRow.vue'

  export default defineComponent({
    props: {
      id: Number,
      title: String,
      path: String
    },
    setup (props) {
      const id = props.id || 0
      const title = props.title
      const store = useStore()

      const loading = ref(true)

      const comments = computed(() => {
        return store.comments[id]?.slice(0, 3)
      })

      const commentCount = computed(() => store.comments[id]?.length)

      const url = computed(() => props.path)

      onMounted(() => {
        store.getComments(id).then(() => {
          loading.value = false
        })
      })

      return { title, comments, commentCount, url, loading }
    },
    components: { CommentRow }
  })
</script>
