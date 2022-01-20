<template>
  <div class="dark:bg-gray-800 md:pl-20 lg:pl-32">
    <div class="relative bg-black text-white pt-14 pr-4 md:pr-20 lg:pr-32">
      <div class="hidden md:flex justify-end py-1 -mr-12">
        <!-- <div class="mr-4">
          <router-link to="/forum" class="btn text-lg block">Forum</router-link>
        </div> -->
        <div class="mr-4">
          <locale-link to="/suchen" class="btn text-lg whitespace-nowrap block">
            <search-icon class="inline-block w-5 h-5 mr-2"/>
            <span>{{ lt('search') }}</span>
          </locale-link>
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
            <h1 class="text-2xl lg:text-4xl font-medium">{{ lt('glossar') }}</h1>
          </div>

          <div class="mb-24">
            <ul class="flex space-x-4 mb-8">
              <li>
                <locale-link to="/glossar" active-class="bg-theme" class="px-3 py-1 border rounded-full hover:bg-gray-700">{{ lt('glossar') }}</locale-link>
              </li>
              <li>
                <locale-link to="/orte" active-class="bg-theme" class="px-3 py-1 border rounded-full hover:bg-gray-700">{{ lt('places') }}</locale-link>
              </li>
              <li>
                <locale-link to="/personen" active-class="bg-theme" class="px-3 py-1 border rounded-full hover:bg-gray-700">{{ lt('people') }}</locale-link>
              </li>
            </ul>
            <ul>
              <li v-for="term in glossary" :key="term.id" class="my-2">
                <connection-preview :post="term"/>
              </li>
            </ul>
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
  import { defineComponent, computed, provide } from 'vue'
  import { useStore } from '../store'
  import { useRoute, useRouter, onBeforeRouteUpdate } from 'vue-router'
  import ConnectionPreview from '../components/ConnectionPreview.vue'
  import SearchIcon from '../components/svg/SearchIcon.vue'
  // import CloseIcon from '../components/svg/CloseIcon.vue'
  import ChevronLeft from '../components/svg/ChevronLeft.vue'
  import LocaleLink from '../components/LocaleLink.vue'

  export default defineComponent({
    setup () {
      const store = useStore()
      const route = useRoute()
      const router = useRouter()

      const glossary = computed(() => {
        const type = route.params.pathMatch ? route.params.pathMatch : 'glossar'
        return store.glossary(type)
      })

      const metaContext = computed(() => {
        const pos = route.hash.indexOf('=')
        if (pos >= 0) {
          const path = route.hash.slice(pos + 1)
          return path.slice(0, path.length - (path.slice(-1) === '/' ? 1 : 0))
        }
        return
      })

      provide('ctx', metaContext)

      const goBack = () => {
        if (!window.history?.state?.back) {
          router.push('/')
        } else {
          router.go(-1)
        }
      }

      onBeforeRouteUpdate((to, _from, next) => {
        const type = to.params.pathMatch || 'glossar'
        store.getGlossarTerms(type).then(next)
      })

      return { glossary, goBack, lt: store.lt }
    },
    beforeRouteEnter (to, _from, next) {
      const store = useStore()
      const type = to.params.pathMatch || 'glossar'
      store.getGlossarTerms(type).then(next)
    },
    components: { ConnectionPreview, SearchIcon, ChevronLeft, LocaleLink }
  })
</script>
