<template>
  <div @click="close" class="fixed inset-0 flex items-center justify-center">
    <div class="bg-black text-white rounded-md z-20 max-w-lg">
      <div class="px-8 py-4">
        upload here {{ latlng.lat }}, {{ latlng.lng }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { LatLng } from 'leaflet'
  import { defineComponent, computed } from 'vue'

  export default defineComponent({
    name: 'MediaUpload',
    props: {
      latlng: Object
    },
    setup (props) {
      const latlng = computed(() => props.latlng as LatLng)

      const close = () => {
        console.log('close it')
      }

      return { latlng, close }
    }
  })
</script>
