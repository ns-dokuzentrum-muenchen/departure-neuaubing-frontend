<template>
  <div :class="{ sticky }" class="w-screen h-screen top-0 z-1 -mb-vh bg-bg">
    <app-image v-if="image" :image="image" class="w-full h-full object-cover"/>
    <app-image v-if="layer" :image="layer" :width="image.width" :height="image.height" class="absolute inset-0 object-cover h-full z-10"/>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  import AppImage from '../AppImage.vue'

  export default defineComponent({
    props: {
      block: Object,
      slug: String
    },
    setup (props) {
      // const image = props.block?.image
      // const layer = props.block?.layer
      // const sticky = props.block?.sticky

      return {
        image: props.block?.image,
        layer: props.block?.layer,
        sticky: props.block?.sticky
      }
    },
    components: { AppImage }
  })
</script>
