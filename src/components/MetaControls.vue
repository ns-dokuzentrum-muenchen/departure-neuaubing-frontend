<template>
  <div v-if="available" :class="classes" class="fixed top-0 p-1 rounded-full mt-4 md:mt-14 mr-2 md:mr-12 transition-all duration-300">
    <div>
      <button @click="openMeta" class="btn round">
        <chevron-left class="-translate-x-px w-full h-full"/>
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
</template>

<script lang="ts">
  import { defineComponent, ComputedRef, inject, computed } from 'vue'
  // import { useStore } from '../store'
  import { useRoute, useRouter } from 'vue-router'
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

      const classes = computed(() => {
        if (vis.value > 1) return 'right-kontext'
        if (vis.value > 0) return 'right-seite'
        return 'right-0'
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

      return { available, metaLayer, vis, classes, openMeta, closeMeta }
    },
    components: { ChevronLeft, CloseIcon }
  })
</script>
