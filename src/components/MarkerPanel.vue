<template>
  <div class="absolute top-0 right-0 bottom-0">
    <div class="absolute right-full mt-6 -mr-5">
      <button @click="close" class="btn round">
        <close-icon class="w-4.5 h-4.5 md:w-5 md:h-5"/>
      </button>
    </div>

    <div class="w-meta min-h-full bg-gray-200 p-4 md:p-8 overflow-y-auto">
      <div v-if="gallery">
        <figure v-for="img in gallery" :key="img.id" class="my-4">
          <app-image :image="img"/>
        </figure>
      </div>

      <p v-html="marker?.title.rendered" class="text-lg leading-snug"></p>
      <p class="text-sm mt-1 text-gray-600">{{ marker?.acf?.source }}</p>

      <div class="mt-8 html">
        <div v-html="marker?.acf.description"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import type { Post } from '../store/types'
  import { defineComponent, ref, computed, onMounted, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useStore } from '../store'
  import AppImage from './AppImage.vue'
  import CloseIcon from './svg/CloseIcon.vue'

  export default defineComponent({
    setup () {
      const route = useRoute()
      const router = useRouter()
      const postId = computed(() => route.query.marker)
      const store = useStore()

      const marker = ref<Post|undefined>()
      const gallery = computed(() => marker.value?.acf.gallery)

      onMounted(() => {
        const id = Number(postId.value)
        onChange(id)
      })
      watch(postId, (newId) => {
        if (!newId) return
        const id = Number(newId)
        onChange(id)
      })

      async function onChange (id: number) {
        marker.value = await store.getMarker(id)
      }

      const close = () => {
        router.push({ ...route, query: {} })
      }
      return { marker, gallery, close }
    },
    components: { AppImage, CloseIcon }
  })
</script>
