<template>
  <div id="seitenleiste" ref="metaEl" class="z-20 relative">
    <div :class="classes" class="fixed top-0 bottom-0 right-0 max-w-full overflow-auto bg-black text-white transform transition-all duration-300">
      <div class="px-10 mt-14">
        <div class="flex justify-end py-1">
          <div v-if="vis > 1" class="flex-auto -mt-0.5">
            <p class="text-xl md:text-2xl lg:text-4xl font-medium">{{ metaTitle }}</p>
          </div>
          <div class="hidden md:block mr-4">
            <button @click="hash('#forum')" class="btn text-lg">Forum</button>
          </div>
          <div class="hidden md:block mr-4">
            <button @click="hash('#glossar')" class="btn text-lg">Glossar</button>
          </div>
          <div v-if="vis < 2" class="flex-auto"></div>
          <div>
            <router-link v-if="vis < 2" to="/suche" class="btn round block">
              <search-icon class="inline-block w-5 h-5"/>
            </router-link>
            <router-link v-else to="/suche" class="btn text-lg whitespace-nowrap block">
              <search-icon class="inline-block w-5 h-5 mr-2"/>
              <span>Suchen</span>
            </router-link>
          </div>
        </div>
      </div>
      <div class="px-10 my-6">
        <h3 class="text-xl">Kontext</h3>
        <template v-if="data.post">
          <glossar-post :post="data.post" class="my-f"/>
        </template>
        <template v-if="data.posts?.length">
          <glossar-post v-for="post in data.posts" :key="post.id" :post="post" class="my-4"/>
        </template>
      </div>
    </div>

    <meta-controls/>
  </div>
</template>

<script lang="ts">
  import { defineComponent, computed, ref, inject, ComputedRef } from 'vue'
  import { useStore } from '../store'
  import { Post } from '../store/types'
  import { useRoute, useRouter } from 'vue-router'
  import { onClickOutside } from '@vueuse/core'
  import GlossarPost from './GlossarPost.vue'
  import ChevronLeft from './svg/ChevronLeft.vue'
  import SearchIcon from './svg/SearchIcon.vue'
  import MetaControls from './MetaControls.vue'

  type Data = {
    path: string
    post?: Post
    posts?: Post[]
    type?: string
  }

  export default defineComponent({
    name: 'MetaLayer',
    setup () {
      const store = useStore()
      const route = useRoute()
      const router = useRouter()

      const metaLayer: ComputedRef<number> | undefined = inject('metaLayer')
      const vis = computed(() => metaLayer?.value || 0)

      const classes = computed(() => {
        let c = [vis.value > 1 ? 'w-kontext' : 'w-meta']
        vis.value === 0 && c.push('translate-x-full')
        return c
      })

      const metaTitle = computed(() => {
        if (vis.value < 2) return ''
        const name = route.hash.slice(1)
        const end = route.hash.indexOf('=')
        return name.charAt(0).toUpperCase() + name.slice(1, end - 1)
      })

      const metaContext = computed(() => {
        const pos = route.hash.indexOf('=')
        if (pos >= 0) {
          return route.hash.slice(pos + 1)
        }
        return null
      })

      // TODO: match scroll pos on Index.vue
      const data = computed((): Data => {
        if (route.name === 'projekt') {
          const res: Data = {
            path: route.path,
            post: store.projects?.find(p => p.slug === route.params.slug)
          }
          return res
        }
        // } else if (route.name === 'index') {
        const res: Data = {
          path: '/',
          type: 'index',
          posts: store.projects || []
        }
        return res
      })

      const metaEl = ref(null)
      onClickOutside(metaEl, () => {
        if (vis.value > 0) {
          router.push({ hash: undefined })
        }
      })

      const hash = (hash: string) => {
        router.push({ hash })
      }

      return { vis, classes, metaTitle, metaContext, metaEl, data, hash }
    },
    components: { GlossarPost, ChevronLeft, SearchIcon, MetaControls }
  })
</script>
