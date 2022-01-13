<template>
  <div class="md:grid grid-cols-12 gap-4 px-4">
    <div :class="position" class="col-end-13 my-8 px-4 clearfix max-w-5xl">
      <div v-for="(row, i) in rows" :key="i" :class="itemStyle(row)">
        <div v-if="row.type === 'text'" class="bg-bg text-lg">
          <div v-html="row.text" class="html max-w-prose"></div>
        </div>
        <figure v-else class="pb-8">
          <app-image-zoom :image="row.image"/>
          <figcaption v-if="row.image?.caption" class="py-2 bg-bg text-sm">
            <div v-html="row.image?.caption" class="html"></div>
          </figcaption>
        </figure>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, computed } from 'vue'
  import AppImageZoom from '../AppImageZoom.vue'

  export default defineComponent({
    props: {
      block: Object,
      slug: String
    },
    setup (props) {
      const rows = computed(() => props.block?.items || [])

      const itemStyle = (item: any) => {
        return item.type === 'text' ? 'md:w-2/3 mb-8' : 'md:float-right md:max-w-96 md:pl-8 clear-right'
      }

      const position = computed(() => {
        return `col-start-${props.block?.position || '1'}`
      })

      return { rows, itemStyle, position }
    },
    components: { AppImageZoom }
  })
</script>
