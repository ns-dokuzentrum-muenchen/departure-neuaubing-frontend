<template>
  <div ref="el">
    <div v-for="(frame, i) in frames" :key="i" class="min-h-smblock md:grid grid-cols-12 gap-4 my-8 px-4">
      <div :class="pos(frame)" class="col-span-7 text-lg md:text-xl lg:text-2xl max-w-full md:max-w-xl md:mt-48">
        <div v-html="frame.content" class="html theme-bold break-words"></div>
      </div>
    </div>

    <div :class="{ 'translate-x-full': !inView }" class="fixed top-0 bottom-0 right-0 max-w-full overflow-auto bg-black text-white transform transition-all duration-300 overscroll-contain z-10 w-meta">
      <div class="px-4 pt-2.5 md:px-10 md:pt-14 h-full flex flex-col">
        <div class="border-b-2 pb-2">
          <p class="font-medium text-xl">{{ leiste?.title }}</p>
        </div>
        <div v-html="leiste?.description" class="html mt-4"></div>
        <div class="mt-auto mb-8">
          <router-link to="/pages/ueber" class="hover:opacity-70 transition-opacity block">
            <ns-doku-logo class="max-w-48 h-auto"/>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, computed, ref, onMounted, onUnmounted } from 'vue'
  import { useStore } from '../store'
  import NsDokuLogo from './svg/NsDokuLogo.vue'

  export default defineComponent({
    setup () {
      const store = useStore()
      const leiste = computed(() => store.settings?.seitenleiste)

      const el = ref<HTMLElement|null>(null)
      const inView = ref(false)

      const frames = computed(() => leiste.value?.frames || [])
      const pos = (frame: any) => {
        return `col-start-${frame?.position || '1'}`
      }

      const listen = () => {
        const r = el.value?.getBoundingClientRect()
        if (!r) return

        const { top, bottom } = r
        const mid = window.innerHeight / 2
        const b = mid * 1.5

        inView.value = top < mid && bottom > b
      }

      onMounted(() => {
        window.addEventListener('scroll', listen)
      })
      onUnmounted(() => {
        window.removeEventListener('scroll', listen)
      })

      return { el, inView, leiste, frames, pos }
    },
    components: { NsDokuLogo }
  })
</script>
