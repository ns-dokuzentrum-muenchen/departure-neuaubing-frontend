<template>
  <img ref="el" @click="openDialog" :src="image?.sizes.medium" :srcset="srcset" @load="loaded" :width="width" :height="height" :alt="image.alt" loading="lazy" class="cursor-zoom-in opacity-0"/>

  <transition name="fade">
    <div v-show="zoomed" class="fixed inset-0 z-50 bg-white overflow-none overscroll-contain">
      <button @click="closeDialog" aria-label="Close" class="btn round m-8 absolute right-0 top-0">
        <close-icon class="w-3 md:w-4 h-3 md:h-4"/>
      </button>
      <div class="w-screen h-screen px-4 md:px-8 lg:px-16 pt-4 md:pt-8 lg:pt-16 pb-20 grid place-items-center">
        <figure class="relative">
          <img @click="closeDialog" :srcset="srcset" :width="width" :height="height" :alt="image.alt" class="in-window w-auto"/>
          <figcaption v-html="image?.caption" class="mt-2 leading-snug text-sm absolute w-full top-full left-0"></figcaption>
        </figure>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
  import type { Image } from '../store/types'
  import { defineComponent, ref, computed, watch } from 'vue'
  import CloseIcon from './svg/CloseIcon.vue'

  export default defineComponent({
    props: {
      image: Object,
      width: Number,
      height: Number
    },
    setup (props) {
      const el = ref<HTMLElement|null>(null)
      const image = computed(() => props.image as Image)

      const width = computed(() => props.width || image.value.width)
      const height = computed(() => props.height || image.value.height)

      const srcset = computed(() => {
        if (!image.value) return ''
        if (image.value.subtype?.includes('svg')) {
          return
          // return image.value.url
        }

        const srcs = [`${image.value.url} ${image.value.width}w`]
        const urls = Object.entries(image.value.sizes).filter(v => typeof v[1] === 'string')

        urls.forEach(([key, val]) => {
          const w = image.value.sizes[`${key}-width`]
          srcs.push(`${val} ${w}w`)
        })

        return srcs.join(',')
      })

      const loaded = async (event: any) => {
        const { target } = event
        if (!target) return

        await nextFrame()

        target.animate?.({
          opacity: [0, 1]
        }, {
          duration: 450,
          easing: 'ease-out'
        })
        target.classList.remove('opacity-0')
      }

      const zoomed = ref(false)
      const openDialog = () => {
        zoomed.value = true
      }
      const closeDialog = () => {
        zoomed.value = false
      }

      function esc (ev: KeyboardEvent) {
        const { key } = ev
        if (key === 'Escape' || key === ' ') { // esc, or Space
          ev.preventDefault()
          closeDialog()
        }
      }

      watch(zoomed, (val) => {
        if (val) {
          window.addEventListener('keydown', esc)
        } else {
          window.removeEventListener('keydown', esc)
        }
      })

      return { el, image, width, height, srcset, loaded, zoomed, openDialog, closeDialog }
    },
    components: { CloseIcon }
  })

  function nextFrame () {
    return new Promise(requestAnimationFrame)
  }
</script>
