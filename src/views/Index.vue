<template>
  <div class="mx-24">
    <div class="my-12 md:my-16 lg:my-24">
      <font-logo class="text-5xl md:text-7xl lg:text-9xl"/>
    </div>
    <div class="">
      <div class="text-xl lg:text-2xl max-w-xl">
        <p>Im Münchner Stadtteil Neuaubing existiert heute noch acht Baracken eines ehemaligen Zwangsarbeiter*innenlagers aus der NS-Zeit.</p>
      </div>
    </div>
  </div>
  <div class="mx-12 my-16 flex space-x-12 items-center">
    <div v-if="settings?.video" class="w-full md:w-2/3">
      <video-player :video="settings.video"/>
    </div>
    <div class="w-full md:w-1/3">
      <div class="text-xl lg:text-2xl max-w-xl">
        <p>
          <span class="text-blue-900">{{ location.city }}</span>
          ist {{ location.distance }} Kilometer von Neuaubing entfernt.
        </p>
      </div>
    </div>
  </div>
  <div class="px-12 py-16 overflow-hidden">
    <div class="grid grid-cols-12 gap-32 items-center justify-items-center">
      <project-item v-for="(p, i) in projects" :key="i" :project="p" :col="i % 5" :pos="pos" :class="rowCol(i)" @move="move" class="col-start-3 sm:col-start-4 lg:col-start-5 xl:col-start-6 col-auto"/>
    </div>

    <div class="mt-16 md:mt-24 lg:mt-36 flex justify-center">
      <button @click="reorder" class="btn">
        <redo-icon class="inline-block mr-4 -ml-4 -mt-1" width="24" height="24"/>
        <span>Seite neu Anordnen</span>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, computed, WritableComputedRef, onMounted } from 'vue'
  import { useStore } from '../store/index'
  import VideoPlayer from '../components/VideoPlayer.vue'
  import ProjectItem from '../components/ProjectItem.vue'
  import RedoIcon from '../components/svg/RedoIcon.vue'
  import FontLogo from '../components/FontLogo.vue'

  export default defineComponent({
    name: 'Index',
    setup () {
      const store = useStore()
      const settings = computed(() => store.settings)
      const projects = computed(() => settings.value?.projekte)

      const pos: WritableComputedRef<number> = computed({
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
      }

      // const observer = new IntersectionObserver((entries) => {
      //   for (const entry of entries) {
      //     console.log(entry.isIntersecting)
      //   }
      // })
      onMounted(() => {
        store.getVisitorDistance()
      })

      const location = computed(() => store.visitorDistance)

      return { settings, projects, pos, rowCol, move, reorder, location }
    },
    components: { VideoPlayer, ProjectItem, RedoIcon, FontLogo }
  })

  const whitelist = [ // 😵‍💫 JIT mode
    'row-start-1',
    'row-start-2',
    'row-start-3',
    'row-start-4',
    'row-start-5',
    'row-start-6'
  ]
</script>
