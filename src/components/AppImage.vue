<template>
  <img ref="el" :src="image?.sizes.medium" :srcset="srcset" @load="loaded" :width="width" :height="height" :alt="image.alt" loading="lazy" class="opacity-0"/>
</template>

<script lang="ts">
  import type { Image } from '../store/types'
  import { defineComponent, ref, computed } from 'vue'

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

      return { el, image, width, height, srcset, loaded }
    }
  })

  function nextFrame () {
    return new Promise(requestAnimationFrame);
  }
</script>
