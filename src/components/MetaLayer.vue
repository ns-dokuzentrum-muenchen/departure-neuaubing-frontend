<template>
  <div id="seitenleiste" ref="metaEl" class="z-20 relative">
    <div :class="{ 'translate-x-full': vis === 0 }" class="fixed top-0 bottom-0 right-0 overflow-auto bg-black text-white transform transition-transform duration-300 max-w-meta">
      <div class="px-10 mt-14">
        <div class="flex p-1">
          <div class="mr-2">
            <button class="btn text-lg">Forum</button>
          </div>
          <div>
            <button class="btn text-lg">Glossar</button>
          </div>
          <div class="flex-auto"></div>
          <div>
            <button class="btn text-lg">S</button>
          </div>
        </div>
      </div>
      <div class="px-10 my-6">
        <h3 class="text-xl">Kontext</h3>
        <glossar-post v-for="post in data.posts" :key="post.id" :post="post" class="my-4"/>
      </div>
    </div>

    <div :class="vis > 0 ? 'right-[25.4rem]' : 'right-0'" class="fixed top-0 p-1 rounded-full mt-14 mr-12 transition-all duration-300">
      <div>
        <button @click="openMeta" class="btn round">
          <chevron-left class="-translate-x-px"/>
        </button>
      </div>
      <transition name="fade">
        <div v-if="vis > 0" class="mt-4">
          <button @click="closeMeta" class="btn round">
            <chevron-left class="rotate-180 translate-x-0.5"/>
          </button>
        </div>
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, computed, ref, inject, ComputedRef } from 'vue'
  import { useStore } from '../store'
  import { Post } from '../store/state'
  import { useRoute, useRouter } from 'vue-router'
  import { onClickOutside } from '@vueuse/core'
  import GlossarPost from './GlossarPost.vue'
  import ChevronLeft from './svg/ChevronLeft.vue'
  import ChevronRight from './svg/ChevronRight.vue'

  type Data = {
    path: string
    posts: Post[]
    type?: string
  }

  export default defineComponent({
    name: 'MetaLayer',
    setup () {
      const store = useStore()
      const route = useRoute()
      const router = useRouter()

      const metaLayer: ComputedRef<number> | undefined = inject('metaLayer')

      const vis = computed(() => {
        return metaLayer?.value || 0
      })

      function openMeta () {
        if (vis.value === 0) {
          router.push({ hash: '#seitenleiste' })
        } else {
          router.push({ hash: '#kontext' })
        }
      }
      function closeMeta () {
        if (vis.value > 1) {
          router.push({ hash: '#seitenleiste' })
        } else {
          router.push({ hash: undefined })
        }
      }

      const data = computed((): Data => {
        const res: Data = {
          path: route.path,
          posts: []
        }

        if (route.name === 'projekt') {
          res.type = 'projekt'
          store.projects?.forEach((p) => {
            if (p.slug === route.params.slug) {
              res.posts.push(p)
            }
          })
        } else if (route.name === 'index') {
          res.type = 'index'
          res.posts.push(...(store.projects || []))
        }
        return res
      })

      const metaEl = ref(null)
      onClickOutside(metaEl, () => {
        if (vis.value > 0) {
          router.push({ hash: undefined })
        }
      })

      return { metaEl, vis, openMeta, closeMeta, data }
    },
    components: { GlossarPost, ChevronLeft, ChevronRight }
  })
</script>
