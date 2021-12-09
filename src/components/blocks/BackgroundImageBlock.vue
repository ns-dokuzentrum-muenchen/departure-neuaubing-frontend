<template>
  <div class="w-screen h-screen sticky top-0 z-1 -mb-vh">
    <app-image :image="image" class="w-full h-full object-cover"/>

    <app-image v-if="layer" :image="layer" :width="image.width" :height="image.height" class="absolute inset-0 object-cover h-full z-10"/>
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
      const image = computed(() => props.block?.image)
      const layer = computed(() => props.block?.layer)

      return { image, layer }
    },
    components: { AppImage }
  })
</script>
