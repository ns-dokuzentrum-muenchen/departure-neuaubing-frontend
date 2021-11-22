<template>
  <div v-if="available" :class="classes" class="fixed top-0 p-1 rounded-full mt-4 md:mt-14 mr-2 md:mr-12 transition-all duration-300 md:z-0">
    <div>
      <button @click="openMeta" class="btn round">
        <info-icon class="-translate-x-px w-full h-full"/>
      </button>
    </div>
    <transition name="fade">
      <div v-if="vis > 0" class="mt-4">
        <button @click="closeMeta" class="btn round">
          <chevron-left class="rotate-180 translate-x-0.5 w-5 h-5 md:w-6 md:h-6"/>
        </button>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ComputedRef, inject, computed } from 'vue'
  // import { useStore } from '../store'
  import { useRoute, useRouter } from 'vue-router'
  import InfoIcon from './svg/InfoIcon.vue'
  import ChevronLeft from './svg/ChevronLeft.vue'
  import CloseIcon from './svg/CloseIcon.vue'

  export default defineComponent({
    name: 'MetaControls',
    setup () {
      // const store = useStore()
      const route = useRoute()
      const router = useRouter()

      const available = computed(() => route.meta.seite)

      const metaLayer: ComputedRef<number> | undefined = inject('metaLayer')
      const vis = computed(() => {
        return metaLayer?.value || 0
      })

      // const menuOpen = computed(() => store.menuOpen)

      const classes = computed(() => {
        const x = ['right-0', 'right-seite', 'right-kontext'][vis.value]
        // const z = menuOpen.value ? '' : 'z-50'
        return [x]
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

      return { available, vis, classes, openMeta, closeMeta }
    },
    components: { InfoIcon, ChevronLeft, CloseIcon }
  })
</script>
