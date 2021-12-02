<template>
  <div class="absolute top-0 right-0 bottom-0 w-meta bg-gray-200 p-4 md:p-8 overflow-y-auto">
    <div class="mb-4">
      <button @click="close" class="btn-sm">schließen &times;</button>
    </div>

    <p class="text-lg leading-snug">{{ marker?.title.rendered }}</p>
    <p class="text-sm mt-1 text-gray-600">{{ marker?.acf?.source }}</p>

    <div class="mt-8 html">
      <div v-html="marker?.acf.description"></div>
    </div>
  </div>
</template>

<script lang="ts">
  import { Post } from '../store/types'
  import { defineComponent, ref, computed, onMounted, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useStore } from '../store'

  export default defineComponent({
    setup () {
      const route = useRoute()
      const router = useRouter()
      const postId = computed(() => route.query.marker)
      const store = useStore()

      const marker = ref<Post|undefined>()

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
      return { marker, close }
    }
  })
</script>
