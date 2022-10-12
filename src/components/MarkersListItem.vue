<template>
  <div :class="{ 'bg-gray-200 dark:bg-gray-500': expanded }" ref="parent" class="border-b hover:bg-gray-200 dark:hover:bg-gray-500 transition-all overflow-hidden relative group">
    <div ref="row" @click="toggle" class="lg:grid grid-cols-12 gap-4 py-2 cursor-pointer">
      <div class="flex lg:contents">
        <div class="flex-auto lg:col-span-3 mx-2 lg:mx-0">
          {{ item.title }}
        </div>

        <div class="hidden lg:block col-span-4 overflow-clip">
          <div v-if="item.description" v-html="item.description" :class="{ 'line-clamp-2': truncated }" class="html mb-2"></div>
        </div>
        <div class="hidden lg:block col-span-1">
          <p :class="{ 'line-clamp-2': truncated }">{{ item.num_people_cat_id }}</p>
        </div>
        <div class="hidden lg:block col-span-3">
          <div>
            <p>{{ item.location.address }}</p>
            <p>{{ item.location.address_new }}</p>
          </div>
        </div>

        <div class="flex-none col-span-2 lg:col-span-1 flex justify-between items-start">
          <div :class="{ artist: item.from_artist }" class="list-dot text-xs">{{ item.id }}</div>
          <button @click.stop="toggle" class="px-2 h-6 dark:invert">
            <img :class="{ 'rotate-180': !truncated }" src="~../assets/chevron-down.svg" width="16" height="16" class="transition-transform"/>
          </button>
        </div>
      </div>

      <div v-if="!truncated" @click.stop class="w-full col-span-12 transition-opacity">
        <div class="lg:hidden mx-2">
          <div class="my-2">
            <div v-if="item.description" v-html="item.description" class="html mb-2 max-w-prose-1"></div>
          </div>
          <div class="mb-2 text-sm">
            <p>{{ item.location.address }}</p>
            <p>{{ item.location.address_new }}</p>
          </div>
          <div class="text-sm">
            <p>{{ item.num_people_cat_id }}</p>
          </div>
        </div>

        <div class="mt-4 lg:mt-0 px-2 pb-2">
          <div class="flex lg:justify-end space-x-2">
            <button v-if="locale === 'de'" @click="posting = !posting" class="btn-sm">Foto beitragen</button>
            <button @click="viewInMap" class="btn-sm">{{ lt('view') }}</button>
          </div>
        </div>
      </div>
    </div>

    <transition @enter="slideOpen" @leave="slideClose">
      <div v-if="posting" data-overflow="hidden" class="bg-gray-400 dark:bg-gray-700">
        <div class="py-4 lg:grid grid-cols-12 gap-4">
          <div class="col-span-5 col-start-4 px-4 lg:px-0">
            <div class="max-w-sm lg:max-w-none">
              <media-upload :parent="item.post_id"/>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <transition @enter="slideOpen" @leave="slideClose">
      <div v-if="posts.length && expanded" data-overflow="hidden" class="bg-gray-400 dark:bg-gray-700">
        <div class="lg:grid grid-cols-12 gap-4">
          <div class="col-start-4 col-span-5">
            <ul class="py-px px-4 lg:p-0">
              <li v-for="upload in posts" :key="upload.id" class="max-w-sm lg:max-w-none bg-gray-200 dark:bg-gray-400 text-black rounded-md my-4 overflow-hidden">
                <figure>
                  <app-image v-if="upload.acf?.thumbnail" :image="upload.acf?.thumbnail"/>
                  <figcaption>
                    <p class="text-lg m-2">{{ upload.post_title }}</p>
                    <div class="mx-2 -mt-2">
                      <span class="">{{ upload.author_name }}</span> |
                      <span class="font-light">{{ timeDate(upload.post_date) }}</span>
                    </div>
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
  import { format } from 'fecha'

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

      const timeDate = (postDate: string) => {
        const dateObj = new Date(postDate?.replace(' ', 'T'))
        const time = format(dateObj, 'H:mm')
        const date = format(dateObj, 'DD.MM.YYYY')

        return `${time} | ${date}`
      }

      return {
        lt: store.lt,
        locale: store.locale,
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
        posts,
        timeDate
      }
    },
    components: { MediaUpload, AppImage }
  })
</script>
