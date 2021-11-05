<template>
  <div class="w-full h-screen relative z-0">
    <div ref="mapEl" class="absolute inset-0 w-full h-full"></div>
  </div>

  <div v-if="uploadAt">
    <media-upload :latlng="uploadAt"/>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, Ref, onMounted } from 'vue'
  import L, { LeafletMouseEvent, Map, LatLng } from 'leaflet'
  import MediaUpload from './MediaUpload.vue'

  export default defineComponent({
    name: 'Map',
    setup () {
      const mapEl = ref(null)
      const endpoint = 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}{r}.png'
      const layer = L.tileLayer(endpoint, {
        attribution: '<a href="http://stamen.com">Stamen</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        subdomains: 'abcd',
        minZoom: 0,
        maxZoom: 20
      })
      const zoomControl = L.control.zoom({
        position: 'bottomright'
      })

      const uploadAt: Ref<null | LatLng> = ref(null)

      let map: Map;
      onMounted(() => {
        if (!mapEl.value) return

        const el = mapEl.value as HTMLElement

        map = L.map(el, {
          scrollWheelZoom: false,
          center: [48.1453673, 11.5655232],
          zoom: 13,
          zoomControl: false
        })
        layer.addTo(map)
        zoomControl.addTo(map)

        map.on('click', (e: LeafletMouseEvent) => {
          const latlng = e.latlng as L.LatLng
          // // TODO: open form component modal? (no popup)
          // L.popup().setLatLng(latlng)
          //   .setContent(`<p>Upload a file here?</p>`)
          //   .openOn(map)
          uploadAt.value = latlng
        })
      })

      return { mapEl, uploadAt }
    },
    components: { MediaUpload }
  })
</script>

<style>
  @import 'leaflet/dist/leaflet.css';
</style>
