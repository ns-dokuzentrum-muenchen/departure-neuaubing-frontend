<template>
  <div class="md:grid grid-cols-12 gap-4 px-4 my-8">
    <div :class="position" :style="nudge" class="col-span-7 bg-bg leftopen-nudge">
      <figure>
        <app-image :image="image"></app-image>

        <figcaption class="px-4 py-2">
          <div v-html="image?.caption" class="html"></div>
        </figcaption>
      </figure>
    </div>
  </div>
</template>

<script lang="ts">
  import type { Image } from '../../store/types'
  import { defineComponent, computed } from 'vue'
  import AppImage from '../AppImage.vue'

  export default defineComponent({
    props: {
      block: Object,
      slug: String
    },
    setup (props) {
      const image = computed<Image>(() => props.block?.image)
      const position = computed(() => {
        return `col-start-${props.block?.position || '1'}`
      })

      const block = computed(() => props.block)

      const nudge = computed(() => {
        const c = props.block?.position || 1
        const val = (12 - c) / 12
        return `--nudge:${val}`
      })

      return { image, position, block, nudge }
    },
    components: { AppImage }
  })
</script>
