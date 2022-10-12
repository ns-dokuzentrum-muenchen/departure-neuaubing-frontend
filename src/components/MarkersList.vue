<template>
  <div class="max-w-6xl mx-auto my-8 md:my-12">
    <div class="mt-12 md:mt-16">
      <div class="mb-8 md:mb-12">
        <form @submit.prevent="doSearch" class="max-w-2xl mx-auto">
          <div class="relative rounded-full border dark:border-none">
            <input v-model="query" type="search" :placeholder="lt('search')" class="input">
            <div class="absolute top-0 right-0 bottom-0 flex">
              <button v-if="hasSearch" @click="clearSearch" type="button" title="abbrechen / cancel" class="bg-white text-gray-800 rounded-full px-3.5 hover:bg-gray-200 focus:bg-gray-200 focus:ring focus:outline-none">
                <close-icon class="w-3.5 h-3.5"/>
              </button>
              <button :title="lt('search')" type="submit" class="btn h-full text-lg whitespace-nowrap block">
                <search-icon class="inline-block w-5 h-5 md:mr-2"/>
                <span class="hidden md:inline">{{ lt('search') }}</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      <div v-if="paging.length">
        <div class="flex lg:grid grid-cols-12 gap-4 border-b font-medium py-2">
          <div class="flex-auto lg:col-span-3">Name</div>
          <div class="hidden lg:block col-span-4">Beschreibung</div>
          <div class="hidden lg:block col-span-1">{{ lt('people') }}</div>
          <div class="hidden lg:block col-span-3">Adresse</div>
          <div class="flex-none lg:col-span-1">Nummer</div>
        </div>

        <markers-list-item v-for="item in paging" :key="item.post_id" :item="item"/>
      </div>
      <div v-else class="font-medium py-2 text-center">{{ lt('noResults') }}</div>
    </div>

    <div v-if="totalPages > 1" class="mt-4 md:mt-8">
      <ul class="flex items-center max-w-prose mx-auto">
        <li class="mr-auto">
          <button @click="prevPage" :disabled="page === 1" class="page-dot">
            <chevron-left class="h-4 w-auto"/>
          </button>
        </li>

        <li v-for="pp in pageNumbers" :key="pp" class="font-light">
          <router-link v-if="pp !== '...'" :to="pageNav(pp)" :class="{ active: pp === page }" class="page-dot">{{ pp }}</router-link>
          <span v-else class="page-dot">{{ pp }}</span>
        </li>

        <li class="ml-auto">
          <button @click="nextPage" :disabled="page === totalPages" class="page-dot">
            <chevron-right class="h-4 w-auto translate-x-0.5 translate-y-px"/>
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
  import type { MapMarker } from '../store/types'
  import { defineComponent, computed, ref, watch, onMounted } from 'vue'
  import { useStore } from '../store'
  import { useRoute, useRouter } from 'vue-router'
  import MarkersListItem from './MarkersListItem.vue'
  import ChevronLeft from './svg/ChevronLeft.vue'
  import ChevronRight from './svg/ChevronRight.vue'
  import SearchIcon from './svg/SearchIcon.vue'
  import CloseIcon from './svg/CloseIcon.vue'

  export default defineComponent({
    setup () {
      const store = useStore()
      const route = useRoute()
      const router = useRouter()

      const doneSearch = ref(false)
      const markers = computed(() => {
        if (doneSearch.value) {
          return results.value
        } else {
          return store.markers
        }
      })

      const page = computed({
        get: () => Number(route.query?.page || 1),
        set: (val) => {
          // console.log('set page..', val)
          if (typeof val !== 'number' || val < 1) return
          const q = { ...route.query }
          if (val !== 1) {
            q.page = `${val}`
          }
          router.push({ path: route.path, query: q })
        }
      })
      const perPage = 24
      const paging = computed(() => {
        const start = (page.value - 1) * perPage
        return markers.value.slice(start, start + perPage)
      })

      const totalPages = computed(() => Math.floor(markers.value?.length / perPage))

      const pageNumbers = computed(() => {
        const currentPage = page.value
        const l: any[] = [1]
        const p: any[] = []
        const b = currentPage - 1
        const f = currentPage + 1
        if (b > 0 && !l.includes(b)) {
          p.push(b)
        }
        if (!l.includes(currentPage)) {
          p.push(currentPage)
        }
        if (f < totalPages.value && !l.includes(f)) {
          p.push(f)
        }

        if (p[0] - l[0] > 1) {
          l.push('...')
        }

        if (totalPages.value - p[p.length - 1] > 1) {
          p.push('...')
        }

        l.push(...p)
        !l.includes(totalPages.value) && l.push(totalPages.value)

        return l
      })

      const prevPage = () => {
        if (page.value <= 1) return
        page.value--
      }
      const nextPage = () => {
        if (page.value >= totalPages.value) return
        page.value++
      }

      const pageNav = (pp: number) => {
        const c = new URL(location.href)
        c.searchParams.set('page', String(pp))
        return c.toString().replace(c.origin, '')
      }

      const routeSearch = ref<string|null>(null)
      const results = ref<MapMarker[]>([])
      const query = ref('')
      const doSearch = () => {
        if (!query.value.length) return

        routeSearch.value = query.value
        store.searchMarkers(query.value).then((data) => {
          doneSearch.value = true
          results.value = data
        }).catch((_err) => {
          doneSearch.value = true
          results.value = []
        })
        ;(document.activeElement as HTMLInputElement)?.select?.()
      }
      const hasSearch = computed(() => query.value.length > 0 && doneSearch.value)
      const clearSearch = () => {
        query.value = ''
        routeSearch.value = null
        doneSearch.value = false
      }

      watch(query, (val) => {
        if (!val || val === '') {
          doneSearch.value = false
          routeSearch.value = null
        }
      })
      watch(routeSearch, (val) => {
        const q = { ...route.query }

        if (val) {
          q.s = val
        } else {
          delete q.s
        }
        delete q.page

        router.replace({ path: route.path, query: q })
      })

      onMounted(() => {
        if (route.query?.s) {
          routeSearch.value = route.query.s as string
          query.value = route.query.s as string
          doSearch()
        }
      })

      return { page, paging, totalPages, pageNumbers, prevPage, nextPage, pageNav, query, doSearch, hasSearch, clearSearch, lt: store.lt }
    },
    components: { MarkersListItem, ChevronLeft, ChevronRight, SearchIcon, CloseIcon }
  })
</script>
