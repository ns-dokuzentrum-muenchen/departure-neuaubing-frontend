<template>
  <div class="mx-6 md:mx-24 mb-8 overflow-hidden">
    <div class="mt-24 mb-16 md:my-24 lg:my-48">
      <font-logo class="max-w-full" alt="Departure Neuaubing" title="Departure Neuaubing" aria-hidden="true"/>
      <p class="sr-only">Departure Neuaubing</p>
    </div>
    <div v-if="settings?.about" class="md:-mt-8 lg:-mt-12">
      <div class="text-lg md:text-xl lg:text-2xl max-w-xl">
        <div v-html="settings.about" class="html"></div>
      </div>
    </div>
  </div>

  <div class="md:mx-12 md:my-16">
    <scroll-canvas v-if="settings?.intro" :block="settings.intro"/>
  </div>

  <div v-if="settings?.seitenleiste" class="">
    <scroll-meta/>
  </div>

  <div id="project-list" ref="list" class="px-12 py-16 overflow-x-hidden">
    <div class="grid grid-cols-1 gap-8 sm:gap-12 md:gap-20 lg:gap-32 items-center justify-items-center">
      <project-item v-for="(p, i) in projects" :key="i" :project="p" :col="i % 5" :pos="pos" :class="rowCol(i)" :idx="i" @move="move" class="col-start-1 col-auto"/>
    </div>

    <div class="my-16 md:my-24 flex justify-center">
      <button @click="reorder" class="btn">
        <redo-icon class="inline-block mr-4 -ml-4 -mt-1" width="24" height="24"/>
        <span>{{ lt('shuffle') }}</span>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, computed, ref, onMounted } from 'vue'
  import { useStore } from '../store/index'
  import ScrollCanvas from '../components/ScrollCanvas.vue'
  import ScrollMeta from '../components/ScrollMeta.vue'
  import ProjectItem from '../components/ProjectItem.vue'
  import RedoIcon from '../components/svg/RedoIcon.vue'
  import FontLogo from '../components/FontLogo.vue'

  export default defineComponent({
    name: 'Index',
    setup () {
      const store = useStore()
      const settings = computed(() => store.settings)
      const projects = computed(() => settings.value?.projekte)

      const list = ref<HTMLElement|null>(null)

      const pos = computed<number>({
        get () { return store.indexPos },
        set (value) {
          if (typeof value !== 'number') return
          store.indexPos = value
        }
      })

      const rowCol = (i: number) => {
        const row = Math.floor(i / 5) + 1
        return `row-start-${row}`
      }

      const move = (to: number) => {
        pos.value = to
      }

      let dir = 1
      const reorder = () => {
        if (pos.value === 0) {
          dir = 1
        } else if (pos.value === 4) {
          dir = -1
        }
        pos.value = pos.value + dir

        if (list.value) {
          list.value.scrollIntoView({ block: 'start', behavior: 'smooth' })
        }
      }

      onMounted(() => {
        store.getMeta()
      })

      return { settings, projects, list, pos, rowCol, move, reorder, lt: store.lt }
    },
    components: { ScrollCanvas, ScrollMeta, ProjectItem, RedoIcon, FontLogo }
  })
</script>
