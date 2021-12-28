<template>
  <div class="bg-bg py-4">
    <details class="group open:bg-gray-200 open:bg-opacity-25">
      <summary class="md:grid grid-cols-12 gap-4 my-8 p-4 cursor-pointer border-b group-open:border-b-0">
        <p :class="position" class="text-xl md:text-2xl lg:text-3xl list-item col-span-7">{{ title }}</p>
      </summary>

      <div class="border-b pb-4 expander">
        <component v-for="(block, i) in rows" :is="block.acf_fc_layout" :block="block" :slug="slug" :key="i"></component>
      </div>
    </details>
  </div>
  <!-- <div class="md:grid grid-cols-12 gap-4 px-4 my-8">
    <div :class="position" :style="nudge" class="col-span-7 bg-bg leftopen-nudge">
      <figure>
        <video-player v-if="block?.video" :video="block.video" class="w-full"/>

        <figcaption class="px-4 py-2">
          <p class="text-xl md:text-2xl lg:text-3xl">{{ block?.title }}</p>
          <div v-html="block?.description" class="html"></div>
        </figcaption>
      </figure>
    </div>
  </div> -->
</template>

<script lang="ts">
  import { defineComponent, computed } from 'vue'
  import TextBlock from './TextBlock.vue'
  import ImageBlock from './ImageBlock.vue'

  export default defineComponent({
    props: {
      block: Object,
      slug: String
    },
    setup (props) {
      const title = computed(() => props.block?.title)
      const position = computed(() => {
        return `col-start-${props.block?.position || '1'}`
      })
      const rows = computed(() => props.block?.content || [])

      // const block = computed(() => props.block)
      // const nudge = computed(() => {
      //   const c = props.block?.position || 1
      //   const val = (12 - c) / 12
      //   return `--nudge:${val}`
      // })

      return { title, position, rows, slug: props.slug }
    },
    components: { TextBlock, ImageBlock }
  })
</script>
