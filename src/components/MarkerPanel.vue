<template>
  <div ref="panel" class="absolute top-0 right-0 bottom-0">
    <div class="absolute right-full mt-16 -mr-5">
      <button @click="close" class="btn round">
        <close-icon class="w-4.5 h-4.5 md:w-5 md:h-5"/>
      </button>
    </div>

    <div :class="panelWidth" class="h-full bg-gray-200 text-black px-4 py-18 md:px-8 overflow-y-auto overscroll-contain">
      <div v-if="gallery" class="flex space-x-8 overflow-auto">
        <figure v-for="img in gallery" :key="img.id" class="mb-4 flex-none">
          <app-image :image="img" class="h-screen max-h-markerimg w-auto"/>
        </figure>
      </div>

      <div class="max-w-prose-1">
        <p v-html="marker?.title.rendered" class="text-lg md:text-xl leading-snug"></p>
        <p class="text-sm md:text-base font-light mt-1 text-gray-600">{{ marker?.acf?.source }}</p>

        <div class="my-6 html">
          <div v-html="marker?.acf.description"></div>
        </div>

        <div class="flex space-x-8 my-6">
          <div v-if="marker?.acf.location?.address_new">
            <p><strong>Adresse Aktuell</strong></p>
            <p class="font-light">{{ marker?.acf.location?.address_new }}</p>
          </div>
          <div>
            <p><strong>Adresse</strong></p>
            <p class="font-light">{{ marker?.acf.location?.address }}</p>
          </div>
        </div>

        <div class="font-light">
          <p>{{ marker?.acf.num_people_cat_id }}</p>
          <p>Quelle: {{ marker?.acf?.source }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import type { Post } from '../store/types'
  import { defineComponent, ref, computed, onMounted, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useStore } from '../store'
  import { sleep } from '../utils'
  import AppImage from './AppImage.vue'
  import CloseIcon from './svg/CloseIcon.vue'
  import bus from '../eventBus'

  export default defineComponent({
    setup () {
      const route = useRoute()
      const router = useRouter()
      const postId = computed(() => route.query.marker)
      const store = useStore()

      const marker = ref<Post|undefined>()
      const gallery = computed(() => marker.value?.acf.gallery)

      const artistPost = computed(() => {
        return !!marker.value?.acf.foto_id
      })

      const panelWidth = computed(() => artistPost.value ? 'w-kontext' : 'w-meta')

      onMounted(() => {
        const id = Number(postId.value)
        onChange(id)
      })
      watch(postId, (newId) => {
        if (!newId) return
        const id = Number(newId)
        onChange(id)
      })

      const panel = ref<HTMLElement|null>(null)
      async function onChange (id: number) {
        marker.value = await store.getMarker(id)

        await sleep(250)
        panel.value?.scrollIntoView({
          block: 'center',
          behavior: 'smooth'
        })
      }

      const close = () => {
        router.push({ ...route, query: {} })
        bus.emit('closeMarkerPanel')
      }
      return { marker, gallery, close, panelWidth, panel }
    },
    components: { AppImage, CloseIcon }
  })
</script>
