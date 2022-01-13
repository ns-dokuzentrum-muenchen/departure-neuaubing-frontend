<template>
  <img ref="el" @click="openDialog" :src="image?.sizes.medium" :srcset="srcset" @load="loaded" :width="width" :height="height" :alt="image.alt" loading="lazy" class="cursor-zoom-in opacity-0"/>

  <transition name="fade">
    <div v-show="zoomed" class="fixed inset-0 z-50 bg-white overflow-hidden">
      <button @click="closeDialog" aria-label="Close" class="btn round m-8 absolute right-0 top-0">
        <close-icon class="w-3 md:w-4 h-3 md:h-4"/>
      </button>
      <figure class="p-12 lg:p-16 max-w-screen max-h-screen h-full grid place-items-center">
        <img ref="zoom" @click="closeDialog" :srcset="srcset" :width="width" :height="height" :alt="image.alt" class="w-auto h-auto max-h-full"/>
        <figcaption>hellow there</figcaption>
      </figure>
    </div>
  </transition>
</template>

<script lang="ts">
  import type { Image } from '../store/types'
  import { defineComponent, ref, computed } from 'vue'
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

      return { el, image, width, height, srcset, loaded, zoomed, openDialog, closeDialog }
    },
    components: { CloseIcon }
  })

  function nextFrame () {
    return new Promise(requestAnimationFrame)
  }
</script>
