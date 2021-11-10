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

      <div class="px-8">
        <div class="max-w-3xl mx-auto mt-12 min-h-screen">
          <div class="absolute top-14">
            <p class="text-xl md:text-2xl lg:text-4xl font-medium">Suchen</p>
          </div>

          <form @submit.prevent="doSearch">
            <div class="relative">
              <input v-model="query" type="search" placeholder="Suchen" class="input">
              <div class="absolute top-0 right-0">
                <button class="btn text-lg whitespace-nowrap block">
                  <search-icon class="inline-block w-5 h-5 mr-2"/>
                  <span>Suchen</span>
                </button>
              </div>
            </div>
          </form>

          <div class="mt-12 pt-8 border-t-2">
            <ul v-if="results?.length" class="">
              <li v-for="post in results" :key="`${count}-${post.id}`" class="mb-8">
                <search-result :post="post"/>
              </li>
            </ul>
            <div v-else>
              <div v-if="hasSearch">
                <p>Nothing found</p>
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
  import { defineComponent, ref, watchEffect, computed, onMounted } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import { useStore } from '../store'
  import SearchIcon from '../components/svg/SearchIcon.vue'
  import SearchResult from '../components/SearchResult.vue'

  export default defineComponent({
    name: 'Suche',
    setup () {
      const router = useRouter()
      const route = useRoute()

      const count = ref(0)
      const query = ref('')
      const doSearch = () => {
        if (!query.value.length) return

        const to = {
          name: 'suche',
          query: {
            s: query.value
          }
        }

        router.push(to)
        ;(document.activeElement as HTMLInputElement)?.select?.()
      }
      const hasSearch = computed(() => query.value.length > 0)

      const store = useStore()
      watchEffect(() => {
        const { s } = route.query

        if (!s?.length) return

        store.search(s as string).then(() => {
          count.value++
        })
      })
      const results = computed(() => store.searchResults)

      onMounted(() => {
        const { s } = route.query
        if (s?.length) {
          query.value = s as string
        }
      })

      return { count, query, doSearch, hasSearch, results }
    },
    components: { SearchIcon, SearchResult }
  })
</script>
