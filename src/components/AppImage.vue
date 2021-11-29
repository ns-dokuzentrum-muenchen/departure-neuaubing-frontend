<template>
  <img ref="el" :src="image?.sizes.medium" :srcset="srcset" @load="loaded" :width="image.width" :height="image.height" :alt="image.alt" loading="lazy" class="opacity-0"/>
</template>

<script lang="ts">
  import { defineComponent, ref, computed } from 'vue'
  import { Image } from '../store/types'

  export default defineComponent({
    props: {
      image: Object
    },
    setup (props) {
      const el = ref<HTMLElement|null>(null)
      const image = computed(() => props.image as Image)

      const srcset = computed(() => {
        if (!image.value) return ''

        const srcs = [`${image.value.url} ${image.value.width}w`]
        const urls = Object.entries(image.value.sizes).filter(v => typeof v[1] === 'string')

        urls.forEach(([key, val]) => {
          const w = image.value.sizes[`${key}-width`]
          srcs.push(`${val} ${w}w`)
        })

        return srcs.join(',')
      })

      const loaded = (event: any) => {
        const { target } = event
        if (!target) return

        target.animate?.({
          opacity: [0, 1]
        }, {
          duration: 450,
          easing: 'ease-out'
        })
        target.classList.remove('opacity-0')
      }

      return { el, image, srcset, loaded }
    }
  })
</script>
