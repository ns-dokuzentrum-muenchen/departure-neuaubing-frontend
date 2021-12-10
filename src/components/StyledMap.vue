<template>
  <div :class="zoomClass" class="w-full h-screen relative z-0">
    <div ref="mapEl" class="absolute inset-0 w-full h-full the-map"></div>
  </div>

  <div v-if="uploadAt">
    <media-upload :latlng="uploadAt" @close="uploadAt = null"/>
  </div>
</template>

<script lang="ts">
  import type { MapMarker } from '../store/types'
  import type { LeafletMouseEvent } from 'leaflet'
  import { defineComponent, ref, onMounted, computed, watch, nextTick } from 'vue'
  import L, { Map, LatLng, MarkerOptions, Marker } from 'leaflet'
  import { useStore } from '../store'
  import { useRoute, useRouter } from 'vue-router'
  import MediaUpload from './MediaUpload.vue'
  import bus from '../eventBus'

  export default defineComponent({
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

      // user content (TODO)
      const uploadAt = ref<LatLng | null>(null)

      // content
      const markers = computed(() => {
        return store.markers // .filter(m => m.from_artist)
      })

      watch(markers, async () => {
        await nextTick()
        placeMarkers()
      })

      const zoom = ref(13)
      let map: Map;
      const markerGroup = L.layerGroup()

      const route = useRoute()
      const router = useRouter()

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

        // when 'upload' enabled?
        // map.on('click', (e: LeafletMouseEvent) => {
        //   const latlng = e.latlng as L.LatLng
        //   uploadAt.value = latlng // opens form modal
        // })

        map.on('zoom', () => {
          zoom.value = map.getZoom()
        })

        placeMarkers()
      })

      const zoomClass = computed(() => {
        const z = zoom.value
        if (z > 13) return 'zoom-near'
        if (z > 11) return 'zoom-mid'
        return 'zoom-far'
      })

      function placeMarkers () {
        markerGroup.removeFrom(map)

        if (!markers.value.length) return

        markers.value.forEach((point: MapMarker) => {
          const lat = Number(point.location.lat)
          const lng = Number(point.location.lng)
          const opts: MarkerOptions = {
            icon: new L.DivIcon({
              className: 'marker-dot text-2xs',
              html: `<div class="w-full h-full${point.from_artist ? ' artist' : ''}"><span class="">${point.id}</span></div>`,
              iconSize: [24, 24],
              iconAnchor: [12, 12]
            }),
            title: point.title,
            riseOnHover: true,
            zIndexOffset: point.from_artist ? 100 : 0
          }
          L.marker([lat, lng], opts).addTo(markerGroup).on('click', (e: LeafletMouseEvent) => {
            router.push({ ...route, query: { marker: point.post_id } })
            select() // dim the others
            e.target.setOpacity(1.0)
            // calc pan
            const where = e.containerPoint?.x
            map.panBy([where - 160, 0])
          })
        })

        markerGroup.addTo(map)
      }

      bus.on('closeMarkerPanel', deselect)

      function select () {
        markerGroup.eachLayer((mark) => {
          (mark as Marker).setOpacity(0.4)
        })
      }
      function deselect () {
        markerGroup.eachLayer((mark) => {
          (mark as Marker).setOpacity(1.0)
        })
      }

      return { mapEl, uploadAt, zoomClass }
    },
    components: { MediaUpload }
  })
</script>

<style>
  @import 'leaflet/dist/leaflet.css';
</style>
