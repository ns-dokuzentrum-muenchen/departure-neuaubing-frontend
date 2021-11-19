<template>
  <img ref="el" :src="image?.sizes.medium" :srcset="srcset" loading="lazy"/>
</template>

<script lang="ts">
  import { defineComponent, ref, computed, onMounted } from 'vue'
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

      onMounted(() => {
        // console.log(el.value?.getBoundingClientRect())
      })

      return { el, image, srcset }
    }
  })
</script>
