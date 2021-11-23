<template>
  <div class="w-screen h-screen sticky top-0 z-1 -mb-vh">
    <app-image :image="image" class="w-full h-full object-cover"/>
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

      return { image }
    },
    components: { AppImage }
  })
</script>
