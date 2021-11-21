<template>
  <div class="dark:bg-gray-800 pl-12 md:pl-20 lg:pl-32">
    <div class="relative bg-black text-white pt-14 pr-12 md:pr-20 lg:pr-32">
      <div class="flex justify-end py-1 -mr-12">
        <div class="mr-4">
          <router-link to="/forum" class="btn text-lg block">Forum</router-link>
        </div>
        <div class="mr-4">
          <router-link to="/glossar" class="btn text-lg block">Glossar</router-link>
        </div>
      </div>

      <div class="px-8 pb-px">
        <div class="max-w-3xl mx-auto mt-12 min-h-screen">
          <div class="absolute top-14">
            <h1 class="text-xl md:text-2xl lg:text-4xl font-medium">{{ post.title?.rendered }}</h1>
          </div>

          <div v-html="post.acf?.description" class="html mb-16 text-lg"></div>

          <div v-if="comments?.length" class="my-4 bg-gray-700 rounded-lg">
            <div class="px-3 py-2 border-b-2 flex justify-between items-baseline">
              <p class="font-bold">Kommentare</p>
              <p class="text-xs">Vor 12 stunden</p>
            </div>
            <div class="px-3 pb-2">
              <div v-for="comment in comments" :key="comment.id" class="my-4">
                <comment-row :comment="comment" :replies="[]"/>
              </div>
            </div>
            <div v-if="post.comment_status === 'open'" class="px-3">
              <div class="border-t-2 py-2">
                <comment-form :post-id="post.id"/>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="fixed top-0 p-1 mt-14 left-0 ml-14 transition-all duration-300">
        <router-link to="/" class="btn text-lg block shadow-lg">Zurück</router-link>
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
      const postType = (to.name || 'glossar') as string

      store.getGlossaryTerm(slug as string, postType).then(next)
    },
    components: { CommentForm, CommentRow }
  })
</script>
