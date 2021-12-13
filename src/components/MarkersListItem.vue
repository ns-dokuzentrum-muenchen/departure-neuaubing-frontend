<template>
  <div :class="{ 'bg-gray-200 dark:bg-gray-500': expanded }" class="grid grid-cols-12 gap-4 border-b py-2 hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors">
    <div class="col-span-3">
      {{ item.title }}
    </div>
    <div :class="{ 'line-clamp-2': !expanded }" class="col-span-4">
      <div v-html="item.description" class="html"></div>
      <div v-if="item.source && expanded" class="mt-2 text-gray-500 font-light">{{ item.source }}</div>
    </div>
    <div class="col-span-1">
      {{ item.num_people_cat_id }}
    </div>
    <div class="col-span-3">
      <p>{{ item.location.address }}</p>
      <p>{{ item.location.address_new }}</p>
    </div>
    <div class="col-span-1 flex justify-between items-start">
      <div :class="{ artist: item.from_artist }" class="list-dot text-xs">{{ item.id }}</div>
      <button @click="expanded = !expanded" class="px-2 h-6">
        <img :class="{ 'rotate-180': expanded }" src="~../assets/chevron-down.svg" width="16" height="16" class="transition-transform"/>
      </button>
    </div>
    <transition @enter="slideOpen" @leave="slideClose">
      <div v-if="expanded" data-overflow="hidden" class="col-span-12">
        <div class="px-2 pb-2">
          <div class="flex justify-end space-x-2">
            <button class="btn-sm">Foto beitragen</button>
            <button @click="viewInMap" class="btn-sm">anzeigen</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
  import type { MapMarker } from '../store/types'
  import { defineComponent, ref } from 'vue'
  import { slideOpen, slideClose } from '../utils'
  import { useRoute, useRouter } from 'vue-router'
  import bus from '../eventBus'

  export default defineComponent({
    props: {
      item: Object
    },
    setup (props) {
      const item = props.item as MapMarker
      const route = useRoute()
      const router = useRouter()

      const expanded = ref(false)
      const viewInMap = () => {
        const query = { ...route.query, marker: item.post_id }
        router.replace({ ...route, query })
        bus.emit('selectMarker', item.post_id)
      }

      return { item, expanded, slideOpen, slideClose, viewInMap }
    }
  })
</script>
