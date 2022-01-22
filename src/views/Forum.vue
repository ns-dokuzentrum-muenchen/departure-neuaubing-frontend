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
            <span>{{ lt('search') }}</span>
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
            <p class="text-sm underline">{{ lt('overview') }}</p>
          </div>

          <div v-if="posts?.length" class="mb-12 lg:mb-24">
            <ul>
              <li v-for="post in posts" :key="post.id" class="mb-4">
                <forum-line-item :post="post"/>
              </li>
            </ul>
          </div>
          <div v-else>{{ lt('noResults') }}</div>
        </div>
      </div>

      <div class="hidden xl:block fixed top-0 p-1 left-0 mt-12 ml-1 md:mt-14 md:ml-16 transition-all duration-300">
        <button @click="goBack" class="btn text-lg shadow-lg">
          <span>{{ lt('back') }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, computed, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { useStore } from '../store'
  import SearchIcon from '../components/svg/SearchIcon.vue'
  import CloseIcon from '../components/svg/CloseIcon.vue'
  import ChevronLeft from '../components/svg/ChevronLeft.vue'
  import ForumLineItem from '../components/ForumLineItem.vue'

  export default defineComponent({
    setup () {
      const router = useRouter()

      const goBack = () => {
        if (!window.history?.state?.back) {
          router.push('/')
        } else {
          router.go(-1)
        }
      }

      const store = useStore()
      const posts = computed(() => store.forum)

      onMounted(() => {
        store.setBlankMeta('Forum')
      })

      return { goBack, posts, lt: store.lt }
    },
    beforeRouteEnter (to, _, next) {
      const store = useStore()
      const page = Number(to.query.page) || 1
      return store.getForum(page).then(next)
    },
    components: { SearchIcon, CloseIcon, ChevronLeft, ForumLineItem }
  })
</script>
