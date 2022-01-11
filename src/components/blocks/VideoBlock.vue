<template>
  <div class="md:grid grid-cols-12 gap-4 px-4">
    <div :class="position" :style="nudge" class="col-span-7 bg-bg leftopen-nudge">
      <figure>
        <video-player v-if="block?.video" :video="block.video" :key="block.video?.uri" class="w-full"/>

        <figcaption class="px-4 py-2">
          <p class="text-xl md:text-2xl lg:text-3xl">{{ block?.title }}</p>
          <div v-html="block?.description" class="html"></div>
        </figcaption>
      </figure>
      <div v-if="block.details">
        <details>
          <summary class="text-xl cursor-pointer w-full py-2 px-4">{{ block?.details_summary }}</summary>
          <div class="html p-4 font-light text-base border-t">
            <div v-html="block?.details_text" class="max-w-prose-1"></div>
          </div>
        </details>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import type { AcfRow } from '../../store/types'
  import { defineComponent, computed } from 'vue'
  import VideoPlayer from '../VideoPlayer.vue'

  export default defineComponent({
    props: {
      block: Object,
      slug: String
    },
    setup (props) {
      const position = computed(() => {
        return `col-start-${props.block?.position || '1'}`
      })

      const block = computed(() => props.block as AcfRow)

      const nudge = computed(() => {
        const c = props.block?.position || 1
        const val = (12 - c) / 12
        return `--nudge:${val}`
      })

      return { position, block, nudge }
    },
    components: { VideoPlayer }
  })
</script>
