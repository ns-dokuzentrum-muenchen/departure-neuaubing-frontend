<template>
  <div class="bg-bg py-4">
    <details class="group open:bg-gray-200 open:bg-opacity-25">
      <summary class="md:grid grid-cols-12 gap-4 px-4 cursor-pointer">
        <p :class="position" class="text-xl md:text-2xl lg:text-3xl list-item col-span-7 border-b group-open:border-b-0 mx-4 py-2">{{ title }}</p>
      </summary>

      <div class="expander">
        <component v-for="(block, i) in rows" :is="block.acf_fc_layout" :block="block" :slug="slug" :key="i"></component>
      </div>
    </details>
  </div>
</template>

<script lang="ts">
  import { defineComponent, computed } from 'vue'
  import TextBlock from './TextBlock.vue'
  import ImageBlock from './ImageBlock.vue'
  import ImgFloatBlock from './ImgFloatBlock.vue'
  import CarouselBlock from './CarouselBlock.vue'

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
    components: { TextBlock, ImageBlock, ImgFloatBlock, CarouselBlock }
  })
</script>
