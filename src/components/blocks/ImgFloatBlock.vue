<template>
  <div class="my-8 px-4 max-w-5xl mx-auto clearfix">
    <div v-for="(row, i) in rows" :key="i" :class="itemStyle(row)">
      <div v-if="row.type === 'text'" class="bg-bg text-lg">
        <div v-html="row.text" class="html max-w-prose"></div>
      </div>
      <figure v-else class="pb-8">
        <app-image :image="row.image"/>
        <figcaption v-if="row.image?.caption" class="py-2 bg-bg text-sm">
          <div v-html="row.image?.caption" class="html"></div>
        </figcaption>
      </figure>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, computed } from 'vue'
  import AppImage from '../AppImage.vue'

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

      return { rows, itemStyle }
    },
    components: { AppImage }
  })
</script>
