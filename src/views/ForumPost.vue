<template>
  <div class="dark:bg-gray-800 md:pl-20 lg:pl-32">
    <div class="relative bg-black text-white pt-14 pr-4 md:pr-20 lg:pr-32">
      <div class="hidden md:flex justify-end py-1 -mr-12">
        <!-- <div class="mr-4">
          <router-link to="/forum" class="btn text-lg block">Forum</router-link>
        </div> -->
        <div class="mr-4">
          <router-link to="/suchen" class="btn text-lg whitespace-nowrap block">
            <search-icon class="inline-block w-5 h-5 mr-2"/>
            <span>Suchen</span>
          </router-link>
        </div>
      </div>

      <div class="pl-4 md:px-8 pb-px">
        <div class="max-w-3xl mx-auto mt-8 md:mt-12 min-h-screen">
          <div class="mb-8 md:mb-0 flex items-center md:absolute top-14">
            <div class="xl:hidden">
              <button @click="goBack" class="btn round mr-2">
                <chevron-left class="w-4.5 h-4.5 md:w-5 md:h-5"/>
              </button>
            </div>
            <h1 class="text-2xl lg:text-4xl font-medium">Forum</h1>
          </div>

          <div class="mb-8">
            <p class="text-sm">
              <router-link to="/forum" class="underline">Übersicht</router-link>
            </p>
          </div>

          <div class="bg-gray-200 text-black rounded-xl p-4 mb-12">
            <div class="mb-4">
              <h2 class="text-xl md:text-2xl lg:text-3xl">{{ post?.title.rendered }}</h2>
              <div class="flex -mx-2 divide-x mt-2">
                <div class="px-2">{{ post?.author_name }}</div>
                <div class="px-2">16:45</div>
                <div class="px-2">12.12.2021</div>
              </div>
            </div>
            <div>
              <div v-html="post?.content.rendered" class="text-lg md:text-xl"></div>
            </div>

            <div class="border-b-2 -mx-2 my-4"></div>

            <div v-if="post?.comment_status === 'open'" class="mt-2">
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
              </div>

              <div class="border-t-2 py-2">
                <comment-form :post-id="post.id"/>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="hidden xl:block fixed top-0 p-1 left-0 mt-12 ml-1 md:mt-14 md:ml-16 transition-all duration-300">
        <button @click="goBack" class="btn text-lg shadow-lg">
          <span>Zurück</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, computed, ref, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useStore } from '../store'
  import SearchIcon from '../components/svg/SearchIcon.vue'
  import CloseIcon from '../components/svg/CloseIcon.vue'
  import ChevronLeft from '../components/svg/ChevronLeft.vue'
  import ForumLineItem from '../components/ForumLineItem.vue'
  import CommentRow from '../components/CommentRow.vue'
  import CommentForm from '../components/CommentForm.vue'

  export default defineComponent({
    setup () {
      const route = useRoute()
      const router = useRouter()
      const slug = route.params.slug

      const goBack = () => {
        if (!window.history?.state?.back) {
          router.push('/')
        } else {
          router.go(-1)
        }
      }

      const store = useStore()
      const post = computed(() => {
        return store.forum.find((p) => p.slug === slug)
      })

      const loading = ref(true)
      const comments = computed(() => {
        const id = post.value?.id
        if (!id) return []
        return store.comments[id]
      })

      onMounted(() => {
        if (post.value?.id) {
          store.getComments(post.value.id).then(() => {
            loading.value = false
          })
        }
      })

      return { goBack, post, loading, comments }
    },
    beforeRouteEnter (to, _, next) {
      const store = useStore()
      const { slug } = to.params
      return store.getForumPost(slug).then(next)
    },
    components: { SearchIcon, CloseIcon, ChevronLeft, ForumLineItem, CommentRow, CommentForm }
  })
</script>
