<template>
  <div :class="{ 'bg-gray-200 dark:bg-gray-500' : expanded, 'max-h-16': !parentHeight }" :style="rowStyle" ref="parent" class="border-b hover:bg-gray-200 dark:hover:bg-gray-500 transition-all overflow-clip relative group">
    <div ref="row" @click="toggle" class="grid grid-cols-12 gap-4 py-2 cursor-pointer">
      <div class="col-span-3">
        {{ item.title }}
      </div>
      <div class="col-span-4 transition-m-height overflow-clip">
        <div v-if="item.description" v-html="item.description" class="html mb-2"></div>
        <div v-if="item.source" :class="{ 'opacity-0': !expanded }" class="text-gray-500 dark:text-gray-300 font-light">{{ item.source }}</div>
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
        <button @click.stop="toggle" class="px-2 h-6 dark:invert">
          <img :class="{ 'rotate-180': expanded }" src="~../assets/chevron-down.svg" width="16" height="16" class="transition-transform"/>
        </button>
      </div>
      <div :class="{ 'opacity-0': !expanded }" @click.stop class="col-span-12 transition-opacity">
        <div class="px-2 pb-2">
          <div class="flex justify-end space-x-2">
            <button @click="posting = !posting" class="btn-sm">Foto beitragen</button>
            <button @click="viewInMap" class="btn-sm">anzeigen</button>
          </div>
        </div>
      </div>
    </div>

    <transition @enter="slideOpen" @leave="slideClose">
      <div v-if="posting" data-overflow="hidden" class="bg-gray-400 dark:bg-gray-700">
        <div class="py-4 grid grid-cols-12 gap-4">
          <div class="col-span-5 col-start-4">
            <div>
              <media-upload :parent="item.post_id"/>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <transition @enter="slideOpen" @leave="slideClose">
      <div v-if="posts.length" data-overflow="hidden" class="bg-gray-400 dark:bg-gray-700">
        <div class="grid grid-cols-12 gap-4">
          <div class="col-span-5 col-start-4">
            <ul>
              <li v-for="upload in posts" :key="upload.id" class="bg-gray-400 text-black rounded-md my-4 overflow-hidden">
                <figure>
                  <app-image v-if="upload.acf?.thumbnail" :image="upload.acf?.thumbnail"/>
                  <figcaption>
                    <p class="text-lg m-2">{{ upload.post_title }}</p>
                    <div v-html="upload.post_content" class="html m-2 text-sm whitespace-pre-wrap"></div>
                  </figcaption>
                </figure>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </transition>

    <div :class="{ 'opacity-0': expanded }" class="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-500 h-1"></div>
  </div>
</template>

<script lang="ts">
  import type { MapMarker, Post } from '../store/types'
  import { defineComponent, ref, computed, watch, nextTick } from 'vue'
  import { useStore } from '../store'
  import { slideOpen, slideClose } from '../utils'
  import MediaUpload from './MediaUpload.vue'
  import AppImage from './AppImage.vue'
  import bus from '../eventBus'

  export default defineComponent({
    props: {
      item: Object
    },
    setup (props) {
      const item = props.item as MapMarker
      const parent = ref<HTMLElement|null>(null)
      const row = ref<HTMLElement|null>(null)

      const parentHeight = ref(0)
      const childHeight = ref(0)

      const expanded = ref(false)
      const viewInMap = () => {
        bus.emit('selectMarker', item.post_id) // handled in MarkerPanel.vue
      }

      const posting = ref(false)
      const rowStyle = computed(() => {
        if (!parentHeight.value) return

        let h = expanded.value ? childHeight.value : parentHeight.value

        if (posting.value || (expanded.value && marker.value)) {
          h += 1775 // :/
        }

        return { maxHeight: `${h}px` }
      })

      // fetch rendered heights
      watch(row, async (val) => {
        if (!val || !parent.value) return

        await nextTick()
        parentHeight.value = parent.value.getBoundingClientRect().height
        childHeight.value = val.getBoundingClientRect().height
      })

      const toggle = () => {
        expanded.value = !expanded.value
        if (!expanded.value) {
          posting.value = false
        }
      }

      const store = useStore()
      const marker = ref<Post|undefined>()
      const posts = computed(() => {
        if (!marker.value) return []
        return marker.value.acf?.uploads || []
      })
      watch(expanded, async (val) => {
        if (!val || marker.value || !item?.post_id) return

        marker.value = await store.getMarker(Number(item.post_id))
      })

      return {
        item,
        parent,
        row,
        parentHeight,
        childHeight,
        expanded,
        viewInMap,
        rowStyle,
        posting,
        slideOpen,
        slideClose,
        toggle,
        posts
      }
    },
    components: { MediaUpload, AppImage }
  })
</script>
