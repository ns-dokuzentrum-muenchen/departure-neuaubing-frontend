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
  import type { Map as LMap, Marker, LeafletMouseEvent, MarkerOptions, LatLng, LatLngTuple } from 'leaflet'
  import L from 'leaflet'
  import { defineComponent, ref, onMounted, computed, watch, nextTick } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useStore } from '../store'
  import MediaUpload from './MediaUpload.vue'
  import bus from '../eventBus'

  const endpoint = 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}{r}.png'
  const attribution = '<a href="http://stamen.com">Stamen</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'

  const MUNICH: LatLngTuple = [48.1453673, 11.5655232]

  export default defineComponent({
    setup () {
      const store = useStore()
      const mapEl = ref(null)
      const layer = L.tileLayer(endpoint, {
        attribution,
        subdomains: 'abcd',
        minZoom: 0,
        maxZoom: 20
      })
      const zoomControl = L.control.zoom({
        position: 'bottomleft'
      })

      // user content (TODO)
      const uploadAt = ref<LatLng | null>(null)

      // content
      const markers = computed(() => {
        return store.markers
      })

      watch(markers, async () => {
        await nextTick()
        placeMarkers()
      })

      const zoom = ref(13)
      let map: LMap
      const markerGroup = L.layerGroup()

      const route = useRoute()
      const router = useRouter()

      onMounted(() => {
        if (!mapEl.value) return

        const el = mapEl.value as HTMLElement
        map = L.map(el, {
          scrollWheelZoom: false,
          center: MUNICH,
          zoom: 13,
          zoomControl: false,
          // touchZoom: true,
          dragging: !L.Browser.mobile,
          tap: !L.Browser.mobile
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

      const markerMap = new Map()

      function placeMarkers () {
        markerMap.clear()
        markerGroup.removeFrom(map)

        if (!markers.value.length) return

        markers.value.forEach((point: MapMarker) => {
          const lat = Number(point.location.lat)
          const lng = Number(point.location.lng)
          const isArtistMarker = point.from_artist

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
          const lMarker = L.marker([lat, lng], opts).addTo(markerGroup).on('click', (e: LeafletMouseEvent) => {
            const query = { ...route.query, marker: point.post_id }
            router.push({ path: route.path, query })
            select() // dim the others
            e.target.setOpacity(1.0)
            e.target.getElement?.().classList.add('focussed')

            const from = e.containerPoint?.x || e.target._icon?.getBoundingClientRect().left
            if (!from || L.Browser.mobile) return

            const to = calcPan(isArtistMarker)
            map.panBy([from - to, 0])
          })

          markerMap.set(point.post_id, lMarker)
        })

        markerGroup.addTo(map)
      }

      bus.on('closeMarkerPanel', deselect)
      bus.on('selectMarker', (which) => {
        const selected: Marker = markerMap.get(which)
        selected.fire('click')
      })

      function select () {
        markerGroup.eachLayer((mark) => {
          const el = (mark as Marker).setOpacity(0.4).getElement()
          el?.classList.remove('focussed')
        })
      }
      function deselect () {
        markerGroup.eachLayer((mark) => {
          const el = (mark as Marker).setOpacity(1.0).getElement()
          el?.classList.remove('focussed')
        })
        !L.Browser.mobile && map.panTo(MUNICH)
      }

      function calcPan (artist: boolean): number {
        const panelWidth = 16 * (artist ? 76 : 30)
        // const available = window.innerWidth - (artist ? 6 : 1.4) * 16
        return (window.innerWidth - panelWidth) / 2
      }

      return { mapEl, uploadAt, zoomClass }
    },
    components: { MediaUpload }
  })
</script>

<style>
  @import 'leaflet/dist/leaflet.css';
</style>
