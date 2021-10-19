<template>
  <div ref="metaEl">
    <div :class="{ 'translate-x-full': vis === 0 }" class="fixed top-0 bottom-0 right-0 overflow-auto bg-black text-white transform transition-transform duration-300">
      <div class="p-8 min-w-meta">
        Seitenleiste
      </div>
    </div>

    <div :class="vis > 0 ? 'right-[25.4rem]' : 'right-0'" class="fixed top-0 p-1 rounded-full mt-14 mr-12 transition-all duration-300">
      <div>
        <button @click="openMeta" class="btn sm">
          <chevron-left/>
        </button>
      </div>
      <transition name="fade">
        <div v-if="vis > 0" class="mt-4">
          <button @click="closeMeta" class="btn sm">
            <chevron-right class="translate-x-0.5"/>
          </button>
        </div>
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, computed, ref } from 'vue'
  import { useStore } from '../store'
  import { Post } from '../store/state'
  import { useRoute } from 'vue-router'
  import { onClickOutside } from '@vueuse/core'
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

      const vis = computed(() => store.metaLayer)
      function openMeta () {
        store.metaLayer++
      }
      function closeMeta () {
        store.metaLayer--
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
        if (store.metaLayer) {
          store.metaLayer = 0
        }
      })

      return { metaEl, vis, openMeta, closeMeta, data }
    },
    components: { ChevronLeft, ChevronRight }
  })
</script>
