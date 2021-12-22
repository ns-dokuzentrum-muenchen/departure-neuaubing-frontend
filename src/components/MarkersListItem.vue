<template>
  <div :class="{ 'bg-gray-200 dark:bg-gray-500' : expanded }" ref="parent" class="border-b hover:bg-gray-200 dark:hover:bg-gray-500 transition-all overflow-clip relative group">
    <div ref="row" @click="toggle" class="grid grid-cols-12 gap-4 py-2 cursor-pointer">
      <div class="col-span-3">
        {{ item.title }}
      </div>
      <div class="col-span-4 transition-m-height overflow-clip">
        <div v-if="item.description" v-html="item.description" :class="{ 'line-clamp-2': truncated }" class="html mb-2"></div>
        <div v-if="item.source && !truncated" class="text-gray-500 dark:text-gray-300 font-light">{{ item.source }}</div>
      </div>
      <div class="col-span-1">
        <p :class="{ 'line-clamp-2': truncated }">{{ item.num_people_cat_id }}</p>
      </div>
      <div class="col-span-3">
        <p>{{ item.location.address }}</p>
        <p>{{ item.location.address_new }}</p>
      </div>
      <div class="col-span-1 flex justify-between items-start">
        <div :class="{ artist: item.from_artist }" class="list-dot text-xs">{{ item.id }}</div>
        <button @click.stop="toggle" class="px-2 h-6 dark:invert">
          <img :class="{ 'rotate-180': !truncated }" src="~../assets/chevron-down.svg" width="16" height="16" class="transition-transform"/>
        </button>
      </div>
      <div v-if="!truncated" @click.stop class="col-span-12 transition-opacity">
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
      <div v-if="posts.length && expanded" data-overflow="hidden" class="bg-gray-400 dark:bg-gray-700">
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

    <div :class="{ 'opacity-0': !truncated }" class="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-500 h-1"></div>
  </div>
</template>

<script lang="ts">
  import type { MapMarker, Post } from '../store/types'
  import { defineComponent, ref, computed, watch, nextTick, onMounted } from 'vue'
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

      const truncated = ref(true)
      const expanded = ref(false)
      const viewInMap = () => {
        bus.emit('selectMarker', item.post_id) // handled in MarkerPanel.vue
      }

      const posting = ref(false)

      // fetch rendered heights
      watch(row, async (val) => {
        if (!val || !parent.value) return

        await nextTick()
        parentHeight.value = parent.value.getBoundingClientRect().height
        childHeight.value = val.getBoundingClientRect().height
      })

      const toggle = () => {
        if (!parent.value || !row.value) return

        if (!expanded.value) {
          truncated.value = false
          expand(parent.value, row.value)
        } else {
          expanded.value = false
          contract(parent.value)
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

      onMounted(async () => {
        await nextTick() // makes sure components are here
        if (!parent.value) return

        parentHeight.value = parent.value.offsetHeight
      })

      const duration = 250
      async function expand (el: HTMLElement, child: HTMLElement) {
        await nextTick()
        const from = `${parentHeight.value}px`
        const to = `${child.offsetHeight}px`

        const anim = el.animate({
          height: [from, to]
        }, { duration, easing: 'ease-out' })
        anim.onfinish = () => {
          expanded.value = true
        }
      }

      async function contract (el: HTMLElement) {
        await nextTick()
        const from = `${el.offsetHeight}px`
        const to = `${parentHeight.value}px`

        posting.value = false
        const anim = el.animate({
          height: [from, to]
        }, { duration, easing: 'ease-out' })
        anim.onfinish = () => {
          truncated.value = true
        }
      }

      return {
        item,
        parent,
        row,
        parentHeight,
        childHeight,
        truncated,
        expanded,
        viewInMap,
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
