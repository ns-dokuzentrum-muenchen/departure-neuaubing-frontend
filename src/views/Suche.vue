<template>
  <div class="dark:bg-gray-800 md:pl-20 lg:pl-32">
    <div class="relative bg-black text-white pt-14 pr-4 md:pr-20 lg:pr-32">
      <div class="hidden md:flex justify-end py-1 -mr-12">
        <div class="mr-4">
          <locale-link to="/glossar" class="btn text-lg block">{{ lt('glossar') }}</locale-link>
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
            <h1 class="text-2xl lg:text-4xl font-medium">{{ lt('search') }}</h1>
          </div>

          <form @submit.prevent="doSearch">
            <div class="relative">
              <input v-model="query" type="search" :placeholder="lt('search')" class="input">
              <div class="absolute top-0 right-0 bottom-0 flex">
                <button v-if="hasSearch" @click="clearSearch" type="button" title="abbrechen / cancel" class="bg-white text-gray-800 rounded-full px-3.5 hover:bg-gray-200 focus:bg-gray-200 focus:ring focus:outline-none">
                  <close-icon class="w-3.5 h-3.5"/>
                </button>
                <button class="btn h-full text-lg whitespace-nowrap block">
                  <search-icon class="inline-block w-5 h-5 md:mr-2"/>
                  <span class="hidden md:inline">{{ lt('search') }}</span>
                </button>
              </div>
            </div>
          </form>

          <div class="mt-12">
            <ul v-if="results?.length" class="border-t-2 pt-8 mb-32">
              <li v-for="post in results" :key="`${count}-${post.id}`" class="mb-8">
                <search-result :post="post"/>
              </li>
            </ul>
            <div v-else>
              <div v-if="hasSearch" class="border-t-2 pt-8">
                <p>{{ lt('noResults') }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="hidden xl:block fixed top-0 p-1 left-0 mt-12 ml-1 md:mt-14 md:ml-14 transition-all duration-300">
        <button @click="goBack" class="btn text-lg shadow-lg">
          <span>{{ lt('back') }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, watchEffect, computed, onMounted } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import { useStore } from '../store'
  import SearchIcon from '../components/svg/SearchIcon.vue'
  import SearchResult from '../components/SearchResult.vue'
  import CloseIcon from '../components/svg/CloseIcon.vue'
  import ChevronLeft from '../components/svg/ChevronLeft.vue'
  import LocaleLink from '../components/LocaleLink.vue'

  export default defineComponent({
    name: 'Suche',
    setup () {
      const route = useRoute()
      const router = useRouter()

      const doneSearch = ref(false)
      const count = ref(0)
      const query = ref('')
      const doSearch = () => {
        if (!query.value.length) return

        const to = {
          path: route.path,
          query: {
            s: query.value
          }
        }

        router.replace(to)
        ;(document.activeElement as HTMLInputElement)?.select?.()
      }
      const hasSearch = computed(() => query.value.length > 0 && doneSearch.value)

      const store = useStore()
      watchEffect(() => {
        const { s } = route.query

        if (!s?.length) return

        doneSearch.value = false
        store.search(s as string).then(() => {
          count.value++
          doneSearch.value = true
        })
      })
      const results = computed(() => store.searchResults)

      onMounted(() => {
        const { s } = route.query
        if (s?.length) {
          query.value = s as string
        }

        store.setBlankMeta(store.locale === 'en' ? 'Search' : 'Suchen')
      })

      const goBack = () => {
        if (!window.history?.state?.back) {
          router.push('/')
        } else {
          router.go(-1)
        }
      }

      const clearSearch = () => {
        query.value = ''
        doneSearch.value = false
        router.replace({
          path: route.path,
          query: {}
        })
        store.searchResults = []
      }

      return { count, query, doSearch, hasSearch, results, goBack, clearSearch, lt: store.lt }
    },
    components: { SearchIcon, SearchResult, CloseIcon, ChevronLeft, LocaleLink }
  })
</script>
