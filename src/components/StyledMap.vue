<template>
  <div class="w-full h-screen relative z-0">
    <div ref="mapEl" class="absolute inset-0 w-full h-full"></div>
  </div>

  <div v-if="uploadAt">
    <media-upload :latlng="uploadAt" @close="uploadAt = null"/>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, onMounted, computed, watch } from 'vue'
  import L, { LeafletMouseEvent, Map, LatLng, MarkerOptions } from 'leaflet'
  import { useStore } from '../store'
  import MediaUpload from './MediaUpload.vue'

  export default defineComponent({
    name: 'Map',
    setup () {
      const store = useStore()
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

      const uploadAt = ref<LatLng | null>(null)

      let map: Map;
      onMounted(() => {
        if (!mapEl.value) return

        // store.getMarkers()

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
          uploadAt.value = latlng // opens form modal
        })
      })

      // content
      const markers = computed(() => {
        return store.markers // .filter(m => m.from_artist)
      })

      // TODO add the markers to the map, listen to changes
      watch(markers, (list) => {
        list.forEach((point) => {
          const lat = Number(point.location.lat)
          const lng = Number(point.location.lng)
          const opts: MarkerOptions = {
            icon: new L.DivIcon({
              className: `marker-dot text-2xs${point.from_artist ? ' artist' : ''}`,
              html: `<span class="">${point.id}</span>`,
              iconSize: [24, 24],
              iconAnchor: [12, 12]
            }),
            title: point.title,
            riseOnHover: true
          }
          L.marker([lat, lng], opts).addTo(map)
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
