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
            <h1 class="text-2xl lg:text-4xl font-medium"><span class="opacity-50">Tag:</span> {{ tagData?.name || '...' }}</h1>
          </div>

          <div class="mt-12">
            <ul v-if="tagData?.posts.length" class="pt-12 mb-32">
              <li v-for="post in tagData.posts" :key="`tag-${post.id}`" class="mb-8">
                <search-result :post="post"/>
              </li>
            </ul>
            <div v-else>
              <div class="pt-12 mb-32">
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
  import type { Ref } from 'vue'
  import { defineComponent, computed, ref, watch, onMounted } from 'vue'
  import { useStore } from '../store'
  import { useRoute, useRouter } from 'vue-router'
  import ChevronLeft from '../components/svg/ChevronLeft.vue'
  import SearchResult from '../components/SearchResult.vue'
  import LocaleLink from '../components/LocaleLink.vue'

  export default defineComponent({
    setup () {
      const store = useStore()
      const route = useRoute()
      const router = useRouter()

      const tag = computed(() => route.params.slug)
      const tagData: Ref<any> = ref(null)

      const goBack = () => {
        if (!window.history?.state?.back) {
          router.push('/')
        } else {
          router.go(-1)
        }
      }

      watch(route, (newVal) => {
        if (newVal?.name !== 'tag') return
        setupTag()
      })

      async function setupTag () {
        tagData.value = await store.getTagData(tag.value as string)

        store.setBlankMeta(`${tagData.value?.name} - Tag`)
      }

      onMounted(() => {
        store.setBlankMeta('Tags')
        setupTag()
      })

      return {
        lt: store.lt,
        tag,
        tagData,
        goBack
      }
    },
    components: { ChevronLeft, SearchResult, LocaleLink }
  })
</script>
