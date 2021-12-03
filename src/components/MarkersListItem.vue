<template>
  <div :class="{ 'bg-gray-200': expanded }" class="grid grid-cols-12 gap-4 border-b py-2 hover:bg-gray-200 transition-colors">
    <div class="col-span-3">
      {{ item.title }}
    </div>
    <div :class="{ 'line-clamp-2': !expanded }" class="col-span-4">
      <div v-html="item.description" class="html"></div>
      <!-- <div v-if="item.source" class="mt-2 text-gray-500">{{ item.source }}</div> -->
    </div>
    <div class="col-span-1">
      {{ item.num_people_cat_id }}
    </div>
    <div class="col-span-3">
      <p>{{ item.location.address }}</p>
      <p>{{ item.location.address_new }}</p>
    </div>
    <div class="col-span-1 flex justify-between items-start">
      <div :class="{ artist: item.from_artist }" class="marker-dot text-xs">{{ item.id }}</div>
      <button @click="expanded = !expanded" class="px-2">
        {{ expanded ? '↑' : '↓' }}
      </button>
    </div>
  </div>
</template>

<script lang="ts">
  import type { MapMarker } from '../store/types'
  import { defineComponent, ref } from 'vue'
  import { slideOpen, slideClose } from '../utils'

  export default defineComponent({
    props: {
      item: Object
    },
    setup (props) {
      const item = props.item as MapMarker

      const expanded = ref(false)

      return { item, expanded, slideOpen, slideClose }
    }
  })
</script>
