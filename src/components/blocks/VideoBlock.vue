<template>
  <div class="md:grid grid-cols-12 gap-4 px-4 my-8">
    <div :class="position" class="col-span-7 bg-bg">
      <figure>
        <video-player v-if="block?.video" :video="block.video" class="w-full"/>

        <figcaption class="px-4 py-2">
          <p class="text-xl md:text-2xl lg:text-3xl">{{ block?.title }}</p>
          <div v-html="block?.description" class="html"></div>
        </figcaption>
      </figure>
    </div>
  </div>
</template>

<script lang="ts">
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

      const block = computed(() => props.block)

      return { position, block }
    },
    components: { VideoPlayer }
  })
</script>
