<template>
  <div class="bg-black text-white p-3 min-h-home">
    <div class="mt-16 max-w-3xl mx-auto">
      <h1 class="text-4xl">{{ post.title?.rendered }}</h1>

      <div v-if="post.comment_status === 'open'">
        <comment-form :post-id="post.id"/>
      </div>

      <div v-if="comments?.length" class="my-4">
        <p>Comments &searr;</p>
        <div v-for="comment in comments" :key="comment.id" class="my-4">
          <comment-row :comment="comment" :replies="[]"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, computed } from 'vue'
  import { useStore } from '../store'
  import { useRoute } from 'vue-router'
  import CommentForm from '../components/CommentForm.vue'
  import CommentRow from '../components/CommentRow.vue'

  export default defineComponent({
    name: 'Glossar',
    setup () {
      const store = useStore()
      const route = useRoute()
      const { slug } = route.params

      const post = computed(() => {
        return store.glossar[slug as string]
      })

      if (post.value?.comment_status === 'open') {
        store.getComments(post.value.id as number)
      }

      const comments = computed(() => {
        return store.comments[post.value.id as number]
      })

      return { post, comments }
    },
    beforeRouteEnter (to, _from, next) {
      const store = useStore()
      const { slug } = to.params

      store.getGlossaryTerm(slug as string).then(next)
    },
    components: { CommentForm, CommentRow }
  })
</script>
