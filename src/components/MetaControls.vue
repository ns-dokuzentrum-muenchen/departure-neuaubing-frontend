<template>
  <div v-if="available" :class="classes" class="fixed top-0 p-1 rounded-full mt-2.5 md:mt-14 mr-2 md:mr-12 transition-all duration-300 md:z-0">
    <div>
      <button @click="openMeta" :aria-expanded="vis > 0" tabindex="2" id="infobutton" aria-label="Seitenleiste" aria-controls="seitenleiste" aria-haspopup="true" class="btn round">
        <info-icon v-if="vis === 0" class="-translate-x-px w-4.5 h-4.5 md:w-full md:h-full"/>
        <close-icon v-else class="w-4.5 h-4.5 md:w-5 md:h-5"/>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
  import type { Post } from '../store/types'
  import type { ComputedRef } from 'vue'
  import { defineComponent, inject, computed } from 'vue'
  import { useStore } from '../store'
  import { useRoute, useRouter } from 'vue-router'
  import InfoIcon from './svg/InfoIcon.vue'
  import ChevronLeft from './svg/ChevronLeft.vue'
  import CloseIcon from './svg/CloseIcon.vue'

  export default defineComponent({
    props: {
      fields: Object
    },
    setup (props) {
      const store = useStore()
      const route = useRoute()
      const router = useRouter()

      const fields = computed(() => {
        return (props.fields as Post)?.acf
      })
      const available = computed(() => {
        return route.meta.seite
          && (!fields.value?.hide_meta)
      })
      const hiddenByContent = computed(() => store.metaHidden || store.menuOpen)

      const metaLayer: ComputedRef<number> | undefined = inject('metaLayer')
      const vis = computed(() => {
        return metaLayer?.value || 0
      })

      const classes = computed(() => {
        const x = [['right-0', 'right-seite', 'right-kontext'][vis.value]]
        // const z = menuOpen.value ? '' : 'z-50'
        if (hiddenByContent.value && vis.value === 0) {
          x.push('opacity-0', 'pointer-events-none')
        }
        return x
      })

      function openMeta () {
        if (vis.value === 0) {
          router.replace({ path: route.path, query: route.query, hash: '#seitenleiste' })
        } else {
          router.replace({ path: route.path, query: route.query, hash: undefined })
        }
      }
      function closeMeta () {
        if (vis.value > 1) {
          router.push({ path: route.path, query: route.query, hash: '#seitenleiste' })
        } else {
          router.push({ path: route.path, query: route.query, hash: undefined })
        }
      }

      return { available, vis, classes, openMeta, closeMeta }
    },
    components: { InfoIcon, ChevronLeft, CloseIcon }
  })
</script>
